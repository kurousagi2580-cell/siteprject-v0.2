import Image, { type ImageProps } from "next/image"

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
  return (
    <Image
      {...props}
      unoptimized={unoptimized ?? !canOptimizeImage(props.src)}
    />
  )
}
