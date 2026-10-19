import Image, { type ImageProps } from "next/image"

function normalizeImageSrc(src: ImageProps["src"]): ImageProps["src"] {
  if (typeof src !== "string") return src

  const normalizedSrc = src.trimEnd()
  if (!normalizedSrc || normalizedSrc.startsWith("/") || /^[a-z][a-z\d+.-]*:/i.test(normalizedSrc)) {
    return normalizedSrc
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required to resolve a relative image path")
  }

  try {
    const storagePath = normalizedSrc
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/")
    return new URL(
      `/storage/v1/object/public/images/${storagePath}`,
      supabaseUrl,
    ).toString()
  } catch (error) {
    console.error("Failed to resolve Supabase image path:", error)
    throw error
  }
}

function canOptimizeImage(src: ImageProps["src"]): boolean {
  if (typeof src !== "string") return true
  if (src.startsWith("/") && !src.startsWith("//")) return true

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return false

  try {
    return new URL(src).origin === new URL(supabaseUrl).origin
  } catch {
    return false
  }
}

export function AppImage({ unoptimized, ...props }: ImageProps) {
  const src = normalizeImageSrc(props.src)

  return (
    <Image
      {...props}
      src={src}
      unoptimized={unoptimized ?? !canOptimizeImage(src)}
    />
  )
}
