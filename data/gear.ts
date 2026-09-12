import type { CategorySlug, ToolTypeSlug } from './types.ts'

export interface Subgroup {
  id: string
  title: string
  intro: string
  /** A field every listing in the subgroup shares by definition; it is never a table column (R2). */
  groupedBy?: 'statedVoltage'
}

export interface Category {
  slug: CategorySlug
  title: string
  phrase: string
  coreJob: string
  toolTypeSlug: ToolTypeSlug
  metaDescription: string
  intro: string
  subgroups: Subgroup[]
  faq: { q: string; a: string }[]
}

export const categories: Category[] = [
  {
    slug: 'tool-sets',
    title: 'Tool Sets',
    phrase: 'Household tool sets and what their listings name as wearing',
    coreJob: 'a piece count, and {w:kits-specialist} listings that are not general household kits',
    toolTypeSlug: 'the-household-kit',
    metaDescription:
      'Household tool kits compared by what each listing names: piece counts, drives and a crimp tool with plugs. No prices, no ratings, no lifespan claims made.',
    intro:
      'A household kit sells on its piece count, and the count is the one figure almost every listing here prints. What the count leaves out is which pieces go first. {W:silent-tool-sets} of the {w:cat-tool-sets} listings in this category name none of the parts on the strip at all.',
    subgroups: [
      {
        id: 'general-household-kits',
        title: 'General household kits',
        intro: 'Boxes of hand tools sold by count. The counts differ; what the listings say about wear mostly does not.',
      },
      {
        id: 'specialist-kits',
        title: 'Specialist kits',
        intro:
          'A mechanics set, a data cable crimp tool and a precision and ratchet set. {W:misfiled-tool-sets} of them are filed here although they are not household kits, and their cards say so.',
      },
    ],
    faq: [
      {
        q: 'Which kit in this category names the most wear points?',
        a: 'The precision and ratchet set, which names a bit tip and a drive. It is also one of the listings filed here that is not a household kit.',
      },
      {
        q: 'Does any kit here state that a part can be replaced?',
        a: 'The count of Tool Sets listings stating replacement is {z:replacement-tool-sets}. The crimp tool ships with plugs, which are consumables, and says nothing about replacing the tool’s own parts.',
      },
      {
        q: 'Why is a crimp tool in Tool Sets?',
        a: 'That is where the catalog files it. This site keeps it where it was filed and puts a note on its card rather than moving it.',
      },
    ],
  },
  {
    slug: 'drills',
    title: 'Cordless Drills',
    phrase: 'Cordless drill listings compared by stated voltage, torque and chuck',
    coreJob: '{w:drills-20v} listings printing the same voltage, and {w:drills-no-voltage} printing none',
    toolTypeSlug: 'the-cordless-drill',
    metaDescription:
      'Cordless drill listings set side by side on what they state: voltage, torque, chuck and battery capacity, and which of those figures each one leaves out.',
    intro:
      'Every listing here is a battery tool, and {w:drills-20v} of the {w:cat-drills} print the same voltage. A shared figure does not separate listings, so this page groups by voltage and compares on what differs: chuck, torque, bits and capacity. Voltages are not compared across brands.',
    subgroups: [
      {
        id: 'stating-20v',
        title: 'Listings stating 20V',
        intro:
          'All {w:drills-20v} state 20V, and {w:drills-20v-max} of them add the word MAX. Voltage is what groups them, so it is not a column in the table below.',
        groupedBy: 'statedVoltage',
      },
      {
        id: 'another-voltage',
        title: 'Listings stating another voltage',
        intro: 'The count of listings stating a voltage other than 20V is {w:drills-other-voltage}. With nothing to set beside it, it stands as a single card.',
      },
      {
        id: 'no-voltage',
        title: 'No voltage stated',
        intro: 'A listing that prints torque, chuck and bit count and no voltage at all. Alone in its group, it stands as a single card.',
      },
    ],
    faq: [
      {
        q: 'How many drill listings print a battery capacity?',
        a: '{W:amp-hours}. Capacity in amp hours is the figure the battery tooth hangs on, and most of these listings leave it out.',
      },
      {
        q: 'Is a higher voltage figure a stronger drill?',
        a: 'This site does not convert or compare voltage figures between brands. It reports what each listing prints and nothing further.',
      },
      {
        q: 'Do the batteries from one of these drills work in another?',
        a: 'This site makes no statement about any battery working with a tool from another brand, even where the printed voltage is the same. The manufacturer’s instructions cover which batteries a tool takes.',
      },
    ],
  },
  {
    slug: 'screwdrivers',
    title: 'Screwdriver Sets',
    phrase: 'Screwdriver and precision bit sets and the one powered entry',
    coreJob: 'bits, and the {w:screwdrivers-battery} entry here that is a power tool',
    toolTypeSlug: 'the-screwdriver-set',
    metaDescription:
      'Screwdriver sets compared by bit profiles, steel names, torque range and piece count, with a note on the one battery screwdriver filed among the hand sets.',
    intro:
      'Every listing in this category names the bit tip, which makes it the one tooth the whole category shares. Beyond that they split into precision sets, fixed drivers, ratchet and torque drivers, and one battery screwdriver filed among them.',
    subgroups: [
      {
        id: 'precision-bit-sets',
        title: 'Precision bit sets',
        intro: 'Small bits in a handle. The listings name bit profiles, and the JOREST listing also names devices; none of that is a confirmation of fit.',
      },
      {
        id: 'driver-handles',
        title: 'Driver handles',
        intro: 'Fixed drivers, counted and split by tip shape. The tip is part of each driver rather than a loose bit.',
      },
      {
        id: 'ratchet-and-torque',
        title: 'Ratchet and torque drivers',
        intro: 'Both name S2 bits and a drive. Only the coobeast listing prints a figure for torque.',
      },
      {
        id: 'powered',
        title: 'A powered screwdriver',
        intro: 'A battery tool in a category of hand sets. It stands as a single card.',
      },
    ],
    faq: [
      {
        q: 'Do the precision bits fit the devices named in the listings?',
        a: 'This site does not confirm that any bit fits any device. Device names on these listings are the seller’s wording and are reported as that.',
      },
      {
        q: 'How many listings here name S2 steel?',
        a: '{W:mat-s2-steel}. A steel name is not a hardness figure, and no listing in this category prints one.',
      },
      {
        q: 'Why is a battery screwdriver in a category of hand sets?',
        a: 'That is where the catalog files it. Its card carries a note, and its drive field reads as a rechargeable battery rather than a hand.',
      },
    ],
  },
  {
    slug: 'weeders',
    title: 'Manual Weeders',
    phrase: 'Manual weeders compared by what their listings name at the working end',
    coreJob: 'claws against roots, and no figure anywhere',
    toolTypeSlug: 'the-weeder',
    metaDescription:
      'Stand-up pullers and hand weeders compared on what each listing names at the working end: claws, a cast head, a blade, and not one printed measurement.',
    intro:
      'Weeders are hand tools, and their listings describe the working end in words: claws, a cast head, a blade. The count of weeder listings printing a length, a piece count or any other figure is {z:weeders-figure}.',
    subgroups: [
      {
        id: 'stand-up-pullers',
        title: 'Stand-up pullers',
        intro: 'Long-handled pullers with clawed heads. Both name what the claws are made of.',
      },
      {
        id: 'hand-weeders',
        title: 'Hand weeders',
        intro: 'Short tools: a cast head, a blade, and a material named without saying which part it is.',
      },
    ],
    faq: [
      {
        q: 'Does any weeder listing print a measurement?',
        a: 'No. Listings in this category describe their heads, claws and handles in words and print no length, weight or claw depth.',
      },
      {
        q: 'Is a stainless claw better than a steel one?',
        a: 'This site does not rank materials against each other. It reports which material each listing names, and the material pages say who defines each word.',
      },
      {
        q: 'Why is a blade filed here?',
        a: 'The crack weeder is a hand weeder with a blade as its working end, so its strip names the blade edge instead of the claw and tine.',
      },
    ],
  },
  {
    slug: 'sprinklers',
    title: 'Sprinklers',
    phrase: 'Sprinkler listings compared by printed coverage, flow and pressure',
    coreJob: 'square feet printed, pressure never printed',
    toolTypeSlug: 'the-sprinkler',
    metaDescription:
      'Hose sprinklers and a rotor head compared on printed coverage, flow and range, and on the figure none of the listings print: the water pressure behind them.',
    intro:
      'Of the {w:cat-sprinklers} sprinkler listings, {w:sprinklers-area} print a coverage area in square feet and {w:sprinklers-range} prints a range in feet. The count printing the water pressure behind those figures is {z:sprinklers-pressure}.',
    subgroups: [
      {
        id: 'oscillating',
        title: 'Oscillating',
        intro: 'Both print an area and count their nozzles. Neither prints a pressure.',
      },
      {
        id: 'rotating-and-impact',
        title: 'Rotating and impact on a base',
        intro: 'Sprinklers on bases, tripods and wheels. The Melnor MiniMax listing prints an area, and the Orbit tripod listing prints the word pressure with no number.',
      },
      {
        id: 'spike-and-in-ground',
        title: 'Spike and in-ground heads',
        intro: 'A gear-drive head on a spike and a rotor head for an installed system. The rotor head carries a note on its card.',
      },
    ],
    faq: [
      {
        q: 'How many sprinkler listings print a water pressure?',
        a: '{Z:sprinklers-pressure}. Coverage areas are printed, but no listing says what pressure they were measured at.',
      },
      {
        q: 'Why does pressure matter for a coverage figure?',
        a: 'EPA WaterSense notes that pressure above what a spray nozzle is designed for can cause misting and uneven coverage. The source is linked on the sprinkler page.',
      },
      {
        q: 'Is the rotor head a hose sprinkler?',
        a: 'No. It is a head for an installed irrigation system, filed in this catalog among hose sprinklers. This site does not describe how it is installed.',
      },
    ],
  },
  {
    slug: 'pruners',
    title: 'Pruners & Garden Scissors',
    phrase: 'Pruners and garden scissors compared by blade, length and replaceable parts',
    coreJob: 'the only category where a listing states replaceable parts',
    toolTypeSlug: 'the-pruner',
    metaDescription:
      'Bypass pruners and straight-blade snips compared by blade, length and cut capacity, including the one listing in the catalog that states replaceable parts.',
    intro:
      'Every listing here names its blade, so the blade edge is the tooth the whole category shares. What sets the category apart is a single listing: the count stating replaceable parts is {w:replacement-pruners} here and {w:states-replacement} in the whole catalog.',
    subgroups: [
      {
        id: 'bypass-pruners',
        title: 'Bypass pruners',
        intro: 'Bypass blades, which Penn State Extension describes as passing each other like scissors. The Fiskars listing prints a cut capacity and the Felco listing states replaceable parts.',
      },
      {
        id: 'straight-blade-snips',
        title: 'Straight-blade snips',
        intro: 'Straight or micro-tip blades. The micro-tip listing makes a claim about the edge over time, quoted on its card as the seller’s words.',
      },
    ],
    faq: [
      {
        q: 'Which listing states replaceable parts?',
        a: 'The Felco F2. It does not say which parts, and this site does not add a list of its own.',
      },
      {
        q: 'Does this site say how long any of these edges last?',
        a: 'This site does not assess how long any edge lasts. Where a listing makes a claim about the edge, it is quoted as the seller’s words.',
      },
      {
        q: 'How many pruner listings print a cut capacity?',
        a: '{W:pruners-cut}. Lengths are printed more often than cut capacity in this category.',
      },
    ],
  },
]

export function categoryBySlug(slug: string): Category {
  const c = categories.find((x) => x.slug === slug)
  if (!c) throw new Error(`No category ${slug}`)
  return c
}
