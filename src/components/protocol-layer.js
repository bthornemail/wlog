/**
 * WLOG Protocol Layer
 * 2-of-5 Error-Correcting Codec + Symbol Table + SSE/TCP Transport
 */

// ========== 1. 2-of-5 Error-Correcting Codec ==========
export class TwoOfFiveCodec {
    constructor() {
        this.encodeMap = {
            0: 0b11000, 1: 0b10100, 2: 0b10010, 3: 0b10001,
            4: 0b01100, 5: 0b01010, 6: 0b01001, 7: 0b00110,
            8: 0b00101, 9: 0b00011
        };
        this.decodeMap = {};
        for (const [k, v] of Object.entries(this.encodeMap)) {
            this.decodeMap[v] = parseInt(k);
        }
        this.errorCount = 0;
    }

    validate(code) {
        const weight = (code & 1) + ((code >> 1) & 1) + ((code >> 2) & 1) + 
                      ((code >> 3) & 1) + ((code >> 4) & 1);
        return weight === 2;
    }

    encode(digit) {
        return this.encodeMap[digit % 10] || 0b11000;
    }

    decode(code) {
        const decoded = this.decodeMap[code];
        if (decoded !== undefined) return decoded;
        const corrected = this.correct(code);
        if (corrected !== null) {
            this.errorCount++;
            return this.decodeMap[corrected];
        }
        return null;
    }

    correct(corrupted) {
        if (this.validate(corrupted)) return corrupted;
        for (let i = 0; i < 5; i++) {
            const candidate = corrupted ^ (1 << i);
            if (this.validate(candidate)) return candidate;
        }
        return null;
    }

    getErrorCount() { return this.errorCount; }
    resetErrorCount() { this.errorCount = 0; }
}

// ========== 2. Symbol Table (Compiler-Style) ==========
export class SymbolTable {
    constructor() {
        this.symbols = new Map();
        this.scopes = [new Map()];
        this.externals = new Map();
        this.listeners = [];
    }

    enterScope(name) {
        this.scopes.unshift(new Map());
        this.addSymbol(`__scope_${name}`, { type: 'scope', depth: this.scopes.length });
    }

    exitScope() {
        if (this.scopes.length > 1) this.scopes.shift();
    }

    addSymbol(name, attrs = {}) {
        const entry = { name, ...attrs, timestamp: Date.now(), scopeDepth: this.scopes.length };
        this.symbols.set(name, entry);
        if (this.scopes[0]) this.scopes[0].set(name, entry);
        this.notify({ type: 'ADD', entry });
        return entry;
    }

    lookup(name) {
        if (this.symbols.has(name)) return this.symbols.get(name);
        for (const scope of this.scopes) {
            if (scope.has(name)) return scope.get(name);
        }
        return null;
    }

    getAll() { return Array.from(this.symbols.values()); }
    getScope() { return Array.from(this.scopes[0]?.values() || []); }
    getUnresolved() { return Array.from(this.externals.keys()); }
    getCount() { return this.symbols.size; }
    getScopeCount() { return this.scopes.length; }

    subscribe(cb) { this.listeners.push(cb); return () => this.listeners = this.listeners.filter(l => l !== cb); }
    notify(msg) { this.listeners.forEach(l => l(msg)); }

    dump() {
        return {
            total: this.symbols.size,
            scopes: this.scopes.length,
            externals: this.externals.size,
            symbols: this.getAll().slice(0, 20)
        };
    }
}

// ========== 3. Protocol Transport ==========
export class ProtocolTransport extends EventTarget {
    constructor(symbolTable, codec) {
        super();
        this.symbolTable = symbolTable;
        this.codec = codec;
        this.sseConnection = null;
        this.wsConnection = null;
        this.peers = new Map();
        this.sseEventCount = 0;
        this.tcpEventCount = 0;
    }

    // Simulated SSE
    connectSSE(interval = 3000) {
        if (this.sseConnection) this.disconnectSSE();
        
        this.sseConnection = {
            active: true,
            interval: setInterval(() => {
                if (!this.sseConnection?.active) return;
                this.sseEventCount++;
                const tick = Date.now() % 5040;
                const encoded = this.codec.encode(tick % 10);
                
                this.dispatchEvent(new CustomEvent('sse', {
                    detail: { type: 'TICK', tick, encoded, count: this.sseEventCount }
                }));
                
                this.symbolTable.addSymbol(`sse_tick_${Date.now()}`, {
                    type: 'sse', tick, encoded
                });
            }, interval)
        };
        
        this.dispatchEvent(new CustomEvent('status', { detail: { sse: 'connected' } }));
    }

    disconnectSSE() {
        if (this.sseConnection?.interval) {
            clearInterval(this.sseConnection.interval);
            this.sseConnection = null;
            this.dispatchEvent(new CustomEvent('status', { detail: { sse: 'disconnected' } }));
        }
    }

    // Simulated WebSocket/TCP
    connectWS(interval = 5000) {
        if (this.wsConnection) this.disconnectWS();
        
        this.wsConnection = {
            active: true,
            interval: setInterval(() => {
                if (!this.wsConnection?.active) return;
                this.tcpEventCount++;
                
                const peerId = `peer_${Math.floor(Math.random() * 100)}`;
                const tick = Date.now() % 5040;
                const encoded = this.codec.encode(tick % 10);
                
                let peer = this.symbolTable.lookup(peerId);
                if (!peer) {
                    peer = this.symbolTable.addSymbol(peerId, {
                        type: 'peer',
                        fanoPosition: this.peers.size % 7
                    });
                    this.peers.set(peerId, peer);
                }
                
                this.dispatchEvent(new CustomEvent('ws', {
                    detail: { type: 'MESSAGE', peerId, tick, encoded, count: this.tcpEventCount }
                }));
            }, interval)
        };
        
        this.dispatchEvent(new CustomEvent('status', { detail: { ws: 'connected' } }));
    }

    disconnectWS() {
        if (this.wsConnection?.interval) {
            clearInterval(this.wsConnection.interval);
            this.wsConnection = null;
            this.dispatchEvent(new CustomEvent('status', { detail: { ws: 'disconnected' } }));
        }
    }

    sendWS(peerId, data) {
        const encoded = this.codec.encode(data.type % 10);
        this.dispatchEvent(new CustomEvent('ws', {
            detail: { type: 'SEND', peerId, data, encoded }
        }));
    }

    getStatus() {
        return {
            sse: this.sseConnection ? 'connected' : 'disconnected',
            ws: this.wsConnection ? 'connected' : 'disconnected',
            sseCount: this.sseEventCount,
            wsCount: this.tcpEventCount,
            peers: this.peers.size
        };
    }
}

// ========== 4. Protocol Clock Node Web Component ==========
export class ProtocolClockNode extends HTMLElement {
    static get observedAttributes() {
        return ['offset', 'tick', 'speed', 'paused', 'label'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._offset = 0;
        this._masterTick = 0;
        this._speed = 100;
        this._isRunning = true;
        this._label = 'NODE';
        this._timer = null;
        this._codec = new TwoOfFiveCodec();
    }

    connectedCallback() {
        this._render();
        this._startTimer();
    }

    disconnectedCallback() {
        this._stopTimer();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        switch (name) {
            case 'offset': this._offset = parseInt(newValue, 10) || 0; break;
            case 'tick': this._masterTick = parseInt(newValue, 10) || 0; break;
            case 'speed': this._speed = parseInt(newValue, 10) || 100; this._restartTimer(); break;
            case 'paused': this._isRunning = !newValue; this._isRunning ? this._startTimer() : this._stopTimer(); break;
            case 'label': this._label = newValue || 'NODE'; break;
        }
        this._updateDisplay();
    }

    get offset() { return this._offset; }
    set offset(v) { this.setAttribute('offset', v); }
    get tick() { return this._federatedTick; }
    get isRunning() { return this._isRunning; }
    set isRunning(v) { v ? this.removeAttribute('paused') : this.setAttribute('paused', ''); }
    get federatedTick() { return (this._masterTick + this._offset) % 5040; }

    _startTimer() {
        if (this._timer) return;
        this._timer = setInterval(() => {
            this._masterTick = (this._masterTick + 1) % 5040;
            this._updateDisplay();
            this.dispatchEvent(new CustomEvent('tick', {
                detail: { tick: this._masterTick, federatedTick: this.federatedTick, label: this._label }
            }));
        }, this._speed);
    }

    _stopTimer() {
        if (this._timer) { clearInterval(this._timer); this._timer = null; }
    }

    _restartTimer() { this._stopTimer(); this._startTimer(); }

    _getGlyph(tick) {
        const c = ((tick % 60) / 15 | 0) % 4;
        return ['⚛', '🌀', '🔷', '💠'][c];
    }

    _render() {
        const style = `
            :host { display: block; height: 100%; }
            .clock { height: 100%; padding: 8px; background: linear-gradient(#111, #1a0a2e); 
                     font-family: monospace; display: flex; flex-direction: column; box-sizing: border-box; }
            .header { display: flex; justify-content: space-between; font-size: 7px; color: #a855f7; }
            .center { flex: 1; display: flex; align-items: center; justify-content: center; font-size: 10vh; }
            .stats { display: grid; grid-template-columns: repeat(3, 1fr); font-size: 8px; gap: 4px; text-align: center; }
            .u { color: #10b981; } .p { color: #06b6d4; } .dp { color: #6366f1; }
            .footer { font-size: 6px; color: #64748b; text-align: center; margin-top: 4px; }
            .paused .center { opacity: 0.5; }
            .encoded { font-size: 5px; color: #64748b; font-family: monospace; }
        `;
        
        this.shadowRoot.innerHTML = `<style>${style}</style>
            <div class="clock">
                <div class="header"><span class="label"></span><span class="dp-val"></span></div>
                <div class="center"></div>
                <div class="stats"><span class="u"></span><span class="p"></span><span class="dp"></span></div>
                <div class="encoded"></div>
                <div class="footer"></div>
            </div>`;
    }

    _updateDisplay() {
        const tick = this.federatedTick;
        const w = { u: tick % 60, p: (tick / 60 | 0) % 60, dp: (tick / 3600 | 0) };
        const glyph = this._getGlyph(tick);
        const encoded = this._codec.encode(tick % 10);
        
        const root = this.shadowRoot;
        root.querySelector('.label').textContent = this._label;
        root.querySelector('.dp-val').textContent = w.dp + '‵‵';
        root.querySelector('.center').textContent = glyph;
        root.querySelector('.u').textContent = w.u + '°';
        root.querySelector('.p').textContent = w.p + '‵';
        root.querySelector('.dp').textContent = w.dp + '‵‵';
        root.querySelector('.encoded').textContent = encoded.toString(2).padStart(5, '0');
        root.querySelector('.footer').textContent = `T:${tick} O:${this._offset}`;
        
        root.querySelector('.clock').classList.toggle('paused', !this._isRunning);
    }
}

customElements.define('protocol-clock-node', ProtocolClockNode);