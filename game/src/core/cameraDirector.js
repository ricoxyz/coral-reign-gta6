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
  Object.assign(state.player, { inVehicle: true, vehicleId: 'player_car', x: 217.6, z: 34.8 });
  state.wanted.stars = 4;

  // 3/4 rear-left supercar drift along Ocean Drive beside white-sand beach & turquoise ocean
  if (heroCar) Object.assign(heroCar, { x: 217.6, z: 34.8, rotY: Math.PI + 0.14, driftAngle: -0.09, speed: 32.8, mph: 118, gear: 5, rpm: 86, hp: 86, isPlayerControlled: false });
  if (systems.combat) systems.combat.spawnDriftEffects(217.6, 34.8, Math.PI + 0.05);

  [
   ['mission_convoy', 218.5, -24.0, Math.PI],
   ['police_1', 212.0, 25.0, Math.PI + 0.18],
   ['police_2', 224.2, 21.5, Math.PI - 0.18],
   ['police_3', 213.8, 5.5, Math.PI - 0.12],
   ['police_4', 223.2, -5.0, 0.32],
   ['traffic_0', 214.0, -10.5, Math.PI],
   ['traffic_1', 225.2, 9.5, 0],
  ].forEach(([id, x, z, rotY]) => {
   const v = byId(id);
   if (v) Object.assign(v, { x, z, rotY });
  });

  if (systems.combat) {
   systems.combat.spawnExplosion(216.2, 0.95, 12.2, 1.45);
   systems.combat.spawnTracer(223.0, 1.38, 19.5, 218.2, 1.28, 13.5, 0xffae2b);
  }

  // Beachgoers on the white-sand beach & boardwalk on the right, plus sidewalk bystanders
  [[234.5, 31.0, 0.4], [240.5, 25.5, -0.35], [247.2, 18.0, 0.25], [253.5, 11.5, -0.5], [236.2, 15.0, 0.2], [206.5, 24.0, -0.15]].forEach(([x, z, rotY], i) => {
   if (peds[i]) Object.assign(peds[i], { x, z, rotY, fleeing: i === 5 });
  });

  if (systems.helicopter) {
   systems.helicopter.heli.position.set(227.5, 16.0, 8.5);
   systems.helicopter.heli.lookAt(196.0, 5.0, 22.0);
   systems.helicopter.heli.rotation.z -= 0.12;
   systems.helicopter.groundPool.position.set(217.6, 0.12, 31.2);
   if (systems.helicopter.alignSpotlightToPool) systems.helicopter.alignSpotlightToPool();
  }
 } else if (encounterId === 'palma_pier_ambush') {
  if (systems.world?.oceanSky?.setAtmosphere) systems.world.oceanSky.setAtmosphere('twilight');
  state.mode = 'play';
  state.clockHour = 20.75;
  Object.assign(state.player, { inVehicle: false, vehicleId: null, x: 217.5, z: 376.0, rotY: Math.PI + 0.04, aiming: true, muzzleTimer: 10 });
  state.wanted.stars = 2;

  if (heroCar) Object.assign(heroCar, { x: 226.8, z: 368.8, rotY: Math.PI - 0.52, isPlayerControlled: false });
  [['police_1', 213.5, 347.0, 0.25], ['police_2', 226.0, 346.0, -0.3]].forEach(([id, x, z, rotY]) => {
   const v = byId(id);
   if (v) Object.assign(v, { x, z, rotY });
  });

  const enemySuv = state.entities.vehicles.find((v) => v.archetypeId === 'mercado_4x4');
  if (enemySuv) Object.assign(enemySuv, { x: 211.2, z: 358.8, rotY: 0.54, isPlayerControlled: false });

  // One downed enemy on the tiled plaza + syndicate guards behind crates & SUV cover
  const enemies = state.entities.enemies || [];
  [[221.2, 365.4, true, 0], [214.2, 362.0, false, 58], [220.0, 358.2, false, 72], [223.6, 362.8, false, 44], [216.8, 354.5, false, 85], [221.5, 351.2, false, 90]].forEach(([x, z, downed, hp], i) => {
   if (enemies[i]) Object.assign(enemies[i], { x, z, downed, hp, alive: !downed, rotY: Math.atan2(217.5 - x, 376 - z) });
  });

  [[207.2, 370.5, 0.25], [231.0, 366.5, -0.25], [207.6, 358.0, 0.18], [231.5, 356.5, -0.2]].forEach(([x, z, rotY], i) => {
   if (peds[i]) Object.assign(peds[i], { x, z, rotY, fleeing: true });
  });

  if (systems.combat) {
   systems.combat.spawnTracer(217.24, 1.4, 375.1, 220.0, 1.36, 358.2, 0xffae2b);
   systems.combat.spawnTracer(214.95, 1.4, 376.2, 214.2, 1.35, 362.0, 0xffc845);
   systems.combat.spawnTracer(214.2, 1.38, 362.0, 217.0, 1.44, 374.5, 0xff6e1a);
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
   ? { x: 207.5, y: 3.4, z: 45.2, lookX: 234.0, lookY: 2.8, lookZ: -14 }
   : { x: 209.8, y: 2.95, z: 42.4, lookX: 233.5, lookY: 2.6, lookZ: -12 };
 } else if (shot === 'combat' || shot === 'end') {
  stageTacticalEncounter(state, systems, 'palma_pier_ambush');
  state.customCamera = { x: 215.8, y: 2.32, z: 380.8, lookX: 220.4, lookY: 1.52, lookZ: 355 };
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
