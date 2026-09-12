import { MaterialsTable } from '@/components/MaterialsTable'
import { fillSentence } from '@/lib/fill'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  path: '/materials',
  phrase: 'Material words printed on tool listings and who defines each one',
  description:
    'S2 steel, stainless steel, titanium, heavy duty and replaceable parts: what each word names, who defines it, and how many listings in this catalog print it.',
})

export default function MaterialsIndex() {
  return (
    <div className="wrap pb-20 pt-10" data-page-layout="index-table">
      <p className="label label-lg !text-blue">Index</p>
      <h1 className="mt-1 text-[38px] md:text-[48px]">{titleForPath('/materials')}</h1>
      <p className="mt-3 max-w-[760px] text-[17px]">
        {fillSentence(
          'Words printed where a lifespan would go. Some trace to a published standard, some to nobody at all. The count of listings stating that a part can be replaced is {w:mat-replaceable-parts}, out of {w:products}.',
        )}
      </p>
      <div className="mt-8">
        <MaterialsTable caption="Each material word, who defines it, and the number of listings in this catalog that print it." />
      </div>
    </div>
  )
}
