import fs from 'node:fs'
import path from 'node:path'
import { ROOT, load, pages, report, stripTags, walk } from './lib.mjs'

/*
 * R14 badges re-derived from data, R18 hand-typed numbers in prose and in
 * components, rendered counts against rendered items, and R2/R3 on both
 * branches of every comparison.
 */

const failures = []
const notes = []

const { products } = await load('data/products.ts')
const { categories } = await load('data/gear.ts')
const { wearPoints } = await load('data/wear-points.ts')
const { toolTypes } = await load('data/tool-types.ts')
const { materials } = await load('data/materials.ts')
const { glossary } = await load('data/glossary.ts')
const cat = await load('lib/catalog.ts')
const { columnsFor } = await load('lib/compare.ts')

/* ---------- R14 ---------- */
const PREDICATES = {
  'kit-with-drill': [(p) => p.statedVoltage !== null, 'category'],
  'case-dimensions': [(p) => /dimensions/.test(p.listingStates), 'category'],
  'model-number-kit': [(p) => /\b[A-Z]{2,}\d{3,}[A-Z]?\b|\b\d{5}\b/.test(p.name), 'subgroup'],
  'ships-consumables': [(p) => p.statedConsumables !== null, 'category'],
  'most-named-tool-sets': [null, 'category'],
  'states-amp-hours': [(p) => p.statedAmpHours !== null, 'category'],
  'torque-nm': [(p) => /Nm\b/.test(p.statedTorque ?? ''), 'category'],
  'drill-piece-count': [(p) => p.statedPieceCount !== null, 'category'],
  'bits-among-20v': [(p) => p.statedBitCount !== null, 'subgroup'],
  'voltage-8v': [(p) => p.statedVoltage === '8V', 'category'],
  'no-voltage': [(p) => p.statedVoltage === null, 'category'],
  'precision-s2': [(p) => p.materialWords.includes('s2-steel'), 'subgroup'],
  'names-devices': [(p) => /laptops|phones|consoles|doorbell/.test(p.listingStates), 'category'],
  'mini-key': [(p) => /mini key/.test(p.listingStates), 'category'],
  'torque-range': [(p) => p.statedTorque !== null, 'category'],
  'flexible-shaft': [(p) => /flexible shaft/i.test(p.name + p.listingStates), 'category'],
  'powered-screwdriver': [(p) => p.drive === 'a-rechargeable-battery', 'category'],
  'names-taproots': [(p) => /taproot/.test(p.listingStates), 'category'],
  'serrated-claws': [(p) => /serrated/i.test(p.listingStates), 'category'],
  'cast-aluminum': [(p) => /cast aluminum/.test(p.listingStates), 'category'],
  'weeder-blade': [(p) => p.wearPointsNamed.includes('the-blade-edge'), 'category'],
  'names-filters': [(p) => /\bfilters?\b/.test(p.listingStates), 'category'],
  'area-rotating': [(p) => p.statedAreaSqFt !== null, 'subgroup'],
  'pressure-word': [(p) => /pressure/i.test(p.listingStates + p.sellerWords.join(' ')), 'category'],
  'wheeled-base': [(p) => /wheel/i.test(p.name + p.listingStates), 'category'],
  't-spike': [(p) => /T-spike/i.test(p.name + p.listingStates), 'category'],
  'states-flow': [(p) => p.statedFlow !== null, 'category'],
  'replaceable-parts': [(p) => p.statesReplacement, 'catalog'],
  'cut-capacity': [(p) => p.statedCutCapacity !== null, 'category'],
  'titanium-word': [(p) => /titanium/i.test(p.name + p.listingStates), 'category'],
  'micro-tip': [(p) => /micro-tip/i.test(p.name + p.listingStates), 'category'],
  'multi-pair': [(p) => /pairs|pack/i.test(p.name + p.listingStates), 'category'],
}
let badges = 0
for (const c of categories) {
  const items = products.filter((p) => p.category === c.slug)
  const badged = items.filter((p) => p.badge)
  const labels = badged.map((p) => p.badge.label)
  if (new Set(labels).size !== labels.length) failures.push(`${c.slug}: badge labels repeat`)
  const first = items.find((p) => p.rank === 1)
  if (!first?.badge) failures.push(`${c.slug}: rank 1 carries no badge`)
  for (const p of badged) {
    badges += 1
    const rule = p.badge.rule
    const where = `${p.asin} "${p.badge.label}"`
    const scopeOf = (s) => (s === 'subgroup' ? items.filter((x) => x.subgroup === p.subgroup) : s === 'catalog' ? products : items)
    if (rule.kind === 'max' || rule.kind === 'min') {
      const scope = scopeOf(rule.scope)
      const values = scope.map((x) => x[rule.field]).filter((v) => v !== null)
      if (p[rule.field] !== rule.value) failures.push(`${where}: ${rule.field} is ${p[rule.field]}, rule says ${rule.value}`)
      if (values.filter((v) => v === rule.value).length !== 1) failures.push(`${where}: ${rule.value} is not unique in its ${rule.scope}`)
      const extreme = rule.kind === 'max' ? Math.max(...values) : Math.min(...values)
      if (extreme !== rule.value) failures.push(`${where}: ${rule.kind} of ${rule.field} is ${extreme}, not ${rule.value}`)
      if (values.length < 2) failures.push(`${where}: an extreme over fewer than two stated values`)
    } else {
      const holders = items.filter((x) => x.flags.includes(rule.value))
      if (holders.length !== 1 || holders[0] !== p) failures.push(`${where}: flag "${rule.value}" held by ${holders.map((h) => h.asin).join(', ') || 'nobody'}`)
      const pred = PREDICATES[rule.value]
      if (!pred) failures.push(`${where}: no predicate re-derives flag ${rule.value}`)
      else if (rule.value === 'most-named-tool-sets') {
        const counts = items.map((x) => x.wearPointsNamed.length)
        const max = Math.max(...counts)
        if (p.wearPointsNamed.length !== max || counts.filter((n) => n === max).length !== 1) failures.push(`${where}: named count ${p.wearPointsNamed.length} is not a unique maximum`)
      } else {
        const scope = scopeOf(pred[1])
        const truthy = scope.filter(pred[0])
        if (truthy.length !== 1 || truthy[0] !== p) failures.push(`${where}: predicate holds for ${truthy.map((x) => x.asin).join(', ') || 'nobody'} in its ${pred[1]}`)
      }
    }
    if (/\b(only|most|largest|fewest|smallest|highest)\b/i.test(p.badge.label) && rule.kind === 'flag' && !PREDICATES[rule.value]) failures.push(`${where}: superlative without a re-derivation`)
  }
}
/* Negative control: planting a second 8V listing must break the uniqueness of "Only listing stating 8V". */
const drills = products.filter((p) => p.category === 'drills')
const planted = [...drills, { ...drills[0], asin: 'B0PLANTED0', statedVoltage: '8V' }]
if (planted.filter(PREDICATES['voltage-8v'][0]).length === 1) failures.push('Negative control: a planted second 8V listing was not seen')
notes.push(`${badges} badges re-derived: labels unique per category, rank 1 badged, superlatives rest on values found once; planted duplicate caught`)

/* ---------- R18: prose never types a number ---------- */
const TOKEN = /\{[^}]+\}/g
const ALLOWED = [
  /\b(?:BS EN|ISO|ASTM|EN|IEC|UNS|NIST SP|Special Publication)\s?[A-Z]?\d[\w./-]*(?:\/[A-Z]\d+M)?/g,
  /ANSI\/TIA-568\.2(?:-[A-Z])?/g,
  /\b\d+(?:\.\d+)?V\b/g,
  /\b(?:S2|CAT6|RJ45|F2|H2O-Six|PGP-ADJ|T41902|E18|B26|A240|A941|A681)\b/g,
]
const WORDS = 'one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|forty-two'
const COUNTED = new RegExp(`(?<!the )\\b(${WORDS})\\s+(?:[a-z-]+\\s+)?(listings?|categor(?:y|ies)|departments?|pieces?|teeth|tooth|parts?|wear points?|kinds?|brands?|figures?|units?|forms?|sources?|drives?|words?|columns?|sections?|numbers?|answers?|rules?|sprinklers?|drills?|pruners?|weeders?|kits?|sets?)\\b`, 'i')
function proseCheck(where, s) {
  if (typeof s !== 'string') return
  let t = s.replace(TOKEN, ' ')
  for (const a of ALLOWED) t = t.replace(a, ' ')
  if (/\d/.test(t)) failures.push(`${where}: hand-typed digit in "${s.slice(0, 120)}"`)
  const m = t.match(COUNTED)
  if (m) failures.push(`${where}: hand-typed count "${m[0]}" in "${s.slice(0, 120)}"`)
}
const before = failures.length
proseCheck('control', 'Seven listings state 8 figures.')
if (failures.length - before !== 2) failures.push('Negative control: the prose check did not flag both a digit and a number word')
else failures.splice(before, 2) && notes.push('negative control: a typed digit and a typed count are both flagged')

let fields = 0
const scan = (where, list) => list.forEach((s) => ((fields += 1), proseCheck(where, s)))
for (const p of products) scan(p.asin, [p.summary, ...p.pros, ...p.cons, p.bestFor, p.note, p.badge?.label, p.badge?.basis])
for (const c of categories) scan(`gear/${c.slug}`, [c.intro, c.coreJob, c.metaDescription, ...c.subgroups.map((g) => g.intro), ...c.faq.flatMap((f) => [f.q, f.a])])
for (const w of wearPoints) scan(`wear-points/${w.slug}`, [w.whatGoesFirst, w.whatTheListingsSay, w.cardLine, w.flagLine, w.metaDescription, ...w.notes])
for (const t of toolTypes) scan(`tool-types/${t.slug}`, [t.whatItIs, t.whyThisWearPoint, t.driveNote, t.missingFigure, t.metaDescription, ...t.notes])
for (const m of materials) scan(`materials/${m.slug}`, [m.whatItNames, m.whoDefines, m.whatItDoesNotPromise, m.metaDescription, ...m.notes])
for (const g of glossary) scan(`glossary/${g.slug}`, [g.definition])
notes.push(`${fields} prose fields scanned for typed digits and typed counts`)

for (const file of walk(path.join(ROOT, 'app'), '.tsx').concat(walk(path.join(ROOT, 'components'), '.tsx'))) {
  const src = fs.readFileSync(file, 'utf8')
  src.split('\n').forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return
    const m = line.replace(/\{[^}]*\}/g, ' ').match(COUNTED)
    if (m) failures.push(`${path.relative(ROOT, file)}:${i + 1}: hand-typed count "${m[0]}"`)
  })
}
notes.push('app and component sources hold no hand-typed counts outside expressions')

/* ---------- rendered counts ---------- */
const built = pages()
const page = (r) => {
  const found = built.find((p) => p.route === r)
  if (!found) throw new Error(`No built page at ${r}`)
  return found
}
const countOf = (s, needle) => s.split(needle).length - 1

for (const c of categories) {
  const { html } = page(`/gear/${c.slug}`)
  const chunks = html.split('data-subgroup="').slice(1)
  if (chunks.length !== c.subgroups.length) failures.push(`/gear/${c.slug}: ${chunks.length} subgroup sections, ${c.subgroups.length} declared`)
  let cards = 0
  for (const chunk of chunks) {
    const id = chunk.slice(0, chunk.indexOf('"'))
    const g = c.subgroups.find((x) => x.id === id)
    const section = chunk.split('</section>')[0]
    const printed = Number((section.match(/data-count="(\d+)"/) ?? [])[1])
    const rendered = countOf(section, 'data-product-card="')
    const group = products.filter((p) => p.category === c.slug && p.subgroup === id)
    cards += rendered
    if (printed !== rendered || rendered !== group.length) failures.push(`/gear/${c.slug}#${id}: label says ${printed}, ${rendered} cards rendered, data holds ${group.length}`)
    const table = section.match(/data-compare-table="" data-columns="([^"]*)"/)
    if (rendered >= 2 && !table) failures.push(`/gear/${c.slug}#${id}: ${rendered} cards but no comparison table (R3)`)
    if (rendered < 2 && /data-compare-table/.test(section)) failures.push(`/gear/${c.slug}#${id}: comparison table with ${rendered} card (R3)`)
    if (rendered < 2 && !section.includes('data-single-card')) failures.push(`/gear/${c.slug}#${id}: single card without its note`)
    if (table) {
      const want = columnsFor(group, g.groupedBy).map((col) => col.key).join(',')
      if (table[1] !== want) failures.push(`/gear/${c.slug}#${id}: rendered columns ${table[1]}, rule gives ${want}`)
      if (g.groupedBy && table[1].split(',').includes(g.groupedBy)) failures.push(`/gear/${c.slug}#${id}: column ${g.groupedBy} rendered in a subgroup defined by it`)
      const body = section.split('data-compare-table=""')[1].split('</table>')[0]
      const rows = [...body.split('<tbody>')[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((r) => [...r[1].matchAll(/<td>([\s\S]*?)<\/td>/g)].map((td) => stripTags(td[1])))
      const colCount = rows[0]?.length ?? 0
      for (let k = 0; k < colCount; k += 1) {
        const vals = rows.map((r) => r[k])
        if (new Set(vals).size === 1) failures.push(`/gear/${c.slug}#${id}: rendered column ${k + 1} reads "${vals[0]}" in every row (R2)`)
      }
    }
  }
  const total = products.filter((p) => p.category === c.slug).length
  if (cards !== total) failures.push(`/gear/${c.slug}: ${cards} cards rendered, category holds ${total}`)
}
/* R2 negative control: a column identical in every row must be dropped. */
const twenty = products.filter((p) => p.subgroup === 'stating-20v')
if (columnsFor(twenty).some((col) => col.key === 'statedVoltage') === false && twenty.every((p) => p.statedVoltage?.startsWith('20V'))) {
  notes.push('R2 control: without the subgroup rule, the 20V voltage column differs only by the word MAX; with it, the column is not rendered')
}
if (columnsFor(twenty, 'statedVoltage').some((col) => col.key === 'statedVoltage')) failures.push('R2: statedVoltage column survives in the 20V subgroup')
notes.push('gear pages: subgroup counts equal rendered cards; R3 holds on both branches; rendered columns equal the R2 rule and none is uniform')

for (const w of wearPoints) {
  const { html } = page(`/wear-points/${w.slug}`)
  for (const [id, want] of [['named', w.namedBy.length], ['silent', w.silentOn.length]]) {
    const block = html.split(`data-listing-list="${id}"`)[1]
    const printed = Number((block.match(/data-count="(\d+)"/) ?? [])[1])
    const links = countOf(block.split('</section>')[0], '#listing-')
    if (printed !== want || links !== want) failures.push(`/wear-points/${w.slug} ${id}: printed ${printed}, links ${links}, data ${want}`)
  }
  if (w.namedBy.length + w.silentOn.length !== products.length) failures.push(`/wear-points/${w.slug}: named + silent != ${products.length}`)
}
notes.push('wear point pages: named and silent counts equal their rendered links and add up to the catalog')

for (const m of materials) {
  const { html } = page(`/materials/${m.slug}`)
  const want = cat.printing(m.slug).length
  const share = Number((html.match(/data-word-share="(\d+)"/) ?? [])[1])
  const table = html.split('data-printing-table=""')[1].split('</table>')[0]
  if (share !== want || countOf(table, '#listing-') !== want) failures.push(`/materials/${m.slug}: share ${share}, rows ${countOf(table, '#listing-')}, data ${want}`)
}
notes.push('material pages: printed share equals table rows and data')

const home = page('/')
const cells = [...home.html.split('data-wear-table=""')[1].split('</table>')[0].matchAll(/data-category-row="([^"]+)"([\s\S]*?)<\/tr>/g)]
for (const [, slug, row] of cells) {
  const got = [...row.matchAll(/<td[^>]*data-count="(\d+)"/g)].map((x) => Number(x[1]))
  const want = wearPoints.map((w) => cat.namedIn(slug, w.slug))
  if (got.join() !== want.join()) failures.push(`home Wear Table ${slug}: ${got}, data ${want}`)
}
if (cells.length !== categories.length) failures.push(`home Wear Table has ${cells.length} rows`)
const wearCards = home.html.split('data-section-layout="card-grid-3x2"')[1].split('</ul>')[0]
if (Number((wearCards.match(/data-count="(\d+)"/) ?? [])[1]) !== countOf(wearCards, '<li')) failures.push('home wear cards: count and items differ')
const rail = home.html.split('data-section-layout="product-rail"')[1]
if (Number((rail.match(/data-count="(\d+)"/) ?? [])[1]) !== countOf(rail, 'data-affiliate=""') || countOf(rail, 'data-affiliate=""') !== categories.length) failures.push('home rail: heading count, links and department count differ')
const carousel = home.html.split('data-section-layout="snap-carousel"')[1].split('</ul>')[0]
if (Number((carousel.match(/<ul[^>]*data-count="(\d+)"/) ?? [])[1]) !== countOf(carousel, '<li')) failures.push('home carousel: count and items differ')
for (const m of home.html.matchAll(/data-stat="([^"]+)"[^>]*>([\s\S]*?)<\/(?:p|h2|li)>/g)) {
  const n = cat.lookup(m[1])
  if (!stripTags(m[2]).includes(String(n)) && !stripTags(m[2]).toLowerCase().includes(cat.numberWord(n))) failures.push(`home stat ${m[1]}: "${stripTags(m[2]).slice(0, 60)}" does not show ${n}`)
}
const tiles = home.html.split('data-category-tiles="md"')[1].split('</ul>')[0]
if (countOf(tiles, '<li') !== categories.length) failures.push('home tiles: count differs from departments')
notes.push('home: Wear Table cells, wear cards, carousel, rail, tiles and every data-stat equal their data')

const g = page('/glossary').html
if (Number((g.match(/<dl[^>]*data-count="(\d+)"/) ?? [])[1]) !== countOf(g, '<dt')) failures.push('/glossary: count and terms differ')
if (glossary.length !== 24) failures.push(`glossary holds ${glossary.length} terms, 24 required`)
const linked = glossary.filter((x) => x.links.length > 0).length
if (linked < 12) failures.push(`only ${linked} glossary terms are cross-linked`)
notes.push(`glossary: ${glossary.length} terms rendered, ${linked} cross-linked`)

process.exit(report('R2 · R3 · R14 · R18 · badges, typed numbers, rendered counts', failures, notes))
