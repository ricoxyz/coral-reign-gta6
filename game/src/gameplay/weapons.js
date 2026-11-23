// Full Ballistic Profiles for 6 Selectable Weapons (Keys 1-6): Muzzle Velocity, Spread, Recoil, Falloff & Reload
export const WEAPON_LOADOUT = [
  {
    slot: 1,
    id: 'fists',
    name: '[1] BRASS KNUCKLES',
    category: 'MELEE',
    mag: '∞',
    maxMag: '∞',
    reserve: '∞',
    damage: 32,
    cooldown: 0.34,
    range: 3.6,
    muzzleVelocity: 18,
    spreadDeg: 0,
    recoilKick: 0.02,
    recoilRecovery: 14.0,
    armorPenetration: 0.35,
    falloffStart: 2.5,
    falloffEnd: 3.8,
    reloadTime: 0,
    color: 0xffffff,
  },
  {
    slot: 2,
    id: 'coral_9mm',
    name: '[2] CORAL 9MM PISTOL',
    category: 'SIDEARM',
    mag: 15,
    maxMag: 15,
    reserve: 120,
    damage: 36,
    cooldown: 0.2,
    range: 78,
    muzzleVelocity: 360,
    spreadDeg: 1.4,
    recoilKick: 0.08,
    recoilRecovery: 9.5,
    armorPenetration: 0.55,
    falloffStart: 35,
    falloffEnd: 78,
    reloadTime: 1.25,
    color: 0xffbf3c,
  },
  {
    slot: 3,
    id: 'viper_smg',
    name: '[3] VIPER TACTICAL SMG',
    category: 'SMG',
    mag: 36,
    maxMag: 36,
    reserve: 240,
    damage: 27,
    cooldown: 0.085,
    range: 68,
    muzzleVelocity: 410,
    spreadDeg: 2.6,
    recoilKick: 0.06,
    recoilRecovery: 11.0,
    armorPenetration: 0.62,
    falloffStart: 26,
    falloffEnd: 68,
    reloadTime: 1.5,
    color: 0x00f0ff,
  },
  {
    slot: 4,
    id: 'solana_carbine',
    name: '[4] CARBINE AR-9',
    category: 'ASSAULT RIFLE',
    mag: 30,
    maxMag: 30,
    reserve: 210,
    damage: 46,
    cooldown: 0.11,
    range: 115,
    muzzleVelocity: 620,
    spreadDeg: 1.1,
    recoilKick: 0.075,
    recoilRecovery: 10.2,
    armorPenetration: 0.84,
    falloffStart: 58,
    falloffEnd: 115,
    reloadTime: 1.75,
    color: 0xffdf40,
  },
  {
    slot: 5,
    id: 'marina_shotgun',
    name: '[5] MARINA TACTICAL 12G',
    category: 'SHOTGUN',
    mag: 8,
    maxMag: 8,
    reserve: 64,
    damage: 94,
    cooldown: 0.52,
    range: 40,
    muzzleVelocity: 330,
    spreadDeg: 5.8,
    pellets: 6,
    recoilKick: 0.22,
    recoilRecovery: 6.5,
    armorPenetration: 0.7,
    falloffStart: 14,
    falloffEnd: 40,
    reloadTime: 2.1,
    color: 0xff7e29,
  },
  {
    slot: 6,
    id: 'rpg7_launcher',
    name: '[6] RPG-7 LAUNCHER',
    category: 'ORDNANCE',
    mag: 4,
    maxMag: 4,
    reserve: 16,
    damage: 240,
    blastRadius: 8.5,
    cooldown: 1.05,
    range: 145,
    muzzleVelocity: 195,
    spreadDeg: 0.4,
    recoilKick: 0.35,
    recoilRecovery: 4.5,
    armorPenetration: 1.0,
    falloffStart: 120,
    falloffEnd: 145,
    reloadTime: 2.6,
    color: 0x4eff91,
  },
];

export function computeBallisticDamage(weapon, distanceMeters, targetArmored = false) {
  let falloffFactor = 1.0;
  if (distanceMeters > weapon.falloffStart) {
    const span = Math.max(1, weapon.falloffEnd - weapon.falloffStart);
    falloffFactor = Math.max(0.35, 1 - (distanceMeters - weapon.falloffStart) / span);
  }
  const armorFactor = targetArmored ? weapon.armorPenetration : 1.0;
  return Math.round(weapon.damage * falloffFactor * armorFactor);
}

export function initWeaponsSystem(state, events, soundEngine) {
  state.weapons = WEAPON_LOADOUT.map((w) => ({ ...w, currentSpread: w.spreadDeg }));

  events.on('weapon:select', (idx) => {
    if (idx >= 0 && idx < state.weapons.length) {
      state.player.weaponIndex = idx;
      if (soundEngine) soundEngine.playChime(620 + idx * 55);
      events.emit('ui:refresh');
    }
  });

  return {
    getCurrentWeapon() {
      return state.weapons[state.player.weaponIndex] || state.weapons[3];
    },
    computeDamage(distanceMeters, targetArmored = false) {
      const wep = state.weapons[state.player.weaponIndex] || state.weapons[3];
      return computeBallisticDamage(wep, distanceMeters, targetArmored);
    },
  };
}
