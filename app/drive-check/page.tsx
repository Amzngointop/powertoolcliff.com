import { DriveCheck } from '@/components/DriveCheck'
import { PageLink } from '@/components/PageLink'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  path: '/drive-check',
  phrase: 'Count the figures listings print for battery, hand and water drives',
  description:
    'For a battery, a hand or a water supply, this check counts the listings driven that way, the figures they print, and how many print the one it looks for.',
})

export default function DriveCheckPage() {
  return (
    <div className="mx-auto w-full max-w-narrow px-5 pb-20 pt-10" data-page-layout="tool-page-narrow">
      <p className="label label-lg !text-blue">Interactive check</p>
      <h1 className="mt-1 text-[36px] md:text-[44px]">{titleForPath('/drive-check')}</h1>
      <p className="mt-3 text-[17px]">
        The drive is read from each listing, not from the department it sits in. The formula is printed under the result.
      </p>
      <div className="mt-8">
        <DriveCheck />
      </div>
      <p className="mt-12 text-[14px]">
        <PageLink href="/tool-types" /> · <PageLink href="/wear-point-check" /> · <PageLink href="/tools" />
      </p>
    </div>
  )
}
