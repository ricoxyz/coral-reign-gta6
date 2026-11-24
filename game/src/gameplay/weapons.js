// Ballistic Profiles for 6 Selectable Weapons (Keys 1-6): Velocity, Spread, Recoil, Falloff & Reload
const W = (slot, id, name, category, mag, reserve, damage, cooldown, range, muzzleVelocity, spreadDeg, recoilKick, recoilRecovery, armorPenetration, falloffStart, falloffEnd, reloadTime, color, extra = {}) => ({
 slot, id, name, category, mag, maxMag: mag, reserve, damage, cooldown, range, muzzleVelocity, spreadDeg, recoilKick, recoilRecovery, armorPenetration, falloffStart, falloffEnd, reloadTime, color, ...extra,
});

export const WEAPON_LOADOUT = [
 W(1, 'fists', '[1] BRASS KNUCKLES', 'MELEE', '∞', '∞', 32, .34, 3.6, 18, 0, .02, 14, .35, 2.5, 3.8, 0, 0xffffff),
 W(2, 'coral_9mm', '[2] CORAL 9MM PISTOL', 'SIDEARM', 15, 120, 36, .2, 78, 360, 1.4, .08, 9.5, .55, 35, 78, 1.25, 0xffbf3c),
 W(3, 'viper_smg', '[3] VIPER TACTICAL SMG', 'SMG', 36, 240, 27, .085, 68, 410, 2.6, .06, 11, .62, 26, 68, 1.5, 0x00f0ff),
 W(4, 'solana_carbine', '[4] CARBINE AR-9', 'ASSAULT RIFLE', 30, 210, 46, .11, 115, 620, 1.1, .075, 10.2, .84, 58, 115, 1.75, 0xffdf40),
 W(5, 'marina_shotgun', '[5] MARINA TACTICAL 12G', 'SHOTGUN', 8, 64, 94, .52, 40, 330, 5.8, .22, 6.5, .7, 14, 40, 2.1, 0xff7e29, { pellets: 6 }),
 W(6, 'rpg7_launcher', '[6] RPG-7 LAUNCHER', 'ORDNANCE', 4, 16, 240, 1.05, 145, 195, .4, .35, 4.5, 1, 120, 145, 2.6, 0x4eff91, { blastRadius: 8.5 }),
];

export function computeBallisticDamage(weapon, distanceMeters, targetArmored = false) {
 let falloff = 1;
 if (distanceMeters > weapon.falloffStart) falloff = Math.max(.35, 1 - (distanceMeters - weapon.falloffStart) / Math.max(1, weapon.falloffEnd - weapon.falloffStart));
 return Math.round(weapon.damage * falloff * (targetArmored ? weapon.armorPenetration : 1));
}

export function initWeaponsSystem(state, events, soundEngine) {
 state.weapons = WEAPON_LOADOUT.map((w) => ({ ...w, currentSpread: w.spreadDeg }));
 events.on('weapon:select', (idx) => {
  if (idx >= 0 && idx < state.weapons.length) {
   state.player.weaponIndex = idx;
   soundEngine?.playChime(620 + idx * 55);
   events.emit('ui:refresh');
  }
 });
 return {
  getCurrentWeapon: () => state.weapons[state.player.weaponIndex] || state.weapons[3],
  computeDamage: (dist, armored = false) => computeBallisticDamage(state.weapons[state.player.weaponIndex] || state.weapons[3], dist, armored),
 };
}
