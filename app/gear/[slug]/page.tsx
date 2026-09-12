import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure'
import { CompareTable } from '@/components/CompareTable'
import { FAQ } from '@/components/FAQ'
import { PageLink } from '@/components/PageLink'
import { ProductCard } from '@/components/ProductCard'
import { categories } from '@/data/gear'
import { inCategory } from '@/lib/catalog'
import { fill, fillSentence } from '@/lib/fill'
import { pageMeta } from '@/lib/seo'

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const c = categories.find((x) => x.slug === slug)
  if (!c) return {}
  return pageMeta({ path: `/gear/${c.slug}`, phrase: c.phrase, description: c.metaDescription })
}

export default async function GearPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const c = categories.find((x) => x.slug === slug)
  if (!c) notFound()
  const items = inCategory(c.slug)
  const faq = c.faq.map((f) => ({ q: fill(f.q), a: fillSentence(f.a) }))
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <div className="wrap pb-20 pt-10" data-page-layout="catalog-grid">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="label label-lg !text-blue">Department</p>
      <h1 className="mt-1 text-[38px] md:text-[50px]">{c.title}</h1>
      <p className="mt-2 inline-block bg-carbon px-3 py-1.5 font-narrow text-[14px] font-bold uppercase tracking-[0.07em] text-white">
        <span className="text-amber-deep">What sets it apart:</span> <span className="text-white">{fill(c.coreJob)}</span>
      </p>
      <p className="mt-4 max-w-[820px] text-[17px] leading-relaxed">{fillSentence(c.intro)}</p>
      <p className="mt-3 text-[14px]">
        <span className="label mr-1">Kind of tool</span>
        <PageLink href={`/tool-types/${c.toolTypeSlug}`} />
        <span className="text-ink-3"> · </span>
        <span className="label mr-1">Listings</span>
        <span data-count={items.length}>{items.length}</span>
      </p>
      <div className="mt-6">
        <AffiliateDisclosure position="top" />
      </div>

      {c.subgroups.map((g) => {
        const group = items.filter((p) => p.subgroup === g.id).sort((a, b) => a.rank - b.rank)
        return (
          <section key={g.id} id={g.id} className="mt-14 border-t-[3px] border-carbon pt-5" data-subgroup={g.id} aria-labelledby={`${g.id}-heading`}>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 id={`${g.id}-heading`} className="text-[26px]">
                {g.title}
              </h2>
              <span className="label label-lg !text-ink" data-count={group.length}>
                {group.length === 1 ? 'A single listing' : `${group.length} listings`}
              </span>
            </div>
            <p className="mt-2 max-w-[820px] text-[15.5px]">{fillSentence(g.intro)}</p>
            <ul className="mt-6 grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {group.map((p) => (
                <li key={p.asin} className="h-full">
                  <ProductCard p={p} />
                </li>
              ))}
            </ul>
            {group.length >= 2 ? (
              <div className="mt-6">
                <CompareTable items={group} groupedBy={g.groupedBy} caption={`${g.title}: only figures that differ between these listings are shown as columns.`} />
              </div>
            ) : (
              <p className="mt-5 text-[14px] text-ink-3" data-single-card="">
                With nothing else in {g.title.charAt(0).toLowerCase() + g.title.slice(1)} to set beside it, this card stands without a comparison table.
              </p>
            )}
          </section>
        )
      })}

      <div className="mt-16 max-w-[860px]">
        <FAQ items={faq} heading={`Plain answers about ${c.title}`} />
      </div>
      <div className="mt-12">
        <AffiliateDisclosure position="bottom" />
      </div>
    </div>
  )
}
