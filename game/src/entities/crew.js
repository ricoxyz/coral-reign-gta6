// Crew partner AI (Valeria, Rafa, Mateo) & tactical crew ability execution (Z / X / C)
import { buildCharacterMesh } from './player.js';

export function initCrewSystem(scene, state, events, soundEngine) {
  const partnerMesh = buildCharacterMesh({
    jacket: 0x00f0ff,
    shirt: 0xff4d79,
    pants: 0x141d30,
  });
  partnerMesh.userData.rightArm.rotation.x = -Math.PI * 0.45;
  scene.add(partnerMesh);

  events.on('crew:ability', (abilityKey) => {
    const ab = state.crew.abilities[abilityKey];
    if (!ab || ab.cooldown > 0) return;
    ab.cooldown = ab.maxCooldown;

    if (abilityKey === 'swapPlates') {
      state.wanted.stars = Math.max(0, state.wanted.stars - 2);
      state.dialogue.speaker = 'RAFA • FORGERY & PLATES';
      state.dialogue.line = '"Transponder scrubbed and plates flipped! Palma PD lost two stars on our tail."';
    } else if (abilityKey === 'fieldRepair') {
      state.player.health = 100;
      state.player.armor = 100;
      const car = state.entities.vehicles.find((v) => v.id === state.player.vehicleId);
      if (car) car.hp = 100;
      state.dialogue.speaker = 'MATEO • CHASSIS TECH';
      state.dialogue.line = '"Nano-sealant injected and armor plates reinforced! Vortex GT is back at 100%."';
    } else if (abilityKey === 'policeJammer') {
      state.wanted.evadeTimer = 10;
      state.dialogue.speaker = 'VALERIA • CREW TACTICAL LEAD';
      state.dialogue.line = '"EMP Jammer pulsing on Palma PD frequencies! AIR-1 radar is blinded for 10 seconds!"';
    }
    if (soundEngine) soundEngine.playChime(880);
  });

  return {
    partnerMesh,
    update(dt) {
      const abilities = state.crew.abilities;
      for (const k of Object.keys(abilities)) {
        if (abilities[k].cooldown > 0) {
          abilities[k].cooldown = Math.max(0, abilities[k].cooldown - dt);
        }
      }

      // Position crew partner Valeria alongside Dani when on foot
      if (state.player.inVehicle) {
        partnerMesh.visible = false;
      } else {
        partnerMesh.visible = true;
        const px = state.player.x - 2.4;
        const pz = state.player.z + 1.2;
        partnerMesh.position.set(px, 0, pz);
        partnerMesh.rotation.y = state.player.rotY;
      }
    },
  };
}
