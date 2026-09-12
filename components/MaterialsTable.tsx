import { materials } from '@/data/materials'
import { printing } from '@/lib/catalog'
import { fillSentence } from '@/lib/fill'
import { PageLink } from './PageLink'

const WHO: Record<string, string> = {
  'a published standard': 'Published standards',
  'a trade reference': 'A trade reference',
  nobody: 'Nobody',
}

/** The word | What it names | Who defines it | Listings printing it | Page */
export function MaterialsTable({ caption }: { caption: string }) {
  return (
    <div className="table-wrap border border-rule bg-white" data-materials-table="">
      <table className="data-table">
        <caption className="px-3 pt-3 text-left text-[13px] text-ink-3">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">The word</th>
            <th scope="col">What it names</th>
            <th scope="col">Who defines it</th>
            <th scope="col" className="num">
              Listings printing it
            </th>
            <th scope="col">Page</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m) => {
            const n = printing(m.slug).length
            return (
              <tr key={m.slug} data-material-row={m.slug}>
                <td className="whitespace-nowrap font-display text-[15px] font-semibold text-ink">{m.words.join(' / ')}</td>
                <td className="min-w-[260px]">{fillSentence(m.whatItNames).split('. ')[0]}.</td>
                <td className={m.definedBy === 'nobody' ? 'font-semibold !text-flag' : ''}>{WHO[m.definedBy]}</td>
                <td className="num font-narrow text-[16px] font-bold !text-ink" data-count={n}>
                  {n}
                </td>
                <td className="whitespace-nowrap">
                  <PageLink href={`/materials/${m.slug}`} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
