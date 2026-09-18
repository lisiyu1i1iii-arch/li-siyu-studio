"use client";

/**
 * 音效系统：
 * · UI 提示音（click / open / close / switch）用 WebAudio 合成，不引入音频文件。
 * · 猫叫 / 狗叫 / 网站 BGM 使用 public/assets/audio 下的真实音频文件。
 * 用户关闭后写入 localStorage，下次进入不再播放。
 *
 * 注：夜晚雨声系统已按要求彻底移除。
 */

const KEY = "lisi-sound-enabled";
let ctx: AudioContext | null = null;

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) !== "off";
}

export function setSoundEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, enabled ? "on" : "off");
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type Tone = "click" | "open" | "close" | "switch";

const TONES: Record<Tone, { freq: number; type: OscillatorType; dur: number }> = {
  click: { freq: 660, type: "triangle", dur: 0.09 },
  open: { freq: 520, type: "sine", dur: 0.22 },
  close: { freq: 380, type: "sine", dur: 0.16 },
  switch: { freq: 300, type: "square", dur: 0.14 },
};

export function playTone(tone: Tone = "click") {
  if (!isSoundEnabled()) return;
  const audio = getCtx();
  if (!audio) return;

  const { freq, type, dur } = TONES[tone];
  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime);
  osc.frequency.exponentialRampToValueAtTime(
    tone === "open" ? freq * 1.5 : freq * 0.7,
    audio.currentTime + dur,
  );

  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.06, audio.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + dur);

  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + dur + 0.02);
}

/* ================================================================== */
/**
 * 真实音频文件（public/assets/audio）：
 *   · 猫叫.wav  —— 真实 click 触发一次，不循环，drag 不播放
 *   · 狗叫.wav  —— 真实 click 触发一次，不循环，drag 不播放
 *   · 网站BGM.mp3 —— 进入 Studio 后循环播放，全局唯一实例
 *
 * 不使用 WebAudio synth fallback 替代真实文件；播放被浏览器拒绝时静默降级，
 * 绝不抛出错误、也不影响页面。
 */
const CAT_SRC = "/assets/audio/猫叫.wav";
const DOG_SRC = "/assets/audio/狗叫.wav";
const BGM_SRC = "/assets/audio/网站BGM.mp3";

const fileCache = new Map<string, HTMLAudioElement>();

function getAudio(src: string): HTMLAudioElement {
  let audio = fileCache.get(src);
  if (!audio) {
    audio = new Audio(src);
    audio.preload = "auto";
    fileCache.set(src, audio);
  }
  return audio;
}

/** 播放一次音频文件（不循环），失败时静默忽略。volume 只影响本文件的播放音量。 */
function playOnce(src: string, volume = 1) {
  if (typeof window === "undefined") return;
  const audio = getAudio(src);
  audio.volume = volume;
  try {
    audio.currentTime = 0;
  } catch {
    /* 元数据未就绪时可能抛错，忽略 */
  }
  const p = audio.play();
  if (p && typeof p.catch === "function") p.catch(() => {});
}

/**
 * 狗叫.wav 的原始响度比 猫叫.wav 高约 1.24 倍（RMS -18.8dB vs -20.7dB）。
 * 播放时降到 0.8，使实际听感与猫叫基本一致。猫叫 / BGM 音量不受影响。
 */
const DOG_VOLUME = 0.8;

/** 猫叫：真实 click 触发一次（保持原始音量） */
export function playCatMeow() {
  if (!isSoundEnabled()) return;
  playOnce(CAT_SRC);
}

/** 狗叫：真实 click 触发一次（音量 0.8，与猫叫感知响度一致） */
export function playDogBark() {
  if (!isSoundEnabled()) return;
  playOnce(DOG_SRC, DOG_VOLUME);
}

/* ------------------------------------------------------------------ */
/**
 * 全局唯一 BGM 实例。
 *
 * 卡顿排查结论：此前已经使用模块级单例，不存在多个实例同时播放，
 * 也不会在 rerender / overlay / focus / day-night / QuickMenu 变化时重建。
 * 唯一可能造成「有时卡卡的」的是：点击 ENTER 后 Audio 才开始下载 3.6MB 的
 * 网站BGM.mp3，边播边缓冲；以及重复调用 play()。
 *
 * 优化：
 *   · 模块级单例，只 new Audio 一次；不重复设置 src、不重复 load。
 *   · preload="auto"，并在进入 Studio 之前先 preloadBgm() 提前缓冲。
 *   · startBgm() 幂等：正在播放时直接返回，绝不重复 play/pause。
 *   · 音量保持 0.25 不变。
 */
let bgmEl: HTMLAudioElement | null = null;

function getBgm(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!bgmEl) {
    bgmEl = new Audio(BGM_SRC);
    bgmEl.loop = true;
    bgmEl.volume = 0.25;
    bgmEl.preload = "auto";
    bgmEl.addEventListener("error", () => {
      /* 文件缺失时保持静默，不影响页面 */
    });
  }
  return bgmEl;
}

/**
 * 预加载 BGM（不播放）：进入 Studio 前就缓冲好，避免边播边缓冲的卡顿。
 * 只创建一次，重复调用无副作用；声音关闭时不加载。
 */
export function preloadBgm() {
  if (!isSoundEnabled()) return;
  getBgm();
}

export function startBgm() {
  if (typeof window === "undefined") return;
  if (!isSoundEnabled()) return;
  const el = getBgm();
  if (!el) return;
  // 幂等：已在播放则不重复 play()
  if (!el.paused) return;
  const p = el.play();
  if (p && typeof p.catch === "function") p.catch(() => {});
}

export function stopBgm() {
  if (!bgmEl) return;
  try {
    bgmEl.pause();
  } catch {
    /* ignore */
  }
}
