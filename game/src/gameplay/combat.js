// 3D Ballistic Tracers, Muzzle Flashes, Explosion Fireballs, and Hit Detection
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

    const geo = new THREE.CylinderGeometry(0.055, 0.055, len, 6);
    geo.rotateX(Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({ color: colorHex });
    const mesh = new THREE.Mesh(geo, mat);

    mesh.position.set((fromX + toX) * 0.5, (fromY + toY) * 0.5, (fromZ + toZ) * 0.5);
    mesh.lookAt(toX, toY, toZ);
    fxGroup.add(mesh);

    tracers.push({ mesh, ttl: 0.35 });
  }

  function spawnExplosion(x, y, z, scale = 1.0) {
    const holder = new THREE.Group();
    holder.position.set(x, y, z);

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(1.1 * scale, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xfff078 })
    );
    const outer = new THREE.Mesh(
      new THREE.SphereGeometry(1.85 * scale, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xff4d29, transparent: true, opacity: 0.78 })
    );
    const smoke = new THREE.Mesh(
      new THREE.SphereGeometry(2.45 * scale, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xff2a6d, transparent: true, opacity: 0.38 })
    );
    holder.add(core, outer, smoke);
    fxGroup.add(holder);

    explosions.push({ mesh: holder, ttl: 0.75 });
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

    // Check enemy hits
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
          p.cash += 1250;
          p.respect += 180;
          state.wanted.stars = Math.min(5, Math.max(3, state.wanted.stars));
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
    update(dt) {
      if (state.activeShot === 'combat') return; // Keep staged combat tracers frozen for screenshot clarity

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
