// Cinematic 3D Title Screen Controller & Career Save Slot Selector
export function updateTitleScreen(state, saveSystem) {
  const modal = document.getElementById('title-screen-modal');
  if (!modal) return;

  if (state.mode === 'title') {
    modal.classList.add('visible');
    saveSystem.renderSaveSlotsInto('title-save-slots', 'title');
  } else {
    modal.classList.remove('visible');
  }
}

export function bindMenuButtons(state, saveSystem, events, soundEngine) {
  const resumeGame = () => {
    state.mode = 'play';
    state.activeShot = null;
    state.customCamera = null;
    if (soundEngine) soundEngine.playChime(780);
    events.emit('ui:refresh');
  };

  const btnContinue = document.getElementById('btn-continue-career');
  if (btnContinue) {
    btnContinue.addEventListener('click', () => {
      saveSystem.loadSlot(1);
      resumeGame();
    });
  }

  const btnNew = document.getElementById('btn-new-career');
  if (btnNew) {
    btnNew.addEventListener('click', () => {
      state.mission.currentIndex = 0;
      state.mission.stageIndex = 0;
      resumeGame();
    });
  }

  const btnLoad = document.getElementById('btn-load-game');
  if (btnLoad) {
    btnLoad.addEventListener('click', () => {
      saveSystem.loadSlot(2);
      resumeGame();
    });
  }

  const btnFreeRoam = document.getElementById('btn-open-world-freeroam');
  if (btnFreeRoam) {
    btnFreeRoam.addEventListener('click', resumeGame);
  }

  const btnResume = document.getElementById('btn-resume-game');
  if (btnResume) {
    btnResume.addEventListener('click', resumeGame);
  }

  events.on('ui:toggleMap', () => {
    state.mode = state.mode === 'pause_map' ? 'play' : 'pause_map';
    if (state.mode === 'play') state.customCamera = null;
    events.emit('ui:refresh');
  });

  events.on('ui:togglePause', () => {
    state.mode = state.mode === 'pause_map' ? 'play' : 'pause_map';
    if (state.mode === 'play') state.customCamera = null;
    events.emit('ui:refresh');
  });
}
