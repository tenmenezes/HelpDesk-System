// src/lib/supabase.ts
// Cliente Supabase para Storage (upload de fotos de perfil)
// Usamos o service_role key no servidor para operações privilegiadas

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client para uso server-side (service_role) — apenas em API Routes/Server Components
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Client para uso client-side (anon key) — seguro para expor
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Bucket de avatares
export const AVATAR_BUCKET = "avatares";

/**
 * Gera a URL pública de um avatar no Supabase Storage.
 * Retorna null se o path for nulo/undefined/vazio.
 */
export function getAvatarUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  // Se já é uma URL completa (ex: migração ou upload direto), retorna como está
  if (path.startsWith("http")) return path;
  const { data } = supabaseAdmin.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(path);
  return data.publicUrl;
}
