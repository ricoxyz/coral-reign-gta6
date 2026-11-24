// 10 Multi-Stage Story Missions in Palma Dorada with Crew Dialogue & Waypoints
const M = (id, num, title, district, medal, rewardCash, rewardRespect, x, z, stages) => ({
 id, num, title, district, medal, rewardCash, rewardRespect, waypoint: { x, z }, stages,
});

export const STORY_MISSIONS = [
 M('m01', '01', 'NEON ARRIVAL AT SOLANA', 'SOLANA STRIP', 'G', 15000, 450, 110, 180, ['Hijack the Coral Vortex GT outside Hotel Solana', 'Deliver Valeria to the Solana Strip safehouse', 'Lose the 2-Star Palma PD patrol interceptors']),
 M('m02', '02', 'MARINA YACHT CONTRABAND', 'CORAL MARINA', 'G', 25000, 700, 210, -380, ['Meet Ramona at the Coral Marina causeway pier', 'Ambush the cartel ledger courier dockside', 'Escape across the Marina bridge under helicopter pursuit']),
 M('m03', '03', 'MERCADO NIGHT SYNDICATE', 'MERCADO VIEJO', 'S', 32000, 900, -280, -110, ['Infiltrate the Mercado Viejo neon arcade alley', 'Clear rival enforcers guarding the vault keycards', 'Extract Mateo in the Armored SUV']),
 M('m04', '04', 'CORAL BULLION RUN', 'SOLANA STRIP', 'G', 45000, 1200, 110, -165, ['Intercept the Dorada Armored Convoy on Solana Strip', 'Hijack the bullion transport & evade tactical police', 'Stash the gold shipment at Coral Marina', 'Shake AIR-1 chopper under the causeway bridge']),
 M('m05', '05', 'VIDRIO SKYLINE HACK', 'VIDRIO DOWNTOWN', 'S', 55000, 1500, -110, 0, ['Plant Valeria signal relay at Vidrio Tower plaza', 'Defend the terminal against Palma SWAT breach teams', 'Download encrypted ledger keys', 'Exfiltrate onto the coastal boulevard']),
 M('m06', '06', 'PALMA PIER DROP', 'PALMA PIER', 'B', 65000, 1800, 220, 390, ['Race to Palma Pier boardwalk before sunset lock', 'Clear rival cartel lookouts on the boardwalk', 'Secure the offshore syndicate drop crates', 'Outrun AIR-1 spotlight along Oceanfront Drive']),
 M('m07', '07', 'SOLANA GOLD CONVOY', 'SOLANA STRIP', 'ACTIVE', 80000, 2200, 110, -165, ['Ambush the armored bullion convoy at Hotel Solana', 'Extract the syndicate gold payload with Valeria', 'Break the TAC-9 barricade & reach Coral Marina', 'Lose 4-Star pursuit across the Marina bridge']),
 M('m08', '08', 'CASINO ROYALE BLACKOUT', 'SOLANA STRIP', 'OPEN', 110000, 2800, 110, -220, ['Trigger the EMP jammer outside Palma Casino', 'Clean out the high-roller cage with Ramona & Valeria', 'Break through the 5-Star TAC-9 spike roadblocks']),
 M('m09', '09', 'HARBOR HELIPAD EXTRACTION', 'CORAL MARINA', 'OPEN', 145000, 3500, 0, -440, ['Seize the armored transport at Coral Marina', 'Hold the causeway bridge against police interceptors', 'Deliver the syndicate reserve to the pier']),
 M('m10', '10', 'CROWN OF PALMA DORADA', 'VIDRIO DOWNTOWN', 'OPEN', 250000, 5000, 0, 110, ['Assemble the full crew at Vidrio Central Reserve', 'Execute the sovereign vault takeover under 5-Star lockdown', 'Claim total syndicate rule over Palma Dorada']),
];

export function initMissionSystem(scene, state, soundEngine) {
 const THREE = window.THREE, bg = new THREE.Group();
 const ring = new THREE.Mesh(new THREE.TorusGeometry(4.2, .25, 10, 28), new THREE.MeshBasicMaterial({ color: 0xffbf3c }));
 ring.rotation.x = Math.PI / 2; ring.position.y = .25;
 const pil = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 3.8, 18, 20, 1, true), new THREE.MeshBasicMaterial({ color: 0xff4d79, transparent: true, opacity: .24, side: THREE.DoubleSide, depthWrite: false }));
 pil.position.y = 9; bg.add(ring, pil); scene.add(bg);

 function syncActiveMission() {
  const m = STORY_MISSIONS[state.mission.currentIndex] || STORY_MISSIONS[6];
  Object.assign(state.mission, { title: m.title, rewardCash: m.rewardCash, rewardRespect: m.rewardRespect, totalStages: m.stages.length, objective: m.stages[state.mission.stageIndex] || m.stages[0], waypoint: { ...m.waypoint } });
  bg.position.set(m.waypoint.x, 0, m.waypoint.z);
 }
 syncActiveMission();

 return {
  beaconGroup: bg, syncActiveMission,
  update(dt, time) {
   ring.rotation.z = time * 2;
   const wp = state.mission.waypoint, dist = Math.round(Math.hypot(wp.x - state.player.x, wp.z - state.player.z));
   state.mission.distance = dist;
   if (dist < 10 && !state.activeShot) {
    const m = STORY_MISSIONS[state.mission.currentIndex];
    if (++state.mission.stageIndex >= m.stages.length) {
     m.medal = 'G'; state.player.cash += m.rewardCash; state.player.respect += m.rewardRespect;
     state.stats.netWorth += m.rewardCash; state.stats.completionPct = Math.min(100, state.stats.completionPct + 8);
     state.mission.currentIndex = (state.mission.currentIndex + 1) % STORY_MISSIONS.length;
     state.mission.stageIndex = 0; STORY_MISSIONS[state.mission.currentIndex].medal = 'ACTIVE';
    } else m.waypoint.z = m.waypoint.z > 0 ? -180 : 160;
    syncActiveMission(); soundEngine?.playChime(960);
   }
  },
 };
}
