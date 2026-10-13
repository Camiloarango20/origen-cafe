import { cafes } from '../data/cafes';
import type { CartState, OrderItem } from './types';

/**
 * Cart state singleton (DD-02, DD-03, DD-13, RF-004).
 *
 * Responsibilities:
 *  1. Hold the mutable in-memory cart state and notify subscribers.
 *  2. Persist the cart to `localStorage` under a project-owned, versioned key.
 *  3. Validate stored data on load and recover safely from any corruption:
 *     invalid JSON -> empty cart; invalid items -> dropped; unsupported
 *     version -> safe reset; storage unavailable -> in-memory mode (retried on
 *     every mutation). This module never throws.
 *
 * No network access: persistence is limited to localStorage (RNF-009).
 */

/** Project-owned localStorage key (versioned schema). */
export const CART_STORAGE_KEY = 'origen-cafe:cart:v1';

/** Supported persisted schema version (DD-13). */
export const CART_SCHEMA_VERSION = 1;

type Listener = (state: CartState) => void;

interface PersistedCart {
  version: number;
  items: OrderItem[];
}

const knownCafeIds = new Set<string>(cafes.map((cafe) => cafe.id));
const priceById = new Map<string, number>(cafes.map((cafe) => [cafe.id, cafe.priceCop]));

let state: CartState = { items: [] };
const listeners = new Set<Listener>();

function cloneState(current: CartState): CartState {
  return { items: current.items.map((item) => ({ ...item })) };
}

function isValidQuantity(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1;
}

function isValidPrice(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function sanitizeItem(value: unknown): OrderItem | null {
  if (typeof value !== 'object' || value === null) return null;
  const candidate = value as Record<string, unknown>;
  const { cafeId, quantity, priceCop } = candidate;

  // Drop items whose id is missing, of the wrong type, or unknown to the
  // current catalog (CA-047).
  if (typeof cafeId !== 'string' || !knownCafeIds.has(cafeId)) return null;
  if (!isValidQuantity(quantity)) return null;
  if (!isValidPrice(priceCop)) return null;

  return { cafeId, quantity, priceCop };
}

function sanitizeItems(rawItems: unknown): OrderItem[] {
  if (!Array.isArray(rawItems)) return [];

  const byId = new Map<string, OrderItem>();
  for (const entry of rawItems) {
    const item = sanitizeItem(entry);
    if (!item) continue;
    const existing = byId.get(item.cafeId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      byId.set(item.cafeId, item);
    }
  }
  return Array.from(byId.values());
}

function parseStored(raw: string): CartState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Invalid JSON -> empty cart, no error surfaced (CA-046).
    return { items: [] };
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { items: [] };
  }

  const record = parsed as Record<string, unknown>;

  // Unsupported schema version -> safe reset (CA-050).
  if (record.version !== CART_SCHEMA_VERSION) {
    return { items: [] };
  }

  return { items: sanitizeItems(record.items) };
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    // Storage unavailable (blocked, private mode, ...) -> in-memory mode.
    return null;
  }
}

function persist(): void {
  const payload: PersistedCart = { version: CART_SCHEMA_VERSION, items: state.items };
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // In-memory fallback: ignore the failure and retry on the next mutation
    // (CA-048).
  }
}

function notify(): void {
  const snapshot = cloneState(state);
  for (const listener of listeners) {
    listener(snapshot);
  }
}

function commit(): void {
  notify();
  persist();
}

function normalizeQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.floor(quantity));
}

/** Reads, validates and publishes the stored cart (called on hydrate). */
export function load(): void {
  const raw = readRaw();
  state = raw ? parseStored(raw) : { items: [] };
  // Rewrite the sanitized state so corrupt or outdated data is cleaned up.
  persist();
  notify();
}

/** Adds a catalog item, or increases the quantity of an existing line. */
export function add(cafeId: string, quantity = 1): void {
  if (!knownCafeIds.has(cafeId)) return;
  const amount = normalizeQuantity(quantity);
  const existing = state.items.find((item) => item.cafeId === cafeId);

  if (existing) {
    state = {
      items: state.items.map((item) =>
        item.cafeId === cafeId ? { ...item, quantity: item.quantity + amount } : item,
      ),
    };
  } else {
    const priceCop = priceById.get(cafeId) ?? 0;
    state = { items: [...state.items, { cafeId, quantity: amount, priceCop }] };
  }

  commit();
}

/** Removes a line entirely (CA-009). */
export function remove(cafeId: string): void {
  const next = state.items.filter((item) => item.cafeId !== cafeId);
  if (next.length === state.items.length) return;
  state = { items: next };
  commit();
}

/** Sets a line quantity, clamped to >= 1 (CA-010). */
export function setQuantity(cafeId: string, quantity: number): void {
  if (!state.items.some((item) => item.cafeId === cafeId)) return;
  const amount = normalizeQuantity(quantity);
  state = {
    items: state.items.map((item) =>
      item.cafeId === cafeId ? { ...item, quantity: amount } : item,
    ),
  };
  commit();
}

/** Empties the cart and persists the empty state (RF-006, CA-016). */
export function clear(): void {
  state = { items: [] };
  commit();
}

/** Returns a defensive copy of the current state. */
export function getState(): CartState {
  return cloneState(state);
}

/** Registers a change listener and returns an unsubscribe function. */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
