import type { Source, Tender } from './types';

/**
 * Geographic scope of a tender or source, ordered from the most
 * specific (Kenya) to the broadest (global).
 */
export type GeoScope = 'kenya' | 'east_africa' | 'africa' | 'global';

/** Values offered by the region filter. `all` removes the filter. */
export type RegionFilterValue = 'all' | 'africa' | 'east_africa' | 'kenya';

export const SCOPE_RANK: Record<GeoScope, number> = {
  kenya: 0,
  east_africa: 1,
  africa: 2,
  global: 3,
};

export const SCOPE_LABEL: Record<GeoScope, string> = {
  kenya: 'Kenya',
  east_africa: 'East Africa',
  africa: 'Africa-wide',
  global: 'Global',
};

export const EAST_AFRICA_COUNTRIES = [
  'kenya',
  'uganda',
  'tanzania',
  'rwanda',
  'burundi',
  'ethiopia',
  'south sudan',
  'somalia',
  'djibouti',
  'eritrea',
  'democratic republic of the congo',
  'dr congo',
  'drc',
  'east africa',
];

const AFRICA_COUNTRIES = new Set([
  'algeria', 'angola', 'benin', 'botswana', 'burkina faso', 'burundi',
  'cabo verde', 'cameroon', 'central african republic', 'chad', 'comoros',
  'congo', 'democratic republic of the congo', "côte d'ivoire", 'ivory coast',
  'djibouti', 'egypt', 'equatorial guinea', 'eritrea', 'eswatini', 'ethiopia',
  'gabon', 'gambia', 'ghana', 'guinea', 'guinea-bissau', 'kenya', 'lesotho',
  'liberia', 'libya', 'madagascar', 'malawi', 'mali', 'mauritania',
  'mauritius', 'morocco', 'mozambique', 'namibia', 'niger', 'nigeria',
  'rwanda', 'sao tome and principe', 'senegal', 'seychelles', 'sierra leone',
  'somalia', 'south africa', 'south sudan', 'sudan', 'tanzania', 'togo',
  'tunisia', 'uganda', 'zambia', 'zimbabwe',
]);

const EAST_AFRICA_KEYWORDS =
  /(east\s*africa|eastern africa|east african|\beac\b|\bigad\b|uganda|kampala|tanzania|dar es salaam|dodoma|zanzibar|rwanda|kigali|burundi|bujumbura|ethiopia|addis ababa|south sudan|\bjuba\b|somalia|mogadishu|djibouti|eritrea|asmara|\bdrc\b|dr congo|kinshasa)/i;

const PAN_AFRICA_KEYWORDS =
  /(african union|smart africa|\bafdb\b|african development bank|pan-african|pan african|africa-wide|sub-saharan|continental?\b|\buneca\b)/i;

/** Derive the geographic scope of a tender from its free-text fields. */
export function tenderScope(
  t: Pick<Tender, 'region' | 'procurer' | 'title'>,
): GeoScope {
  const text = `${t.region} · ${t.procurer} · ${t.title}`;
  if (PAN_AFRICA_KEYWORDS.test(text)) return 'africa';
  if (EAST_AFRICA_KEYWORDS.test(text)) return 'east_africa';
  return 'kenya';
}

/** Derive the geographic scope of a watchlist source, mostly from country. */
export function sourceScope(
  s: Pick<Source, 'country' | 'name' | 'description'>,
): GeoScope {
  const country = s.country.trim().toLowerCase();
  if (country === 'kenya') return 'kenya';
  if (EAST_AFRICA_COUNTRIES.includes(country)) return 'east_africa';
  if (country === 'africa') return 'africa';
  if (AFRICA_COUNTRIES.has(country)) return 'africa';
  if (country === '' || country === 'global' || country === 'international') {
    return 'global';
  }
  const text = `${s.name} ${s.description}`;
  if (PAN_AFRICA_KEYWORDS.test(text)) return 'africa';
  if (EAST_AFRICA_KEYWORDS.test(text)) return 'east_africa';
  return 'global';
}

/**
 * Hierarchical match: picking "East Africa" includes Kenya-level items,
 * picking "Africa" includes East Africa and Kenya-level items, and so on.
 * Global items only appear under "All regions".
 */
export function matchesRegion(
  scope: GeoScope,
  filter: RegionFilterValue,
): boolean {
  if (filter === 'all') return true;
  return SCOPE_RANK[scope] <= SCOPE_RANK[filter];
}

/** Count how many items each region filter option would return. */
export function regionCounts(
  scopes: GeoScope[],
): Record<RegionFilterValue, number> {
  const counts: Record<RegionFilterValue, number> = {
    all: scopes.length,
    africa: 0,
    east_africa: 0,
    kenya: 0,
  };
  for (const scope of scopes) {
    if (matchesRegion(scope, 'africa')) counts.africa += 1;
    if (matchesRegion(scope, 'east_africa')) counts.east_africa += 1;
    if (matchesRegion(scope, 'kenya')) counts.kenya += 1;
  }
  return counts;
}
