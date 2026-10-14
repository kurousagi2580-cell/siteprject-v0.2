// components/region/RegionGrid.tsx
import RegionCard from "./region-card";
import { Section } from "@/components/ui/section"
import type { CountryJoinRegion } from  "@/types/country"

export default function RegionGrid({ regions }: { regions: CountryJoinRegion[] }) {
  return (
    <Section id="regions">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {regions.map(r => <RegionCard key={r.slug ?? r.id} region={r} />)}
      </div>
    </Section>
  );
}


