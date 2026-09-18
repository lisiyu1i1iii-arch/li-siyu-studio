/**
 * 环境变量常量（服务端 / 客户端都能安全引用，不要加 "use client"）。
 *
 * 兼容迁移：优先读取新版 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY，
 * 若未设置则回退到旧版 NEXT_PUBLIC_SUPABASE_ANON_KEY。
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

export const isSupabaseConfigured =
  SUPABASE_URL.startsWith("http") && SUPABASE_PUBLISHABLE_KEY.length > 20;
