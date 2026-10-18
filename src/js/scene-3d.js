/**
 * Charmling 3D WebGL Talisman Engine
 * High-performance Three.js PBR rendering with studio rim lighting,
 * orbital mouse tilt, and floating gold dust particle field.
 */

import * as THREE from 'three';

export class Talisman3DScene {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.animId = null;
    this.isRunning = false;

    this.talismanGroup = null;
    this.particles = null;

    // Interaction & orbit state
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetRotX = 0;
    this.targetRotY = 0;
    this.isDragging = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;
    this.baseSpin = 0;

    this.init();
  }

  init() {
    if (!this.canvas) return;

    const width = this.canvas.clientWidth || 240;
    const height = this.canvas.clientHeight || 200;

    // 1. Renderer setup with high DPI and alpha transparency
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    // 2. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 4.2);

    // 3. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.9);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(2.5, 4, 3.5);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe3b55c, 1.2);
    fillLight.position.set(-3, -1, 2);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffe89e, 2.0);
    rimLight.position.set(0, 3, -3);
    this.scene.add(rimLight);

    // 4. Build 3D Talisman Model
    this.buildTalisman('drishti');

    // 5. Build Orbiting Gold Sparkle Field
    this.buildParticleAura();

    // 6. Bind Mouse Orbit Events
    this.bindEvents();
  }

  buildTalisman(charmId = 'drishti') {
    if (this.talismanGroup) {
      this.scene.remove(this.talismanGroup);
      this.disposeObject(this.talismanGroup);
    }

    this.talismanGroup = new THREE.Group();

    // PBR Gold Materials
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xdfad4a,
      metalness: 0.88,
      roughness: 0.22,
      envMapIntensity: 1.5
    });

    const darkGoldMat = new THREE.MeshStandardMaterial({
      color: 0x6e4e1a,
      metalness: 0.75,
      roughness: 0.4
    });

    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xf2c14e,
      emissive: 0x7a5210,
      metalness: 0.95,
      roughness: 0.12
    });

    const cordMat = new THREE.MeshStandardMaterial({
      color: 0xc0392f, // Crimson silk cord
      roughness: 0.65,
      metalness: 0.15
    });

    // Top Cord & Hanging Ring
    const ringGeo = new THREE.TorusGeometry(0.24, 0.045, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeo, goldMat);
    ringMesh.position.y = 1.35;
    this.talismanGroup.add(ringMesh);

    const cordGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 12);
    const cordMesh = new THREE.Mesh(cordGeo, cordMat);
    cordMesh.position.y = 1.7;
    this.talismanGroup.add(cordMesh);

    // Main Talisman Body: Ornate Plaque / Medallion
    const bodyGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.16, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, darkGoldMat);
    bodyMesh.rotation.x = Math.PI / 2;
    this.talismanGroup.add(bodyMesh);

    // Outer Gilded Bezel Ring
    const bezelGeo = new THREE.TorusGeometry(0.96, 0.065, 16, 48);
    const bezelMesh = new THREE.Mesh(bezelGeo, goldMat);
    this.talismanGroup.add(bezelMesh);

    // Inner Crest / Torus Knot
    const crestGeo = new THREE.TorusKnotGeometry(0.48, 0.1, 64, 16, 2, 3);
    const crestMesh = new THREE.Mesh(crestGeo, goldMat);
    crestMesh.position.z = 0.08;
    this.talismanGroup.add(crestMesh);

    // Central Core Pearl / Gem
    const gemGeo = new THREE.SphereGeometry(0.2, 24, 24);
    const gemMesh = new THREE.Mesh(gemGeo, gemMat);
    gemMesh.position.z = 0.16;
    this.talismanGroup.add(gemMesh);

    // Bottom Bell / Tassel Bead
    const beadGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const beadMesh = new THREE.Mesh(beadGeo, goldMat);
    beadMesh.position.y = -1.15;
    this.talismanGroup.add(beadMesh);

    const tasselGeo = new THREE.ConeGeometry(0.18, 0.55, 16);
    const tasselMesh = new THREE.Mesh(tasselGeo, cordMat);
    tasselMesh.position.y = -1.5;
    tasselMesh.rotation.x = Math.PI;
    this.talismanGroup.add(tasselMesh);

    this.scene.add(this.talismanGroup);
  }

  buildParticleAura() {
    const particleCount = 48;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      const r = 1.3 + Math.random() * 0.9;

      positions[i * 3] = r * Math.cos(phi) * Math.sin(theta);
      positions[i * 3 + 1] = r * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.cos(phi) * Math.cos(theta);

      scales[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom Canvas Texture for golden spark
    const sparkCanvas = document.createElement('canvas');
    sparkCanvas.width = 32;
    sparkCanvas.height = 32;
    const ctx = sparkCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, '#f2c14e');
    grad.addColorStop(0.8, 'rgba(227, 181, 92, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const sparkTexture = new THREE.CanvasTexture(sparkCanvas);

    const material = new THREE.PointsMaterial({
      color: 0xffe28a,
      size: 0.16,
      map: sparkTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  bindEvents() {
    if (!this.canvas) return;

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.lastPointerX;
        const dy = e.clientY - this.lastPointerY;
        this.lastPointerX = e.clientX;
        this.lastPointerY = e.clientY;

        this.targetRotY += dx * 0.015;
        this.targetRotX += dy * 0.012;
        this.targetRotX = Math.max(-0.6, Math.min(0.6, this.targetRotX));
      } else {
        const rect = this.canvas.getBoundingClientRect();
        if (
          e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom
        ) {
          const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
          this.targetRotY = normX * 0.45;
          this.targetRotX = -normY * 0.35;
        }
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch support for tablets/hybrids
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.isDragging = true;
        this.lastPointerX = e.touches[0].clientX;
        this.lastPointerY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length > 0) {
        const dx = e.touches[0].clientX - this.lastPointerX;
        const dy = e.touches[0].clientY - this.lastPointerY;
        this.lastPointerX = e.touches[0].clientX;
        this.lastPointerY = e.touches[0].clientY;

        this.targetRotY += dx * 0.015;
        this.targetRotX += dy * 0.012;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  resize() {
    if (!this.canvas || !this.renderer || !this.camera) return;
    const width = this.canvas.clientWidth || 240;
    const height = this.canvas.clientHeight || 200;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.resize();

    const animate = () => {
      if (!this.isRunning) return;
      this.animId = requestAnimationFrame(animate);

      // Idle continuous gentle rotation
      if (!this.isDragging) {
        this.baseSpin += 0.008;
      }

      if (this.talismanGroup) {
        // Smooth lerped motion
        this.talismanGroup.rotation.y += ((this.baseSpin + this.targetRotY) - this.talismanGroup.rotation.y) * 0.08;
        this.talismanGroup.rotation.x += (this.targetRotX - this.talismanGroup.rotation.x) * 0.08;

        // Subtle harmonic levitation bob
        this.talismanGroup.position.y = Math.sin(Date.now() * 0.0022) * 0.08;
      }

      if (this.particles) {
        this.particles.rotation.y -= 0.003;
        this.particles.rotation.z += 0.001;
      }

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  disposeObject(obj) {
    if (!obj) return;
    obj.traverse((child) => {
      if (child.isMesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
  }

  destroy() {
    this.stop();
    if (this.scene) {
      this.disposeObject(this.scene);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
