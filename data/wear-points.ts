import { products } from './products.ts'
import type { SourceId } from './sources.ts'
import type { ToolTypeSlug, WearSlug } from './types.ts'

export interface WearPoint {
  slug: WearSlug
  title: string
  /** Short noun used on teeth and in the Wear Table header. */
  short: string
  phrase: string
  metaDescription: string
  /** One line for the home card: what happens when the part is used up, in the listings' own terms. */
  cardLine: string
  whatGoesFirst: string
  whatTheListingsSay: string
  notes: string[]
  flagLine: string
  namedBy: string[]
  silentOn: string[]
  statesReplacement: string[]
  toolTypeSlugs: ToolTypeSlug[]
  sources: SourceId[]
}

type Written = Omit<WearPoint, 'namedBy' | 'silentOn' | 'statesReplacement' | 'toolTypeSlugs'>

const written: Written[] = [
  {
    slug: 'the-battery',
    title: 'The battery',
    short: 'Battery',
    phrase: 'The battery on cordless tools and what listings print about it',
    metaDescription:
      'Which cordless tool listings name a battery, which print a voltage or a capacity, and where recall notices are published. Nothing here converts a figure.',
    cardLine: 'When the battery is done, the tool waits on a part, and the listing is the first place anyone looks for what that part is.',
    whatGoesFirst:
      'On a cordless tool the battery is the part sold as figures: a voltage on the box and, less often, a capacity in amp hours. This site reports those figures as printed. It does not describe how batteries behave or age; that belongs to the manufacturer’s instructions.',
    whatTheListingsSay:
      '{W:wp-the-battery} listings in this catalog name a battery or a battery voltage. {W:voltage} print a voltage and {w:amp-hours} prints a capacity. Voltage figures are not converted into anything here, and they are not compared across brands.',
    notes: [
      'The volt and the ampere are SI units, defined in the SI Brochure published by the BIPM. The amp hour is not an SI unit; NIST Special Publication 811 lists the hour among the units accepted for use with the SI.',
      'The U.S. Consumer Product Safety Commission publishes recalls and product safety warnings, and its listing can be filtered by product, with categories for power drills and for batteries. This site does not say whether any listing in this catalog appears there.',
      'This site makes no statement about any battery working with a tool from another brand, even where the printed voltage matches.',
    ],
    flagLine:
      'A listing that is silent about its battery has said nothing about it. Silence is not a statement that the battery lasts, and this site does not make one.',
    sources: ['cpscRecalls', 'bipmSi', 'nist811Ch5'],
  },
  {
    slug: 'the-bit-tip',
    title: 'The bit tip',
    short: 'Bit tip',
    phrase: 'The bit tip in screwdriver sets, kits and drills, listing by listing',
    metaDescription:
      'Bit tips across screwdriver sets, kits and drills: which listings name a profile, a steel or a magnet, which print a count, and what standards cover tips.',
    cardLine: 'When a tip is done, the set is short a bit, and the piece count on the box never said which one.',
    whatGoesFirst:
      'In a bit set the tip is the working end of each loose bit; on a fixed driver it is the end of the shaft. Listings describe tips by profile, by steel and by whether they are magnetic, and some describe them only by a count.',
    whatTheListingsSay:
      '{W:wp-the-bit-tip} listings name a bit or a tip. {W:mat-s2-steel} of them name a steel, S2, and {z:hardness-figure} prints a hardness figure.',
    notes: [
      'ISO 8764-1 specifies driver tips for cross-recessed screws in the forms PH and PZ. ISO 10664 specifies the hexalobular socket on the screw side, and says it is for inspection rather than manufacture. ISO 1173 covers the drive ends of screwdriver bits.',
      'A listing that names a device alongside its bits is using the seller’s wording. This site does not confirm that any bit fits any device.',
    ],
    flagLine:
      'A listing that does not name its tips has not said anything about them, and this site does not fill that silence with a claim of its own.',
    sources: ['iso8764', 'iso10664', 'iso1173'],
  },
  {
    slug: 'the-blade-edge',
    title: 'The blade edge',
    short: 'Blade edge',
    phrase: 'The blade edge on pruners, snips and a crack weeder, as listed',
    metaDescription:
      'Blade edges on pruners, garden snips and a crack weeder: which listings name the blade action, the material, a coating or a cut capacity, and which stay quiet.',
    cardLine: 'When the edge is done, a pruner has no other working part, and the listing is where a replacement would have been mentioned.',
    whatGoesFirst:
      'On pruners, snips and the bladed weeder, the wear point is the edge. Listings describe a blade by its action, its material and sometimes a coating, and the Fiskars bypass listing prints a cut capacity.',
    whatTheListingsSay:
      '{W:wp-the-blade-edge} listings name a blade. The count stating that a part can be replaced is {w:wp-replacement-the-blade-edge}, and the count printing a hardness figure is {z:hardness-figure}.',
    notes: [
      'Penn State Extension describes bypass blades as passing each other like scissors, and an anvil blade as closing against a blunt, flat surface.',
      'Hardness of metals is measured by published test methods such as the Rockwell test in ISO 6508-1. A steel or coating named in a listing is not a hardness figure.',
      'The micro-tip snips listing makes a claim about its edge over time. It is quoted on the card as the seller’s words, and this site does not assess how long any edge lasts.',
    ],
    flagLine:
      'A pruner listing that says nothing about its blade has not promised anything about the edge. This site does not fill that gap with an estimate.',
    sources: ['psuPruners', 'iso6508', 'astmE18'],
  },
  {
    slug: 'the-chuck-and-drive',
    title: 'The chuck and drive',
    short: 'Chuck and drive',
    phrase: 'The chuck, ratchet and drive across drills, sets and sprinklers',
    metaDescription:
      'Chucks, ratchets, socket drives and sprinkler drives: which listings name the part that turns, which print a torque figure, and the units they print it in.',
    cardLine: 'When the part that turns is done, nothing else on the tool stands in for it.',
    whatGoesFirst:
      'The drive is the part that turns: a drill chuck, a ratchet, a socket drive, and on a sprinkler the drive that moves the head. Listings name it more often by what it does than by what it is made of.',
    whatTheListingsSay:
      '{W:wp-the-chuck-and-drive} listings name a chuck, a ratchet or a drive, spread across {w:wp-cats-the-chuck-and-drive} categories. {W:torque} print a torque figure, in newton meters or in inch-pounds.',
    notes: [
      'ISO 1174-1 gives the dimensions of driving squares for hand socket tools, in millimeters. ISO 6789-1 sets requirements and conformance tests for hand torque tools.',
      'NIST Special Publication 811 gives the newton meter as the SI unit of moment of force. Torque in this catalog is printed in newton meters and in inch-pounds, and this site does not convert between them.',
    ],
    flagLine:
      'A listing that does not name its drive has told you nothing about it, and nothing about it is implied here.',
    sources: ['iso1174', 'iso6789', 'nist811Ch4'],
  },
  {
    slug: 'the-nozzle-and-filter',
    title: 'The nozzle and filter',
    short: 'Nozzle and filter',
    phrase: 'Sprinkler nozzles and filters, and the pressure no listing prints',
    metaDescription:
      'Sprinkler nozzles and filters by listing: which name nozzles, which name a filter, and how many print the water pressure their coverage figures rest on.',
    cardLine: 'When a nozzle or filter is done, the coverage figure on the box stays the same, and no listing here prints the pressure behind it.',
    whatGoesFirst:
      'On a sprinkler, water leaves through nozzles, and some listings name a filter behind them. Only the parts a listing names are counted on this page.',
    whatTheListingsSay:
      '{W:wp-the-nozzle-and-filter} listings name a nozzle or a filter, and {w:filters-named} names a filter. The count of sprinkler listings printing a water pressure is {z:sprinklers-pressure}.',
    notes: [
      'EPA WaterSense notes that pressure above what a spray nozzle is designed for can cause excessive flow, misting and uneven coverage. Its specification for spray sprinkler bodies applies to bodies with built-in pressure regulation.',
      'ISO 15886-3 sets test conditions and methods for how sprinklers distribute water, including uniformity and wetted radius.',
      'The rotor head in this catalog is a head for an installed irrigation system. This site does not describe how it, or any other sprinkler, is connected or installed.',
    ],
    flagLine:
      'No sprinkler listing in this catalog prints the water pressure behind its coverage figure. That is a gap in the listings, not a property of the sprinklers.',
    sources: ['epaSsbPage', 'epaSsbSpec', 'iso15886'],
  },
  {
    slug: 'the-claw-and-tine',
    title: 'The claw and tine',
    short: 'Claw and tine',
    phrase: 'Weeder claws, tines and heads, and what their listings name',
    metaDescription:
      'Weeder claws and heads by listing: which name the working end and what it is made of, which name only a handle, and why no weeder listing prints a figure.',
    cardLine: 'When the claws are done, the handle is still whole, and the listing is where the head would have been described.',
    whatGoesFirst:
      'On a weeder the working end is a set of claws or a shaped head. This page counts claws and heads; the bladed crack weeder is counted under the blade edge.',
    whatTheListingsSay:
      '{W:wp-the-claw-and-tine} listings name claws or a head, and each of them names what it is made of. The count of weeder listings printing a length or any other figure is {z:weeders-figure}.',
    notes: [
      'ASTM A240 is a specification for stainless steel plate, sheet and strip, and ISO 15510 lists the chemical compositions of stainless steels. ASTM B26 covers aluminum-alloy sand castings.',
      'A listing that names a material has named a material. It has not named a grade or a specification, and this site does not supply one.',
    ],
    flagLine:
      'A weeder listing that names only its handle has said nothing about the part that meets the ground, and nothing about that part is assumed here.',
    sources: ['astmA240', 'iso15510', 'astmB26'],
  },
]

export const wearPoints: WearPoint[] = written.map((w) => {
  const named = products.filter((p) => p.wearPointsNamed.includes(w.slug))
  return {
    ...w,
    namedBy: named.map((p) => p.asin),
    silentOn: products.filter((p) => !p.wearPointsNamed.includes(w.slug)).map((p) => p.asin),
    statesReplacement: named.filter((p) => p.statesReplacement).map((p) => p.asin),
    toolTypeSlugs: [...new Set(named.map((p) => p.toolTypeSlug))],
  }
})

export function wearPointBySlug(slug: string): WearPoint {
  const w = wearPoints.find((x) => x.slug === slug)
  if (!w) throw new Error(`No wear point ${slug}`)
  return w
}
