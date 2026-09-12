import Image from 'next/image'
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure'
import { CategoryTiles } from '@/components/CategoryTiles'
import { DriveCheck } from '@/components/DriveCheck'
import { KnurlRule } from '@/components/KnurlRule'
import { MaterialsTable } from '@/components/MaterialsTable'
import { PageLink } from '@/components/PageLink'
import { Photo, Spread } from '@/components/Photo'
import { WearPointCheck } from '@/components/WearPointCheck'
import { WearTable } from '@/components/WearTable'
import { categories } from '@/data/gear'
import { photos } from '@/data/photos'
import { toolTypes } from '@/data/tool-types'
import { wearPoints } from '@/data/wear-points'
import { DRIVE_LABELS, cap, inCategory, lookup, misfiled, numberWord } from '@/lib/catalog'
import { fillSentence } from '@/lib/fill'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  path: '/',
  phrase: 'Tool parts that wear out first and what each listing says about them',
  description:
    'A reference to the part of a tool that wears first: batteries, bit tips, blades, drives, nozzles and claws, and what each listing says or leaves out.',
})

function ToothMark() {
  return (
    <svg viewBox="0 0 40 42" className="h-[34px] w-[32px] shrink-0" aria-hidden="true" focusable="false">
      <path d="M0 34 L20 2 L40 34 Z" fill="#0B57D0" />
      <rect x="0" y="34" width="40" height="2" fill="#D5DAE2" />
    </svg>
  )
}

const ANSWERS = [
  {
    q: 'Does a listing that says nothing about a part mean the part lasts?',
    a: 'No. Silence is only silence. {W:silent-replacement} of the {w:products} listings say nothing about replacement, and this site reads nothing into that.',
  },
  {
    q: 'How many listings state that a part can be replaced?',
    a: '{W:states-replacement}: the Felco F2 pruning shears. The listing does not say which parts, and this site does not guess.',
  },
  {
    q: 'Is any garden tool in this catalog powered?',
    a: 'No. Weeder, sprinkler and pruner listings stating a battery or a voltage: {z:garden-powered} of {w:garden}. {W:garden-motor-word} sprinkler listings print the word motor without naming a battery, a voltage or a cord.',
  },
  {
    q: 'Which sprinkler listings print a water pressure?',
    a: '{Z:sprinklers-pressure} of them. {W:sprinklers-area} print a coverage area in square feet, and the Orbit tripod listing prints the word pressure with no number.',
  },
  {
    q: 'Are drill voltages compared across brands here?',
    a: 'No. Each listing’s voltage is reported as printed. It is not converted, and a brand’s figure is not ranked against another brand’s.',
  },
  {
    q: 'Why do some listings sit in the wrong department?',
    a: 'That is where the catalog files them. {W:misfiled} listings sit outside their kind, and each keeps its place with a note on its card.',
  },
]

export default function HomePage() {
  const rail = categories.map((c) => inCategory(c.slug).find((p) => p.rank === 1)!)
  const moved = misfiled()
  const stats = [
    { key: 'products', label: 'listings read, every one of them from its listing text' },
    { key: 'named-none', label: `listings that name none of the ${numberWord(wearPoints.length)} wear points` },
    { key: 'sprinklers-pressure', label: 'sprinkler listings that print a water pressure' },
    { key: 'drills-20v', label: 'drill listings printing the same voltage' },
  ]

  return (
    <>
      {/* 1 · The Counter */}
      <section className="bg-white pb-10 pt-6 md:pt-8" data-section-layout="counter-banner-card-tiles">
        <div className="wrap grid gap-5 lg:grid-cols-[62fr_38fr]">
          <div className="relative overflow-hidden rounded-[2px] bg-carbon px-6 py-10 text-white md:px-10 md:py-14" data-counter-banner="">
            {/* The diagonal stripe lives in a clipped corner the text column never reaches (pr on the content below). */}
            <div aria-hidden="true" className="absolute right-0 top-0 h-[72px] w-[72px] overflow-hidden md:h-[96px] md:w-[96px]">
              <div className="absolute -right-10 top-5 h-[14px] w-[170px] rotate-45 bg-amber md:top-7" />
            </div>
            <div aria-hidden="true" className="absolute bottom-0 left-0 h-[6px] w-full bg-amber" />
            <div className="relative pr-14 md:pr-20">
            <p className="font-narrow text-[13px] font-bold uppercase tracking-[0.1em] text-amber-deep">Wear point reference · {lookup('products')} listings</p>
            <h1 className="mt-3 max-w-[620px] text-[36px] !text-white md:text-[52px]">The part that goes first, and what the listing says about it</h1>
            <p className="mt-5 max-w-[600px] text-[17px] leading-relaxed text-white/90">
              {fillSentence(
                'This reference files {w:products} tool listings under the part each would need to describe for anyone to know what gets replaced: the battery, the bit tip, the blade edge, the drive, the nozzle and filter, or the claw. Then it counts what the listings actually say.',
              )}
            </p>
            <div className="mt-8">
              <PageLink href="/wear-points" className="btn" />
            </div>
            </div>
          </div>
          <aside className="flex flex-col border border-rule bg-white p-5" data-counter-card="" aria-labelledby="counter-number">
            <Photo photo={photos['hero-card']} sizes="(min-width: 1200px) 390px, (min-width: 1024px) 31vw, 92vw" priority aspect="1 / 1" />
            <p id="counter-number" className="mt-4 font-display text-[72px] font-bold leading-none text-blue" data-stat="states-replacement">
              {lookup('states-replacement')}
            </p>
            <p className="mt-2 text-[16px] leading-snug text-ink">
              {fillSentence('listing out of {w:products} states that its parts can be replaced. The rest say nothing on it.')}
            </p>
          </aside>
        </div>
        <div className="wrap mt-8">
          <CategoryTiles />
        </div>
      </section>

      {/* 2 · The Wear Table */}
      <section className="bg-haze py-14" data-section-layout="matrix-6x6" aria-labelledby="wear-table-heading">
        <div className="wrap">
          <p className="label label-lg !text-blue">
            {cap(numberWord(categories.length))} departments by {numberWord(wearPoints.length)} parts
          </p>
          <h2 id="wear-table-heading" className="mt-1 text-[32px] md:text-[38px]">
            The Wear Table
          </h2>
          <p className="mt-2 max-w-[760px] text-[16px]">
            Each cell is the number of listings in a department that name a part. A row opens the department; a column opens the part.
          </p>
          <div className="mt-6">
            <WearTable caption="Listings naming each wear point, by department. None is written out where no listing names the part." />
          </div>
        </div>
      </section>

      {/* 3 · Silence Band */}
      <section className="wrap py-10" data-section-layout="bordered-band" aria-labelledby="silence-heading">
        <div className="border-[3px] border-flag bg-white px-6 py-7 md:px-10">
          <p className="label label-lg !text-flag">Silence band</p>
          <h2 id="silence-heading" className="mt-1 text-[26px] md:text-[32px]" data-stat="silent-replacement">
            {fillSentence('{W:silent-replacement} of {w:products} listings say nothing about replacing the part that wears.')}
          </h2>
          <p className="mt-3 max-w-[820px] text-[16px] text-ink">
            {fillSentence(
              '{W:named-none} of them do not name any of the {w:wear-points} parts at all. Silence is silence: it is not a statement that a part lasts, and it is not a property of the tool.',
            )}
          </p>
        </div>
      </section>

      {/* 4 · Wear Point Cards */}
      <section className="wrap pb-6 pt-4" data-section-layout="card-grid-3x2" aria-labelledby="cards-heading">
        <h2 id="cards-heading" className="text-[30px]">
          The {numberWord(wearPoints.length)} wear points
        </h2>
        <ul className="mt-6 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3" data-count={wearPoints.length}>
          {wearPoints.map((w) => (
            <li key={w.slug} className="card flex h-full flex-col p-5">
              <div className="flex items-center gap-3">
                <ToothMark />
                <h3 className="text-[21px]">
                  <PageLink href={`/wear-points/${w.slug}`} className="plain-link hover:text-blue" />
                </h3>
              </div>
              <p className="mt-3 flex-grow text-[15px] leading-relaxed">{w.cardLine}</p>
              <p className="label mt-4 border-t border-rule pt-3" data-count={w.namedBy.length}>
                Named by {w.namedBy.length} of {lookup('products')} listings
              </p>
            </li>
          ))}
        </ul>
      </section>

      <KnurlRule />

      {/* 5 · Full-bleed Spread */}
      <Spread photo={photos['spread-wear']} height="44vh" />

      {/* 6 · Wear Point Check */}
      <section className="on-dark mt-10 bg-carbon py-14 text-white" data-section-layout="dark-tool" aria-labelledby="wpc-heading">
        <div className="wrap">
          <p className="font-narrow text-[13px] font-bold uppercase tracking-[0.1em] text-amber-deep">Interactive check</p>
          <h2 id="wpc-heading" className="mt-1 text-[32px] !text-white md:text-[38px]">
            <PageLink href="/wear-point-check" className="plain-link text-white hover:underline" />
          </h2>
          <p className="mt-2 max-w-[720px] text-[16px] text-white/90">A department and a listing are chosen here, and the listing’s {numberWord(wearPoints.length)} teeth are drawn from what it states.</p>
          <div className="mt-8">
            <WearPointCheck dark />
          </div>
        </div>
      </section>

      {/* 7 · Tools Carousel */}
      <section className="py-14" data-section-layout="snap-carousel" aria-labelledby="types-heading">
        <div className="wrap">
          <h2 id="types-heading" className="text-[30px]">
            Kinds of tool, and the part each hangs on
          </h2>
          <p className="mt-1 text-[15px] text-ink-3">The row scrolls sideways and works without script.</p>
        </div>
        <ul className="snap-row wrap mt-6" data-count={toolTypes.length}>
          {toolTypes.map((t) => (
            <li key={t.slug} className="card flex w-[270px] flex-col p-5 md:w-[300px]">
              <p className="label !text-ink">{DRIVE_LABELS[t.drive]}</p>
              <h3 className="mt-1 text-[21px]">
                <PageLink href={`/tool-types/${t.slug}`} className="plain-link hover:text-blue" />
              </h3>
              <p className="mt-3 flex-grow text-[14.5px] leading-relaxed">
                <span className="label mr-1">Hangs on</span>
                <PageLink href={`/wear-points/${t.wearPointSlug}`} />
              </p>
              <p className="mt-3 border-t border-rule pt-2 text-[13.5px] text-ink-3">Left out: {fillSentence(t.missingFigure)}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 8 · Materials Table */}
      <section className="wrap pb-6" data-section-layout="wide-table" aria-labelledby="materials-heading">
        <h2 id="materials-heading" className="text-[30px]">
          Words printed where a lifespan would go
        </h2>
        <div className="mt-6">
          <MaterialsTable caption="Material words in this catalog, who defines them, and how many listings print each." />
        </div>
      </section>

      <KnurlRule />

      {/* 9 · Numbers Strip */}
      <section className="bg-blue py-12 text-white" data-section-layout="stat-row-4" aria-label={`The catalog in ${numberWord(stats.length)} numbers`}>
        <ul className="wrap grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <li key={s.key} className="border-l-[4px] border-amber pl-4" data-stat={s.key}>
              <p className="font-display text-[56px] font-bold leading-none text-white">{lookup(s.key)}</p>
              <p className="mt-2 text-[15px] leading-snug text-white">{s.label}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 10 · Full-bleed Spread */}
      <div className="mt-10">
        <Spread photo={photos['spread-materials']} height="40vh" />
      </div>

      {/* 11 · Drive Check */}
      <section className="mx-auto w-full max-w-narrow px-5 py-14" data-section-layout="narrow-centered-tool" aria-labelledby="dc-heading">
        <p className="label label-lg !text-blue">Interactive check</p>
        <h2 id="dc-heading" className="mt-1 text-[32px]">
          <PageLink href="/drive-check" className="plain-link hover:text-blue" />
        </h2>
        <div className="mt-6">
          <DriveCheck />
        </div>
      </section>

      {/* 12 · What This Catalog Is */}
      <section className="mx-auto w-full max-w-materials px-5 pb-4 pt-6" data-section-layout="narrow-prose" aria-labelledby="catalog-heading">
        <h2 id="catalog-heading" className="text-[30px]">
          What this catalog is
        </h2>
        <div className="prose-block mt-4 text-[16.5px] leading-[1.7]">
          <p>
            {fillSentence(
              'It holds {w:products} listings in {w:categories} departments and is called power tools and garden tools. The workshop half, {w:workshop} listings, includes every battery tool: {w:workshop-powered} of them.',
            )}
          </p>
          <p data-garden-statement="">
            {fillSentence(
              'The garden half contains no powered device. Of its {w:garden} weeder, sprinkler and pruner listings, the count stating a battery or a voltage is {z:garden-powered}.',
            )}
          </p>
          <p data-pressure-statement="">
            {fillSentence(
              'No sprinkler listing prints a water pressure. Of the {w:cat-sprinklers}, {w:sprinklers-area} print a coverage area and the count printing a pressure is {z:sprinklers-pressure}.',
            )}
          </p>
          <p>{fillSentence('{W:misfiled} listings are filed outside their kind, and they stay where they were filed, with a note on each card:')}</p>
        </div>
        <ul className="mt-3 space-y-1.5 border-l-[3px] border-flag pl-4 text-[15px]" data-count={moved.length}>
          {moved.map((p) => (
            <li key={p.asin}>
              <PageLink href={`/gear/${p.category}#listing-${p.asin}`} />
            </li>
          ))}
        </ul>
      </section>

      <KnurlRule />

      {/* 13 · Six Plain Answers */}
      <section className="wrap pb-14" data-section-layout="qa-grid-2x3" aria-labelledby="answers-heading">
        <h2 id="answers-heading" className="text-[30px]">
          {cap(numberWord(ANSWERS.length))} plain answers
        </h2>
        <dl className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-2" data-count={ANSWERS.length}>
          {ANSWERS.map((x) => (
            <div key={x.q} className="border-t-[3px] border-carbon pt-3">
              <dt className="font-display text-[18px] font-semibold leading-snug text-ink">{x.q}</dt>
              <dd className="mt-2 text-[15.5px] leading-relaxed">{fillSentence(x.a)}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 14 · Product Rail */}
      <section className="bg-haze py-14" data-section-layout="product-rail" aria-labelledby="rail-heading">
        <div className="wrap">
          <AffiliateDisclosure position="home" />
          <h2 id="rail-heading" className="mt-8 text-[30px]">
            A listing from each department <span className="font-narrow text-blue" data-count={rail.length}>{rail.length}</span>
          </h2>
        </div>
        <ul className="snap-row wrap mt-6">
          {rail.map((p) => (
            <li key={p.asin} className="card flex w-[240px] flex-col">
              <div className="relative aspect-square border-b border-rule bg-white">
                <Image src={p.imageUrl} alt={p.name} fill sizes="240px" className="object-contain p-4" />
              </div>
              <div className="flex flex-grow flex-col p-4">
                <p className="label">{categories.find((c) => c.slug === p.category)?.title}</p>
                {p.badge ? <p className="chip mt-2 self-start">{p.badge.label}</p> : null}
                <p className="mt-2 flex-grow text-[14px] leading-snug">
                  <PageLink href={`/gear/${p.category}#listing-${p.asin}`} />
                </p>
                <a href={p.affiliateUrl} rel="nofollow sponsored noopener" target="_blank" className="btn btn-sm mt-4 w-full" data-affiliate="">
                  {p.optionLabel} on Amazon
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
