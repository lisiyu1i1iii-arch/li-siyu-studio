"use client";

import type { ReactNode } from "react";

import type { Metric as MetricType } from "../types";

/** 纸张颗粒：铺在内容层最上方，营造 analog 质感 */
export function PaperGrain({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`studio-grain pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply ${className}`}
    />
  );
}

/** 小标签：板块 / 字段的英文注脚 */
export function Label({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`text-[10px] uppercase tracking-[0.28em] text-studio-ink-soft/60 ${className}`}
    >
      {children}
    </span>
  );
}

export function Rule({ className = "" }: { className?: string }) {
  return <div className={`h-px w-full bg-studio-ink/10 ${className}`} />;
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-studio-ink/15 bg-studio-paper/70 px-2.5 py-0.5 text-[10px] text-studio-ink-soft">
      {children}
    </span>
  );
}

/** 数字是视觉重点：大字号 + tabular-nums */
export function MetricBlock({
  value,
  label,
  size = "md",
}: MetricType & { size?: "sm" | "md" | "lg" }) {
  const valueSize =
    size === "lg"
      ? "text-4xl sm:text-5xl"
      : size === "sm"
        ? "text-xl sm:text-2xl"
        : "text-2xl sm:text-3xl";

  return (
    <div className="min-w-0">
      <div
        className={`studio-nums font-serif leading-none text-studio-ink ${valueSize}`}
      >
        {value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-studio-ink-soft/60">
        {label}
      </div>
    </div>
  );
}

export function MetricGrid({
  metrics,
  size = "md",
  columns = 3,
}: {
  metrics: MetricType[];
  size?: "sm" | "md" | "lg";
  columns?: 2 | 3 | 4;
}) {
  const cols =
    columns === 2
      ? "grid-cols-2"
      : columns === 4
        ? "grid-cols-2 sm:grid-cols-4"
        : "grid-cols-2 sm:grid-cols-3";

  return (
    <div className={`grid gap-x-4 gap-y-5 ${cols}`}>
      {metrics.map((metric) => (
        <MetricBlock key={metric.label} {...metric} size={size} />
      ))}
    </div>
  );
}

/** 带字段名的一段内容：CONTEXT / GOAL / PROBLEM ... */
export function Field({
  label,
  children,
  accent,
}: {
  label: string;
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="grid grid-cols-[72px_1fr] gap-3 sm:grid-cols-[92px_1fr]">
      <div
        className={`pt-0.5 text-[10px] uppercase leading-tight tracking-[0.18em] ${
          accent ? "text-studio-ember" : "text-studio-ink-soft/50"
        }`}
      >
        {label}
      </div>
      <div className="min-w-0 text-sm leading-relaxed text-studio-ink-soft">
        {children}
      </div>
    </div>
  );
}

export function BulletList({ items, tone = "sun" }: { items: string[]; tone?: "sun" | "moss" }) {
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className={tone === "moss" ? "text-studio-moss" : "text-studio-sun"}>
            ·
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** 素材占位：如实标注「待替换」，不伪造作品 */
export function CoverPlaceholder({
  index,
  caption,
  className = "",
}: {
  index: string;
  caption: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-xl border border-studio-ink/10 bg-gradient-to-br from-studio-sand via-studio-paper to-studio-sun/30 ${className}`}
    >
      <div className="studio-grain absolute inset-0 opacity-20 mix-blend-multiply" aria-hidden />
      <span className="studio-nums pointer-events-none absolute -right-1 -top-3 font-serif text-6xl text-studio-ink/10">
        {index}
      </span>
      <span className="relative text-[10px] uppercase tracking-[0.28em] text-studio-ink-soft/60">
        {caption}
      </span>
    </div>
  );
}
