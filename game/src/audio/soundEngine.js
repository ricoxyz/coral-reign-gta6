// Pure WebAudio Synthesized Sound Effects Engine (zero external audio files)
export class SoundEngine {
 constructor() { this.ctx = null; this.muted = false; }
 ensureContext() {
  if (this.muted) return null;
  if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
  return this.ctx;
 }
 _tone(type, f0, f1, dur, vol) {
  const ctx = this.ensureContext(); if (!ctx) return;
  const osc = ctx.createOscillator(), gain = ctx.createGain(), t = ctx.currentTime;
  osc.type = type; osc.frequency.setValueAtTime(f0, t); osc.frequency.exponentialRampToValueAtTime(f1, t + dur);
  gain.gain.setValueAtTime(vol, t); gain.gain.exponentialRampToValueAtTime(.001, t + dur + .01);
  osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(t + dur + .02);
 }
 playChime(freq = 660) { this._tone('triangle', freq, freq * 1.35, .14, .08); }
 playGunshot() { this._tone('sawtooth', 220, 45, .11, .14); }
}
