import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { cafes } from '../src/data/cafes';

/**
 * Markup-level acceptance checks over the real static build output
 * (CA-001, CA-002, CA-005, CA-029, CA-031, CA-033, CA-039, CA-040, CA-041,
 * CA-042, DD-16).
 *
 * These tests require a fresh `npm run build`; they read `dist/` and fail
 * loudly when a page is missing.
 */

const DIST = join(process.cwd(), 'dist');

function read(page: string): string {
  const path = join(DIST, page);
  if (!existsSync(path)) throw new Error(`Missing built page: ${path}`);
  return readFileSync(path, 'utf8');
}

describe('built home page (dist/index.html)', () => {
  const html = read('index.html');

  it('declares lang="es" (D-10)', () => {
    expect(html).toMatch(/<html lang="es">/);
  });

  it('renders a full-data catalog grid (RF-001)', () => {
    for (const cafe of cafes) {
      expect(html).toContain(`data-cafe-id="${cafe.id}"`);
    }
  });

  it('exposes the search input and the three filter axes (RF-002, DD-16)', () => {
    expect(html).toContain('data-search');
    expect(html).toContain('data-filter="region"');
    expect(html).toContain('data-filter="roast"');
    expect(html).toContain('data-filter="process"');
  });

  it('renders local original images with meaningful alt text (CA-001, CA-031)', () => {
    for (const cafe of cafes) {
      expect(html).toContain(`src="${cafe.image}"`);
      expect(html).toContain(`Ilustración original de demostración de ${cafe.name}.`);
    }
  });

  it('lazy-loads every below-the-fold image (8 cards + origin) (CA-029)', () => {
    const lazyCount = (html.match(/loading="lazy"/g) ?? []).length;
    expect(lazyCount).toBe(cafes.length + 1);
  });

  it('keeps the hero illustration eager and decorative (CA-029)', () => {
    const hero = html.match(/<img[^>]*src="\/images\/hero\.svg"[^>]*>/)?.[0] ?? '';
    expect(hero).toContain('alt=""');
    expect(hero).not.toContain('loading="lazy"');
  });

  it('includes skip link, social meta, theme-color and noscript (CA-033, CA-039)', () => {
    expect(html).toContain('Saltar al contenido');
    expect(html).toContain('og:title');
    expect(html).toContain('twitter:card');
    expect(html).toContain('name="theme-color"');
    expect(html).toContain('<noscript>');
  });
});

describe('built detail pages (dist/cafes/<id>/index.html)', () => {
  for (const cafe of cafes) {
    describe(cafe.id, () => {
      const html = read(`cafes/${cafe.id}/index.html`);

      it('shows the café image with alt and intrinsic dimensions (CA-031, CA-041)', () => {
        expect(html).toContain(`src="${cafe.image}"`);
        expect(html).toContain(`Ilustración original de demostración de ${cafe.name}.`);
        expect(html).toContain('width="320"');
        expect(html).toContain('height="240"');
      });

      it('keeps the main image eager because it is above the fold (CA-029)', () => {
        const img = html.match(/<img[^>]*src="\/images\/cafe-[^"]*"[^>]*>/)?.[0] ?? '';
        expect(img).not.toContain('loading="lazy"');
      });

      it('always shows demo disclaimers (RF-010)', () => {
        expect(html).toContain('Notas de cata (demo)');
        expect(html).toContain('demo');
      });
    });
  }
});

describe('built 404 page (CA-041, CA-042)', () => {
  it('is generated as dist/404.html with a way back', () => {
    const html = read('404.html');
    expect(html).toContain('Página no encontrada');
    expect(html).toContain('Volver al catálogo');
  });
});