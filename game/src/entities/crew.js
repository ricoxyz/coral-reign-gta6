// Crew partner AI (Valeria, Ramona, Mateo) & crew ability execution (Z / X / C)
import { buildCharacterMesh } from './player.js';

export function initCrewSystem(scene, state, events, soundEngine) {
 const partnerMesh = buildCharacterMesh({ jacket: 0x00d8d6, lapel: 0x0c2438, shirt: 0xff4d79, pants: 0x141d30, visor: 0xffbf3c });
 const u = partnerMesh.userData;
 u.rightArm.rotation.x = -Math.PI * .45; u.leftArm.rotation.set(-Math.PI * .36, .32, 0);
 u.leftLeg.rotation.x = -.22; u.rightLeg.rotation.x = .24; u.muzzleFlash.visible = true;
 scene.add(partnerMesh);

 events.on('crew:ability', (key) => {
  const ab = state.crew.abilities[key];
  if (!ab || ab.cooldown > 0) return;
  ab.cooldown = ab.maxCooldown;
  if (key === 'swapPlates') {
   state.wanted.stars = Math.max(0, state.wanted.stars - 2);
   Object.assign(state.dialogue, { speaker: 'VALERIA · TACTICAL LEAD', line: '"Transponder scrubbed and plates flipped! Palma PD lost two stars on our tail."' });
  } else if (key === 'fieldRepair') {
   state.player.health = state.player.armor = 100;
   const car = state.entities.vehicles.find((v) => v.id === state.player.vehicleId); if (car) car.hp = 100;
   Object.assign(state.dialogue, { speaker: 'RAMONA · COMBAT MEDIC & TECH', line: '"Nano-sealant injected and armor plates reinforced! Hull integrity is back at 100%."' });
  } else if (key === 'policeJammer') {
   state.wanted.evadeTimer = 10;
   Object.assign(state.dialogue, { speaker: 'MATEO · SIGNAL JAMMER', line: '"EMP Jammer pulsing on Palma PD frequencies! AIR-1 radar is blinded for 10 seconds!"' });
  }
  soundEngine?.playChime(880);
 });

 return {
  partnerMesh,
  update(dt) {
   const ab = state.crew.abilities;
   for (const k of Object.keys(ab)) if (ab[k].cooldown > 0) ab[k].cooldown = Math.max(0, ab[k].cooldown - dt);
   if (state.player.inVehicle) partnerMesh.visible = false;
   else {
    partnerMesh.visible = true; partnerMesh.position.set(state.player.x - 2.3, 0, state.player.z + 1.1);
    partnerMesh.rotation.y = state.player.rotY + .04;
    u.muzzleFlash.visible = Boolean(state.activeShot === 'combat' || state.player.muzzleTimer > 0);
   }
  },
 };
}
