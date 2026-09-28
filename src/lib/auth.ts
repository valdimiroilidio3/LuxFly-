import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Autenticação do painel de administração.
 *
 * Implementação por sessão assinada (HMAC) com palavra-passe de administrador,
 * suficiente para operar desde o primeiro minuto. Em produção com Supabase,
 * substituir `verifyPassword`/`createSession` por `supabase.auth.signInWithPassword`
 * e validar a sessão no middleware.
 */

const COOKIE = "modus_admin";
const SECRET = process.env.ADMIN_SESSION_SECRET ?? "modus-dev-secret-change-me";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "modus2026";
const MAX_AGE = 60 * 60 * 12;

function sign(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function verifyPassword(input: string) {
  const a = Buffer.from(input);
  const b = Buffer.from(PASSWORD);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function createSession() {
  const issued = Date.now().toString();
  const value = `${issued}.${sign(issued)}`;
  const store = await cookies();
  store.set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAuthenticated() {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return false;
  const [issued, signature] = raw.split(".");
  if (!issued || !signature) return false;
  if (sign(issued) !== signature) return false;
  return Date.now() - Number(issued) < MAX_AGE * 1000;
}

export async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("NÃO_AUTORIZADO");
}
