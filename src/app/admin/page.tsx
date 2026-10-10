"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { INITIAL_EVENTS } from "@/lib/events-data";

type Attendee = {
  ticketId: string;
  name: string;
  email: string;
  event: string;
  tier: string;
  status: "VALID" | "CHECKED_IN";
  issuedAt: string;
};

export default function OrganizerAdminPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [filterEvent, setFilterEvent] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    // Generate realistic attendee manifest including recent mock & demo items
    const manifest: Attendee[] = [
      {
        ticketId: "TCK-8F2A-91D0",
        name: "Dr. Evelyn Vance",
        email: "evelyn.vance@mit.edu",
        event: "SYNAPSE 2026: Global AI & Autonomous Systems Summit",
        tier: "VIP All-Access Pass",
        status: "CHECKED_IN",
        issuedAt: "2026-10-10 11:20 AM",
      },
      {
        ticketId: "TCK-4B1C-7729",
        name: "Marcus Adebayo",
        email: "marcus@stridecap.vc",
        event: "Founders & Angels High-Growth Soirée",
        tier: "Investor & Partner Ticket",
        status: "VALID",
        issuedAt: "2026-10-10 12:45 PM",
      },
      {
        ticketId: "TCK-99E1-0422",
        name: "Amina Al-Mansoor",
        email: "amina@quantumdeep.ai",
        event: "SYNAPSE 2026: Global AI & Autonomous Systems Summit",
        tier: "General Admission",
        status: "CHECKED_IN",
        issuedAt: "2026-10-10 01:10 PM",
      },
      {
        ticketId: "TCK-6D3F-8812",
        name: "Tariq Sterling",
        email: "tariq@audiomesh.fm",
        event: "NEXUS: Spatial Audio & Visual Arts Experience",
        tier: "Backstage & Artist Deck",
        status: "VALID",
        issuedAt: "2026-10-10 01:30 PM",
      },
      {
        ticketId: "TCK-2A7B-5531",
        name: "Chioma Nwosu",
        email: "chioma@finscaletech.com",
        event: "Founders & Angels High-Growth Soirée",
        tier: "Founder Access Pass",
        status: "CHECKED_IN",
        issuedAt: "2026-10-10 02:05 PM",
      },
      {
        ticketId: "TCK-1F9D-3344",
        name: "Liam O'Connor",
        email: "liam@soundscape.uk",
        event: "NEXUS: Spatial Audio & Visual Arts Experience",
        tier: "General Wave Ticket",
        status: "VALID",
        issuedAt: "2026-10-10 02:15 PM",
      },
    ];

    setAttendees(manifest);
  }, []);

  const totalAttendees = attendees.length;
  const totalCheckedIn = attendees.filter((a) => a.status === "CHECKED_IN").length;
  const checkInRate = totalAttendees > 0 ? Math.round((totalCheckedIn / totalAttendees) * 100) : 0;

  const filteredAttendees = attendees.filter((a) => {
    const matchesEvent = filterEvent === "ALL" || a.event.includes(filterEvent);
    const matchesStatus = filterStatus === "ALL" || a.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.ticketId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesEvent && matchesStatus && matchesSearch;
  });

  const toggleStatus = (ticketId: string) => {
    setAttendees((prev) =>
      prev.map((a) =>
        a.ticketId === ticketId
          ? { ...a, status: a.status === "VALID" ? "CHECKED_IN" : "VALID" }
          : a
      )
    );
  };

  const exportCSV = () => {
    const headers = ["Ticket ID", "Attendee Name", "Email", "Event", "Tier", "Status", "Issued At"];
    const rows = attendees.map((a) => [
      a.ticketId,
      `"${a.name}"`,
      a.email,
      `"${a.event}"`,
      `"${a.tier}"`,
      a.status,
      `"${a.issuedAt}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendee-manifest-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-brand-400 animate-pulse shadow-[0_0_8px_#818cf8]" />
            <p className="text-xs font-bold uppercase tracking-widest text-brand-400">
              ORGANIZER COMMAND CENTER
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Live Event Operations & Telemetry
          </h1>
          <p className="text-xs text-zinc-400">
            Monitor real-time gate admissions, attendee check-in velocity, and ticket rosters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/[0.08]"
          >
            <span>📥 Export Attendee CSV</span>
          </button>
          <Link
            href="/scanner"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-violet px-4 py-2.5 text-xs font-bold text-white shadow-glow transition hover:opacity-95"
          >
            <span>Open Gate Scanner →</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0f18]/80 p-5 backdrop-blur-xl space-y-1">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Registered Attendees</p>
          <p className="text-2xl font-black text-white">{totalAttendees}</p>
          <p className="text-[11px] text-emerald-400 font-medium">↑ 100% Guaranteed Capacity</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0f18]/80 p-5 backdrop-blur-xl space-y-1">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Admitted Through Turnstiles</p>
          <p className="text-2xl font-black text-emerald-400">{totalCheckedIn}</p>
          <p className="text-[11px] text-zinc-400 font-medium">Live gatekeeper count</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0f18]/80 p-5 backdrop-blur-xl space-y-1">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Check-In Velocity</p>
          <p className="text-2xl font-black text-brand-300">{checkInRate}%</p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06] mt-2">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${checkInRate}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0f18]/80 p-5 backdrop-blur-xl space-y-1">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Fraud / Double Entry Rate</p>
          <p className="text-2xl font-black text-accent-cyan">0.00%</p>
          <p className="text-[11px] text-emerald-400 font-medium">✓ Cryptographic Signatures Active</p>
        </div>
      </div>

      {/* Manifest Filters & Search */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0f18]/80 p-6 backdrop-blur-xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Attendee Manifest Roster</h2>
            <p className="text-xs text-zinc-400">Search and manage door admissions in real-time.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search attendee, email, or TCK-..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-brand-500"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-white/[0.1] bg-[#121624] px-3 py-2 text-xs text-zinc-300 outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="VALID">Valid (Not Yet Admitted)</option>
              <option value="CHECKED_IN">Checked In</option>
            </select>
          </div>
        </div>

        {/* Manifest Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11px] uppercase tracking-wider text-zinc-400">
                <th className="pb-3 font-semibold">Attendee</th>
                <th className="pb-3 font-semibold">Ticket ID</th>
                <th className="pb-3 font-semibold">Tier</th>
                <th className="pb-3 font-semibold">Event</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map((att) => (
                  <tr key={att.ticketId} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 pr-4">
                      <p className="font-bold text-white">{att.name}</p>
                      <p className="text-[11px] text-zinc-400">{att.email}</p>
                    </td>
                    <td className="py-3.5 pr-4 font-mono text-zinc-300">{att.ticketId}</td>
                    <td className="py-3.5 pr-4">
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-semibold text-brand-300">
                        {att.tier}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 max-w-[200px] truncate text-zinc-300">{att.event}</td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          att.status === "CHECKED_IN"
                            ? "border border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
                            : "border border-amber-500/30 bg-amber-950/40 text-amber-300"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            att.status === "CHECKED_IN" ? "bg-emerald-400" : "bg-amber-400"
                          }`}
                        />
                        {att.status === "CHECKED_IN" ? "ADMITTED" : "CONFIRMED"}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => toggleStatus(att.ticketId)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                          att.status === "CHECKED_IN"
                            ? "border border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white"
                            : "border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40"
                        }`}
                      >
                        {att.status === "CHECKED_IN" ? "Revert Gate" : "Check In Now"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-zinc-500">
                    No attendees match the active filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
