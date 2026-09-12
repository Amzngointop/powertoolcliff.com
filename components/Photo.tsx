import Image from 'next/image'
import type { Photo as PhotoData } from '@/data/photos'

function Credit({ photo, className = '' }: { photo: PhotoData; className?: string }) {
  return (
    <figcaption className={`mt-1.5 text-right ${className}`}>
      <a href={photo.creditUrl} className="label plain-link hover:text-blue" rel="noopener noreferrer" target="_blank">
        Photo: {photo.credit} on Pexels
      </a>
    </figcaption>
  )
}

/** A stock photo slot. `sizes` is required (R5). Nothing is ever set over the pixels. */
export function Photo({
  photo,
  sizes,
  className = '',
  priority = false,
  aspect,
}: {
  photo: PhotoData
  sizes: string
  className?: string
  priority?: boolean
  aspect?: string
}) {
  return (
    <figure className={className} data-photo={photo.id}>
      <div className="relative w-full overflow-hidden bg-haze-2" style={{ aspectRatio: aspect ?? photo.aspect }}>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
      <Credit photo={photo} />
    </figure>
  )
}

/** Full-bleed spread: the photo and, below it, only the credit. */
export function Spread({ photo, height, layout = true }: { photo: PhotoData; height: string; layout?: boolean }) {
  return (
    <figure className="w-full" data-photo={photo.id} data-section-layout={layout ? 'full-bleed-photo' : undefined}>
      <div className="relative w-full overflow-hidden bg-haze-2" style={{ height }}>
        <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-cover" />
      </div>
      <Credit photo={photo} className="wrap" />
    </figure>
  )
}
