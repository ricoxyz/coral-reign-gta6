// Full-Screen 3-Column Pause Dashboard: Progression Ring, 6-District Map & 3 Save Slots
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
 coral_marina: ['#1a525c', '#198699', ['#4be8cc', '#75f2da', '#2ec4b6'], '#c9fff5', [[0, 0, .58, .46, 0], [.64, 0, .36, .94, 1], [0, .52, .58, .44, -1], [.04, .6, .42, .26, 2]]],
 solana_strip: ['#592640', '#1696ab', ['#ff6e96', '#ff94b3', '#ff9978'], '#ffd6e2', [[0, 0, .46, .54, 0], [.52, 0, .48, .44, 1], [.54, .52, .44, .44, -1], [0, .62, .46, .36, 2]]],
 vidrio_downtown: ['#1b4069', '#276094', ['#5cb8ff', '#85ccff', '#3fa2eb'], '#d4eeff', [[0, 0, .46, .46, 0], [.52, 0, .48, .54, 1], [0, .54, .46, .44, 2], [.54, .6, .44, .36, -1]]],
 mercado_viejo: ['#593716', '#75461b', ['#ffbe4d', '#ffd46b', '#ff993b'], '#fff0c2', [[0, 0, .46, .44, 0], [.52, 0, .48, .44, 1], [0, .52, .98, .44, 2], [.3, .34, .4, .3, -1]]],
 palma_pier: ['#194d36', '#236b4b', ['#4be88c', '#76f2a8', '#29c46b'], '#ccffe0', [[0, 0, .5, .48, 0], [.54, .46, .44, .5, 1], [0, .56, .46, .4, 2]]],
 mirador_heights: ['#3d2a61', '#533982', ['#bf8cff', '#d4b0ff', '#a16ef5'], '#ebd9ff', [[0, 0, .5, .46, 0], [.54, 0, .44, .42, 1], [.46, .52, .52, .44, 2], [0, .54, .4, .4, -1]]],
};

function drawBlock(g, id, bx, by, bw, bh, ix, iz) {
 const [base, court, roofs, acc, shapes] = DISTRICT_BLOCK_THEME[id] || DISTRICT_BLOCK_THEME.vidrio_downtown;
 B(g, bx, by, bw, bh, base);
 g.strokeStyle = 'rgba(255,255,255,.16)'; g.lineWidth = 1; g.strokeRect(bx, by, bw, bh);
 const pad = 3.5, iw = bw - pad * 2, ih = bh - pad * 2;
 if (iw < 8 || ih < 8) return;
 for (const [fx, fy, fw, fh, ri] of shapes) {
  const rx = bx + pad + iw * fx, ry = by + pad + ih * fy, rw = iw * fw, rh = ih * fh;
  if (ri < 0) { B(g, rx, ry, rw, rh, court); continue; }
  B(g, rx + 2, ry + 2, rw, rh, 'rgba(5,10,20,0.42)'); B(g, rx, ry, rw, rh, roofs[(ix + iz + ri) % 3]); B(g, rx, ry, rw, 2.5, acc);
 }
}

export function renderFullPauseMap(state, saveSystem) {
 const modal = $('pause-map-modal');
 if (!modal) return;
 if (state.mode !== 'pause_map') { modal.classList.remove('visible'); return; }
 modal.classList.add('visible');
 const st = state.stats, pct = st.completionPct, off = (251.3 * (1 - pct / 100)).toFixed(1);
 if ($('pause-ring-wrap')) $('pause-ring-wrap').innerHTML = `<svg class="ring-svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="10"/><circle id="completion-ring-arc" cx="50" cy="50" r="40" fill="none" stroke="#00f0ff" stroke-width="10" stroke-linecap="round" stroke-dasharray="251.3" stroke-dashoffset="${off}" transform="rotate(-90 50 50)"/></svg><div><div class="ring-text-big" id="pause-completion-pct">${pct.toFixed(1)}%</div><div class="ring-text-sub">COMPLETE</div></div>`;
 if ($('pause-breakdown-bars')) $('pause-breakdown-bars').innerHTML = [['Story Missions', `${st.missionsDone} / ${st.missionsTotal}`, 70], ['Street Races', `${st.racesWon} / ${st.racesTotal}`, 60], ['Stunt Jumps', `${st.stuntsCompleted} / ${st.stuntsTotal}`, 60], ['Golden Shells', `${st.shellsCollected} / ${st.shellsTotal}`, 67], ['Crew Roster', '3 / 3', 100]].map(([l, v, w]) => `<div class="prog-row"><div class="prog-lbl"><span>${l}</span><span>${v}</span></div><div class="prog-track"><div class="prog-fill" style="width:${w}%"></div></div></div>`).join('');
 if ($('pause-mission-grid') && !$('pause-mission-grid').children.length) $('pause-mission-grid').innerHTML = STORY_MISSIONS.map((m) => `<div class="mission-item"><span>${m.num}. ${m.title}</span><span class="medal ${m.medal}">${m.medal}</span></div>`).join('');
 if ($('pause-career-grid')) $('pause-career-grid').innerHTML = [[`$${state.player.cash.toLocaleString()}`, 'SYNDICATE CASH'], [st.carsHijacked, 'CARS HIJACKED'], [st.evasions, 'POLICE EVASIONS'], [`${st.shellsCollected} / ${st.shellsTotal}`, 'GOLDEN SHELLS']].map(([v, l]) => `<div class="stat-box"><div class="stat-val">${v}</div><div class="stat-lbl">${l}</div></div>`).join('');
 if ($('pause-map-legend') && !$('pause-map-legend').children.length) $('pause-map-legend').innerHTML = [['#4eff91', '● PLAYER & GPS'], ['#ffbf3c', 'H HEISTS'], ['#00f0ff', 'S SAFEHOUSES'], ['#ff7e29', 'P MOD SHOPS'], ['#b978ff', 'R RACES'], ['#ff4d79', '★ POLICE HQ']].map(([c, t]) => `<span style="color:${c}">${t}</span>`).join('');
 saveSystem.renderSaveSlotsInto('pause-save-slots', 'pause');
 const canvas = $('full-map-canvas'); if (!canvas) return;
 const g = canvas.getContext('2d'), w = canvas.width, h = canvas.height; B(g, 0, 0, w, h, '#0e1b2e');
 const tx = (wx) => ((wx + 480) / 900) * w, ty = (wz) => ((wz + 540) / 1100) * h, beach = tx(232), surf = tx(268), og = g.createLinearGradient(surf, 0, w, 0);
 og.addColorStop(0, '#1ee3cf'); og.addColorStop(.35, '#00b4d8'); og.addColorStop(1, '#005f99');
 B(g, surf, 0, w - surf, h, og); B(g, beach, 0, surf - beach, h, '#f7d794'); B(g, surf - 2, 0, 3.5, h, '#fff');
 for (let pf = 0; pf < 5; pf++) { const py = ty(-505 + pf * 28); B(g, beach - 6, py, 52, 6, '#c8d6e5'); B(g, beach + 14, py - 5, 14, 4, '#fff'); B(g, beach + 32, py + 7, 14, 4, '#fff'); }
 const pierY = ty(365); B(g, beach - 4, pierY - 12, 64, 24, '#c98a5b'); C(g, beach + 44, pierY, 9, '#ff4d79'); C(g, beach + 44, pierY, 5, '#00f0ff');
 for (const d of DISTRICTS) B(g, tx(d.bounds.minX), ty(d.bounds.minZ), tx(d.bounds.maxX) - tx(d.bounds.minX), ty(d.bounds.maxZ) - ty(d.bounds.minZ), `${d.color}30`);
 const gx = [-440, ...ROAD_X], gz = [-530, ...ROAD_Z, 550];
 for (let ix = 0; ix < gx.length - 1; ix++) for (let iz = 0; iz < gz.length - 1; iz++) {
  const cx = (gx[ix] + gx[ix + 1]) * .5, cz = (gz[iz] + gz[iz + 1]) * .5, dist = DISTRICTS.find((d) => cx >= d.bounds.minX && cx <= d.bounds.maxX && cz >= d.bounds.minZ && cz <= d.bounds.maxZ);
  const bx = tx(gx[ix]) + 4.5, by = ty(gz[iz]) + 4.5, bw = tx(gx[ix + 1]) - tx(gx[ix]) - 9, bh = ty(gz[iz + 1]) - ty(gz[iz]) - 9;
  if (bw > 6 && bh > 6) drawBlock(g, dist ? dist.id : 'vidrio_downtown', bx, by, bw, bh, ix, iz);
 }
 for (const rx of ROAD_X) L(g, tx(rx), 0, tx(rx), h, '#243247', 6.2);
 for (const rz of ROAD_Z) L(g, 0, ty(rz), surf, ty(rz), '#243247', 6.2);
 for (const d of DISTRICTS) {
  const x0 = tx(d.bounds.minX), y0 = ty(d.bounds.minZ), lblY = d.id === 'solana_strip' ? y0 + 28 : y0 + 5;
  g.save(); g.strokeStyle = `${d.color}88`; g.lineWidth = 1.6; g.setLineDash([5, 4]);
  g.strokeRect(x0, y0, tx(d.bounds.maxX) - x0, ty(d.bounds.maxZ) - y0); g.restore();
  g.font = '900 10.5px sans-serif';
  const tw = g.measureText(d.name).width;
  B(g, x0 + 5, lblY, tw + 14, 18, 'rgba(6,12,24,.94)');
  g.strokeStyle = d.color; g.lineWidth = 1.6; g.strokeRect(x0 + 5, lblY, tw + 14, 18);
  g.fillStyle = '#fff'; g.fillText(d.name, x0 + 12, lblY + 12.5);
 }
 const px = tx(state.player.x), py = ty(state.player.z), wp = state.mission.waypoint;
 if (wp) {
  const nearest = (arr, v) => arr.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));
  const sx = tx(nearest(ROAD_X, state.player.x)), sz = ty(nearest(ROAD_Z, (state.player.z + wp.z) * .5)), ex = tx(nearest(ROAD_X, wp.x)), wx = tx(wp.x), wy = ty(wp.z);
  const pts = [[px, py], [sx, py], [sx, sz], [ex, sz], [ex, wy], [wx, wy]];
  const trace = () => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); };
  g.save(); g.lineJoin = 'round'; g.lineCap = 'round';
  for (const [col, lw, dash] of [['rgba(255,46,128,.42)', 9.5, []], ['#ff3b82', 4.6, []], ['#00f0ff', 2.2, [8, 5]]]) {
   g.strokeStyle = col; g.lineWidth = lw; g.setLineDash(dash); trace(); g.stroke();
  }
  g.restore();
  const lx = Math.min(w - 138, Math.max(8, (sx + ex) * .5 - 64)), ly = sz - 22;
  B(g, lx, ly, 128, 18, 'rgba(7,13,26,.95)'); g.strokeStyle = '#00f0ff'; g.lineWidth = 1.4; g.strokeRect(lx, ly, 128, 18);
  g.fillStyle = '#00f0ff'; g.font = '900 9.5px sans-serif'; g.fillText('GPS ROUTE · 0.84 KM', lx + 7, ly + 12.5);
 }
 const pin = (x, y, r, fill, t, tc = '#050c18') => { C(g, x, y, r + 1.5, '#071224'); C(g, x, y, r, fill); g.fillStyle = tc; g.fillText(t, x, y + 3); };
 g.textAlign = 'center'; g.font = '900 8.5px sans-serif';
 for (const n of SAFEHOUSE_AND_SHOP_NODES) {
  const nx = tx(n.x), ny = ty(n.z);
  B(g, nx - 6.5, ny - 6.5, 13, 13, '#071224'); B(g, nx - 5.5, ny - 5.5, 11, 11, n.code === 'S' ? '#00f0ff' : n.code === 'P' ? '#ff7e29' : '#ff4d79');
  g.fillStyle = '#050c18'; g.fillText(n.code, nx, ny + 3);
 }
 for (const r of STREET_RACES) pin(tx(r.x), ty(r.z), 6, '#b978ff', 'R', '#fff');
 for (const m of STORY_MISSIONS) {
  const act = m.medal === 'ACTIVE';
  pin(tx(m.waypoint.x), ty(m.waypoint.z), act ? 7.5 : 6, act ? '#ff4d79' : '#ffbf3c', act ? 'H' : m.num, act ? '#fff' : '#050c18');
 }
 g.textAlign = 'left'; C(g, px, py, 8.5, 'rgba(78,255,145,.28)'); C(g, px, py, 5.5, '#071224'); C(g, px, py, 4.2, '#4eff91');
}
