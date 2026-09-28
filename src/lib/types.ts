export type Project = {
  id: string;
  index: string; // "01"
  slug: string;
  title: string; // "Casa LUMEN"
  category: string; // "Moradia contemporânea"
  location: string; // "Coimbra"
  year: string;
  area?: string;
  status?: string;
  excerpt: string;
  description: string[];
  cover: string;
  gallery: string[];
  featured: boolean;
  published: boolean;
  /** editorial grid weight — controls asymmetric layout */
  span: "wide" | "tall" | "regular" | "offset";
  createdAt: string;
};

export type Service = {
  id: string;
  index: string;
  title: string;
  description: string;
  image: string;
  detail: string[];
  published: boolean;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  project: string;
  published: boolean;
};

export type Stat = {
  id: string;
  value: number;
  prefix: string;
  suffix: string;
  label: string;
  published: boolean;
};

export type ProcessStep = {
  id: string;
  index: string;
  title: string;
  description: string;
};

export type QuoteStatus = "Novo" | "Em análise" | "Contactado" | "Concluído";

export type Quote = {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  location: string;
  budget: string;
  message: string;
  createdAt: string;
  status: QuoteStatus;
  notes?: string;
};

export type Settings = {
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  linkedin: string;
  responseTime: string;
};

export type Database = {
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  stats: Stat[];
  quotes: Quote[];
  settings: Settings;
};

export const QUOTE_STATUSES: QuoteStatus[] = ["Novo", "Em análise", "Contactado", "Concluído"];

export const PROJECT_TYPES = [
  "Moradia",
  "Apartamento",
  "Reabilitação",
  "Espaço comercial",
  "Escritório",
  "Outro",
] as const;

export const BUDGET_RANGES = [
  "Até 150.000 €",
  "150.000 € — 300.000 €",
  "300.000 € — 600.000 €",
  "600.000 € — 1.000.000 €",
  "Acima de 1.000.000 €",
  "Ainda a definir",
] as const;
