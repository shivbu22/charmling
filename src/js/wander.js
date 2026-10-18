/**
 * Charmling Wander Mode Engine
 * "Snip the cord!" — Charm detaches and walks freely as an interactive desktop pet,
 * with speech bubble one-liners, curiosity clicks, and elastic re-hanging.
 */

import { audio } from './audio.js';

export class WanderMode {
  constructor(wanderContainer, onRehang) {
    this.container = wanderContainer;
    this.onRehang = onRehang;
    this.isActive = false;

    this.x = 80;
    this.vx = 1.2;
    this.targetX = 140;
    this.facing = 1; // 1: right, -1: left
    this.isIdle = false;
    this.idleTimer = 0;
    this.stepCycle = 0;

    this.isDragging = false;
    this.currentCharmId = 'kitten';
    this.speedMode = 'walk'; // 'walk' | 'sprint' | 'hop'
    this.hopY = 0;
    this.hopVy = 0;

    this.quotes = [
      "Perimeter secure. All systems nominal.",
      "Spotted deep focus on screen today!",
      "Zero distractions detected. Outstanding work.",
      "Just taking a stroll past your taskbar.",
      "Remember to hydrate and take deep breaths.",
      "Fortune follows the persistent.",
      "Zooming across your screen! 🐾",
      "I love this desktop view!"
    ];

    this.setupDOM();
  }

  setupDOM() {
    this.container.innerHTML = `
      <div class="wander-walker" id="wanderWalker" title="Click to pet, or grab & drag me anywhere!">
        <div class="wander-speech" id="wanderSpeech"></div>
        <div class="wander-avatar" id="wanderAvatar"></div>
        <div class="wander-shadow"></div>
      </div>
      <button class="wander-rehang-btn" id="wanderRehangBtn" title="Re-hang Charm on Elastic Cord">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
        Re-hang Cord
      </button>
    `;

    this.walker = this.container.querySelector('#wanderWalker');
    this.avatar = this.container.querySelector('#wanderAvatar');
    this.speech = this.container.querySelector('#wanderSpeech');
    this.rehangBtn = this.container.querySelector('#wanderRehangBtn');

    this.bindEvents();
  }

  bindEvents() {
    let startScreenX = 0;
    let startScreenY = 0;
    let hasMoved = false;

    this.walker.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      this.isDragging = true;
      hasMoved = false;
      startScreenX = e.screenX;
      startScreenY = e.screenY;

      this.walker.classList.add('being-dragged');
      if (window.electronAPI && window.electronAPI.setIgnoreMouseEvents) {
        window.electronAPI.setIgnoreMouseEvents(false);
      }

      const onMove = (me) => {
        const deltaX = me.screenX - startScreenX;
        const deltaY = me.screenY - startScreenY;
        if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
          hasMoved = true;
          startScreenX = me.screenX;
          startScreenY = me.screenY;
          if (window.electronAPI && window.electronAPI.moveWindowBy) {
            window.electronAPI.moveWindowBy(deltaX, deltaY);
          }
          // Spatial audio panning during dragging
          const screenW = window.screen.width || 1920;
          const normX = Math.max(-1, Math.min(1, (me.screenX / screenW) * 2 - 1));
          audio.setCompanionPan(normX);
        }
      };

      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        this.isDragging = false;
        this.walker.classList.remove('being-dragged');

        if (hasMoved) {
          if (window.electronAPI && window.electronAPI.saveDesktopPosition) {
            window.electronAPI.saveDesktopPosition();
          }
          this.onDropLanding();
        } else {
          this.onWalkerClick();
        }
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    });

    this.rehangBtn.addEventListener('click', () => this.deactivate());
  }

  onDropLanding() {
    audio.playSnap();
    this.playCompanionSound();
    this.walker.classList.add('hop');
    setTimeout(() => this.walker.classList.remove('hop'), 400);
    this.say("Landed safely! Nice spot.");
  }

  playCompanionSound() {
    switch (this.currentCharmId) {
      case 'car':
        audio.playCarHorn();
        break;
      case 'shiba':
        audio.playDogBark();
        break;
      case 'frog':
        audio.playFrogCroak();
        break;
      case 'kitten':
        audio.playCatMew();
        break;
      case 'furin':
        audio.playFurinChime();
        break;
      default:
        audio.playPurrOrChirp();
        break;
    }
  }

  activate(charmSVG, charmId = 'kitten') {
    this.isActive = true;
    this.currentCharmId = charmId;
    this.container.classList.add('active');
    this.avatar.innerHTML = charmSVG;
    audio.playSnap();
    audio.playBell(587.33, 2.0, 0.3);

    // Initial drop-in animation
    this.walker.classList.add('dropping');
    setTimeout(() => this.walker.classList.remove('dropping'), 600);

    this.say("Agent on the ground! Drag me anywhere.");
    this.startLoop();
  }

  deactivate() {
    if (!this.isActive) return;
    this.isActive = false;
    this.container.classList.remove('active');
    this.stopLoop();
    audio.playSnap();
    audio.playBell(784, 2.5, 0.4);

    if (this.onRehang) {
      this.onRehang();
    }
  }

  onWalkerClick() {
    this.playCompanionSound();
    audio.playSparkle();
    this.walker.classList.add('hop');
    setTimeout(() => this.walker.classList.remove('hop'), 500);

    const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    this.say(randomQuote);
  }

  say(text) {
    if (!this.speech) return;
    this.speech.textContent = text;
    this.speech.classList.add('visible');

    if (this.speechTimer) clearTimeout(this.speechTimer);
    this.speechTimer = setTimeout(() => {
      this.speech.classList.remove('visible');
    }, 4500);
  }

  startLoop() {
    const loop = () => {
      if (!this.isActive) return;
      this.update();
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  stopLoop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.speechTimer) {
      clearTimeout(this.speechTimer);
      this.speechTimer = null;
    }
  }

  update() {
    if (this.isDragging) return;

    const bounds = this.container.getBoundingClientRect();
    const maxWidth = bounds.width > 100 ? bounds.width - 70 : 180;

    if (this.isIdle) {
      this.idleTimer--;
      if (this.idleTimer <= 0) {
        this.isIdle = false;
        this.targetX = 16 + Math.random() * maxWidth;
        this.facing = this.targetX > this.x ? 1 : -1;

        // Randomly pick speed mode: normal walk or exciting sprint!
        const rand = Math.random();
        if (rand > 0.65) {
          this.speedMode = 'sprint';
          this.vx = 3.4;
          if (this.currentCharmId === 'car') {
            audio.playCarZoom();
          }
        } else if (rand > 0.4) {
          this.speedMode = 'hop';
          this.vx = 2.2;
        } else {
          this.speedMode = 'walk';
          this.vx = 1.3;
        }
      }
    } else {
      const dx = this.targetX - this.x;
      if (Math.abs(dx) < 4) {
        this.isIdle = true;
        this.idleTimer = 80 + Math.floor(Math.random() * 110);
        this.walker.classList.remove('walking', 'sprinting');
      } else {
        this.x += Math.sign(dx) * this.vx;
        this.stepCycle += this.speedMode === 'sprint' ? 0.32 : 0.16;
        const bob = Math.abs(Math.sin(this.stepCycle)) * (this.speedMode === 'sprint' ? -7 : -3.5);
        this.avatar.style.transform = `scaleX(${this.facing}) translateY(${bob}px)`;

        this.walker.classList.toggle('sprinting', this.speedMode === 'sprint');
        this.walker.classList.toggle('walking', this.speedMode !== 'sprint');
      }
    }

    this.walker.style.transform = `translateX(${this.x}px)`;

    // Calculate real-time 3D spatial audio pan based on horizontal position
    const rect = this.walker.getBoundingClientRect();
    const walkerCenterX = rect.left + rect.width / 2;
    const viewWidth = window.innerWidth || 1200;
    const normX = Math.max(-1, Math.min(1, (walkerCenterX / viewWidth) * 2 - 1));
    audio.setCompanionPan(normX);
  }
}
