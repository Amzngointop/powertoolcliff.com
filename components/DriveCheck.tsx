'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { DRIVES } from '@/data/types'
import type { Drive } from '@/data/types'
import { DRIVE_LABELS } from '@/lib/catalog'
import { DRIVE_RULES, driveCheck } from '@/lib/drive-check'
import { assertOptionLabels } from '@/lib/labels'

assertOptionLabels(
  'Drive Check / drive',
  DRIVES.map((d) => DRIVE_LABELS[d]),
)

export function DriveCheck() {
  const [drive, setDrive] = useState<Drive>(DRIVES[0])
  const r = driveCheck(drive)
  const label = DRIVE_LABELS[drive]

  return (
    <div data-tool="drive-check">
      <div role="group" aria-labelledby="dc-label">
        <p id="dc-label" className="label label-lg !text-ink">
          What drives the tool
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DRIVES.map((d) => (
            <button key={d} type="button" className="opt" aria-pressed={drive === d} onClick={() => setDrive(d)}>
              {DRIVE_LABELS[d]}
            </button>
          ))}
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setDrive(DRIVES[0])}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-6 border-t-[3px] border-carbon pt-5" aria-live="polite" data-result="" data-drive={drive}>
        <p className="font-display text-[22px] font-bold leading-snug text-ink">
          {label}: {r.count} of the catalog’s listings
        </p>
        <div className="table-wrap mt-4">
          <table className="data-table">
            <caption className="sr-only">Figures printed by listings driven by {label.toLowerCase()}</caption>
            <thead>
              <tr>
                <th scope="col">Figure</th>
                <th scope="col" className="num">
                  Listings printing it
                </th>
              </tr>
            </thead>
            <tbody>
              {r.figures.map((f) => (
                <tr key={f.key} data-figure={f.key} data-count={f.count} style={r.dependent?.key === f.key ? { background: 'var(--blue-soft)' } : undefined}>
                  <td>
                    {f.label}
                    {r.dependent?.key === f.key ? <span className="chip ml-2 align-middle">The figure this check looks for</span> : null}
                  </td>
                  <td className="num">{f.count === 0 ? 'none' : f.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {r.dependent ? (
          <p className="mt-4 border-l-[3px] border-flag pl-3 text-[15px] leading-relaxed text-ink" data-dependent={r.dependent.count}>
            Listings printing {r.dependent.label}: {r.dependent.count} of {r.count}.
            {r.dependent.count === 0 ? ' The result is zero, and it is printed here as a result.' : ''}
          </p>
        ) : (
          <p className="mt-4 border-l-[3px] border-flag pl-3 text-[15px] leading-relaxed text-ink" data-dependent="none">
            For a tool driven by hand there is no figure of this kind to look for, so this check has nothing to count.
          </p>
        )}
        <p className="mt-3 text-[14px] leading-relaxed text-ink-2" data-category-reading={r.byCategoryName}>
          Reading the drive from category names instead would give {r.byCategoryName} listings. This check does not do that.
        </p>
      </div>

      <div className="mt-6 text-[14px] leading-relaxed text-ink-2">
        <p className="label label-lg !text-ink">The formula</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5" data-rules="drive">
          {DRIVE_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
