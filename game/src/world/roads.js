// Multi-lane sunset boulevards with wet sheen, crosswalks, causeway arches, and traffic signals
export const ROAD_X = [-330, -220, -110, 0, 110, 220];
export const ROAD_Z = [-440, -330, -220, -110, 0, 110, 220, 330, 440];

export function buildRoadNetwork(scene) {
  const THREE = window.THREE;
  const group = new THREE.Group();

  // Procedural wet-asphalt + lane markings + warm sunset specular sheen texture
  const roadCanvas = document.createElement('canvas');
  roadCanvas.width = 256;
  roadCanvas.height = 256;
  const rctx = roadCanvas.getContext('2d');
  rctx.fillStyle = '#191e2b';
  rctx.fillRect(0, 0, 256, 256);

  // Wet tire-track sunset sheen bands
  const wetGrad = rctx.createLinearGradient(0, 0, 256, 0);
  wetGrad.addColorStop(0.0, '#1a1f2d');
  wetGrad.addColorStop(0.28, '#282c42');
  wetGrad.addColorStop(0.5, '#1d2231');
  wetGrad.addColorStop(0.72, '#2d2942');
  wetGrad.addColorStop(1.0, '#1a1f2d');
  rctx.fillStyle = wetGrad;
  rctx.fillRect(16, 0, 224, 256);

  // Subtle wet puddle patches
  rctx.fillStyle = 'rgba(255, 130, 96, 0.08)';
  rctx.beginPath();
  rctx.ellipse(80, 96, 22, 46, 0, 0, Math.PI * 2);
  rctx.fill();
  rctx.fillStyle = 'rgba(0, 224, 255, 0.07)';
  rctx.beginPath();
  rctx.ellipse(178, 190, 24, 52, 0, 0, Math.PI * 2);
  rctx.fill();

  // Double gold center divider
  rctx.fillStyle = '#ffbf3c';
  rctx.fillRect(123, 0, 3, 256);
  rctx.fillRect(130, 0, 3, 256);

  // White dashed lane dividers
  rctx.fillStyle = 'rgba(235, 244, 255, 0.78)';
  for (let y = 12; y < 256; y += 64) {
    rctx.fillRect(66, y, 4, 30);
    rctx.fillRect(186, y, 4, 30);
  }

  // Crisp concrete edge + subtle neon coral/cyan gutter accent
  rctx.fillStyle = '#384359';
  rctx.fillRect(0, 0, 8, 256);
  rctx.fillRect(248, 0, 8, 256);
  rctx.fillStyle = '#00d8ff';
  rctx.fillRect(8, 0, 3, 256);
  rctx.fillStyle = '#ff4d79';
  rctx.fillRect(245, 0, 3, 256);

  const roadTex = new THREE.CanvasTexture(roadCanvas);
  roadTex.wrapS = THREE.RepeatWrapping;
  roadTex.wrapT = THREE.RepeatWrapping;
  roadTex.repeat.set(1, 44);

  const roadMatNS = new THREE.MeshStandardMaterial({
    map: roadTex,
    roughness: 0.9,
    metalness: 0.04,
  });

  // North-South Avenues (x=110 Solana Strip, x=220 Oceanfront Drive)
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
    roughness: 0.9,
    metalness: 0.04,
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

  // Intersection plazas + zebra crosswalks + traffic signal gantries
  const crossGeo = new THREE.BoxGeometry(24.5, 0.08, 24.5);
  const crossMat = new THREE.MeshStandardMaterial({ color: 0x222736, roughness: 0.9, metalness: 0.04 });
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x2c3548, metalness: 0.7, roughness: 0.3 });
  const stripeMat = new THREE.MeshBasicMaterial({ color: 0xdde8f8 });

  for (let i = 0; i < ROAD_X.length; i++) {
    for (let j = 0; j < ROAD_Z.length; j++) {
      const ix = ROAD_X[i];
      const iz = ROAD_Z[j];
      const pad = new THREE.Mesh(crossGeo, crossMat);
      pad.position.set(ix, 0.03, iz);
      group.add(pad);

      // Zebra crosswalk stripes on major boulevards
      if (ix >= 0) {
        for (let s = -8; s <= 8; s += 3.2) {
          const zbar = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 3.2), stripeMat);
          zbar.rotation.x = -Math.PI / 2;
          zbar.position.set(ix + s, 0.085, iz + 12.6);
          group.add(zbar);
        }
      }

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
