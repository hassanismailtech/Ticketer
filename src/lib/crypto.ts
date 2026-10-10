import crypto from "crypto";

const SECRET_KEY = process.env.TICKET_SECRET_KEY || "ticketer-unicorn-secret-key-super-resilient-2026";

export interface TicketPayload {
  ticketId: string;
  eventId: string;
  tierId: string;
  email: string;
  issuedAt: number;
}

/**
 * Generate an HMAC-SHA256 signature for a ticket
 */
export function signTicket(payload: TicketPayload): string {
  const data = `${payload.ticketId}:${payload.eventId}:${payload.tierId}:${payload.email}:${payload.issuedAt}`;
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(data);
  return hmac.digest("hex").slice(0, 32); // 32-char hex token
}

/**
 * Format a high-security QR code string:
 * Format: TK1.<ticketId>.<issuedAt>.<signature>
 */
export function generateQrPayload(payload: TicketPayload): string {
  const signature = signTicket(payload);
  return `TK1.${payload.ticketId}.${payload.issuedAt}.${signature}`;
}

/**
 * Validate and verify a scanned QR code payload
 */
export function verifyQrPayload(qrString: string, expectedPayload: Omit<TicketPayload, "issuedAt">): {
  valid: boolean;
  ticketId?: string;
  issuedAt?: number;
  reason?: string;
} {
  if (!qrString.startsWith("TK1.")) {
    // Fallback for legacy UUID strings
    if (/^[0-9a-f-]{36}$/i.test(qrString)) {
      return {
        valid: true,
        ticketId: qrString,
        reason: "Legacy ticket format",
      };
    }
    return { valid: false, reason: "Invalid ticket QR format" };
  }

  const parts = qrString.split(".");
  if (parts.length !== 4) {
    return { valid: false, reason: "Malformed ticket token structure" };
  }

  const [, scannedTicketId, issuedAtStr, signature] = parts;
  const issuedAt = parseInt(issuedAtStr, 10);

  if (isNaN(issuedAt)) {
    return { valid: false, reason: "Invalid timestamp in token" };
  }

  // Ensure scanned ticket matches expected ticket ID
  if (expectedPayload.ticketId && scannedTicketId !== expectedPayload.ticketId) {
    return {
      valid: false,
      ticketId: scannedTicketId,
      reason: "Cryptographic ticket ID mismatch (token tampered with)",
    };
  }

  // Validate HMAC signature matches the scanned token
  const expectedSignature = signTicket({
    ticketId: scannedTicketId,
    eventId: expectedPayload.eventId,
    tierId: expectedPayload.tierId,
    email: expectedPayload.email,
    issuedAt,
  });

  const sigBuffer = Buffer.from(signature);
  const expectedSigBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedSigBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)) {
    return { valid: false, ticketId: scannedTicketId, reason: "Cryptographic signature mismatch (counterfeit ticket)" };
  }

  return { valid: true, ticketId: scannedTicketId, issuedAt };
}
