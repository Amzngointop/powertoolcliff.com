import type { Source } from './types.ts'

/*
 * Every URL here was fetched with a GET request on 2026-09-11. iso.org,
 * cpsc.gov and the Accuris store answer scripted requests with 403, so those
 * were opened and read in a browser; see the audit report.
 */
export const SOURCES = {
  cpscRecalls: {
    label: 'Recalls & Product Safety Warnings',
    publisher: 'U.S. Consumer Product Safety Commission',
    url: 'https://www.cpsc.gov/Recalls',
  },
  bipmSi: {
    label: 'The International System of Units (SI Brochure), 9th edition',
    publisher: 'BIPM',
    url: 'https://www.bipm.org/en/publications/si-brochure',
  },
  nist811Ch4: {
    label: 'NIST Guide to the SI, Chapter 4: The Two Classes of SI Units and the SI Prefixes',
    publisher: 'NIST Special Publication 811',
    url: 'https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-4-two-classes-si-units-and-si-prefixes',
  },
  nist811Ch5: {
    label: 'NIST Guide to the SI, Chapter 5: Units Outside the SI',
    publisher: 'NIST Special Publication 811',
    url: 'https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-5-units-outside-si',
  },
  astmA681: {
    label: 'ASTM A681, Standard Specification for Tool Steels Alloy',
    publisher: 'ASTM International',
    url: 'https://store.astm.org/a0681-24.html',
  },
  azomS2: {
    label: 'S2 Tool Steel – Shock-Resisting Steel (UNS T41902)',
    publisher: 'AZoM, a trade publisher',
    url: 'https://www.azom.com/article.aspx?ArticleID=6246',
  },
  astmA941: {
    label: 'ASTM A941, Terminology Relating to Steel, Stainless Steel, Related Alloys, and Ferroalloys',
    publisher: 'ASTM International',
    url: 'https://store.astm.org/a0941-22a.html',
  },
  iso15510: {
    label: 'ISO 15510, Stainless steels — Chemical composition',
    publisher: 'ISO',
    url: 'https://www.iso.org/standard/61187.html',
  },
  itehEn10088: {
    label: 'SIST EN 10088-1:2015 preview (adoption of EN 10088-1:2014), clause 3.1',
    publisher: 'iTeh Standards, a reseller',
    url: 'https://cdn.standards.iteh.ai/samples/36733/4fe62475f3e74d1bb453b2b231b16010/SIST-EN-10088-1-2015.pdf',
  },
  bsiEn10088: {
    label: 'BS EN 10088-1, Stainless steels. List of stainless steels',
    publisher: 'BSI',
    url: 'https://knowledge.bsigroup.com/products/stainless-steels-list-of-stainless-steels-3',
  },
  astmA240: {
    label: 'ASTM A240/A240M, Chromium and Chromium-Nickel Stainless Steel Plate, Sheet, and Strip',
    publisher: 'ASTM International',
    url: 'https://store.astm.org/a0240_a0240m-26.html',
  },
  iso1173: {
    label: 'ISO 1173, Drive ends for hand- and machine-operated screwdriver bits and connecting parts',
    publisher: 'ISO',
    url: 'https://www.iso.org/standard/23588.html',
  },
  iso8764: {
    label: 'ISO 8764-1, Screwdrivers for cross-recessed head screws — Part 1: Driver tips',
    publisher: 'ISO',
    url: 'https://www.iso.org/standard/37562.html',
  },
  iso10664: {
    label: 'ISO 10664, Hexalobular internal driving feature for bolts and screws',
    publisher: 'ISO',
    url: 'https://www.iso.org/standard/63207.html',
  },
  iso1174: {
    label: 'ISO 1174-1, Driving squares — Part 1: Driving squares for hand socket tools',
    publisher: 'ISO',
    url: 'https://www.iso.org/standard/53384.html',
  },
  iso6789: {
    label: 'ISO 6789-1, Hand torque tools — Part 1: Requirements and methods for conformance testing',
    publisher: 'ISO',
    url: 'https://www.iso.org/standard/62549.html',
  },
  iso6508: {
    label: 'ISO 6508-1, Metallic materials — Rockwell hardness test — Part 1: Test method',
    publisher: 'ISO',
    url: 'https://www.iso.org/standard/84343.html',
  },
  astmE18: {
    label: 'ASTM E18, Standard Test Methods for Rockwell Hardness of Metallic Materials',
    publisher: 'ASTM International',
    url: 'https://store.astm.org/e0018-25.html',
  },
  epaSsbPage: {
    label: 'Spray Sprinkler Bodies',
    publisher: 'U.S. EPA WaterSense',
    url: 'https://www.epa.gov/watersense/spray-sprinkler-bodies',
  },
  epaSsbSpec: {
    label: 'WaterSense Specification for Spray Sprinkler Bodies, Version 1.0',
    publisher: 'U.S. EPA WaterSense',
    url: 'https://www.epa.gov/sites/default/files/2017-09/documents/ws-products-spec-ssb.pdf',
  },
  iso15886: {
    label: 'ISO 15886-3, Agricultural irrigation equipment — Sprinklers — Part 3: Characterization of distribution and test methods',
    publisher: 'ISO',
    url: 'https://www.iso.org/standard/78122.html',
  },
  tia568: {
    label: 'TIA Publishes New Standards: ANSI/TIA-568.2-E and ANSI/TIA-568.5-1',
    publisher: 'Telecommunications Industry Association',
    url: 'https://tiaonline.org/standardannouncement/tia-publishes-new-standards-ansi-tia-568-2-e-and-ansi-tia-568-5-1/',
  },
  ftcSubstantiation: {
    label: 'FTC Policy Statement Regarding Advertising Substantiation',
    publisher: 'Federal Trade Commission',
    url: 'https://www.ftc.gov/legal-library/browse/ftc-policy-statement-regarding-advertising-substantiation',
  },
  ftcNixingTheFix: {
    label: 'Nixing the Fix: An FTC Report to Congress on Repair Restrictions',
    publisher: 'Federal Trade Commission',
    url: 'https://www.ftc.gov/reports/nixing-fix-ftc-report-congress-repair-restrictions',
  },
  psuPruners: {
    label: 'Using the Right Tool is Self-Care',
    publisher: 'Penn State Extension',
    url: 'https://extension.psu.edu/using-the-right-tool-is-self-care',
  },
  iec62841: {
    label: 'IEC 62841-2-1, Particular requirements for hand-held drills and impact drills',
    publisher: 'IEC',
    url: 'https://webstore.iec.ch/en/publication/27770',
  },
  astmB26: {
    label: 'ASTM B26/B26M, Standard Specification for Aluminum-Alloy Sand Castings',
    publisher: 'ASTM International',
    url: 'https://store.astm.org/b0026_b0026m-25.html',
  },
} satisfies Record<string, Source>

export type SourceId = keyof typeof SOURCES

/** Figures taken from a published document, used through {f:key} so prose never types a digit. */
export const FACTS: Record<string, string> = {
  'en10088-chromium': '10.5 percent',
  'en10088-carbon': '1.2 percent',
  'en10088-edition': '2014',
  'ssb-spec-date': 'September 2017',
  'nixing-date': 'May 2021',
}

export function sourcesFor(ids: SourceId[]): Source[] {
  return ids.map((id) => {
    const s = SOURCES[id]
    if (!s) throw new Error(`Unknown source ${id}`)
    return s
  })
}
