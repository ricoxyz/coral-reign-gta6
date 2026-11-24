// Multi-Channel Procedural Synth Sequencer for 4 Palma Dorada FM Radio Stations (Toggle [R])
const R = (id, freq, name, genre, dj, bpm, rootNote, chordIntervals, bassPattern, tracks) => ({
 id, freq, name, genre, dj, bpm, rootNote, chordIntervals, bassPattern,
 tracks: tracks.map(([title, artist]) => ({ title, artist })),
});

export const RADIO_STATIONS = [
 R('solana_fm', '88.4', 'SOLANA FM 88.4', 'Golden-Hour Synthwave & Outrun', 'DJ Marisol', 118, 220, [0, 4, 7, 11, 14, 11, 7, 4], [1, 0, 1, 1, 0, 1, 1, 0], [['PALMA SUNSET', 'Solana Chrome'], ['NEON CAUSEWAY', 'Mirador 84'], ['OCEAN DRIVE TURBO', 'Valeria & The Palms']]),
 R('costa_brava', '94.2', 'COSTA BRAVA 94.2', 'Tropical Electro & Coastal House', 'Hector El Sol', 124, 246.94, [0, 3, 7, 10, 12, 10, 7, 3], [1, 1, 0, 1, 1, 0, 1, 0], [['BRISA DE ORO', 'Costa Marina'], ['CABRIOLET MIRAGE', 'Delfin Dorado'], ['SOLANA LAGOON', 'Club Paraiso']]),
 R('bahia_bass', '101.7', 'BAHIA BASS 101.7', 'Harbor Trap, Urbano & Sub-Bass', 'Kilo V', 140, 164.81, [0, 3, 5, 7, 10, 7, 5, 3], [1, 0, 0, 1, 0, 1, 0, 1], [['KINGPIN BULLION', 'Mercado Cartel'], ['LOWRIDER PIER', 'Bahia 101'], ['REDLINE INTERCEPT', 'Rafa & Nitro']]),
 R('palma_nocturna', '106.3', 'PALMA NOCTURNA 106.3', 'Cyber-Deco Darkwave & Arpeggio', 'Nyx Dorada', 112, 196, [0, 2, 3, 7, 8, 7, 3, 2], [1, 1, 1, 0, 1, 1, 1, 0], [['VIDRIO SKYLINE', 'Nocturna X'], ['STARLIGHT HEIST', 'Syndicate Zero'], ['CHROME HORIZON', 'Vortex GT']]),
];

export function getActiveRadioTrack(state) {
 const station = RADIO_STATIONS[state.radio.stationIndex % RADIO_STATIONS.length] || RADIO_STATIONS[0];
 const trackIdx = Math.floor((state.time || 0) / 28) % station.tracks.length;
 return { station, track: station.tracks[trackIdx] || station.tracks[0] };
}

export function formatRadioBanner(state) {
 if (state.radio.muted) return '♪ RADIO MUTED · [R] TUNER';
 const { station, track } = getActiveRadioTrack(state);
 return `♪ ${station.name} · "${track.title}"`;
}

export function initRadioSystem(state, events, soundEngine) {
 state.radio.stepIndex = 0; state.radio.stepTimer = 0;
 state.radio.calloutText = 'DJ Marisol: Rolling down Solana Strip at golden hour!';
 events.on('audio:nextRadio', () => {
  state.radio.stationIndex = (state.radio.stationIndex + 1) % (RADIO_STATIONS.length + 1);
  state.radio.muted = state.radio.stationIndex === RADIO_STATIONS.length;
  if (!state.radio.muted) {
   const { station, track } = getActiveRadioTrack(state);
   state.radio.calloutText = `${station.dj} (${station.name}): Now spinning "${track.title}" by ${track.artist}`;
   soundEngine?.playChime(station.rootNote * 2);
  }
  events.emit('ui:refresh');
 });
 return {
  updateSequencer(dt) {
   if (state.radio.muted || !state.player.inVehicle) return;
   const { station } = getActiveRadioTrack(state), stepDur = 60 / station.bpm / 2;
   state.radio.stepTimer = (state.radio.stepTimer || 0) + dt;
   if (state.radio.stepTimer >= stepDur) {
    state.radio.stepTimer -= stepDur;
    state.radio.stepIndex = ((state.radio.stepIndex || 0) + 1) % station.chordIntervals.length;
   }
  },
 };
}
