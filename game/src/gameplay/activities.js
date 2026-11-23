// Side Activities: 24 Golden Shell Collectibles, 5 Street Races, and 10 Stunt Jumps
export const STREET_RACES = [
  { id: 'race_1', name: 'Solana Sunset Sprint', x: 110, z: 95, prize: 18000 },
  { id: 'race_2', name: 'Coral Marina Causeway Drift', x: 110, z: -310, prize: 24000 },
  { id: 'race_3', name: 'Vidrio Midnight Circuit', x: -110, z: -110, prize: 30000 },
  { id: 'race_4', name: 'Mercado Alley Dash', x: -220, z: 110, prize: 22000 },
  { id: 'race_5', name: 'Palma Pier Coastal Mile', x: 220, z: 220, prize: 35000 },
];

export function initSideActivities(scene, state, soundEngine) {
  const THREE = window.THREE;
  const group = new THREE.Group();
  const shells = [];

  const shellMat = new THREE.MeshStandardMaterial({
    color: 0xffcf40,
    emissive: 0x995500,
    roughness: 0.15,
    metalness: 0.9,
  });

  // Spawn 24 Rotating Golden Shell Collectibles across the 6 districts
  for (let i = 0; i < 24; i++) {
    const gx = -280 + (i % 6) * 95;
    const gz = -320 + Math.floor(i / 6) * 195;
    const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.95, 0), shellMat);
    mesh.position.set(gx, 1.35, gz);
    group.add(mesh);

    shells.push({
      id: `shell_${i}`,
      x: gx,
      z: gz,
      collected: i < 18, // 18/24 already collected in default syndicate career
      mesh,
    });
  }

  scene.add(group);
  state.entities.collectibles = shells;

  return {
    shells,
    update(dt, time) {
      const px = state.player.x;
      const pz = state.player.z;

      for (let i = 0; i < shells.length; i++) {
        const s = shells[i];
        if (s.collected) {
          s.mesh.visible = false;
          continue;
        }
        s.mesh.visible = true;
        s.mesh.rotation.y = time * 2.6 + i;
        s.mesh.position.y = 1.35 + Math.sin(time * 3 + i) * 0.25;

        if (Math.hypot(s.x - px, s.z - pz) < 4.2) {
          s.collected = true;
          state.stats.shellsCollected = Math.min(24, state.stats.shellsCollected + 1);
          state.player.cash += 5000;
          state.player.respect += 250;
          if (soundEngine) soundEngine.playChime(1040);
        }
      }
    },
  };
}
