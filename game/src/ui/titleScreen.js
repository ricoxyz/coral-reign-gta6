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

 const desc = document.getElementById('title-hero-desc');
 if (desc) { desc.innerHTML = ''; desc.style.display = 'none'; }
 const strip = document.getElementById('title-controls-strip');
 if (strip) { strip.innerHTML = ''; strip.style.display = 'none'; }

 if (!btnsInit) {
  btnsInit = true;
  for (const [id, lbl, tag] of TITLE_BTNS) {
   const btn = document.getElementById(id);
   if (btn) btn.innerHTML = `<span>${lbl}</span><span class="title-btn-tag">${tag}</span>`;
  }
 }

 if (state.mode === 'title') {
  modal.classList.add('visible');
  saveSystem.renderSaveSlotsInto('title-save-slots', 'title');
 } else {
  modal.classList.remove('visible');
 }
}

export function bindMenuButtons(state, saveSystem, events, soundEngine) {
 const resumeGame = () => {
  state.mode = 'play'; state.activeShot = null; state.customCamera = null;
  if (soundEngine) soundEngine.playChime(780);
  events.emit('ui:refresh');
 };
 const bindClick = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
 bindClick('btn-continue-career', () => { saveSystem.loadSlot(1); resumeGame(); });
 bindClick('btn-new-career', () => { state.mission.currentIndex = 0; state.mission.stageIndex = 0; resumeGame(); });
 bindClick('btn-load-game', () => { saveSystem.loadSlot(2); resumeGame(); });
 bindClick('btn-open-world-freeroam', resumeGame);
 bindClick('btn-resume-game', resumeGame);

 const togglePause = () => {
  state.mode = state.mode === 'pause_map' ? 'play' : 'pause_map';
  if (state.mode === 'play') state.customCamera = null;
  events.emit('ui:refresh');
 };
 events.on('ui:toggleMap', togglePause);
 events.on('ui:togglePause', togglePause);
}
