// Simple sound effects using Web Audio API
class SoundEffects {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playTone(frequency, duration, type = 'sine') {
    if (!this.enabled) return;
    
    this.init();
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Cat purr sound - soft, gentle tones
  playCat() {
    this.playTone(300, 0.15, 'sine');
    setTimeout(() => this.playTone(250, 0.1, 'sine'), 50);
  }

  // Dog woof - deeper, sharper
  playDog() {
    this.playTone(150, 0.2, 'sawtooth');
  }

  // Win sound - ascending happy tones
  playWin() {
    [400, 500, 600, 800].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine'), i * 80);
    });
  }

  // Draw sound - neutral tone
  playDraw() {
    this.playTone(300, 0.3, 'triangle');
  }

  // Click sound
  playClick() {
    this.playTone(800, 0.05, 'square');
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }
}

export const sounds = new SoundEffects();
