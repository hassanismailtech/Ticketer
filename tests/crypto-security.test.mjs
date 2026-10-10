import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

const SECRET_KEY = "test-secret-key-for-unit-tests-2026";

function signTicket(payload) {
  const data = `${payload.ticketId}:${payload.eventId}:${payload.tierId}:${payload.email}:${payload.issuedAt}`;
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(data);
  return hmac.digest("hex").slice(0, 32);
}

function generateQrPayload(payload) {
  const signature = signTicket(payload);
  return `TK1.${payload.ticketId}.${payload.issuedAt}.${signature}`;
}

function verifyQrPayload(qrString, expectedPayload) {
  if (!qrString.startsWith("TK1.")) {
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

  if (expectedPayload.ticketId && scannedTicketId !== expectedPayload.ticketId) {
    return {
      valid: false,
      ticketId: scannedTicketId,
      reason: "Cryptographic ticket ID mismatch (token tampered with)",
    };
  }

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

test("Cryptographic Suite: should generate valid HMAC signed QR payload", () => {
  const payload = {
    ticketId: "TCK-VIP-9941",
    eventId: "synapse-ai-summit-2026",
    tierId: "tier-synapse-vip",
    email: "sarah.connor@cyberdyne.ai",
    issuedAt: 1791628100,
  };

  const qr = generateQrPayload(payload);
  assert.ok(qr.startsWith("TK1.TCK-VIP-9941.1791628100."));

  const verification = verifyQrPayload(qr, payload);
  assert.strictEqual(verification.valid, true);
  assert.strictEqual(verification.ticketId, "TCK-VIP-9941");
});

test("Cryptographic Suite: should REJECT tampered or counterfeit ticket tokens", () => {
  const payload = {
    ticketId: "TCK-VIP-9941",
    eventId: "synapse-ai-summit-2026",
    tierId: "tier-synapse-vip",
    email: "sarah.connor@cyberdyne.ai",
    issuedAt: 1791628100,
  };

  const qr = generateQrPayload(payload);

  // Attacker tampers with the ticket ID in the QR string
  const forgedQr = qr.replace("TCK-VIP-9941", "TCK-FORGED-9999");
  const verification = verifyQrPayload(forgedQr, payload);

  assert.strictEqual(verification.valid, false);
  assert.match(verification.reason, /tampered with|mismatch/i);
});

test("Cryptographic Suite: should reject malformed payload tokens", () => {
  const verification = verifyQrPayload("random-unrelated-string", {});
  assert.strictEqual(verification.valid, false);
  assert.strictEqual(verification.reason, "Invalid ticket QR format");
});
