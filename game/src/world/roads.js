// Multi-lane sunset boulevards with wet sheen, crosswalks, causeway arches, and traffic signals
export const ROAD_X = [-330, -220, -110, 0, 110, 220];
export const ROAD_Z = [-440, -330, -220, -110, 0, 110, 220, 330, 440];

export function buildRoadNetwork(scene) {
 const THREE = window.THREE;
 const group = new THREE.Group();

 const roadCanvas = document.createElement('canvas');
 roadCanvas.width = 256; roadCanvas.height = 256;
 const rctx = roadCanvas.getContext('2d');
 rctx.fillStyle = '#252b38'; rctx.fillRect(0, 0, 256, 256);

 const wetGrad = rctx.createLinearGradient(0, 0, 256, 0);
 [[0, '#272d3b'], [0.28, '#32394a'], [0.5, '#29303f'], [0.72, '#343a4d'], [1, '#272d3b']].forEach(([s, c]) => wetGrad.addColorStop(s, c));
 rctx.fillStyle = wetGrad; rctx.fillRect(16, 0, 224, 256);

 rctx.fillStyle = '#ffd042';
 rctx.fillRect(122, 0, 4, 256); rctx.fillRect(130, 0, 4, 256);
 rctx.fillStyle = 'rgba(255,255,255,.92)';
 for (let y = 12; y < 256; y += 64) { rctx.fillRect(66, y, 5, 32); rctx.fillRect(185, y, 5, 32); }

 rctx.fillStyle = '#e8dcc8'; rctx.fillRect(0, 0, 9, 256); rctx.fillRect(247, 0, 9, 256);
 rctx.fillStyle = '#00e5ff'; rctx.fillRect(9, 0, 3, 256);
 rctx.fillStyle = '#ff5e7e'; rctx.fillRect(244, 0, 3, 256);

 const roadTex = new THREE.CanvasTexture(roadCanvas);
 roadTex.wrapS = roadTex.wrapT = THREE.RepeatWrapping;
 roadTex.repeat.set(1, 44);
 const roadMatNS = new THREE.MeshStandardMaterial({ map: roadTex, roughness: 0.9, metalness: 0.04 });

 for (const rx of ROAD_X) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(24, 1100), roadMatNS);
  mesh.rotation.x = -Math.PI / 2; mesh.position.set(rx, 0.04, 0);
  group.add(mesh);
 }

 const roadTexEW = roadTex.clone();
 roadTexEW.needsUpdate = true;
 roadTexEW.repeat.set(1, 30);
 const roadMatEW = new THREE.MeshStandardMaterial({ map: roadTexEW, roughness: 0.9, metalness: 0.04 });

 for (const rz of ROAD_Z) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(22, 720), roadMatEW);
  mesh.rotation.set(-Math.PI / 2, 0, Math.PI / 2); mesh.position.set(-45, 0.05, rz);
  group.add(mesh);
 }

 const crossGeo = new THREE.BoxGeometry(24.5, 0.08, 24.5);
 const crossMat = new THREE.MeshStandardMaterial({ color: 0x2c3342, roughness: 0.85, metalness: 0.04 });
 const poleMat = new THREE.MeshStandardMaterial({ color: 0x4a5568, metalness: 0.6, roughness: 0.3 });
 const stripeMat = new THREE.MeshBasicMaterial({ color: 0xf8fbff });

 ROAD_X.forEach((ix, i) => {
  ROAD_Z.forEach((iz, j) => {
   const pad = new THREE.Mesh(crossGeo, crossMat);
   pad.position.set(ix, 0.03, iz); group.add(pad);

   if (ix >= 0) {
    for (let s = -8; s <= 8; s += 3.2) {
     const zbar = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 3.2), stripeMat);
     zbar.rotation.x = -Math.PI / 2; zbar.position.set(ix + s, 0.085, iz + 12.6);
     group.add(zbar);
    }
   }

   if ((i + j) % 2 === 0) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 6.8, 8), poleMat);
    pole.position.set(ix + 13, 3.4, iz + 13);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.22, 0.22), poleMat);
    arm.position.set(ix + 9.8, 6.4, iz + 13);
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.3, 0.65), new THREE.MeshBasicMaterial({ color: (i + j) % 4 === 0 ? 0x00ff88 : 0xff3355 }));
    lamp.position.set(ix + 7.5, 5.9, iz + 13);
    group.add(pole, arm, lamp);
   }
  });
 });

 const archMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x005577, roughness: 0.2 });
 for (let k = -1; k <= 1; k++) {
  const arch = new THREE.Mesh(new THREE.TorusGeometry(14, 0.55, 10, 28, Math.PI), archMat);
  arch.position.set(110 + k * 24, 0.2, -330); arch.rotation.y = Math.PI / 2;
  group.add(arch);
 }

 scene.add(group);
 return { group };
}
