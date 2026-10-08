import Link from "next/link"
import { CardBox } from "@/components/ui/card-box"
import type { MergedRelation } from "@/types/relationships"


export function RelationCard({ relation }: { relation: MergedRelation }) {
  const partner = relation.target ?? null

  return (
    <CardBox className="flex flex-col items-center p-3">
      <img
        src={
          partner?.image_url && partner.image_url.trim() !== ""
            ? partner.image_url
            : "/noimage.png"
        }
        alt={partner?.name ?? "no name"}
        className="w-full object-cover rounded-sm"
      />

      {partner ? (
        <Link
          href={`/characters/${partner.slug}`}
          className="font-bold mt-3 hover:underline text-ananta-text"
        >
          {partner.name}
        </Link>
      ) : (
        <p className="font-bold mt-3 text-ananta-muted">不明なキャラ</p>
      )}

      <p className="text-ananta-muted text-sm">
        {relation.relation_type ?? "関係不明"}
      </p>

      <p className="text-ananta-muted text-xs">
        {relation.relation_description ?? ""}
      </p>
    </CardBox>
  )
}
