"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2, Send } from "lucide-react";

import VintageKeyboard from "./VintageKeyboard";
import {
  fetchMessages,
  fallbackPlacement,
  insertMessage,
  noteColor,
  randomNotePlacement,
  type GuestbookMessage,
} from "@/lib/guestbook";
import { isSupabaseConfigured } from "@/lib/supabase/client";

function fallbackRotation(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return ((hash % 800) / 100) - 4;
}

export default function GuestbookExperience() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [text, setText] = useState("");
  const [shift, setShift] = useState(false);
  const [pressed, setPressed] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pulseTimers = useRef<Record<string, number>>({});

  /* 进入页面：从 Supabase 读取已有留言 */
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const { data, error } = await fetchMessages();
      if (!alive) return;
      setMessages(data);
      setLoadError(error);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* 清理按键动画定时器 */
  useEffect(() => {
    const timers = pulseTimers.current;
    return () => {
      Object.values(timers).forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const pulse = useCallback((key: string) => {
    setPressed((prev) => ({ ...prev, [key]: Date.now() }));
    if (pulseTimers.current[key]) window.clearTimeout(pulseTimers.current[key]);
    pulseTimers.current[key] = window.setTimeout(() => {
      setPressed((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }, 130);
  }, []);

  const insertText = (str: string) => {
    const el = textareaRef.current;
    if (!el) {
      setText((prev) => (prev + str).slice(0, 500));
      return;
    }
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? start;
    setText((prev) => (prev.slice(0, start) + str + prev.slice(end)).slice(0, 500));
    requestAnimationFrame(() => {
      el.focus();
      const pos = Math.min(start + str.length, el.value.length);
      el.setSelectionRange(pos, pos);
    });
  };

  const deleteBackward = () => {
    const el = textareaRef.current;
    if (!el) {
      setText((prev) => prev.slice(0, -1));
      return;
    }
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? start;
    if (start === end && start === 0) return;
    const nextStart = start === end ? start - 1 : start;
    setText((prev) => prev.slice(0, nextStart) + prev.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(nextStart, nextStart);
    });
  };

  const submit = async () => {
    if (submitting) return;
    const content = text.trim();
    if (!content) {
      setSubmitError("先写点什么再寄出吧。");
      return;
    }
    if (!isSupabaseConfigured) {
      setSubmitError("留言服务尚未连接，暂时无法永久保存。");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    const { position, rotation } = randomNotePlacement();
    const { data, error } = await insertMessage(content, position, rotation);
    setSubmitting(false);
    if (error || !data) {
      setSubmitError(error ?? "保存失败，请稍后再试。");
      return;
    }
    setMessages((prev) => [...prev, data]);
    setText("");
    textareaRef.current?.focus();
  };

  /* 物理键盘：按键动画；Enter 提交，Shift+Enter 换行。
   * 中文输入法（IME）走 composition 事件，keydown 会带 isComposing=true；
   * 这里不再直接 return，而是照常触发按键动效，保证中文输入时键盘反馈与英文一致，
   * 同时避免在组合输入中误提交 / 误插入（交给输入法处理）。 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Shift") {
      setShift(true);
      return;
    }
    const composing = e.nativeEvent.isComposing;

    if (e.key === "Enter") {
      // 组合输入中：Enter 用于确认候选词 → 只做按键动效，不提交、不阻止默认
      pulse("enter");
      if (composing) return;
      if (e.shiftKey) return;
      e.preventDefault();
      void submit();
      return;
    }

    if (e.key === "Backspace") {
      pulse("backspace");
      return;
    }

    if (e.key === " ") {
      pulse("space");
      return;
    }

    // 拼音字母 / 数字：组合输入中也照常跳动
    if (/^[a-zA-Z0-9]$/.test(e.key)) {
      pulse(e.key.toLowerCase());
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Shift") setShift(false);
  };

  /* 输入法组合输入：部分环境（尤其移动端）不派发可用的 keydown，
   * 这里根据 composition 的最新字符补充按键动效，保证中文拼音输入时键盘同样跳动。 */
  const handleCompositionUpdate = (
    e: React.CompositionEvent<HTMLTextAreaElement>,
  ) => {
    const data = e.data;
    if (!data) return;
    const ch = data[data.length - 1];
    if (/^[a-zA-Z0-9]$/.test(ch)) pulse(ch.toLowerCase());
  };

  /* 屏幕键盘点击 */
  const onScreenPress = (key: string) => {
    if (key === "shift") {
      setShift((s) => !s);
      pulse("shift");
      return;
    }
    if (key === "enter") {
      if (shift) {
        insertText("\n");
        pulse("enter");
        return;
      }
      pulse("enter");
      void submit();
      return;
    }
    if (key === "backspace") {
      deleteBackward();
      pulse("backspace");
      return;
    }
    if (key === "space") {
      insertText(" ");
      pulse("space");
      return;
    }
    const ch = shift && /^[a-z]$/.test(key) ? key.toUpperCase() : key;
    insertText(ch);
    pulse(key);
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-studio-paper text-studio-ink">
      <div
        className="studio-grain pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-multiply"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(240,164,74,0.20),transparent_58%)]"
        aria-hidden
      />

      {/* 便签墙：四周空白区域，位于中央内容之下，不遮挡输入区与键盘 */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <AnimatePresence>
          {messages.map((message, index) => (
            <StickyNote key={message.id} message={message} index={index} />
          ))}
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        {/* 顶部：返回 + 右上角手写提问 */}
        <header className="flex items-start justify-between gap-4 px-5 py-5 sm:px-8 sm:py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-studio-ink/15 bg-studio-cream/80 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-studio-ink transition-colors hover:bg-studio-sun/15"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> 回到工作室
          </Link>

          <div className="max-w-[62%] text-right sm:max-w-[46%]">
            <p className="-rotate-2 font-serif text-xl leading-snug text-studio-ink sm:text-2xl">
              <span className="bg-studio-sun/35 px-1 [box-decoration-break:clone]">
                留言会生成标签永久保存在这里：）
              </span>
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-studio-ink-soft/60">
              Leave a message
            </p>
          </div>
        </header>

        {/* 中央输入区 */}
        <section className="mx-auto flex w-full max-w-[720px] flex-1 flex-col justify-center px-5">
          {!isSupabaseConfigured && (
            <div className="mb-4 rounded-2xl border border-studio-ember/40 bg-studio-sun/15 px-4 py-3 text-xs leading-relaxed text-studio-ink">
              留言服务尚未连接：Supabase 未配置。请先执行
              <code className="mx-1 rounded bg-studio-ink/10 px-1">supabase/messages.sql</code>
              并配置环境变量，留言才能真正永久保存。
            </div>
          )}
          {isSupabaseConfigured && loadError && (
            <div className="mb-4 rounded-2xl border border-studio-ember/40 bg-studio-sun/15 px-4 py-3 text-xs leading-relaxed text-studio-ink">
              {loadError}
            </div>
          )}

          <div className="relative rounded-3xl border border-studio-ink/10 bg-studio-cream/95 p-5 shadow-2xl backdrop-blur-sm sm:p-6">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              onCompositionUpdate={handleCompositionUpdate}
              maxLength={500}
              rows={4}
              placeholder="写下想说的话…（Enter 寄出，Shift + Enter 换行）"
              className="no-scrollbar w-full resize-none bg-transparent font-serif text-lg leading-relaxed text-studio-ink outline-none placeholder:text-studio-ink-soft/45"
            />
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-studio-ink/10 pt-3">
              <span className="studio-nums text-[11px] text-studio-ink-soft/60">
                {text.length} / 500
              </span>
              <button
                type="button"
                onClick={() => void submit()}
                disabled={submitting || !text.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-studio-ink px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-studio-cream transition-colors hover:bg-studio-ember disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                寄出
              </button>
            </div>
          </div>

          {submitError && (
            <p className="mt-3 text-center text-xs text-studio-ember">{submitError}</p>
          )}

          {loading && isSupabaseConfigured && (
            <p className="mt-3 text-center text-[11px] text-studio-ink-soft/60">
              正在读取留言…
            </p>
          )}
        </section>

        {/* 底部键盘 */}
        <div className="px-3 pb-4 pt-5 sm:px-6 sm:pb-6">
          <VintageKeyboard shiftOn={shift} pressed={pressed} onPress={onScreenPress} />
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
function StickyNote({ message, index }: { message: GuestbookMessage; index: number }) {
  const pos = message.position ?? fallbackPlacement(message.id);
  const rotation = message.rotation ?? fallbackRotation(message.id);
  const color = noteColor(message.id);

  return (
    <div
      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%` }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: -16, rotate: rotation - 8 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: rotation }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{
          type: "spring",
          stiffness: 240,
          damping: 20,
          delay: Math.min(index * 0.02, 0.4),
        }}
        style={{ backgroundColor: color }}
        className="pointer-events-auto relative w-[140px] rounded-[3px] px-3 pb-3 pt-4 shadow-[0_10px_20px_-10px_rgba(43,33,24,0.55)] sm:w-[160px]"
      >
        <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-[#b4552d] shadow-[0_2px_3px_rgba(0,0,0,0.35)] ring-2 ring-[#e6b98a]/70">
          <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-white/60" />
        </span>
        <p className="whitespace-pre-wrap break-words text-[11px] leading-relaxed text-[#4a3524] sm:text-xs">
          {message.content}
        </p>
      </motion.div>
    </div>
  );
}
