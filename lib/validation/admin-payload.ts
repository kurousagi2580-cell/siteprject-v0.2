import { z } from "zod"

const text = (max: number) => z.string().max(max).nullable().optional()
const requiredText = (max: number) => z.string().trim().min(1).max(max)
const slug = z.string()
  .max(120)
  .regex(/^(?:[a-z0-9]+(?:-[a-z0-9]+)*)?$/, "Invalid slug")
  .nullable()
  .optional()
const url = z.string().max(2048).refine((value) => {
  if (value === "" || (value.startsWith("/") && !value.startsWith("//"))) return true
  try {
    const parsed = new URL(value)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}, "Expected an http(s) URL or a local path").nullable().optional()
const numeric = z.number().finite().nullable().optional()
const id = z.string().max(100).nullable().optional()
const date = z.string().max(40).nullable().optional()

const commonEntityFields = {
  slug,
  description: text(20_000),
}

const schemas = {
  characters: z.object({
    name: requiredText(200),
    short_name: text(200),
    ...commonEntityFields,
    image_url: url,
    type: text(100),
    profile: z.object({
      age: numeric,
      height: numeric,
      birthday: text(100),
      favorites: z.union([z.array(z.string().max(200)).max(100), z.string().max(2000)]).nullable().optional(),
      voice_actor: text(200),
    }).strip().nullable().optional(),
    spaction: text(20_000),
    affiliation_id: id,
  }).strip(),
  articles: z.object({
    title: requiredText(300),
    ...commonEntityFields,
    eyecatch: url,
    body: text(100_000),
    category: text(100),
    page_id: id,
  }).strip(),
  countries: z.object({
    name: requiredText(200),
    short_name: text(200),
    ...commonEntityFields,
    image_url: url,
  }).strip(),
  regions: z.object({
    name: requiredText(200),
    short_name: text(200),
    ...commonEntityFields,
    parent_id: id,
    image_url: url,
    map_x: numeric,
    map_y: numeric,
  }).strip(),
  locations: z.object({
    name: requiredText(200),
    fast_travel: z.preprocess(
      (value) => value === "true" ? true : value === "false" ? false : value,
      z.boolean().nullable().optional(),
    ),
    x: numeric,
    y: numeric,
    parent_region_id: id,
    slug,
    image_url: url,
  }).strip(),
  game_events: z.object({
    title: requiredText(300),
    status: z.enum(["", "none", "active", "end"]).nullable().optional(),
    start_date: date,
    end_date: date,
    image_url: url,
    articles_slug: slug,
  }).strip(),
  affiliation: z.object({
    name: requiredText(200),
    short_name: text(200),
    icon_url: url,
    description: text(20_000),
    category: text(100),
    order: numeric,
    parent_affiliation_id: id,
    slug,
  }).strip(),
  relationships: z.object({
    character_id: z.string().min(1).max(100),
    target_character_id: id,
    relation_type: text(100),
    direction: text(100),
    relation_description: text(20_000),
  }).strip(),
  name_mappings: z.object({
    source_text: requiredText(500),
    hiragana: requiredText(500),
    note: text(2000),
    created_by: text(200),
  }).strip(),
  pages: z.object({
    id: requiredText(200),
    type: requiredText(100),
    slug: requiredText(200),
    title: requiredText(300),
    description: z.string().max(20_000).optional(),
  }).strip(),
  updates: z.object({
    ver_id: requiredText(100),
    title: requiredText(300),
    release_date: requiredText(40),
    official_url: url,
  }).strip(),
  updateslog: z.object({
    id: requiredText(200),
    type: requiredText(100),
    target_id: requiredText(200),
    action: requiredText(100),
    description: z.string().max(20_000),
  }).strip(),
  comments: z.object({
    page_id: requiredText(200),
    number: z.number().int().positive().optional(),
    user_name: z.string().trim().min(1).max(100),
    content: z.string().trim().min(1).max(2000),
    parent_id: id,
    is_adopted: z.boolean().optional(),
    delete_reason: text(2000),
    ip: z.string().max(64).optional(),
  }).strip(),
} satisfies Record<string, z.ZodObject<any>>

export type AdminEntityTable = keyof typeof schemas
export type PayloadOperation = "create" | "update"

export class AdminPayloadValidationError extends Error {
  constructor(public readonly issues: z.ZodIssue[]) {
    super("Invalid payload")
    this.name = "AdminPayloadValidationError"
  }
}

export function parseAdminPayload(
  table: string,
  payload: unknown,
  operation: PayloadOperation,
): Record<string, unknown> {
  if (!Object.hasOwn(schemas, table)) {
    throw new Error(`No payload schema registered for table: ${table}`)
  }
  const entitySchema = schemas[table as AdminEntityTable]
  const schema = operation === "update" ? entitySchema.partial() : entitySchema
  const result = schema.safeParse(payload)
  if (!result.success) throw new AdminPayloadValidationError(result.error.issues)
  return result.data
}
