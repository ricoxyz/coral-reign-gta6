// 10 Multi-Stage Story Missions in Palma Dorada with Crew Dialogue & Waypoint Tracking
export const STORY_MISSIONS = [
  {
    id: 'm01',
    num: '01',
    title: 'NEON ARRIVAL AT SOLANA',
    district: 'SOLANA STRIP',
    medal: 'G',
    rewardCash: 15000,
    rewardRespect: 450,
    waypoint: { x: 110, z: 180 },
    stages: [
      'Hijack the Coral Vortex GT parked outside Hotel Coral',
      'Deliver Crew Leader Valeria to the Solana Strip safehouse',
      'Lose the 2-Star Palma PD patrol interceptors',
    ],
  },
  {
    id: 'm02',
    num: '02',
    title: 'MARINA YACHT CONTRABAND',
    district: 'CORAL MARINA',
    medal: 'G',
    rewardCash: 25000,
    rewardRespect: 700,
    waypoint: { x: 210, z: -380 },
    stages: [
      'Meet Rafa at the Coral Marina causeway pier',
      'Ambush the cartel ledger courier dockside',
      'Escape across the Marina bridge under helicopter pursuit',
    ],
  },
  {
    id: 'm03',
    num: '03',
    title: 'MERCADO NIGHT SYNDICATE',
    district: 'MERCADO VIEJO',
    medal: 'S',
    rewardCash: 32000,
    rewardRespect: 900,
    waypoint: { x: -280, z: -110 },
    stages: [
      'Infiltrate the Mercado Viejo neon arcade alley',
      'Clear out the rival enforcers guarding the vault keycards',
      'Extract Mateo in the Armored SUV',
    ],
  },
  {
    id: 'm04',
    num: '04',
    title: 'CORAL BULLION RUN',
    district: 'SOLANA STRIP',
    medal: 'G',
    rewardCash: 45000,
    rewardRespect: 1200,
    waypoint: { x: 110, z: -165 },
    stages: [
      'Intercept the Dorada Armored Convoy on Solana Strip',
      'Hijack the bullion transport & evade tactical police',
      'Stash the gold shipment at Coral Marina',
      'Shake AIR-1 chopper under the causeway bridge',
    ],
  },
  {
    id: 'm05',
    num: '05',
    title: 'VIDRIO SKYLINE HACK',
    district: 'VIDRIO DOWNTOWN',
    medal: 'S',
    rewardCash: 55000,
    rewardRespect: 1500,
    waypoint: { x: -110, z: 0 },
    stages: [
      'Plant Valeria’s signal relay at Vidrio Tower plaza',
      'Defend the terminal against Palma SWAT breach teams',
      'Download encrypted ledger keys',
      'Exfiltrate onto the coastal boulevard',
    ],
  },
  {
    id: 'm06',
    num: '06',
    title: 'PALMA PIER DROP',
    district: 'PALMA PIER',
    medal: 'B',
    rewardCash: 65000,
    rewardRespect: 1800,
    waypoint: { x: 220, z: 390 },
    stages: [
      'Race to Palma Pier boardwalk before sunset lock',
      'Clear rival cartel lookouts on the boardwalk',
      'Secure the offshore syndicate drop crates',
      'Outrun AIR-1 spotlight along Oceanfront Drive',
    ],
  },
  {
    id: 'm07',
    num: '07',
    title: 'SOLANA GOLD CONVOY',
    district: 'SOLANA STRIP',
    medal: 'ACTIVE',
    rewardCash: 80000,
    rewardRespect: 2200,
    waypoint: { x: 110, z: -165 },
    stages: [
      'Ambush the armored bullion convoy at Hotel Coral',
      'Extract the syndicate gold payload with Valeria',
      'Break the TAC-9 barricade & reach Coral Marina',
      'Lose 4-Star pursuit across the Marina bridge',
    ],
  },
  {
    id: 'm08',
    num: '08',
    title: 'CASINO ROYALE BLACKOUT',
    district: 'SOLANA STRIP',
    medal: 'OPEN',
    rewardCash: 110000,
    rewardRespect: 2800,
    waypoint: { x: 110, z: -220 },
    stages: [
      'Trigger the EMP jammer outside Palma Casino',
      'Clean out the high-roller cage with Rafa & Valeria',
      'Break through the 5-Star TAC-9 spike roadblocks',
    ],
  },
  {
    id: 'm09',
    num: '09',
    title: 'HARBOR HELIPAD EXTRACTION',
    district: 'CORAL MARINA',
    medal: 'OPEN',
    rewardCash: 145000,
    rewardRespect: 3500,
    waypoint: { x: 0, z: -440 },
    stages: [
      'Seize the armored transport at Coral Marina',
      'Hold the causeway bridge against police interceptors',
      'Deliver the syndicate reserve to the pier',
    ],
  },
  {
    id: 'm10',
    num: '10',
    title: 'CROWN OF PALMA DORADA',
    district: 'VIDRIO DOWNTOWN',
    medal: 'OPEN',
    rewardCash: 250000,
    rewardRespect: 5000,
    waypoint: { x: 0, z: 110 },
    stages: [
      'Assemble the full crew at Vidrio Central Reserve',
      'Execute the sovereign vault takeover under 5-Star lockdown',
      'Claim total syndicate rule over Palma Dorada',
    ],
  },
];

export function initMissionSystem(scene, state, soundEngine) {
  const THREE = window.THREE;

  // Glowing 3D golden mission beacon ring at active waypoint
  const beaconGroup = new THREE.Group();
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(4.2, 0.25, 10, 28),
    new THREE.MeshBasicMaterial({ color: 0xffbf3c })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.25;
  beaconGroup.add(ring);

  const pillar = new THREE.Mesh(
    new THREE.CylinderGeometry(3.8, 3.8, 18, 20, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xff4d79,
      transparent: true,
      opacity: 0.24,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  pillar.position.y = 9;
  beaconGroup.add(pillar);
  scene.add(beaconGroup);

  function syncActiveMission() {
    const m = STORY_MISSIONS[state.mission.currentIndex] || STORY_MISSIONS[6];
    state.mission.title = m.title;
    state.mission.rewardCash = m.rewardCash;
    state.mission.rewardRespect = m.rewardRespect;
    state.mission.totalStages = m.stages.length;
    state.mission.objective = m.stages[state.mission.stageIndex] || m.stages[0];
    state.mission.waypoint = { ...m.waypoint };
    beaconGroup.position.set(m.waypoint.x, 0, m.waypoint.z);
  }

  syncActiveMission();

  return {
    beaconGroup,
    syncActiveMission,
    update(dt, time) {
      ring.rotation.z = time * 2;
      const wp = state.mission.waypoint;
      const dist = Math.round(Math.hypot(wp.x - state.player.x, wp.z - state.player.z));
      state.mission.distance = dist;

      // Advance stage or complete mission when player reaches glowing beacon
      if (dist < 10 && !state.activeShot) {
        const m = STORY_MISSIONS[state.mission.currentIndex];
        state.mission.stageIndex += 1;
        if (state.mission.stageIndex >= m.stages.length) {
          m.medal = 'G';
          state.player.cash += m.rewardCash;
          state.player.respect += m.rewardRespect;
          state.stats.netWorth += m.rewardCash;
          state.stats.completionPct = Math.min(100, state.stats.completionPct + 8);
          state.mission.currentIndex = (state.mission.currentIndex + 1) % STORY_MISSIONS.length;
          state.mission.stageIndex = 0;
          STORY_MISSIONS[state.mission.currentIndex].medal = 'ACTIVE';
        } else {
          m.waypoint.z = m.waypoint.z > 0 ? -180 : 160;
        }
        syncActiveMission();
        if (soundEngine) soundEngine.playChime(960);
      }
    },
  };
}
