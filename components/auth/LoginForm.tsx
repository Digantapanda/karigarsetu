"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { submitLogin } from "@/app/login/actions";
import type { Dictionary } from "@/lib/i18n/config";

export function LoginForm({ dict }: { dict: Dictionary }) {
  const [state, formAction, isPending] = useActionState(submitLogin, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field label={dict.loginPage.emailLabel} name="email" type="email" required autoComplete="email" />
      <Field
        label={dict.loginPage.passwordLabel}
        name="password"
        type="password"
        required
        autoComplete="current-password"
      />

      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? dict.loginPage.signingIn : dict.loginPage.signIn}
      </Button>
    </form>
  );
}
