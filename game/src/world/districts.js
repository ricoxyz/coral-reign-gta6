// 6 Named Districts of Palma Dorada with distinct architectural styles & boundaries
export const DISTRICTS = [
  {
    id: 'solana_strip',
    name: 'SOLANA STRIP',
    subtitle: 'Art-Deco Coastal Boulevard & Neon Hotels',
    bounds: { minX: 40, maxX: 255, minZ: -360, maxZ: 360 },
    color: '#ff4d79',
    palette: [0xff5e8e, 0x00e5ff, 0xffbe3d, 0xf7e7ce],
    heightRange: [22, 58],
  },
  {
    id: 'coral_marina',
    name: 'CORAL MARINA',
    subtitle: 'Yacht Harbor, Causeway Bridges & Luxury Piers',
    bounds: { minX: -120, maxX: 255, minZ: -540, maxZ: -360 },
    color: '#00f0ff',
    palette: [0x00d8ff, 0xffffff, 0x3ad6a7, 0xff8552],
    heightRange: [18, 44],
  },
  {
    id: 'vidrio_downtown',
    name: 'VIDRIO DOWNTOWN',
    subtitle: 'Financial Glass Towers & Syndicate Penthouses',
    bounds: { minX: -240, maxX: 40, minZ: -250, maxZ: 250 },
    color: '#ffbf3c',
    palette: [0x1c3150, 0x00f0ff, 0xffbf3c, 0x29446b],
    heightRange: [48, 118],
  },
  {
    id: 'mercado_viejo',
    name: 'MERCADO VIEJO',
    subtitle: 'Night-Market Plazas, Arcade Alleys & Neon Warehouses',
    bounds: { minX: -480, maxX: -240, minZ: -320, maxZ: 320 },
    color: '#ff7e29',
    palette: [0xd96b27, 0xff3b78, 0xe8c589, 0x3b2c47],
    heightRange: [14, 34],
  },
  {
    id: 'palma_pier',
    name: 'PALMA PIER',
    subtitle: 'Sunset Boardwalk, Ferris Promenade & Beach Clubs',
    bounds: { minX: 40, maxX: 310, minZ: 360, maxZ: 560 },
    color: '#4eff91',
    palette: [0xff4d79, 0x4eff91, 0xffbf3c, 0x00f0ff],
    heightRange: [14, 36],
  },
  {
    id: 'mirador_heights',
    name: 'MIRADOR HEIGHTS',
    subtitle: 'Hillside Villas, Observatory Overlook & Cartel Estates',
    bounds: { minX: -480, maxX: -120, minZ: 250, maxZ: 560 },
    color: '#b978ff',
    palette: [0xf4e3c9, 0xb978ff, 0xff8a5b, 0x2c3e55],
    heightRange: [16, 40],
  },
];

export function getDistrictAt(x, z) {
  for (let i = 0; i < DISTRICTS.length; i++) {
    const d = DISTRICTS[i];
    const b = d.bounds;
    if (x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ) {
      return d;
    }
  }
  if (x > 250) return DISTRICTS[0]; // Solana Strip / Beach
  return DISTRICTS[2]; // Vidrio Downtown fallback
}
