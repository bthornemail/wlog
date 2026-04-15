/**
 * WOLOG Runtime - Page Bootstrap
 * 
 * Example of importing the @ core modules into a Vite page.
 */

import { createRuntime, stepRuntime } from '../runtime';
import { createScene, reduceScene } from '../scene';
import { renderSvg } from '../render-svg';

export function initWologPage(containerId: string) {
  // Create a minimal runtime
  const runtime = createRuntime();
  
  // Create scene for rendering
  const scene = createScene();
  
  // Get container
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container ${containerId} not found`);
  }
  
  // Render initial scene
  const svg = renderSvg(scene, container);
  
  // Step function
  function step() {
    const events = stepRuntime(runtime);
    const newScene = reduceScene(scene, events);
    renderSvg(newScene, container);
    return newScene;
  }
  
  return { runtime, scene, step };
}

// Auto-init if running in browser
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    try {
      const page = initWologPage('app');
      console.log('WOLOG Runtime initialized');
      
      // Expose to console for debugging
      (window as any).wolog = page;
    } catch (e) {
      console.error('Failed to initialize WOLOG:', e);
    }
  });
}