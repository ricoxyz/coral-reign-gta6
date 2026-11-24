// Cinematic 3D Title Screen Controller & Career Save Slot Selector
const TITLE_BTNS = [
 ['btn-continue-career', '▶ CONTINUE', 'SLOT 1 · 68.4%'],
 ['btn-new-career', '★ NEW GAME', '10 STORY JOBS'],
 ['btn-load-game', '▤ LOAD GAME', '3 SAVE SLOTS'],
 ['btn-open-world-freeroam', '⊞ CONTROLS', 'FREE ROAM'],
];
let btnsInit = false;

export function updateTitleScreen(state, saveSystem) {
 const modal = document.getElementById('title-screen-modal');
 if (!modal) return;
 for (const id of ['title-hero-desc', 'title-controls-strip']) { const el = document.getElementById(id); if (el) { el.innerHTML = ''; el.style.display = 'none'; } }
 if (!btnsInit) {
  btnsInit = true;
  for (const [id, lbl, tag] of TITLE_BTNS) { const b = document.getElementById(id); if (b) b.innerHTML = `<span>${lbl}</span><span class="title-btn-tag">${tag}</span>`; }
 }
 if (state.mode === 'title') { modal.classList.add('visible'); saveSystem.renderSaveSlotsInto('title-save-slots', 'title'); }
 else modal.classList.remove('visible');
}

export function bindMenuButtons(state, saveSystem, events, soundEngine) {
 const resume = () => { state.mode = 'play'; state.activeShot = null; state.customCamera = null; soundEngine?.playChime(780); events.emit('ui:refresh'); };
 const on = (id, fn) => document.getElementById(id)?.addEventListener('click', fn);
 on('btn-continue-career', () => { saveSystem.loadSlot(1); resume(); });
 on('btn-new-career', () => { state.mission.currentIndex = 0; state.mission.stageIndex = 0; resume(); });
 on('btn-load-game', () => { saveSystem.loadSlot(2); resume(); });
 on('btn-open-world-freeroam', resume); on('btn-resume-game', resume);
 const toggle = () => { state.mode = state.mode === 'pause_map' ? 'play' : 'pause_map'; if (state.mode === 'play') state.customCamera = null; events.emit('ui:refresh'); };
 events.on('ui:toggleMap', toggle); events.on('ui:togglePause', toggle);
}
