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
  state.mode = 'play';
  Object.assign(state.player, { inVehicle: true, vehicleId: 'player_car', x: 111.5, z: 35.8 });
  state.wanted.stars = 4;

  if (heroCar) Object.assign(heroCar, { x: 111.8, z: 35.8, rotY: Math.PI + 0.28, driftAngle: -0.24, speed: 32.8, mph: 118, gear: 5, rpm: 86, hp: 86, isPlayerControlled: false });
  if (systems.combat) systems.combat.spawnDriftEffects(111.8, 35.8, Math.PI + 0.12);

  [
   ['mission_convoy', 109.0, -18.0, Math.PI],
   ['police_1', 104.2, 34.0, Math.PI + 0.22],
   ['police_2', 119.5, 31.4, Math.PI - 0.24],
   ['police_3', 104.8, 16.5, Math.PI - 0.14],
   ['police_4', 117.8, 8.2, 0.35],
   ['traffic_0', 104.5, -4.0, Math.PI],
   ['traffic_1', 116.8, 21.5, 0],
  ].forEach(([id, x, z, rotY]) => {
   const v = byId(id);
   if (v) Object.assign(v, { x, z, rotY });
  });

  if (systems.combat) {
   systems.combat.spawnExplosion(115.2, 1.05, 10.5, 1.75);
   systems.combat.spawnTracer(118.4, 1.38, 28.5, 113.2, 1.28, 19.5, 0xffdf40);
  }

  [[97.5, 32.0, 0.2], [123.5, 28.0, -0.25], [97.8, 19.0, 0.15], [123.2, 16.0, -0.15]].forEach(([x, z, rotY], i) => {
   if (peds[i]) Object.assign(peds[i], { x, z, rotY, fleeing: true });
  });

  if (systems.helicopter) {
   systems.helicopter.heli.position.set(116.5, 16.5, 12.0);
   systems.helicopter.heli.lookAt(111.8, 1.5, 35.8);
   systems.helicopter.groundPool.position.set(111.8, 0.12, 35.8);
  }
 } else if (encounterId === 'palma_pier_ambush') {
  state.mode = 'play';
  Object.assign(state.player, { inVehicle: false, vehicleId: null, x: 217.5, z: 376.0, rotY: Math.PI + 0.06, aiming: true, muzzleTimer: 10 });
  state.wanted.stars = 2;

  if (heroCar) Object.assign(heroCar, { x: 224.4, z: 370.8, rotY: Math.PI - 0.42, isPlayerControlled: false });
  [['police_1', 213.5, 350.0, 0.25], ['police_2', 225.5, 348.0, -0.3]].forEach(([id, x, z, rotY]) => {
   const v = byId(id);
   if (v) Object.assign(v, { x, z, rotY });
  });

  const enemySuv = state.entities.vehicles.find((v) => v.archetypeId === 'mercado_4x4');
  if (enemySuv) Object.assign(enemySuv, { x: 211.2, z: 359.2, rotY: 0.58, isPlayerControlled: false });

  const enemies = state.entities.enemies || [];
  [[221.2, 368.4, true, 0], [213.8, 361.5, false, 58], [220.4, 358.2, false, 72], [223.8, 362.8, false, 44], [216.2, 354.5, false, 85], [221.5, 351.2, false, 90]].forEach(([x, z, downed, hp], i) => {
   if (enemies[i]) Object.assign(enemies[i], { x, z, downed, hp, alive: !downed, rotY: Math.atan2(217.5 - x, 376 - z) });
  });

  [[207.2, 370.5, 0.25], [229.4, 366.5, -0.25], [207.6, 358.0, 0.18], [229.8, 356.5, -0.2]].forEach(([x, z, rotY], i) => {
   if (peds[i]) Object.assign(peds[i], { x, z, rotY, fleeing: true });
  });

  if (systems.combat) {
   systems.combat.spawnTracer(217.85, 1.38, 375.1, 220.4, 1.32, 358.2, 0xffdf40);
   systems.combat.spawnTracer(215.3, 1.38, 376.8, 213.8, 1.35, 361.5, 0xffe066);
   systems.combat.spawnTracer(213.8, 1.38, 361.5, 216.9, 1.45, 374.5, 0xff7e29);
   systems.combat.spawnExplosion(210.2, 1.1, 358.4, 1.35);
  }

  state.dialogue.speaker = 'VALERIA · TACTICAL LEAD';
  state.dialogue.line = '"Enforcer down at Palma Pier! Grab the Coral Vortex GT ([F]) before SWAT boxes us in!"';
 }
}

export function applyDirectorPreset(state, systems, shot, camVariant = 1) {
 state.activeShot = shot;
 if (shot === 'cover' || shot === 'play') {
  stageTacticalEncounter(state, systems, 'ocean_drive_pursuit');
  state.customCamera = camVariant === 2
   ? { x: 103.0, y: 3.8, z: 49.5, lookX: 118, lookY: 3.4, lookZ: -14 }
   : { x: 106.0, y: 3.25, z: 45.8, lookX: 115.2, lookY: 2.95, lookZ: -10 };
 } else if (shot === 'combat' || shot === 'end') {
  stageTacticalEncounter(state, systems, 'palma_pier_ambush');
  state.customCamera = { x: 215.3, y: 2.38, z: 381.4, lookX: 220.8, lookY: 1.48, lookZ: 356 };
 } else if (shot === 'map') {
  state.mode = 'pause_map';
  state.customCamera = { x: 92, y: 28, z: 95, lookX: 150, lookY: 6, lookZ: -35 };
 } else if (shot === 'title' || shot === 'start') {
  state.mode = 'title';
  state.customCamera = { x: 108, y: 24.5, z: 112, lookX: 215, lookY: 14, lookZ: -210 };
 }
}
