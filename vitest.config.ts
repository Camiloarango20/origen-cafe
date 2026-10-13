import { defineConfig } from 'vitest/config';

/**
 * Minimal test runner configuration (DD-17).
 *
 * `jsdom` provides a DOM so the shared client island can be exercised without a
 * real browser; the pure modules (`catalog-filters`, `format`, `cart-store`) run
 * under the same environment. Tests live in `tests/` and import the production
 * sources directly — no test-only copies of the logic.
 */
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    restoreMocks: true,
  },
});
