// Cinematic Camera & Tactical Scenario Director for CORAL REIGN: Palma Dorada
export const CAMERA_MODES = [
 { id: 'chase_dynamic', label: 'DYNAMIC PURSUIT', fov: 62, distDrive: 11.2, heightDrive: 3.9 },
 { id: 'chase_low', label: 'STREET DRIFT', fov: 66, distDrive: 9.4, heightDrive: 2.75 },
 { id: 'tactical_ots', label: 'OVER-THE-SHOULDER', fov: 58, distFoot: 4.8, heightFoot: 2.15 },
 { id: 'skyline_orbit', label: 'CINEMATIC SKYLINE', fov: 60, distDrive: 15.5, heightDrive: 6.4 },
];

export function initCameraDirector(state, systems) {
 state.cameraModeIndex = 0;
 const directorApi = {
  cycleMode: () => cycleCameraMode(state),
  applyPreset: (presetName, camVariant = 1) => applyDirectorPreset(state, systems, presetName, camVariant),
  stageEncounter: (zoneId) => stageTacticalEncounter(state, systems, zoneId),
  updateFraming: (camera, dt) => updateCinematicFraming(camera, state, dt),
 };

 window.__CORAL_DIRECTOR__ = directorApi;
 window.__CORAL_SHOT__ = directorApi;

 const params = new URLSearchParams(window.location.search);
 const preset = params.get('shot') || params.get('preset');
 const camVariant = Number(params.get('cam') || '1');
 if (preset) applyDirectorPreset(state, systems, preset, camVariant);

 return directorApi;
}

export function cycleCameraMode(state) {
 state.cameraModeIndex = ((state.cameraModeIndex || 0) + 1) % CAMERA_MODES.length;
 state.customCamera = null;
 return CAMERA_MODES[state.cameraModeIndex];
}

export function updateCinematicFraming(camera, state, dt) {
 const mode = CAMERA_MODES[state.cameraModeIndex || 0] || CAMERA_MODES[0];
 if (camera && Math.abs(camera.fov - mode.fov) > 0.1) {
  camera.fov += (mode.fov - camera.fov) * Math.min(1, dt * 6);
  camera.updateProjectionMatrix();
 }
}

export function stageTacticalEncounter(state, systems, encounterId = 'palma_pier_ambush') {
 const byId = (id) => state.entities.vehicles.find((v) => v.id === id);
 const heroCar = byId('player_car');
 const peds = state.entities.pedestrians || [];

 if (encounterId === 'ocean_drive_pursuit') {
  if (systems.world?.oceanSky?.setAtmosphere) systems.world.oceanSky.setAtmosphere('sunset');
  state.mode = 'play';
  state.clockHour = 18.65;
  Object.assign(state.player, { inVehicle: true, vehicleId: 'player_car', x: 219.8, z: 34.0 });
  state.wanted.stars = 4;

  // 3/4 rear-left supercar drift center-bottom along Ocean Drive beside white-sand beach & Art-Deco hotels
  if (heroCar) Object.assign(heroCar, { x: 219.8, z: 34.0, rotY: Math.PI + 0.34, driftAngle: -0.06, speed: 32.8, mph: 118, gear: 5, rpm: 86, hp: 86, isPlayerControlled: false });
  if (systems.combat) systems.combat.spawnDriftEffects(219.8, 34.0, Math.PI + 0.28);

  [
   ['mission_convoy', 219.2, -12.0, Math.PI, false],
   ['police_1', 214.4, 30.2, Math.PI + 0.24, false],
   ['police_2', 224.8, 31.4, Math.PI + 0.08, false],
   ['police_3', 214.8, 15.0, Math.PI - 0.16, false],
   ['police_4', 224.2, 8.2, 0.28, false],
   ['traffic_0', 214.0, -3.5, Math.PI, false],
   ['traffic_1', 225.8, 17.0, 0, false],
   ['traffic_2', 219.6, 11.4, 0.72, true],
   ['traffic_3', 225.4, -7.5, 0, false],
  ].forEach(([id, x, z, rotY, wrecked]) => {
   const v = byId(id);
   if (v) Object.assign(v, { x, z, rotY, wrecked, ...(wrecked ? { speed: 0, tiltZ: 0.11, tiltX: -0.05 } : {}) });
  });

  if (systems.combat) {
   systems.combat.spawnExplosion(219.4, 0.85, 11.4, 2.35);
   systems.combat.spawnExplosion(218.1, 1.35, 12.2, 1.25);
   systems.combat.spawnTracer(224.2, 1.38, 29.8, 220.4, 1.25, 12.5, 0xffae2b);
  }

  // Lively beachgoers closer along the right sidewalk/sand + sidewalk bystander on left
  [[234.2, 27.5, 0.4], [238.5, 22.0, -0.35], [241.5, 16.5, 0.25], [236.0, 12.0, -0.45], [244.0, 9.5, 0.2], [206.8, 25.5, -0.15]].forEach(([x, z, rotY], i) => {
   if (peds[i]) Object.assign(peds[i], { x, z, rotY, fleeing: i === 5 });
  });

  if (systems.helicopter) {
   systems.helicopter.heli.position.set(216.2, 16.2, 8.5);
   systems.helicopter.heli.lookAt(192.0, 4.5, 22.0);
   systems.helicopter.heli.rotation.z -= 0.1;
   systems.helicopter.groundPool.position.set(219.8, 0.12, 31.8);
   if (systems.helicopter.alignSpotlightToPool) systems.helicopter.alignSpotlightToPool();
  }
 } else if (encounterId === 'palma_pier_ambush') {
  if (systems.world?.oceanSky?.setAtmosphere) systems.world.oceanSky.setAtmosphere('twilight');
  state.mode = 'play';
  state.clockHour = 20.75;
  Object.assign(state.player, { inVehicle: false, vehicleId: null, x: 217.6, z: 373.8, rotY: Math.PI + 0.04, aiming: true, muzzleTimer: 10 });
  state.wanted.stars = 2;

  if (heroCar) Object.assign(heroCar, { x: 226.2, z: 367.8, rotY: Math.PI - 0.54, isPlayerControlled: false });
  [['police_1', 213.8, 346.5, 0.28], ['police_2', 226.0, 345.8, -0.32]].forEach(([id, x, z, rotY]) => {
   const v = byId(id);
   if (v) Object.assign(v, { x, z, rotY });
  });

  const enemySuv = state.entities.vehicles.find((v) => v.archetypeId === 'mercado_4x4');
  if (enemySuv) Object.assign(enemySuv, { x: 212.6, z: 358.8, rotY: 0.72, isPlayerControlled: false, wrecked: true, tiltZ: -0.09, tiltX: 0.04, speed: 0 });

  // Closer mid-ground syndicate guards + one downed enemy clearly visible on the open center tiled plaza floor
  const enemies = state.entities.enemies || [];
  [[217.4, 367.6, true, 0], [214.8, 364.8, false, 58], [219.2, 363.0, false, 72], [223.4, 365.4, false, 44], [216.8, 360.4, false, 85], [221.4, 359.6, false, 90]].forEach(([x, z, downed, hp], i) => {
   if (enemies[i]) Object.assign(enemies[i], { x, z, downed, hp, alive: !downed, rotY: downed ? 0.9 : Math.atan2(217.6 - x, 373.8 - z) });
  });

  [[207.4, 369.5, 0.25], [230.6, 366.0, -0.25], [207.8, 358.0, 0.18], [231.2, 356.5, -0.2]].forEach(([x, z, rotY], i) => {
   if (peds[i]) Object.assign(peds[i], { x, z, rotY, fleeing: true });
  });

  if (systems.combat) {
   systems.combat.spawnExplosion(212.6, 1.35, 358.8, 1.45);
   systems.combat.spawnExplosion(213.5, 1.0, 359.3, 0.95);
   systems.combat.spawnTracer(217.34, 1.4, 372.9, 219.2, 1.36, 363.0, 0xffae2b);
   systems.combat.spawnTracer(215.05, 1.4, 374.0, 214.8, 1.35, 364.8, 0xffc845);
   systems.combat.spawnTracer(223.4, 1.38, 365.4, 218.0, 1.44, 372.5, 0xff6e1a);
  }

  state.dialogue.speaker = 'VALERIA · TACTICAL LEAD';
  state.dialogue.line = '"Enforcer down at the night market! Pin the syndicate guards and grab the Coral Vortex GT ([F])!"';
 }
}

export function applyDirectorPreset(state, systems, shot, camVariant = 1) {
 state.activeShot = shot;
 if (shot === 'cover' || shot === 'play') {
  stageTacticalEncounter(state, systems, 'ocean_drive_pursuit');
  state.customCamera = camVariant === 2
   ? { x: 218.5, y: 3.45, z: 45.2, lookX: 211.0, lookY: 2.8, lookZ: -14 }
   : { x: 220.6, y: 3.15, z: 43.4, lookX: 212.0, lookY: 2.75, lookZ: -14 };
 } else if (shot === 'combat' || shot === 'end') {
  stageTacticalEncounter(state, systems, 'palma_pier_ambush');
  state.customCamera = { x: 216.0, y: 2.18, z: 377.8, lookX: 219.6, lookY: 1.48, lookZ: 357 };
 } else if (shot === 'map') {
  if (systems.world?.oceanSky?.setAtmosphere) systems.world.oceanSky.setAtmosphere('sunset');
  state.mode = 'pause_map';
  const heroCar = state.entities.vehicles.find((v) => v.id === 'player_car');
  if (heroCar) { heroCar.x = 220; heroCar.z = 110; heroCar.isPlayerControlled = false; }
  state.player.x = 220; state.player.z = 110;
  state.customCamera = { x: 92, y: 28, z: 95, lookX: 150, lookY: 6, lookZ: -35 };
 } else if (shot === 'title' || shot === 'start') {
  if (systems.world?.oceanSky?.setAtmosphere) systems.world.oceanSky.setAtmosphere('sunset');
  state.mode = 'title';
  state.customCamera = { x: 108, y: 24.5, z: 112, lookX: 215, lookY: 14, lookZ: -210 };
 }
}
