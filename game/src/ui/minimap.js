// Real-time 2D Radar Minimap Renderer: colorful city blocks, golden beach, turquoise ocean, GPS route, & high-contrast police blips
import { ROAD_X, ROAD_Z } from '../world/roads.js';

export function renderMinimap(state) {
  const canvas = document.getElementById('minimap-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#18263b';
  ctx.fillRect(0, 0, w, h);

  const px = state.player.x;
  const pz = state.player.z;
  const scale = 0.52; // meters to pixels

  const toMapX = (wx) => w * 0.5 + (wx - px) * scale;
  const toMapY = (wz) => h * 0.5 + (wz - pz) * scale;

  // Draw Vivid Golden Beach & Sparkling Turquoise Ocean on East (+X)
  const beachX = toMapX(225);
  const oceanX = toMapX(276);
  if (beachX < w) {
    ctx.fillStyle = '#f5d48c';
    ctx.fillRect(Math.max(0, beachX), 0, w - Math.max(0, beachX), h);
  }
  if (oceanX < w) {
    ctx.fillStyle = '#00bce3';
    ctx.fillRect(Math.max(0, oceanX), 0, w - Math.max(0, oceanX), h);
    // White surf line
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(Math.max(0, oceanX - 1.5), 0, 2.5, h);
  }

  // Draw Bright Colorful Pastel City Blocks between Roads
  const blockColors = ['#ff7597', '#3ce6d0', '#ffbe4f', '#59bfff', '#ff8c52', '#a882ff'];
  for (let ix = 0; ix < ROAD_X.length - 1; ix++) {
    for (let iz = 0; iz < ROAD_Z.length - 1; iz++) {
      const bx0 = toMapX(ROAD_X[ix] + 13);
      const by0 = toMapY(ROAD_Z[iz] + 13);
      const bw = (ROAD_X[ix + 1] - ROAD_X[ix] - 26) * scale;
      const bh = (ROAD_Z[iz + 1] - ROAD_Z[iz] - 26) * scale;
      if (bx0 + bw < 0 || bx0 > w || by0 + bh < 0 || by0 > h) continue;

      ctx.fillStyle = '#2c3d59';
      ctx.fillRect(bx0, by0, bw, bh);

      // Individual colorful 3D-style building footprints inside each block
      const c1 = blockColors[(ix + iz) % blockColors.length];
      const c2 = blockColors[(ix * 2 + iz + 1) % blockColors.length];
      const subW = bw * 0.42;
      const subH = bh * 0.42;
      ctx.fillStyle = c1;
      ctx.fillRect(bx0 + 2, by0 + 2, subW, subH);
      ctx.fillRect(bx0 + bw - subW - 2, by0 + bh - subH - 2, subW, subH);
      ctx.fillStyle = c2;
      ctx.fillRect(bx0 + bw - subW - 2, by0 + 2, subW, subH);
      ctx.fillRect(bx0 + 2, by0 + bh - subH - 2, subW, subH);
    }
  }

  // Draw Palma Dorada Road Grid
  ctx.strokeStyle = '#475670';
  ctx.lineWidth = 7.5;
  for (let i = 0; i < ROAD_X.length; i++) {
    const mx = toMapX(ROAD_X[i]);
    ctx.beginPath();
    ctx.moveTo(mx, 0);
    ctx.lineTo(mx, h);
    ctx.stroke();
  }
  for (let j = 0; j < ROAD_Z.length; j++) {
    const my = toMapY(ROAD_Z[j]);
    ctx.beginPath();
    ctx.moveTo(0, my);
    ctx.lineTo(w, my);
    ctx.stroke();
  }

  // Highlight Solana Strip & Oceanfront Boulevards
  const solanaX = toMapX(110);
  ctx.strokeStyle = 'rgba(255, 200, 59, 0.75)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(solanaX, 0);
  ctx.lineTo(solanaX, h);
  ctx.stroke();

  // GPS Waypoint Route Line (Cyan -> Gold)
  const wp = state.mission.waypoint;
  if (wp) {
    const wx = Math.max(10, Math.min(w - 10, toMapX(wp.x)));
    const wy = Math.max(10, Math.min(h - 10, toMapY(wp.z)));

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.5);
    ctx.lineTo(wx, wy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Gold Mission Target Star blip
    ctx.fillStyle = '#ffbf3c';
    ctx.beginPath();
    ctx.arc(wx, wy, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Civilian & Police Vehicles Blips
  const vehicles = state.entities.vehicles;
  for (let i = 0; i < vehicles.length; i++) {
    const v = vehicles[i];
    if (v.id === state.player.vehicleId) continue;
    const vx = toMapX(v.x);
    const vy = toMapY(v.z);
    if (vx < 0 || vx > w || vy < 0 || vy > h) continue;

    if (v.isPolice) {
      // High-contrast red/blue split police blip + radar cone
      ctx.fillStyle = 'rgba(255, 23, 68, 0.25)';
      ctx.beginPath();
      ctx.arc(vx, vy, 13, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ff1744';
      ctx.beginPath();
      ctx.arc(vx - 2, vy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#00d8ff';
      ctx.beginPath();
      ctx.arc(vx + 2, vy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(vx - 4.5, vy - 3.5, 9, 7);
    } else if (v.isMissionTarget) {
      ctx.fillStyle = '#ffbf3c';
      ctx.fillRect(vx - 4, vy - 4, 8, 8);
    } else {
      ctx.fillStyle = '#90a4c4';
      ctx.fillRect(vx - 2, vy - 2, 4, 4);
    }
  }

  // Hostile combatants blips (Red diamonds)
  const enemies = state.entities.enemies;
  for (let i = 0; i < enemies.length; i++) {
    const en = enemies[i];
    if (!en.alive) continue;
    const ex = toMapX(en.x);
    const ey = toMapY(en.z);
    ctx.fillStyle = '#ff2a55';
    ctx.beginPath();
    ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Player Directional Arrow at Center
  ctx.save();
  ctx.translate(w * 0.5, h * 0.5);
  ctx.rotate(-state.player.rotY + Math.PI);
  ctx.fillStyle = '#4eff91';
  ctx.beginPath();
  ctx.moveTo(0, -7);
  ctx.lineTo(5.5, 6);
  ctx.lineTo(0, 3);
  ctx.lineTo(-5.5, 6);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#06101e';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}
