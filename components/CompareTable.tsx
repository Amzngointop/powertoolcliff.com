import type { Product } from '@/data/types'
import type { Field } from '@/lib/catalog'
import { columnsFor } from '@/lib/compare'
import { PageLink } from './PageLink'

/** R3: renders only for two or more listings. R2: only columns that differ between rows. */
export function CompareTable({ items, groupedBy, caption }: { items: Product[]; groupedBy?: Field; caption: string }) {
  if (items.length < 2) return null
  const cols = columnsFor(items, groupedBy)
  if (cols.length === 0) {
    return <p className="text-[14px] text-ink-3">These listings state the same figures, so there is nothing to set side by side.</p>
  }
  return (
    <div className="table-wrap border border-rule bg-white" data-compare-table="" data-columns={cols.map((c) => c.key).join(',')}>
      <table className="data-table">
        <caption className="px-3 pt-3 text-left text-[13px] text-ink-3">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Listing</th>
            {cols.map((c) => (
              <th key={c.key} scope="col">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.asin}>
              <th scope="row" className="min-w-[220px] max-w-[300px] whitespace-normal text-left !font-body !text-[14px] !normal-case !tracking-normal">
                <PageLink href={`/gear/${p.category}#listing-${p.asin}`} />
              </th>
              {cols.map((c) => {
                const v = c.value(p)
                return (
                  <td key={c.key}>{v === null ? <span className="not-stated">not stated by the manufacturer</span> : v}</td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
