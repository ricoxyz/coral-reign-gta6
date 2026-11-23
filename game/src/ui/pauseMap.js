// Full-Screen Interactive City Map of Palma Dorada (6 Districts, 10 Missions, Races, Stunts, Shells, Save Slots)
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

  // Populate 10 Story Missions Grid with Medals (G / S / ACTIVE / OPEN)
  const mGrid = document.getElementById('pause-mission-grid');
  if (mGrid) {
    mGrid.innerHTML = STORY_MISSIONS.map(
      (m) => `
      <div class="mission-item">
        <span>${m.num}. ${m.title}</span>
        <span class="medal ${m.medal}">${m.medal}</span>
      </div>`
    ).join('');
  }

  // Update Career Ledger Stats
  const pctEl = document.getElementById('pause-completion-pct');
  if (pctEl) pctEl.textContent = `${state.stats.completionPct}% COMPLETE`;

  // Populate 3 Save Slots
  saveSystem.renderSaveSlotsInto('pause-save-slots');

  // Render High-Contrast Interactive City Cartography Canvas
  const canvas = document.getElementById('full-map-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#071224';
  ctx.fillRect(0, 0, w, h);

  // Coordinate transform: world X [-480..420], world Z [-540..560]
  const tx = (wx) => ((wx + 480) / 900) * w;
  const ty = (wz) => ((wz + 540) / 1100) * h;

  // Draw Ocean & Golden Beach on East coast
  ctx.fillStyle = '#052c47';
  ctx.fillRect(tx(265), 0, w - tx(265), h);
  ctx.fillStyle = '#d8b47c';
  ctx.fillRect(tx(230), 0, tx(265) - tx(230), h);

  // Draw 6 Colored District Zones & Labels
  for (let i = 0; i < DISTRICTS.length; i++) {
    const d = DISTRICTS[i];
    const b = d.bounds;
    const x0 = tx(b.minX);
    const y0 = ty(b.minZ);
    const dw = tx(b.maxX) - x0;
    const dh = ty(b.maxZ) - y0;

    ctx.fillStyle = `${d.color}22`;
    ctx.strokeStyle = d.color;
    ctx.lineWidth = 1.5;
    ctx.fillRect(x0, y0, dw, dh);
    ctx.strokeRect(x0, y0, dw, dh);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 12px "Segoe UI", sans-serif';
    ctx.fillText(d.name, x0 + 8, y0 + 18);
  }

  // Draw Arterial Road Grid
  ctx.strokeStyle = 'rgba(210, 228, 255, 0.35)';
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

  // Draw GPS Route Line from Player to Active Heist Waypoint
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

  // Plot 24 Golden Shell Collectibles
  const shells = state.entities.collectibles || [];
  for (let i = 0; i < shells.length; i++) {
    const s = shells[i];
    ctx.fillStyle = s.collected ? 'rgba(255, 209, 102, 0.35)' : '#ffd166';
    ctx.beginPath();
    ctx.arc(tx(s.x), ty(s.z), 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Plot 5 Street Races (Cyan Diamonds)
  for (let i = 0; i < STREET_RACES.length; i++) {
    const r = STREET_RACES[i];
    const rx = tx(r.x);
    const ry = ty(r.z);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(rx - 4, ry - 4, 8, 8);
  }

  // Plot 10 Story Heist Icons (Gold Circles with numbers)
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
    ctx.fillText(m.num, mx - 5, my + 3);
  }

  // Plot Player Marker
  ctx.fillStyle = '#4eff91';
  ctx.beginPath();
  ctx.arc(px, py, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
}
