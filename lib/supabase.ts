import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

function readEnvValue(value: string | undefined) {
  return value?.trim().replace(/^["']|["']$/g, "") || null;
}

function isValidSupabaseUrl(value: string | null) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function hasSupabaseConfig() {
  const supabaseUrl = readEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = readEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return Boolean(isValidSupabaseUrl(supabaseUrl) && supabaseAnonKey);
}

export function createSupabaseClient() {
  const supabaseUrl = readEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = readEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!supabaseUrl || !isValidSupabaseUrl(supabaseUrl) || !supabaseAnonKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
}
