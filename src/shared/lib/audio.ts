type WindowWithWebkitAudio = Window & {
  webkitAudioContext?: typeof AudioContext;
};

type SoundName = "bet" | "profit";
const PROFIT_SOUND_DURATION_SECONDS = 2;

let audioContext: AudioContext | null = null;
const soundSources: Record<SoundName, string> = {
  bet: "/sounds/Bet.mp3",
  profit: "/sounds/profit.mp3",
};
const soundTemplates = new Map<SoundName, HTMLAudioElement>();

const getAudioContext = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextConstructor =
    window.AudioContext ??
    (window as WindowWithWebkitAudio).webkitAudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  audioContext ??= new AudioContextConstructor();

  return audioContext;
};

const getSoundTemplate = (soundName: SoundName) => {
  if (typeof window === "undefined") {
    return null;
  }

  const existingAudio = soundTemplates.get(soundName);

  if (existingAudio) {
    return existingAudio;
  }

  const audio = new Audio(soundSources[soundName]);
  audio.preload = "auto";
  soundTemplates.set(soundName, audio);

  return audio;
};

const playBufferedSound = (soundName: SoundName) => {
  const template = getSoundTemplate(soundName);

  if (!template) {
    return;
  }

  const audioInstance = template.cloneNode() as HTMLAudioElement;
  audioInstance.volume = soundName === "bet" ? 0.35 : 0.45;

  if (soundName === "profit") {
    window.setTimeout(() => {
      audioInstance.pause();
      audioInstance.currentTime = 0;
    }, PROFIT_SOUND_DURATION_SECONDS * 1000);
  }

  void audioInstance.play().catch(() => {
    audioInstance.remove();
  });
};

export const primeGameSounds = async () => {
  const context = getAudioContext();

  if (context?.state === "suspended") {
    await context.resume();
  }

  getSoundTemplate("bet")?.load();
  getSoundTemplate("profit")?.load();
};

export const playBallTickSound = () => {
  const context = getAudioContext();

  if (!context || context.state !== "running") {
    return;
  }

  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(1320, now);
  oscillator.frequency.exponentialRampToValueAtTime(920, now + 0.045);

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(0.028, now + 0.004);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.055);
};

export const playBetSound = () => {
  playBufferedSound("bet");
};

export const playProfitSound = () => {
  playBufferedSound("profit");
};