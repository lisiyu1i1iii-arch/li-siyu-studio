"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import {
  ArrowLeft,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { TableName } from "@/lib/types";

type FieldType = "text" | "textarea" | "number" | "tags" | "json" | "switch";

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  wide?: boolean;
}

interface TableDef {
  name: TableName;
  label: string;
  hint: string;
  primaryKey: string;
  fields: FieldDef[];
  blank: Record<string, unknown>;
}

type Row = Record<string, unknown> & { id?: string };

const TABLES: TableDef[] = [
  {
    name: "projects",
    label: "项目经历",
    hint: "对应 3D 场景中书桌上的亮屏电脑",
    primaryKey: "id",
    fields: [
      { key: "title", label: "标题", type: "text", wide: true },
      { key: "subtitle", label: "副标题", type: "text" },
      { key: "period", label: "时间", type: "text", placeholder: "2024.09 - 2025.06" },
      { key: "description", label: "描述（支持 **加粗** 与 [链接](url)）", type: "textarea", wide: true },
      { key: "tags", label: "标签（用逗号分隔）", type: "tags", wide: true },
      { key: "link", label: "外链", type: "text", wide: true },
      { key: "visible", label: "前台可见", type: "switch" },
      { key: "sort", label: "排序", type: "number" },
    ],
    blank: {
      title: "",
      subtitle: "",
      period: "",
      description: "",
      tags: [],
      link: "",
      visible: true,
      sort: 99,
    },
  },
  {
    name: "experiences",
    label: "运营经历",
    hint: "对应 3D 场景中的沙发 + 茶几",
    primaryKey: "id",
    fields: [
      { key: "org", label: "组织 / 项目", type: "text", wide: true },
      { key: "role", label: "角色", type: "text" },
      { key: "period", label: "时间", type: "text" },
      { key: "description", label: "描述", type: "textarea", wide: true },
      { key: "highlights", label: "亮点（每行一条，或用逗号分隔）", type: "tags", wide: true },
      { key: "visible", label: "前台可见", type: "switch" },
      { key: "sort", label: "排序", type: "number" },
    ],
    blank: {
      org: "",
      role: "",
      period: "",
      description: "",
      highlights: [],
      visible: true,
      sort: 99,
    },
  },
  {
    name: "skills",
    label: "技能",
    hint: "对应 3D 场景中右侧的书架",
    primaryKey: "id",
    fields: [
      { key: "category", label: "分类", type: "text", placeholder: "内容运营 / 设计剪辑 / 数据与AI工具" },
      { key: "name", label: "技能名", type: "text" },
      { key: "level", label: "熟练度 1-5", type: "number" },
      { key: "visible", label: "前台可见", type: "switch" },
      { key: "sort", label: "排序", type: "number" },
    ],
    blank: { category: "内容运营", name: "", level: 3, visible: true, sort: 99 },
  },
  {
    name: "awards",
    label: "奖项证书",
    hint: "对应 3D 场景中左侧的软木板照片墙",
    primaryKey: "id",
    fields: [
      { key: "title", label: "名称", type: "text", wide: true },
      { key: "issuer", label: "颁发方", type: "text" },
      { key: "year", label: "年份", type: "text" },
      { key: "category", label: "类型", type: "text", placeholder: "奖项 / 荣誉 / 证书" },
      { key: "visible", label: "前台可见", type: "switch" },
      { key: "sort", label: "排序", type: "number" },
    ],
    blank: { title: "", issuer: "", year: "", category: "奖项", visible: true, sort: 99 },
  },
  {
    name: "sections",
    label: "页面文案",
    hint: "hero / about / contact 等文案段落",
    primaryKey: "id",
    fields: [
      { key: "key", label: "标识 key", type: "text", placeholder: "hero / about / contact" },
      { key: "title", label: "标题", type: "text" },
      { key: "content", label: "内容 JSON", type: "json", wide: true },
      { key: "visible", label: "前台可见", type: "switch" },
      { key: "sort", label: "排序", type: "number" },
    ],
    blank: { key: "custom", title: "", content: {}, visible: true, sort: 99 },
  },
  {
    name: "settings",
    label: "站点设置",
    hint: "联系方式、PDF 地址等",
    primaryKey: "key",
    fields: [
      { key: "key", label: "键名", type: "text", placeholder: "profile / room" },
      { key: "value", label: "值 JSON", type: "json", wide: true },
      { key: "visible", label: "启用", type: "switch" },
      { key: "sort", label: "排序", type: "number" },
    ],
    blank: { key: "custom", value: {}, visible: true, sort: 99 },
  },
];

/* ------------------------------------------------------------------ */
/* 登录                                                                */
/* ------------------------------------------------------------------ */
function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      toast.error("还没有配置 Supabase，请先填写 .env.local");
      return;
    }
    setBusy(true);
    try {
      const { error } =
        mode === "signin"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (error) throw error;
      toast.success(mode === "signin" ? "登录成功" : "注册成功，请查收验证邮件");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "操作失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-5">
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <h1 className="text-xl font-semibold">作品集后台</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin" ? "用邮箱登录后即可编辑内容" : "创建一个管理员邮箱账号"}
          </p>

          <form onSubmit={submit} className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少 6 位"
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "登录" : "注册"}
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <button
              type="button"
              className="underline underline-offset-2 hover:text-foreground"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? "没有账号？去注册" : "已有账号？去登录"}
            </button>
            <Link href="/" className="underline underline-offset-2 hover:text-foreground">
              返回前台
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 单行编辑器                                                          */
/* ------------------------------------------------------------------ */
function toDraft(row: Row, fields: FieldDef[]): Record<string, unknown> {
  const draft: Record<string, unknown> = { ...row };
  fields.forEach((f) => {
    if (f.type === "tags") {
      const value = row[f.key];
      draft[f.key] = Array.isArray(value) ? value.join("\n") : String(value ?? "");
    }
    if (f.type === "json") {
      draft[f.key] = JSON.stringify(row[f.key] ?? {}, null, 2);
    }
  });
  return draft;
}

function fromDraft(
  draft: Record<string, unknown>,
  fields: FieldDef[],
): { payload: Record<string, unknown>; error?: string } {
  const payload: Record<string, unknown> = {};

  for (const f of fields) {
    const raw = draft[f.key];
    switch (f.type) {
      case "tags":
        payload[f.key] = String(raw ?? "")
          .split(/[\n,，、]/)
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      case "json":
        try {
          payload[f.key] = JSON.parse(String(raw ?? "{}"));
        } catch {
          return { payload, error: `${f.label} 不是合法的 JSON` };
        }
        break;
      case "number":
        payload[f.key] = Number(raw) || 0;
        break;
      case "switch":
        payload[f.key] = Boolean(raw);
        break;
      default:
        payload[f.key] = String(raw ?? "");
    }
  }

  return { payload };
}

function RowEditor({
  table,
  row,
  onChanged,
}: {
  table: TableDef;
  row: Row;
  onChanged: () => void;
}) {
  const [draft, setDraft] = useState<Record<string, unknown>>(() =>
    toDraft(row, table.fields),
  );
  const [busy, setBusy] = useState(false);
  const isNew = !row[table.primaryKey];

  const set = (key: string, value: unknown) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const { payload, error } = fromDraft(draft, table.fields);
    if (error) {
      toast.error(error);
      return;
    }

    setBusy(true);
    try {
      if (isNew) {
        const { error: insertError } = await supabase.from(table.name).insert(payload);
        if (insertError) throw insertError;
        toast.success("已新增");
      } else {
        const { error: updateError } = await supabase
          .from(table.name)
          .update(payload)
          .eq(table.primaryKey, row[table.primaryKey]);
        if (updateError) throw updateError;
        toast.success("已保存，前台会自动刷新");
      }
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || isNew) return;
    if (!window.confirm("确定删除这条内容吗？")) return;

    setBusy(true);
    try {
      const { error } = await supabase
        .from(table.name)
        .delete()
        .eq(table.primaryKey, row[table.primaryKey]);
      if (error) throw error;
      toast.success("已删除");
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "删除失败");
    } finally {
      setBusy(false);
    }
  };

  const visible = Boolean(draft.visible);

  return (
    <Card className={visible ? "" : "opacity-60"}>
      <CardContent className="pt-5">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant={isNew ? "default" : "secondary"}>
            {isNew ? "新增" : String(row[table.primaryKey] ?? "").slice(0, 8)}
          </Badge>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            {visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            {visible ? "前台可见" : "前台隐藏"}
          </span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" onClick={save} disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              保存
            </Button>
            {!isNew && (
              <Button size="sm" variant="ghost" onClick={remove} disabled={busy}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {table.fields.map((f) => (
            <div
              key={f.key}
              className={`space-y-1.5 ${f.wide ? "sm:col-span-2" : ""}`}
            >
              <Label className="text-xs text-muted-foreground">{f.label}</Label>
              {f.type === "textarea" || f.type === "json" ? (
                <Textarea
                  rows={f.type === "json" ? 6 : 3}
                  className="font-mono text-xs"
                  value={String(draft[f.key] ?? "")}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              ) : f.type === "tags" ? (
                <Textarea
                  rows={3}
                  value={String(draft[f.key] ?? "")}
                  placeholder={f.placeholder ?? "每行一条"}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              ) : f.type === "switch" ? (
                <div className="flex h-10 items-center">
                  <Switch checked={visible} onCheckedChange={(v) => set(f.key, v)} />
                </div>
              ) : (
                <Input
                  type={f.type === "number" ? "number" : "text"}
                  value={String(draft[f.key] ?? "")}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* 数据表面板                                                          */
/* ------------------------------------------------------------------ */
function TablePanel({ table }: { table: TableDef }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from(table.name)
      .select("*")
      .order("sort", { ascending: true });

    if (error) toast.error(`${table.label} 读取失败：${error.message}`);
    setRows((data as Row[]) ?? []);
    setLoading(false);
  }, [table.name, table.label]);

  useEffect(() => {
    void load();
  }, [load]);

  const onChanged = useCallback(() => {
    setAdding(false);
    void load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm text-muted-foreground">{table.hint}</p>
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="outline" onClick={() => void load()}>
            <RefreshCw className="h-4 w-4" /> 刷新
          </Button>
          <Button size="sm" onClick={() => setAdding(true)} disabled={adding}>
            <Plus className="h-4 w-4" /> 新增
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> 加载中…
        </div>
      )}

      {adding && (
        <RowEditor
          table={table}
          row={{ ...table.blank } as Row}
          onChanged={onChanged}
        />
      )}

      {rows.map((row) => (
        <RowEditor
          key={String(row[table.primaryKey])}
          table={table}
          row={row}
          onChanged={onChanged}
        />
      ))}

      {!loading && !rows.length && !adding && (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          还没有数据，点「新增」或先跑一次 <code className="mx-1">npm run seed</code>。
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 主面板                                                              */
/* ------------------------------------------------------------------ */
export default function AdminPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setChecking(false);
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const configured = useMemo(() => isSupabaseConfigured, []);

  if (!configured) {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center gap-3 px-5 text-center">
        <h1 className="text-lg font-semibold">还没有连接 Supabase</h1>
        <p className="text-sm text-muted-foreground">
          把 <code>.env.local.example</code> 复制成 <code>.env.local</code>，填好
          <code className="mx-1">NEXT_PUBLIC_SUPABASE_URL</code> 和
          <code className="mx-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>，然后重启开发服务器。
        </p>
        <Button asChild>
          <Link href="/">返回前台</Link>
        </Button>
      </div>
    );
  }

  if (checking) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> 校验登录状态…
      </div>
    );
  }

  if (!session) return <LoginCard />;

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-8">
      <header className="mb-6 flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-xl font-semibold">作品集后台</h1>
          <p className="text-xs text-muted-foreground">
            已登录：{session.user.email} · 保存后前台实时生效
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> 回前台
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={async () => {
              await getSupabaseBrowserClient()?.auth.signOut();
              toast.success("已退出登录");
            }}
          >
            <LogOut className="h-4 w-4" /> 退出
          </Button>
        </div>
      </header>

      <Tabs defaultValue="projects">
        <TabsList className="no-scrollbar flex w-full justify-start overflow-x-auto">
          {TABLES.map((t) => (
            <TabsTrigger key={t.name} value={t.name}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABLES.map((t) => (
          <TabsContent key={t.name} value={t.name}>
            <TablePanel table={t} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
