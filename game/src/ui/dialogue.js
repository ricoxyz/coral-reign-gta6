// Illustrated Crew Portrait Renderer & Live Narrative Dialogue Feed (Valeria, Rafa, Mateo)
export function renderCrewPortrait(canvas, seed = 2) {
 if (!canvas) return;
 const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
 const grad = ctx.createLinearGradient(0, 0, 0, h);
 const stops = seed === 2 ? ['#ff4d79', '#6b2059', '#15122b'] : seed === 1 ? ['#00f0ff', '#19406b', '#0c1829'] : ['#ffbf3c', '#993a24', '#1d1216'];
 grad.addColorStop(0, stops[0]); grad.addColorStop(0.55, stops[1]); grad.addColorStop(1, stops[2]);
 ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);

 ctx.fillStyle = 'rgba(255,224,128,.45)';
 ctx.beginPath(); ctx.arc(w * 0.5, h * 0.42, w * 0.34, 0, Math.PI * 2); ctx.fill();

 ctx.fillStyle = seed === 2 ? '#0e223d' : '#2a1628';
 ctx.beginPath(); ctx.moveTo(w * 0.08, h); ctx.quadraticCurveTo(w * 0.5, h * 0.62, w * 0.92, h); ctx.closePath(); ctx.fill();

 ctx.fillStyle = seed === 2 ? '#00f0ff' : '#ffbf3c';
 ctx.fillRect(w * 0.42, h * 0.72, w * 0.16, h * 0.28);

 ctx.fillStyle = '#140f1d';
 ctx.beginPath(); ctx.arc(w * 0.5, h * 0.38, w * 0.26, Math.PI * 0.85, Math.PI * 2.15); ctx.fill();

 ctx.fillStyle = '#d49068'; ctx.fillRect(w * 0.43, h * 0.54, w * 0.14, h * 0.18);
 ctx.fillStyle = '#e5a47d'; ctx.beginPath(); ctx.ellipse(w * 0.5, h * 0.43, w * 0.19, h * 0.23, 0, 0, Math.PI * 2); ctx.fill();

 ctx.fillStyle = '#071222';
 ctx.fillRect(w * 0.32, h * 0.36, w * 0.16, h * 0.1); ctx.fillRect(w * 0.52, h * 0.36, w * 0.16, h * 0.1);
 ctx.fillStyle = seed === 2 ? '#00f0ff' : '#ffbf3c';
 ctx.fillRect(w * 0.33, h * 0.37, w * 0.14, h * 0.04); ctx.fillRect(w * 0.53, h * 0.37, w * 0.14, h * 0.04);

 ctx.strokeStyle = '#ff4d79'; ctx.lineWidth = 2;
 ctx.beginPath(); ctx.moveTo(w * 0.3, h * 0.44); ctx.lineTo(w * 0.44, h * 0.55); ctx.stroke();
}

export function updateDialogueUI(state) {
 const speakerEl = document.getElementById('dialogue-speaker');
 const lineEl = document.getElementById('dialogue-line');
 if (speakerEl) speakerEl.textContent = state.dialogue.speaker;
 if (lineEl) lineEl.textContent = state.dialogue.line;
 renderCrewPortrait(document.getElementById('dialogue-avatar'), state.dialogue.portraitSeed);
}
