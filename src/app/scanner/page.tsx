"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type ScanResult = {
  status: "GRANTED" | "ALREADY_CHECKED_IN" | "INVALID" | "ERROR";
  message: string;
  ticket?: {
    ticketId: string;
    attendeeName: string;
    email: string;
    tierName: string;
    eventName: string;
    checkedInAt?: string;
  };
  log?: any;
};

export default function GatekeeperScannerPage() {
  const [manualInput, setManualInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio API for feedback chimes
  const playSound = (type: "GRANTED" | "DENIED") => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "GRANTED") {
        // High upbeat two-tone chime
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        // Low double-buzz
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {
      // Audio fallback silent
    }
  };

  // Fetch recent scan logs
  const refreshLogs = async () => {
    try {
      const res = await fetch("/api/check-in");
      if (res.ok) {
        const data = await res.json();
        setRecentLogs(data.logs || []);
      }
    } catch {
      // Silent catch
    }
  };

  useEffect(() => {
    refreshLogs();
    const interval = setInterval(refreshLogs, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handle camera video stream
  const toggleCamera = async () => {
    if (cameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
      } catch (err) {
        alert("Camera access was not permitted or is unavailable on this device. Use manual code entry below.");
      }
    }
  };

  const handleVerify = async (codeToVerify: string) => {
    if (!codeToVerify.trim()) return;
    setIsScanning(true);

    try {
      const response = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scannedPayload: codeToVerify.trim(),
          operator: "Gate 1 Main Turnstile",
        }),
      });

      const data = (await response.json()) as ScanResult;
      setLastResult(data);

      if (data.status === "GRANTED") {
        playSound("GRANTED");
        // Trigger mobile haptic vibration if supported
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      } else {
        playSound("DENIED");
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([300]);
        }
      }

      setManualInput("");
      refreshLogs();
    } catch {
      setLastResult({
        status: "ERROR",
        message: "Failed to connect to check-in gatekeeper service.",
      });
      playSound("DENIED");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              GATEKEEPER TURNSTILE TERMINAL
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Live Ticket Scanner & Check-In
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time anti-counterfeiting verification with double-entry fraud prevention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.08]"
          >
            {soundEnabled ? "🔊 Sound FX On" : "🔇 Sound FX Off"}
          </button>
          <Link
            href="/admin"
            className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/[0.08]"
          >
            Organizer Dashboard →
          </Link>
        </div>
      </div>

      {/* Main Scanner Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Left: Scanner & Input Deck */}
        <div className="space-y-6">
          {/* Camera Viewfinder */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0c0f18] p-5 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Turnstile Camera Scanner
              </span>
              <button
                type="button"
                onClick={toggleCamera}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  cameraActive
                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                    : "bg-brand-600 text-white shadow-glow"
                }`}
              >
                {cameraActive ? "Turn Camera Off" : "📷 Start Camera Scan"}
              </button>
            </div>

            <div className="relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-black/50">
              <video
                ref={videoRef}
                playsInline
                muted
                className={`h-full w-full object-cover ${cameraActive ? "block" : "hidden"}`}
              />

              {!cameraActive && (
                <div className="flex flex-col items-center text-center p-6 space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-brand-400">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-white">Optical QR Scanner Standby</p>
                  <p className="text-[11px] text-zinc-400 max-w-xs">
                    Tap &quot;Start Camera Scan&quot; to point camera at attendee passes, or type/simulate ticket codes below.
                  </p>
                </div>
              )}

              {cameraActive && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-44 w-44 rounded-2xl border-2 border-brand-400/80 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                    <div className="h-1 w-full bg-brand-400 animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Manual Input & Simulation Controls */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0f18]/80 p-5 backdrop-blur-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
              Passcode Entry / Barcode Gun Input
            </span>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerify(manualInput);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Scan or enter code: e.g. TCK-ABCD-1234 or TK1..."
                className="flex-1 rounded-xl border border-white/[0.1] bg-black/50 px-3.5 py-2.5 text-xs font-mono text-white placeholder-zinc-500 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={isScanning || !manualInput.trim()}
                className="rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet px-5 py-2.5 text-xs font-bold text-white shadow-glow transition hover:opacity-95 disabled:opacity-50"
              >
                {isScanning ? "Verifying..." : "Verify Pass"}
              </button>
            </form>

            {/* Quick Simulation Buttons */}
            <div className="border-t border-white/[0.06] pt-3 space-y-2">
              <span className="text-[11px] font-semibold text-zinc-400 block">
                Quick Simulation Tests:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleVerify("TCK-VIP-DEMO-2026")}
                  className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-900/50"
                >
                  🟢 Test VIP Pass
                </button>
                <button
                  type="button"
                  onClick={() => handleVerify("TCK-INVALID-FAKE-CODE")}
                  className="rounded-lg border border-red-500/30 bg-red-950/30 px-2.5 py-1.5 text-[11px] font-semibold text-red-300 hover:bg-red-900/50"
                >
                  🔴 Test Forged Pass
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-time Result Screen & Turnstile Feedback */}
        <div className="space-y-6">
          {/* Visual Feedback Display */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0f18]/80 p-5 backdrop-blur-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3 block">
              Gatekeeper Verification Screen
            </span>

            {lastResult ? (
              <div
                className={`rounded-2xl border p-6 text-center space-y-4 transition duration-300 ${
                  lastResult.status === "GRANTED"
                    ? "border-emerald-500/40 bg-emerald-950/20 shadow-glow-emerald"
                    : lastResult.status === "ALREADY_CHECKED_IN"
                    ? "border-amber-500/40 bg-amber-950/20 shadow-soft"
                    : "border-red-500/40 bg-red-950/20 shadow-soft"
                }`}
              >
                <div className="flex justify-center">
                  {lastResult.status === "GRANTED" && (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-3xl shadow-[0_0_20px_#10b981]">
                      ✓
                    </div>
                  )}
                  {lastResult.status === "ALREADY_CHECKED_IN" && (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-3xl">
                      ⚠
                    </div>
                  )}
                  {lastResult.status === "INVALID" && (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-400 text-3xl">
                      ✕
                    </div>
                  )}
                </div>

                <div>
                  <h2
                    className={`text-2xl font-black tracking-tight ${
                      lastResult.status === "GRANTED"
                        ? "text-emerald-300"
                        : lastResult.status === "ALREADY_CHECKED_IN"
                        ? "text-amber-300"
                        : "text-red-300"
                    }`}
                  >
                    {lastResult.status === "GRANTED" && "ACCESS GRANTED"}
                    {lastResult.status === "ALREADY_CHECKED_IN" && "ALREADY REDEEMED"}
                    {lastResult.status === "INVALID" && "ACCESS DENIED"}
                  </h2>
                  <p className="mt-1 text-xs text-zinc-300 font-medium">{lastResult.message}</p>
                </div>

                {lastResult.ticket && (
                  <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-left space-y-2 text-xs">
                    <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                      <span className="text-zinc-400">Attendee:</span>
                      <span className="font-bold text-white">{lastResult.ticket.attendeeName}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                      <span className="text-zinc-400">Pass Tier:</span>
                      <span className="font-bold text-brand-300">{lastResult.ticket.tierName}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                      <span className="text-zinc-400">Ticket Reference:</span>
                      <span className="font-mono text-zinc-200">{lastResult.ticket.ticketId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Event:</span>
                      <span className="font-medium text-zinc-300 truncate max-w-[200px]">{lastResult.ticket.eventName}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-10 text-center text-zinc-400">
                <span className="text-3xl mb-2">⚡</span>
                <p className="text-xs font-bold text-white">Awaiting Gate Scan</p>
                <p className="text-[11px] text-zinc-400">Point scanner at attendee pass to verify admission.</p>
              </div>
            )}
          </div>

          {/* Live Scan Log Stream */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0f18]/80 p-5 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Turnstile Audit Stream
              </span>
              <span className="text-[11px] text-zinc-400">{recentLogs.length} Scans Today</span>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {recentLogs.length > 0 ? (
                recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-black/40 p-2.5 text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          log.result === "GRANTED"
                            ? "bg-emerald-400"
                            : log.result === "ALREADY_CHECKED_IN"
                            ? "bg-amber-400"
                            : "bg-red-400"
                        }`}
                      />
                      <span className="font-mono text-zinc-300">{log.ticketId}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${
                          log.result === "GRANTED"
                            ? "text-emerald-400"
                            : log.result === "ALREADY_CHECKED_IN"
                            ? "text-amber-400"
                            : "text-red-400"
                        }`}
                      >
                        {log.result}
                      </span>
                      <span className="text-zinc-500">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-xs text-zinc-500">No scans logged this session.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
