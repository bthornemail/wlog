import "../src/ui/components/clock-node.js";

declare const vis: any;

type GraphNode = { id: number; label: string; type?: string; [key: string]: unknown };
type GraphEdge = { from: number; to: number; label: string };

const NODE_COLORS: Record<string, string> = {
  root: "#f59e0b",
  prime: "#7c3aed",
  structural: "#059669",
  clock: "#dc2626",
  address: "#2563eb",
  projection: "#d97706",
  default: "#6b7280",
};

function parsePg(pgText: string): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const nodeMap = new Map<string, number>();
  let id = 1;

  for (const rawLine of pgText.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const edgeMatch = line.match(/^(\S+)\s*->\s*(\S+)\s*:\s*(\S+)$/);
    if (edgeMatch) {
      const source = edgeMatch[1]!;
      const target = edgeMatch[2]!;
      const rel = edgeMatch[3]!;
      if (!nodeMap.has(source)) {
        nodeMap.set(source, id++);
        nodes.push({ id: nodeMap.get(source)!, label: source });
      }
      if (!nodeMap.has(target)) {
        nodeMap.set(target, id++);
        nodes.push({ id: nodeMap.get(target)!, label: target });
      }
      edges.push({ from: nodeMap.get(source)!, to: nodeMap.get(target)!, label: rel });
      continue;
    }

    const nodeMatch = line.match(/^(\S+)\s*:\s*(\S+)(?:\s+(.+))?$/);
    if (nodeMatch && !line.includes("->")) {
      const label = nodeMatch[1]!;
      const type = nodeMatch[2]!;
      const props = nodeMatch[3];
      if (!nodeMap.has(label)) {
        nodeMap.set(label, id++);
        const node: GraphNode = { id: nodeMap.get(label)!, label, type };
        if (props) {
          for (const kv of props.split(/\s+/)) {
            const [key, value] = kv.split(":");
            if (key && value) node[key] = value;
          }
        }
        nodes.push(node);
      }
    }
  }

  return { nodes, edges };
}

export function initViewerPage(): void {
  const graphSelect = requiredElement<HTMLSelectElement>("graph-select");
  const container = requiredElement("container");
  const clockGrid = requiredElement("clock-grid");
  const logContent = requiredElement("log-content");
  const addClockBtn = requiredElement("addClockBtn");
  const streamBtn = requiredElement("streamBtn");
  const resetBtn = requiredElement("resetBtn");

  let network: any = null;
  let nodeId = 0;
  const channel = new BroadcastChannel("wolog-stream");

  function logMsg(type: string, msg: string, cls: string): void {
    const entry = document.createElement("div");
    entry.className = `log-entry ${cls}`;
    entry.textContent = `[${type}] ${msg}`;
    logContent.insertBefore(entry, logContent.firstChild);
    while (logContent.children.length > 20) {
      logContent.lastChild?.remove();
    }
  }

  async function loadGraph(): Promise<void> {
    const response = await fetch(`./${graphSelect.value}`);
    const text = await response.text();
    const result = parsePg(text);

    const nodeData = result.nodes.map((node) => ({
      id: node.id,
      label: node.label,
      title: JSON.stringify(node),
      color: {
        background: NODE_COLORS[String(node.type ?? "default")] ?? NODE_COLORS.default,
        border: "#ffffff",
      },
      shape: "dot",
      size: node.type === "prime" ? 25 : node.type === "root" ? 30 : 18,
      font: { color: "#ffffff", face: "Arvo", size: 14 },
    }));

    const edgeData = result.edges.map((edge, index) => ({
      id: index,
      from: edge.from,
      to: edge.to,
      label: edge.label,
      font: { color: "#8b949e", size: 11 },
      arrows: "to",
      smooth: { type: "continuous" },
    }));

    if (network) network.destroy();
    network = new vis.Network(
      container,
      { nodes: new vis.DataSet(nodeData), edges: new vis.DataSet(edgeData) },
      {
        nodes: { borderWidth: 2, shadow: true },
        edges: { width: 2 },
        physics: {
          enabled: true,
          solver: "forceAtlas2Based",
          forceAtlas2Based: { gravitationalConstant: -50, springLength: 100, springConstant: 0.01 },
        },
        interaction: { hover: true, tooltipDelay: 200 },
      },
    );
  }

  function addClock(): void {
    nodeId += 1;
    const clock = document.createElement("wlog-clock-node");
    clock.setAttribute("offset", String((nodeId - 1) * 840));
    clock.setAttribute("label", `NODE${nodeId}`);
    clock.setAttribute("style", "height: 100px;");
    clock.addEventListener("tick", ((event: Event) => {
      const detail = (event as CustomEvent<{ federatedTick: number }>).detail;
      const tick = detail.federatedTick;
      channel.postMessage({ type: "NULL", tick });
      if (tick % 60 === 0 && tick > 0) channel.postMessage({ type: "ESC", tick, payload: { state: "HEARTBEAT" } });
      if (tick % 420 === 0 && tick > 0) channel.postMessage({ type: "BOM", tick });
    }) as EventListener);
    clockGrid.appendChild(clock);
  }

  channel.onmessage = (event) => {
    const data = event.data;
    if (data.type === "BOM") logMsg("BOM", "Session reset", "log-bom");
    else if (data.type === "NULL") logMsg("NULL", `tick ${data.tick}`, "log-null");
    else if (data.type === "ESC") logMsg("ESC", "payload", "log-esc");
    else if (data.type === "STATE") logMsg("STATE", JSON.stringify(data.payload), "log-state");
  };

  graphSelect.addEventListener("change", () => {
    void loadGraph();
  });
  addClockBtn.addEventListener("click", addClock);
  streamBtn.addEventListener("click", () => channel.postMessage({ type: "BOM", tick: 0 }));
  resetBtn.addEventListener("click", () => {
    clockGrid.innerHTML = "";
    logContent.innerHTML = "";
    nodeId = 0;
    channel.postMessage({ type: "BOM", tick: 0 });
  });

  addClock();
  void loadGraph();
}

function requiredElement<T extends Element = HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`viewer page is missing required element: ${id}`);
  }
  return element as unknown as T;
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    void initViewerPage();
  });
}
