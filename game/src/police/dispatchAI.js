// Police Interceptor AI: spawns pursuit cruisers, flanking maneuvers, and strobe sirens
import { buildSculptedVehicleMesh, getArchetypeById } from '../entities/vehicleModels.js';

export function initPoliceDispatchAI(scene, state) {
  const pdArch = getArchetypeById('palma_pd');
  const cruisers = [];

  const unitSpecs = [
    { id: 'police_1', callsign: 'CORAL-12', tactic: 'RAMMING INTERCEPT', x: 105, z: 54, rotY: Math.PI + 0.08 },
    { id: 'police_2', callsign: 'MARINA-4', tactic: 'FLANKING BOULEVARD', x: 116, z: 59, rotY: Math.PI - 0.1 },
    { id: 'police_3', callsign: 'VIDRIO-7', tactic: 'PINCER BLOCK', x: 113, z: 22, rotY: 0.22 },
  ];

  for (let i = 0; i < unitSpecs.length; i++) {
    const spec = unitSpecs[i];
    const mesh = buildSculptedVehicleMesh(pdArch);
    scene.add(mesh);

    const unit = {
      id: spec.id,
      archetypeId: 'palma_pd',
      name: pdArch.name,
      cls: 'POLICE',
      isPolice: true,
      callsign: spec.callsign,
      tactic: spec.tactic,
      x: spec.x,
      y: 0,
      z: spec.z,
      rotY: spec.rotY,
      speed: 28,
      mph: 118,
      gear: 4,
      rpm: 78,
      hp: 100,
      mesh,
    };
    cruisers.push(unit);
    state.entities.vehicles.push(unit);
  }

  return {
    cruisers,
    update(dt, time) {
      const stars = state.wanted.stars;
      const px = state.player.x;
      const pz = state.player.z;

      for (let i = 0; i < cruisers.length; i++) {
        const c = cruisers[i];
        if (c.isPlayerControlled) continue;

        // Flash red/blue strobe lightbar & point light
        const phase = Math.sin(time * 14 + i * 2.1) > 0;
        const { sirenRed, sirenBlue, sirenLight } = c.mesh.userData;
        if (sirenRed && sirenBlue && sirenLight) {
          sirenRed.material.color.setHex(phase ? 0xff1744 : 0x330510);
          sirenBlue.material.color.setHex(phase ? 0x051833 : 0x00b0ff);
          sirenLight.color.setHex(phase ? 0xff1744 : 0x00b0ff);
          sirenLight.intensity = stars > 0 ? 2.4 : 0;
        }

        if (stars === 0) continue;

        // Steer aggressively toward player vehicle / position
        const dx = px - c.x;
        const dz = pz - c.z;
        const dist = Math.hypot(dx, dz);
        const targetAngle = Math.atan2(dx, dz);

        let diff = targetAngle - c.rotY;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;

        c.rotY += Math.sign(diff) * Math.min(Math.abs(diff), 2.4 * dt);
        const targetSpeed = dist > 18 ? 32 : 20;
        c.speed += (targetSpeed - c.speed) * dt * 2.5;

        c.x += Math.sin(c.rotY) * c.speed * dt;
        c.z += Math.cos(c.rotY) * c.speed * dt;
        c.mesh.position.set(c.x, c.y, c.z);
        c.mesh.rotation.y = c.rotY;
      }
    },
  };
}
