export type HeadingItem = {
  type: "h2" | "h3"
  label: string
  href: string
}

export type ImageItem = {
  type: "image"
  alt: string
  src: string
}

export type YouTubeItem = {
  type: "youtube"
  videoId: string
  url: string
}

export type XItem = {
  type: "x"
  tweetId: string
  url: string
}