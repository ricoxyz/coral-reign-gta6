// 5-Star Police Escalation, Heat Decay, and Live Tactical Dispatch Telemetry
export const WANTED_TIERS = [
  { stars: 0, code: 'ALL CLEAR • PATROL', label: '0/5 · ALL CLEAR' },
  { stars: 1, code: 'CODE 1 • PATROL', label: '1/5 · PATROL ALERT' },
  { stars: 2, code: 'CODE 2 • FOOT CHASE', label: '2/5 · FOOT CHASE' },
  { stars: 3, code: 'CODE 3 • AIR SUPPORT', label: '3/5 · MANHUNT' },
  { stars: 4, code: 'CODE RED • IN SIGHT', label: '4/5 · IN SIGHT' },
  { stars: 5, code: 'CODE OMEGA • LOCKDOWN', label: '5/5 · SIEGE' },
];

export function updateWantedLevel(state, dt) {
  const w = state.wanted;
  const tier = WANTED_TIERS[Math.min(5, Math.max(0, w.stars))];
  w.code = tier.code;

  if (w.stars === 0) {
    w.dispatches = [
      { unit: 'PALMA-HQ', action: 'SECTOR CLEAR' },
    ];
    return;
  }

  if (state.activeShot === 'cover') {
    w.dispatches = [
      { unit: 'CORAL-12', action: 'RAMMING' },
      { unit: 'MARINA-4', action: 'FLANKING' },
      { unit: 'AIR-1', action: 'SPOTLIGHT' },
      { unit: 'TAC-9', action: 'ROADBLOCK' },
    ];
    return;
  }

  if (state.activeShot === 'combat') {
    w.dispatches = [
      { unit: 'PIER-2', action: 'FOOT CHASE' },
      { unit: 'MARINA-4', action: 'CONTAINMENT' },
      { unit: 'SWAT-1', action: 'CLOSING (28m)' },
    ];
    return;
  }

  // Live gameplay dynamic distances
  const px = state.player.x;
  const pz = state.player.z;
  const policeUnits = state.entities.vehicles.filter((v) => v.isPolice);

  const dispatches = [];
  for (let i = 0; i < Math.min(2, policeUnits.length); i++) {
    const u = policeUnits[i];
    const dist = Math.max(8, Math.round(Math.hypot(u.x - px, u.z - pz)));
    dispatches.push({
      unit: u.callsign || `CORAL-${12 + i * 4}`,
      action: `${u.tactic || 'INTERCEPT'} (${dist}m)`,
    });
  }

  if (w.stars >= 3) {
    dispatches.push({
      unit: 'AIR-1',
      action: w.evadeTimer > 0 ? 'JAMMED' : 'SPOTLIGHT',
    });
  }
  if (w.stars >= 4) {
    dispatches.push({
      unit: 'TAC-9',
      action: 'ROADBLOCK',
    });
  }

  w.dispatches = dispatches;
}
