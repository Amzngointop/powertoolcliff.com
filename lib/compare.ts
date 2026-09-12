import type { Product } from '../data/types.ts'
import { wearPoints } from '../data/wear-points.ts'
import { materials } from '../data/materials.ts'
import { FIELDS, FIELD_LABELS, fieldValue } from './catalog.ts'
import type { Field } from './catalog.ts'

export interface Column {
  key: string
  label: string
  value: (p: Product) => string | null
}

const shortName = (slug: string) => wearPoints.find((w) => w.slug === slug)?.short ?? slug
const materialName = (slug: string) => materials.find((m) => m.slug === slug)?.title ?? slug

/**
 * R2: a column belongs to its rows. A candidate column is dropped when every
 * row is empty, when every row reads the same, or when the subgroup is
 * defined by that field. What is left differs between at least two rows.
 */
export function columnsFor(items: Product[], groupedBy?: Field): Column[] {
  const candidates: Column[] = [
    ...FIELDS.filter((f) => f !== groupedBy).map((f) => ({ key: f, label: FIELD_LABELS[f], value: (p: Product) => fieldValue(p, f) })),
    {
      key: 'named',
      label: 'Wear points named',
      value: (p: Product) => (p.wearPointsNamed.length === 0 ? 'none' : p.wearPointsNamed.map(shortName).join(', ')),
    },
    { key: 'replacement', label: 'Replacement stated', value: (p: Product) => (p.statesReplacement ? 'yes' : 'no') },
    {
      key: 'materials',
      label: 'Material words',
      value: (p: Product) => (p.materialWords.length === 0 ? null : p.materialWords.map(materialName).join(', ')),
    },
  ]
  return candidates.filter((c) => isLive(items, c))
}

export function isLive(items: Product[], c: Column): boolean {
  const values = items.map((p) => c.value(p))
  if (values.every((v) => v === null)) return false
  return new Set(values.map((v) => v ?? '(not stated)')).size > 1
}

/** Every candidate, for the audit: which were dropped and why. */
export function droppedColumns(items: Product[], groupedBy?: Field): { key: string; reason: string }[] {
  const all = [...FIELDS.map((f) => f as string), 'named', 'replacement', 'materials']
  const kept = new Set(columnsFor(items, groupedBy).map((c) => c.key))
  return all
    .filter((k) => !kept.has(k))
    .map((k) => ({ key: k, reason: k === groupedBy ? 'defines the subgroup' : 'empty or identical in every row' }))
}
