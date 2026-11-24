// Core config, world bounds, palette, vehicle archetypes & deterministic RNG
export const GAME_TITLE = 'CORAL REIGN', CITY_NAME = 'Palma Dorada';
export const WORLD_CONFIG = { citySize: 1200, blockSize: 90, roadWidth: 24, sidewalkWidth: 5, oceanX: 280, beachWidth: 55, gravity: 28, dayStartHour: 18.65 };
export const PALETTE = {
 skyTop: 0x3b86e6, skyMid: 0xffa66b, skyHorizon: 0xffe49e, sunGlow: 0xfff5c0, oceanDeep: 0x0082a8, oceanShallow: 0x1ee3cf,
 sandGold: 0xf7d794, asphalt: 0x3c4352, laneGold: 0xffc83b, neonPink: 0xff4d79, neonCyan: 0x00e5ff, neonAmber: 0xff7e29, policeRed: 0xff1744, policeBlue: 0x00b0ff,
};

export const VEHICLE_ARCHETYPES = [
 ['vortex_gt', 'Coral Vortex GT', 'EXOTIC', 162, 38, 3.4, 0xff3b14, 0x161c28, 4.8, 2.18, 1.26],
 ['solaris_rs', 'Solaris Aero RS', 'SPORTS', 148, 34, 3.1, 0xffcc29, 0x1e2430, 4.6, 2.05, 1.32],
 ['mirador_lux', 'Mirador Cabrio V8', 'LUXURY', 132, 28, 2.8, 0x19e6d8, 0xffffff, 4.9, 2.1, 1.38],
 ['mercado_4x4', 'Mercado Titan 4x4', 'SUV', 118, 26, 2.5, 0xc8372d, 0x1d222b, 5.1, 2.3, 1.78],
 ['bullion_van', 'Dorada Armored Transport', 'HEAVY', 105, 22, 2.1, 0xf5c542, 0x222b3a, 5.9, 2.45, 2.25],
 ['palma_pd', 'Palma PD Interceptor', 'POLICE', 154, 36, 3.3, 0x0f2547, 0xffffff, 4.85, 2.14, 1.38],
].map(([id, name, cls, topSpeed, accel, handling, color, accent, length, width, height]) => ({ id, name, cls, topSpeed, accel, handling, color, accent, length, width, height }));

export function createSeededRng(seed = 101) {
 let s = (seed >>> 0) || 101;
 return () => {
  s = (s + 0x6D2B79F5) >>> 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
 };
}
