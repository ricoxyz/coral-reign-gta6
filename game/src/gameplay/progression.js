// Syndicate Respect & Rank Progression Ladder (Ranks 1 to 20)
export const SYNDICATE_RANKS = [
  { rank: 1, title: 'STREET RUNNER', minRespect: 0 },
  { rank: 5, title: 'WHEELMAN', minRespect: 2500 },
  { rank: 10, title: 'HEIST CAPTAIN', minRespect: 7500 },
  { rank: 14, title: 'KINGPIN', minRespect: 13500 },
  { rank: 18, title: 'CARTEL SOVEREIGN', minRespect: 22000 },
  { rank: 20, title: 'CORAL EMPEROR', minRespect: 32000 },
];

export function updateProgression(state) {
  const r = state.player.respect;
  let current = SYNDICATE_RANKS[0];
  for (let i = 0; i < SYNDICATE_RANKS.length; i++) {
    if (r >= SYNDICATE_RANKS[i].minRespect) {
      current = SYNDICATE_RANKS[i];
    }
  }
  state.player.rank = Math.max(14, current.rank);
  state.player.rankTitle = current.title;
}
