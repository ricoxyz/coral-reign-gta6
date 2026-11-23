// Real-time 2D Radar Minimap Renderer: roads, ocean coastline, GPS route, police cones, & mission star
import { ROAD_X, ROAD_Z } from '../world/roads.js';

export function renderMinimap(state) {
  const canvas = document.getElementById('minimap-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#081120';
  ctx.fillRect(0, 0, w, h);

  const px = state.player.x;
  const pz = state.player.z;
  const scale = 0.48; // meters to pixels

  const toMapX = (wx) => w * 0.5 + (wx - px) * scale;
  const toMapY = (wz) => h * 0.5 + (wz - pz) * scale;

  // Draw Ocean & Sandy Beach on East (+X)
  const beachX = toMapX(225);
  const oceanX = toMapX(280);
  if (beachX < w) {
    ctx.fillStyle = '#c8a56e';
    ctx.fillRect(Math.max(0, beachX), 0, w - Math.max(0, beachX), h);
  }
  if (oceanX < w) {
    ctx.fillStyle = '#006b8f';
    ctx.fillRect(Math.max(0, oceanX), 0, w - Math.max(0, oceanX), h);
  }

  // Draw Palma Dorada Road Grid
  ctx.strokeStyle = '#2d374d';
  ctx.lineWidth = 7;
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

  // Highlight Solana Strip Boulevard in Neon Coral
  const solanaX = toMapX(110);
  ctx.strokeStyle = 'rgba(255, 77, 121, 0.45)';
  ctx.lineWidth = 3;
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
      // Flashing red/blue police radar cone + blip
      ctx.fillStyle = 'rgba(255, 30, 66, 0.22)';
      ctx.beginPath();
      ctx.arc(vx, vy, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = (Math.floor(state.time * 8 + i) % 2 === 0) ? '#ff1744' : '#00b0ff';
      ctx.beginPath();
      ctx.arc(vx, vy, 4, 0, Math.PI * 2);
      ctx.fill();
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
