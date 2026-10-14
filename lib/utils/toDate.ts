

export function toDateTimeString(time: string) {
  const d = new Date(time)

  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")

  const hh = String(d.getHours()).padStart(2, "0")
  const mi = String(d.getMinutes()).padStart(2, "0")
  const ss = String(d.getSeconds()).padStart(2, "0")

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`
}

export function normalizeDateInput(val: unknown): string | null {
  if (val == null) return null;
  if (typeof val === "string") {
    const s = val.trim();
    if (s === "") return null;
    // input[type="date"] の "YYYY-MM-DD" を期待する場合はそのまま返す
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    // ISO 文字列や他フォーマットが来たら Date で検証して YYYY-MM-DD に変換
    const d = new Date(s);
    if (!isNaN(d.getTime())) {
      const yyyy = d.getUTCFullYear();
      const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(d.getUTCDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
    return null;
  }
  if (val instanceof Date && !isNaN(val.getTime())) {
    const d = val;
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  return null;
}
