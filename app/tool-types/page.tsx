import { PageLink } from '@/components/PageLink'
import { Photo } from '@/components/Photo'
import { photos } from '@/data/photos'
import { toolTypes } from '@/data/tool-types'
import { DRIVE_LABELS, inCategory, namedIn } from '@/lib/catalog'
import { fillSentence } from '@/lib/fill'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  path: '/tool-types',
  phrase: 'Kinds of tool in the catalog, what drives each and its wear point',
  description:
    'Kinds of tool, from the household kit to the sprinkler: what each is by its listings, what drives it, and the one wear point it hangs on in this catalog.',
})

export default function ToolTypesIndex() {
  return (
    <div className="pb-20" data-page-layout="index-photo-cards">
      <div className="wrap pt-10">
        <p className="label label-lg !text-blue">Index</p>
        <h1 className="mt-1 text-[38px] md:text-[48px]">{titleForPath('/tool-types')}</h1>
        <p className="mt-3 max-w-[760px] text-[17px]">
          {fillSentence(
            'Kinds of tool, not the interactive tools on this site. Each is read from the listings filed under it, and each hangs on a wear point those listings name, with the count printed on its card. Of the {w:products} listings, {w:garden} are garden tools and {z:garden-powered} of those is powered.',
          )}
        </p>
      </div>
      <div className="wrap mt-8">
        <Photo photo={photos['spread-tools']} sizes="(min-width: 1200px) 1136px, 100vw" priority />
      </div>
      <ul className="wrap mt-10 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {toolTypes.map((t) => {
          const items = inCategory(t.category)
          return (
            <li key={t.slug} className="card flex h-full flex-col p-5">
              <p className="label !text-ink">{DRIVE_LABELS[t.drive]}</p>
              <h2 className="mt-1 text-[22px]">
                <PageLink href={`/tool-types/${t.slug}`} className="plain-link hover:text-blue" />
              </h2>
              <p className="mt-2 flex-grow text-[15px] leading-relaxed">{fillSentence(t.whyThisWearPoint).split('. ')[0]}.</p>
              <p className="mt-4 border-t border-rule pt-3 text-[13.5px]">
                <span className="label mr-1">Hangs on</span>
                <PageLink href={`/wear-points/${t.wearPointSlug}`} />{' '}
                <span className="text-ink-3" data-count={namedIn(t.category, t.wearPointSlug)}>
                  ({namedIn(t.category, t.wearPointSlug)} of {items.length})
                </span>
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
