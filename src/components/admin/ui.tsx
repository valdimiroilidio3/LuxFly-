"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-10 flex flex-col justify-between gap-5 border-b border-[rgba(10,10,10,0.14)] pb-7 md:flex-row md:items-end">
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.03em] md:text-[32px]">{title}</h1>
        {description && <p className="mt-2 max-w-[60ch] text-[14px] text-ink/55">{description}</p>}
      </div>
      {action}
    </header>
  );
}

export function SubmitButton({
  children = "Guardar",
  pendingLabel = "A guardar…",
  variant = "solid",
}: {
  children?: ReactNode;
  pendingLabel?: string;
  variant?: "solid" | "outline" | "danger";
}) {
  const { pending } = useFormStatus();
  const styles = {
    solid: "bg-ink text-bone hover:bg-[#1f1f1f]",
    outline: "border border-[rgba(10,10,10,0.25)] hover:bg-ink hover:text-bone",
    danger: "border border-[#b23b2e]/40 text-[#b23b2e] hover:bg-[#b23b2e] hover:text-white",
  }[variant];

  return (
    <button
      type="submit"
      disabled={pending}
      className={`pressable inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[13px] transition-colors duration-300 disabled:cursor-wait disabled:opacity-60 ${styles}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

export function ConfirmButton({
  children,
  message = "Confirma que pretende eliminar? Esta ação não pode ser revertida.",
}: {
  children: ReactNode;
  message?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className="pressable rounded-full border border-[rgba(10,10,10,0.18)] px-4 py-2 text-[12.5px] text-ink/60 transition-colors duration-300 hover:border-[#b23b2e] hover:bg-[#b23b2e] hover:text-white disabled:opacity-50"
    >
      {pending ? "A eliminar…" : children}
    </button>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[rgba(10,10,10,0.2)] px-8 py-16 text-center">
      <h2 className="text-[17px] font-medium">{title}</h2>
      <p className="mx-auto mt-2 max-w-[48ch] text-[14px] text-ink/50">{description}</p>
      {action && <div className="mt-7 flex justify-center">{action}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[rgba(10,10,10,0.1)] bg-bone p-6 ${className}`}>
      {children}
    </div>
  );
}

export const inputClass =
  "mt-1.5 w-full rounded-lg border border-[rgba(10,10,10,0.18)] bg-bone px-3.5 py-2.5 text-[14px] text-ink transition-colors placeholder:text-ink/30 focus:border-ink focus:outline-none";

export function Labeled({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <span className="eyebrow text-ink/45">{label}</span>
      {children}
      {hint && !error && <p className="mt-1.5 text-[12px] text-ink/40">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-[12px] text-[#b23b2e]">
          {error}
        </p>
      )}
    </div>
  );
}
