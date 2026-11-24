// Tactical TAC-9 Police Roadblocks, Glowing Barricades & Spike Strips
export function initPoliceRoadblocks(scene, state) {
 const THREE = window.THREE, group = new THREE.Group();
 const bMat = new THREE.MeshStandardMaterial({ color: 0xff5500, roughness: .4 }), sMat = new THREE.MeshBasicMaterial({ color: 0xffdf40 }), fMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });
 for (const [x, z] of [[101, -48], [119, -48]]) {
  const bar = new THREE.Group();
  const blk = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.15, .75), bMat); blk.position.y = .58;
  const str = new THREE.Mesh(new THREE.BoxGeometry(5.25, .28, .8), sMat); str.position.y = .75;
  const flr = new THREE.Mesh(new THREE.SphereGeometry(.24, 8, 8), fMat); flr.position.y = 1.32;
  bar.add(blk, str, flr); bar.position.set(x, 0, z); group.add(bar); state.entities.roadblocks.push({ x, z });
 }
 scene.add(group);
 return { group, update() { group.visible = state.wanted.stars >= 3; } };
}
