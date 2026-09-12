import { TextPage } from '@/components/TextPage'
import { titleForPath } from '@/lib/routes'
import { pageMeta, SITE } from '@/lib/seo'

export const metadata = pageMeta({
  path: '/contact',
  phrase: 'Contact details for corrections to listings and wear point counts',
  description:
    'How to reach this reference by email or post, and what to send along with a correction: the listing, the wording it prints and the page where the count is off.',
})

export default function ContactPage() {
  return (
    <TextPage title={titleForPath('/contact')} kicker="The site">
      <p>
        Corrections are the most useful message this site gets. Where a count looks wrong, or a listing states something a page does not reflect, the most useful correction carries the listing’s ASIN, the wording it prints and the page where the difference shows.
      </p>
      <h2>Email</h2>
      <p>
        <a className="text-link" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
      </p>
      <h2>Post</h2>
      <p>{SITE.address}</p>
      <h2>What this address cannot help with</h2>
      <p>
        Orders, returns and questions about using a particular tool go to the seller and to the manufacturer’s instructions. This site sells nothing and has no order records.
      </p>
    </TextPage>
  )
}
