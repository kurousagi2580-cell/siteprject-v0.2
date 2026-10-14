// app/admin/articles/page.tsx（認証なし版）

import { getNameMappingsList } from "@/actions/namemaps-actions-server";
import DataTable, { Column } from "@/components/admin/data-table";
import { SiteShell } from "@/components/layout/site-shell";

export default async function Page({ searchParams }: { searchParams: any }) {
    const params = await searchParams;
    const page = Number(params?.page ?? 1);
    const perPage = Number(params?.perPage ?? 20);
    const res = await getNameMappingsList({ page: page, pageSize: perPage });
    const total = res.total ?? 0;

    const columns: Column[] = [
        { key: "id", label: "ID", width: "80px" },
        { key: "source_text", label: "変換元文字" },
        { key: "hiragana", label: "ひらがな" },
        { key: "note", label: "メモ", width: "160px" },
        { key: "created_by", label: "作成者", width: "80px" },
        { key: "actions", label: "操作", width: "160px" },
    ];
    const basePath="/admin/namemappings"

    return (
        <SiteShell>

            <div className="mb-4 flex justify-end">
                <a href={`${basePath}/new`} className="btn">新規作成</a> {/* 新規ボタン */}
            </div>
            <DataTable
                items={res.items}
                itemKey="id"
                columns={columns}
                viewMode="table"
                title="名前変換一覧"
                subtitle={`全 ${total} 件`}
                basePath= {basePath}
            />

            <nav>
                {page > 1 && <a href={`?page=${page - 1}&perPage=${perPage}`}>前へ</a>}
                <span> {page} </span>
                {page * perPage < total && (
                    <a href={`?page=${page + 1}&perPage=${perPage}`}>次へ</a>
                )}
            </nav>
        </SiteShell>
    );
}
