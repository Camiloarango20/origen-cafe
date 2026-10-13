/**
 * Shared domain types for the Origen Café demo catalog.
 *
 * All values represented by these types are fictitious (demonstration only).
 * Identifiers are in English; user-visible copy (produced by the components)
 * is in Spanish, per the project language contract.
 */

/** Fictional coffee-growing region used by the catalog filters (RF-002). */
export type Region = 'norte-demo' | 'sur-demo' | 'centro-demo' | 'oriente-demo';

/** Roast profile used by the catalog filters (RF-002). */
export type RoastProfile = 'claro' | 'medio' | 'oscuro';

/** Process method used by the catalog filters (RF-002). */
export type ProcessMethod = 'lavado' | 'natural' | 'honey';

/** A fictitious demo coffee entry (RF-001, DD-04). */
export interface Cafe {
  /** Stable, slug-friendly identifier, e.g. "etiopia-yirgacheffe-demo". */
  id: string;
  /** Visible (fictitious) name. */
  name: string;
  /** Fictional region (RF-002). */
  region: Region;
  /** Roast profile (RF-002). */
  roast: RoastProfile;
  /** Process method (RF-002). */
  process: ProcessMethod;
  /** Fictitious tasting notes. */
  notes: string[];
  /** Illustrative demo price in COP (D-16). */
  priceCop: number;
  /** Fictitious description. */
  description: string;
  /** Local, original SVG illustration path (DD-15), e.g. "/images/cafe-<id>.svg". */
  image?: string;
}

/** A single line of the simulated order. */
export interface OrderItem {
  /** Reference to a known catalog id. */
  cafeId: string;
  /** Integer >= 1 (CA-010). */
  quantity: number;
  /** Snapshot of the demo price captured when the item was added (RF-005). */
  priceCop: number;
}

/** In-memory cart state (serialized as a versioned schema in localStorage). */
export interface CartState {
  items: OrderItem[];
}

/** Combinable catalog filters; every axis is optional (empty = no filtering). */
export interface CatalogFilters {
  region?: Region;
  roast?: RoastProfile;
  process?: ProcessMethod;
  /** Free-text search term (DD-16); accents and case are ignored. */
  query?: string;
}
