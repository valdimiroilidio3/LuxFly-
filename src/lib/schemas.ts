import { z } from "zod";
import { BUDGET_RANGES, PROJECT_TYPES } from "./types";

export const quoteSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Indique o seu nome.")
    .max(80, "Nome demasiado longo."),
  email: z.string().trim().email("Introduza um email válido."),
  phone: z
    .string()
    .trim()
    .min(9, "Introduza um telefone válido.")
    .max(24, "Telefone demasiado longo."),
  projectType: z.enum(PROJECT_TYPES, { message: "Escolha o tipo de projeto." }),
  location: z.string().trim().min(2, "Indique a localização.").max(80),
  budget: z.enum(BUDGET_RANGES, { message: "Escolha um intervalo de orçamento." }),
  message: z
    .string()
    .trim()
    .min(10, "Conte-nos um pouco mais (mínimo 10 caracteres).")
    .max(2000, "Mensagem demasiado longa."),
  // honeypot anti-spam
  website: z.string().max(0).optional(),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export const projectSchema = z.object({
  index: z.string().trim().min(1),
  title: z.string().trim().min(2),
  slug: z.string().trim().min(2),
  category: z.string().trim().min(2),
  location: z.string().trim().min(2),
  year: z.string().trim().min(4),
  area: z.string().trim().optional().default(""),
  status: z.string().trim().optional().default("Em obra"),
  excerpt: z.string().trim().max(400).optional().default(""),
  description: z.string().optional().default(""),
  cover: z.string().trim().min(1),
  gallery: z.string().optional().default(""),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  span: z.enum(["wide", "tall", "regular", "offset"]).optional().default("regular"),
});

export const serviceSchema = z.object({
  index: z.string().trim().min(1),
  title: z.string().trim().min(2),
  description: z.string().trim().min(2),
  image: z.string().trim().min(1),
  detail: z.string().optional().default(""),
  published: z.boolean().optional().default(true),
});

export const testimonialSchema = z.object({
  quote: z.string().trim().min(10),
  author: z.string().trim().min(2),
  role: z.string().trim().min(2),
  project: z.string().trim().optional().default(""),
  published: z.boolean().optional().default(true),
});

export const statSchema = z.object({
  value: z.coerce.number().min(0),
  prefix: z.string().trim().max(3).optional().default(""),
  suffix: z.string().trim().max(3).optional().default(""),
  label: z.string().trim().min(2),
  published: z.boolean().optional().default(true),
});

export const settingsSchema = z.object({
  companyName: z.string().trim().min(1),
  tagline: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(6),
  address: z.string().trim().min(4),
  instagram: z.string().trim().url().or(z.literal("")),
  linkedin: z.string().trim().url().or(z.literal("")),
  responseTime: z.string().trim().min(2),
});
