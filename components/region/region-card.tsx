import { LinkCardBox } from "@/components/ui/link-card-box"
import type { CountryJoinRegion } from  "@/types/country"

export default function RegionCard({ region }: { region: CountryJoinRegion }) {
  return (
    <LinkCardBox href={region.slug ? `/regions/${region.slug}` : "#"} className="w-full hover:opacity-90">
      <div className="w-full aspect-[4/3] bg-ananta-surface">
        <img src={region.image_url || "/noimage.png"} alt={region.name ?? "region"} className="w-full object-cover rounded-sm" />
      </div>
      <div className="mt-2 px-2 pb-2">
        <p className="text-base font-bold">{region.name}</p>
        <p className="text-sm text-ananta-muted">{region.short_name}</p>
      </div>
    </LinkCardBox>
  );
}