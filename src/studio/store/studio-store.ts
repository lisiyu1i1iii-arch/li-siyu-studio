"use client";

import { create } from "zustand";

import { objectMeta } from "../data/studio-content";
import type {
  CameraTarget,
  CameraView,
  DayNightMode,
  LightPhase,
  SectionKey,
  StudioMode,
  StudioObjectId,
} from "../types";

/**
 * 统一的 experience / interaction state。
 * 组件之间不互相改状态，只调用这里的 action。
 *
 * 交互状态机（Camera Focus 与 Info Overlay 分离）：
 *
 *   NORMAL
 *     ↓ click（有信息的物品）
 *   FOCUSED_INFO_OPEN      camera focused + overlay open
 *     ↓ close overlay（关闭按钮 / Esc）
 *   FOCUSED_INFO_CLOSED    camera focused + overlay closed（相机保持放大）
 *     ↓ 再点击当前聚焦物品 / 点击「退出放大·返回」
 *   NORMAL                 恢复唯一 DEFAULT ROOM CAMERA
 *
 * 关键：关闭 Overlay 不再恢复相机；只有明确退出 Focus 才恢复默认镜头。
 * 特殊动作物体（宠物 / 风扇 / 灯 / 扫地机器人 / 电脑椅）与直接动画物体
 * （树木 / 地毯 / 多肉）不进入本状态机。
 */
interface StudioState {
  /* 生命周期 */
  entered: boolean;
  mode: StudioMode;
  menuOpen: boolean;

  /* 交互 */
  hoveredObject: StudioObjectId | null;
  activeObject: StudioObjectId | null;
  activeSection: SectionKey | null;
  /** infoOverlayState：信息 Overlay 是否打开 */
  overlayOpen: boolean;
  /** cameraFocusState：当前被 Camera Director 聚焦的物品（关闭 Overlay 后仍保留） */
  focusedObject: StudioObjectId | null;

  /* 相机 */
  cameraTarget: CameraTarget;
  cameraTick: number;
  /**
   * 保留字段：当前始终为 null。
   * 退出 Focus 时统一恢复为唯一 DEFAULT ROOM CAMERA
   * （STUDIO_VIEWS.default + BROWSE.fov）。
   */
  cameraOverride: CameraView | null;

  /* 摄影 Gallery */
  galleryIndex: number | null;

  /* 氛围 */
  lightPhase: LightPhase;
  /** 0 → 1，随探索推进，驱动 afternoon → golden hour */
  lightProgress: number;
  explored: StudioObjectId[];

  /* 偏好 */
  soundEnabled: boolean;

  /* 昼夜（统一 source of truth，三个灯具共享） */
  dayNight: DayNightMode;

  /* actions */
  enter: () => void;
  setHovered: (id: StudioObjectId | null) => void;
  /** 只聚焦（用于无信息、只放大的聚焦标签） */
  focusObject: (id: StudioObjectId) => void;
  /** 有信息物品：一次点击 = 聚焦 + 打开居中信息 Overlay */
  activateObject: (id: StudioObjectId) => void;
  /** 摄影相框：一次点击 = 聚焦 + 打开居中 Gallery */
  activatePhoto: (id: StudioObjectId, index: number) => void;
  /** 退出放大：恢复唯一 DEFAULT ROOM CAMERA（NORMAL） */
  exitFocus: () => void;
  /** QuickMenu / MenuPanel 快捷入口：等价于 activateObject */
  selectObject: (id: StudioObjectId) => void;
  openSection: (section: SectionKey) => void;
  /** 只关闭信息 Overlay，保持相机 Focus */
  closeOverlay: () => void;
  /** 只关闭摄影 Gallery，保持相机 Focus */
  closePhotoGallery: () => void;
  setGalleryIndex: (index: number) => void;
  setMode: (mode: StudioMode) => void;
  toggleMenu: () => void;
  closeMenu: () => void;
  returnToRoom: () => void;
  toggleSound: () => void;
  /** 显式设置声音开关（用于与 localStorage 真实状态同步，幂等） */
  setSoundEnabled: (enabled: boolean) => void;
  /** 白天 ⇄ 夜晚（落地灯 / 两个吊灯共享同一入口） */
  toggleDayNight: () => void;
}

const MAX_EXPLORED = 6;

export const useStudioStore = create<StudioState>((set, get) => ({
  entered: false,
  mode: "explore",
  menuOpen: false,

  hoveredObject: null,
  activeObject: null,
  activeSection: null,
  overlayOpen: false,
  focusedObject: null,

  cameraTarget: "default",
  cameraTick: 0,
  cameraOverride: null,

  galleryIndex: null,

  lightPhase: "afternoon",
  lightProgress: 0,
  explored: [],

  soundEnabled: true,
  dayNight: "day",

  enter: () => set({ entered: true }),

  setHovered: (id) => set({ hoveredObject: id }),

  focusObject: (id) => {
    const { cameraTick } = get();
    set({
      focusedObject: id,
      activeObject: null,
      activeSection: null,
      overlayOpen: false,
      galleryIndex: null,
      menuOpen: false,
      cameraOverride: null,
      cameraTarget: id,
      cameraTick: cameraTick + 1,
    });
  },

  activateObject: (id) => {
    const state = get();
    // 幂等：同一物品已经打开中则不重复 set，避免 Overlay 重复 mount / 重播动画
    if (state.overlayOpen && state.activeObject === id) return;

    const meta = objectMeta(id);
    const { explored, cameraTick } = state;
    const nextExplored = explored.includes(id) ? explored : [...explored, id];
    const progress = Math.min(nextExplored.length / MAX_EXPLORED, 1);

    set({
      focusedObject: id,
      cameraTarget: id,
      cameraTick: cameraTick + 1,
      cameraOverride: null,
      activeObject: id,
      activeSection: meta.section,
      overlayOpen: true,
      galleryIndex: null,
      menuOpen: false,
      explored: nextExplored,
      lightProgress: progress,
      lightPhase: progress > 0.45 ? "golden" : "afternoon",
    });
  },

  activatePhoto: (id, index) => {
    const { cameraTick } = get();
    set({
      focusedObject: id,
      cameraTarget: id,
      cameraTick: cameraTick + 1,
      cameraOverride: null,
      galleryIndex: index,
      overlayOpen: false,
      activeObject: null,
      activeSection: null,
      menuOpen: false,
    });
  },

  exitFocus: () =>
    set((state) => ({
      focusedObject: null,
      activeObject: null,
      activeSection: null,
      overlayOpen: false,
      galleryIndex: null,
      cameraTarget: "default",
      cameraTick: state.cameraTick + 1,
      // 统一恢复到唯一 DEFAULT ROOM CAMERA
      cameraOverride: null,
    })),

  selectObject: (id) => {
    const meta = objectMeta(id);
    const { explored, cameraTick } = get();
    const nextExplored = explored.includes(id) ? explored : [...explored, id];
    const progress = Math.min(nextExplored.length / MAX_EXPLORED, 1);

    set({
      focusedObject: id,
      activeObject: id,
      activeSection: meta.section,
      overlayOpen: true,
      galleryIndex: null,
      menuOpen: false,
      cameraTarget: id,
      cameraTick: cameraTick + 1,
      cameraOverride: null,
      explored: nextExplored,
      lightProgress: progress,
      lightPhase: progress > 0.45 ? "golden" : "afternoon",
    });
  },

  openSection: (section) =>
    set({
      focusedObject: null,
      activeObject: null,
      activeSection: section,
      overlayOpen: true,
      menuOpen: false,
      cameraOverride: null,
    }),

  // 只关闭 Overlay：相机保持 Focus（focusedObject / cameraTarget 不变）
  closeOverlay: () =>
    set({
      overlayOpen: false,
      activeObject: null,
      activeSection: null,
    }),

  // 只关闭 Gallery：相机保持 Focus
  closePhotoGallery: () =>
    set({
      galleryIndex: null,
    }),

  setGalleryIndex: (index) => set({ galleryIndex: index }),

  setMode: (mode) =>
    set({
      mode,
      overlayOpen: false,
      activeObject: null,
      activeSection: null,
      focusedObject: null,
      menuOpen: false,
      cameraTarget: "default",
      cameraOverride: null,
      galleryIndex: null,
    }),

  toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen })),
  closeMenu: () => set({ menuOpen: false }),

  returnToRoom: () =>
    set((state) => ({
      focusedObject: null,
      activeObject: null,
      activeSection: null,
      overlayOpen: false,
      galleryIndex: null,
      cameraTarget: "default",
      cameraTick: state.cameraTick + 1,
      cameraOverride: null,
    })),

  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

  toggleDayNight: () =>
    set((state) => ({ dayNight: state.dayNight === "day" ? "night" : "day" })),
}));

export const TOTAL_EXPLORED = MAX_EXPLORED;
