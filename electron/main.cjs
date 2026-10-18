const { app, BrowserWindow, Tray, Menu, ipcMain, screen, nativeImage, Notification } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;
let tray = null;
let isDrawerOpen = false;
let isStudioMode = false;

// Default sizes
const COLLAPSED_WIDTH = 280;
const COLLAPSED_HEIGHT = 380;
const EXPANDED_WIDTH = 980;
const EXPANDED_HEIGHT = 800;

// Last known floating position on desktop
let lastFloatingPos = null;

function getConfigFile() {
  return path.join(app.getPath('userData'), 'desktop-position.json');
}

function clampToScreen(x, y, width, height) {
  const allDisplays = screen.getAllDisplays();
  const display = (typeof x === 'number' && typeof y === 'number')
    ? (screen.getDisplayNearestPoint({ x, y }) || screen.getPrimaryDisplay())
    : screen.getPrimaryDisplay();

  const { x: sx, y: sy, width: sw, height: sh } = display.workArea;
  const clampedX = Math.round(Math.max(sx, Math.min(sx + sw - width, x)));
  const clampedY = Math.round(Math.max(sy, Math.min(sy + sh - height, y)));
  return { x: clampedX, y: clampedY };
}

function loadSavedPosition() {
  try {
    const file = getConfigFile();
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (typeof data.x === 'number' && typeof data.y === 'number' && !isNaN(data.x) && !isNaN(data.y)) {
        return clampToScreen(data.x, data.y, COLLAPSED_WIDTH, COLLAPSED_HEIGHT);
      }
    }
  } catch (err) {
    console.error('Failed to load saved position:', err);
  }
  return null;
}

function savePosition(pos) {
  if (isDrawerOpen || isStudioMode) return;
  if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number' || isNaN(pos.x) || isNaN(pos.y)) return;
  try {
    const clamped = clampToScreen(pos.x, pos.y, COLLAPSED_WIDTH, COLLAPSED_HEIGHT);
    const file = getConfigFile();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(clamped, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save position:', err);
  }
}

function createTrayIcon() {
  const icoPath = path.join(__dirname, '../public/icon.ico');
  const pngPath = path.join(__dirname, '../public/icon.png');
  if (fs.existsSync(icoPath)) {
    try {
      const img = nativeImage.createFromPath(icoPath);
      if (!img.isEmpty()) return img;
    } catch (e) {
      console.warn('Failed to load ico from path:', e);
    }
  }
  if (fs.existsSync(pngPath)) {
    try {
      const img = nativeImage.createFromPath(pngPath);
      if (!img.isEmpty()) {
        return img.resize({ width: 16, height: 16 });
      }
    } catch (e) {
      console.warn('Failed to load icon from path:', e);
    }
  }
  return null;
}

function getDesktopTopPosition(width, height) {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, x: screenX, y: screenY } = primaryDisplay.workArea;
  const x = Math.round(screenX + (screenWidth - width) / 2);
  const y = screenY; // anchored to top of Windows desktop
  return { x, y };
}

function calculatePresetPosition(presetName) {
  const display = lastFloatingPos 
    ? screen.getDisplayNearestPoint({ x: lastFloatingPos.x, y: lastFloatingPos.y })
    : screen.getPrimaryDisplay();
  const { width, height, x: screenX, y: screenY } = display.workArea;

  switch (presetName) {
    case 'top-right':
      return { x: screenX + width - COLLAPSED_WIDTH - 24, y: screenY };
    case 'top-left':
      return { x: screenX + 24, y: screenY };
    case 'bottom-right':
      return { x: screenX + width - COLLAPSED_WIDTH - 24, y: screenY + height - COLLAPSED_HEIGHT - 12 };
    case 'bottom-left':
      return { x: screenX + 24, y: screenY + height - COLLAPSED_HEIGHT - 12 };
    case 'center':
      return { 
        x: Math.round(screenX + (width - COLLAPSED_WIDTH) / 2), 
        y: Math.round(screenY + (height - COLLAPSED_HEIGHT) / 2) 
      };
    case 'top-center':
    default:
      return { x: Math.round(screenX + (width - COLLAPSED_WIDTH) / 2), y: screenY };
  }
}

function applyDesktopPreset(presetName) {
  const rawPos = calculatePresetPosition(presetName);
  const pos = clampToScreen(rawPos.x, rawPos.y, COLLAPSED_WIDTH, COLLAPSED_HEIGHT);
  lastFloatingPos = pos;
  savePosition(pos);

  if (mainWindow && !isDrawerOpen && !isStudioMode) {
    mainWindow.setPosition(pos.x, pos.y, true);
  }
  if (mainWindow) {
    mainWindow.webContents.send('desktop-preset-applied', presetName, pos);
  }
}

function createWindow() {
  const saved = loadSavedPosition();
  const initialPos = saved || getDesktopTopPosition(COLLAPSED_WIDTH, COLLAPSED_HEIGHT);
  lastFloatingPos = initialPos;

  mainWindow = new BrowserWindow({
    width: COLLAPSED_WIDTH,
    height: COLLAPSED_HEIGHT,
    x: initialPos.x,
    y: Math.max(0, initialPos.y),
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    skipTaskbar: false,
    hasShadow: false,
    show: false,
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  setTimeout(() => {
    if (mainWindow && !mainWindow.isVisible()) {
      mainWindow.show();
      mainWindow.focus();
    }
  }, 400);

  // Forward renderer logs for transparent debugging
  mainWindow.webContents.on('console-message', (event, level, message) => {
    console.log('[Renderer]', message);
  });

  const distPath = path.join(__dirname, '../dist/index.html');
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else if (fs.existsSync(distPath)) {
    mainWindow.loadFile(distPath);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../index.html'));
  }

  // Prevent navigation away from local bundled application
  mainWindow.webContents.on('will-navigate', (event) => event.preventDefault());
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  setupTray();
}

function setupTray() {
  try {
    const icon = createTrayIcon();
    if (!icon) return;
    tray = new Tray(icon);
    tray.setToolTip('Charmling — Lucky Charm & Focus Companion');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Vitrine & Tools Drawer',
      click: () => {
        toggleDrawer(true);
      }
    },
    {
      label: 'Move Charm Anywhere On Desktop',
      submenu: [
        { label: '📌 Top Center (Default)', click: () => applyDesktopPreset('top-center') },
        { label: '📌 Top Right (Corner)', click: () => applyDesktopPreset('top-right') },
        { label: '📌 Top Left', click: () => applyDesktopPreset('top-left') },
        { label: '🐾 Bottom Right (Desk Pet)', click: () => applyDesktopPreset('bottom-right') },
        { label: '🐾 Bottom Left', click: () => applyDesktopPreset('bottom-left') },
        { label: '✨ Center Float', click: () => applyDesktopPreset('center') }
      ]
    },
    {
      label: 'Snip Cord / Wander Mode',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('trigger-wander-mode');
        }
      }
    },
    {
      label: 'Focus Timer (25m Pomodoro)',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('trigger-focus-timer', 25);
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Window Mode: Floating / Studio',
      click: () => {
        toggleStudioMode();
      }
    },
    {
      label: 'Always On Top',
      type: 'checkbox',
      checked: true,
      click: (item) => {
        if (mainWindow) mainWindow.setAlwaysOnTop(item.checked);
      }
    },
    {
      label: 'Launch at Windows Startup',
      type: 'checkbox',
      checked: app.getLoginItemSettings().openAtLogin,
      click: (item) => {
        app.setLoginItemSettings({ openAtLogin: item.checked });
      }
    },
    { type: 'separator' },
    {
      label: 'Quit Charmling',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    toggleDrawer();
  });
  } catch (err) {
    console.warn('Tray initialization skipped:', err);
  }
}

function toggleDrawer(forceOpen = null) {
  if (!mainWindow) return;
  const targetState = forceOpen !== null ? forceOpen : !isDrawerOpen;
  isDrawerOpen = targetState;

  if (isStudioMode) {
    mainWindow.webContents.send('drawer-state-changed', isDrawerOpen);
    return;
  }

  if (isDrawerOpen) {
    // Save current floating position before expanding drawer
    const [currentX, currentY] = mainWindow.getPosition();
    lastFloatingPos = { x: currentX, y: currentY };
    savePosition(lastFloatingPos);

    // Center the Vitrine Studio on the display where the charm currently resides
    const currentDisplay = screen.getDisplayNearestPoint({ x: currentX, y: currentY });
    const { width: screenWidth, height: screenHeight, x: screenX, y: screenY } = currentDisplay.workArea;

    const width = EXPANDED_WIDTH;
    const height = EXPANDED_HEIGHT;
    const x = Math.round(screenX + (screenWidth - width) / 2);
    const y = Math.round(screenY + Math.max(10, (screenHeight - height) / 2));

    mainWindow.setBounds({ x, y, width, height }, true);
    mainWindow.setIgnoreMouseEvents(false);
  } else {
    // Restore window back to user's saved desktop coordinates
    const restorePos = lastFloatingPos || getDesktopTopPosition(COLLAPSED_WIDTH, COLLAPSED_HEIGHT);
    const width = COLLAPSED_WIDTH;
    const height = COLLAPSED_HEIGHT;

    mainWindow.setBounds({ x: restorePos.x, y: restorePos.y, width, height }, true);
  }

  mainWindow.webContents.send('drawer-state-changed', isDrawerOpen);
}

function toggleStudioMode() {
  if (!mainWindow) return;
  isStudioMode = !isStudioMode;

  const currentPos = lastFloatingPos || { x: 0, y: 0 };
  const primaryDisplay = screen.getDisplayNearestPoint(currentPos);
  const { width: screenWidth, height: screenHeight, x: screenX, y: screenY } = primaryDisplay.workArea;

  if (isStudioMode) {
    const [currentX, currentY] = mainWindow.getPosition();
    lastFloatingPos = { x: currentX, y: currentY };

    const width = 1100;
    const height = 820;
    const x = Math.round(screenX + (screenWidth - width) / 2);
    const y = Math.round(screenY + (screenHeight - height) / 2);
    mainWindow.setBounds({ x, y, width, height }, true);
    mainWindow.setAlwaysOnTop(false);
    mainWindow.setIgnoreMouseEvents(false);
  } else {
    isDrawerOpen = false;
    const restorePos = lastFloatingPos || getDesktopTopPosition(COLLAPSED_WIDTH, COLLAPSED_HEIGHT);
    mainWindow.setBounds({ x: restorePos.x, y: restorePos.y, width: COLLAPSED_WIDTH, height: COLLAPSED_HEIGHT }, true);
    mainWindow.setAlwaysOnTop(true);
  }

  mainWindow.webContents.send('studio-mode-changed', isStudioMode);
}

// IPC Handlers
ipcMain.on('toggle-drawer', (event, shouldOpen) => {
  toggleDrawer(shouldOpen);
});

ipcMain.on('toggle-studio-mode', () => {
  toggleStudioMode();
});

ipcMain.on('set-always-on-top', (event, val) => {
  if (mainWindow) mainWindow.setAlwaysOnTop(val);
});

ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && !isDrawerOpen && !isStudioMode) {
    win.setIgnoreMouseEvents(ignore, options || { forward: true });
  }
});

ipcMain.on('move-window-by', (event, data) => {
  if (!data || typeof data.deltaX !== 'number' || typeof data.deltaY !== 'number') return;
  // Bounds check delta to prevent wild teleportation attacks
  const deltaX = Math.max(-2000, Math.min(2000, data.deltaX));
  const deltaY = Math.max(-2000, Math.min(2000, data.deltaY));

  if (mainWindow && !isDrawerOpen && !isStudioMode) {
    const [curX, curY] = mainWindow.getPosition();
    const newX = Math.round(curX + deltaX);
    const newY = Math.round(curY + deltaY);
    mainWindow.setPosition(newX, newY);
    lastFloatingPos = { x: newX, y: newY };
  }
});

ipcMain.on('save-desktop-position', (event, pos) => {
  if (isDrawerOpen || isStudioMode) return;
  if (pos && typeof pos.x === 'number' && typeof pos.y === 'number' && !isNaN(pos.x) && !isNaN(pos.y)) {
    lastFloatingPos = clampToScreen(pos.x, pos.y, COLLAPSED_WIDTH, COLLAPSED_HEIGHT);
    savePosition(lastFloatingPos);
  } else if (mainWindow) {
    const [x, y] = mainWindow.getPosition();
    lastFloatingPos = clampToScreen(x, y, COLLAPSED_WIDTH, COLLAPSED_HEIGHT);
    savePosition(lastFloatingPos);
  }
});

ipcMain.on('set-desktop-preset', (event, presetName) => {
  const allowedPresets = ['top-center', 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'center'];
  if (typeof presetName === 'string' && allowedPresets.includes(presetName)) {
    applyDesktopPreset(presetName);
  }
});

// Asynchronous non-blocking invoke handler
ipcMain.handle('get-desktop-position', async () => {
  if (mainWindow) {
    const [x, y] = mainWindow.getPosition();
    return { x, y };
  }
  return lastFloatingPos;
});

// Legacy synchronous handler for backward safety
ipcMain.on('get-desktop-position', (event) => {
  if (mainWindow) {
    const [x, y] = mainWindow.getPosition();
    event.returnValue = { x, y };
  } else {
    event.returnValue = lastFloatingPos;
  }
});

ipcMain.on('set-window-position', (event, pos) => {
  if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number' || isNaN(pos.x) || isNaN(pos.y)) return;
  if (mainWindow && !isDrawerOpen && !isStudioMode) {
    const x = Math.round(pos.x);
    const y = Math.round(pos.y);
    mainWindow.setPosition(x, y);
    lastFloatingPos = { x, y };
    savePosition(lastFloatingPos);
  }
});

ipcMain.on('minimize-app', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('close-app', () => {
  app.quit();
});

ipcMain.on('notify', (event, data) => {
  if (!data || typeof data !== 'object') return;
  const safeTitle = String(data.title || 'Charmling').slice(0, 80);
  const safeBody = String(data.body || '').slice(0, 200);

  if (Notification.isSupported()) {
    new Notification({
      title: safeTitle,
      body: safeBody,
      icon: path.join(__dirname, '../public/icon.png')
    }).show();
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
