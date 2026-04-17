type ComposerElement = {
  id: string;
  type: "rect" | "circle" | "text";
  attrs: Record<string, string | number>;
  overlays: Array<{ type: string; color: string }>;
};

export function initComposePage(): void {
  const svg = requiredElement<SVGSVGElement>("canvas");
  const overlayList = requiredElement("overlay-list");
  const propsContent = requiredElement("props-content");
  const addRectBtn = requiredElement("addRectBtn");
  const addCircleBtn = requiredElement("addCircleBtn");
  const addTextBtn = requiredElement("addTextBtn");
  const addOverlayBtn = requiredElement("addOverlayBtn");
  const exportBtn = requiredElement("exportBtn");

  const elements = new Map<string, ComposerElement>();
  let selectedId: string | null = null;
  let elementId = 0;

  function createElement(type: ComposerElement["type"], attrs: Record<string, string | number>): void {
    elementId += 1;
    const id = `el${elementId}`;
    elements.set(id, { id, type, attrs: { ...attrs, id }, overlays: [] });
    render();
  }

  function updateOverlayList(): void {
    const rows: string[] = [];
    for (const element of elements.values()) {
      for (const overlay of element.overlays) {
        rows.push(`<div class='overlay-item'><span class='type'>${overlay.type}</span><span class='pos'>${element.id}</span></div>`);
      }
    }
    overlayList.innerHTML = rows.join("") || '<div style="color:#8b949e;font-size:12px">No overlays</div>';
  }

  function renderProperties(): void {
    if (!selectedId) {
      propsContent.innerHTML = "<div style='color:#8b949e;font-size:12px'>No selection</div>";
      return;
    }
    const element = elements.get(selectedId);
    if (!element) return;
    const rows = [`<div class='prop-row'><label>type</label><span>${element.type}</span></div>`];
    for (const [key, value] of Object.entries(element.attrs)) {
      rows.push(`<div class='prop-row'><label>${key}</label><input data-prop-key="${key}" value="${String(value)}"></div>`);
    }
    propsContent.innerHTML = rows.join("");
    propsContent.querySelectorAll("input[data-prop-key]").forEach((input) => {
      input.addEventListener("change", () => {
        const key = (input as HTMLInputElement).dataset.propKey!;
        const raw = (input as HTMLInputElement).value;
        if (!selectedId) return;
        const target = elements.get(selectedId);
        if (!target) return;
        target.attrs[key] = /^-?\d+(\.\d+)?$/.test(raw) ? Number(raw) : raw;
        render();
      });
    });
  }

  function render(): void {
    svg.querySelectorAll(".wolog-element").forEach((node) => node.remove());
    for (const element of elements.values()) {
      let shape: SVGElement;
      if (element.type === "rect") {
        shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        shape.setAttribute("x", String(element.attrs.x ?? 0));
        shape.setAttribute("y", String(element.attrs.y ?? 0));
        shape.setAttribute("width", String(element.attrs.width ?? 100));
        shape.setAttribute("height", String(element.attrs.height ?? 80));
        shape.setAttribute("fill", String(element.attrs.fill ?? "#7c3aed"));
      } else if (element.type === "circle") {
        shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        shape.setAttribute("cx", String(element.attrs.cx ?? 100));
        shape.setAttribute("cy", String(element.attrs.cy ?? 100));
        shape.setAttribute("r", String(element.attrs.r ?? 32));
        shape.setAttribute("fill", String(element.attrs.fill ?? "#059669"));
      } else {
        shape = document.createElementNS("http://www.w3.org/2000/svg", "text");
        shape.setAttribute("x", String(element.attrs.x ?? 120));
        shape.setAttribute("y", String(element.attrs.y ?? 120));
        shape.textContent = String(element.attrs.text ?? "hello");
        shape.setAttribute("fill", "#e5e7eb");
      }
      shape.setAttribute("class", "wolog-element");
      shape.setAttribute("data-id", element.id);
      if (selectedId === element.id) shape.classList.add("selected");
      svg.appendChild(shape);
    }
    updateOverlayList();
    renderProperties();
  }

  svg.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const id = target.dataset.id ?? null;
    selectedId = id;
    render();
  });

  addRectBtn.addEventListener("click", () => createElement("rect", { x: 80 + Math.random() * 220, y: 80 + Math.random() * 180, width: 96, height: 64 }));
  addCircleBtn.addEventListener("click", () => createElement("circle", { cx: 120 + Math.random() * 220, cy: 120 + Math.random() * 180, r: 40 }));
  addTextBtn.addEventListener("click", () => createElement("text", { x: 120 + Math.random() * 220, y: 120 + Math.random() * 180, text: "WOLOG" }));
  addOverlayBtn.addEventListener("click", () => {
    if (!selectedId) return;
    const element = elements.get(selectedId);
    if (!element) return;
    element.overlays.push({ type: "highlight", color: "#c084fc" });
    updateOverlayList();
  });
  exportBtn.addEventListener("click", () => {
    const data = JSON.stringify(Array.from(elements.values()), null, 2);
    console.log("WOLOG composer export", data);
    alert("Composer export written to console");
  });

  render();
}

function requiredElement<T extends Element = HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`compose page is missing required element: ${id}`);
  }
  return element as unknown as T;
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    initComposePage();
  });
}
