// 6 Named Districts of Palma Dorada with distinct architectural styles & boundaries
const D = (id, name, subtitle, minX, maxX, minZ, maxZ, color, palette, heightRange) => ({
 id, name, subtitle, bounds: { minX, maxX, minZ, maxZ }, color, palette, heightRange,
});

export const DISTRICTS = [
 D('solana_strip', 'SOLANA STRIP', 'Art-Deco Coastal Boulevard & Neon Hotels', 40, 255, -360, 360, '#ff4d79', [0xff5e8e, 0x00e5ff, 0xffbe3d, 0xf7e7ce], [22, 58]),
 D('coral_marina', 'CORAL MARINA', 'Yacht Harbor, Causeway Bridges & Luxury Piers', -120, 255, -540, -360, '#00f0ff', [0x00d8ff, 0xffffff, 0x3ad6a7, 0xff8552], [18, 44]),
 D('vidrio_downtown', 'VIDRIO DOWNTOWN', 'Financial Glass Towers & Syndicate Penthouses', -240, 40, -250, 250, '#ffbf3c', [0x1c3150, 0x00f0ff, 0xffbf3c, 0x29446b], [48, 118]),
 D('mercado_viejo', 'MERCADO VIEJO', 'Night-Market Plazas, Arcade Alleys & Neon Warehouses', -480, -240, -320, 320, '#ff7e29', [0xd96b27, 0xff3b78, 0xe8c589, 0x3b2c47], [14, 34]),
 D('palma_pier', 'PALMA PIER', 'Sunset Boardwalk, Ferris Promenade & Beach Clubs', 40, 310, 360, 560, '#4eff91', [0xff4d79, 0x4eff91, 0xffbf3c, 0x00f0ff], [14, 36]),
 D('mirador_heights', 'MIRADOR HEIGHTS', 'Hillside Villas, Observatory Overlook & Cartel Estates', -480, -120, 250, 560, '#b978ff', [0xf4e3c9, 0xb978ff, 0xff8a5b, 0x2c3e55], [16, 40]),
];

export function getDistrictAt(x, z) {
 for (const d of DISTRICTS) {
  const b = d.bounds;
  if (x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ) return d;
 }
 return x > 250 ? DISTRICTS[0] : DISTRICTS[2];
}
