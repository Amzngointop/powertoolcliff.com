import { products } from '../data/products.ts'
import { DRIVES } from '../data/types.ts'
import type { CategorySlug, Drive, Product } from '../data/types.ts'
import { printsPressureFigure } from './catalog.ts'

/* R19: the formula exactly as printed on the page. */
export const DRIVE_RULES = [
  'A listing counts toward a drive when its own drive field reads that drive.',
  'The category a listing is filed in is not used to decide its drive; a battery screwdriver filed among hand sets counts as a battery tool.',
  'A figure counts as printed only when the listing states it with a number; a word such as high-pressure without a number does not count.',
  'The figure this check looks for is amp hours for a rechargeable battery and a water pressure for a water supply. For your hand there is no such figure, and the check says so.',
] as const

export const FIGURES = [
  { key: 'voltage', label: 'a voltage', test: (p: Product) => p.statedVoltage !== null },
  { key: 'amp-hours', label: 'a capacity in amp hours', test: (p: Product) => p.statedAmpHours !== null },
  { key: 'torque', label: 'a torque figure', test: (p: Product) => p.statedTorque !== null },
  { key: 'area', label: 'a coverage area', test: (p: Product) => p.statedAreaSqFt !== null },
  { key: 'flow', label: 'a flow figure', test: (p: Product) => p.statedFlow !== null },
  { key: 'pressure', label: 'a water pressure', test: (p: Product) => printsPressureFigure(p) },
] as const

export const DEPENDENT: Record<Drive, (typeof FIGURES)[number]['key'] | null> = {
  'a-rechargeable-battery': 'amp-hours',
  'your-hand': null,
  'your-water-supply': 'pressure',
}

/** The naive reading this check does not use, printed so the difference is visible. */
const CATEGORY_DRIVE: Record<CategorySlug, Drive> = {
  'tool-sets': 'your-hand',
  drills: 'a-rechargeable-battery',
  screwdrivers: 'your-hand',
  weeders: 'your-hand',
  sprinklers: 'your-water-supply',
  pruners: 'your-hand',
}

export interface DriveResult {
  drive: Drive
  count: number
  figures: { key: string; label: string; count: number }[]
  dependent: { key: string; label: string; count: number } | null
  byCategoryName: number
  asins: string[]
}

export function driveCheck(drive: Drive): DriveResult {
  if (!DRIVES.includes(drive)) throw new Error(`Unknown drive ${drive}`)
  const items = products.filter((p) => p.drive === drive)
  const figures = FIGURES.map((f) => ({ key: f.key, label: f.label, count: items.filter(f.test).length }))
  const depKey = DEPENDENT[drive]
  return {
    drive,
    count: items.length,
    figures,
    dependent: depKey ? (figures.find((f) => f.key === depKey) ?? null) : null,
    byCategoryName: products.filter((p) => CATEGORY_DRIVE[p.category] === drive).length,
    asins: items.map((p) => p.asin),
  }
}
