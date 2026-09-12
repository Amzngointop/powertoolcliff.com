import { TextPage } from '@/components/TextPage'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  path: '/terms',
  phrase: 'Terms of use for a reference built from tool listing text',
  description:
    'Terms for using this reference: it reports what listings state, gives no instructions or advice, and leaves the use and care of every tool to its manufacturer.',
})

export default function TermsPage() {
  return (
    <TextPage title={titleForPath('/terms')} kicker="The site">
      <p>
        This site reports what product listings state and what published documents say. It is provided as a reference, as it stands, and listings can change after they are read.
      </p>
      <h2>No instructions and no advice</h2>
      <p>
        Nothing here is an instruction for using, servicing, installing or maintaining a tool, and nothing here is advice on which tool anyone should buy. The use and care of every tool is set by its manufacturer’s instructions.
      </p>
      <h2>Seller wording</h2>
      <p>
        Quoted seller wording is reported as printed. Quoting it is not agreement with it, and this site draws no conclusion from it.
      </p>
      <h2>Content</h2>
      <p>
        The text on this site is original. Product names belong to their owners, and stock photos are credited to their photographers on Pexels.
      </p>
    </TextPage>
  )
}
