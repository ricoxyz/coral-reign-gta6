// Civilian traffic spawner, boulevard lane following, and player car management
import { VEHICLE_ARCHETYPES } from '../core/config.js';
import { buildSculptedVehicleMesh, getArchetypeById } from './vehicleModels.js';
import { updatePlayerVehiclePhysics } from './vehiclePhysics.js';
import { ROAD_X } from '../world/roads.js';

export function initTrafficVehicles(scene, state) {
  const vehicles = [];

  // 1. Player's Hero Exotic Sports Car ('Coral Vortex GT') on Solana Strip
  const heroArch = getArchetypeById('vortex_gt');
  const heroMesh = buildSculptedVehicleMesh(heroArch);
  scene.add(heroMesh);
  const heroCar = {
    id: 'player_car',
    archetypeId: 'vortex_gt',
    name: heroArch.name,
    cls: heroArch.cls,
    x: 110,
    y: 0,
    z: 40,
    rotY: Math.PI, // Heading north (-Z) along Solana Strip
    speed: 38,
    mph: 142,
    gear: 5,
    rpm: 84,
    hp: 96,
    isPlayerControlled: true,
    mesh: heroMesh,
  };
  vehicles.push(heroCar);

  // 2. Mission Target Armored Gold Convoy Truck ahead on Solana Strip
  const convoyArch = getArchetypeById('bullion_van');
  const convoyMesh = buildSculptedVehicleMesh(convoyArch);
  scene.add(convoyMesh);
  vehicles.push({
    id: 'mission_convoy',
    archetypeId: 'bullion_van',
    name: convoyArch.name,
    cls: convoyArch.cls,
    x: 105,
    y: 0,
    z: -15,
    rotY: Math.PI,
    speed: 18,
    mph: 68,
    gear: 3,
    rpm: 65,
    hp: 100,
    isPlayerControlled: false,
    isMissionTarget: true,
    mesh: convoyMesh,
  });

  // 3. 16 Active Civilian Traffic Cars cruising across Palma Dorada avenues
  const civTypes = ['solaris_rs', 'mirador_lux', 'mercado_4x4', 'vortex_gt'];
  for (let i = 0; i < 16; i++) {
    const archId = civTypes[i % civTypes.length];
    const arch = getArchetypeById(archId);
    const mesh = buildSculptedVehicleMesh(arch);
    scene.add(mesh);

    const avenueX = ROAD_X[(i + 3) % ROAD_X.length];
    const dir = i % 2 === 0 ? 1 : -1;
    const laneOffset = dir === 1 ? 5.2 : -5.2;
    const zPos = -240 + i * 32;

    vehicles.push({
      id: `traffic_${i}`,
      archetypeId: archId,
      name: arch.name,
      cls: arch.cls,
      x: avenueX + laneOffset,
      y: 0,
      z: zPos,
      rotY: dir === 1 ? 0 : Math.PI,
      speed: 14 + (i % 4) * 3,
      mph: 55,
      gear: 3,
      rpm: 52,
      hp: 100,
      isPlayerControlled: false,
      mesh,
    });
  }

  state.entities.vehicles = vehicles;
  return {
    vehicles,
    update(dt, colliders) {
      for (let i = 0; i < vehicles.length; i++) {
        const v = vehicles[i];
        if (v.isPlayerControlled && state.player.inVehicle) {
          updatePlayerVehiclePhysics(v, state, colliders, dt);
        } else if (!v.isPolice && v.id !== 'player_car') {
          v.x += Math.sin(v.rotY) * v.speed * dt;
          v.z += Math.cos(v.rotY) * v.speed * dt;
          if (v.z > 420) v.z = -420;
          if (v.z < -420) v.z = 420;
        }

        // Sync 3D mesh transform & spin wheels
        v.mesh.position.set(v.x, v.y, v.z);
        v.mesh.rotation.y = v.rotY + (v.driftAngle || 0);
        const wheels = v.mesh.userData.wheels || [];
        for (let w = 0; w < wheels.length; w++) {
          wheels[w].rotation.x += v.speed * dt * 1.4;
        }
      }
    },
  };
}
