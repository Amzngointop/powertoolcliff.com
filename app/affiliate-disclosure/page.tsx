import { TextPage } from '@/components/TextPage'
import { fillSentence } from '@/lib/fill'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  path: '/affiliate-disclosure',
  phrase: 'Affiliate disclosure for the Amazon product links on this reference',
  description:
    'How this reference earns: Amazon affiliate links on product cards. The commission does not change counts, badges or what a listing is reported to state.',
})

export default function AffiliateDisclosurePage() {
  return (
    <TextPage title={titleForPath('/affiliate-disclosure')} kicker="The site">
      <p>
        As an Amazon Associate this site earns from qualifying purchases. Every product link on the site goes to an Amazon listing and carries an affiliate tag.
      </p>
      <h2>What the commission does not touch</h2>
      <p>
        {fillSentence(
          'Counts are computed from listing text, badges are derived from figures that occur once in a category, and all {w:products} listings are shown whether they say a lot or nothing at all. None of that depends on a commission.',
        )}
      </p>
      <h2>What is not on the site</h2>
      <p>
        No prices, no ratings and no claims of having used any tool. Prices and availability are on Amazon and change without notice.
      </p>
    </TextPage>
  )
}
