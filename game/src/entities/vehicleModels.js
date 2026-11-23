// Sculpted fastback sports cars, SUVs & Palma PD cruisers with A/B/C pillars, 5-spoke alloy rims, brake calipers, rear diffuser & lightbars
import { VEHICLE_ARCHETYPES } from '../core/config.js';

let pdDoorTex = null, plateTex = null;

function getPoliceDoorTexture() {
 if (pdDoorTex) return pdDoorTex;
 const c = document.createElement('canvas'); c.width = 256; c.height = 128;
 const ctx = c.getContext('2d');
 ctx.fillStyle = '#f5f8ff'; ctx.fillRect(0, 0, 256, 128);
 ctx.fillStyle = '#0f2547'; ctx.fillRect(0, 0, 256, 20); ctx.fillRect(0, 104, 256, 24);
 ctx.fillStyle = '#ffc83b'; ctx.fillRect(0, 20, 256, 7);
 ctx.fillStyle = '#0f2547'; ctx.font = '900 30px "Segoe UI", sans-serif'; ctx.textAlign = 'center';
 ctx.fillText('PALMA PD', 128, 64);
 ctx.fillStyle = '#e01e37'; ctx.font = '900 20px "Segoe UI", sans-serif';
 ctx.fillText('INTERCEPTOR · 911', 128, 92);
 return (pdDoorTex = new window.THREE.CanvasTexture(c));
}

function getLicensePlateTexture() {
 if (plateTex) return plateTex;
 const c = document.createElement('canvas'); c.width = 128; c.height = 48;
 const ctx = c.getContext('2d');
 ctx.fillStyle = '#fff5d6'; ctx.fillRect(0, 0, 128, 48);
 ctx.strokeStyle = '#ff4d79'; ctx.lineWidth = 4; ctx.strokeRect(2, 2, 124, 44);
 ctx.fillStyle = '#0c182e'; ctx.font = '900 22px "Segoe UI", sans-serif'; ctx.textAlign = 'center';
 ctx.fillText('PALMA-88', 64, 33);
 return (plateTex = new window.THREE.CanvasTexture(c));
}

export function buildSculptedVehicleMesh(archetype) {
 const THREE = window.THREE, root = new THREE.Group();
 const L = archetype.length || 4.8, W = archetype.width || 2.18, H = archetype.height || 1.28;
 const isPolice = archetype.cls === 'POLICE', isHeavy = archetype.cls === 'HEAVY' || archetype.cls === 'SUV';
 const isFastback = archetype.cls === 'EXOTIC' || archetype.cls === 'SPORTS';

 const Std = (p) => new THREE.MeshStandardMaterial(p), Bas = (p) => new THREE.MeshBasicMaterial(p);
 const paintMat = Std({ color: archetype.color, emissive: archetype.cls === 'EXOTIC' ? 0x260500 : 0, roughness: 0.22, metalness: 0.35 });
 const accentMat = Std({ color: archetype.accent, roughness: 0.28, metalness: 0.24 });
 const carbonMat = Std({ color: 0x151a24, roughness: 0.32, metalness: 0.45 });
 const chromeMat = Std({ color: 0xe6f0ff, roughness: 0.15, metalness: 0.92 });
 const glassMat = Std({ color: 0x0b172a, emissive: 0x061326, roughness: 0.08, metalness: 0.55 });
 const tireMat = Std({ color: 0x11141b, roughness: 0.85 });
 const caliperMat = Bas({ color: isPolice ? 0xffbf3c : 0xff2248 });
 const headMat = Bas({ color: 0xeaffff }), tailMat = Bas({ color: 0xff1e42 });

 const B = (w, h, d, mat, x, y, z, rx = 0) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); if (rx) m.rotation.x = rx; root.add(m); return m;
 };

 const cLen = isHeavy ? L * 0.58 : L * 0.38, cH = isHeavy ? H * 0.48 : H * 0.38, cZ = isHeavy ? -L * 0.06 : -L * 0.03;
 const roofMat = isPolice ? accentMat : paintMat, rPitch = isFastback ? 0.74 : 0.58;

 [
  [W * 0.96, H * 0.34, L * 0.96, paintMat, 0, H * 0.33, 0, 0],
  [W * 1.03, 0.09, L * 0.62, carbonMat, 0, H * 0.18, 0, 0],
  [W * 1.01, 0.08, 0.38, carbonMat, 0, H * 0.16, L * 0.49, 0],
  [W * 0.68, H * 0.2, 0.12, carbonMat, 0, H * 0.31, L * 0.485, 0],
  [W * 0.9, H * 0.21, L * 0.38, paintMat, 0, H * 0.51, L * 0.27, 0.17],
  [W * 0.88, 0.16, 0.22, carbonMat, 0, H * 0.18, -L * 0.47, 0],
  [W * 0.9, 0.14, 0.1, tailMat, 0, H * 0.48, -L * 0.49, 0],
  [W * 0.78, 0.09, cLen * 0.88, roofMat, 0, H * 0.9, cZ, 0],
  [W * 0.76, cH * 0.88, cLen * 0.84, glassMat, 0, H * 0.7, cZ, 0],
  [W * 0.75, cH * 0.95, 0.1, glassMat, 0, H * 0.71, cZ + cLen * 0.52, -0.64],
  [W * 0.73, cH * 1.04, 0.1, glassMat, 0, H * 0.69, cZ - cLen * 0.56, rPitch],
  [W * 0.92, H * 0.22, L * 0.28, paintMat, 0, H * 0.51, -L * 0.34, -0.08],
 ].forEach((a) => B(...a));

 const archOffsets = [[-W * 0.48, L * 0.31], [W * 0.48, L * 0.31], [-W * 0.48, -L * 0.31], [W * 0.48, -L * 0.31]];
 for (const [ax, az] of archOffsets) B(0.16, H * 0.32, 0.92, paintMat, ax, H * 0.42, az);

 if (isPolice) {
  B(W * 1.01, H * 0.38, L * 0.48, Std({ map: getPoliceDoorTexture(), roughness: 0.26, metalness: 0.2 }), 0, H * 0.36, -L * 0.01);
  B(W * 0.62, 0.11, 0.22, carbonMat, 0, H * 0.38, L * 0.53);
 }
 if (isFastback || isPolice) B(W * 0.96, 0.07, 0.36, isPolice ? paintMat : carbonMat, 0, H * 0.88, -L * 0.45, 0.16);

 for (const s of [-1, 1]) {
  B(0.24, 0.05, 0.52, carbonMat, s * W * 0.22, H * 0.6, L * 0.26, 0.17);
  B(0.08, cH * 0.98, 0.11, roofMat, s * W * 0.38, H * 0.71, cZ + cLen * 0.52, -0.64);
  B(0.09, cH * 0.9, 0.14, carbonMat, s * W * 0.38, H * 0.71, cZ - 0.05);
  B(0.11, cH * 1.05, 0.22, roofMat, s * W * 0.38, H * 0.7, cZ - cLen * 0.56, rPitch);
  B(0.24, 0.12, 0.16, paintMat, s * (W * 0.38 + 0.14), H * 0.62, cZ + cLen * 0.38);
  B(0.42, 0.14, 0.12, headMat, s * W * 0.34, H * 0.42, L * 0.49);
  B(0.36, 0.18, 0.12, tailMat, s * W * 0.35, H * 0.48, -L * 0.495);
  if (isPolice) B(0.09, H * 0.38, 0.24, carbonMat, s * W * 0.24, H * 0.34, L * 0.53);
  if (isFastback) B(0.16, 0.04, L * 0.36, accentMat, s * 0.21, H * 0.62, L * 0.27, 0.17);
  if (isFastback || isPolice) {
   B(0.08, 0.26, 0.22, carbonMat, s * W * 0.34, H * 0.74, -L * 0.44);
   B(0.05, 0.18, 0.42, accentMat, s * W * 0.48, H * 0.88, -L * 0.45);
  }
  for (const o of [0.18, 0.26]) {
   const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.24, 10), chromeMat);
   pipe.rotation.x = Math.PI / 2; pipe.position.set(s * W * o, H * 0.19, -L * 0.5); root.add(pipe);
  }
 }

 const plateMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.22), Bas({ map: getLicensePlateTexture() }));
 plateMesh.rotation.y = Math.PI; plateMesh.position.set(0, H * 0.33, -L * 0.495); root.add(plateMesh);
 const shadowPlate = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.14, L * 1.08), Bas({ color: 0x050810, transparent: true, opacity: 0.52, depthWrite: false }));
 shadowPlate.rotation.x = -Math.PI / 2; shadowPlate.position.y = 0.06; root.add(shadowPlate);

 const wheels = [];
 for (const [wx, wz] of archOffsets) {
  const wGroup = new THREE.Group();
  [[0.39, 0.34, 16, tireMat], [0.27, 0.35, 14, chromeMat], [0.22, 0.355, 12, carbonMat]].forEach(([r, len, seg, mat]) => {
   const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg), mat);
   m.rotation.z = Math.PI / 2; wGroup.add(m);
  });
  for (let sp = 0; sp < 5; sp++) {
   const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.365, 0.055, 0.24), chromeMat);
   spoke.rotation.x = (sp / 5) * Math.PI * 2; wGroup.add(spoke);
  }
  const cal = new THREE.Mesh(new THREE.BoxGeometry(0.362, 0.14, 0.09), caliperMat);
  cal.position.set(0, 0.11, 0.11); wGroup.add(cal);
  wGroup.position.set(wx, 0.39, wz); root.add(wGroup); wheels.push(wGroup);
 }

 let sirenRed = null, sirenBlue = null, sirenLight = null;
 if (isPolice) {
  B(W * 0.78, 0.09, 0.32, carbonMat, 0, H * 0.96, cZ);
  sirenRed = B(W * 0.36, 0.18, 0.3, Bas({ color: 0xff1744 }), -W * 0.2, H * 1.04, cZ);
  sirenBlue = B(W * 0.36, 0.18, 0.3, Bas({ color: 0x00d8ff }), W * 0.2, H * 1.04, cZ);
  for (const [px, col] of [[-W * 0.68, 0xff1744], [W * 0.68, 0x00d8ff]]) {
   const pool = new THREE.Mesh(new THREE.CircleGeometry(1.65, 14), Bas({ color: col, transparent: true, opacity: 0.22, depthWrite: false }));
   pool.rotation.x = -Math.PI / 2; pool.position.set(px, 0.08, 0); root.add(pool);
  }
  sirenLight = new THREE.PointLight(0xff1744, 0.85, 12);
  sirenLight.position.set(0, H + 1.25, 0); root.add(sirenLight);
 }

 root.userData = { wheels, sirenRed, sirenBlue, sirenLight };
 return root;
}

export function getArchetypeById(id) {
 return VEHICLE_ARCHETYPES.find((a) => a.id === id) || VEHICLE_ARCHETYPES[0];
}
