export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function parseResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Invalid JSON response");
  }
}

export async function request<T>(path: string, method: string, payload?: any): Promise<T> {
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  if (!res.ok) {
    // try to extract error message from JSON body if present
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      throw new Error(json?.error ?? `HTTP ${res.status}`);
    } catch {
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
  }
  return parseResponse<T>(res);
}

export async function requestForUI<T>(path: string, method: string, payload?: any): Promise<ApiResult<T>> {
  try {
    const data = await request<T>(path, method, payload);
    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? "network error" };
  }
}
