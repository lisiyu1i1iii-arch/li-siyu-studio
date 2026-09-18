import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Move3d, Phone } from "lucide-react";

import PrintButton from "@/components/PrintButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { findSection, findSetting, groupSkills, loadPortfolioData } from "@/lib/data";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PortfolioData } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "HR 模式 · 李思雨简历（新媒体运营）",
  description:
    "李思雨的新媒体运营简历：3 年校园新媒体实战经验，运营经历、项目经历、技能标签、奖项证书与联系方式，支持打印导出 PDF。",
  alternates: { canonical: "/cv" },
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground">
      <span className="h-3.5 w-1 rounded-full bg-primary" />
      {children}
    </h2>
  );
}

function LevelDots({ level }: { level: number }) {
  return (
    <span className="font-mono text-xs tracking-widest text-primary">
      {"●".repeat(level)}
      <span className="text-muted-foreground/30">{"●".repeat(5 - level)}</span>
    </span>
  );
}

export default async function CvPage() {
  const client = getSupabaseServerClient();
  const { data } = await loadPortfolioData(client);

  const hero = findSection(data, "hero");
  const about = findSection(data, "about");
  const contact = findSection(data, "contact");
  const profile = findSetting(data, "profile");

  const heroContent = (hero?.content ?? {}) as {
    name?: string;
    role?: string;
    city?: string;
    slogan?: string;
    summary?: string;
  };
  const aboutContent = (about?.content ?? {}) as {
    paragraphs?: string[];
    tags?: string[];
    facts?: { label: string; value: string }[];
  };
  const contactContent = (contact?.content ?? {}) as {
    email?: string;
    phone?: string;
    note?: string;
  };
  const profileValue = (profile?.value ?? {}) as {
    email?: string;
    phone?: string;
  };

  const name = heroContent.name ?? "李思雨";
  const email = contactContent.email ?? profileValue.email ?? "3334206878@qq.com";
  const phone = contactContent.phone ?? profileValue.phone ?? "19213397013";
  const skillGroups = groupSkills(data.skills);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: heroContent.role ?? "新媒体运营",
    email: `mailto:${email}`,
    telephone: phone,
    address: { "@type": "PostalAddress", addressLocality: heroContent.city ?? "重庆" },
    knowsAbout: data.skills.map((s) => s.name),
    award: data.awards.map((a) => a.title),
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-8 print:max-w-none print:px-0 print:py-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 顶部工具条（打印时隐藏） */}
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-2">
        <Button asChild size="sm" variant="ghost">
          <Link href="/">
            <Move3d className="h-4 w-4" /> 3D 模式
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <PrintButton />
        </div>
      </div>

      {/* 头部 */}
      <header className="print-block border-b pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{name}</h1>
        <p className="mt-1 text-sm font-medium text-primary">
          {heroContent.role ?? "新媒体运营 / 内容策划"}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Mail className="h-3.5 w-3.5" />
            <a href={`mailto:${email}`}>{email}</a>
          </span>
          <span className="inline-flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" />
            <a href={`tel:${phone}`}>{phone}</a>
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {heroContent.city ?? "重庆"}
          </span>
        </div>
        {heroContent.summary && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {heroContent.summary}
          </p>
        )}
      </header>

      <div className="mt-6 space-y-7">
        {/* 运营经历 */}
        {!!data.experiences.length && (
          <section className="print-block">
            <SectionTitle>运营经历</SectionTitle>
            <div className="space-y-4">
              {data.experiences.map((e) => (
                <article key={e.id}>
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h3 className="text-sm font-semibold text-foreground">{e.org}</h3>
                    {e.role && <span className="text-xs text-primary">{e.role}</span>}
                    {e.period && (
                      <span className="ml-auto text-xs text-muted-foreground">{e.period}</span>
                    )}
                  </div>
                  {e.description && (
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {e.description}
                    </p>
                  )}
                  {!!e.highlights?.length && (
                    <ul className="mt-1 space-y-0.5">
                      {e.highlights.map((h, i) => (
                        <li key={i} className="flex gap-1.5 text-xs text-muted-foreground">
                          <span className="text-primary">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 项目经历 */}
        {!!data.projects.length && (
          <section className="print-block">
            <SectionTitle>项目经历</SectionTitle>
            <div className="space-y-4">
              {data.projects.map((p) => (
                <article key={p.id}>
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
                    {p.period && (
                      <span className="ml-auto text-xs text-muted-foreground">{p.period}</span>
                    )}
                  </div>
                  {p.subtitle && <p className="text-xs text-primary">{p.subtitle}</p>}
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                  {!!p.tags?.length && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 技能 */}
        {!!skillGroups.length && (
          <section className="print-block">
            <SectionTitle>技能标签</SectionTitle>
            <div className="space-y-3">
              {skillGroups.map((group) => (
                <div key={group.category}>
                  <h3 className="mb-1.5 text-xs font-semibold text-foreground">
                    {group.category}
                  </h3>
                  <ul className="space-y-1">
                    {group.items.map((s) => (
                      <li
                        key={s.id}
                        className="flex items-center justify-between gap-4 text-xs text-muted-foreground"
                      >
                        <span>{s.name}</span>
                        <LevelDots level={s.level} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 奖项与证书 */}
        {!!data.awards.length && (
          <section className="print-block">
            <SectionTitle>奖项与证书</SectionTitle>
            <ul className="grid gap-1.5 sm:grid-cols-2 print:grid-cols-2">
              {data.awards.map((a) => (
                <li key={a.id} className="flex items-start gap-2 text-xs">
                  <span className="text-primary">•</span>
                  <span className="text-muted-foreground">
                    <span className="text-foreground">{a.title}</span>
                    {[a.issuer, a.year].filter(Boolean).length > 0 && (
                      <span>（{[a.issuer, a.year].filter(Boolean).join(" · ")}）</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 关于我 */}
        {!!aboutContent.paragraphs?.length && (
          <section className="print-block">
            <SectionTitle>关于我</SectionTitle>
            <div className="space-y-1.5">
              {aboutContent.paragraphs.map((p, i) => (
                <p key={i} className="text-xs leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </div>
            {!!aboutContent.tags?.length && (
              <div className="mt-2 flex flex-wrap gap-1">
                {aboutContent.tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-[10px]">
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <footer className="mt-8 border-t pt-4 text-[11px] text-muted-foreground">
        <p>
          {heroContent.slogan ?? "把每一次传播，做成一次有温度的对话。"}
        </p>
        <p className="no-print mt-1">
          想看看这些经历长什么样？
          <Link href="/" className="ml-1 text-primary underline underline-offset-2">
            进入 3D 小屋
          </Link>
        </p>
      </footer>
    </main>
  );
}
