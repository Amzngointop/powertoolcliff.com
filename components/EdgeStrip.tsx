import { WEAR_SLUGS } from '@/data/types'
import type { WearSlug } from '@/data/types'
import { wearPoints } from '@/data/wear-points'

export type ToothState = 'sharp' | 'blunt' | 'off'
export type StripPlace = 'product-card' | 'check-result' | 'wear-point-header'

const TW = 40
const GAP = 6
const H = 34

function toothPath(i: number, state: ToothState): string {
  const x = i * (TW + GAP)
  if (state === 'sharp') return `M${x} ${H} L${x + TW / 2} 2 L${x + TW} ${H} Z`
  return `M${x} ${H} L${x + 12} 15 L${x + TW - 12} 15 L${x + TW} ${H} Z`
}

const STATE_WORDS: Record<ToothState, string> = {
  sharp: 'named',
  blunt: 'not named',
  off: 'switched off',
}

/**
 * The Edge Strip: six teeth, one per wear point, always in the same order.
 * Sharp and blue: the listing names the part or what it is made of.
 * Cut down and gray: the listing is silent on it.
 * Yellow base: the listing states replacement.
 * The shape is never the only carrier: every tooth has its name and state in words (R6).
 */
export function EdgeStrip({
  place,
  named,
  replacement = [],
  off = {},
  highlight,
  animate = false,
  compact = false,
  idPrefix,
}: {
  place: StripPlace
  named: WearSlug[]
  replacement?: WearSlug[]
  off?: Partial<Record<WearSlug, string>>
  highlight?: WearSlug
  animate?: boolean
  compact?: boolean
  idPrefix: string
}) {
  const states = WEAR_SLUGS.map((slug) => {
    const state: ToothState = off[slug] ? 'off' : named.includes(slug) ? 'sharp' : 'blunt'
    return { slug, state, base: state === 'sharp' && replacement.includes(slug) }
  })
  const sharpCount = states.filter((s) => s.state === 'sharp').length
  const width = WEAR_SLUGS.length * TW + (WEAR_SLUGS.length - 1) * GAP
  const title = (slug: WearSlug) => wearPoints.find((w) => w.slug === slug)?.short ?? slug
  let sharpIndex = 0

  return (
    <div className={`edge-strip ${animate ? 'sharpen' : ''}`} data-edge-strip={place} data-sharp={sharpCount}>
      <svg
        viewBox={`0 0 ${width} ${H + 8}`}
        className={compact ? 'h-[30px] w-auto' : 'h-[46px] w-full max-w-[420px]'}
        aria-hidden="true"
        focusable="false"
      >
        <rect x="0" y={H} width={width} height="2" fill="#D5DAE2" />
        {states.map((s, i) => {
          const delay = s.state === 'sharp' ? sharpIndex++ * 45 : 0
          return (
            <g key={s.slug}>
              <path
                d={toothPath(i, s.state)}
                className={`tooth tooth-${s.state} ${highlight === s.slug ? 'tooth-lit' : ''}`}
                style={animate && s.state === 'sharp' ? { animationDelay: `${delay}ms` } : undefined}
              />
              {s.base ? <rect x={i * (TW + GAP)} y={H} width={TW} height="7" className="tooth-base" /> : null}
            </g>
          )
        })}
      </svg>
      <p className="label mt-1.5 !text-ink" id={`${idPrefix}-count`}>
        {sharpCount} of {WEAR_SLUGS.length} teeth sharp
      </p>
      <ul className={`mt-1.5 grid gap-x-4 gap-y-0.5 ${compact ? 'grid-cols-1 text-[12.5px]' : 'grid-cols-1 text-[14px] sm:grid-cols-2'} leading-snug`}>
        {states.map((s) => (
          <li key={s.slug} className="flex items-baseline gap-1.5" data-tooth={s.slug} data-state={s.state}>
            <span
              aria-hidden="true"
              className={`inline-block h-2 w-2 shrink-0 ${s.state === 'sharp' ? 'bg-blue' : s.state === 'off' ? 'border border-dashed border-ink-3' : 'bg-haze-2 ring-1 ring-ink-3/40'}`}
            />
            <span className={highlight === s.slug ? 'font-semibold text-ink' : 'text-ink-2'}>
              {title(s.slug)}: {STATE_WORDS[s.state]}
              {s.base ? ', replacement stated' : ''}
              {s.state === 'off' ? ` — ${off[s.slug]}` : ''}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
