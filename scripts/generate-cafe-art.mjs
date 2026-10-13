/**
 * Original artwork generator for Origen Café (DD-15).
 *
 * Why a generator instead of committed binaries or stock photos:
 *  - No third-party licence can be verified defensibly for an academic delivery,
 *    so every visual is authored here from scratch (plain geometry).
 *  - Deterministic + tiny: the SVGs are a few hundred bytes, scale losslessly and
 *    need no external CDN, no font file and no raster toolchain.
 *
 * Run: `node scripts/generate-cafe-art.mjs`
 * Output: `public/images/*.svg`
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cafes } from '../src/data/cafes.ts';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');

/** Roast-driven bag colours: light -> medium -> dark. */
const ROAST_PALETTE = {
  claro: { bag: '#c39464', fold: '#9a6f45', label: '#fdf8f1', steam: '#c39464' },
  medio: { bag: '#8b5a34', fold: '#66401f', label: '#fdf8f1', steam: '#8b5a34' },
  oscuro: { bag: '#5b3a22', fold: '#3d2415', label: '#f5e9d8', steam: '#5b3a22' },
};

/** Region-driven accent colour, used for the small origin dot. */
const REGION_ACCENT = {
  'norte-demo': '#c8102e',
  'sur-demo': '#2f7a52',
  'centro-demo': '#c98a3c',
  'oriente-demo': '#3f6fa8',
};

const BACKGROUND = '#faf6f1';
const BACKDROP = '#f0e6d9';
const LINE = '#4a2f1a';

function steam(x, y, stroke) {
  return (
    `<path d="M${x} ${y}c6-9 18-9 24 0M${x + 30} ${y}c6-9 18-9 24 0" ` +
    `fill="none" stroke="${stroke}" stroke-width="5" stroke-linecap="round" opacity="0.55"></path>`
  );
}

/**
 * A 320x240 composition: a labelled coffee bag in front of a cup, with steam and
 * a single origin accent dot. Deliberately geometric so it stays legible at the
 * 4:3 card ratio and at the square detail ratio.
 */
function cafeArt({ roast, region, seed }) {
  const palette = ROAST_PALETTE[roast] ?? ROAST_PALETTE.medio;
  const accent = REGION_ACCENT[region] ?? '#c8102e';
  // Deterministic micro-variation so the eight cards are not pixel-identical.
  const lift = (seed % 3) * 6;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" width="320" height="240" role="img">
  <rect width="320" height="240" fill="${BACKGROUND}"></rect>
  <circle cx="196" cy="132" r="86" fill="${BACKDROP}"></circle>
  <ellipse cx="150" cy="206" rx="104" ry="12" fill="${LINE}" opacity="0.08"></ellipse>

  <!-- cup behind the bag -->
  <path d="M186 ${112 - lift}h58v40a29 29 0 0 1-29 29h0a29 29 0 0 1-29-29z" fill="${BACKDROP}" stroke="${LINE}" stroke-width="3" opacity="0.85"></path>
  <path d="M244 ${122 - lift}h12a19 19 0 0 1 0 38h-12" fill="none" stroke="${LINE}" stroke-width="6" opacity="0.85"></path>
  ${steam(196, 84 - lift, palette.steam)}

  <!-- coffee bag -->
  <rect x="96" y="${92 + lift}" width="88" height="${104 - lift}" rx="10" fill="${palette.bag}"></rect>
  <rect x="102" y="${78 + lift}" width="76" height="18" rx="7" fill="${palette.fold}"></rect>
  <rect x="110" y="${124 + lift}" width="60" height="40" rx="6" fill="${palette.label}" opacity="0.94"></rect>
  <rect x="120" y="${136 + lift}" width="40" height="4" rx="2" fill="${palette.fold}" opacity="0.7"></rect>
  <rect x="120" y="${146 + lift}" width="28" height="4" rx="2" fill="${palette.fold}" opacity="0.45"></rect>
  <circle cx="140" cy="${176 + lift}" r="5" fill="${accent}"></circle>

  <!-- bean -->
  <ellipse cx="66" cy="186" rx="20" ry="14" fill="${palette.fold}" transform="rotate(-22 66 186)"></ellipse>
  <path d="M54 176c8 4 14 12 18 20" fill="none" stroke="${BACKGROUND}" stroke-width="3" stroke-linecap="round" opacity="0.7"></path>
</svg>
`;
}

/** Wide, calm illustration for the "Origen" narrative section. */
function originArt() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 260" width="960" height="260" role="img">
  <rect width="960" height="260" fill="${BACKGROUND}"></rect>
  <path d="M0 214c96-58 192-58 288 0s192 58 288 0 192-58 288 0 0 46 0 46H0z" fill="${BACKDROP}"></path>
  <path d="M0 236c96-40 192-40 288 0s192 40 288 0 192-40 288 0 0 24 0 24H0z" fill="${BACKDROP}" opacity="0.7"></path>
  ${[150, 400, 650, 860].map((x, index) => `
  <g transform="translate(${x} 0)">
    <rect x="-3" y="${122 - index * 4}" width="6" height="${74 + index * 4}" rx="3" fill="${LINE}" opacity="0.75"></rect>
    <ellipse cx="-22" cy="${112 - index * 4}" rx="24" ry="15" fill="#2f7a52" transform="rotate(-18 -22 ${112 - index * 4})"></ellipse>
    <ellipse cx="22" cy="${102 - index * 4}" rx="24" ry="15" fill="${LINE}" opacity="0.8" transform="rotate(18 22 ${102 - index * 4})"></ellipse>
    <circle cx="-10" cy="${138 - index * 4}" r="6" fill="#c8102e"></circle>
    <circle cx="14" cy="${150 - index * 4}" r="5" fill="#c98a3c"></circle>
  </g>`).join('')}
</svg>
`;
}

/** Above-the-fold hero illustration (eager loading, not lazy). */
function heroArt() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="640" height="480" role="img">
  <rect width="640" height="480" fill="${BACKDROP}" rx="32"></rect>
  <circle cx="330" cy="230" r="170" fill="${BACKGROUND}"></circle>
  <ellipse cx="300" cy="416" rx="210" ry="20" fill="${LINE}" opacity="0.08"></ellipse>

  <path d="M212 ${248}h116v82a58 58 0 0 1-58 58h0a58 58 0 0 1-58-58z" fill="${BACKGROUND}" stroke="${LINE}" stroke-width="5"></path>
  <path d="M328 ${266}h24a38 38 0 0 1 0 76h-24" fill="none" stroke="${LINE}" stroke-width="10"></path>
  ${steam(232, 190, '#8b5a34')}

  <rect x="196" y="${296}" width="150" height="96" rx="16" fill="#8b5a34"></rect>
  <rect x="206" y="${276}" width="130" height="30" rx="11" fill="#66401f"></rect>
  <rect x="220" y="${330}" width="102" height="42" rx="9" fill="#fdf8f1" opacity="0.95"></rect>
  <rect x="236" y="${344}" width="70" height="6" rx="3" fill="#66401f" opacity="0.7"></rect>
  <rect x="236" y="${356}" width="48" height="6" rx="3" fill="#66401f" opacity="0.45"></rect>
  <circle cx="271" cy="${394}" r="8" fill="#c8102e"></circle>

  <ellipse cx="470" cy="356" rx="42" ry="28" fill="#66401f" transform="rotate(-24 470 356)"></ellipse>
  <path d="M444 336c16 8 28 24 36 42" fill="none" stroke="${BACKGROUND}" stroke-width="6" stroke-linecap="round" opacity="0.7"></path>
  <ellipse cx="520" cy="410" rx="34" ry="22" fill="#8b5a34" transform="rotate(14 520 410)"></ellipse>
</svg>
`;
}

/** Single source of truth: derived from the production catalog (RF-001). */
const CATALOG = cafes.map(({ id, roast, region }) => ({ id, roast, region }));

mkdirSync(OUT_DIR, { recursive: true });

const written = [];
CATALOG.forEach((cafe, index) => {
  const file = join(OUT_DIR, `cafe-${cafe.id}.svg`);
  writeFileSync(file, cafeArt({ ...cafe, seed: index }), 'utf8');
  written.push(file);
});

for (const [name, content] of [
  ['origen.svg', originArt()],
  ['hero.svg', heroArt()],
]) {
  const file = join(OUT_DIR, name);
  writeFileSync(file, content, 'utf8');
  written.push(file);
}

console.log(`Generated ${written.length} original SVG assets in public/images/`);
for (const file of written) console.log(`  ${file.replace(OUT_DIR, 'public/images')}`);
