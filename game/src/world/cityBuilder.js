// Master 3D World Orchestrator for Palma Dorada: District Zoning, Landmarks, Traffic Graph & Culling
import { buildOceanAndSky } from './oceanSky.js';
import { buildRoadNetwork, ROAD_X, ROAD_Z } from './roads.js';
import { buildCityBuildings } from './buildings.js';
import { buildWorldProps } from './props.js';
import { DISTRICTS, getDistrictAt } from './districts.js';

export const PALMA_LANDMARKS = [
  { id: 'hotel_solana', name: 'HOTEL SOLANA', district: 'solana_strip', x: 96, z: 18, type: 'RESORT' },
  { id: 'coral_marina_yachts', name: 'CORAL MARINA YACHT CLUB', district: 'coral_marina', x: 250, z: -410, type: 'HARBOR' },
  { id: 'vidrio_tower', name: 'VIDRIO FINANCIAL PLAZA', district: 'vidrio_downtown', x: -85, z: -20, type: 'TOWER' },
  { id: 'mercado_rotunda', name: 'MERCADO VIEJO ROTUNDA', district: 'mercado_viejo', x: -340, z: -60, type: 'MARKET' },
  { id: 'palma_pier_wheel', name: 'PALMA PIER FERRIS PLAZA', district: 'palma_pier', x: 285, z: 365, type: 'PIER' },
  { id: 'mirador_observatory', name: 'MIRADOR CLIFF OBSERVATORY', district: 'mirador_heights', x: -320, z: 410, type: 'OVERLOOK' },
];

export const SAFEHOUSE_AND_SHOP_NODES = [
  { id: 'safe_solana', code: 'S', label: 'Solana Penthouse Safehouse', x: 82, z: -55 },
  { id: 'safe_marina', code: 'S', label: 'Marina Pier Safehouse', x: 155, z: -420 },
  { id: 'safe_mirador', code: 'S', label: 'Mirador Villa Safehouse', x: -285, z: 365 },
  { id: 'shop_customs', code: 'P', label: 'Dorada Turbo Mod Shop', x: 14, z: 120 },
  { id: 'shop_mercado', code: 'P', label: 'Mercado Customs & Paint', x: -265, z: -135 },
  { id: 'hq_palma_pd', code: '★', label: 'Palma PD Precinct HQ', x: -95, z: -185 },
];

export function buildIntersectionGraph() {
  const nodes = [];
  for (let ix = 0; ix < ROAD_X.length; ix++) {
    for (let iz = 0; iz < ROAD_Z.length; iz++) {
      const x = ROAD_X[ix];
      const z = ROAD_Z[iz];
      const district = getDistrictAt(x, z);
      nodes.push({
        id: `node_${ix}_${iz}`,
        x,
        z,
        districtId: district.id,
        speedLimitKmh: x >= 110 ? 110 : 85,
      });
    }
  }
  return nodes;
}

export function getCoastalElevationAt(x, z) {
  if (x > 250) return -0.05; // Coastal shoreline transition
  if (x < -220 && z > 220) {
    // Mirador Heights gentle hillside contour metadata
    return Math.min(18, ((220 - x) * 0.025) + ((z - 220) * 0.02));
  }
  return 0;
}

export function buildPalmaDoradaWorld(scene, state) {
  const oceanSky = buildOceanAndSky(scene);
  const roads = buildRoadNetwork(scene);
  const buildings = buildCityBuildings(scene, state.rng);
  const props = buildWorldProps(scene);
  const trafficGraph = buildIntersectionGraph();

  state.worldMeta = {
    districts: DISTRICTS,
    landmarks: PALMA_LANDMARKS,
    mapNodes: SAFEHOUSE_AND_SHOP_NODES,
    intersectionCount: trafficGraph.length,
  };

  return {
    oceanSky,
    roads,
    buildings,
    props,
    trafficGraph,
     landmarks: PALMA_LANDMARKS,
    colliders: buildings.colliders,
    stuntRamps: props.stuntRamps,
    getElevation: getCoastalElevationAt,
    update(time) {
      oceanSky.update(time);
      props.update(time);
      const currentDistrict = getDistrictAt(state.player.x, state.player.z);
      state.currentDistrict = currentDistrict;
    },
  };
}
