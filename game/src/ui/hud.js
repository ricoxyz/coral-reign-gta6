// Live HUD Synchronizer: Mission Banner, Wanted Stars, Police Dispatch, Weapons, Vitals, & Speedometer
import { WANTED_TIERS } from '../police/wantedSystem.js';
import { RADIO_STATIONS } from '../audio/radio.js';
import { renderMinimap } from './minimap.js';
import { updateDialogueUI } from './dialogue.js';

export function updateHUD(state, weaponsSys) {
  const p = state.player;
  const w = state.wanted;
  const m = state.mission;

  // Mission Banner
  const stageEl = document.getElementById('hud-mission-stage');
  const rewardEl = document.getElementById('hud-mission-reward');
  const titleEl = document.getElementById('hud-mission-title');
  const objEl = document.getElementById('hud-mission-obj');
  const distEl = document.getElementById('hud-mission-dist');

  if (stageEl) {
    const mNum = String(m.currentIndex + 1).padStart(2, '0');
    stageEl.textContent = `STORY MISSION ${mNum} / 10 • STAGE ${m.stageIndex + 1}/${m.totalStages}`;
  }
  if (rewardEl) {
    rewardEl.textContent = `+$${m.rewardCash.toLocaleString()} • +${m.rewardRespect.toLocaleString()} RESPECT`;
  }
  if (titleEl) titleEl.textContent = m.title;
  if (objEl) objEl.textContent = m.objective;
  if (distEl) distEl.textContent = `${m.distance}m`;

  // Top-Right Cash, Rank, Wanted Stars
  const cashEl = document.getElementById('hud-cash');
  const rankEl = document.getElementById('hud-rank');
  const wantedLbl = document.getElementById('hud-wanted-label');
  const starsEl = document.getElementById('hud-stars');

  if (cashEl) cashEl.textContent = `$${p.cash.toLocaleString()}`;
  if (rankEl) rankEl.textContent = `RANK ${p.rank} • ${p.rankTitle}`;
  const tier = WANTED_TIERS[Math.min(5, Math.max(0, w.stars))];
  if (wantedLbl) wantedLbl.textContent = tier.label;

  if (starsEl) {
    let starsHtml = '';
    for (let s = 1; s <= 5; s++) {
      starsHtml += `<span class="${s <= w.stars ? 'star-on' : 'star-off'}">★</span>`;
    }
    starsEl.innerHTML = starsHtml;
  }

  // Weapon & Crew Abilities
  const wep = weaponsSys.getCurrentWeapon();
  const wepNameEl = document.getElementById('hud-weapon-name');
  const wepAmmoEl = document.getElementById('hud-weapon-ammo');
  if (wepNameEl) wepNameEl.textContent = wep.name;
  if (wepAmmoEl) wepAmmoEl.textContent = `${wep.mag} / ${wep.reserve}`;

  const ab = state.crew.abilities;
  const zEl = document.getElementById('crew-z');
  const xEl = document.getElementById('crew-x');
  const cEl = document.getElementById('crew-c');
  if (zEl) zEl.textContent = ab.swapPlates.cooldown > 0 ? `[Z] ${Math.ceil(ab.swapPlates.cooldown)}s` : '[Z] PLATES';
  if (xEl) xEl.textContent = ab.fieldRepair.cooldown > 0 ? `[X] ${Math.ceil(ab.fieldRepair.cooldown)}s` : '[X] REPAIR';
  if (cEl) cEl.textContent = ab.policeJammer.cooldown > 0 ? `[C] ${Math.ceil(ab.policeJammer.cooldown)}s` : '[C] JAMMER';

  // Tactical Police Dispatch List
  const codeEl = document.getElementById('dispatch-code');
  const listEl = document.getElementById('dispatch-list');
  if (codeEl) codeEl.textContent = w.code.split('•')[0].trim();
  if (listEl) {
    listEl.innerHTML = w.dispatches
      .map((d) => `<li><span class="unit-tag">${d.unit}</span><span class="unit-status">${d.action}</span></li>`)
      .join('');
  }

  // Bottom-Left District, Clock, Vitals & Minimap
  const distNameEl = document.getElementById('hud-district');
  const clockEl = document.getElementById('hud-clock');
  const hpFill = document.getElementById('hud-health-fill');
  const arFill = document.getElementById('hud-armor-fill');
  const hpText = document.getElementById('hud-hp-text');
  const arText = document.getElementById('hud-ar-text');

  if (distNameEl && state.currentDistrict) distNameEl.textContent = state.currentDistrict.name;
  if (clockEl) {
    const hrs = Math.floor(state.clockHour);
    const mins = Math.floor((state.clockHour % 1) * 60);
    clockEl.textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')} • GOLDEN HOUR`;
  }
  if (hpFill) hpFill.style.width = `${p.health}%`;
  if (arFill) arFill.style.width = `${p.armor}%`;
  if (hpText) hpText.textContent = `HP ${Math.round(p.health)}%`;
  if (arText) arText.textContent = `ARMOR ${Math.round(p.armor)}%`;

  renderMinimap(state);
  updateDialogueUI(state);

  // Context Action Prompt & Speedometer
  const promptText = document.getElementById('prompt-text');
  const speedEl = document.getElementById('hud-speed');
  const gearEl = document.getElementById('hud-gear');
  const rpmFill = document.getElementById('hud-rpm-fill');
  const vehNameEl = document.getElementById('hud-vehicle-name');
  const vehClsEl = document.getElementById('hud-vehicle-class');
  const radioEl = document.getElementById('hud-radio');

  const activeCar = state.entities.vehicles.find((v) => v.id === p.vehicleId);
  if (p.inVehicle && activeCar) {
    if (promptText) promptText.textContent = `DRIVING ${activeCar.name.toUpperCase()} • [F] EXIT • [SPACE] DRIFT`;
    if (speedEl) speedEl.textContent = String(activeCar.mph || 0);
    if (gearEl) gearEl.textContent = `GEAR ${activeCar.gear || 1}`;
    if (rpmFill) rpmFill.style.width = `${activeCar.rpm || 35}%`;
    if (vehNameEl) vehNameEl.textContent = activeCar.name.toUpperCase();
    if (vehClsEl) vehClsEl.textContent = `${activeCar.cls} • ${activeCar.hp}% HP`;
  } else {
    // Check nearest vehicle to hijack
    let nearCar = null;
    let bestD = 9.5;
    for (let i = 0; i < state.entities.vehicles.length; i++) {
      const v = state.entities.vehicles[i];
      const d = Math.hypot(v.x - p.x, v.z - p.z);
      if (d < bestD) {
        bestD = d;
        nearCar = v;
      }
    }
    if (promptText) {
      promptText.textContent = nearCar
        ? `HIJACK ${nearCar.name.toUpperCase()} (${Math.round(bestD)}m) • [LMB] FIRE WEAPON`
        : `ON FOOT COMBAT • [LMB] FIRE ${wep.name} • [1-6] SWITCH WEAPON`;
    }
    if (speedEl) speedEl.textContent = '14';
    if (gearEl) gearEl.textContent = 'ON FOOT';
    if (rpmFill) rpmFill.style.width = '42%';
    if (vehNameEl) vehNameEl.textContent = nearCar ? `NEAR: ${nearCar.name.toUpperCase()}` : 'DANI VEGA • ON FOOT';
    if (vehClsEl) vehClsEl.textContent = 'TACTICAL SPRINT';
  }

  if (radioEl) {
    const st = RADIO_STATIONS[state.radio.stationIndex % RADIO_STATIONS.length];
    radioEl.textContent = state.radio.muted ? '♪ RADIO MUTED' : `♪ ${st.freq} ${st.name}`;
  }
}
