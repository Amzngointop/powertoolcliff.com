import { PageLink } from '@/components/PageLink'
import { WearPointCheck } from '@/components/WearPointCheck'
import { WEAR_SLUGS } from '@/data/types'
import { numberWord } from '@/lib/catalog'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  path: '/wear-point-check',
  phrase: 'Check which wear points a single tool listing names and leaves out',
  description:
    'A listing picked here shows its Edge Strip: the parts it names, the parts it is silent on, and whether it says anything about replacing a part.',
})

export default function WearPointCheckPage() {
  return (
    <div className="wrap pb-20 pt-10" data-page-layout="tool-page">
      <p className="label label-lg !text-blue">Interactive check</p>
      <h1 className="mt-1 text-[36px] md:text-[46px]">{titleForPath('/wear-point-check')}</h1>
      <p className="mt-3 max-w-[760px] text-[17px]">
        A listing at a time, drawn as {numberWord(WEAR_SLUGS.length)} teeth. The result is read from the listing as supplied to this site, never from a test of the tool.
      </p>
      <div className="mt-10">
        <WearPointCheck />
      </div>
      <p className="mt-12 text-[14px]">
        <PageLink href="/wear-points" /> · <PageLink href="/drive-check" /> · <PageLink href="/tools" />
      </p>
    </div>
  )
}
