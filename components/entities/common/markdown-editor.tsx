"use client"

import { useRef } from "react"

type MarkdownEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const buttonClass =
  "rounded border border-ananta-border/50 px-2 py-1 text-xs text-ananta-text transition hover:bg-ananta-surface2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ananta-accent"

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function replaceSelection(before: string, after = before, fallback = "テキスト") {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.slice(start, end) || fallback
    const updated = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`
    onChange(updated)

    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length)
    })
  }

  function insertAtSelection(snippet: string, selected = "") {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const inserted = selected || snippet
    const updated = `${value.slice(0, start)}${inserted}${value.slice(end)}`
    onChange(updated)

    requestAnimationFrame(() => {
      textarea.focus()
      const cursor = start + inserted.length
      textarea.setSelectionRange(cursor, cursor)
    })
  }

  function wrapBlock(open: string, close: string) {
    const textarea = textareaRef.current
    if (!textarea) return
    const selected = value.slice(textarea.selectionStart, textarea.selectionEnd) || "ここに入力"
    replaceSelection(`${open}\n`, `\n${close}`, selected)
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded border border-ananta-border/40">
      <div
        aria-label="Markdownツール"
        className="flex flex-wrap items-center gap-1 border-b border-ananta-border/40 bg-ananta-surface2 p-2"
      >
        <button type="button" className={buttonClass} onClick={() => replaceSelection("**")} aria-label="太字">B</button>
        <button type="button" className={`${buttonClass} underline`} onClick={() => replaceSelection("++")} aria-label="下線">U</button>
        <button type="button" className={`${buttonClass} italic`} onClick={() => replaceSelection("*")} aria-label="斜体">I</button>
        <label className={`${buttonClass} flex cursor-pointer items-center gap-1`}>
          色
          <input
            type="color"
            aria-label="文字色"
            defaultValue="#ffffff"
            className="size-4 cursor-pointer border-0 bg-transparent p-0"
            onChange={(event) =>
              replaceSelection(`{{color:${event.target.value}|`, "}}")
            }
          />
        </label>
        <label className={`${buttonClass} flex items-center gap-1`}>
          サイズ
          <select
            aria-label="文字サイズ"
            defaultValue="16"
            className="bg-ananta-surface text-xs text-ananta-text"
            onChange={(event) =>
              replaceSelection(`{{size:${event.target.value}px|`, "}}")
            }
          >
            {[12, 14, 16, 18, 20, 24, 32, 48].map((size) => (
              <option key={size} value={size} className="bg-ananta-surface text-ananta-text">{size}px</option>
            ))}
          </select>
        </label>
        <select
          aria-label="見出しレベル"
          defaultValue=""
          className={buttonClass}
          onChange={(event) => {
            if (event.target.value) {
              replaceSelection(`${event.target.value} `, "", "見出し")
              event.target.value = ""
            }
          }}
        >
          <option value="">見出し</option>
          <option value="#">見出し 1</option>
          <option value="##">見出し 2</option>
          <option value="###">見出し 3</option>
        </select>
        <select
          aria-label="文字揃え"
          defaultValue=""
          className={buttonClass}
          onChange={(event) => {
            if (event.target.value) {
              wrapBlock(`[align=${event.target.value}]`, "[/align]")
              event.target.value = ""
            }
          }}
        >
          <option value="">文字揃え</option>
          <option value="left">左揃え</option>
          <option value="center">中央揃え</option>
          <option value="right">右揃え</option>
        </select>
        <select
          aria-label="本文の間に余白を挿入"
          defaultValue=""
          className={buttonClass}
          onChange={(event) => {
            if (event.target.value) {
              insertAtSelection(`\n\n[space=${event.target.value}]\n\n`)
              event.target.value = ""
            }
          }}
        >
          <option value="">余白を挿入</option>
          <option value="16">小 (16px)</option>
          <option value="32">中 (32px)</option>
          <option value="48">大 (48px)</option>
          <option value="64">特大 (64px)</option>
        </select>
        <button
          type="button"
          className={buttonClass}
          onClick={() => insertAtSelection("\n\n[anchor=section-id]\n\n")}
          aria-label="アンカー先を挿入"
        >
          アンカー先
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => replaceSelection("[", "](#section-id)", "リンクテキスト")}
          aria-label="アンカーリンクを挿入"
        >
          アンカーリンク
        </button>
        <button type="button" className={buttonClass} onClick={() => insertAtSelection("![代替テキスト](画像URL)")}>画像</button>
        <button type="button" className={buttonClass} onClick={() => insertAtSelection("| 見出し1 | 見出し2 |\n| --- | --- |\n| 内容 | 内容 |")}>表</button>
        <button type="button" className={buttonClass} onClick={() => insertAtSelection("[toc]")}>目次</button>
        <button type="button" className={buttonClass} onClick={() => replaceSelection("[", "](URL)", "リンクテキスト")}>リンク</button>
        <button type="button" className={buttonClass} onClick={() => replaceSelection("> ", "", "引用文")}>引用</button>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        placeholder={placeholder}
        className="min-h-0 w-full flex-1 resize-none bg-ananta-surface px-3 py-2 font-mono text-sm text-ananta-text outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ananta-accent"
        onChange={(event) => onChange(event.target.value)}
      />
      <p className="border-t border-ananta-border/40 bg-ananta-surface2 px-3 py-2 text-xs text-ananta-muted">
        色: {"{{color:#ffffff|文字}}"} ・ サイズ: {"{{size:24px|文字}}"} ・ 下線: ++文字++ ・ 余白: {"[space=32]"}
      </p>
    </div>
  )
}
