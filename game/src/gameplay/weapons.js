// 6 Selectable Weapons (Keys 1-6) with distinct fire rate, damage, spread, and ammo pools
export const WEAPON_LOADOUT = [
  { slot: 1, id: 'fists', name: '[1] BRASS KNUCKLES', mag: '∞', reserve: '∞', damage: 28, cooldown: 0.35, range: 3.5, color: 0xffffff },
  { slot: 2, id: 'pistol9', name: '[2] CORAL 9MM TACTICAL', mag: 15, reserve: 120, damage: 34, cooldown: 0.22, range: 75, color: 0xffbf3c },
  { slot: 3, id: 'vector_smg', name: '[3] SOLANA VECTOR SMG', mag: 36, reserve: 240, damage: 26, cooldown: 0.09, range: 65, color: 0x00f0ff },
  { slot: 4, id: 'carbine_ar', name: '[4] CARBINE AR-9', mag: 30, reserve: 210, damage: 45, cooldown: 0.12, range: 110, color: 0xff4d79 },
  { slot: 5, id: 'pump_12g', name: '[5] MARINA BREACHER 12G', mag: 8, reserve: 64, damage: 90, cooldown: 0.55, range: 38, color: 0xff7e29 },
  { slot: 6, id: 'launcher', name: '[6] DORADA PULSE LAUNCHER', mag: 4, reserve: 16, damage: 220, cooldown: 1.1, range: 140, color: 0x4eff91 },
];

export function initWeaponsSystem(state, events, soundEngine) {
  state.weapons = WEAPON_LOADOUT.map((w) => ({ ...w }));

  events.on('weapon:select', (idx) => {
    if (idx >= 0 && idx < state.weapons.length) {
      state.player.weaponIndex = idx;
      if (soundEngine) soundEngine.playChime(620 + idx * 55);
    }
  });

  return {
    getCurrentWeapon() {
      return state.weapons[state.player.weaponIndex] || state.weapons[3];
    },
  };
}
