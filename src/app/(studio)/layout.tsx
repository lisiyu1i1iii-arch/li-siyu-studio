import type { ReactNode } from "react";

import StudioExperience from "@/studio/StudioExperience";

/**
 * Studio 常驻布局：`/` 与 `/guestbook` 共用同一个布局段。
 *
 * R3F Canvas / WebGLRenderer / StudioEnvironment 只在此布局挂载一次，
 * 在 `/` ↔ `/guestbook` 之间切换时不会卸载重建：
 *   · StudioExperience 常驻（Canvas、相机、纹理、BGM 都保持）
 *   · 子路由（/guestbook）作为覆盖层渲染在 Studio 之上
 *
 * 不改变任何 URL，也不影响 /cv、/admin（它们在 (studio) 之外）。
 */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      <StudioExperience />
      {children}
    </div>
  );
}
