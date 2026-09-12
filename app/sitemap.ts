import type { MetadataRoute } from 'next'
import { pagePaths } from '@/lib/routes'
import { absoluteUrl } from '@/lib/seo'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return pagePaths().map((path) => ({ url: absoluteUrl(path), lastModified: new Date('2026-09-11') }))
}
