import type { SourceId } from './sources.ts'
import type { MaterialSlug } from './types.ts'

export interface Material {
  slug: MaterialSlug
  title: string
  /** The words as a listing prints them, shown large at the top of the page. */
  words: string[]
  phrase: string
  metaDescription: string
  whatItNames: string
  whoDefines: string
  /** "nobody" when no published definition was found; the page says so plainly. */
  definedBy: 'a published standard' | 'a trade reference' | 'nobody'
  whatItDoesNotPromise: string
  notes: string[]
  sources: SourceId[]
}

export const materials: Material[] = [
  {
    slug: 's2-steel',
    title: 'S2 steel',
    words: ['S2'],
    phrase: 'S2 steel on screwdriver bits and what the grade name does not say',
    metaDescription:
      'S2 steel as printed on screwdriver bit listings: what the grade name refers to, where it is traced, and why a steel name on a bit is not a hardness figure.',
    whatItNames:
      'A tool steel designation. AZoM, a trade publisher, groups S2 with the shock-resisting tool steels and lists it under the UNS number T41902 and the ASTM A681 specification.',
    whoDefines:
      'ASTM A681 is ASTM’s specification for alloy tool steels, with requirements for chemistry, hardness and more. Its public page does not list S2 by name, so on this site the designation is traced through the trade reference rather than the standard page itself.',
    definedBy: 'a trade reference',
    whatItDoesNotPromise:
      'A grade name says what a steel is called. It is not a hardness figure, and the count of listings printing S2 that also print a hardness figure is {z:hardness-figure}. Nothing about how long a bit lasts follows from the name, and this site does not suggest otherwise.',
    notes: [
      'Every listing printing S2 in this catalog is a screwdriver set. None of them names the heat treatment or a supplier of the steel.',
    ],
    sources: ['astmA681', 'azomS2'],
  },
  {
    slug: 'stainless-steel',
    title: 'Stainless steel',
    words: ['stainless', 'stainless steel'],
    phrase: 'Stainless steel on claws, blades and filters, and the grade left out',
    metaDescription:
      'Stainless steel as printed on weeder claws, garden blades and sprinkler filters: who defines the family, and the grade that none of the listings name.',
    whatItNames:
      'A family of steels rather than a single grade. The European standard EN 10088-1, in its {f:en10088-edition} edition, defines stainless steels as containing at least {f:en10088-chromium} chromium and at most {f:en10088-carbon} carbon.',
    whoDefines:
      'Published standards. ISO 15510 lists the chemical compositions of stainless steels; ASTM A941 is ASTM’s terminology standard for steel and stainless steel; EN 10088-1 lists stainless steels, and the chromium figure above is from its clause on definitions.',
    definedBy: 'a published standard',
    whatItDoesNotPromise:
      'The word names the family. It does not name a grade, and a family name says nothing a listing has measured. This site makes no claim about what the word means for rust, edge or lifespan on any of these tools.',
    notes: [
      'The listings printing the word sit in {w:mat-cats-stainless-steel} different categories: weeders, sprinklers and pruners. On the sprinkler it names filters; on the others it names claws or blades.',
    ],
    sources: ['iso15510', 'astmA941', 'itehEn10088', 'bsiEn10088'],
  },
  {
    slug: 'titanium-coating',
    title: 'Titanium and coatings',
    words: ['titanium', 'coating'],
    phrase: 'Titanium and coatings on pruner blades, and what the words leave out',
    metaDescription:
      'Titanium and coating as printed on pruner blade listings: neither says what the coating is or how thick, and this site found no published definition to cite.',
    whatItNames:
      'On the Haus & Garten listing, the word titanium sits next to the blade; the Fiskars bypass listing names steel blades with a low-friction coating. Neither listing says what the coating is made of or whether titanium refers to a coating, an alloy or something else.',
    whoDefines:
      'Nobody, as these listings use the words. This site found no published standard that defines titanium on a garden blade as a listing term. The FTC’s policy statement on advertising substantiation says objective claims need a reasonable basis; it is a rule about claims, not a definition of the word.',
    definedBy: 'nobody',
    whatItDoesNotPromise:
      'Neither word states a thickness, a composition or a hardness. A measured hardness would be reported through a published test such as ISO 6508-1, and neither listing prints one.',
    notes: ['Both listings are bypass pruners. Only the Fiskars listing says what the blade under the coating is: steel.'],
    sources: ['ftcSubstantiation', 'iso6508'],
  },
  {
    slug: 'heavy-duty',
    title: 'Heavy duty',
    words: ['heavy duty', 'heavy-duty'],
    phrase: 'Heavy duty on a sprinkler and a pruner, a phrase nobody defines',
    metaDescription:
      'Heavy duty as printed on a sprinkler and a pruner listing: seller wording with no published definition behind it, quoted as printed and never extended here.',
    whatItNames:
      'Nothing measurable. The phrase appears on a zinc impact sprinkler and a titanium bypass pruner, and on both it describes the build without a figure attached.',
    whoDefines:
      'Nobody. This site found no published definition behind the phrase as these listings use it. It is seller wording, and on both cards it is quoted as the seller’s words. The FTC’s policy statement asks that objective claims have a reasonable basis before they are made.',
    definedBy: 'nobody',
    whatItDoesNotPromise:
      'The phrase does not state a load, a material grade, a test or a lifespan. A measured property would be reported through a published method such as ASTM E18 for hardness, and neither listing prints one.',
    notes: ['The listings printing the phrase spell it with and without a hyphen. This page counts both spellings as the same phrase.'],
    sources: ['ftcSubstantiation', 'astmE18'],
  },
  {
    slug: 'replaceable-parts',
    title: 'Replaceable parts',
    words: ['replaceable parts'],
    phrase: 'Replaceable parts, the one listing phrase that speaks to wear',
    metaDescription:
      'Replaceable parts: the only phrase in this catalog that speaks to replacing a worn part, printed by a single pruner listing that does not say which parts.',
    whatItNames:
      'A statement that parts of the tool can be replaced. It is the only phrase in this catalog that speaks directly to what happens after a part is used up.',
    whoDefines:
      'Nobody defines the phrase for hand tools. The FTC’s report Nixing the Fix, published in {f:nixing-date}, looks at repair restrictions, mostly on phones and cars, and recommends ways to widen repair options. It is context for why the phrase is worth noticing, not a definition of it.',
    definedBy: 'nobody',
    whatItDoesNotPromise:
      'The listing does not say which parts can be replaced, where they are sold or for how long they will be. This site does not add a parts list of its own.',
    notes: [
      'The count of listings in this catalog printing the phrase is {w:mat-replaceable-parts}, out of {w:products}. The rest are silent on replacement, and that silence is reported as silence.',
    ],
    sources: ['ftcNixingTheFix', 'ftcSubstantiation'],
  },
]

export function materialBySlug(slug: string): Material {
  const m = materials.find((x) => x.slug === slug)
  if (!m) throw new Error(`No material ${slug}`)
  return m
}
