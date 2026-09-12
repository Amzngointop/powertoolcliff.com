import type { Product } from '../data/types.ts'
import { FACTS } from '../data/sources.ts'
import { cap, formatThousands, lookup, numberWord } from './catalog.ts'

const PRODUCT_VALUES: Record<string, (p: Product) => string | number | null> = {
  count: (p) => p.statedPieceCount,
  countWording: (p) => p.pieceCountWording,
  voltage: (p) => p.statedVoltage,
  torque: (p) => p.statedTorque,
  chuck: (p) => p.statedChuck,
  coverage: (p) => p.statedCoverage,
  area: (p) => (p.statedAreaSqFt === null ? null : formatThousands(p.statedAreaSqFt)),
  range: (p) => p.statedRange,
  ah: (p) => p.statedAmpHours,
  flow: (p) => p.statedFlow,
  length: (p) => p.statedLength,
  cut: (p) => p.statedCutCapacity,
  bits: (p) => p.statedBitCount,
  consumables: (p) => p.statedConsumables,
}

const PRODUCT_NUMBERS: Record<string, (p: Product) => number | null> = {
  count: (p) => p.statedPieceCount,
  bits: (p) => p.statedBitCount,
  consumables: (p) => p.statedConsumables,
}

/**
 * Tokens:
 *   {p:field}  a stated product value     {pw:field} / {PW:field} the same number as a word
 *   {n:key}    a catalog count in digits  {w:key} / {W:key} the same count as a word
 * An unknown or null token throws, so a bad token fails the build.
 */
export function fill(text: string, product?: Product): string {
  return text.replace(/\{(p|pw|PW|n|w|W|z|Z|f):([a-zA-Z0-9-]+)\}/g, (whole, mode: string, key: string) => {
    if (mode === 'f') {
      const fact = FACTS[key]
      if (fact === undefined) throw new Error(`Unknown fact ${whole} in "${text}"`)
      return fact
    }
    if (mode === 'p' || mode === 'pw' || mode === 'PW') {
      if (!product) throw new Error(`Product token ${whole} used without a product in "${text}"`)
      if (mode === 'p') {
        const fn = PRODUCT_VALUES[key]
        if (!fn) throw new Error(`Unknown product token ${whole}`)
        const v = fn(product)
        if (v === null) throw new Error(`Token ${whole} is null for ${product.asin}`)
        return String(v)
      }
      const fn = PRODUCT_NUMBERS[key]
      if (!fn) throw new Error(`Unknown product number token ${whole}`)
      const v = fn(product)
      if (v === null) throw new Error(`Token ${whole} is null for ${product.asin}`)
      return mode === 'pw' ? numberWord(v) : cap(numberWord(v))
    }
    const n = lookup(key)
    if (mode === 'n') return String(n)
    if (mode === 'w') return numberWord(n)
    if (mode === 'W') return cap(numberWord(n))
    /* {z:key} reads "none" for a zero count, the number word otherwise. */
    const word = n === 0 ? 'none' : numberWord(n)
    return mode === 'z' ? word : cap(word)
  })
}

/** Fill, then capitalize the first letter of every sentence (R18: a token can open a sentence). */
export function fillSentence(text: string, product?: Product): string {
  return fill(text, product).replace(/(^|[.!?]\s+)([a-z])/g, (_, pre: string, ch: string) => pre + ch.toUpperCase())
}
