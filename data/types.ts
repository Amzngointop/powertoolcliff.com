export const WEAR_SLUGS = [
  'the-battery',
  'the-bit-tip',
  'the-blade-edge',
  'the-chuck-and-drive',
  'the-nozzle-and-filter',
  'the-claw-and-tine',
] as const
export type WearSlug = (typeof WEAR_SLUGS)[number]

export const CATEGORY_SLUGS = ['tool-sets', 'drills', 'screwdrivers', 'weeders', 'sprinklers', 'pruners'] as const
export type CategorySlug = (typeof CATEGORY_SLUGS)[number]

export const DRIVES = ['a-rechargeable-battery', 'your-hand', 'your-water-supply'] as const
export type Drive = (typeof DRIVES)[number]

export const MATERIAL_SLUGS = ['s2-steel', 'stainless-steel', 'titanium-coating', 'heavy-duty', 'replaceable-parts'] as const
export type MaterialSlug = (typeof MATERIAL_SLUGS)[number]

export type ToolTypeSlug =
  | 'the-household-kit'
  | 'the-cordless-drill'
  | 'the-screwdriver-set'
  | 'the-weeder'
  | 'the-sprinkler'
  | 'the-pruner'

export type SourceKey = string

/** R14: a badge is re-derived from data by scripts/check-numbers.mjs. */
export type BadgeRule =
  | { kind: 'max' | 'min'; field: 'statedPieceCount' | 'statedAreaSqFt'; scope: 'category' | 'subgroup'; value: number }
  | { kind: 'flag'; value: string }

export interface Badge {
  label: string
  /** Printed on the card: why this listing carries the badge. May use product tokens. */
  basis: string
  rule: BadgeRule
}

export interface Product {
  asin: string
  name: string
  category: CategorySlug
  subgroup: string
  rank: number
  imageUrl: string
  affiliateUrl: string
  /** R11: tool option label, unique inside its category, six characters or more. */
  optionLabel: string
  toolTypeSlug: ToolTypeSlug
  drive: Drive
  wearPointsNamed: WearSlug[]
  statesReplacement: boolean
  statedPieceCount: number | null
  /** How the listing words the count, e.g. "37 in 1" or "three pairs". */
  pieceCountWording: string | null
  statedVoltage: string | null
  statedTorque: string | null
  statedChuck: string | null
  statedCoverage: string | null
  statedAreaSqFt: number | null
  statedRange: string | null
  statedAmpHours: string | null
  statedFlow: string | null
  statedLength: string | null
  statedCutCapacity: string | null
  statedBitCount: number | null
  statedConsumables: number | null
  materialWords: MaterialSlug[]
  printsPressureWord: boolean
  printsMotorWord: boolean
  /** The listing facts as supplied, in plain words. Mirrored in the comparison table. */
  listingStates: string
  /** Seller wording, only ever rendered inside <q data-seller-words>. */
  sellerWords: string[]
  /** R24 caveat for a listing filed outside its kind. */
  note: string | null
  summary: string
  pros: string[]
  cons: string[]
  bestFor: string
  badge: Badge | null
  flags: string[]
}

export interface Source {
  label: string
  url: string
  publisher: string
}
