// 3D Ballistic Tracers, Multi-Layered Detonations, Drift Trails & Hit Detection
export function initCombatSystem(scene, state, events, weaponsSys, soundEngine) {
 const THREE = window.THREE, fxGroup = new THREE.Group(), tracers = [], explosions = [];
 scene.add(fxGroup);
 const Bas = (p) => new THREE.MeshBasicMaterial(p);
 const addM = (par, geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); par.add(m); return m; };

 function spawnTracer(fx, fy, fz, tx, ty, tz, col = 0xffae2b) {
  const len = Math.max(.5, Math.hypot(tx - fx, ty - fy, tz - fz)), h = new THREE.Group();
  const g1 = new THREE.CylinderGeometry(.014, .038, len, 8); g1.rotateX(Math.PI / 2);
  const g2 = new THREE.CylinderGeometry(.006, .015, len * .94, 6); g2.rotateX(Math.PI / 2);
  h.add(new THREE.Mesh(g1, Bas({ color: col, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false })), new THREE.Mesh(g2, Bas({ color: 0xfff8dc, transparent: true, opacity: .96, blending: THREE.AdditiveBlending, depthWrite: false })));
  h.position.set((fx + tx) * .5, (fy + ty) * .5, (fz + tz) * .5); h.lookAt(tx, ty, tz);
  fxGroup.add(h); tracers.push({ mesh: h, ttl: .35 });
 }

 function spawnExplosion(x, y, z, s = 1) {
  const h = new THREE.Group(); h.position.set(x, y, z);
  const addBlob = (r, ox, oy, oz, sx, sy, sz, col, op, add = 1) => {
   addM(h, new THREE.SphereGeometry(r * s, 14, 12), Bas({ color: col, transparent: true, opacity: op, ...(add ? { blending: THREE.AdditiveBlending } : {}), depthWrite: false }), ox * s, oy * s, oz * s).scale.set(sx, sy, sz);
  };
  [[.58, 0, .36, 0, 1.15, .95, 1.1, 0xfff8d6, .92, 1], [.98, 0, .48, 0, 1.28, 1.05, 1.2, 0xff9e22, .72, 1], [1.62, 0, .56, 0, 1.35, 1.05, 1.25, 0xff4512, .36, 1],
   [.72, -.55, .52, .24, 1.18, .96, 1.12, 0xffb833, .62, 1], [.68, .58, .46, -.18, 1.18, .96, 1.12, 0xff7b19, .6, 1], [.74, .12, 1.05, .08, 1.18, .96, 1.12, 0xffaa2b, .58, 1],
   [.62, -.28, .88, -.26, 1.18, .96, 1.12, 0xff5a14, .52, 1], [.58, .36, .92, .28, 1.18, .96, 1.12, 0xffd25a, .55, 1],
   [.78, -.36, 1.42, -.15, 1.32, .92, 1.2, 0x8f5544, .3, 0], [.86, .42, 1.72, .16, 1.32, .92, 1.2, 0x764846, .28, 0], [.95, -.14, 2.15, .18, 1.32, .92, 1.2, 0x623e42, .25, 0],
   [1.05, .22, 2.58, -.12, 1.32, .92, 1.2, 0x51363c, .22, 0], [1.12, -.05, 3.05, .04, 1.32, .92, 1.2, 0x453038, .17, 0]].forEach((a) => addBlob(...a));

  const fCols = [0xffe066, 0xff9e22, 0xff5218, 0xffb833, 0xff6a14];
  for (let i = 0; i < 14; i++) {
   const az = (i / 14) * Math.PI * 2 + (i % 3) * .22, el = .32 + (i % 3) * .3;
   const t = addM(h, new THREE.ConeGeometry((.32 + (i % 2) * .14) * s, (1.15 + (i % 3) * .42) * s, 8), Bas({ color: fCols[i % 5], transparent: true, opacity: .78, blending: THREE.AdditiveBlending, depthWrite: false }), Math.cos(az) * .46 * s, (.42 + (i % 3) * .26) * s, Math.sin(az) * .46 * s);
   t.rotation.set(Math.sin(az) * (1.52 - el), 0, -Math.cos(az) * (1.52 - el));
  }
  for (let i = 0; i < 20; i++) {
   const ang = (i / 20) * Math.PI * 2, d = (1.15 + (i % 4) * .42) * s, ey = (.35 + (i % 5) * .38) * s;
   addM(h, new THREE.BoxGeometry(.055 * s, .055 * s, (.72 + (i % 3) * .28) * s), Bas({ color: i % 2 === 0 ? 0xfff08a : 0xff7718, transparent: true, opacity: .92, blending: THREE.AdditiveBlending, depthWrite: false }), Math.cos(ang) * d, ey, Math.sin(ang) * d).rotation.set(.45 + (i % 3) * .2, -ang, 0);
  }
  const glow = addM(h, new THREE.CircleGeometry(2.35 * s, 22), Bas({ color: 0xff7e24, transparent: true, opacity: .44, blending: THREE.AdditiveBlending, depthWrite: false }), 0, -y + .075, 0); glow.rotation.x = -Math.PI / 2;
  const sc = addM(h, new THREE.CircleGeometry(1.65 * s, 18), Bas({ color: 0x1a1218, transparent: true, opacity: .42, depthWrite: false }), 0, -y + .068, 0); sc.rotation.x = -Math.PI / 2;
  const sr = addM(h, new THREE.RingGeometry(1.25 * s, 1.95 * s, 24), Bas({ color: 0xff9a2e, transparent: true, opacity: .72, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }), 0, -y + .095, 0); sr.rotation.x = -Math.PI / 2;
  fxGroup.add(h); explosions.push({ mesh: h, ttl: .85 });
 }

 function spawnDriftEffects(x, z, rotY) {
  const bx = x - Math.sin(rotY) * 2.4, bz = z - Math.cos(rotY) * 2.4;
  for (const side of [-.92, .92]) {
   const wx = bx + Math.cos(rotY) * side, wz = bz - Math.sin(rotY) * side;
   const st = addM(fxGroup, new THREE.PlaneGeometry(.22, 6.2), Bas({ color: 0xff1e42, transparent: true, opacity: .52, blending: THREE.AdditiveBlending, depthWrite: false }), wx - Math.sin(rotY) * 2.8, .12, wz - Math.cos(rotY) * 2.8);
   st.rotation.set(-Math.PI / 2, 0, -rotY);
   for (let k = 0; k < 4; k++) {
    addM(fxGroup, new THREE.SphereGeometry(.17 + k * .05, 8, 6), Bas({ color: 0xdce6f7, transparent: true, opacity: .11 - k * .022, depthWrite: false }), wx - Math.sin(rotY) * (.35 + k * .72), .17 + k * .06, wz - Math.cos(rotY) * (.35 + k * .72)).scale.set(.85, .45, 1.35);
   }
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
  fxGroup, spawnTracer, spawnExplosion, spawnDriftEffects,
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
