// ============================================================
// WLOG — Canvas Renderer
// Renders Scene model to HTML5 Canvas.
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

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function renderSceneCanvas(
  scene: Scene,
  ctx: CanvasRenderingContext2D,
  opts?: { cellSize?: number; padding?: number },
): void {
  const cellSize = opts?.cellSize ?? 32;
  const padding = opts?.padding ?? 12;

  const cells = [...scene.cells.values()];
  const width = Math.max(...cells.map(c => c.x)) + cellSize + padding * 2;
  const height = Math.max(...cells.map(c => c.y)) + cellSize + padding * 2;

  ctx.canvas.width = width;
  ctx.canvas.height = height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#111111";
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "10px monospace";

  for (const cell of cells) {
    const x = cell.x + padding;
    const y = cell.y + padding;
    const rot = (cell.rotationQuarterTurns ?? 0) * (Math.PI / 2);

    ctx.save();
    ctx.translate(x + cellSize / 2, y + cellSize / 2);
    ctx.rotate(rot);

    ctx.fillStyle = cellFill(cell.state);
    ctx.strokeStyle = scene.frame.activeSlot === cell.slot ? "#ffffff" : "#444444";
    ctx.lineWidth = scene.frame.activeSlot === cell.slot ? 2 : 1;

    roundRect(ctx, -cellSize / 2, -cellSize / 2, cellSize, cellSize, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.fillText(cellLabel(cell), 0, 2);

    ctx.restore();
  }
}
