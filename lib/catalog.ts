import { categories } from '../data/gear.ts'
import { products } from '../data/products.ts'
import { CATEGORY_SLUGS, DRIVES, MATERIAL_SLUGS, WEAR_SLUGS } from '../data/types.ts'
import type { CategorySlug, Drive, MaterialSlug, Product, WearSlug } from '../data/types.ts'

/* R18: every count on the site is computed here, never typed into prose. */

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

export function numberWord(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 999) throw new Error(`numberWord: unsupported ${n}`)
  if (n < 20) return ONES[n]
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : '')
  const rest = n % 100
  return `${ONES[Math.floor(n / 100)]} hundred${rest ? ` ${numberWord(rest)}` : ''}`
}

export function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function formatThousands(n: number): string {
  return n.toLocaleString('en-US')
}

/** Stated figures a listing can print. Order is the display order everywhere. */
export const FIELDS = [
  'statedPieceCount',
  'statedVoltage',
  'statedAmpHours',
  'statedTorque',
  'statedChuck',
  'statedBitCount',
  'statedConsumables',
  'statedAreaSqFt',
  'statedRange',
  'statedFlow',
  'statedLength',
  'statedCutCapacity',
] as const
export type Field = (typeof FIELDS)[number]

export const FIELD_LABELS: Record<Field, string> = {
  statedPieceCount: 'Piece count',
  statedVoltage: 'Voltage',
  statedAmpHours: 'Amp hours',
  statedTorque: 'Torque',
  statedChuck: 'Chuck',
  statedBitCount: 'Bit count',
  statedConsumables: 'Consumables',
  statedAreaSqFt: 'Area, sq ft',
  statedRange: 'Range',
  statedFlow: 'Flow',
  statedLength: 'Length',
  statedCutCapacity: 'Cut capacity',
}

export const DRIVE_LABELS: Record<Drive, string> = {
  'a-rechargeable-battery': 'A rechargeable battery',
  'your-hand': 'Your hand',
  'your-water-supply': 'Your water supply',
}

export function fieldValue(p: Product, f: Field): string | null {
  const v = p[f]
  if (v === null) return null
  if (f === 'statedAreaSqFt') return formatThousands(v as number)
  if (f === 'statedPieceCount' && p.pieceCountWording) return p.pieceCountWording
  return String(v)
}

export const GARDEN: CategorySlug[] = ['weeders', 'sprinklers', 'pruners']
export const WORKSHOP: CategorySlug[] = ['tool-sets', 'drills', 'screwdrivers']

export const inCategory = (c: CategorySlug): Product[] => products.filter((p) => p.category === c)
export const names = (p: Product, w: WearSlug): boolean => p.wearPointsNamed.includes(w)
export const namedBy = (w: WearSlug): Product[] => products.filter((p) => names(p, w))
export const silentOn = (w: WearSlug): Product[] => products.filter((p) => !names(p, w))
export const namedIn = (c: CategorySlug, w: WearSlug): number => inCategory(c).filter((p) => names(p, w)).length
export const byDrive = (d: Drive): Product[] => products.filter((p) => p.drive === d)
export const printing = (m: MaterialSlug): Product[] => products.filter((p) => p.materialWords.includes(m))

/** A listing is powered when its drive field is a battery or it states a voltage. */
export const isPowered = (p: Product): boolean => p.drive === 'a-rechargeable-battery' || p.statedVoltage !== null

/** A pressure figure: digits followed by psi or bar anywhere in what the listing states. */
export const PRESSURE_FIGURE = /\b\d+(?:\.\d+)?\s*(?:psi|bar)\b/i
export const printsPressureFigure = (p: Product): boolean => PRESSURE_FIGURE.test(p.listingStates) || PRESSURE_FIGURE.test(p.name)

export const misfiled = (): Product[] => products.filter((p) => p.flags.includes('misfiled'))
export const gardenListings = (): Product[] => products.filter((p) => GARDEN.includes(p.category))

function buildStats(): Record<string, number> {
  const s: Record<string, number> = {}
  const drills = inCategory('drills')
  const sprinklers = inCategory('sprinklers')
  const garden = gardenListings()
  s['products'] = products.length
  s['categories'] = CATEGORY_SLUGS.length
  s['wear-points'] = WEAR_SLUGS.length
  s['materials'] = MATERIAL_SLUGS.length
  s['drives'] = DRIVES.length
  for (const c of CATEGORY_SLUGS) {
    const items = inCategory(c)
    for (const f of FIELDS) s[`field-${c}-${f}`] = items.filter((p) => p[f] !== null).length
    s[`cat-${c}`] = items.length
    s[`named-${c}`] = items.filter((p) => p.wearPointsNamed.length > 0).length
    s[`silent-${c}`] = items.filter((p) => p.wearPointsNamed.length === 0).length
    s[`replacement-${c}`] = items.filter((p) => p.statesReplacement).length
    s[`badges-${c}`] = items.filter((p) => p.badge !== null).length
    s[`misfiled-${c}`] = items.filter((p) => p.flags.includes('misfiled')).length
    s[`powered-${c}`] = items.filter(isPowered).length
  }
  for (const w of WEAR_SLUGS) s[`wp-${w}`] = namedBy(w).length
  for (const w of WEAR_SLUGS) s[`wp-silent-${w}`] = silentOn(w).length
  for (const w of WEAR_SLUGS) s[`wp-cats-${w}`] = CATEGORY_SLUGS.filter((c) => namedIn(c, w) > 0).length
  for (const w of WEAR_SLUGS) s[`wp-replacement-${w}`] = namedBy(w).filter((p) => p.statesReplacement).length
  for (const c of categories) for (const g of c.subgroups) s[`sub-${c.slug}-${g.id}`] = inCategory(c.slug).filter((p) => p.subgroup === g.id).length
  s['torque-in-lb'] = products.filter((p) => /in-lb/.test(p.statedTorque ?? '')).length
  s['torque-nm'] = products.filter((p) => /Nm\b/.test(p.statedTorque ?? '')).length
  s['hardness-figure'] = products.filter((p) => /\b(HRC|Rockwell|hardness)\b/i.test(`${p.name} ${p.listingStates}`)).length
  s['filters-named'] = products.filter((p) => /\bfilters?\b|\bscreens?\b/i.test(p.listingStates)).length
  s['nozzles-named'] = products.filter((p) => /\bnozzles?\b/i.test(p.listingStates)).length
  for (const m of MATERIAL_SLUGS) s[`mat-${m}`] = printing(m).length
  for (const m of MATERIAL_SLUGS) s[`mat-cats-${m}`] = new Set(printing(m).map((p) => p.category)).size
  for (const d of DRIVES) s[`drive-${d}`] = byDrive(d).length
  s['drills-20v'] = drills.filter((p) => p.statedVoltage?.startsWith('20V')).length
  s['drills-20v-max'] = drills.filter((p) => p.statedVoltage === '20V MAX').length
  s['drills-other-voltage'] = drills.filter((p) => p.statedVoltage !== null && !p.statedVoltage.startsWith('20V')).length
  s['drills-no-voltage'] = drills.filter((p) => p.statedVoltage === null).length
  s['drills-torque'] = drills.filter((p) => p.statedTorque !== null).length
  s['drills-chuck'] = drills.filter((p) => p.statedChuck !== null).length
  s['garden'] = garden.length
  s['garden-powered'] = garden.filter(isPowered).length
  s['garden-motor-word'] = garden.filter((p) => p.printsMotorWord).length
  s['workshop'] = products.length - garden.length
  s['workshop-powered'] = products.filter((p) => WORKSHOP.includes(p.category) && isPowered(p)).length
  s['powered'] = products.filter(isPowered).length
  s['sprinklers-pressure'] = sprinklers.filter(printsPressureFigure).length
  s['sprinklers-pressure-word'] = sprinklers.filter((p) => p.printsPressureWord).length
  s['sprinklers-area'] = sprinklers.filter((p) => p.statedAreaSqFt !== null).length
  s['sprinklers-range'] = sprinklers.filter((p) => p.statedRange !== null).length
  s['sprinklers-flow'] = sprinklers.filter((p) => p.statedFlow !== null).length
  s['sprinklers-any-coverage'] = sprinklers.filter((p) => p.statedAreaSqFt !== null || p.statedRange !== null).length
  s['sprinklers-no-coverage'] = sprinklers.length - s['sprinklers-any-coverage']
  s['states-replacement'] = products.filter((p) => p.statesReplacement).length
  s['silent-replacement'] = products.filter((p) => !p.statesReplacement).length
  s['named-none'] = products.filter((p) => p.wearPointsNamed.length === 0).length
  s['named-some'] = products.filter((p) => p.wearPointsNamed.length > 0).length
  s['misfiled'] = misfiled().length
  s['amp-hours'] = products.filter((p) => p.statedAmpHours !== null).length
  s['voltage'] = products.filter((p) => p.statedVoltage !== null).length
  s['torque'] = products.filter((p) => p.statedTorque !== null).length
  s['piece-count'] = products.filter((p) => p.statedPieceCount !== null).length
  s['consumables'] = products.filter((p) => p.statedConsumables !== null).length
  s['kits-specialist'] = inCategory('tool-sets').filter((p) => p.subgroup === 'specialist-kits').length
  s['kits-general'] = inCategory('tool-sets').filter((p) => p.subgroup === 'general-household-kits').length
  s['kits-battery'] = inCategory('tool-sets').filter((p) => p.drive === 'a-rechargeable-battery').length
  s['screwdrivers-battery'] = inCategory('screwdrivers').filter((p) => p.drive === 'a-rechargeable-battery').length
  s['weeders-figure'] = inCategory('weeders').filter((p) => [p.statedLength, p.statedPieceCount, p.statedCutCapacity].some((v) => v !== null)).length
  s['pruners-cut'] = inCategory('pruners').filter((p) => p.statedCutCapacity !== null).length
  s['pruners-length'] = inCategory('pruners').filter((p) => p.statedLength !== null).length
  s['seller-addressing'] = products.filter((p) => p.sellerWords.some((w) => /\b(for Women|for Men|Pink Ribbon)\b/.test(w))).length
  s['s2-listings'] = s['mat-s2-steel']
  s['badges'] = products.filter((p) => p.badge !== null).length
  return s
}

let cache: Record<string, number> | null = null
export function stats(): Record<string, number> {
  if (!cache) cache = buildStats()
  return cache
}

export function lookup(key: string): number {
  const v = stats()[key]
  if (v === undefined) throw new Error(`Unknown catalog count "${key}"`)
  return v
}
