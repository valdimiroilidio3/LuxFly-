"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Hammer,
  Quote,
  Inbox,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projetos", label: "Projetos", icon: Building2 },
  { href: "/admin/servicos", label: "Serviços", icon: Hammer },
  { href: "/admin/testemunhos", label: "Testemunhos", icon: Quote },
  { href: "/admin/orcamentos", label: "Pedidos de orçamento", icon: Inbox },
  { href: "/admin/estatisticas", label: "Estatísticas", icon: BarChart3 },
  { href: "/admin/definicoes", label: "Configurações", icon: Settings },
];

export function AdminNav({ logout }: { logout: () => Promise<void> }) {
  const pathname = usePathname();

  return (
    <aside className="on-dark shrink-0 bg-ink px-5 py-7 text-white lg:sticky lg:top-0 lg:h-screen lg:w-[264px]">
      <div className="flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span aria-hidden className="relative block h-3.5 w-3.5 border border-white">
            <span className="absolute inset-[3px] bg-white" />
          </span>
          <span className="text-[14px] font-extrabold tracking-[-0.03em] uppercase">Modus</span>
          <span className="text-[10px] tracking-[0.16em] text-white/40 uppercase">Admin</span>
        </Link>
      </div>

      <nav aria-label="Administração" className="mt-9">
        <ul className="flex flex-wrap gap-1 lg:flex-col">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <li key={href} className="w-full lg:w-auto">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`pressable flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] transition-colors duration-300 ${
                    active ? "bg-white/12 text-white" : "text-white/55 hover:bg-white/6 hover:text-white"
                  }`}
                >
                  <Icon size={16} strokeWidth={1.6} aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-10 space-y-1 border-t border-white/12 pt-5 lg:absolute lg:bottom-7 lg:w-[224px]">
        <Link
          href="/"
          target="_blank"
          className="pressable flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-white/55 transition-colors hover:text-white"
        >
          <ExternalLink size={15} strokeWidth={1.6} aria-hidden />
          Ver o site
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="pressable flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-white/55 transition-colors hover:text-white"
          >
            <LogOut size={15} strokeWidth={1.6} aria-hidden />
            Terminar sessão
          </button>
        </form>
      </div>
    </aside>
  );
}
