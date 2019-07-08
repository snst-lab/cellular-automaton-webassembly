import { CellularAutomaton as CA , default as init } from '../wasm/pkg/wasm.js';
// Import { CellularAutomaton as CA } from './cellularAutomaton';

(async function start() {
    await init('./src/wasm/pkg/wasm_bg.wasm');
    const ca: CA = new CA();
    ca.start();

})().catch(() => 'Failed to load wasm.');
