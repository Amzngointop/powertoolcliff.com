'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { categories } from '@/data/gear'
import { products } from '@/data/products'
import type { CategorySlug } from '@/data/types'
import { assertOptionLabels } from '@/lib/labels'
import { WEAR_CAVEATS, WEAR_RULES, wearCheck } from '@/lib/wear-check'
import { EdgeStrip } from './EdgeStrip'

/* R11: labels inside each group are unique, present and six characters or more, or the build fails. */
assertOptionLabels(
  'Wear Point Check / category',
  categories.map((c) => c.title),
)
for (const c of categories) {
  assertOptionLabels(
    `Wear Point Check / listing in ${c.slug}`,
    products.filter((p) => p.category === c.slug).map((p) => p.optionLabel),
  )
}

const first = (c: CategorySlug) => {
  const p = products.filter((x) => x.category === c).sort((a, b) => a.rank - b.rank)[0]
  if (!p) throw new Error(`No listing in ${c}`)
  return p.asin
}

export function WearPointCheck({ dark = false }: { dark?: boolean }) {
  const [category, setCategory] = useState<CategorySlug>(categories[0].slug)
  const [asin, setAsin] = useState<string>(first(categories[0].slug))
  const items = products.filter((p) => p.category === category).sort((a, b) => a.rank - b.rank)
  const product = products.find((p) => p.asin === asin) ?? items[0]
  const result = wearCheck(product)
  const catTitle = categories.find((c) => c.slug === category)?.title ?? category
  const optClass = dark ? 'opt opt-dark' : 'opt'

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" data-tool="wear-point-check">
      <div>
        <div role="group" aria-labelledby="wpc-cat-label">
          <p id="wpc-cat-label" className={`label label-lg ${dark ? '!text-amber' : '!text-ink'}`}>
            Category
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                className={optClass}
                aria-pressed={category === c.slug}
                onClick={() => {
                  setCategory(c.slug)
                  setAsin(first(c.slug))
                }}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>
        <div role="group" aria-labelledby="wpc-item-label" className="mt-6">
          <p id="wpc-item-label" className={`label label-lg ${dark ? '!text-amber' : '!text-ink'}`}>
            Listing in {catTitle}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {items.map((p) => (
              <button key={p.asin} type="button" className={optClass} aria-pressed={product.asin === p.asin} onClick={() => setAsin(p.asin)}>
                {p.optionLabel}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm mt-6"
          onClick={() => {
            setCategory(categories[0].slug)
            setAsin(first(categories[0].slug))
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset the check
        </button>
        <div className={`mt-8 text-[14px] leading-relaxed ${dark ? 'text-white/90' : 'text-ink-2'}`}>
          <p className={`label label-lg ${dark ? '!text-amber' : '!text-ink'}`}>Rules this check follows</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5" data-rules="wear">
            {WEAR_RULES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border border-rule bg-white p-5 sm:p-6" aria-live="polite" data-result="">
        <p className="label">Result</p>
        <h3 className="mt-1 text-[19px] leading-snug text-ink">{product.name}</h3>
        <div className="mt-4">
          <EdgeStrip
            key={product.asin}
            place="check-result"
            named={result.sharp}
            replacement={result.replacement}
            off={result.off}
            animate
            idPrefix="wpc"
          />
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-ink" data-matching={result.matching}>
          {result.matching} of {result.total} listings in {catTitle} name exactly these wear points and say the same about replacement.
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
          {result.replacement.length > 0
            ? 'This listing states that parts can be replaced.'
            : 'This listing says nothing about replacing a part.'}
        </p>
        <ul className="mt-4 space-y-1.5 border-t border-rule pt-4 text-[14px] leading-relaxed text-ink" data-caveats="">
          {WEAR_CAVEATS.map((c) => (
            <li key={c} className="border-l-[3px] border-flag pl-3">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
