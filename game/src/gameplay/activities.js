// Side Activities: 24 Golden Shell Collectibles, 5 Street Races & 10 Stunt Jumps
export const STREET_RACES = [
 ['race_1', 'Solana Sunset Sprint', 110, 95, 18000], ['race_2', 'Coral Marina Causeway Drift', 110, -310, 24000],
 ['race_3', 'Vidrio Midnight Circuit', -110, -110, 30000], ['race_4', 'Mercado Alley Dash', -220, 110, 22000],
 ['race_5', 'Palma Pier Coastal Mile', 220, 220, 35000],
].map(([id, name, x, z, prize]) => ({ id, name, x, z, prize }));

export function initSideActivities(scene, state, soundEngine) {
 const THREE = window.THREE, group = new THREE.Group(), shells = [];
 const shellMat = new THREE.MeshStandardMaterial({ color: 0xffcf40, emissive: 0x995500, roughness: .15, metalness: .9 });
 for (let i = 0; i < 24; i++) {
  const gx = -280 + (i % 6) * 95, gz = -320 + Math.floor(i / 6) * 195;
  const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(.95, 0), shellMat); mesh.position.set(gx, 1.35, gz); group.add(mesh);
  shells.push({ id: `shell_${i}`, x: gx, z: gz, collected: i < 18, mesh });
 }
 scene.add(group); state.entities.collectibles = shells;
 return {
  shells,
  update(dt, time) {
   const px = state.player.x, pz = state.player.z;
   for (let i = 0; i < shells.length; i++) {
    const s = shells[i];
    if (s.collected) { s.mesh.visible = false; continue; }
    s.mesh.visible = true; s.mesh.rotation.y = time * 2.6 + i; s.mesh.position.y = 1.35 + Math.sin(time * 3 + i) * .25;
    if (Math.hypot(s.x - px, s.z - pz) < 4.2) {
     s.collected = true; state.stats.shellsCollected = Math.min(24, state.stats.shellsCollected + 1);
     state.player.cash += 5000; state.player.respect += 250; soundEngine?.playChime(1040);
    }
   }
  },
 };
}
