// Real-time 2D Radar Minimap: city blocks, beach, ocean, GPS route & police blips
import { ROAD_X, ROAD_Z } from '../world/roads.js';

export function renderMinimap(state) {
 const canvas = document.getElementById('minimap-canvas');
 if (!canvas) return;
 const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height, px = state.player.x, pz = state.player.z, scale = .46;
 const tx = (wx) => w * .5 + (wx - px) * scale, ty = (wz) => h * .5 + (wz - pz) * scale;
 const dot = (x, y, r, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
 ctx.fillStyle = '#18263b'; ctx.fillRect(0, 0, w, h);

 const beachX = tx(225), oceanX = tx(276);
 if (beachX < w) { ctx.fillStyle = '#f5d48c'; ctx.fillRect(Math.max(0, beachX), 0, w - Math.max(0, beachX), h); }
 if (oceanX < w) {
  ctx.fillStyle = '#00bce3'; ctx.fillRect(Math.max(0, oceanX), 0, w - Math.max(0, oceanX), h);
  ctx.fillStyle = '#fff'; ctx.fillRect(Math.max(0, oceanX - 1.5), 0, 2.5, h);
 }

 const bCols = ['#ff7597', '#3ce6d0', '#ffbe4f', '#59bfff', '#ff8c52', '#a882ff'];
 for (let ix = 0; ix < ROAD_X.length - 1; ix++) for (let iz = 0; iz < ROAD_Z.length - 1; iz++) {
  const bx0 = tx(ROAD_X[ix] + 13), by0 = ty(ROAD_Z[iz] + 13), bw = (ROAD_X[ix + 1] - ROAD_X[ix] - 26) * scale, bh = (ROAD_Z[iz + 1] - ROAD_Z[iz] - 26) * scale;
  if (bx0 + bw < 0 || bx0 > w || by0 + bh < 0 || by0 > h) continue;
  ctx.fillStyle = '#2c3d59'; ctx.fillRect(bx0, by0, bw, bh);
  const sw = bw * .42, sh = bh * .42;
  ctx.fillStyle = bCols[(ix + iz) % 6]; ctx.fillRect(bx0 + 2, by0 + 2, sw, sh); ctx.fillRect(bx0 + bw - sw - 2, by0 + bh - sh - 2, sw, sh);
  ctx.fillStyle = bCols[(ix * 2 + iz + 1) % 6]; ctx.fillRect(bx0 + bw - sw - 2, by0 + 2, sw, sh); ctx.fillRect(bx0 + 2, by0 + bh - sh - 2, sw, sh);
 }

 ctx.strokeStyle = '#475670'; ctx.lineWidth = 7.5;
 for (const rx of ROAD_X) { ctx.beginPath(); ctx.moveTo(tx(rx), 0); ctx.lineTo(tx(rx), h); ctx.stroke(); }
 for (const rz of ROAD_Z) { ctx.beginPath(); ctx.moveTo(0, ty(rz)); ctx.lineTo(w, ty(rz)); ctx.stroke(); }

 const wp = state.mission.waypoint;
 if (wp) {
  const wx = Math.max(10, Math.min(w - 10, tx(wp.x))), wy = Math.max(10, Math.min(h - 10, ty(wp.z)));
  ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 2.5; ctx.setLineDash([5, 3]);
  ctx.beginPath(); ctx.moveTo(w * .5, h * .5); ctx.lineTo(wx, wy); ctx.stroke(); ctx.setLineDash([]);
  dot(wx, wy, 5.5, '#ffbf3c');
 }

 for (const v of state.entities.vehicles) {
  if (v.id === state.player.vehicleId) continue;
  const vx = tx(v.x), vy = ty(v.z);
  if (vx < 0 || vx > w || vy < 0 || vy > h) continue;
  if (v.isPolice) { dot(vx, vy, 13, 'rgba(255,23,68,.25)'); dot(vx - 2, vy, 4, '#ff1744'); dot(vx + 2, vy, 4, '#00d8ff'); }
  else { ctx.fillStyle = v.isMissionTarget ? '#ffbf3c' : '#90a4c4'; ctx.fillRect(vx - 3, vy - 3, 6, 6); }
 }
 for (const en of state.entities.enemies) if (en.alive) dot(tx(en.x), ty(en.z), 3.5, '#ff2a55');

 ctx.save(); ctx.translate(w * .5, h * .5); ctx.rotate(-state.player.rotY + Math.PI);
 ctx.fillStyle = '#4eff91'; ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(5.5, 6); ctx.lineTo(0, 3); ctx.lineTo(-5.5, 6); ctx.closePath(); ctx.fill(); ctx.restore();
}
