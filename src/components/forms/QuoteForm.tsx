"use client";

import { useActionState, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { submitQuote, type FormState } from "@/app/actions";
import { EASE } from "@/components/motion/Reveal";
import { BUDGET_RANGES, PROJECT_TYPES } from "@/lib/types";

const initialState: FormState = { status: "idle" };

const fieldBase =
  "w-full border-b border-[rgba(10,10,10,0.22)] bg-transparent py-3.5 text-[15px] text-ink transition-colors duration-300 placeholder:text-ink/35 focus:border-ink focus:outline-none";

function Field({
  label,
  name,
  type = "text",
  placeholder,
  error,
  required = true,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="eyebrow text-ink/45">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`${fieldBase} mt-1 ${error ? "border-[#b23b2e]" : ""}`}
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-2 text-[12.5px] text-[#b23b2e]">
          {error}
        </p>
      )}
    </div>
  );
}

function Select({
  label,
  name,
  options,
  error,
}: {
  label: string;
  name: string;
  options: readonly string[];
  error?: string;
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="eyebrow text-ink/45">
        {label}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          required
          defaultValue=""
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`${fieldBase} mt-1 cursor-pointer pr-8 ${error ? "border-[#b23b2e]" : ""}`}
        >
          <option value="" disabled>
            Selecionar
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-1 bottom-4 text-[11px] text-ink/45"
        >
          ▾
        </span>
      </div>
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-2 text-[12.5px] text-[#b23b2e]">
          {error}
        </p>
      )}
    </div>
  );
}

export function QuoteForm() {
  const [state, formAction, pending] = useActionState(submitQuote, initialState);
  const [dismissedError, setDismissedError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const toast =
    state.status === "error" && state.message && state.message !== dismissedError
      ? state.message
      : null;

  if (state.status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        role="status"
        aria-live="polite"
        className="flex min-h-[420px] flex-col justify-center border-t border-[rgba(10,10,10,0.18)] pt-10"
      >
        <span aria-hidden className="mb-8 block h-10 w-10 rounded-full border border-ink">
          <span className="flex h-full w-full items-center justify-center text-[15px]">✓</span>
        </span>
        <h3 className="display text-[clamp(2rem,5vw,3.6rem)]">Recebemos o seu pedido.</h3>
        <p className="mt-6 max-w-[42ch] text-[16px] leading-relaxed text-ink/60">
          Obrigado. A equipa MODUS entrará em contacto consigo.
        </p>
        <p className="mt-2 text-[13px] text-ink/40">Resposta inicial em até 1 dia útil.</p>
      </motion.div>
    );
  }

  return (
    <>
      <form ref={formRef} action={formAction} noValidate className="w-full">
        {/* honeypot */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">Não preencher</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
          <Field label="Nome" name="name" error={state.errors?.name} autoComplete="name" placeholder="O seu nome" />
          <Field
            label="Email"
            name="email"
            type="email"
            error={state.errors?.email}
            autoComplete="email"
            placeholder="nome@email.pt"
          />
          <Field
            label="Telefone"
            name="phone"
            type="tel"
            error={state.errors?.phone}
            autoComplete="tel"
            placeholder="+351 900 000 000"
          />
          <Select
            label="Tipo de projeto"
            name="projectType"
            options={PROJECT_TYPES}
            error={state.errors?.projectType}
          />
          <Field
            label="Localização"
            name="location"
            error={state.errors?.location}
            placeholder="Concelho ou freguesia"
          />
          <Select
            label="Orçamento estimado"
            name="budget"
            options={BUDGET_RANGES}
            error={state.errors?.budget}
          />

          <div className="md:col-span-2">
            <label htmlFor="message" className="eyebrow text-ink/45">
              Mensagem
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder="Terreno, área aproximada, prazo desejado, referências…"
              aria-invalid={Boolean(state.errors?.message)}
              aria-describedby={state.errors?.message ? "message-error" : undefined}
              className={`${fieldBase} mt-1 resize-none ${state.errors?.message ? "border-[#b23b2e]" : ""}`}
            />
            {state.errors?.message && (
              <p id="message-error" role="alert" className="mt-2 text-[12.5px] text-[#b23b2e]">
                {state.errors.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[40ch] text-[12.5px] leading-relaxed text-ink/40">
            Ao enviar concorda com o tratamento dos seus dados para efeitos de resposta a este
            pedido.
          </p>
          <button
            type="submit"
            disabled={pending}
            data-cursor="hover"
            className="group inline-flex min-w-[230px] items-center justify-between rounded-full bg-ink px-7 py-4 text-[13px] text-bone transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#1f1f1f] disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? "A enviar…" : "Enviar pedido"}
            <span
              aria-hidden
              className={`transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${pending ? "animate-pulse" : "group-hover:translate-x-1.5"}`}
            >
              →
            </span>
          </button>
        </div>
      </form>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: EASE }}
            role="alert"
            className="fixed bottom-6 left-1/2 z-[120] flex -translate-x-1/2 items-center gap-5 rounded-full bg-ink px-6 py-3.5 text-[13px] text-bone shadow-[0_20px_40px_-20px_rgba(10,10,10,0.6)]"
          >
            {toast}
            <button
              type="button"
              onClick={() => setDismissedError(toast)}
              aria-label="Fechar notificação"
              className="text-bone/60 transition-colors hover:text-bone"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
