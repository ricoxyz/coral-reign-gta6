// Procedural Crew Portrait Renderer & Live Narrative Dialogue Feed (Valeria, Rafa, Mateo)
export function renderCrewPortrait(canvas, seed = 2) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Sunset synthwave gradient background
  const grad = ctx.createLinearGradient(0, 0, w, h);
  if (seed === 2) {
    grad.addColorStop(0, '#ff3b78');
    grad.addColorStop(1, '#1d1033');
  } else if (seed === 1) {
    grad.addColorStop(0, '#00f0ff');
    grad.addColorStop(1, '#091d38');
  } else {
    grad.addColorStop(0, '#ffbf3c');
    grad.addColorStop(1, '#2a1608');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Stylized silhouette shoulders & head
  ctx.fillStyle = '#121829';
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.96, w * 0.38, Math.PI, 0);
  ctx.fill();

  ctx.fillStyle = '#e0a27a';
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.44, w * 0.22, 0, Math.PI * 2);
  ctx.fill();

  // Neon aviator visor
  ctx.fillStyle = seed === 2 ? '#00f0ff' : '#ffbf3c';
  ctx.fillRect(w * 0.32, h * 0.38, w * 0.36, h * 0.1);
}

export function updateDialogueUI(state) {
  const speakerEl = document.getElementById('dialogue-speaker');
  const lineEl = document.getElementById('dialogue-line');
  const avatarCanvas = document.getElementById('dialogue-avatar');

  if (speakerEl) speakerEl.textContent = state.dialogue.speaker;
  if (lineEl) lineEl.textContent = state.dialogue.line;
  renderCrewPortrait(avatarCanvas, state.dialogue.portraitSeed);
}
