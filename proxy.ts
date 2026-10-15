// proxy.ts （Next.js 16。Next 15 以前なら middleware.ts にリネームし、関数名も middleware にする）
// 役割: ① セッショントークンの更新 ② /admin と /api/admin の一次ガード
// 最終的な防御は各ルート・各ページ内の getAdminUser() / guardAdmin() が担う。
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser(); // ここでトークンも更新される
  const isAdmin = user?.app_metadata?.role === "admin";
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/admin") && !isAdmin) {
    return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  if (pathname.startsWith("/admin") && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  return response;
}

// 公開ページでは Supabase への問い合わせを発生させない
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
