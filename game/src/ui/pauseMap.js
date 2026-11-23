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

const DISTRICT_BLOCK_THEME = {
 coral_marina: { base: '#1a525c', court: '#198699', roofs: ['#4be8cc', '#75f2da', '#2ec4b6'], acc: '#c9fff5' },
 solana_strip: { base: '#592640', court: '#1696ab', roofs: ['#ff6e96', '#ff94b3', '#ff9978'], acc: '#ffd6e2' },
 vidrio_downtown: { base: '#1b4069', court: '#276094', roofs: ['#5cb8ff', '#85ccff', '#3fa2eb'], acc: '#d4eeff' },
 mercado_viejo: { base: '#593716', court: '#75461b', roofs: ['#ffbe4d', '#ffd46b', '#ff993b'], acc: '#fff0c2' },
 palma_pier: { base: '#194d36', court: '#236b4b', roofs: ['#4be88c', '#76f2a8', '#29c46b'], acc: '#ccffe0' },
 mirador_heights: { base: '#3d2a61', court: '#533982', roofs: ['#bf8cff', '#d4b0ff', '#a16ef5'], acc: '#ebd9ff' },
};

function drawBlock(ctx, id, bx, by, bw, bh, ix, iz) {
 const theme = DISTRICT_BLOCK_THEME[id] || DISTRICT_BLOCK_THEME.vidrio_downtown;
 B(ctx, bx, by, bw, bh, theme.base);
 ctx.strokeStyle = 'rgba(255,255,255,.16)'; ctx.lineWidth = 1; ctx.strokeRect(bx, by, bw, bh);

 const pad = 3.5, iw = bw - pad * 2, ih = bh - pad * 2;
 if (iw < 8 || ih < 8) return;

 const roof = (rx, ry, rw, rh, fill) => {
  B(ctx, rx + 2, ry + 2, rw, rh, 'rgba(5,10,20,0.42)');
  B(ctx, rx, ry, rw, rh, fill);
  B(ctx, rx, ry, rw, 2.5, theme.acc);
 };

 const r0 = theme.roofs[(ix + iz) % 3], r1 = theme.roofs[(ix + iz + 1) % 3], r2 = theme.roofs[(ix + iz + 2) % 3];
 if (id === 'solana_strip') {
  roof(bx + pad, by + pad, iw * 0.46, ih * 0.54, r0);
  roof(bx + pad + iw * 0.52, by + pad, iw * 0.48, ih * 0.44, r1);
  B(ctx, bx + pad + iw * 0.54, by + pad + ih * 0.52, iw * 0.44, ih * 0.44, theme.court);
  roof(bx + pad, by + pad + ih * 0.62, iw * 0.46, ih * 0.36, r2);
 } else if (id === 'coral_marina') {
  roof(bx + pad, by + pad, iw * 0.58, ih * 0.46, r0);
  roof(bx + pad + iw * 0.64, by + pad, iw * 0.36, ih * 0.94, r1);
  B(ctx, bx + pad, by + pad + ih * 0.52, iw * 0.58, ih * 0.44, theme.court);
  roof(bx + pad + 4, by + pad + ih * 0.6, iw * 0.42, ih * 0.26, r2);
 } else if (id === 'vidrio_downtown') {
  roof(bx + pad, by + pad, iw * 0.46, ih * 0.46, r0);
  roof(bx + pad + iw * 0.52, by + pad, iw * 0.48, ih * 0.54, r1);
  roof(bx + pad, by + pad + ih * 0.54, iw * 0.46, ih * 0.44, r2);
  B(ctx, bx + pad + iw * 0.54, by + pad + ih * 0.6, iw * 0.44, ih * 0.36, theme.court);
 } else if (id === 'mercado_viejo') {
  roof(bx + pad, by + pad, iw * 0.46, ih * 0.44, r0);
  roof(bx + pad + iw * 0.52, by + pad, iw * 0.48, ih * 0.44, r1);
  roof(bx + pad, by + pad + ih * 0.52, iw * 0.98, ih * 0.44, r2);
  B(ctx, bx + pad + iw * 0.3, by + pad + ih * 0.34, iw * 0.4, ih * 0.3, theme.court);
 } else if (id === 'palma_pier') {
  roof(bx + pad, by + pad, iw * 0.5, ih * 0.48, r0);
  roof(bx + pad + iw * 0.54, by + pad + ih * 0.46, iw * 0.44, ih * 0.5, r1);
  roof(bx + pad, by + pad + ih * 0.56, iw * 0.46, ih * 0.4, r2);
 } else {
  roof(bx + pad, by + pad, iw * 0.5, ih * 0.46, r0);
  roof(bx + pad + iw * 0.54, by + pad, iw * 0.44, ih * 0.42, r1);
  roof(bx + pad + iw * 0.46, by + pad + ih * 0.52, iw * 0.52, ih * 0.44, r2);
  B(ctx, bx + pad, by + pad + ih * 0.54, iw * 0.4, ih * 0.4, theme.court);
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
 for (const d of DISTRICTS) B(ctx, tx(d.bounds.minX), ty(d.bounds.minZ), tx(d.bounds.maxX) - tx(d.bounds.minX), ty(d.bounds.maxZ) - ty(d.bounds.minZ), `${d.color}30`);

 const gx = [-440, ...ROAD_X], gz = [-530, ...ROAD_Z, 550];
 for (let ix = 0; ix < gx.length - 1; ix++) {
  for (let iz = 0; iz < gz.length - 1; iz++) {
   const cx = (gx[ix] + gx[ix + 1]) * 0.5, cz = (gz[iz] + gz[iz + 1]) * 0.5;
   const dist = DISTRICTS.find((d) => cx >= d.bounds.minX && cx <= d.bounds.maxX && cz >= d.bounds.minZ && cz <= d.bounds.maxZ);
   const bx = tx(gx[ix]) + 4.5, by = ty(gz[iz]) + 4.5, bw = tx(gx[ix + 1]) - tx(gx[ix]) - 9, bh = ty(gz[iz + 1]) - ty(gz[iz]) - 9;
   if (bw > 6 && bh > 6) drawBlock(ctx, dist ? dist.id : 'vidrio_downtown', bx, by, bw, bh, ix, iz);
  }
 }

 for (const rx of ROAD_X) L(ctx, tx(rx), 0, tx(rx), h, '#243247', 6.2);
 for (const rz of ROAD_Z) L(ctx, 0, ty(rz), surf, ty(rz), '#243247', 6.2);

 for (const d of DISTRICTS) {
  const x0 = tx(d.bounds.minX), y0 = ty(d.bounds.minZ), lblY = d.id === 'solana_strip' ? y0 + 28 : y0 + 5;
  ctx.save();
  ctx.strokeStyle = `${d.color}88`; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]);
  ctx.strokeRect(x0, y0, tx(d.bounds.maxX) - x0, ty(d.bounds.maxZ) - y0);
  ctx.restore();
  ctx.font = '900 10.5px "Segoe UI", sans-serif';
  const tw = ctx.measureText(d.name).width;
  B(ctx, x0 + 5, lblY, tw + 14, 18, 'rgba(6,12,24,.94)');
  ctx.strokeStyle = d.color; ctx.lineWidth = 1.6; ctx.strokeRect(x0 + 5, lblY, tw + 14, 18);
  ctx.fillStyle = '#fff'; ctx.fillText(d.name, x0 + 12, lblY + 12.5);
 }

 // Clean street-grid GPS route turning cleanly along arterial avenues
 const px = tx(state.player.x), py = ty(state.player.z), wp = state.mission.waypoint;
 if (wp) {
  const nearest = (arr, v) => arr.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));
  const sx = tx(nearest(ROAD_X, state.player.x)), sz = ty(nearest(ROAD_Z, (state.player.z + wp.z) * 0.5));
  const ex = tx(nearest(ROAD_X, wp.x)), wx = tx(wp.x), wy = ty(wp.z);
  const pts = [[px, py], [sx, py], [sx, sz], [ex, sz], [ex, wy], [wx, wy]];

  const tracePath = () => {
   ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
   for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  };
  ctx.save();
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(255,46,128,0.42)'; ctx.lineWidth = 9.5; tracePath(); ctx.stroke();
  ctx.strokeStyle = '#ff3b82'; ctx.lineWidth = 4.6; tracePath(); ctx.stroke();
  ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 2.2; ctx.setLineDash([8, 5]); tracePath(); ctx.stroke();
  ctx.restore();

  const lblX = Math.min(w - 134, Math.max(8, (sx + ex) * 0.5 - 56));
  const lblY = sz - 22;
  B(ctx, lblX, lblY, 118, 18, 'rgba(7,13,26,.95)');
  ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 1.4; ctx.strokeRect(lblX, lblY, 118, 18);
  ctx.fillStyle = '#00f0ff'; ctx.font = '900 9.5px "Segoe UI", sans-serif'; ctx.fillText('GPS ROUTE · 0.84 KM', lblX + 7, lblY + 12.5);
 }

 // Crisp compact POI pins (H, S, P, R)
 const pinCircle = (x, y, r, fill, text, txtCol = '#050c18') => {
  C(ctx, x, y, r + 1.5, '#071224');
  C(ctx, x, y, r, fill);
  ctx.fillStyle = txtCol; ctx.fillText(text, x, y + 3);
 };
 ctx.textAlign = 'center'; ctx.font = '900 8.5px "Segoe UI", sans-serif';
 for (const n of SAFEHOUSE_AND_SHOP_NODES) {
  const nx = tx(n.x), ny = ty(n.z);
  B(ctx, nx - 6.5, ny - 6.5, 13, 13, '#071224');
  B(ctx, nx - 5.5, ny - 5.5, 11, 11, n.code === 'S' ? '#00f0ff' : n.code === 'P' ? '#ff7e29' : '#ff4d79');
  ctx.fillStyle = '#050c18'; ctx.fillText(n.code, nx, ny + 3);
 }
 for (const r of STREET_RACES) pinCircle(tx(r.x), ty(r.z), 6, '#b978ff', 'R', '#fff');
 for (const m of STORY_MISSIONS) {
  const isAct = m.medal === 'ACTIVE';
  pinCircle(tx(m.waypoint.x), ty(m.waypoint.z), isAct ? 7.5 : 6, isAct ? '#ff4d79' : '#ffbf3c', isAct ? 'H' : m.num, isAct ? '#fff' : '#050c18');
 }
 ctx.textAlign = 'left';
 C(ctx, px, py, 8.5, 'rgba(78,255,145,0.28)');
 C(ctx, px, py, 5.5, '#071224');
 C(ctx, px, py, 4.2, '#4eff91');
}
