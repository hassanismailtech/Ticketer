"use client";

import { QRCodeSVG } from "qrcode.react";

type TicketQRProps = {
  ticketId: string;
};

export function TicketQR({ ticketId }: TicketQRProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
      <QRCodeSVG value={ticketId} size={192} level="M" includeMargin />
    </div>
  );
}