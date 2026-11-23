// 3 In-Vehicle Synth Radio Stations of Palma Dorada (Toggleable with R)
export const RADIO_STATIONS = [
  { id: 'solana_synth', freq: '98.4', name: 'SOLANA SYNTH FM', genre: 'Sunset Outrun & Electro' },
  { id: 'marina_bajo', freq: '104.7', name: 'CORAL MARINA BASS', genre: 'Tropical Latin Club Beats' },
  { id: 'vidrio_nocturne', freq: '107.9', name: 'VIDRIO NIGHTWAVE', genre: 'Cyber-Deco Synth & Siren' },
];

export function initRadioSystem(state, events, soundEngine) {
  events.on('audio:nextRadio', () => {
    state.radio.stationIndex = (state.radio.stationIndex + 1) % (RADIO_STATIONS.length + 1);
    state.radio.muted = state.radio.stationIndex === RADIO_STATIONS.length;
    if (!state.radio.muted && soundEngine) {
      soundEngine.playChime(540 + state.radio.stationIndex * 110);
    }
  });
}
