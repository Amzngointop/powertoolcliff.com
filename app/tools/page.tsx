import { PageLink } from '@/components/PageLink'
import { WEAR_RULES } from '@/lib/wear-check'
import { DRIVE_RULES } from '@/lib/drive-check'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  path: '/tools',
  phrase: 'Interactive checks for wear points and drives across the catalog',
  description:
    'Two interactive checks: one shows which wear points a single listing names, the other counts which figures listings print for each thing that drives a tool.',
})

export default function ToolsIndex() {
  const tools = [
    {
      href: '/wear-point-check',
      what: 'With a category and a listing chosen, the check draws that listing’s Edge Strip and counts how many listings in the same category say exactly the same.',
      rules: WEAR_RULES.length,
    },
    {
      href: '/drive-check',
      what: 'With a drive chosen, the check counts the listings driven that way, the figures they print, and how many print the figure the check looks for.',
      rules: DRIVE_RULES.length,
    },
  ]
  return (
    <div className="wrap pb-20 pt-10" data-page-layout="index-tools">
      <p className="label label-lg !text-blue">Index</p>
      <h1 className="mt-1 text-[38px] md:text-[48px]">{titleForPath('/tools')}</h1>
      <p className="mt-3 max-w-[760px] text-[17px]">
        The interactive checks on this site. For kinds of tool, such as the drill or the sprinkler, see <PageLink href="/tool-types" />.
      </p>
      <ul className="mt-10 grid items-stretch gap-6 md:grid-cols-2">
        {tools.map((t) => (
          <li key={t.href} className="card flex h-full flex-col border-t-[4px] !border-t-amber p-6">
            <h2 className="text-[26px]">
              <PageLink href={t.href} className="plain-link hover:text-blue" />
            </h2>
            <p className="mt-3 flex-grow text-[16px] leading-relaxed">{t.what}</p>
            <p className="label mt-5" data-count={t.rules}>
              {t.rules} printed rules
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
