import { PageLink } from '@/components/PageLink'
import { Photo } from '@/components/Photo'
import { glossary } from '@/data/glossary'
import { photos } from '@/data/photos'
import { fillSentence } from '@/lib/fill'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  path: '/glossary',
  phrase: 'Glossary of tool, blade, battery and sprinkler terms used in listings',
  description:
    'Plain definitions for the terms tool listings print, from bit tip and bypass pruner to amp hour, rotor head and the water pressure no sprinkler listing states.',
})

export default function GlossaryPage() {
  const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term))
  return (
    <div className="wrap pb-20 pt-10" data-page-layout="glossary">
      <p className="label label-lg !text-blue">Reference</p>
      <h1 className="mt-1 text-[38px] md:text-[48px]">{titleForPath('/glossary')}</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-[300px_minmax(0,1fr)]">
        <Photo photo={photos.contents} sizes="(min-width: 768px) 300px, 92vw" />
        <nav aria-labelledby="contents-heading" className="border-t-[3px] border-carbon pt-3">
          <h2 id="contents-heading" className="label label-lg !text-ink">
            Contents
          </h2>
          <ul className="mt-3 columns-2 gap-6 text-[15px] leading-8 sm:columns-3">
            {sorted.map((g) => (
              <li key={g.slug} className="break-inside-avoid">
                <PageLink href={`/glossary#${g.slug}`} />
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <dl className="mt-12 max-w-[820px] divide-y divide-rule border-y border-rule" data-count={glossary.length}>
        {sorted.map((g) => (
          <div key={g.slug} className="grid gap-1 py-5 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-6">
            <dt id={g.slug} className="scroll-mt-6 font-display text-[18px] font-semibold text-ink">
              {g.term}
            </dt>
            <dd className="text-[15.5px] leading-relaxed">
              {fillSentence(g.definition)}
              {g.links.length > 0 ? (
                <span className="mt-1.5 block text-[13.5px]">
                  <span className="label mr-1">Related</span>
                  {g.links.map((l, i) => (
                    <span key={l}>
                      <PageLink href={l} />
                      {i < g.links.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
