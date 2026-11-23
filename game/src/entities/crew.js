// Crew partner AI (Valeria, Ramona, Mateo) & tactical crew ability execution (Z / X / C)
import { buildCharacterMesh } from './player.js';

export function initCrewSystem(scene, state, events, soundEngine) {
 const partnerMesh = buildCharacterMesh({ jacket: 0x00d8d6, lapel: 0x0c2438, shirt: 0xff4d79, pants: 0x141d30, visor: 0xffbf3c });
 partnerMesh.userData.rightArm.rotation.x = -Math.PI * 0.45;
 partnerMesh.userData.leftArm.rotation.set(-Math.PI * 0.36, 0.32, 0);
 partnerMesh.userData.leftLeg.rotation.x = -0.22;
 partnerMesh.userData.rightLeg.rotation.x = 0.24;
 partnerMesh.userData.muzzleFlash.visible = true;
 scene.add(partnerMesh);

 events.on('crew:ability', (abilityKey) => {
  const ab = state.crew.abilities[abilityKey];
  if (!ab || ab.cooldown > 0) return;
  ab.cooldown = ab.maxCooldown;

  if (abilityKey === 'swapPlates') {
   state.wanted.stars = Math.max(0, state.wanted.stars - 2);
   state.dialogue.speaker = 'VALERIA · TACTICAL LEAD';
   state.dialogue.line = '"Transponder scrubbed and plates flipped! Palma PD lost two stars on our tail."';
  } else if (abilityKey === 'fieldRepair') {
   state.player.health = 100; state.player.armor = 100;
   const car = state.entities.vehicles.find((v) => v.id === state.player.vehicleId);
   if (car) car.hp = 100;
   state.dialogue.speaker = 'RAMONA · COMBAT MEDIC & TECH';
   state.dialogue.line = '"Nano-sealant injected and armor plates reinforced! Hull integrity is back at 100%."';
  } else if (abilityKey === 'policeJammer') {
   state.wanted.evadeTimer = 10;
   state.dialogue.speaker = 'MATEO · SIGNAL JAMMER';
   state.dialogue.line = '"EMP Jammer pulsing on Palma PD frequencies! AIR-1 radar is blinded for 10 seconds!"';
  }
  if (soundEngine) soundEngine.playChime(880);
 });

 return {
  partnerMesh,
  update(dt) {
   const abilities = state.crew.abilities;
   for (const k of Object.keys(abilities)) if (abilities[k].cooldown > 0) abilities[k].cooldown = Math.max(0, abilities[k].cooldown - dt);
   if (state.player.inVehicle) {
    partnerMesh.visible = false;
   } else {
    partnerMesh.visible = true;
    partnerMesh.position.set(state.player.x - 2.3, 0, state.player.z + 1.1);
    partnerMesh.rotation.y = state.player.rotY + 0.04;
    partnerMesh.userData.muzzleFlash.visible = Boolean(state.activeShot === 'combat' || state.player.muzzleTimer > 0);
   }
  },
 };
}
