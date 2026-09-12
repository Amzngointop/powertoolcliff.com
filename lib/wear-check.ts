import { categories } from '../data/gear.ts'
import { WEAR_SLUGS } from '../data/types.ts'
import type { CategorySlug, Product, WearSlug } from '../data/types.ts'
import { wearPoints } from '../data/wear-points.ts'
import { inCategory, namedIn } from './catalog.ts'

/* R19: the rules exactly as printed on the page. The audit sweeps them. */
export const WEAR_RULES = [
  'A tooth is sharp when the listing, as supplied to this site, names that part or what it is made of.',
  'A tooth is blunt when the listing does not name that part.',
  'A tooth gets a yellow base when the listing states that parts can be replaced; the base sits under the parts the listing names.',
  'A wear point is switched off for a category when no listing filed in that category names it, and the reason is printed beside it.',
  'The matching count is the number of listings in the same category whose sharp teeth and replacement statement are exactly the same as this one, this listing included.',
] as const

export const WEAR_CAVEATS = [
  'A listing that is silent on a part has not said that the part does not wear.',
  'This site does not estimate how long anything lasts, and it has measured nothing.',
  'Replacement and servicing are set by the manufacturer’s instructions, not by this site.',
] as const

export function offPoints(category: CategorySlug): Partial<Record<WearSlug, string>> {
  const title = categories.find((c) => c.slug === category)?.title ?? category
  const off: Partial<Record<WearSlug, string>> = {}
  for (const w of WEAR_SLUGS) {
    if (namedIn(category, w) === 0) {
      const short = wearPoints.find((x) => x.slug === w)?.short.toLowerCase() ?? w
      off[w] = `no listing filed in ${title} names a ${short}`
    }
  }
  return off
}

export interface WearResult {
  asin: string
  category: CategorySlug
  sharp: WearSlug[]
  blunt: WearSlug[]
  off: Partial<Record<WearSlug, string>>
  replacement: WearSlug[]
  matching: number
  total: number
}

const signature = (p: Product) => `${[...p.wearPointsNamed].sort().join('|')}#${p.statesReplacement}`

export function wearCheck(p: Product): WearResult {
  const off = offPoints(p.category)
  const sharp = WEAR_SLUGS.filter((w) => !off[w] && p.wearPointsNamed.includes(w))
  const blunt = WEAR_SLUGS.filter((w) => !off[w] && !p.wearPointsNamed.includes(w))
  const peers = inCategory(p.category)
  return {
    asin: p.asin,
    category: p.category,
    sharp,
    blunt,
    off,
    replacement: p.statesReplacement ? sharp : [],
    matching: peers.filter((x) => signature(x) === signature(p)).length,
    total: peers.length,
  }
}
