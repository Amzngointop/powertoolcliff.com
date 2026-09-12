import { PageLink } from './PageLink'
import { LogoMark } from './LogoMark'
import { categories } from '@/data/gear'
import { materials } from '@/data/materials'
import { toolTypes } from '@/data/tool-types'
import { wearPoints } from '@/data/wear-points'
import { SITE } from '@/lib/seo'

/** Five full columns on carbon. Every list is complete, so nothing is truncated. */
export function Footer() {
  const columns: { head: string; links: string[] }[] = [
    { head: '/wear-points', links: wearPoints.map((w) => `/wear-points/${w.slug}`) },
    { head: '/tool-types', links: toolTypes.map((t) => `/tool-types/${t.slug}`) },
    { head: '/materials', links: materials.map((m) => `/materials/${m.slug}`) },
    { head: '/gear', links: [...categories.map((c) => `/gear/${c.slug}`)] },
    { head: '/tools', links: ['/wear-point-check', '/drive-check', '/glossary', '/about', '/contact', '/privacy', '/terms', '/affiliate-disclosure'] },
  ]
  return (
    <footer className="on-dark mt-0 bg-carbon text-white" data-section-layout="footer-five-columns">
      <div className="h-[6px] bg-amber" aria-hidden="true" />
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        {columns.map((col) => (
          <nav key={col.head} aria-label={`Footer: ${col.head.slice(1)}`}>
            <p className="font-narrow text-[13px] font-bold uppercase tracking-[0.08em]">
              <PageLink href={col.head} className="plain-link text-amber hover:underline" />
            </p>
            <ul className="mt-3 space-y-2 text-[14px] leading-snug">
              {col.links.map((href) => (
                <li key={href}>
                  <PageLink href={href} className="plain-link text-white/90 hover:text-white hover:underline" />
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/15">
        <div className="wrap flex flex-col gap-3 py-6 text-[13px] leading-relaxed text-white/85 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2.5">
            <LogoMark size={22} />
            <span>
              {SITE.name} · {SITE.address} · <a className="text-link" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </span>
          </p>
          <p>
            Reference only. As an Amazon Associate this site earns from qualifying purchases. © {SITE.year} {SITE.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
