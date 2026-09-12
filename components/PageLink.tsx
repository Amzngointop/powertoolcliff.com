import Link from 'next/link'
import { titleForPath } from '@/lib/routes'

/**
 * R13: an internal link whose text is always the target page's title.
 * It takes no children, and an unknown path throws during the build.
 */
export function PageLink({
  href,
  className = 'text-link',
  onClick,
  ...rest
}: {
  href: string
  className?: string
  onClick?: () => void
  children?: never
  'aria-current'?: 'page' | undefined
}) {
  if ((rest as { children?: unknown }).children !== undefined) {
    throw new Error(`PageLink to ${href} was given children; its text comes from the page title`)
  }
  const title = titleForPath(href)
  return (
    <Link href={href} className={className} onClick={onClick} aria-current={rest['aria-current']} data-pagelink="">
      {title}
    </Link>
  )
}
