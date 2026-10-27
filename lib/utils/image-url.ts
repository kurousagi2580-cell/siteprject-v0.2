export function resolveImageSrc(src: string | null | undefined): string | null {
  if (!src) return null

  const normalizedSrc = src.trimEnd()
  if (!normalizedSrc || normalizedSrc.startsWith("/") || /^[a-z][a-z\d+.-]*:/i.test(normalizedSrc)) {
    return normalizedSrc
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required to resolve a relative image path")
  }

  const storagePath = normalizedSrc
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")

  return new URL(`/storage/v1/object/public/images/${storagePath}`, supabaseUrl).toString()
}

export function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL

  if (siteUrl) {
    return siteUrl.startsWith("http://") || siteUrl.startsWith("https://")
      ? siteUrl.replace(/\/$/, "")
      : `https://${siteUrl}`.replace(/\/$/, "")
  }

  return "http://localhost:3000"
}

export function stripHtmlToPlainText(value: string | null | undefined): string {
  if (!value) return ""

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
}
