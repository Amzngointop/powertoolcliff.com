import type { SourceId } from '@/data/sources'
import { sourcesFor } from '@/data/sources'

export function Sources({ ids, heading = 'Sources' }: { ids: SourceId[]; heading?: string }) {
  const list = sourcesFor(ids)
  return (
    <section aria-labelledby="sources-heading" className="border-t border-rule pt-6" data-sources={list.length}>
      <h2 id="sources-heading" className="label label-lg !text-ink">
        {heading}
      </h2>
      <ul className="mt-3 space-y-2.5 text-[14px] leading-snug">
        {list.map((s) => (
          <li key={s.url}>
            <a href={s.url} className="text-link" rel="noopener noreferrer" target="_blank">
              {s.label}
            </a>
            <span className="text-ink-3"> · {s.publisher}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
