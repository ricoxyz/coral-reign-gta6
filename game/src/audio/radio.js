// Multi-Channel Procedural Synth Sequencer for 4 Palma Dorada FM Radio Stations (Toggleable with R)
export const RADIO_STATIONS = [
  {
    id: 'solana_fm',
    freq: '88.4',
    name: 'SOLANA FM 88.4',
    genre: 'Golden-Hour Synthwave & Outrun',
    dj: 'DJ Marisol',
    bpm: 118,
    rootNote: 220,
    chordIntervals: [0, 4, 7, 11, 14, 11, 7, 4],
    bassPattern: [1, 0, 1, 1, 0, 1, 1, 0],
    tracks: [
      { title: 'PALMA SUNSET', artist: 'Solana Chrome' },
      { title: 'NEON CAUSEWAY', artist: 'Mirador 84' },
      { title: 'OCEAN DRIVE TURBO', artist: 'Valeria & The Palms' },
    ],
  },
  {
    id: 'costa_brava',
    freq: '94.2',
    name: 'COSTA BRAVA 94.2',
    genre: 'Tropical Electro & Coastal House',
    dj: 'Hector El Sol',
    bpm: 124,
    rootNote: 246.94,
    chordIntervals: [0, 3, 7, 10, 12, 10, 7, 3],
    bassPattern: [1, 1, 0, 1, 1, 0, 1, 0],
    tracks: [
      { title: 'BRISA DE ORO', artist: 'Costa Marina' },
      { title: 'CABRIOLET MIRAGE', artist: 'Delfin Dorado' },
      { title: 'SOLANA LAGOON', artist: 'Club Paraiso' },
    ],
  },
  {
    id: 'bahia_bass',
    freq: '101.7',
    name: 'BAHIA BASS 101.7',
    genre: 'Harbor Trap, Urbano & Sub-Bass',
    dj: 'Kilo V',
    bpm: 140,
    rootNote: 164.81,
    chordIntervals: [0, 3, 5, 7, 10, 7, 5, 3],
    bassPattern: [1, 0, 0, 1, 0, 1, 0, 1],
    tracks: [
      { title: 'KINGPIN BULLION', artist: 'Mercado Cartel' },
      { title: 'LOWRIDER PIER', artist: 'Bahia 101' },
      { title: 'REDLINE INTERCEPT', artist: 'Rafa & Nitro' },
    ],
  },
  {
    id: 'palma_nocturna',
    freq: '106.3',
    name: 'PALMA NOCTURNA 106.3',
    genre: 'Cyber-Deco Darkwave & Arpeggio',
    dj: 'Nyx Dorada',
    bpm: 112,
    rootNote: 196.0,
    chordIntervals: [0, 2, 3, 7, 8, 7, 3, 2],
    bassPattern: [1, 1, 1, 0, 1, 1, 1, 0],
    tracks: [
      { title: 'VIDRIO SKYLINE', artist: 'Nocturna X' },
      { title: 'STARLIGHT HEIST', artist: 'Syndicate Zero' },
      { title: 'CHROME HORIZON', artist: 'Vortex GT' },
    ],
  },
];

export function getActiveRadioTrack(state) {
  const st = RADIO_STATIONS[state.radio.stationIndex % RADIO_STATIONS.length] || RADIO_STATIONS[0];
  const trackIdx = Math.floor((state.time || 0) / 28) % st.tracks.length;
  return {
    station: st,
    track: st.tracks[trackIdx] || st.tracks[0],
  };
}

export function formatRadioBanner(state) {
  if (state.radio.muted) return '♪ RADIO MUTED · [R] TUNER';
  const { station, track } = getActiveRadioTrack(state);
  return `♪ ${station.name} · "${track.title}"`;
}

export function initRadioSystem(state, events, soundEngine) {
  state.radio.stepIndex = 0;
  state.radio.stepTimer = 0;
  state.radio.calloutText = 'DJ Marisol: Rolling down Solana Strip at golden hour!';

  events.on('audio:nextRadio', () => {
    state.radio.stationIndex = (state.radio.stationIndex + 1) % (RADIO_STATIONS.length + 1);
    state.radio.muted = state.radio.stationIndex === RADIO_STATIONS.length;
    if (!state.radio.muted) {
      const { station, track } = getActiveRadioTrack(state);
      state.radio.calloutText = `${station.dj} (${station.name}): Now spinning "${track.title}" by ${track.artist}`;
      if (soundEngine) {
        soundEngine.playChime(station.rootNote * 2);
      }
    }
    events.emit('ui:refresh');
  });

  return {
    updateSequencer(dt) {
      if (state.radio.muted || !state.player.inVehicle) return;
      const { station } = getActiveRadioTrack(state);
      const stepDuration = 60 / station.bpm / 2;
      state.radio.stepTimer = (state.radio.stepTimer || 0) + dt;
      if (state.radio.stepTimer >= stepDuration) {
        state.radio.stepTimer -= stepDuration;
        state.radio.stepIndex = ((state.radio.stepIndex || 0) + 1) % station.chordIntervals.length;
      }
    },
  };
}
