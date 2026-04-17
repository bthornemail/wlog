import { createRuntime, stepRuntime } from "../src/core/runtime.js";
import { emptyScene, reduceEvent } from "../src/core/scene.js";
import { renderSceneSvg } from "../src/projection/render-svg.js";

export function initScenePage(): void {
  const container = requiredElement("container");
  const sceneJson = requiredElement("scene-json");
  const viewportJson = requiredElement("viewport-json");
  const framesEl = requiredElement("frames");
  const rendererSelect = requiredElement<HTMLSelectElement>("renderer-select");
  const stepBtn = requiredElement("stepBtn");
  const resetBtn = requiredElement("resetBtn");
  const captureBtn = requiredElement("captureBtn");

  let runtime = createRuntime();
  let scene = emptyScene();
  let currentRenderer = "svg";
  const frames: Array<{ scene: typeof scene; tick: number }> = [];

  function updateInspectors(): void {
    sceneJson.textContent = JSON.stringify(scene, null, 2);
    viewportJson.textContent = JSON.stringify({
      width: container.clientWidth,
      height: container.clientHeight,
      zoom: 1,
      offset: { x: 0, y: 0 },
    }, null, 2);
    framesEl.innerHTML = frames
      .map((frame, index) => `<div data-frame-index="${index}" style="margin:4px 0;cursor:pointer;color:#58a6ff">Frame ${index} @ ${frame.tick}</div>`)
      .join("") || '<div style="color:#8b949e">No frames captured</div>';
  }

  function render(): void {
    container.innerHTML = "";
    const svgStr = renderSceneSvg(scene, { cellSize: 32, padding: 12 });
    if (currentRenderer === "canvas") {
      const canvas = document.createElement("canvas");
      canvas.width = container.clientWidth || 960;
      canvas.height = container.clientHeight || 480;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => ctx?.drawImage(img, 0, 0);
      img.src = `data:image/svg+xml;base64,${btoa(svgStr)}`;
      container.appendChild(canvas);
    } else {
      container.innerHTML = svgStr;
    }
    updateInspectors();
  }

  function step(): void {
    const result = stepRuntime(runtime);
    if (!result) return;
    runtime = result[0];
    scene = reduceEvent(scene, result[1]);
    render();
  }

  function reset(): void {
    runtime = createRuntime();
    scene = emptyScene();
    render();
  }

  function capture(): void {
    frames.push({ scene: JSON.parse(JSON.stringify(scene)) as typeof scene, tick: Date.now() });
    updateInspectors();
  }

  rendererSelect.addEventListener("change", () => {
    currentRenderer = rendererSelect.value;
    render();
  });
  stepBtn.addEventListener("click", step);
  resetBtn.addEventListener("click", reset);
  captureBtn.addEventListener("click", capture);
  framesEl.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const rawIndex = target.dataset.frameIndex;
    if (rawIndex === undefined) return;
    const frame = frames[Number(rawIndex)];
    if (!frame) return;
    scene = frame.scene;
    render();
  });

  render();
}

function requiredElement<T extends Element = HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`scene page is missing required element: ${id}`);
  }
  return element as unknown as T;
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    initScenePage();
  });
}
