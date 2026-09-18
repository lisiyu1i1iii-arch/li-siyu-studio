"use client";

import { createBrowserClient } from "@supabase/ssr";

import {
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./env";

export { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, isSupabaseConfigured };

let cached: ReturnType<typeof createBrowserClient> | null = null;

/** 浏览器端 Supabase 客户端（单例）。未配置时返回 null。 */
export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured) return null;
  if (!cached) {
    cached = createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  }
  return cached;
}
