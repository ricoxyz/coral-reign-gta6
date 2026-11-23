// AIR-1 Tactical Police Helicopter with sculpted fuselage, spinning rotors & feathered volumetric spotlight cone
export function initPoliceHelicopter(scene, state) {
  const THREE = window.THREE;
  const heli = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x101a2e, roughness: 0.25, metalness: 0.78 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xf4f8ff, roughness: 0.3 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x00d8ff, emissive: 0x002d45, roughness: 0.1, metalness: 0.85 });
  const rotorMat = new THREE.MeshBasicMaterial({ color: 0x162030 });

  // Sculpted fuselage & cockpit canopy nose
  const fuselage = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.0, 5.8), bodyMat);
  heli.add(fuselage);

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.48, 0.38, 5.2), trimMat);
  stripe.position.y = -0.15;
  heli.add(stripe);

  const turbine = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.75, 2.8), bodyMat);
  turbine.position.set(0, 1.25, -0.3);
  heli.add(turbine);

  const cockpit = new THREE.Mesh(new THREE.SphereGeometry(1.25, 14, 12), glassMat);
  cockpit.scale.set(0.95, 0.85, 1.35);
  cockpit.position.set(0, -0.1, 2.35);
  heli.add(cockpit);

  // Tail boom, stabilizer fin & spinning tail rotor
  const tailBoom = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 5.8), bodyMat);
  tailBoom.position.set(0, 0.35, -5.2);
  heli.add(tailBoom);

  const tailFin = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.85, 1.2), trimMat);
  tailFin.position.set(0, 1.15, -7.8);
  heli.add(tailFin);

  const tailRotor = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.0, 0.22), rotorMat);
  tailRotor.position.set(0.32, 1.25, -7.8);
  heli.add(tailRotor);

  // Landing skids
  for (const sx of [-1.05, 1.05]) {
    const skid = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 5.4, 6), trimMat);
    skid.rotation.x = Math.PI / 2;
    skid.position.set(sx, -1.45, 0.4);
    heli.add(skid);
  }

  // Spinning main rotor + translucent motion-blur disc
  const mainRotor = new THREE.Group();
  mainRotor.position.set(0, 1.75, 0.1);
  const blade1 = new THREE.Mesh(new THREE.BoxGeometry(12.2, 0.07, 0.42), rotorMat);
  const blade2 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.07, 12.2), rotorMat);
  const blurDisc = new THREE.Mesh(
    new THREE.CircleGeometry(6.1, 28),
    new THREE.MeshBasicMaterial({ color: 0x99c8ff, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false })
  );
  blurDisc.rotation.x = -Math.PI / 2;
  mainRotor.add(blade1, blade2, blurDisc);
  heli.add(mainRotor);

  // Nose searchlight housing + red/blue beacons
  const lampHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.36, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  lampHead.position.set(0, -1.05, 2.4);
  heli.add(lampHead);

  const beaconRed = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff1744 }));
  beaconRed.position.set(-1.15, -0.85, 1.4);
  const beaconBlue = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00e5ff }));
  beaconBlue.position.set(1.15, -0.85, 1.4);
  heli.add(beaconRed, beaconBlue);

  // Soft 2D-feathered volumetric spotlight cone texture (smooth vertical + edge falloff, zero hard triangle edges)
  const coneCanvas = document.createElement('canvas');
  coneCanvas.width = 128;
  coneCanvas.height = 256;
  const cCtx = coneCanvas.getContext('2d');
  const img = cCtx.createImageData(128, 256);
  for (let y = 0; y < 256; y++) {
    const v = y / 255; // canvas y=0 maps to top apex (UV v=1), y=255 maps to wide base (UV v=0)
    const vertFade = 0.58 * (1 - v * 0.72);
    for (let x = 0; x < 128; x++) {
      const u = x / 127;
      const edge = Math.pow(Math.sin(u * Math.PI), 0.75);
      const alpha = Math.max(0, Math.min(255, Math.round(vertFade * edge * 210)));
      const idx = (y * 128 + x) * 4;
      img.data[idx] = 200;
      img.data[idx + 1] = 246;
      img.data[idx + 2] = 255;
      img.data[idx + 3] = alpha;
    }
  }
  cCtx.putImageData(img, 0, 0);

  const coneTex = new THREE.CanvasTexture(coneCanvas);
  const coneGeo = new THREE.ConeGeometry(8.5, 34, 32, 1, true);
  const coneMat = new THREE.MeshBasicMaterial({
    map: coneTex,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const spotlightCone = new THREE.Mesh(coneGeo, coneMat);
  spotlightCone.position.set(0, -16.2, 6.2);
  spotlightCone.rotation.x = 0.24;
  heli.add(spotlightCone);

  // Feathered radial ground searchlight pool
  const poolCanvas = document.createElement('canvas');
  poolCanvas.width = 128;
  poolCanvas.height = 128;
  const pCtx = poolCanvas.getContext('2d');
  const pGrad = pCtx.createRadialGradient(64, 64, 6, 64, 64, 62);
  pGrad.addColorStop(0.0, 'rgba(220, 250, 255, 0.55)');
  pGrad.addColorStop(0.55, 'rgba(110, 230, 255, 0.24)');
  pGrad.addColorStop(1.0, 'rgba(110, 230, 255, 0.0)');
  pCtx.fillStyle = pGrad;
  pCtx.fillRect(0, 0, 128, 128);

  const groundPool = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 18),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(poolCanvas),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  groundPool.rotation.x = -Math.PI / 2;
  groundPool.position.set(110, 0.12, 36);
  scene.add(groundPool);

  heli.position.set(104, 24, 12);
  scene.add(heli);

  return {
    heli,
    spotlightCone,
    groundPool,
    update(dt, time) {
      const active = state.wanted.stars >= 3;
      heli.visible = active;
      groundPool.visible = active;
      if (!active) return;

      mainRotor.rotation.y += dt * 28;
      tailRotor.rotation.x += dt * 32;
      const px = state.player.x;
      const pz = state.player.z;

      if (!state.activeShot) {
        const orbitX = px + Math.sin(time * 0.65) * 14;
        const orbitZ = pz - 26 + Math.cos(time * 0.65) * 10;
        heli.position.lerp(new THREE.Vector3(orbitX, 24, orbitZ), dt * 2.2);
        heli.lookAt(px, 10, pz);
        groundPool.position.set(px, 0.12, pz - 4);
      }
    },
  };
}
