// Multi-lane sunset boulevards, crosswalks, causeway bridges, and glowing traffic signals
export const ROAD_X = [-330, -220, -110, 0, 110, 220];
export const ROAD_Z = [-440, -330, -220, -110, 0, 110, 220, 330, 440];

export function buildRoadNetwork(scene) {
  const THREE = window.THREE;
  const group = new THREE.Group();

  // Procedural asphalt + lane markings texture
  const roadCanvas = document.createElement('canvas');
  roadCanvas.width = 128;
  roadCanvas.height = 128;
  const rctx = roadCanvas.getContext('2d');
  rctx.fillStyle = '#1b1f2a';
  rctx.fillRect(0, 0, 128, 128);
  // Subtle wet road sheen strip
  rctx.fillStyle = '#252b3b';
  rctx.fillRect(18, 0, 92, 128);
  // Double yellow center line
  rctx.fillStyle = '#ffbf3c';
  rctx.fillRect(61, 0, 2, 128);
  rctx.fillRect(65, 0, 2, 128);
  // White dashed lane dividers
  rctx.fillStyle = 'rgba(230, 240, 255, 0.72)';
  for (let y = 8; y < 128; y += 32) {
    rctx.fillRect(32, y, 2, 16);
    rctx.fillRect(94, y, 2, 16);
  }
  // Neon pink/cyan curb strips
  rctx.fillStyle = '#00d8ff';
  rctx.fillRect(2, 0, 3, 128);
  rctx.fillStyle = '#ff4d79';
  rctx.fillRect(123, 0, 3, 128);

  const roadTex = new THREE.CanvasTexture(roadCanvas);
  roadTex.wrapS = THREE.RepeatWrapping;
  roadTex.wrapT = THREE.RepeatWrapping;
  roadTex.repeat.set(1, 45);

  const roadMatNS = new THREE.MeshStandardMaterial({
    map: roadTex,
    roughness: 0.32,
    metalness: 0.42,
  });

  // North-South Avenues (including x=110 Solana Strip & x=220 Oceanfront Drive)
  for (let i = 0; i < ROAD_X.length; i++) {
    const rx = ROAD_X[i];
    const geo = new THREE.PlaneGeometry(24, 1100);
    const mesh = new THREE.Mesh(geo, roadMatNS);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(rx, 0.04, 0);
    group.add(mesh);
  }

  // East-West Cross Boulevards
  const roadTexEW = roadTex.clone();
  roadTexEW.needsUpdate = true;
  roadTexEW.repeat.set(1, 30);
  const roadMatEW = new THREE.MeshStandardMaterial({
    map: roadTexEW,
    roughness: 0.34,
    metalness: 0.38,
  });

  for (let j = 0; j < ROAD_Z.length; j++) {
    const rz = ROAD_Z[j];
    const geo = new THREE.PlaneGeometry(22, 720);
    const mesh = new THREE.Mesh(geo, roadMatEW);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = Math.PI / 2;
    mesh.position.set(-45, 0.05, rz);
    group.add(mesh);
  }

  // Intersection plazas + crosswalk stripes + traffic light gantries
  const crossGeo = new THREE.BoxGeometry(24.5, 0.08, 24.5);
  const crossMat = new THREE.MeshStandardMaterial({ color: 0x232836, roughness: 0.28, metalness: 0.45 });
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x2c3548, metalness: 0.7, roughness: 0.3 });

  for (let i = 0; i < ROAD_X.length; i++) {
    for (let j = 0; j < ROAD_Z.length; j++) {
      const ix = ROAD_X[i];
      const iz = ROAD_Z[j];
      const pad = new THREE.Mesh(crossGeo, crossMat);
      pad.position.set(ix, 0.03, iz);
      group.add(pad);

      // Add traffic signal gantry at key avenues
      if ((i + j) % 2 === 0) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 6.8, 8), poleMat);
        pole.position.set(ix + 13, 3.4, iz + 13);
        group.add(pole);

        const arm = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.22, 0.22), poleMat);
        arm.position.set(ix + 9.8, 6.4, iz + 13);
        group.add(arm);

        const lightColor = (i + j) % 4 === 0 ? 0x00ff88 : 0xff3355;
        const lamp = new THREE.Mesh(
          new THREE.BoxGeometry(0.65, 1.3, 0.65),
          new THREE.MeshBasicMaterial({ color: lightColor })
        );
        lamp.position.set(ix + 7.5, 5.9, iz + 13);
        group.add(lamp);
      }
    }
  }

  // Coral Marina Elevated Causeway Bridge Arches (at z = -330)
  const archMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x005577, roughness: 0.2 });
  for (let k = -1; k <= 1; k++) {
    const arch = new THREE.Mesh(new THREE.TorusGeometry(14, 0.55, 10, 28, Math.PI), archMat);
    arch.position.set(110 + k * 24, 0.2, -330);
    arch.rotation.y = Math.PI / 2;
    group.add(arch);
  }

  scene.add(group);
  return { group };
}
