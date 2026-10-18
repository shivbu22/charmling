/**
 * Charmling Procedural Audio Engine
 * Uses Web Audio API to synthesize high-fidelity acoustic bells, cord physics,
 * split-flap clicks, and meditative chimes with zero external audio assets.
 */

class CharmlingAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.ambientGain = null;
    this.ambientNodes = [];
    this.currentAmbient = null;
    this.companionPanner = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.companionPanner && this.ctx.createStereoPanner) {
      this.companionPanner = this.ctx.createStereoPanner();
      this.companionPanner.pan.setValueAtTime(0, this.ctx.currentTime);
      this.companionPanner.connect(this.ctx.destination);
    }
  }

  setCompanionPan(normX) {
    if (this.companionPanner && typeof normX === 'number' && !isNaN(normX)) {
      const clamped = Math.max(-1, Math.min(1, normX));
      this.companionPanner.pan.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    }
  }

  getCompanionDestination() {
    this.init();
    return this.companionPanner || this.ctx.destination;
  }

  setMuted(muted) {
    this.muted = muted;
    if (muted && this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }

  /**
   * Authentic Brass Temple Bell / Tibetan Singing Bowl
   * Features genuine physical harmonic partials with long natural decay
   */
  playBell(baseFreq = 528, duration = 3.2, gainFactor = 0.35) {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;

    // Resonant partial frequencies of bell physics (1, 2.76, 5.4, 8.9)
    const partials = [
      { ratio: 1.0, gain: 0.6, decay: duration },
      { ratio: 1.48, gain: 0.28, decay: duration * 0.8 },
      { ratio: 2.76, gain: 0.32, decay: duration * 0.6 },
      { ratio: 4.12, gain: 0.18, decay: duration * 0.4 },
      { ratio: 5.43, gain: 0.12, decay: duration * 0.25 }
    ];

    partials.forEach(({ ratio, gain, decay }) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      osc.type = ratio > 3 ? 'sine' : 'sine';
      osc.frequency.setValueAtTime(baseFreq * ratio, t);

      // Fast initial transient strike
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(gain * gainFactor, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + decay);

      osc.connect(g);
      g.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + decay);
    });
  }

  /**
   * Cord Stretch Sound - frequency modulation friction
   */
  playStretch(intensity = 0.5) {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140 + intensity * 80, t);
    osc.frequency.exponentialRampToValueAtTime(190 + intensity * 120, t + 0.08);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, t);
    filter.Q.setValueAtTime(4.0, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.08 * Math.min(intensity, 1.2), t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  /**
   * Elastic Snap / Cord Release Thud
   */
  playSnap() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.15);

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.2);

    // subtle secondary metallic ring
    this.playBell(880, 0.8, 0.08);
  }

  /**
   * Split-Flap Board Mechanical Click
   */
  playFlap() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;

    // Filtered noise burst for mechanical flap click
    const bufferSize = this.ctx.sampleRate * 0.02;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800 + Math.random() * 400, t);
    filter.Q.setValueAtTime(3.0, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  /**
   * Sparkle Burst for ritual effects or double-click
   */
  playSparkle() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const notes = [659.25, 783.99, 987.77, 1318.51, 1567.98];

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const delay = idx * 0.04;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + delay);

      gain.gain.setValueAtTime(0, t + delay);
      gain.gain.linearRampToValueAtTime(0.09, t + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + delay);
      osc.stop(t + delay + 0.4);
    });
  }

  /**
   * Zen Water Sprinkle (for bonsai watering)
   */
  playWater() {
    if (this.muted) return;
    this.init();
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        if (this.muted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 + Math.random() * 400, t);
        osc.frequency.exponentialRampToValueAtTime(1600 + Math.random() * 300, t + 0.08);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
      }, i * 70);
    }
  }

  /**
   * Procedural Ambient Focus Rain / Soundscape
   */
  toggleAmbient(type = 'rain') {
    this.init();
    if (this.currentAmbient === type) {
      this.stopAmbient();
      return false;
    }
    this.stopAmbient();

    if (this.muted) return false;

    this.currentAmbient = type;
    const t = this.ctx.currentTime;

    // Pink / White noise generator for rain
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700, t);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, t);
    this.ambientGain.gain.linearRampToValueAtTime(0.07, t + 1.5);

    noise.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.ctx.destination);

    noise.start(t);
    this.ambientNodes = [noise, filter, this.ambientGain];
    return true;
  }

  stopAmbient() {
    if (this.ambientNodes.length && this.ctx) {
      const t = this.ctx.currentTime;
      if (this.ambientGain) {
        this.ambientGain.gain.linearRampToValueAtTime(0.001, t + 0.5);
      }
      setTimeout(() => {
        this.ambientNodes.forEach(node => {
          try { node.stop ? node.stop() : node.disconnect(); } catch (e) {}
        });
        this.ambientNodes = [];
        this.ambientGain = null;
        this.currentAmbient = null;
      }, 550);
    } else {
      this.currentAmbient = null;
    }
  }

  /**
   * Ultra-Cute Squeak / Chirp (When Charm is clicked / tickled / bounced)
   */
  playPurrOrChirp() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(640, t);
    osc.frequency.exponentialRampToValueAtTime(1180, t + 0.06);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.12);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  /**
   * Gentle Bubble Pop
   */
  playPop() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(920, t + 0.04);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  /**
   * Celestial Pentatonic Heart Chime
   */
  playHeartChime() {
    if (this.muted) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (this.muted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.48);
      }, idx * 60);
    });
  }

  /* ============================================================
     EXPANDED ACOUSTIC BELLS (6 Varieties)
     ============================================================ */

  /** 1. Tibetan Singing Bowl (432Hz meditative warm drone) */
  playTibetanBowl(duration = 4.0) {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const partials = [
      { f: 432, g: 0.45, d: duration },
      { f: 432 * 2.76, g: 0.18, d: duration * 0.75 },
      { f: 432 * 5.4, g: 0.08, d: duration * 0.5 }
    ];
    partials.forEach(({ f, g, d }) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(g, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + d);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + d);
    });
  }

  /** 2. Japanese Edo Glass Furin Wind Chime (1175Hz sparkling breeze) */
  playFurinChime() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const pitches = [1174.66, 1396.91, 1760.00];
    pitches.forEach((freq, idx) => {
      setTimeout(() => {
        if (this.muted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 1.85);
      }, idx * 75);
    });
  }

  /** 3. Silver Temple Bell (880Hz clear crystal ring) */
  playSilverTemple() {
    this.playBell(880, 3.5, 0.4);
  }

  /** 4. Vintage Hotel Desk Bell (1760Hz sharp brass "ding!") */
  playDeskBell() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, t);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 1.25);
  }

  /** 5. Deep Zen Meditation Gong (216Hz rich resonant wash) */
  playZenGong(duration = 5.0) {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(216, t);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, t);
    filter.frequency.exponentialRampToValueAtTime(140, t + duration);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.1);
  }

  /** 6. Tubular Wind Chimes (Cascade of 5 silver harmonic pipes) */
  playTubularChimes() {
    if (this.muted) return;
    this.init();
    const notes = [587.33, 659.25, 880.00, 987.77, 1174.66];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (this.muted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 2.25);
      }, idx * 110);
    });
  }

  /* ============================================================
     ANIMAL SOUND SYNTHESIZERS (Mew, Purr, Bark, Chirp, Croak)
     ============================================================ */

  /** Cute Kitten Mew (Soft rising inflection) */
  playCatMew() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(620, t);
    osc.frequency.exponentialRampToValueAtTime(840, t + 0.12);
    osc.frequency.exponentialRampToValueAtTime(560, t + 0.28);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, t);
    filter.Q.setValueAtTime(3.5, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.24, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.getCompanionDestination());
    osc.start(t);
    osc.stop(t + 0.35);
  }

  /** Feline Throat Purr (Rhythmic micro-rumble) */
  playCatPurr(duration = 1.2) {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(54, t);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(26, t);
    lfoGain.gain.setValueAtTime(0.12, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    osc.connect(gain);
    gain.connect(this.getCompanionDestination());

    lfo.start(t);
    osc.start(t);
    lfo.stop(t + duration);
    osc.stop(t + duration);
  }

  /** Playful Puppy Yip / Bark */
  playDogBark() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.09);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.getCompanionDestination());
    osc.start(t);
    osc.stop(t + 0.14);
  }

  /** Morning Songbird Trill */
  playBirdChirp() {
    if (this.muted) return;
    this.init();
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (this.muted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1800 + i * 220, now);
        osc.frequency.exponentialRampToValueAtTime(2400 + i * 180, now + 0.05);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
        osc.connect(gain);
        gain.connect(this.getCompanionDestination());
        osc.start(now);
        osc.stop(now + 0.08);
      }, i * 65);
    }
  }

  /** Moon Lotus Frog Croak */
  playFrogCroak() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(130, t + 0.14);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, t);
    filter.Q.setValueAtTime(4.0, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.getCompanionDestination());
    osc.start(t);
    osc.stop(t + 0.18);
  }

  /* ============================================================
     CAR & VEHICLE SOUND SYNTHESIZERS (Horn, Motor Zoom, Drift)
     ============================================================ */

  /** Cute Retro Horn ("Beep-Beep!" dual harmonic 440Hz + 554Hz) */
  playCarHorn() {
    if (this.muted) return;
    this.init();
    for (let beep = 0; beep < 2; beep++) {
      setTimeout(() => {
        if (this.muted) return;
        const now = this.ctx.currentTime;
        [440, 554.37].forEach(f => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now);
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.18, now + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
          osc.connect(gain);
          gain.connect(this.getCompanionDestination());
          osc.start(now);
          osc.stop(now + 0.11);
        });
      }, beep * 120);
    }
  }

  /** Sports Roadster Motor Zoom / Rev */
  playCarZoom() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(260, t + 0.35);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.55);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(340, t);
    filter.frequency.linearRampToValueAtTime(680, t + 0.35);
    filter.frequency.exponentialRampToValueAtTime(280, t + 0.55);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.getCompanionDestination());
    osc.start(t);
    osc.stop(t + 0.58);
  }

  /** Playful Drift Chirp */
  playTireSqueak() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(980, t);
    osc.frequency.exponentialRampToValueAtTime(1450, t + 0.08);
    gain.gain.setValueAtTime(0.16, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    osc.connect(gain);
    gain.connect(this.getCompanionDestination());
    osc.start(t);
    osc.stop(t + 0.1);
  }
}

export const audio = new CharmlingAudio();
