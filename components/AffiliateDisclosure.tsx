import { PageLink } from './PageLink'

const TEXT: Record<'top' | 'bottom' | 'home', string> = {
  top: 'Product links on this page go to Amazon, and this site may earn a commission on qualifying purchases. It does not change what a listing is said to state.',
  bottom: 'The listings above link to Amazon as an affiliate. Nothing on this page was bought, handled or measured by this site.',
  home: 'Product links on this page go to Amazon as an affiliate, and this site may earn from qualifying purchases. No product here was handled or measured.',
}

export function AffiliateDisclosure({ position }: { position: 'top' | 'bottom' | 'home' }) {
  return (
    <aside
      className="flex flex-col gap-1 border-l-[3px] border-amber bg-haze px-4 py-3 text-[13.5px] leading-relaxed text-ink-2 sm:flex-row sm:items-baseline sm:gap-3"
      data-disclosure={position}
    >
      <span className="label shrink-0 !text-ink">Disclosure</span>
      <span>
        {TEXT[position]} <PageLink href="/affiliate-disclosure" />
      </span>
    </aside>
  )
}
