"use client";

import { useState, useTransition } from "react";
import { pilotAdminLogin } from "@/app/pilot/admin/actions";

export function AdminLoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await pilotAdminLogin(formData);
      if (result.error) {
        setError(result.error);
      } else {
        window.location.reload();
      }
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-ink-900">
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="h-12 w-full rounded-lg border border-ink-500/25 bg-khadi-50 px-4 text-base text-ink-900 focus:border-indigo-500"
        />
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="h-12 rounded-lg bg-indigo-700 px-6 text-base font-semibold text-khadi-50 hover:bg-indigo-900 disabled:opacity-60"
      >
        {isPending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}
