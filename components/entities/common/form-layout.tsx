// src/components/entities/common/FormLayout.tsx
"use client";

import React from "react";
import { Section } from "@/components/ui/section";
import { Surface } from "@/components/ui/surface";

export type FormResult = { success: boolean; id?: string; error?: string };

type FormLayoutProps = {
  title: string;
  onSubmit: (formData: Record<string, any>) => Promise<FormResult>;
  submitLabel?: string;
  children: React.ReactNode;
  className?: string;
};

export default function FormLayout({ title, onSubmit, submitLabel = "保存", children, className }: FormLayoutProps) {
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("[FormLayout] handleSubmit fired", e);
    e.preventDefault();
    setStatus("");
    setLoading(true);
    try {
      const res = await onSubmit((e as any).__payload ?? {});
      console.log("[FormLayout] onSubmit result:", res);
      setStatus(res.success ? "保存しました" : `失敗: ${res.error ?? "unknown"}`);
    } catch (err: any) {
      setStatus(`エラー: ${err?.message ?? String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section id="form">
      <Surface variant="raised" className="p-6 rounded-xl flex flex-col gap-6">
        <form onSubmit={handleSubmit} className={className ?? "flex flex-col gap-6"}>
          <h2 className="text-xl font-bold">{title}</h2>

          <div>{children}</div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading} className="bg-ananta-accent text-white px-4 py-2 rounded hover:bg-ananta-accent/80">
              {submitLabel}
            </button>
            <div className="flex items-center gap-3">
              {/* FormLayout の submit ボタンは既にあるためここでは status のみ表示 */}
              {status && <div className="text-sm text-ananta-muted">{status}</div>}
            </div>
          </div>


        </form>
      </Surface>
    </Section>
  );
}
