// Full-Screen 3-Column Pause Dashboard: Progression Ring, 6-District Urban Cartography, GPS Route & 3 Save Slots
import { DISTRICTS } from '../world/districts.js';
import { ROAD_X, ROAD_Z } from '../world/roads.js';
import { SAFEHOUSE_AND_SHOP_NODES } from '../world/cityBuilder.js';
import { STORY_MISSIONS } from '../gameplay/missions.js';
import { STREET_RACES } from '../gameplay/activities.js';

const B = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
const C = (c, x, y, r, col) => { c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); };
const L = (c, x1, y1, x2, y2, col, w) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); };
const $ = (id) => document.getElementById(id);

function drawBlock(ctx, id, bx, by, bw, bh, ix, iz) {
 B(ctx, bx, by, bw, bh, '#1d2d44');
 ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.lineWidth = 1; ctx.strokeRect(bx, by, bw, bh);
 const cx = bx + bw * 0.5, cy = by + bh * 0.5, m = Math.min(bw, bh);
 if (id === 'solana_strip') {
  const pal = ['#ff5e8e', '#ffb86c', '#ffd97d'];
  B(ctx, bx + 5, by + 5, bw * 0.44, bh - 7, 'rgba(8,14,26,.65)');
  B(ctx, bx + 3, by + 3, bw * 0.42, bh - 8, pal[(ix + iz) % 3]);
  B(ctx, bx + 3, by + 3, bw * 0.76, bh * 0.32, pal[(ix + iz + 1) % 3]);
  C(ctx, bx + bw * 0.68, by + bh * 0.66, m * 0.22 + 2, '#fff5db');
  C(ctx, bx + bw * 0.68, by + bh * 0.66, m * 0.22, '#00f0ff');
 } else if (id === 'coral_marina') {
  B(ctx, bx + 3, by + 3, bw - 6, bh * 0.42, '#0b4f6c');
  for (let k = 0; k < 3; k++) B(ctx, bx + 7 + k * bw * 0.28, by + 7, bw * 0.18, bh * 0.22, '#fff');
  B(ctx, bx + 4, by + bh * 0.54, bw * 0.54, bh * 0.38, '#2ec4b6');
  B(ctx, bx + bw * 0.62, by + bh * 0.54, bw * 0.3, bh * 0.38, '#ff9f1c');
 } else if (id === 'vidrio_downtown') {
  L(ctx, bx + 2, by + bh - 2, bx + bw - 2, by + 2, '#4a6182', 4);
  C(ctx, cx, cy, m * 0.3, (ix + iz) % 2 ? '#f9c74f' : '#4ea8de'); C(ctx, cx, cy, m * 0.16, '#caf0f8');
  B(ctx, bx + 3, by + 3, bw * 0.32, bh * 0.32, '#56cfe1'); B(ctx, bx + bw * 0.65, by + bh * 0.65, bw * 0.32, bh * 0.32, '#56cfe1');
 } else if (id === 'mercado_viejo') {
  L(ctx, bx, cy, bx + bw, cy, '#384b66', 3); L(ctx, cx, by, cx, by + bh, '#384b66', 3);
  ctx.fillStyle = '#f3722c'; ctx.beginPath();
  for (let a = 0; a < 8; a++) ctx.lineTo(cx + Math.cos(a * 0.785 + 0.39) * m * 0.36, cy + Math.sin(a * 0.785 + 0.39) * m * 0.36);
  ctx.closePath(); ctx.fill(); C(ctx, cx, cy, m * 0.17, '#f9c74f');
 } else if (id === 'palma_pier') {
  B(ctx, bx + 2, by + 2, bw - 4, bh - 4, '#2a4747'); C(ctx, bx + bw * 0.45, cy, m * 0.34, '#43aa8b');
  B(ctx, bx + bw * 0.55, by + 5, bw * 0.36, bh * 0.34, '#ff4d79'); B(ctx, bx + bw * 0.55, by + bh * 0.56, bw * 0.36, bh * 0.34, '#f9c74f');
 } else {
  B(ctx, bx + 1, by + 1, bw - 2, bh - 2, '#232942');
  ctx.strokeStyle = '#5c6784'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(bx + 3, by + bh - 4);
  ctx.bezierCurveTo(bx + bw * 0.85, by + bh * 0.75, bx + bw * 0.15, by + bh * 0.25, bx + bw - 3, by + 4); ctx.stroke();
  B(ctx, bx + 5, by + 5, bw * 0.36, bh * 0.28, '#c77dff'); B(ctx, bx + 9, by + 9 + bh * 0.28, bw * 0.22, bh * 0.16, '#00f0ff');
  C(ctx, bx + bw * 0.72, by + bh * 0.68, m * 0.22, '#ffb5a7');
 }
}

export function renderFullPauseMap(state, saveSystem) {
 const modal = $('pause-map-modal');
 if (!modal) return;
 if (state.mode !== 'pause_map') { modal.classList.remove('visible'); return; }
 modal.classList.add('visible');

 const st = state.stats, pct = st.completionPct, off = (251.3 * (1 - pct / 100)).toFixed(1);
 if ($('pause-ring-wrap')) $('pause-ring-wrap').innerHTML = `<svg class="ring-svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="10"/><circle id="completion-ring-arc" cx="50" cy="50" r="40" fill="none" stroke="#00f0ff" stroke-width="10" stroke-linecap="round" stroke-dasharray="251.3" stroke-dashoffset="${off}" transform="rotate(-90 50 50)"/></svg><div><div class="ring-text-big" id="pause-completion-pct">${pct.toFixed(1)}%</div><div class="ring-text-sub">COMPLETE</div></div>`;
 if ($('pause-breakdown-bars')) $('pause-breakdown-bars').innerHTML = [['Story Missions', `${st.missionsDone} / ${st.missionsTotal}`, 70], ['Street Races', `${st.racesWon} / ${st.racesTotal}`, 60], ['Stunt Jumps', `${st.stuntsCompleted} / ${st.stuntsTotal}`, 60], ['Golden Shells', `${st.shellsCollected} / ${st.shellsTotal}`, 67], ['Crew Roster', '3 / 3', 100]].map(([l, v, w]) => `<div class="prog-row"><div class="prog-lbl"><span>${l}</span><span>${v}</span></div><div class="prog-track"><div class="prog-fill" style="width:${w}%;"></div></div></div>`).join('');
 if ($('pause-mission-grid') && !$('pause-mission-grid').children.length) $('pause-mission-grid').innerHTML = STORY_MISSIONS.map((m) => `<div class="mission-item"><span>${m.num}. ${m.title}</span><span class="medal ${m.medal}">${m.medal}</span></div>`).join('');
 if ($('pause-career-grid')) $('pause-career-grid').innerHTML = [[`$${state.player.cash.toLocaleString()}`, 'SYNDICATE CASH'], [st.carsHijacked, 'CARS HIJACKED'], [st.evasions, 'POLICE EVASIONS'], [`${st.shellsCollected} / ${st.shellsTotal}`, 'GOLDEN SHELLS']].map(([v, l]) => `<div class="stat-box"><div class="stat-val">${v}</div><div class="stat-lbl">${l}</div></div>`).join('');
 if ($('pause-map-legend') && !$('pause-map-legend').children.length) $('pause-map-legend').innerHTML = [['#4eff91', '● PLAYER & GPS'], ['#ffbf3c', 'H HEISTS'], ['#00f0ff', 'S SAFEHOUSES'], ['#ff7e29', 'P MOD SHOPS'], ['#b978ff', 'R RACES'], ['#ff4d79', '★ POLICE HQ']].map(([c, t]) => `<span style="color:${c};">${t}</span>`).join('');
 saveSystem.renderSaveSlotsInto('pause-save-slots', 'pause');

 const canvas = $('full-map-canvas');
 if (!canvas) return;
 const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
 B(ctx, 0, 0, w, h, '#0e1b2e');
 const tx = (wx) => ((wx + 480) / 900) * w, ty = (wz) => ((wz + 540) / 1100) * h;
 const beach = tx(232), surf = tx(268), og = ctx.createLinearGradient(surf, 0, w, 0);
 og.addColorStop(0, '#1ee3cf'); og.addColorStop(0.35, '#00b4d8'); og.addColorStop(1, '#005f99');
 B(ctx, surf, 0, w - surf, h, og); B(ctx, beach, 0, surf - beach, h, '#f7d794'); B(ctx, surf - 2, 0, 3.5, h, '#fff');

 for (let pf = 0; pf < 5; pf++) {
  const py = ty(-505 + pf * 28);
  B(ctx, beach - 6, py, 52, 6, '#c8d6e5'); B(ctx, beach + 14, py - 5, 14, 4, '#fff'); B(ctx, beach + 32, py + 7, 14, 4, '#fff');
 }
 const pierY = ty(365);
 B(ctx, beach - 4, pierY - 12, 64, 24, '#c98a5b'); C(ctx, beach + 44, pierY, 9, '#ff4d79'); C(ctx, beach + 44, pierY, 5, '#00f0ff');
 for (const d of DISTRICTS) B(ctx, tx(d.bounds.minX), ty(d.bounds.minZ), tx(d.bounds.maxX) - tx(d.bounds.minX), ty(d.bounds.maxZ) - ty(d.bounds.minZ), `${d.color}20`);

 const gx = [-440, ...ROAD_X], gz = [-530, ...ROAD_Z, 550];
 for (let ix = 0; ix < gx.length - 1; ix++) {
  for (let iz = 0; iz < gz.length - 1; iz++) {
   const cx = (gx[ix] + gx[ix + 1]) * 0.5, cz = (gz[iz] + gz[iz + 1]) * 0.5;
   const dist = DISTRICTS.find((d) => cx >= d.bounds.minX && cx <= d.bounds.maxX && cz >= d.bounds.minZ && cz <= d.bounds.maxZ);
   const bx = tx(gx[ix]) + 5, by = ty(gz[iz]) + 5, bw = tx(gx[ix + 1]) - tx(gx[ix]) - 10, bh = ty(gz[iz + 1]) - ty(gz[iz]) - 10;
   if (bw > 6 && bh > 6) drawBlock(ctx, dist ? dist.id : 'vidrio_downtown', bx, by, bw, bh, ix, iz);
  }
 }

 for (const rx of ROAD_X) L(ctx, tx(rx), 0, tx(rx), h, '#34435a', 6.2);
 for (const rz of ROAD_Z) L(ctx, 0, ty(rz), surf, ty(rz), '#34435a', 6.2);

 for (const d of DISTRICTS) {
  const x0 = tx(d.bounds.minX), y0 = ty(d.bounds.minZ), lblY = d.id === 'solana_strip' ? y0 + 28 : y0 + 5;
  ctx.strokeStyle = d.color; ctx.lineWidth = 2.2; ctx.strokeRect(x0, y0, tx(d.bounds.maxX) - x0, ty(d.bounds.maxZ) - y0);
  ctx.font = '900 10.5px "Segoe UI", sans-serif';
  const tw = ctx.measureText(d.name).width;
  B(ctx, x0 + 5, lblY, tw + 12, 17, 'rgba(8,15,28,.92)'); ctx.strokeRect(x0 + 5, lblY, tw + 12, 17);
  ctx.fillStyle = '#fff'; ctx.fillText(d.name, x0 + 11, lblY + 12);
 }

 const px = tx(state.player.x), py = ty(state.player.z), wp = state.mission.waypoint;
 if (wp) {
  const wx = tx(wp.x), wy = ty(wp.z), midY = (py + wy) * 0.5;
  ctx.strokeStyle = 'rgba(255,77,121,.55)'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, midY); ctx.lineTo(wx, wy); ctx.stroke();
  ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 3.2; ctx.setLineDash([7, 4]); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, midY); ctx.lineTo(wx, wy); ctx.stroke(); ctx.setLineDash([]);
  B(ctx, px + 12, midY - 8, 118, 18, 'rgba(8,15,28,.94)'); ctx.strokeRect(px + 12, midY - 8, 118, 18);
  ctx.fillStyle = '#00f0ff'; ctx.font = '900 9.5px "Segoe UI", sans-serif'; ctx.fillText('GPS ROUTE · 0.84 KM', px + 19, midY + 4.5);
 }

 ctx.textAlign = 'center'; ctx.font = '900 9.5px "Segoe UI", sans-serif';
 for (const n of SAFEHOUSE_AND_SHOP_NODES) {
  B(ctx, tx(n.x) - 7, ty(n.z) - 7, 14, 14, n.code === 'S' ? '#00f0ff' : n.code === 'P' ? '#ff7e29' : '#ff4d79');
  ctx.fillStyle = '#050c18'; ctx.fillText(n.code, tx(n.x), ty(n.z) + 3.5);
 }
 for (const r of STREET_RACES) { C(ctx, tx(r.x), ty(r.z), 7.5, '#b978ff'); ctx.fillStyle = '#fff'; ctx.fillText('R', tx(r.x), ty(r.z) + 3); }
 for (const m of STORY_MISSIONS) {
  C(ctx, tx(m.waypoint.x), ty(m.waypoint.z), 8.5, m.medal === 'ACTIVE' ? '#ff4d79' : '#ffbf3c');
  ctx.fillStyle = '#050c18'; ctx.fillText(m.medal === 'ACTIVE' ? 'H' : m.num, tx(m.waypoint.x), ty(m.waypoint.z) + 3);
 }
 ctx.textAlign = 'left'; C(ctx, px, py, 7.5, '#4eff91');
}
