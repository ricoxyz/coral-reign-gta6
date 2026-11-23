// Sculpted fastback sports cars, SUVs & Palma PD cruisers with extruded aerodynamic cabins, rounded wheel fenders, 5-spoke alloy rims & lightbars
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

function extrudeSideProfile(THREE, pts, width, bevel = 0.06) {
 const shape = new THREE.Shape();
 shape.moveTo(pts[0][0], pts[0][1]);
 for (let i = 1; i < pts.length; i++) shape.lineTo(pts[i][0], pts[i][1]);
 shape.closePath();
 const geo = new THREE.ExtrudeGeometry(shape, {
  depth: width,
  bevelEnabled: bevel > 0,
  bevelThickness: bevel,
  bevelSize: bevel * 0.85,
  bevelSegments: 2,
 });
 geo.rotateY(-Math.PI / 2);
 geo.translate(width * 0.5, 0, 0);
 return geo;
}

export function buildSculptedVehicleMesh(archetype) {
 const THREE = window.THREE, root = new THREE.Group();
 const L = archetype.length || 4.8, W = archetype.width || 2.18, H = archetype.height || 1.28;
 const isPolice = archetype.cls === 'POLICE', isHeavy = archetype.cls === 'HEAVY' || archetype.cls === 'SUV';
 const isFastback = archetype.cls === 'EXOTIC' || archetype.cls === 'SPORTS' || archetype.cls === 'LUXURY';

 const Std = (p) => new THREE.MeshStandardMaterial(p), Bas = (p) => new THREE.MeshBasicMaterial(p);
 const paintMat = Std({ color: archetype.color, emissive: archetype.cls === 'EXOTIC' ? 0x260500 : 0, roughness: 0.2, metalness: 0.38 });
 const accentMat = Std({ color: archetype.accent, roughness: 0.26, metalness: 0.28 });
 const carbonMat = Std({ color: 0x151a24, roughness: 0.3, metalness: 0.48 });
 const chromeMat = Std({ color: 0xe6f0ff, roughness: 0.14, metalness: 0.92 });
 const glassMat = Std({ color: 0x0a1728, emissive: 0x051326, roughness: 0.07, metalness: 0.65 });
 const tireMat = Std({ color: 0x11141b, roughness: 0.85 });
 const caliperMat = Bas({ color: isPolice ? 0xffbf3c : 0xff2248 });
 const headMat = Bas({ color: 0xeaffff }), tailMat = Bas({ color: 0xff1e42 });

 const B = (w, h, d, mat, x, y, z, rx = 0) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); if (rx) m.rotation.x = rx; root.add(m); return m;
 };

 // Multi-segment extruded aerodynamic lower body (curved front hood, sculpted rear haunch)
 const bodyPts = isHeavy
  ? [[-L * 0.48, 0.24], [L * 0.46, 0.24], [L * 0.49, 0.42], [L * 0.46, H * 0.56], [L * 0.24, H * 0.62], [-L * 0.47, H * 0.62], [-L * 0.49, 0.42]]
  : [[-L * 0.48, 0.22], [L * 0.46, 0.21], [L * 0.5, 0.34], [L * 0.46, H * 0.48], [L * 0.33, H * 0.55], [L * 0.16, H * 0.58], [-L * 0.36, H * 0.61], [-L * 0.49, H * 0.56], [-L * 0.495, 0.34]];
 root.add(new THREE.Mesh(extrudeSideProfile(THREE, bodyPts, W * 0.86, 0.07), paintMat));

 // Sloped fastback / interceptor greenhouse canopy (raked windshield + curved roof + sloped rear glass)
 const cabinPts = isHeavy
  ? [[-L * 0.44, H * 0.56], [L * 0.24, H * 0.56], [L * 0.14, H * 0.96], [-L * 0.41, H * 0.96]]
  : isPolice
   ? [[-L * 0.36, H * 0.55], [L * 0.2, H * 0.55], [L * 0.04, H * 0.96], [-L * 0.18, H * 0.96]]
   : [[-L * 0.39, H * 0.55], [L * 0.2, H * 0.54], [L * 0.02, H * 0.96], [-L * 0.14, H * 0.97]];
 root.add(new THREE.Mesh(extrudeSideProfile(THREE, cabinPts, W * 0.7, 0.045), glassMat));

 // Painted roof cap & A/C pillar buttresses framing the glass
 const roofMat = isPolice ? accentMat : paintMat;
 const roofTopPts = isHeavy
  ? [[-L * 0.4, H * 0.93], [L * 0.13, H * 0.93], [L * 0.11, H * 0.99], [-L * 0.39, H * 0.99]]
  : isPolice
   ? [[-L * 0.18, H * 0.93], [L * 0.04, H * 0.93], [L * 0.02, H * 0.99], [-L * 0.16, H * 0.99]]
   : [[-L * 0.15, H * 0.93], [L * 0.02, H * 0.93], [0, H * 0.995], [-L * 0.13, H * 0.995]];
 root.add(new THREE.Mesh(extrudeSideProfile(THREE, roofTopPts, W * 0.66, 0.03), roofMat));

 // Aero front splitter, side rocker skirts, rear diffuser & LED tailbar
 B(W * 1.02, 0.08, L * 0.64, carbonMat, 0, H * 0.17, 0);
 B(W * 0.99, 0.07, 0.34, carbonMat, 0, H * 0.16, L * 0.495);
 B(W * 0.68, H * 0.17, 0.12, carbonMat, 0, H * 0.29, L * 0.485);
 B(W * 0.88, 0.15, 0.22, carbonMat, 0, H * 0.18, -L * 0.475);
 B(W * 0.88, 0.09, 0.1, tailMat, 0, H * 0.48, -L * 0.505);

 const archOffsets = [[-W * 0.47, L * 0.31], [W * 0.47, L * 0.31], [-W * 0.47, -L * 0.31], [W * 0.47, -L * 0.31]];
 for (const [ax, az] of archOffsets) {
  const flare = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.075, 8, 16, Math.PI), paintMat);
  flare.rotation.y = Math.PI / 2;
  flare.position.set(ax, 0.41, az);
  root.add(flare);
  const well = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.28, 14), carbonMat);
  well.rotation.z = Math.PI / 2;
  well.position.set(ax * 0.88, 0.4, az);
  root.add(well);
 }

 if (isPolice) {
  B(W * 1.01, H * 0.34, L * 0.44, Std({ map: getPoliceDoorTexture(), roughness: 0.26, metalness: 0.2 }), 0, H * 0.36, -L * 0.01);
  B(W * 0.62, 0.1, 0.2, carbonMat, 0, H * 0.36, L * 0.53);
 }
 if (isFastback || isPolice) B(W * 0.96, 0.06, 0.34, isPolice ? paintMat : carbonMat, 0, H * 0.84, -L * 0.45, 0.15);

 const cZ = isHeavy ? -L * 0.06 : -L * 0.05, cLen = isHeavy ? L * 0.56 : L * 0.36;
 for (const s of [-1, 1]) {
  // Sloped A-pillars, C-pillar fastback buttresses & side mirrors
  B(0.075, H * 0.42, 0.09, roofMat, s * W * 0.35, H * 0.74, L * 0.11, -0.78);
  B(0.095, H * 0.48, 0.15, roofMat, s * W * 0.35, H * 0.74, -L * 0.26, isFastback ? 0.92 : 0.72);
  B(0.22, 0.1, 0.15, paintMat, s * (W * 0.37 + 0.13), H * 0.6, cZ + cLen * 0.42);
  B(0.4, 0.12, 0.12, headMat, s * W * 0.33, H * 0.4, L * 0.49);
  B(0.34, 0.15, 0.12, tailMat, s * W * 0.34, H * 0.48, -L * 0.505);
  if (isPolice) B(0.08, H * 0.34, 0.22, carbonMat, s * W * 0.24, H * 0.34, L * 0.53);
  if (isFastback) {
   B(0.14, 0.04, L * 0.34, accentMat, s * 0.21, H * 0.58, L * 0.27, 0.15);
   B(0.08, 0.22, 0.58, carbonMat, s * W * 0.46, H * 0.36, -L * 0.04);
  }
  if (isFastback || isPolice) {
   B(0.07, 0.23, 0.2, carbonMat, s * W * 0.34, H * 0.71, -L * 0.44);
   B(0.05, 0.16, 0.38, accentMat, s * W * 0.48, H * 0.84, -L * 0.45);
  }
  for (const o of [0.18, 0.26]) {
   const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.22, 10), chromeMat);
   pipe.rotation.x = Math.PI / 2; pipe.position.set(s * W * o, H * 0.19, -L * 0.505); root.add(pipe);
  }
 }

 const plateMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.21), Bas({ map: getLicensePlateTexture() }));
 plateMesh.rotation.y = Math.PI; plateMesh.position.set(0, H * 0.33, -L * 0.506); root.add(plateMesh);
 const shadowPlate = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.14, L * 1.08), Bas({ color: 0x050810, transparent: true, opacity: 0.52, depthWrite: false }));
 shadowPlate.rotation.x = -Math.PI / 2; shadowPlate.position.y = 0.06; root.add(shadowPlate);

 const wheels = [];
 for (const [wx, wz] of archOffsets) {
  const wGroup = new THREE.Group();
  [[0.39, 0.34, 18, tireMat], [0.27, 0.35, 14, chromeMat], [0.22, 0.355, 12, carbonMat]].forEach(([r, len, seg, mat]) => {
   const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg), mat);
   m.rotation.z = Math.PI / 2; wGroup.add(m);
  });
  for (let sp = 0; sp < 5; sp++) {
   const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.365, 0.05, 0.24), chromeMat);
   spoke.rotation.x = (sp / 5) * Math.PI * 2; wGroup.add(spoke);
  }
  const cal = new THREE.Mesh(new THREE.BoxGeometry(0.362, 0.14, 0.09), caliperMat);
  cal.position.set(0, 0.11, 0.11); wGroup.add(cal);
  wGroup.position.set(wx, 0.39, wz); root.add(wGroup); wheels.push(wGroup);
 }

 let sirenRed = null, sirenBlue = null, sirenLight = null;
 if (isPolice) {
  const barZ = -L * 0.07;
  B(W * 0.74, 0.08, 0.3, carbonMat, 0, H * 0.99, barZ);
  sirenRed = B(W * 0.34, 0.16, 0.28, Bas({ color: 0xff1744 }), -W * 0.19, H * 1.06, barZ);
  sirenBlue = B(W * 0.34, 0.16, 0.28, Bas({ color: 0x00d8ff }), W * 0.19, H * 1.06, barZ);
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
