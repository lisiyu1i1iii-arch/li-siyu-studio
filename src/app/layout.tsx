import type { Metadata, Viewport } from "next";

import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LI SIYU — MY LITTLE STUDIO",
    template: "%s | LI SIYU · MY LITTLE STUDIO",
  },
  description:
    "李思雨的个人创意工作室：一个可以被探索的 3D Loft Studio。走进工作台、书架、照片墙与信箱，看看她的项目、经历、技能与联系方式。",
  keywords: [
    "李思雨",
    "LI SIYU",
    "新媒体运营",
    "作品集",
    "3D 作品集",
    "创意工作室",
    "内容策划",
    "AIGC",
  ],
  authors: [{ name: "李思雨" }],
  creator: "李思雨",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: SITE_URL,
    siteName: "LI SIYU — MY LITTLE STUDIO",
    title: "LI SIYU — MY LITTLE STUDIO",
    description: "一个可以被探索的个人创意工作室：3D 空间就是导航。",
  },
  twitter: {
    card: "summary_large_image",
    title: "LI SIYU — MY LITTLE STUDIO",
    description: "一个可以被探索的个人创意工作室：3D 空间就是导航。",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7efe2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
