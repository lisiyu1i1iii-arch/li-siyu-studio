-- =============================================================
-- 留言簿（Guestbook）· Supabase 数据库结构
-- 在 Supabase 控制台 -> SQL Editor 中整段粘贴执行即可。
-- 与 schema.sql 相互独立，可单独重复执行（幂等）。
-- =============================================================

create extension if not exists "pgcrypto";

-- ---------------- messages：网站留言（便签） ----------------
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  content     text not null check (
                char_length(btrim(content)) > 0
                and char_length(content) <= 500
              ),
  created_at  timestamptz not null default now(),
  -- 便签在留言墙上的归一化位置：{ "x": 0.12, "y": 0.35 }
  position    jsonb not null default '{"x":0.5,"y":0.5}'::jsonb,
  -- 便签旋转角度（度）
  rotation    double precision not null default 0
);

create index if not exists messages_created_at_idx
  on public.messages (created_at);

-- ---------------- 行级安全：游客可读、可提交；不可改、不可删 ----------------
alter table public.messages enable row level security;

drop policy if exists "public_read_messages" on public.messages;
create policy "public_read_messages" on public.messages
  for select using (true);

drop policy if exists "public_insert_messages" on public.messages;
create policy "public_insert_messages" on public.messages
  for insert with check (true);

-- 刻意不创建 update / delete 策略：
-- RLS 默认拒绝，因此匿名游客无法修改或删除已有留言。

-- 显式授权（Supabase 默认通常已包含，写出来更稳妥）：
-- 只给 anon / authenticated 读与插入，不给 update / delete。
grant usage on schema public to anon, authenticated;
grant select, insert on public.messages to anon, authenticated;
revoke update, delete on public.messages from anon, authenticated;
