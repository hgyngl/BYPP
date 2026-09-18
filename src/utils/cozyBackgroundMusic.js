const BEAT_DURATION = 0.72;
const BAR_DURATION = BEAT_DURATION * 4;
const SCHEDULE_AHEAD = BAR_DURATION * 3;

// 포근한 메이저 7th 화음과 오음계 멜로디로 만든 오리지널 진행입니다.
const SONG = [
  { chord: [130.81, 164.81, 196, 246.94], bass: 65.41, melody: [[0.5, 659.25], [1.5, 783.99], [2.5, 880], [3.25, 783.99]] },
  { chord: [110, 130.81, 164.81, 196], bass: 55, melody: [[0.5, 523.25], [1.5, 659.25], [2.5, 783.99], [3.25, 659.25]] },
  { chord: [87.31, 110, 130.81, 164.81], bass: 43.65, melody: [[0.5, 440], [1.5, 523.25], [2.5, 659.25], [3.25, 587.33]] },
  { chord: [98, 123.47, 146.83, 174.61], bass: 49, melody: [[0.5, 392], [1.5, 493.88], [2.5, 587.33], [3.25, 783.99]] },
  { chord: [82.41, 98, 123.47, 146.83], bass: 41.2, melody: [[0.5, 659.25], [1.25, 587.33], [2.25, 523.25], [3.25, 493.88]] },
  { chord: [87.31, 110, 130.81, 164.81], bass: 43.65, melody: [[0.5, 440], [1.5, 523.25], [2.5, 659.25], [3.25, 698.46]] },
  { chord: [98, 123.47, 146.83, 196], bass: 49, melody: [[0.5, 783.99], [1.25, 698.46], [2.25, 587.33], [3.25, 493.88]] },
  { chord: [130.81, 164.81, 196, 246.94], bass: 65.41, melody: [[0.5, 523.25], [1.5, 659.25], [2.5, 783.99], [3.25, 1046.5]] }
];

let musicContext;
let masterGain;
let schedulerId;
let nextBarTime = 0;
let barIndex = 0;
let currentVolume = 0.22;

function getMusicContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!musicContext) {
    musicContext = new AudioContextClass();
    masterGain = musicContext.createGain();
    masterGain.gain.value = currentVolume;
    masterGain.connect(musicContext.destination);
  }

  return musicContext;
}

function scheduleWarmChord(context, startAt, frequencies) {
  frequencies.forEach((frequency, voiceIndex) => {
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const voiceGain = context.createGain();
    const endAt = startAt + BAR_DURATION + 0.55;

    oscillator.type = voiceIndex === 0 ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(frequency, startAt);
    oscillator.detune.setValueAtTime((voiceIndex - 1.5) * 2.5, startAt);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(voiceIndex === 0 ? 720 : 1100, startAt);
    filter.Q.setValueAtTime(0.55, startAt);

    voiceGain.gain.setValueAtTime(0.0001, startAt);
    voiceGain.gain.exponentialRampToValueAtTime(0.042, startAt + 0.48);
    voiceGain.gain.setValueAtTime(0.042, startAt + BAR_DURATION - 0.48);
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, endAt);

    oscillator.connect(filter);
    filter.connect(voiceGain);
    voiceGain.connect(masterGain);
    oscillator.start(startAt);
    oscillator.stop(endAt + 0.05);
  });
}

function schedulePluck(context, startAt, frequency, duration = 0.52, volume = 0.055) {
  const body = context.createOscillator();
  const sparkle = context.createOscillator();
  const filter = context.createBiquadFilter();
  const noteGain = context.createGain();
  const endAt = startAt + duration;

  body.type = "triangle";
  body.frequency.setValueAtTime(frequency, startAt);
  sparkle.type = "sine";
  sparkle.frequency.setValueAtTime(frequency * 2, startAt);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2100, startAt);
  filter.frequency.exponentialRampToValueAtTime(850, endAt);
  filter.Q.setValueAtTime(0.8, startAt);

  noteGain.gain.setValueAtTime(0.0001, startAt);
  noteGain.gain.exponentialRampToValueAtTime(volume, startAt + 0.012);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, endAt);

  body.connect(filter);
  sparkle.connect(filter);
  filter.connect(noteGain);
  noteGain.connect(masterGain);
  body.start(startAt);
  sparkle.start(startAt);
  body.stop(endAt + 0.02);
  sparkle.stop(endAt + 0.02);
}

function scheduleBar(context, startAt, bar) {
  scheduleWarmChord(context, startAt, bar.chord);
  schedulePluck(context, startAt + 0.06, bar.bass, 0.78, 0.07);
  schedulePluck(context, startAt + BEAT_DURATION * 2 + 0.06, bar.bass * 2, 0.58, 0.04);

  bar.melody.forEach(([beat, frequency], noteIndex) => {
    const gentleSwing = noteIndex % 2 === 1 ? 0.045 : 0;
    schedulePluck(
      context,
      startAt + beat * BEAT_DURATION + gentleSwing,
      frequency,
      noteIndex === bar.melody.length - 1 ? 0.72 : 0.48,
      0.045
    );
  });
}

function scheduleUpcomingBars() {
  if (!musicContext) return;

  while (nextBarTime < musicContext.currentTime + SCHEDULE_AHEAD) {
    scheduleBar(musicContext, nextBarTime, SONG[barIndex]);
    nextBarTime += BAR_DURATION;
    barIndex = (barIndex + 1) % SONG.length;
  }
}

export function startBackgroundMusic(volume = currentVolume) {
  const context = getMusicContext();
  if (!context) return;

  currentVolume = Math.min(1, Math.max(0, volume));
  masterGain.gain.setTargetAtTime(currentVolume, context.currentTime, 0.08);

  if (context.state === "suspended") context.resume();
  if (schedulerId) return;

  nextBarTime = context.currentTime + 0.08;
  scheduleUpcomingBars();
  schedulerId = window.setInterval(scheduleUpcomingBars, 1500);
}

export function setBackgroundMusicVolume(volume) {
  currentVolume = Math.min(1, Math.max(0, volume));
  if (!musicContext || !masterGain) return;
  masterGain.gain.setTargetAtTime(currentVolume, musicContext.currentTime, 0.08);
}
