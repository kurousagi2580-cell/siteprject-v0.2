"use client"

import { useEffect } from "react"

export default function GoogleSearchPage() {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://cse.google.com/cse.js?cx=b2481accbbc0d4623"
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div style={{ padding: "20px" }}>
      <h1>Google検索</h1>

      {/* Google検索ボックス＋検索結果がここに表示される */}
      <div className="gcse-search"></div>
    </div>
  )
}
