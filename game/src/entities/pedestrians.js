// Animated pedestrians strolling Palma Dorada sidewalks & syndicate enemies
import { buildCharacterMesh } from './player.js';
import { ROAD_X } from '../world/roads.js';

export function initPedestriansAndEnemies(scene, state) {
  const pedestrians = [];
  const enemies = [];

  const jacketColors = [0x00f0ff, 0xffbf3c, 0x4eff91, 0xff7e29, 0xb978ff, 0xff4d79];

  // 28 Sidewalk Pedestrians across Solana Strip & Downtown
  for (let i = 0; i < 28; i++) {
    const mesh = buildCharacterMesh({
      jacket: jacketColors[i % jacketColors.length],
      shirt: 0xffffff,
      pants: 0x1d263b,
    });
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
      hp: 100,
      mesh,
    });
  }

  // 6 Rival Cartel & Tactical Combatants for On-Foot Crossfire
  const enemyConfigs = [
    { x: 104, z: 18, rotY: 0, jacket: 0xff2a55, role: 'CARTEL ENFORCER' },
    { x: 116, z: 14, rotY: -0.2, jacket: 0xff7e29, role: 'BULLION GUARD' },
    { x: 101, z: 9, rotY: 0.25, jacket: 0x101828, role: 'PALMA SWAT' },
    { x: 119, z: 6, rotY: -0.3, jacket: 0x101828, role: 'PALMA SWAT' },
    { x: 108, z: 3, rotY: 0, jacket: 0xff2a55, role: 'SYNDICATE HEAVY' },
    { x: 114, z: -2, rotY: -0.15, jacket: 0x101828, role: 'TACTICAL LEAD' },
  ];

  for (let i = 0; i < enemyConfigs.length; i++) {
    const ec = enemyConfigs[i];
    const mesh = buildCharacterMesh({
      jacket: ec.jacket,
      shirt: 0xffbf3c,
      pants: 0x0e1422,
    });
    mesh.userData.rightArm.rotation.x = -Math.PI * 0.46;
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
        ped.z += Math.cos(ped.rotY) * ped.speed * dt;
        if (ped.z > 340) ped.z = -340;
        if (ped.z < -340) ped.z = 340;
        ped.walkPhase += dt * 6;
        const swing = Math.sin(ped.walkPhase) * 0.38;
        ped.mesh.userData.leftLeg.rotation.x = swing;
        ped.mesh.userData.rightLeg.rotation.x = -swing;
        ped.mesh.position.set(ped.x, ped.y, ped.z);
        ped.mesh.rotation.y = ped.rotY;
      }

      for (let i = 0; i < enemies.length; i++) {
        const en = enemies[i];
        if (!en.alive) {
          en.mesh.visible = false;
          continue;
        }
        en.mesh.visible = true;
        const angleToPlayer = Math.atan2(state.player.x - en.x, state.player.z - en.z);
        en.rotY = angleToPlayer;
        en.mesh.position.set(en.x, en.y, en.z);
        en.mesh.rotation.y = en.rotY;
      }
    },
  };
}
