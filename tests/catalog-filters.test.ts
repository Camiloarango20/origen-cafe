import { describe, expect, it } from 'vitest';

import { cafes } from '../src/data/cafes';
import {
  cafeMatchesQuery,
  filterCafes,
  hasActiveFilters,
  isEmptyResult,
  normalizeForSearch,
  processLabel,
  regionLabel,
  roastLabel,
} from '../src/lib/catalog-filters';

/**
 * Combinable filter + search logic (RF-002, CA-002, CA-005, DD-12, DD-16).
 * Provided by the pure module `src/lib/catalog-filters.ts`.
 */

describe('filter axes (RF-002, CA-002)', () => {
  it('returns the full catalog with no active filters', () => {
    expect(filterCafes(cafes, {})).toHaveLength(8);
  });

  it('filters by region', () => {
    expect(filterCafes(cafes, { region: 'sur-demo' }).map((c) => c.id)).toEqual([
      'altos-del-sur-demo',
      'reserva-oscura-demo',
    ]);
  });

  it('filters by roast', () => {
    expect(filterCafes(cafes, { roast: 'oscuro' }).map((c) => c.id)).toEqual([
      'reserva-oscura-demo',
      'planicie-oriente-demo',
    ]);
  });

  it('filters by process', () => {
    expect(filterCafes(cafes, { process: 'natural' }).map((c) => c.id)).toEqual([
      'sierra-oriente-natural-demo',
      'reserva-oscura-demo',
    ]);
  });

  it('combines every axis at once', () => {
    expect(filterCafes(cafes, { region: 'sur-demo', roast: 'oscuro', process: 'natural' }).map((c) => c.id)).toEqual([
      'reserva-oscura-demo',
    ]);
  });

  it('returns an empty result for an impossible combination (CA-005)', () => {
    const results = filterCafes(cafes, { region: 'norte-demo', process: 'natural' });
    expect(isEmptyResult(results)).toBe(true);
  });

  it('the full catalog is not an empty result', () => {
    expect(isEmptyResult(filterCafes(cafes, {}))).toBe(false);
  });
});

describe('free-text search (DD-16, RF-002 extension)', () => {
  it('matches by name with a partial token', () => {
    expect(cafeMatchesQuery(cafes[0]!, 'yirga')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(cafeMatchesQuery(cafes[0]!, 'YIRGACHEFFE')).toBe(true);
  });

  it('is accent-insensitive over tasting notes', () => {
    expect(cafeMatchesQuery(cafes[0]!, 'citrico')).toBe(true); // notes: "cítrico"
  });

  it('matches the Spanish region label used by the UI', () => {
    expect(filterCafes(cafes, { query: 'Norte' }).map((c) => c.id)).toEqual([
      'etiopia-yirgacheffe-demo',
      'costa-floral-demo',
    ]);
  });

  it('combines the query with a filter axis', () => {
    expect(filterCafes(cafes, { region: 'sur-demo', query: 'chocolate' }).map((c) => c.id)).toEqual([
      'reserva-oscura-demo',
    ]);
  });

  it('empty or whitespace-only query matches everything', () => {
    expect(filterCafes(cafes, { query: '' })).toHaveLength(8);
    expect(filterCafes(cafes, { query: '   ' })).toHaveLength(8);
  });

  it('no match yields an empty result', () => {
    expect(filterCafes(cafes, { query: 'zzz-inexistente' })).toHaveLength(0);
  });

  it('undefined query matches everything (read-only safe)', () => {
    expect(filterCafes(cafes, { query: undefined })).toHaveLength(8);
  });
});

describe('helpers', () => {
  it('normalizeForSearch strips accents and lowercases', () => {
    expect(normalizeForSearch('Cítrico ÁÉÍÓÚ')).toBe('citrico aeiou');
  });

  it('hasActiveFilters accounts for the query axis', () => {
    expect(hasActiveFilters({ region: 'sur-demo' })).toBe(true);
    expect(hasActiveFilters({ query: 'cacao' })).toBe(true);
    expect(hasActiveFilters({ query: '   ' })).toBe(false);
    expect(hasActiveFilters({})).toBe(false);
  });

  it('label helpers return the Spanish UI labels', () => {
    expect(regionLabel('norte-demo')).toBe('Norte (demo)');
    expect(roastLabel('claro')).toBe('Claro');
    expect(processLabel('natural')).toBe('Natural');
  });

  it('unknown axis values fall back to the raw value', () => {
    expect(regionLabel('no-existe' as never)).toBe('no-existe');
  });
});