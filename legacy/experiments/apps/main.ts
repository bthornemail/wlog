/**
 * WOLOG Runtime - Page Bootstrap
 * 
 * Example of importing the @ core modules into a Vite page.
 */

import { createRuntime, stepRuntime } from "../src/core/runtime.js";
import { createScene, reduceScene } from "../src/core/scene.js";
import { renderSvg } from "../src/projection/render-svg.js";

export function initWologPage(containerId: string) {
  let runtime = createRuntime();
  let scene = createScene();

  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container ${containerId} not found`);
  }
  const containerEl = container;

  renderSvg(scene, containerEl);

  function step(): typeof scene {
    const result = stepRuntime(runtime);
    if (result === null) {
      return scene;
    }
    const [nextRuntime, event] = result;
    runtime = nextRuntime;
    scene = reduceScene(scene, event);
    renderSvg(scene, containerEl);
    return scene;
  }

  return { runtime, scene, step };
}

// Auto-init if running in browser
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    try {
      const page = initWologPage("app");
      console.log("WOLOG Runtime initialized");
      (window as any).wolog = page;
    } catch (e) {
      console.error("Failed to initialize WOLOG:", e);
    }
  });
}
