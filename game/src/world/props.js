// Curved palms, beach umbrellas, crates, yachts, scooters & Palma Pier Ferris wheel
import { ROAD_Z } from './roads.js';

const Std = (THREE, p) => new THREE.MeshStandardMaterial(p), Bas = (THREE, p) => new THREE.MeshBasicMaterial(p);
const Box = (THREE, w, h, d) => new THREE.BoxGeometry(w, h, d), Cyl = (THREE, rt, rb, h, s = 8) => new THREE.CylinderGeometry(rt, rb, h, s);
const Sph = (THREE, r, w = 8, h = 8) => new THREE.SphereGeometry(r, w, h), Cone = (THREE, r, h, s = 4) => new THREE.ConeGeometry(r, h, s);
const addM = (p, geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) => {
 const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z);
 if (rx) m.rotation.x = rx; if (ry) m.rotation.y = ry; if (rz) m.rotation.z = rz;
 p.add(m); return m;
};

export function createPalmTreeMesh(THREE, scale = 1) {
 const palm = new THREE.Group(), trunkMat = Std(THREE, { color: 0x9c6b43, roughness: .78 }), frondMat = Std(THREE, { color: 0x38d864, emissive: 0x10451c, roughness: .38, side: THREE.DoubleSide });
 let curY = 0, curX = 0;
 for (let i = 0; i < 5; i++) {
  const segH = 1.65 * scale;
  addM(palm, Cyl(THREE, (.3 - i * .04) * scale, (.34 - i * .04) * scale, segH, 7), trunkMat, curX, curY + segH * .5, 0, 0, 0, -i * .05);
  curY += segH * .96; curX += i * .09 * scale;
 }
 const crown = new THREE.Group(); crown.position.set(curX, curY, 0);
 for (let f = 0; f < 8; f++) {
  const h = new THREE.Group(); h.rotation.y = (f / 8) * Math.PI * 2;
  addM(h, Cone(THREE, .45 * scale, 2.2 * scale), frondMat, scale, .1 * scale, 0, 0, 0, -Math.PI * .42);
  addM(h, Cone(THREE, .38 * scale, 2.1 * scale), frondMat, 2.45 * scale, -.45 * scale, 0, 0, 0, -Math.PI * .62);
  crown.add(h);
 }
 palm.add(crown); return palm;
}

function createPinkScooterRiderMesh(THREE) {
 const g = new THREE.Group(), B = (w, h, d) => Box(THREE, w, h, d), C = (rt, rb, h, s = 8) => Cyl(THREE, rt, rb, h, s), S = (p) => Std(THREE, p);
 const pink = S({ color: 0xff4da6, emissive: 0x3b0824, roughness: .22, metalness: .3 }), chrome = S({ color: 0xeaf2ff, roughness: .15, metalness: .9 });
 const dark = S({ color: 0x161c28, roughness: .65 }), skin = S({ color: 0xd99b72, roughness: .5 }), teal = S({ color: 0x00e5ff, roughness: .35 }), white = S({ color: 0xfff8f0, roughness: .25 });
 for (const wz of [-.62, .62]) { addM(g, C(.28, .28, .16, 12), dark, 0, .28, wz, 0, 0, Math.PI / 2); addM(g, C(.16, .16, .17, 10), chrome, 0, .28, wz, 0, 0, Math.PI / 2); }
 addM(g, B(.42, .22, 1.35), pink, 0, .36, 0); addM(g, B(.46, .48, .72), pink, 0, .56, -.38);
 addM(g, B(.36, .76, .24), pink, 0, .72, .52, -.22); addM(g, B(.34, .14, .64), dark, 0, .84, -.22);
 addM(g, C(.03, .03, .72), chrome, 0, 1.12, .44, 0, 0, Math.PI / 2);
 addM(g, Sph(THREE, .11, 10, 10), Bas(THREE, { color: 0xfff6cc }), 0, 1.06, .58);
 addM(g, B(.2, .1, .08), Bas(THREE, { color: 0xff2248 }), 0, .66, -.76);
 addM(g, B(.36, .52, .26), teal, 0, 1.16, -.14, .18); addM(g, Sph(THREE, .19, 12, 12), white, 0, 1.56, -.04);
 addM(g, B(.26, .08, .12), Bas(THREE, { color: 0x111a2b }), 0, 1.55, .12);
 for (const sx of [-.22, .22]) { addM(g, C(.06, .05, .48), skin, sx, 1.24, .16, -.95); addM(g, C(.07, .06, .46), dark, sx * .85, .72, .04, -.55); }
 return g;
}

export function buildWorldProps(scene) {
 const THREE = window.THREE, group = new THREE.Group(), palmCrowns = [], stuntRamps = [];
 const S = (p) => Std(THREE, p), Bs = (p) => Bas(THREE, p), B = (w, h, d) => Box(THREE, w, h, d), C = (rt, rb, h, s = 8) => Cyl(THREE, rt, rb, h, s), Tor = (r, t, rs, ts) => new THREE.TorusGeometry(r, t, rs, ts);
 const poleMat = S({ color: 0x222c3c, metalness: .8 }), rampMat = S({ color: 0xff7e29, emissive: 0x551800, roughness: .35 });
 const HPI = Math.PI / 2, G = (...a) => addM(group, ...a);

 for (const [lx, sides, lamps] of [[110, [-14.2, 14.2], 1], [220, [-14.2, 14.2], 1], [246, [0], 0], [0, [-14.2, 14.2], 1]]) {
  for (let z = -380; z <= 380; z += 26) {
   if (ROAD_Z.some((rz) => Math.abs(z - rz) < 16)) continue;
   for (const side of sides) {
    const palm = createPalmTreeMesh(THREE, .95 + (Math.abs(z) % 5) * .08);
    palm.position.set(lx + side, 0, z); palm.rotation.y = (z * .3) % (Math.PI * 2); group.add(palm); palmCrowns.push(palm);
   }
   if (lamps) {
    G(C(.1, .14, 5.5, 6), poleMat, lx + 12.8, 2.75, z + 11);
    G(Sph(THREE, .4), Bs({ color: ((z / 26) | 0) % 2 === 0 ? 0xff4d79 : 0x00f0ff }), lx + 12.8, 5.65, z + 11);
   }
  }
 }
 [[110, -85, 0], [220, -155, 0], [110, 160, Math.PI], [0, -270, 0], [-110, 50, 0], [220, 270, Math.PI], [-220, -165, 0], [55, -330, HPI], [-55, 220, -HPI], [165, 0, HPI]].forEach(([rx, rz, ry], i) => {
  G(B(5.5, 1.4, 9.5), rampMat, rx + 6, .55, rz, .22, ry);
  stuntRamps.push({ id: `ramp_${i}`, x: rx + 6, z: rz, radius: 5.5 });
 });
 const hullMat = S({ color: 0xffffff, roughness: .18, metalness: .2 }), deckMat = Bs({ color: 0x00e5ff });
 for (let y = 0; y < 8; y++) {
  const yt = new THREE.Group();
  addM(yt, B(5.8, 2.3, 16.5), hullMat, 0, .9, 0); addM(yt, B(4.4, 2.1, 8.8), hullMat, 0, 2.5, -1); addM(yt, B(4.6, .3, 9), deckMat, 0, 3.6, -1);
  yt.position.set(302 + (y % 2) * 26, -.05, -280 + y * 92); yt.rotation.y = .15 * (y - 3); group.add(yt);
 }
 const uCols = [0xff4d79, 0x00d8d6, 0xffbe3d, 0xff7e29, 0x38d864], whiteMat = S({ color: 0xfff8eb, roughness: .4 });
 for (let bz = -360; bz <= 400; bz += 14) {
  const hero = bz >= -90 && bz <= 80;
  if (!hero && Math.abs(bz) % 28 === 14) continue;
  const canMat = S({ color: uCols[Math.abs(Math.round(bz / 14)) % 5], roughness: .35 });
  const xs = hero ? (bz > -10 && bz < 48 ? [238.5 + (Math.abs(bz) % 3) * 1.4, 248, 258.5] : [264, 271]) : [264, 271, 194];
  xs.forEach((ux, k) => {
   const umb = new THREE.Group();
   addM(umb, C(.08, .08, 2.7, 6), whiteMat, 0, 1.35, 0); addM(umb, Cone(THREE, 2.45, 1, 8), canMat, 0, 2.65, 0);
   for (const lx of [-1.3, 1.3]) addM(umb, B(.95, .32, 2.2), whiteMat, lx, .22, .3);
   umb.position.set(ux, .05, bz + k * 3.8); group.add(umb);
  });
 }
 for (let bz = -84; bz <= 56; bz += 16) {
  if (ROAD_Z.some((rz) => Math.abs(bz - rz) < 13)) continue;
  const pBeach = createPalmTreeMesh(THREE, .92 + (Math.abs(bz) % 4) * .07);
  pBeach.position.set(235.5, 0, bz); pBeach.rotation.y = (bz * .45) % (Math.PI * 2); group.add(pBeach); palmCrowns.push(pBeach);
 }
 [[233.1, 21.8, Math.PI - .08], [233.8, -24.5, .12]].forEach(([sx, sz, srot]) => {
  const sc = createPinkScooterRiderMesh(THREE); sc.position.set(sx, 0, sz); sc.rotation.y = srot; group.add(sc);
 });
 const crateMat = S({ color: 0xc87d32, roughness: .65 }), bandMat = S({ color: 0x1d2636, roughness: .4, metalness: .7 });
 [[215.2, 363.2, 1.15, .25], [222.8, 364.2, 1.1, -.35], [219.2, 360.2, .95, .12]].forEach(([cx, cz, s, rot]) => {
  const cg = new THREE.Group();
  addM(cg, B(1.45 * s, 1.1 * s, 1.15 * s), crateMat, 0, .55 * s, 0); addM(cg, B(1.5 * s, .18 * s, 1.2 * s), bandMat, 0, .55 * s, 0);
  cg.position.set(cx, 0, cz); cg.rotation.y = rot; group.add(cg);
 });
 G(B(88, 1, 22), S({ color: 0x6e472b, roughness: .78 }), 296, 1.1, 282);
 const pilMat = S({ color: 0x3d2718, roughness: .85 });
 for (let px = 260; px <= 332; px += 12) for (const pz of [273, 291]) G(C(.45, .45, 3.2), pilMat, px, .2, pz);
 const ferrisGroup = new THREE.Group(); ferrisGroup.position.set(318, 15.8, 282); ferrisGroup.rotation.y = -.35;
 const legMat = S({ color: 0xe6eefc, emissive: 0x1a263b, roughness: .3, metalness: .75 });
 for (const lz of [-2.4, 2.4]) for (const lx of [-1, 1]) addM(ferrisGroup, C(.35, .5, 17.5), legMat, lx * 4.8, -7.2, lz, 0, 0, lx * .32);
 addM(ferrisGroup, C(1.2, 1.2, 6.2, 12), S({ color: 0xffbf3c, emissive: 0x553300, roughness: .25, metalness: .8 }), 0, 0, 0, HPI);
 const ferrisWheel = new THREE.Group();
 const rimOut = S({ color: 0xff4d79, emissive: 0x881838, roughness: .25, metalness: .5 }), rimIn = S({ color: 0x00e5ff, emissive: 0x004d66, roughness: .25, metalness: .5 });
 for (const wz of [-1.4, 1.4]) { addM(ferrisWheel, Tor(12.5, .42, 10, 36), rimOut, 0, 0, wz); addM(ferrisWheel, Tor(7.8, .28, 8, 28), rimIn, 0, 0, wz); }
 const spokeMat = S({ color: 0xffe082, emissive: 0x3b2800, roughness: .3, metalness: .6 });
 for (let s = 0; s < 12; s++) {
  const ang = (s / 12) * Math.PI * 2;
  addM(ferrisWheel, C(.12, .12, 12.5, 6), spokeMat, Math.cos(ang) * 6.25, Math.sin(ang) * 6.25, 0, 0, 0, ang - HPI);
  addM(ferrisWheel, B(1.8, 1.5, 2.2), S({ color: uCols[s % 5], emissive: 0x221018, roughness: .3 }), Math.cos(ang) * 12.5, Math.sin(ang) * 12.5 - .9, 0);
 }
 ferrisGroup.add(ferrisWheel); group.add(ferrisGroup); scene.add(group);
 return {
  group, stuntRamps,
  update(time) {
   const sway = Math.sin(time * 1.8) * .035;
   for (let i = 0; i < palmCrowns.length; i++) palmCrowns[i].rotation.z = sway * (i % 2 === 0 ? 1 : -1);
   ferrisWheel.rotation.z = time * .25;
  },
 };
}
