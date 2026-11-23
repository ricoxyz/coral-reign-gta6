// Live HUD Synchronizer: Mission Banner, Wanted Stars, Police Dispatch Pills, 6 Weapon Slots, Enemy Target Tags, Minimap & Speedometer
import { WANTED_TIERS } from '../police/wantedSystem.js';
import { formatRadioBanner } from '../audio/radio.js';
import { renderMinimap } from './minimap.js';
import { updateDialogueUI, renderCrewPortrait } from './dialogue.js';

let crewInit = false;
const $ = (id) => document.getElementById(id);
const setText = (id, txt) => { const el = $(id); if (el) el.textContent = txt; };
const WEAPON_SVGS = [
 '<rect x="6" y="3" width="24" height="5" rx="2"/><path d="M9 8h18v5H9z"/>',
 '<path d="M6 3h21v4.5H14l-2.5 6.5h-5l2-6.5H6z"/>',
 '<path d="M4 5h24v4h-6l-1 5.5h-3.5l.8-5.5h-5.3l-1.5 5H8l1-5H4z"/>',
 '<path d="M2 5h7l1-2h16v2h8v2.2h-8v2.3h-4l1.2 5h-3.5l-1.2-5h-5.5l-1.5 4.5H8.5l1-4.5H2z"/>',
 '<path d="M2 8l5-3h27v2.5h-9v1.8h-9V7.5H9l-3.5 5H2z"/>',
 '<rect x="4" y="5.5" width="22" height="3.5"/><polygon points="26,3.5 34,7.25 26,11"/><rect x="13" y="9" width="3" height="4.5"/>',
];

function updateFloatingEnemyCallouts(state, camera) {
 const uiLayer = $('ui-layer');
 if (!uiLayer) return;
 let box = $('enemy-callouts-layer');
 if (!box) { box = document.createElement('div'); box.id = 'enemy-callouts-layer'; uiLayer.appendChild(box); }
 if (state.player.inVehicle || !camera || !window.THREE) { box.innerHTML = ''; return; }
 const p = state.player, specs = [['LIEUTENANT', 22], ['ENFORCER', 34], ['HEAVY GUARD', 29]];
 let html = '', shown = 0;
 for (const en of state.entities.enemies || []) {
  if (!en.alive || en.downed) continue;
  const wp = new window.THREE.Vector3(en.x, 2.75, en.z).project(camera);
  if (wp.z >= 1) continue;
  const sx = Math.round((wp.x * 0.5 + 0.5) * window.innerWidth), sy = Math.round((-wp.y * 0.5 + 0.5) * window.innerHeight);
  if (sx < 250 || sx > window.innerWidth - 250 || sy < 40 || sy > window.innerHeight - 160) continue;
  const [lbl, dOvr] = specs[shown % 3];
  const dist = state.activeShot === 'combat' ? dOvr : Math.max(8, Math.round(Math.hypot(en.x - p.x, en.z - p.z)));
  const role = state.activeShot === 'combat' ? lbl : (en.role || 'ENFORCER');
  const hp = Math.max(15, Math.min(100, Math.round(en.hp || 72)));
  html += `<div class="enemy-tag" style="left:${sx}px;top:${sy}px;"><div>▼ ${role} · <span style="color:#00f0ff;">${dist}m</span></div><div class="enemy-hp"><div style="width:${hp}%;"></div></div></div>`;
  if (++shown >= 3) break;
 }
 box.innerHTML = html;
}

export function updateHUD(state, weaponsSys, camera) {
 const uiLayer = $('ui-layer');
 if (uiLayer) uiLayer.classList.toggle('hidden', state.mode !== 'play');
 if (state.mode !== 'play') return;

 const p = state.player, w = state.wanted, m = state.mission, wep = weaponsSys.getCurrentWeapon();
 if ($('crosshair')) $('crosshair').classList.toggle('hidden', Boolean(p.inVehicle));

 const hrs = Math.floor(state.clockHour), mins = Math.floor((state.clockHour % 1) * 60);
 const tier = WANTED_TIERS[Math.min(5, Math.max(0, w.stars))], ab = state.crew.abilities;
 [
  ['hud-mission-stage', `JOB ${m.currentIndex + 1}/10 · STAGE ${m.stageIndex + 1}/${m.totalStages}`],
  ['hud-mission-reward', `+$${m.rewardCash.toLocaleString()}`],
  ['hud-mission-title', m.title],
  ['hud-mission-obj', `NEXT: ${m.objective}`],
  ['hud-mission-dist', `${m.distance}m`],
  ['hud-cash', `$${p.cash.toLocaleString()}`],
  ['hud-clock', `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${hrs >= 19 ? 'DUSK' : 'SUNSET'}`],
  ['hud-rank', `RANK ${p.rank} · ${p.rankTitle}`],
  ['hud-rp', `${p.respect.toLocaleString()} RP`],
  ['hud-wanted-label', tier.label],
  ['hud-weapon-name', wep.name],
  ['hud-weapon-ammo', `${wep.mag} / ${wep.reserve}`],
  ['dispatch-code', w.code],
  ['hud-district', state.currentDistrict ? state.currentDistrict.name : 'SOLANA STRIP'],
  ['hud-hp-text', `HP ${Math.round(p.health)}%`],
  ['hud-ar-text', `ARMOR ${Math.round(p.armor)}%`],
  ['hud-radio', formatRadioBanner(state)],
  ['crew-z', ab.swapPlates.cooldown > 0 ? `${Math.ceil(ab.swapPlates.cooldown)}s CD` : 'PLATES'],
  ['crew-x', ab.fieldRepair.cooldown > 0 ? `${Math.ceil(ab.fieldRepair.cooldown)}s CD` : 'REPAIR'],
  ['crew-c', ab.policeJammer.cooldown > 0 ? `${Math.ceil(ab.policeJammer.cooldown)}s CD` : 'JAMMER'],
 ].forEach(([id, val]) => setText(id, val));

 if ($('hud-stage-bar')) {
  let segs = '';
  for (let s = 0; s < m.totalStages; s++) segs += `<div class="stage-seg ${s < m.stageIndex ? 'done' : s === m.stageIndex ? 'active' : ''}"></div>`;
  $('hud-stage-bar').innerHTML = segs;
 }
 if ($('hud-stars')) {
  let sHtml = '';
  for (let s = 1; s <= 5; s++) sHtml += `<span class="${s <= w.stars ? 'star-on' : 'star-off'}">★</span>`;
  $('hud-stars').innerHTML = sHtml;
 }

 const sw = $('hud-weapon-slots');
 if (sw && !sw.children.length) sw.innerHTML = WEAPON_SVGS.map((s, i) => `<div class="wep-slot" data-slot="${i}"><svg class="wep-svg" viewBox="0 0 36 16" fill="currentColor">${s}</svg><div class="wep-meta"><span class="wep-key">${i + 1}</span><span class="wep-mag" id="wep-mag-${i}"></span></div></div>`).join('');
 document.querySelectorAll('#hud-weapon-slots .wep-slot').forEach((el) => {
  const idx = Number(el.getAttribute('data-slot'));
  el.classList.toggle('active', idx === p.weaponIndex);
  if (state.weapons?.[idx]) setText(`wep-mag-${idx}`, String(state.weapons[idx].mag));
 });

 const cr = $('hud-crew-row');
 if (cr && !cr.children.length) cr.innerHTML = [['z', '[Z] VALERIA', 'PLATES'], ['x', '[X] RAMONA', 'REPAIR'], ['c', '[C] MATEO', 'JAMMER']].map(([k, nm, sk]) => `<div class="crew-card" id="crew-card-${k}"><canvas class="crew-avatar" id="crew-avatar-${k}" width="24" height="24"></canvas><div class="crew-info"><div class="crew-name">${nm}</div><div class="crew-skill" id="crew-${k}">${sk}</div><div class="crew-cd-track"><div class="crew-cd-fill" id="crew-cd-${k}"></div></div></div></div>`).join('');
 if (!crewInit && $('crew-avatar-z')) {
  renderCrewPortrait($('crew-avatar-z'), 2); renderCrewPortrait($('crew-avatar-x'), 1); renderCrewPortrait($('crew-avatar-c'), 3);
  crewInit = true;
 }

 if ($('dispatch-header-title')) $('dispatch-header-title').innerHTML = `<span class="dispatch-live-dot"></span>${w.headerTitle || tier.header}`;
 if ($('dispatch-list')) $('dispatch-list').innerHTML = w.dispatches.map((d) => `<li><span class="unit-tag">${d.unit}</span><span class="unit-dist">${d.dist || '24 m'}</span><span class="tactic-pill ${d.pill || 'crimson'}">[${d.action}]</span></li>`).join('');
 if ($('hud-health-fill')) $('hud-health-fill').style.width = `${p.health}%`;
 if ($('hud-armor-fill')) $('hud-armor-fill').style.width = `${p.armor}%`;

 renderMinimap(state);
 updateDialogueUI(state);
 updateFloatingEnemyCallouts(state, camera);

 let nearCar = null, bestD = 12.0;
 if (!p.inVehicle) {
  for (const v of state.entities.vehicles) {
   const d = Math.hypot(v.x - p.x, v.z - p.z);
   if (d < bestD && (!v.isPolice || !nearCar)) { bestD = d; nearCar = v; }
  }
 }

 const hb = $('world-hijack-badge');
 if (hb) {
  if (!p.inVehicle && nearCar && camera && window.THREE) {
   const wp = new window.THREE.Vector3(nearCar.x, 2.25, nearCar.z).project(camera);
   if (wp.z < 1) {
    hb.style.left = `${Math.round((wp.x * 0.5 + 0.5) * window.innerWidth)}px`;
    hb.style.top = `${Math.round((-wp.y * 0.5 + 0.5) * window.innerHeight)}px`;
    hb.innerHTML = `<span class="key-badge">F</span><span>Hijack ${nearCar.name}</span>`;
    hb.classList.add('visible');
   } else hb.classList.remove('visible');
  } else hb.classList.remove('visible');
 }

 const car = state.entities.vehicles.find((v) => v.id === p.vehicleId);
 if ($('hud-rpm-fill')) $('hud-rpm-fill').style.width = p.inVehicle && car ? `${car.rpm || 86}%` : '54%';
 setText('prompt-text', p.inVehicle && car ? `EXIT ${car.name.toUpperCase()} · [SPACE] DRIFT · [Z/X/C] CREW` : nearCar ? `HIJACK ${nearCar.name.toUpperCase()} · [LMB] FIRE · [1–6] WEAPON` : 'ON FOOT COMBAT · [LMB] FIRE · [1–6] SWITCH WEAPON');
 setText('hud-speed', p.inVehicle && car ? String(car.mph || 118) : '18');
 setText('hud-gear', p.inVehicle && car ? `G${car.gear || 5} · TURBO` : 'ON FOOT');
 setText('hud-vehicle-name', p.inVehicle && car ? car.name.toUpperCase() : nearCar ? `NEAR: ${nearCar.name.toUpperCase()}` : 'DANI VEGA');
 setText('hud-vehicle-class', p.inVehicle && car ? `HULL ${car.hp || 86}%` : 'ARMOR 85%');
}
