// Animated pedestrians & syndicate enforcers with health bars + target chevrons
import { buildCharacterMesh } from './player.js';
import { ROAD_X } from '../world/roads.js';

export function initPedestriansAndEnemies(scene, state) {
 const THREE = window.THREE, pedestrians = [], enemies = [];
 const jCols = [0x00d8f0, 0xffbe3d, 0x38d864, 0xff6b35, 0xb978ff, 0xff4d79];

 for (let i = 0; i < 28; i++) {
  const mesh = buildCharacterMesh({ jacket: jCols[i % 6], shirt: 0xffffff, pants: 0x1d263b });
  if (mesh.userData.gunMesh) mesh.userData.gunMesh.visible = false;
  scene.add(mesh);
  const dir = i % 2 === 0 ? 1 : -1;
  pedestrians.push({ id: `ped_${i}`, x: ROAD_X[(i + 3) % ROAD_X.length] + dir * 15.5, y: 0, z: -220 + i * 16, rotY: dir === 1 ? 0 : Math.PI, speed: 2.2 + (i % 3) * .5, walkPhase: i * .7, fleeing: false, hp: 100, mesh });
 }

 const chevMat = new THREE.MeshBasicMaterial({ color: 0xff1744 }), bgMat = new THREE.MeshBasicMaterial({ color: 0x0b1324 }), fillMat = new THREE.MeshBasicMaterial({ color: 0xff3b5c });
 [[104, 18, 0, 0xff2a55, 'ENFORCER'], [116, 14, -.2, 0xff7e29, 'LIEUTENANT'], [101, 9, .25, 0x182844, 'ENFORCER'], [119, 6, -.3, 0xc82538, 'HEAVY GUARD'], [108, 3, 0, 0xff2a55, 'SYNDICATE'], [114, -2, -.15, 0x182844, 'CAPTAIN']].forEach(([x, z, rotY, jacket, role], i) => {
  const mesh = buildCharacterMesh({ jacket, shirt: 0xffbf3c, pants: 0x0e1422, visor: 0xff2a55 }), u = mesh.userData;
  u.rightArm.rotation.x = -Math.PI * .45; u.leftArm.rotation.x = -Math.PI * .35; u.leftLeg.rotation.x = .22; u.rightLeg.rotation.x = -.22;
  if (i % 2 === 1) u.muzzleFlash.visible = true;
  const cg = new THREE.Group(); cg.position.set(0, 2.32, 0);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(.22, .36, 4), chevMat); cone.rotation.x = Math.PI;
  const hpBg = new THREE.Mesh(new THREE.BoxGeometry(.76, .11, .05), bgMat); hpBg.position.y = .28;
  const hpFill = new THREE.Mesh(new THREE.BoxGeometry(.7, .075, .06), fillMat); hpFill.position.y = .28;
  cg.add(cone, hpBg, hpFill); mesh.add(cg); u.targetChevron = cg; u.hpFill = hpFill; scene.add(mesh);
  enemies.push({ id: `enemy_${i}`, role, x, y: 0, z, rotY, hp: 100, alive: true, downed: false, mesh });
 });

 state.entities.pedestrians = pedestrians; state.entities.enemies = enemies;
 return {
  pedestrians, enemies,
  update(dt) {
   for (const ped of pedestrians) {
    if (!state.activeShot) {
     ped.z += Math.cos(ped.rotY) * ped.speed * dt;
     if (ped.z > 340) ped.z = -340; if (ped.z < -340) ped.z = 340;
     ped.walkPhase += dt * 6;
    }
    const sw = Math.sin(ped.walkPhase) * .45, u = ped.mesh.userData;
    u.leftLeg.rotation.x = sw; u.rightLeg.rotation.x = -sw;
    if (ped.fleeing || state.wanted.stars >= 2) { u.leftArm.rotation.z = 2.45; u.rightArm.rotation.set(.15, 0, -2.45); }
    else { u.leftArm.rotation.z = 0; u.rightArm.rotation.z = 0; }
    ped.mesh.position.set(ped.x, ped.y, ped.z); ped.mesh.rotation.y = ped.rotY;
   }
   for (const en of enemies) {
    if (!en.alive && !en.downed) { en.mesh.visible = false; continue; }
    en.mesh.visible = true;
    const u = en.mesh.userData;
    if (u.targetChevron) { u.targetChevron.visible = !en.downed; u.targetChevron.rotation.y += dt * 2.5; }
    if (u.hpFill) u.hpFill.scale.x = Math.max(.1, Math.min(1, en.hp / 100));
    if (en.downed) { u.muzzleFlash.visible = false; en.mesh.position.set(en.x, .22, en.z); en.mesh.rotation.set(-Math.PI * .48, en.rotY, .25); continue; }
    if (!state.activeShot) en.rotY = Math.atan2(state.player.x - en.x, state.player.z - en.z);
    en.mesh.position.set(en.x, en.y, en.z); en.mesh.rotation.set(0, en.rotY, 0);
   }
  },
 };
}
