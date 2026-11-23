// Tactical TAC-9 Police Roadblocks, Glowing Barricades, and Spike Strips
export function initPoliceRoadblocks(scene, state) {
  const THREE = window.THREE;
  const group = new THREE.Group();

  const barrierMat = new THREE.MeshStandardMaterial({ color: 0xff5500, roughness: 0.4 });
  const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffdf40 });
  const flareMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });

  // Place tactical barricade checkpoint at z = -48 on Solana Strip
  const barricadePositions = [
    { x: 101, z: -48 },
    { x: 119, z: -48 },
  ];

  for (let i = 0; i < barricadePositions.length; i++) {
    const bp = barricadePositions[i];
    const bar = new THREE.Group();
    const block = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.15, 0.75), barrierMat);
    block.position.y = 0.58;
    bar.add(block);

    const stripe = new THREE.Mesh(new THREE.BoxGeometry(5.25, 0.28, 0.8), stripeMat);
    stripe.position.y = 0.75;
    bar.add(stripe);

    const flare = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), flareMat);
    flare.position.set(0, 1.32, 0);
    bar.add(flare);

    bar.position.set(bp.x, 0, bp.z);
    group.add(bar);
    state.entities.roadblocks.push({ x: bp.x, z: bp.z });
  }

  scene.add(group);
  return {
    group,
    update(time) {
      group.visible = state.wanted.stars >= 3;
    },
  };
}
