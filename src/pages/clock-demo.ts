/**
 * WOLOG Clock Demo Page
 * 
 * Example of importing @ core modules into a Vite page.
 * This demonstrates the new TS bootstrap pattern.
 */

import { createRuntime } from '../runtime';
import { createScene, reduceScene, Scene } from '../scene';
import { renderSvg } from '../render-svg';
import { WorldConfig } from '../types';

class WologClockDemo {
  private runtime: ReturnType<typeof createRuntime>;
  private scene: Scene;
  private container: HTMLElement;
  private running: boolean = false;
  private intervalId: number | null = null;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container #${containerId} not found`);
    }
    
    this.container = container as HTMLElement;
    this.runtime = createRuntime();
    this.scene = createScene();
    
    // Initial render
    this.render();
  }

  private render() {
    this.container.innerHTML = '';
    const svg = renderSvg(this.scene, this.container);
    this.container.appendChild(svg);
  }

  start(tickMs: number = 100) {
    if (this.running) return;
    this.running = true;
    
    this.intervalId = window.setInterval(() => {
      // Step runtime
      this.runtime = this.runtime.step();
      
      // Reduce into scene
      this.scene = reduceScene(this.scene, []);
      
      // Re-render
      this.render();
    }, tickMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.running = false;
  }

  get sceneSnapshot() {
    return JSON.stringify(this.scene, null, 2);
  }
}

// Bootstrap
function init() {
  const demoEl = document.getElementById('clock-demo');
  if (!demoEl) {
    console.warn('#clock-demo not found, skipping WOLOG init');
    return;
  }

  const demo = new WologClockDemo('clock-demo');
  
  // Expose for debugging
  (window as any).wologClockDemo = demo;
  
  // Start button
  const startBtn = document.getElementById('start-btn');
  startBtn?.addEventListener('click', () => demo.start());
  
  // Stop button
  const stopBtn = document.getElementById('stop-btn');
  stopBtn?.addEventListener('click', () => demo.stop());
  
  console.log('WOLOG Clock Demo initialized');
}

// Run
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

export { WologClockDemo };