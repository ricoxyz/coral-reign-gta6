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

  // Center Column: 6-District Palma Dorada City Cartography Canvas with Vivid 3D-Style City Blocks, Beach & Turquoise Bay
  const canvas = document.getElementById('full-map-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = '#132238';
  ctx.fillRect(0, 0, w, h);

  const tx = (wx) => ((wx + 480) / 900) * w;
  const ty = (wz) => ((wz + 540) / 1100) * h;

  // Sparkling Turquoise Ocean Bay, Shallow Lagoon, & Vivid Golden Beach on East coast
  const beachStart = tx(232);
  const surfLine = tx(268);
  const lagoonEnd = tx(315);

  const oceanGrad = ctx.createLinearGradient(surfLine, 0, w, 0);
  oceanGrad.addColorStop(0, '#1ee3cf');
  oceanGrad.addColorStop(0.32, '#00b4d8');
  oceanGrad.addColorStop(1, '#0077b6');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(surfLine, 0, w - surfLine, h);

  // Subtle wave contour ripples in the turquoise bay
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 1.5;
  for (let wy = 24; wy < h; wy += 36) {
    ctx.beginPath();
    ctx.moveTo(surfLine + 12, wy);
    ctx.quadraticCurveTo(lagoonEnd, wy - 7, w - 16, wy);
    ctx.stroke();
  }

  // Golden sand beach strip + white surf foam edge
  ctx.fillStyle = '#f7d794';
  ctx.fillRect(beachStart, 0, surfLine - beachStart, h);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(surfLine - 2, 0, 3.5, h);

  // Palma Pier Wooden Boardwalk extending into the turquoise bay
  ctx.fillStyle = '#c98a5b';
  ctx.fillRect(surfLine - 4, ty(300), 42, 18);
  ctx.strokeStyle = '#ff4d79';
  ctx.lineWidth = 2;
  ctx.strokeRect(surfLine - 4, ty(300), 42, 18);

  // 6 Colored District Zones
  for (let i = 0; i < DISTRICTS.length; i++) {
    const d = DISTRICTS[i];
    const b = d.bounds;
    const x0 = tx(b.minX);
    const y0 = ty(b.minZ);
    const dw = tx(b.maxX) - x0;
    const dh = ty(b.maxZ) - y0;

    ctx.fillStyle = `${d.color}22`;
    ctx.fillRect(x0, y0, dw, dh);
  }

  // Render Vivid 3D-Style Architectural City Blocks inside every road grid cell (NO empty dark grid squares!)
  const fullGridX = [-440, ...ROAD_X];
  const fullGridZ = [-530, ...ROAD_Z, 550];
  const blockPalettes = [
    ['#ff6b8b', '#ffb86c', '#ffd97d', '#fff3d1'], // Solana Strip Pastel Coral & Gold
    ['#2ec4b6', '#72efdd', '#cbf3f0', '#ff9f1c'], // Coral Marina Seafoam & Aqua
    ['#4ea8de', '#56cfe1', '#f9c74f', '#90e0ef'], // Vidrio Downtown Glass & Gold
    ['#f3722c', '#f8961e', '#f9c74f', '#ff6b6b'], // Mercado Viejo Terracotta
    ['#43aa8b', '#90be6d', '#f9c74f', '#ff5a79'], // Palma Pier Tropical Mint
    ['#9d4edd', '#c77dff', '#ffb5a7', '#fcd5ce'], // Mirador Heights Villa Pastel
  ];

  for (let ix = 0; ix < fullGridX.length - 1; ix++) {
    for (let iz = 0; iz < fullGridZ.length - 1; iz++) {
      const wx0 = fullGridX[ix];
      const wx1 = fullGridX[ix + 1];
      const wz0 = fullGridZ[iz];
      const wz1 = fullGridZ[iz + 1];
      const cx = (wx0 + wx1) * 0.5;
      const cz = (wz0 + wz1) * 0.5;

      // Determine district palette for this block
      let palIdx = 2;
      for (let d = 0; d < DISTRICTS.length; d++) {
        const b = DISTRICTS[d].bounds;
        if (cx >= b.minX && cx <= b.maxX && cz >= b.minZ && cz <= b.maxZ) {
          palIdx = d;
          break;
        }
      }
      const pal = blockPalettes[palIdx];

      const bx = tx(wx0) + 5;
      const by = ty(wz0) + 5;
      const bw = tx(wx1) - tx(wx0) - 10;
      const bh = ty(wz1) - ty(wz0) - 10;
      if (bw <= 6 || bh <= 6) continue;

      // Sunlit travertine block plaza pad
      ctx.fillStyle = '#25364f';
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, bw, bh);

      // 4 Sculpted 3D-style building footprints with drop shadow & roof highlight
      const subW = (bw - 10) * 0.5;
      const subH = (bh - 10) * 0.5;
      const footprints = [
        { ox: 3, oy: 3, c: pal[(ix + iz) % pal.length] },
        { ox: 7 + subW, oy: 3, c: pal[(ix + iz + 1) % pal.length] },
        { ox: 3, oy: 7 + subH, c: pal[(ix + iz + 2) % pal.length] },
        { ox: 7 + subW, oy: 7 + subH, c: pal[(ix + iz + 3) % pal.length] },
      ];

      for (let f = 0; f < footprints.length; f++) {
        const fp = footprints[f];
        // Building 3D extruded shadow
        ctx.fillStyle = 'rgba(8, 14, 26, 0.65)';
        ctx.fillRect(bx + fp.ox + 2.5, by + fp.oy + 2.5, subW, subH);
        // Building main pastel roof
        ctx.fillStyle = fp.c;
        ctx.fillRect(bx + fp.ox, by + fp.oy, subW, subH);
        // Stepped inner penthouse tier
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fillRect(bx + fp.ox + 3, by + fp.oy + 3, Math.max(4, subW - 6), Math.max(4, subH - 6));
      }

      // Add sparkling turquoise resort pool on oceanfront blocks
      if (cx > 120) {
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(bx + bw * 0.52, by + bh * 0.25, bw * 0.34, bh * 0.5);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx + bw * 0.52, by + bh * 0.25, bw * 0.34, bh * 0.5);
      }
    }
  }

  // Arterial Road Grid with golden center lines
  for (let i = 0; i < ROAD_X.length; i++) {
    const rx = tx(ROAD_X[i]);
    ctx.strokeStyle = '#38465e';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(rx, 0);
    ctx.lineTo(rx, h);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 204, 64, 0.6)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(rx, 0);
    ctx.lineTo(rx, h);
    ctx.stroke();
  }
  for (let j = 0; j < ROAD_Z.length; j++) {
    const rz = ty(ROAD_Z[j]);
    ctx.strokeStyle = '#38465e';
    ctx.lineWidth = 6.5;
    ctx.beginPath();
    ctx.moveTo(0, rz);
    ctx.lineTo(surfLine, rz);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 204, 64, 0.55)';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(0, rz);
    ctx.lineTo(surfLine, rz);
    ctx.stroke();
  }

  // District Borders & High-Contrast Pill Labels
  for (let i = 0; i < DISTRICTS.length; i++) {
    const d = DISTRICTS[i];
    const b = d.bounds;
    const x0 = tx(b.minX);
    const y0 = ty(b.minZ);
    const dw = tx(b.maxX) - x0;
    const dh = ty(b.maxZ) - y0;

    ctx.strokeStyle = d.color;
    ctx.lineWidth = 2.2;
    ctx.strokeRect(x0, y0, dw, dh);

    const lblY = d.id === 'solana_strip' ? y0 + 28 : y0 + 5;
    ctx.font = '900 10.5px "Segoe UI", sans-serif';
    const textW = ctx.measureText(d.name).width;
    ctx.fillStyle = 'rgba(8, 15, 28, 0.92)';
    ctx.fillRect(x0 + 5, lblY, textW + 12, 17);
    ctx.strokeStyle = d.color;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x0 + 5, lblY, textW + 12, 17);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(d.name, x0 + 11, lblY + 12);
  }

  // Beach & Bay Labels on East Coast
  ctx.save();
  ctx.font = '900 10px "Segoe UI", sans-serif';
  ctx.fillStyle = '#003554';
  ctx.fillText('SOLANA BEACH', beachStart + 4, 24);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('TURQUOISE BAY', surfLine + 12, 44);
  ctx.restore();

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
