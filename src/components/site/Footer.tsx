import Link from "next/link";
import { site } from "@/lib/site";

const nav = [
  { label: "A empresa", href: "/empresa" },
  { label: "Projetos", href: "/projetos" },
  { label: "Serviços", href: "/servicos" },
  { label: "Processo", href: "/#processo" },
  { label: "Contacto", href: "/contacto" },
];

const legal = [
  { label: "Privacidade", href: "/privacidade" },
  { label: "Cookies", href: "/cookies" },
  { label: "Termos", href: "/termos" },
];

export function Footer() {
  return (
    <footer className="on-dark bg-ink text-white">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="MODUS">
              <span aria-hidden className="relative block h-4 w-4 border border-white">
                <span className="absolute inset-[3px] bg-white" />
              </span>
              <span className="text-[20px] font-extrabold tracking-[-0.04em] uppercase">Modus</span>
            </Link>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-white/55">
              {site.tagline} Arquitetura, engenharia e execução rigorosa em Portugal.
            </p>
          </div>

          <nav aria-label="Rodapé" className="md:col-span-3">
            <h2 className="eyebrow text-white/40">Navegação</h2>
            <ul className="mt-5 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[15px] text-white/75 transition-colors duration-300 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <h2 className="eyebrow text-white/40">Contacto</h2>
            <ul className="mt-5 space-y-2.5 text-[15px] text-white/75">
              <li>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-white">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phoneHref}`} className="transition-colors hover:text-white">
                  {site.phone}
                </a>
              </li>
              <li className="text-white/55">
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="eyebrow text-white/40">Social</h2>
            <ul className="mt-5 space-y-2.5 text-[15px] text-white/75">
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition-colors hover:text-white"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition-colors hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/12 pt-7 text-[12.5px] text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© 2026 MODUS. Todos os direitos reservados.</p>
          <ul className="flex flex-wrap gap-6">
            {legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin" className="transition-colors hover:text-white">
                Área reservada
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
