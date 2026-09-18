import type { Metadata } from "next";

import GuestbookExperience from "@/components/guestbook/GuestbookExperience";

export const metadata: Metadata = {
  title: "留言簿",
  description: "在李思雨的小工作室里留一句话。",
  alternates: { canonical: "/guestbook" },
};

/**
 * Guestbook 仍是独立 URL，但作为覆盖层渲染在常驻的 Studio 之上：
 * 进入 / 退出留言时 Studio 的 Canvas / WebGLRenderer / 场景都不卸载，
 * 退出后直接回到进入前的圆桌 focus 视角。
 */
export default function GuestbookPage() {
  return (
    <div className="absolute inset-0 z-[100] overflow-y-auto bg-studio-paper">
      <GuestbookExperience />
    </div>
  );
}
