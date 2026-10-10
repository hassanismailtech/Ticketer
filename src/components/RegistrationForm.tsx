"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { EventTierData } from "@/lib/events-data";

type RegistrationFormProps = {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  tiers: EventTierData[];
};

type FormState = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phone: string;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  phone: "",
};

export function RegistrationForm({
  eventId,
  eventName,
  eventDate,
  eventTime,
  eventLocation,
  tiers,
}: RegistrationFormProps) {
  const router = useRouter();
  const [selectedTierId, setSelectedTierId] = useState<string>(tiers[0]?.id || "tier-ga");
  const [formState, setFormState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<FormState> & { general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTier = tiers.find((t) => t.id === selectedTierId) || tiers[0];

  const handleChange = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<FormState> & { general?: string } = {};
    if (!formState.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!formState.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!formState.emailAddress.trim()) {
      nextErrors.emailAddress = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.emailAddress)) {
      nextErrors.emailAddress = "Please enter a valid email address.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          eventId,
          tierId: selectedTier?.id,
          tierName: selectedTier?.name,
          eventName,
          eventDate,
          eventTime,
          eventLocation,
        }),
      });

      const payload = (await response.json()) as { ticketId?: string; message?: string };

      if (!response.ok || !payload.ticketId) {
        throw new Error(payload.message ?? "Registration failed. Please check details.");
      }

      router.push(`/ticket/${payload.ticketId}`);
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "Unable to reserve your pass. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/[0.08] bg-[#0c0f18]/80 p-6 backdrop-blur-xl shadow-soft">
      {/* Tier Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
          Step 1: Choose Your Pass Tier
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          {tiers.map((tier) => {
            const isSelected = tier.id === selectedTierId;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedTierId(tier.id)}
                className={`relative flex flex-col justify-between rounded-xl border p-4 text-left transition duration-200 ${
                  isSelected
                    ? "border-brand-500 bg-brand-950/40 shadow-glow"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{tier.name}</span>
                    <span className="text-xs font-extrabold text-brand-300">
                      {tier.price === 0 ? "FREE" : `$${tier.price}`}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">{tier.description}</p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2 text-[11px] text-zinc-400">
                  <span>{tier.capacity - tier.soldCount} passes available</span>
                  {isSelected && (
                    <span className="flex items-center gap-1 font-semibold text-brand-400">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Selected
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Tier Perks */}
        {selectedTier && selectedTier.perks.length > 0 && (
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5">
            <p className="text-[11px] font-semibold tracking-wide uppercase text-zinc-300 mb-2">
              Pass Benefits Included:
            </p>
            <ul className="grid gap-1.5 sm:grid-cols-2 text-xs text-zinc-300">
              {selectedTier.perks.map((perk, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Attendee Details */}
      <div className="space-y-4 pt-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
          Step 2: Attendee Credentials
        </label>

        {errors.general && (
          <div className="rounded-xl border border-red-500/20 bg-red-950/40 p-3 text-xs text-red-300 flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errors.general}</span>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="mb-1.5 block text-xs font-medium text-zinc-300">
              First name *
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="e.g. Alex"
              value={formState.firstName}
              onChange={handleChange("firstName")}
              className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
            {errors.firstName && <p className="mt-1 text-[11px] text-red-400">{errors.firstName}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="mb-1.5 block text-xs font-medium text-zinc-300">
              Last name *
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="e.g. Morgan"
              value={formState.lastName}
              onChange={handleChange("lastName")}
              className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
            {errors.lastName && <p className="mt-1 text-[11px] text-red-400">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="emailAddress" className="mb-1.5 block text-xs font-medium text-zinc-300">
            Work or personal email *
          </label>
          <input
            id="emailAddress"
            name="emailAddress"
            type="email"
            placeholder="alex.morgan@company.com"
            value={formState.emailAddress}
            onChange={handleChange("emailAddress")}
            className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
          {errors.emailAddress && <p className="mt-1 text-[11px] text-red-400">{errors.emailAddress}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-zinc-300">
            Mobile Number (for SMS gate backup)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 019-2834"
            value={formState.phone}
            onChange={handleChange("phone")}
            className="w-full rounded-xl border border-white/[0.1] bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Instant Reservation Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 via-accent-violet to-brand-500 px-4 py-3 text-xs font-bold text-white shadow-glow transition hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Cryptographic Pass...
          </span>
        ) : (
          <>
            <span>Confirm & Generate Digital Ticket</span>
            <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>

      <p className="text-center text-[10px] text-zinc-400">
        🔒 Instant reservation with zero overbooking risk • Encrypted turnstile QR code generated on submit.
      </p>
    </form>
  );
}