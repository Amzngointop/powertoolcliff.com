import { categories } from '../data/gear.ts'
import { glossary } from '../data/glossary.ts'
import { materials } from '../data/materials.ts'
import { products } from '../data/products.ts'
import { toolTypes } from '../data/tool-types.ts'
import { wearPoints } from '../data/wear-points.ts'

/*
 * R13: the one registry of internal paths and the titles their pages carry.
 * Every page reads its H1 from here or from the same data record, and
 * PageLink reads its text from here, so a link can never outlive a rename.
 * "/tools" is the site's interactive tools; "/tool-types" is kinds of tool.
 */
export const STATIC_TITLES = {
  '/wear-points': 'Wear Points',
  '/tool-types': 'Tool Types',
  '/materials': 'Materials',
  '/tools': 'Tools',
  '/gear': 'Gear',
  '/wear-point-check': 'Wear Point Check',
  '/drive-check': 'Drive Check',
  '/glossary': 'Glossary',
  '/about': 'About',
  '/contact': 'Contact',
  '/privacy': 'Privacy',
  '/terms': 'Terms',
  '/affiliate-disclosure': 'Affiliate Disclosure',
} as const

export type StaticPath = keyof typeof STATIC_TITLES

export const NAV: StaticPath[] = ['/wear-points', '/tool-types', '/materials', '/tools', '/gear']

let cache: Map<string, string> | null = null

export function registry(): Map<string, string> {
  if (cache) return cache
  const map = new Map<string, string>(Object.entries(STATIC_TITLES))
  for (const w of wearPoints) map.set(`/wear-points/${w.slug}`, w.title)
  for (const t of toolTypes) map.set(`/tool-types/${t.slug}`, t.title)
  for (const m of materials) map.set(`/materials/${m.slug}`, m.title)
  for (const c of categories) map.set(`/gear/${c.slug}`, c.title)
  for (const g of glossary) map.set(`/glossary#${g.slug}`, g.term)
  for (const p of products) map.set(`/gear/${p.category}#listing-${p.asin}`, p.name)
  const titles = [...map.entries()].filter(([k]) => !k.includes('#')).map(([, v]) => v.toLowerCase())
  if (new Set(titles).size !== titles.length) throw new Error('R13: two pages share a title')
  cache = map
  return map
}

export function titleForPath(path: string): string {
  const title = registry().get(path)
  if (!title) throw new Error(`PageLink: no page is registered at "${path}"`)
  return title
}

export function pagePaths(): string[] {
  return ['/', ...Array.from(registry().keys()).filter((p) => !p.includes('#'))]
}
