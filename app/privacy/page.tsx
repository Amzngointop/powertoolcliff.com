import { TextPage } from '@/components/TextPage'
import { titleForPath } from '@/lib/routes'
import { pageMeta, SITE } from '@/lib/seo'

export const metadata = pageMeta({
  path: '/privacy',
  phrase: 'Privacy notice for a static tool reference with no accounts or forms',
  description:
    'What this static reference collects: no accounts, no forms, no analytics scripts and no stored preferences. Amazon and Pexels have their own policies.',
})

export default function PrivacyPage() {
  return (
    <TextPage title={titleForPath('/privacy')} kicker="The site">
      <p>
        This is a static site. It has no accounts, no sign-up, no comment forms and no analytics scripts, and it stores nothing in the browser.
      </p>
      <h2>Images and fonts</h2>
      <p>
        Product and stock images are resized by the site’s own image service before they reach the browser, and fonts are served from the site itself. The browser does not contact Amazon or Pexels to show a page.
      </p>
      <h2>Links that leave the site</h2>
      <p>
        Product links go to Amazon and carry an affiliate tag. Photo credits go to Pexels, and source links go to the publishers named beside them. Once a link is followed, that site’s own policy applies.
      </p>
      <h2>Email</h2>
      <p>
        A message sent to {SITE.email} is read to answer it and to correct the site. It is not added to a mailing list.
      </p>
    </TextPage>
  )
}
