// Live HUD Synchronizer: Mission Banner, Wanted Stars, Police Dispatch, 6 Weapon Slots, Minimap & Speedometer
import { WANTED_TIERS } from '../police/wantedSystem.js';
import { RADIO_STATIONS } from '../audio/radio.js';
import { renderMinimap } from './minimap.js';
import { updateDialogueUI, renderCrewPortrait } from './dialogue.js';

let crewPortraitsInitialized = false;

export function updateHUD(state, weaponsSys, camera) {
  const uiLayer = document.getElementById('ui-layer');
  if (uiLayer) {
    uiLayer.classList.toggle('hidden', state.mode !== 'play');
  }
  if (state.mode !== 'play') return;

  const p = state.player;
  const w = state.wanted;
  const m = state.mission;

  // Crosshair only visible on foot
  const crosshair = document.getElementById('crosshair');
  if (crosshair) {
    crosshair.classList.toggle('hidden', Boolean(p.inVehicle));
  }

  // Mission Card (Top-Left)
  const stageEl = document.getElementById('hud-mission-stage');
  const rewardEl = document.getElementById('hud-mission-reward');
  const titleEl = document.getElementById('hud-mission-title');
  const objEl = document.getElementById('hud-mission-obj');
  const distEl = document.getElementById('hud-mission-dist');
  const stageBarEl = document.getElementById('hud-stage-bar');

  if (stageEl) {
    stageEl.textContent = `JOB ${m.currentIndex + 1}/10 · STAGE ${m.stageIndex + 1}/${m.totalStages}`;
  }
  if (rewardEl) rewardEl.textContent = `+$${m.rewardCash.toLocaleString()}`;
  if (titleEl) titleEl.textContent = m.title;
  if (objEl) objEl.textContent = `NEXT: ${m.objective}`;
  if (distEl) distEl.textContent = `${m.distance}m`;
  if (stageBarEl) {
    let segHtml = '';
    for (let s = 0; s < m.totalStages; s++) {
      const cls = s < m.stageIndex ? 'done' : s === m.stageIndex ? 'active' : '';
      segHtml += `<div class="stage-seg ${cls}"></div>`;
    }
    stageBarEl.innerHTML = segHtml;
  }

  // Top-Right Cash, Clock, Wanted Stars, Rank, 6 Weapon Slots & Crew Abilities
  const cashEl = document.getElementById('hud-cash');
  const clockEl = document.getElementById('hud-clock');
  const rankEl = document.getElementById('hud-rank');
  const rpEl = document.getElementById('hud-rp');
  const wantedLbl = document.getElementById('hud-wanted-label');
  const starsEl = document.getElementById('hud-stars');

  if (cashEl) cashEl.textContent = `$${p.cash.toLocaleString()}`;
  if (clockEl) {
    const hrs = Math.floor(state.clockHour);
    const mins = Math.floor((state.clockHour % 1) * 60);
    const period = hrs >= 19 ? 'DUSK' : 'SUNSET';
    clockEl.textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${period}`;
  }
  if (rankEl) rankEl.textContent = `RANK ${p.rank} · ${p.rankTitle}`;
  if (rpEl) rpEl.textContent = `${p.respect.toLocaleString()} RP`;

  const tier = WANTED_TIERS[Math.min(5, Math.max(0, w.stars))];
  if (wantedLbl) wantedLbl.textContent = tier.label;

  if (starsEl) {
    let starsHtml = '';
    for (let s = 1; s <= 5; s++) {
      starsHtml += `<span class="${s <= w.stars ? 'star-on' : 'star-off'}">★</span>`;
    }
    starsEl.innerHTML = starsHtml;
  }

  const wep = weaponsSys.getCurrentWeapon();
  const wepNameEl = document.getElementById('hud-weapon-name');
  const wepAmmoEl = document.getElementById('hud-weapon-ammo');
  if (wepNameEl) wepNameEl.textContent = wep.name;
  if (wepAmmoEl) wepAmmoEl.textContent = `${wep.mag} / ${wep.reserve}`;

  const slotEls = document.querySelectorAll('#hud-weapon-slots .wep-slot');
  slotEls.forEach((el) => {
    const idx = Number(el.getAttribute('data-slot'));
    el.classList.toggle('active', idx === p.weaponIndex);
    const magSpan = document.getElementById(`wep-mag-${idx}`);
    if (magSpan && state.weapons && state.weapons[idx]) {
      magSpan.textContent = String(state.weapons[idx].mag);
    }
  });

  if (!crewPortraitsInitialized) {
    const avZ = document.getElementById('crew-avatar-z');
    const avX = document.getElementById('crew-avatar-x');
    const avC = document.getElementById('crew-avatar-c');
    if (avZ && avX && avC) {
      renderCrewPortrait(avZ, 2); // Valeria
      renderCrewPortrait(avX, 1); // Rafa
      renderCrewPortrait(avC, 3); // Mateo
      crewPortraitsInitialized = true;
    }
  }

  const ab = state.crew.abilities;
  const zEl = document.getElementById('crew-z');
  const xEl = document.getElementById('crew-x');
  const cEl = document.getElementById('crew-c');
  const cdZ = document.getElementById('crew-cd-z');
  const cdX = document.getElementById('crew-cd-x');
  const cdC = document.getElementById('crew-cd-c');
  if (zEl) zEl.textContent = ab.swapPlates.cooldown > 0 ? `${Math.ceil(ab.swapPlates.cooldown)}s CD` : 'PLATES';
  if (xEl) xEl.textContent = ab.fieldRepair.cooldown > 0 ? `${Math.ceil(ab.fieldRepair.cooldown)}s CD` : 'REPAIR';
  if (cEl) cEl.textContent = ab.policeJammer.cooldown > 0 ? `${Math.ceil(ab.policeJammer.cooldown)}s CD` : 'JAMMER';
  if (cdZ) cdZ.style.width = `${Math.max(0, 100 - (ab.swapPlates.cooldown / 12) * 100)}%`;
  if (cdX) cdX.style.width = `${Math.max(0, 100 - (ab.fieldRepair.cooldown / 15) * 100)}%`;
  if (cdC) cdC.style.width = `${Math.max(0, 100 - (ab.policeJammer.cooldown / 18) * 100)}%`;

  // Tactical Police Dispatch Feed
  const codeEl = document.getElementById('dispatch-code');
  const listEl = document.getElementById('dispatch-list');
  if (codeEl) codeEl.textContent = w.code.split('•')[0].trim();
  if (listEl) {
    listEl.innerHTML = w.dispatches
      .map((d) => `<li><span class="unit-tag">${d.unit}</span><span class="unit-status">${d.action}</span></li>`)
      .join('');
  }

  // Bottom-Left District, Vitals & Minimap
  const distNameEl = document.getElementById('hud-district');
  const hpFill = document.getElementById('hud-health-fill');
  const arFill = document.getElementById('hud-armor-fill');
  const hpText = document.getElementById('hud-hp-text');
  const arText = document.getElementById('hud-ar-text');

  if (distNameEl && state.currentDistrict) distNameEl.textContent = state.currentDistrict.name;
  if (hpFill) hpFill.style.width = `${p.health}%`;
  if (arFill) arFill.style.width = `${p.armor}%`;
  if (hpText) hpText.textContent = `HP ${Math.round(p.health)}%`;
  if (arText) arText.textContent = `ARMOR ${Math.round(p.armor)}%`;

  renderMinimap(state);
  updateDialogueUI(state);

  // Nearest Vehicle & In-World Floating [F] Hijack Prompt
  const hijackBadge = document.getElementById('world-hijack-badge');
  let nearCar = null;
  let bestD = 12.0;
  if (!p.inVehicle) {
    for (let i = 0; i < state.entities.vehicles.length; i++) {
      const v = state.entities.vehicles[i];
      if (v.isPolice) continue;
      const d = Math.hypot(v.x - p.x, v.z - p.z);
      if (d < bestD) {
        bestD = d;
        nearCar = v;
      }
    }
    if (!nearCar) {
      for (let i = 0; i < state.entities.vehicles.length; i++) {
        const v = state.entities.vehicles[i];
        const d = Math.hypot(v.x - p.x, v.z - p.z);
        if (d < bestD) {
          bestD = d;
          nearCar = v;
        }
      }
    }
  }

  if (hijackBadge) {
    if (!p.inVehicle && nearCar && camera && window.THREE) {
      const worldPos = new window.THREE.Vector3(nearCar.x, 2.25, nearCar.z);
      worldPos.project(camera);
      if (worldPos.z < 1) {
        const sx = (worldPos.x * 0.5 + 0.5) * window.innerWidth;
        const sy = (-worldPos.y * 0.5 + 0.5) * window.innerHeight;
        hijackBadge.style.left = `${Math.round(sx)}px`;
        hijackBadge.style.top = `${Math.round(sy)}px`;
        hijackBadge.innerHTML = `<span class="key-badge">F</span><span>Hijack ${nearCar.name}</span>`;
        hijackBadge.classList.add('visible');
      } else {
        hijackBadge.classList.remove('visible');
      }
    } else {
      hijackBadge.classList.remove('visible');
    }
  }

  // Context Prompt & Speedometer (KM/H)
  const promptText = document.getElementById('prompt-text');
  const speedEl = document.getElementById('hud-speed');
  const gearEl = document.getElementById('hud-gear');
  const rpmFill = document.getElementById('hud-rpm-fill');
  const vehNameEl = document.getElementById('hud-vehicle-name');
  const vehClsEl = document.getElementById('hud-vehicle-class');
  const radioEl = document.getElementById('hud-radio');

  const activeCar = state.entities.vehicles.find((v) => v.id === p.vehicleId);
  if (p.inVehicle && activeCar) {
    if (promptText) promptText.textContent = `EXIT ${activeCar.name.toUpperCase()} · [SPACE] DRIFT · [Z/X/C] CREW`;
    if (speedEl) speedEl.textContent = String(activeCar.mph || 118);
    if (gearEl) gearEl.textContent = `GEAR ${activeCar.gear || 5}`;
    if (rpmFill) rpmFill.style.width = `${activeCar.rpm || 78}%`;
    if (vehNameEl) vehNameEl.textContent = activeCar.name.toUpperCase();
    if (vehClsEl) vehClsEl.textContent = `${activeCar.hp}% COND`;
  } else {
    if (promptText) {
      promptText.textContent = nearCar
        ? `HIJACK ${nearCar.name.toUpperCase()} · [LMB] FIRE · [1–6] WEAPON`
        : `ON FOOT COMBAT · [LMB] FIRE · [1–6] SWITCH WEAPON`;
    }
    if (speedEl) speedEl.textContent = '18';
    if (gearEl) gearEl.textContent = 'ON FOOT';
    if (rpmFill) rpmFill.style.width = '45%';
    if (vehNameEl) vehNameEl.textContent = nearCar ? `NEAR: ${nearCar.name.toUpperCase()}` : 'DANI VEGA';
    if (vehClsEl) vehClsEl.textContent = 'TACTICAL';
  }

  if (radioEl) {
    const st = RADIO_STATIONS[state.radio.stationIndex % RADIO_STATIONS.length];
    radioEl.textContent = state.radio.muted ? '♪ RADIO MUTED' : `♪ ${st.freq} ${st.name}`;
  }
}
