// Golden-hour sunset & twilight night-market sky domes, beach, ocean & plaza
import { WORLD_CONFIG } from '../core/config.js';

const mkTex = (THREE, w, h, fn) => {
 const c = document.createElement('canvas'); c.width = w; c.height = h;
 fn(c.getContext('2d')); return new THREE.CanvasTexture(c);
};
const linGrad = (ctx, x1, y1, x2, y2, stops) => {
 const g = ctx.createLinearGradient(x1, y1, x2, y2);
 stops.forEach(([s, c]) => g.addColorStop(s, c)); return g;
};

function buildSkyTex(THREE, stops, stars, cloudN, cloudY, cloudStop) {
 return mkTex(THREE, 1024, 512, (ctx) => {
  ctx.fillStyle = linGrad(ctx, 0, 0, 0, 512, stops); ctx.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < stars; i++) {
   ctx.fillStyle = i % 3 === 0 ? 'rgba(255,236,195,.72)' : 'rgba(185,220,255,.58)';
   ctx.beginPath(); ctx.arc((i * 173 + 29) % 1024, 14 + (i * 59) % 185, i % 4 === 0 ? 1.5 : 0.9, 0, Math.PI * 2); ctx.fill();
  }
  for (let i = 0; i < cloudN; i++) {
   const cx = (i * (stars ? 151 : 137)) % 1024, cy = cloudY + (i % (stars ? 6 : 8)) * (stars ? 8 : 9), cw = (stars ? 110 : 95) + (i % 5) * 36, ch = 8 + (i % 4) * 4;
   ctx.fillStyle = linGrad(ctx, cx, cy - ch, cx, cy + ch, cloudStop(cy));
   ctx.beginPath(); ctx.ellipse(cx, cy, cw, ch, 0, 0, Math.PI * 2); ctx.fill();
  }
 });
}

function buildNightMarketPlaza(THREE) {
 const nm = new THREE.Group(), Std = (p) => new THREE.MeshStandardMaterial(p), Bas = (p) => new THREE.MeshBasicMaterial(p);
 const Box = (w, h, d) => new THREE.BoxGeometry(w, h, d), Cyl = (rt, rb, h, s = 6) => new THREE.CylinderGeometry(rt, rb, h, s);
 const addM = (p, geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); p.add(m); return m; };
 const tileTex = mkTex(THREE, 256, 256, (c) => {
  c.fillStyle = '#241e33'; c.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 32) for (let x = 0; x < 256; x += 32) {
   c.fillStyle = (x / 32 + y / 32) % 2 === 0 ? '#332842' : '#292238'; c.fillRect(x + 2, y + 2, 28, 28);
   c.fillStyle = 'rgba(255,190,120,.08)'; c.fillRect(x + 4, y + 4, 24, 3);
  }
 });
 tileTex.wrapS = tileTex.wrapT = THREE.RepeatWrapping; tileTex.repeat.set(5, 7);
 addM(nm, new THREE.PlaneGeometry(34, 48), Std({ map: tileTex, roughness: .52, metalness: .14 }), 220, .09, 364).rotation.x = -Math.PI / 2;
 for (const [bx, col] of [[204.2, 0xff4d79], [235.8, 0x00e5ff]]) addM(nm, new THREE.PlaneGeometry(.42, 46), Bas({ color: col }), bx, .1, 364).rotation.x = -Math.PI / 2;
 [
  [204.8, 353, Math.PI / 2, 0xff4d79, 'MERCADO NOCTURNO', '#240b2c', '#00f0ff'],
  [204.8, 365, Math.PI / 2, 0xff9f1c, 'PALMA TACOS', '#2b120c', '#ffd166'],
  [204.8, 375, Math.PI / 2, 0x00d8d6, 'NEON BAZAAR', '#092238', '#ff4d79'],
  [235.2, 354, -Math.PI / 2, 0xb978ff, 'ARCADE 88', '#1b0d33', '#00e5ff'],
  [235.2, 363, -Math.PI / 2, 0xff5e7e, 'CAFE SOLANA', '#2a0f22', '#ffbf3c'],
 ].forEach(([sx, sz, rotY, canCol, title, bg, border]) => {
  const st = new THREE.Group(); st.position.set(sx, 0, sz); st.rotation.y = rotY;
  addM(st, Box(7.2, 1.05, 3.2), Std({ color: 0x261e38, roughness: .6 }), 0, .52, 0);
  addM(st, Box(6.8, 1.8, 2.6), Bas({ color: 0xffb347, transparent: true, opacity: .28 }), 0, 1.9, 0);
  addM(st, Box(7.8, .45, 4), Std({ color: canCol, emissive: canCol, emissiveIntensity: .25, roughness: .4 }), 0, 3.35, .35).rotation.x = .14;
  for (const px of [-3.4, 3.4]) addM(st, Cyl(.08, .08, 3.3), Std({ color: 0x1a1f2e, metalness: .7 }), px, 1.65, 1.5);
  const signTex = mkTex(THREE, 256, 64, (c) => {
   c.fillStyle = bg; c.fillRect(0, 0, 256, 64); c.strokeStyle = border; c.lineWidth = 5; c.strokeRect(4, 4, 248, 56);
   c.fillStyle = '#fff9e6'; c.font = '900 24px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(title, 128, 33);
  });
  addM(st, Box(5.6, 1.25, .25), Bas({ map: signTex }), 0, 4.25, 1.2); nm.add(st);
 });
 const bulbA = Bas({ color: 0xffe07a }), bulbB = Bas({ color: 0xff8a3d }), cabM = Bas({ color: 0x1e182e });
 [352, 360, 368].forEach((lz, ri) => {
  addM(nm, Cyl(.03, .03, 30, 5), cabM, 220, 5.65, lz).rotation.z = Math.PI / 2;
  for (let b = 0; b <= 12; b++) { const t = b / 12; addM(nm, new THREE.SphereGeometry(.16, 8, 8), (b + ri) % 2 === 0 ? bulbA : bulbB, 205.5 + t * 29, 5.55 - Math.sin(t * Math.PI) * .75, lz); }
 });
 for (const [col, int, x, y, z] of [[0xff9b3d, 1.45, 218, 6.2, 362], [0xff3b78, .95, 208, 4.8, 358], [0x00e5ff, .85, 232, 4.8, 356]]) {
  const pl = new THREE.PointLight(col, int, 36); pl.position.set(x, y, z); nm.add(pl);
 }
 nm.visible = false; return nm;
}

export function buildOceanAndSky(scene) {
 const THREE = window.THREE, group = new THREE.Group();
 const sunsetTex = buildSkyTex(THREE, [[0, '#103568'], [.28, '#164E8A'], [.4, '#2B83B8'], [.44, '#d97a46'], [.47, '#F59E42'], [.51, '#E85D56'], [.56, '#c84b62'], [1, '#1c4f78']], 0, 42, 195, (cy) => [
  [0, cy < 228 ? 'rgba(255,212,148,.52)' : 'rgba(255,188,112,.62)'], [.5, cy < 228 ? 'rgba(235,134,108,.36)' : 'rgba(232,93,86,.45)'], [1, 'rgba(72,65,115,0)']
 ]);
 const twilightTex = buildSkyTex(THREE, [[0, '#0a071c'], [.22, '#1a1236'], [.38, '#29174d'], [.46, '#4f245e'], [.51, '#9c3b62'], [.56, '#401b4f'], [1, '#0e0b24']], 90, 26, 208, () => [
  [0, 'rgba(195,88,125,.28)'], [1, 'rgba(30,18,62,0)']
 ]);

 const skyMat = new THREE.MeshBasicMaterial({ map: sunsetTex, side: THREE.BackSide, depthWrite: false, fog: false });
 group.add(new THREE.Mesh(new THREE.SphereGeometry(1450, 40, 28), skyMat));

 const sunTex = mkTex(THREE, 256, 256, (c) => {
  const g = c.createRadialGradient(128, 128, 10, 128, 128, 124);
  [[0, 'rgba(255,252,225,.98)'], [.18, 'rgba(255,218,115,.92)'], [.42, 'rgba(245,158,66,.52)'], [.72, 'rgba(232,93,86,.18)'], [1, 'rgba(232,93,86,0)']].forEach(([s, col]) => g.addColorStop(s, col));
  c.fillStyle = g; c.fillRect(0, 0, 256, 256);
 });
 const sunGlow = new THREE.Mesh(new THREE.PlaneGeometry(135, 135), new THREE.MeshBasicMaterial({ map: sunTex, transparent: true, depthWrite: false, fog: false }));
 sunGlow.position.set(-165, 178, -520); sunGlow.lookAt(110, 12, 40); group.add(sunGlow);

 const addPlane = (w, h, mat, x, y, z, ws = 1, hs = 1) => {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h, ws, hs), mat); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); group.add(m); return m;
 };
 addPlane(2400, 2400, new THREE.MeshStandardMaterial({ color: 0x6c7382, roughness: .85, metalness: .05 }), 0, -.06, 0);
 addPlane(WORLD_CONFIG.beachWidth + 24, 2200, new THREE.MeshStandardMaterial({ color: 0xf4e3be, roughness: .78, metalness: .04 }), WORLD_CONFIG.oceanX - WORLD_CONFIG.beachWidth * .45, .03, 0, 8, 32);
 const surf = addPlane(6.5, 2200, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .9 }), WORLD_CONFIG.oceanX + 1.5, .05, 0);
 addPlane(48, 2200, new THREE.MeshBasicMaterial({ color: 0x00d2de, transparent: true, opacity: .8 }), WORLD_CONFIG.oceanX + 25, .01, 0);
 const waterMat = new THREE.MeshStandardMaterial({ color: 0x0085b2, emissive: 0x033856, roughness: .18, metalness: .58, transparent: true, opacity: .96 });
 const water = addPlane(960, 2400, waterMat, WORLD_CONFIG.oceanX + 480, -.1, 0, 32, 64);

 const amb = new THREE.AmbientLight(0xffdfc2, .34), hemi = new THREE.HemisphereLight(0xffc994, 0x2c5278, .68);
 const sunL = new THREE.DirectionalLight(0xffa952, .98); sunL.position.set(-220, 195, -340);
 const fillL = new THREE.DirectionalLight(0x52b8e8, .42); fillL.position.set(260, 140, 280);
 const nightMarketGroup = buildNightMarketPlaza(THREE);
 group.add(amb, hemi, sunL, fillL, nightMarketGroup); scene.add(group);

 function setAtmosphere(mode = 'sunset') {
  const tw = mode === 'twilight';
  skyMat.map = tw ? twilightTex : sunsetTex; skyMat.needsUpdate = true;
  sunGlow.visible = !tw; nightMarketGroup.visible = tw;
  if (scene.fog) { scene.fog.color.setHex(tw ? 0x1a1236 : 0xe89b6c); scene.fog.density = tw ? .00055 : .00038; }
  amb.color.setHex(tw ? 0x4a4382 : 0xffdfc2); amb.intensity = tw ? .52 : .34;
  hemi.color.setHex(tw ? 0x644ca8 : 0xffc994); hemi.groundColor.setHex(tw ? 0x18132e : 0x2c5278); hemi.intensity = tw ? .62 : .68;
  sunL.color.setHex(tw ? 0x9b8cff : 0xffa952); sunL.intensity = tw ? .42 : .98;
  fillL.color.setHex(tw ? 0xff7d47 : 0x52b8e8); fillL.intensity = tw ? .72 : .42;
  waterMat.color.setHex(tw ? 0x00496e : 0x0085b2); waterMat.emissive.setHex(tw ? 0x051c38 : 0x033856);
 }

 return {
  water, surf, sunGlow, setAtmosphere,
  update(time) {
   const pos = water.geometry.attributes.position;
   for (let i = 0; i < pos.count; i++) pos.setZ(i, Math.sin(pos.getX(i) * .06 + time * 2.2) * .25 + Math.cos(pos.getY(i) * .04 + time * 1.7) * .2);
   pos.needsUpdate = true;
   surf.position.x = WORLD_CONFIG.oceanX + 1.5 + Math.sin(time * 1.6) * .9;
  },
 };
}
