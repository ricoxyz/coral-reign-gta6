// Sculpted curved tropical palm trees, beach umbrellas & loungers, tactical cover crates, yachts, & 3D Palma Pier Ferris wheel
import { ROAD_Z } from './roads.js';

export function createPalmTreeMesh(THREE, scale = 1) {
 const palm = new THREE.Group();
 const trunkMat = new THREE.MeshStandardMaterial({ color: 0x9c6b43, roughness: 0.78 });
 const frondMat = new THREE.MeshStandardMaterial({ color: 0x38d864, emissive: 0x10451c, roughness: 0.38, side: THREE.DoubleSide });
 let curY = 0, curX = 0;
 for (let i = 0; i < 5; i++) {
  const segH = 1.65 * scale;
  const seg = new THREE.Mesh(new THREE.CylinderGeometry((0.3 - i * 0.04) * scale, (0.34 - i * 0.04) * scale, segH, 7), trunkMat);
  seg.position.set(curX, curY + segH * 0.5, 0); seg.rotation.z = -i * 0.05;
  palm.add(seg); curY += segH * 0.96; curX += i * 0.09 * scale;
 }
 const crown = new THREE.Group(); crown.position.set(curX, curY, 0);
 for (let f = 0; f < 8; f++) {
  const holder = new THREE.Group(); holder.rotation.y = (f / 8) * Math.PI * 2;
  const inner = new THREE.Mesh(new THREE.ConeGeometry(0.45 * scale, 2.2 * scale, 4), frondMat);
  inner.rotation.z = -Math.PI * 0.42; inner.position.set(1.0 * scale, 0.1 * scale, 0);
  const outer = new THREE.Mesh(new THREE.ConeGeometry(0.38 * scale, 2.1 * scale, 4), frondMat);
  outer.rotation.z = -Math.PI * 0.62; outer.position.set(2.45 * scale, -0.45 * scale, 0);
  holder.add(inner, outer); crown.add(holder);
 }
 palm.add(crown);
 return palm;
}

export function buildWorldProps(scene) {
 const THREE = window.THREE;
 const Std = (p) => new THREE.MeshStandardMaterial(p), Bas = (p) => new THREE.MeshBasicMaterial(p);
 const group = new THREE.Group(), palmCrowns = [], stuntRamps = [];
 const addM = (parent, geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
 const poleMat = Std({ color: 0x222c3c, metalness: 0.8 });

 for (const [lx, sides, lamps] of [[110, [-14.2, 14.2], true], [220, [-14.2, 14.2], true], [246, [0], false], [0, [-14.2, 14.2], true]]) {
  for (let z = -380; z <= 380; z += 26) {
   if (ROAD_Z.some((rz) => Math.abs(z - rz) < 16)) continue;
   for (const side of sides) {
    const palm = createPalmTreeMesh(THREE, 0.95 + ((Math.abs(z) % 5) * 0.08));
    palm.position.set(lx + side, 0, z); palm.rotation.y = (z * 0.3) % (Math.PI * 2);
    group.add(palm); palmCrowns.push(palm);
   }
   if (lamps) {
    addM(group, new THREE.CylinderGeometry(0.1, 0.14, 5.5, 6), poleMat, lx + 12.8, 2.75, z + 11);
    addM(group, new THREE.SphereGeometry(0.4, 8, 8), Bas({ color: ((z / 26) | 0) % 2 === 0 ? 0xff4d79 : 0x00f0ff }), lx + 12.8, 5.65, z + 11);
   }
  }
 }

 const rampMat = Std({ color: 0xff7e29, emissive: 0x551800, roughness: 0.35 });
 [[110, -85, 0], [220, -155, 0], [110, 160, Math.PI], [0, -270, 0], [-110, 50, 0], [220, 270, Math.PI], [-220, -165, 0], [55, -330, Math.PI / 2], [-55, 220, -Math.PI / 2], [165, 0, Math.PI / 2]].forEach(([rx, rz, rotY], i) => {
  addM(group, new THREE.BoxGeometry(5.5, 1.4, 9.5), rampMat, rx + 6, 0.55, rz).rotation.set(0.22, rotY, 0);
  stuntRamps.push({ id: `ramp_${i}`, x: rx + 6, z: rz, radius: 5.5 });
 });

 const hullMat = Std({ color: 0xffffff, roughness: 0.18, metalness: 0.2 }), deckMat = Bas({ color: 0x00e5ff });
 for (let y = 0; y < 8; y++) {
  const yacht = new THREE.Group();
  addM(yacht, new THREE.BoxGeometry(5.8, 2.3, 16.5), hullMat, 0, 0.9, 0);
  addM(yacht, new THREE.BoxGeometry(4.4, 2.1, 8.8), hullMat, 0, 2.5, -1);
  addM(yacht, new THREE.BoxGeometry(4.6, 0.3, 9.0), deckMat, 0, 3.6, -1);
  yacht.position.set(302 + (y % 2) * 26, -0.05, -280 + y * 92); yacht.rotation.y = 0.15 * (y - 3);
  group.add(yacht);
 }

 const uCols = [0xff4d79, 0x00d8d6, 0xffbe3d, 0xff7e29, 0x38d864], whiteMat = Std({ color: 0xfff8eb, roughness: 0.4 });
 for (let bz = -360; bz <= 400; bz += 18) {
  const canopyMat = Std({ color: uCols[Math.abs(Math.round(bz / 18)) % 5], roughness: 0.35 });
  [248 + ((Math.abs(bz) % 3) * 6), 262, 194].forEach((ux, k) => {
   const umb = new THREE.Group();
   addM(umb, new THREE.CylinderGeometry(0.08, 0.08, 2.7, 6), whiteMat, 0, 1.35, 0);
   addM(umb, new THREE.ConeGeometry(2.3, 0.95, 8), canopyMat, 0, 2.65, 0);
   for (const lx of [-1.3, 1.3]) addM(umb, new THREE.BoxGeometry(0.95, 0.32, 2.2), whiteMat, lx, 0.22, 0.3);
   umb.position.set(ux, 0.05, bz + k * 4.5); group.add(umb);
  });
 }

 const crateMat = Std({ color: 0xc87d32, roughness: 0.65 }), bandMat = Std({ color: 0x1d2636, roughness: 0.4, metalness: 0.7 });
 [[215.2, 363.2, 1.15, 0.25], [222.8, 364.2, 1.1, -0.35], [219.2, 360.2, 0.95, 0.12]].forEach(([cx, cz, s, rot]) => {
  const cg = new THREE.Group();
  addM(cg, new THREE.BoxGeometry(1.45 * s, 1.1 * s, 1.15 * s), crateMat, 0, 0.55 * s, 0);
  addM(cg, new THREE.BoxGeometry(1.5 * s, 0.18 * s, 1.2 * s), bandMat, 0, 0.55 * s, 0);
  cg.position.set(cx, 0, cz); cg.rotation.y = rot; group.add(cg);
 });

 addM(group, new THREE.BoxGeometry(88, 1.0, 22), Std({ color: 0x6e472b, roughness: 0.78 }), 296, 1.1, 282);
 const pilingMat = Std({ color: 0x3d2718, roughness: 0.85 });
 for (let px = 260; px <= 332; px += 12) {
  for (const pz of [273, 291]) addM(group, new THREE.CylinderGeometry(0.45, 0.45, 3.2, 8), pilingMat, px, 0.2, pz);
 }

 const ferrisGroup = new THREE.Group();
 ferrisGroup.position.set(318, 15.8, 282); ferrisGroup.rotation.y = -0.35;
 const legMat = Std({ color: 0xe6eefc, emissive: 0x1a263b, roughness: 0.3, metalness: 0.75 });
 for (const lz of [-2.4, 2.4]) {
  for (const lx of [-1, 1]) addM(ferrisGroup, new THREE.CylinderGeometry(0.35, 0.5, 17.5, 8), legMat, lx * 4.8, -7.2, lz).rotation.z = lx * 0.32;
 }
 addM(ferrisGroup, new THREE.CylinderGeometry(1.2, 1.2, 6.2, 12), Std({ color: 0xffbf3c, emissive: 0x553300, roughness: 0.25, metalness: 0.8 }), 0, 0, 0).rotation.x = Math.PI / 2;

 const ferrisWheel = new THREE.Group();
 const rimOuterMat = Std({ color: 0xff4d79, emissive: 0x881838, roughness: 0.25, metalness: 0.5 });
 const rimInnerMat = Std({ color: 0x00e5ff, emissive: 0x004d66, roughness: 0.25, metalness: 0.5 });
 for (const wz of [-1.4, 1.4]) {
  addM(ferrisWheel, new THREE.TorusGeometry(12.5, 0.42, 10, 36), rimOuterMat, 0, 0, wz);
  addM(ferrisWheel, new THREE.TorusGeometry(7.8, 0.28, 8, 28), rimInnerMat, 0, 0, wz);
 }
 const spokeMat = Std({ color: 0xffe082, emissive: 0x3b2800, roughness: 0.3, metalness: 0.6 });
 for (let s = 0; s < 12; s++) {
  const ang = (s / 12) * Math.PI * 2;
  addM(ferrisWheel, new THREE.CylinderGeometry(0.12, 0.12, 12.5, 6), spokeMat, Math.cos(ang) * 6.25, Math.sin(ang) * 6.25, 0).rotation.z = ang - Math.PI / 2;
  addM(ferrisWheel, new THREE.BoxGeometry(1.8, 1.5, 2.2), Std({ color: uCols[s % 5], emissive: 0x221018, roughness: 0.3 }), Math.cos(ang) * 12.5, Math.sin(ang) * 12.5 - 0.9, 0);
 }
 ferrisGroup.add(ferrisWheel); group.add(ferrisGroup); scene.add(group);

 return {
  group, stuntRamps,
  update(time) {
   const sway = Math.sin(time * 1.8) * 0.035;
   for (let i = 0; i < palmCrowns.length; i++) palmCrowns[i].rotation.z = sway * (i % 2 === 0 ? 1 : -1);
   ferrisWheel.rotation.z = time * 0.25;
  },
 };
}
