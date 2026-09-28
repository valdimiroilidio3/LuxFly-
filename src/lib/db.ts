import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { seed } from "./seed";
import type { Database, Project, Quote, Service, Settings, Stat, Testimonial } from "./types";

/**
 * Camada de dados.
 *
 * Implementação atual: store JSON em disco (zero configuração, pronto a correr).
 * Em produção basta substituir as funções `read`/`write` por chamadas Supabase
 * (`supabase.from('projects').select()` …) — a API pública deste módulo é a
 * mesma que o resto da aplicação consome, por isso nada mais precisa de mudar.
 * Ver `src/lib/supabase.ts`.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "modus.json");

let memory: Database | null = null;

async function read(): Promise<Database> {
  if (memory) return memory;
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    memory = JSON.parse(raw) as Database;
  } catch {
    memory = structuredClone(seed);
    await write(memory);
  }
  return memory;
}

async function write(db: Database): Promise<void> {
  memory = db;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch {
    /* read-only filesystem (ex.: edge/preview) — mantém-se em memória */
  }
}

const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/* ------------------------------ Projects ------------------------------ */

export async function getProjects(opts: { publishedOnly?: boolean } = {}) {
  const db = await read();
  const list = [...db.projects].sort((a, b) => a.index.localeCompare(b.index));
  return opts.publishedOnly ? list.filter((p) => p.published) : list;
}

export async function getProject(slug: string) {
  const db = await read();
  return db.projects.find((p) => p.slug === slug) ?? null;
}

export async function getProjectById(id: string) {
  const db = await read();
  return db.projects.find((p) => p.id === id) ?? null;
}

export async function createProject(input: Partial<Project>): Promise<Project> {
  const db = await read();
  const nextIndex = String(db.projects.length + 1).padStart(2, "0");
  const project: Project = {
    id: uid("prj"),
    index: input.index || nextIndex,
    slug: input.slug || slugify(input.title || `projeto-${nextIndex}`),
    title: input.title || "Novo projeto",
    category: input.category || "Residencial",
    location: input.location || "Portugal",
    year: input.year || String(new Date().getFullYear()),
    area: input.area || "",
    status: input.status || "Em obra",
    excerpt: input.excerpt || "",
    description: input.description?.length ? input.description : [""],
    cover: input.cover || "/images/proj-lumen.webp",
    gallery: input.gallery?.length ? input.gallery : [input.cover || "/images/proj-lumen.webp"],
    featured: input.featured ?? false,
    published: input.published ?? false,
    span: input.span || "regular",
    createdAt: new Date().toISOString(),
  };
  db.projects.push(project);
  await write(db);
  return project;
}

export async function updateProject(id: string, patch: Partial<Project>) {
  const db = await read();
  const i = db.projects.findIndex((p) => p.id === id);
  if (i === -1) return null;
  db.projects[i] = { ...db.projects[i], ...patch, id };
  await write(db);
  return db.projects[i];
}

export async function deleteProject(id: string) {
  const db = await read();
  db.projects = db.projects.filter((p) => p.id !== id);
  await write(db);
}

/* ------------------------------ Services ------------------------------ */

export async function getServices(opts: { publishedOnly?: boolean } = {}) {
  const db = await read();
  const list = [...db.services].sort((a, b) => a.index.localeCompare(b.index));
  return opts.publishedOnly ? list.filter((s) => s.published) : list;
}

export async function createService(input: Partial<Service>): Promise<Service> {
  const db = await read();
  const service: Service = {
    id: uid("svc"),
    index: input.index || String(db.services.length + 1).padStart(2, "0"),
    title: input.title || "Novo serviço",
    description: input.description || "",
    image: input.image || "/images/detail-macro.webp",
    detail: input.detail?.length ? input.detail : [],
    published: input.published ?? true,
  };
  db.services.push(service);
  await write(db);
  return service;
}

export async function updateService(id: string, patch: Partial<Service>) {
  const db = await read();
  const i = db.services.findIndex((s) => s.id === id);
  if (i === -1) return null;
  db.services[i] = { ...db.services[i], ...patch, id };
  await write(db);
  return db.services[i];
}

export async function deleteService(id: string) {
  const db = await read();
  db.services = db.services.filter((s) => s.id !== id);
  await write(db);
}

/* ---------------------------- Testimonials ---------------------------- */

export async function getTestimonials(opts: { publishedOnly?: boolean } = {}) {
  const db = await read();
  return opts.publishedOnly ? db.testimonials.filter((t) => t.published) : db.testimonials;
}

export async function createTestimonial(input: Partial<Testimonial>): Promise<Testimonial> {
  const db = await read();
  const testimonial: Testimonial = {
    id: uid("tst"),
    quote: input.quote || "",
    author: input.author || "Cliente",
    role: input.role || "Cliente particular",
    project: input.project || "",
    published: input.published ?? true,
  };
  db.testimonials.push(testimonial);
  await write(db);
  return testimonial;
}

export async function updateTestimonial(id: string, patch: Partial<Testimonial>) {
  const db = await read();
  const i = db.testimonials.findIndex((t) => t.id === id);
  if (i === -1) return null;
  db.testimonials[i] = { ...db.testimonials[i], ...patch, id };
  await write(db);
  return db.testimonials[i];
}

export async function deleteTestimonial(id: string) {
  const db = await read();
  db.testimonials = db.testimonials.filter((t) => t.id !== id);
  await write(db);
}

/* -------------------------------- Stats -------------------------------- */

export async function getStats(opts: { publishedOnly?: boolean } = {}) {
  const db = await read();
  return opts.publishedOnly ? db.stats.filter((s) => s.published) : db.stats;
}

export async function createStat(input: Partial<Stat>): Promise<Stat> {
  const db = await read();
  const stat: Stat = {
    id: uid("st"),
    value: input.value ?? 0,
    prefix: input.prefix ?? "",
    suffix: input.suffix ?? "",
    label: input.label || "Indicador",
    published: input.published ?? true,
  };
  db.stats.push(stat);
  await write(db);
  return stat;
}

export async function updateStat(id: string, patch: Partial<Stat>) {
  const db = await read();
  const i = db.stats.findIndex((s) => s.id === id);
  if (i === -1) return null;
  db.stats[i] = { ...db.stats[i], ...patch, id };
  await write(db);
  return db.stats[i];
}

export async function deleteStat(id: string) {
  const db = await read();
  db.stats = db.stats.filter((s) => s.id !== id);
  await write(db);
}

/* -------------------------------- Quotes ------------------------------- */

export async function getQuotes() {
  const db = await read();
  return [...db.quotes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createQuote(input: Omit<Quote, "id" | "createdAt" | "status">): Promise<Quote> {
  const db = await read();
  const quote: Quote = {
    ...input,
    id: uid("qt"),
    createdAt: new Date().toISOString(),
    status: "Novo",
  };
  db.quotes.push(quote);
  await write(db);
  return quote;
}

export async function updateQuote(id: string, patch: Partial<Quote>) {
  const db = await read();
  const i = db.quotes.findIndex((q) => q.id === id);
  if (i === -1) return null;
  db.quotes[i] = { ...db.quotes[i], ...patch, id };
  await write(db);
  return db.quotes[i];
}

export async function deleteQuote(id: string) {
  const db = await read();
  db.quotes = db.quotes.filter((q) => q.id !== id);
  await write(db);
}

/* ------------------------------- Settings ------------------------------ */

export async function getSettings() {
  const db = await read();
  return db.settings;
}

export async function updateSettings(patch: Partial<Settings>) {
  const db = await read();
  db.settings = { ...db.settings, ...patch };
  await write(db);
  return db.settings;
}

/* ------------------------------ Dashboard ------------------------------ */

export async function getDashboard() {
  const db = await read();
  const now = new Date();
  const thisMonth = db.quotes.filter((q) => {
    const d = new Date(q.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  return {
    newQuotes: db.quotes.filter((q) => q.status === "Novo").length,
    monthQuotes: thisMonth.length,
    activeProjects: db.projects.filter((p) => p.status === "Em obra").length,
    publishedProjects: db.projects.filter((p) => p.published).length,
    totalQuotes: db.quotes.length,
    totalProjects: db.projects.length,
    recentQuotes: [...db.quotes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
  };
}
