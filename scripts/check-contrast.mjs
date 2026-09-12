import { report } from './lib.mjs'

/* Palette contrast, measured with the WCAG 2.x relative luminance formula. */
const hex = (h) => h.replace('#', '').match(/../g).map((x) => parseInt(x, 16) / 255)
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const lum = (h) => {
  const [r, g, b] = hex(h).map(lin)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
export const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m)
  return (x + 0.05) / (y + 0.05)
}

const P = {
  white: '#FFFFFF', haze: '#F3F5F8', haze2: '#E4E8EE', blue: '#0B57D0', blueDeep: '#073E96', blueSoft: '#E8F0FD',
  amber: '#FFC400', amberDeep: '#B88C00', carbon: '#14171C', ink2: '#454B55', ink3: '#5A616B', ink3Brief: '#6E757F', flag: '#D32F2F',
}
const failures = []
const notes = []
const pairs = [
  ['white on --blue', P.white, P.blue, 4.5],
  ['white on --blue-deep', P.white, P.blueDeep, 4.5],
  ['white on --carbon', P.white, P.carbon, 4.5],
  ['--blue text on --white', P.blue, P.white, 4.5],
  ['--blue text on --haze', P.blue, P.haze, 4.5],
  ['--blue text on --blue-soft', P.blue, P.blueSoft, 4.5],
  ['--ink-2 on --white', P.ink2, P.white, 4.5],
  ['--ink-2 on --haze', P.ink2, P.haze, 4.5],
  ['--ink-3 on --white', P.ink3, P.white, 4.5],
  ['--ink-3 on --haze', P.ink3, P.haze, 4.5],
  ['--ink-3 on --haze-2', P.ink3, P.haze2, 4.5],
  ['--flag on --white', P.flag, P.white, 4.5],
  ['--amber-deep on --carbon', P.amberDeep, P.carbon, 4.5],
  ['--carbon on --amber (chips)', P.carbon, P.amber, 4.5],
]
for (const [name, fg, bg, min] of pairs) {
  const r = ratio(fg, bg)
  notes.push(`${name}: ${r.toFixed(2)}:1`)
  if (r < min) failures.push(`${name} is ${r.toFixed(2)}:1, below ${min}`)
}
const before = ratio(P.ink3Brief, P.haze2)
const after = ratio(P.ink3, P.haze2)
notes.push(`brief --ink-3 #6E757F on --haze-2 measured ${before.toFixed(2)}:1; changed to #5A616B, now ${after.toFixed(2)}:1`)
notes.push(`brief --amber-deep on --white would be ${ratio(P.amberDeep, P.white).toFixed(2)}:1, which is why it is only used on --carbon`)
if (ratio('#777777', '#FFFFFF') >= 4.5) failures.push('Negative control: #777 on white should fail AA')
process.exit(report('Contrast · palette pairs (the full DOM walk runs in the browser)', failures, notes))
