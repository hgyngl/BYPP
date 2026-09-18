const SOUND_PATTERNS = {
  pickup: [
    { frequency: 420, delay: 0, duration: 0.06, volume: 0.5 }
  ],
  needle: [
    { frequency: 920, delay: 0, duration: 0.05, volume: 0.5 },
    { frequency: 1320, delay: 0.055, duration: 0.08, volume: 0.2 }
  ],
  stitch: [
    { frequency: 680, delay: 0, duration: 0.035, volume: 0.5 }
  ],
  button: [
    { frequency: 520, delay: 0, duration: 0.08, volume: 0.5 },
    { frequency: 760, delay: 0.075, duration: 0.12, volume: 0.4 }
  ],
  sewComplete: [
    { frequency: 440, delay: 0, duration: 0.09, volume: 0.35 },
    { frequency: 660, delay: 0.09, duration: 0.14, volume: 0.4 }
  ],
  complete: [
    { frequency: 523, delay: 0, duration: 0.12, volume: 0.45 },
    { frequency: 659, delay: 0.11, duration: 0.14, volume: 0.45 },
    { frequency: 784, delay: 0.23, duration: 0.22, volume: 0.5 }
  ]
};

let audioContext;

function createNoiseBuffer(context, duration) {
  const frameCount = Math.ceil(context.sampleRate * duration);
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }

  return buffer;
}

function playDoorClick(context) {
  const now = context.currentTime;
  const click = context.createOscillator();
  const clickGain = context.createGain();
  const body = context.createBufferSource();
  const bodyFilter = context.createBiquadFilter();
  const bodyGain = context.createGain();

  click.type = "square";
  click.frequency.setValueAtTime(1550, now);
  click.frequency.exponentialRampToValueAtTime(420, now + 0.045);
  clickGain.gain.setValueAtTime(0.12, now);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

  body.buffer = createNoiseBuffer(context, 0.085);
  bodyFilter.type = "bandpass";
  bodyFilter.frequency.setValueAtTime(1250, now);
  bodyFilter.Q.setValueAtTime(1.8, now);
  bodyGain.gain.setValueAtTime(0.075, now);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

  click.connect(clickGain);
  clickGain.connect(context.destination);
  body.connect(bodyFilter);
  bodyFilter.connect(bodyGain);
  bodyGain.connect(context.destination);

  click.start(now);
  click.stop(now + 0.06);
  body.start(now);
  body.stop(now + 0.085);
}

function playCottonStuff(context) {
  const now = context.currentTime;
  const rustle = context.createBufferSource();
  const rustleFilter = context.createBiquadFilter();
  const rustleGain = context.createGain();
  const softBody = context.createOscillator();
  const softBodyGain = context.createGain();

  rustle.buffer = createNoiseBuffer(context, 0.48);
  rustleFilter.type = "lowpass";
  rustleFilter.frequency.setValueAtTime(1050, now);
  rustleFilter.frequency.exponentialRampToValueAtTime(330, now + 0.48);
  rustleFilter.Q.setValueAtTime(0.7, now);
  rustleGain.gain.setValueAtTime(0.0001, now);
  rustleGain.gain.exponentialRampToValueAtTime(0.085, now + 0.035);
  rustleGain.gain.exponentialRampToValueAtTime(0.035, now + 0.28);
  rustleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

  softBody.type = "sine";
  softBody.frequency.setValueAtTime(220, now);
  softBody.frequency.exponentialRampToValueAtTime(135, now + 0.34);
  softBodyGain.gain.setValueAtTime(0.0001, now);
  softBodyGain.gain.exponentialRampToValueAtTime(0.055, now + 0.045);
  softBodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

  rustle.connect(rustleFilter);
  rustleFilter.connect(rustleGain);
  rustleGain.connect(context.destination);
  softBody.connect(softBodyGain);
  softBodyGain.connect(context.destination);

  rustle.start(now);
  rustle.stop(now + 0.48);
  softBody.start(now);
  softBody.stop(now + 0.4);
}

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  audioContext ??= new AudioContextClass();
  return audioContext;
}

export function playRepairSound(type) {
  const context = getAudioContext();
  if (!context) return;

  if (context.state === "suspended") context.resume();

  if (type === "doorClick") {
    playDoorClick(context);
    return;
  }

  if (type === "cotton") {
    playCottonStuff(context);
    return;
  }

  const notes = SOUND_PATTERNS[type];
  if (!notes) return;

  notes.forEach(({ frequency, delay, duration, volume }) => {
    const startAt = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.02);
  });
}
