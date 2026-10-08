export function extractHeadings(markdown: string, type: "h2" | "h3" = "h2"): { label: string; href: string }[] {
  const lines = markdown.split("\n")

  const headings = lines
    .map((line) => {
      if (line.startsWith("## ")) {
        const text = line.replace("## ", "").trim()
        const id = text.toLowerCase().replace(/\s+/g, "-")
        return { label: text, href: `#${id}` }
      }
      if (line.startsWith("### ") && type === "h3") {
        const text = line.replace("### ", "").trim()
        const id = text.toLowerCase().replace(/\s+/g, "-")
        return { label: text, href: `#${id}` }
      }
      return null
    })
    .filter(Boolean)

  return headings as { label: string; href: string }[]
}

export function extractRatio(text: string) {
  const match = text.match(/\{ratio=(\d+):(\d+)\}/)
  if (!match) return null
  const w = Number(match[1])
  const h = Number(match[2])
  return w > 0 && h > 0 ? { w, h } : null
}

