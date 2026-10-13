import type { CartState, OrderItem } from './types';

/**
 * COP currency formatting and pure cart math (DD-05, RF-005).
 *
 * Prices are fictitious demo values; every place that renders them also shows a
 * demo notice.
 */

const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/** Formats an illustrative value in Colombian pesos (COP). */
export function formatCop(value: number): string {
  return copFormatter.format(value);
}

/** Line subtotal: demo unit price times quantity (RF-005, CA-012). */
export function lineSubtotal(item: Pick<OrderItem, 'priceCop' | 'quantity'>): number {
  return item.priceCop * item.quantity;
}

/** Order total: sum of every line subtotal (RF-005, CA-012). */
export function cartTotal(state: CartState): number {
  return state.items.reduce((total, item) => total + lineSubtotal(item), 0);
}
