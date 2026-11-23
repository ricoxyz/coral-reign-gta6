// Cinematic 3D Title Screen Controller & Career Save Slot Selector
const CONTROLS_LEGEND = [
 ['W A S D', 'Drive / Move'], ['LMB', 'Fire Weapon'], ['F', 'Hijack / Exit'], ['SPACE', 'Drift / Sprint'],
 ['1–6', 'Weapons'], ['Z / X / C', 'Crew Skills'], ['M', 'City Map'], ['R', 'Radio FM'],
];
const TITLE_BTNS = [
 ['btn-continue-career', '▶ CONTINUE', 'SLOT 1 · 68.4%'],
 ['btn-new-career', '★ NEW GAME', '10 STORY JOBS'],
 ['btn-load-game', '💾 LOAD GAME', '3 SAVE SLOTS'],
 ['btn-open-world-freeroam', '🎮 CONTROLS', 'FREE ROAM'],
];

export function updateTitleScreen(state, saveSystem) {
 const modal = document.getElementById('title-screen-modal');
 if (!modal) return;

 const desc = document.getElementById('title-hero-desc');
 if (desc && !desc.innerHTML) {
  desc.innerHTML = 'Rule the golden-hour coast of <strong>Palma Dorada</strong> across 6 neon districts. Hijack exotic cruisers, command your crew (<em>Valeria, Ramona, Mateo</em>), execute 10 multi-stage heists, and outrun 5-Star police &amp; spotlight helicopters.';
  for (const [id, lbl, tag] of TITLE_BTNS) {
   const btn = document.getElementById(id);
   if (btn) btn.innerHTML = `<span>${lbl}</span><span class="title-btn-tag">${tag}</span>`;
  }
 }

 const strip = document.getElementById('title-controls-strip');
 if (strip && !strip.children.length) {
  strip.innerHTML = CONTROLS_LEGEND.map(([k, lbl]) => `<div class="legend-item"><span class="ctrl-k">${k}</span><span>${lbl}</span></div>`).join('');
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
