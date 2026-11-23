// Illustrated Crew Portrait Renderer & Live Narrative Dialogue Feed (Valeria, Rafa, Mateo)
export function renderCrewPortrait(canvas, seed = 2) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Sunset synthwave gradient background + palm silhouette
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  if (seed === 2) {
    grad.addColorStop(0, '#ff4d79');
    grad.addColorStop(0.55, '#6b2059');
    grad.addColorStop(1, '#15122b');
  } else if (seed === 1) {
    grad.addColorStop(0, '#00f0ff');
    grad.addColorStop(0.55, '#19406b');
    grad.addColorStop(1, '#0c1829');
  } else {
    grad.addColorStop(0, '#ffbf3c');
    grad.addColorStop(0.55, '#993a24');
    grad.addColorStop(1, '#1d1216');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Sun disc behind character
  ctx.fillStyle = 'rgba(255, 224, 128, 0.45)';
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.42, w * 0.34, 0, Math.PI * 2);
  ctx.fill();

  // Jacket shoulders & collar
  ctx.fillStyle = seed === 2 ? '#0e223d' : '#2a1628';
  ctx.beginPath();
  ctx.moveTo(w * 0.08, h);
  ctx.quadraticCurveTo(w * 0.5, h * 0.62, w * 0.92, h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = seed === 2 ? '#00f0ff' : '#ffbf3c';
  ctx.fillRect(w * 0.42, h * 0.72, w * 0.16, h * 0.28);

  // Hair silhouette
  ctx.fillStyle = '#140f1d';
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.38, w * 0.26, Math.PI * 0.85, Math.PI * 2.15);
  ctx.fill();

  // Neck & sculpted face
  ctx.fillStyle = '#d49068';
  ctx.fillRect(w * 0.43, h * 0.54, w * 0.14, h * 0.18);

  ctx.fillStyle = '#e5a47d';
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.43, w * 0.19, h * 0.23, 0, 0, Math.PI * 2);
  ctx.fill();

  // Neon aviator sunglasses + comms earpiece
  ctx.fillStyle = '#071222';
  ctx.fillRect(w * 0.32, h * 0.36, w * 0.16, h * 0.1);
  ctx.fillRect(w * 0.52, h * 0.36, w * 0.16, h * 0.1);
  ctx.fillStyle = seed === 2 ? '#00f0ff' : '#ffbf3c';
  ctx.fillRect(w * 0.33, h * 0.37, w * 0.14, h * 0.04);
  ctx.fillRect(w * 0.53, h * 0.37, w * 0.14, h * 0.04);

  // Tactical comms mic
  ctx.strokeStyle = '#ff4d79';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.3, h * 0.44);
  ctx.lineTo(w * 0.44, h * 0.55);
  ctx.stroke();
}

export function updateDialogueUI(state) {
  const speakerEl = document.getElementById('dialogue-speaker');
  const lineEl = document.getElementById('dialogue-line');
  const avatarCanvas = document.getElementById('dialogue-avatar');

  if (speakerEl) speakerEl.textContent = state.dialogue.speaker;
  if (lineEl) lineEl.textContent = state.dialogue.line;
  renderCrewPortrait(avatarCanvas, state.dialogue.portraitSeed);
}
