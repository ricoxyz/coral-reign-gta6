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

  // Multi-layered luminous orange-amber-white fireball + billowing lobes (no black rock polygons)
  const addBlob = (r, ox, oy, oz, sx, sy, sz, color, opacity, additive = true) => {
   const m = new THREE.Mesh(
    new THREE.SphereGeometry(r * s, 14, 12),
    Bas({ color, transparent: true, opacity, ...(additive ? { blending: THREE.AdditiveBlending } : {}), depthWrite: false })
   );
   m.position.set(ox * s, oy * s, oz * s);
   m.scale.set(sx, sy, sz);
   holder.add(m);
  };

  addBlob(0.58, 0, 0.36, 0, 1.15, 0.95, 1.1, 0xfff8d6, 0.92);
  addBlob(0.98, 0, 0.48, 0, 1.28, 1.05, 1.2, 0xff9e22, 0.72);
  addBlob(1.62, 0, 0.56, 0, 1.35, 1.05, 1.25, 0xff4512, 0.36);
  [[-0.55, 0.52, 0.24, 0.72, 0xffb833, 0.62], [0.58, 0.46, -0.18, 0.68, 0xff7b19, 0.6], [0.12, 1.05, 0.08, 0.74, 0xffaa2b, 0.58], [-0.28, 0.88, -0.26, 0.62, 0xff5a14, 0.52], [0.36, 0.92, 0.28, 0.58, 0xffd25a, 0.55]].forEach(([ox, oy, oz, r, col, op]) => {
   addBlob(r, ox, oy, oz, 1.18, 0.96, 1.12, col, op);
  });

  // Upward & radial flame tongues
  const fCols = [0xffe066, 0xff9e22, 0xff5218, 0xffb833, 0xff6a14];
  for (let i = 0; i < 14; i++) {
   const az = (i / 14) * Math.PI * 2 + (i % 3) * 0.22, el = 0.32 + (i % 3) * 0.3;
   const t = new THREE.Mesh(
    new THREE.ConeGeometry((0.32 + (i % 2) * 0.14) * s, (1.15 + (i % 3) * 0.42) * s, 8),
    Bas({ color: fCols[i % 5], transparent: true, opacity: 0.78, blending: THREE.AdditiveBlending, depthWrite: false })
   );
   t.position.set(Math.cos(az) * 0.46 * s, (0.42 + (i % 3) * 0.26) * s, Math.sin(az) * 0.46 * s);
   t.rotation.set(Math.sin(az) * (1.52 - el), 0, -Math.cos(az) * (1.52 - el));
   holder.add(t);
  }

  // Soft warm translucent smoke plume billowing above the fireball
  [[-0.36, 1.42, -0.15, 0.78, 0x8f5544, 0.3], [0.42, 1.72, 0.16, 0.86, 0x764846, 0.28], [-0.14, 2.15, 0.18, 0.95, 0x623e42, 0.25], [0.22, 2.58, -0.12, 1.05, 0x51363c, 0.22], [-0.05, 3.05, 0.04, 1.12, 0x453038, 0.17]].forEach(([ox, oy, oz, r, c, op]) => {
   addBlob(r, ox, oy, oz, 1.32, 0.92, 1.2, c, op, false);
  });

  // Bright radial spark streaks
  for (let i = 0; i < 20; i++) {
   const ang = (i / 20) * Math.PI * 2, d = (1.15 + (i % 4) * 0.42) * s, h = (0.35 + (i % 5) * 0.38) * s;
   const em = new THREE.Mesh(new THREE.BoxGeometry(0.055 * s, 0.055 * s, (0.72 + (i % 3) * 0.28) * s), Bas({ color: i % 2 === 0 ? 0xfff08a : 0xff7718, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending, depthWrite: false }));
   em.position.set(Math.cos(ang) * d, h, Math.sin(ang) * d); em.rotation.set(0.45 + (i % 3) * 0.2, -ang, 0);
   holder.add(em);
  }

  const glowDisc = new THREE.Mesh(new THREE.CircleGeometry(2.35 * s, 22), Bas({ color: 0xff7e24, transparent: true, opacity: 0.44, blending: THREE.AdditiveBlending, depthWrite: false }));
  glowDisc.rotation.x = -Math.PI / 2; glowDisc.position.y = -y + 0.075;
  const sc = new THREE.Mesh(new THREE.CircleGeometry(1.65 * s, 18), Bas({ color: 0x1a1218, transparent: true, opacity: 0.42, depthWrite: false }));
  sc.rotation.x = -Math.PI / 2; sc.position.y = -y + 0.068;
  const sr = new THREE.Mesh(new THREE.RingGeometry(1.25 * s, 1.95 * s, 24), Bas({ color: 0xff9a2e, transparent: true, opacity: 0.72, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
  sr.rotation.x = -Math.PI / 2; sr.position.y = -y + 0.095;
  holder.add(sc, glowDisc, sr); fxGroup.add(holder);
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
