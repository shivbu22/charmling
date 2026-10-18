const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  toggleDrawer: (shouldOpen) => ipcRenderer.send('toggle-drawer', Boolean(shouldOpen)),
  toggleStudioMode: () => ipcRenderer.send('toggle-studio-mode'),
  setAlwaysOnTop: (val) => ipcRenderer.send('set-always-on-top', Boolean(val)),
  setIgnoreMouseEvents: (ignore, options) => ipcRenderer.send('set-ignore-mouse-events', Boolean(ignore), options),
  moveWindowBy: (deltaX, deltaY) => ipcRenderer.send('move-window-by', { deltaX: Number(deltaX) || 0, deltaY: Number(deltaY) || 0 }),
  setWindowPosition: (pos) => {
    if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
      ipcRenderer.send('set-window-position', { x: pos.x, y: pos.y });
    }
  },
  setDesktopPreset: (presetName) => ipcRenderer.send('set-desktop-preset', String(presetName)),
  saveDesktopPosition: (pos) => ipcRenderer.send('save-desktop-position', pos),
  getDesktopPositionAsync: () => ipcRenderer.invoke('get-desktop-position'),
  getDesktopPosition: () => ipcRenderer.sendSync('get-desktop-position'),
  minimizeApp: () => ipcRenderer.send('minimize-app'),
  closeApp: () => ipcRenderer.send('close-app'),
  notify: (data) => ipcRenderer.send('notify', data),
  onDrawerStateChanged: (callback) => {
    if (typeof callback === 'function') {
      ipcRenderer.on('drawer-state-changed', (event, isOpen) => callback(isOpen));
    }
  },
  onStudioModeChanged: (callback) => {
    if (typeof callback === 'function') {
      ipcRenderer.on('studio-mode-changed', (event, isStudio) => callback(isStudio));
    }
  },
  onDesktopPresetApplied: (callback) => {
    if (typeof callback === 'function') {
      ipcRenderer.on('desktop-preset-applied', (event, presetName, pos) => callback(presetName, pos));
    }
  },
  onTriggerWanderMode: (callback) => {
    if (typeof callback === 'function') {
      ipcRenderer.on('trigger-wander-mode', () => callback());
    }
  },
  onTriggerFocusTimer: (callback) => {
    if (typeof callback === 'function') {
      ipcRenderer.on('trigger-focus-timer', (event, minutes) => callback(minutes));
    }
  }
});

