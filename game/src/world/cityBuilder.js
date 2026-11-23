// Master 3D world assembler for Palma Dorada (sky, ocean, roads, buildings, props)
import { buildOceanAndSky } from './oceanSky.js';
import { buildRoadNetwork } from './roads.js';
import { buildCityBuildings } from './buildings.js';
import { buildWorldProps } from './props.js';
import { getDistrictAt } from './districts.js';

export function buildPalmaDoradaWorld(scene, state) {
  const oceanSky = buildOceanAndSky(scene);
  const roads = buildRoadNetwork(scene);
  const buildings = buildCityBuildings(scene, state.rng);
  const props = buildWorldProps(scene);

  return {
    oceanSky,
    roads,
    buildings,
    props,
    colliders: buildings.colliders,
    stuntRamps: props.stuntRamps,
    update(time) {
      oceanSky.update(time);
      props.update(time);
      const currentDistrict = getDistrictAt(state.player.x, state.player.z);
      state.currentDistrict = currentDistrict;
    },
  };
}
