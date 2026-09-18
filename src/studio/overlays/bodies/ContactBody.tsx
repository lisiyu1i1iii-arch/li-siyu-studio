"use client";

import Link from "next/link";
import { Mail, Phone, Send } from "lucide-react";

import { CONTACT } from "../../data/studio-content";
import { useStudioStore } from "../../store/studio-store";
import { Label } from "../../ui/editorial";

export default function ContactBody() {
  // 进入留言页前只关闭 Overlay，保留 focusedObject / cameraTarget，
  // 退出留言后直接回到圆桌放大视角，不再弹出 Contact 信息页。
  const closeOverlay = useStudioStore((s) => s.closeOverlay);
  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-2xl border border-studio-ink/10 bg-studio-paper/80 p-6">
        <div className="studio-grain pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-multiply" aria-hidden />
        <div className="relative space-y-2">
          <Label>Open the letter</Label>
          <h2 className="font-serif text-3xl leading-none text-studio-ink">
            {CONTACT.headline}
          </h2>
          <p className="text-sm tracking-[0.25em] text-studio-ink-soft/70">
            {CONTACT.name}
          </p>
          <p className="pt-2 text-sm leading-relaxed text-studio-ink-soft">
            {CONTACT.note}
          </p>
        </div>
      </section>

      <ul className="space-y-2">
        <ContactRow
          icon={Mail}
          label="Email"
          value={CONTACT.email}
          href={`mailto:${CONTACT.email}`}
        />
        <ContactRow
          icon={Phone}
          label="Phone"
          value={CONTACT.phone}
          href={`tel:${CONTACT.phone}`}
        />
      </ul>

      <Link
        href="/guestbook"
        onClick={() => closeOverlay()}
        className="inline-flex items-center gap-2 rounded-full bg-studio-ink px-6 py-3 text-xs font-medium tracking-[0.15em] text-studio-cream transition-colors hover:bg-studio-ember"
      >
        <Send className="h-3.5 w-3.5" /> 请在我的网站留言
      </Link>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <Icon className="h-4 w-4 shrink-0 text-studio-ember" />
      <span className="text-[10px] uppercase tracking-[0.2em] text-studio-ink-soft/60">
        {label}
      </span>
      <span className="ml-auto min-w-0 truncate text-sm font-medium text-studio-ink">
        {value}
      </span>
    </>
  );

  if (href) {
    return (
      <li>
        <a
          href={href}
          className="flex items-center gap-3 rounded-xl border border-studio-ink/10 bg-studio-paper/70 px-4 py-3 transition-colors hover:bg-studio-sun/10"
        >
          {content}
        </a>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 rounded-xl border border-studio-ink/10 bg-studio-paper/70 px-4 py-3">
      {content}
    </li>
  );
}
