import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { AppImage } from '@/components/app-image'
import { getSiteUrl } from '@/lib/utils/image-url'
import './globals.css'

export const revalidate = 60

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Ananta Database',
    template: '%s | Ananta Database',
  },
  description: '無限大ANANTAの攻略情報・データベース',
  generator: 'v0.app',
  openGraph: {
    title: 'Ananta Database',
    description: '無限大ANANTAの攻略情報・データベース',
    siteName: 'Ananta Database',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {/* 背景レイヤー */}
        <div className="fixed inset-0 -z-10">
          {/* 背景レイヤー（調整は globals.css の --backdrop-* ） */}
          <div aria-hidden="true" className="site-backdrop">
            <AppImage
              src="backgrounds/title.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[50%_0%] lg:object-[50%_20%]"
            />
          </div>
        </div>

        {/* コンテンツ */}
        {children}

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
