

export function YouTubeEmbed({
  videoId,
  ratio = { w: 16, h: 9 },
}: {
  videoId: string
  ratio?: { w: number; h: number }
}) {
  const padding = (ratio.h / ratio.w) * 100

  return (
    <div style={{ width: "100%", maxWidth: "640px" }}>
      <div style={{ position: "relative", paddingBottom: `${padding}%`, height: 0 }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  )
}
