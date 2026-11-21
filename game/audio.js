// SoundFX: tiny WebAudio synth for Spot It! No audio files, no network.
// A found difference plays a bright two-note chime, a wrong click a soft
// low blip, a hint a gentle pluck, and a level win a rising arpeggio.
var SoundFX = (function () {
  var ctx = null;
  var muted = false;

  function ensureContext() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, startAt, dur, type, vol) {
    var ac = ensureContext();
    if (!ac || muted) return;
    var osc = ac.createOscillator();
    var gain = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
    gain.gain.exponentialRampToValueAtTime(vol || 0.18, ac.currentTime + startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + startAt);
    osc.stop(ac.currentTime + startAt + dur + 0.05);
  }

  function foundChime() {
    tone(660, 0, 0.22, 'sine', 0.2);
    tone(880, 0.09, 0.3, 'sine', 0.2);
    tone(1320, 0.18, 0.28, 'triangle', 0.1);
  }

  function wrongBlip() {
    tone(180, 0, 0.18, 'sine', 0.14);
    tone(140, 0.08, 0.2, 'sine', 0.1);
  }

  function hintPluck() {
    tone(520, 0, 0.16, 'triangle', 0.14);
    tone(780, 0.07, 0.2, 'triangle', 0.12);
  }

  function winArpeggio() {
    var notes = [523, 659, 784, 1047];
    for (var i = 0; i < notes.length; i++) tone(notes[i], i * 0.11, 0.32, 'triangle', 0.16);
  }

  function tick() {
    tone(980, 0, 0.06, 'sine', 0.06);
  }

  function setMuted(value) { muted = !!value; }
  function isMuted() { return muted; }
  function unlock() { ensureContext(); }

  return {
    foundChime: foundChime,
    wrongBlip: wrongBlip,
    hintPluck: hintPluck,
    winArpeggio: winArpeggio,
    tick: tick,
    setMuted: setMuted,
    isMuted: isMuted,
    unlock: unlock
  };
})();
