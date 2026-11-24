// Arcade drift vehicle physics, gear shifting, collision response & hijack interaction
import { getArchetypeById } from './vehicleModels.js';

export function updatePlayerVehiclePhysics(car, state, colliders, dt) {
 const k = state.input.keys, arch = getArchetypeById(car.archetypeId);
 const throttle = (k.KeyW || k.ArrowUp) ? 1 : (k.KeyS || k.ArrowDown) ? -.65 : 0;
 const steer = (k.KeyA || k.ArrowLeft) ? 1 : (k.KeyD || k.ArrowRight) ? -1 : 0;
 const handbrake = Boolean(k.Space), maxSpd = arch.topSpeed * .28;
 if (throttle !== 0) car.speed += throttle * arch.accel * dt; else car.speed *= Math.pow(.25, dt);
 if (handbrake) { car.speed *= Math.pow(.08, dt); car.driftAngle = (car.driftAngle || 0) * .85 + steer * .28; }
 else car.driftAngle = (car.driftAngle || 0) * .82;
 car.speed = Math.max(-maxSpd * .4, Math.min(maxSpd, car.speed));
 if (Math.abs(car.speed) > .4) {
  const turn = Math.min(1, Math.abs(car.speed) / 10) * (car.speed >= 0 ? 1 : -1);
  car.rotY += steer * arch.handling * (handbrake ? 1.35 : 1) * turn * dt;
 }
 const nx = car.x + Math.sin(car.rotY) * car.speed * dt, nz = car.z + Math.cos(car.rotY) * car.speed * dt;
 if (!colliders.some((c) => nx > c.minX - 1.5 && nx < c.maxX + 1.5 && nz > c.minZ - 1.5 && nz < c.maxZ + 1.5)) { car.x = nx; car.z = nz; }
 else car.speed *= -.35;
 state.player.x = car.x; state.player.z = car.z; state.player.rotY = car.rotY;
 car.mph = Math.round(Math.abs(car.speed) * 3.6);
 car.gear = car.mph < 18 ? 1 : car.mph < 42 ? 2 : car.mph < 72 ? 3 : car.mph < 105 ? 4 : car.mph < 135 ? 5 : 6;
 car.rpm = Math.min(100, Math.max(18, ((car.mph % 30) / 30) * 85 + 15));
}

export function tryHijackOrExitVehicle(state, vehicles, soundEngine) {
 const p = state.player;
 if (p.inVehicle) {
  const car = vehicles.find((v) => v.id === p.vehicleId);
  p.inVehicle = false; p.vehicleId = null;
  if (car) {
   p.x = car.x - Math.cos(car.rotY) * 2.8; p.z = car.z + Math.sin(car.rotY) * 2.8;
   car.speed = 0; car.mph = 0; car.isPlayerControlled = false;
  }
  soundEngine?.playChime(520);
  return { action: 'exited', vehicle: car };
 }
 let best = null, bestD = 9.5;
 for (const v of vehicles) { const d = Math.hypot(v.x - p.x, v.z - p.z); if (d < bestD) { bestD = d; best = v; } }
 if (best) {
  p.inVehicle = true; p.vehicleId = best.id; best.isPlayerControlled = true;
  p.x = best.x; p.z = best.z; p.rotY = best.rotY; state.stats.carsHijacked += 1;
  if (best.archetypeId === 'palma_pd' || state.wanted.stars < 2) state.wanted.stars = Math.max(state.wanted.stars, 2);
  soundEngine?.playChime(740);
  return { action: 'hijacked', vehicle: best };
 }
 return { action: 'none', vehicle: null };
}
