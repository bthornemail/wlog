import { buildQuartetReconciliationProofDemo } from "../quartet-reconciliation-demo.js";

export function initQuartetReconciliationDemo(containerId = "app"): HTMLElement {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container ${containerId} not found`);
  }
  const artifact = buildQuartetReconciliationProofDemo();
  const scenarioRows = artifact.receipt.scenarios.map((scenario) =>
    `<tr>
      <td>${escapeHtml(scenario.name)}</td>
      <td>${scenario.acceptedCount}</td>
      <td>${scenario.rejectedCount}</td>
      <td>${scenario.pass ? "PASS" : "FAIL"}</td>
    </tr>`
  ).join("");
  container.innerHTML = `
    <section>
      <h1>WOLOG Quartet Reconciliation Demo</h1>
      <p>Canonical hash proof artifact across Aztec, MaxiCode, BEEtag, and Code16K carriers.</p>
    </section>
    <section>
      <h2>Basis SVG</h2>
      <div class="svg-wrap">${artifact.basisSvg}</div>
    </section>
    <section>
      <h2>Scenario Results</h2>
      <table>
        <thead><tr><th>Scenario</th><th>Accepted</th><th>Rejected</th><th>Status</th></tr></thead>
        <tbody>${scenarioRows}</tbody>
      </table>
      <p>Permutations checked: <strong>${artifact.receipt.determinism.permutationsChecked}</strong>,
      inferred deterministic: <strong>${artifact.receipt.determinism.inferredDeterministic}</strong>,
      canonical deterministic: <strong>${artifact.receipt.determinism.canonicalDeterministic}</strong></p>
    </section>
    <section>
      <h2>Receipt JSON</h2>
      <pre>${escapeHtml(artifact.receiptJson)}</pre>
    </section>
    <section>
      <h2>Canonical Receipt JSON (Timestamp Redacted)</h2>
      <pre>${escapeHtml(artifact.canonicalReceiptJson)}</pre>
    </section>
    <section>
      <h2>Walkthrough</h2>
      <pre>${escapeHtml(artifact.walkthroughMarkdown)}</pre>
    </section>
  `;
  return container;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    initQuartetReconciliationDemo();
  });
}
