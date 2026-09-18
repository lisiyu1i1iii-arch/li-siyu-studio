import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LI SIYU — MY LITTLE STUDIO",
  description:
    "进入李思雨的 3D 创意工作室：点一点电脑、书架、照片墙、工作台和信箱，看看她的项目、经历、技能与联系方式。",
  alternates: { canonical: "/" },
};

/**
 * `/` 本身不渲染任何内容：
 * Studio（含 Entry 遮罩与 R3F Canvas）由 (studio)/layout.tsx 常驻渲染，
 * 这样从 /guestbook 返回时不会重建 Studio。
 */
export default function HomePage() {
  return null;
}
