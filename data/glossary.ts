export interface Term {
  slug: string
  term: string
  definition: string
  /** Internal paths rendered with PageLink (R13). */
  links: string[]
}

export const glossary: Term[] = [
  {
    slug: 'wear-point',
    term: 'wear point',
    definition:
      'The part of a tool this site files it under: the part a listing would have to describe for a reader to know what gets replaced. The site counts {w:wear-points} of them.',
    links: ['/wear-points'],
  },
  {
    slug: 'consumable',
    term: 'consumable',
    definition:
      'A part sold to be used up and bought again. In this catalog the plainest case is the Klein Tools crimp tool listing, which ships with a counted pack of plugs.',
    links: ['/gear/tool-sets'],
  },
  {
    slug: 'bit-tip',
    term: 'bit tip',
    definition:
      'The working end of a screwdriver bit or a fixed driver. ISO 8764-1 specifies driver tips for cross-recessed screws in the forms PH and PZ.',
    links: ['/wear-points/the-bit-tip'],
  },
  {
    slug: 's2-steel',
    term: 'S2 steel',
    definition:
      'A tool steel designation printed on {w:mat-s2-steel} listings in this catalog. A trade publisher groups it with the shock-resisting tool steels.',
    links: ['/materials/s2-steel'],
  },
  {
    slug: 'hardness',
    term: 'hardness',
    definition:
      'A measured property of a metal, reported through a published test method such as the Rockwell test in ISO 6508-1 or ASTM E18. The count of listings in this catalog printing a hardness figure is {z:hardness-figure}.',
    links: ['/wear-points/the-blade-edge'],
  },
  {
    slug: 'bypass-pruner',
    term: 'bypass pruner',
    definition:
      'A pruner whose blades pass each other like scissors, as Penn State Extension describes it. The bypass pruners in this catalog each print the word bypass.',
    links: ['/tool-types/the-pruner', '/glossary#anvil-pruner'],
  },
  {
    slug: 'anvil-pruner',
    term: 'anvil pruner',
    definition:
      'A pruner with a single blade that closes against a blunt, flat surface, in Penn State Extension’s description. The pruner listings in this catalog describe bypass and straight blades rather than an anvil.',
    links: ['/glossary#bypass-pruner'],
  },
  {
    slug: 'cut-capacity',
    term: 'cut capacity',
    definition:
      'The largest stem size a pruner listing says the tool is sold to cut, printed as a fraction of an inch. The count of pruner listings printing one is {w:pruners-cut}.',
    links: ['/gear/pruners'],
  },
  {
    slug: 'micro-tip-snips',
    term: 'micro-tip snips',
    definition:
      'Snips described by their listing as having micro-tip blades. In this catalog the term is printed by the Fiskars micro-tip listing, filed among straight-blade snips.',
    links: ['/gear/pruners'],
  },
  {
    slug: 'keyless-chuck',
    term: 'keyless chuck',
    definition:
      'A drill chuck named on drill listings as needing no separate key. {W:field-drills-statedChuck} drill listings here name one, each with the same printed size.',
    links: ['/wear-points/the-chuck-and-drive'],
  },
  {
    slug: 'torque',
    term: 'torque',
    definition:
      'A turning force, printed on listings as a figure with a unit. Listings in this catalog print it in newton meters or inch-pounds, and this site does not convert between them.',
    links: ['/wear-points/the-chuck-and-drive', '/glossary#newton-meter'],
  },
  {
    slug: 'in-lb',
    term: 'in-lb',
    definition:
      'Inch-pound, a US customary unit printed with torque figures. {W:torque-in-lb} listings in this catalog print torque this way, a drill and a torque screwdriver.',
    links: ['/tool-types/the-screwdriver-set'],
  },
  {
    slug: 'newton-meter',
    term: 'newton meter',
    definition:
      'The SI unit of moment of force, as NIST Special Publication 811 gives it. The count of listings in this catalog printing torque in newton meters is {w:torque-nm}.',
    links: ['/tool-types/the-cordless-drill'],
  },
  {
    slug: 'variable-speed',
    term: 'variable speed',
    definition:
      'A drill listing phrase for speed that is not fixed at a single setting. This site reports the phrase as printed and does not describe drilling.',
    links: ['/gear/drills'],
  },
  {
    slug: 'amp-hour',
    term: 'amp hour',
    definition:
      'A unit printed on battery listings as a capacity. It is not an SI unit. The count of listings in this catalog printing one is {w:amp-hours}.',
    links: ['/wear-points/the-battery'],
  },
  {
    slug: 'oscillating-sprinkler',
    term: 'oscillating sprinkler',
    definition:
      'A sprinkler type named in its listing title. {W:sub-sprinklers-oscillating} listings in this catalog are filed under it, and both print a coverage area.',
    links: ['/gear/sprinklers'],
  },
  {
    slug: 'impact-sprinkler',
    term: 'impact sprinkler',
    definition:
      'A sprinkler type named in the Orbit tripod listing, which this catalog files with rotating sprinklers on a base. It is also the only sprinkler listing that prints the word pressure.',
    links: ['/gear/sprinklers'],
  },
  {
    slug: 'rotor-head',
    term: 'rotor head',
    definition:
      'A sprinkler head made for an installed irrigation system rather than a hose. {W:misfiled-sprinklers} listing in this catalog is a rotor head of that kind, the Hunter PGP-ADJ, filed among hose sprinklers.',
    links: ['/tool-types/the-sprinkler'],
  },
  {
    slug: 'pop-up',
    term: 'pop-up',
    definition:
      'A term printed with a height on the Hunter rotor head listing. This site reports it as printed and does not describe installation.',
    links: ['/glossary#rotor-head'],
  },
  {
    slug: 'gpm',
    term: 'GPM',
    definition:
      'Gallons per minute, a flow figure. The count of sprinkler listings printing a flow in GPM is {w:sprinklers-flow}.',
    links: ['/gear/sprinklers'],
  },
  {
    slug: 'water-pressure',
    term: 'water pressure',
    definition:
      'The pressure of the water feeding a sprinkler. EPA WaterSense notes that pressure above what a spray nozzle is designed for can cause misting and uneven coverage. Of the {w:cat-sprinklers} sprinkler listings in this catalog, {z:sprinklers-pressure} prints it.',
    links: ['/wear-points/the-nozzle-and-filter', '/drive-check'],
  },
  {
    slug: 'crimp-tool',
    term: 'crimp tool',
    definition:
      'A hand tool sold to join a connector to a cable. The Klein Tools listing in this catalog is a data cable crimp tool filed among household kits; this site does not describe crimping.',
    links: ['/gear/tool-sets', '/glossary#rj45-plug'],
  },
  {
    slug: 'rj45-plug',
    term: 'RJ45 plug',
    definition:
      'A data cable connector named in the Klein Tools crimp tool title. The listing ships a counted pack of CAT6 plugs, the one consumable count in this catalog.',
    links: ['/glossary#crimp-tool'],
  },
  {
    slug: 'ratchet',
    term: 'ratchet',
    definition:
      'A mechanism named on wrenches, screwdriver handles and a crimp tool in this catalog. This site files it under the chuck and drive.',
    links: ['/wear-points/the-chuck-and-drive'],
  },
]
