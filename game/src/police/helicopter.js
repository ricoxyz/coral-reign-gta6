// AIR-1 Tactical Police Helicopter with sculpted fuselage, spinning rotors & feathered volumetric spotlight cone
export function initPoliceHelicopter(scene, state) {
 const THREE = window.THREE;
 const heli = new THREE.Group();
 const bodyMat = new THREE.MeshStandardMaterial({ color: 0x101a2e, roughness: 0.25, metalness: 0.78 });
 const trimMat = new THREE.MeshStandardMaterial({ color: 0xf4f8ff, roughness: 0.3 });
 const glassMat = new THREE.MeshStandardMaterial({ color: 0x00d8ff, emissive: 0x002d45, roughness: 0.1, metalness: 0.85 });
 const rotorMat = new THREE.MeshBasicMaterial({ color: 0x162030 });

 const B = (w, h, d, mat, x, y, z) => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z); heli.add(m); return m;
 };

 B(2.4, 2.0, 5.8, bodyMat, 0, 0, 0);
 B(2.48, 0.38, 5.2, trimMat, 0, -0.15, 0);
 B(1.7, 0.75, 2.8, bodyMat, 0, 1.25, -0.3);
 B(0.55, 0.65, 5.8, bodyMat, 0, 0.35, -5.2);
 B(0.22, 1.85, 1.2, trimMat, 0, 1.15, -7.8);
 const tailRotor = B(0.1, 2.0, 0.22, rotorMat, 0.32, 1.25, -7.8);

 const cockpit = new THREE.Mesh(new THREE.SphereGeometry(1.25, 14, 12), glassMat);
 cockpit.scale.set(0.95, 0.85, 1.35); cockpit.position.set(0, -0.1, 2.35); heli.add(cockpit);

 for (const sx of [-1.05, 1.05]) {
  const skid = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 5.4, 6), trimMat);
  skid.rotation.x = Math.PI / 2; skid.position.set(sx, -1.45, 0.4); heli.add(skid);
 }

 const mainRotor = new THREE.Group(); mainRotor.position.set(0, 1.75, 0.1);
 const blurDisc = new THREE.Mesh(new THREE.CircleGeometry(6.1, 28), new THREE.MeshBasicMaterial({ color: 0x99c8ff, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }));
 blurDisc.rotation.x = -Math.PI / 2;
 mainRotor.add(new THREE.Mesh(new THREE.BoxGeometry(12.2, 0.07, 0.42), rotorMat), new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.07, 12.2), rotorMat), blurDisc);
 heli.add(mainRotor);

 [[0.36, 0xffffff, 0, -1.05, 2.4], [0.26, 0xff1744, -1.15, -0.85, 1.4], [0.26, 0x00e5ff, 1.15, -0.85, 1.4]].forEach(([r, col, x, y, z]) => {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 8), new THREE.MeshBasicMaterial({ color: col }));
  m.position.set(x, y, z); heli.add(m);
 });

 const coneCanvas = document.createElement('canvas'); coneCanvas.width = 64; coneCanvas.height = 128;
 const cCtx = coneCanvas.getContext('2d'), cGrad = cCtx.createLinearGradient(0, 0, 0, 128);
 cGrad.addColorStop(0, 'rgba(200,246,255,.52)'); cGrad.addColorStop(1, 'rgba(110,230,255,.08)');
 cCtx.fillStyle = cGrad; cCtx.fillRect(0, 0, 64, 128);

 const spotlightCone = new THREE.Mesh(
  new THREE.ConeGeometry(8.5, 34, 28, 1, true),
  new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(coneCanvas), transparent: true, opacity: 0.62, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
 );
 spotlightCone.position.set(0, -16.2, 6.2); spotlightCone.rotation.x = 0.24; heli.add(spotlightCone);

 const poolCanvas = document.createElement('canvas'); poolCanvas.width = 128; poolCanvas.height = 128;
 const pCtx = poolCanvas.getContext('2d'), pGrad = pCtx.createRadialGradient(64, 64, 6, 64, 64, 62);
 pGrad.addColorStop(0, 'rgba(220,250,255,.55)'); pGrad.addColorStop(0.55, 'rgba(110,230,255,.24)'); pGrad.addColorStop(1, 'rgba(110,230,255,0)');
 pCtx.fillStyle = pGrad; pCtx.fillRect(0, 0, 128, 128);

 const groundPool = new THREE.Mesh(
  new THREE.PlaneGeometry(18, 18),
  new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(poolCanvas), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
 );
 groundPool.rotation.x = -Math.PI / 2; groundPool.position.set(110, 0.12, 36); scene.add(groundPool);
 heli.position.set(104, 24, 12); scene.add(heli);

 return {
  heli, spotlightCone, groundPool,
  update(dt, time) {
   const active = state.wanted.stars >= 3;
   heli.visible = groundPool.visible = active;
   if (!active) return;
   mainRotor.rotation.y += dt * 28; tailRotor.rotation.x += dt * 32;
   if (!state.activeShot) {
    const px = state.player.x, pz = state.player.z;
    heli.position.lerp(new THREE.Vector3(px + Math.sin(time * 0.65) * 14, 24, pz - 26 + Math.cos(time * 0.65) * 10), dt * 2.2);
    heli.lookAt(px, 10, pz); groundPool.position.set(px, 0.12, pz - 4);
   }
  },
 };
}
