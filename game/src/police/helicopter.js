// AIR-1 Tactical Police Helicopter with spinning rotor blades & volumetric spotlight cone
export function initPoliceHelicopter(scene, state) {
  const THREE = window.THREE;
  const heli = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0f1829, roughness: 0.25, metalness: 0.75 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x00d8ff, emissive: 0x002438, roughness: 0.1 });
  const rotorMat = new THREE.MeshBasicMaterial({ color: 0x1a2232 });

  // Sculpted fuselage & cockpit nose
  const fuselage = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 6.2), bodyMat);
  heli.add(fuselage);

  const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.68, 0.45, 5.6), trimMat);
  heli.add(stripe);

  const cockpit = new THREE.Mesh(new THREE.SphereGeometry(1.35, 12, 10), glassMat);
  cockpit.position.set(0, -0.1, 2.5);
  heli.add(cockpit);

  // Tail boom & vertical stabilizer fin
  const tailBoom = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.75, 5.8), bodyMat);
  tailBoom.position.set(0, 0.3, -5.4);
  heli.add(tailBoom);

  const tailFin = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.8, 1.2), trimMat);
  tailFin.position.set(0, 1.1, -8.0);
  heli.add(tailFin);

  // Landing skids
  for (const sx of [-1.1, 1.1]) {
    const skid = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 5.2, 6), trimMat);
    skid.rotation.x = Math.PI / 2;
    skid.position.set(sx, -1.45, 0.4);
    heli.add(skid);
  }

  // Spinning main rotor assembly
  const mainRotor = new THREE.Group();
  mainRotor.position.set(0, 1.35, 0.3);
  const blade1 = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.08, 0.45), rotorMat);
  const blade2 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 11.5), rotorMat);
  mainRotor.add(blade1, blade2);
  heli.add(mainRotor);

  // Red/Blue helicopter beacon strobes
  const beaconRed = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xff1744 })
  );
  beaconRed.position.set(-1.2, -1.0, 1.5);
  const beaconBlue = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x00e5ff })
  );
  beaconBlue.position.set(1.2, -1.0, 1.5);
  heli.add(beaconRed, beaconBlue);

  // Translucent Volumetric Searchlight Cone sweeping down onto the boulevard
  const coneGeo = new THREE.ConeGeometry(8.5, 34, 20, 1, true);
  const coneMat = new THREE.MeshBasicMaterial({
    color: 0xdff8ff,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const spotlightCone = new THREE.Mesh(coneGeo, coneMat);
  spotlightCone.position.set(0, -17.5, 4.5);
  spotlightCone.rotation.x = 0.26;
  heli.add(spotlightCone);

  // Ground searchlight pool ring
  const poolGeo = new THREE.CircleGeometry(7.2, 24);
  const poolMat = new THREE.MeshBasicMaterial({
    color: 0xd8f8ff,
    transparent: true,
    opacity: 0.26,
    depthWrite: false,
  });
  const groundPool = new THREE.Mesh(poolGeo, poolMat);
  groundPool.rotation.x = -Math.PI / 2;
  groundPool.position.set(110, 0.09, 32);
  scene.add(groundPool);

  heli.position.set(104, 27, 10);
  scene.add(heli);

  return {
    heli,
    groundPool,
    update(dt, time) {
      const active = state.wanted.stars >= 3;
      heli.visible = active;
      groundPool.visible = active;
      if (!active) return;

      mainRotor.rotation.y += dt * 28;
      const px = state.player.x;
      const pz = state.player.z;

      if (!state.activeShot) {
        const orbitX = px + Math.sin(time * 0.65) * 14;
        const orbitZ = pz - 26 + Math.cos(time * 0.65) * 10;
        heli.position.lerp(new THREE.Vector3(orbitX, 27, orbitZ), dt * 2.2);
        heli.lookAt(px, 12, pz);
      }
      groundPool.position.set(px, 0.09, pz - 4);
    },
  };
}
