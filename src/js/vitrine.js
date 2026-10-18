/**
 * Charmling Vitrine Drawer & Lore Showcase Controller
 * Handles charm selection, 3D card tilt, folklore vitrine, and interactive rituals.
 */

import { CHARMS, CATEGORIES } from './charms-data.js';
import { renderCharmSVG } from './charm-renderers.js';
import { audio } from './audio.js';
import { garden } from './garden.js';
import { Talisman3DScene } from './scene-3d.js';

export class VitrineManager {
  constructor(onEquipCharm, onStartWander) {
    this.onEquipCharm = onEquipCharm;
    this.onStartWander = onStartWander;
    this.currentCategory = 'luck';
    this.selectedCharm = CHARMS[0];
    this.ritualState = {};
    this.is3DMode = false;
    this.scene3D = null;

    this.initDOM();
  }

  initDOM() {
    this.catTabs = document.getElementById('vitrineCatTabs');
    this.grid = document.getElementById('vitrineGrid');
    this.caseAvatar = document.getElementById('vitrineCaseAvatar');
    this.case3DCanvasWrap = document.getElementById('case3DCanvasWrap');
    this.toggle3DBtn = document.getElementById('toggle3DBtn');
    this.talismanCanvas = document.getElementById('talisman3DCanvas');
    this.caseName = document.getElementById('vitrineCaseName');
    this.caseOrigin = document.getElementById('vitrineCaseOrigin');
    this.caseStory = document.getElementById('vitrineCaseStory');
    this.ritualActionName = document.getElementById('ritualActionName');
    this.ritualDesc = document.getElementById('vitrineRitualDesc');
    this.ritualBtn = document.getElementById('executeRitualBtn');
    this.equipBtn = document.getElementById('equipCharmBtn');
    this.wanderBtn = document.getElementById('vitrineWanderBtn');

    if (this.talismanCanvas) {
      try {
        this.scene3D = new Talisman3DScene(this.talismanCanvas);
      } catch (err) {
        console.warn('WebGL 3D Scene not supported on this device:', err);
      }
    }

    if (this.toggle3DBtn) {
      this.toggle3DBtn.addEventListener('click', () => {
        this.toggle3DView();
      });
    }

    this.renderTabs();
    this.renderGrid(this.currentCategory);
    this.updateCase(this.selectedCharm);

    if (this.ritualBtn) {
      this.ritualBtn.addEventListener('click', () => this.executeRitual());
    }
    if (this.equipBtn) {
      this.equipBtn.addEventListener('click', () => {
        audio.playBell(784, 2.5, 0.4);
        audio.playSparkle();
        if (this.onEquipCharm) {
          this.onEquipCharm(this.selectedCharm);
        }
        this.equipBtn.textContent = 'Hanging on Cord ✨';
        setTimeout(() => {
          this.equipBtn.textContent = 'Hang on Desktop Cord';
        }, 2000);
      });
    }
    if (this.wanderBtn) {
      this.wanderBtn.addEventListener('click', () => {
        if (this.onStartWander) {
          this.onStartWander(this.selectedCharm);
        }
      });
    }
  }

  renderTabs() {
    if (!this.catTabs) return;
    this.catTabs.innerHTML = CATEGORIES.map(cat => {
      const count = CHARMS.filter(c => c.category === cat.id).length;
      return `
        <button class="vit-tab ${cat.id === this.currentCategory ? 'active' : ''}" data-cat="${cat.id}">
          ${cat.name} <span class="tab-count">${count}</span>
        </button>
      `;
    }).join('');

    this.catTabs.querySelectorAll('.vit-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.currentCategory = tab.dataset.cat;
        this.catTabs.querySelectorAll('.vit-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.renderGrid(this.currentCategory);
      });
    });
  }

  renderGrid(categoryId) {
    if (!this.grid) return;
    const items = CHARMS.filter(c => c.category === categoryId);

    this.grid.innerHTML = items.map(charm => {
      const isSelected = charm.id === this.selectedCharm.id;
      const svg = renderCharmSVG(charm.id, this.getCharmRenderState(charm));
      return `
        <div class="charm-card ${isSelected ? 'active' : ''}" data-id="${charm.id}" tabindex="0">
          <div class="card-thumb" data-motion="${charm.motion}">
            ${svg}
          </div>
          <div class="card-name">${charm.name}</div>
          <div class="card-origin">${charm.origin}</div>
        </div>
      `;
    }).join('');

    this.grid.querySelectorAll('.charm-card').forEach(card => {
      const charmId = card.dataset.id;
      const charm = CHARMS.find(c => c.id === charmId);

      card.addEventListener('click', () => {
        this.grid.querySelectorAll('.charm-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        audio.playBell(659, 1.5, 0.25);
        this.selectedCharm = charm;
        this.updateCase(charm);
      });

      // 3D Card Tilt on pointer movement
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -16;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 16;
        card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  getCharmRenderState(charm) {
    if (charm.id === 'bonsai') {
      return { stage: garden.state.bonsai.stage };
    }
    if (charm.id === 'hatchling') {
      return {
        stage: garden.state.dragon.stage,
        cracked: garden.state.dragon.stage >= 2,
        hatched: garden.state.dragon.stage >= 3
      };
    }
    if (charm.id === 'daruma') {
      return { eyeFilled: this.ritualState['daruma_eye'] || false };
    }
    return { ritualActive: this.ritualState[charm.id] || false };
  }

  updateCase(charm) {
    if (!this.caseAvatar) return;

    const svg = renderCharmSVG(charm.id, this.getCharmRenderState(charm));
    this.caseAvatar.innerHTML = svg;
    this.caseAvatar.classList.remove('settling');
    void this.caseAvatar.offsetWidth;
    this.caseAvatar.classList.add('settling');

    if (this.is3DMode && this.scene3D) {
      this.scene3D.buildTalisman(charm.id);
    }

    if (this.caseName) this.caseName.textContent = charm.name;
    if (this.caseOrigin) this.caseOrigin.textContent = charm.origin;
    if (this.caseStory) this.caseStory.textContent = charm.story;

    if (this.ritualActionName) this.ritualActionName.textContent = charm.ritual.action;
    if (this.ritualDesc) this.ritualDesc.textContent = charm.ritual.desc;
  }

  toggle3DView(force = null) {
    if (!this.scene3D) return;
    this.is3DMode = force !== null ? force : !this.is3DMode;

    if (this.case3DCanvasWrap) {
      this.case3DCanvasWrap.classList.toggle('hidden', !this.is3DMode);
    }
    if (this.caseAvatar) {
      this.caseAvatar.classList.toggle('hidden', this.is3DMode);
    }
    if (this.toggle3DBtn) {
      this.toggle3DBtn.classList.toggle('active', this.is3DMode);
      this.toggle3DBtn.innerHTML = this.is3DMode
        ? '<span class="icon-3d">📜 View 2D</span>'
        : '<span class="icon-3d">✨ 3D Shrine</span>';
    }

    if (this.is3DMode) {
      this.scene3D.start();
      this.scene3D.buildTalisman(this.selectedCharm.id);
      audio.playHeartChime();
    } else {
      this.scene3D.stop();
      audio.playSnap();
    }
  }

  setDrawerVisibility(isOpen) {
    if (!this.scene3D) return;
    if (isOpen && this.is3DMode) {
      this.scene3D.start();
    } else {
      this.scene3D.stop();
    }
  }

  executeRitual() {
    const charm = this.selectedCharm;
    audio.playSparkle();

    if (charm.id === 'bonsai') {
      garden.waterBonsai();
      this.updateCase(charm);
      this.renderGrid(this.currentCategory);
      return;
    }

    if (charm.id === 'hatchling') {
      garden.warmDragon();
      this.updateCase(charm);
      this.renderGrid(this.currentCategory);
      return;
    }

    if (charm.id === 'daruma') {
      this.ritualState['daruma_eye'] = !this.ritualState['daruma_eye'];
      audio.playBell(587, 2.5, 0.4);
      this.updateCase(charm);
      this.renderGrid(this.currentCategory);
      return;
    }

    if (charm.id === 'catbell') {
      // 3 resonant rings
      audio.playBell(528, 2.0, 0.4);
      setTimeout(() => audio.playBell(659, 2.0, 0.4), 200);
      setTimeout(() => audio.playBell(784, 2.8, 0.4), 400);
    } else {
      audio.playBell(659, 3.0, 0.4);
    }

    this.ritualState[charm.id] = true;
    this.caseAvatar.classList.add('ritual-shimmer');
    setTimeout(() => {
      this.caseAvatar.classList.remove('ritual-shimmer');
      this.ritualState[charm.id] = false;
      this.updateCase(charm);
    }, 1200);

    this.updateCase(charm);
  }
}
