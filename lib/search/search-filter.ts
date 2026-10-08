export function filterByKeyword<T>(
  list: T[],
  keyword: string,
  keySelector: (item: T) => string
): T[] {
  const key = keyword.toLowerCase()
  return list.filter((item) =>
    keySelector(item).toLowerCase().includes(key)
  )
}
