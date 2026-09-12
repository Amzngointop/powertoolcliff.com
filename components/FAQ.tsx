import { Plus } from 'lucide-react'

/** Accordion on native <details>: answers are in the HTML and open without script. */
export function FAQ({ items, heading }: { items: { q: string; a: string }[]; heading: string }) {
  return (
    <section aria-labelledby="faq-heading" className="faq">
      <h2 id="faq-heading" className="text-[24px]">
        {heading}
      </h2>
      <div className="mt-4 divide-y divide-rule border-y border-rule">
        {items.map((item) => (
          <details key={item.q} className="group">
            <summary className="flex items-start justify-between gap-4 py-4 font-display text-[17px] font-semibold text-ink">
              <span>{item.q}</span>
              <Plus className="faq-mark mt-1 h-4 w-4 shrink-0 text-blue" aria-hidden="true" />
            </summary>
            <p className="pb-4 pr-8 text-[15px] leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
