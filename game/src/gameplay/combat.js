// 3D Ballistic Tracers, Multi-Layered Jagged Detonations, Debris Shards, Drift Trails & Hit Detection
export function initCombatSystem(scene, state, events, weaponsSys, soundEngine) {
 const THREE = window.THREE;
 const Bas = (p) => new THREE.MeshBasicMaterial(p);
 const fxGroup = new THREE.Group();
 scene.add(fxGroup);
 const tracers = [], explosions = [];

 function spawnTracer(fromX, fromY, fromZ, toX, toY, toZ, colorHex = 0xffae2b) {
  const len = Math.max(0.5, Math.hypot(toX - fromX, toY - fromY, toZ - fromZ));
  const holder = new THREE.Group();
  const outerGeo = new THREE.CylinderGeometry(0.014, 0.038, len, 8); outerGeo.rotateX(Math.PI / 2);
  holder.add(new THREE.Mesh(outerGeo, Bas({ color: colorHex, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })));
  const coreGeo = new THREE.CylinderGeometry(0.006, 0.015, len * 0.94, 6); coreGeo.rotateX(Math.PI / 2);
  holder.add(new THREE.Mesh(coreGeo, Bas({ color: 0xfff8dc, transparent: true, opacity: 0.96, blending: THREE.AdditiveBlending, depthWrite: false })));
  holder.position.set((fromX + toX) * 0.5, (fromY + toY) * 0.5, (fromZ + toZ) * 0.5);
  holder.lookAt(toX, toY, toZ);
  fxGroup.add(holder);
  tracers.push({ mesh: holder, ttl: 0.35 });
 }

 function spawnExplosion(x, y, z, s = 1.0) {
  const holder = new THREE.Group();
  holder.position.set(x, y, z);

  // Glowing core fireball + warm additive fire halo (no solid black rock polygons)
  const coreA = new THREE.Mesh(new THREE.SphereGeometry(0.38 * s, 12, 10), Bas({ color: 0xfff5c0, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending, depthWrite: false }));
  coreA.position.y = 0.24 * s;
  const coreB = new THREE.Mesh(new THREE.SphereGeometry(0.76 * s, 12, 10), Bas({ color: 0xff7b19, transparent: true, opacity: 0.62, blending: THREE.AdditiveBlending, depthWrite: false }));
  coreB.position.y = 0.34 * s; coreB.scale.set(1.25, 0.9, 1.15);
  const halo = new THREE.Mesh(new THREE.SphereGeometry(1.35 * s, 12, 10), Bas({ color: 0xff4210, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.position.y = 0.42 * s;
  holder.add(coreA, coreB, halo);

  // Radial flame tongues
  const fCols = [0xffc93b, 0xff8519, 0xff4d1a, 0xffa326, 0xff6214];
  for (let i = 0; i < 12; i++) {
   const az = (i / 12) * Math.PI * 2 + (i % 3) * 0.2, el = 0.25 + (i % 3) * 0.28;
   const t = new THREE.Mesh(
    new THREE.ConeGeometry((0.24 + (i % 2) * 0.1) * s, (0.85 + (i % 3) * 0.32) * s, 7),
    Bas({ color: fCols[i % 5], transparent: true, opacity: 0.78, blending: THREE.AdditiveBlending, depthWrite: false })
   );
   t.position.set(Math.cos(az) * 0.36 * s, (0.28 + (i % 3) * 0.2) * s, Math.sin(az) * 0.36 * s);
   t.rotation.set(Math.sin(az) * (1.57 - el), 0, -Math.cos(az) * (1.57 - el));
   holder.add(t);
  }

  // Soft low-opacity warm smoke wisps
  [[-0.32, 1.05, -0.18, 0.62, 0x8f5646, 0.22], [0.34, 1.28, 0.15, 0.68, 0x784a48, 0.19], [-0.1, 1.55, 0.2, 0.74, 0x5c3e44, 0.16]].forEach(([ox, oy, oz, r, c, op]) => {
   const puff = new THREE.Mesh(new THREE.SphereGeometry(r * s, 12, 10), Bas({ color: c, transparent: true, opacity: op, depthWrite: false }));
   puff.position.set(ox * s, oy * s, oz * s); puff.scale.set(1.25, 0.85, 1.15);
   holder.add(puff);
  });

  // Radial flying spark streaks
  for (let i = 0; i < 16; i++) {
   const ang = (i / 16) * Math.PI * 2, d = (0.95 + (i % 4) * 0.34) * s, h = (0.3 + (i % 5) * 0.32) * s;
   const em = new THREE.Mesh(new THREE.BoxGeometry(0.045 * s, 0.045 * s, (0.58 + (i % 3) * 0.24) * s), Bas({ color: i % 2 === 0 ? 0xffe878 : 0xff6a14, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending, depthWrite: false }));
   em.position.set(Math.cos(ang) * d, h, Math.sin(ang) * d); em.rotation.set(0.45 + (i % 3) * 0.2, -ang, 0);
   holder.add(em);
  }

  const sc = new THREE.Mesh(new THREE.CircleGeometry(1.55 * s, 18), Bas({ color: 0x161218, transparent: true, opacity: 0.45, depthWrite: false }));
  sc.rotation.x = -Math.PI / 2; sc.position.y = -y + 0.07;
  const sr = new THREE.Mesh(new THREE.RingGeometry(1.15 * s, 1.75 * s, 24), Bas({ color: 0xff8a2b, transparent: true, opacity: 0.68, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
  sr.rotation.x = -Math.PI / 2; sr.position.y = -y + 0.09;
  holder.add(sc, sr); fxGroup.add(holder);
  explosions.push({ mesh: holder, ttl: 0.85 });
 }

 function spawnDriftEffects(x, z, rotY) {
  const bx = x - Math.sin(rotY) * 2.4, bz = z - Math.cos(rotY) * 2.4;
  for (const side of [-0.92, 0.92]) {
   const wx = bx + Math.cos(rotY) * side, wz = bz - Math.sin(rotY) * side;
   const st = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 7.8), Bas({ color: 0xff1e42, transparent: true, opacity: 0.64, blending: THREE.AdditiveBlending, depthWrite: false }));
   st.rotation.set(-Math.PI / 2, 0, -rotY); st.position.set(wx - Math.sin(rotY) * 3.5, 0.12, wz - Math.cos(rotY) * 3.5);
   fxGroup.add(st);
   for (let k = 0; k < 4; k++) {
    const sm = new THREE.Mesh(new THREE.SphereGeometry(0.36 + k * 0.14, 10, 8), Bas({ color: 0xdce6f7, transparent: true, opacity: 0.22 - k * 0.04, depthWrite: false }));
    sm.position.set(wx - Math.sin(rotY) * (0.5 + k * 1.1), 0.3 + k * 0.16, wz - Math.cos(rotY) * (0.5 + k * 1.1));
    sm.scale.set(1.25, 0.78, 1.15); fxGroup.add(sm);
   }
  }
 }

 events.on('combat:fire', () => {
  const p = state.player, wep = weaponsSys.getCurrentWeapon();
  p.muzzleTimer = 0.14;
  if (typeof wep.mag === 'number' && wep.mag > 0 && --wep.mag === 0 && wep.reserve > 0) {
   wep.mag = wep.maxMag || 30; wep.reserve = Math.max(0, wep.reserve - wep.mag);
  }
  const dx = Math.sin(p.rotY), dz = Math.cos(p.rotY);
  const sx = p.x + dx * 0.8, sy = p.y + 1.38, sz = p.z + dz * 0.8;
  let ex = sx + dx * 36, ey = sy, ez = sz + dz * 36;
  for (const en of state.entities.enemies) {
   if (!en.alive) continue;
   const dist = Math.hypot(en.x - p.x, en.z - p.z);
   if (dist < wep.range) {
    ex = en.x; ey = 1.25; ez = en.z;
    en.hp -= weaponsSys.computeDamage ? weaponsSys.computeDamage(dist, false) : wep.damage;
    spawnExplosion(en.x, 1.3, en.z, 0.55);
    if (en.hp <= 0) { en.alive = false; en.downed = true; p.cash += 1250; p.respect += 180; state.wanted.stars = Math.min(5, Math.max(2, state.wanted.stars)); }
    break;
   }
  }
  spawnTracer(sx, sy, sz, ex, ey, ez, wep.color);
  if (soundEngine) soundEngine.playGunshot();
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
