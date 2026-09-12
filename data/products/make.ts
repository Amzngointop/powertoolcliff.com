import type { Product } from '../types.ts'

type Given = Pick<
  Product,
  | 'asin'
  | 'name'
  | 'category'
  | 'subgroup'
  | 'rank'
  | 'imageUrl'
  | 'optionLabel'
  | 'toolTypeSlug'
  | 'drive'
  | 'wearPointsNamed'
  | 'listingStates'
  | 'summary'
  | 'pros'
  | 'cons'
  | 'bestFor'
> &
  Partial<Product>

/** Every field a listing does not state is set to an explicit null, never left undefined. */
export function product(p: Given): Product {
  return {
    statesReplacement: false,
    statedPieceCount: null,
    pieceCountWording: null,
    statedVoltage: null,
    statedTorque: null,
    statedChuck: null,
    statedCoverage: null,
    statedAreaSqFt: null,
    statedRange: null,
    statedAmpHours: null,
    statedFlow: null,
    statedLength: null,
    statedCutCapacity: null,
    statedBitCount: null,
    statedConsumables: null,
    materialWords: [],
    printsPressureWord: false,
    printsMotorWord: false,
    sellerWords: [],
    note: null,
    badge: null,
    flags: [],
    ...p,
    affiliateUrl: `https://www.amazon.com/dp/${p.asin}?tag=YOURTAG-20`,
  }
}
