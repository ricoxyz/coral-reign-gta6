// Core configuration, world bounds, districts, vehicle archetypes, weapons, and deterministic RNG
export const GAME_TITLE = 'CORAL REIGN';
export const CITY_NAME = 'Palma Dorada';

export const WORLD_CONFIG = {
 citySize: 1200, blockSize: 90, roadWidth: 24, sidewalkWidth: 5,
 oceanX: 280, beachWidth: 55, gravity: 28, dayStartHour: 18.65,
};

export const PALETTE = {
 skyTop: 0x3b86e6, skyMid: 0xffa66b, skyHorizon: 0xffe49e, sunGlow: 0xfff5c0,
 oceanDeep: 0x0082a8, oceanShallow: 0x1ee3cf, sandGold: 0xf7d794, asphalt: 0x3c4352,
 laneGold: 0xffc83b, neonPink: 0xff4d79, neonCyan: 0x00e5ff, neonAmber: 0xff7e29,
 policeRed: 0xff1744, policeBlue: 0x00b0ff,
};

export const VEHICLE_ARCHETYPES = [
 { id: 'vortex_gt', name: 'Coral Vortex GT', cls: 'EXOTIC', topSpeed: 162, accel: 38, handling: 3.4, color: 0xff3b14, accent: 0x161c28, length: 4.8, width: 2.18, height: 1.26 },
 { id: 'solaris_rs', name: 'Solaris Aero RS', cls: 'SPORTS', topSpeed: 148, accel: 34, handling: 3.1, color: 0xffcc29, accent: 0x1e2430, length: 4.6, width: 2.05, height: 1.32 },
 { id: 'mirador_lux', name: 'Mirador Cabrio V8', cls: 'LUXURY', topSpeed: 132, accel: 28, handling: 2.8, color: 0x19e6d8, accent: 0xffffff, length: 4.9, width: 2.1, height: 1.38 },
 { id: 'mercado_4x4', name: 'Mercado Titan 4x4', cls: 'SUV', topSpeed: 118, accel: 26, handling: 2.5, color: 0xc8372d, accent: 0x1d222b, length: 5.1, width: 2.3, height: 1.78 },
 { id: 'bullion_van', name: 'Dorada Armored Transport', cls: 'HEAVY', topSpeed: 105, accel: 22, handling: 2.1, color: 0xf5c542, accent: 0x222b3a, length: 5.9, width: 2.45, height: 2.25 },
 { id: 'palma_pd', name: 'Palma PD Interceptor', cls: 'POLICE', topSpeed: 154, accel: 36, handling: 3.3, color: 0x0f2547, accent: 0xffffff, length: 4.85, width: 2.14, height: 1.38 },
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
