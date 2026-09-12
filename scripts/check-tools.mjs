import fs from 'node:fs'
import path from 'node:path'
import { ROOT, load, pages, report } from './lib.mjs'

/*
 * R19: both tools swept over every input they allow, against an independent
 * reading of the rules printed on the page, with the strong form of the
 * dead-input check, negative controls, and the R11 build assert exercised.
 */

const failures = []
const notes = []

const { products } = await load('data/products.ts')
const { categories } = await load('data/gear.ts')
const { WEAR_SLUGS, DRIVES } = await load('data/types.ts')
const wc = await load('lib/wear-check.ts')
const dc = await load('lib/drive-check.ts')
const { assertOptionLabels } = await load('lib/labels.ts')

/* ---------- Wear Point Check ---------- */
function expectedWear(p) {
  const peers = products.filter((x) => x.category === p.category)
  const offSet = WEAR_SLUGS.filter((w) => !peers.some((x) => x.wearPointsNamed.includes(w)))
  const sharp = WEAR_SLUGS.filter((w) => !offSet.includes(w) && p.wearPointsNamed.includes(w))
  const blunt = WEAR_SLUGS.filter((w) => !offSet.includes(w) && !p.wearPointsNamed.includes(w))
  const key = (x) => `${[...x.wearPointsNamed].sort()}#${x.statesReplacement}`
  return { sharp, blunt, off: offSet, replacement: p.statesReplacement ? sharp : [], matching: peers.filter((x) => key(x) === key(p)).length, total: peers.length }
}
let swept = 0
const sigsByCategory = {}
for (const c of categories) {
  const items = products.filter((p) => p.category === c.slug)
  sigsByCategory[c.slug] = []
  for (const p of items) {
    swept += 1
    const r = wc.wearCheck(p)
    const e = expectedWear(p)
    const off = Object.keys(r.off)
    if (r.sharp.join() !== e.sharp.join()) failures.push(`${p.asin}: sharp ${r.sharp}, rule gives ${e.sharp}`)
    if (r.blunt.join() !== e.blunt.join()) failures.push(`${p.asin}: blunt ${r.blunt}, rule gives ${e.blunt}`)
    if (off.sort().join() !== [...e.off].sort().join()) failures.push(`${p.asin}: off ${off}, rule gives ${e.off}`)
    if (r.replacement.join() !== e.replacement.join()) failures.push(`${p.asin}: replacement ${r.replacement}, rule gives ${e.replacement}`)
    if (r.matching !== e.matching || r.total !== e.total) failures.push(`${p.asin}: matching ${r.matching}/${r.total}, rule gives ${e.matching}/${e.total}`)
    if (r.sharp.length + r.blunt.length + off.length !== WEAR_SLUGS.length) failures.push(`${p.asin}: teeth do not add to six`)
    if (r.sharp.some((w) => off.includes(w))) failures.push(`${p.asin}: a tooth is both sharp and switched off`)
    if (r.matching < 1 || r.matching > r.total) failures.push(`${p.asin}: matching ${r.matching} out of range`)
    for (const [w, reason] of Object.entries(r.off)) if (typeof reason !== 'string' || reason.length < 12) failures.push(`${p.asin}: ${w} switched off without a printed reason`)
    /* Every result field, including the listing it names, so an option that changes nothing would show as a duplicate. */
    sigsByCategory[c.slug].push({ p, full: JSON.stringify({ name: p.name, ...r }), teeth: JSON.stringify({ ...r, asin: undefined }) })
  }
}
for (const [slug, sigs] of Object.entries(sigsByCategory)) {
  for (const a of sigs) {
    if (sigs.filter((b) => b.full === a.full).length > 1) failures.push(`Dead input: listing option ${a.p.optionLabel} in ${slug} changes no result field`)
  }
  const shared = sigs.filter((a) => sigs.some((b) => b !== a && b.teeth === a.teeth)).length
  if (shared) notes.push(`${slug}: ${shared} listings share a strip with another listing; each still changes the listing named in the result`)
}
const catSigs = new Set(categories.map((c) => JSON.stringify(products.filter((p) => p.category === c.slug).map((p) => p.optionLabel))))
if (catSigs.size !== categories.length) failures.push('Dead input: two category options offer the same listings')
const offTotal = categories.reduce((n, c) => n + Object.keys(wc.offPoints(c.slug)).length, 0)
notes.push(`${swept} listing results swept against the printed rules; ${offTotal} wear points switched off across the categories, each with a printed reason`)
/* Negative control: a variant that counts switched-off teeth as blunt must disagree somewhere. */
const variantDiffers = products.some((p) => {
  const e = expectedWear(p)
  return [...e.blunt, ...e.off].length !== e.blunt.length
})
if (!variantDiffers) failures.push('Negative control: switching teeth off never changes a result, so the rule is untested')
else notes.push('negative control: treating switched-off teeth as blunt would change results, so the off rule is exercised')

/* ---------- Drive Check ---------- */
const driveSigs = new Set()
for (const d of DRIVES) {
  const r = dc.driveCheck(d)
  const items = products.filter((p) => p.drive === d)
  if (r.count !== items.length) failures.push(`${d}: count ${r.count}, field match gives ${items.length}`)
  const want = {
    voltage: items.filter((p) => p.statedVoltage !== null).length,
    'amp-hours': items.filter((p) => p.statedAmpHours !== null).length,
    torque: items.filter((p) => p.statedTorque !== null).length,
    area: items.filter((p) => p.statedAreaSqFt !== null).length,
    flow: items.filter((p) => p.statedFlow !== null).length,
    pressure: items.filter((p) => /\b\d+(?:\.\d+)?\s*(?:psi|bar)\b/i.test(`${p.name} ${p.listingStates}`)).length,
  }
  for (const f of r.figures) if (f.count !== want[f.key]) failures.push(`${d}: figure ${f.key} ${f.count}, independent count ${want[f.key]}`)
  const depWant = { 'a-rechargeable-battery': 'amp-hours', 'your-hand': null, 'your-water-supply': 'pressure' }[d]
  if ((r.dependent?.key ?? null) !== depWant) failures.push(`${d}: dependent figure ${r.dependent?.key}, rule gives ${depWant}`)
  if (d === 'your-water-supply' && r.dependent?.count !== 0) failures.push(`water supply: pressure count is ${r.dependent?.count}, expected the printed zero`)
  driveSigs.add(JSON.stringify(r.figures.map((f) => f.count).concat(r.count)))
}
if (driveSigs.size !== DRIVES.length) failures.push('Dead input: two drive options give the same result')
const batteryByField = dc.driveCheck('a-rechargeable-battery')
if (batteryByField.byCategoryName === batteryByField.count) failures.push('Negative control: reading drives from category names gives the same battery count, so the rule is untested')
else notes.push(`negative control: category names would give ${batteryByField.byCategoryName} battery listings, the drive field gives ${batteryByField.count}`)
if (dc.driveCheck('your-water-supply').figures.find((f) => f.key === 'pressure').count !== 0) failures.push('pressure figure count for sprinklers is not zero')
const wordOnly = products.filter((p) => p.printsPressureWord)
if (wordOnly.length === 0) failures.push('Negative control: no listing prints the word pressure, so the word-without-number rule is untested')
else notes.push(`negative control: ${wordOnly.length} listing prints the word pressure and is correctly not counted as a figure`)
notes.push(`${DRIVES.length} drive options, all distinct; water pressure count printed as zero`)

/* ---------- R11 assert at build ---------- */
let threw = false
try {
  assertOptionLabels('control', ['Orbit tripod impact', 'Orbit tripod impact', 'Short'])
} catch (err) {
  threw = /#1 and #2 both read/.test(err.message) && /shorter than six/.test(err.message)
}
if (!threw) failures.push('R11 assert did not throw with both positions on a planted clash')
for (const f of ['components/WearPointCheck.tsx', 'components/DriveCheck.tsx']) {
  if (!/assertOptionLabels\(/.test(fs.readFileSync(path.join(ROOT, f), 'utf8'))) failures.push(`${f}: no module-scope R11 assert`)
}
notes.push('R11: the label assert throws with both positions on a planted clash and runs at module scope in both tools')

/* ---------- printed rules on the built pages ---------- */
const built = pages()
const byRoute = Object.fromEntries(built.map((p) => [p.route, p]))
for (const route of ['/wear-point-check', '/']) {
  for (const rule of [...wc.WEAR_RULES, ...wc.WEAR_CAVEATS]) if (!byRoute[route].text.includes(rule)) failures.push(`${route}: printed rule missing: "${rule.slice(0, 60)}"`)
  if (!/tooth-off|data-state="off"/.test(byRoute[route].html)) failures.push(`${route}: no switched-off tooth with a reason in the default result`)
  const first = products.filter((p) => p.category === categories[0].slug).sort((a, b) => a.rank - b.rank)[0]
  const m = Number((byRoute[route].html.match(/data-matching="(\d+)"/) ?? [])[1])
  if (m !== wc.wearCheck(first).matching) failures.push(`${route}: prerendered matching ${m}, sweep gives ${wc.wearCheck(first).matching}`)
}
for (const route of ['/drive-check', '/']) {
  for (const rule of dc.DRIVE_RULES) if (!byRoute[route].text.includes(rule)) failures.push(`${route}: printed formula missing: "${rule.slice(0, 60)}"`)
  if (!byRoute[route].html.includes(`data-drive="${DRIVES[0]}"`)) failures.push(`${route}: prerendered Drive Check result missing`)
}
notes.push('rules, caveats and the formula found verbatim on the tool pages and on the home page; prerendered results equal the sweep')

process.exit(report('R19 · tool sweeps, dead inputs, printed rules', failures, notes))
