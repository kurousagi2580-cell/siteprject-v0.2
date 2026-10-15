"use client";
import { AppImage } from "@/components/app-image"
import { LinkCardBox } from "@/components/ui/link-card-box"
import Link from "next/link"


export default function DataManageList<T>({
  items,
  hrefBase,
  nameKey = "name" as keyof T,
  imageKey = "image_url" as keyof T,
  onDeleteClick,
}: {
  items: T[];
  hrefBase: string;
  nameKey?: keyof T;
  imageKey?: keyof T;
  onDeleteClick: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item: any) => (
        <div key={item.id} className="relative">
          <LinkCardBox href={`${hrefBase}/${item.id}`} className="hover:opacity-90 flex flex-col items-center">
            <AppImage
              src={!item[imageKey] || item[imageKey] === "" ? "/noimage.png" : item[imageKey]}
              alt={String(item[nameKey] ?? "")}
              width={400}
              height={400}
              sizes="(max-width: 640px) 50vw, 20vw"
              className="w-full aspect-square object-cover rounded-sm"
            />
            <p className="mt-2 text-center text-sm font-bold text-ananta-text">{item[nameKey]}</p>
          </LinkCardBox>

          <div className="mt-2 flex items-center justify-center gap-2">
            <Link href={`${hrefBase}/${item.id}`}><button className="text-sm text-blue-600">編集</button></Link>
            <button className="text-sm text-red-600" onClick={() => onDeleteClick(String(item.id))}>削除</button>
          </div>
        </div>
      ))}
    </div>
  );
}
