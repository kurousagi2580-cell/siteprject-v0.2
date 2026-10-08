
import { CategorySection } from "./category-section"
import { CategoryPanel } from "./category-panel"
import { LinkCardBox } from "../ui/link-card-box"
import { CardPanel } from "../ui/card-panel"
import type { ReactNode } from "react"

import type { Character } from "@/types/character"
import type { Affiliation } from "@/types/affiliation"
import type { Country } from "@/types/country"
import type { Region } from "@/types/region"
import type { GameEvent } from "@/types/gameevents"


type TabKey = "all" | "characters" | "affiliations" | "countries" | "regions" | "events"

type SearchSection = {
    title: string
    results: any[]
    renderItem: (item: any) => ReactNode
}

type SearchResultsProps = {
    tab: TabKey
    page: number
    PAGE_SIZE: number
    keyword: string
    goToPage: (page: number) => void
    characterResults: Character[]
    affiliationResults: Affiliation[]
    countryResults: Country[]
    regionResults: Region[]
    eventResults: GameEvent[]
}

export function SearchResults({
    tab,
    page,
    PAGE_SIZE,
    keyword,
    goToPage,
    characterResults,
    affiliationResults,
    countryResults,
    regionResults,
    eventResults,
}: SearchResultsProps) {
    const sections: SearchSection[] = [
        {
            title: "キャラクター",
            results: characterResults,
            renderItem: (a: Character) => (
                <LinkCardBox
                    key={a.id}
                    href={`/affiliations/${a.id}`}
                    className="w-full hover:opacity-90"
                >
                    <img
                        src={a.image_url || "/placeholder.png"}
                        alt={a.name}
                        className="w-full object-cover rounded-sm"
                    />
                    <p className="mt-2 text-center text-sm">{a.name}</p>
                </LinkCardBox>
            ),
        },
        {
            title: "所属",
            results: affiliationResults,
            renderItem: (a: Affiliation) => (
                <LinkCardBox
                    key={a.id}
                    href={`/affiliations/${a.id}`}
                    className="w-full hover:opacity-90"
                >
                    <img
                        src={a.icon_url || "/placeholder.png"}
                        alt={a.name}
                        className="w-full object-cover rounded-sm"
                    />
                    <p className="mt-2 text-center text-sm">{a.name}</p>
                </LinkCardBox>
            ),
        },
        {
            title: "国",
            results: countryResults,
            renderItem: (a: Country) => (
                <LinkCardBox
                    key={a.id}
                    href={`/affiliations/${a.id}`}
                    className="w-full hover:opacity-90"
                >
                    <img
                        src={a.image_url || "/placeholder.png"}
                        alt={a.name}
                        className="w-full object-cover rounded-sm"
                    />
                    <p className="mt-2 text-center text-sm">{a.name}</p>
                </LinkCardBox>
            ),
        },
        {
            title: "地域", results: regionResults, renderItem: (a: Region) => (
                <LinkCardBox
                    key={a.id}
                    href={`/affiliations/${a.id}`}
                    className="w-full hover:opacity-90"
                >
                    <img
                        src={a.image_url || "/placeholder.png"}
                        alt={a.name}
                        className="w-full object-cover rounded-sm"
                    />
                    <p className="mt-2 text-center text-sm">{a.name}</p>
                </LinkCardBox>
            ),
        },
        {
            title: "イベント", results: eventResults, renderItem: (a: GameEvent) => (
                <LinkCardBox
                    key={a.id}
                    href={`/affiliations/${a.id}`}
                    className="w-full hover:opacity-90"
                >
                    <img
                        src={a.image_url || "/placeholder.png"}
                        alt={a.title}
                        className="w-full object-cover rounded-sm"
                    />
                    <p className="mt-2 text-center text-sm">{a.title}</p>
                </LinkCardBox>
            ),
        },
    ]

    const panels = {
        characters: { title: "キャラクター検索結果", results: characterResults, renderItem: sections[0].renderItem },
        affiliations: { title: "所属検索結果", results: affiliationResults, renderItem: sections[1].renderItem },
        countries: { title: "国検索結果", results: countryResults, renderItem: sections[2].renderItem },
        regions: { title: "地域検索結果", results: regionResults, renderItem: sections[3].renderItem },
        events: { title: "イベント検索結果", results: eventResults, renderItem: sections[4].renderItem },
    }

    if (tab === "all") {
        return (
            <>
                {sections.map((sec) => (
                    <CategoryPanel
                        key={sec.title}
                        title={sec.title}
                        results={sec.results}
                        page={page}
                        PAGE_SIZE={PAGE_SIZE}
                        keyword={keyword}
                        goToPage={goToPage}
                        renderItem={sec.renderItem}
                    />
                ))}
            </>
        )
    }

    return (
        <CategoryPanel
            title={panels[tab].title}
            results={panels[tab].results}
            page={page}
            PAGE_SIZE={PAGE_SIZE}
            keyword={keyword}
            goToPage={goToPage}
            renderItem={panels[tab].renderItem}
        />
    )
}
