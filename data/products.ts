import type { Product } from './types.ts'
import { toolSets } from './products/tool-sets.ts'
import { drills } from './products/drills.ts'
import { screwdrivers } from './products/screwdrivers.ts'
import { weeders } from './products/weeders.ts'
import { sprinklers } from './products/sprinklers.ts'
import { pruners } from './products/pruners.ts'

export const products: Product[] = [...toolSets, ...drills, ...screwdrivers, ...weeders, ...sprinklers, ...pruners]

export function productByAsin(asin: string): Product {
  const p = products.find((x) => x.asin === asin)
  if (!p) throw new Error(`No product with ASIN ${asin}`)
  return p
}
