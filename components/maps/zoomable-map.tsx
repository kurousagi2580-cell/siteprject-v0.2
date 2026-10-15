"use client"

import { AppImage } from "@/components/app-image"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

interface ZoomableMapProps {
  src: string
  className?: string
}

export function ZoomableMap({ src, className }: ZoomableMapProps) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <TransformWrapper
        initialScale={1}
        minScale={0.8}
        maxScale={3}
        wheel={{ disabled: false }}
        pinch={{ disabled: false }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent>
          <AppImage
            src={src}
            alt="map"
            width={1600}
            height={900}
            sizes="100vw"
            style={{ aspectRatio: "auto" }}
            className="w-full h-auto select-none"
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}
