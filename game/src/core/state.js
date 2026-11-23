// Centralized reactive game state for CORAL REIGN: Palma Dorada
import { createSeededRng, WORLD_CONFIG } from './config.js';

export function createGameState(seed = 101) {
  const rng = createSeededRng(seed);
  return {
    seed,
    rng,
    time: 0,
    clockHour: WORLD_CONFIG.dayStartHour,
    mode: 'play', // 'play' | 'pause_map' | 'title'
    activeShot: null,
    activeSlot: 1,
    player: {
      x: 110,
      y: 0,
      z: 40,
      rotY: 0,
      vx: 0,
      vz: 0,
      health: 100,
      maxHealth: 100,
      armor: 85,
      maxArmor: 100,
      stamina: 100,
      inVehicle: true,
      vehicleId: 'player_car',
      weaponIndex: 3, // Carbine AR-9
      aiming: false,
      firing: false,
      muzzleTimer: 0,
      walkCycle: 0,
      cash: 248500,
      respect: 14200,
      rank: 14,
      rankTitle: 'KINGPIN',
    },
    wanted: {
      stars: 4,
      heat: 82,
      evadeTimer: 0,
      code: 'CODE RED • AIR & TACTICAL',
      units: [],
      dispatches: [
        { unit: 'CORAL-12', action: 'RAMMING INTERCEPT (24m)' },
        { unit: 'MARINA-4', action: 'FLANKING BOULEVARD (38m)' },
        { unit: 'AIR-1 HELI', action: 'SPOTLIGHT LOCKED' },
        { unit: 'TAC-9', action: 'SPIKE BARRICADE AHEAD' },
      ],
    },
    crew: {
      partnerName: 'Valeria',
      partnerRole: 'Tactical Lead',
      abilities: {
        swapPlates: { key: 'Z', label: 'PLATES', cooldown: 0, maxCooldown: 18 },
        fieldRepair: { key: 'X', label: 'REPAIR', cooldown: 0, maxCooldown: 22 },
        policeJammer: { key: 'C', label: 'JAMMER', cooldown: 0, maxCooldown: 30 },
      },
    },
    mission: {
      currentIndex: 3, // 04 / 10
      stageIndex: 1,
      totalStages: 3,
      title: 'SUNSET GOLD CONVOY HEIST',
      objective: 'Hijack the armored bullion transport & evade 4-Star Tactical Police along Solana Strip',
      rewardCash: 45000,
      rewardRespect: 1200,
      waypoint: { x: 110, z: -165 },
      distance: 180,
    },
    dialogue: {
      speaker: 'VALERIA • CREW TACTICAL LEAD',
      line: '"Chopper spotlight is on your tail, Dani! Cut through Coral Marina bridge to shake TAC-9!"',
      portraitSeed: 2,
      timer: 12,
    },
    stats: {
      netWorth: 642800,
      shellsCollected: 18,
      shellsTotal: 24,
      stuntsCompleted: 8,
      stuntsTotal: 10,
      racesWon: 4,
      racesTotal: 5,
      carsHijacked: 34,
      evasions: 19,
      completionPct: 68,
    },
    radio: {
      stationIndex: 0,
      muted: false,
    },
    input: {
      keys: {},
      mouseDown: false,
      mouseX: 0,
      mouseY: 0,
      cameraYaw: 0,
      cameraPitch: 0.24,
    },
    entities: {
      vehicles: [],
      pedestrians: [],
      enemies: [],
      tracers: [],
      particles: [],
      collectibles: [],
      roadblocks: [],
    },
  };
}
