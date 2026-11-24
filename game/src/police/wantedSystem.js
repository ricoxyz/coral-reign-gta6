// 5-Star Police Escalation, Heat Decay & Live Tactical Dispatch Telemetry
export const WANTED_TIERS = [
 [0, 'ALL CLEAR', 'PATROL MONITOR · 0 UNITS · 0★', '0/5 · ALL CLEAR'],
 [1, 'CODE 1', 'ACTIVE PURSUIT · 2 UNITS · 1★', '1/5 · PATROL ALERT'],
 [2, 'CODE 2', 'ACTIVE PURSUIT · 4 UNITS · 2★', '2/5 · FOOT CHASE'],
 [3, 'CODE 3', 'ACTIVE PURSUIT · 5 UNITS · 3★', '3/5 · MANHUNT'],
 [4, 'CODE RED', 'ACTIVE PURSUIT · 6 UNITS · 4★', '4/5 · IN SIGHT'],
 [5, 'CODE OMEGA', 'ACTIVE PURSUIT · 8 UNITS · 5★', '5/5 · SIEGE'],
].map(([stars, code, header, label]) => ({ stars, code, header, label }));

const D = (unit, dist, action, pill) => ({ unit, dist, action, pill });

export function updateWantedLevel(state) {
 const w = state.wanted, tier = WANTED_TIERS[Math.min(5, Math.max(0, w.stars))];
 w.code = tier.code; w.headerTitle = tier.header;
 if (w.stars === 0) { w.dispatches = [D('PALMA-HQ', '140 m', 'PATROL', 'cyan')]; return; }
 if (state.activeShot === 'cover') { w.dispatches = [D('CORAL-12', '16 m', 'RAMMING', 'crimson'), D('MARINA-4', '24 m', 'FLANKING', 'amber'), D('AIR-1 HELI', '42 m', 'SPOTLIGHT', 'cyan'), D('TAC-9 SUV', '68 m', 'ROADBLOCK', 'purple')]; return; }
 if (state.activeShot === 'combat') { w.dispatches = [D('PIER-2', '19 m', 'FOOT CHASE', 'crimson'), D('MARINA-4', '26 m', 'FLANKING', 'amber'), D('SWAT-1', '28 m', 'CONTAINMENT', 'cyan'), D('TAC-6 SUV', '45 m', 'ROADBLOCK', 'purple')]; return; }
 const px = state.player.x, pz = state.player.z, pills = ['crimson', 'amber', 'cyan', 'purple'];
 const d = state.entities.vehicles.filter((v) => v.isPolice).slice(0, 2).map((u, i) => D(u.callsign || `CORAL-${12 + i * 4}`, `${Math.max(8, Math.round(Math.hypot(u.x - px, u.z - pz)))} m`, u.tactic || 'RAMMING', pills[i]));
 if (w.stars >= 3) d.push(D('AIR-1 HELI', '42 m', w.evadeTimer > 0 ? 'JAMMED' : 'SPOTLIGHT', 'cyan'));
 if (w.stars >= 4) d.push(D('TAC-9 SUV', '68 m', 'ROADBLOCK', 'purple'));
 w.dispatches = d;
}
