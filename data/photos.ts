/*
 * Five slots. Each src is the contentUrl printed on its Pexels photo page,
 * fetched with GET on 2026-09-11: 200, image/jpeg. Alt text follows the
 * description on the stock page. No text is ever set over these pixels.
 */
export interface Photo {
  id: 'hero-card' | 'spread-wear' | 'spread-tools' | 'spread-materials' | 'contents'
  src: string
  alt: string
  credit: string
  creditUrl: string
  pageUrl: string
  aspect: string
}

export const photos: Record<Photo['id'], Photo> = {
  'hero-card': {
    id: 'hero-card',
    src: 'https://images.pexels.com/photos/5711899/pexels-photo-5711899.jpeg',
    alt: 'Top view of a joinery mallet and a set of chisels on a dusty wooden workbench with shavings',
    credit: 'Anna Shvets',
    creditUrl: 'https://www.pexels.com/@shvetsa/',
    pageUrl: 'https://www.pexels.com/photo/set-of-carpentry-tools-with-wooden-hammer-5711899/',
    aspect: '1 / 1',
  },
  'spread-wear': {
    id: 'spread-wear',
    src: 'https://images.pexels.com/photos/16679649/pexels-photo-16679649/free-photo-of-close-up-of-a-set-of-drill-bits-stuck-in-a-wooden-board.jpeg',
    alt: 'Close-up of many used drill bits standing in a battered wooden board',
    credit: 'Miguel Á. Padriñán',
    creditUrl: 'https://www.pexels.com/@padrinan/',
    pageUrl: 'https://www.pexels.com/photo/close-up-of-a-set-of-drill-bits-stuck-in-a-wooden-board-16679649/',
    aspect: '21 / 9',
  },
  'spread-tools': {
    id: 'spread-tools',
    src: 'https://images.pexels.com/photos/3971211/pexels-photo-3971211.jpeg',
    alt: 'Garden hand tools, brushes and rakes hanging in a row on a dark wooden wall',
    credit: 'hans middendorp',
    creditUrl: 'https://www.pexels.com/@hansmiddendorp/',
    pageUrl: 'https://www.pexels.com/photo/gardening-tools-3971211/',
    aspect: '16 / 9',
  },
  'spread-materials': {
    id: 'spread-materials',
    src: 'https://images.pexels.com/photos/8817844/pexels-photo-8817844.jpeg',
    alt: 'Close-up of fine sawdust and curled wood shavings spread across a wooden surface',
    credit: 'Ron Lach',
    creditUrl: 'https://www.pexels.com/@ron-lach/',
    pageUrl: 'https://www.pexels.com/photo/close-up-shot-of-sawdust-8817844/',
    aspect: '16 / 9',
  },
  contents: {
    id: 'contents',
    src: 'https://images.pexels.com/photos/666013/pexels-photo-666013.jpeg',
    alt: 'Close-up of water bursting out of a garden hose onto green grass',
    credit: 'Ashish',
    creditUrl: 'https://www.pexels.com/@ashish-202923/',
    pageUrl: 'https://www.pexels.com/photo/close-up-photography-of-water-bursting-out-of-hose-666013/',
    aspect: '1 / 1',
  },
}
