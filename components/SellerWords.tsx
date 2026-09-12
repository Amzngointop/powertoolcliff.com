/**
 * Seller wording is only ever shown here: inside <q data-seller-words>, after
 * a visible marker naming it as the seller's words. Nothing is read into it.
 */
export function SellerWords({ words }: { words: string[] }) {
  if (words.length === 0) return null
  return (
    <p className="text-[13.5px] leading-relaxed text-ink-2" data-seller-block="">
      <span className="label mr-1">Seller’s wording, quoted as printed:</span>{' '}
      {words.map((w, i) => (
        <span key={w}>
          <q data-seller-words="">{w}</q>
          {i < words.length - 1 ? ', ' : ''}
        </span>
      ))}
    </p>
  )
}
