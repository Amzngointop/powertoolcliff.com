import fs from 'node:fs'
import path from 'node:path'
import { ROOT, walk, report, selfTestStripTags, stripTags } from './lib.mjs'

/*
 * First check of every run (R25): control and invisible characters in the
 * sources, the notations this catalog uses (fractions, degree, trademark,
 * apostrophes, asterisks, two inch quotes), and the stripTags self test.
 */

const NAMED = new Map([
  [0x200b, 'ZERO WIDTH SPACE'],
  [0x200c, 'ZERO WIDTH NON-JOINER'],
  [0x200d, 'ZERO WIDTH JOINER'],
  [0x200e, 'LEFT-TO-RIGHT MARK'],
  [0x200f, 'RIGHT-TO-LEFT MARK'],
  [0x2060, 'WORD JOINER'],
  [0x00a0, 'NO-BREAK SPACE'],
  [0xfeff, 'BYTE ORDER MARK'],
  [0x202a, 'LEFT-TO-RIGHT EMBEDDING'],
  [0x202c, 'POP DIRECTIONAL FORMATTING'],
  [0x202e, 'RIGHT-TO-LEFT OVERRIDE'],
  [0x00ad, 'SOFT HYPHEN'],
])
const isBad = (code) => NAMED.has(code) || (code < 0x20 && code !== 0x09 && code !== 0x0d && code !== 0x0a) || (code >= 0x7f && code <= 0x9f)

const failures = []
const notes = []
let scanned = 0

for (const dir of ['app', 'components', 'data', 'lib', 'scripts']) {
  for (const file of walk(path.join(ROOT, dir))) {
    if (!/\.(tsx?|mjs|css|json|svg)$/.test(file)) continue
    scanned += 1
    const lines = fs.readFileSync(file, 'utf8').split('\n')
    lines.forEach((line, i) => {
      for (let j = 0; j < line.length; j += 1) {
        const code = line.codePointAt(j)
        if (isBad(code)) failures.push(`${path.relative(ROOT, file)}:${i + 1}:${j + 1} contains ${NAMED.get(code) ?? `U+${code.toString(16).toUpperCase().padStart(4, '0')}`}`)
      }
    })
  }
}
notes.push(`${scanned} source files scanned for C0/C1 controls and invisible characters`)

/* Negative control: the scanner must catch what it claims to catch. */
const planted = 'a\u200bb\ufeffc\u00a0d\u2060e\u0007f\u0085g'
const caught = [...planted].filter((ch) => isBad(ch.codePointAt(0))).length
if (caught !== 6) failures.push(`Negative control: planted 6 bad characters, scanner caught ${caught}`)
else notes.push('negative control: 6 planted characters (ZWSP, BOM, NBSP, WJ, BEL, NEL) caught')

/*
 * Notation specimens. The brief lists fractions, an apostrophe in PULITUO'S,
 * a degree sign, a trademark sign, an asterisk in 20V MAX* and inch marks in
 * two quote styles. Only the fractions occur in the supplied data; the rest
 * are tested as synthetic specimens so no pattern breaks if they appear.
 */
const FRACTION = /(\d+)\/(\d+)\s*(?:-|\s)?(?:inch|in\b|"|'')/i
const specimens = [
  ['a 3/8 inch keyless chuck', '3/8'],
  ['1/4, 3/8 and 1/2 inch drives', '1/2'],
  ['a 5/8 inch cut capacity', '5/8'],
  ['a preset 1/4 inch drive', '1/4'],
  ['Hunter PGP-ADJ 3/4 inch Rotor', '3/4'],
  ['a 3/8" chuck', '3/8'],
  ["a 3/8'' chuck", '3/8'],
]
for (const [s, want] of specimens) {
  try {
    const all = [...s.matchAll(new RegExp(FRACTION.source, 'gi'))].map((m) => `${m[1]}/${m[2]}`)
    if (all.at(-1) !== want) failures.push(`Fraction pattern read ${all.at(-1)} from "${s}", expected ${want}`)
  } catch (err) {
    failures.push(`A pattern broke on "${s}": ${err}`)
  }
}
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
for (const s of ["PULITUO'S 20V", 'PULITUO’S 20V', '360°', 'Klein Tools™', '20V MAX*', '6.5"', "6.5''", '22-52 ft']) {
  try {
    if (!new RegExp(`^${escape(s)}$`).test(s)) failures.push(`Escaped pattern does not match its own specimen "${s}"`)
    const stripped = stripTags(`<p>${s.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</p>`)
    if (stripped !== s.trim()) failures.push(`stripTags changed "${s}" into "${stripped}"`)
  } catch (err) {
    failures.push(`A pattern broke on "${s}": ${err}`)
  }
}
notes.push('fraction, apostrophe, degree, trademark, asterisk and two inch-quote specimens pass without distortion')

/* The asterisk in "20V MAX*" must never reach the data as a footnote marker. */
for (const file of walk(path.join(ROOT, 'data'))) {
  const src = fs.readFileSync(file, 'utf8')
  if (/MAX\*/.test(src)) failures.push(`${path.relative(ROOT, file)}: "MAX*" asterisk found in data`)
}
notes.push('no "MAX*" asterisk in data files')

try {
  selfTestStripTags()
  if (stripTags(undefined) !== '') throw new Error('stripTags(undefined) must return an empty string')
  notes.push('stripTags self test passed (head, title, desc, script, style removed with contents)')
} catch (err) {
  failures.push(String(err.message ?? err))
}

process.exit(report('R25 · invisible characters, notations, stripTags self test', failures, notes))
