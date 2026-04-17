// ============================================================
// WLOG — SVG Renderer
// Pure rendering from Scene model to SVG markup.
// ============================================================

import type { Scene, SceneCell } from "./scene.js";

function cellFill(state?: string): string {
  switch (state) {
    case "emit": return "#11aa44";
    case "join": return "#00aaaa";
    case "split": return "#aa3333";
    case "wait": return "#888888";
    case "hash": return "#aa66aa";
    case "map": return "#cc9900";
    default: return "#222222";
  }
}

function cellLabel(cell: SceneCell): string {
  if (cell.tile) return cell.tile;
  if (cell.mode) return cell.mode;
  if (cell.value?.tag === "VBits") return cell.value.bits.join("");
  if (cell.value?.tag === "VBit") return String(cell.value.bit);
  return String(cell.slot);
}

export function renderSceneSvg(
  scene: Scene,
  opts?: { cellSize?: number; padding?: number },
): string {
  const cellSize = opts?.cellSize ?? 32;
  const padding = opts?.padding ?? 12;

  const cells = [...scene.cells.values()];
  const width = Math.max(...cells.map(c => c.x)) + cellSize + padding * 2;
  const height = Math.max(...cells.map(c => c.y)) + cellSize + padding * 2;

  const body = cells.map((cell) => {
    const x = cell.x + padding;
    const y = cell.y + padding;
    const rot = (cell.rotationQuarterTurns ?? 0) * 90;
    const fill = cellFill(cell.state);
    const label = cellLabel(cell);

    return `
  <g transform="translate(${x + cellSize / 2} ${y + cellSize / 2}) rotate(${rot}) translate(${-cellSize / 2} ${-cellSize / 2})">
    <rect
      x="0" y="0"
      width="${cellSize}" height="${cellSize}"
      rx="6" ry="6"
      fill="${fill}"
      stroke="${scene.frame.activeSlot === cell.slot ? "#ffffff" : "#444444"}"
      stroke-width="${scene.frame.activeSlot === cell.slot ? 2 : 1}"
      data-slot="${cell.slot}"
      data-state="${cell.state ?? "idle"}"
    />
    <text
      x="${cellSize / 2}"
      y="${cellSize / 2 + 4}"
      text-anchor="middle"
      font-family="monospace"
      font-size="10"
      fill="#ffffff"
    >${label}</text>
  </g>`;
  }).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#111111"/>
${body}
</svg>`;
}
