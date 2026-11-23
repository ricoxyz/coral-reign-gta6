// AIR-1 Tactical Police Helicopter with sculpted white-and-navy fuselage, tinted canopy, landing skids & feathered volumetric spotlight beam
export function initPoliceHelicopter(scene, state) {
 const THREE = window.THREE;
 const heli = new THREE.Group();
 const navyMat = new THREE.MeshStandardMaterial({ color: 0x102548, roughness: 0.24, metalness: 0.72 });
 const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf4f8ff, roughness: 0.26, metalness: 0.22 });
 const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a2232, roughness: 0.36, metalness: 0.65 });
 const accentMat = new THREE.MeshBasicMaterial({ color: 0x00d8ff });
 const glassMat = new THREE.MeshStandardMaterial({ color: 0x0a1e34, emissive: 0x041526, roughness: 0.08, metalness: 0.9, transparent: true, opacity: 0.88 });
 const rotorMat = new THREE.MeshStandardMaterial({ color: 0x161d2b, roughness: 0.35, metalness: 0.6 });

 const addPart = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) => {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  if (rx) m.rotation.x = rx;
  if (ry) m.rotation.y = ry;
  if (rz) m.rotation.z = rz;
  heli.add(m);
  return m;
 };

 // Sculpted white lower fuselage & navy upper hull using side-profile ExtrudeGeometry
 const hullShape = new THREE.Shape();
 hullShape.moveTo(-2.7, -0.55);
 hullShape.lineTo(1.6, -0.62);
 hullShape.lineTo(3.15, -0.32);
 hullShape.lineTo(3.25, 0.05);
 hullShape.lineTo(2.05, 0.88);
 hullShape.lineTo(0.45, 1.18);
 hullShape.lineTo(-1.85, 1.05);
 hullShape.lineTo(-2.85, 0.42);
 hullShape.closePath();
 const hullGeo = new THREE.ExtrudeGeometry(hullShape, { depth: 1.96, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.12, bevelSegments: 2 });
 hullGeo.rotateY(-Math.PI / 2);
 hullGeo.translate(0.98, 0, 0);
 heli.add(new THREE.Mesh(hullGeo, whiteMat));

 // Crisp navy upper livery shell & cheatline stripe
 const upperShape = new THREE.Shape();
 upperShape.moveTo(-2.72, 0.05);
 upperShape.lineTo(2.55, 0.05);
 upperShape.lineTo(1.98, 0.9);
 upperShape.lineTo(0.45, 1.2);
 upperShape.lineTo(-1.85, 1.07);
 upperShape.lineTo(-2.82, 0.45);
 upperShape.closePath();
 const upperGeo = new THREE.ExtrudeGeometry(upperShape, { depth: 2.02, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.08, bevelSegments: 2 });
 upperGeo.rotateY(-Math.PI / 2);
 upperGeo.translate(1.01, 0, 0);
 heli.add(new THREE.Mesh(upperGeo, navyMat));
 addPart(new THREE.BoxGeometry(2.26, 0.12, 4.9), accentMat, 0, 0.06, 0.1);

 // Tinted glass cockpit canopy fairing
 const canopyShape = new THREE.Shape();
 canopyShape.moveTo(0.95, 0.08);
 canopyShape.lineTo(3.18, -0.06);
 canopyShape.lineTo(2.1, 0.88);
 canopyShape.lineTo(0.95, 0.96);
 canopyShape.closePath();
 const canopyGeo = new THREE.ExtrudeGeometry(canopyShape, { depth: 1.72, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.07, bevelSegments: 2 });
 canopyGeo.rotateY(-Math.PI / 2);
 canopyGeo.translate(0.86, 0, 0);
 heli.add(new THREE.Mesh(canopyGeo, glassMat));

 // Dorsal turbine cowling & dual exhaust pods
 addPart(new THREE.BoxGeometry(1.36, 0.54, 2.5), navyMat, 0, 1.38, -0.35);
 for (const ex of [-0.42, 0.42]) {
  addPart(new THREE.CylinderGeometry(0.18, 0.22, 0.72, 10), darkMat, ex, 1.4, -1.65, Math.PI / 2);
 }

 // Tapered tail boom, horizontal stabilizer & vertical swept fin
 addPart(new THREE.CylinderGeometry(0.24, 0.44, 5.6, 10), whiteMat, 0, 0.48, -5.1, Math.PI / 2);
 addPart(new THREE.BoxGeometry(2.55, 0.1, 0.68), navyMat, 0, 0.56, -6.9);
 addPart(new THREE.BoxGeometry(0.16, 1.85, 1.05), navyMat, 0, 1.18, -7.75, -0.28);
 addPart(new THREE.BoxGeometry(0.18, 0.34, 1.08), whiteMat, 0, 1.82, -7.95, -0.28);

 // Shrouded tail rotor
 addPart(new THREE.TorusGeometry(0.72, 0.09, 8, 20), whiteMat, 0.18, 1.25, -7.85, 0, Math.PI / 2);
 const tailRotor = new THREE.Group();
 tailRotor.position.set(0.22, 1.25, -7.85);
 tailRotor.add(new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.3, 0.16), rotorMat));
 tailRotor.add(new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, 1.3), rotorMat));
 heli.add(tailRotor);

 // Twin tubular landing skids with curved front toes & 4 angled support struts
 for (const sx of [-1.06, 1.06]) {
  addPart(new THREE.CylinderGeometry(0.065, 0.065, 4.9, 8), whiteMat, sx, -1.35, 0.35, Math.PI / 2);
  addPart(new THREE.CylinderGeometry(0.06, 0.065, 0.78, 8), whiteMat, sx, -1.18, 3.05, Math.PI / 2 - 0.55);
  for (const sz of [-1.15, 1.45]) {
   addPart(new THREE.CylinderGeometry(0.05, 0.055, 0.96, 8), darkMat, sx * 0.84, -0.94, sz, 0, 0, sx > 0 ? -0.34 : 0.34);
  }
 }

 // Rotor mast, 4 blades & semi-transparent spinning rotor disc
 addPart(new THREE.CylinderGeometry(0.2, 0.24, 0.45, 10), darkMat, 0, 1.72, 0.1);
 const mainRotor = new THREE.Group();
 mainRotor.position.set(0, 1.94, 0.1);
 const discCanvas = document.createElement('canvas'); discCanvas.width = 128; discCanvas.height = 128;
 const dCtx = discCanvas.getContext('2d'), dGrad = dCtx.createRadialGradient(64, 64, 6, 64, 64, 62);
 dGrad.addColorStop(0, 'rgba(180,220,255,0.28)');
 dGrad.addColorStop(0.65, 'rgba(150,205,255,0.18)');
 dGrad.addColorStop(0.92, 'rgba(200,235,255,0.24)');
 dGrad.addColorStop(1, 'rgba(180,220,255,0)');
 dCtx.fillStyle = dGrad; dCtx.fillRect(0, 0, 128, 128);
 const blurDisc = new THREE.Mesh(
  new THREE.CircleGeometry(6.0, 32),
  new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(discCanvas), transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false })
 );
 blurDisc.rotation.x = -Math.PI / 2;
 mainRotor.add(
  new THREE.Mesh(new THREE.BoxGeometry(11.8, 0.05, 0.32), rotorMat),
  new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.05, 11.8), rotorMat),
  blurDisc
 );
 heli.add(mainRotor);

 // Nose searchlight gimbal & navigation strobes
 addPart(new THREE.SphereGeometry(0.28, 10, 10), darkMat, 0, -0.82, 2.25);
 addPart(new THREE.SphereGeometry(0.2, 10, 10), new THREE.MeshBasicMaterial({ color: 0xeaffff }), 0, -0.94, 2.38);
 addPart(new THREE.SphereGeometry(0.14, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff1744 }), -1.12, -0.45, 0.8);
 addPart(new THREE.SphereGeometry(0.14, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00e5ff }), 1.12, -0.45, 0.8);

 // Feathered low-opacity additive volumetric spotlight beam (world-space so it hits the asphalt pool cleanly)
 const coneCanvas = document.createElement('canvas'); coneCanvas.width = 128; coneCanvas.height = 128;
 const cCtx = coneCanvas.getContext('2d');
 const vGrad = cCtx.createLinearGradient(0, 0, 0, 128);
 vGrad.addColorStop(0, 'rgba(235,252,255,1)');
 vGrad.addColorStop(0.55, 'rgba(195,244,255,0.88)');
 vGrad.addColorStop(0.88, 'rgba(145,228,255,0.52)');
 vGrad.addColorStop(1, 'rgba(110,210,255,0)');
 cCtx.fillStyle = vGrad; cCtx.fillRect(0, 0, 128, 128);
 cCtx.globalCompositeOperation = 'destination-in';
 const hGrad = cCtx.createLinearGradient(0, 0, 128, 0);
 hGrad.addColorStop(0, 'rgba(255,255,255,0.45)');
 hGrad.addColorStop(0.3, 'rgba(255,255,255,1)');
 hGrad.addColorStop(0.7, 'rgba(255,255,255,1)');
 hGrad.addColorStop(1, 'rgba(255,255,255,0.45)');
 cCtx.fillStyle = hGrad; cCtx.fillRect(0, 0, 128, 128);

 const coneTex = new THREE.CanvasTexture(coneCanvas);
 const coneGeo = new THREE.CylinderGeometry(0.34, 5.4, 1, 28, 1, true);
 coneGeo.translate(0, -0.5, 0);
 coneGeo.rotateX(Math.PI / 2);
 const spotlightCone = new THREE.Mesh(
  coneGeo,
  new THREE.MeshBasicMaterial({ map: coneTex, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
 );
 const innerGeo = new THREE.CylinderGeometry(0.18, 2.7, 1, 20, 1, true);
 innerGeo.translate(0, -0.5, 0);
 innerGeo.rotateX(Math.PI / 2);
 spotlightCone.add(new THREE.Mesh(
  innerGeo,
  new THREE.MeshBasicMaterial({ map: coneTex, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
 ));
 scene.add(spotlightCone);

 const poolCanvas = document.createElement('canvas'); poolCanvas.width = 128; poolCanvas.height = 128;
 const pCtx = poolCanvas.getContext('2d'), pGrad = pCtx.createRadialGradient(64, 64, 4, 64, 64, 62);
 pGrad.addColorStop(0, 'rgba(235,252,255,0.48)');
 pGrad.addColorStop(0.42, 'rgba(145,232,255,0.24)');
 pGrad.addColorStop(0.78, 'rgba(100,210,255,0.08)');
 pGrad.addColorStop(1, 'rgba(100,210,255,0)');
 pCtx.fillStyle = pGrad; pCtx.fillRect(0, 0, 128, 128);

 const groundPool = new THREE.Mesh(
  new THREE.PlaneGeometry(16, 16),
  new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(poolCanvas), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
 );
 groundPool.rotation.x = -Math.PI / 2; groundPool.position.set(110, 0.12, 36); scene.add(groundPool);
 heli.position.set(104, 24, 12); scene.add(heli);

 function alignSpotlightToPool() {
  const gimbalLocal = new THREE.Vector3(0, -0.94, 2.38);
  heli.updateMatrixWorld(true);
  const origin = gimbalLocal.applyMatrix4(heli.matrixWorld);
  const target = new THREE.Vector3(groundPool.position.x, 0.12, groundPool.position.z);
  const dist = Math.max(4, origin.distanceTo(target));
  spotlightCone.position.copy(origin);
  spotlightCone.scale.set(1, 1, dist);
  spotlightCone.lookAt(target);
 }
 alignSpotlightToPool();

 return {
  heli, spotlightCone, groundPool, alignSpotlightToPool,
  update(dt, time) {
   const active = state.wanted.stars >= 3;
   heli.visible = spotlightCone.visible = groundPool.visible = active;
   if (!active) return;
   mainRotor.rotation.y += dt * 28; tailRotor.rotation.x += dt * 32;
   if (!state.activeShot) {
    const px = state.player.x, pz = state.player.z;
    heli.position.lerp(new THREE.Vector3(px + Math.sin(time * 0.65) * 14, 24, pz - 26 + Math.cos(time * 0.65) * 10), dt * 2.2);
    heli.lookAt(px, 10, pz);
    groundPool.position.set(px, 0.12, pz - 4);
   }
   alignSpotlightToPool();
  },
 };
}
