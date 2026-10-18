/**
 * Charmling Desktop Main Application Orchestrator
 * Integrates cord physics, vitrine drawer, wander companion, quiet tools,
 * procedural audio, and Windows desktop shell capabilities.
 */

import { CordPhysics } from './physics.js';
import { VitrineManager } from './vitrine.js';
import { WanderMode } from './wander.js';
import { ToolsManager } from './tools.js';
import { audio } from './audio.js';
import { CHARMS } from './charms-data.js';
import { renderCharmSVG } from './charm-renderers.js';
import { garden } from './garden.js';

class CharmlingApp {
  constructor() {
    this.currentCharm = CHARMS[0]; // Sakura Kitten default
    this.isDrawerOpen = false;
    this.isStudioMode = false;

    this.initDOM();
    this.initAudioAndCursor();
    this.initPhysics();
    this.initManagers();
    this.initIPC();
    this.initDesktopMousePassThrough();
    this.equipCharm(this.currentCharm);
  }

  initDOM() {
    this.canvas = document.getElementById('cordCanvas');
    this.hangingCharmEl = document.getElementById('hangingCharm');
    this.stageEl = document.getElementById('charmStage');
    this.drawerEl = document.getElementById('vitrineDrawer');
    this.drawerBackdrop = document.getElementById('drawerBackdrop');
    this.openDrawerBtn = document.getElementById('openDrawerBtn');
    this.closeDrawerBtn = document.getElementById('closeDrawerBtn');
    this.toggleModeBtn = document.getElementById('toggleModeBtn');
    this.muteBtn = document.getElementById('muteToggleBtn');
    this.wanderContainer = document.getElementById('wanderContainer');

    // Desktop Drag & Placement elements
    this.desktopDragHandle = document.getElementById('desktopDragHandle');
    this.desktopPlacementBtn = document.getElementById('desktopPlacementBtn');
    this.desktopPlacementPopover = document.getElementById('desktopPlacementPopover');
    this.closePlacementBtn = document.getElementById('closePlacementBtn');

    // Desktop File Drop Blessing Zone
    this.fileBlessOverlay = document.getElementById('fileBlessOverlay');
    this.blessingToast = document.getElementById('blessingToast');

    // Navigation shelf tabs in the drawer
    this.shelfTabs = document.querySelectorAll('.shelf-tab');
    this.shelfPanels = document.querySelectorAll('.shelf-panel');

    this.shelfTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetShelf = tab.dataset.shelf;
        this.shelfTabs.forEach(t => t.classList.remove('active'));
        this.shelfPanels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const activePanel = document.getElementById(`shelf-${targetShelf}`);
        if (activePanel) activePanel.classList.add('active');
        audio.playBell(784, 1.2, 0.2);
      });
    });

    if (this.openDrawerBtn) {
      this.openDrawerBtn.addEventListener('click', () => this.toggleDrawer(true));
    }
    if (this.closeDrawerBtn) {
      this.closeDrawerBtn.addEventListener('click', () => this.toggleDrawer(false));
    }
    if (this.drawerBackdrop) {
      this.drawerBackdrop.addEventListener('click', () => this.toggleDrawer(false));
    }

    if (this.toggleModeBtn) {
      this.toggleModeBtn.addEventListener('click', () => {
        if (window.electronAPI && window.electronAPI.toggleStudioMode) {
          window.electronAPI.toggleStudioMode();
        } else {
          this.setStudioMode(!this.isStudioMode);
        }
      });
    }

    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', () => {
        const isMuted = !audio.muted;
        audio.setMuted(isMuted);
        this.muteBtn.textContent = isMuted ? '🔇' : '🔔';
        this.muteBtn.title = isMuted ? 'Unmute Sound' : 'Mute Sound';
      });
    }

    // Top bead click triggers drawer
    const topBead = document.getElementById('topBailTrigger');
    if (topBead) {
      topBead.addEventListener('click', () => this.toggleDrawer());
    }

    this.initDesktopDragAndPlacement();
    this.initFileDragDropBlessing();
    this.initSoundVitrine();
  }

  initDesktopDragAndPlacement() {
    // 1. Dragging the gilded anchor to move the window anywhere across monitors
    if (this.desktopDragHandle) {
      this.desktopDragHandle.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        let lastScreenX = e.screenX;
        let lastScreenY = e.screenY;
        let hasMoved = false;

        if (window.electronAPI && window.electronAPI.setIgnoreMouseEvents) {
          window.electronAPI.setIgnoreMouseEvents(false);
        }

        const onMove = (me) => {
          const deltaX = me.screenX - lastScreenX;
          const deltaY = me.screenY - lastScreenY;
          if (Math.abs(deltaX) > 0 || Math.abs(deltaY) > 0) {
            hasMoved = true;
            lastScreenX = me.screenX;
            lastScreenY = me.screenY;
            if (window.electronAPI && window.electronAPI.moveWindowBy) {
              window.electronAPI.moveWindowBy(deltaX, deltaY);
            }
          }
        };

        const onUp = () => {
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
          if (hasMoved) {
            if (window.electronAPI && window.electronAPI.saveDesktopPosition) {
              window.electronAPI.saveDesktopPosition();
            }
          }
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
      });
    }

    // 2. Alt+Drag or Right-Click Drag directly on the charm
    if (this.hangingCharmEl) {
      this.hangingCharmEl.addEventListener('mousedown', (e) => {
        if (e.altKey || e.button === 2) {
          e.preventDefault();
          let lastScreenX = e.screenX;
          let lastScreenY = e.screenY;

          if (window.electronAPI && window.electronAPI.setIgnoreMouseEvents) {
            window.electronAPI.setIgnoreMouseEvents(false);
          }

          const onMove = (me) => {
            const deltaX = me.screenX - lastScreenX;
            const deltaY = me.screenY - lastScreenY;
            lastScreenX = me.screenX;
            lastScreenY = me.screenY;
            if (window.electronAPI && window.electronAPI.moveWindowBy) {
              window.electronAPI.moveWindowBy(deltaX, deltaY);
            }
          };

          const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            if (window.electronAPI && window.electronAPI.saveDesktopPosition) {
              window.electronAPI.saveDesktopPosition();
            }
          };

          window.addEventListener('mousemove', onMove);
          window.addEventListener('mouseup', onUp);
        }
      });

      this.hangingCharmEl.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // 3. Desktop Placement Presets Popover
    if (this.desktopPlacementBtn && this.desktopPlacementPopover) {
      this.desktopPlacementBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.desktopPlacementPopover.classList.toggle('open');
      });

      if (this.closePlacementBtn) {
        this.closePlacementBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.desktopPlacementPopover.classList.remove('open');
        });
      }

      document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const preset = btn.dataset.preset;
          if (window.electronAPI && window.electronAPI.setDesktopPreset) {
            window.electronAPI.setDesktopPreset(preset);
          }
          audio.playBell(659.25, 1.5, 0.25);
          this.desktopPlacementPopover.classList.remove('open');
        });
      });

      // Close popover when clicking outside
      document.addEventListener('click', (e) => {
        if (
          this.desktopPlacementPopover.classList.contains('open') &&
          !this.desktopPlacementPopover.contains(e.target) &&
          e.target !== this.desktopPlacementBtn
        ) {
          this.desktopPlacementPopover.classList.remove('open');
        }
      });
    }
  }

  initAudioAndCursor() {
    const curDot = document.getElementById('curDot');
    const curRing = document.getElementById('curRing');

    window.addEventListener('mousemove', (e) => {
      if (curDot) {
        curDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
      if (curRing) {
        curRing.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }

      // Interactive Pupil Tracking
      if (this.hangingCharmEl) {
        const rect = this.hangingCharmEl.getBoundingClientRect();
        const charmCenterX = rect.left + rect.width / 2;
        const charmCenterY = rect.top + 58;
        const dx = Math.max(-1, Math.min(1, (e.clientX - charmCenterX) / 75));
        const dy = Math.max(-1, Math.min(1, (e.clientY - charmCenterY) / 75));
        this.hangingCharmEl.style.setProperty('--pupil-x', dx.toFixed(2));
        this.hangingCharmEl.style.setProperty('--pupil-y', dy.toFixed(2));
      }
    });

    document.querySelectorAll('a, button, .charm-card, .timer-chip, #hangingCharm, #desktopDragHandle').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
    });
  }

  initPhysics() {
    this.physics = new CordPhysics(this.canvas, this.hangingCharmEl, () => {
      // Cord released
    });
    this.physics.start();
  }

  initManagers() {
    this.vitrine = new VitrineManager(
      (charm) => this.equipCharm(charm),
      (charm) => this.startWander(charm)
    );

    this.tools = new ToolsManager();

    this.wander = new WanderMode(this.wanderContainer, () => {
      this.rehangCharm();
    });

    garden.onChange(() => {
      if (this.currentCharm.isLiving) {
        this.equipCharm(this.currentCharm);
      }
    });
  }

  /**
   * Windows Desktop Pass-Through:
   * Only the interactive charm & controls capture clicks on Windows desktop!
   * The transparent background allows clicks to pass directly through to whatever
   * is underneath on the desktop.
   */
  initDesktopMousePassThrough() {
    if (!window.electronAPI || !window.electronAPI.setIgnoreMouseEvents) return;

    let isMouseOverInteractive = false;

    window.addEventListener('mousemove', (e) => {
      if (this.isDrawerOpen || this.isStudioMode) return;
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const isInteractive = Boolean(target && target.closest(
        '#hangingCharm, #charmTopBar, #desktopDragHandle, #desktopPlacementPopover, .icon-btn, .preset-btn, #wanderContainer, #topBailTrigger'
      ));

      if (isInteractive !== isMouseOverInteractive) {
        isMouseOverInteractive = isInteractive;
        window.electronAPI.setIgnoreMouseEvents(!isInteractive, { forward: true });
      }
    });

    const interactiveSelectors = [
      '#hangingCharm',
      '#charmTopBar',
      '#desktopDragHandle',
      '#desktopPlacementPopover',
      '#desktopPlacementBtn',
      '.preset-btn',
      '#vitrineDrawer',
      '#wanderContainer',
      '.icon-btn'
    ];

    interactiveSelectors.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) {
        el.addEventListener('mouseenter', () => {
          isMouseOverInteractive = true;
          window.electronAPI.setIgnoreMouseEvents(false);
        });
      }
    });

    // Default to pass-through when idle on desktop
    window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
  }

  initIPC() {
    if (window.electronAPI) {
      window.electronAPI.onDrawerStateChanged((isOpen) => {
        this.setDrawerState(isOpen);
      });

      window.electronAPI.onStudioModeChanged((isStudio) => {
        this.setStudioMode(isStudio);
      });

      window.electronAPI.onDesktopPresetApplied((presetName, pos) => {
        audio.playBell(659.25, 1.5, 0.25);
      });

      window.electronAPI.onTriggerWanderMode(() => {
        this.startWander(this.currentCharm);
      });

      window.electronAPI.onTriggerFocusTimer((mins) => {
        this.tools.setTimerMinutes(mins);
        this.tools.startTimer();
        this.toggleDrawer(true);
      });
    }
  }

  equipCharm(charm) {
    this.currentCharm = charm;
    const svg = renderCharmSVG(charm.id, this.vitrine.getCharmRenderState(charm));
    this.hangingCharmEl.innerHTML = svg;
    this.hangingCharmEl.setAttribute('data-motion', charm.motion);
  }

  toggleDrawer(force = null) {
    const nextState = force !== null ? force : !this.isDrawerOpen;
    if (window.electronAPI && window.electronAPI.toggleDrawer) {
      window.electronAPI.toggleDrawer(nextState);
    } else {
      this.setDrawerState(nextState);
    }
  }

  setDrawerState(isOpen) {
    this.isDrawerOpen = isOpen;
    if (this.vitrine && typeof this.vitrine.setDrawerVisibility === 'function') {
      this.vitrine.setDrawerVisibility(isOpen);
    }
    if (isOpen) {
      this.drawerEl.classList.add('open');
      if (this.drawerBackdrop) this.drawerBackdrop.classList.add('visible');
      if (window.electronAPI) window.electronAPI.setIgnoreMouseEvents(false);
      audio.playBell(440, 2.5, 0.3);
    } else {
      this.drawerEl.classList.remove('open');
      if (this.drawerBackdrop) this.drawerBackdrop.classList.remove('visible');
      if (window.electronAPI && !this.isStudioMode) {
        window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
      }
      audio.playSnap();
    }
  }

  setStudioMode(isStudio) {
    this.isStudioMode = isStudio;
    document.body.classList.toggle('studio-mode', isStudio);
    if (this.toggleModeBtn) {
      this.toggleModeBtn.textContent = isStudio ? '📌 Floating Desktop' : '🪟 Studio Window';
    }
    if (window.electronAPI) {
      window.electronAPI.setIgnoreMouseEvents(!isStudio && !this.isDrawerOpen, { forward: true });
    }
    setTimeout(() => this.physics.resize(), 150);
  }

  startWander(charm) {
    this.toggleDrawer(false);
    this.stageEl.classList.add('hidden');
    const svg = renderCharmSVG(charm.id, this.vitrine.getCharmRenderState(charm));
    this.wander.activate(svg, charm.id);
    if (window.electronAPI) {
      window.electronAPI.setIgnoreMouseEvents(false);
    }
  }

  rehangCharm() {
    this.stageEl.classList.remove('hidden');
    this.equipCharm(this.currentCharm);
    this.physics.bob.vy = 80; // spring drop bounce
    if (window.electronAPI && !this.isStudioMode) {
      window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
    }
  }

  initFileDragDropBlessing() {
    let dragCounter = 0;

    window.addEventListener('dragenter', (e) => {
      e.preventDefault();
      dragCounter++;
      if (window.electronAPI && window.electronAPI.setIgnoreMouseEvents) {
        window.electronAPI.setIgnoreMouseEvents(false);
      }
      if (this.fileBlessOverlay) {
        this.fileBlessOverlay.classList.add('active');
      }
    });

    window.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      if (this.fileBlessOverlay && !this.fileBlessOverlay.classList.contains('active')) {
        this.fileBlessOverlay.classList.add('active');
      }
    });

    window.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        dragCounter = 0;
        if (this.fileBlessOverlay) {
          this.fileBlessOverlay.classList.remove('active');
        }
        if (!this.isStudioMode && !this.isDrawerOpen && window.electronAPI) {
          window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
        }
      }
    });

    window.addEventListener('drop', (e) => {
      e.preventDefault();
      dragCounter = 0;
      if (this.fileBlessOverlay) {
        this.fileBlessOverlay.classList.remove('active');
      }
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        this.blessFile(files[0]);
      }
      if (!this.isStudioMode && !this.isDrawerOpen && window.electronAPI) {
        window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
      }
    });
  }

  blessFile(file) {
    if (!file) return;

    // Physical charm happy bounce
    if (this.physics && this.physics.bob) {
      this.physics.bob.vy = -75;
      const rect = this.hangingCharmEl ? this.hangingCharmEl.getBoundingClientRect() : { left: 100, top: 120 };
      this.physics.spawnSparks(rect.left + 50, rect.top + 40, 16, 'star');
    }

    // Sacred bell chime
    audio.playSparkle();
    audio.playSilverTemple();

    // Auto-stash in Quiet Tools Basket if present
    if (this.tools && typeof this.tools.addBasketFile === 'function') {
      this.tools.addBasketFile(file);
    }

    const safeName = String(file.name || 'document')
      .slice(0, 60)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    const blessingPhrases = [
      `✨ Blessed "${safeName}" with +10 Focus & Bug-Free Clarity!`,
      `🧿 Inscribed Golden Ward on "${safeName}" — Good fortune sealed!`,
      `🌸 Infused "${safeName}" with Serenity & Creative Flow!`,
      `🎐 Purified "${safeName}" with Harmonious Chimes!`,
      `⭐ Bestowed "${safeName}" with Swift Completion Luck!`
    ];
    const quote = blessingPhrases[Math.floor(Math.random() * blessingPhrases.length)];
    this.showBlessingToast(quote);
  }

  showBlessingToast(safeHtmlText) {
    if (!this.blessingToast) return;
    this.blessingToast.innerHTML = `
      <div style="font-size: 1.05rem; font-weight: 600; color: var(--gold); margin-bottom: 3px;">🍀 Blessing Bestowed</div>
      <div style="font-size: 0.84rem; color: var(--cream); opacity: 0.95; line-height: 1.4;">${safeHtmlText}</div>
    `;
    this.blessingToast.classList.add('show');
    if (this.blessingTimeout) clearTimeout(this.blessingTimeout);
    this.blessingTimeout = setTimeout(() => {
      this.blessingToast.classList.remove('show');
    }, 4000);
  }

  initSoundVitrine() {
    const chips = document.querySelectorAll('.sound-play-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const sound = chip.dataset.sound;
        if (!sound) return;

        chip.classList.add('playing');
        setTimeout(() => chip.classList.remove('playing'), 450);

        switch (sound) {
          case 'tibetan':
            audio.playTibetanBowl();
            break;
          case 'furin':
            audio.playFurinChime();
            break;
          case 'silver':
            audio.playSilverTemple();
            break;
          case 'desk':
            audio.playDeskBell();
            break;
          case 'gong':
            audio.playZenGong();
            break;
          case 'tubular':
            audio.playTubularChimes();
            break;
          case 'cat-mew':
            audio.playCatMew();
            break;
          case 'cat-purr':
            audio.playCatPurr();
            break;
          case 'dog-bark':
            audio.playDogBark();
            break;
          case 'bird-chirp':
            audio.playBirdChirp();
            break;
          case 'frog-croak':
            audio.playFrogCroak();
            break;
          case 'car-horn':
            audio.playCarHorn();
            break;
          case 'car-zoom':
            audio.playCarZoom();
            break;
          case 'tire-squeak':
            audio.playTireSqueak();
            break;
          case 'heart-chime':
            audio.playHeartChime();
            break;
          case 'ambient-rain':
            const isPlaying = audio.toggleAmbient('rain');
            chip.classList.toggle('active', isPlaying);
            break;
          default:
            audio.playBell(528, 2.0, 0.3);
            break;
        }
      });
    });
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new CharmlingApp();
});
