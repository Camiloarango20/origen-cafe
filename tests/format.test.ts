import { describe, expect, it } from 'vitest';

import { cartTotal, formatCop, lineSubtotal } from '../src/lib/format';

/**
 * COP currency formatting and cart math (DD-05, RF-005, CA-008, CA-012).
 * Provided by the pure module `src/lib/format.ts`.
 */

describe('formatCop (CA-008, es-CO currency)', () => {
  it('formats a whole COP amount with thousand separators and no decimals', () => {
    const value = formatCop(42000);
    expect(value).toContain('42.000');
    expect(value).not.toContain(',');
  });

  it('uses the COP currency symbol', () => {
    expect(formatCop(1)).toMatch(/^\$\s*1$/);
  });

  it('rounds decimal input to the same output as its integer part (no decimals)', () => {
    expect(formatCop(1000.49)).toBe(formatCop(1000));
    expect(formatCop(1000.49)).not.toContain(',');
  });

  it('formats a large amount with grouping separators only', () => {
    const value = formatCop(100000000);
    expect(value).toContain('100.000.000');
    expect(value).not.toContain(',');
  });

  it('formats zero without a fractional part', () => {
    expect(formatCop(0)).toMatch(/0$/);
    expect(formatCop(0)).not.toContain(',');
  });
});

describe('lineSubtotal (CA-012)', () => {
  it('multiplies demo unit price by quantity', () => {
    expect(lineSubtotal({ priceCop: 42000, quantity: 2 })).toBe(84000);
  });

  it('is the unit price for a single unit', () => {
    expect(lineSubtotal({ priceCop: 36000, quantity: 1 })).toBe(36000);
  });
});

describe('cartTotal (CA-012)', () => {
  it('sums every line subtotal', () => {
    const state = {
      items: [
        { cafeId: 'a', priceCop: 40000, quantity: 1 },
        { cafeId: 'b', priceCop: 45000, quantity: 2 },
      ],
    };
    expect(cartTotal(state)).toBe(130000);
  });

  it('is zero for an empty cart', () => {
    expect(cartTotal({ items: [] })).toBe(0);
  });
});