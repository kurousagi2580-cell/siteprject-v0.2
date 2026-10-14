
"use client";

import { useRouter } from "next/navigation";
import DataManageList from "@/components/admin/data-manage-list";
import { useDeleteItem } from "@/hooks/use-delete-item";
import Link from "next/link";
import { CardPanel } from "@/components/ui/card-panel";
import { GameSectionTitle } from "@/components/ui/game-section-title";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export default function AdminDBClient<T>({ items, hrefBase, title, subtitle }: {
  items: T[]; hrefBase: string; title: string; subtitle: string;
}) {
  const router = useRouter();
  const { status, loadingId, deleteItem } = useDeleteItem();

  async function onDeleteClick(id: string) {
    const res = await deleteItem(hrefBase, id);
    if (res.success) {
      router.refresh(); // server component 側のデータを再取得
    }
  }

  return (
    <Section id={hrefBase.replace(/\//g, "-")}>
      <GameSectionTitle title={title} subtitle={subtitle} />
      <div className="mb-4 flex items-center justify-between">
        <Link href={`${hrefBase}/new`}>
          <Button variant="glass" className="px-4 py-2 font-bold">新規登録</Button>
        </Link>
        <div aria-live="polite" className="text-sm text-ananta-muted">{status}</div>
      </div>

      <CardPanel className="flex flex-col gap-4">
        {items.length === 0 ? (
          <p className="text-sm text-ananta-muted">データがありません。</p>
        ) : (
          <DataManageList items={items} hrefBase={hrefBase} onDeleteClick={onDeleteClick} />
        )}
      </CardPanel>
    </Section>
  );
}
