import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyQrPayload } from "@/lib/crypto";

// Fallback in-memory ticket store
declare global {
  var inMemoryTickets: Map<string, any> | undefined;
  var checkInScanLogs: any[] | undefined;
}

if (!globalThis.inMemoryTickets) {
  globalThis.inMemoryTickets = new Map();
}

if (!globalThis.checkInScanLogs) {
  globalThis.checkInScanLogs = [];
}

export async function POST(request: Request) {
  try {
    const { scannedPayload, operator = "Gate 1 Main Turnstile" } = await request.json();

    if (!scannedPayload || typeof scannedPayload !== "string") {
      return NextResponse.json({ status: "INVALID", message: "Empty or invalid scan payload." }, { status: 400 });
    }

    const trimmed = scannedPayload.trim();
    let ticketId = trimmed;

    // Parse TK1 token if present
    if (trimmed.startsWith("TK1.")) {
      const parts = trimmed.split(".");
      if (parts.length >= 2) {
        ticketId = parts[1];
      }
    }

    // 1. Look up in memory cache first
    let ticket = globalThis.inMemoryTickets?.get(ticketId);

    // 2. Look up in Prisma database if not in memory
    if (!ticket && process.env.DATABASE_URL) {
      try {
        const dbTicket = await prisma.ticket.findUnique({
          where: { ticketId },
        });
        if (dbTicket) {
          ticket = {
            ticketId: dbTicket.ticketId,
            firstName: dbTicket.firstName,
            lastName: dbTicket.lastName,
            emailAddress: dbTicket.emailAddress,
            eventName: dbTicket.eventName,
            eventDate: dbTicket.eventDate,
            eventTime: dbTicket.eventTime,
            eventLocation: dbTicket.eventLocation,
            tierName: "General Admission",
            status: "VALID",
            createdAt: dbTicket.createdAt,
          };
          globalThis.inMemoryTickets?.set(ticketId, ticket);
        }
      } catch (err) {
        console.warn("DB lookup error during check-in:", err);
      }
    }

    if (!ticket) {
      const logEntry = {
        id: crypto.randomUUID(),
        ticketId,
        operator,
        result: "INVALID",
        timestamp: new Date().toISOString(),
        message: "Ticket not found in register",
      };
      globalThis.checkInScanLogs?.unshift(logEntry);

      return NextResponse.json(
        {
          status: "INVALID",
          message: "Unrecognized ticket pass. Please direct attendee to Help Desk.",
          log: logEntry,
        },
        { status: 404 }
      );
    }

    // Check if already checked in
    if (ticket.status === "CHECKED_IN") {
      const logEntry = {
        id: crypto.randomUUID(),
        ticketId: ticket.ticketId,
        attendeeName: `${ticket.firstName} ${ticket.lastName}`,
        tierName: ticket.tierName || "General Admission",
        operator,
        result: "ALREADY_CHECKED_IN",
        originalCheckInAt: ticket.checkedInAt,
        timestamp: new Date().toISOString(),
        message: "Double entry blocked! Ticket was already redeemed.",
      };
      globalThis.checkInScanLogs?.unshift(logEntry);

      return NextResponse.json({
        status: "ALREADY_CHECKED_IN",
        message: `Pass was already redeemed on ${new Date(ticket.checkedInAt).toLocaleTimeString()}`,
        ticket,
        log: logEntry,
      });
    }

    // Valid ticket: Grant access!
    const checkInTime = new Date().toISOString();
    ticket.status = "CHECKED_IN";
    ticket.checkedInAt = checkInTime;
    ticket.checkedInBy = operator;

    globalThis.inMemoryTickets?.set(ticket.ticketId, ticket);

    const logEntry = {
      id: crypto.randomUUID(),
      ticketId: ticket.ticketId,
      attendeeName: `${ticket.firstName} ${ticket.lastName}`,
      tierName: ticket.tierName || "General Admission",
      operator,
      result: "GRANTED",
      timestamp: checkInTime,
      message: "Access Granted",
    };
    globalThis.checkInScanLogs?.unshift(logEntry);

    return NextResponse.json({
      status: "GRANTED",
      message: "Access Granted. Welcome to the event!",
      ticket: {
        ticketId: ticket.ticketId,
        attendeeName: `${ticket.firstName} ${ticket.lastName}`,
        email: ticket.emailAddress,
        tierName: ticket.tierName || "General Admission",
        eventName: ticket.eventName,
        checkedInAt: checkInTime,
      },
      log: logEntry,
    });
  } catch (error) {
    console.error("Check-in scan exception:", error);
    return NextResponse.json(
      { status: "ERROR", message: "Server error during check-in processing." },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Returns recent check-in scan stream and statistics
  const logs = globalThis.checkInScanLogs?.slice(0, 50) || [];
  const totalScans = globalThis.checkInScanLogs?.length || 0;
  const granted = globalThis.checkInScanLogs?.filter((l) => l.result === "GRANTED").length || 0;
  const duplicates = globalThis.checkInScanLogs?.filter((l) => l.result === "ALREADY_CHECKED_IN").length || 0;
  const invalid = globalThis.checkInScanLogs?.filter((l) => l.result === "INVALID").length || 0;

  return NextResponse.json({
    logs,
    stats: {
      totalScans,
      granted,
      duplicates,
      invalid,
    },
  });
}
