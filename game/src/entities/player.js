// Articulated multi-limb 3D humanoid characters (Player Dani Vega, crew, syndicate enforcers, pedestrians)
export function buildCharacterMesh(options = {}) {
 const THREE = window.THREE;
 const Std = (c, r = 0.5, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
 const group = new THREE.Group();
 const skinMat = Std(options.skin || 0xd99b72, 0.55);
 const jacketMat = Std(options.jacket || 0xff3b78, 0.34, 0.22);
 const lapelMat = Std(options.lapel || 0x1a2236, 0.4, 0.3);
 const shirtMat = Std(options.shirt || 0x00f0ff, 0.45);
 const pantsMat = Std(options.pants || 0x182238, 0.65);
 const shoeMat = Std(options.shoe || 0x0f1218, 0.75);
 const hairMat = Std(options.hair || 0x181322, 0.75);
 const gunMat = Std(0x1e2533, 0.22, 0.85);
 const gunAccentMat = Std(0xffbf3c, 0.25, 0.8);

 const P = (parent, geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
 const Box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
 const Cyl = (rt, rb, h, s = 10) => new THREE.CylinderGeometry(rt, rb, h, s);

 const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.5, 14), new THREE.MeshBasicMaterial({ color: 0x050810, transparent: true, opacity: 0.5, depthWrite: false }));
 shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.06; group.add(shadow);

 P(group, Box(0.42, 0.16, 0.26), pantsMat, 0, 0.82, 0);
 P(group, Box(0.12, 0.08, 0.28), gunAccentMat, 0, 0.82, 0);
 P(group, Cyl(0.28, 0.22, 0.66, 12), jacketMat, 0, 1.2, 0).scale.set(1.18, 1, 0.68);
 for (const sx of [-0.28, 0.28]) P(group, new THREE.SphereGeometry(0.115, 10, 10), jacketMat, sx, 1.46, 0);
 P(group, Cyl(0.18, 0.21, 0.11), lapelMat, 0, 1.53, 0).scale.set(1.1, 1, 0.85);
 P(group, Box(0.17, 0.62, 0.34), shirtMat, 0, 1.2, 0);
 for (const lx of [-0.11, 0.11]) P(group, Box(0.05, 0.56, 0.36), lapelMat, lx, 1.21, 0).rotation.z = -lx * 0.45;

 P(group, Cyl(0.08, 0.095, 0.14), skinMat, 0, 1.58, 0);
 P(group, new THREE.SphereGeometry(0.185, 14, 14), skinMat, 0, 1.74, 0).scale.set(0.95, 1.06, 0.98);
 P(group, new THREE.SphereGeometry(0.198, 14, 12), hairMat, 0, 1.79, -0.02).scale.set(0.98, 0.92, 1.04);
 P(group, Box(0.24, 0.09, 0.28), hairMat, 0, 1.91, 0.02).rotation.x = -0.15;
 P(group, Box(0.28, 0.068, 0.12), new THREE.MeshBasicMaterial({ color: options.visor || 0x00f0ff }), 0, 1.75, 0.15);

 const makeLeg = (s) => {
  const leg = new THREE.Group(); leg.position.set(s * 0.14, 0.78, 0);
  P(leg, Cyl(0.098, 0.084, 0.38), pantsMat, 0, -0.18, 0);
  P(leg, new THREE.SphereGeometry(0.082, 8, 8), lapelMat, 0, -0.37, 0.02);
  P(leg, Cyl(0.082, 0.068, 0.36), pantsMat, 0, -0.54, -0.02);
  P(leg, Box(0.16, 0.11, 0.27), shoeMat, 0, -0.72, 0.04);
  P(leg, Box(0.17, 0.03, 0.28), shirtMat, 0, -0.76, 0.04);
  return leg;
 };
 const leftLeg = makeLeg(-1), rightLeg = makeLeg(1);
 group.add(leftLeg, rightLeg);

 const leftArm = new THREE.Group(); leftArm.position.set(-0.31, 1.44, 0);
 P(leftArm, Cyl(0.078, 0.068, 0.3), jacketMat, 0, -0.14, 0);
 P(leftArm, Cyl(0.066, 0.056, 0.28), skinMat, 0.06, -0.32, 0.14).rotation.set(-0.85, 0, -0.35);
 group.add(leftArm);

 const rightArm = new THREE.Group(); rightArm.position.set(0.31, 1.44, 0);
 P(rightArm, Cyl(0.078, 0.068, 0.3), jacketMat, 0, -0.14, 0);
 P(rightArm, Cyl(0.066, 0.056, 0.28), skinMat, -0.04, -0.34, 0.1).rotation.x = -0.35;

 const gunMesh = new THREE.Group(); gunMesh.position.set(-0.08, -0.46, 0.14); gunMesh.rotation.x = Math.PI * 0.45;
 P(gunMesh, Box(0.075, 0.13, 0.46), gunMat, 0, 0, 0);
 P(gunMesh, Cyl(0.024, 0.024, 0.38, 8), gunMat, 0, 0.02, 0.38).rotation.x = Math.PI / 2;
 P(gunMesh, Box(0.065, 0.085, 0.24), gunAccentMat, 0, 0.015, 0.28);
 P(gunMesh, Box(0.055, 0.2, 0.085), gunMat, 0, -0.14, 0.08).rotation.x = 0.22;
 P(gunMesh, Box(0.065, 0.11, 0.22), lapelMat, 0, -0.02, -0.28);
 P(gunMesh, Cyl(0.028, 0.028, 0.16, 8), gunAccentMat, 0, 0.095, 0.02).rotation.x = Math.PI / 2;

 const muzzleFlash = new THREE.Group(); muzzleFlash.position.set(0, 0.02, 0.6);
 const flashMat = new THREE.MeshBasicMaterial({ color: 0xff9f24, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending, depthWrite: false });
 const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.94, blending: THREE.AdditiveBlending, depthWrite: false });
 P(muzzleFlash, new THREE.SphereGeometry(0.065, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfff5cc }), 0, 0, 0);
 P(muzzleFlash, new THREE.SphereGeometry(0.16, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff7b1c, transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending, depthWrite: false }), 0, 0, 0.04);
 P(muzzleFlash, new THREE.ConeGeometry(0.08, 0.32, 7), flashMat, 0, 0, 0.16).rotation.x = Math.PI / 2;
 for (let sp = 0; sp < 6; sp++) {
  const ang = (sp / 6) * Math.PI * 2 + 0.35;
  const ray = P(muzzleFlash, new THREE.ConeGeometry(0.026, 0.19 + (sp % 2) * 0.07, 5), sp % 2 === 0 ? sparkMat : flashMat, Math.cos(ang) * 0.08, Math.sin(ang) * 0.08, 0.03);
  ray.rotation.z = ang - Math.PI / 2;
 }
 muzzleFlash.visible = false;
 gunMesh.add(muzzleFlash);
 rightArm.add(gunMesh); group.add(rightArm);
 group.userData = { leftLeg, rightLeg, leftArm, rightArm, muzzleFlash, gunMesh };
 return group;
}

export function initPlayerEntity(scene, state) {
 const mesh = buildCharacterMesh({ jacket: 0xff3b78, lapel: 0x162038, shirt: 0x00f0ff, pants: 0x162038, visor: 0x00f0ff });
 scene.add(mesh);

 return {
  mesh,
  update(dt, colliders) {
   const p = state.player;
   if (p.inVehicle) { mesh.visible = false; return; }
   mesh.visible = true;

   const k = state.input.keys;
   const moveZ = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0);
   const moveX = (k.KeyA || k.ArrowLeft ? 1 : 0) - (k.KeyD || k.ArrowRight ? 1 : 0);
   const sprint = Boolean(k.ShiftLeft || k.ShiftRight || k.Space), speed = sprint ? 11.5 : 7.2;

   if (moveZ !== 0 || moveX !== 0) {
    p.rotY = Math.atan2(moveX, moveZ) + state.input.cameraYaw;
    const nx = p.x + Math.sin(p.rotY) * speed * dt, nz = p.z + Math.cos(p.rotY) * speed * dt;
    if (!colliders.some((c) => nx > c.minX - 0.8 && nx < c.maxX + 0.8 && nz > c.minZ - 0.8 && nz < c.maxZ + 0.8)) { p.x = nx; p.z = nz; }
    p.walkCycle += dt * (sprint ? 14 : 9);
   }

   const { leftLeg, rightLeg, leftArm, rightArm, muzzleFlash } = mesh.userData;
   const sw = Math.sin(p.walkCycle) * 0.45;
   if (p.aiming || p.muzzleTimer > 0) {
    leftLeg.rotation.x = 0.24; rightLeg.rotation.x = -0.26;
    rightArm.rotation.x = -Math.PI * 0.45; leftArm.rotation.set(-Math.PI * 0.36, 0.32, 0);
   } else {
    leftLeg.rotation.x = sw; rightLeg.rotation.x = -sw;
    leftArm.rotation.set(-sw * 0.6, 0, 0); rightArm.rotation.x = sw * 0.5;
   }
   if (p.muzzleTimer > 0) { if (!state.activeShot) p.muzzleTimer -= dt; muzzleFlash.visible = true; }
   else muzzleFlash.visible = false;

   mesh.position.set(p.x, p.y, p.z); mesh.rotation.y = p.rotY;
  },
 };
}
