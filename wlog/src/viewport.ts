// ============================================================
// WLOG — Viewport
// Zoom, pan, focus manager. View state is local/ephemeral, NOT in WLOG.
// ============================================================

import type { Slot60 } from "./types.js";

export type UIMode = "pan" | "select" | "draw" | "inspect";

export interface InfiniteAddress {
  readonly chunkX: number;
  readonly chunkY: number;
  readonly slot: Slot60;
}

export interface ViewportState {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly focusedSlot: InfiniteAddress | null;
  readonly selectedSlots: ReadonlySet<string>;
  readonly uiMode: UIMode;
}

export function addressKey(addr: InfiniteAddress): string {
  return `${addr.chunkX},${addr.chunkY},${addr.slot}`;
}

export function parseAddressKey(key: string): InfiniteAddress | null {
  const parts = key.split(",");
  if (parts.length !== 3) return null;
  const p0 = parts[0];
  const p1 = parts[1];
  const p2 = parts[2];
  if (!p0 || !p1 || !p2) return null;
  const cx = parseInt(p0, 10);
  const cy = parseInt(p1, 10);
  const slot = parseInt(p2, 10);
  if (isNaN(cx) || isNaN(cy) || isNaN(slot)) return null;
  return {
    chunkX: cx,
    chunkY: cy,
    slot: slot as Slot60,
  };
}

export class Viewport {
  private state: ViewportState;
  private listeners: Set<(state: ViewportState) => void> = new Set();
  private containerWidth: number;
  private containerHeight: number;
  private cellSize: number = 24;

  constructor(containerWidth: number, containerHeight: number) {
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    this.state = {
      x: 0,
      y: 0,
      scale: 1.0,
      focusedSlot: null,
      selectedSlots: new Set(),
      uiMode: "pan",
    };
  }

  zoom(delta: number, screenX: number, screenY: number): void {
    const oldScale = this.state.scale;
    const newScale = Math.max(0.1, Math.min(10.0, oldScale * (1 + delta)));

    const worldX = (screenX - this.state.x) / oldScale;
    const worldY = (screenY - this.state.y) / oldScale;

    const newX = screenX - worldX * newScale;
    const newY = screenY - worldY * newScale;

    this.updateState({ scale: newScale, x: newX, y: newY });
  }

  zoomToRegion(addresses: InfiniteAddress[]): void {
    if (addresses.length === 0) return;

    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (const addr of addresses) {
      const world = this.addressToWorld(addr);
      minX = Math.min(minX, world.x);
      minY = Math.min(minY, world.y);
      maxX = Math.max(maxX, world.x + this.cellSize);
      maxY = Math.max(maxY, world.y + this.cellSize);
    }

    const padding = this.cellSize * 2;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    const regionWidth = maxX - minX;
    const regionHeight = maxY - minY;

    const scaleX = this.containerWidth / regionWidth;
    const scaleY = this.containerHeight / regionHeight;
    const newScale = Math.min(scaleX, scaleY, 5.0);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const newX = this.containerWidth / 2 - centerX * newScale;
    const newY = this.containerHeight / 2 - centerY * newScale;

    this.updateState({ scale: newScale, x: newX, y: newY });
  }

  focusSlot(address: InfiniteAddress, zoomToFit: boolean = false): void {
    if (zoomToFit) {
      this.zoomToRegion([address]);
    } else {
      const world = this.addressToWorld(address);
      const centerX = world.x + this.cellSize / 2;
      const centerY = world.y + this.cellSize / 2;

      const newX = this.containerWidth / 2 - centerX * this.state.scale;
      const newY = this.containerHeight / 2 - centerY * this.state.scale;

      this.updateState({ focusedSlot: address, x: newX, y: newY });
    }
  }

  clearFocus(): void {
    this.updateState({ focusedSlot: null });
  }

  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: (screenX - this.state.x) / this.state.scale,
      y: (screenY - this.state.y) / this.state.scale,
    };
  }

  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: worldX * this.state.scale + this.state.x,
      y: worldY * this.state.scale + this.state.y,
    };
  }

  addressToWorld(addr: InfiniteAddress): { x: number; y: number } {
    const CHUNK_SIZE = 60;
    return {
      x: (addr.chunkX * CHUNK_SIZE + (addr.slot as number)) * this.cellSize,
      y: addr.chunkY * CHUNK_SIZE * this.cellSize,
    };
  }

  hitTest(screenX: number, screenY: number): InfiniteAddress | null {
    const world = this.screenToWorld(screenX, screenY);
    const cellX = Math.floor(world.x / this.cellSize);
    const cellY = Math.floor(world.y / this.cellSize);

    const CHUNK_SIZE = 60;
    const chunkX = Math.floor(cellX / CHUNK_SIZE);
    const chunkY = Math.floor(cellY / CHUNK_SIZE);
    const slot = ((cellX % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;

    if (slot < 0 || slot >= 60) return null;

    return { chunkX, chunkY, slot: slot as Slot60 };
  }

  getVisibleChunks(): Array<{ chunkX: number; chunkY: number }> {
    const topLeft = this.screenToWorld(0, 0);
    const bottomRight = this.screenToWorld(this.containerWidth, this.containerHeight);

    const CHUNK_SIZE = 60;
    const chunkSizePx = CHUNK_SIZE * this.cellSize;

    const minChunkX = Math.floor(topLeft.x / chunkSizePx) - 1;
    const maxChunkX = Math.floor(bottomRight.x / chunkSizePx) + 1;
    const minChunkY = Math.floor(topLeft.y / chunkSizePx) - 1;
    const maxChunkY = Math.floor(bottomRight.y / chunkSizePx) + 1;

    const chunks: Array<{ chunkX: number; chunkY: number }> = [];
    for (let cy = minChunkY; cy <= maxChunkY; cy++) {
      for (let cx = minChunkX; cx <= maxChunkX; cx++) {
        chunks.push({ chunkX: cx, chunkY: cy });
      }
    }
    return chunks;
  }

  private updateState(partial: Partial<ViewportState>): void {
    this.state = { ...this.state, ...partial };
    this.notifyListeners();
  }

  getState(): ViewportState {
    return this.state;
  }

  subscribe(listener: (state: ViewportState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  resize(width: number, height: number): void {
    this.containerWidth = width;
    this.containerHeight = height;
    this.notifyListeners();
  }

  setUIMode(mode: UIMode): void {
    this.updateState({ uiMode: mode });
  }

  pan(deltaX: number, deltaY: number): void {
    this.updateState({
      x: this.state.x + deltaX,
      y: this.state.y + deltaY,
    });
  }

  toggleSlotSelection(addr: InfiniteAddress): void {
    const key = addressKey(addr);
    const newSelected = new Set(this.state.selectedSlots);

    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }

    this.updateState({ selectedSlots: newSelected });
  }

  clearSelection(): void {
    this.updateState({ selectedSlots: new Set() });
  }

  setScale(scale: number): void {
    this.updateState({ scale });
  }

  setOffset(x: number, y: number): void {
    this.updateState({ x, y });
  }
}
