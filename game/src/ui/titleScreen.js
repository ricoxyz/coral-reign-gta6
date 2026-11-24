/**
 * Cinematic 3D Title Screen Controller & Career Save Slot Selector.
 * Renders the flagship Palma Dorada hero card, campaign CTAs, and controls summary.
 */

const TITLE_BTNS = [
 ['btn-continue-career', '▶ ENTER PALMA DORADA', '68.4% · KINGPIN'],
 ['btn-load-game', '► CONTINUE', 'SLOT 1'],
 ['btn-new-career', '★ NEW GAME', '10 JOBS'],
 ['btn-open-world-freeroam', '◈ MAP', '6 DISTRICTS · [M]'],
];

const HERO_TAGLINE = 'Rule the neon coast from Solana Strip to Vidrio Downtown. Outrun 5-star pursuits, hijack exotics, and lead your crew across 10 story heists.';

const CONTROLS_SUMMARY = [
 ['WASD', 'Drive / Move'],
 ['F', 'Hijack / Exit'],
 ['1-6', 'Weapons'],
 ['Z/X/C', 'Crew'],
 ['R', 'Radio'],
 ['M', 'Map'],
];

let titleInit = false;

export function updateTitleScreen(state, saveSystem) {
 const modal = document.getElementById('title-screen-modal');
 if (!modal) return;

 if (!titleInit) {
  titleInit = true;
  const desc = document.getElementById('title-hero-desc');
  if (desc) desc.textContent = HERO_TAGLINE;

  const strip = document.getElementById('title-controls-strip');
  if (strip) {
   strip.innerHTML = CONTROLS_SUMMARY
    .map(([key, label]) => `<span class="legend-item"><span class="ctrl-k">${key}</span><span>${label}</span></span>`)
    .join('');
  }

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
 const resume = () => {
  state.mode = 'play';
  state.activeShot = null;
  state.customCamera = null;
  soundEngine?.playChime(780);
  events.emit('ui:refresh');
 };

 const openMap = () => {
  state.mode = 'pause_map';
  state.activeShot = null;
  state.customCamera = null;
  soundEngine?.playChime(720);
  events.emit('ui:refresh');
 };

 const on = (id, fn) => document.getElementById(id)?.addEventListener('click', fn);
 on('btn-continue-career', () => { saveSystem.loadSlot(1); resume(); });
 on('btn-load-game', () => { saveSystem.loadSlot(1); resume(); });
 on('btn-new-career', () => { state.mission.currentIndex = 0; state.mission.stageIndex = 0; resume(); });
 on('btn-open-world-freeroam', openMap);
 on('btn-resume-game', resume);

 const toggle = () => {
  state.mode = state.mode === 'pause_map' ? 'play' : 'pause_map';
  if (state.mode === 'play') state.customCamera = null;
  events.emit('ui:refresh');
 };
 events.on('ui:toggleMap', toggle);
 events.on('ui:togglePause', toggle);
}
