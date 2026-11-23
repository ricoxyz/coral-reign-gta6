// Animated pedestrians strolling Palma Dorada sidewalks & syndicate enemies
import { buildCharacterMesh } from './player.js';
import { ROAD_X } from '../world/roads.js';

export function initPedestriansAndEnemies(scene, state) {
  const THREE = window.THREE;
  const pedestrians = [];
  const enemies = [];

  const jacketColors = [0x00d8f0, 0xffbe3d, 0x38d864, 0xff6b35, 0xb978ff, 0xff4d79];

  // 28 Sidewalk Pedestrians across Solana Strip, Oceanfront & Downtown
  for (let i = 0; i < 28; i++) {
    const mesh = buildCharacterMesh({
      jacket: jacketColors[i % jacketColors.length],
      shirt: 0xffffff,
      pants: 0x1d263b,
    });
    // Hide gun on peaceful pedestrians
    if (mesh.userData.gunMesh) mesh.userData.gunMesh.visible = false;
    scene.add(mesh);

    const avenue = ROAD_X[(i + 3) % ROAD_X.length];
    const side = i % 2 === 0 ? 15.5 : -15.5;
    const z = -220 + i * 16;
    const dir = i % 2 === 0 ? 1 : -1;

    pedestrians.push({
      id: `ped_${i}`,
      x: avenue + side,
      y: 0,
      z,
      rotY: dir === 1 ? 0 : Math.PI,
      speed: 2.2 + (i % 3) * 0.5,
      walkPhase: i * 0.7,
      fleeing: false,
      hp: 100,
      mesh,
    });
  }

  // 6 Rival Cartel & Tactical Combatants for On-Foot Crossfire with Red Tactical Target Chevrons
  const enemyConfigs = [
    { x: 104, z: 18, rotY: 0, jacket: 0xff2a55, role: 'CARTEL ENFORCER' },
    { x: 116, z: 14, rotY: -0.2, jacket: 0xff7e29, role: 'BULLION GUARD' },
    { x: 101, z: 9, rotY: 0.25, jacket: 0x14223b, role: 'PALMA SWAT' },
    { x: 119, z: 6, rotY: -0.3, jacket: 0x14223b, role: 'PALMA SWAT' },
    { x: 108, z: 3, rotY: 0, jacket: 0xff2a55, role: 'SYNDICATE HEAVY' },
    { x: 114, z: -2, rotY: -0.15, jacket: 0x14223b, role: 'TACTICAL LEAD' },
  ];

  const chevronMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });
  const chevronBorderMat = new THREE.MeshBasicMaterial({ color: 0xffe066 });

  for (let i = 0; i < enemyConfigs.length; i++) {
    const ec = enemyConfigs[i];
    const mesh = buildCharacterMesh({
      jacket: ec.jacket,
      shirt: 0xffbf3c,
      pants: 0x0e1422,
      visor: 0xff2a55,
    });
    mesh.userData.rightArm.rotation.x = -Math.PI * 0.46;

    // Floating Red Tactical Target Chevron above hostile enforcer head
    const chevronGroup = new THREE.Group();
    chevronGroup.position.set(0, 2.28, 0);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.38, 4), chevronMat);
    cone.rotation.x = Math.PI;
    chevronGroup.add(cone);
    const ring = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.06, 0.08), chevronBorderMat);
    ring.position.y = 0.20;
    chevronGroup.add(ring);
    mesh.add(chevronGroup);
    mesh.userData.targetChevron = chevronGroup;

    scene.add(mesh);

    enemies.push({
      id: `enemy_${i}`,
      role: ec.role,
      x: ec.x,
      y: 0,
      z: ec.z,
      rotY: ec.rotY,
      hp: 100,
      alive: true,
      downed: false,
      mesh,
    });
  }

  state.entities.pedestrians = pedestrians;
  state.entities.enemies = enemies;

  return {
    pedestrians,
    enemies,
    update(dt) {
      for (let i = 0; i < pedestrians.length; i++) {
        const ped = pedestrians[i];
        if (!state.activeShot) {
          ped.z += Math.cos(ped.rotY) * ped.speed * dt;
          if (ped.z > 340) ped.z = -340;
          if (ped.z < -340) ped.z = 340;
          ped.walkPhase += dt * 6;
        }
        const swing = Math.sin(ped.walkPhase) * 0.45;
        ped.mesh.userData.leftLeg.rotation.x = swing;
        ped.mesh.userData.rightLeg.rotation.x = -swing;
        if (ped.fleeing || state.wanted.stars >= 2) {
          // Fleeing pedestrians raise both arms in panic!
          ped.mesh.userData.leftArm.rotation.z = 2.55;
          ped.mesh.userData.leftArm.position.y = 1.48;
          ped.mesh.userData.rightArm.rotation.z = -2.55;
          ped.mesh.userData.rightArm.rotation.x = 0.2;
        } else {
          ped.mesh.userData.leftArm.rotation.z = 0;
          ped.mesh.userData.leftArm.position.y = 1.16;
          ped.mesh.userData.rightArm.rotation.z = 0;
        }
        ped.mesh.position.set(ped.x, ped.y, ped.z);
        ped.mesh.rotation.y = ped.rotY;
      }

      for (let i = 0; i < enemies.length; i++) {
        const en = enemies[i];
        if (!en.alive && !en.downed) {
          en.mesh.visible = false;
          continue;
        }
        en.mesh.visible = true;
        if (en.mesh.userData.targetChevron) {
          en.mesh.userData.targetChevron.visible = !en.downed;
          en.mesh.userData.targetChevron.rotation.y += dt * 2.5;
        }
        if (en.downed) {
          // Downed pose flat on asphalt
          en.mesh.position.set(en.x, 0.22, en.z);
          en.mesh.rotation.set(-Math.PI * 0.48, en.rotY, 0.25);
          continue;
        }
        en.mesh.rotation.set(0, en.rotY, 0);
        if (!state.activeShot) {
          en.rotY = Math.atan2(state.player.x - en.x, state.player.z - en.z);
        }
        en.mesh.position.set(en.x, en.y, en.z);
        en.mesh.rotation.y = en.rotY;
      }
    },
  };
}
