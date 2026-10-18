/**
 * Charmling Living Garden Engine
 * Manages evolution and growth states for living companions:
 * Bonsai Tree and Dragon Egg, tied to focus time and rituals.
 */

import { audio } from './audio.js';

const STORAGE_KEY = 'charmling_garden_state_v1';

class LivingGarden {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load garden state:', e);
    }
    return {
      bonsai: {
        stage: 3, // 1 to 5
        growthPoints: 45,
        lastWatered: Date.now()
      },
      dragon: {
        stage: 2, // 1 to 4 (1: egg, 2: warm runes, 3: cracked, 4: hatched)
        heatPoints: 30,
        lastFed: Date.now()
      },
      totalFocusMinutes: 75
    };
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save garden state:', e);
    }
    this.notify();
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.state));
  }

  /**
   * Water the Bonsai ritual
   */
  waterBonsai() {
    audio.playWater();
    audio.playBell(659.25, 2.8, 0.35);

    this.state.bonsai.growthPoints += 25;
    this.state.bonsai.lastWatered = Date.now();

    if (this.state.bonsai.growthPoints >= 100 && this.state.bonsai.stage < 5) {
      this.state.bonsai.stage++;
      this.state.bonsai.growthPoints = 0;
      audio.playSparkle();
    }
    this.saveState();
    return this.state.bonsai;
  }

  /**
   * Feed & Warm the Dragon Egg ritual
   */
  warmDragon() {
    audio.playBell(392, 3.0, 0.4);
    audio.playSparkle();

    this.state.dragon.heatPoints += 25;
    this.state.dragon.lastFed = Date.now();

    if (this.state.dragon.heatPoints >= 100 && this.state.dragon.stage < 4) {
      this.state.dragon.stage++;
      this.state.dragon.heatPoints = 0;
    }
    this.saveState();
    return this.state.dragon;
  }

  /**
   * Add completed focus session minutes
   */
  addFocusSession(minutes) {
    this.state.totalFocusMinutes += minutes;
    this.state.bonsai.growthPoints += Math.round(minutes * 0.8);
    this.state.dragon.heatPoints += Math.round(minutes * 0.9);

    if (this.state.bonsai.growthPoints >= 100 && this.state.bonsai.stage < 5) {
      this.state.bonsai.stage++;
      this.state.bonsai.growthPoints = 0;
    }
    if (this.state.dragon.heatPoints >= 100 && this.state.dragon.stage < 4) {
      this.state.dragon.stage++;
      this.state.dragon.heatPoints = 0;
    }
    this.saveState();
  }
}

export const garden = new LivingGarden();
