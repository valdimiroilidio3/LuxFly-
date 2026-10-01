# MODUS — Arquitetura & Construção

Website institucional premium + painel de administração para a **MODUS**.
Construímos espaços para viver.

![Stack](https://img.shields.io/badge/Next.js-16-000?style=flat-square) ![TS](https://img.shields.io/badge/TypeScript-strict-000?style=flat-square) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-000?style=flat-square)

---

## Arranque rápido

```bash
npm install
npm run dev        # http://localhost:3000
```

A aplicação corre **sem qualquer variável de ambiente**: o conteúdo é servido por
um store JSON local semeado a partir de `src/lib/seed.ts`.

Painel de administração: `http://localhost:3000/admin`
Palavra-passe por omissão: `modus2026` (alterar via `ADMIN_PASSWORD`).

---

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js (App Router, Server Actions, Turbopack) + React 19 |
| Linguagem | TypeScript estrito |
| Estilo | Tailwind CSS v4 + design tokens em `globals.css` |
| Animação | Motion (Framer Motion) |
| Ícones | Lucide React |
| Formulários | Server Actions + Zod |
| Tipografia | Inter Variable auto-alojada (`next/font/local`) |
| Base de dados | Store JSON local — migração para Supabase preparada |
| Email | Resend (opcional) |
| Analytics | Vercel Analytics |

---

## Estrutura

```
src/
├─ app/
│  ├─ (site)/                 # website público
│  │  ├─ page.tsx             # homepage — hero + narrativa de scroll
│  │  ├─ empresa/ projetos/ servicos/ contacto/ [legal]/
│  ├─ admin/
│  │  ├─ login/               # autenticação
│  │  └─ (dash)/              # dashboard protegido + CRUD
│  ├─ actions.ts              # Server Actions (formulários + CRUD)
│  ├─ sitemap.ts  robots.ts   # SEO
├─ components/
│  ├─ home/                   # secções da homepage
│  ├─ site/  forms/  admin/  ui/  motion/
├─ lib/
│  ├─ db.ts                   # camada de dados (API estável)
│  ├─ seed.ts                 # conteúdo DEMO substituível
│  ├─ schemas.ts  types.ts  auth.ts  email.ts  supabase.ts
└─ fonts/
supabase/schema.sql           # esquema PostgreSQL + RLS
```

---

## Conteúdo é dados, não código

Os projetos, serviços, testemunhos e estatísticas presentes são **conteúdo de
demonstração**. Nenhum componente depende de valores concretos — tudo é lido do
store e editável em `/admin`:

- **Projetos** — criar, editar, eliminar, publicar/despublicar, destacar na
  homepage, alterar capa, galeria, descrição, localização, ano, área, estado e
  peso na grelha editorial.
- **Serviços** — número, título, descrição, detalhes, imagem, visibilidade.
- **Testemunhos** — citação, autor, projeto, visibilidade.
- **Estatísticas** — prefixo, valor, sufixo e etiqueta (animação count-up).
- **Pedidos de orçamento** — caixa de entrada com estados
  *Novo · Em análise · Contactado · Concluído*.
- **Configurações** — contactos, morada, redes e tempo de resposta.

As secções desaparecem ou mostram *empty states* quando não há conteúdo.

---

## Migração para Supabase

`src/lib/db.ts` expõe uma API estável (`getProjects`, `createQuote`, …) usada por
toda a aplicação. Para migrar:

1. Executar `supabase/schema.sql` no projeto Supabase (tabelas + RLS + políticas).
2. Preencher as variáveis em `.env.local` (ver `.env.example`).
3. Substituir o corpo das funções de `db.ts` por chamadas ao cliente de
   `src/lib/supabase.ts`. Nenhum componente precisa de ser alterado.
4. Trocar a sessão assinada de `src/lib/auth.ts` por Supabase Auth.
5. Usar Supabase Storage para as imagens — `next.config.ts` já autoriza o
   domínio `*.supabase.co/storage/v1/object/public/**`.

---

## Decisões de design

- **Hero** — fundo marfim, palavra `CONSTRUÍMOS.` a `font-weight: 900` com
  `letter-spacing: -0.075em` a ocupar toda a largura da viewport, e a arquitetura
  recortada (PNG com alfa) colocada **à frente** da tipografia em `z-20`, com
  sombra de contacto, parallax e revelação por `clip-path`.
- **Uma só composição** — a hero não tem versões duplicadas: a mesma imagem é
  reposicionada por breakpoint, garantindo um único LCP.
- **Mobile redesenhado** — não é a versão desktop reduzida: tipografia quebrada
  em duas linhas como elemento gráfico, arquitetura em largura total, copy e
  bloco de orçamento reordenados.
- **Grelha editorial assimétrica** no portfólio (`wide`, `tall`, `regular`,
  `offset`), definida por projeto no admin.
- **Sistema de movimento** — `cubic-bezier(0.16, 1, 0.3, 1)`, 0.4s–1.6s,
  hierarquia de entrada, nunca tudo ao mesmo tempo.

---

## Acessibilidade e performance

- HTML semântico, `aria-*`, foco visível, navegação por teclado, skip link.
- `prefers-reduced-motion: reduce` desliga parallax, cursor personalizado e
  reduz todas as transições.
- Imagens em WebP/AVIF via `next/image`, com `sizes` por breakpoint; hero
  marcada como `priority` + `fetchPriority="high"`.
- Fonte auto-alojada (sem ligação a fonts.googleapis.com), páginas públicas
  estáticas, cabeçalhos de cache imutáveis para `/images/*`.

## SEO

Metadata dinâmica por página, Open Graph e Twitter Cards, `sitemap.xml`,
`robots.txt` (com `/admin` bloqueado) e JSON-LD
(`Organization` + `LocalBusiness` + `GeneralContractor`, `CreativeWork` nos
projetos).

---

## Scripts

```bash
npm run dev     # desenvolvimento
npm run build   # build de produção
npm run start   # servidor de produção
npm run preview # instala + compila + serve em 0.0.0.0:3000 (recuperar pré-visualização)
npm run lint    # ESLint
```

> **Pré-visualização em branco ou erro 502?**
> Significa que não há servidor a responder no porto 3000 — normalmente porque o
> ambiente foi reiniciado e `node_modules` / `.next` foram descartados (não são
> versionados). `npm run preview` repõe tudo num só comando.

`scripts/process-images.mjs` regenera os assets: recorta o fundo da fotografia da
hero (flood fill + feather do alfa) e converte as restantes para WebP.

### Verificação de erros de runtime

Sem browser disponível no ambiente, `npm run check:runtime` carrega cada rota
num JSDOM com o bundle real a executar (com os globais de plataforma em falta
preenchidos) e falha se houver `console.error`, exceções por apanhar ou avisos
de hidratação. Requer o servidor a correr em `http://localhost:3000`.
