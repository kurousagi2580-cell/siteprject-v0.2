export function denormalizeDotKeys(payload: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const key of Object.keys(payload)) {
    if (key.includes(".")) {
      const parts = key.split(".");
      let cur = out;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (i === parts.length - 1) {
          cur[p] = payload[key];
        } else {
          cur[p] = cur[p] ?? {};
          cur = cur[p];
        }
      }
    } else {
      out[key] = payload[key];
    }
  }
  return out;
}