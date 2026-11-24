// 3 Persistent localStorage Save Slots with Pre-Populated Syndicate Career Profiles
const STORAGE_PREFIX = 'coral_reign_palma_dorada_slot_';
const DEFAULT_SLOTS = {
 1: { slot: 1, title: 'SLOT 1 · KINGPIN', district: 'SOLANA STRIP', completionPct: 68.4, cash: 24850, respect: 14200, rank: 14, missionIndex: 6, wantedStars: 4, timestamp: '18:42' },
 2: { slot: 2, title: 'SLOT 2 · MARINA', district: 'CORAL MARINA', completionPct: 42, cash: 118400, respect: 8400, rank: 10, missionIndex: 3, wantedStars: 2, timestamp: '21:15' },
 3: { slot: 3, title: 'SLOT 3 · FINALE', district: 'VIDRIO', completionPct: 94.2, cash: 642800, respect: 28500, rank: 19, missionIndex: 9, wantedStars: 5, timestamp: '23:05' },
};

export function initSaveSystem(state, events, soundEngine) {
 function getSlotData(n) {
  try { const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${n}`); if (raw) return JSON.parse(raw); } catch {}
  return { ...DEFAULT_SLOTS[n] };
 }
 function saveSlot(n) {
  const data = {
   slot: n, title: `SLOT ${n} · ${state.player.rankTitle}`, district: state.currentDistrict ? state.currentDistrict.name : 'SOLANA STRIP',
   completionPct: state.stats.completionPct, cash: state.player.cash, respect: state.player.respect, rank: state.player.rank,
   missionIndex: state.mission.currentIndex, wantedStars: state.wanted.stars, timestamp: 'SAVED LIVE',
  };
  try { window.localStorage.setItem(`${STORAGE_PREFIX}${n}`, JSON.stringify(data)); } catch {}
  DEFAULT_SLOTS[n] = data; soundEngine?.playChime(920); events.emit('ui:refresh'); return data;
 }
 function loadSlot(n) {
  const d = getSlotData(n); state.activeSlot = n;
  Object.assign(state.player, { cash: d.cash, respect: d.respect, rank: d.rank });
  state.stats.completionPct = d.completionPct; state.mission.currentIndex = d.missionIndex; state.wanted.stars = d.wantedStars;
  soundEngine?.playChime(820); events.emit('ui:refresh'); return d;
 }
 function renderSaveSlotsInto(containerId, mode = 'pause') {
  const box = document.getElementById(containerId);
  if (!box) return;
  let html = '';
  for (let s = 1; s <= 3; s++) {
   const d = getSlotData(s);
   const btns = mode === 'title' ? `<button class="btn-small" data-action="load" data-slot="${s}">PLAY</button>` : `<button class="btn-small save" data-action="save" data-slot="${s}">SAVE</button><button class="btn-small" data-action="load" data-slot="${s}">LOAD</button>`;
   html += `<div class="save-slot-row" data-slot="${s}"><div class="save-slot-meta"><div class="save-slot-info">${d.title} · ${d.completionPct}%</div><div class="save-slot-sub">${d.district} · $${Number(d.cash).toLocaleString()} · ${d.timestamp}</div></div><div class="save-slot-btns">${btns}</div></div>`;
  }
  if (box._lastHtml === html) return;
  box._lastHtml = html; box.innerHTML = html;
  box.querySelectorAll('button[data-action]').forEach((btn) => btn.addEventListener('click', (e) => {
   e.stopPropagation();
   const slot = Number(btn.getAttribute('data-slot')), act = btn.getAttribute('data-action');
   if (act === 'save') saveSlot(slot);
   if (act === 'load') { loadSlot(slot); state.mode = 'play'; state.customCamera = null; events.emit('ui:refresh'); }
  }));
 }
 for (let s = 1; s <= 3; s++) try { if (!window.localStorage.getItem(`${STORAGE_PREFIX}${s}`)) window.localStorage.setItem(`${STORAGE_PREFIX}${s}`, JSON.stringify(DEFAULT_SLOTS[s])); } catch {}
 return { getSlotData, saveSlot, loadSlot, renderSaveSlotsInto };
}
