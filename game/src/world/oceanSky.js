// High-contrast tropical golden-hour sunset sky dome, off-center sun corona, layered cloud bands, beach & ocean
import { WORLD_CONFIG } from '../core/config.js';

export function buildOceanAndSky(scene) {
 const THREE = window.THREE;
 const group = new THREE.Group();

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

 group.add(new THREE.Mesh(
  new THREE.SphereGeometry(1450, 40, 28),
  new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(skyCanvas), side: THREE.BackSide, depthWrite: false, fog: false })
 ));

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
 addPlane(WORLD_CONFIG.beachWidth + 24, 2200, new THREE.MeshStandardMaterial({ color: 0xe8b86d, roughness: 0.8, metalness: 0.04 }), WORLD_CONFIG.oceanX - WORLD_CONFIG.beachWidth * 0.45, 0.03, 0, 8, 32);
 const surf = addPlane(6.5, 2200, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.88 }), WORLD_CONFIG.oceanX + 1.5, 0.05, 0);
 addPlane(48, 2200, new THREE.MeshBasicMaterial({ color: 0x00c8d8, transparent: true, opacity: 0.76 }), WORLD_CONFIG.oceanX + 25, 0.01, 0);
 const water = addPlane(960, 2400, new THREE.MeshStandardMaterial({ color: 0x007da8, emissive: 0x033654, roughness: 0.18, metalness: 0.58, transparent: true, opacity: 0.96 }), WORLD_CONFIG.oceanX + 480, -0.1, 0, 32, 64);

 group.add(new THREE.AmbientLight(0xffdfc2, 0.34), new THREE.HemisphereLight(0xffc994, 0x2c5278, 0.68));
 const sunLight = new THREE.DirectionalLight(0xffa952, 0.98); sunLight.position.set(-220, 195, -340);
 const fillLight = new THREE.DirectionalLight(0x52b8e8, 0.42); fillLight.position.set(260, 140, 280);
 group.add(sunLight, fillLight);

 scene.add(group);
 return {
  water, surf, sunGlow,
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
