// src/lib/form-api.ts
export type GenericFormApiResponse = { success: boolean; id?: string; error?: string };

async function fetchJson(path: string, opts: RequestInit): Promise<GenericFormApiResponse> {
  const res = await fetch(path, opts);
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* ignore parse error */ }

  if (!res.ok) {
    const err = json?.error ?? text ?? `HTTP ${res.status}`;
    return { success: false, error: String(err) };
  }
  return (json ?? { success: true }) as GenericFormApiResponse;
}

export function makeFormHandlers(basepath: string, transform?: (p: Record<string, any>) => Record<string, any> | Promise<Record<string, any>>) {
  return {
    create: async (payload: Record<string, any>) => {
      console.log("[form-api] create called, payload:", payload);
      const body = transform ? await transform(payload) : payload;
      return fetchJson(basepath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    },
    update: async (id: string, payload: Record<string, any>) => {
      console.log("[form-api] update called, id:", id, "payload:", payload);
      const body = transform ? await transform(payload) : payload;
      return fetchJson(`${basepath}/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    },
    // optional delete/list can be added here
  };
}
