/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseImageUrl = supabaseUrl ? new URL(supabaseUrl) : null

const nextConfig = {
  images: {
    remotePatterns: supabaseImageUrl
      ? [{
          protocol: supabaseImageUrl.protocol.slice(0, -1),
          hostname: supabaseImageUrl.hostname,
          pathname: "/**",
        }]
      : [],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: "frame-src https://www.youtube-nocookie.com https://platform.twitter.com https://syndication.twitter.com https://twitter.com https://x.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
          },
        ],
      },
    ];
  },
}

export default nextConfig