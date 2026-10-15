import { requireAdminPage } from "@/lib/auth/require-admin";
// app/admin/articles/page.tsx（認証なし版）

import { getArticleList } from "@/actions/articles-actions-server";
import DataTable, { Column } from "@/components/admin/data-table";
import { SiteShell } from "@/components/layout/site-shell";

export default async function Page({ searchParams }: { searchParams: any }) {
  await requireAdminPage();
    const params = await searchParams;
    const page = Number(params?.page ?? 1);
    const perPage = Number(params?.perPage ?? 20);
    const res = await getArticleList({ page: page, pageSize: perPage });

    const columns: Column[] = [
        { key: "id", label: "ID", width: "80px" },
        { key: "title", label: "タイトル" },
        { key: "created_at", label: "作成日" },
        { key: "actions", label: "操作", width: "160px" },
    ];

    return (
        <SiteShell>

            <div className="mb-4 flex justify-end">
                <a href="/admin/articles/new" className="btn">新規作成</a> {/* 新規ボタン */}
            </div>
            <DataTable
                items={res.items}
                itemKey="id"
                columns={columns}
                viewMode="table"
                title="記事一覧"
                subtitle={`全 ${res.total} 件`}
                basePath="/admin/articles"
            />

            <nav>
                {page > 1 && <a href={`?page=${page - 1}&perPage=${perPage}`}>前へ</a>}
                <span> {page} </span>
                {page * perPage < res.total && (
                    <a href={`?page=${page + 1}&perPage=${perPage}`}>次へ</a>
                )}
            </nav>
        </SiteShell>
    );
}
