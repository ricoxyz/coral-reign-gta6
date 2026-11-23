// Main Entrypoint & System Orchestrator for CORAL REIGN: Palma Dorada (29 Modular ES Files)
import { createGameState } from './core/state.js';
import { EventBus, bindInputControls } from './core/events.js';
import { GameLoop, updateThirdPersonCamera } from './core/loop.js';
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
import { applyShotHooksFromUrl } from './shotHooks.js';

function bootCoralReign() {
  const THREE = window.THREE;
  const params = new URLSearchParams(window.location.search);
  const seed = Number(params.get('seed') || '101');

  const state = createGameState(seed);
  const events = new EventBus();
  const soundEngine = new SoundEngine();

  // Initialize WebGL Renderer & Perspective Camera
  const canvas = document.getElementById('game-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x3a2042, 0.00135);

  const camera = new THREE.PerspectiveCamera(
    62,
    window.innerWidth / window.innerHeight,
    0.5,
    1800
  );

  // Build 3D World, Entities, Police, Gameplay, Audio & Save Systems
  const world = buildPalmaDoradaWorld(scene, state);
  const traffic = initTrafficVehicles(scene, state);
  const playerEntity = initPlayerEntity(scene, state);
  const pedsAndEnemies = initPedestriansAndEnemies(scene, state);
  const crew = initCrewSystem(scene, state, events, soundEngine);
  const policeAI = initPoliceDispatchAI(scene, state);
  const helicopter = initPoliceHelicopter(scene, state);
  const roadblocks = initPoliceRoadblocks(scene, state);
  const weaponsSys = initWeaponsSystem(state, events, soundEngine);
  const combat = initCombatSystem(scene, state, events, weaponsSys, soundEngine);
  const missions = initMissionSystem(scene, state, soundEngine);
  const activities = initSideActivities(scene, state, soundEngine);
  initRadioSystem(state, events, soundEngine);
  const saveSystem = initSaveSystem(state, events, soundEngine);

  bindInputControls(state, events);
  bindMenuButtons(state, saveSystem, events, soundEngine);

  events.on('action:hijack', () => {
    tryHijackOrExitVehicle(state, traffic.vehicles, soundEngine);
    events.emit('ui:refresh');
  });

  const refreshOverlays = () => {
    updateHUD(state, weaponsSys, camera);
    renderFullPauseMap(state, saveSystem);
    updateTitleScreen(state, saveSystem, events);
  };
  events.on('ui:refresh', refreshOverlays);

  // Apply deterministic URL screenshot presets if ?shot= is present
  applyShotHooksFromUrl(state, {
    world,
    traffic,
    playerEntity,
    pedsAndEnemies,
    policeAI,
    helicopter,
    combat,
    missions,
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    refreshOverlays();
  });

  // Expose deterministic inspection handle for automated Playwright verification
  window.__CORAL_REIGN__ = {
    state,
    events,
    saveSystem,
    tryHijack: () => tryHijackOrExitVehicle(state, traffic.vehicles, soundEngine),
    fireWeapon: () => events.emit('combat:fire'),
    toggleMap: () => events.emit('ui:toggleMap'),
  };

  // Run one initial simulation & UI frame immediately
  const updateAll = (dt) => {
    world.update(state.time);
    traffic.update(dt, world.colliders);
    playerEntity.update(dt, world.colliders);
    pedsAndEnemies.update(dt);
    crew.update(dt);
    policeAI.update(dt, state.time);
    helicopter.update(dt, state.time);
    roadblocks.update(state.time);
    combat.update(dt);
    missions.update(dt, state.time);
    activities.update(dt, state.time);
    updateWantedLevel(state, dt);
    updateProgression(state);
  };

  const renderAll = () => {
    updateThirdPersonCamera(camera, state, traffic.vehicles);
    renderer.render(scene, camera);
    refreshOverlays();
  };

  updateAll(0.016);
  renderAll();

  const loop = new GameLoop(state, updateAll, renderAll);
  loop.start();
}

bootCoralReign();
