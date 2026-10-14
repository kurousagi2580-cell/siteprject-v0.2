### Markdown サニタイズとレンダリングガイド

このディレクトリは Markdown の変換、サニタイズ、見出し抽出、プレビューに関する実装と運用ルールを一元管理します。目的は **XSS を防ぎつつ編集者が期待する表現を保つこと** です。サーバー側での一括サニタイズを標準とし、クライアントは表示と UI 状態管理に専念します。

---

### 目次
- ファイル一覧
- 基本方針
- サニタイズルールの要点
- 埋め込みと iframe ポリシー
- 編集者向けルール
- 開発者向け導入手順
- 運用と監査
- 変更履歴

---

### ファイル一覧
- `slugify.ts` 共通の slug 化ユーティリティ
- `schema.ts` rehype サニタイズスキーマ
- `headings.ts` remark を使った見出し抽出ユーティリティ
- `render.ts` Markdown をサニタイズ済み HTML に変換するパイプライン
- `README.md` このファイル

---

### 基本方針
- Markdown の HTML 変換とサニタイズは **サーバー側で実行**する。  
- `remarkRehype` は `allowDangerousHtml: false` を基本とする。raw HTML を許可する場合は `rehype-raw` と厳格なスキーマを組み合わせ、ホワイトリストを明確にする。  
- サニタイズの目的は `<script>`、`on*` 属性、`javascript:` スキームなどの攻撃ベクトルを除去すること。  
- 見出し抽出はサーバーで行い、クライアントにはサニタイズ済み HTML と見出し配列を渡す。

---

### サニタイズルールの要点
- 許可するタグ例  
  `h1 h2 h3 h4 h5 h6 p a img figure figcaption table thead tbody tr th td pre code blockquote hr`
- 許可する共通属性  
  `className id title aria-hidden role`
- a 要素の属性  
  `href title rel target`（href はプロトコル検証を行う）
- img 要素の属性  
  `src alt title width height loading`（src は http/https のみ許可）
- 許可プロトコル  
  `http https mailto tel`
- 注意点  
  `iframe` は原則禁止。必要な場合はドメインホワイトリストを実装し、サーバー側で検証する。

---

### 埋め込みと iframe ポリシー
- 行単位 URL 埋め込みを推奨する。YouTube や X の URL を行単位で検出し、サーバー側で安全なプレースホルダに変換する。クライアントはそのプレースホルダを安全な埋め込みコンポーネントに差し替える。  
- iframe の直接挿入は不可。許可する場合はドメインホワイトリストを用意し、`src` をサーバーで検証する。許可ドメイン以外は除去する。  
- 外部スクリプトの読み込みは一切許可しない。

---

### 編集者向けルール
- raw HTML の使用は原則禁止。必要な埋め込みは指定の URL 形式で記述すること。  
- 画像は https の外部 URL を推奨。data URI はサイズとセキュリティの観点から原則禁止。  
- 許可される Markdown 機能  
  見出し、段落、リスト、表、コードブロック、引用、画像、リンク  
- 禁止事項  
  `<script>`、`on*` 属性、`javascript:` スキーム、未承認の iframe 埋め込み  
- 編集時の注意  
  埋め込みが必要な場合は指定のフォーマットに従い、編集履歴や差分で埋め込み元を明記すること

---

### 開発者向け導入手順
1. 依存をインストール  
   `npm install unified remark-parse remark-rehype rehype-stringify rehype-sanitize rehype-slug hast-util-sanitize`
2. `markdown/` をプロジェクト直下に配置する。  
3. 記事ページはサーバーで `renderMarkdownToHtml` と `extractHeadings` を呼び、クライアントに `html` と `headings` を渡す。  
4. プレビューはクライアント側で `ReactMarkdown` を使う場合でも `skipHtml=true` を設定する。  
5. 埋め込みはサーバー側で行単位 URL を検出してプレースホルダに変換するワークフローを実装する。

### 運用と監査
- サニタイズで削除された要素や拒否された埋め込みは開発ログに記録する。編集者が原因を把握できるようにする。  
- サニタイズスキーマを変更する際はレビューとステージ検証を必須とする。  
- CI にサニタイズのユニットテストを組み込み、依存更新で壊れないことを保証する。  
- 変更履歴はコミットメッセージと `markdown/CHANGELOG.md` に残すことを推奨する。

---

### 変更履歴
- v1.0 初期実装 サニタイズパイプライン slugify 見出し抽出プレビューコンポーネント

---

必要ならこの README をベースに編集者向けの短いチートシートや CI 用のテストケースを作成します。どちらを先に用意しますか。