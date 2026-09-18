"use client";

import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PrintButton({ label = "打印 / 导出 PDF" }: { label?: string }) {
  return (
    <Button
      size="sm"
      variant="outline"
      className="no-print"
      onClick={() => window.print()}
    >
      <Printer className="h-4 w-4" />
      {label}
    </Button>
  );
}
