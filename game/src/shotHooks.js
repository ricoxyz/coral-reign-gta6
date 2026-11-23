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

    // Position enemy gang combatants (including 1 clearly visible downed enemy on asphalt)
    const enemies = state.entities.enemies || [];
    const combatSpots = [
      { x: 215.8, z: 366.8, downed: true },
      { x: 212.0, z: 360.5, downed: false },
      { x: 220.8, z: 357.5, downed: false },
      { x: 223.8, z: 362.5, downed: false },
      { x: 216.0, z: 354.5, downed: false },
      { x: 221.5, z: 351.0, downed: false },
    ];
    for (let i = 0; i < Math.min(enemies.length, combatSpots.length); i++) {
      enemies[i].x = combatSpots[i].x;
      enemies[i].z = combatSpots[i].z;
      enemies[i].downed = combatSpots[i].downed;
      enemies[i].alive = !combatSpots[i].downed;
      enemies[i].rotY = Math.atan2(217.5 - enemies[i].x, 376 - enemies[i].z);
    }

    const peds = state.entities.pedestrians || [];
    if (peds[0]) { peds[0].x = 207.5; peds[0].z = 368; peds[0].rotY = 0; }
    if (peds[1]) { peds[1].x = 231.5; peds[1].z = 364; peds[1].rotY = 0.3; }
    if (peds[2]) { peds[2].x = 208.0; peds[2].z = 358; peds[2].rotY = -0.2; }

    // Bright ballistic tracers aligned with player aim -> crosshair target + 3D explosion burst
    if (systems.combat) {
      systems.combat.spawnTracer(217.85, 1.38, 375.2, 220.8, 1.32, 357.5, 0xffdf40);
      systems.combat.spawnTracer(215.3, 1.38, 376.8, 212.2, 1.35, 360.8, 0x00f0ff);
      systems.combat.spawnTracer(212.2, 1.38, 361.0, 216.9, 1.45, 375.6, 0xff2a55);
      systems.combat.spawnTracer(223.6, 1.38, 362.6, 218.2, 1.30, 375.5, 0xff7e29);
      systems.combat.spawnExplosion(211.5, 0.85, 353.5, 0.95);
    }

    state.dialogue.speaker = 'VALERIA · TACTICAL LEAD';
    state.dialogue.line = '"Enforcer down at Palma Pier! Grab the Coral Vortex GT ([F]) before SWAT boxes us in!"';

    state.customCamera = { x: 215.4, y: 2.35, z: 381.4, lookX: 221.0, lookY: 1.45, lookZ: 356 };
  } else if (shot === 'map') {
    // Shot 3: Full Pause Map, 6 Districts, Completion Ring & 3 Save Slots
    state.mode = 'pause_map';
    state.customCamera = { x: 92, y: 28, z: 95, lookX: 150, lookY: 6, lookZ: -35 };
  } else if (shot === 'title' || shot === 'start') {
    // Shot 4: Cinematic Sunset 3D Title Screen overlooking Palma Dorada Coastline & Skyline
    state.mode = 'title';
    state.customCamera = { x: 106, y: 24, z: 112, lookX: 235, lookY: 13, lookZ: -210 };
  }
}
