import { CategoryTiles } from '@/components/CategoryTiles'
import { PageLink } from '@/components/PageLink'
import { misfiled } from '@/lib/catalog'
import { fillSentence } from '@/lib/fill'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  path: '/gear',
  phrase: 'Departments of power tools and garden tools, listing by listing',
  description:
    'Departments from household tool kits to pruners, each listing shown with what it names, what it leaves out and whether it states a part can be replaced.',
})

export default function GearIndex() {
  const moved = misfiled()
  return (
    <div className="pb-20" data-page-layout="index-round-tiles">
      <div className="wrap pt-10">
        <p className="label label-lg !text-blue">Index</p>
        <h1 className="mt-1 text-[38px] md:text-[48px]">{titleForPath('/gear')}</h1>
        <p className="mt-3 max-w-[780px] text-[17px]">
          {fillSentence(
            'The catalog is called power tools and garden tools. The workshop half holds {w:workshop} listings, {w:workshop-powered} of them powered; the garden half holds {w:garden}, and the count of those that are powered is {z:garden-powered}.',
          )}
        </p>
      </div>
      <div className="mt-10 bg-haze py-12">
        <div className="wrap">
          <CategoryTiles size="lg" />
        </div>
      </div>
      <section className="wrap mt-12 max-w-[900px]" aria-labelledby="moved-heading">
        <h2 id="moved-heading" className="text-[24px]">
          Listings filed outside their kind <span className="font-narrow text-flag" data-count={moved.length}>{moved.length}</span>
        </h2>
        <p className="mt-2 text-[15px]">These stay where the catalog filed them, and each card carries a note.</p>
        <ul className="mt-4 divide-y divide-rule border-y border-rule">
          {moved.map((p) => (
            <li key={p.asin} className="py-3 text-[15px]">
              <PageLink href={`/gear/${p.category}#listing-${p.asin}`} />
              <span className="block text-[13.5px] text-ink-3">
                Filed in <PageLink href={`/gear/${p.category}`} className="plain-link underline" />
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
