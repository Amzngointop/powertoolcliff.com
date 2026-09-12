/** Decorative divider: diagonal knurling with one yellow cut in the middle. Carries no information. */
export function KnurlRule() {
  return (
    <div className="wrap py-6" aria-hidden="true" data-knurl-rule="">
      <div className="relative h-[10px]">
        <svg className="absolute inset-0 h-[10px] w-full" focusable="false">
          <defs>
            <pattern id="knurl" width="8" height="10" patternUnits="userSpaceOnUse">
              <path d="M1 10 L6 0" stroke="#D5DAE2" strokeWidth="1.6" />
            </pattern>
          </defs>
          <rect width="100%" height="10" fill="url(#knurl)" />
        </svg>
        <svg className="absolute left-1/2 top-0 h-[10px] w-[12px] -translate-x-1/2" viewBox="0 0 12 10" focusable="false">
          <rect width="12" height="10" fill="#FFFFFF" />
          <path d="M3 10 L9 0" stroke="#FFC400" strokeWidth="3" />
        </svg>
      </div>
    </div>
  )
}
