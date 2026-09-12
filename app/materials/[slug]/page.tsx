import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageLink } from '@/components/PageLink'
import { Sources } from '@/components/Sources'
import { categories } from '@/data/gear'
import { materials } from '@/data/materials'
import { products } from '@/data/products'
import { wearPoints } from '@/data/wear-points'
import type { Product } from '@/data/types'
import { printing } from '@/lib/catalog'
import { fillSentence } from '@/lib/fill'
import { pageMeta } from '@/lib/seo'

export function generateStaticParams() {
  return materials.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const m = materials.find((x) => x.slug === slug)
  if (!m) return {}
  return pageMeta({ path: `/materials/${m.slug}`, phrase: m.phrase, description: m.metaDescription })
}

/** The longest of the page's words that the listing actually prints, in its name, facts or seller wording. */
function printedWord(p: Product, words: string[]): string | null {
  const hay = `${p.name} ${p.listingStates} ${p.sellerWords.join(' ')}`.toLowerCase()
  const found = words.filter((w) => hay.includes(w.toLowerCase())).sort((a, b) => b.length - a.length)
  return found[0] ?? null
}

export default async function MaterialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const m = materials.find((x) => x.slug === slug)
  if (!m) notFound()
  const rows = printing(m.slug)
  const share = rows.length

  return (
    <article className="mx-auto w-full max-w-materials px-5 pb-20 pt-10 md:px-8" data-page-layout="word-share">
      <p className="label label-lg !text-blue">Material word</p>
      <h1 className="mt-1 text-[22px] text-ink-2">{m.title}</h1>
      <p className="mt-3 font-display text-[44px] font-bold leading-[1.05] text-ink md:text-[64px]" data-word-share={share}>
        “{m.words[m.words.length - 1]}” <span className="text-blue">{share}</span>
        <span className="block font-body text-[18px] font-normal text-ink-2 md:text-[20px]">
          of {products.length} listings print it
        </span>
      </p>
      <div className="mt-4 flex h-3 w-full gap-[2px]" aria-hidden="true">
        {products.map((p) => (
          <span key={p.asin} className={`h-full flex-1 ${rows.includes(p) ? 'bg-blue' : 'bg-haze-2'}`} />
        ))}
      </div>

      <div className="prose-block mt-12 text-[16px]">
        <h2 className="text-[26px]">What it names</h2>
        <p className="mt-3">{fillSentence(m.whatItNames)}</p>

        <h2 className="!mt-10 text-[26px]">Who defines it</h2>
        <p className="mt-2">
          <span className={m.definedBy === 'nobody' ? 'chip chip-flag' : 'chip chip-quiet'}>
            {m.definedBy === 'nobody' ? 'No published definition found' : `Traced to ${m.definedBy}`}
          </span>
        </p>
        <p className="mt-3">{fillSentence(m.whoDefines)}</p>

        <h2 className="!mt-10 text-[26px]">What it does not promise</h2>
        <p className="mt-3 border-l-[3px] border-flag pl-4">{fillSentence(m.whatItDoesNotPromise)}</p>
        {m.notes.map((n) => (
          <p key={n}>{fillSentence(n)}</p>
        ))}
      </div>

      <section aria-labelledby="printing-heading" className="mt-12">
        <h2 id="printing-heading" className="text-[26px]">
          Listings printing it <span className="font-narrow text-blue" data-count={rows.length}>{rows.length}</span>
        </h2>
        <div className="table-wrap mt-3 border border-rule">
          <table className="data-table" data-printing-table="">
            <thead>
              <tr>
                <th scope="col">Listing</th>
                <th scope="col">Category</th>
                <th scope="col">Word as printed</th>
                <th scope="col">Wear points named</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.asin}>
                  <td className="min-w-[240px]">
                    <PageLink href={`/gear/${p.category}#listing-${p.asin}`} />
                  </td>
                  <td className="whitespace-nowrap">{categories.find((c) => c.slug === p.category)?.title}</td>
                  <td className="whitespace-nowrap font-semibold text-ink">{printedWord(p, m.words)}</td>
                  <td>{p.wearPointsNamed.map((w) => wearPoints.find((x) => x.slug === w)?.short).join(', ') || 'none'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-12">
        <Sources ids={m.sources} />
      </div>
      <p className="mt-8 text-[14px]">
        <PageLink href="/materials" /> · <PageLink href="/glossary" />
      </p>
    </article>
  )
}
