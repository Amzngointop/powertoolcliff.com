import { categories } from '@/data/gear'
import { wearPoints } from '@/data/wear-points'
import { inCategory, namedIn } from '@/lib/catalog'
import { PageLink } from './PageLink'

/**
 * The Wear Table: rows are categories, columns are wear points, each cell is
 * the number of listings in that category naming that part. Zero is a word.
 */
export function WearTable({ caption }: { caption: string }) {
  return (
    <div className="table-wrap border border-rule bg-white" data-wear-table="">
      <table className="data-table">
        <caption className="px-3 pt-3 text-left text-[13px] text-ink-3">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            {wearPoints.map((w) => (
              <th key={w.slug} scope="col" className="!whitespace-normal">
                <PageLink href={`/wear-points/${w.slug}`} className="text-link" />
              </th>
            ))}
            <th scope="col" className="num">
              Listings
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.slug} data-category-row={c.slug}>
              <th scope="row" className="!font-body !text-[14px] !normal-case !tracking-normal">
                <PageLink href={`/gear/${c.slug}`} />
              </th>
              {wearPoints.map((w) => {
                const n = namedIn(c.slug, w.slug)
                return (
                  <td
                    key={w.slug}
                    className={`num font-narrow text-[16px] font-bold ${n === 0 ? '!text-ink-3' : '!text-blue'}`}
                    data-count={n}
                    style={n > 0 ? { background: 'var(--blue-soft)' } : undefined}
                  >
                    {n === 0 ? <span className="text-[12px] uppercase tracking-[0.08em]">none</span> : n}
                  </td>
                )
              })}
              <td className="num" data-total={inCategory(c.slug).length}>
                {inCategory(c.slug).length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
