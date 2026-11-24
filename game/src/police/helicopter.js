// AIR-1 Tactical Police Helicopter with extruded hull, skids & spotlight beam
export function initPoliceHelicopter(scene, state) {
 const THREE = window.THREE, heli = new THREE.Group();
 const Std = (p) => new THREE.MeshStandardMaterial(p), Bas = (p) => new THREE.MeshBasicMaterial(p);
 const Box = (w, h, d) => new THREE.BoxGeometry(w, h, d), Cyl = (rt, rb, h, s = 10) => new THREE.CylinderGeometry(rt, rb, h, s), Sph = (r, w = 10, h = 10) => new THREE.SphereGeometry(r, w, h);
 const navy = Std({ color: 0x102548, roughness: .24, metalness: .72 }), white = Std({ color: 0xf4f8ff, roughness: .26, metalness: .22 }), dark = Std({ color: 0x1a2232, roughness: .36, metalness: .65 });
 const glass = Std({ color: 0x0a1e34, emissive: 0x041526, roughness: .08, metalness: .9, transparent: true, opacity: .88 }), rotorM = Std({ color: 0x161d2b, roughness: .35, metalness: .6 });

 const addPart = (g, mat, x, y, z, rx = 0, ry = 0, rz = 0) => {
  const m = new THREE.Mesh(g, mat); m.position.set(x, y, z);
  if (rx) m.rotation.x = rx; if (ry) m.rotation.y = ry; if (rz) m.rotation.z = rz;
  heli.add(m); return m;
 };
 const extrude = (pts, depth, bev, size, mat) => {
  const sh = new THREE.Shape(); sh.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) sh.lineTo(pts[i][0], pts[i][1]);
  sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: true, bevelThickness: bev, bevelSize: size, bevelSegments: 2 });
  g.rotateY(-Math.PI / 2); g.translate(depth * .5, 0, 0); heli.add(new THREE.Mesh(g, mat));
 };
 extrude([[-2.7, -.55], [1.6, -.62], [3.15, -.32], [3.25, .05], [2.05, .88], [.45, 1.18], [-1.85, 1.05], [-2.85, .42]], 1.96, .14, .12, white);
 extrude([[-2.72, .05], [2.55, .05], [1.98, .9], [.45, 1.2], [-1.85, 1.07], [-2.82, .45]], 2.02, .1, .08, navy);
 extrude([[.95, .08], [3.18, -.06], [2.1, .88], [.95, .96]], 1.72, .08, .07, glass);
 addPart(Box(2.26, .12, 4.9), Bas({ color: 0x00d8ff }), 0, .06, .1); addPart(Box(1.36, .54, 2.5), navy, 0, 1.38, -.35);
 for (const ex of [-.42, .42]) addPart(Cyl(.18, .22, .72), dark, ex, 1.4, -1.65, Math.PI / 2);
 addPart(Cyl(.24, .44, 5.6), white, 0, .48, -5.1, Math.PI / 2); addPart(Box(2.55, .1, .68), navy, 0, .56, -6.9);
 addPart(Box(.16, 1.85, 1.05), navy, 0, 1.18, -7.75, -.28); addPart(Box(.18, .34, 1.08), white, 0, 1.82, -7.95, -.28);
 addPart(new THREE.TorusGeometry(.72, .09, 8, 20), white, .18, 1.25, -7.85, 0, Math.PI / 2);
 const tR = new THREE.Group(); tR.position.set(.22, 1.25, -7.85);
 tR.add(new THREE.Mesh(Box(.06, 1.3, .16), rotorM), new THREE.Mesh(Box(.06, .16, 1.3), rotorM)); heli.add(tR);
 for (const sx of [-1.06, 1.06]) {
  addPart(Cyl(.065, .065, 4.9, 8), white, sx, -1.35, .35, Math.PI / 2); addPart(Cyl(.06, .065, .78, 8), white, sx, -1.18, 3.05, Math.PI / 2 - .55);
  for (const sz of [-1.15, 1.45]) addPart(Cyl(.05, .055, .96, 8), dark, sx * .84, -.94, sz, 0, 0, sx > 0 ? -.34 : .34);
 }
 const mkTex = (fn) => { const c = document.createElement('canvas'); c.width = c.height = 128; fn(c.getContext('2d')); return new THREE.CanvasTexture(c); };
 const rad = (c, stops) => { const g = c.createRadialGradient(64, 64, 4, 64, 64, 62); stops.forEach(([s, col]) => g.addColorStop(s, col)); c.fillStyle = g; c.fillRect(0, 0, 128, 128); };
 addPart(Cyl(.2, .24, .45), dark, 0, 1.72, .1);
 const Add = (p) => Bas({ ...p, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
 const mR = new THREE.Group(); mR.position.set(0, 1.94, .1);
 const blur = new THREE.Mesh(new THREE.CircleGeometry(5.3, 32), Bas({ map: mkTex((c) => rad(c, [[0, 'rgba(180,225,255,.16)'], [.7, 'rgba(150,210,255,.12)'], [.94, 'rgba(210,240,255,.22)'], [1, 'rgba(180,220,255,0)']])), transparent: true, opacity: .34, side: THREE.DoubleSide, depthWrite: false }));
 blur.rotation.x = -Math.PI / 2; mR.add(new THREE.Mesh(Box(11.8, .05, .32), rotorM), new THREE.Mesh(Box(.32, .05, 11.8), rotorM), blur); heli.add(mR);
 addPart(Sph(.28), dark, 0, -.82, 2.25); addPart(Sph(.24), Bas({ color: 0xeaffff }), 0, -.94, 2.38);
 addPart(Sph(.45), Add({ color: 0x9ef4ff, opacity: .55 }), 0, -.96, 2.42);
 addPart(Sph(.14, 8, 8), Bas({ color: 0xff1744 }), -1.12, -.45, .8); addPart(Sph(.14, 8, 8), Bas({ color: 0x00e5ff }), 1.12, -.45, .8);
 const coneTex = mkTex((c) => {
  const vg = c.createLinearGradient(0, 0, 0, 128);
  [[0, 'rgba(245,254,255,1)'], [.38, 'rgba(205,248,255,.92)'], [.8, 'rgba(145,230,255,.58)'], [1, 'rgba(110,215,255,.08)']].forEach(([s, col]) => vg.addColorStop(s, col));
  c.fillStyle = vg; c.fillRect(0, 0, 128, 128); c.globalCompositeOperation = 'destination-in';
  const hg = c.createLinearGradient(0, 0, 128, 0);
  [[0, 'rgba(255,255,255,.2)'], [.28, 'rgba(255,255,255,.92)'], [.5, '#fff'], [.72, 'rgba(255,255,255,.92)'], [1, 'rgba(255,255,255,.2)']].forEach(([s, col]) => hg.addColorStop(s, col));
  c.fillStyle = hg; c.fillRect(0, 0, 128, 128);
 });
 const cGeo = (rt, rb, seg) => { const g = new THREE.CylinderGeometry(rt, rb, 1, seg, 1, true); g.translate(0, -.5, 0); g.rotateX(-Math.PI / 2); return g; };
 const cMat = (opacity) => Add({ map: coneTex, opacity, side: THREE.DoubleSide });
 const spotlightCone = new THREE.Mesh(cGeo(.26, 4.4, 28), cMat(.19));
 spotlightCone.add(new THREE.Mesh(cGeo(.14, 2.1, 22), cMat(.22)), new THREE.Mesh(cGeo(.07, 1, 16), cMat(.16)));
 scene.add(spotlightCone);
 const groundPool = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), Add({ map: mkTex((c) => rad(c, [[0, 'rgba(245,254,255,.72)'], [.35, 'rgba(150,236,255,.38)'], [.72, 'rgba(100,215,255,.12)'], [1, 'rgba(100,215,255,0)']])) }));
 groundPool.rotation.x = -Math.PI / 2; groundPool.position.set(110, .14, 36); scene.add(groundPool); heli.position.set(104, 24, 12); scene.add(heli);
 function alignSpotlightToPool() {
  heli.updateMatrixWorld(true);
  const origin = new THREE.Vector3(0, -.94, 2.38).applyMatrix4(heli.matrixWorld), target = new THREE.Vector3(groundPool.position.x, .12, groundPool.position.z);
  spotlightCone.position.copy(origin); spotlightCone.scale.set(1, 1, Math.max(4, origin.distanceTo(target))); spotlightCone.lookAt(target);
 }
 alignSpotlightToPool();
 return {
  heli, spotlightCone, groundPool, alignSpotlightToPool,
  update(dt, time) {
   const active = state.wanted.stars >= 3; heli.visible = spotlightCone.visible = groundPool.visible = active;
   if (!active) return;
   mR.rotation.y += dt * 28; tR.rotation.x += dt * 32;
   if (!state.activeShot) {
    const px = state.player.x, pz = state.player.z;
    heli.position.lerp(new THREE.Vector3(px + Math.sin(time * .65) * 14, 24, pz - 26 + Math.cos(time * .65) * 10), dt * 2.2);
    heli.lookAt(px, 10, pz); groundPool.position.set(px, .12, pz - 4);
   }
   alignSpotlightToPool();
  },
 };
}
