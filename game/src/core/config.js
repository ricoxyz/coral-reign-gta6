// Core configuration, world bounds, districts, vehicle archetypes, weapons, and deterministic RNG
export const GAME_TITLE = 'CORAL REIGN';
export const CITY_NAME = 'Palma Dorada';

export const WORLD_CONFIG = {
  citySize: 1200,
  blockSize: 90,
  roadWidth: 24,
  sidewalkWidth: 5,
  oceanX: 280,
  beachWidth: 55,
  gravity: 28,
  dayStartHour: 18.65, // Golden hour sunset
};

export const PALETTE = {
  skyTop: 0x160f38,
  skyMid: 0x992e62,
  skyHorizon: 0xff7b42,
  sunGlow: 0xffcf56,
  oceanDeep: 0x062c4c,
  oceanShallow: 0x00a8c8,
  sandGold: 0xe6c187,
  asphalt: 0x1e222d,
  laneGold: 0xffbf3c,
  neonPink: 0xff3b78,
  neonCyan: 0x00f0ff,
  neonAmber: 0xff9e2c,
  policeRed: 0xff1e42,
  policeBlue: 0x1e88ff,
};

export const VEHICLE_ARCHETYPES = [
  { id: 'vortex_gt', name: 'Coral Vortex GT', cls: 'EXOTIC', topSpeed: 162, accel: 38, handling: 3.4, color: 0xff3b78, accent: 0x00f0ff, length: 4.8, width: 2.15, height: 1.25 },
  { id: 'solaris_rs', name: 'Solaris Aero RS', cls: 'SPORTS', topSpeed: 148, accel: 34, handling: 3.1, color: 0xffae19, accent: 0x151922, length: 4.6, width: 2.05, height: 1.32 },
  { id: 'mirador_lux', name: 'Mirador Cabrio V8', cls: 'LUXURY', topSpeed: 132, accel: 28, handling: 2.8, color: 0x00d8f0, accent: 0xffffff, length: 4.9, width: 2.1, height: 1.38 },
  { id: 'mercado_4x4', name: 'Mercado Titan 4x4', cls: 'SUV', topSpeed: 118, accel: 26, handling: 2.5, color: 0x32d885, accent: 0x11151c, length: 5.1, width: 2.3, height: 1.78 },
  { id: 'bullion_van', name: 'Dorada Armored Transport', cls: 'HEAVY', topSpeed: 105, accel: 22, handling: 2.1, color: 0xd4af37, accent: 0x1b2230, length: 5.9, width: 2.45, height: 2.25 },
  { id: 'palma_pd', name: 'Palma PD Interceptor', cls: 'POLICE', topSpeed: 154, accel: 36, handling: 3.3, color: 0x101828, accent: 0xffffff, length: 4.85, width: 2.12, height: 1.38 },
];

export function createSeededRng(seed = 101) {
  let s = (seed >>> 0) || 101;
  return function nextRandom() {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
