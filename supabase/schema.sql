-- ================================================================
-- MODUS — esquema Supabase (PostgreSQL)
-- Espelha exatamente os tipos de src/lib/types.ts, para que a
-- migração do store JSON para Supabase não exija alterar a UI.
-- ================================================================

create extension if not exists "pgcrypto";

-- ------------------------------ Projetos ------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  index       text not null,
  slug        text not null unique,
  title       text not null,
  category    text not null,
  location    text not null,
  year        text not null,
  area        text default '',
  status      text default 'Em obra',
  excerpt     text default '',
  description text[] default '{}',
  cover       text not null,
  gallery     text[] default '{}',
  featured    boolean not null default false,
  published   boolean not null default false,
  span        text not null default 'regular'
                check (span in ('wide','tall','regular','offset')),
  created_at  timestamptz not null default now()
);
create index if not exists projects_published_idx on public.projects (published, index);

-- ------------------------------ Serviços ------------------------------
create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  index       text not null,
  title       text not null,
  description text not null,
  image       text not null,
  detail      text[] default '{}',
  published   boolean not null default true
);

-- ---------------------------- Testemunhos -----------------------------
create table if not exists public.testimonials (
  id        uuid primary key default gen_random_uuid(),
  quote     text not null,
  author    text not null,
  role      text not null,
  project   text default '',
  published boolean not null default true
);

-- ---------------------------- Estatísticas ----------------------------
create table if not exists public.stats (
  id        uuid primary key default gen_random_uuid(),
  value     integer not null default 0,
  prefix    text default '',
  suffix    text default '',
  label     text not null,
  published boolean not null default true
);

-- ---------------------- Pedidos de orçamento --------------------------
create type quote_status as enum ('Novo','Em análise','Contactado','Concluído');

create table if not exists public.quotes (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  phone        text not null,
  project_type text not null,
  location     text not null,
  budget       text not null,
  message      text not null,
  status       quote_status not null default 'Novo',
  notes        text,
  created_at   timestamptz not null default now()
);
create index if not exists quotes_created_idx on public.quotes (created_at desc);
create index if not exists quotes_status_idx  on public.quotes (status);

-- ------------------------------ Definições ----------------------------
create table if not exists public.settings (
  id            boolean primary key default true check (id),
  company_name  text not null default 'MODUS',
  tagline       text not null default 'Construímos espaços para viver.',
  email         text not null,
  phone         text not null,
  address       text not null,
  instagram     text default '',
  linkedin      text default '',
  response_time text not null default 'Resposta inicial em até 1 dia útil.'
);

-- ============================== SEGURANÇA ==============================
alter table public.projects     enable row level security;
alter table public.services     enable row level security;
alter table public.testimonials enable row level security;
alter table public.stats        enable row level security;
alter table public.quotes       enable row level security;
alter table public.settings     enable row level security;

-- Leitura pública apenas do conteúdo publicado
create policy "public read published projects"
  on public.projects for select using (published = true);
create policy "public read published services"
  on public.services for select using (published = true);
create policy "public read published testimonials"
  on public.testimonials for select using (published = true);
create policy "public read published stats"
  on public.stats for select using (published = true);
create policy "public read settings"
  on public.settings for select using (true);

-- Qualquer visitante pode submeter um pedido; ninguém anónimo o pode ler
create policy "anyone can submit a quote"
  on public.quotes for insert with check (true);

-- Administração: utilizadores autenticados via Supabase Auth
create policy "authenticated manage projects"
  on public.projects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage services"
  on public.services for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage testimonials"
  on public.testimonials for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage stats"
  on public.stats for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage quotes"
  on public.quotes for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage settings"
  on public.settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ------------------------------ Storage --------------------------------
-- insert into storage.buckets (id, name, public) values ('projects', 'projects', true);
