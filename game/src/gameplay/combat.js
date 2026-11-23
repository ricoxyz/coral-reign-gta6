// 3D Ballistic Tracers, Muzzle Flashes, Multi-Puff Explosion Bursts, Drift Trails & Hit Detection
export function initCombatSystem(scene, state, events, weaponsSys, soundEngine) {
  const THREE = window.THREE;
  const fxGroup = new THREE.Group();
  scene.add(fxGroup);

  const tracers = [];
  const explosions = [];

  function spawnTracer(fromX, fromY, fromZ, toX, toY, toZ, colorHex = 0xffdf40) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const dz = toZ - fromZ;
    const len = Math.max(0.5, Math.hypot(dx, dy, dz));

    // Sleek tapered glowing tracer streak + bright white hot core
    const geo = new THREE.CylinderGeometry(0.015, 0.042, len, 6);
    geo.rotateX(Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set((fromX + toX) * 0.5, (fromY + toY) * 0.5, (fromZ + toZ) * 0.5);
    mesh.lookAt(toX, toY, toZ);
    fxGroup.add(mesh);

    tracers.push({ mesh, ttl: 0.35 });
  }

  function spawnExplosion(x, y, z, scale = 1.0) {
    // Dramatic roaring 3D orange-gold explosion fireball + dark rising smoke plume + flying embers
    const holder = new THREE.Group();
    holder.position.set(x, y, z);

    // Brilliant white-gold core
    const flashCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.62 * scale, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xfffac2 })
    );
    flashCore.position.y = 0.25 * scale;
    holder.add(flashCore);

    // Roaring orange-gold fireball billows & dark rising smoke plume
    const puffOffsets = [
      { ox: 0.0, oy: 0.35, oz: 0.0, r: 0.92, c: 0xffa619, op: 0.94 },
      { ox: 0.38, oy: 0.28, oz: 0.16, r: 0.76, c: 0xff6214, op: 0.92 },
      { ox: -0.42, oy: 0.42, oz: -0.22, r: 0.72, c: 0xff3b14, op: 0.90 },
      { ox: 0.18, oy: 0.78, oz: 0.22, r: 0.68, c: 0xffb82e, op: 0.88 },
      { ox: -0.18, oy: 1.15, oz: -0.15, r: 0.85, c: 0x262934, op: 0.82 },
      { ox: 0.26, oy: 1.65, oz: -0.10, r: 0.98, c: 0x1d2029, op: 0.76 },
      { ox: -0.24, oy: 2.20, oz: 0.18, r: 1.12, c: 0x161820, op: 0.68 },
    ];
    for (let i = 0; i < puffOffsets.length; i++) {
      const p = puffOffsets[i];
      const puff = new THREE.Mesh(
        new THREE.DodecahedronGeometry(p.r * scale, 1),
        new THREE.MeshBasicMaterial({ color: p.c, transparent: true, opacity: p.op })
      );
      puff.position.set(p.ox * scale, p.oy * scale, p.oz * scale);
      holder.add(puff);
    }

    // Scorched ground crater blast ring
    const scorch = new THREE.Mesh(
      new THREE.CircleGeometry(1.4 * scale, 16),
      new THREE.MeshBasicMaterial({ color: 0x181a22, transparent: true, opacity: 0.65, depthWrite: false })
    );
    scorch.rotation.x = -Math.PI / 2;
    scorch.position.y = -y + 0.07;
    holder.add(scorch);

    // Flying ember sparks
    for (let s = 0; s < 10; s++) {
      const ang = (s / 10) * Math.PI * 2;
      const spark = new THREE.Mesh(
        new THREE.BoxGeometry(0.08 * scale, 0.08 * scale, 0.52 * scale),
        new THREE.MeshBasicMaterial({ color: s % 2 === 0 ? 0xffe45e : 0xff6214 })
      );
      spark.position.set(Math.cos(ang) * 1.15 * scale, (0.35 + (s % 3) * 0.4) * scale, Math.sin(ang) * 1.15 * scale);
      spark.rotation.y = -ang;
      spark.rotation.x = 0.35;
      holder.add(spark);
    }

    fxGroup.add(holder);
    explosions.push({ mesh: holder, ttl: 0.85 });
  }

  function spawnDriftEffects(x, z, rotY) {
    // Glowing brake-light trails, tire smoke puffs & wheel sparks behind drifting car
    const backX = x - Math.sin(rotY) * 2.5;
    const backZ = z - Math.cos(rotY) * 2.5;
    const rightX = Math.cos(rotY);
    const rightZ = -Math.sin(rotY);

    for (const side of [-0.95, 0.95]) {
      const wx = backX + rightX * side;
      const wz = backZ + rightZ * side;

      // Glowing brake-light streak
      const streak = new THREE.Mesh(
        new THREE.PlaneGeometry(0.26, 7.5),
        new THREE.MeshBasicMaterial({
          color: 0xff2248,
          transparent: true,
          opacity: 0.55,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      streak.rotation.x = -Math.PI / 2;
      streak.rotation.z = -rotY;
      streak.position.set(wx - Math.sin(rotY) * 3.5, 0.11, wz - Math.cos(rotY) * 3.5);
      fxGroup.add(streak);

      // Tire smoke puff
      for (let k = 0; k < 3; k++) {
        const smoke = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.45 + k * 0.18, 1),
          new THREE.MeshBasicMaterial({ color: 0xd9e4f5, transparent: true, opacity: 0.28 - k * 0.06 })
        );
        smoke.position.set(
          wx - Math.sin(rotY) * (0.6 + k * 1.15),
          0.35 + k * 0.22,
          wz - Math.cos(rotY) * (0.6 + k * 1.15)
        );
        fxGroup.add(smoke);
      }

      // Orange drift sparks
      for (let sp = 0; sp < 4; sp++) {
        const spark = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.05, 0.55),
          new THREE.MeshBasicMaterial({ color: 0xffcf40 })
        );
        spark.position.set(
          wx - Math.sin(rotY) * (0.4 + sp * 0.65) + (sp % 2 === 0 ? 0.25 : -0.2),
          0.18 + sp * 0.14,
          wz - Math.cos(rotY) * (0.4 + sp * 0.65)
        );
        spark.rotation.y = rotY + (sp - 1.5) * 0.18;
        spark.rotation.x = 0.25;
        fxGroup.add(spark);
      }
    }
  }

  events.on('combat:fire', () => {
    const p = state.player;
    const wep = weaponsSys.getCurrentWeapon();
    p.muzzleTimer = 0.14;

    if (typeof wep.mag === 'number' && wep.mag > 0) {
      wep.mag -= 1;
      if (wep.mag === 0 && wep.reserve > 0) {
        wep.mag = 30;
        wep.reserve = Math.max(0, wep.reserve - 30);
      }
    }

    const dirX = Math.sin(p.rotY);
    const dirZ = Math.cos(p.rotY);
    const startX = p.x + dirX * 0.8;
    const startY = p.y + 1.38;
    const startZ = p.z + dirZ * 0.8;

    let endX = startX + dirX * 36;
    let endY = startY;
    let endZ = startZ + dirZ * 36;

    const enemies = state.entities.enemies;
    for (let i = 0; i < enemies.length; i++) {
      const en = enemies[i];
      if (!en.alive) continue;
      const dist = Math.hypot(en.x - p.x, en.z - p.z);
      if (dist < wep.range) {
        endX = en.x;
        endY = 1.25;
        endZ = en.z;
        en.hp -= wep.damage;
        spawnExplosion(en.x, 1.3, en.z, 0.55);
        if (en.hp <= 0) {
          en.alive = false;
          en.downed = true;
          p.cash += 1250;
          p.respect += 180;
          state.wanted.stars = Math.min(5, Math.max(2, state.wanted.stars));
        }
        break;
      }
    }

    spawnTracer(startX, startY, startZ, endX, endY, endZ, wep.color);
    if (soundEngine) soundEngine.playGunshot();
  });

  return {
    fxGroup,
    spawnTracer,
    spawnExplosion,
    spawnDriftEffects,
    update(dt) {
      if (state.activeShot === 'combat' || state.activeShot === 'cover') return;

      for (let i = tracers.length - 1; i >= 0; i--) {
        tracers[i].ttl -= dt;
        if (tracers[i].ttl <= 0) {
          fxGroup.remove(tracers[i].mesh);
          tracers.splice(i, 1);
        }
      }
      for (let i = explosions.length - 1; i >= 0; i--) {
        explosions[i].ttl -= dt;
        explosions[i].mesh.scale.multiplyScalar(1 + dt * 1.4);
        if (explosions[i].ttl <= 0) {
          fxGroup.remove(explosions[i].mesh);
          explosions.splice(i, 1);
        }
      }
    },
  };
}
