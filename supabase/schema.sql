-- =============================================================
-- 李思雨的新媒体运营作品集 · Supabase 数据库结构
-- 在 Supabase 控制台 -> SQL Editor 中整段粘贴执行即可
-- =============================================================

create extension if not exists "pgcrypto";

-- ---------------- sections：关于我 / 页面文案 ----------------
create table if not exists public.sections (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,          -- about / hero / contact ...
  title       text not null default '',
  content     jsonb not null default '{}'::jsonb,
  visible     boolean not null default true,
  sort        int not null default 0,
  updated_at  timestamptz not null default now()
);

-- ---------------- projects：项目经历 ----------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  subtitle    text not null default '',
  description text not null default '',
  tags        text[] not null default '{}',
  link        text not null default '',
  period      text not null default '',
  visible     boolean not null default true,
  sort        int not null default 0,
  updated_at  timestamptz not null default now()
);

-- ---------------- experiences：运营经历 ----------------
create table if not exists public.experiences (
  id          uuid primary key default gen_random_uuid(),
  org         text not null,                 -- 组织 / 项目名
  role        text not null default '',      -- 担任角色
  period      text not null default '',
  description text not null default '',
  highlights  text[] not null default '{}',
  visible     boolean not null default true,
  sort        int not null default 0,
  updated_at  timestamptz not null default now()
);

-- ---------------- skills：技能（1-5 熟练度） ----------------
create table if not exists public.skills (
  id          uuid primary key default gen_random_uuid(),
  category    text not null,                 -- 内容运营 / 设计剪辑 / 数据与AI工具
  name        text not null,
  level       int not null default 3 check (level between 1 and 5),
  visible     boolean not null default true,
  sort        int not null default 0,
  updated_at  timestamptz not null default now()
);

-- ---------------- awards：奖项与证书 ----------------
create table if not exists public.awards (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  issuer      text not null default '',
  year        text not null default '',
  category    text not null default '证书',  -- 奖项 / 证书
  visible     boolean not null default true,
  sort        int not null default 0,
  updated_at  timestamptz not null default now()
);

-- ---------------- settings：站点级配置（键值） ----------------
create table if not exists public.settings (
  key         text primary key,              -- name / email / phone / pdfUrl ...
  value       jsonb not null default '{}'::jsonb,
  visible     boolean not null default true,
  sort        int not null default 0,
  updated_at  timestamptz not null default now()
);

-- ---------------- updated_at 自动维护 ----------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['sections','projects','experiences','skills','awards','settings']
  loop
    execute format('drop trigger if exists trg_touch_%1$s on public.%1$s', t);
    execute format('create trigger trg_touch_%1$s before update on public.%1$s
                    for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- =============================================================
-- 行级安全：所有人可读，只有登录管理员可写
-- =============================================================
do $$
declare t text;
begin
  foreach t in array array['sections','projects','experiences','skills','awards','settings']
  loop
    execute format('alter table public.%1$s enable row level security', t);

    execute format('drop policy if exists "public_read_%1$s" on public.%1$s', t);
    execute format('create policy "public_read_%1$s" on public.%1$s
                    for select using (true)', t);

    execute format('drop policy if exists "auth_write_%1$s" on public.%1$s', t);
    execute format('create policy "auth_write_%1$s" on public.%1$s
                    for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- =============================================================
-- 实时：让 /admin 的修改在前台实时生效（可选，前端已做轮询兜底）
-- =============================================================
do $$
declare t text;
begin
  foreach t in array array['sections','projects','experiences','skills','awards','settings']
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%1$s', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;
