import type { Metadata } from "next";
import { Toaster } from "sonner";

import AdminPanel from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "作品集后台",
  description: "李思雨作品集内容管理后台",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <>
      <AdminPanel />
      <Toaster position="top-center" richColors />
    </>
  );
}
