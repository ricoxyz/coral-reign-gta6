// Real-time 2D Radar Minimap Renderer: colorful city blocks, golden beach, turquoise ocean, GPS route, & high-contrast police blips
import { ROAD_X, ROAD_Z } from '../world/roads.js';

export function renderMinimap(state) {
 const canvas = document.getElementById('minimap-canvas');
 if (!canvas) return;
 const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
 ctx.fillStyle = '#18263b'; ctx.fillRect(0, 0, w, h);

 const px = state.player.x, pz = state.player.z, scale = 0.52;
 const toMapX = (wx) => w * 0.5 + (wx - px) * scale, toMapY = (wz) => h * 0.5 + (wz - pz) * scale;

 const beachX = toMapX(225), oceanX = toMapX(276);
 if (beachX < w) { ctx.fillStyle = '#f5d48c'; ctx.fillRect(Math.max(0, beachX), 0, w - Math.max(0, beachX), h); }
 if (oceanX < w) {
  ctx.fillStyle = '#00bce3'; ctx.fillRect(Math.max(0, oceanX), 0, w - Math.max(0, oceanX), h);
  ctx.fillStyle = '#fff'; ctx.fillRect(Math.max(0, oceanX - 1.5), 0, 2.5, h);
 }

 const blockColors = ['#ff7597', '#3ce6d0', '#ffbe4f', '#59bfff', '#ff8c52', '#a882ff'];
 for (let ix = 0; ix < ROAD_X.length - 1; ix++) {
  for (let iz = 0; iz < ROAD_Z.length - 1; iz++) {
   const bx0 = toMapX(ROAD_X[ix] + 13), by0 = toMapY(ROAD_Z[iz] + 13);
   const bw = (ROAD_X[ix + 1] - ROAD_X[ix] - 26) * scale, bh = (ROAD_Z[iz + 1] - ROAD_Z[iz] - 26) * scale;
   if (bx0 + bw < 0 || bx0 > w || by0 + bh < 0 || by0 > h) continue;
   ctx.fillStyle = '#2c3d59'; ctx.fillRect(bx0, by0, bw, bh);
   const subW = bw * 0.42, subH = bh * 0.42;
   ctx.fillStyle = blockColors[(ix + iz) % 6];
   ctx.fillRect(bx0 + 2, by0 + 2, subW, subH);
   ctx.fillRect(bx0 + bw - subW - 2, by0 + bh - subH - 2, subW, subH);
   ctx.fillStyle = blockColors[(ix * 2 + iz + 1) % 6];
   ctx.fillRect(bx0 + bw - subW - 2, by0 + 2, subW, subH);
   ctx.fillRect(bx0 + 2, by0 + bh - subH - 2, subW, subH);
  }
 }

 ctx.strokeStyle = '#475670'; ctx.lineWidth = 7.5;
 for (const rx of ROAD_X) { ctx.beginPath(); ctx.moveTo(toMapX(rx), 0); ctx.lineTo(toMapX(rx), h); ctx.stroke(); }
 for (const rz of ROAD_Z) { ctx.beginPath(); ctx.moveTo(0, toMapY(rz)); ctx.lineTo(w, toMapY(rz)); ctx.stroke(); }

 const wp = state.mission.waypoint;
 if (wp) {
  const wx = Math.max(10, Math.min(w - 10, toMapX(wp.x))), wy = Math.max(10, Math.min(h - 10, toMapY(wp.z)));
  ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 2.5; ctx.setLineDash([5, 3]);
  ctx.beginPath(); ctx.moveTo(w * 0.5, h * 0.5); ctx.lineTo(wx, wy); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#ffbf3c'; ctx.beginPath(); ctx.arc(wx, wy, 5.5, 0, Math.PI * 2); ctx.fill();
 }

 for (const v of state.entities.vehicles) {
  if (v.id === state.player.vehicleId) continue;
  const vx = toMapX(v.x), vy = toMapY(v.z);
  if (vx < 0 || vx > w || vy < 0 || vy > h) continue;
  if (v.isPolice) {
   ctx.fillStyle = 'rgba(255,23,68,.25)'; ctx.beginPath(); ctx.arc(vx, vy, 13, 0, Math.PI * 2); ctx.fill();
   ctx.fillStyle = '#ff1744'; ctx.beginPath(); ctx.arc(vx - 2, vy, 4, 0, Math.PI * 2); ctx.fill();
   ctx.fillStyle = '#00d8ff'; ctx.beginPath(); ctx.arc(vx + 2, vy, 4, 0, Math.PI * 2); ctx.fill();
  } else {
   ctx.fillStyle = v.isMissionTarget ? '#ffbf3c' : '#90a4c4';
   ctx.fillRect(vx - 3, vy - 3, 6, 6);
  }
 }

 for (const en of state.entities.enemies) {
  if (!en.alive) continue;
  ctx.fillStyle = '#ff2a55'; ctx.beginPath(); ctx.arc(toMapX(en.x), toMapY(en.z), 3.5, 0, Math.PI * 2); ctx.fill();
 }

 ctx.save();
 ctx.translate(w * 0.5, h * 0.5);
 ctx.rotate(-state.player.rotY + Math.PI);
 ctx.fillStyle = '#4eff91';
 ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(5.5, 6); ctx.lineTo(0, 3); ctx.lineTo(-5.5, 6); ctx.closePath(); ctx.fill();
 ctx.restore();
}
