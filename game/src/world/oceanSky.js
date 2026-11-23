// High-contrast tropical golden-hour sunset & twilight night-market sky domes, beach, ocean & waterfront plaza
import { WORLD_CONFIG } from '../core/config.js';

function buildSunsetSkyTexture(THREE) {
 const skyCanvas = document.createElement('canvas');
 skyCanvas.width = 1024; skyCanvas.height = 512;
 const ctx = skyCanvas.getContext('2d'), grad = ctx.createLinearGradient(0, 0, 0, 512);
 [[0, '#103568'], [0.28, '#164E8A'], [0.40, '#2B83B8'], [0.44, '#d97a46'], [0.47, '#F59E42'], [0.51, '#E85D56'], [0.56, '#c84b62'], [1, '#1c4f78']].forEach(([s, c]) => grad.addColorStop(s, c));
 ctx.fillStyle = grad; ctx.fillRect(0, 0, 1024, 512);

 for (let i = 0; i < 42; i++) {
  const cx = (i * 137) % 1024, cy = 195 + (i % 8) * 9, cw = 95 + (i % 6) * 38, ch = 9 + (i % 4) * 4;
  const cGrad = ctx.createLinearGradient(cx, cy - ch, cx, cy + ch);
  cGrad.addColorStop(0, cy < 228 ? 'rgba(255,212,148,.52)' : 'rgba(255,188,112,.62)');
  cGrad.addColorStop(0.5, cy < 228 ? 'rgba(235,134,108,.36)' : 'rgba(232,93,86,.45)');
  cGrad.addColorStop(1, 'rgba(72,65,115,0)');
  ctx.fillStyle = cGrad; ctx.beginPath(); ctx.ellipse(cx, cy, cw, ch, 0, 0, Math.PI * 2); ctx.fill();
 }
 return new THREE.CanvasTexture(skyCanvas);
}

function buildTwilightSkyTexture(THREE) {
 const c = document.createElement('canvas');
 c.width = 1024; c.height = 512;
 const ctx = c.getContext('2d'), grad = ctx.createLinearGradient(0, 0, 0, 512);
 [[0, '#0a071c'], [0.22, '#1a1236'], [0.38, '#29174d'], [0.46, '#4f245e'], [0.51, '#9c3b62'], [0.56, '#401b4f'], [1, '#0e0b24']].forEach(([s, col]) => grad.addColorStop(s, col));
 ctx.fillStyle = grad; ctx.fillRect(0, 0, 1024, 512);

 for (let i = 0; i < 90; i++) {
  const sx = (i * 173 + 29) % 1024, sy = 14 + (i * 59) % 185, r = (i % 4 === 0) ? 1.5 : 0.9;
  ctx.fillStyle = i % 3 === 0 ? 'rgba(255,236,195,0.72)' : 'rgba(185,220,255,0.58)';
  ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill();
 }
 for (let i = 0; i < 26; i++) {
  const cx = (i * 151) % 1024, cy = 208 + (i % 6) * 8, cw = 110 + (i % 5) * 34, ch = 8 + (i % 3) * 4;
  const cGrad = ctx.createLinearGradient(cx, cy - ch, cx, cy + ch);
  cGrad.addColorStop(0, 'rgba(195,88,125,0.28)');
  cGrad.addColorStop(1, 'rgba(30,18,62,0)');
  ctx.fillStyle = cGrad; ctx.beginPath(); ctx.ellipse(cx, cy, cw, ch, 0, 0, Math.PI * 2); ctx.fill();
 }
 return new THREE.CanvasTexture(c);
}

function buildNightMarketPlaza(THREE) {
 const nm = new THREE.Group();
 const Std = (p) => new THREE.MeshStandardMaterial(p), Bas = (p) => new THREE.MeshBasicMaterial(p);

 // Tiled plaza ground texture
 const tCanvas = document.createElement('canvas'); tCanvas.width = 256; tCanvas.height = 256;
 const tCtx = tCanvas.getContext('2d');
 tCtx.fillStyle = '#241e33'; tCtx.fillRect(0, 0, 256, 256);
 for (let y = 0; y < 256; y += 32) {
  for (let x = 0; x < 256; x += 32) {
   const alt = ((x / 32) + (y / 32)) % 2 === 0;
   tCtx.fillStyle = alt ? '#332842' : '#292238';
   tCtx.fillRect(x + 2, y + 2, 28, 28);
   tCtx.fillStyle = 'rgba(255,190,120,0.08)';
   tCtx.fillRect(x + 4, y + 4, 24, 3);
  }
 }
 const tileTex = new THREE.CanvasTexture(tCanvas);
 tileTex.wrapS = tileTex.wrapT = THREE.RepeatWrapping;
 tileTex.repeat.set(5, 7);
 const plaza = new THREE.Mesh(new THREE.PlaneGeometry(34, 48), Std({ map: tileTex, roughness: 0.52, metalness: 0.14 }));
 plaza.rotation.x = -Math.PI / 2; plaza.position.set(220, 0.09, 364);
 nm.add(plaza);

 // Subtle neon plaza border strips
 for (const [bx, col] of [[204.2, 0xff4d79], [235.8, 0x00e5ff]]) {
  const strip = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 46), Bas({ color: col }));
  strip.rotation.x = -Math.PI / 2; strip.position.set(bx, 0.1, 364);
  nm.add(strip);
 }

 // Glowing night-market stalls & neon shopfronts
 const makeSignTex = (text, bg, border) => {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64;
  const ctx = c.getContext('2d');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 256, 64);
  ctx.strokeStyle = border; ctx.lineWidth = 5; ctx.strokeRect(4, 4, 248, 56);
  ctx.fillStyle = '#fff9e6'; ctx.font = '900 24px "Segoe UI", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 128, 33);
  return new THREE.CanvasTexture(c);
 };

 const stalls = [
  [204.8, 353, Math.PI / 2, 0xff4d79, 'MERCADO NOCTURNO', '#240b2c', '#00f0ff'],
  [204.8, 365, Math.PI / 2, 0xff9f1c, 'PALMA TACOS', '#2b120c', '#ffd166'],
  [204.8, 375, Math.PI / 2, 0x00d8d6, 'NEON BAZAAR', '#092238', '#ff4d79'],
  [235.2, 354, -Math.PI / 2, 0xb978ff, 'ARCADE 88', '#1b0d33', '#00e5ff'],
  [235.2, 363, -Math.PI / 2, 0xff5e7e, 'CAFE SOLANA', '#2a0f22', '#ffbf3c'],
 ];
 stalls.forEach(([sx, sz, rotY, canopyCol, title, bg, border]) => {
  const st = new THREE.Group();
  st.position.set(sx, 0, sz); st.rotation.y = rotY;
  const base = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.05, 3.2), Std({ color: 0x261e38, roughness: 0.6 }));
  base.position.y = 0.52;
  const counterGlow = new THREE.Mesh(new THREE.BoxGeometry(6.8, 1.8, 2.6), Bas({ color: 0xffb347, transparent: true, opacity: 0.28 }));
  counterGlow.position.y = 1.9;
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.45, 4.0), Std({ color: canopyCol, emissive: canopyCol, emissiveIntensity: 0.25, roughness: 0.4 }));
  canopy.position.set(0, 3.35, 0.35); canopy.rotation.x = 0.14;
  for (const px of [-3.4, 3.4]) {
   const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.3, 6), Std({ color: 0x1a1f2e, metalness: 0.7 }));
   post.position.set(px, 1.65, 1.5); st.add(post);
  }
  const sign = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.25, 0.25), Bas({ map: makeSignTex(title, bg, border) }));
  sign.position.set(0, 4.25, 1.2);
  st.add(base, counterGlow, canopy, sign);
  nm.add(st);
 });

 // Overhead festoon string lights across the night-market plaza
 const bulbMatA = Bas({ color: 0xffe07a }), bulbMatB = Bas({ color: 0xff8a3d });
 const cableMat = Bas({ color: 0x1e182e });
 [352, 360, 368].forEach((lz, rowIdx) => {
  const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 30, 5), cableMat);
  cable.rotation.z = Math.PI / 2; cable.position.set(220, 5.65, lz);
  nm.add(cable);
  for (let b = 0; b <= 12; b++) {
   const t = b / 12, bx = 205.5 + t * 29, sag = Math.sin(t * Math.PI) * 0.75;
   const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), (b + rowIdx) % 2 === 0 ? bulbMatA : bulbMatB);
   bulb.position.set(bx, 5.55 - sag, lz);
   nm.add(bulb);
  }
 });

 // Warm twilight market fill lights
 const pWarm = new THREE.PointLight(0xff9b3d, 1.45, 36); pWarm.position.set(218, 6.2, 362);
 const pPink = new THREE.PointLight(0xff3b78, 0.95, 32); pPink.position.set(208, 4.8, 358);
 const pCyan = new THREE.PointLight(0x00e5ff, 0.85, 32); pCyan.position.set(232, 4.8, 356);
 nm.add(pWarm, pPink, pCyan);
 nm.visible = false;
 return nm;
}

export function buildOceanAndSky(scene) {
 const THREE = window.THREE;
 const group = new THREE.Group();

 const sunsetTex = buildSunsetSkyTexture(THREE);
 const twilightTex = buildTwilightSkyTexture(THREE);
 const skyMat = new THREE.MeshBasicMaterial({ map: sunsetTex, side: THREE.BackSide, depthWrite: false, fog: false });
 group.add(new THREE.Mesh(new THREE.SphereGeometry(1450, 40, 28), skyMat));

 const sunTexCanvas = document.createElement('canvas');
 sunTexCanvas.width = 256; sunTexCanvas.height = 256;
 const sctx = sunTexCanvas.getContext('2d'), sGrad = sctx.createRadialGradient(128, 128, 10, 128, 128, 124);
 [[0, 'rgba(255,252,225,.98)'], [0.18, 'rgba(255,218,115,.92)'], [0.42, 'rgba(245,158,66,.52)'], [0.72, 'rgba(232,93,86,.18)'], [1, 'rgba(232,93,86,0)']].forEach(([s, c]) => sGrad.addColorStop(s, c));
 sctx.fillStyle = sGrad; sctx.fillRect(0, 0, 256, 256);

 const sunGlow = new THREE.Mesh(
  new THREE.PlaneGeometry(135, 135),
  new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sunTexCanvas), transparent: true, depthWrite: false, fog: false })
 );
 sunGlow.position.set(-165, 178, -520); sunGlow.lookAt(110, 12, 40);
 group.add(sunGlow);

 const addPlane = (w, h, mat, x, y, z, wSeg = 1, hSeg = 1) => {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h, wSeg, hSeg), mat);
  m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); group.add(m); return m;
 };

 addPlane(2400, 2400, new THREE.MeshStandardMaterial({ color: 0x6c7382, roughness: 0.85, metalness: 0.05 }), 0, -0.06, 0);
 addPlane(WORLD_CONFIG.beachWidth + 24, 2200, new THREE.MeshStandardMaterial({ color: 0xf4e3be, roughness: 0.78, metalness: 0.04 }), WORLD_CONFIG.oceanX - WORLD_CONFIG.beachWidth * 0.45, 0.03, 0, 8, 32);
 const surf = addPlane(6.5, 2200, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 }), WORLD_CONFIG.oceanX + 1.5, 0.05, 0);
 addPlane(48, 2200, new THREE.MeshBasicMaterial({ color: 0x00d2de, transparent: true, opacity: 0.8 }), WORLD_CONFIG.oceanX + 25, 0.01, 0);
 const waterMat = new THREE.MeshStandardMaterial({ color: 0x0085b2, emissive: 0x033856, roughness: 0.18, metalness: 0.58, transparent: true, opacity: 0.96 });
 const water = addPlane(960, 2400, waterMat, WORLD_CONFIG.oceanX + 480, -0.1, 0, 32, 64);

 const ambientLight = new THREE.AmbientLight(0xffdfc2, 0.34);
 const hemiLight = new THREE.HemisphereLight(0xffc994, 0x2c5278, 0.68);
 const sunLight = new THREE.DirectionalLight(0xffa952, 0.98); sunLight.position.set(-220, 195, -340);
 const fillLight = new THREE.DirectionalLight(0x52b8e8, 0.42); fillLight.position.set(260, 140, 280);
 group.add(ambientLight, hemiLight, sunLight, fillLight);

 const nightMarketGroup = buildNightMarketPlaza(THREE);
 group.add(nightMarketGroup);
 scene.add(group);

 function setAtmosphere(mode = 'sunset') {
  const isTwilight = mode === 'twilight';
  skyMat.map = isTwilight ? twilightTex : sunsetTex;
  skyMat.needsUpdate = true;
  sunGlow.visible = !isTwilight;
  nightMarketGroup.visible = isTwilight;
  if (scene.fog) {
   scene.fog.color.setHex(isTwilight ? 0x1a1236 : 0xe89b6c);
   scene.fog.density = isTwilight ? 0.00055 : 0.00038;
  }
  if (isTwilight) {
   ambientLight.color.setHex(0x4a4382); ambientLight.intensity = 0.52;
   hemiLight.color.setHex(0x644ca8); hemiLight.groundColor.setHex(0x18132e); hemiLight.intensity = 0.62;
   sunLight.color.setHex(0x9b8cff); sunLight.intensity = 0.42;
   fillLight.color.setHex(0xff7d47); fillLight.intensity = 0.72;
   waterMat.color.setHex(0x00496e); waterMat.emissive.setHex(0x051c38);
  } else {
   ambientLight.color.setHex(0xffdfc2); ambientLight.intensity = 0.34;
   hemiLight.color.setHex(0xffc994); hemiLight.groundColor.setHex(0x2c5278); hemiLight.intensity = 0.68;
   sunLight.color.setHex(0xffa952); sunLight.intensity = 0.98;
   fillLight.color.setHex(0x52b8e8); fillLight.intensity = 0.42;
   waterMat.color.setHex(0x0085b2); waterMat.emissive.setHex(0x033856);
  }
 }

 return {
  water, surf, sunGlow, setAtmosphere,
  update(time) {
   const pos = water.geometry.attributes.position;
   for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i), vy = pos.getY(i);
    pos.setZ(i, Math.sin(vx * 0.06 + time * 2.2) * 0.25 + Math.cos(vy * 0.04 + time * 1.7) * 0.2);
   }
   pos.needsUpdate = true;
   surf.position.x = WORLD_CONFIG.oceanX + 1.5 + Math.sin(time * 1.6) * 0.9;
  },
 };
}
