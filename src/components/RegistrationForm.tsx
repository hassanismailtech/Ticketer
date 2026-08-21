"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";

type RegistrationFormProps = {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
};

type FormState = {
  firstName: string;
  lastName: string;
  emailAddress: string;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  emailAddress: "",
};

export function RegistrationForm({
  eventId,
  eventName,
  eventDate,
  eventTime,
  eventLocation,
}: RegistrationFormProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<FormState> = {};
    if (!formState.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!formState.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!formState.emailAddress.trim()) nextErrors.emailAddress = "Email address is required.";

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
          eventName,
          eventDate,
          eventTime,
          eventLocation,
        }),
      });

      const payload = (await response.json()) as { ticketId?: string; message?: string };

      if (!response.ok || !payload.ticketId) {
        throw new Error(payload.message ?? "Registration failed.");
      }

      router.push(`/ticket/${payload.ticketId}`);
    } catch (error) {
      setErrors({ emailAddress: error instanceof Error ? error.message : "Registration failed." });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-soft">
      <div>
        <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-zinc-900">
          First name
        </label>
        <input
          id="firstName"
          name="firstName"
          value={formState.firstName}
          onChange={handleChange("firstName")}
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-200"
        />
        {errors.firstName ? <p className="mt-2 text-sm text-red-600">{errors.firstName}</p> : null}
      </div>

      <div>
        <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-zinc-900">
          Last name
        </label>
        <input
          id="lastName"
          name="lastName"
          value={formState.lastName}
          onChange={handleChange("lastName")}
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-200"
        />
        {errors.lastName ? <p className="mt-2 text-sm text-red-600">{errors.lastName}</p> : null}
      </div>

      <div>
        <label htmlFor="emailAddress" className="mb-2 block text-sm font-medium text-zinc-900">
          Email address
        </label>
        <input
          id="emailAddress"
          name="emailAddress"
          type="email"
          value={formState.emailAddress}
          onChange={handleChange("emailAddress")}
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-200"
        />
        {errors.emailAddress ? <p className="mt-2 text-sm text-red-600">{errors.emailAddress}</p> : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-900 bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Registering..." : "Confirm Registration"}
      </button>
    </form>
  );
}