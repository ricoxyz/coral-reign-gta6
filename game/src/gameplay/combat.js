// 3D Ballistic Tracers, Multi-Layered Detonations, Drift Trails & Hit Detection
export function initCombatSystem(scene, state, events, weaponsSys, soundEngine) {
 const THREE = window.THREE, fxGroup = new THREE.Group(), tracers = [], explosions = [];
 scene.add(fxGroup);
 const Bas = (p) => new THREE.MeshBasicMaterial(p), Add = (col, op, extra = {}) => Bas({ color: col, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, ...extra });
 const Sph = (r, w = 10, h = 8) => new THREE.SphereGeometry(r, w, h), Cone = (r, l, s = 7) => new THREE.ConeGeometry(r, l, s), Cyl = (rt, rb, l, s = 8) => { const g = new THREE.CylinderGeometry(rt, rb, l, s); g.rotateX(Math.PI / 2); return g; };
 const addM = (par, geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); par.add(m); return m; };

 function spawnTracer(fx, fy, fz, tx, ty, tz, col = 0xffae2b) {
  const len = Math.max(.5, Math.hypot(tx - fx, ty - fy, tz - fz)), h = new THREE.Group();
  h.add(new THREE.Mesh(Cyl(.018, .048, len), Add(col, .94)), new THREE.Mesh(Cyl(.009, .022, len * .95, 6), Add(0xfffce6, .98)));
  h.position.set((fx + tx) * .5, (fy + ty) * .5, (fz + tz) * .5); h.lookAt(tx, ty, tz);
  fxGroup.add(h); tracers.push({ mesh: h, ttl: .35 });
 }

 function spawnMuzzleBurst(x, y, z, tx, ty, tz, s = 1) {
  const h = new THREE.Group(); h.position.set(x, y, z); h.lookAt(tx, ty, tz);
  addM(h, Sph(.12 * s, 8, 8), Bas({ color: 0xfff8d8 }), 0, 0, 0);
  addM(h, Sph(.28 * s), Add(0xff8c1a, .48), 0, 0, .06 * s);
  addM(h, Cone(.15 * s, .72 * s), Add(0xffc845, .9), 0, 0, .36 * s).rotation.x = Math.PI / 2;
  for (let i = 0; i < 4; i++) {
   const a = (i / 4) * Math.PI * 2 + .4;
   addM(h, Cone(.045 * s, .38 * s, 5), Add(0xffe47a, .92), Math.cos(a) * .12 * s, Math.sin(a) * .12 * s, .04 * s).rotation.z = a - Math.PI / 2;
  }
  fxGroup.add(h); tracers.push({ mesh: h, ttl: .18 });
 }

 function spawnExplosion(x, y, z, s = 1) {
  const h = new THREE.Group(); h.position.set(x, y, z);
  const addBlob = (r, ox, oy, oz, sx, sy, sz, col, op) => addM(h, Sph(r * s, 14, 12), Add(col, op), ox * s, oy * s, oz * s).scale.set(sx, sy, sz);
  [[.46, 0, .35, 0, 1.08, .92, 1.06, 0xfff4c8, .64], [.82, 0, .46, 0, 1.18, .98, 1.12, 0xff941c, .52], [1.28, 0, .54, 0, 1.22, .98, 1.14, 0xff4512, .24],
   [.58, -.46, .48, .22, 1.1, .94, 1.06, 0xffb833, .46], [.56, .48, .44, -.16, 1.1, .94, 1.06, 0xff7b19, .44], [.58, .1, .95, .06, 1.08, .92, 1.04, 0xffaa2b, .4],
   [.46, -.24, .78, -.22, 1.06, .9, 1.02, 0xff5a14, .36], [.44, .32, .82, .24, 1.06, .9, 1.02, 0xffd25a, .38]].forEach((a) => addBlob(...a));

  const fCols = [0xffe066, 0xff9e22, 0xff5218, 0xffb833, 0xff6a14];
  for (let i = 0; i < 14; i++) {
   const az = (i / 14) * Math.PI * 2 + (i % 3) * .22, el = .32 + (i % 3) * .3;
   const t = addM(h, Cone((.3 + (i % 2) * .12) * s, (1.1 + (i % 3) * .38) * s, 8), Add(fCols[i % 5], .72), Math.cos(az) * .44 * s, (.42 + (i % 3) * .26) * s, Math.sin(az) * .44 * s);
   t.rotation.set(Math.sin(az) * (1.52 - el), 0, -Math.cos(az) * (1.52 - el));
  }
  for (let i = 0; i < 24; i++) {
   const ang = (i / 24) * Math.PI * 2 + (i % 3) * .12, d = (1.05 + (i % 4) * .45) * s, ey = (.32 + (i % 5) * .44) * s;
   addM(h, new THREE.BoxGeometry(.055 * s, .055 * s, (.8 + (i % 3) * .32) * s), Add(i % 2 === 0 ? 0xfff49a : 0xff7e1a, .86), Math.cos(ang) * d, ey, Math.sin(ang) * d).rotation.set(.42 + (i % 3) * .24, -ang, 0);
  }
  addM(h, new THREE.CircleGeometry(2.05 * s, 22), Add(0xff7e24, .3), 0, -y + .075, 0).rotation.x = -Math.PI / 2;
  addM(h, new THREE.CircleGeometry(1.45 * s, 18), Bas({ color: 0x1a1218, transparent: true, opacity: .44, depthWrite: false }), 0, -y + .068, 0).rotation.x = -Math.PI / 2;
  addM(h, new THREE.RingGeometry(1.1 * s, 1.7 * s, 24), Add(0xff9a2e, .48, { side: THREE.DoubleSide }), 0, -y + .095, 0).rotation.x = -Math.PI / 2;
  fxGroup.add(h); explosions.push({ mesh: h, ttl: .85 });
 }

 function spawnDriftEffects(x, z, rotY) {
  const bx = x - Math.sin(rotY) * 2.4, bz = z - Math.cos(rotY) * 2.4;
  for (const side of [-.92, .92]) {
   const wx = bx + Math.cos(rotY) * side, wz = bz - Math.sin(rotY) * side;
   addM(fxGroup, new THREE.PlaneGeometry(.22, 6.2), Add(0xff1e42, .52), wx - Math.sin(rotY) * 2.8, .12, wz - Math.cos(rotY) * 2.8).rotation.set(-Math.PI / 2, 0, -rotY);
   for (let k = 0; k < 4; k++) addM(fxGroup, Sph(.17 + k * .05, 8, 6), Bas({ color: 0xdce6f7, transparent: true, opacity: .11 - k * .022, depthWrite: false }), wx - Math.sin(rotY) * (.35 + k * .72), .17 + k * .06, wz - Math.cos(rotY) * (.35 + k * .72)).scale.set(.85, .45, 1.35);
  }
 }

 events.on('combat:fire', () => {
  const p = state.player, wep = weaponsSys.getCurrentWeapon();
  p.muzzleTimer = .14;
  if (typeof wep.mag === 'number' && wep.mag > 0 && --wep.mag === 0 && wep.reserve > 0) {
   wep.mag = wep.maxMag || 30; wep.reserve = Math.max(0, wep.reserve - wep.mag);
  }
  const dx = Math.sin(p.rotY), dz = Math.cos(p.rotY), sx = p.x + dx * .8, sy = p.y + 1.38, sz = p.z + dz * .8;
  let ex = sx + dx * 36, ey = sy, ez = sz + dz * 36;
  for (const en of state.entities.enemies) {
   if (!en.alive) continue;
   const dist = Math.hypot(en.x - p.x, en.z - p.z);
   if (dist < wep.range) {
    ex = en.x; ey = 1.25; ez = en.z;
    en.hp -= weaponsSys.computeDamage ? weaponsSys.computeDamage(dist, false) : wep.damage;
    spawnExplosion(en.x, 1.3, en.z, .55);
    if (en.hp <= 0) { en.alive = false; en.downed = true; p.cash += 1250; p.respect += 180; state.wanted.stars = Math.min(5, Math.max(2, state.wanted.stars)); }
    break;
   }
  }
  spawnTracer(sx, sy, sz, ex, ey, ez, wep.color);
  soundEngine?.playGunshot();
 });

 return {
  fxGroup, spawnTracer, spawnMuzzleBurst, spawnExplosion, spawnDriftEffects,
  update(dt) {
   if (state.activeShot === 'combat' || state.activeShot === 'cover') return;
   for (let i = tracers.length - 1; i >= 0; i--) if ((tracers[i].ttl -= dt) <= 0) { fxGroup.remove(tracers[i].mesh); tracers.splice(i, 1); }
   for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].mesh.scale.multiplyScalar(1 + dt * 1.4);
    if ((explosions[i].ttl -= dt) <= 0) { fxGroup.remove(explosions[i].mesh); explosions.splice(i, 1); }
   }
  },
 };
}
