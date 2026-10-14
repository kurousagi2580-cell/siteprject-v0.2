import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { CharacterJoinAffiliation, CharacterDetaill, Character } from "@/types/character"

const supabase = createSupabaseServerClient()
//キャラクターテーブル×所属テーブル
export async function getCharacterJoinAffiliation(): Promise<CharacterJoinAffiliation[] | null> {



    const select = `
    id,
        name,
        short_name,
        image_url,
        type,
        profile,
        affiliation:affiliation (
            id,
            name,
            short_name,
            icon_url,
            description,
            category,
            parent_affiliation_id,
            slug,
            created_at,
            updated_at
        ),
        spaction,
        slug
  `
    const { data, error } = await supabase
        .from("characters")
        .select(select)
        .eq("type", "プレイアブル")
        .returns<CharacterJoinAffiliation[]>();


    if (error) {
        // ログを残す（必要なら監視サービスへ送る）
        console.error("getCharacterJoinAffiliation error:", error);
        throw error;
    }

    return data
}

//詳細ページ用　関係テーブルと結合
export async function getCharacterDetail(slug: string): Promise<CharacterDetaill | null>{
    const select = `
        id,
        name,
        short_name,
        type,
        image_url,
        profile,
        affiliation:affiliation_id (
          id,
          name,
          icon_url,
          description,
          category,
          order,
          parent_affiliation_id
        ),
        relationships:relationships!relationships_character_id_fkey (
        id,
        character_id,
        target_character_id,
        relation_type,
        relation_description,
        direction,
        target:target_character_id (
          id,
          slug,
          name,
          image_url
        )
      ),
      reverse_relationships:relationships!relationships_target_character_id_fkey (
        id,
        character_id,
        target_character_id,
        relation_type,
        relation_description,
        direction,
        source:character_id (
          id,
          slug,
          name,
          image_url
        )
      )
        `

    const { data, error } = await supabase
        .from("characters")
        .select(select)
        .eq("slug", slug)
        .single()
        .returns<CharacterDetaill>();

    if (error) {
        // ログを残す（必要なら監視サービスへ送る）
        console.error("getCharacterDetail error:", error);
        throw error;
    }

    return data
}
