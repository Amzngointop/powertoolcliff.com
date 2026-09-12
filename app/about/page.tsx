import { PageLink } from '@/components/PageLink'
import { TextPage } from '@/components/TextPage'
import { fillSentence } from '@/lib/fill'
import { titleForPath } from '@/lib/routes'
import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  path: '/about',
  phrase: 'About this reference on the tool parts that wear out first',
  description:
    'What this site is: a counter-side reference built from listing text, organized by the part of a tool that wears first, with no testing, prices or ratings.',
})

export default function AboutPage() {
  return (
    <TextPage title={titleForPath('/about')} kicker="The site">
      <p>
        {fillSentence(
          'This site files every tool listing it covers under the part most likely to be the reason someone comes back to the counter: the battery, the bit tip, the blade edge, the chuck and drive, the nozzle and filter, or the claw and tine. It covers {w:products} listings in {w:categories} departments.',
        )}
      </p>
      <h2>Where the facts come from</h2>
      <p>
        Every statement about a product comes from the text of its listing as supplied to this site, and is written as what the listing states. Statements about standards, units and definitions come from published documents, linked on the page where they are used.
      </p>
      <h2>What this site does not do</h2>
      <p>
        It has not bought, handled, tested or measured any tool. It does not estimate how long any part lasts. It does not give instructions for using, servicing or installing anything; the manufacturer’s instructions cover that. It prints no prices and no ratings.
      </p>
      <h2>How it treats seller wording</h2>
      <p>
        Where a listing addresses a kind of buyer or makes a claim about lasting, the words are quoted as the seller’s, set apart from the listing facts. This site describes the tool, not the person it is sold to.
      </p>
      <p>
        <PageLink href="/wear-points" /> · <PageLink href="/affiliate-disclosure" /> · <PageLink href="/contact" />
      </p>
    </TextPage>
  )
}
