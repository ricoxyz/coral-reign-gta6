// Police Interceptor AI: spawns 4+ pursuit cruisers, flanking maneuvers, and strobe sirens
import { buildSculptedVehicleMesh, getArchetypeById } from '../entities/vehicleModels.js';

export function initPoliceDispatchAI(scene, state) {
 const pdArch = getArchetypeById('palma_pd'), cruisers = [];
 [
  ['police_1', 'CORAL-12', 'RAMMING', 103.5, 50, Math.PI + 0.12],
  ['police_2', 'MARINA-4', 'FLANKING', 117.0, 46, Math.PI - 0.15],
  ['police_3', 'VIDRIO-7', 'INTERCEPT', 104.5, 22, Math.PI - 0.24],
  ['police_4', 'TAC-9', 'ROADBLOCK', 116.5, 16, 0.25],
 ].forEach(([id, callsign, tactic, x, z, rotY]) => {
  const mesh = buildSculptedVehicleMesh(pdArch);
  scene.add(mesh);
  const unit = { id, archetypeId: 'palma_pd', name: pdArch.name, cls: 'POLICE', isPolice: true, callsign, tactic, x, y: 0, z, rotY, speed: 30, mph: 118, gear: 4, rpm: 80, hp: 100, mesh };
  cruisers.push(unit);
  state.entities.vehicles.push(unit);
 });

 return {
  cruisers,
  update(dt, time) {
   const stars = state.wanted.stars, px = state.player.x, pz = state.player.z;
   cruisers.forEach((c, i) => {
    if (c.isPlayerControlled) return;
    const phase = Math.sin(time * 14 + i * 2.1) > 0;
    const { sirenRed, sirenBlue, sirenLight } = c.mesh.userData;
    if (sirenRed && sirenBlue && sirenLight) {
     if (state.activeShot) {
      sirenRed.material.color.setHex(0xff1744); sirenBlue.material.color.setHex(0x00d8ff);
      sirenLight.color.setHex(i % 2 === 0 ? 0xff1744 : 0x00d8ff); sirenLight.intensity = 0.85;
     } else {
      sirenRed.material.color.setHex(phase ? 0xff1744 : 0x770c22); sirenBlue.material.color.setHex(phase ? 0x0b4c8c : 0x00d8ff);
      sirenLight.color.setHex(phase ? 0xff1744 : 0x00d8ff); sirenLight.intensity = stars > 0 ? 0.75 : 0;
     }
    }
    if (stars === 0 || state.activeShot) return;
    const dx = px - c.x, dz = pz - c.z, dist = Math.hypot(dx, dz);
    let diff = Math.atan2(dx, dz) - c.rotY;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    c.rotY += Math.sign(diff) * Math.min(Math.abs(diff), 2.4 * dt);
    c.speed += ((dist > 18 ? 32 : 20) - c.speed) * dt * 2.5;
    c.x += Math.sin(c.rotY) * c.speed * dt; c.z += Math.cos(c.rotY) * c.speed * dt;
    c.mesh.position.set(c.x, c.y, c.z); c.mesh.rotation.y = c.rotY;
   });
  },
 };
}
