
"use client";
import { DraggableMapWithMarkers, Marker } from "./draggable-map-with-markers";

export default function MapClient({ src, markers }: { src?: string; markers: Marker[] }) {
  return <DraggableMapWithMarkers src={src ?? "/noimage.png"} markers={markers} className="w-full h-full" />;
}
