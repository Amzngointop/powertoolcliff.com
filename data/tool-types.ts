import type { SourceId } from './sources.ts'
import type { CategorySlug, Drive, ToolTypeSlug, WearSlug } from './types.ts'

export interface ToolType {
  slug: ToolTypeSlug
  title: string
  phrase: string
  metaDescription: string
  category: CategorySlug
  drive: Drive
  /** The wear point this kind of tool hangs on. The page prints how many listings name it. */
  wearPointSlug: WearSlug
  whatItIs: string
  whyThisWearPoint: string
  driveNote: string
  /** The figure a reader would look for and the listings leave out. */
  missingFigure: string
  notes: string[]
  sources: SourceId[]
}

export const toolTypes: ToolType[] = [
  {
    slug: 'the-household-kit',
    title: 'The household kit',
    phrase: 'The household tool kit and the drive its listings name most',
    metaDescription:
      'What a household tool kit is by its listings: a piece count, a case, and a drive named more often than any bit. Specialist sets filed among them are noted.',
    category: 'tool-sets',
    drive: 'your-hand',
    wearPointSlug: 'the-chuck-and-drive',
    whatItIs:
      'By its listings, a household kit is a count of hand tools in a case. {W:field-tool-sets-statedPieceCount} of the {w:cat-tool-sets} listings in Tool Sets print a piece count, and {w:silent-tool-sets} name none of the parts on the strip.',
    whyThisWearPoint:
      'The drive is the wear point the kits here name most often: sockets, ratchets and a ratcheting crimp tool. The bit tip, which a reader might expect, is named by fewer.',
    driveNote:
      'Most kits here are driven by hand. The count of kits whose drive field is a rechargeable battery is {w:kits-battery}: a kit with a cordless drill in the box.',
    missingFigure: 'a breakdown of the piece count by kind of tool',
    notes: [
      'ISO 1174-1 gives the dimensions of driving squares for hand socket tools. ISO 8764-1 covers driver tips for cross-recessed screws.',
      'The crimp tool filed here ships with data cable plugs. TIA publishes the ANSI/TIA-568.2 standard for balanced twisted-pair cabling; this site does not describe crimping or cabling work.',
    ],
    sources: ['iso1174', 'iso8764', 'tia568'],
  },
  {
    slug: 'the-cordless-drill',
    title: 'The cordless drill',
    phrase: 'The cordless drill, its battery figures and the voltage it shares',
    metaDescription:
      'What a cordless drill listing states and leaves out: a shared voltage, occasional torque and chuck figures, and a battery capacity printed by a single listing.',
    category: 'drills',
    drive: 'a-rechargeable-battery',
    wearPointSlug: 'the-battery',
    whatItIs:
      'A drill driven by a rechargeable battery. Every one of the {w:cat-drills} listings in Cordless Drills names a battery, and {w:drills-20v} of them print the same voltage.',
    whyThisWearPoint:
      'The battery is the part every drill listing here names, and it is the part sold as figures. Voltage is printed by most; capacity, the figure the battery tooth looks for, is printed by {w:field-drills-statedAmpHours}.',
    driveNote:
      'All drills here are driven by a rechargeable battery. So are {w:kits-battery} household kit and {w:screwdrivers-battery} screwdriver filed in other categories, which is why the drive field is read from each listing and not from the category name.',
    missingFigure: 'a battery capacity in amp hours',
    notes: [
      'IEC 62841-2-1 is the international standard with particular requirements for hand-held drills and impact drills. This site names it as a published document and does not summarize its requirements.',
      'The volt is an SI unit defined in the BIPM’s SI Brochure. Torque is printed here in newton meters by the PULITUO listing and in inch-pounds by the COMOWARE listing; NIST SP 811 gives the newton meter as the SI unit of moment of force, and this site does not convert either figure.',
    ],
    sources: ['iec62841', 'bipmSi', 'nist811Ch4'],
  },
  {
    slug: 'the-screwdriver-set',
    title: 'The screwdriver set',
    phrase: 'The screwdriver set, its bit tips and its single powered entry',
    metaDescription:
      'What a screwdriver set is by its listings: bit profiles, steel names, a torque range, a device list the site does not confirm, and one battery screwdriver.',
    category: 'screwdrivers',
    drive: 'your-hand',
    wearPointSlug: 'the-bit-tip',
    whatItIs:
      'A handle with bits, a set of fixed drivers, or a ratchet or torque driver. All {w:cat-screwdrivers} listings in Screwdriver Sets name a bit or a tip.',
    whyThisWearPoint:
      'The bit tip is the one wear point every listing in this category names. The listings differ in how they describe it: by profile, by steel, by magnet or by count.',
    driveNote:
      'Driven by hand, with {w:screwdrivers-battery} exception: a battery screwdriver filed among the hand sets, whose card carries a note.',
    missingFigure: 'a hardness figure for any bit',
    notes: [
      'ISO 8764-1 specifies driver tips for cross-recessed screws in the forms PH and PZ. ISO 10664 specifies the hexalobular socket used by screws. ISO 6789-1 sets requirements and conformance tests for hand torque tools.',
      'Where a listing names laptops, phones, consoles or a doorbell, it is the seller’s wording. This site does not confirm that any bit fits any device and does not describe opening one.',
    ],
    sources: ['iso8764', 'iso10664', 'iso6789'],
  },
  {
    slug: 'the-weeder',
    title: 'The weeder',
    phrase: 'The manual weeder, its claws and heads, and no printed figures',
    metaDescription:
      'What a manual weeder is by its listings: claws, a cast head or a blade described in words, materials named without grades, and no measurement printed at all.',
    category: 'weeders',
    drive: 'your-hand',
    wearPointSlug: 'the-claw-and-tine',
    whatItIs:
      'A hand tool with a working end that goes into the ground: claws on a long handle, or a short head or blade. By their listings, weeders are described in words and never in figures.',
    whyThisWearPoint:
      'Claws and heads are what most weeder listings here name, and each names what they are made of. The bladed crack weeder is counted under the blade edge instead.',
    driveNote: 'Driven by hand. No weeder listing in this catalog states a motor, a battery or a voltage.',
    missingFigure: 'any figure at all: length, weight or claw depth',
    notes: [
      'Materials named on these listings include stainless steel, which ASTM A240 and ISO 15510 cover, and cast aluminum, which ASTM B26 covers for sand castings. No listing names a grade or a specification.',
      'This site describes what weeder listings state. It does not describe how weeds are removed.',
    ],
    sources: ['astmA240', 'iso15510', 'astmB26'],
  },
  {
    slug: 'the-sprinkler',
    title: 'The sprinkler',
    phrase: 'The sprinkler, its printed coverage and the pressure left off',
    metaDescription:
      'What a sprinkler listing prints and leaves off: coverage in square feet on a few, a range and a flow on one, and water pressure on none of them in this catalog.',
    category: 'sprinklers',
    drive: 'your-water-supply',
    wearPointSlug: 'the-nozzle-and-filter',
    whatItIs:
      'A head that spreads water from a hose or, for the Hunter rotor head, from an installed irrigation system. The listings describe how it moves: oscillating, rotating, impact or gear-drive.',
    whyThisWearPoint:
      'Nozzles and filters are where the water leaves, and they are named by as many sprinkler listings here as the drive is. This site files the sprinkler under the nozzle and filter and prints both counts.',
    driveNote:
      'Driven by the water supply. {W:garden-motor-word} sprinkler listings print the word motor, and none of them states a battery, a voltage or a cord.',
    missingFigure: 'the water pressure behind the coverage figure',
    notes: [
      'Of the {w:cat-sprinklers} sprinkler listings, {w:sprinklers-area} print a coverage area in square feet and {w:sprinklers-range} prints a range in feet. {Z:sprinklers-pressure} prints a water pressure. The Orbit tripod listing prints the word pressure inside a nozzle description, with no figure.',
      'EPA WaterSense notes that pressure above what a spray nozzle is designed for can cause excessive flow, misting and uneven coverage, and its specification for spray sprinkler bodies covers bodies with built-in pressure regulation. ISO 15886-3 sets test methods for sprinkler water distribution.',
      'The Hunter rotor head is a head for an installed irrigation system, not a hose sprinkler. This site does not describe how it is installed or connected.',
    ],
    sources: ['epaSsbPage', 'epaSsbSpec', 'iso15886'],
  },
  {
    slug: 'the-pruner',
    title: 'The pruner',
    phrase: 'The pruner and garden scissors, their blades and replaceable parts',
    metaDescription:
      'What a pruner listing states: the blade action, a length, a cut capacity once, and the one listing in the catalog that says its parts can be replaced.',
    category: 'pruners',
    drive: 'your-hand',
    wearPointSlug: 'the-blade-edge',
    whatItIs:
      'Bypass pruners and straight-blade snips, closed by hand. All {w:cat-pruners} listings in this category name a blade.',
    whyThisWearPoint:
      'The blade edge is the only wear point a pruner listing here names, and every one of them names it. What differs is whether the listing says anything about replacing it.',
    driveNote: 'Driven by hand. No pruner listing in this catalog states a motor, a battery or a voltage.',
    missingFigure: 'a cut capacity, printed by {w:pruners-cut} of them',
    notes: [
      'Penn State Extension describes bypass blades as passing each other like scissors, and an anvil blade as closing against a blunt platform. All the bypass pruners here say bypass in their listings.',
      'Hardness is measured by published test methods such as ASTM E18. No pruner listing here prints a hardness figure, and this site does not estimate one.',
    ],
    sources: ['psuPruners', 'astmE18', 'iso6508'],
  },
]

export function toolTypeBySlug(slug: string): ToolType {
  const t = toolTypes.find((x) => x.slug === slug)
  if (!t) throw new Error(`No tool type ${slug}`)
  return t
}
