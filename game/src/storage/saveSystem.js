// 3 Persistent localStorage Save Slots with Pre-Populated Syndicate Career Profiles
const STORAGE_PREFIX = 'coral_reign_palma_dorada_slot_';

const DEFAULT_SLOTS = {
  1: {
    slot: 1,
    title: 'SLOT 1 • KINGPIN HEIST CAMPAIGN',
    district: 'SOLANA STRIP',
    completionPct: 68,
    cash: 248500,
    respect: 14200,
    rank: 14,
    missionIndex: 3,
    wantedStars: 4,
    timestamp: '18:42 GOLDEN HOUR',
  },
  2: {
    slot: 2,
    title: 'SLOT 2 • MARINA CONTRABAND RUN',
    district: 'CORAL MARINA',
    completionPct: 42,
    cash: 118400,
    respect: 8400,
    rank: 10,
    missionIndex: 1,
    wantedStars: 2,
    timestamp: '19:15 SUNSET COAST',
  },
  3: {
    slot: 3,
    title: 'SLOT 3 • VIDRIO SOVEREIGN FINALE',
    district: 'VIDRIO DOWNTOWN',
    completionPct: 94,
    cash: 642800,
    respect: 28500,
    rank: 19,
    missionIndex: 9,
    wantedStars: 5,
    timestamp: '20:05 NEON DUSK',
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
      title: `SLOT ${slotNum} • ${state.player.rankTitle} CAREER`,
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

  function renderSaveSlotsInto(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    let html = '';
    for (let s = 1; s <= 3; s++) {
      const d = getSlotData(s);
      html += `
        <div class="save-slot-row" data-slot="${s}">
          <div>
            <div class="save-slot-info">${d.title} (${d.completionPct}%)</div>
            <div class="save-slot-sub">${d.district} • $${Number(d.cash).toLocaleString()} • RANK ${d.rank}</div>
          </div>
          <div class="save-slot-btns">
            <button class="btn-small save" data-action="save" data-slot="${s}">SAVE</button>
            <button class="btn-small" data-action="load" data-slot="${s}">LOAD</button>
          </div>
        </div>
      `;
    }
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

  // Ensure default slots are seeded in localStorage on boot
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
