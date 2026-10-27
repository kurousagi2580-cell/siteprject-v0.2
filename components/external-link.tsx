"use client"

import { useState, type ReactNode } from "react"

function getSafeExternalUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
      return parsedUrl.href
    }
  } catch {
    return null
  }

  return null
}

export function ExternalLink({ url, children }: { url: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const safeUrl = getSafeExternalUrl(url)

  const handleClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    setOpen(true)
  }

  const goExternal = () => {
    if (!safeUrl) return

    window.open(safeUrl, "_blank", "noopener,noreferrer")
    setOpen(false)
  }

  return (
    <>
      <a
        href={safeUrl ?? "#"}
        target={safeUrl ? "_blank" : undefined}
        rel={safeUrl ? "noopener noreferrer" : undefined}
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
              {safeUrl
                ? <>外部サイトへ移動します。<br />当サイトでは外部サイトの安全性や内容を保証できません。</>
                : "安全なURL（http:// または https://）ではないため、移動できません。"}
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 border border-ananta-border rounded-sm text-sm"
              >
                キャンセル
              </button>

              {safeUrl && (
                <button
                  onClick={goExternal}
                  className="px-3 py-1 bg-ananta-accent text-white rounded-sm text-sm"
                >
                  移動する
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
