"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "@/app/actions";

const initial: FormState = { status: "idle" };

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="password" className="eyebrow text-ink/45">
          Palavra-passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          aria-invalid={state.status === "error"}
          aria-describedby={state.status === "error" ? "login-error" : undefined}
          className="mt-1 w-full border-b border-[rgba(10,10,10,0.22)] bg-transparent py-3 text-[15px] focus:border-ink focus:outline-none"
        />
      </div>

      {state.status === "error" && (
        <p id="login-error" role="alert" className="text-[13px] text-[#b23b2e]">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-between rounded-full bg-ink px-6 py-3.5 text-[13px] text-bone transition-colors hover:bg-[#1f1f1f] disabled:opacity-60"
      >
        {pending ? "A validar…" : "Entrar"}
        <span aria-hidden>→</span>
      </button>
    </form>
  );
}
