// Centralized reactive game state for CORAL REIGN: Palma Dorada
import { createSeededRng, WORLD_CONFIG } from './config.js';

export function createGameState(seed = 101) {
 const rng = createSeededRng(seed);
 return {
  seed, rng, time: 0, clockHour: WORLD_CONFIG.dayStartHour, mode: 'play', activeShot: null, activeSlot: 1, hijackPromptScreen: null,
  player: {
   x: 110, y: 0, z: 40, rotY: 0, vx: 0, vz: 0, health: 92, maxHealth: 100, armor: 85, maxArmor: 100, stamina: 100,
   inVehicle: true, vehicleId: 'player_car', weaponIndex: 3, aiming: false, firing: false, muzzleTimer: 0, walkCycle: 0, cash: 24850, respect: 14200, rank: 14, rankTitle: 'KINGPIN',
  },
  wanted: {
   stars: 4, heat: 82, evadeTimer: 0, code: 'CODE RED • IN SIGHT', units: [],
   dispatches: [{ unit: 'CORAL-12', action: 'RAMMING' }, { unit: 'MARINA-4', action: 'FLANKING' }, { unit: 'AIR-1', action: 'SPOTLIGHT' }, { unit: 'TAC-9', action: 'ROADBLOCK' }],
  },
  crew: {
   partnerName: 'Valeria', partnerRole: 'Tactical Lead',
   abilities: { swapPlates: { key: 'Z', label: 'PLATES', cooldown: 0, maxCooldown: 18 }, fieldRepair: { key: 'X', label: 'REPAIR', cooldown: 0, maxCooldown: 22 }, policeJammer: { key: 'C', label: 'JAMMER', cooldown: 0, maxCooldown: 30 } },
  },
  mission: {
   currentIndex: 6, stageIndex: 2, totalStages: 4, title: 'SOLANA GOLD CONVOY', objective: 'Break TAC-9 barricade & reach Coral Marina',
   rewardCash: 45000, rewardRespect: 1200, waypoint: { x: 110, z: -165 }, distance: 180,
  },
  dialogue: { speaker: 'VALERIA · TACTICAL LEAD', line: '"Chopper spotlight is locked on us, Dani! Cut east past Solana Pier to shake TAC-9!"', portraitSeed: 2, timer: 12 },
  stats: { netWorth: 248500, missionsDone: 7, missionsTotal: 10, shellsCollected: 16, shellsTotal: 24, stuntsCompleted: 6, stuntsTotal: 10, racesWon: 3, racesTotal: 5, crewCount: 3, crewTotal: 3, carsHijacked: 34, evasions: 19, completionPct: 68.4 },
  radio: { stationIndex: 0, muted: false },
  input: { keys: {}, mouseDown: false, mouseX: 0, mouseY: 0, cameraYaw: 0, cameraPitch: .24 },
  entities: { vehicles: [], pedestrians: [], enemies: [], tracers: [], particles: [], collectibles: [], roadblocks: [] },
 };
}
