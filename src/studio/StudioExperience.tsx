"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { Compass } from "lucide-react";

import ContentOverlay from "./overlays/ContentOverlay";
import PhotoGallery from "./overlays/PhotoGallery";
import { useDeviceProfile } from "./hooks/use-device-profile";
import { useStudioStore } from "./store/studio-store";
import FocusExitButton from "./ui/FocusExitButton";
import LoadingScreen from "./ui/LoadingScreen";
import MenuPanel from "./ui/MenuPanel";
import QuickMenu from "./ui/QuickMenu";
import QuickViewPanel from "./ui/QuickViewPanel";
import StudioErrorBoundary from "./ui/StudioErrorBoundary";
import TopBar from "./ui/TopBar";

// StudioScene 仍按需拉取（ssr:false）；profile 就绪即挂载，Entry 遮罩期间完成初始化。
const StudioScene = dynamic(() => import("./scene/StudioScene"), {
  ssr: false,
  loading: () => <EnteringBackdrop />,
});

/**
 * 顶层外壳：
 * 3D Scene（Canvas）与 DOM UI（Interface）职责分离，互不侵入。
 */
export default function StudioExperience() {
  const profile = useDeviceProfile();
  const entered = useStudioStore((s) => s.entered);
  const mode = useStudioStore((s) => s.mode);
  /** Canvas / WebGLRenderer 是否已完成可显示初始化 */
  const [sceneReady, setSceneReady] = useState(false);

  // Entry 遮罩解除条件：WebGL 不可用时立即可进入；需要 WebGL 时必须等 Canvas 就绪
  const ready = Boolean(profile) && (!profile?.webgl || sceneReady);

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-studio-paper text-studio-ink">
      {/*
       * Canvas 常驻：profile 就绪即挂载，与 entered 无关。
       * Entry 阶段 Canvas 已在 LoadingScreen 遮罩下完成 WebGL 初始化，
       * 点击 ENTER 只切换显示状态，不重新创建 Three.js 场景。
       */}
      {profile ? (
        profile.webgl ? (
          <StudioErrorBoundary>
            <StudioScene profile={profile} onReady={() => setSceneReady(true)} />
          </StudioErrorBoundary>
        ) : (
          <FallbackBackdrop />
        )
      ) : null}

      {entered && profile && (
        <>
          <TopBar />
          <MenuPanel />
          <QuickMenu />
          <FocusExitButton />
          <ContentOverlay />
          <PhotoGallery />
          <AnimatePresence>
            {mode === "quickview" && <QuickViewPanel />}
          </AnimatePresence>
        </>
      )}

      <AnimatePresence>{!entered && <LoadingScreen ready={ready} />}</AnimatePresence>
    </main>
  );
}

/** 点击 Door 后、3D chunk 加载期间的暖色过渡：不白屏 */
function EnteringBackdrop() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-studio-paper via-studio-sand to-studio-sun/40 px-8 text-center">
      <p className="font-serif text-lg tracking-[0.15em] text-studio-ink">
        Entering Studio…
      </p>
    </div>
  );
}

/** WebGL 不可用时的暖色兜底：不白屏，Quick View 依然可用 */
function FallbackBackdrop() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-studio-paper via-studio-sand to-studio-sun/40 px-8 text-center">
      <div className="max-w-sm space-y-3">
        <Compass className="mx-auto h-8 w-8 text-studio-ember" />
        <h1 className="font-serif text-2xl text-studio-ink">
          这个设备暂时打不开 3D 工作室
        </h1>
        <p className="text-sm leading-relaxed text-studio-ink-soft">
          没关系——打开菜单里的 Quick View，或者直接看 HR 平面简历，内容一样完整。
        </p>
      </div>
    </div>
  );
}
