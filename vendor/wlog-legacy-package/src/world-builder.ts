// ============================================================
// WLOG — World Builder
// Builds WorldScene from WLOG, captures frames, tracks relevance
// ============================================================

import type { WLOG, Event, Config, Value, Slot60, Tile16, Mode4, Line7, Point3 } from "./types.js";
import { slot, b8 } from "./types.js";
import { initRuntime, stepRuntime } from "./runtime.js";
import type {
  WorldScene,
  ChunkScene,
  ChunkKey,
  FrameSpec,
  FrameSnapshot,
  FrameStatus,
  FrameDiff,
  BoundedScene,
  CellSnapshot,
  Bounds,
  InfiniteAddress,
} from "./frame.js";
import { chunkKey, addressKey, emptyBounds, expandBounds } from "./frame.js";

// ------------------------------------------------------------------
// WorldScene Builder
// ------------------------------------------------------------------

export function buildWorldScene(wlog: WLOG): WorldScene {
  const chunks = new Map<ChunkKey, ChunkScene>();
  let runtime = initRuntime(wlog);
  
  let revision = 0;
  
  while (runtime.program.tag !== "Done") {
    const result = stepRuntime(runtime);
    if (!result) break;
    
    const [nextRuntime, event] = result;
    applyEventToChunks(event, chunks, runtime.config);
    runtime = nextRuntime;
    revision++;
  }
  
  return {
    revision,
    chunks,
    createdAt: Date.now(),
    sourceWLOG: wlog,
  };
}

function applyEventToChunks(
  event: Event,
  chunks: Map<ChunkKey, ChunkScene>,
  config: Config,
): void {
  const addr = configToAddress(config);
  const key = chunkKey(addr.chunkX, addr.chunkY);
  
  let chunk = chunks.get(key);
  if (!chunk) {
    chunk = {
      chunkX: addr.chunkX,
      chunkY: addr.chunkY,
      cells: new Map(),
      config: { ...config },
    };
    chunks.set(key, chunk);
  }
  
  const cellValue = extractValueFromEvent(event);
  if (cellValue) {
    const newCells = new Map(chunk.cells);
    newCells.set(addr.slot as number, cellValue);
    chunk = { ...chunk, cells: newCells };
    chunks.set(key, chunk);
  }
}

function configToAddress(config: Config): InfiniteAddress {
  const CHUNK_SIZE = 60;
  const chunkX = Math.floor((config.slot as number) / CHUNK_SIZE);
  const chunkY = 0;
  const slot = ((config.slot as number) % CHUNK_SIZE) as Slot60;
  return { chunkX, chunkY, slot };
}

function extractValueFromEvent(event: Event): Value | null {
  switch (event.tag) {
    case "EventEmit":
    case "EventHash":
    case "EventMap":
      return event.value;
    case "EventLoad":
      return { tag: "VTile", tile: event.tile };
    case "EventSetMode":
      return { tag: "VMode", mode: event.mode };
    default:
      return null;
  }
}

// ------------------------------------------------------------------
// Frame capture
// ------------------------------------------------------------------

export function captureFrame(
  world: WorldScene,
  spec: FrameSpec,
  frameId: string = generateFrameId(),
): FrameSnapshot {
  const boundedScene = sliceWorldScene(world, spec);
  
  return {
    frameId,
    worldRevision: world.revision,
    createdAt: Date.now(),
    spec,
    scene: boundedScene,
  };
}

function sliceWorldScene(world: WorldScene, spec: FrameSpec): BoundedScene {
  const cells = new Map<string, CellSnapshot>();
  const chunkKeys = new Set<ChunkKey>();
  let bounds = emptyBounds();
  
  const addresses = specToAddresses(spec, world);
  
  for (const addr of addresses) {
    const key = chunkKey(addr.chunkX, addr.chunkY);
    const chunk = world.chunks.get(key);
    if (!chunk) continue;
    
    const value = chunk.cells.get(addr.slot as number);
    if (!value) continue;
    
    const snapshot: CellSnapshot = {
      address: addr,
      value,
      config: chunk.config,
    };
    
    const addrKey = addressKey(addr);
    cells.set(addrKey, snapshot);
    chunkKeys.add(key);
    
    const worldPos = addressToWorld(addr);
    bounds = expandBounds(bounds, worldPos.x, worldPos.y);
  }
  
  return {
    bounds,
    cells,
    chunks: Array.from(chunkKeys),
  };
}

function specToAddresses(spec: FrameSpec, world: WorldScene): InfiniteAddress[] {
  switch (spec.tag) {
    case "Full": {
      const addresses: InfiniteAddress[] = [];
      for (const [key, chunk] of world.chunks) {
        const { chunkX, chunkY } = parseChunkKey(key)!;
        if (spec.chunkFilter && !spec.chunkFilter(chunkX, chunkY)) continue;
        
        for (const [slotNum] of chunk.cells) {
          addresses.push({ chunkX, chunkY, slot: slotNum as Slot60 });
        }
      }
      return addresses;
    }
    
    case "Region": {
      const addresses: InfiniteAddress[] = [];
      const { minX, minY, maxX, maxY = minX + 60 } = spec.bounds;
      
      for (let cx = Math.floor(minX / 60); cx <= Math.floor(maxX / 60); cx++) {
        for (let cy = Math.floor(minY / 60); cy <= Math.floor(maxY / 60); cy++) {
          const key = chunkKey(cx, cy);
          const chunk = world.chunks.get(key);
          if (!chunk) continue;
          
          for (const [slotNum, value] of chunk.cells) {
            const worldX = cx * 60 + slotNum;
            const worldY = cy * 60;
            if (worldX >= minX && worldX < maxX && worldY >= minY && worldY < maxY) {
              addresses.push({ chunkX: cx, chunkY: cy, slot: slotNum as Slot60 });
            }
          }
        }
      }
      return addresses;
    }
    
    case "Focus": {
      const { focus, radius } = spec;
      const addresses: InfiniteAddress[] = [];
      const centerX = focus.chunkX * 60 + (focus.slot as number);
      const centerY = focus.chunkY * 60;
      
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
          const worldX = centerX + dx;
          const worldY = centerY + dy;
          if (worldX < 0 || worldY < 0) continue;
          
          const cx = Math.floor(worldX / 60);
          const cy = Math.floor(worldY / 60);
          const slot = (worldX % 60) as Slot60;
          
          const key = chunkKey(cx, cy);
          const chunk = world.chunks.get(key);
          if (!chunk || !chunk.cells.has(slot)) continue;
          
          addresses.push({ chunkX: cx, chunkY: cy, slot });
        }
      }
      return addresses;
    }
    
    case "Selection":
      return [...spec.addresses];
    
    case "Viewport": {
      const addresses: InfiniteAddress[] = [];
      const { scale, x, y } = spec.viewport;
      const viewportWidth = 800 / scale;
      const viewportHeight = 600 / scale;
      const minX = -x / scale;
      const minY = -y / scale;
      const maxX = minX + viewportWidth;
      const maxY = minY + viewportHeight;
      
      return specToAddresses({ tag: "Region", bounds: { minX, minY, maxX, maxY } }, world);
    }
  }
}

function parseChunkKey(key: string): { chunkX: number; chunkY: number } | null {
  const parts = key.split(",");
  const cx = Number(parts[0]);
  const cy = Number(parts[1]);
  if (isNaN(cx) || isNaN(cy)) return null;
  return { chunkX: cx, chunkY: cy };
}

function addressToWorld(addr: InfiniteAddress): { x: number; y: number } {
  return {
    x: addr.chunkX * 60 + (addr.slot as number),
    y: addr.chunkY * 60,
  };
}

// ------------------------------------------------------------------
// Frame status
// ------------------------------------------------------------------

export function getFrameStatus(frame: FrameSnapshot, currentWorld: WorldScene): FrameStatus {
  const stepDelta = currentWorld.revision - frame.worldRevision;
  
  return {
    frameId: frame.frameId,
    frameRevision: frame.worldRevision,
    currentRevision: currentWorld.revision,
    isCurrent: stepDelta === 0,
    stepDelta,
    isStale: stepDelta > 0,
  };
}

// ------------------------------------------------------------------
// Frame refresh
// ------------------------------------------------------------------

export function refreshFrame(
  frame: FrameSnapshot,
  currentWorld: WorldScene,
): FrameSnapshot {
  return captureFrame(currentWorld, frame.spec, `${frame.frameId}-r${currentWorld.revision}`);
}

// ------------------------------------------------------------------
// Frame diff
// ------------------------------------------------------------------

export function diffFrames(oldFrame: FrameSnapshot, newFrame: FrameSnapshot): FrameDiff {
  const added: CellSnapshot[] = [];
  const removed: CellSnapshot[] = [];
  const changed: Array<{ before: CellSnapshot; after: CellSnapshot }> = [];
  const unchanged: CellSnapshot[] = [];
  
  const oldCells = oldFrame.scene.cells;
  const newCells = newFrame.scene.cells;
  
  for (const [key, newCell] of newCells) {
    const oldCell = oldCells.get(key);
    if (!oldCell) {
      added.push(newCell);
    } else if (!valuesEqual(oldCell.value, newCell.value)) {
      changed.push({ before: oldCell, after: newCell });
    } else {
      unchanged.push(newCell);
    }
  }
  
  for (const [key, oldCell] of oldCells) {
    if (!newCells.has(key)) {
      removed.push(oldCell);
    }
  }
  
  return { added, removed, changed, unchanged };
}

function valuesEqual(a: Value, b: Value): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function generateFrameId(): string {
  return `frame-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
