import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { events } from "@/lib/utils";

const registrationSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  emailAddress: z.string().trim().email(),
  eventId: z.string().trim().min(1),
  eventName: z.string().trim().min(1),
  eventDate: z.string().trim().min(1),
  eventTime: z.string().trim().min(1),
  eventLocation: z.string().trim().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid registration data." }, { status: 400 });
    }

    const event = events.find((item) => item.id === parsed.data.eventId);

    if (!event) {
      return NextResponse.json({ message: "Event not found." }, { status: 400 });
    }

    const ticketId = crypto.randomUUID();

    const ticket = await prisma.ticket.create({
      data: {
        ticketId,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        emailAddress: parsed.data.emailAddress,
        eventId: event.id,
        eventName: event.name,
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.location,
      },
    });

    return NextResponse.json({ ticketId: ticket.ticketId }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Unable to complete registration." }, { status: 500 });
  }
}