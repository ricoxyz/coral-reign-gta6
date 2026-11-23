// 3 Persistent localStorage Save Slots with Pre-Populated Syndicate Career Profiles
const STORAGE_PREFIX = 'coral_reign_palma_dorada_slot_';

const DEFAULT_SLOTS = {
  1: {
    slot: 1,
    title: 'SLOT 1 · KINGPIN',
    district: 'SOLANA STRIP',
    completionPct: 68.4,
    cash: 24850,
    respect: 14200,
    rank: 14,
    missionIndex: 6,
    wantedStars: 4,
    timestamp: '18:42',
  },
  2: {
    slot: 2,
    title: 'SLOT 2 · MARINA',
    district: 'CORAL MARINA',
    completionPct: 42.0,
    cash: 118400,
    respect: 8400,
    rank: 10,
    missionIndex: 3,
    wantedStars: 2,
    timestamp: '21:15',
  },
  3: {
    slot: 3,
    title: 'SLOT 3 · FINALE',
    district: 'VIDRIO',
    completionPct: 94.2,
    cash: 642800,
    respect: 28500,
    rank: 19,
    missionIndex: 9,
    wantedStars: 5,
    timestamp: '23:05',
  },
};

export function initSaveSystem(state, events, soundEngine) {
  function getSlotData(slotNum) {
    try {
      const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${slotNum}`);
      if (raw) return JSON.parse(raw);
    } catch {
      // Fallback if localStorage restricted
    }
    return { ...DEFAULT_SLOTS[slotNum] };
  }

  function saveSlot(slotNum) {
    const data = {
      slot: slotNum,
      title: `SLOT ${slotNum} · ${state.player.rankTitle}`,
      district: state.currentDistrict ? state.currentDistrict.name : 'SOLANA STRIP',
      completionPct: state.stats.completionPct,
      cash: state.player.cash,
      respect: state.player.respect,
      rank: state.player.rank,
      missionIndex: state.mission.currentIndex,
      wantedStars: state.wanted.stars,
      timestamp: 'SAVED LIVE',
    };
    try {
      window.localStorage.setItem(`${STORAGE_PREFIX}${slotNum}`, JSON.stringify(data));
    } catch {
      // Ignore quota errors
    }
    DEFAULT_SLOTS[slotNum] = data;
    if (soundEngine) soundEngine.playChime(920);
    events.emit('ui:refresh');
    return data;
  }

  function loadSlot(slotNum) {
    const data = getSlotData(slotNum);
    state.activeSlot = slotNum;
    state.player.cash = data.cash;
    state.player.respect = data.respect;
    state.player.rank = data.rank;
    state.stats.completionPct = data.completionPct;
    state.mission.currentIndex = data.missionIndex;
    state.wanted.stars = data.wantedStars;
    if (soundEngine) soundEngine.playChime(820);
    events.emit('ui:refresh');
    return data;
  }

  function renderSaveSlotsInto(containerId, mode = 'pause') {
    const container = document.getElementById(containerId);
    if (!container) return;
    let html = '';
    for (let s = 1; s <= 3; s++) {
      const d = getSlotData(s);
      const btns = mode === 'title'
        ? `<button class="btn-small" data-action="load" data-slot="${s}">PLAY</button>`
        : `<button class="btn-small save" data-action="save" data-slot="${s}">SAVE</button>
           <button class="btn-small" data-action="load" data-slot="${s}">LOAD</button>`;
      html += `
        <div class="save-slot-row" data-slot="${s}">
          <div class="save-slot-meta">
            <div class="save-slot-info">${d.title} · ${d.completionPct}%</div>
            <div class="save-slot-sub">${d.district} · $${Number(d.cash).toLocaleString()} · ${d.timestamp}</div>
          </div>
          <div class="save-slot-btns">${btns}</div>
        </div>
      `;
    }
    if (container._lastHtml === html) return;
    container._lastHtml = html;
    container.innerHTML = html;

    const btns = container.querySelectorAll('button[data-action]');
    btns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const slot = Number(btn.getAttribute('data-slot'));
        const act = btn.getAttribute('data-action');
        if (act === 'save') saveSlot(slot);
        if (act === 'load') {
          loadSlot(slot);
          state.mode = 'play';
          state.customCamera = null;
          events.emit('ui:refresh');
        }
      });
    });
  }

  for (let s = 1; s <= 3; s++) {
    try {
      if (!window.localStorage.getItem(`${STORAGE_PREFIX}${s}`)) {
        window.localStorage.setItem(`${STORAGE_PREFIX}${s}`, JSON.stringify(DEFAULT_SLOTS[s]));
      }
    } catch {
      // Ignore
    }
  }

  return {
    getSlotData,
    saveSlot,
    loadSlot,
    renderSaveSlotsInto,
  };
}
