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
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x0f1218, roughness: 0.8 });
  const hairMat = new THREE.MeshStandardMaterial({ color: options.hair || 0x1a1420, roughness: 0.8 });
  const gunMat = new THREE.MeshStandardMaterial({ color: 0x202634, metalness: 0.85, roughness: 0.2 });

  // Grounded contact shadow disc
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.46, 12),
    new THREE.MeshBasicMaterial({ color: 0x050810, transparent: true, opacity: 0.45, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.06;
  group.add(shadow);

  // Tapered humanoid torso jacket + collar + inner neon shirt
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.22, 0.72, 10), jacketMat);
  torso.scale.set(1.15, 1, 0.65);
  torso.position.y = 1.15;
  group.add(torso);

  const chestStripe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.66, 0.31), shirtMat);
  chestStripe.position.y = 1.15;
  group.add(chestStripe);

  // Head + Neon Sunglasses + Stylized Hair
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 12), skinMat);
  head.position.y = 1.71;
  group.add(head);

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.205, 12, 10), hairMat);
  hair.position.set(0, 1.76, -0.025);
  group.add(hair);

  const visor = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.065, 0.1),
    new THREE.MeshBasicMaterial({ color: options.visor || 0x00f0ff })
  );
  visor.position.set(0, 1.72, 0.16);
  group.add(visor);

  // Left & Right Articulated Cylindrical Legs + Sneakers
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.08, 0.72, 8), pantsMat);
  leftLeg.position.set(-0.13, 0.4, 0);
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.08, 0.72, 8), pantsMat);
  rightLeg.position.set(0.13, 0.4, 0);
  group.add(rightLeg);

  const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.26), shoeMat);
  leftShoe.position.set(-0.13, 0.06, 0.04);
  group.add(leftShoe);

  const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.26), shoeMat);
  rightShoe.position.set(0.13, 0.06, 0.04);
  group.add(rightShoe);

  // Left & Right Articulated Cylindrical Arms + Carbine Rifle in right hand
  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.58, 8), jacketMat);
  leftArm.position.set(-0.34, 1.16, 0);
  group.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.34, 1.38, 0);
  const armMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.58, 8), jacketMat);
  armMesh.position.y = -0.22;
  rightArm.add(armMesh);

  const gunMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.13, 0.62), gunMat);
  gunMesh.position.set(0, -0.44, 0.25);
  rightArm.add(gunMesh);

  // Crisp additive starburst muzzle flash at barrel tip
  const muzzleFlash = new THREE.Group();
  muzzleFlash.position.set(0, -0.44, 0.62);
  const flashMat = new THREE.MeshBasicMaterial({
    color: 0xffdf55,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });
  const flashCore = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  const flashSpike1 = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.36, 5), flashMat);
  flashSpike1.rotation.x = Math.PI / 2;
  flashSpike1.position.z = 0.16;
  const flashSpike2 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.05, 0.05), flashMat);
  const flashSpike3 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.32, 0.05), flashMat);
  muzzleFlash.add(flashCore, flashSpike1, flashSpike2, flashSpike3);
  muzzleFlash.visible = false;
  rightArm.add(muzzleFlash);

  group.add(rightArm);
  group.userData = { leftLeg, rightLeg, leftArm, rightArm, muzzleFlash, gunMesh };
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

      const { leftLeg, rightLeg, leftArm, rightArm, muzzleFlash } = mesh.userData;
      const swing = Math.sin(p.walkCycle) * 0.45;
      leftLeg.rotation.x = swing;
      rightLeg.rotation.x = -swing;
      leftArm.rotation.x = -swing * 0.6;

      if (p.aiming || p.muzzleTimer > 0) {
        rightArm.rotation.x = -Math.PI * 0.48;
      } else {
        rightArm.rotation.x = swing * 0.5;
      }

      if (p.muzzleTimer > 0) {
        if (!state.activeShot) p.muzzleTimer -= dt;
        muzzleFlash.visible = true;
      } else {
        muzzleFlash.visible = false;
      }

      mesh.position.set(p.x, p.y, p.z);
      mesh.rotation.y = p.rotY;
    },
  };
}
