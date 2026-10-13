import type { Cafe, CatalogFilters, ProcessMethod, Region, RoastProfile } from './types';

/**
 * Pure, combinable catalog filter logic (DD-12, RF-002, DD-16) plus the
 * option/label metadata the UI needs to render the three filter axes and the
 * free-text search field.
 *
 * Every axis is optional; an absent axis means "no filtering on that axis".
 */

export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

export const REGION_OPTIONS: readonly FilterOption<Region>[] = [
  { value: 'norte-demo', label: 'Norte (demo)' },
  { value: 'sur-demo', label: 'Sur (demo)' },
  { value: 'centro-demo', label: 'Centro (demo)' },
  { value: 'oriente-demo', label: 'Oriente (demo)' },
];

export const ROAST_OPTIONS: readonly FilterOption<RoastProfile>[] = [
  { value: 'claro', label: 'Claro' },
  { value: 'medio', label: 'Medio' },
  { value: 'oscuro', label: 'Oscuro' },
];

export const PROCESS_OPTIONS: readonly FilterOption<ProcessMethod>[] = [
  { value: 'lavado', label: 'Lavado' },
  { value: 'natural', label: 'Natural' },
  { value: 'honey', label: 'Honey' },
];

const regionLabels = new Map<Region, string>(REGION_OPTIONS.map((option) => [option.value, option.label]));
const roastLabels = new Map<RoastProfile, string>(ROAST_OPTIONS.map((option) => [option.value, option.label]));
const processLabels = new Map<ProcessMethod, string>(PROCESS_OPTIONS.map((option) => [option.value, option.label]));

/** Human-readable (Spanish) label for a fictional region. */
export function regionLabel(region: Region): string {
  return regionLabels.get(region) ?? region;
}

/** Human-readable (Spanish) label for a roast profile. */
export function roastLabel(roast: RoastProfile): string {
  return roastLabels.get(roast) ?? roast;
}

/** Human-readable (Spanish) label for a process method. */
export function processLabel(process: ProcessMethod): string {
  return processLabels.get(process) ?? process;
}

/** True when at least one filter axis is set (including a non-empty search query). */
export function hasActiveFilters(filters: CatalogFilters): boolean {
  return Boolean(filters.region || filters.roast || filters.process || filters.query?.trim());
}

/** Normalizes text for accent- and case-insensitive search matching (DD-16). */
export function normalizeForSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * True when the café matches a free-text query over its name, description,
 * tasting notes and axis labels. An empty or whitespace-only query matches
 * every café.
 */
export function cafeMatchesQuery(cafe: Cafe, query: string | undefined): boolean {
  const needle = normalizeForSearch(query ?? '')
    .trim()
    .replace(/\s+/g, ' ');
  if (needle.length === 0) return true;
  const haystack = normalizeForSearch(
    [
      cafe.name,
      cafe.description,
      ...cafe.notes,
      regionLabel(cafe.region),
      roastLabel(cafe.roast),
      processLabel(cafe.process),
    ].join(' '),
  );
  return haystack.includes(needle);
}

/**
 * Returns the catalog entries that match every provided axis. With no active
 * filters, the full catalog is returned unchanged.
 */
export function filterCafes(catalog: readonly Cafe[], filters: CatalogFilters): Cafe[] {
  return catalog.filter((cafe) => {
    if (filters.region && cafe.region !== filters.region) return false;
    if (filters.roast && cafe.roast !== filters.roast) return false;
    if (filters.process && cafe.process !== filters.process) return false;
    if (filters.query && !cafeMatchesQuery(cafe, filters.query)) return false;
    return true;
  });
}

/** True when a filtered result set has no entries (CA-005). */
export function isEmptyResult(results: readonly Cafe[]): boolean {
  return results.length === 0;
}
