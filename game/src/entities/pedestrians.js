// Animated pedestrians strolling Palma Dorada sidewalks & syndicate enforcers with 3D health bars + red target chevrons
import { buildCharacterMesh } from './player.js';
import { ROAD_X } from '../world/roads.js';

export function initPedestriansAndEnemies(scene, state) {
 const THREE = window.THREE;
 const pedestrians = [], enemies = [];
 const jacketColors = [0x00d8f0, 0xffbe3d, 0x38d864, 0xff6b35, 0xb978ff, 0xff4d79];

 for (let i = 0; i < 28; i++) {
  const mesh = buildCharacterMesh({ jacket: jacketColors[i % 6], shirt: 0xffffff, pants: 0x1d263b });
  if (mesh.userData.gunMesh) mesh.userData.gunMesh.visible = false;
  scene.add(mesh);
  const dir = i % 2 === 0 ? 1 : -1;
  pedestrians.push({
   id: `ped_${i}`, x: ROAD_X[(i + 3) % ROAD_X.length] + dir * 15.5, y: 0, z: -220 + i * 16,
   rotY: dir === 1 ? 0 : Math.PI, speed: 2.2 + (i % 3) * 0.5, walkPhase: i * 0.7, fleeing: false, hp: 100, mesh,
  });
 }

 const enemyConfigs = [
  [104, 18, 0, 0xff2a55, 'ENFORCER'], [116, 14, -0.2, 0xff7e29, 'LIEUTENANT'],
  [101, 9, 0.25, 0x182844, 'ENFORCER'], [119, 6, -0.3, 0xc82538, 'HEAVY GUARD'],
  [108, 3, 0, 0xff2a55, 'SYNDICATE'], [114, -2, -0.15, 0x182844, 'CAPTAIN'],
 ];
 const chevronMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });
 const hpBgMat = new THREE.MeshBasicMaterial({ color: 0x0b1324 });
 const hpFillMat = new THREE.MeshBasicMaterial({ color: 0xff3b5c });

 enemyConfigs.forEach(([x, z, rotY, jacket, role], i) => {
  const mesh = buildCharacterMesh({ jacket, shirt: 0xffbf3c, pants: 0x0e1422, visor: 0xff2a55 });
  mesh.userData.rightArm.rotation.x = -Math.PI * 0.45;
  mesh.userData.leftArm.rotation.x = -Math.PI * 0.35;
  mesh.userData.leftLeg.rotation.x = 0.22; mesh.userData.rightLeg.rotation.x = -0.22;
  if (i % 2 === 1) mesh.userData.muzzleFlash.visible = true;

  const chevronGroup = new THREE.Group(); chevronGroup.position.set(0, 2.32, 0);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.36, 4), chevronMat); cone.rotation.x = Math.PI;
  const hpBg = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.11, 0.05), hpBgMat); hpBg.position.y = 0.28;
  const hpFill = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.075, 0.06), hpFillMat); hpFill.position.y = 0.28;
  chevronGroup.add(cone, hpBg, hpFill);
  mesh.add(chevronGroup);
  mesh.userData.targetChevron = chevronGroup; mesh.userData.hpFill = hpFill;
  scene.add(mesh);
  enemies.push({ id: `enemy_${i}`, role, x, y: 0, z, rotY, hp: 100, alive: true, downed: false, mesh });
 });

 state.entities.pedestrians = pedestrians;
 state.entities.enemies = enemies;

 return {
  pedestrians, enemies,
  update(dt) {
   for (const ped of pedestrians) {
    if (!state.activeShot) {
     ped.z += Math.cos(ped.rotY) * ped.speed * dt;
     if (ped.z > 340) ped.z = -340;
     if (ped.z < -340) ped.z = 340;
     ped.walkPhase += dt * 6;
    }
    const sw = Math.sin(ped.walkPhase) * 0.45;
    ped.mesh.userData.leftLeg.rotation.x = sw; ped.mesh.userData.rightLeg.rotation.x = -sw;
    if (ped.fleeing || state.wanted.stars >= 2) {
     ped.mesh.userData.leftArm.rotation.z = 2.45; ped.mesh.userData.rightArm.rotation.set(0.15, 0, -2.45);
    } else {
     ped.mesh.userData.leftArm.rotation.z = 0; ped.mesh.userData.rightArm.rotation.z = 0;
    }
    ped.mesh.position.set(ped.x, ped.y, ped.z); ped.mesh.rotation.y = ped.rotY;
   }

   for (const en of enemies) {
    if (!en.alive && !en.downed) { en.mesh.visible = false; continue; }
    en.mesh.visible = true;
    if (en.mesh.userData.targetChevron) {
     en.mesh.userData.targetChevron.visible = !en.downed;
     en.mesh.userData.targetChevron.rotation.y += dt * 2.5;
    }
    if (en.mesh.userData.hpFill) en.mesh.userData.hpFill.scale.x = Math.max(0.1, Math.min(1, en.hp / 100));
    if (en.downed) {
     en.mesh.userData.muzzleFlash.visible = false;
     en.mesh.position.set(en.x, 0.22, en.z);
     en.mesh.rotation.set(-Math.PI * 0.48, en.rotY, 0.25);
     continue;
    }
    if (!state.activeShot) en.rotY = Math.atan2(state.player.x - en.x, state.player.z - en.z);
    en.mesh.position.set(en.x, en.y, en.z);
    en.mesh.rotation.set(0, en.rotY, 0);
   }
  },
 };
}
