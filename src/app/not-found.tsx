import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col justify-center bg-bone">
      <div className="shell">
        <p className="eyebrow text-ink/40">Erro 404</p>
        <h1 className="display mt-6 text-[clamp(3rem,13vw,11rem)]">Sem planta.</h1>
        <p className="mt-8 max-w-[42ch] text-[16px] leading-relaxed text-ink/60">
          A página que procura não existe ou foi movida. Pode voltar ao início ou ver os projetos
          construídos pela MODUS.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="pressable group inline-flex min-w-[200px] items-center justify-between rounded-full bg-ink px-6 py-3.5 text-[13px] text-bone transition-colors hover:bg-[#1f1f1f]"
          >
            Voltar ao início <span aria-hidden>→</span>
          </Link>
          <Link
            href="/projetos"
            className="pressable group inline-flex min-w-[200px] items-center justify-between rounded-full border border-[rgba(10,10,10,0.28)] px-6 py-3.5 text-[13px] transition-colors hover:bg-ink hover:text-bone"
          >
            Ver projetos <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
