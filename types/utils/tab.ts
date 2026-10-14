// src/types/tab.ts
export type SearchTabKey = "all" | "characters" | "affiliations" | "countries" | "regions" | "events";

export function isSearchTabKey(v: unknown): v is SearchTabKey {
  return typeof v === "string" && ["all","characters","affiliations","countries","regions","events"].includes(v);
}
