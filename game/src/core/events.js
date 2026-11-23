// Lightweight event bus and keyboard/mouse input controller for CORAL REIGN
export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, handler) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(handler);
  }

  emit(event, payload) {
    const list = this.listeners.get(event);
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      list[i](payload);
    }
  }
}

export function bindInputControls(state, events) {
  window.addEventListener('keydown', (e) => {
    const code = e.code;
    state.input.keys[code] = true;

    if (code === 'KeyF') events.emit('action:hijack');
    if (code === 'KeyM') events.emit('ui:toggleMap');
    if (code === 'Escape') events.emit('ui:togglePause');
    if (code === 'KeyR') events.emit('audio:nextRadio');
    if (code === 'KeyZ') events.emit('crew:ability', 'swapPlates');
    if (code === 'KeyX') events.emit('crew:ability', 'fieldRepair');
    if (code === 'KeyC') events.emit('crew:ability', 'policeJammer');

    if (code.startsWith('Digit')) {
      const num = Number(code.replace('Digit', ''));
      if (num >= 1 && num <= 6) {
        events.emit('weapon:select', num - 1);
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    state.input.keys[e.code] = false;
  });

  window.addEventListener('mousedown', (e) => {
    if (e.button === 0 && state.mode === 'play') {
      state.input.mouseDown = true;
      events.emit('combat:fire');
    }
    if (e.button === 2) {
      state.player.aiming = true;
    }
  });

  window.addEventListener('mouseup', (e) => {
    if (e.button === 0) state.input.mouseDown = false;
    if (e.button === 2) state.player.aiming = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (state.mode !== 'play') return;
    const dx = e.movementX || 0;
    const dy = e.movementY || 0;
    state.input.cameraYaw -= dx * 0.0025;
    state.input.cameraPitch = Math.max(0.08, Math.min(0.65, state.input.cameraPitch + dy * 0.002));
  });

  window.addEventListener('contextmenu', (e) => e.preventDefault());
}
