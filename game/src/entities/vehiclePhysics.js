// Arcade drift vehicle physics, gear shifting, collision response, and hijack interaction
import { getArchetypeById } from './vehicleModels.js';

export function updatePlayerVehiclePhysics(car, state, colliders, dt) {
 const k = state.input.keys, arch = getArchetypeById(car.archetypeId);
 const throttle = (k.KeyW || k.ArrowUp) ? 1 : (k.KeyS || k.ArrowDown) ? -0.65 : 0;
 const steer = (k.KeyA || k.ArrowLeft) ? 1 : (k.KeyD || k.ArrowRight) ? -1 : 0;
 const handbrake = Boolean(k.Space);
 const maxSpeedUnits = arch.topSpeed * 0.28;

 if (throttle !== 0) car.speed += throttle * arch.accel * dt;
 else car.speed *= Math.pow(0.25, dt);

 if (handbrake) {
  car.speed *= Math.pow(0.08, dt);
  car.driftAngle = (car.driftAngle || 0) * 0.85 + steer * 0.28;
 } else {
  car.driftAngle = (car.driftAngle || 0) * 0.82;
 }

 car.speed = Math.max(-maxSpeedUnits * 0.4, Math.min(maxSpeedUnits, car.speed));
 if (Math.abs(car.speed) > 0.4) {
  const turnFactor = Math.min(1, Math.abs(car.speed) / 10) * (car.speed >= 0 ? 1 : -1);
  car.rotY += steer * arch.handling * (handbrake ? 1.35 : 1.0) * turnFactor * dt;
 }

 const nextX = car.x + Math.sin(car.rotY) * car.speed * dt;
 const nextZ = car.z + Math.cos(car.rotY) * car.speed * dt;
 const blocked = colliders.some((c) => nextX > c.minX - 1.5 && nextX < c.maxX + 1.5 && nextZ > c.minZ - 1.5 && nextZ < c.maxZ + 1.5);
 if (!blocked) { car.x = nextX; car.z = nextZ; }
 else car.speed *= -0.35;

 state.player.x = car.x; state.player.z = car.z; state.player.rotY = car.rotY;
 car.mph = Math.round(Math.abs(car.speed) * 3.6);
 car.gear = car.mph < 18 ? 1 : car.mph < 42 ? 2 : car.mph < 72 ? 3 : car.mph < 105 ? 4 : car.mph < 135 ? 5 : 6;
 car.rpm = Math.min(100, Math.max(18, ((car.mph % 30) / 30) * 85 + 15));
}

export function tryHijackOrExitVehicle(state, vehicles, soundEngine) {
 const p = state.player;
 if (p.inVehicle) {
  const currentCar = vehicles.find((v) => v.id === p.vehicleId);
  p.inVehicle = false; p.vehicleId = null;
  if (currentCar) {
   p.x = currentCar.x - Math.cos(currentCar.rotY) * 2.8;
   p.z = currentCar.z + Math.sin(currentCar.rotY) * 2.8;
   currentCar.speed = 0; currentCar.mph = 0; currentCar.isPlayerControlled = false;
  }
  if (soundEngine) soundEngine.playChime(520);
  return { action: 'exited', vehicle: currentCar };
 }

 let bestCar = null, bestDist = 9.5;
 for (const v of vehicles) {
  const d = Math.hypot(v.x - p.x, v.z - p.z);
  if (d < bestDist) { bestDist = d; bestCar = v; }
 }

 if (bestCar) {
  p.inVehicle = true; p.vehicleId = bestCar.id; bestCar.isPlayerControlled = true;
  p.x = bestCar.x; p.z = bestCar.z; p.rotY = bestCar.rotY;
  state.stats.carsHijacked += 1;
  if (bestCar.archetypeId === 'palma_pd' || state.wanted.stars < 2) state.wanted.stars = Math.max(state.wanted.stars, 2);
  if (soundEngine) soundEngine.playChime(740);
  return { action: 'hijacked', vehicle: bestCar };
 }
 return { action: 'none', vehicle: null };
}
