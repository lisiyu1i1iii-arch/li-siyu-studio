"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Phone, X } from "lucide-react";

import { CONTACT, STUDIO_PROFILE } from "../data/studio-content";
import { Label, PaperGrain } from "./editorial";

/**
 * ENTRY · 居中联系方式 Modal
 *
 * 由 Entry 信箱打开；独立于 Studio 内部的 Contact Overlay。
 * 打开期间全屏 backdrop 锁定 Entry 底层交互（Door / Mailbox）。
 * 关闭方式：Close 按钮 / 点击背景 / ESC —— 均停留在 Entry，不进入 Studio。
 */
export default function EntryContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-[60] flex items-center justify-center bg-studio-ink/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-label="联系方式"
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.99 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[420px] overflow-hidden rounded-3xl border border-studio-ink/15 bg-studio-cream/95 p-7 shadow-2xl"
          >
            <PaperGrain />

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="关闭"
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-studio-ink/15 text-studio-ink transition-colors hover:bg-studio-ink/5"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative space-y-6">
              <header className="space-y-1.5">
                <Label>Contact</Label>
                <h2 className="font-serif text-3xl leading-none text-studio-ink">
                  {STUDIO_PROFILE.name}
                </h2>
                <p className="text-[10px] uppercase tracking-[0.32em] text-studio-ink-soft/60">
                  My Little Studio
                </p>
              </header>

              <ul className="space-y-2">
                <ContactRow
                  icon={Phone}
                  label="Phone"
                  value={CONTACT.phone}
                  href={`tel:${CONTACT.phone}`}
                />
                <ContactRow
                  icon={Mail}
                  label="Email"
                  value={CONTACT.email}
                  href={`mailto:${CONTACT.email}`}
                />
              </ul>

              <p className="text-[10px] uppercase tracking-[0.25em] text-studio-ink-soft/50">
                Esc 或点击背景关闭
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
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
