// 5-Star Police Escalation, Heat Decay, and Live Tactical Dispatch Telemetry
export const WANTED_TIERS = [
  { stars: 0, code: 'ALL CLEAR • PATROL', label: 'NO ACTIVE WARRANT' },
  { stars: 1, code: 'CODE 1 • BEAT PATROL', label: '1★ MISDEMEANOR PURSUIT' },
  { stars: 2, code: 'CODE 2 • INTERCEPTORS', label: '2★ FELONY EVASION' },
  { stars: 3, code: 'CODE 3 • AIR & BARRICADES', label: '3★ TACTICAL MANHUNT' },
  { stars: 4, code: 'CODE RED • AIR-1 & RAMMING', label: '4★ HIGH-VALUE HEIST ALERT' },
  { stars: 5, code: 'CODE OMEGA • SWAT LOCKDOWN', label: '5★ CITYWIDE SYNDICATE SIEGE' },
];

export function updateWantedLevel(state, dt) {
  const w = state.wanted;
  const tier = WANTED_TIERS[Math.min(5, Math.max(0, w.stars))];
  w.code = tier.code;

  if (w.stars === 0) {
    w.dispatches = [
      { unit: 'PALMA-HQ', action: 'SECTOR CLEAR • ROUTINE PATROL' },
    ];
    return;
  }

  // Update real-time distances to pursuing police cruisers
  const px = state.player.x;
  const pz = state.player.z;
  const policeUnits = state.entities.vehicles.filter((v) => v.isPolice);

  const dispatches = [];
  for (let i = 0; i < Math.min(3, policeUnits.length); i++) {
    const u = policeUnits[i];
    const dist = Math.max(8, Math.round(Math.hypot(u.x - px, u.z - pz)));
    dispatches.push({
      unit: u.callsign || `CORAL-${12 + i * 4}`,
      action: `${u.tactic || 'RAMMING INTERCEPT'} (${dist}m)`,
    });
  }

  if (w.stars >= 3) {
    dispatches.push({
      unit: 'AIR-1 HELI',
      action: w.evadeTimer > 0 ? 'RADAR JAMMED' : 'SPOTLIGHT LOCKED',
    });
  }
  if (w.stars >= 4) {
    dispatches.push({
      unit: 'TAC-9',
      action: 'SPIKE BARRICADE AHEAD',
    });
  }

  w.dispatches = dispatches;
}
