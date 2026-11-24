// Illustrated Crew Portrait Renderer & Live Narrative Dialogue Feed
export function renderCrewPortrait(canvas, seed = 2) {
 if (!canvas) return;
 const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height, g = ctx.createLinearGradient(0, 0, 0, h);
 const stops = seed === 2 ? ['#ff4d79', '#6b2059', '#15122b'] : seed === 1 ? ['#00f0ff', '#19406b', '#0c1829'] : ['#ffbf3c', '#993a24', '#1d1216'];
 g.addColorStop(0, stops[0]); g.addColorStop(.55, stops[1]); g.addColorStop(1, stops[2]);
 ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
 ctx.fillStyle = 'rgba(255,224,128,.45)'; ctx.beginPath(); ctx.arc(w * .5, h * .42, w * .34, 0, Math.PI * 2); ctx.fill();
 ctx.fillStyle = seed === 2 ? '#0e223d' : '#2a1628';
 ctx.beginPath(); ctx.moveTo(w * .08, h); ctx.quadraticCurveTo(w * .5, h * .62, w * .92, h); ctx.closePath(); ctx.fill();
 ctx.fillStyle = seed === 2 ? '#00f0ff' : '#ffbf3c'; ctx.fillRect(w * .42, h * .72, w * .16, h * .28);
 ctx.fillStyle = '#140f1d'; ctx.beginPath(); ctx.arc(w * .5, h * .38, w * .26, Math.PI * .85, Math.PI * 2.15); ctx.fill();
 ctx.fillStyle = '#d49068'; ctx.fillRect(w * .43, h * .54, w * .14, h * .18);
 ctx.fillStyle = '#e5a47d'; ctx.beginPath(); ctx.ellipse(w * .5, h * .43, w * .19, w * .23, 0, 0, Math.PI * 2); ctx.fill();
 ctx.fillStyle = '#071222'; ctx.fillRect(w * .32, h * .36, w * .16, h * .1); ctx.fillRect(w * .52, h * .36, w * .16, h * .1);
 ctx.fillStyle = seed === 2 ? '#00f0ff' : '#ffbf3c'; ctx.fillRect(w * .33, h * .37, w * .14, h * .04); ctx.fillRect(w * .53, h * .37, w * .14, h * .04);
 ctx.strokeStyle = '#ff4d79'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(w * .3, h * .44); ctx.lineTo(w * .44, h * .55); ctx.stroke();
}

export function updateDialogueUI(state) {
 const s = document.getElementById('dialogue-speaker'), l = document.getElementById('dialogue-line');
 if (s) s.textContent = state.dialogue.speaker;
 if (l) l.textContent = state.dialogue.line;
 renderCrewPortrait(document.getElementById('dialogue-avatar'), state.dialogue.portraitSeed);
}
