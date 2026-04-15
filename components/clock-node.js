/**
 * WLOG Clock Node Web Component
 * 
 * A reusable custom element that displays a federated abacus clock.
 * 
 * Usage:
 *   <wlog-clock-node offset="840" tick="100"></wlog-clock-node>
 * 
 * Attributes:
 *   offset  - Phase offset for federated timing (default: 0)
 *   tick    - Initial tick value (default: 0)
 *   speed   - Tick interval in ms (default: 100)
 *   paused  - Pause the clock (no value = paused)
 *   label   - Node label (default: "NODE")
 * 
 * Properties:
 *   clock.offset    - Get/set phase offset
 *   clock.tick      - Get current tick
 *   clock.isRunning - Get running state
 * 
 * Events:
 *   tick - Dispatched every tick with { detail: { tick, federatedTick } }
 */
class WlogClockNode extends HTMLElement {
    static get observedAttributes() {
        return ['offset', 'tick', 'speed', 'paused', 'label'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Clock state
        this._offset = 0;
        this._masterTick = 0;
        this._speed = 100;
        this._isRunning = true;
        this._label = 'NODE';
        this._timer = null;
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
            case 'offset':
                this._offset = parseInt(newValue, 10) || 0;
                break;
            case 'tick':
                this._masterTick = parseInt(newValue, 10) || 0;
                break;
            case 'speed':
                this._speed = parseInt(newValue, 10) || 100;
                if (this._isRunning) {
                    this._stopTimer();
                    this._startTimer();
                }
                break;
            case 'paused':
                this._isRunning = !newValue;
                if (this._isRunning) this._startTimer();
                else this._stopTimer();
                break;
            case 'label':
                this._label = newValue || 'NODE';
                break;
        }
        this._updateDisplay();
    }

    get offset() { return this._offset; }
    set offset(val) { this.setAttribute('offset', val); }
    
    get tick() { return this._federatedTick; }
    set tick(val) { this._masterTick = val; this._updateDisplay(); }
    
    get isRunning() { return this._isRunning; }
    set isRunning(val) {
        if (val) this.removeAttribute('paused');
        else this.setAttribute('paused', '');
    }

    get federatedTick() {
        return (this._masterTick + this._offset) % 5040;
    }

    _startTimer() {
        if (this._timer) return;
        this._timer = setInterval(() => {
            this._masterTick = (this._masterTick + 1) % 5040;
            this._updateDisplay();
            this.dispatchEvent(new CustomEvent('tick', {
                detail: {
                    tick: this._masterTick,
                    federatedTick: this.federatedTick,
                    nodeId: this._label
                },
                bubbles: true
            }));
        }, this._speed);
    }

    _stopTimer() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }

    getWallis(tick) {
        return {
            u: tick % 60,
            p: Math.floor(tick / 60) % 60,
            dp: Math.floor(tick / 3600)
        };
    }

    _getGlyph(tick) {
        const channel = Math.floor((tick % 60) / 15) % 4;
        return ['⚛', '🌀', '🔷', '💠'][channel];
    }

    _render() {
        const style = `
            :host {
                display: block;
                height: 100%;
                width: 100%;
            }
            .clock {
                height: 100%;
                display: flex;
                flex-direction: column;
                padding: 8px;
                background: linear-gradient(#111, #1a0a2e);
                font-family: monospace;
                box-sizing: border-box;
            }
            .header {
                display: flex;
                justify-content: space-between;
                font-size: 7px;
                color: #a855f7;
            }
            .center {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10vh;
            }
            .stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                font-size: 8px;
                gap: 4px;
            }
            .stats .u { color: #10b981; text-align: center; }
            .stats .p { color: #06b6d4; text-align: center; }
            .stats .dp { color: #6366f1; text-align: center; }
            .footer {
                font-size: 6px;
                color: #64748b;
                text-align: center;
                margin-top: 4px;
            }
            .paused .center {
                opacity: 0.5;
            }
        `;

        const template = `
            <div class="clock">
                <div class="header">
                    <span class="label"></span>
                    <span class="dp-val"></span>
                </div>
                <div class="center"></div>
                <div class="stats">
                    <span class="u"></span>
                    <span class="p"></span>
                    <span class="dp"></span>
                </div>
                <div class="footer"></div>
            </div>
        `;

        this.shadowRoot.innerHTML = `<style>${style}</style>${template}`;
    }

    _updateDisplay() {
        const tick = this.federatedTick;
        const w = this.getWallis(tick);
        const glyph = this._getGlyph(tick);

        const root = this.shadowRoot;
        root.querySelector('.label').textContent = this._label;
        root.querySelector('.dp-val').textContent = w.dp + '‵‵';
        root.querySelector('.center').textContent = glyph;
        root.querySelector('.u').textContent = w.u + '°';
        root.querySelector('.p').textContent = w.p + '‵';
        root.querySelector('.dp').textContent = w.dp + '‵‵';
        root.querySelector('.footer').textContent = `T:${tick} O:${this._offset}`;

        // Toggle paused state
        const clock = root.querySelector('.clock');
        if (this._isRunning) clock.classList.remove('paused');
        else clock.classList.add('paused');
    }
}

// Register the custom element
customElements.define('wlog-clock-node', WlogClockNode);

/**
 * WLOG Clock Grid Component
 * 
 * A container for multiple clock nodes with federation controls.
 * 
 * Usage:
 *   <wlog-clock-grid node-count="4"></wlog-clock-grid>
 * 
 * Attributes:
 *   node-count - Number of nodes to display (default: 4)
 */
class WlogClockGrid extends HTMLElement {
    static get observedAttributes() {
        return ['node-count'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._nodes = 4;
    }

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === 'node-count') {
            this._nodes = parseInt(newValue, 10) || 1;
            this._render();
        }
    }

    _render() {
        const style = `
            :host {
                display: block;
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 8px;
            }
            wlog-clock-node {
                height: 120px;
                min-height: 100px;
            }
        `;

        let html = `<style>${style}</style><div class="grid">`;
        for (let i = 0; i < this._nodes; i++) {
            html += `<wlog-clock-node offset="${i * 840}" label="N${i + 1}"></wlog-clock-node>`;
        }
        html += `</div>`;
        
        this.shadowRoot.innerHTML = html;
    }
}

customElements.define('wlog-clock-grid', WlogClockGrid);

/**
 * WLOG Federation Hub Component
 * 
 * A complete hub with controls for spawning and managing clock nodes.
 * 
 * Usage:
 *   <wlog-federation-hub></wlog-federation-hub>
 */
class WlogFederationHub extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._nodes = [];
        this._nodeId = 0;
    }

    connectedCallback() {
        this._render();
    }

    addNode() {
        this._nodeId++;
        const node = document.createElement('wlog-clock-node');
        node.setAttribute('offset', String(this._nodeId * 840));
        node.setAttribute('label', 'N' + this._nodeId);
        
        node.addEventListener('tick', (e) => {
            this._log(e.detail.nodeId, 'tick', e.detail.federatedTick);
        });
        
        this.shadowRoot.querySelector('.grid').appendChild(node);
        this._nodes.push(node);
        this._updateCount();
    }

    removeNode() {
        if (this._nodes.length === 0) return;
        const node = this._nodes.pop();
        node.remove();
        this._updateCount();
    }

    resetAll() {
        const grid = this.shadowRoot.querySelector('.grid');
        grid.innerHTML = '';
        this._nodes = [];
        this._nodeId = 0;
        this._updateCount();
    }

    _log(node, type, tick) {
        const log = this.shadowRoot.querySelector('.log');
        const entry = document.createElement('div');
        entry.textContent = `${node} ${type} ${tick}`;
        entry.style.fontSize = '7px';
        entry.style.color = '#64748b';
        log.insertBefore(entry, log.firstChild);
        while (log.children.length > 50) log.lastChild.remove();
    }

    _updateCount() {
        const count = this.shadowRoot.querySelector('.count');
        count.textContent = this._nodes.length;
    }

    _render() {
        const style = `
            :host { display: block; }
            .controls {
                padding: 12px;
                background: rgba(0,0,0,0.3);
                border-radius: 8px;
                margin-bottom: 12px;
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }
            button {
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            button.add { background: #7c3aed; color: white; }
            button.add:hover { background: #6d28d9; }
            button.remove { background: #dc2626; color: white; }
            button.remove:hover { background: #b91c1c; }
            button.reset { background: #d97706; color: white; }
            button.reset:hover { background: #b45309; }
            .count { 
                margin-left: auto; 
                color: #a855f7; 
                font-size: 12px;
                align-self: center;
            }
            .grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 8px;
            }
            .log {
                margin-top: 12px;
                padding: 8px;
                background: rgba(0,0,0,0.3);
                border-radius: 8px;
                max-height: 100px;
                overflow-y: auto;
            }
        `;

        this.shadowRoot.innerHTML = `
            <style>${style}</style>
            <div class="controls">
                <button class="add">+ Add Node</button>
                <button class="remove">- Remove</button>
                <button class="reset">Reset</button>
                <span class="count">0 nodes</span>
            </div>
            <div class="grid"></div>
            <div class="log"></div>
        `;
        
        this.shadowRoot.querySelector('.add').onclick = () => this.addNode();
        this.shadowRoot.querySelector('.remove').onclick = () => this.removeNode();
        this.shadowRoot.querySelector('.reset').onclick = () => this.resetAll();
    }
}

customElements.define('wlog-federation-hub', WlogFederationHub);