export type RelatedLink = {
  label: string
  url: string
}

function normalizeLabel(rawLabel: string | undefined, url: string): string {
  if (rawLabel && rawLabel.trim()) return rawLabel.trim()

  try {
    const parsed = new URL(url)
    return parsed.hostname || url
  } catch {
    return url
  }
}

export function parseRelatedLinks(raw: string | null | undefined): RelatedLink[] {
  if (!raw) return []

  const entries: RelatedLink[] = []

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const [firstPart, ...rest] = trimmed.split("|")
    const label = firstPart?.trim() ?? ""
    const rawUrl = rest.length > 0 ? rest.join("|").trim() : trimmed
    const url = rawUrl.trim()

    if (!url) continue

    try {
      const parsed = new URL(url)
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") continue
      entries.push({
        label: normalizeLabel(label && label !== url ? label : undefined, url),
        url: parsed.href,
      })
    } catch {
      // 無効な URL はそのまま落とす
    }

    if (entries.length >= 20) break
  }

  return entries
}
