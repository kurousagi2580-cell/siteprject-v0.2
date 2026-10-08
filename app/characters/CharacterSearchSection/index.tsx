"use client"

import { useState } from "react"
import { SearchSection } from "@/components/search/search-section"
import { CharacterGrid } from "../CharacterGrid"
import type { CharacterDetaill } from "@/types/character"

export function CharacterSearchSection({ characters}: { characters: CharacterDetaill[]}) {

  const [keyword, setKeyword] = useState("")
  const [affiliation, setAffiliation] = useState("")

  const filteredCharacters = characters.filter((c) => {
    const matchKeyword =
      keyword === "" ||
      c.name?.includes(keyword) ||
      c.short_name?.includes(keyword)

    const matchAffiliation =
      affiliation === "" ||
      c.affiliation?.name === affiliation ||
      c.affiliation?.name?.includes(affiliation)

    return matchKeyword && matchAffiliation
  })

  const affiliationOptions = Array.from(
  new Set(
    characters
      .map((c) => c.affiliation?.name)
      .filter((name): name is string => Boolean(name))
  )
).map((name) => ({
  value: name,
  label: name,
}))

  return (
    <>
      <SearchSection
        title="CHARACTERS"
        subtitle="キャラクター一覧"
        keyword={keyword}
        onKeywordChange={setKeyword}
        filterLabel="所属"
        filterValue={affiliation}
        onFilterChange={setAffiliation}
        filterOptions={affiliationOptions}
      />

      <CharacterGrid characters={filteredCharacters} />
    </>
  )
}
