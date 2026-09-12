import Image from 'next/image'
import Link from 'next/link'
import { categories } from '@/data/gear'
import { inCategory } from '@/lib/catalog'
import { titleForPath } from '@/lib/routes'

/**
 * Six round department tiles. The product photo sits inside the square
 * inscribed in the circle (inset 16%, the geometric limit is 14.6%), with
 * object-contain, so a white-ground shot is never cut by the ring.
 */
export function CategoryTiles({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const lg = size === 'lg'
  return (
    <ul className={`snap-row md:grid md:overflow-visible ${lg ? 'md:grid-cols-3 md:gap-10 lg:grid-cols-6' : 'md:grid-cols-6 md:gap-6'}`} data-category-tiles={size} data-count={categories.length}>
      {categories.map((c) => {
        const href = `/gear/${c.slug}`
        const lead = inCategory(c.slug).find((p) => p.rank === 1)
        if (!lead) throw new Error(`No rank 1 listing in ${c.slug}`)
        const n = inCategory(c.slug).length
        return (
          <li key={c.slug} className={lg ? 'w-[170px] md:w-auto' : 'w-[132px] md:w-auto'}>
            <Link href={href} className="tile plain-link flex flex-col items-center text-center" data-pagelink="">
              <span className="tile-ring block w-full">
                <span className="tile-img">
                  <Image
                    src={lead.imageUrl}
                    alt=""
                    fill
                    sizes={lg ? '(min-width: 1024px) 128px, (min-width: 768px) 200px, 118px' : '(min-width: 768px) 110px, 90px'}
                    className="object-contain"
                  />
                </span>
              </span>
              <span className={`mt-2.5 font-display font-semibold leading-tight text-ink ${lg ? 'text-[17px]' : 'text-[14.5px]'}`}>{titleForPath(href)}</span>
            </Link>
            <p className="label mt-0.5 text-center" data-count={n}>
              {n} listings
            </p>
          </li>
        )
      })}
    </ul>
  )
}
