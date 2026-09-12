import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

export const ROOT = process.cwd()
export const HTML_DIR = path.join(ROOT, '.next', 'server', 'app')

/** Import a TypeScript module from the project with Node's type stripping. */
export async function load(rel) {
  return import(pathToFileURL(path.join(ROOT, rel)).href)
}

const ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
  '&middot;': '·',
  '&hellip;': '…',
  '&mdash;': '—',
  '&ndash;': '–',
  '&rsquo;': '’',
  '&lsquo;': '‘',
  '&ldquo;': '“',
  '&rdquo;': '”',
}

export function decode(s) {
  let out = s
  for (const [k, v] of Object.entries(ENTITIES)) out = out.split(k).join(v)
  out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  out = out.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  return out
}

/**
 * R25: head, title, desc, script and style go entirely, contents included.
 * React's comment separators between static text and interpolated values are
 * removed first, so "Named by <!-- -->9" reads as "Named by 9".
 */
export function stripTags(html) {
  if (typeof html !== 'string') return ''
  let s = html
  s = s.replace(/<head[\s>][\s\S]*?<\/head>/gi, ' ')
  s = s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  s = s.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  s = s.replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, ' ')
  s = s.replace(/<desc\b[^>]*>[\s\S]*?<\/desc>/gi, ' ')
  s = s.replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, ' ')
  s = s.replace(/<!--[\s\S]*?-->/g, '')
  s = s.replace(/<[^>]*>/g, ' ')
  s = decode(s)
  s = s.replace(/\s+/g, ' ').trim()
  return s
}

export function selfTestStripTags() {
  const fixture =
    '<html><head><title>Title text</title><style>body{color:red}</style>' +
    '<meta name="description" content="meta text"></head><body>' +
    '<script>var hidden = "script text";</script>' +
    '<script type="application/ld+json">{"x":"json text"}</script>' +
    '<svg><title>svg title</title><desc>desc text</desc><path d="M0 0"/></svg>' +
    '<style>.x{content:"style text"}</style>' +
    '<p>Named by<!-- --> <span>9</span> listings &amp; 3/8 inch</p></body></html>'
  const got = stripTags(fixture)
  const expected = 'Named by 9 listings & 3/8 inch'
  if (got !== expected) throw new Error(`stripTags self test failed.\n  expected: ${expected}\n  got:      ${got}`)
  for (const banned of ['Title text', 'script text', 'json text', 'svg title', 'desc text', 'style text', 'color:red', 'meta text']) {
    if (got.includes(banned)) throw new Error(`stripTags leaked "${banned}"`)
  }
  return true
}

export function walk(dir, ext) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git', 'out'].includes(entry.name)) continue
      out.push(...walk(full, ext))
    } else if (!ext || entry.name.endsWith(ext)) {
      out.push(full)
    }
  }
  return out
}

/** Every prerendered page with its stripped text. Shape is asserted before anything leans on it (R25). */
export function pages() {
  const files = walk(HTML_DIR, '.html')
  const out = []
  for (const file of files) {
    const rel = path.relative(HTML_DIR, file).replace(/\\/g, '/')
    if (rel.startsWith('_not-found') || rel.startsWith('_global-error')) continue
    const route = rel === 'index.html' ? '/' : `/${rel.replace(/\.html$/, '')}`
    const html = fs.readFileSync(file, 'utf8')
    const text = stripTags(html)
    if (text === undefined || typeof text !== 'string') throw new Error(`Page ${route}: text is undefined`)
    if (text.length === 0) throw new Error(`Page ${route}: text is empty`)
    if (text.length < 200) throw new Error(`Page ${route}: only ${text.length} characters of text`)
    out.push({ route, file, html, text })
  }
  if (out.length < 30) throw new Error(`Only ${out.length} prerendered pages found; run next build first`)
  return out.sort((a, b) => a.route.localeCompare(b.route))
}

/** Remove seller quotes from HTML before text checks. */
export function withoutSellerQuotes(html) {
  return html.replace(/<q data-seller-words=""[^>]*>[\s\S]*?<\/q>/g, ' ')
}

export function report(name, failures, notes = []) {
  const line = '─'.repeat(64)
  console.log(`\n${line}\n${name}\n${line}`)
  for (const n of notes) console.log(`  · ${n}`)
  if (failures.length === 0) {
    console.log('  PASS')
    return 0
  }
  console.log(`  FAIL (${failures.length})`)
  for (const f of failures.slice(0, 80)) console.log(`   ✗ ${f}`)
  if (failures.length > 80) console.log(`   … and ${failures.length - 80} more`)
  return 1
}
