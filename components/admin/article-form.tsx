"use client"

import { useState } from "react"
import { Article } from "@/types/article"
import { createArticle } from "@/server-actions/articles/create-article"
import { updateArticle } from "@/server-actions/articles/update-article"
import { extractHeadings } from "@/lib/article/markdown"
import ArticleBody from "@/components/article/article-body"
import { Surface } from "@/components/ui/surface"
import { Section } from "@/components/ui/section"
import type { Mode } from "@/types/utils/mode"
import type { Page } from "@/types/page"

type Props = {
    mode: Mode;
    initialArticle?: Article
    pageData: Page[]
}

export default function ArticleForm({ mode, initialArticle, pageData }: Props) {
    const [title, setTitle] = useState(initialArticle?.title ?? "")
    const [slug, setSlug] = useState(initialArticle?.slug ?? "")
    const [eyecatch, setEyeCatch] = useState(initialArticle?.eyecatch ?? "")
    const [body, setBody] = useState(initialArticle?.body ?? "")
    const [category, setCategory] = useState(initialArticle?.category ?? "")
    const [page_id, setPageId] = useState(initialArticle?.page_id ?? "")
    const [status, setStatus] = useState("")

    const pageNavItems = extractHeadings(body)
    const submitText = mode === "create" ? "登録する" : "更新する"

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append("title", title)
        formData.append("slug", slug)
        formData.append("eyecatch", eyecatch)
        formData.append("body", body)
        formData.append("category", category)
        formData.append("page_id", page_id)

        let result

        if (mode === "create") {
            result = await createArticle(formData)
        } else {
            if (!initialArticle) {
                setStatus("編集対象のキャラクターが指定されていません")
                return
            }
            result = await updateArticle(initialArticle.id, formData)
        }

        if (!result.success) {
            setStatus(`保存に失敗しました：${result.error}`)
            return
        }

        setStatus(mode === "create" ? "作成しました" : "更新しました")
    }

    return (
        <div className="px-6 py-10 flex gap-10">

            {/* 左：入力フォーム */}
            <div className="flex-1">
                <Section id="form">
                    <Surface variant="raised" className="p-6 rounded-xl">
                        <form onSubmit={onSubmit} className="flex flex-col gap-6">

                            <h2 className="text-xl font-bold">記事編集</h2>

                            <div className="flex flex-col gap-1">
                                <label>タイトル</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                                />
                            </div>

                            <div className="flex grid-cols2 gap-1">
                                <label>Slug</label>
                                <input
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                                />
                                <label>カテゴリー</label>
                                <input
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label>アイキャッチ画像</label>
                                <input
                                    value={eyecatch}
                                    onChange={(e) => setEyeCatch(e.target.value)}
                                    className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                                />
                            </div>

                            {/* 紐づくぺージ */}
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-ananta-muted">紐づくページ</label>
                                <select
                                    value={page_id}
                                    onChange={(e) => setPageId(e.target.value)}
                                    className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2"
                                >
                                    <option value="">未設定</option>

                                    {pageData.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label>本文（Markdown）</label>
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    rows={16}
                                    className="bg-ananta-surface border border-ananta-border/40 rounded px-3 py-2 font-mono"
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-ananta-accent text-white px-4 py-2 rounded hover:bg-ananta-accent/80"
                            >
                                {submitText}

                            </button>

                            {status && (
                                <p className="text-sm text-red-400 bg-red-900/20 px-3 py-2 rounded">
                                    {status}
                                </p>
                            )}
                        </form>
                    </Surface>
                </Section>
            </div>

            {/* 右：プレビュー */}
            <div className="flex-1">
                <Section id="preview">
                    <Surface
                        variant="raised"
                        className="
              p-6 md:p-8 rounded-xl
              bg-ananta-surface/40 backdrop-blur-xl
              border border-ananta-border/40
              shadow-[inset_0_0_20px_rgba(0,0,0,0.45)]
            "
                    >
                        <h2 className="text-lg font-bold mb-4">プレビュー</h2>

                        <header className="flex flex-col gap-2 mb-6">
                            <span className="text-xs text-ananta-muted uppercase tracking-wide">
                                {category}
                            </span>

                            <h1 className="text-3xl font-bold text-ananta-text">
                                {title}
                            </h1>

                            <p className="text-xs text-ananta-muted">
                                slug: {slug}
                            </p>
                        </header>

                        <hr className="border-ananta-border/40 mb-6" />

                        <div className="prose prose-invert max-w-none">
                            <ArticleBody body={body} />
                        </div>

                        <hr className="border-ananta-border/40 my-6" />

                        <h3 className="text-sm font-bold text-ananta-muted mb-2">
                            見出し一覧
                        </h3>
                        <ul className="text-sm flex flex-col gap-1">
                            {pageNavItems.map((item) => (
                                <li key={item.href}>・{item.label}</li>
                            ))}
                        </ul>
                    </Surface>
                </Section>
            </div>

        </div>
    )
}
