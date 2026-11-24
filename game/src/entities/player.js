// Articulated 3D humanoid characters (Dani Vega, crew, syndicate enforcers, pedestrians)
export function buildCharacterMesh(options = {}) {
 const THREE = window.THREE, group = new THREE.Group();
 const Std = (c, r = .5, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
 const Bas = (p) => new THREE.MeshBasicMaterial(p);
 const skinMat = Std(options.skin || 0xd99b72, .55), jacketMat = Std(options.jacket || 0xff3b78, .34, .22), lapelMat = Std(options.lapel || 0x1a2236, .4, .3);
 const shirtMat = Std(options.shirt || 0x00f0ff, .45), pantsMat = Std(options.pants || 0x182238, .65), shoeMat = Std(options.shoe || 0x0f1218, .75);
 const hairMat = Std(options.hair || 0x261a2c, .72), gunMat = Std(0x1e2533, .22, .85), gunAccentMat = Std(0xffbf3c, .25, .8);

 const P = (par, geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); par.add(m); return m; };
 const G = (geo, mat, x, y, z) => P(group, geo, mat, x, y, z);
 const Box = (w, h, d) => new THREE.BoxGeometry(w, h, d), Cyl = (rt, rb, h, s = 10) => new THREE.CylinderGeometry(rt, rb, h, s), Sph = (r, w = 10, h = 10) => new THREE.SphereGeometry(r, w, h), Cone = (r, l, s = 7) => new THREE.ConeGeometry(r, l, s);
 const Add = (c, op) => Bas({ color: c, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false });

 G(new THREE.CircleGeometry(.5, 14), Bas({ color: 0x050810, transparent: true, opacity: .5, depthWrite: false }), 0, .06, 0).rotation.x = -Math.PI / 2;
 G(Box(.42, .16, .26), pantsMat, 0, .82, 0);
 G(Cyl(.28, .22, .66, 12), jacketMat, 0, 1.2, 0).scale.set(1.18, 1, .68);
 G(Box(.54, .22, .22), jacketMat, 0, 1.38, -.01);
 for (const sx of [-.28, .28]) {
  G(Sph(.115), jacketMat, sx, 1.46, 0);
  G(Box(.15, .032, .13), shirtMat, sx * .84, 1.52, -.02);
 }
 G(Cyl(.175, .21, .06), shirtMat, 0, 1.55, 0).scale.set(1.1, 1, .86);
 G(Cyl(.17, .205, .08), lapelMat, 0, 1.5, 0).scale.set(1.12, 1, .88);
 G(Box(.16, .56, .1), shirtMat, 0, 1.21, .12);
 for (const lx of [-.1, .1]) G(Box(.05, .52, .11), lapelMat, lx, 1.22, .125).rotation.z = -lx * .4;
 G(Box(.46, .032, .035), lapelMat, 0, 1.42, -.165);
 G(Box(.036, .42, .03), lapelMat, 0, 1.18, -.158);
 G(Box(.46, .048, .24), lapelMat, 0, .94, -.01);
 G(Cyl(.23, .235, .075, 12), lapelMat, 0, .89, 0).scale.set(1.17, 1, .72);
 G(Box(.08, .06, .04), gunAccentMat, 0, .89, .165);

 G(Cyl(.08, .095, .14), skinMat, 0, 1.58, 0);
 G(Sph(.185, 14, 14), skinMat, 0, 1.74, 0).scale.set(.95, 1.06, .98);
 G(Sph(.198, 14, 12), hairMat, 0, 1.79, -.02).scale.set(.98, .92, 1.04);
 if (options.hairStyle === 'ponytail') {
  G(Sph(.095, 8, 8), hairMat, 0, 1.79, -.21);
  G(Cyl(.045, .075, .22, 8), hairMat, 0, 1.67, -.23).rotation.x = .45;
  G(Box(.24, .06, .18), lapelMat, 0, 1.88, .04);
 } else {
  G(Box(.22, .11, .28), hairMat, 0, 1.91, .02).rotation.x = -.18;
  G(Box(.18, .13, .11), hairMat, 0, 1.72, -.15);
 }
 G(Box(.28, .068, .12), Bas({ color: options.visor || 0x00f0ff }), 0, 1.75, .15);

 const makeLeg = (s) => {
  const leg = new THREE.Group(); leg.position.set(s * .14, .78, 0);
  P(leg, Cyl(.098, .084, .38), pantsMat, 0, -.18, 0);
  P(leg, Sph(.082, 8, 8), lapelMat, 0, -.37, .02);
  P(leg, Cyl(.082, .068, .36), pantsMat, 0, -.54, -.02);
  P(leg, Box(.16, .11, .27), shoeMat, 0, -.72, .04);
  P(leg, Box(.17, .03, .28), shirtMat, 0, -.76, .04);
  return leg;
 };
 const leftLeg = makeLeg(-1), rightLeg = makeLeg(1);
 group.add(leftLeg, rightLeg);

 const leftArm = new THREE.Group(); leftArm.position.set(-.31, 1.44, 0);
 P(leftArm, Cyl(.078, .068, .3), jacketMat, 0, -.14, 0);
 P(leftArm, Cyl(.066, .056, .28), skinMat, .06, -.32, .14).rotation.set(-.85, 0, -.35);
 group.add(leftArm);

 const rightArm = new THREE.Group(); rightArm.position.set(.31, 1.44, 0);
 P(rightArm, Cyl(.078, .068, .3), jacketMat, 0, -.14, 0);
 P(rightArm, Cyl(.066, .056, .28), skinMat, -.04, -.34, .1).rotation.x = -.35;

 const gunMesh = new THREE.Group(); gunMesh.position.set(-.08, -.46, .14); gunMesh.rotation.x = Math.PI * .45;
 P(gunMesh, Box(.075, .13, .46), gunMat, 0, 0, 0);
 P(gunMesh, Cyl(.024, .024, .38, 8), gunMat, 0, .02, .38).rotation.x = Math.PI / 2;
 P(gunMesh, Box(.065, .085, .24), gunAccentMat, 0, .015, .28);
 P(gunMesh, Box(.055, .2, .085), gunMat, 0, -.14, .08).rotation.x = .22;
 P(gunMesh, Box(.065, .11, .22), lapelMat, 0, -.02, -.28);
 P(gunMesh, Cyl(.028, .028, .16, 8), gunAccentMat, 0, .095, .02).rotation.x = Math.PI / 2;

 const muzzleFlash = new THREE.Group(); muzzleFlash.position.set(0, .02, .6);
 const flashMat = Add(0xff9f24, .88), sparkMat = Add(0xffe066, .94);
 P(muzzleFlash, Sph(.065, 8, 8), Bas({ color: 0xfff5cc }), 0, 0, 0); P(muzzleFlash, Sph(.16, 10, 8), Add(0xff7b1c, .34), 0, 0, .04);
 P(muzzleFlash, Cone(.08, .32), flashMat, 0, 0, .16).rotation.x = Math.PI / 2;
 for (let sp = 0; sp < 6; sp++) {
  const ang = (sp / 6) * Math.PI * 2 + .35;
  P(muzzleFlash, Cone(.026, .19 + (sp % 2) * .07, 5), sp % 2 === 0 ? sparkMat : flashMat, Math.cos(ang) * .08, Math.sin(ang) * .08, .03).rotation.z = ang - Math.PI / 2;
 }
 muzzleFlash.visible = false;
 gunMesh.add(muzzleFlash); rightArm.add(gunMesh); group.add(rightArm);
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
   const k = state.input.keys, mz = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0), mx = (k.KeyA || k.ArrowLeft ? 1 : 0) - (k.KeyD || k.ArrowRight ? 1 : 0);
   const sprint = Boolean(k.ShiftLeft || k.ShiftRight || k.Space), speed = sprint ? 11.5 : 7.2;
   if (mz !== 0 || mx !== 0) {
    p.rotY = Math.atan2(mx, mz) + state.input.cameraYaw;
    const nx = p.x + Math.sin(p.rotY) * speed * dt, nz = p.z + Math.cos(p.rotY) * speed * dt;
    if (!colliders.some((c) => nx > c.minX - .8 && nx < c.maxX + .8 && nz > c.minZ - .8 && nz < c.maxZ + .8)) { p.x = nx; p.z = nz; }
    p.walkCycle += dt * (sprint ? 14 : 9);
   }
   const { leftLeg, rightLeg, leftArm, rightArm, muzzleFlash } = mesh.userData, sw = Math.sin(p.walkCycle) * .45;
   if (p.aiming || p.muzzleTimer > 0) {
    leftLeg.rotation.x = .24; rightLeg.rotation.x = -.26;
    rightArm.rotation.set(-Math.PI * .46, -.22, -.12); leftArm.rotation.set(-Math.PI * .38, .4, 0);
   } else {
    leftLeg.rotation.x = sw; rightLeg.rotation.x = -sw;
    leftArm.rotation.set(-sw * .6, 0, 0); rightArm.rotation.x = sw * .5;
   }
   if (p.muzzleTimer > 0) { if (!state.activeShot) p.muzzleTimer -= dt; muzzleFlash.visible = true; } else muzzleFlash.visible = false;
   mesh.position.set(p.x, p.y, p.z); mesh.rotation.y = p.rotY;
  },
 };
}
