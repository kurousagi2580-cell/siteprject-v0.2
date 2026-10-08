import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Section } from "@/components/ui/section"
import { LinkCardBox } from "@/components/ui/link-card-box"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type DataManageListProps<T> = {
  id: string
  title: string
  subtitle: string
  items: T[]
  hrefBase: string
  nameKey?: keyof T
  imageKey?: keyof T
}

export default async function DataManageList<T>({
  id,
  title,
  subtitle,
  items,
  hrefBase,
  nameKey = "name" as keyof T,
  imageKey = "image_url" as keyof T,
}: DataManageListProps<T>) {

  return (
    <Section id={id}>
      <GameSectionTitle title={title} subtitle={subtitle} />

      {/* 新規登録ボタン */}
      <div className="mb-4">
        <Link href={`${hrefBase}/new`}>
          <Button variant="glass" className="px-4 py-2 font-bold">
            新規登録
          </Button>
        </Link>
      </div>

      <CardPanel className="flex flex-col gap-4">

        {items.length === 0 ? (
          <p className="text-sm text-ananta-muted">データがありません。</p>
        ) : (
          <div
            className="
              grid 
              grid-cols-2 
              sm:grid-cols-3 
              md:grid-cols-4 
              lg:grid-cols-5 
              gap-4
            "
          >
            {items.map((item: any) => (
              <LinkCardBox
                key={item.id}
                href={`${hrefBase}/${item.id}`}
                className="hover:opacity-90 flex flex-col items-center"
              >
                {/* 画像 */}
                <img
                  src={
                    !item[imageKey] || item[imageKey] === ""
                      ? "/noimage.png"
                      : item[imageKey]
                  }
                  alt={item[nameKey] as string}
                  className="w-full aspect-square object-cover rounded-sm"
                />

                {/* 名前 */}
                <p className="mt-2 text-center text-sm font-bold text-ananta-text">
                  {item[nameKey]}
                </p>
              </LinkCardBox>
            ))}
          </div>
        )}

      </CardPanel>
    </Section>
  )
}