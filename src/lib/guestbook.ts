"use client";

import { getSupabaseBrowserClient, isSupabaseConfigured } from "./supabase/client";

/**
 * 留言簿数据层：直接使用项目现有的 Supabase 浏览器客户端。
 * 表：public.messages（见 supabase/messages.sql）
 *   id / content / created_at / position / rotation
 *
 * 未配置 Supabase 时返回明确的错误，不做任何 localStorage / 内存伪持久化。
 */

export interface GuestbookPosition {
  x: number;
  y: number;
}

export interface GuestbookMessage {
  id: string;
  content: string;
  created_at: string;
  position: GuestbookPosition | null;
  rotation: number | null;
}

export const SUPABASE_NOT_CONFIGURED =
  "留言服务尚未连接：Supabase 未配置。请先执行 supabase/messages.sql 并配置 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY。";

const SELECT_COLUMNS = "id,content,created_at,position,rotation";

export async function fetchMessages(): Promise<{
  data: GuestbookMessage[];
  error: string | null;
}> {
  if (!isSupabaseConfigured) {
    return { data: [], error: SUPABASE_NOT_CONFIGURED };
  }
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { data: [], error: SUPABASE_NOT_CONFIGURED };
  }

  const { data, error } = await supabase
    .from("messages")
    .select(SELECT_COLUMNS)
    .order("created_at", { ascending: true });

  if (error) {
    return { data: [], error: `读取留言失败：${error.message}` };
  }
  return { data: (data ?? []) as GuestbookMessage[], error: null };
}

export async function insertMessage(
  content: string,
  position: GuestbookPosition,
  rotation: number,
): Promise<{ data: GuestbookMessage | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: SUPABASE_NOT_CONFIGURED };
  }
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { data: null, error: SUPABASE_NOT_CONFIGURED };
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({ content, position, rotation })
    .select(SELECT_COLUMNS)
    .single();

  if (error) {
    return { data: null, error: `保存留言失败：${error.message}` };
  }
  return { data: data as GuestbookMessage, error: null };
}

/* ------------------------------------------------------------------ */
/* 便签展示：颜色 / 位置由 id 稳定派生（不写入数据库），保证刷新后一致 */

const NOTE_COLORS = [
  "#F6E7A8", // 暖黄
  "#F3D9C4", // 奶油橘
  "#E7E1C8", // 米白
  "#DDE8D2", // 浅苔绿
  "#E4DCEB", // 淡紫
  "#F1D9D6", // 浅砖粉
];

export function noteColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return NOTE_COLORS[hash % NOTE_COLORS.length];
}

/**
 * 便签墙四周的落点区域（归一化中心坐标，避开中央输入区与底部键盘）。
 * 便签以中心对齐，因此左右留出约半个便签的边距，避免贴出屏幕。
 */
const NOTE_ZONES: { xMin: number; xMax: number; yMin: number; yMax: number }[] = [
  { xMin: 0.06, xMax: 0.15, yMin: 0.2, yMax: 0.78 }, // 左侧
  { xMin: 0.85, xMax: 0.94, yMin: 0.3, yMax: 0.78 }, // 右侧（避开右上角标题）
  { xMin: 0.25, xMax: 0.6, yMin: 0.1, yMax: 0.16 }, // 顶部（避开右上角）
];

export function randomNotePlacement(): {
  position: GuestbookPosition;
  rotation: number;
} {
  const zone = NOTE_ZONES[Math.floor(Math.random() * NOTE_ZONES.length)];
  const x = zone.xMin + Math.random() * (zone.xMax - zone.xMin);
  const y = zone.yMin + Math.random() * (zone.yMax - zone.yMin);
  const rotation = Math.round((Math.random() * 8 - 4) * 10) / 10; // -4° ~ +4°
  return { position: { x, y }, rotation };
}

/** 读取旧留言时的兜底位置（老数据可能没有 position） */
export function fallbackPlacement(id: string): GuestbookPosition {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 33 + id.charCodeAt(i)) >>> 0;
  }
  const zones = NOTE_ZONES;
  const zone = zones[hash % zones.length];
  const x = zone.xMin + ((hash % 100) / 100) * (zone.xMax - zone.xMin);
  const y = zone.yMin + (((hash >> 3) % 100) / 100) * (zone.yMax - zone.yMin);
  return { x, y };
}
