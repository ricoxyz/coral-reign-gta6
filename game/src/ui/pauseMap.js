// Full-Screen 3-Column Pause Dashboard: Progression Ring, 6-District Map, Career Stats & 3 Save Slots
import { DISTRICTS } from '../world/districts.js';
import { ROAD_X, ROAD_Z } from '../world/roads.js';
import { STORY_MISSIONS } from '../gameplay/missions.js';
import { STREET_RACES } from '../gameplay/activities.js';

export function renderFullPauseMap(state, saveSystem) {
  const modal = document.getElementById('pause-map-modal');
  if (!modal) return;

  if (state.mode === 'pause_map') {
    modal.classList.add('visible');
  } else {
    modal.classList.remove('visible');
    return;
  }

  // Left Column: Completion Ring & Breakdown
  const pct = state.stats.completionPct;
  const pctEl = document.getElementById('pause-completion-pct');
  if (pctEl) pctEl.textContent = `${pct.toFixed(1)}%`;

  const arcEl = document.getElementById('completion-ring-arc');
  if (arcEl) {
    const circ = 251.3;
    arcEl.setAttribute('stroke-dashoffset', String((circ * (1 - pct / 100)).toFixed(1)));
  }

  const progMissions = document.getElementById('prog-missions');
  const progRaces = document.getElementById('prog-races');
  const progStunts = document.getElementById('prog-stunts');
  const progShells = document.getElementById('prog-shells');
  if (progMissions) progMissions.textContent = `${state.stats.missionsDone} / ${state.stats.missionsTotal}`;
  if (progRaces) progRaces.textContent = `${state.stats.racesWon} / ${state.stats.racesTotal}`;
  if (progStunts) progStunts.textContent = `${state.stats.stuntsCompleted} / ${state.stats.stuntsTotal}`;
  if (progShells) progShells.textContent = `${state.stats.shellsCollected} / ${state.stats.shellsTotal}`;

  // Mission Ratings (G / S / B / ACTIVE / OPEN)
  const mGrid = document.getElementById('pause-mission-grid');
  if (mGrid) {
    const mHtml = STORY_MISSIONS.map(
      (m) => `
      <div class="mission-item">
        <span>${m.num}. ${m.title}</span>
        <span class="medal ${m.medal}">${m.medal}</span>
      </div>`
    ).join('');
    if (mGrid._lastHtml !== mHtml) {
      mGrid._lastHtml = mHtml;
      mGrid.innerHTML = mHtml;
    }
  }

  // Right Column: Career Stats & 3 Save Slots
  const nwEl = document.getElementById('stat-networth');
  const shEl = document.getElementById('stat-shells');
  if (nwEl) nwEl.textContent = `$${state.player.cash.toLocaleString()}`;
  if (shEl) shEl.textContent = `${state.stats.shellsCollected} / ${state.stats.shellsTotal}`;
  saveSystem.renderSaveSlotsInto('pause-save-slots', 'pause');

  // Center Column: 6-District Palma Dorada City Cartography Canvas
  const canvas = document.getElementById('full-map-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#071224';
  ctx.fillRect(0, 0, w, h);

  const tx = (wx) => ((wx + 480) / 900) * w;
  const ty = (wz) => ((wz + 540) / 1100) * h;

  // Ocean & Golden Beach on East coast
  ctx.fillStyle = '#053252';
  ctx.fillRect(tx(265), 0, w - tx(265), h);
  ctx.fillStyle = '#d8b47c';
  ctx.fillRect(tx(230), 0, tx(265) - tx(230), h);

  // 6 Colored District Zones & Labels
  for (let i = 0; i < DISTRICTS.length; i++) {
    const d = DISTRICTS[i];
    const b = d.bounds;
    const x0 = tx(b.minX);
    const y0 = ty(b.minZ);
    const dw = tx(b.maxX) - x0;
    const dh = ty(b.maxZ) - y0;

    ctx.fillStyle = `${d.color}24`;
    ctx.strokeStyle = d.color;
    ctx.lineWidth = 1.5;
    ctx.fillRect(x0, y0, dw, dh);
    ctx.strokeRect(x0, y0, dw, dh);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 11px "Segoe UI", sans-serif';
    ctx.fillText(d.name, x0 + 7, y0 + 16);
  }

  // Arterial Road Grid
  ctx.strokeStyle = 'rgba(215, 232, 255, 0.36)';
  ctx.lineWidth = 3;
  for (let i = 0; i < ROAD_X.length; i++) {
    const rx = tx(ROAD_X[i]);
    ctx.beginPath();
    ctx.moveTo(rx, 0);
    ctx.lineTo(rx, h);
    ctx.stroke();
  }
  for (let j = 0; j < ROAD_Z.length; j++) {
    const rz = ty(ROAD_Z[j]);
    ctx.beginPath();
    ctx.moveTo(0, rz);
    ctx.lineTo(w, rz);
    ctx.stroke();
  }

  // GPS Route Line
  const px = tx(state.player.x);
  const py = ty(state.player.z);
  const wp = state.mission.waypoint;
  if (wp) {
    const wx = tx(wp.x);
    const wy = ty(wp.z);
    ctx.strokeStyle = '#4eff91';
    ctx.lineWidth = 3.5;
    ctx.setLineDash([7, 4]);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(wx, wy);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 24 Golden Shells
  const shells = state.entities.collectibles || [];
  for (let i = 0; i < shells.length; i++) {
    const s = shells[i];
    ctx.fillStyle = s.collected ? 'rgba(255, 209, 102, 0.35)' : '#ffd166';
    ctx.beginPath();
    ctx.arc(tx(s.x), ty(s.z), 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5 Street Races
  for (let i = 0; i < STREET_RACES.length; i++) {
    const r = STREET_RACES[i];
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(tx(r.x) - 4, ty(r.z) - 4, 8, 8);
  }

  // 10 Story Heists
  for (let i = 0; i < STORY_MISSIONS.length; i++) {
    const m = STORY_MISSIONS[i];
    const mx = tx(m.waypoint.x);
    const my = ty(m.waypoint.z);
    ctx.fillStyle = m.medal === 'ACTIVE' ? '#ff4d79' : '#ffbf3c';
    ctx.beginPath();
    ctx.arc(mx, my, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#050c18';
    ctx.font = '900 9px "Segoe UI", sans-serif';
    ctx.fillText(m.num, mx - 5.5, my + 3);
  }

  // Player Marker
  ctx.fillStyle = '#4eff91';
  ctx.beginPath();
  ctx.arc(px, py, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
}
