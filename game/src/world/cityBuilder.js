// Master 3D World Orchestrator for Palma Dorada: Zoning, Landmarks & Traffic Graph
import { buildOceanAndSky } from './oceanSky.js';
import { buildRoadNetwork, ROAD_X, ROAD_Z } from './roads.js';
import { buildCityBuildings } from './buildings.js';
import { buildWorldProps } from './props.js';
import { DISTRICTS, getDistrictAt } from './districts.js';

export const PALMA_LANDMARKS = [
 ['hotel_solana', 'HOTEL SOLANA', 'solana_strip', 96, 18, 'RESORT'],
 ['coral_marina_yachts', 'CORAL MARINA YACHT CLUB', 'coral_marina', 250, -410, 'HARBOR'],
 ['vidrio_tower', 'VIDRIO FINANCIAL PLAZA', 'vidrio_downtown', -85, -20, 'TOWER'],
 ['mercado_rotunda', 'MERCADO VIEJO ROTUNDA', 'mercado_viejo', -340, -60, 'MARKET'],
 ['palma_pier_wheel', 'PALMA PIER FERRIS PLAZA', 'palma_pier', 285, 365, 'PIER'],
 ['mirador_observatory', 'MIRADOR CLIFF OBSERVATORY', 'mirador_heights', -320, 410, 'OVERLOOK'],
].map(([id, name, district, x, z, type]) => ({ id, name, district, x, z, type }));

export const SAFEHOUSE_AND_SHOP_NODES = [
 ['safe_solana', 'S', 'Solana Penthouse Safehouse', 82, -55],
 ['safe_marina', 'S', 'Marina Pier Safehouse', 155, -420],
 ['safe_mirador', 'S', 'Mirador Villa Safehouse', -285, 365],
 ['shop_customs', 'P', 'Dorada Turbo Mod Shop', 14, 120],
 ['shop_mercado', 'P', 'Mercado Customs & Paint', -265, -135],
 ['hq_palma_pd', '★', 'Palma PD Precinct HQ', -95, -185],
].map(([id, code, label, x, z]) => ({ id, code, label, x, z }));

export function buildIntersectionGraph() {
 const nodes = [];
 for (let ix = 0; ix < ROAD_X.length; ix++) for (let iz = 0; iz < ROAD_Z.length; iz++) {
  const x = ROAD_X[ix], z = ROAD_Z[iz];
  nodes.push({ id: `node_${ix}_${iz}`, x, z, districtId: getDistrictAt(x, z).id, speedLimitKmh: x >= 110 ? 110 : 85 });
 }
 return nodes;
}

export function getCoastalElevationAt(x, z) {
 if (x > 250) return -.05;
 if (x < -220 && z > 220) return Math.min(18, (220 - x) * .025 + (z - 220) * .02);
 return 0;
}

export function buildPalmaDoradaWorld(scene, state) {
 const oceanSky = buildOceanAndSky(scene), roads = buildRoadNetwork(scene);
 const buildings = buildCityBuildings(scene, state.rng), props = buildWorldProps(scene);
 const trafficGraph = buildIntersectionGraph();
 state.worldMeta = { districts: DISTRICTS, landmarks: PALMA_LANDMARKS, mapNodes: SAFEHOUSE_AND_SHOP_NODES, intersectionCount: trafficGraph.length };
 return {
  oceanSky, roads, buildings, props, trafficGraph, landmarks: PALMA_LANDMARKS,
  colliders: buildings.colliders, stuntRamps: props.stuntRamps, getElevation: getCoastalElevationAt,
  update(time) { oceanSky.update(time); props.update(time); state.currentDistrict = getDistrictAt(state.player.x, state.player.z); },
 };
}
