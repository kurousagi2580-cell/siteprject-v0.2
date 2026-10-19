# siteprject

## 集約一覧

`/aggregate/[slug]` は、Supabase の `aggregate_pages` と `aggregate_filters` の設定に応じて一覧を表示します。利用前に `supabase/migrations` のマイグレーションを順に適用してください。初期設定として `/aggregate/characters`、`/aggregate/countries`、`/aggregate/regions`、`/aggregate/affiliations` が登録されます。

サイドバーの「キャラクター図鑑」は `characters.type` による一覧切り替えに対応します。`/aggregate/characters` は「プレイアブル」、`/aggregate/characters/npc` は「NPC」、`/aggregate/characters/investigating` は「調査中」を表示します。「地理」には「国一覧」と「地域一覧」があり、地域一覧では親の国による絞り込みができます。「世界観」の「所属」から所属一覧を表示でき、各カードから所属詳細ページへ移動できます。

一覧に出すフィルターは `aggregate_filters` に登録します。利用可能な `field_key` はデータ種別ごとにアプリ側で許可しており、キャラクターは `affiliation`、地域は `country` をサポートします。各フィルターの値は既存データから取得します。
