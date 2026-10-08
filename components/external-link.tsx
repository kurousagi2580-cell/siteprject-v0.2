"use client"

import { useState, type ReactNode } from "react"

export function ExternalLink({ url, children }: { url: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)

  const handleClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    setOpen(true)
  }

  const goExternal = () => {
    window.open(url, "_blank")
    setOpen(false)
  }

  return (
    <>
      <a
        href={url}
        onClick={handleClick}
        className="text-ananta-link underline"
      >
        {children}
      </a>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-ananta-surface2 border border-ananta-border p-6 rounded-md w-80">
            <h2 className="text-lg font-bold mb-2">外部サイトへの移動</h2>

            <p className="text-sm text-ananta-muted mb-4 leading-relaxed">
              外部サイトへ移動します。  
              当サイトでは外部サイトの安全性や内容を保証できません。
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 border border-ananta-border rounded-sm text-sm"
              >
                キャンセル
              </button>

              <button
                onClick={goExternal}
                className="px-3 py-1 bg-ananta-accent text-white rounded-sm text-sm"
              >
                移動する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
