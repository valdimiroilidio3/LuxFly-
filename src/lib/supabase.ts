import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase é opcional em desenvolvimento: sem variáveis de ambiente a aplicação
 * corre com o store JSON (`src/lib/db.ts`). Assim que as chaves existirem, este
 * cliente fica disponível para migrar as leituras/escritas do `db.ts`,
 * para Supabase Auth em `/admin` e para Supabase Storage nas imagens.
 *
 * Esquema SQL sugerido em `supabase/schema.sql`.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseEnabled = Boolean(url && anonKey);

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: true } });
}

export function getSupabaseServerClient(): SupabaseClient | null {
  if (!url) return null;
  const key = serviceKey ?? anonKey;
  if (!key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
