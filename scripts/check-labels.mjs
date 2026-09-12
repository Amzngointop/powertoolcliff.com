import { load, report } from './lib.mjs'

/*
 * Pre-build: R11 option labels (with a negative control), the shape of every
 * product record, subgroup sums, ranks, material words and the number words
 * inside each listing's facts against its own figures (R18).
 */

const failures = []
const notes = []

const { products } = await load('data/products.ts')
const { categories } = await load('data/gear.ts')
const { labelProblems } = await load('lib/labels.ts')
const { DRIVES, WEAR_SLUGS, MATERIAL_SLUGS } = await load('data/types.ts')
const { DRIVE_LABELS, printing, numberWord } = await load('lib/catalog.ts')
const { materials } = await load('data/materials.ts')

/* Negative control: a clash, an empty label and a short label must all be reported, with both positions. */
const control = labelProblems(['Fiskars bypass shears', '', 'Orbit', 'fiskars bypass shears'])
for (const part of ['#2 has an empty label', '#3 "Orbit" is shorter', '#1 and #4 both read']) {
  if (!control.some((p) => p.includes(part))) failures.push(`Negative control did not report: ${part}`)
}
if (failures.length === 0) notes.push('negative control: duplicate, empty and short labels all reported with positions')

const groups = {
  'Wear Point Check / category': categories.map((c) => c.title),
  'Drive Check / drive': DRIVES.map((d) => DRIVE_LABELS[d]),
}
for (const c of categories) groups[`Wear Point Check / listing in ${c.slug}`] = products.filter((p) => p.category === c.slug).map((p) => p.optionLabel)
for (const [group, labels] of Object.entries(groups)) {
  for (const p of labelProblems(labels)) failures.push(`${group}: ${p}`)
}
notes.push(`${Object.keys(groups).length} option groups checked, ${Object.values(groups).flat().length} labels`)
/* Labels are also unique across the whole catalog, because cards and rails print them. */
for (const p of labelProblems(products.map((x) => x.optionLabel))) failures.push(`catalog-wide labels: ${p}`)

/* Brand twins named in the brief: counted, and their labels shown for the report. */
for (const brand of ['DEKOPRO', 'Amazon Basics', 'Fiskars', 'Orbit', 'Melnor', 'DEWALT']) {
  const twins = products.filter((p) => p.name.startsWith(brand))
  const cats = new Set(twins.map((p) => p.category)).size
  notes.push(`${brand}: ${twins.length} listings in ${cats} categories, labels ${twins.map((p) => `"${p.optionLabel}"`).join(', ')}`)
}

/* Product records. */
if (products.length !== 42) failures.push(`Expected 42 products, found ${products.length}`)
const asins = new Set()
const NULLABLE = ['statedPieceCount', 'pieceCountWording', 'statedVoltage', 'statedTorque', 'statedChuck', 'statedCoverage', 'statedAreaSqFt', 'statedRange', 'statedAmpHours', 'statedFlow', 'statedLength', 'statedCutCapacity', 'statedBitCount', 'statedConsumables', 'note', 'badge']
for (const p of products) {
  if (asins.has(p.asin)) failures.push(`Duplicate ASIN ${p.asin}`)
  asins.add(p.asin)
  if (!/^B0[A-Z0-9]{8}$/.test(p.asin)) failures.push(`${p.asin}: not an ASIN`)
  if (!/^https:\/\/m\.media-amazon\.com\/images\/I\/.+\.jpg$/.test(p.imageUrl ?? '')) failures.push(`${p.asin}: imageUrl missing or malformed`)
  if (p.affiliateUrl !== `https://www.amazon.com/dp/${p.asin}?tag=YOURTAG-20`) failures.push(`${p.asin}: affiliateUrl is ${p.affiliateUrl}`)
  if (!p.toolTypeSlug) failures.push(`${p.asin}: toolTypeSlug missing`)
  if (!DRIVES.includes(p.drive)) failures.push(`${p.asin}: drive ${p.drive}`)
  if (!Array.isArray(p.wearPointsNamed) || p.wearPointsNamed.some((w) => !WEAR_SLUGS.includes(w))) failures.push(`${p.asin}: wearPointsNamed invalid`)
  if (typeof p.statesReplacement !== 'boolean') failures.push(`${p.asin}: statesReplacement is not boolean`)
  if (!Array.isArray(p.materialWords) || p.materialWords.some((m) => !MATERIAL_SLUGS.includes(m))) failures.push(`${p.asin}: materialWords invalid`)
  for (const k of NULLABLE) if (!(k in p) || p[k] === undefined) failures.push(`${p.asin}: ${k} is undefined, must be a value or null`)
  if (p.pros.length !== 4) failures.push(`${p.asin}: ${p.pros.length} pros`)
  if (p.cons.length !== 3) failures.push(`${p.asin}: ${p.cons.length} cons`)
  if ((p.statedPieceCount === null) !== (p.pieceCountWording === null)) failures.push(`${p.asin}: piece count and its wording disagree on presence`)
}
notes.push(`${products.length} product records: ASINs, image URLs, affiliate URLs and every nullable field present`)

/* Subgroup sums and continuous ranks (R18, R14). */
for (const c of categories) {
  const inCat = products.filter((p) => p.category === c.slug)
  const ids = c.subgroups.map((s) => s.id)
  for (const o of inCat.filter((p) => !ids.includes(p.subgroup))) failures.push(`${o.asin} sits in undeclared subgroup ${o.subgroup}`)
  const sizes = c.subgroups.map((s) => inCat.filter((p) => p.subgroup === s.id).length)
  if (sizes.reduce((a, b) => a + b, 0) !== inCat.length) failures.push(`${c.slug}: subgroups sum to ${sizes.reduce((a, b) => a + b, 0)}, category holds ${inCat.length}`)
  const ordered = c.subgroups.flatMap((s) => inCat.filter((p) => p.subgroup === s.id).sort((a, b) => a.rank - b.rank))
  if (ordered.map((p) => p.rank).join(',') !== ordered.map((_, i) => i + 1).join(',')) failures.push(`${c.slug}: ranks do not run 1..${inCat.length} through the subgroups in order (${ordered.map((p) => p.rank)})`)
  notes.push(`${c.slug}: ${inCat.length} = ${sizes.join(' + ')}`)
}

/* Material words: every listing filed under a word prints it, and every listing printing it is filed (both directions). */
for (const m of materials) {
  const filed = new Set(printing(m.slug).map((p) => p.asin))
  for (const p of products) {
    const hay = `${p.name} ${p.listingStates} ${p.sellerWords.join(' ')}`.toLowerCase()
    const prints = m.words.some((w) => new RegExp(`\\b${w.toLowerCase().replace(/[-\s]/g, '[-\\s]')}\\b`).test(hay))
    if (prints && !filed.has(p.asin)) failures.push(`${p.asin} prints "${m.words.join('/')}" but is not filed under ${m.slug}`)
    if (!prints && filed.has(p.asin)) failures.push(`${p.asin} is filed under ${m.slug} but prints none of ${m.words.join(', ')}`)
  }
}
notes.push('material words agree with listing text in both directions')

/* R18: a count in a listing's facts, as a word or digits, equals the figure in its own table row. */
const WORDS = Object.fromEntries(Array.from({ length: 60 }, (_, i) => [numberWord(i), i]))
const toNumber = (t) => (/^\d+$/.test(t) ? Number(t) : WORDS[t.toLowerCase()] ?? null)
const RULES = [
  ['statedPieceCount', /\b(\w+)[ -](?:pieces?|piece\b|drivers|pairs|in 1)/i],
  ['statedBitCount', /\b(\w+) bits\b/i],
  ['statedConsumables', /\b(\w+) pack\b/i],
]
let compared = 0
for (const p of products) {
  for (const [field, re] of RULES) {
    const m = p.listingStates.match(re)
    const n = m ? toNumber(m[1]) : null
    if (n === null) continue
    compared += 1
    if (p[field] !== n) failures.push(`${p.asin}: listing facts say "${m[0]}", ${field} is ${p[field]}`)
  }
}
const plantedFact = { listingStates: 'ten drivers', statedPieceCount: 6 }
const pm = plantedFact.listingStates.match(RULES[0][1])
if (!(pm && toNumber(pm[1]) !== plantedFact.statedPieceCount)) failures.push('Negative control: a planted word/figure mismatch was not caught')
notes.push(`${compared} counts in listing facts equal their row figures; planted mismatch caught`)

process.exit(report('R11 · R18 · option labels, product records, subgroup sums, row counts', failures, notes))
