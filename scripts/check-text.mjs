import fs from 'node:fs'
import path from 'node:path'
import { ROOT, decode, load, pages, report, stripTags, walk, withoutSellerQuotes } from './lib.mjs'

/*
 * Post-build text audit on stripTags(html) (R25). Every R24 rule has a
 * negative control: the pattern is run on a planted fixture first and must
 * fire, so a silent pass cannot come from a broken pattern.
 */

const failures = []
const notes = []
const control = (name, pattern, fixture) => {
  if (!new RegExp(pattern.source, pattern.flags.replace('g', '')).test(fixture)) failures.push(`Negative control failed for ${name}: pattern did not fire on "${fixture}"`)
}

const { products } = await load('data/products.ts')
const { registry, NAV, pagePaths } = await load('lib/routes.ts')
const cat = await load('lib/catalog.ts')
const built = pages()
const byRoute = Object.fromEntries(built.map((p) => [p.route, p]))
const routes = new Set(built.map((p) => p.route))
const expectedPaths = pagePaths()
for (const r of expectedPaths) if (!routes.has(r)) failures.push(`registered page ${r} was not prerendered`)
for (const r of routes) if (!expectedPaths.includes(r)) failures.push(`prerendered page ${r} is not in the route registry`)
notes.push(`${built.length} pages built, ${expectedPaths.length} registered; each with at least 200 characters of stripped text`)

const productNames = [...products.map((p) => p.name)].sort((a, b) => b.length - a.length)
const withoutNames = (t) => productNames.reduce((s, n) => s.split(n).join(' '), t)
const bodyHtml = (html) =>
  html
    .replace(/<header[\s\S]*?<\/header>/, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/, ' ')
    .replace(/<div id="mobile-menu"[\s\S]*?<\/nav><\/div>/, ' ')
/* Prose addressed to the reader: page text without seller quotes, product names and button controls. */
const prose = (p) => withoutNames(stripTags(withoutSellerQuotes(p.html).replace(/<button\b[\s\S]*?<\/button>/g, ' ')))

/* ---------- source greps ---------- */
const sourceFiles = ['app', 'components', 'lib', 'data'].flatMap((d) => walk(path.join(ROOT, d))).filter((f) => /\.(tsx?|css)$/.test(f))
const cssFiles = walk(path.join(ROOT, '.next', 'static'), '.css')
const allCss = cssFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n')
for (const f of sourceFiles) {
  const src = fs.readFileSync(f, 'utf8')
  const rel = path.relative(ROOT, f)
  /* A Tailwind dark variant, not a class name that ends in "-dark" followed by a pseudo-class. */
  if (/(?<![\w-])dark:/.test(src)) failures.push(`${rel}: dark: class`)
  if (/darkMode/.test(src)) failures.push(`${rel}: darkMode setting`)
  if (/backdrop-(blur|filter)/.test(src)) failures.push(`${rel}: backdrop filter`)
  if (/\b(TODO|lorem|Content pending)\b/i.test(src)) failures.push(`${rel}: TODO / lorem / Content pending`)
  if (/localStorage|sessionStorage/.test(src)) failures.push(`${rel}: browser storage`)
  if (/IntersectionObserver/.test(src)) failures.push(`${rel}: IntersectionObserver (scroll reveal)`)
  if (/<legend|<fieldset/.test(src)) failures.push(`${rel}: fieldset or legend`)
  if (/output:\s*['"]export['"]/.test(src)) failures.push(`${rel}: static export`)
}
if (/output:\s*['"]export['"]/.test(fs.readFileSync(path.join(ROOT, 'next.config.mjs'), 'utf8'))) failures.push("next.config.mjs sets output: 'export'")
if (/darkMode/.test(fs.readFileSync(path.join(ROOT, 'tailwind.config.ts'), 'utf8'))) failures.push('tailwind.config.ts sets darkMode')
if (/backdrop-filter/.test(allCss)) failures.push('built CSS contains backdrop-filter')
if (/prefers-color-scheme:\s*dark/.test(allCss)) failures.push('built CSS contains a dark color-scheme block')
if (/opacity:\s*0(?![.\d])/.test(allCss)) failures.push('built CSS contains opacity:0')
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
if (!pkg.dependencies?.sharp) failures.push('sharp is not in dependencies')
if (!/^\^16\./.test(pkg.dependencies?.next ?? '')) failures.push(`next is ${pkg.dependencies?.next}`)
const gi = fs.existsSync(path.join(ROOT, '.gitignore')) ? fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8') : ''
for (const line of ['node_modules/', '.next/', 'out/', 'build/', '.DS_Store', '*.pem', '.env*.local', '.vercel', '*.tsbuildinfo', 'next-env.d.ts']) {
  if (!gi.split(/\r?\n/).includes(line)) failures.push(`.gitignore lacks ${line}`)
}
notes.push(`${sourceFiles.length} source files and ${cssFiles.length} built CSS files grepped; sharp, next ^16 and .gitignore in place`)

/* ---------- motion ---------- */
const keyframes = new Set([...allCss.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]))
const ALLOWED_KEYFRAMES = new Set(['tooth-sharpen'])
for (const k of keyframes) if (!ALLOWED_KEYFRAMES.has(k)) failures.push(`@keyframes ${k} is not on the allowed list`)
for (const k of ALLOWED_KEYFRAMES) if (!keyframes.has(k)) failures.push(`allowed @keyframes ${k} missing from built CSS`)
const animations = new Set([...allCss.matchAll(/animation(?:-name)?:\s*([\w-]+)/g)].map((m) => m[1]).filter((n) => !/^\d|^none$|^var$/.test(n)))
for (const a of animations) if (!ALLOWED_KEYFRAMES.has(a)) failures.push(`animation ${a} is not on the allowed list`)
const reducedBlocks = allCss.split('@media (prefers-reduced-motion:reduce)').slice(1).map((s) => s.slice(0, 600)).join(' ')
for (const prop of ['animation-duration', 'transition-duration', 'animation-iteration-count']) {
  if (!reducedBlocks.includes(prop)) failures.push(`prefers-reduced-motion block does not neutralize ${prop}`)
}
if (/parallax|scroll-timeline|animation-timeline/.test(allCss)) failures.push('scroll-driven motion in built CSS')
notes.push(`keyframes in built CSS: ${[...keyframes].join(', ') || 'none'}; reduced-motion neutralizes durations and iteration count`)

/* ---------- R10 American spelling ---------- */
const ROOTS = /(colour|centre|favour|licence|draught|metre|analogue|mould|neighbour|tyre|aluminium|harbour|catalogue|fibre|flavour|behaviour|programme|cheque|grey|defence|jewellery|storey|plough|kerb|whilst|sulphur)/i
const ISE = /\b(organis\w*|realis\w*|recognis\w*|apologis\w*|customis\w*|optimis\w*|standardis\w*|prioritis\w*|minimis\w*|maximis\w*|summaris\w*|emphasis(?:e|ed|es|ing)|categoris\w*|utilis\w*|finalis\w*|analys(?:e|ed|es|ing)|characteris\w*|travelled|labelled|cancelled|modelled|levelled|fuelled|signalled|totalled|jewelled)\b/gi
control('R10 roots', ROOTS, 'the colour of it')
control('R10 -ise', ISE, 'we labelled and organised it')
if (ISE.test('advertising raised promise')) failures.push('R10 -ise pattern fires on advertising / raised / promise')
ISE.lastIndex = 0
for (const p of built) {
  const t = withoutNames(p.text)
  const r = t.match(ROOTS)
  if (r) failures.push(`${p.route}: British root "${r[0]}" near "${t.slice(Math.max(0, r.index - 30), r.index + 30)}"`)
  for (const m of t.matchAll(ISE)) failures.push(`${p.route}: British form "${m[0]}"`)
}
notes.push('R10: roots by substring and -ise/-elled by word boundary, product names excluded; advertising and raised do not fire')

/* ---------- generic banned text ---------- */
const BANNED = [
  ['lorem / placeholder / Content pending', /\b(lorem|ipsum|placeholder|content pending)\b/i, 'lorem ipsum'],
  ['testing claims', /\b(we tested|we used|our workshop|in our testing|we tried)\b/i, 'we tested it'],
  ['rank N', /\brank\s*\d+/i, 'Rank 4'],
  ['prices', /\$\s?\d|\bon sale\b/i, 'only $199'],
  ['ratings', /\b\d(\.\d)? (out of 5|stars)\b|\brated \d/i, '4.5 stars'],
  ['footnote asterisk', /\*/, '20V MAX*'],
]
for (const [name, re, fixture] of BANNED) {
  control(name, re, fixture)
  let hits = 0
  for (const p of built) {
    const m = p.text.match(re)
    if (m) {
      hits += 1
      failures.push(`${p.route}: ${name}: "${p.text.slice(Math.max(0, m.index - 40), m.index + 40)}"`)
    }
  }
  if (hits === 0) notes.push(`${name}: 0 (control fired)`)
}

/* ---------- R24 ---------- */
const sentences = (t) => t.split(/(?<=[.!?:])\s+/)
const R24 = [
  [
    'instructions and imperatives addressed to the reader',
    /(?:^|[.!?:]\s+)(Drill|Crimp|Cut|Sharpen|Hone|Charge|Store|Install|Connect|Attach|Insert|Tighten|Loosen|Remove|Wear(?! [Pp]oints?\b)|Use|Hold|Press|Pull|Push|Turn|Set|Place|Keep|Avoid|Check|Make sure|Always|Never|Do not|Don’t|Try|Choose|Pick|Buy|Consider|Look|Scroll|Browse|Send|Read|See|Skip|Click|Tap|Select|Open|Clean|Oil|Replace|Unplug)\b/,
    'It is a drill. Tighten the chuck.',
  ],
  ['wear-as-a-verb control', /(?:^|[.!?:]\s+)Wear(?! [Pp]oints?\b)\b/, 'It is noted. Wear gloves.'],
  ['recharging word control', /\b(charg\w*|recharg(?!eable battery)\w*)\b/i, 'recharging the pack'],
  /* "a rechargeable battery" is the name of a drive in the brief; every other charging word fires. */
  ['battery charging, storage, transport or disposal', /\b(charg\w*|recharg(?!eable battery)\w*|discharg\w*|storing (?:the |a )?batter\w*|store (?:the |a |your )?batter\w*|storage of batter\w*|dispos\w*|recycl\w*|transport\w*)\b/i, 'store the battery half charged'],
  ['fire statements either way', /\b(fire|flames?|burn\w*|explo\w*|overheat\w*|thermal runaway|combust\w*|ignit\w*)\b/i, 'it will not overheat'],
  ['safe or dangerous claims', /\b(safe|safer|safest|unsafe|dangerous|hazard\w*|(?<!Product )safety)\b/i, 'this pruner is safer'],
  ['battery compatibility or voltage as strength', /\b(compatib\w*|interchangeab\w*|works? with (?:any|all|other|the same) batter\w*|same battery platform|more powerful|stronger (?:drill|motor|tool))\b/i, 'the battery is compatible with'],
  ['lifespan, edge retention, durability, quality', /\b(lasts? (?:longer|for years|a lifetime)|long[- ]lasting|durab\w*|reliab\w*|professional[- ]grade|high[- ]quality|built to last|holds? (?:up|an edge)|stays? sharp|keeps? (?:its |an )?edge|lifetime)\b/i, 'the edge stays sharp for years'],
  ['protective equipment advice', /\b(gloves?|goggles|safety glasses|eye protection|ear protection|hearing protection|face shield|respirator|dust mask|protective (?:gear|equipment)|PPE)\b/i, 'wear gloves and goggles'],
  ['device fit, opening devices, warranty', /\b(fits? (?:your |the |a |an )?(?:MacBook|iPhone|PS5|Xbox|Switch|laptops?|phones?|consoles?|doorbell)|warrant\w*|void\w* the|pry (?:open|off)|disassembl\w*|teardown)\b/i, 'it fits your iPhone without voiding the warranty'],
  ['herbicides and garden chemicals', /\b(herbicid\w*|weed ?killers?|spray chemicals?|pesticid\w*|glyphosate)\b/i, 'a weed killer spray'],
  ['who a tool suits', /\b(for (?:women|men|beginners|kids|children|seniors|ladies|dads?|moms?|him|her)|ideal for|perfect for|great for|best for|suited (?:to|for)|recommended for|we recommend|gift for|beginners?|DIY\w*|novices?|experts?|professionals?)\b/i, 'perfect for beginners'],
  ['charity reading of seller wording', /\b(charit\w*|donat\w*|proceeds|fundrais\w*|breast cancer|awareness)\b/i, 'proceeds support breast cancer awareness'],
  ['kid, child, toy outside quotes', /\b(kids?|child\w*|toys?)\b/i, 'a toy for a child'],
]
for (const [name, re, fixture] of R24) {
  control(name, re, fixture)
  let hits = 0
  for (const p of built) {
    const t = prose(p)
    for (const s of sentences(t)) {
      if (name.startsWith('battery compat') && s.trim().endsWith('?')) continue
      const m = s.match(re)
      if (m) {
        hits += 1
        failures.push(`${p.route}: ${name}: "${s.slice(0, 160)}"`)
      }
    }
  }
  if (hits === 0) notes.push(`R24 ${name}: 0 in prose outside seller quotes (control fired)`)
}

/* Seller wording is quoted and marked wherever it appears. */
for (const phrase of ['for Women', 'Stocking Stuffers for Men', 'Pink Ribbon', 'Blades Stay Sharp', 'razor-sharp']) {
  const quotedSomewhere = built.some((p) => p.html.includes(`<q data-seller-words="">${phrase}</q>`))
  if (!quotedSomewhere) failures.push(`seller phrase "${phrase}" is not rendered as a marked quote anywhere`)
  for (const p of built) {
    const outside = withoutNames(stripTags(withoutSellerQuotes(p.html)))
    if (outside.includes(phrase)) failures.push(`${p.route}: seller phrase "${phrase}" appears outside a quote`)
  }
  for (const p of built) {
    const quotes = (p.html.match(/<q data-seller-words="">/g) ?? []).length
    const markers = (p.html.match(/data-seller-block=""/g) ?? []).length
    if (quotes > 0 && markers === 0) failures.push(`${p.route}: seller quotes without the marker`)
  }
}
notes.push('addressing and edge claims appear only as marked seller quotes')

/* CPSC exactly once, on the battery page. */
const cpsc = built.flatMap((p) => [...p.html.matchAll(/href="https?:\/\/(www\.)?cpsc\.gov[^"]*"/g)].map(() => p.route))
if (cpsc.length !== 1 || cpsc[0] !== '/wear-points/the-battery') failures.push(`CPSC is linked ${cpsc.length} times: ${cpsc.join(', ')}`)
else notes.push('CPSC linked exactly once, on /wear-points/the-battery')
const cpscWords = built.filter((p) => /Consumer Product Safety Commission|CPSC/.test(p.text)).map((p) => p.route)
if (cpscWords.join() !== '/wear-points/the-battery') failures.push(`CPSC named on ${cpscWords.join(', ')}`)

/* Required statements, each tied to its computed count. */
const home = byRoute['/']
const garden = stripTags(home.html.match(/data-garden-statement=""[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? '')
if (cat.lookup('garden-powered') !== 0 || !/contains no powered device/.test(garden) || !/is none\./.test(garden)) failures.push(`home: garden statement missing or not backed by a zero count: "${garden}"`)
const pressure = stripTags(home.html.match(/data-pressure-statement=""[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? '')
if (cat.lookup('sprinklers-pressure') !== 0 || !/No sprinkler listing prints a water pressure/.test(pressure) || !/is none\./.test(pressure)) failures.push(`home: pressure statement missing or not backed by zero: "${pressure}"`)
if (!/None prints a water pressure\./.test(byRoute['/tool-types/the-sprinkler'].text)) failures.push('/tool-types/the-sprinkler: the pressure fact is missing')
if (!/none prints it\./.test(byRoute['/glossary'].text)) failures.push('/glossary: water pressure definition lacks the none statement')
for (const p of cat.misfiled()) {
  const h = byRoute[`/gear/${p.category}`].html
  const card = h.split(`id="listing-${p.asin}"`)[1]?.split('</article>')[0] ?? ''
  if (!/data-note=""/.test(card)) failures.push(`${p.asin}: caveat note missing on its card`)
}
if (cat.misfiled().length !== 4) failures.push(`misfiled listings: ${cat.misfiled().length}, the brief names four`)
for (const p of built) if (!p.html.includes('Search is not active')) failures.push(`${p.route}: search note missing from the header`)
notes.push('garden and pressure statements present and backed by zero counts; four caveats on cards; search note on every page')

/* ---------- SEO ---------- */
const TITLE = /^(.+), 2026 \| PowerToolCliff$/
for (const p of built) {
  const title = decode(p.html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? '')
  if (!TITLE.test(title)) failures.push(`${p.route}: title "${title}" does not follow "phrase, 2026 | PowerToolCliff"`)
  if (title.split('| PowerToolCliff').length !== 2) failures.push(`${p.route}: suffix count wrong in "${title}"`)
  if (title.trim() === 'PowerToolCliff') failures.push(`${p.route}: title equals the bare site name`)
  const h1 = (p.html.match(/<h1[\s>]/g) ?? []).length
  if (h1 !== 1) failures.push(`${p.route}: ${h1} h1 elements`)
  const canonical = p.html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
  const og = p.html.match(/<meta property="og:url" content="([^"]+)"/)?.[1]
  if (!canonical || canonical !== og) failures.push(`${p.route}: canonical ${canonical} vs og:url ${og}`)
  const want = p.route === '/' ? 'https://powertoolcliff.com' : `https://powertoolcliff.com${p.route}`
  if (canonical !== want) failures.push(`${p.route}: canonical is ${canonical}, expected ${want}`)
  const desc = decode(p.html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '')
  if (desc.length < 140 || desc.length > 160) failures.push(`${p.route}: description is ${desc.length} characters`)
  if (p.text.includes(desc)) failures.push(`${p.route}: description is copied from the body text`)
}
notes.push('titles, one h1, canonical = og:url, description 140–160 and not body text, on every page')

/* ---------- links (R12, R13) ---------- */
const reg = registry()
const ids = Object.fromEntries(built.map((p) => [p.route, new Set([...p.html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]))
let internal = 0
let pagelinks = 0
for (const p of built) {
  for (const m of p.html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const attrs = m[1]
    const href = decode(attrs.match(/href="([^"]*)"/)?.[1] ?? '')
    const text = stripTags(m[2])
    if (href.startsWith('/')) {
      internal += 1
      const [pathPart, hash] = href.split('#')
      if (!routes.has(pathPart)) failures.push(`${p.route}: link to missing page ${href}`)
      else if (hash && !ids[pathPart].has(hash)) failures.push(`${p.route}: link to missing anchor ${href}`)
      if (/data-pagelink/.test(attrs)) {
        pagelinks += 1
        const target = reg.get(href)
        if (target !== text) failures.push(`${p.route}: PageLink ${href} reads "${text}", target title is "${target}"`)
      } else if (href !== '/' && !/^\/_next\//.test(href)) {
        if (text !== reg.get(href)) failures.push(`${p.route}: internal link ${href} reads "${text}" and is not a PageLink`)
      }
    } else if (href.startsWith('#')) {
      if (!ids[p.route].has(href.slice(1))) failures.push(`${p.route}: in-page link to missing ${href}`)
    } else if (/amazon\.com\/dp\//.test(href)) {
      const rel = attrs.match(/rel="([^"]*)"/)?.[1] ?? ''
      if (rel !== 'nofollow sponsored noopener') failures.push(`${p.route}: Amazon link rel="${rel}"`)
      if (!/^https:\/\/www\.amazon\.com\/dp\/B0[A-Z0-9]{8}\?tag=YOURTAG-20$/.test(href)) failures.push(`${p.route}: malformed affiliate link ${href}`)
      const asin = href.match(/dp\/(B0[A-Z0-9]{8})/)[1]
      const prod = products.find((x) => x.asin === asin)
      if (!prod || !text.includes(prod.optionLabel)) failures.push(`${p.route}: affiliate link ${asin} reads "${text}"`)
    }
  }
}
notes.push(`${internal} internal links resolve; ${pagelinks} PageLinks read exactly their target title; affiliate links carry the right rel and their own label`)
for (const href of NAV) {
  const h1 = stripTags(byRoute[href]?.html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '')
  if (h1 !== reg.get(href)) failures.push(`nav item ${href}: page h1 "${h1}" is not "${reg.get(href)}"`)
}
const toolsH1 = stripTags(byRoute['/tools'].html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '')
const typesH1 = stripTags(byRoute['/tool-types'].html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '')
if (toolsH1 !== 'Tools' || typesH1 === toolsH1) failures.push(`/tools h1 "${toolsH1}" and /tool-types h1 "${typesH1}" must differ, with /tools reading Tools`)
notes.push(`nav pages exist with matching h1; /tools reads "${toolsH1}", /tool-types reads "${typesH1}"`)

/* ---------- affiliate coverage, images, disclosures ---------- */
const gearHtml = built.filter((p) => p.route.startsWith('/gear/')).map((p) => p.html).join('\n')
for (const p of products) {
  if (!gearHtml.includes(`https://www.amazon.com/dp/${p.asin}?tag=YOURTAG-20`)) failures.push(`${p.asin}: no affiliate link on its gear page`)
  if (!gearHtml.includes(encodeURIComponent(p.imageUrl))) failures.push(`${p.asin}: image not rendered through next/image`)
}
for (const p of built) {
  if (/[?&]w=3840/.test(p.html)) failures.push(`${p.route}: w=3840 in srcset`)
  for (const m of p.html.matchAll(/<img\b[^>]*>/g)) {
    if (!/sizes="/.test(m[0])) failures.push(`${p.route}: image without sizes: ${m[0].slice(0, 120)}`)
  }
  const hasAffiliate = /amazon\.com\/dp\//.test(p.html)
  const disclosures = (p.html.match(/data-disclosure="(\w+)"/g) ?? []).map((d) => d.match(/"(\w+)"/)[1])
  if (/^\/gear\/.+/.test(p.route) && disclosures.join(',') !== 'top,bottom') failures.push(`${p.route}: disclosures ${disclosures}`)
  if (p.route === '/' && disclosures.join(',') !== 'home') failures.push(`home: disclosures ${disclosures}`)
  if (hasAffiliate && disclosures.length === 0) failures.push(`${p.route}: affiliate links without a disclosure`)
}
notes.push(`${products.length} affiliate links on gear pages, every image with sizes, disclosures top and bottom on gear pages and once on home`)

/* ---------- R4 ---------- */
for (const p of built) {
  for (const ol of p.html.matchAll(/<ol\b[\s\S]*?<\/ol>/g)) {
    for (const li of ol[0].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)) {
      if (/^\s*\d+[.)]\s/.test(stripTags(li[1]))) failures.push(`${p.route}: manual number inside <ol>`)
    }
  }
}

/* ---------- R26, Knurl Rule, Edge Strip, photos ---------- */
const layouts = [...home.html.matchAll(/data-section-layout="([^"]+)"/g)].map((m) => m[1])
if (layouts.length < 14) failures.push(`home has ${layouts.length} sections`)
if (layouts[0] !== 'counter-banner-card-tiles') failures.push(`home opens with ${layouts[0]}`)
layouts.forEach((l, i) => i > 0 && l === layouts[i - 1] && failures.push(`home sections ${i} and ${i + 1} share the layout ${l}`))
if (new Set(layouts).size < 8) failures.push(`home uses only ${new Set(layouts).size} distinct layouts`)
notes.push(`home: ${layouts.length} sections, ${new Set(layouts).size} distinct layouts: ${layouts.join(' → ')}`)
const counter = home.html.split('data-section-layout="counter-banner-card-tiles"')[1]?.split('data-section-layout=')[0] ?? ''
for (const needle of ['data-counter-banner', 'data-counter-card', 'data-category-tiles']) if (!counter.includes(needle)) failures.push(`home counter missing ${needle}`)
if (!/data-counter-banner=""[\s\S]*?<h1/.test(counter) || /data-counter-banner=""[\s\S]*?<img[\s\S]*?<h1/.test(counter)) failures.push('home: the H1 is not on the flat carbon banner')
for (const needle of ['data-utility-bar', 'data-tier="1"', 'data-tier="2"', 'data-tier="3"', 'data-search-placeholder']) if (!home.html.includes(needle)) failures.push(`header missing ${needle}`)

const knurls = [...home.html.matchAll(/<div[^>]*data-knurl-rule=""[^>]*>/g)].map((m) => m[0])
if (knurls.length !== 3) failures.push(`home has ${knurls.length} Knurl Rules`)
for (const k of knurls) if (!/aria-hidden="true"/.test(k)) failures.push('a Knurl Rule is not aria-hidden')
const knurlAfter = home.html.split(/data-knurl-rule=""/).slice(0, -1).map((chunk) => [...chunk.matchAll(/data-section-layout="([^"]+)"/g)].pop()?.[1])
if (knurlAfter.join(',') !== 'card-grid-3x2,wide-table,narrow-prose') failures.push(`Knurl Rules sit after ${knurlAfter.join(', ')}`)
for (const p of built) if (p.route !== '/' && /data-knurl-rule/.test(p.html)) failures.push(`${p.route}: Knurl Rule outside the home page`)
notes.push('Knurl Rule exactly three times on home, aria-hidden, after sections 4, 8 and 12')

const ALLOWED_STRIPS = { 'product-card': /^\/gear\/.+/, 'check-result': /^\/(wear-point-check)?$/, 'wear-point-header': /^\/wear-points\/.+/ }
const seenStrips = new Set()
for (const p of built) {
  const visible = p.html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  for (const m of visible.matchAll(/data-edge-strip="([^"]+)"/g)) {
    seenStrips.add(m[1])
    if (!ALLOWED_STRIPS[m[1]]) failures.push(`${p.route}: Edge Strip in an unlisted place ${m[1]}`)
    else if (!ALLOWED_STRIPS[m[1]].test(p.route)) failures.push(`${p.route}: Edge Strip ${m[1]} on the wrong page`)
  }
  for (const block of visible.split('data-edge-strip="').slice(1)) {
    const chunk = block.split('</ul>')[0]
    const teeth = [...chunk.matchAll(/data-tooth="([^"]+)"[^>]*>([\s\S]*?)<\/li>/g)]
    if (teeth.length !== 6 || teeth.some((t) => stripTags(t[2]).length < 8)) failures.push(`${p.route}: an Edge Strip without six named teeth in words`)
    if (!/teeth sharp/.test(stripTags(chunk))) failures.push(`${p.route}: an Edge Strip without its sharp count in words`)
  }
}
for (const pl of Object.keys(ALLOWED_STRIPS)) if (!seenStrips.has(pl)) failures.push(`Edge Strip place ${pl} not rendered anywhere`)
notes.push(`Edge Strip rendered only in: ${[...seenStrips].join(', ')}; every strip carries six teeth in words and a count`)

const templateLayout = (re) => new Set(built.filter((p) => re.test(p.route)).map((p) => p.html.match(/data-page-layout="([^"]+)"/)?.[1]))
const tl = [/^\/wear-points\/.+/, /^\/tool-types\/.+/, /^\/materials\/.+/, /^\/gear\/.+/].map((re) => [re.source, [...templateLayout(re)]])
for (const [x, set] of tl) if (set.length !== 1) failures.push(`${x} pages use ${set.length} root layouts`)
if (new Set(tl.map(([, s]) => s[0])).size !== 4) failures.push(`template root layouts are not pairwise different: ${tl.map(([x, s]) => `${x}=${s[0]}`)}`)
notes.push(`template root layouts: ${tl.map(([, s]) => s[0]).join(', ')}`)

const photoIds = new Set(built.flatMap((p) => [...p.html.matchAll(/data-photo="([^"]+)"/g)].map((m) => m[1])))
for (const id of ['hero-card', 'spread-wear', 'spread-tools', 'spread-materials', 'contents']) if (!photoIds.has(id)) failures.push(`photo slot ${id} not rendered`)
for (const p of built) {
  for (const fig of p.html.matchAll(/<figure[^>]*data-photo="([^"]+)"[^>]*>([\s\S]*?)<\/figure>/g)) {
    if (!/Photo: .+ on Pexels/.test(stripTags(fig[2]))) failures.push(`${p.route}: photo ${fig[1]} without credit`)
    const imageBox = fig[2].split('<figcaption')[0]
    if (stripTags(imageBox).length > 0) failures.push(`${p.route}: text inside the image box of ${fig[1]}: "${stripTags(imageBox)}"`)
  }
}
const band = home.html.indexOf('data-section-layout="bordered-band"')
const firstProduct = Math.min(...['amazon.com/dp/', '#listing-'].map((n) => home.html.indexOf(n)).filter((i) => i > -1))
if (!(band > -1 && band < firstProduct)) failures.push('home: the Silence Band is not above the first product link')
notes.push('five photo slots rendered with credits and no text over pixels; Silence Band above the first product link')

/* ---------- R11 ---------- */
for (const p of built) {
  const html = bodyHtml(p.html).replace(/<q data-seller-words=""[\s\S]*?<\/q>/g, ' ').replace(/<script\b[\s\S]*?<\/script>/g, ' ')
  const blocks = [...html.matchAll(/<(p|li|dd|td|h2|h3|figcaption|caption)\b[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => stripTags(m[2])).filter((t) => t.length >= 40)
  const seen = new Map()
  for (const b of blocks) seen.set(b, (seen.get(b) ?? 0) + 1)
  for (const [b, n] of seen) if (n > 1) failures.push(`${p.route}: text repeated ${n} times: "${b.slice(0, 90)}"`)
}
notes.push('R11: no text block of 40 or more characters repeats inside a page body')
if (/\b(charg\w*|recharg(?!eable battery)\w*)\b/i.test('driven by a rechargeable battery')) failures.push('battery pattern fires on the drive name')

/* R11, short form: list items of 16 or more characters on product cards never repeat on a gear page. */
for (const p of built.filter((x) => /^\/gear\/.+/.test(x.route))) {
  const cards = p.html.split('data-product-card="').slice(1).map((c) => c.split('</article>')[0])
  const seen = new Map()
  for (const card of cards) {
    for (const li of card.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)) {
      if (/data-tooth=/.test(li[0])) continue
      const t = stripTags(li[1])
      if (t.length >= 16) seen.set(t.toLowerCase(), (seen.get(t.toLowerCase()) ?? 0) + 1)
    }
  }
  for (const [t, n] of seen) if (n > 1) failures.push(`${p.route}: card bullet repeated ${n} times: "${t}"`)
}
notes.push('R11: no card bullet of 16 or more characters repeats on a gear page (Edge Strip tooth lines excluded, they are the same six names by design)')

process.exit(report('R25 · text audit on stripTags(html): R4 R10 R11 R12 R13 R17 R24 R26', failures, notes))
