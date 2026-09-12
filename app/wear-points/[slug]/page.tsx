import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EdgeStrip } from '@/components/EdgeStrip'
import { PageLink } from '@/components/PageLink'
import { Sources } from '@/components/Sources'
import { categories } from '@/data/gear'
import { productByAsin } from '@/data/products'
import { WEAR_SLUGS } from '@/data/types'
import { wearPoints } from '@/data/wear-points'
import { fillSentence } from '@/lib/fill'
import { pageMeta } from '@/lib/seo'

export function generateStaticParams() {
  return wearPoints.map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const w = wearPoints.find((x) => x.slug === slug)
  if (!w) return {}
  return pageMeta({ path: `/wear-points/${w.slug}`, phrase: w.phrase, description: w.metaDescription })
}

function ListingList({ asins, id }: { asins: string[]; id: string }) {
  const grouped = categories
    .map((c) => ({ c, items: asins.map(productByAsin).filter((p) => p.category === c.slug) }))
    .filter((g) => g.items.length > 0)
  return (
    <div className="mt-3 space-y-4" data-listing-list={id} data-count={asins.length}>
      {grouped.map((g) => (
        <div key={g.c.slug}>
          <p className="label">
            <PageLink href={`/gear/${g.c.slug}`} className="plain-link hover:text-blue" /> · {g.items.length}
          </p>
          <ul className="mt-1 space-y-1 text-[14px] leading-snug">
            {g.items.map((p) => (
              <li key={p.asin}>
                <PageLink href={`/gear/${p.category}#listing-${p.asin}`} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default async function WearPointPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const w = wearPoints.find((x) => x.slug === slug)
  if (!w) notFound()
  const namedAcrossCatalog = WEAR_SLUGS.filter((s) => (wearPoints.find((x) => x.slug === s)?.namedBy.length ?? 0) > 0)
  const replacementAcrossCatalog = WEAR_SLUGS.filter((s) => (wearPoints.find((x) => x.slug === s)?.statesReplacement.length ?? 0) > 0)

  return (
    <article className="mx-auto w-full max-w-wear px-5 pb-20 pt-10 md:px-8" data-page-layout="strip-top">
      <p className="label label-lg !text-blue">Wear point</p>
      <h1 className="mt-1 text-[36px] md:text-[46px]">{w.title}</h1>

      <section aria-labelledby="strip-heading" className="mt-6 border-y-[3px] border-carbon bg-haze px-4 py-5 md:px-6">
        <h2 id="strip-heading" className="label label-lg !text-ink">
          This part on the catalog strip
        </h2>
        <p className="mt-1 text-[14px] text-ink-2">
          Across the whole catalog a tooth is sharp when any listing names that part. The lit tooth is this page.
        </p>
        <div className="mt-3">
          <EdgeStrip
            place="wear-point-header"
            named={namedAcrossCatalog}
            replacement={replacementAcrossCatalog}
            highlight={w.slug}
            idPrefix="wp-header"
          />
        </div>
      </section>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section aria-labelledby="named-heading" className="border-t-[3px] border-blue pt-4">
          <h2 id="named-heading" className="text-[22px]">
            Listings naming it <span className="font-narrow text-blue" data-count={w.namedBy.length}>{w.namedBy.length}</span>
          </h2>
          <ListingList asins={w.namedBy} id="named" />
        </section>
        <section aria-labelledby="silent-heading" className="border-t-[3px] border-haze-2 pt-4">
          <h2 id="silent-heading" className="text-[22px]">
            Listings silent on it <span className="font-narrow text-ink-3" data-count={w.silentOn.length}>{w.silentOn.length}</span>
          </h2>
          <ListingList asins={w.silentOn} id="silent" />
        </section>
      </div>

      <div className="prose-block mx-auto mt-14 max-w-narrow text-[16px] leading-[1.7]">
        <h2 className="text-[26px]">What goes first</h2>
        <p className="mt-3">{fillSentence(w.whatGoesFirst)}</p>
        <h2 className="mt-10 text-[26px]">What the listings say</h2>
        <p className="mt-3">{fillSentence(w.whatTheListingsSay)}</p>
        {w.notes.map((n) => (
          <p key={n}>{fillSentence(n)}</p>
        ))}

        <p className="mt-10 border-2 border-flag bg-white px-5 py-4 text-[15px] text-ink" data-flag-strip="">
          <span className="label mb-1 block !text-flag">Silence is silence</span>
          {w.flagLine}
        </p>

        <section aria-labelledby="types-heading" className="mt-10">
          <h2 id="types-heading" className="label label-lg !text-ink">
            Tool types that name this part
          </h2>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[15px]">
            {w.toolTypeSlugs.map((t) => (
              <li key={t}>
                <PageLink href={`/tool-types/${t}`} />
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10">
          <Sources ids={w.sources} />
        </div>
        <p className="mt-8 text-[14px]">
          <PageLink href="/wear-points" /> · <PageLink href="/wear-point-check" />
        </p>
      </div>
    </article>
  )
}
