// Civilian traffic spawner, boulevard lane following & player car management
import { buildSculptedVehicleMesh, getArchetypeById } from './vehicleModels.js';
import { updatePlayerVehiclePhysics } from './vehiclePhysics.js';
import { ROAD_X } from '../world/roads.js';

export function initTrafficVehicles(scene, state) {
 const vehicles = [];
 const addCar = (id, archId, x, z, rotY, speed, mph, gear, rpm, hp, isPlayerControlled = false, isMissionTarget = false) => {
  const arch = getArchetypeById(archId), mesh = buildSculptedVehicleMesh(arch); scene.add(mesh);
  const car = { id, archetypeId: archId, name: arch.name, cls: arch.cls, x, y: 0, z, rotY, speed, mph, gear, rpm, hp, isPlayerControlled, isMissionTarget, mesh };
  vehicles.push(car); return car;
 };
 addCar('player_car', 'vortex_gt', 110, 40, Math.PI, 38, 142, 5, 84, 96, true, false);
 addCar('mission_convoy', 'bullion_van', 105, -15, Math.PI, 18, 68, 3, 65, 100, false, true);
 const civ = ['solaris_rs', 'mirador_lux', 'mercado_4x4', 'vortex_gt'];
 for (let i = 0; i < 16; i++) {
  const dir = i % 2 === 0 ? 1 : -1;
  addCar(`traffic_${i}`, civ[i % 4], ROAD_X[(i + 3) % ROAD_X.length] + (dir === 1 ? 5.2 : -5.2), -240 + i * 32, dir === 1 ? 0 : Math.PI, 14 + (i % 4) * 3, 55, 3, 52, 100);
 }
 state.entities.vehicles = vehicles;
 return {
  vehicles,
  update(dt, colliders) {
   for (const v of vehicles) {
    if (v.isPlayerControlled && state.player.inVehicle) updatePlayerVehiclePhysics(v, state, colliders, dt);
    else if (!v.isPolice && v.id !== 'player_car' && !v.wrecked) {
     v.x += Math.sin(v.rotY) * v.speed * dt; v.z += Math.cos(v.rotY) * v.speed * dt;
     if (v.z > 420) v.z = -420; if (v.z < -420) v.z = 420;
    }
    if (v.wrecked && !v._charredApplied) {
     v._charredApplied = true;
     v.mesh.traverse((o) => { if (o.isMesh && o.material && !o.material.transparent && o.material.color && o.material.type !== 'MeshBasicMaterial') { o.material = o.material.clone(); o.material.color.multiplyScalar(.32); } });
    }
    v.mesh.position.set(v.x, v.y, v.z);
    v.mesh.rotation.set(v.tiltX || 0, v.rotY + (v.driftAngle || 0), v.tiltZ || 0);
    for (const w of v.mesh.userData.wheels || []) w.rotation.x += v.speed * dt * 1.4;
   }
  },
 };
}
