// src/actions/makeCrudActions.ts
import "server-only";
import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin"; // server-only helper
import { createSupabaseServerClient } from "@/lib/supabase/server"; // server-only helper
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
    publicCreate?: boolean; // true の場合のみ、認証なしで create を許可する（公開コメントなど）
  }
): CrudActions<T> {
  const writedb = createSupabaseAdminClient();
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

    revalidatePath("/", "layout");
    return data as T;
  }

  async function update(id: string, payload: Partial<T>) {
    await getAdminUser(); // 書き込みは管理者のみ
    const row = parseAdminPayload(table, payload, "update");

    if (slugField && overwriteSlugOnUpdate) {
      let slug = await (row[slugField] ? String(row[slugField]) : row[sourceField] ? slugify(String(row[sourceField]) ?? "") : "");
      if (slug) {
        row[slugField] = slugify(slug);
      }
    }

    const { data, error } = await writedb.from(table).update<Record<string, unknown>>(row).eq("id", id).select().single();
    if (error) throw error;
    revalidatePath("/", "layout");
    return data as T;
  }

  async function remove(id: string) {
    await getAdminUser(); // 書き込みは管理者のみ
    const { error } = await writedb.from(table).delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/", "layout");
  }

  return { list, getById, getBySlug, create, update, remove };
}
