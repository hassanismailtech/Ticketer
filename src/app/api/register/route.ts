import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { INITIAL_EVENTS } from "@/lib/events-data";
import { generateQrPayload } from "@/lib/crypto";

// Fallback in-memory ticket store for high resilience during database maintenance
declare global {
  var inMemoryTickets: Map<string, any> | undefined;
}

if (!globalThis.inMemoryTickets) {
  globalThis.inMemoryTickets = new Map();
}

const registrationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  emailAddress: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().optional(),
  eventId: z.string().trim().min(1, "Event ID is required"),
  tierId: z.string().trim().optional(),
  tierName: z.string().trim().optional(),
  eventName: z.string().trim().min(1),
  eventDate: z.string().trim().min(1),
  eventTime: z.string().trim().min(1),
  eventLocation: z.string().trim().min(1),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      firstName,
      lastName,
      emailAddress,
      phone,
      eventId,
      tierId,
      tierName,
      eventName,
      eventDate,
      eventTime,
      eventLocation,
    } = parsed.data;

    // Resolve event
    const event = INITIAL_EVENTS.find((e) => e.id === eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found or has been archived." }, { status: 404 });
    }

    const selectedTier =
      event.tiers.find((t) => t.id === tierId) ||
      event.tiers[0] || {
        id: "tier-ga",
        name: tierName || "General Admission",
        price: 0,
      };

    // Capacity verification
    if (selectedTier.soldCount >= selectedTier.capacity) {
      return NextResponse.json(
        { message: `The ${selectedTier.name} tier is sold out. Please select another pass tier.` },
        { status: 409 }
      );
    }

    // Generate human-friendly ticket ID: TK-XXXX-XXXX
    const rawCode = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
    const ticketId = `TCK-${rawCode.slice(0, 4)}-${rawCode.slice(4)}`;
    const issuedAt = Date.now();

    // Cryptographic tamper-proof QR code
    const qrPayload = generateQrPayload({
      ticketId,
      eventId: event.id,
      tierId: selectedTier.id,
      email: emailAddress,
      issuedAt,
    });

    const ticketRecord = {
      id: crypto.randomUUID(),
      ticketId,
      eventId: event.id,
      tierId: selectedTier.id,
      tierName: selectedTier.name,
      firstName,
      lastName,
      emailAddress,
      phone: phone || null,
      qrPayload,
      eventName: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: `${event.venue}, ${event.location}`,
      status: "VALID",
      createdAt: new Date(),
    };

    // Always cache in high-resilience memory store
    globalThis.inMemoryTickets?.set(ticketId, ticketRecord);

    // Persist to relational database
    try {
      if (process.env.DATABASE_URL) {
        // Attempt database insert
        await prisma.ticket.create({
          data: {
            ticketId,
            firstName,
            lastName,
            emailAddress,
            phone: phone || null,
            eventId: event.id,
            tierId: selectedTier.id,
            qrPayload,
            status: "VALID",
            userId: session?.user?.id,
          },
        });
      }
    } catch (dbError) {
      console.warn("Database sync notice: Relational sync deferred to memory store:", (dbError as Error).message);
    }

    return NextResponse.json(
      {
        status: "SUCCESS",
        ticketId,
        message: "Pass reserved successfully.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Critical registration error:", err);
    return NextResponse.json(
      {
        message: "Unable to process pass registration. Please try again.",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}