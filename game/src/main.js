// Main Entrypoint & System Orchestrator for CORAL REIGN: Palma Dorada
import { createGameState } from './core/state.js';
import { EventBus, bindInputControls } from './core/events.js';
import { GameLoop, updateThirdPersonCamera } from './core/loop.js';
import { initCameraDirector } from './core/cameraDirector.js';
import { buildPalmaDoradaWorld } from './world/cityBuilder.js';
import { initTrafficVehicles } from './entities/traffic.js';
import { tryHijackOrExitVehicle } from './entities/vehiclePhysics.js';
import { initPlayerEntity } from './entities/player.js';
import { initPedestriansAndEnemies } from './entities/pedestrians.js';
import { initCrewSystem } from './entities/crew.js';
import { updateWantedLevel } from './police/wantedSystem.js';
import { initPoliceDispatchAI } from './police/dispatchAI.js';
import { initPoliceHelicopter } from './police/helicopter.js';
import { initPoliceRoadblocks } from './police/roadblocks.js';
import { initWeaponsSystem } from './gameplay/weapons.js';
import { initCombatSystem } from './gameplay/combat.js';
import { initMissionSystem } from './gameplay/missions.js';
import { initSideActivities } from './gameplay/activities.js';
import { updateProgression } from './gameplay/progression.js';
import { updateHUD } from './ui/hud.js';
import { renderFullPauseMap } from './ui/pauseMap.js';
import { updateTitleScreen, bindMenuButtons } from './ui/titleScreen.js';
import { SoundEngine } from './audio/soundEngine.js';
import { initRadioSystem } from './audio/radio.js';
import { initSaveSystem } from './storage/saveSystem.js';

function bootCoralReign() {
 const THREE = window.THREE, params = new URLSearchParams(window.location.search);
 const state = createGameState(Number(params.get('seed') || '101')), events = new EventBus(), soundEngine = new SoundEngine();
 const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas'), antialias: true, powerPreference: 'high-performance' });
 renderer.setSize(window.innerWidth, window.innerHeight); renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

 const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xe89b6c, .00038);
 const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, .5, 2600);

 const world = buildPalmaDoradaWorld(scene, state), traffic = initTrafficVehicles(scene, state);
 const playerEntity = initPlayerEntity(scene, state), pedsAndEnemies = initPedestriansAndEnemies(scene, state);
 const crew = initCrewSystem(scene, state, events, soundEngine), policeAI = initPoliceDispatchAI(scene, state);
 const helicopter = initPoliceHelicopter(scene, state), roadblocks = initPoliceRoadblocks(scene, state);
 const weaponsSys = initWeaponsSystem(state, events, soundEngine), combat = initCombatSystem(scene, state, events, weaponsSys, soundEngine);
 const missions = initMissionSystem(scene, state, soundEngine), activities = initSideActivities(scene, state, soundEngine);
 const radioSys = initRadioSystem(state, events, soundEngine), saveSystem = initSaveSystem(state, events, soundEngine);

 bindInputControls(state, events); bindMenuButtons(state, saveSystem, events, soundEngine);
 events.on('action:hijack', () => { tryHijackOrExitVehicle(state, traffic.vehicles, soundEngine); events.emit('ui:refresh'); });

 const refreshOverlays = () => { updateHUD(state, weaponsSys, camera); renderFullPauseMap(state, saveSystem); updateTitleScreen(state, saveSystem, events); };
 events.on('ui:refresh', refreshOverlays);
 const director = initCameraDirector(state, { world, traffic, playerEntity, pedsAndEnemies, policeAI, helicopter, combat, missions });

 window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight); refreshOverlays();
 });
 window.__CORAL_REIGN__ = { state, events, saveSystem, director, tryHijack: () => tryHijackOrExitVehicle(state, traffic.vehicles, soundEngine), fireWeapon: () => events.emit('combat:fire'), toggleMap: () => events.emit('ui:toggleMap') };

 const updateAll = (dt) => {
  world.update(state.time); traffic.update(dt, world.colliders); playerEntity.update(dt, world.colliders);
  pedsAndEnemies.update(dt); crew.update(dt); policeAI.update(dt, state.time); helicopter.update(dt, state.time);
  roadblocks.update(state.time); combat.update(dt); missions.update(dt, state.time); activities.update(dt, state.time);
  radioSys.updateSequencer(dt); updateWantedLevel(state, dt); updateProgression(state); director.updateFraming(camera, dt);
 };
 const renderAll = () => { updateThirdPersonCamera(camera, state, traffic.vehicles); renderer.render(scene, camera); refreshOverlays(); };

 updateAll(.016); renderAll();
 new GameLoop(state, updateAll, renderAll).start();
}

bootCoralReign();
