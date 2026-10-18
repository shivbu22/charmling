/**
 * Charmling Elastic Cord Physics Engine
 * Multi-segment Verlet integration + Hooke's law spring dynamics
 * Simulates genuine physical tension, momentum, stretch, and pendulum swing.
 */

import { audio } from './audio.js';

export class CordPhysics {
  constructor(canvas, charmElement, onDropCallback) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.charm = charmElement;
    this.onDropCallback = onDropCallback;

    this.numSegments = 9;
    this.segmentLength = 11;
    this.points = [];
    this.gravity = 0.45;
    this.damping = 0.985;
    this.stiffness = 1.0;

    // Anchor at top center of canvas
    this.anchorX = 0;
    this.anchorY = 0;

    // Charm Bob state
    this.bob = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      mass: 1.8,
      radius: 28,
      rotation: 0,
      vRot: 0
    };

    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.lastStretchPlay = 0;

    this.glowEl = document.getElementById('charmAmbientGlow');
    this.sparkles = [];
    this.animationId = null;

    this.initPoints();
    this.bindEvents();
    this.resize();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 280;
    this.height = rect.height || 380;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.anchorX = this.width / 2;
    this.anchorY = 22; // Aligned with the center brass bead of the architectural lintel

    if (this.points.length === 0) {
      this.initPoints();
    } else {
      this.points[0].x = this.anchorX;
      this.points[0].y = this.anchorY;
    }
  }

  initPoints() {
    this.points = [];
    for (let i = 0; i <= this.numSegments; i++) {
      const y = this.anchorY + i * this.segmentLength;
      this.points.push({
        x: this.anchorX,
        y: y,
        oldX: this.anchorX,
        oldY: y
      });
    }
    const last = this.points[this.points.length - 1];
    this.bob.x = last.x;
    this.bob.y = last.y;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    // Charm pointer drag
    const onDown = (clientX, clientY) => {
      const rect = this.charm.getBoundingClientRect();
      if (
        clientX >= rect.left && clientX <= rect.right &&
        clientY >= rect.top && clientY <= rect.bottom
      ) {
        this.isDragging = true;
        this.dragOffset.x = clientX - (rect.left + rect.width / 2);
        this.dragOffset.y = clientY - (rect.top + 20);
        document.body.classList.add('cur-down');
        audio.init();
      }
    };

    const onMove = (clientX, clientY) => {
      if (!this.isDragging) return;
      const canvasRect = this.canvas.getBoundingClientRect();
      const targetX = clientX - canvasRect.left - this.dragOffset.x;
      const targetY = clientY - canvasRect.top - this.dragOffset.y;

      const last = this.points[this.points.length - 1];
      last.x = targetX;
      last.y = Math.max(targetY, this.anchorY + 30);

      // Audio feedback when stretching
      const dist = Math.hypot(last.x - this.anchorX, last.y - this.anchorY);
      const restLen = this.numSegments * this.segmentLength;
      if (dist > restLen + 20 && Date.now() - this.lastStretchPlay > 140) {
        audio.playStretch(Math.min((dist - restLen) / 80, 1.2));
        this.lastStretchPlay = Date.now();
      }
    };

    const onUp = () => {
      if (this.isDragging) {
        this.isDragging = false;
        document.body.classList.remove('cur-down');
        audio.playSnap();
        this.spawnSparks(this.bob.x, this.bob.y, 8);
        this.shudderRoom();
        if (this.onDropCallback) this.onDropCallback();
      }
    };

    this.charm.addEventListener('mousedown', (e) => {
      if (e.button === 0 && !e.altKey) {
        onDown(e.clientX, e.clientY);
      }
    });
    window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onUp);

    this.charm.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      onDown(t.clientX, t.clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging) return;
      const t = e.touches[0];
      onMove(t.clientX, t.clientY);
    }, { passive: true });

    window.addEventListener('touchend', onUp);

    // Single click / pet triggers adorable squish & heart burst
    this.charm.addEventListener('click', (e) => {
      if (!this.isDragging) {
        this.squishCharm();
      }
    });

    // Double click to trigger playful chime and sparkle burst
    this.charm.addEventListener('dblclick', () => {
      audio.playHeartChime();
      audio.playBell(784, 2.5, 0.4);
      this.spawnSparks(this.bob.x, this.bob.y, 14, 'heart');
      this.spawnSparks(this.bob.x, this.bob.y, 8, 'star');
      this.bob.vx += (Math.random() - 0.5) * 14;
      this.bob.vy -= 14;
    });
  }

  squishCharm() {
    audio.init();
    audio.playPurrOrChirp();
    this.charm.classList.remove('squish-bounce');
    void this.charm.offsetWidth; // trigger reflow
    this.charm.classList.add('squish-bounce');
    setTimeout(() => this.charm.classList.remove('squish-bounce'), 450);

    this.spawnSparks(this.bob.x, this.bob.y - 10, 5, 'heart');
    this.spawnSparks(this.bob.x, this.bob.y - 10, 3, 'star');
    this.bob.vy -= 6;
  }

  shudderRoom() {
    const el = document.body;
    el.classList.add('shudder');
    setTimeout(() => el.classList.remove('shudder'), 250);
  }

  spawnSparks(x, y, count = 8, type = null) {
    const types = ['star', 'heart', 'petal'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 3.8;
      const particleType = type || types[Math.floor(Math.random() * types.length)];
      this.sparkles.push({
        x,
        y: y - 18,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.6,
        life: 1.0,
        decay: 0.022 + Math.random() * 0.028,
        size: 2.2 + Math.random() * 3.2,
        type: particleType,
        rot: Math.random() * Math.PI
      });
    }
  }

  updateVerlet() {
    // Verlet Integration for rope nodes
    for (let i = 1; i < this.points.length; i++) {
      const p = this.points[i];
      if (i === this.points.length - 1 && this.isDragging) {
        continue; // Hand controls the bob while dragging
      }
      const vx = (p.x - p.oldX) * this.damping;
      const vy = (p.y - p.oldY) * this.damping;

      p.oldX = p.x;
      p.oldY = p.y;

      p.x += vx;
      p.y += vy + this.gravity;
    }

    // Relaxation constraint passes
    for (let pass = 0; pass < 5; pass++) {
      this.points[0].x = this.anchorX;
      this.points[0].y = this.anchorY;

      for (let i = 0; i < this.points.length - 1; i++) {
        const p1 = this.points[i];
        const p2 = this.points[i + 1];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) continue;

        const diff = (dist - this.segmentLength) / dist;
        const offsetX = dx * diff * 0.5 * this.stiffness;
        const offsetY = dy * diff * 0.5 * this.stiffness;

        if (i > 0) {
          p1.x += offsetX;
          p1.y += offsetY;
        }
        if (!(i + 1 === this.points.length - 1 && this.isDragging)) {
          p2.x -= offsetX;
          p2.y -= offsetY;
        }
      }
    }

    // Sync charm bob with last point
    const last = this.points[this.points.length - 1];
    const prev = this.points[this.points.length - 2];
    this.bob.x = last.x;
    this.bob.y = last.y;

    // Angular orientation derived from the final cord segment
    const angle = Math.atan2(last.x - prev.x, last.y - prev.y);
    this.bob.rotation = -angle * (180 / Math.PI);
  }

  updateSparkles() {
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const s = this.sparkles[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.12; // gravity
      s.life -= s.decay;
      if (s.life <= 0) {
        this.sparkles.splice(i, 1);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Top Brass Lintel Hook & Bead
    this.ctx.save();
    const beadGrad = this.ctx.createRadialGradient(
      this.anchorX - 2, this.anchorY - 2, 1,
      this.anchorX, this.anchorY, 8
    );
    beadGrad.addColorStop(0, '#ffe9ad');
    beadGrad.addColorStop(0.6, '#f2c14e');
    beadGrad.addColorStop(1, '#a97e2f');

    this.ctx.beginPath();
    this.ctx.arc(this.anchorX, this.anchorY, 5.5, 0, Math.PI * 2);
    this.ctx.fillStyle = beadGrad;
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    this.ctx.shadowBlur = 6;
    this.ctx.shadowOffsetY = 2;
    this.ctx.fill();
    this.ctx.restore();

    // Draw Elastic Golden Cord using Bezier Curve
    if (this.points.length > 2) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(this.points[0].x, this.points[0].y);

      for (let i = 1; i < this.points.length - 1; i++) {
        const xc = (this.points[i].x + this.points[i + 1].x) / 2;
        const yc = (this.points[i].y + this.points[i + 1].y) / 2;
        this.ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
      }
      this.ctx.lineTo(this.bob.x, this.bob.y);

      // Cord outer gradient
      const cordGrad = this.ctx.createLinearGradient(0, this.anchorY, 0, this.bob.y);
      cordGrad.addColorStop(0, 'rgba(242, 193, 78, 0.95)');
      cordGrad.addColorStop(1, 'rgba(169, 126, 47, 0.85)');

      this.ctx.strokeStyle = cordGrad;
      this.ctx.lineWidth = 2.2;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      this.ctx.shadowBlur = 4;
      this.ctx.stroke();
      this.ctx.restore();
    }

    // Draw Sparkles & Cute Floating Hearts / Stars
    this.sparkles.forEach(s => {
      this.ctx.save();
      if (s.type === 'heart') {
        this.ctx.font = `${Math.round(s.size * 3.6)}px sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = `rgba(244, 63, 94, ${s.life * 0.95})`;
        this.ctx.shadowColor = '#fb7185';
        this.ctx.shadowBlur = 8;
        this.ctx.fillText('♥', s.x, s.y);
      } else if (s.type === 'petal') {
        this.ctx.beginPath();
        this.ctx.ellipse(s.x, s.y, s.size * 2, s.size, s.rot || 0, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(251, 207, 232, ${s.life * 0.9})`;
        this.ctx.shadowColor = '#f472b6';
        this.ctx.shadowBlur = 6;
        this.ctx.fill();
      } else if (s.type === 'star') {
        this.ctx.font = `${Math.round(s.size * 3.4)}px sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = `rgba(242, 193, 78, ${s.life})`;
        this.ctx.shadowColor = '#fde047';
        this.ctx.shadowBlur = 10;
        this.ctx.fillText('★', s.x, s.y);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(242, 193, 78, ${s.life})`;
        this.ctx.shadowColor = '#fef08a';
        this.ctx.shadowBlur = 8;
        this.ctx.fill();
      }
      this.ctx.restore();
    });

    // Position HTML charm bob and ambient glow at the cord end
    if (this.charm) {
      const charmWidth = 100;
      this.charm.style.transform = `translate3d(${this.bob.x - charmWidth / 2}px, ${this.bob.y - 14}px, 0) rotate(${this.bob.rotation}deg)`;
    }

    if (this.glowEl) {
      const currentDist = Math.hypot(this.bob.x - this.anchorX, this.bob.y - this.anchorY);
      const restLength = this.numSegments * this.segmentLength;
      const stretch = Math.max(1, currentDist / restLength);
      const glowScale = Math.min(1.8, 1 + (stretch - 1) * 0.7);
      const glowOpacity = Math.min(0.95, 0.4 + (stretch - 1) * 0.55);
      this.glowEl.style.transform = `translate3d(${this.bob.x - 70}px, ${this.bob.y + 40}px, 0) scale(${glowScale})`;
      this.glowEl.style.opacity = glowOpacity;
    }
  }

  loop() {
    this.updateVerlet();
    this.updateSparkles();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (!this.animationId) {
      this.loop();
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}
