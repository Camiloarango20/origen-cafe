import { beforeEach, describe, expect, it, vi } from 'vitest';

import { cafes } from '../src/data/cafes';
import {
  add,
  CART_SCHEMA_VERSION,
  CART_STORAGE_KEY,
  clear,
  getState,
  load,
  remove,
  setQuantity,
  subscribe,
} from '../src/lib/cart-store';

/**
 * Cart state, persistence and safe recovery (RF-004, RF-006, CA-009, CA-010,
 * CA-011, CA-016, CA-046, CA-047, CA-048, CA-050, DD-13).
 * Provided by the module singleton in `src/lib/cart-store.ts`.
 */

const FIRST = cafes[0]!;
const SECOND = cafes[1]!;

interface StoredPayload {
  version?: number;
  items?: unknown[];
}

function stored(): StoredPayload | null {
  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as StoredPayload;
  } catch {
    return null;
  }
}

beforeEach(() => {
  window.localStorage.clear();
  load();
});

describe('add (RF-004, CA-010)', () => {
  it('adds a line with the catalog snapshot price', () => {
    add(FIRST.id);
    expect(getState().items).toEqual([{ cafeId: FIRST.id, quantity: 1, priceCop: FIRST.priceCop }]);
  });

  it('increments the quantity when the same id is added again', () => {
    add(FIRST.id);
    add(FIRST.id, 2);
    expect(getState().items).toHaveLength(1);
    expect(getState().items[0]?.quantity).toBe(3);
  });

  it('ignores unknown ids', () => {
    add('no-existe');
    expect(getState().items).toHaveLength(0);
  });
});

describe('quantity handling (CA-010)', () => {
  it('clamps setQuantity to >= 1', () => {
    add(FIRST.id, 3);
    setQuantity(FIRST.id, 0);
    expect(getState().items[0]?.quantity).toBe(1);
  });

  it('ignores setQuantity for ids that are not in the cart', () => {
    setQuantity(FIRST.id, 5);
    expect(getState().items).toHaveLength(0);
  });

  it('normalizes non-finite quantities to 1', () => {
    add(SECOND.id);
    setQuantity(SECOND.id, Number.NaN);
    expect(getState().items[0]?.quantity).toBe(1);
  });
});

describe('remove and clear (CA-009, CA-016)', () => {
  it('removes a single line and keeps the rest', () => {
    add(FIRST.id);
    add(SECOND.id);
    remove(FIRST.id);
    expect(getState().items.map((item) => item.cafeId)).toEqual([SECOND.id]);
  });

  it('removing an absent id is a no-op', () => {
    add(FIRST.id);
    remove(SECOND.id);
    expect(getState().items).toHaveLength(1);
  });

  it('clear empties the cart and persists the empty state', () => {
    add(FIRST.id);
    clear();
    expect(getState().items).toHaveLength(0);
    expect(stored()?.items).toEqual([]);
  });
});

describe('persistence and safe recovery (CA-011, CA-046, CA-047, CA-048, CA-050, DD-13)', () => {
  it('persists a versioned payload on mutation', () => {
    add(FIRST.id);
    const payload = stored();
    expect(payload?.version).toBe(CART_SCHEMA_VERSION);
    expect(payload?.items).toHaveLength(1);
  });

  it('loads a valid stored cart', () => {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        version: CART_SCHEMA_VERSION,
        items: [{ cafeId: FIRST.id, quantity: 2, priceCop: FIRST.priceCop }],
      }),
    );
    load();
    expect(getState().items[0]?.quantity).toBe(2);
  });

  it('recovers from invalid JSON with an empty cart', () => {
    window.localStorage.setItem(CART_STORAGE_KEY, '{rotto');
    load();
    expect(getState().items).toHaveLength(0);
  });

  it('drops invalid items, unknown ids and bare entries', () => {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        version: CART_SCHEMA_VERSION,
        items: [
          { cafeId: FIRST.id, quantity: 1, priceCop: FIRST.priceCop },
          { cafeId: 'no-existe', quantity: 1, priceCop: 1 },
          { cafeId: FIRST.id, quantity: 'dos', priceCop: FIRST.priceCop },
          null,
        ],
      }),
    );
    load();
    expect(getState().items).toEqual([{ cafeId: FIRST.id, quantity: 1, priceCop: FIRST.priceCop }]);
  });

  it('resets when the schema version is unsupported', () => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 999, items: [] }));
    load();
    expect(getState().items).toHaveLength(0);
    // The fresh state is rewritten with the supported version.
    expect(stored()?.version).toBe(CART_SCHEMA_VERSION);
  });

  it('runs in-memory when localStorage is unavailable', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage denied');
    });
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage denied');
    });
    try {
      load();
      add(FIRST.id);
      expect(getState().items).toHaveLength(1);
    } finally {
      getItem.mockRestore();
      setItem.mockRestore();
    }
  });
});

describe('subscriptions', () => {
  it('notifies subscribers with a defensive copy on every change', () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    add(FIRST.id);
    expect(listener).toHaveBeenCalledTimes(1);
    const snapshot = listener.mock.calls[0]?.[0] as { items: { quantity: number }[] };
    expect(snapshot.items[0]?.quantity).toBe(1);

    // Mutating the delivered snapshot must not corrupt the real state.
    snapshot.items[0]!.quantity = 99;
    expect(getState().items[0]?.quantity).toBe(1);

    unsubscribe();
    add(SECOND.id);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});