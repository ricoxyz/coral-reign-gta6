// Lightweight event bus and keyboard/mouse input controller for CORAL REIGN
export class EventBus {
 constructor() { this.listeners = new Map(); }
 on(ev, fn) { if (!this.listeners.has(ev)) this.listeners.set(ev, []); this.listeners.get(ev).push(fn); }
 emit(ev, p) { const l = this.listeners.get(ev); if (l) for (let i = 0; i < l.length; i++) l[i](p); }
}

export function bindInputControls(state, events) {
 const map = { KeyF: ['action:hijack'], KeyM: ['ui:toggleMap'], Escape: ['ui:togglePause'], KeyR: ['audio:nextRadio'], KeyZ: ['crew:ability', 'swapPlates'], KeyX: ['crew:ability', 'fieldRepair'], KeyC: ['crew:ability', 'policeJammer'] };
 window.addEventListener('keydown', (e) => {
  const c = e.code; state.input.keys[c] = true;
  if (map[c]) events.emit(...map[c]);
  if (c.startsWith('Digit')) { const n = Number(c.slice(5)); if (n >= 1 && n <= 6) events.emit('weapon:select', n - 1); }
 });
 window.addEventListener('keyup', (e) => { state.input.keys[e.code] = false; });
 window.addEventListener('mousedown', (e) => {
  if (e.button === 0 && state.mode === 'play') { state.input.mouseDown = true; events.emit('combat:fire'); }
  if (e.button === 2) state.player.aiming = true;
 });
 window.addEventListener('mouseup', (e) => { if (e.button === 0) state.input.mouseDown = false; if (e.button === 2) state.player.aiming = false; });
 window.addEventListener('mousemove', (e) => {
  if (state.mode !== 'play') return;
  state.input.cameraYaw -= (e.movementX || 0) * .0025;
  state.input.cameraPitch = Math.max(.08, Math.min(.65, state.input.cameraPitch + (e.movementY || 0) * .002));
 });
 window.addEventListener('contextmenu', (e) => e.preventDefault());
}
