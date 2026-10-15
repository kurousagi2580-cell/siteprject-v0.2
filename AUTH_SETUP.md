# 管理者認証 セットアップ手順

## 1. ファイルの適用（上書きコピー）
この ZIP の中身を、手元のプロジェクトに**上書きコピー**してください（フォルダごと置き換えない）。
- `.env.local` と `public/` は ZIP に含めていません（元の ZIP に `public/` がなかったため）。そのまま残してください。
- 次のファイルは手元から**削除**してください。
  - `app/api/admin/comments/route.ts` → `app/api/comments/route.ts` に移動しました（公開コメント API）
  - `gitignore.txt` → `.gitignore` にリネームしました
  - `package-lock.json`（pnpm に統一する場合）

## 2. パッケージ
```bash
pnpm remove @supabase/auth-helpers-nextjs
pnpm add @supabase/ssr
```
`package.json` は意図的に触っていません（ロックファイルとずれてビルドが落ちるのを避けるため）。

## 3. Supabase の準備
1. Authentication の設定で、新規サインアップを無効化する。
2. Authentication → Users で、自分のメールとパスワードのユーザーを追加する（自動承認で可）。
3. SQL Editor で管理者権限を付ける。
```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'あなたのメールアドレス';
```
権限は**次のログインから**反映されます（付与後に一度ログアウト→ログイン）。

## 4. 環境変数・Git
- `.env.local` の `SUPABASE_SERVICE_ROLE_KEY` は、**再発行した新しいキー**にする（`.env.example` 参照）。
- 過去にコミット済みなら: `git rm --cached .env.local`（`.gitignore` は同梱済み）。

## 5. 動作確認
```bash
# 未ログイン → 401（proxy.ts が弾く）
curl -i -X POST localhost:3000/api/admin/articles -H "content-type: application/json" -d '{}'
```
- 未ログインで `/admin` → `/login?next=/admin` にリダイレクトされる
- 一般ユーザー（`role` なし）でログイン → `/admin` に入れない／API は 403 か 401
- 管理者でログイン → 記事・キャラクターなどの作成・更新・削除ができる
- 公開側: ログアウト状態でコメント投稿が動く（`/api/comments`）

## 6. 構成
| 層 | 内容 |
|---|---|
| `proxy.ts` | トークン更新と、`/admin`・`/api/admin` の一次ガード（Next 15 以前は `middleware.ts` に改名） |
| `lib/auth/require-admin.ts` | `getAdminUser()`（`app_metadata.role === "admin"` を検証）、`guardAdmin()`（API 用）、`requireAdminPage()`（ページ用） |
| `app/api/admin/**/route.ts`（24本） | 全ハンドラーの先頭で `guardAdmin()` |
| `app/admin/**/page.tsx`（21枚） | 先頭で `requireAdminPage()` |
| `actions/make-crud-actions.ts` | `create / update / remove` が `getAdminUser()` を呼ぶ（コメントの `create` だけ `publicCreate: true`） |
| `lib/supabase/queries/index.ts` | `createEntityWithPage / deleteEntityWithPage` にも検証を追加 |
| `app/login/` | ログイン画面と `login` / `logout` アクション |

## 7. 既知の問題（認証とは別）
- `app/api/admin/namemappings/route.ts` に `GET / PUT / DELETE`（`params.id` を使う処理）がありますが、`[id]` フォルダがないため `/api/admin/namemappings/<id>` は 404 になります。`namemappings/[id]/route.ts` に移してください。
- コメントのレート制限は Upstash Redis の共有 Sliding Window（1分あたり5件）を使用します。Vercel の `x-real-ip` は `@vercel/functions` の `ipAddress()` で取得し、IP は HMAC 化して Redis のキーと新規コメントの `comments.ip` に保存します。HMAC キーには Upstash REST token を使います。Vercel の環境変数 `UPSTASH_REDIS_REST_URL` と `UPSTASH_REDIS_REST_TOKEN` を設定してください。未設定または Upstash に接続できない場合、コメント API は 503 を返して投稿を受け付けません。
- `next.config.mjs` は `ignoreBuildErrors: true` / `unoptimized: true` のままです。
