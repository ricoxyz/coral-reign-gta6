// Syndicate Career Rank Ladder, District Territory Control, Mastery & Completion Calculator
export const SYNDICATE_RANKS = [
 [1, 'STREET RUNNER', 0, 1, 1, 'Basic Street Contacts'],
 [5, 'HARBOR ENFORCER', 2500, 1.15, 1.1, 'Marina Smuggler Stashes'],
 [10, 'MARINA CAPO', 7500, 1.3, 1.25, 'Tactical Armor Resupply'],
 [14, 'PALMA KINGPIN', 13500, 1.5, 1.45, 'Syndicate Chopper Transponder'],
 [18, 'CARTEL SOVEREIGN', 22000, 1.75, 1.7, 'High-Roller Casino Vault Key'],
 [20, 'CORAL EMPEROR', 32000, 2, 2, 'Total Palma Dorada Immunity'],
].map(([rank, title, minRespect, heatDecayBonus, payoutMultiplier, perk]) => ({ rank, title, minRespect, heatDecayBonus, payoutMultiplier, perk }));

export const DISTRICT_CONTROL_DEFAULTS = [
 ['solana_strip', 'SOLANA STRIP', 82, 'Valeria Cruz', 14500],
 ['coral_marina', 'CORAL MARINA', 74, 'Rafa Mendoza', 12000],
 ['vidrio_downtown', 'VIDRIO DOWNTOWN', 65, 'Mateo Silva', 18500],
 ['mercado_viejo', 'MERCADO VIEJO', 58, 'Elena Vargas', 9500],
 ['palma_pier', 'PALMA PIER', 79, 'Ramona Diaz', 11200],
 ['mirador_heights', 'MIRADOR HEIGHTS', 52, 'Don Aurelio', 16800],
].map(([id, name, controlPct, turfBoss, incomePerHour]) => ({ id, name, controlPct, turfBoss, incomePerHour }));

export const WEAPON_MASTERY_TIERS = [
 [1, 'ROOKIE', 0, 1, 1], [2, 'OPERATIVE', 15, .88, 1.12], [3, 'SHARPSHOOTER', 40, .75, 1.25], [4, 'SYNDICATE ACE', 80, .62, 1.4],
].map(([tier, label, minKills, spreadModifier, reloadSpeedBonus]) => ({ tier, label, minKills, spreadModifier, reloadSpeedBonus }));

export function calculateCampaignCompletion(st) {
 if (!st) return 68.4;
 const m = (st.missionsDone / Math.max(1, st.missionsTotal)) * 45, r = (st.racesWon / Math.max(1, st.racesTotal)) * 15;
 const s = (st.stuntsCompleted / Math.max(1, st.stuntsTotal)) * 15, sh = (st.shellsCollected / Math.max(1, st.shellsTotal)) * 15;
 const c = ((st.crewCount || 3) / Math.max(1, st.crewTotal || 3)) * 10;
 return Number((m + r + s + sh + c).toFixed(1));
}

export function getDistrictControlSummary(state) {
 if (!state.districtControl) state.districtControl = DISTRICT_CONTROL_DEFAULTS.map((d) => ({ ...d }));
 let totalPct = 0, totalHourlyIncome = 0;
 for (const d of state.districtControl) { totalPct += d.controlPct; totalHourlyIncome += d.incomePerHour; }
 return { averageControlPct: Math.round(totalPct / state.districtControl.length), totalHourlyIncome, districts: state.districtControl };
}

export function updateProgression(state) {
 const r = state.player.respect;
 let cur = SYNDICATE_RANKS[0], nxt = SYNDICATE_RANKS[SYNDICATE_RANKS.length - 1];
 for (let i = 0; i < SYNDICATE_RANKS.length; i++) if (r >= SYNDICATE_RANKS[i].minRespect) {
  cur = SYNDICATE_RANKS[i]; nxt = SYNDICATE_RANKS[Math.min(i + 1, SYNDICATE_RANKS.length - 1)];
 }
 state.player.rank = Math.max(14, cur.rank);
 state.player.rankTitle = cur.rank >= 14 ? 'KINGPIN' : cur.title;
 state.player.heatDecayBonus = cur.heatDecayBonus;
 state.player.payoutMultiplier = cur.payoutMultiplier;
 state.player.nextRankRespect = nxt.minRespect;
 state.stats.completionPct = calculateCampaignCompletion(state.stats);
 getDistrictControlSummary(state);
}
