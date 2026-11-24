// Cinematic Camera & Tactical Scenario Director for CORAL REIGN: Palma Dorada
export const CAMERA_MODES = [
 ['chase_dynamic', 'DYNAMIC PURSUIT', 62, 11.2, 3.9, 0, 0], ['chase_low', 'STREET DRIFT', 66, 9.4, 2.75, 0, 0],
 ['tactical_ots', 'OVER-THE-SHOULDER', 58, 0, 0, 4.8, 2.15], ['skyline_orbit', 'CINEMATIC SKYLINE', 60, 15.5, 6.4, 0, 0],
].map(([id, label, fov, distDrive, heightDrive, distFoot, heightFoot]) => ({ id, label, fov, distDrive, heightDrive, ...(distFoot ? { distFoot, heightFoot } : {}) }));

export function initCameraDirector(state, systems) {
 state.cameraModeIndex = 0;
 const api = {
  cycleMode: () => cycleCameraMode(state),
  applyPreset: (p, c = 1) => applyDirectorPreset(state, systems, p, c),
  stageEncounter: (z) => stageTacticalEncounter(state, systems, z),
  updateFraming: (cam, dt) => updateCinematicFraming(cam, state, dt),
 };
 window.__CORAL_DIRECTOR__ = window.__CORAL_SHOT__ = api;
 const q = new URLSearchParams(window.location.search), preset = q.get('shot') || q.get('preset');
 if (preset) applyDirectorPreset(state, systems, preset, Number(q.get('cam') || '1'));
 return api;
}

export function cycleCameraMode(state) {
 state.cameraModeIndex = ((state.cameraModeIndex || 0) + 1) % CAMERA_MODES.length;
 state.customCamera = null;
 return CAMERA_MODES[state.cameraModeIndex];
}

export function updateCinematicFraming(camera, state, dt) {
 const m = CAMERA_MODES[state.cameraModeIndex || 0] || CAMERA_MODES[0];
 if (camera && Math.abs(camera.fov - m.fov) > .1) {
  camera.fov += (m.fov - camera.fov) * Math.min(1, dt * 6);
  camera.updateProjectionMatrix();
 }
}

export function stageTacticalEncounter(state, systems, id = 'palma_pier_ambush') {
 const byId = (k) => state.entities.vehicles.find((v) => v.id === k);
 const hero = byId('player_car'), peds = state.entities.pedestrians || [], cb = systems.combat, hl = systems.helicopter;
 systems.world?.oceanSky?.setAtmosphere?.(id === 'palma_pier_ambush' ? 'twilight' : 'sunset');

 if (id === 'ocean_drive_pursuit') {
  state.mode = 'play'; state.clockHour = 18.65; state.wanted.stars = 4;
  Object.assign(state.player, { inVehicle: true, vehicleId: 'player_car', x: 219.8, z: 34 });
  if (hero) Object.assign(hero, { x: 219.8, z: 34, rotY: Math.PI + .34, driftAngle: -.06, speed: 32.8, mph: 118, gear: 5, rpm: 86, hp: 86, isPlayerControlled: false });
  cb?.spawnDriftEffects(219.8, 34, Math.PI + .28);
  [['mission_convoy', 219.2, -12, Math.PI, 0], ['police_1', 214.4, 30.2, Math.PI + .24, 0], ['police_2', 224.8, 31.4, Math.PI + .08, 0], ['police_3', 214.8, 15, Math.PI - .16, 0], ['police_4', 224.2, 8.2, .28, 0], ['traffic_0', 214, -3.5, Math.PI, 0], ['traffic_1', 225.8, 17, 0, 0], ['traffic_2', 219.6, 11.4, .72, 1], ['traffic_3', 225.4, -7.5, 0, 0]].forEach(([vid, x, z, rotY, wr]) => {
   const v = byId(vid); if (v) Object.assign(v, { x, z, rotY, wrecked: Boolean(wr), ...(wr ? { speed: 0, tiltZ: .11, tiltX: -.05 } : {}) });
  });
  if (cb) { cb.spawnExplosion(219.4, .85, 11.4, 2.35); cb.spawnExplosion(218.1, 1.35, 12.2, 1.25); cb.spawnTracer(224.2, 1.38, 29.8, 220.4, 1.25, 12.5, 0xffae2b); }
  [[234.2, 27.5, .4], [238.5, 22, -.35], [241.5, 16.5, .25], [236, 12, -.45], [244, 9.5, .2], [206.8, 25.5, -.15]].forEach(([x, z, rotY], i) => { if (peds[i]) Object.assign(peds[i], { x, z, rotY, fleeing: i === 5 }); });
  if (hl) { hl.heli.position.set(216.2, 16.2, 8.5); hl.heli.lookAt(192, 4.5, 22); hl.heli.rotation.z -= .1; hl.groundPool.position.set(219.8, .12, 31.8); hl.alignSpotlightToPool?.(); }
 } else if (id === 'palma_pier_ambush') {
  state.mode = 'play'; state.clockHour = 20.75; state.wanted.stars = 2;
  Object.assign(state.player, { inVehicle: false, vehicleId: null, x: 217.6, z: 373.8, rotY: Math.PI + .04, aiming: true, muzzleTimer: 10 });
  if (hero) Object.assign(hero, { x: 226.2, z: 367.8, rotY: Math.PI - .54, isPlayerControlled: false });
  [['police_1', 213.8, 346.5, .28], ['police_2', 226, 345.8, -.32]].forEach(([vid, x, z, rotY]) => { const v = byId(vid); if (v) Object.assign(v, { x, z, rotY }); });
  const suv = state.entities.vehicles.find((v) => v.archetypeId === 'mercado_4x4');
  if (suv) Object.assign(suv, { x: 212.6, z: 358.8, rotY: .72, isPlayerControlled: false, wrecked: true, tiltZ: -.09, tiltX: .04, speed: 0 });
  const ens = state.entities.enemies || [];
  [[217.4, 367.6, true, 0], [214.8, 364.8, false, 58], [219.2, 363, false, 72], [223.4, 365.4, false, 44], [216.8, 360.4, false, 85], [221.4, 359.6, false, 90]].forEach(([x, z, downed, hp], i) => {
   if (ens[i]) Object.assign(ens[i], { x, z, downed, hp, alive: !downed, rotY: downed ? .9 : Math.atan2(217.6 - x, 373.8 - z) });
  });
  [[207.4, 369.5, .25], [230.6, 366, -.25], [207.8, 358, .18], [231.2, 356.5, -.2]].forEach(([x, z, rotY], i) => { if (peds[i]) Object.assign(peds[i], { x, z, rotY, fleeing: true }); });
  if (cb) {
   cb.spawnExplosion(212.6, 1.35, 358.8, 1.45); cb.spawnExplosion(213.5, 1, 359.3, .95);
   cb.spawnTracer(217.34, 1.4, 372.9, 219.2, 1.36, 363, 0xffae2b); cb.spawnTracer(215.05, 1.4, 374, 214.8, 1.35, 364.8, 0xffc845); cb.spawnTracer(223.4, 1.38, 365.4, 218, 1.44, 372.5, 0xff6e1a);
  }
  state.dialogue.speaker = 'VALERIA · TACTICAL LEAD';
  state.dialogue.line = '"Enforcer down at the night market! Pin the syndicate guards and grab the Coral Vortex GT ([F])!"';
 }
}

export function applyDirectorPreset(state, systems, shot, cam = 1) {
 state.activeShot = shot;
 const atmos = (m) => systems.world?.oceanSky?.setAtmosphere?.(m);
 if (shot === 'cover' || shot === 'play') {
  stageTacticalEncounter(state, systems, 'ocean_drive_pursuit');
  state.customCamera = cam === 2 ? { x: 218.5, y: 3.45, z: 45.2, lookX: 211, lookY: 2.8, lookZ: -14 } : { x: 220.6, y: 3.15, z: 43.4, lookX: 212, lookY: 2.75, lookZ: -14 };
 } else if (shot === 'combat' || shot === 'end') {
  stageTacticalEncounter(state, systems, 'palma_pier_ambush');
  state.customCamera = { x: 216, y: 2.18, z: 377.8, lookX: 219.6, lookY: 1.48, lookZ: 357 };
 } else if (shot === 'map') {
  atmos('sunset'); state.mode = 'pause_map';
  const hero = state.entities.vehicles.find((v) => v.id === 'player_car');
  if (hero) Object.assign(hero, { x: 220, z: 110, isPlayerControlled: false });
  state.player.x = 220; state.player.z = 110; state.customCamera = { x: 92, y: 28, z: 95, lookX: 150, lookY: 6, lookZ: -35 };
 } else if (shot === 'title' || shot === 'start') {
  atmos('sunset'); state.mode = 'title'; state.customCamera = { x: 108, y: 24.5, z: 112, lookX: 215, lookY: 14, lookZ: -210 };
 }
}
