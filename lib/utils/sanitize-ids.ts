// src/lib/sanitize-ids.ts
export function sanitizePayload(obj: any, numericKeys: string[] = []): any {
  if (obj == null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((v) => sanitizePayload(v, numericKeys));

  const numericPattern = /(count|order|age|height|width|length|quantity|score|rank|level|num|amount)$/i;
  const out: Record<string, any> = {};

  for (const key of Object.keys(obj)) {
    const val = obj[key];

    if (val === "") {
      // id 系は null に
      if (key === "id" || key.endsWith("_id")) {
        out[key] = null;
        continue;
      }
      // 明示的に数値扱いしたいキー or 名前パターンにマッチする場合は null に
      if (numericKeys.includes(key) || numericPattern.test(key)) {
        out[key] = null;
        continue;
      }
      // それ以外は空文字のまま（必要ならここで null に変える）
      out[key] = val;
      continue;
    }

    // ネストオブジェクト／配列は再帰処理
    if (val && typeof val === "object") {
      out[key] = sanitizePayload(val, numericKeys);
      continue;
    }

    // 数値文字列を数値に変換（整数・小数対応）
    if (typeof val === "string") {
      const intMatch = /^-?\d+$/.test(val);
      const floatMatch = /^-?\d+\.\d+$/.test(val);
      if (intMatch) {
        out[key] = Number.parseInt(val, 10);
        continue;
      }
      if (floatMatch) {
        out[key] = Number.parseFloat(val);
        continue;
      }
    }

    out[key] = val;
  }

  return out;
}
