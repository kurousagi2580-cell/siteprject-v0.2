import Image, { type ImageProps } from "next/image"
import { resolveImageSrc } from "@/lib/utils/image-url"

function normalizeImageSrc(src: ImageProps["src"]): ImageProps["src"] {
  if (typeof src !== "string") return src
  return resolveImageSrc(src) ?? "/noimage.png"
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
