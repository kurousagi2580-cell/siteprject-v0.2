import Link from "next/link"
import { requireAdminPage } from "@/lib/auth/require-admin";
import { SiteShell } from "@/components/layout/site-shell"
import AdminDBClient from "@/components/admin/admin-db-client"
import { Surface } from "@/components/ui/surface"
import { logout } from "@/app/login/actions"

import { makeCrudActions } from "@/actions/make-crud-actions";

export default async function AdminDBPage() {
  await requireAdminPage();
    const [
        charactersResult,
        affiliationsResult,
        countriesResult,
        regionsResult,
        locationsResult,
        eventsResult,
        relationshipsResult,
    ] = await Promise.all([
        makeCrudActions("characters", "name").list(),
        makeCrudActions("affiliation", "name").list(),
        makeCrudActions("countries", "name").list(),
        makeCrudActions("regions", "name").list(),
        makeCrudActions("locations", "name").list(),
        makeCrudActions("game_events", "title").list(),
        makeCrudActions("relationships", "character_id").list(),
    ]);
    const characters = charactersResult.items;
    const affiliations = affiliationsResult.items;
    const countries = countriesResult.items;
    const regions = regionsResult.items;
    const locations = locationsResult.items;
    const events = eventsResult.items;
    const relationships = relationshipsResult.items;

    return (
        <SiteShell>
            <Surface variant="raised" className="h-52 md:h-64 flex items-center justify-center text-xl font-bold">
                管理者用ぺージ
            </Surface>

            <div className="flex flex-wrap gap-2">
                <Link
                    href="/admin/relationgraph"
                    className="rounded border border-ananta-border px-3 py-1 text-sm text-ananta-text no-underline hover:border-ananta-accent"
                >
                    相関図の配置を編集
                </Link>
            </div>

            <form action={logout} className="flex justify-end">
                <button type="submit" className="rounded border border-ananta-border px-3 py-1 text-sm text-ananta-muted hover:text-ananta-text">
                    ログアウト
                </button>
            </form>

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
                items={countries}
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
