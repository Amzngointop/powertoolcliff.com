import { PageLink } from '@/components/PageLink'
import { WearTable } from '@/components/WearTable'
import { wearPoints } from '@/data/wear-points'
import { fillSentence } from '@/lib/fill'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  path: '/wear-points',
  phrase: 'Wear points and how many listings in each category name them',
  description:
    'A matrix of tool categories against the parts that wear first, with the number of listings in each category that name each part, zeros spelled out.',
})

export default function WearPointsIndex() {
  return (
    <div className="bg-haze pb-20" data-page-layout="index-matrix">
      <div className="wrap pt-10">
        <p className="label label-lg !text-blue">Index</p>
        <h1 className="mt-1 text-[38px] md:text-[48px]">{titleForPath('/wear-points')}</h1>
        <p className="mt-3 max-w-[760px] text-[17px]">
          {fillSentence(
            'Each cell counts the listings in a category that name a part. A row leads to the category, a column to the part. Of the {w:products} listings, {w:named-none} name none of the {w:wear-points} parts at all.',
          )}
        </p>
        <div className="mt-8">
          <WearTable caption="Listings per category that name each wear point. None means no listing in that category names the part." />
        </div>
        <ul className="mt-10 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {wearPoints.map((w) => (
            <li key={w.slug} className="border-t border-rule pt-3">
              <PageLink href={`/wear-points/${w.slug}`} className="text-link font-display text-[18px] font-semibold" />
              <p className="mt-1 text-[14px] leading-snug">{fillSentence(w.whatTheListingsSay).split('. ')[0]}.</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
