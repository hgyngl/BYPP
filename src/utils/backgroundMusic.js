const CHORDS = [
  [130.81, 164.81, 196.0],
  [110.0, 130.81, 164.81],
  [146.83, 174.61, 220.0],
  [98.0, 123.47, 146.83]
];

const CHORD_DURATION = 3.2;
const SCHEDULE_AHEAD = 6.4;

let musicContext;
let masterGain;
let schedulerId;
let nextChordTime = 0;
let chordIndex = 0;
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

function scheduleChord(context, startAt, frequencies) {
  frequencies.forEach((frequency, voiceIndex) => {
    const oscillator = context.createOscillator();
    const voiceGain = context.createGain();
    const endAt = startAt + CHORD_DURATION + 0.7;

    oscillator.type = voiceIndex === 0 ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(frequency, startAt);
    oscillator.detune.setValueAtTime(voiceIndex === 1 ? -4 : voiceIndex === 2 ? 4 : 0, startAt);

    voiceGain.gain.setValueAtTime(0.0001, startAt);
    voiceGain.gain.exponentialRampToValueAtTime(0.055, startAt + 0.75);
    voiceGain.gain.setValueAtTime(0.055, startAt + 2.15);
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, endAt);

    oscillator.connect(voiceGain);
    voiceGain.connect(masterGain);
    oscillator.start(startAt);
    oscillator.stop(endAt + 0.05);
  });
}

function scheduleUpcomingChords() {
  if (!musicContext) return;

  while (nextChordTime < musicContext.currentTime + SCHEDULE_AHEAD) {
    scheduleChord(musicContext, nextChordTime, CHORDS[chordIndex]);
    nextChordTime += CHORD_DURATION;
    chordIndex = (chordIndex + 1) % CHORDS.length;
  }
}

export function startBackgroundMusic(volume = currentVolume) {
  const context = getMusicContext();
  if (!context) return;

  currentVolume = Math.min(1, Math.max(0, volume));
  masterGain.gain.setTargetAtTime(currentVolume, context.currentTime, 0.08);

  if (context.state === "suspended") context.resume();
  if (schedulerId) return;

  nextChordTime = context.currentTime + 0.08;
  scheduleUpcomingChords();
  schedulerId = window.setInterval(scheduleUpcomingChords, 1800);
}

export function setBackgroundMusicVolume(volume) {
  currentVolume = Math.min(1, Math.max(0, volume));
  if (!musicContext || !masterGain) return;
  masterGain.gain.setTargetAtTime(currentVolume, musicContext.currentTime, 0.08);
}
