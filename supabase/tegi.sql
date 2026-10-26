-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text,
  slug text,
  eyecatch text,
  body text,
  category text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  page_id uuid,
  CONSTRAINT articles_pkey PRIMARY KEY (id),
  CONSTRAINT articles_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.pages(id)
);
CREATE TABLE public.characters (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_name text,
  image_url text,
  type text,
  spaction text,
  profile jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  affiliation_id uuid,
  slug text UNIQUE,
  CONSTRAINT characters_pkey PRIMARY KEY (id),
  CONSTRAINT characters_affiliation_id_fkey FOREIGN KEY (affiliation_id) REFERENCES public.affiliation(id)
);
CREATE TABLE public.affiliation (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text DEFAULT ''::text,
  short_name text DEFAULT ''::text,
  icon_url text DEFAULT ''::text,
  description text,
  category text,
  order smallint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  parent_affiliation_id uuid,
  slug text UNIQUE,
  CONSTRAINT affiliation_pkey PRIMARY KEY (id),
  CONSTRAINT affiliation_parent_affiliation_id_fkey FOREIGN KEY (parent_affiliation_id) REFERENCES public.affiliation(id)
);
CREATE TABLE public.relationships (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  character_id uuid DEFAULT gen_random_uuid(),
  target_character_id uuid DEFAULT gen_random_uuid(),
  relation_type text,
  relation_description text,
  direction text CHECK (direction = ANY (ARRAY['one-way'::text, 'two-way'::text])),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  strength smallint NOT NULL DEFAULT 3 CHECK (strength >= 1 AND strength <= 5),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT relationships_pkey PRIMARY KEY (id),
  CONSTRAINT relationships_target_character_id_fkey FOREIGN KEY (target_character_id) REFERENCES public.characters(id),
  CONSTRAINT relationships_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id)
);
CREATE TABLE public.countries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_name text NOT NULL,
  image_url text NOT NULL,
  description text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  slug text UNIQUE,
  CONSTRAINT countries_pkey PRIMARY KEY (id)
);
CREATE TABLE public.regions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_name text NOT NULL,
  parent_id uuid NOT NULL,
  image_url text NOT NULL,
  description text NOT NULL,
  map_x integer,
  map_y integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  slug text UNIQUE,
  CONSTRAINT regions_pkey PRIMARY KEY (id),
  CONSTRAINT regions_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.countries(id)
);
CREATE TABLE public.locations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  fast_travel boolean NOT NULL DEFAULT false,
  x integer NOT NULL,
  y integer NOT NULL,
  parent_region_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  slug text UNIQUE,
  image_url text,
  CONSTRAINT locations_pkey PRIMARY KEY (id),
  CONSTRAINT locations_parent_region_id_fkey FOREIGN KEY (parent_region_id) REFERENCES public.regions(id)
);
CREATE TABLE public.pages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type text NOT NULL,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  resource_type text,
  resource_id uuid,
  CONSTRAINT pages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL,
  number integer NOT NULL,
  user_name text,
  content text NOT NULL,
  parent_id uuid,
  is_adopted boolean NOT NULL DEFAULT false,
  delete_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  ip text,
  CONSTRAINT comments_pkey PRIMARY KEY (id),
  CONSTRAINT comments_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.pages(id),
  CONSTRAINT comments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.comments(id)
);
CREATE TABLE public.game_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  status text,
  start_date date,
  end_date date,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  articles_slug text,
  CONSTRAINT game_events_pkey PRIMARY KEY (id)
);
CREATE TABLE public.updates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  ver_id text NOT NULL,
  title text NOT NULL,
  release_date date NOT NULL,
  official_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT updates_pkey PRIMARY KEY (id)
);
CREATE TABLE public.updateslog (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title text NOT NULL,
  target_url text NOT NULL,
  summary text NOT NULL,
  description text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  check_type text CHECK (check_type = ANY (ARRAY['new'::text, 'upd'::text])),
  CONSTRAINT updateslog_pkey PRIMARY KEY (id)
);
CREATE TABLE public.words (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  keyword text UNIQUE,
  description text,
  slug text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  image_url text,
  related_links text,
  read_word text,
  category text,
  CONSTRAINT words_pkey PRIMARY KEY (id)
);
CREATE TABLE public.entity_definitions (
  entity_type text NOT NULL,
  table_name text NOT NULL,
  title_column text NOT NULL,
  slug_source_column text,
  extra_columns ARRAY DEFAULT '{}'::text[],
  CONSTRAINT entity_definitions_pkey PRIMARY KEY (entity_type)
);
CREATE TABLE public.name_mappings (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  source_text text NOT NULL UNIQUE,
  hiragana text NOT NULL,
  note text,
  created_by text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT name_mappings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.aggregate_pages (
  slug text NOT NULL,
  title text NOT NULL,
  subtitle text,
  entity_type text NOT NULL CHECK (entity_type = ANY (ARRAY['characters'::text, 'countries'::text, 'regions'::text, 'affiliations'::text, 'words'::text])),
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT aggregate_pages_pkey PRIMARY KEY (slug)
);
CREATE TABLE public.aggregate_filters (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page_slug text NOT NULL,
  field_key text NOT NULL,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT aggregate_filters_pkey PRIMARY KEY (id),
  CONSTRAINT aggregate_filters_page_slug_fkey FOREIGN KEY (page_slug) REFERENCES public.aggregate_pages(slug)
);
CREATE TABLE public.character_relationship_positions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  diagram_key text NOT NULL DEFAULT 'main'::text,
  character_id uuid NOT NULL,
  position_x double precision NOT NULL CHECK (position_x >= '-100000'::integer::double precision AND position_x <= 100000::double precision),
  position_y double precision NOT NULL CHECK (position_y >= '-100000'::integer::double precision AND position_y <= 100000::double precision),
  position_mode text NOT NULL DEFAULT 'manual'::text CHECK (position_mode = ANY (ARRAY['manual'::text, 'auto'::text])),
  group_key text,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT character_relationship_positions_pkey PRIMARY KEY (id),
  CONSTRAINT character_relationship_positions_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id)
);
CREATE TABLE public.character_relationship_frames (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  diagram_key text NOT NULL DEFAULT 'main'::text,
  affiliation_id uuid,
  label text,
  color text CHECK (color IS NULL OR color ~ '^#[0-9A-Fa-f]{6}$'::text),
  position_x double precision,
  position_y double precision,
  width double precision,
  height double precision,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT character_relationship_frames_pkey PRIMARY KEY (id),
  CONSTRAINT character_relationship_frames_affiliation_id_fkey FOREIGN KEY (affiliation_id) REFERENCES public.affiliation(id)
);