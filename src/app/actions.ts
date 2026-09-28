"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as db from "@/lib/db";
import { sendQuoteNotification } from "@/lib/email";
import { createSession, destroySession, requireAuth, verifyPassword } from "@/lib/auth";
import {
  projectSchema,
  quoteSchema,
  serviceSchema,
  settingsSchema,
  statSchema,
  testimonialSchema,
} from "@/lib/schemas";
import type { QuoteStatus } from "@/lib/types";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

const bool = (v: FormDataEntryValue | null) => v === "on" || v === "true";
const lines = (v: string) =>
  v
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

function revalidatePublic() {
  ["/", "/projetos", "/servicos", "/empresa", "/contacto"].forEach((p) => revalidatePath(p, "page"));
  revalidatePath("/projetos/[slug]", "page");
}

function revalidateAdmin() {
  revalidatePath("/admin", "layout");
}

/* --------------------------- Pedido de orçamento --------------------------- */

export async function submitQuote(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = quoteSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    projectType: formData.get("projectType") ?? "",
    location: formData.get("location") ?? "",
    budget: formData.get("budget") ?? "",
    message: formData.get("message") ?? "",
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!errors[key]) errors[key] = issue.message;
    }
    return { status: "error", message: "Verifique os campos assinalados.", errors };
  }

  // honeypot preenchido → ignorar silenciosamente
  if (parsed.data.website) return { status: "success" };

  try {
    const payload = { ...parsed.data };
    delete payload.website;
    const quote = await db.createQuote(payload);
    await sendQuoteNotification(quote);
    revalidateAdmin();
    return { status: "success" };
  } catch {
    return {
      status: "error",
      message: "Não foi possível enviar o pedido. Tente novamente ou escreva para geral@modus.pt.",
    };
  }
}

/* -------------------------------- Auth --------------------------------- */

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { status: "error", message: "Introduza a palavra-passe." };
  if (!verifyPassword(password)) return { status: "error", message: "Palavra-passe incorreta." };
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ------------------------------ Projetos ------------------------------- */

export async function saveProject(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAuth();
  const id = String(formData.get("id") ?? "");
  const parsed = projectSchema.safeParse({
    index: formData.get("index") ?? "",
    title: formData.get("title") ?? "",
    slug: formData.get("slug") ?? "",
    category: formData.get("category") ?? "",
    location: formData.get("location") ?? "",
    year: formData.get("year") ?? "",
    area: formData.get("area") ?? "",
    status: formData.get("status") ?? "",
    excerpt: formData.get("excerpt") ?? "",
    description: formData.get("description") ?? "",
    cover: formData.get("cover") ?? "",
    gallery: formData.get("gallery") ?? "",
    featured: bool(formData.get("featured")),
    published: bool(formData.get("published")),
    span: (formData.get("span") as string) || "regular",
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
    return { status: "error", message: "Corrija os campos assinalados.", errors };
  }

  const d = parsed.data;
  const payload = {
    ...d,
    slug: db.slugify(d.slug || d.title),
    description: lines(d.description),
    gallery: lines(d.gallery),
  };

  if (id) await db.updateProject(id, payload);
  else await db.createProject(payload);

  revalidatePublic();
  revalidateAdmin();
  redirect("/admin/projetos");
}

export async function deleteProjectAction(formData: FormData) {
  await requireAuth();
  await db.deleteProject(String(formData.get("id")));
  revalidatePublic();
  revalidateAdmin();
}

export async function toggleProjectPublished(formData: FormData) {
  await requireAuth();
  const id = String(formData.get("id"));
  const project = await db.getProjectById(id);
  if (project) await db.updateProject(id, { published: !project.published });
  revalidatePublic();
  revalidateAdmin();
}

/* ------------------------------- Serviços ------------------------------- */

export async function saveService(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAuth();
  const id = String(formData.get("id") ?? "");
  const parsed = serviceSchema.safeParse({
    index: formData.get("index") ?? "",
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    image: formData.get("image") ?? "",
    detail: formData.get("detail") ?? "",
    published: bool(formData.get("published")),
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
    return { status: "error", message: "Corrija os campos assinalados.", errors };
  }
  const payload = { ...parsed.data, detail: lines(parsed.data.detail) };
  if (id) await db.updateService(id, payload);
  else await db.createService(payload);
  revalidatePublic();
  revalidateAdmin();
  redirect("/admin/servicos");
}

export async function deleteServiceAction(formData: FormData) {
  await requireAuth();
  await db.deleteService(String(formData.get("id")));
  revalidatePublic();
  revalidateAdmin();
}

/* ----------------------------- Testemunhos ----------------------------- */

export async function saveTestimonial(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAuth();
  const id = String(formData.get("id") ?? "");
  const parsed = testimonialSchema.safeParse({
    quote: formData.get("quote") ?? "",
    author: formData.get("author") ?? "",
    role: formData.get("role") ?? "",
    project: formData.get("project") ?? "",
    published: bool(formData.get("published")),
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
    return { status: "error", message: "Corrija os campos assinalados.", errors };
  }
  if (id) await db.updateTestimonial(id, parsed.data);
  else await db.createTestimonial(parsed.data);
  revalidatePublic();
  revalidateAdmin();
  redirect("/admin/testemunhos");
}

export async function deleteTestimonialAction(formData: FormData) {
  await requireAuth();
  await db.deleteTestimonial(String(formData.get("id")));
  revalidatePublic();
  revalidateAdmin();
}

/* ----------------------------- Estatísticas ----------------------------- */

export async function saveStat(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAuth();
  const id = String(formData.get("id") ?? "");
  const parsed = statSchema.safeParse({
    value: formData.get("value") ?? 0,
    prefix: formData.get("prefix") ?? "",
    suffix: formData.get("suffix") ?? "",
    label: formData.get("label") ?? "",
    published: bool(formData.get("published")),
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
    return { status: "error", message: "Corrija os campos assinalados.", errors };
  }
  if (id) await db.updateStat(id, parsed.data);
  else await db.createStat(parsed.data);
  revalidatePublic();
  revalidateAdmin();
  return { status: "success", message: "Estatística guardada." };
}

export async function deleteStatAction(formData: FormData) {
  await requireAuth();
  await db.deleteStat(String(formData.get("id")));
  revalidatePublic();
  revalidateAdmin();
}

/* ------------------------------ Orçamentos ------------------------------ */

export async function updateQuoteStatus(formData: FormData) {
  await requireAuth();
  await db.updateQuote(String(formData.get("id")), {
    status: String(formData.get("status")) as QuoteStatus,
  });
  revalidateAdmin();
}

export async function deleteQuoteAction(formData: FormData) {
  await requireAuth();
  await db.deleteQuote(String(formData.get("id")));
  revalidateAdmin();
}

/* ------------------------------ Definições ------------------------------ */

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAuth();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
    return { status: "error", message: "Corrija os campos assinalados.", errors };
  }
  await db.updateSettings(parsed.data);
  revalidatePublic();
  revalidateAdmin();
  return { status: "success", message: "Definições guardadas." };
}
