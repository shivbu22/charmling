/**
 * Charmling Quiet Productivity Suite
 * Focus Timer, Day Memory, File Basket, Split-Flap Board, and Shared Cord Simulator.
 */

import { audio } from './audio.js';
import { garden } from './garden.js';

export class ToolsManager {
  constructor() {
    this.timer = {
      totalSeconds: 25 * 60,
      remainingSeconds: 25 * 60,
      isRunning: false,
      intervalId: null
    };

    this.initTimer();
    this.initDayMemory();
    this.initFileBasket();
    this.initSplitFlap();
    this.initSharedCord();
  }

  /* ============================================================
     1. FOCUS TIMER (Zen Brass Singing Bowl & Garden Feed)
     ============================================================ */
  initTimer() {
    this.timerDisplay = document.getElementById('timerDisplay');
    this.timerBtn = document.getElementById('timerToggleBtn');
    this.timerReset = document.getElementById('timerResetBtn');
    this.timerChips = document.querySelectorAll('.timer-chip');
    this.ambientBtn = document.getElementById('timerAmbientBtn');

    if (!this.timerDisplay) return;

    this.timerChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const mins = parseInt(chip.dataset.mins, 10);
        this.setTimerMinutes(mins);
        this.timerChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });

    if (this.timerBtn) {
      this.timerBtn.addEventListener('click', () => this.toggleTimer());
    }
    if (this.timerReset) {
      this.timerReset.addEventListener('click', () => this.resetTimer());
    }
    if (this.ambientBtn) {
      this.ambientBtn.addEventListener('click', () => {
        const isPlaying = audio.toggleAmbient('rain');
        this.ambientBtn.classList.toggle('active', isPlaying);
        this.ambientBtn.textContent = isPlaying ? '🌧️ Rain On' : '🌧️ Rain Ambient';
      });
    }

    this.updateTimerDisplay();
  }

  setTimerMinutes(mins) {
    this.resetTimer();
    this.timer.totalSeconds = mins * 60;
    this.timer.remainingSeconds = mins * 60;
    this.updateTimerDisplay();
  }

  toggleTimer() {
    audio.init();
    if (this.timer.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.timer.isRunning = true;
    if (this.timerBtn) this.timerBtn.textContent = 'Pause Focus';
    audio.playBell(528, 3.5, 0.4); // 528 Hz transformation frequency

    this.timer.intervalId = setInterval(() => {
      this.timer.remainingSeconds--;
      this.updateTimerDisplay();

      if (this.timer.remainingSeconds <= 0) {
        this.completeTimer();
      }
    }, 1000);
  }

  pauseTimer() {
    this.timer.isRunning = false;
    if (this.timerBtn) this.timerBtn.textContent = 'Resume';
    if (this.timer.intervalId) {
      clearInterval(this.timer.intervalId);
      this.timer.intervalId = null;
    }
  }

  resetTimer() {
    this.pauseTimer();
    this.timer.remainingSeconds = this.timer.totalSeconds;
    if (this.timerBtn) this.timerBtn.textContent = 'Begin Focus';
    this.updateTimerDisplay();
  }

  completeTimer() {
    this.resetTimer();
    audio.playBell(440, 4.0, 0.5);
    audio.playSparkle();

    const focusMinutes = Math.round(this.timer.totalSeconds / 60);
    garden.addFocusSession(focusMinutes);

    if (window.electronAPI && window.electronAPI.notify) {
      window.electronAPI.notify({
        title: 'Focus Completed ✨',
        body: `Great session! Your Living Garden gained ${focusMinutes} minutes of growth.`
      });
    }

    alert(`Focus session complete! Your living companion absorbed ${focusMinutes} minutes of growth.`);
  }

  updateTimerDisplay() {
    if (!this.timerDisplay) return;
    const mins = Math.floor(this.timer.remainingSeconds / 60);
    const secs = this.timer.remainingSeconds % 60;
    this.timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /* ============================================================
     2. DAY MEMORY (Private Standup & Auto-Decaying Notes)
     ============================================================ */
  initDayMemory() {
    this.notesArea = document.getElementById('dayMemoryText');
    this.autoDecayToggle = document.getElementById('autoDecayToggle');
    this.clearNotesBtn = document.getElementById('clearNotesBtn');
    this.copyNotesBtn = document.getElementById('copyNotesBtn');

    if (!this.notesArea) return;

    // Load saved notes
    const savedNotes = localStorage.getItem('charmling_day_memory') || '';
    const lastSaved = localStorage.getItem('charmling_day_memory_timestamp');
    const autoDecay = localStorage.getItem('charmling_auto_decay') === 'true';

    if (autoDecay && lastSaved) {
      const hoursPassed = (Date.now() - parseInt(lastSaved, 10)) / (1000 * 60 * 60);
      if (hoursPassed > 48) {
        localStorage.removeItem('charmling_day_memory');
        this.notesArea.value = '';
      } else {
        this.notesArea.value = savedNotes;
      }
    } else {
      this.notesArea.value = savedNotes;
    }

    if (this.autoDecayToggle) {
      this.autoDecayToggle.checked = autoDecay;
      this.autoDecayToggle.addEventListener('change', () => {
        localStorage.setItem('charmling_auto_decay', this.autoDecayToggle.checked);
      });
    }

    this.notesArea.addEventListener('input', () => {
      localStorage.setItem('charmling_day_memory', this.notesArea.value);
      localStorage.setItem('charmling_day_memory_timestamp', Date.now().toString());
    });

    if (this.clearNotesBtn) {
      this.clearNotesBtn.addEventListener('click', () => {
        if (confirm('Clear today\'s memory notes?')) {
          this.notesArea.value = '';
          localStorage.removeItem('charmling_day_memory');
          audio.playSnap();
        }
      });
    }

    if (this.copyNotesBtn) {
      this.copyNotesBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(this.notesArea.value).then(() => {
          this.copyNotesBtn.textContent = 'Copied!';
          audio.playSparkle();
          setTimeout(() => {
            this.copyNotesBtn.textContent = 'Copy Standup';
          }, 2000);
        });
      });
    }
  }

  /* ============================================================
     3. FILE BASKET (Drag & Drop Inspection & Stash)
     ============================================================ */
  initFileBasket() {
    this.dropZone = document.getElementById('fileBasketDrop');
    this.basketList = document.getElementById('basketItemsList');
    this.basketFiles = [];

    if (!this.dropZone || !this.basketList) return;

    ['dragenter', 'dragover'].forEach(name => {
      this.dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        this.dropZone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      this.dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        this.dropZone.classList.remove('drag-over');
      });
    });

    this.dropZone.addEventListener('drop', (e) => {
      const files = Array.from(e.dataTransfer.files);
      if (files.length) {
        audio.playSnap();
        files.forEach(f => this.addBasketFile(f));
      }
    });
  }

  addBasketFile(file) {
    const item = {
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type || 'Document',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.basketFiles.unshift(item);
    this.renderBasket();
  }

  renderBasket() {
    if (!this.basketList) return;
    if (this.basketFiles.length === 0) {
      this.basketList.innerHTML = `<div class="empty-basket">No files stashed yet. Drag anything from your desktop here.</div>`;
      return;
    }

    const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

    this.basketList.innerHTML = this.basketFiles.map((file, idx) => `
      <div class="basket-item">
        <div class="bi-icon">📄</div>
        <div class="bi-details">
          <div class="bi-name" title="${esc(file.name)}">${esc(file.name)}</div>
          <div class="bi-meta">${esc(file.size)} • ${esc(file.timestamp)}</div>
        </div>
        <button class="bi-remove" data-idx="${idx}" title="Remove file">×</button>
      </div>
    `).join('');

    this.basketList.querySelectorAll('.bi-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        this.basketFiles.splice(idx, 1);
        this.renderBasket();
      });
    });
  }

  /* ============================================================
     4. MECHANICAL SPLIT-FLAP SCOREBOARD
     ============================================================ */
  initSplitFlap() {
    this.boardEl = document.getElementById('splitFlapBoard');
    this.flapChips = document.querySelectorAll('.flap-preset-chip');
    this.flapCustomInput = document.getElementById('flapCustomInput');

    if (!this.boardEl) return;

    this.currentText = 'FOCUS TIME';
    this.renderFlapText(this.currentText, false);

    this.flapChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.flapChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const text = chip.dataset.text;
        if (text === 'CLOCK') {
          const now = new Date();
          const timeStr = `TIME ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          this.setFlapText(timeStr);
        } else {
          this.setFlapText(text);
        }
      });
    });

    if (this.flapCustomInput) {
      this.flapCustomInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = this.flapCustomInput.value.trim().toUpperCase();
          if (val) this.setFlapText(val);
        }
      });
    }
  }

  setFlapText(targetText) {
    targetText = targetText.toUpperCase().slice(0, 12).padEnd(12, ' ');
    const chars = targetText.split('');
    const cells = this.boardEl.querySelectorAll('.flap-cell');

    chars.forEach((ch, idx) => {
      if (cells[idx]) {
        const currentCh = cells[idx].textContent;
        if (currentCh !== ch) {
          cells[idx].classList.add('flip');
          audio.playFlap();
          setTimeout(() => {
            cells[idx].textContent = ch;
            cells[idx].classList.remove('flip');
          }, 90);
        }
      }
    });
  }

  renderFlapText(text, animate = true) {
    const padded = text.toUpperCase().slice(0, 12).padEnd(12, ' ');
    this.boardEl.innerHTML = padded.split('').map(ch => `
      <div class="flap-cell ${ch >= '0' && ch <= '9' ? 'num' : ''}">${ch}</div>
    `).join('');
  }

  /* ============================================================
     5. SHARED CORD SIMULATOR (Twin Companion Swinging)
     ============================================================ */
  initSharedCord() {
    this.wireBead = document.getElementById('sharedWireBead');
    this.twinCharm = document.getElementById('twinHangCharm');
    this.pullBtn = document.getElementById('sharedPullBtn');

    if (!this.pullBtn) return;

    this.pullBtn.addEventListener('click', () => {
      this.triggerSharedTug();
    });
  }

  triggerSharedTug() {
    audio.playStretch(0.8);
    audio.playSnap();

    if (this.wireBead) {
      this.wireBead.classList.remove('travel');
      void this.wireBead.offsetWidth; // trigger reflow
      this.wireBead.classList.add('travel');
    }

    // Twin charm swings a moment later
    setTimeout(() => {
      if (this.twinCharm) {
        audio.playBell(659, 2.0, 0.3);
        this.twinCharm.classList.add('swinging');
        setTimeout(() => {
          this.twinCharm.classList.remove('swinging');
        }, 2200);
      }
    }, 700);
  }
}
