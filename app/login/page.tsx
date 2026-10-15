import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next = "/admin", error } = await searchParams;

  return (
    <main className="mx-auto max-w-sm px-4 py-20">
      <form
        action={login}
        className="flex flex-col gap-4 rounded-sm border border-ananta-border bg-ananta-surface/60 p-6 backdrop-blur-md"
      >
        <h1 className="text-lg font-bold text-ananta-text">管理者ログイン</h1>

        <input type="hidden" name="next" value={next} />

        <label className="flex flex-col gap-1 text-sm text-ananta-muted">
          メールアドレス
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded border border-ananta-border bg-ananta-surface2 px-3 py-2 text-ananta-text"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ananta-muted">
          パスワード
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="rounded border border-ananta-border bg-ananta-surface2 px-3 py-2 text-ananta-text"
          />
        </label>

        {error && (
          <p className="rounded bg-red-900/20 px-3 py-2 text-sm text-red-400">
            メールアドレスまたはパスワードが違います
          </p>
        )}

        <button
          type="submit"
          className="rounded bg-ananta-accent px-4 py-2 font-bold text-black hover:opacity-90"
        >
          ログイン
        </button>
      </form>
    </main>
  );
}
