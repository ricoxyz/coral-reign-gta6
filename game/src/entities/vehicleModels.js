// Sculpted fastback sports cars, SUVs & Palma PD cruisers with extruded cabins & 5-spoke rims
import { VEHICLE_ARCHETYPES } from '../core/config.js';

let pdDoorTex = null, plateTex = null;
const mkTex = (w, h, fn) => { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d')); return new window.THREE.CanvasTexture(c); };

function getPoliceDoorTexture() {
 return pdDoorTex || (pdDoorTex = mkTex(256, 128, (ctx) => {
  ctx.fillStyle = '#f5f8ff'; ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = '#0f2547'; ctx.fillRect(0, 0, 256, 20); ctx.fillRect(0, 104, 256, 24);
  ctx.fillStyle = '#ffc83b'; ctx.fillRect(0, 20, 256, 7);
  ctx.textAlign = 'center'; ctx.fillStyle = '#0f2547'; ctx.font = '900 30px sans-serif'; ctx.fillText('PALMA PD', 128, 64);
  ctx.fillStyle = '#e01e37'; ctx.font = '900 20px sans-serif'; ctx.fillText('INTERCEPTOR · 911', 128, 92);
 }));
}

function getLicensePlateTexture() {
 return plateTex || (plateTex = mkTex(128, 48, (ctx) => {
  ctx.fillStyle = '#fff5d6'; ctx.fillRect(0, 0, 128, 48);
  ctx.strokeStyle = '#ff4d79'; ctx.lineWidth = 4; ctx.strokeRect(2, 2, 124, 44);
  ctx.fillStyle = '#0c182e'; ctx.font = '900 22px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('PALMA-88', 64, 33);
 }));
}

function extrudeSideProfile(THREE, pts, width, bevel = .06) {
 const sh = new THREE.Shape(); sh.moveTo(pts[0][0], pts[0][1]);
 for (let i = 1; i < pts.length; i++) sh.lineTo(pts[i][0], pts[i][1]);
 sh.closePath();
 const geo = new THREE.ExtrudeGeometry(sh, { depth: width, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel * .85, bevelSegments: 2 });
 geo.rotateY(-Math.PI / 2); geo.translate(width * .5, 0, 0);
 return geo;
}

export function buildSculptedVehicleMesh(archetype) {
 const THREE = window.THREE, root = new THREE.Group();
 const L = archetype.length || 4.8, W = archetype.width || 2.18, H = archetype.height || 1.28;
 const isPol = archetype.cls === 'POLICE', isHeavy = archetype.cls === 'HEAVY' || archetype.cls === 'SUV';
 const isFast = archetype.cls === 'EXOTIC' || archetype.cls === 'SPORTS' || archetype.cls === 'LUXURY';
 const Std = (p) => new THREE.MeshStandardMaterial(p), Bas = (p) => new THREE.MeshBasicMaterial(p);

 const paint = Std({ color: archetype.color, emissive: archetype.cls === 'EXOTIC' ? 0x260500 : 0, roughness: .2, metalness: .38 });
 const accent = Std({ color: archetype.accent, roughness: .26, metalness: .28 });
 const carbon = Std({ color: 0x151a24, roughness: .3, metalness: .48 });
 const chrome = Std({ color: 0xe6f0ff, roughness: .14, metalness: .92 });
 const glass = Std({ color: 0x0a1728, emissive: 0x051326, roughness: .07, metalness: .65 });
 const tire = Std({ color: 0x11141b, roughness: .85 });
 const calMat = Bas({ color: isPol ? 0xffbf3c : 0xff2248 }), headM = Bas({ color: 0xeaffff }), tailM = Bas({ color: 0xff1e42 });

 const Box = (w, h, d) => new THREE.BoxGeometry(w, h, d), Cyl = (r, len, seg) => new THREE.CylinderGeometry(r, r, len, seg), M = (g, m) => new THREE.Mesh(g, m);
 const B = (w, h, d, mat, x, y, z, rx = 0) => {
  const m = M(Box(w, h, d), mat); m.position.set(x, y, z); if (rx) m.rotation.x = rx; root.add(m); return m;
 };

 const bodyPts = isHeavy
  ? [[-L * .48, .24], [L * .46, .24], [L * .49, .42], [L * .46, H * .56], [L * .24, H * .62], [-L * .47, H * .62], [-L * .49, .42]]
  : [[-L * .48, .22], [L * .46, .21], [L * .5, .34], [L * .46, H * .48], [L * .33, H * .55], [L * .16, H * .58], [-L * .36, H * .61], [-L * .49, H * .56], [-L * .495, .34]];
 const cabinPts = isHeavy
  ? [[-L * .44, H * .56], [L * .24, H * .56], [L * .14, H * .96], [-L * .41, H * .96]]
  : isPol ? [[-L * .36, H * .55], [L * .2, H * .55], [L * .04, H * .96], [-L * .18, H * .96]]
  : [[-L * .39, H * .55], [L * .2, H * .54], [L * .02, H * .96], [-L * .14, H * .97]];
 const roofMat = isPol ? accent : paint;
 const roofTopPts = isHeavy
  ? [[-L * .4, H * .93], [L * .13, H * .93], [L * .11, H * .99], [-L * .39, H * .99]]
  : isPol ? [[-L * .18, H * .93], [L * .04, H * .93], [L * .02, H * .99], [-L * .16, H * .99]]
  : [[-L * .15, H * .93], [L * .02, H * .93], [0, H * .995], [-L * .13, H * .995]];

 root.add(M(extrudeSideProfile(THREE, bodyPts, W * .86, .07), paint), M(extrudeSideProfile(THREE, cabinPts, W * .7, .045), glass), M(extrudeSideProfile(THREE, roofTopPts, W * .66, .03), roofMat));

 B(W * 1.02, .08, L * .64, carbon, 0, H * .17, 0); B(W * .99, .07, .34, carbon, 0, H * .16, L * .495);
 B(W * .68, H * .17, .12, carbon, 0, H * .29, L * .485); B(W * .88, .15, .22, carbon, 0, H * .18, -L * .475);
 B(W * .88, .09, .1, tailM, 0, H * .48, -L * .505);

 const arches = [[-W * .47, L * .31], [W * .47, L * .31], [-W * .47, -L * .31], [W * .47, -L * .31]];
 for (const [ax, az] of arches) {
  const fl = M(new THREE.TorusGeometry(.45, .075, 8, 16, Math.PI), paint); fl.rotation.y = Math.PI / 2; fl.position.set(ax, .41, az);
  const wl = M(Cyl(.44, .28, 14), carbon); wl.rotation.z = Math.PI / 2; wl.position.set(ax * .88, .4, az);
  root.add(fl, wl);
 }

 if (isPol) { B(W * 1.01, H * .34, L * .44, Std({ map: getPoliceDoorTexture(), roughness: .26, metalness: .2 }), 0, H * .36, -L * .01); B(W * .62, .1, .2, carbon, 0, H * .36, L * .53); }
 if (isFast || isPol) B(W * .96, .06, .34, isPol ? paint : carbon, 0, H * .84, -L * .45, .15);

 const cZ = isHeavy ? -L * .06 : -L * .05, cLen = isHeavy ? L * .56 : L * .36;
 for (const s of [-1, 1]) {
  B(.075, H * .42, .09, roofMat, s * W * .35, H * .74, L * .11, -.78); B(.095, H * .48, .15, roofMat, s * W * .35, H * .74, -L * .26, isFast ? .92 : .72);
  B(.22, .1, .15, paint, s * (W * .37 + .13), H * .6, cZ + cLen * .42); B(.4, .12, .12, headM, s * W * .33, H * .4, L * .49); B(.34, .15, .12, tailM, s * W * .34, H * .48, -L * .505);
  if (isPol) B(.08, H * .34, .22, carbon, s * W * .24, H * .34, L * .53);
  if (isFast) { B(.14, .04, L * .34, accent, s * .21, H * .58, L * .27, .15); B(.08, .22, .58, carbon, s * W * .46, H * .36, -L * .04); }
  if (isFast || isPol) { B(.07, .23, .2, carbon, s * W * .34, H * .71, -L * .44); B(.05, .16, .38, accent, s * W * .48, H * .84, -L * .45); }
  for (const o of [.18, .26]) { const p = M(Cyl(.052, .22, 10), chrome); p.rotation.x = Math.PI / 2; p.position.set(s * W * o, H * .19, -L * .505); root.add(p); }
 }

 const plate = M(new THREE.PlaneGeometry(.5, .21), Bas({ map: getLicensePlateTexture() }));
 plate.rotation.y = Math.PI; plate.position.set(0, H * .33, -L * .506);
 const shad = M(new THREE.PlaneGeometry(W * 1.14, L * 1.08), Bas({ color: 0x050810, transparent: true, opacity: .52, depthWrite: false }));
 shad.rotation.x = -Math.PI / 2; shad.position.y = .06; root.add(plate, shad);

 const wheels = [];
 for (const [wx, wz] of arches) {
  const wg = new THREE.Group();
  for (const [r, len, seg, mat] of [[.39, .34, 18, tire], [.27, .35, 14, chrome], [.22, .355, 12, carbon]]) {
   const m = M(Cyl(r, len, seg), mat); m.rotation.z = Math.PI / 2; wg.add(m);
  }
  for (let sp = 0; sp < 5; sp++) { const sk = M(Box(.365, .05, .24), chrome); sk.rotation.x = (sp / 5) * Math.PI * 2; wg.add(sk); }
  const cal = M(Box(.362, .14, .09), calMat); cal.position.set(0, .11, .11); wg.add(cal);
  wg.position.set(wx, .39, wz); root.add(wg); wheels.push(wg);
 }

 let sirenRed = null, sirenBlue = null, sirenLight = null;
 if (isPol) {
  const barZ = -L * .07;
  B(W * .74, .08, .3, carbon, 0, H * .99, barZ);
  sirenRed = B(W * .34, .16, .28, Bas({ color: 0xff1744 }), -W * .19, H * 1.06, barZ);
  sirenBlue = B(W * .34, .16, .28, Bas({ color: 0x00d8ff }), W * .19, H * 1.06, barZ);
  for (const [px, col] of [[-W * .68, 0xff1744], [W * .68, 0x00d8ff]]) {
   const pl = M(new THREE.CircleGeometry(1.65, 14), Bas({ color: col, transparent: true, opacity: .22, depthWrite: false }));
   pl.rotation.x = -Math.PI / 2; pl.position.set(px, .08, 0); root.add(pl);
  }
  sirenLight = new THREE.PointLight(0xff1744, .85, 12); sirenLight.position.set(0, H + 1.25, 0); root.add(sirenLight);
 }

 root.userData = { wheels, sirenRed, sirenBlue, sirenLight };
 return root;
}

export const getArchetypeById = (id) => VEHICLE_ARCHETYPES.find((a) => a.id === id) || VEHICLE_ARCHETYPES[0];
