// Deterministic Screenshot & Camera Stage Presets (?shot=cover|combat|map|title&cam=1..3)
export function applyShotHooksFromUrl(state, systems) {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  const camVariant = Number(params.get('cam') || '1');
  if (!shot) return;

  state.activeShot = shot;

  const heroCar = state.entities.vehicles.find((v) => v.id === 'player_car');
  const convoyCar = state.entities.vehicles.find((v) => v.id === 'mission_convoy');
  const police1 = state.entities.vehicles.find((v) => v.id === 'police_1');
  const police2 = state.entities.vehicles.find((v) => v.id === 'police_2');
  const police3 = state.entities.vehicles.find((v) => v.id === 'police_3');
  const police4 = state.entities.vehicles.find((v) => v.id === 'police_4');

  if (shot === 'cover' || shot === 'play') {
    // Shot 1 (Cover): Golden-Hour 4-Star Coastal Police Chase on Solana Strip
    state.mode = 'play';
    state.player.inVehicle = true;
    state.player.vehicleId = 'player_car';
    state.player.x = 111.5;
    state.player.z = 36;
    state.wanted.stars = 4;

    if (heroCar) {
      heroCar.x = 111.5;
      heroCar.z = 36;
      heroCar.rotY = Math.PI + 0.16;
      heroCar.driftAngle = -0.20;
      heroCar.mph = 118;
      heroCar.gear = 5;
      heroCar.rpm = 84;
    }
    if (systems.combat) {
      systems.combat.spawnDriftEffects(111.5, 36, Math.PI - 0.04);
    }

    if (convoyCar) {
      convoyCar.x = 109;
      convoyCar.z = -18;
      convoyCar.rotY = Math.PI;
    }
    if (police1) {
      police1.x = 103.8;
      police1.z = 33.8;
      police1.rotY = Math.PI + 0.24;
    }
    if (police2) {
      police2.x = 119.2;
      police2.z = 31.2;
      police2.rotY = Math.PI - 0.22;
    }
    if (police3) {
      police3.x = 105.0;
      police3.z = 16.0;
      police3.rotY = Math.PI - 0.16;
    }
    if (police4) {
      police4.x = 117.5;
      police4.z = 8.0;
      police4.rotY = 0.35;
    }

    const civ0 = state.entities.vehicles.find((v) => v.id === 'traffic_0');
    const civ1 = state.entities.vehicles.find((v) => v.id === 'traffic_1');
    if (civ0) { civ0.x = 104.5; civ0.z = -4; civ0.rotY = Math.PI; }
    if (civ1) { civ1.x = 117.0; civ1.z = 21; civ1.rotY = 0; }

    // Dramatic roaring orange-gold 3D explosion fireball + dark smoke plume in the boulevard background of 01_cover_chase.jpg
    if (systems.combat) {
      systems.combat.spawnExplosion(114.2, 1.15, 7.2, 1.85);
      systems.combat.spawnTracer(103.8, 1.35, 31.0, 111.2, 1.25, 35.5, 0xff2a55);
      systems.combat.spawnTracer(118.8, 1.35, 29.0, 112.0, 1.25, 35.5, 0xffdf40);
    }

    // Fleeing pedestrians on both sidewalks raising arms in panic
    const coverPeds = state.entities.pedestrians || [];
    if (coverPeds[0]) { coverPeds[0].x = 97.5; coverPeds[0].z = 32.0; coverPeds[0].rotY = 0.2; coverPeds[0].fleeing = true; }
    if (coverPeds[1]) { coverPeds[1].x = 123.5; coverPeds[1].z = 28.0; coverPeds[1].rotY = -0.25; coverPeds[1].fleeing = true; }
    if (coverPeds[2]) { coverPeds[2].x = 97.8; coverPeds[2].z = 19.0; coverPeds[2].rotY = 0.15; coverPeds[2].fleeing = true; }
    if (coverPeds[3]) { coverPeds[3].x = 123.2; coverPeds[3].z = 16.0; coverPeds[3].rotY = -0.15; coverPeds[3].fleeing = true; }

    if (systems.helicopter) {
      systems.helicopter.heli.position.set(117.5, 16.8, 12.0);
      systems.helicopter.heli.lookAt(111.5, 1.5, 36);
      systems.helicopter.groundPool.position.set(111.5, 0.12, 36);
    }

    if (camVariant === 2) {
      state.customCamera = { x: 103.0, y: 3.8, z: 49.5, lookX: 118, lookY: 3.4, lookZ: -14 };
    } else {
      state.customCamera = { x: 106.2, y: 3.15, z: 45.6, lookX: 115.5, lookY: 2.9, lookZ: -10 };
    }
  } else if (shot === 'combat' || shot === 'end') {
    // Shot 2: Dusk On-Foot Shootout & Carjacking in Palma Pier
    state.mode = 'play';
    state.player.inVehicle = false;
    state.player.vehicleId = null;
    state.player.x = 217.5;
    state.player.z = 376;
    state.player.rotY = Math.PI + 0.06;
    state.player.aiming = true;
    state.player.muzzleTimer = 10;
    state.wanted.stars = 2;

    if (heroCar) {
      heroCar.x = 224.2;
      heroCar.z = 371.0;
      heroCar.rotY = Math.PI - 0.38;
      heroCar.isPlayerControlled = false;
    }
    if (police1) {
      police1.x = 213.5;
      police1.z = 351.0;
      police1.rotY = 0.25;
    }
    if (police2) {
      police2.x = 225.5;
      police2.z = 349.0;
      police2.rotY = -0.3;
    }

    // Burning enemy cartel SUV (Mercado Titan 4x4) in the crossfire zone
    const enemySuv = state.entities.vehicles.find((v) => v.archetypeId === 'mercado_4x4');
    if (enemySuv) {
      enemySuv.x = 211.0;
      enemySuv.z = 358.8;
      enemySuv.rotY = 0.62;
      enemySuv.isPlayerControlled = false;
    }

    // Position enemy gang combatants (including 1 clearly visible downed enemy on asphalt + red target chevrons)
    const enemies = state.entities.enemies || [];
    const combatSpots = [
      { x: 221.4, z: 368.2, downed: true },
      { x: 213.8, z: 361.5, downed: false },
      { x: 220.4, z: 358.2, downed: false },
      { x: 223.8, z: 362.8, downed: false },
      { x: 216.2, z: 354.5, downed: false },
      { x: 221.5, z: 351.2, downed: false },
    ];
    for (let i = 0; i < Math.min(enemies.length, combatSpots.length); i++) {
      enemies[i].x = combatSpots[i].x;
      enemies[i].z = combatSpots[i].z;
      enemies[i].downed = combatSpots[i].downed;
      enemies[i].alive = !combatSpots[i].downed;
      enemies[i].rotY = Math.atan2(217.5 - enemies[i].x, 376 - enemies[i].z);
    }

    // Clearly visible fleeing pedestrians raising arms on both sidewalks
    const peds = state.entities.pedestrians || [];
    if (peds[0]) { peds[0].x = 207.2; peds[0].z = 370.5; peds[0].rotY = 0.25; peds[0].fleeing = true; }
    if (peds[1]) { peds[1].x = 229.4; peds[1].z = 366.5; peds[1].rotY = -0.25; peds[1].fleeing = true; }
    if (peds[2]) { peds[2].x = 207.6; peds[2].z = 358.0; peds[2].rotY = 0.18; peds[2].fleeing = true; }
    if (peds[3]) { peds[3].x = 229.8; peds[3].z = 356.5; peds[3].rotY = -0.2; peds[3].fleeing = true; }

    // Bright ballistic tracers aligned with player aim -> crosshair target + 3D explosion fireball on burning enemy SUV
    if (systems.combat) {
      systems.combat.spawnTracer(217.85, 1.38, 375.2, 220.4, 1.32, 358.2, 0xffdf40);
      systems.combat.spawnTracer(215.3, 1.38, 376.8, 213.8, 1.35, 361.5, 0x00f0ff);
      systems.combat.spawnTracer(213.8, 1.38, 361.5, 216.9, 1.45, 375.6, 0xff2a55);
      systems.combat.spawnTracer(223.6, 1.38, 362.8, 218.2, 1.30, 375.5, 0xff7e29);
      systems.combat.spawnExplosion(210.4, 1.15, 358.2, 1.25);
    }

    state.dialogue.speaker = 'VALERIA · TACTICAL LEAD';
    state.dialogue.line = '"Enforcer down at Palma Pier! Grab the Coral Vortex GT ([F]) before SWAT boxes us in!"';

    state.customCamera = { x: 215.4, y: 2.35, z: 381.4, lookX: 221.0, lookY: 1.45, lookZ: 356 };
  } else if (shot === 'map') {
    // Shot 3: Full Pause Map, 6 Districts, Completion Ring & 3 Save Slots
    state.mode = 'pause_map';
    state.customCamera = { x: 92, y: 28, z: 95, lookX: 150, lookY: 6, lookZ: -35 };
  } else if (shot === 'title' || shot === 'start') {
    // Shot 4: Radiant Sun-Soaked 3D Title Screen overlooking Palma Dorada Beachfront, Pastel Art-Deco Skyline & Palm Avenue
    state.mode = 'title';
    state.customCamera = { x: 108, y: 24.5, z: 112, lookX: 215, lookY: 14, lookZ: -210 };
  }
}
