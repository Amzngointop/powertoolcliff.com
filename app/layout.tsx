import type { Metadata, Viewport } from 'next'
import { Encode_Sans_Condensed, Overpass, Red_Hat_Text } from 'next/font/google'
import './globals.css'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { categories } from '@/data/gear'
import { NAV, titleForPath } from '@/lib/routes'
import { SITE } from '@/lib/seo'

/*
 * Barlow, Barlow Condensed and IBM Plex Sans are already used by other
 * projects on this drive (PackCinch, PackEdgePost, BenchRigForge,
 * LensGripVault), so the brief's three faces are replaced with:
 */
const display = Overpass({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-display', display: 'swap' })
const narrow = Encode_Sans_Condensed({ subsets: ['latin'], weight: ['700'], variable: '--font-narrow', display: 'swap' })
const body = Red_Hat_Text({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-body', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  formatDetection: { telephone: false, email: false, address: false },
}

export const viewport: Viewport = {
  themeColor: '#0B57D0',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nav = NAV.map((href) => ({ href, title: titleForPath(href) }))
  const departments = categories.map((c) => ({ href: `/gear/${c.slug}`, title: titleForPath(`/gear/${c.slug}`) }))
  return (
    <html lang="en" className={`${display.variable} ${narrow.variable} ${body.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Main content
        </a>
        <Header nav={nav} departments={departments} />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
