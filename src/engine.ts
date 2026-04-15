// ============================================================
// WLOG — Engine
// Glue layer: Runtime → Event → Scene reduction → Render targets.
// ============================================================

import type { Runtime, Event, WLOG } from "./types.js";
import { stepRuntime, initRuntime } from "./runtime.js";
import { emptyScene, reduceEvent, type Scene } from "./scene.js";

export interface EngineStep {
  readonly runtime: Runtime | null;
  readonly scene: Scene;
}

export function stepEngine(rt: Runtime, scene: Scene): EngineStep {
  const out = stepRuntime(rt);
  if (!out) {
    return { runtime: null, scene };
  }

  const [nextRuntime, event] = out;
  const nextScene = reduceEvent(scene, event);

  return { runtime: nextRuntime, scene: nextScene };
}

export function runEngine(wlog: WLOG, maxTicks?: number): Scene {
  let runtime = initRuntime(wlog);
  let scene = emptyScene();

  let ticks = 0;
  for (;;) {
    if (maxTicks !== undefined && ticks >= maxTicks) break;
    
    const result = stepRuntime(runtime);
    if (result === null) break;

    const [nextRuntime, event] = result;
    scene = reduceEvent(scene, event);
    runtime = nextRuntime;
    ticks++;
  }

  return scene;
}

export function initSceneEngine(): Scene {
  return emptyScene();
}

export type { Scene, SceneCell, SceneFrame } from "./scene.js";
