let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  const AudioContextConstructor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextConstructor) {
    return null;
  }
  if (!audioContext) {
    audioContext = new AudioContextConstructor();
  }
  if (audioContext.state === 'suspended') {
    void audioContext.resume();
  }
  return audioContext;
};

const playTone = (frequency: number, startTime: number, duration: number, type: OscillatorType) => {
  const context = getAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const attack = 0.01;
  const decay = Math.max(0.05, duration - attack);

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.5, startTime + attack);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + attack + decay);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
};

export const playCorrect = () => {
  const context = getAudioContext();
  if (!context) return;

  const now = context.currentTime;
  const notes = [523.25, 659.25, 783.99];
  const noteDuration = 0.12;
  notes.forEach((frequency, index) => {
    playTone(frequency, now + index * 0.14, noteDuration, 'sine');
  });
};

export const playWrong = () => {
  const context = getAudioContext();
  if (!context) return;

  const now = context.currentTime;
  playTone(196.0, now, 0.18, 'triangle');
};
