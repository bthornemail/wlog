import {
  BASIS_FAMILIES,
  CODEPOINT_GROUPS,
  SAMPLE_KINDS,
  CODEPOINT_FLAGS,
  basisCell,
  basisNeighbors,
  buildBinaryGuessSurfaceSvg,
  buildGenailleRodsSvg,
  buildScene25DProjection,
  buildSmithChartSvg,
  buildSvgProjection,
  buildVolume3DProjection,
  classifyPolynomialClass,
  projectCarrierQuartet,
  projectToPolygonalCarrier,
  virtualCodepointFromSymbolic,
  type BasisFamily,
  type CodepointGroup,
  type SampleKind,
} from "../../carriers/aztec-slide-rule.js";

type ViewerState = {
  family: BasisFamily;
  group: CodepointGroup;
  sampleKind: SampleKind;
  variant: number;
  decorator: number;
  flags: number;
  degree: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
};

const STYLE = `
  :host {
    display: block;
    min-height: 100vh;
    background:
      radial-gradient(circle at top left, rgba(56, 189, 248, 0.12), transparent 32%),
      radial-gradient(circle at top right, rgba(245, 158, 11, 0.12), transparent 30%),
      linear-gradient(180deg, #fbf7ef 0%, #f5efe1 100%);
    color: #1f2937;
    font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
  }

  .shell {
    max-width: 1360px;
    margin: 0 auto;
    padding: 28px;
  }

  .hero {
    display: grid;
    gap: 10px;
    margin-bottom: 24px;
  }

  .eyebrow {
    font: 600 12px/1.2 "IBM Plex Mono", monospace;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #8a4b08;
  }

  h1 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3.6rem);
    line-height: 1.02;
    letter-spacing: -0.04em;
    color: #111827;
  }

  .lede {
    max-width: 72ch;
    margin: 0;
    color: #4b5563;
    font-size: 1rem;
    line-height: 1.6;
  }

  .layout {
    display: grid;
    grid-template-columns: 340px minmax(0, 1fr);
    gap: 18px;
    align-items: start;
  }

  .card {
    background: rgba(255, 255, 255, 0.76);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(17, 24, 39, 0.08);
    border-radius: 24px;
    box-shadow: 0 18px 60px rgba(17, 24, 39, 0.08);
  }

  .controls {
    padding: 18px;
    position: sticky;
    top: 16px;
  }

  .controls h2,
  .panel h2 {
    margin: 0 0 12px;
    font-size: 1rem;
    color: #111827;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .role-tag {
    font-size: 10px;
    font-family: "IBM Plex Mono", monospace;
    padding: 2px 6px;
    border-radius: 4px;
    background: #fef3c7;
    color: #92400e;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .field {
    display: grid;
    gap: 6px;
    margin-bottom: 12px;
  }

  .field label {
    font: 600 12px/1.2 "IBM Plex Mono", monospace;
    text-transform: uppercase;
    color: #6b7280;
    letter-spacing: 0.08em;
  }

  .field input,
  .field select {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 12px;
    padding: 10px 12px;
    background: #fff;
    color: #111827;
    font: 500 14px/1.2 "IBM Plex Sans", sans-serif;
    box-sizing: border-box;
  }

  .flag-list {
    display: grid;
    gap: 8px;
    margin: 12px 0 18px;
  }

  .flag-list label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #374151;
  }

  .flag-list input {
    accent-color: #0f766e;
  }

  .panel-grid {
    display: grid;
    gap: 18px;
  }

  .summary,
  .projection-grid,
  .instrument-grid,
  .carrier-grid {
    display: grid;
    gap: 16px;
  }

  .summary {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  .projection-grid,
  .instrument-grid,
  .carrier-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }

  .panel {
    padding: 18px;
  }

  .stat-label {
    font: 600 11px/1.2 "IBM Plex Mono", monospace;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6b7280;
  }

  .stat-value {
    margin-top: 6px;
    font-size: 1rem;
    color: #111827;
    word-break: break-word;
  }

  .mono {
    font-family: "IBM Plex Mono", monospace;
  }

  .svg-frame {
    min-height: 250px;
    border-radius: 18px;
    background: linear-gradient(180deg, #fffdfa 0%, #fff8ed 100%);
    border: 1px solid #f0e3c2;
    display: grid;
    place-items: center;
    overflow: hidden;
  }

  .svg-frame svg {
    width: 100%;
    height: auto;
    display: block;
  }

  pre {
    margin: 0;
    padding: 14px;
    border-radius: 16px;
    background: #111827;
    color: #e5e7eb;
    font: 12px/1.5 "IBM Plex Mono", monospace;
    overflow: auto;
  }

  .chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }

  .chip {
    padding: 6px 10px;
    border-radius: 999px;
    background: #ede9fe;
    color: #5b21b6;
    font: 600 12px/1 "IBM Plex Mono", monospace;
  }

  @media (max-width: 980px) {
    .layout {
      grid-template-columns: 1fr;
    }

    .controls {
      position: static;
    }
  }
`;

export class WologAztecSlideRuleViewer extends HTMLElement {
  private state: ViewerState = {
    family: "Hexagons",
    group: "basis",
    sampleKind: "pixel",
    variant: 0x2a,
    decorator: 0x04,
    flags: CODEPOINT_FLAGS.svgReady | CODEPOINT_FLAGS.reserved25D,
    degree: 2,
  };

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    const codepoint = virtualCodepointFromSymbolic({
      family: this.state.family,
      group: this.state.group,
      variant: this.state.variant,
      decorator: this.state.decorator,
      flags: this.state.flags,
    });

    const cell = basisCell(
      codepoint,
      this.state.sampleKind,
      classifyPolynomialClass(this.state.degree, ["Bivariate", "Homogeneous"]),
    );
    const neighbors = basisNeighbors(cell);
    const svgProjection = buildSvgProjection(cell);
    const projection25 = buildScene25DProjection(cell);
    const projection3 = buildVolume3DProjection(cell);
    const smith = buildSmithChartSvg({
      normalizedResistance: 1 + (this.state.variant % 7) / 4,
      normalizedReactance: ((this.state.decorator % 9) - 4) / 2,
    });
    const genaille = buildGenailleRodsSvg({
      dividend: 30 + this.state.variant,
      divisor: 2 + (this.state.decorator % 7),
    });
    const binary = buildBinaryGuessSurfaceSvg({
      selectedMasks: [0, 2, 4].filter((bit) => ((this.state.variant >> bit) & 1) === 1),
      maxBits: 5,
    });
    const [aztec, maxiCode, beeTag, code16k] = projectCarrierQuartet(codepoint);
    const polygonal = projectToPolygonalCarrier(codepoint);

    if (!this.shadowRoot) {
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <div class="shell">
        <section class="hero">
          <div class="eyebrow">WOLOG Aztec Slide Rule</div>
          <h1>Virtual codepoints for geometric computation</h1>
          <p class="lede">
            Basis cells stay authoritative, instruments read them out as pure geometry,
            and Aztec / MaxiCode / BEEtag / Code16K form a carrier quartet.
          </p>
        </section>
        <div class="layout">
          <aside class="card controls">
            <h2>Codepoint Controls</h2>
            <div class="field">
              <label for="family">Basis Family</label>
              <select id="family">${BASIS_FAMILIES.map((family) => `<option value="${family}" ${family === this.state.family ? "selected" : ""}>${family}</option>`).join("")}</select>
            </div>
            <div class="field">
              <label for="group">Group</label>
              <select id="group">${CODEPOINT_GROUPS.map((group) => `<option value="${group}" ${group === this.state.group ? "selected" : ""}>${group}</option>`).join("")}</select>
            </div>
            <div class="field">
              <label for="sampleKind">Sample Kind</label>
              <select id="sampleKind">${SAMPLE_KINDS.map((kind) => `<option value="${kind}" ${kind === this.state.sampleKind ? "selected" : ""}>${kind}</option>`).join("")}</select>
            </div>
            <div class="field">
              <label for="variant">Variant</label>
              <input id="variant" type="number" min="0" max="255" value="${this.state.variant}">
            </div>
            <div class="field">
              <label for="decorator">Decorator</label>
              <input id="decorator" type="number" min="0" max="255" value="${this.state.decorator}">
            </div>
            <div class="field">
              <label for="degree">Polynomial Degree</label>
              <input id="degree" type="number" min="0" max="7" value="${this.state.degree}">
            </div>
            <div class="flag-list">
              ${this.renderFlagCheckbox("svgReady", "SVG-ready", this.hasFlag(CODEPOINT_FLAGS.svgReady))}
              ${this.renderFlagCheckbox("reserved25D", "Reserve 2.5D", this.hasFlag(CODEPOINT_FLAGS.reserved25D))}
              ${this.renderFlagCheckbox("reserved3D", "Reserve 3D", this.hasFlag(CODEPOINT_FLAGS.reserved3D))}
              ${this.renderFlagCheckbox("declaredOnly", "Declared-only", this.hasFlag(CODEPOINT_FLAGS.declaredOnly))}
            </div>
            <div class="chip-row">
              <span class="chip">alias ${codepoint.symbolic.alias}</span>
              <span class="chip">40-bit ${codepoint.packed40.value.toString(16).padStart(10, "0")}</span>
            </div>
          </aside>
          <main class="panel-grid">
            <section class="summary">
              ${this.renderStatCard("Symbolic Alias", codepoint.symbolic.alias)}
              ${this.renderStatCard("Packed 5×8", codepoint.packed40.octets.map((value) => value.toString(16).padStart(2, "0")).join(" "))}
              ${this.renderStatCard("Packed 8×5", codepoint.packed40.groups5.map((value) => value.toString(2).padStart(5, "0")).join(" "))}
              ${this.renderStatCard("Projection Status", cell.projectionStatus)}
            </section>
            <section class="projection-grid">
              <article class="card panel">
                <h2>Basis Cell SVG</h2>
                <div class="svg-frame">${svgProjection.svg}</div>
              </article>
              <article class="card panel">
                <h2>Basis Cell Metadata</h2>
                <pre>${escapeHtml(JSON.stringify({
                  family: cell.family,
                  sampleKind: cell.sampleKind,
                  degree: cell.polynomialClass.degree,
                  properties: cell.polynomialClass.properties,
                  coords: cell.coords,
                  neighbors,
                  projection25,
                  projection3,
                }, null, 2))}</pre>
              </article>
            </section>
            <section class="instrument-grid">
              <article class="card panel">
                <h2>Smith Chart</h2>
                <div class="svg-frame">${smith.svg}</div>
              </article>
              <article class="card panel">
                <h2>Genaille Rods</h2>
                <div class="svg-frame">${genaille.svg}</div>
              </article>
              <article class="card panel">
                <h2>Binary Guess Surface</h2>
                <div class="svg-frame">${binary.svg}</div>
              </article>
            </section>
            <section class="carrier-grid">
              <article class="card panel">
                <h2>Aztec Carrier <span class="role-tag">CLASS</span></h2>
                <pre>${escapeHtml(JSON.stringify(aztec, null, 2))}</pre>
              </article>
              <article class="card panel">
                <h2>MaxiCode Carrier <span class="role-tag">INTERFACE</span></h2>
                <pre>${escapeHtml(JSON.stringify(maxiCode, null, 2))}</pre>
              </article>
              <article class="card panel">
                <h2>BEEtag Carrier <span class="role-tag">MESSAGE</span></h2>
                <pre>${escapeHtml(JSON.stringify(beeTag, null, 2))}</pre>
              </article>
              <article class="card panel">
                <h2>Code16K Carrier <span class="role-tag">RECORD-STACK</span></h2>
                <pre>${escapeHtml(JSON.stringify(code16k, null, 2))}</pre>
              </article>
              <article class="card panel">
                <h2>Polygonal Carrier <span class="role-tag">DECLARATION</span></h2>
                <pre>${escapeHtml(JSON.stringify(polygonal, null, 2))}</pre>
              </article>
            </section>
          </main>
        </div>
      </div>
    `;

    this.bindControls();
  }

  private bindControls() {
    const root = this.shadowRoot;
    if (!root) {
      return;
    }

    root.getElementById("family")?.addEventListener("change", (event) => {
      const target = event.target as HTMLSelectElement;
      this.state.family = target.value as BasisFamily;
      this.render();
    });

    root.getElementById("group")?.addEventListener("change", (event) => {
      const target = event.target as HTMLSelectElement;
      this.state.group = target.value as CodepointGroup;
      this.render();
    });

    root.getElementById("sampleKind")?.addEventListener("change", (event) => {
      const target = event.target as HTMLSelectElement;
      this.state.sampleKind = target.value as SampleKind;
      this.render();
    });

    this.bindNumberInput("variant", (value) => {
      this.state.variant = clampByte(value);
    });
    this.bindNumberInput("decorator", (value) => {
      this.state.decorator = clampByte(value);
    });
    this.bindNumberInput("degree", (value) => {
      this.state.degree = clampDegree(value);
    });

    this.bindFlagInput("svgReady", CODEPOINT_FLAGS.svgReady);
    this.bindFlagInput("reserved25D", CODEPOINT_FLAGS.reserved25D);
    this.bindFlagInput("reserved3D", CODEPOINT_FLAGS.reserved3D);
    this.bindFlagInput("declaredOnly", CODEPOINT_FLAGS.declaredOnly);
  }

  private bindNumberInput(id: string, update: (value: number) => void) {
    this.shadowRoot?.getElementById(id)?.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      update(Number.parseInt(target.value || "0", 10));
      this.render();
    });
  }

  private bindFlagInput(id: string, bit: number) {
    this.shadowRoot?.getElementById(id)?.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      if (target.checked) {
        this.state.flags |= bit;
      } else {
        this.state.flags &= ~bit;
      }
      this.render();
    });
  }

  private renderStatCard(label: string, value: string) {
    return `
      <article class="card panel">
        <div class="stat-label">${label}</div>
        <div class="stat-value mono">${escapeHtml(value)}</div>
      </article>
    `;
  }

  private renderFlagCheckbox(id: string, label: string, checked: boolean) {
    return `
      <label for="${id}">
        <input id="${id}" type="checkbox" ${checked ? "checked" : ""}>
        <span>${label}</span>
      </label>
    `;
  }

  private hasFlag(bit: number) {
    return (this.state.flags & bit) !== 0;
  }
}

function clampByte(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(255, Math.trunc(value)));
}

function clampDegree(value: number): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(7, Math.trunc(value))) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

if (!customElements.get("wolog-aztec-slide-rule")) {
  customElements.define("wolog-aztec-slide-rule", WologAztecSlideRuleViewer);
}
