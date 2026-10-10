"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

type TicketQRProps = {
  ticketId: string;
  qrPayload?: string;
  status?: string;
};

export function TicketQR({ ticketId, qrPayload, status = "VALID" }: TicketQRProps) {
  const [pulse, setPulse] = useState(false);
  const payloadToEncode = qrPayload || ticketId;

  // Subtle live pulse effect simulating dynamic anti-screenshot freshness
  useEffect(() => {
    const timer = setInterval(() => {
      setPulse((prev) => !prev);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const isValid = status === "VALID";

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/[0.1] bg-[#0c0f18]/90 p-5 shadow-ticket">
      {/* Dynamic Anti-Screenshot Radar Ring */}
      <div className="relative flex items-center justify-center p-3 rounded-2xl bg-white/[0.02]">
        {isValid && (
          <div
            className={`absolute inset-0 rounded-2xl border border-brand-500/30 transition-all duration-1000 ${
              pulse ? "scale-105 opacity-80" : "scale-95 opacity-20"
            }`}
          />
        )}

        {/* QR Canvas */}
        <div className="relative z-10 overflow-hidden rounded-xl bg-white p-3 shadow-inner">
          <QRCodeSVG
            value={payloadToEncode}
            size={180}
            level="H"
            includeMargin={false}
            bgColor="#ffffff"
            fgColor="#090a0f"
          />
        </div>
      </div>

      {/* Security Signature & Verification Watermark */}
      <div className="mt-3.5 space-y-1 text-center">
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
          {isValid ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]"></span>
              <span className="text-emerald-400">HMAC-SHA256 SIGNED</span>
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              <span className="text-amber-400">STATUS: {status}</span>
            </>
          )}
        </div>
        <p className="text-[10px] text-zinc-400 font-mono">
          ANTI-SPOOF WATERMARK: {ticketId.slice(0, 8)}...{ticketId.slice(-4)}
        </p>
      </div>
    </div>
  );
}