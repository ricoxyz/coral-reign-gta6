// 5-Star Police Escalation, Heat Decay, and Live Tactical Dispatch Telemetry with Distance & Colored Pills
export const WANTED_TIERS = [
 { stars: 0, code: 'ALL CLEAR', header: 'PATROL MONITOR · 0 UNITS · 0★', label: '0/5 · ALL CLEAR' },
 { stars: 1, code: 'CODE 1', header: 'ACTIVE PURSUIT · 2 UNITS · 1★', label: '1/5 · PATROL ALERT' },
 { stars: 2, code: 'CODE 2', header: 'ACTIVE PURSUIT · 4 UNITS · 2★', label: '2/5 · FOOT CHASE' },
 { stars: 3, code: 'CODE 3', header: 'ACTIVE PURSUIT · 5 UNITS · 3★', label: '3/5 · MANHUNT' },
 { stars: 4, code: 'CODE RED', header: 'ACTIVE PURSUIT · 6 UNITS · 4★', label: '4/5 · IN SIGHT' },
 { stars: 5, code: 'CODE OMEGA', header: 'ACTIVE PURSUIT · 8 UNITS · 5★', label: '5/5 · SIEGE' },
];

const D = (unit, dist, action, pill) => ({ unit, dist, action, pill });

export function updateWantedLevel(state) {
 const w = state.wanted, tier = WANTED_TIERS[Math.min(5, Math.max(0, w.stars))];
 w.code = tier.code; w.headerTitle = tier.header;

 if (w.stars === 0) { w.dispatches = [D('PALMA-HQ', '140 m', 'PATROL', 'cyan')]; return; }
 if (state.activeShot === 'cover') {
  w.dispatches = [D('CORAL-12', '16 m', 'RAMMING', 'crimson'), D('MARINA-4', '24 m', 'FLANKING', 'amber'), D('AIR-1 HELI', '42 m', 'SPOTLIGHT', 'cyan'), D('TAC-9 SUV', '68 m', 'ROADBLOCK', 'purple')];
  return;
 }
 if (state.activeShot === 'combat') {
  w.dispatches = [D('PIER-2', '19 m', 'FOOT CHASE', 'crimson'), D('MARINA-4', '26 m', 'FLANKING', 'amber'), D('SWAT-1', '28 m', 'CONTAINMENT', 'cyan'), D('TAC-6 SUV', '45 m', 'ROADBLOCK', 'purple')];
  return;
 }

 const px = state.player.x, pz = state.player.z, pills = ['crimson', 'amber', 'cyan', 'purple'];
 const dispatches = state.entities.vehicles.filter((v) => v.isPolice).slice(0, 2).map((u, i) => D(
  u.callsign || `CORAL-${12 + i * 4}`, `${Math.max(8, Math.round(Math.hypot(u.x - px, u.z - pz)))} m`, u.tactic || 'RAMMING', pills[i]
 ));
 if (w.stars >= 3) dispatches.push(D('AIR-1 HELI', '42 m', w.evadeTimer > 0 ? 'JAMMED' : 'SPOTLIGHT', 'cyan'));
 if (w.stars >= 4) dispatches.push(D('TAC-9 SUV', '68 m', 'ROADBLOCK', 'purple'));
 w.dispatches = dispatches;
}
