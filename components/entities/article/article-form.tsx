// src/components/admin/ArticleFormWrapper.tsx
"use client";
import { useRouter } from "next/navigation";
import type { SchemaField } from "@/components/entities/common/file-renderes";
import { makeFormHandlers } from "@/lib/api/form-api";
import { denormalizeDotKeys } from "@/lib/utils/denormalize-dot";
import EntityForm from "@/components/entities/common/entity-form";


const articleSchema: SchemaField[] = [
  { key: "title", label: "タイトル", type: "text", required: true },
  { key: "slug", label: "スラッグ", type: "text" },
  { key: "eyecatch", label: "アイキャッチURL", type: "image" },
  { key: "body", label: "本文", type: "markdown", required: true },
  { key: "category", label: "カテゴリ", type: "select", options: [] }, // options は親から渡すか fetch で埋める
];

const basepath = "/api/admin/articles"

export default function ArticleFormWrapper({ mode, initialArticle }: any) {
  const router = useRouter();

  const schema = articleSchema.map((a) => {
    if (a.key === "category") {
      return {
        ...a,
        options: [
          { value: "none", label: "未開催" },
          { value: "active", label: "開催中" },
          { value: "end", label: "終了" },
        ],
      };
    }
    return a;
  });

  const { create, update } = makeFormHandlers(basepath, denormalizeDotKeys);

  return (
    <EntityForm
      title={mode === "create" ? "作成" : "編集"}
      schema={schema}
      mode={mode}
      initialData={initialArticle}
      onCreate={create}
      onUpdate={update}
      transformPayload={denormalizeDotKeys}
      submitLabel={mode === "create" ? "作成" : "保存"}
      enablePreview={true}
      markdownEditorLayout="tabbed"
      viewportLayout
      onSuccess={() => router.push("/admin/articles")}
    />
  );
}
