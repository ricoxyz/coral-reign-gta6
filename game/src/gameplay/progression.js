// Complete Syndicate Career Rank Ladder, District Territory Control, Perks & Completion Calculator
export const SYNDICATE_RANKS = [
  { rank: 1, title: 'STREET RUNNER', minRespect: 0, heatDecayBonus: 1.0, payoutMultiplier: 1.0, perk: 'Basic Street Contacts' },
  { rank: 5, title: 'HARBOR ENFORCER', minRespect: 2500, heatDecayBonus: 1.15, payoutMultiplier: 1.1, perk: 'Marina Smuggler Stashes' },
  { rank: 10, title: 'MARINA CAPO', minRespect: 7500, heatDecayBonus: 1.3, payoutMultiplier: 1.25, perk: 'Tactical Armor Resupply' },
  { rank: 14, title: 'PALMA KINGPIN', minRespect: 13500, heatDecayBonus: 1.5, payoutMultiplier: 1.45, perk: 'Syndicate Chopper Transponder' },
  { rank: 18, title: 'CARTEL SOVEREIGN', minRespect: 22000, heatDecayBonus: 1.75, payoutMultiplier: 1.7, perk: 'High-Roller Casino Vault Key' },
  { rank: 20, title: 'CORAL EMPEROR', minRespect: 32000, heatDecayBonus: 2.0, payoutMultiplier: 2.0, perk: 'Total Palma Dorada Immunity' },
];

export const DISTRICT_CONTROL_DEFAULTS = [
  { id: 'solana_strip', name: 'SOLANA STRIP', controlPct: 82, turfBoss: 'Valeria Cruz', incomePerHour: 14500 },
  { id: 'coral_marina', name: 'CORAL MARINA', controlPct: 74, turfBoss: 'Rafa Mendoza', incomePerHour: 12000 },
  { id: 'vidrio_downtown', name: 'VIDRIO DOWNTOWN', controlPct: 65, turfBoss: 'Mateo Silva', incomePerHour: 18500 },
  { id: 'mercado_viejo', name: 'MERCADO VIEJO', controlPct: 58, turfBoss: 'Elena Vargas', incomePerHour: 9500 },
  { id: 'palma_pier', name: 'PALMA PIER', controlPct: 79, turfBoss: 'Ramona Diaz', incomePerHour: 11200 },
  { id: 'mirador_heights', name: 'MIRADOR HEIGHTS', controlPct: 52, turfBoss: 'Don Aurelio', incomePerHour: 16800 },
];

export const WEAPON_MASTERY_TIERS = [
  { tier: 1, label: 'ROOKIE', minKills: 0, spreadModifier: 1.0, reloadSpeedBonus: 1.0 },
  { tier: 2, label: 'OPERATIVE', minKills: 15, spreadModifier: 0.88, reloadSpeedBonus: 1.12 },
  { tier: 3, label: 'SHARPSHOOTER', minKills: 40, spreadModifier: 0.75, reloadSpeedBonus: 1.25 },
  { tier: 4, label: 'SYNDICATE ACE', minKills: 80, spreadModifier: 0.62, reloadSpeedBonus: 1.4 },
];

export function calculateCampaignCompletion(stats) {
  if (!stats) return 68.4;
  const missionShare = (stats.missionsDone / Math.max(1, stats.missionsTotal)) * 45;
  const raceShare = (stats.racesWon / Math.max(1, stats.racesTotal)) * 15;
  const stuntShare = (stats.stuntsCompleted / Math.max(1, stats.stuntsTotal)) * 15;
  const shellShare = (stats.shellsCollected / Math.max(1, stats.shellsTotal)) * 15;
  const crewShare = ((stats.crewCount || 3) / Math.max(1, stats.crewTotal || 3)) * 10;
  return Number((missionShare + raceShare + stuntShare + shellShare + crewShare).toFixed(1));
}

export function getDistrictControlSummary(state) {
  if (!state.districtControl) {
    state.districtControl = DISTRICT_CONTROL_DEFAULTS.map((d) => ({ ...d }));
  }
  let totalPct = 0;
  let totalHourlyIncome = 0;
  for (let i = 0; i < state.districtControl.length; i++) {
    totalPct += state.districtControl[i].controlPct;
    totalHourlyIncome += state.districtControl[i].incomePerHour;
  }
  return {
    averageControlPct: Math.round(totalPct / state.districtControl.length),
    totalHourlyIncome,
    districts: state.districtControl,
  };
}

export function updateProgression(state) {
  const r = state.player.respect;
  let current = SYNDICATE_RANKS[0];
  let nextRank = SYNDICATE_RANKS[SYNDICATE_RANKS.length - 1];

  for (let i = 0; i < SYNDICATE_RANKS.length; i++) {
    if (r >= SYNDICATE_RANKS[i].minRespect) {
      current = SYNDICATE_RANKS[i];
      nextRank = SYNDICATE_RANKS[Math.min(i + 1, SYNDICATE_RANKS.length - 1)];
    }
  }

  state.player.rank = Math.max(14, current.rank);
  state.player.rankTitle = current.rank >= 14 ? 'KINGPIN' : current.title;
  state.player.heatDecayBonus = current.heatDecayBonus;
  state.player.payoutMultiplier = current.payoutMultiplier;
  state.player.nextRankRespect = nextRank.minRespect;
  state.stats.completionPct = calculateCampaignCompletion(state.stats);
  getDistrictControlSummary(state);
}
