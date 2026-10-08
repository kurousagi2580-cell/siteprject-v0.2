"use client"

import { useRef, useState } from "react"

interface DraggableMapProps {
  src: string
  className?: string
}

export function DraggableMap({ src, className }: DraggableMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
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
      <div
        ref={mapRef}
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
      </div>
    </div>
  )
}
