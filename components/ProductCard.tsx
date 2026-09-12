import Image from 'next/image'
import type { Product } from '@/data/types'
import { fillSentence } from '@/lib/fill'
import { EdgeStrip } from './EdgeStrip'
import { SellerWords } from './SellerWords'

export function ProductCard({ p }: { p: Product }) {
  const f = (s: string) => fillSentence(s, p)
  return (
    <article id={`listing-${p.asin}`} className="card flex h-full flex-col" data-product-card={p.asin}>
      <div className="relative aspect-square border-b border-rule bg-white">
        <Image
          src={p.imageUrl}
          alt={p.name}
          fill
          sizes="(min-width: 1280px) 270px, (min-width: 640px) 46vw, 92vw"
          className="object-contain p-5"
        />
      </div>
      <div className="flex flex-grow flex-col gap-3.5 p-5">
        {p.badge ? (
          <div data-badge="">
            <span className="chip">{p.badge.label}</span>
            <p className="mt-1.5 text-[12.5px] leading-snug text-ink-3">Basis: {f(p.badge.basis)}</p>
          </div>
        ) : null}
        <h3 className="text-[17px] leading-snug">{p.name}</h3>
        {p.note ? (
          <p className="border-l-[3px] border-flag pl-3 text-[13.5px] leading-relaxed text-ink" data-note="">
            <span className="label mr-1 !text-flag">Filed here with a caveat:</span> {f(p.note)}
          </p>
        ) : null}
        <EdgeStrip
          place="product-card"
          compact
          named={p.wearPointsNamed}
          replacement={p.statesReplacement ? p.wearPointsNamed : []}
          idPrefix={`strip-${p.asin}`}
        />
        <p className="text-[14px] leading-relaxed">
          <span className="label mr-1 !text-ink">The listing states:</span> {p.listingStates}
        </p>
        <SellerWords words={p.sellerWords} />
        <p className="text-[14.5px] leading-relaxed">{f(p.summary)}</p>
        <div className="grid gap-3 text-[13.5px] leading-snug">
          <div>
            <p className="label !text-blue">On the record</p>
            <ul className="mt-1 list-disc space-y-1 pl-4">
              {p.pros.map((x) => (
                <li key={x}>{f(x)}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label !text-flag">Missing or caveated</p>
            <ul className="mt-1 list-disc space-y-1 pl-4">
              {p.cons.map((x) => (
                <li key={x}>{f(x)}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-[13.5px] leading-snug">
          <span className="label mr-1">Worth reading for:</span> {f(p.bestFor)}
        </p>
        <a
          href={p.affiliateUrl}
          rel="nofollow sponsored noopener"
          target="_blank"
          className="btn btn-sm mt-auto w-full"
          data-affiliate=""
        >
          {p.optionLabel} on Amazon
        </a>
      </div>
    </article>
  )
}
