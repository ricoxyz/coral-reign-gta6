// Sculpted articulated 3D humanoid characters (Player Dani Vega, crew, police, pedestrians)
export function buildCharacterMesh(options = {}) {
  const THREE = window.THREE;
  const group = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({ color: options.skin || 0xd99b72, roughness: 0.6 });
  const jacketMat = new THREE.MeshStandardMaterial({
    color: options.jacket || 0xff3b78,
    roughness: 0.35,
    metalness: 0.25,
  });
  const shirtMat = new THREE.MeshStandardMaterial({ color: options.shirt || 0x00f0ff, roughness: 0.5 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: options.pants || 0x182238, roughness: 0.7 });
  const hairMat = new THREE.MeshStandardMaterial({ color: options.hair || 0x161219, roughness: 0.8 });
  const gunMat = new THREE.MeshStandardMaterial({ color: 0x202634, metalness: 0.85, roughness: 0.2 });

  // Torso jacket + inner neon shirt
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.74, 0.32), jacketMat);
  torso.position.y = 1.15;
  group.add(torso);

  const chestStripe = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.68, 0.34), shirtMat);
  chestStripe.position.y = 1.15;
  group.add(chestStripe);

  // Head + Sunglasses + Stylized Hair
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), skinMat);
  head.position.y = 1.72;
  group.add(head);

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.235, 12, 10), hairMat);
  hair.position.set(0, 1.77, -0.03);
  group.add(hair);

  const visor = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.08, 0.12),
    new THREE.MeshBasicMaterial({ color: 0x00f0ff })
  );
  visor.position.set(0, 1.73, 0.18);
  group.add(visor);

  // Left & Right Articulated Legs
  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.76, 0.22), pantsMat);
  leftLeg.position.set(-0.15, 0.38, 0);
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.76, 0.22), pantsMat);
  rightLeg.position.set(0.15, 0.38, 0);
  group.add(rightLeg);

  // Left & Right Arms + Weapon Rifle in right hand
  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.62, 0.18), jacketMat);
  leftArm.position.set(-0.38, 1.15, 0);
  group.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.38, 1.38, 0);
  const armMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.62, 0.18), jacketMat);
  armMesh.position.y = -0.24;
  rightArm.add(armMesh);

  const gunMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 0.68), gunMat);
  gunMesh.position.set(0, -0.45, 0.28);
  rightArm.add(gunMesh);

  // Glowing muzzle flash sprite at barrel tip
  const muzzleFlash = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffdf40 })
  );
  muzzleFlash.position.set(0, -0.45, 0.68);
  muzzleFlash.visible = false;
  rightArm.add(muzzleFlash);

  group.add(rightArm);
  group.userData = { leftLeg, rightLeg, leftArm, rightArm, muzzleFlash };
  return group;
}

export function initPlayerEntity(scene, state) {
  const mesh = buildCharacterMesh({
    jacket: 0xff3b78,
    shirt: 0x00f0ff,
    pants: 0x162038,
  });
  scene.add(mesh);

  return {
    mesh,
    update(dt, colliders) {
      const p = state.player;
      if (p.inVehicle) {
        mesh.visible = false;
        return;
      }
      mesh.visible = true;

      const keys = state.input.keys;
      const moveZ = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0);
      const moveX = (keys.KeyA || keys.ArrowLeft ? 1 : 0) - (keys.KeyD || keys.ArrowRight ? 1 : 0);
      const sprinting = Boolean(keys.ShiftLeft || keys.ShiftRight || keys.Space);
      const speed = sprinting ? 11.5 : 7.2;

      if (moveZ !== 0 || moveX !== 0) {
        const moveAngle = Math.atan2(moveX, moveZ) + state.input.cameraYaw;
        p.rotY = moveAngle;
        const nx = p.x + Math.sin(moveAngle) * speed * dt;
        const nz = p.z + Math.cos(moveAngle) * speed * dt;

        let hit = false;
        for (let i = 0; i < colliders.length; i++) {
          const c = colliders[i];
          if (nx > c.minX - 0.8 && nx < c.maxX + 0.8 && nz > c.minZ - 0.8 && nz < c.maxZ + 0.8) {
            hit = true;
            break;
          }
        }
        if (!hit) {
          p.x = nx;
          p.z = nz;
        }
        p.walkCycle += dt * (sprinting ? 14 : 9);
      }

      // Animate legs & aiming arm
      const { leftLeg, rightLeg, leftArm, rightArm, muzzleFlash } = mesh.userData;
      const swing = Math.sin(p.walkCycle) * 0.45;
      leftLeg.rotation.x = swing;
      rightLeg.rotation.x = -swing;
      leftArm.rotation.x = -swing * 0.6;

      if (p.aiming || p.muzzleTimer > 0) {
        rightArm.rotation.x = -Math.PI * 0.45;
      } else {
        rightArm.rotation.x = swing * 0.5;
      }

      if (p.muzzleTimer > 0) {
        p.muzzleTimer -= dt;
        muzzleFlash.visible = true;
      } else {
        muzzleFlash.visible = false;
      }

      mesh.position.set(p.x, p.y, p.z);
      mesh.rotation.y = p.rotY;
    },
  };
}
