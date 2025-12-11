// Sound effects for payment notifications

// Helper to get AudioContext with fallback
const getAudioContext = () => {
  if (typeof window === "undefined") {
    throw new Error("AudioContext not available");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

export const playSuccessSound = () => {
  try {
    const audioContext = getAudioContext();
    
    // Create a pleasant two-tone chime
    const playTone = (frequency: number, startTime: number, duration: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    const now = audioContext.currentTime;
    playTone(800, now, 0.15); // First chime
    playTone(1000, now + 0.15, 0.15); // Second chime
  } catch (error) {
    console.error("Failed to play sound:", error);
  }
};

export const playCashRegisterSound = () => {
  try {
    const audioContext = getAudioContext();
    
    // Simulate cash register "cha-ching"
    const playTone = (frequency: number, startTime: number, duration: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'triangle';
      
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };
    
    const now = audioContext.currentTime;
    playTone(1200, now, 0.1);
    playTone(1400, now + 0.05, 0.1);
    playTone(1600, now + 0.1, 0.2);
  } catch (error) {
    console.error("Failed to play sound:", error);
  }
};

export const playBellSound = () => {
  try {
    const audioContext = getAudioContext();
    
    // Simple bell sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 1000;
    oscillator.type = 'sine';
    
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    
    oscillator.start(now);
    oscillator.stop(now + 0.5);
  } catch (error) {
    console.error("Failed to play sound:", error);
  }
};

export type SoundEffect = 'chime' | 'cash-register' | 'bell' | 'none';

export const playSoundEffect = (effect: SoundEffect) => {
  if (typeof window === "undefined") {
    console.warn("Sound not available on server side");
    return;
  }
  
  console.log("Playing sound effect:", effect);
  
  switch (effect) {
    case 'chime':
      playSuccessSound();
      break;
    case 'cash-register':
      playCashRegisterSound();
      break;
    case 'bell':
      playBellSound();
      break;
    case 'none':
      // No sound
      break;
  }
};
