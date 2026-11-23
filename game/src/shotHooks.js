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

  if (shot === 'cover' || shot === 'play') {
    // Shot 1 (768x480 Cover): Sunset Boulevard 4-Star Heist Chase with Helicopter Spotlight
    state.mode = 'play';
    state.player.inVehicle = true;
    state.player.vehicleId = 'player_car';
    state.wanted.stars = 4;

    if (heroCar) {
      heroCar.x = 110;
      heroCar.z = 38;
      heroCar.rotY = Math.PI + 0.14; // Dynamic drift angle
      heroCar.driftAngle = -0.18;
      heroCar.mph = 142;
      heroCar.gear = 5;
      heroCar.rpm = 86;
    }
    if (convoyCar) {
      convoyCar.x = 104;
      convoyCar.z = 6;
      convoyCar.rotY = Math.PI;
    }
    if (police1) {
      police1.x = 103.5;
      police1.z = 48.5;
      police1.rotY = Math.PI + 0.12;
    }
    if (police2) {
      police2.x = 116.5;
      police2.z = 51.5;
      police2.rotY = Math.PI - 0.14;
    }
    if (systems.helicopter) {
      systems.helicopter.heli.position.set(102, 21.5, 4);
      systems.helicopter.heli.lookAt(110, 4, 38);
      systems.helicopter.groundPool.position.set(110, 0.09, 36);
    }

    if (camVariant === 2) {
      state.customCamera = { x: 121, y: 6.2, z: 54, lookX: 106, lookY: 3.5, lookZ: 2 };
    } else if (camVariant === 3) {
      state.customCamera = { x: 99, y: 3.8, z: 51, lookX: 112, lookY: 3.2, lookZ: 0 };
    } else {
      state.customCamera = { x: 114.5, y: 4.5, z: 52.5, lookX: 108, lookY: 3.2, lookZ: -10 };
    }
  } else if (shot === 'combat' || shot === 'end') {
    // Shot 2: On-Foot Street Crossfire, Muzzle Flashes, Explosions & Car Hijack Prompt
    state.mode = 'play';
    state.player.inVehicle = false;
    state.player.vehicleId = null;
    state.player.x = 110;
    state.player.z = 26;
    state.player.rotY = Math.PI;
    state.player.aiming = true;
    state.player.muzzleTimer = 10;
    state.wanted.stars = 5;

    if (heroCar) {
      heroCar.x = 114.5;
      heroCar.z = 23.5;
      heroCar.rotY = Math.PI - 0.35;
      heroCar.isPlayerControlled = false;
    }
    if (police1) {
      police1.x = 103.5;
      police1.z = 11.5;
      police1.rotY = 0.45;
    }
    if (police2) {
      police2.x = 116.5;
      police2.z = 9.5;
      police2.rotY = -0.45;
    }

    // Spawn bright ballistic tracers & explosion fireballs in the crossfire
    if (systems.combat) {
      systems.combat.spawnTracer(110.3, 1.45, 25.4, 104.2, 1.35, 17.5, 0xffdf40);
      systems.combat.spawnTracer(107.6, 1.45, 26.8, 115.8, 1.35, 14.0, 0x00f0ff);
      systems.combat.spawnTracer(104.0, 1.4, 17.8, 109.5, 1.5, 25.0, 0xff2a55);
      systems.combat.spawnTracer(116.0, 1.4, 14.2, 111.2, 1.3, 24.5, 0xff7e29);
      systems.combat.spawnExplosion(106.5, 1.6, 12.5, 1.15);
      systems.combat.spawnExplosion(115.2, 1.3, 10.5, 0.85);
    }

    state.dialogue.speaker = 'RAFA • HEAVY WEAPONS SUPPORT';
    state.dialogue.line = '"SWAT blockade at Hotel Coral! Blast through or hijack the Vortex GT ([F]) now!"';

    if (camVariant === 2) {
      state.customCamera = { x: 105.8, y: 2.8, z: 33.2, lookX: 112, lookY: 1.6, lookZ: 6 };
    } else {
      state.customCamera = { x: 112.4, y: 2.75, z: 32.8, lookX: 108.5, lookY: 1.6, lookZ: 5 };
    }
  } else if (shot === 'map') {
    // Shot 3: Full Pause Map, 6 Districts, 10 Story Missions, Career Stats & 3 Save Slots
    state.mode = 'pause_map';
    state.customCamera = { x: 115, y: 28, z: 75, lookX: 110, lookY: 5, lookZ: -40 };
  } else if (shot === 'title' || shot === 'start') {
    // Shot 4: Cinematic 3D Title Screen & Save Slots over Golden-Hour Palma Dorada Coast
    state.mode = 'title';
    state.customCamera = { x: 122, y: 9.5, z: 62, lookX: 105, lookY: 6, lookZ: -45 };
  }
}
