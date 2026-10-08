"use client"

import { useState } from "react"
import Link from "next/link"

interface Marker {
  slug: string
  name: string
  x: number | null
  y: number | null
}

interface DraggableMapWithMarkersProps {
  src: string
  markers: Marker[]
  className?: string
}

export function DraggableMapWithMarkers({
  src,
  markers,
  className,
}: DraggableMapWithMarkersProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [start, setStart] = useState({ x: 0, y: 0 })

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    setStart({ x: e.clientX - pos.x, y: e.clientY - pos.y })
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return
    setPos({
      x: e.clientX - start.x,
      y: e.clientY - start.y,
    })
  }

  const onMouseUp = () => setDragging(false)

  return (
    <div
      className={`relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing ${className}`}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* マップ本体 */}
      <div
        onMouseDown={onMouseDown}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
        }}
        className="absolute top-0 left-0"
      >
        <img
          src={src}
          alt="map"
          className="w-[200%] h-auto select-none pointer-events-none"
        />

        {/* マーカー + ラベル */}
        {markers.map((m) => (
          <Link
            key={m.slug}
            href={`/regions/${m.slug}`}
            className="absolute group"
            style={{
              left: m.x ?? 0,
              top: m.y ?? 0,
            }}
          >
            <div className="flex items-center gap-2">

              {/* マーカー */}
              <div
                className="
                  w-4 h-4 bg-red-500 rounded-full border border-white shadow
                  group-hover:scale-125 transition-transform
                "
              />

              {/* ラベル（シンプル＋ホバー強調） */}
              <span
                className="
                  text-xs font-semibold text-black
                  bg-white px-2 py-1 rounded
                  shadow-sm border border-gray-300
                  transition-all
                  group-hover:bg-gray-100
                  group-hover:shadow-md
                  group-hover:scale-105
                "
              >
                {m.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
