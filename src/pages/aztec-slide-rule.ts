import "../components/aztec-slide-rule-viewer.js";

export function initAztecSlideRulePage(containerId = "app") {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container ${containerId} not found`);
  }
  container.innerHTML = `<wolog-aztec-slide-rule></wolog-aztec-slide-rule>`;
  return container;
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    try {
      initAztecSlideRulePage();
    } catch (error) {
      console.error("Failed to initialize Aztec Slide Rule page:", error);
    }
  });
}
