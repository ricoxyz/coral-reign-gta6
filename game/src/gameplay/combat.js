// 3D Ballistic Tracers, Multi-Layered Jagged Detonations, Debris Shards, Drift Trails & Hit Detection
export function initCombatSystem(scene, state, events, weaponsSys, soundEngine) {
 const THREE = window.THREE;
 const Bas = (p) => new THREE.MeshBasicMaterial(p);
 const fxGroup = new THREE.Group();
 scene.add(fxGroup);
 const tracers = [], explosions = [];

 function spawnTracer(fromX, fromY, fromZ, toX, toY, toZ, colorHex = 0xffdf40) {
  const len = Math.max(0.5, Math.hypot(toX - fromX, toY - fromY, toZ - fromZ));
  const holder = new THREE.Group();
  const outerGeo = new THREE.CylinderGeometry(0.018, 0.046, len, 6); outerGeo.rotateX(Math.PI / 2);
  holder.add(new THREE.Mesh(outerGeo, Bas({ color: colorHex, transparent: true, opacity: 0.94, blending: THREE.AdditiveBlending })));
  const coreGeo = new THREE.CylinderGeometry(0.008, 0.02, len * 0.92, 6); coreGeo.rotateX(Math.PI / 2);
  holder.add(new THREE.Mesh(coreGeo, Bas({ color: 0xffffff })));
  holder.position.set((fromX + toX) * 0.5, (fromY + toY) * 0.5, (fromZ + toZ) * 0.5);
  holder.lookAt(toX, toY, toZ);
  fxGroup.add(holder);
  tracers.push({ mesh: holder, ttl: 0.35 });
 }

 function spawnExplosion(x, y, z, s = 1.0) {
  const holder = new THREE.Group();
  holder.position.set(x, y, z);

  const coreA = new THREE.Mesh(new THREE.IcosahedronGeometry(0.68 * s, 0), Bas({ color: 0xfff8b8 }));
  coreA.position.y = 0.32 * s; coreA.scale.set(1.15, 1.35, 1.05);
  const coreB = new THREE.Mesh(new THREE.OctahedronGeometry(0.84 * s, 0), Bas({ color: 0xffd447 }));
  coreB.position.y = 0.38 * s; coreB.rotation.set(0.6, 0.8, 0.4); coreB.scale.set(1.25, 0.95, 1.2);
  holder.add(coreA, coreB);

  const fCols = [0xffa619, 0xff6214, 0xe8251a, 0xff8c1a, 0xff3b14];
  for (let i = 0; i < 14; i++) {
   const az = (i / 14) * Math.PI * 2 + (i % 3) * 0.18, el = 0.22 + (i % 4) * 0.26;
   const t = new THREE.Mesh(new THREE.ConeGeometry((0.34 + (i % 2) * 0.16) * s, (0.95 + (i % 3) * 0.42) * s, 5), Bas({ color: fCols[i % 5], transparent: true, opacity: 0.94 }));
   t.position.set(Math.cos(az) * 0.42 * s, (0.28 + (i % 3) * 0.24) * s, Math.sin(az) * 0.42 * s);
   t.rotation.set(Math.sin(az) * (1.57 - el), 0, -Math.cos(az) * (1.57 - el));
   holder.add(t);
  }

  [[0.42, 0.45, 0.22, 1.3, 0.85, 1.1, 0.66, 0xff6b14, 1], [-0.46, 0.52, -0.24, 1.1, 1.3, 0.9, 0.64, 0xe8321a, 1], [0.15, 0.88, -0.35, 1.2, 1.15, 0.85, 0.62, 0xff981a, 1], [-0.25, 0.74, 0.38, 0.95, 1.25, 1.2, 0.58, 0xff4914, 1], [-0.35, 1.35, -0.22, 1.35, 0.82, 1.15, 0.74, 0x2c2529, 0.86], [0.38, 1.55, 0.18, 1.25, 0.78, 1.2, 0.68, 0x231f24, 0.82], [-0.12, 1.98, 0.25, 1.4, 0.75, 1.25, 0.82, 0x1c191f, 0.76], [0.24, 2.38, -0.18, 1.45, 0.72, 1.3, 0.88, 0x17151a, 0.68]].forEach(([ox, oy, oz, sx, sy, sz, r, c, op], i) => {
   const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 0), Bas({ color: c, transparent: op < 1, opacity: op }));
   m.position.set(ox * s, oy * s, oz * s); m.scale.set(sx, sy, sz); m.rotation.set(i * 0.7, i * 1.1, i * 0.5);
   holder.add(m);
  });

  const shardMat = new THREE.MeshStandardMaterial({ color: 0x1e222b, emissive: 0x441200, roughness: 0.4, metalness: 0.8 });
  for (let i = 0; i < 16; i++) {
   const ang = (i / 16) * Math.PI * 2, d = (1.1 + (i % 4) * 0.38) * s, h = (0.35 + (i % 5) * 0.36) * s;
   const em = new THREE.Mesh(new THREE.BoxGeometry(0.06 * s, 0.06 * s, (0.55 + (i % 3) * 0.25) * s), Bas({ color: i % 2 === 0 ? 0xffe866 : 0xff5510 }));
   em.position.set(Math.cos(ang) * d, h, Math.sin(ang) * d); em.rotation.set(0.4 + (i % 3) * 0.2, -ang, 0);
   holder.add(em);
   if (i % 2 === 0) {
    const sh = new THREE.Mesh(new THREE.TetrahedronGeometry(0.21 * s, 0), shardMat);
    sh.position.set(Math.cos(ang + 0.15) * d * 1.15, h + 0.25 * s, Math.sin(ang + 0.15) * d * 1.15);
    sh.rotation.set(i * 0.8, i * 1.2, i * 0.5); holder.add(sh);
   }
  }

  const sc = new THREE.Mesh(new THREE.CircleGeometry(1.75 * s, 18), Bas({ color: 0x12131a, transparent: true, opacity: 0.76, depthWrite: false }));
  sc.rotation.x = -Math.PI / 2; sc.position.y = -y + 0.07;
  const sr = new THREE.Mesh(new THREE.RingGeometry(1.35 * s, 1.85 * s, 20), Bas({ color: 0xff7e29, transparent: true, opacity: 0.65, side: THREE.DoubleSide, depthWrite: false }));
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
    const sm = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42 + k * 0.16, 0), Bas({ color: 0xdce6f7, transparent: true, opacity: 0.34 - k * 0.06 }));
    sm.position.set(wx - Math.sin(rotY) * (0.5 + k * 1.1), 0.32 + k * 0.18, wz - Math.cos(rotY) * (0.5 + k * 1.1));
    sm.scale.set(1.25, 0.8, 1.15); fxGroup.add(sm);
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
