import { SiteShell } from "@/components/site-shell"
import DataManageList from "@/components/admin/data-manage-list"
import { Surface } from "@/components/ui/surface"

import { getCharacters } from "@/lib/supabase/get-characters"
import { getAffiliations } from "@/lib/supabase/get-affiliations"
import { getCountries } from "@/lib/supabase/get-countries"
import { getRegions } from "@/lib/supabase/get-regions"
import { getLocations } from "@/lib/supabase/get-locations"
import { getGameEvents } from "@/lib/supabase/get-events"
import { getRelationships } from "@/lib/supabase/get-relationships"

export default async function AdminDBPage() {
    const characters = await getCharacters()
    const affiliations = await getAffiliations()
    const coutries = await getCountries()
    const regions = await getRegions()
    const locations = await getLocations()
    const events = await getGameEvents()
    const relationships = await getRelationships()

    return (
        <SiteShell>
            <Surface variant="raised" className="h-52 md:h-64 flex items-center justify-center text-xl font-bold">
                管理者用ぺージ
            </Surface>

            <DataManageList
                id="characters"
                title="CHARACTERS"
                subtitle="キャラクター一覧"
                items={characters}
                hrefBase="/admin/characters"
                nameKey="name"
                imageKey="image_url"
            />

            <DataManageList
                id="affiliations"
                title="AFFILIATIONS"
                subtitle="所属一覧"
                items={affiliations}
                hrefBase="/admin/affiliations"
                nameKey="name"
                imageKey="icon_url"
            />

            <DataManageList
                id="relation"
                title="RELATIONS"
                subtitle="キャラクターの関係性"
                items={relationships}
                hrefBase="/admin/relationships"
                nameKey="relation_summary"
            />

            <DataManageList
                id="coutries"
                title="COUNTRIES"
                subtitle="国一覧"
                items={coutries}
                hrefBase="/admin/countries"
                nameKey="name"
                imageKey="image_url"
            />

            <DataManageList
                id="maps"
                title="REGIONS"
                subtitle="地域一覧"
                items={regions}
                hrefBase="/admin/maps"
                nameKey="name"
                imageKey="image_url"
            />

            <DataManageList
                id="locations"
                title="LOCATIONS"
                subtitle="場所一覧"
                items={locations}
                hrefBase="/admin/locations"
                nameKey="name"
            />

            <DataManageList
                id="events"
                title="EVENTS"
                subtitle="イベント情報一覧"
                items={events}
                hrefBase="/admin/events"
                nameKey="title"
                imageKey="image_url"
            />

        </SiteShell>
    )
}
