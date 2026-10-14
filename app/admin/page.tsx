import { SiteShell } from "@/components/layout/site-shell"
import AdminDBClient from "@/components/admin/admin-db-client"
import { Surface } from "@/components/ui/surface"

import { makeCrudActions } from "@/actions/make-crud-actions";

export default async function AdminDBPage() {
    const characters = (await makeCrudActions("characters", "name").list()).items;
    const affiliations = (await makeCrudActions("affiliation", "name").list()).items;
    const coutries = (await makeCrudActions("countries", "name").list()).items;
    const regions = (await makeCrudActions("regions", "name").list()).items;
    const locations = (await makeCrudActions("locations", "name").list()).items;
    const events = (await makeCrudActions("game_events", "title").list()).items;
    const relationships = (await makeCrudActions("relationships", "character_id").list()).items;

    return (
        <SiteShell>
            <Surface variant="raised" className="h-52 md:h-64 flex items-center justify-center text-xl font-bold">
                管理者用ぺージ
            </Surface>

            <AdminDBClient
                items={characters}
                hrefBase="/admin/characters"
                title="CHARACTERS"
                subtitle="キャラクター一覧"
            />

            <AdminDBClient
                items={affiliations}
                hrefBase="/admin/affiliations"
                title="AFFILIATIONS"
                subtitle="所属一覧"
            />

            <AdminDBClient
                items={relationships}
                hrefBase="/admin/relationships"
                title="RELATIONS"
                subtitle="キャラクターの関係性"
            />

            <AdminDBClient
                items={coutries}
                hrefBase="/admin/countries"
                title="COUNTRIES"
                subtitle="国一覧"
            />

            <AdminDBClient
                items={regions}
                hrefBase="/admin/regions"
                title="REGIONS"
                subtitle="地域一覧"
            />

            <AdminDBClient
                items={locations}
                hrefBase="/admin/locations"
                title="LOCATIONS"
                subtitle="場所一覧"
            />

            <AdminDBClient
                items={events}
                hrefBase="/admin/events"
                title="EVENTS"
                subtitle="イベント情報一覧"
            />

        </SiteShell>
    )
}
