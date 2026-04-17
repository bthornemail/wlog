// ============================================================
// WOLOG — Canonical Control Plane
// 1-bit control code principle: every symbol is either structure or content
// ============================================================
//
// The escape IS the structure. There is no third category.
//
// Layer 0: COBS framing (0x00 = packet delimiter)
// Layer 1: FLAG bit (bit 7 = 0 data, bit 7 = 1 control)
// Layer 2: Control word structure (channel, lane, context)
// Layer 3: Context types (CT00, CT01, CT10, CT11)
// Layer 4: Numerical systems (NUMSYS, 15 systems + EXTD)
// Layer 5: Extension depth (EXTD recursion for infinite extensibility)
//
// ============================================================

// ============================================================
// Constants
// ============================================================

export const CONTROL_MARKER = 0b11 as const;
export const FLAG_BIT = 0x80;
export const DATA_MASK = 0x7F;
export const CONTROL_MASK = 0x7F;

export const CHANNELS = {
  FS: 0x1C,
  GS: 0x1D,
  RS: 0x1E,
  US: 0x1F,
} as const;

export const CHANNEL_NAMES = ["FS", "GS", "RS", "US"] as const;
export type ChannelName = "FS" | "GS" | "RS" | "US";
export type ChannelByte = 0x1C | 0x1D | 0x1E | 0x1F;

export const NUMERICAL_SYSTEMS = {
  DEC: 0x0,
  HEX: 0x1,
  OCT: 0x2,
  BIN: 0x3,
  B36: 0x4,
  B64: 0x5,
  B256: 0x6,
  UNI: 0x7,
  UTF8: 0x8,
  UTF16: 0x9,
  EBCDIC: 0xA,
  ATOM: 0xB,
  FRAC: 0xC,
  COBS: 0xD,
  EXTD: 0xE,
  RSVD: 0xF,
} as const;

export const NUMSYS_NAMES = [
  "DEC", "HEX", "OCT", "BIN", "B36",
  "B64", "B256", "UNI", "UTF8", "UTF16",
  "EBCDIC", "ATOM", "FRAC", "COBS", "EXTD", "RSVD"
] as const;
export type NumSysName = typeof NUMSYS_NAMES[number];

export const LANES_PER_CHANNEL = 16;
export const CONTEXTS_PER_LANE = 4;
export const TOTAL_CONTROL_ADDRESSES = 4 * LANES_PER_CHANNEL * CONTEXTS_PER_LANE;

export const CONTROL_WORD_SIZE = 2;
export const EXTENSION_DEPTH_MAX = 256;

// ============================================================
// Types
// ============================================================

export type Bit = 0 | 1;
export type Lane = number & { readonly __tag: unique symbol };
export type ContextType = 0 | 1 | 2 | 3;
export type NumSys = number & { readonly __tag: unique symbol };
export type ExtensionDepth = number & { readonly __tag: unique symbol };

export interface ControlWord {
  readonly channel: ChannelByte;
  readonly lane: Lane;
  readonly contextType: ContextType;
  readonly hasExtension: boolean;
}

export interface ControlWordWithContext {
  readonly controlWord: ControlWord;
  readonly context: ControlContext;
}

export type ControlContext =
  | { type: "CT00"; system: NumSys }
  | { type: "CT01"; system: NumSys; numeralByte: number }
  | { type: "CT10"; system: NumSys; utf8Bytes: readonly number[] }
  | { type: "CT11"; system: NumSys; extensionBytes: readonly number[] };

export interface ParsedByte {
  readonly value: number;
  readonly isControl: boolean;
  readonly controlWord?: ControlWord;
  readonly data?: number;
}

export interface ParseState {
  readonly pendingChannel: ChannelByte | null;
  readonly contextStack: readonly ControlContext[];
  readonly currentSystem: NumSys;
  readonly extensionDepth: ExtensionDepth;
  readonly errors: readonly string[];
}

export interface ControlPlaneConfig {
  readonly failClosed: boolean;
  readonly maxExtensionDepth: ExtensionDepth;
  readonly allowedExtensions: readonly number[];
}

// ============================================================
// Bit-Level Operations
// ============================================================

export function getFlagBit(byte: number): Bit {
  return ((byte & FLAG_BIT) !== 0) ? 1 : 0;
}

export function isControlByte(byte: number): boolean {
  return (byte & FLAG_BIT) !== 0;
}

export function isDataByte(byte: number): boolean {
  return (byte & FLAG_BIT) === 0 && byte !== 0x00;
}

export function isCobsDelimiter(byte: number): boolean {
  return byte === 0x00;
}

export function makeControlByte(lane: number, contextType: ContextType): number {
  return FLAG_BIT | ((lane & 0x0F) << 1) | CONTROL_MARKER;
}

export function makeDataByte(value: number): number {
  return value & DATA_MASK;
}

// ============================================================
// Control Word Parsing
// ============================================================

export function parseChannel(byte: number): ChannelByte | null {
  switch (byte) {
    case CHANNELS.FS: return CHANNELS.FS;
    case CHANNELS.GS: return CHANNELS.GS;
    case CHANNELS.RS: return CHANNELS.RS;
    case CHANNELS.US: return CHANNELS.US;
    default: return null;
  }
}

export function isChannelByte(byte: number): boolean {
  return byte >= CHANNELS.FS && byte <= CHANNELS.US;
}

export function parseControlWord(maskByte: number): ControlWord | null {
  if ((maskByte & CONTROL_MARKER) !== CONTROL_MARKER) {
    return null;
  }

  const lane = ((maskByte >> 1) & 0x0F) as Lane;
  const contextType = ((maskByte >> 3) & 0x03) as ContextType;
  const hasExtension = (maskByte & 0x80) !== 0;

  return {
    channel: CHANNELS.US,
    lane,
    contextType,
    hasExtension,
  };
}

export function parseControlSequence(
  channelByte: ChannelByte,
  maskByte: number,
): ControlWord | null {
  if ((maskByte & CONTROL_MARKER) !== CONTROL_MARKER) {
    return null;
  }

  const lane = ((maskByte >> 1) & 0x0F) as Lane;
  const contextType = ((maskByte >> 3) & 0x03) as ContextType;

  return {
    channel: channelByte,
    lane,
    contextType,
    hasExtension: false,
  };
}

// ============================================================
// Control Address Computation
// ============================================================

export function computeControlAddress(
  channel: ChannelByte,
  lane: Lane,
  contextType: ContextType,
): number {
  const channelMap: Record<number, number> = {
    [CHANNELS.FS]: 0,
    [CHANNELS.GS]: 1,
    [CHANNELS.RS]: 2,
    [CHANNELS.US]: 3,
  };
  const channelIndex = channelMap[channel] ?? 0;
  return (channelIndex * LANES_PER_CHANNEL * CONTEXTS_PER_LANE) +
         (lane * CONTEXTS_PER_LANE) +
         contextType;
}

export function decodeControlAddress(address: number): {
  channel: ChannelByte;
  lane: Lane;
  contextType: ContextType;
} | null {
  if (address < 0 || address >= TOTAL_CONTROL_ADDRESSES) {
    return null;
  }

  const channelIndex = Math.floor(address / (LANES_PER_CHANNEL * CONTEXTS_PER_LANE));
  const remaining = address % (LANES_PER_CHANNEL * CONTEXTS_PER_LANE);
  const lane = Math.floor(remaining / CONTEXTS_PER_LANE) as Lane;
  const contextType = (remaining % CONTEXTS_PER_LANE) as ContextType;

  const channels: ChannelByte[] = [CHANNELS.FS, CHANNELS.GS, CHANNELS.RS, CHANNELS.US];

  return {
    channel: channels[channelIndex]!,
    lane,
    contextType,
  };
}

// ============================================================
// Context Type Processing
// ============================================================

export function getContextTypeName(ct: ContextType): string {
  const names = ["CT00", "CT01", "CT10", "CT11"];
  return names[ct] ?? "UNKNOWN";
}

export function getContextTypeDescription(ct: ContextType): string {
  switch (ct) {
    case 0: return "Default (no additional bytes)";
    case 1: return "Numeral System Shift (1 context byte)";
    case 2: return "Unicode Escape (UTF-8 bytes follow)";
    case 3: return "Extended (algorithm-defined)";
    default: return "Unknown";
  }
}

export function parseContextByte(
  contextType: ContextType,
  byte: number,
  system: NumSys,
): ControlContext | null {
  switch (contextType) {
    case 0:
      return { type: "CT00", system };

    case 1:
      return {
        type: "CT01",
        system,
        numeralByte: byte,
      };

    case 2:
      return {
        type: "CT10",
        system,
        utf8Bytes: [byte],
      };

    case 3:
      return {
        type: "CT11",
        system,
        extensionBytes: [byte],
      };

    default:
      return null;
  }
}

// ============================================================
// Numerical Systems
// ============================================================

export function getNumSysName(ns: NumSys): NumSysName {
  return NUMSYS_NAMES[ns] ?? "RSVD";
}

export function parseNumSys(byte: number): NumSys | null {
  const ns = byte & 0x0F;
  if (ns >= 0 && ns <= 0xF) {
    return ns as NumSys;
  }
  return null;
}

export function isExtensionSystem(ns: NumSys): boolean {
  return ns === NUMERICAL_SYSTEMS.EXTD;
}

export function isReservedSystem(ns: NumSys): boolean {
  return ns === NUMERICAL_SYSTEMS.RSVD;
}

export function encodeNumSys(ns: NumSys): number {
  return ns & 0x0F;
}

// ============================================================
// Extension Depth (EXTD Recursion)
// ============================================================

export function createExtensionDepth(depth: number): ExtensionDepth {
  return depth as ExtensionDepth;
}

export function incrementExtensionDepth(depth: ExtensionDepth): ExtensionDepth {
  return (depth + 1) as ExtensionDepth;
}

export function getMaxExtensionDepth(config: ControlPlaneConfig): ExtensionDepth {
  return config.maxExtensionDepth;
}

export function isExtensionDepthExceeded(
  depth: ExtensionDepth,
  config: ControlPlaneConfig,
): boolean {
  return depth >= config.maxExtensionDepth;
}

export function* enumerateExtensionSystems(
  depth: ExtensionDepth,
): Generator<number, void, unknown> {
  const maxDepth = depth as number;
  for (let d = 0; d <= maxDepth; d++) {
    const systems = Math.pow(256, d + 1);
    for (let s = 0; s < systems; s++) {
      yield s;
    }
  }
}

// ============================================================
// Stream Parsing
// ============================================================

export function createParseState(): ParseState {
  return {
    pendingChannel: null,
    contextStack: [],
    currentSystem: NUMERICAL_SYSTEMS.DEC as NumSys,
    extensionDepth: 0 as ExtensionDepth,
    errors: [],
  };
}

export function parseByte(
  state: ParseState,
  byte: number,
  config: ControlPlaneConfig,
): { state: ParseState; result: ParsedByte | null } {
  if (config.failClosed && isReservedSystem(state.currentSystem)) {
    const newErrors = [...state.errors, `Reserved system encountered: ${state.currentSystem}`];
    return {
      state: { ...state, errors: newErrors },
      result: null,
    };
  }

  if (state.pendingChannel !== null) {
    const controlWord = parseControlSequence(state.pendingChannel, byte);
    if (controlWord === null) {
      if (config.failClosed) {
        const newErrors = [...state.errors, "Invalid control sequence"];
        return {
          state: { ...state, pendingChannel: null, errors: newErrors },
          result: null,
        };
      }
      return {
        state: { ...state, pendingChannel: null },
        result: null,
      };
    }

    const context = parseContextByte(controlWord.contextType, byte, state.currentSystem);
    const newContextStack = context ? [...state.contextStack, context] : state.contextStack;
    const newSystem = context?.type === "CT01" ? context.numeralByte as NumSys : state.currentSystem;
    const newDepth = isExtensionSystem(newSystem)
      ? incrementExtensionDepth(state.extensionDepth)
      : state.extensionDepth;

    if (config.failClosed && isExtensionDepthExceeded(newDepth, config)) {
      const newErrors = [...state.errors, "Extension depth exceeded"];
      return {
        state: { ...state, errors: newErrors },
        result: null,
      };
    }

    return {
      state: {
        ...state,
        pendingChannel: null,
        contextStack: newContextStack,
        currentSystem: newSystem,
        extensionDepth: newDepth,
      },
      result: {
        value: byte,
        isControl: true,
        controlWord,
      },
    };
  }

  if (isChannelByte(byte)) {
    return {
      state: { ...state, pendingChannel: byte as ChannelByte },
      result: null,
    };
  }

  if (isDataByte(byte)) {
    return {
      state,
      result: {
        value: byte,
        isControl: false,
        data: byte & DATA_MASK,
      },
    };
  }

  if (isCobsDelimiter(byte)) {
    return {
      state: createParseState(),
      result: {
        value: byte,
        isControl: true,
      },
    };
  }

  if (config.failClosed) {
    const newErrors = [...state.errors, `Unexpected byte: ${byte.toString(16)}`];
    return {
      state: { ...state, errors: newErrors },
      result: null,
    };
  }

  return {
    state,
    result: {
      value: byte,
      isControl: false,
      data: byte,
    },
  };
}

export function parseStream(
  bytes: readonly number[],
  config?: Partial<ControlPlaneConfig>,
): {
  results: readonly ParsedByte[];
  state: ParseState;
  valid: boolean;
} {
  const fullConfig: ControlPlaneConfig = {
    failClosed: config?.failClosed ?? true,
    maxExtensionDepth: config?.maxExtensionDepth ?? (8 as ExtensionDepth),
    allowedExtensions: config?.allowedExtensions ?? [],
  };

  let state = createParseState();
  const results: ParsedByte[] = [];

  for (const byte of bytes) {
    const { state: newState, result } = parseByte(state, byte, fullConfig);
    state = newState;
    if (result !== null) {
      results.push(result);
    }
  }

  return {
    results,
    state,
    valid: state.errors.length === 0,
  };
}

// ============================================================
// Stream Serialization
// ============================================================

export interface SerializedControlWord {
  readonly bytes: readonly number[];
  readonly channel: ChannelByte;
  readonly lane: Lane;
  readonly contextType: ContextType;
}

export function serializeControlWord(
  channel: ChannelByte,
  lane: Lane,
  contextType: ContextType,
  contextByte?: number,
): SerializedControlWord {
  const maskByte = makeControlByte(lane as number, contextType);
  const bytes: number[] = [channel];

  if (contextByte !== undefined) {
    bytes.push(contextByte);
  }

  return {
    bytes,
    channel,
    lane,
    contextType,
  };
}

export function serializeControlContext(
  context: ControlContext,
): readonly number[] {
  switch (context.type) {
    case "CT00":
      return [];
    case "CT01":
      return [context.numeralByte];
    case "CT10":
      return [...context.utf8Bytes];
    case "CT11":
      return [...context.extensionBytes];
  }
}

// ============================================================
// COBS Integration
// ============================================================

export function encodeCobsWithControlPlane(
  data: readonly number[],
  config?: Partial<ControlPlaneConfig>,
): {
  encoded: readonly number[];
  controlWords: readonly SerializedControlWord[];
} {
  const controlWords: SerializedControlWord[] = [];
  const encoded: number[] = [];
  
  const fullConfig: ControlPlaneConfig = {
    failClosed: config?.failClosed ?? true,
    maxExtensionDepth: config?.maxExtensionDepth ?? (8 as ExtensionDepth),
    allowedExtensions: config?.allowedExtensions ?? [],
  };

  const { results } = parseStream(data, fullConfig);

  let cobsCount = 1;
  for (const result of results) {
    if (result.isControl && result.controlWord) {
      controlWords.push({
        bytes: [result.value],
        channel: result.controlWord.channel,
        lane: result.controlWord.lane,
        contextType: result.controlWord.contextType,
      });
    }

    if (result.value === 0x00) {
      encoded.push(cobsCount);
      cobsCount = 1;
    } else {
      cobsCount++;
    }
  }

  encoded.push(0x00);

  return { encoded, controlWords };
}

// ============================================================
// Canonical Control Plane Matrix
// ============================================================

export interface ControlAddress {
  readonly address: number;
  readonly channel: ChannelByte;
  readonly lane: Lane;
  readonly contextType: ContextType;
  readonly channelName: ChannelName;
  readonly contextName: string;
}

export function generateControlMatrix(): readonly ControlAddress[] {
  const addresses: ControlAddress[] = [];

  for (let addr = 0; addr < TOTAL_CONTROL_ADDRESSES; addr++) {
    const decoded = decodeControlAddress(addr);
    if (decoded) {
      addresses.push({
        address: addr,
        channel: decoded.channel,
        lane: decoded.lane,
        contextType: decoded.contextType,
        channelName: getChannelName(decoded.channel),
        contextName: getContextTypeName(decoded.contextType),
      });
    }
  }

  return addresses;
}

export function getChannelName(channel: ChannelByte): ChannelName {
  switch (channel) {
    case CHANNELS.FS: return "FS";
    case CHANNELS.GS: return "GS";
    case CHANNELS.RS: return "RS";
    case CHANNELS.US: return "US";
    default: return "US";
  }
}

// ============================================================
// Default Configuration
// ============================================================

export const DEFAULT_CONTROL_PLANE_CONFIG: ControlPlaneConfig = {
  failClosed: true,
  maxExtensionDepth: 8 as ExtensionDepth,
  allowedExtensions: [],
};

export const STRICT_CONTROL_PLANE_CONFIG: ControlPlaneConfig = {
  failClosed: true,
  maxExtensionDepth: 4 as ExtensionDepth,
  allowedExtensions: [],
};

export const LENIENT_CONTROL_PLANE_CONFIG: ControlPlaneConfig = {
  failClosed: false,
  maxExtensionDepth: 16 as ExtensionDepth,
  allowedExtensions: [],
};

// ============================================================
// Utility Functions
// ============================================================

export function formatControlWord(cw: ControlWord): string {
  return `${getChannelName(cw.channel)}:${cw.lane}:${getContextTypeName(cw.contextType)}`;
}

export function formatControlAddress(addr: number): string | null {
  const decoded = decodeControlAddress(addr);
  if (!decoded) return null;
  const cw: ControlWord = { ...decoded, hasExtension: false };
  return formatControlWord(cw);
}

export function formatNumSys(ns: NumSys): string {
  return getNumSysName(ns);
}

export function isValidControlSequence(
  channel: number,
  mask: number,
): boolean {
  return isChannelByte(channel) && (mask & CONTROL_MARKER) === CONTROL_MARKER;
}

// ============================================================
// Semantic Integration
// ============================================================

export const CONTROL_PLANE_PREFIXES = `PREFIX cp: <http://wolog.org/control-plane/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>`;

export function controlWordToTurtle(cw: ControlWord): readonly string[] {
  const addr = computeControlAddress(cw.channel, cw.lane, cw.contextType);
  const name: ChannelName = getChannelName(cw.channel);
  return [
    `cp:address${addr} a cp:ControlAddress .`,
    `cp:address${addr} cp:channel "${name}" .`,
    `cp:address${addr} cp:lane "${cw.lane}"^^xsd:integer .`,
    `cp:address${addr} cp:contextType "${getContextTypeName(cw.contextType)}" .`,
  ];
}

export function controlMatrixToTurtle(): readonly string[] {
  const matrix = generateControlMatrix();
  return matrix.flatMap(addr => [
    `cp:address${addr.address} a cp:ControlAddress .`,
    `cp:address${addr.address} cp:channel "${addr.channelName}" .`,
    `cp:address${addr.address} cp:lane "${addr.lane}"^^xsd:integer .`,
    `cp:address${addr.address} cp:context "${addr.contextName}" .`,
  ]);
}
