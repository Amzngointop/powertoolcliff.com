import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageLink } from '@/components/PageLink'
import { SellerWords } from '@/components/SellerWords'
import { Sources } from '@/components/Sources'
import { categoryBySlug } from '@/data/gear'
import { toolTypes } from '@/data/tool-types'
import { DRIVE_LABELS, FIELDS, FIELD_LABELS, inCategory, namedIn } from '@/lib/catalog'
import { fillSentence } from '@/lib/fill'
import { pageMeta } from '@/lib/seo'

export function generateStaticParams() {
  return toolTypes.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const t = toolTypes.find((x) => x.slug === slug)
  if (!t) return {}
  return pageMeta({ path: `/tool-types/${t.slug}`, phrase: t.phrase, description: t.metaDescription })
}

export default async function ToolTypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = toolTypes.find((x) => x.slug === slug)
  if (!t) notFound()
  const c = categoryBySlug(t.category)
  const items = inCategory(t.category)
  const exceptions = items.filter((p) => p.drive !== t.drive)
  const figures = FIELDS.map((f) => ({ f, n: items.filter((p) => p[f] !== null).length })).filter((x) => x.n > 0)
  const quoted = items.filter((p) => p.sellerWords.length > 0)
  const wearN = namedIn(t.category, t.wearPointSlug)

  return (
    <div className="mx-auto w-full max-w-types px-5 pb-20 pt-10 md:px-8" data-page-layout="sticky-left">
      <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="self-start border-t-[3px] border-amber bg-haze p-4 lg:sticky lg:top-6" aria-label="At a glance">
          <p className="label !text-ink">Listings of this kind</p>
          <p className="mt-1 font-display text-[28px] font-bold leading-none text-ink" data-count={items.length}>
            {items.length}
          </p>
          <p className="label mt-4 !text-ink">Hangs on</p>
          <p className="mt-1 text-[15px] leading-snug">
            <PageLink href={`/wear-points/${t.wearPointSlug}`} />
            <span className="block text-[13px] text-ink-3" data-count={wearN}>
              named by {wearN} of {items.length} listings
            </span>
          </p>
          <p className="label mt-4 !text-ink">Driven by</p>
          <p className="mt-1 text-[15px] leading-snug text-ink" data-drive={t.drive} data-exceptions={exceptions.length}>
            {DRIVE_LABELS[t.drive]}
            {exceptions.length > 0 ? (
              <span className="block text-[13px] text-ink-3">
                with {exceptions.length === 1 ? 'an exception' : `${exceptions.length} exceptions`}, read from the listing
              </span>
            ) : null}
          </p>
          <p className="label mt-4 !text-ink">Filed in</p>
          <p className="mt-1 text-[15px] leading-snug">
            <PageLink href={`/gear/${c.slug}`} />
          </p>
        </aside>

        <article>
          <p className="label label-lg !text-blue">Tool type</p>
          <h1 className="mt-1 text-[36px] md:text-[44px]">{t.title}</h1>
          <div className="prose-block mt-5 text-[16px]">
            <p className="text-[18px] leading-relaxed text-ink">{fillSentence(t.whatItIs)}</p>
            <h2 className="!mt-10 text-[24px]">Why it hangs on this wear point</h2>
            <p className="mt-3">{fillSentence(t.whyThisWearPoint)}</p>
            <h2 className="!mt-10 text-[24px]">What drives it</h2>
            <p className="mt-3">{fillSentence(t.driveNote)}</p>
          </div>

          <section aria-labelledby="figures-heading" className="mt-10">
            <h2 id="figures-heading" className="text-[24px]">
              Figures these listings print
            </h2>
            {figures.length > 0 ? (
              <div className="table-wrap mt-3">
                <table className="data-table" data-figures-table="">
                  <thead>
                    <tr>
                      <th scope="col">Figure</th>
                      <th scope="col" className="num">
                        Listings printing it, of {items.length}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {figures.map((x) => (
                      <tr key={x.f}>
                        <td>{FIELD_LABELS[x.f]}</td>
                        <td className="num" data-count={x.n}>
                          {x.n}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-3 text-[15px]" data-figures-table="none">
                No listing filed under this kind of tool prints a figure of any kind.
              </p>
            )}
            <p className="mt-5 border-2 border-flag px-5 py-4 text-[15px] text-ink" data-flag-strip="" data-missing-figure="">
              <span className="label mb-1 block !text-flag">The figure left out</span>
              {fillSentence(t.missingFigure)}
            </p>
          </section>

          <div className="prose-block mt-10 text-[16px]">
            <h2 className="text-[24px]">What published documents cover</h2>
            {t.notes.map((n, i) => (
              <p key={n} className={i === 0 ? 'mt-3' : ''}>
                {fillSentence(n)}
              </p>
            ))}
          </div>

          {quoted.length > 0 ? (
            <section aria-labelledby="quotes-heading" className="mt-10">
              <h2 id="quotes-heading" className="text-[24px]">
                Seller wording in these listings
              </h2>
              <p className="mt-2 text-[14px] text-ink-3">Quoted as printed. It describes how a listing is sold, and this site reads nothing further into it.</p>
              <ul className="mt-3 space-y-3">
                {quoted.map((p) => (
                  <li key={p.asin} className="border-l-[3px] border-haze-2 pl-3">
                    <PageLink href={`/gear/${p.category}#listing-${p.asin}`} className="text-link text-[14px]" />
                    <SellerWords words={p.sellerWords} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mt-10">
            <Sources ids={t.sources} />
          </div>
          <p className="mt-8 text-[14px]">
            <PageLink href="/tool-types" /> · <PageLink href="/drive-check" />
          </p>
        </article>
      </div>
    </div>
  )
}
