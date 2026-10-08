"use client"

import { useEffect, useRef } from "react"

export function XEmbed({
  tweetUrl,
  ratio = { w: 16, h: 9 },
}: {
  tweetUrl: string
  ratio?: { w: number; h: number }
}) {
  const ref = useRef<HTMLDivElement>(null)
  const padding = (ratio.h / ratio.w) * 100

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://platform.twitter.com/widgets.js"
    script.async = true
    ref.current?.appendChild(script)
  }, [])

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        maxWidth: "550px",
        position: "relative",
        paddingBottom: `${padding}%`,
      }}
    >
      <blockquote className="twitter-tweet">
        <a href={tweetUrl}></a>
      </blockquote>
    </div>
  )
}

