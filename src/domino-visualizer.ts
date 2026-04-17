/**
 * WOLOG - Domino/Polyomino Visualizer
 * 
 * Browser-based surface for the Omicron ISA.
 * Renders polyomino states using domino tiles and Aegean numbers.
 * 
 * HTML: pages/domino-viewer.html
 */

export {};

/**
 * Unicode constants
 */
const DOMINO_BASE = 0x1F030;      /* Domino tiles U+1F030 */
const AEGEAN_BASE = 0x10107;     /* Aegean numbers U+10107 */
const BRAILLE_BASE = 0x2800;      /* Braille patterns U+2800 */

/**
 * Domino tile from 2-of-5 code
 */
export interface DominoTile {
    top: number;      /* 0-6 pips */
    bottom: number;   /* 0-6 pips */
    horizontal: boolean;
}

/**
 * Convert 2-of-5 digit to domino tile
 */
export function digitToDomino(digit: number): DominoTile {
    const top = Math.floor(digit / 7);
    const bottom = digit % 7;
    return { top, bottom, horizontal: true };
}

/**
 * Get domino Unicode character
 */
export function dominoChar(tile: DominoTile): string {
    const index = tile.horizontal 
        ? tile.top * 7 + tile.bottom 
        : tile.bottom * 7 + tile.top + 70;
    return String.fromCodePoint(DOMINO_BASE + index);
}

/**
 * Get domino SVG for rendering
 */
export function dominoSVG(tile: DominoTile, size: number = 60): string {
    const pipSize = size / 7;
    const pipRadius = pipSize / 3;
    
    const pips: string[] = [];
    
    /* Top half */
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
            if (tile.top > row * 3 + col) {
                pips.push(`<circle cx="${col * pipSize + pipRadius}" cy="${row * pipSize + pipRadius}" r="${pipRadius}" fill="#1a1a2e"/>`);
            }
        }
    }
    
    /* Bottom half */
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
            if (tile.bottom > row * 3 + col) {
                pips.push(`<circle cx="${col * pipSize + pipRadius}" cy="${(row + 2) * pipSize + pipRadius}" r="${pipRadius}" fill="#1a1a2e"/>`);
            }
        }
    }
    
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="${size - 2}" height="${size - 2}" rx="4" fill="white" stroke="#333" stroke-width="1"/>
        <line x1="2" y1="${size / 2}" x2="${size - 2}" y2="${size / 2}" stroke="#333" stroke-width="1"/>
        ${pips.join('\n        ')}
    </svg>`;
}

/**
 * Aegean number representation
 */
export interface AegeanNumber {
    tenThousands: number;
    thousands: number;
    hundreds: number;
    tens: number;
    units: number;
}

/**
 * Convert integer to Aegean representation
 */
export function toAegean(n: number): AegeanNumber {
    const tenThousands = Math.floor(n / 10000);
    n = n % 10000;
    const thousands = Math.floor(n / 1000);
    n = n % 1000;
    const hundreds = Math.floor(n / 100);
    n = n % 100;
    const tens = Math.floor(n / 10);
    const units = n % 10;
    
    return { tenThousands, thousands, hundreds, tens, units };
}

/**
 * Get Aegean Unicode character for a digit
 */
export function aegeanChar(digit: number, place: keyof AegeanNumber): string {
    const offset: Record<keyof AegeanNumber, number> = {
        tenThousands: 9,  /* 𐄩 - 𐄫 */
        thousands: 5,     /* 𐄢 - 𐄦 */
        hundreds: 1,      /* 𐄇 - 𐄮 */
        tens: 10,         /* 𐄊 - 𐄟 */
        units: 1          /* 𐄇 - 𐄏 */
    };
    
    const index = offset[place] + (digit % 10) - 1;
    return String.fromCodePoint(AEGEAN_BASE + index);
}

/**
 * Render full Aegean number
 */
export function renderAegean(n: AegeanNumber): string {
    let result = '';
    if (n.tenThousands > 0) result += aegeanChar(n.tenThousands, 'tenThousands');
    if (n.thousands > 0) result += aegeanChar(n.thousands, 'thousands');
    if (n.hundreds > 0) result += aegeanChar(n.hundreds, 'hundreds');
    if (n.tens > 0) result += aegeanChar(n.tens, 'tens');
    if (n.units > 0) result += aegeanChar(n.units, 'units');
    return result || String.fromCodePoint(AEGEAN_BASE);  /* Zero: 𐄇 */
}

/**
 * Polyomino state
 */
export interface PolyominoState {
    cells: number;          /* Number of cells (n) */
    mask: number;           /* Bitmask of occupied cells */
    class: 'free' | 'onesided' | 'fixed';
    tick: number;           /* Current tick */
    fanoPhase: number;      /* τ₇ = tick % 7 */
    sonarChannel: number;   /* τ₆₀ channel: floor(tick / 15) */
    sonarSlot: number;      /* τ₆₀ slot: tick % 15 */
    omicronEvent: boolean;  /* True if at alignment point */
}

/**
 * Create initial polyomino state
 */
export function initPolyomino(cells: number = 1, cls: 'free' | 'onesided' | 'fixed' = 'free'): PolyominoState {
    return {
        cells,
        mask: 1,  /* Single cell at origin */
        class: cls,
        tick: 0,
        fanoPhase: 0,
        sonarChannel: 0,
        sonarSlot: 0,
        omicronEvent: false
    };
}

/**
 * Gnomon operation - add one cell
 */
export function gnomonGrowth(state: PolyominoState): PolyominoState {
    if (state.mask === 0) {
        return { ...state, cells: 1, mask: 1 };
    }
    
    /* Find lowest set bit and expand */
    const lowest = state.mask & -state.mask;
    const expansion = (lowest << 1) | (lowest >> 1);
    
    return {
        ...state,
        cells: state.cells + 1,
        mask: state.mask | expansion
    };
}

/**
 * Update tick and compute derived state
 */
export function tick(state: PolyominoState): PolyominoState {
    const newTick = (state.tick + 1) % 5040;
    const MASTER_PERIOD = 5040;  /* 7! */
    const SONAR_PERIOD = 60;      /* 4 channels × 15 */
    const OMICRON_PERIOD = 420;   /* LCM(7, 60) */
    
    return {
        ...state,
        tick: newTick,
        fanoPhase: newTick % 7,
        sonarChannel: Math.floor((newTick % SONAR_PERIOD) / 15),
        sonarSlot: newTick % 15,
        omicronEvent: (newTick % OMICRON_PERIOD) === 0 || newTick === 0
    };
}

/**
 * Polyomino count by class and size (from OEIS)
 */
export const POLYOMINO_COUNTS: Record<string, Record<number, number>> = {
    free: {
        1: 1, 2: 1, 3: 2, 4: 5, 5: 12, 6: 35, 7: 108, 8: 369, 9: 1285
    },
    onesided: {
        1: 1, 2: 1, 3: 2, 4: 7, 5: 18, 6: 60, 7: 196, 8: 704, 9: 2500
    },
    fixed: {
        1: 1, 2: 2, 3: 6, 4: 19, 5: 63, 6: 216, 7: 760, 8: 2725, 9: 9910
    }
};

/**
 * Get polyomino count for a given size and class
 */
export function getPolyominoCount(cells: number, cls: keyof typeof POLYOMINO_COUNTS): number {
    return POLYOMINO_COUNTS[cls]?.[cells] ?? 0;
}

/**
 * Wallis sexagesimal components
 */
export interface WallisTime {
    units: number;      /* tick % 60 */
    primes: number;    /* floor(tick / 60) % 60 */
    doublePrimes: number; /* floor(tick / 3600) */
}

/**
 * Convert tick to Wallis notation
 */
export function tickToWallis(tick: number): WallisTime {
    return {
        units: tick % 60,
        primes: Math.floor(tick / 60) % 60,
        doublePrimes: Math.floor(tick / 3600)
    };
}

/**
 * Format Wallis time as string
 */
export function formatWallis(w: WallisTime): string {
    return `${w.doublePrimes}‵‵ ${w.primes}‵ ${w.units}°`;
}

/**
 * 2×5 Discretion matrix for routing
 */
export interface Discretion {
    orientation: 'FEFF' | 'FFFE';  /* BOM orientation */
    channel: 0 | 1 | 2 | 3 | 4;   /* 5 channels */
}

/**
 * Compute discretion from tick
 */
export function computeDiscretion(tick: number): Discretion {
    const SONAR_PERIOD = 60;
    const channel = Math.floor((tick % SONAR_PERIOD) / 15) as 0 | 1 | 2 | 3 | 4;
    const orientation = (tick % 2 === 0) ? 'FEFF' : 'FFFE';
    return { orientation, channel };
}

/**
 * Get channel name
 */
export function channelName(ch: number): string {
    const names = ['Hex', '6-dot', '8-dot', 'Join', 'Aegean'];
    return names[ch] || 'Unknown';
}

/**
 * Render polyomino as grid of domino tiles
 */
export function renderPolyominoGrid(state: PolyominoState, cellSize: number = 40): string {
    const { mask, cells } = state;
    
    /* Compute bounding box */
    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    let tempMask = mask;
    let idx = 0;
    while (tempMask > 0) {
        if (tempMask & 1) {
            const x = idx % 8;
            const y = Math.floor(idx / 8);
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }
        tempMask >>= 1;
        idx++;
    }
    
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;
    
    let svg = `<svg width="${width * cellSize}" height="${height * cellSize}" viewBox="0 0 ${width * cellSize} ${height * cellSize}" xmlns="http://www.w3.org/2000/svg">
        <style>
            .cell { stroke: #444; stroke-width: 1; }
            .filled { fill: #2d2d44; }
            .empty { fill: #f0f0f0; }
        </style>`;
    
    idx = 0;
    tempMask = mask;
    while (tempMask > 0) {
        if (tempMask & 1) {
            const x = idx % 8;
            const y = Math.floor(idx / 8);
            const px = (x - minX) * cellSize;
            const py = (y - minY) * cellSize;
            
            /* Get domino for this cell */
            const tile = digitToDomino(cells % 10);
            const dominoSvg = dominoSVG(tile, cellSize - 4);
            
            svg += `<g transform="translate(${px + 2}, ${py + 2})">${dominoSvg}</g>`;
        }
        tempMask >>= 1;
        idx++;
    }
    
    svg += '</svg>';
    return svg;
}

/**
 * Full state to HTML
 */
export function stateToHTML(state: PolyominoState): string {
    const wallis = tickToWallis(state.tick);
    const aegean = toAegean(getPolyominoCount(state.cells, state.class));
    const discretion = computeDiscretion(state.tick);
    const polyCount = getPolyominoCount(state.cells, state.class);
    
    return `
<div class="wolog-state">
    <div class="header">
        <span class="tick">T: ${state.tick}</span>
        <span class="wallis">${formatWallis(wallis)}</span>
        ${state.omicronEvent ? '<span class="omicron">✦ OMICRON ✦</span>' : ''}
    </div>
    
    <div class="poly-info">
        <div class="class">${state.class}</div>
        <div class="cells">${state.cells} cells</div>
        <div class="count">𐄲𐄢𐄟 = ${polyCount} shapes</div>
    </div>
    
    <div class="discretion">
        <span class="orientation">${discretion.orientation}</span>
        <span class="channel">${channelName(discretion.channel)}</span>
    </div>
    
    <div class="fano-sonar">
        <div class="fano">τ₇: ${state.fanoPhase}</div>
        <div class="sonar">τ₆₀: Ch${state.sonarChannel} S${state.sonarSlot}</div>
    </div>
    
    <div class="grid">
        ${renderPolyominoGrid(state)}
    </div>
</div>`;
}
