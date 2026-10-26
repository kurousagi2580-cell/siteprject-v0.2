// src/actions/makeCrudActions.ts
import "server-only";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server"; // server-only helper
import { createSupabaseSessionClient } from "@/lib/supabase/ssr";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateSlug } from "@/lib/utils/generate-slug"; // slug 生成ユーティリティ
import { getAdminUser } from "@/lib/auth/require-admin";
import { parseAdminPayload } from "@/lib/validation/admin-payload";

export type CrudActions<T> = {
  list: (opts?: any) => Promise<{ items: T[]; total?: number }>;
  getById: (id: string) => Promise<T | null>;
  getBySlug: (slug: string) => Promise<T | null>;
  create: (payload: Partial<T>) => Promise<T>;
  update: (id: string, payload: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;
};

/**
 * makeCrudActions
 * - table: 対象テーブル名
 * - filterKey: list の互換用（既存実装に合わせる）
 * - opts: オプション（slug 関連はここで指定可能）
 *
 * 注意: この実装は「再試行しない」方針です。重複があれば DB の UNIQUE 制約で弾き、
 *       エラーをそのまま呼び出し元に返します（呼び出し側で 409 等に変換してください）。
 */
export function makeCrudActions<T extends Record<string, any>>(
  table: string,
  filterKey?: string,
  opts?: {
    slugField?: string; // default "slug"
    sourceField?: string; // default "name"
    slugify?: (s: string) => string; // default generateSlug
    overwriteSlugOnUpdate?: boolean; // update 時に slug を上書きするか
    normalizeSlugOnUpdate?: boolean; // update 時に入力された slug のみを正規化する
    publicCreate?: boolean; // true の場合のみ、認証なしで create を許可する（公開コメントなど）
  }
): CrudActions<T> {
  const readdb = createSupabaseServerClient();

  // オプションのデフォルト（create 内にローカル定義することも可能だが、
  // ここに置くと makeCrudActions の他のメソッドでも参照しやすい）
  const slugField = opts?.slugField ?? "slug";
  const sourceField = opts?.sourceField ?? "name";
  const slugify = opts?.slugify ?? generateSlug;
  const overwriteSlugOnUpdate = opts?.overwriteSlugOnUpdate ?? false;

  async function list(optsOrFilter?: any) {
    let optsLocal: {
      q?: string;
      page?: number;
      pageSize?: number;
      noPagination?: boolean;
      limit?: number;
      includeCount?: boolean;
      filters?: Record<string, any> | string | number;
      sort?: string;
      order?: "asc" | "desc";
    } = {};

    if (typeof optsOrFilter === "string" || typeof optsOrFilter === "number") {
      optsLocal.filters = optsOrFilter;
    } else {
      optsLocal = { ...(optsOrFilter ?? {}) };
    }

    const {
      q = "",
      page = 1,
      pageSize = 20,
      noPagination = false,
      limit,
      includeCount = true,
      filters,
      sort,
      order,
    } = optsLocal;

    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;
    const like = `%${q}%`;

    let query = readdb.from(table).select("*", { count: includeCount ? "exact" : undefined });

    if (filters && typeof filters === "object" && !Array.isArray(filters)) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") return;
        query = query.eq(k, v);
      });
    }

    if ((typeof filters === "string" || typeof filters === "number") && filters !== "") {
      const key = filterKey ?? "id";
      query = query.eq(key, filters);
    }

    if (q) {
      if (filterKey) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(q)) {
          query = query.eq(filterKey, q);
        } else {
          query = query.ilike(filterKey, like);
        }
      }
    }

    if (sort) {
      query = query.order(sort, { ascending: order !== "desc" });
    }

    const MAX_LIMIT = 1000;

    if (noPagination) {
      const safeLimit = Math.min(limit ?? 100, MAX_LIMIT);
      const { data, count, error } = await query.limit(safeLimit);
      if (error) throw error;
      return includeCount ? { items: (data ?? []) as T[], total: count ?? 0 } : { items: (data ?? []) as T[] };
    } else {
      const { data, count, error } = await query.range(from, to);
      if (error) throw error;
      return { items: (data ?? []) as T[], total: count ?? 0 };
    }
  }

  async function getById(id: string) {
    const { data, error } = await readdb.from(table).select("*").eq("id", id).single();
    if (error && error.code !== "PGRST116") throw error;
    return (data ?? null) as T | null;
  }

  async function getBySlug(slug: string) {
    const { data, error } = await readdb.from(table).select("*").eq("slug", slug).single();
    if (error && error.code !== "PGRST116") throw error;
    return (data ?? null) as T | null;
  }

  /**
   * create: シンプル版（再試行なし）
   * - slugField が指定されていればサーバー側で必ず生成・正規化する
   * - 挿入は一度だけ行い、UNIQUE 制約違反が返ったらエラーをそのまま投げる
   */
  function getAuditTitle(target: Record<string, unknown> | null | undefined, fallback: string) {
    if (!target || typeof target !== "object") {
      return fallback;
    }

    for (const key of ["title", "name", "keyword", "ver_id", "slug"]) {
      const value = target[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }

    return fallback;
  }

  function getAuditTargetUrl(target: Record<string, unknown> | null | undefined, fallback: string) {
    if (!target || typeof target !== "object") {
      return fallback;
    }

    for (const key of ["target_url", "official_url", "url", "link"]) {
      const value = target[key];
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }

    const slug = target.slug;
    if (typeof slug === "string" && slug.trim()) {
      return `/${table}/${slug.trim()}`;
    }

    const idValue = target.id;
    if (idValue !== undefined && idValue !== null && idValue !== "") {
      return `/${table}/${String(idValue)}`;
    }

    return fallback;
  }

  async function logTableChange(action: "create" | "update" | "delete", record: Record<string, unknown> | null | undefined) {
    if (table === "updateslog") {
      return;
    }

    const adminDb = createSupabaseAdminClient();
    const summaryText = "";
    const descriptionText = "";
    const normalizedAction = action === "create" ? "new" : "upd";
    const fallbackTitle = `${table} ${action === "create" ? "新規作成" : action === "delete" ? "削除" : "更新"}`;

    const { error } = await adminDb.from("updateslog").insert([{
      title: getAuditTitle(record, fallbackTitle),
      target_url: getAuditTargetUrl(record, `/${table}`),
      summary: summaryText,
      description: descriptionText,
      check_type: normalizedAction,
    }]);

    if (error) {
      console.warn("Failed to write update log:", error.message);
    }
  }

  async function create(payload: Partial<T>) {
    if (!opts?.publicCreate) await getAdminUser(); // 書き込みは管理者のみ
    const row = parseAdminPayload(table, payload, "create");

    if (slugField) {
      let slug = (row[slugField] as string) ?? "";
      if (!slug && row[sourceField]) {
        slug = await slugify(String(row[sourceField]));
      } else if (slug) {
        slug = await slugify(String(slug));
      }

      if (slug) {
        row[slugField] = slug;
      }
    }

    // Public comments are written only by the rate-limited API route. All admin writes
    // use the caller's JWT so PostgreSQL RLS policies are applied.
    const writedb = opts?.publicCreate
      ? createSupabaseAdminClient()
      : await createSupabaseSessionClient();
    const { data, error } = await writedb.from(table).insert<Record<string, unknown>>([row]).select().single();

    if (error) {
      const isUniqueViolation =
        error?.code === "23505" ||
        (typeof error?.message === "string" && /duplicate key|unique constraint/i.test(error.message));

      if (isUniqueViolation) {
        const e = new Error("slug_conflict");
        (e as any).detail = error.message;
        throw e;
      }

      throw error;
    }

    await logTableChange("create", data as Record<string, unknown> | null | undefined);
    revalidatePath("/", "layout");
    return data as T;
  }

  async function update(id: string, payload: Partial<T>) {
    await getAdminUser(); // 書き込みは管理者のみ
    const writedb = await createSupabaseSessionClient();
    const updatePayload = { ...payload } as Record<string, unknown>;

    if (
      slugField &&
      opts?.normalizeSlugOnUpdate &&
      typeof updatePayload[slugField] === "string"
    ) {
      const inputSlug = updatePayload[slugField] as string;
      const trimmedSlug = inputSlug.trim();
      const normalizedSlug = !trimmedSlug
        ? ""
        : /^(?:[a-z0-9]+(?:-[a-z0-9]+)*)$/.test(trimmedSlug)
          ? trimmedSlug
          : await slugify(trimmedSlug);
      if (normalizedSlug) {
        updatePayload[slugField] = normalizedSlug;
      } else {
        delete updatePayload[slugField];
      }
    }

    const row = parseAdminPayload(table, updatePayload, "update");

    if (slugField && overwriteSlugOnUpdate) {
      let slug = await (row[slugField] ? String(row[slugField]) : row[sourceField] ? slugify(String(row[sourceField]) ?? "") : "");
      if (slug) {
        row[slugField] = slugify(slug);
      }
    }

    const { data, error } = await writedb.from(table).update<Record<string, unknown>>(row).eq("id", id).select().single();
    if (error) throw error;
    await logTableChange("update", data as Record<string, unknown> | null | undefined);
    revalidatePath("/", "layout");
    return data as T;
  }

  async function remove(id: string) {
    await getAdminUser(); // 書き込みは管理者のみ
    const writedb = await createSupabaseSessionClient();
    const { data: existingRow, error: existingError } = await writedb.from(table).select("*").eq("id", id).maybeSingle();
    if (existingError) throw existingError;

    const { error } = await writedb.from(table).delete().eq("id", id);
    if (error) throw error;
    await logTableChange("delete", (existingRow ?? null) as Record<string, unknown> | null | undefined);
    revalidatePath("/", "layout");
  }

  return { list, getById, getBySlug, create, update, remove };
}
