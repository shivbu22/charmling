# Charmling Tasks Todo & Execution Checklist

## Phase 1: Security Hardening & AppSec Foundations

### Task 1: Enable `webSecurity: true` and Enforce Strict CSP
**Description:** Configure Electron BrowserWindow to adhere to production AppSec standards by enabling `webSecurity: true` and adding a strict Content Security Policy meta tag to `index.html`.
**Acceptance criteria:**
- [ ] `electron/main.cjs` sets `webSecurity: true`.
- [ ] `index.html` includes strict `<meta http-equiv="Content-Security-Policy">` restricting script, style, and connect sources.
- [ ] Local asset loading and Web Audio synthesis remain fully operational.
**Verification:**
- [ ] `npm run build` succeeds without CSP or protocol warnings.
- [ ] Electron console shows zero security policy violations.
**Files likely touched:**
- `electron/main.cjs`
- `index.html`
**Estimated scope:** Small (2 files)

---

### Task 2: Refactor IPC Preload Bridge to Pure Asynchronous Handlers
**Description:** Eliminate `ipcRenderer.sendSync('get-desktop-position')` and replace with non-blocking async IPC invoke/handle patterns with input validation.
**Acceptance criteria:**
- [ ] No `sendSync` calls remain in `electron/preload.cjs` or `electron/main.cjs`.
- [ ] IPC arguments are validated with strict bounds and types before execution.
**Verification:**
- [ ] Desktop position save/restore operates asynchronously without frame dropping.
**Files likely touched:**
- `electron/preload.cjs`
- `electron/main.cjs`
- `src/js/app.js`
**Estimated scope:** Medium (3 files)

---

### Task 3: File Drag & Drop Input Sanitization
**Description:** Sanitize all dropped file names, metadata, and properties before rendering into DOM toasts or the Quiet Tools basket to prevent HTML/XSS injection.
**Acceptance criteria:**
- [ ] All dynamic text insertions use safe DOM text nodes or sanitized templates.
- [ ] File extensions and MIME types are validated against safe lists.
**Verification:**
- [ ] Test with filenames containing HTML entities (`<script>alert(1)</script>.png`) to confirm safe literal rendering.
**Files likely touched:**
- `src/js/app.js`
- `src/js/tools.js`
**Estimated scope:** Small (2 files)

---

## Checkpoint 1: Security Hardening Complete
- [ ] Electron app boots with full webSecurity and CSP protection
- [ ] IPC is strictly asynchronous and validated
- [ ] Input sanitization protects all drag-and-drop operations

---

## Phase 2: Stitch Semantic Design System & 3D WebGL Engine

### Task 4: Author `DESIGN.md` Semantic Design System
**Description:** Codify the visual atmosphere, calibrated palette, typography hierarchy, spring physics, and banned AI tells into `DESIGN.md` following Google Stitch standards.
**Acceptance criteria:**
- [ ] `DESIGN.md` contains strict token definitions, spring physics (`stiffness: 100, damping: 20`), and anti-slop rules.
- [ ] Palette adheres to off-black `#0b0812`, champagne gold `#e3b55c`, and warm velvet ink.
**Verification:**
- [ ] Human review of `DESIGN.md` confirms compliance with `stitch-design-taste`.
**Files likely touched:**
- `DESIGN.md`
**Estimated scope:** Small (1 file)

---

### Task 5: Implement WebGL 3D Talisman Shrine (`src/js/scene-3d.js`)
**Description:** Install `three` and build a lightweight, 60fps 3D Talisman viewer with PBR gold materials, studio rim lighting, orbital mouse tilt, and gold particle aura in the Lore Display Case.
**Acceptance criteria:**
- [ ] `three` installed and configured in Vite.
- [ ] `src/js/scene-3d.js` renders a responsive, high-fidelity 3D talisman model with normal maps, metallic reflections, and soft shadows.
- [ ] Includes smooth 2D/3D toggle button in the Vitrine Case (`✨ View in 3D Shrine`).
- [ ] Automatic performance throttle when idle or when drawer is closed.
**Verification:**
- [ ] 3D talisman rotates smoothly with mouse interaction at 60 FPS.
- [ ] WebGL context gracefully cleans up on drawer close to conserve GPU RAM.
**Files likely touched:**
- `package.json`
- `src/js/scene-3d.js`
- `src/js/vitrine.js`
- `src/css/vitrine.css`
- `index.html`
**Estimated scope:** Medium (4 files)

---

### Task 6: Implement 3D Spatial Audio Stereo Panning for Wander Pet
**Description:** Connect Web Audio API `StereoPannerNode` to the desktop companion's horizontal screen coordinate so footfalls, barks, horns, and chimes pan realistically in stereo.
**Acceptance criteria:**
- [ ] Audio engine routes companion sound effects through a dynamic `StereoPannerNode`.
- [ ] Panning value adjusts from `-1.0` (far left monitor edge) to `+1.0` (far right monitor edge).
**Verification:**
- [ ] Sound effects from the pet shift audibly between left and right channels as it wanders.
**Files likely touched:**
- `src/js/audio.js`
- `src/js/wander.js`
**Estimated scope:** Small (2 files)

---

## Checkpoint 2: 3D Scene & Spatial Audio Complete
- [ ] 3D Talisman Shrine renders interactively with studio lighting
- [ ] Spatial audio panning responds accurately to desktop position
- [ ] UI reflects Stitch design system specifications

---

## Phase 3: Production Packaging & Release

### Task 7: Build, Package, and Verify Standalone Executable & Installer
**Description:** Compile production bundle via Vite and package using Electron Builder into `app-win64` and `installer/`.
**Acceptance criteria:**
- [ ] `npm run build` completes with zero errors.
- [ ] `Charmling.exe` and `Charmling Setup 1.0.0.exe` generated and tested.
- [ ] Multi-process memory consumption remains below 130MB.
**Verification:**
- [ ] Windows process starts cleanly and responds to tray, drag, 3D, and audio events.
**Files likely touched:**
- `installer/Charmling Setup 1.0.0.exe`
- `app-win64/Charmling.exe`
**Estimated scope:** Medium
