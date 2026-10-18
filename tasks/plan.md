# Implementation Plan: Charmling Advanced 3D, AppSec, & Design Elevation

## Overview
Elevate Charmling for Windows Desktop into a premier, secure, and visually stunning desktop companion. This plan introduces an interactive WebGL 3D Talisman Shrine (`Three.js`), strict Electron AppSec hardening (`webSecurity: true`, context isolation, CSP headers, sanitized drag-and-drop), spatial audio stereo panning for the wandering pet, and formalization under the Stitch Semantic Design System (`DESIGN.md`).

## Architecture Decisions
- **WebGL 3D Talisman Shrine**: Integrate `three` for hardware-accelerated 3D inspection inside the Lore Display Case. When toggled, the 2D SVG charm transitions into an illuminated 3D golden talisman with PBR materials, orbit-tilt physics, and particle aura.
- **Electron Security Hardening (AppSec)**: Re-enable `webSecurity: true`, enforce strict CSP in `index.html`, sanitize file drop inputs against path traversal/injection, and replace synchronous IPC with asynchronous channels.
- **Dynamic 3D Spatial Audio Panning**: Integrate Web Audio API `StereoPannerNode` connected to the desktop pet's real-time viewport X coordinate, so pet steps, barks, horns, and chimes pan realistically across the user's stereo speakers/headphones.
- **Stitch Semantic Design System**: Author and bind the application to `DESIGN.md`, standardizing typography (`Plus Jakarta Sans`, `Playfair Display`, `Space Mono`), spring motion (`stiffness: 100, damping: 20`), and eliminating AI design anti-patterns.
- **Zero-Secret Credential Hygiene**: Ensure zero API keys, telemetry tokens, or sensitive credentials exist in client bundles, with automated local validation.

## Task List

### Phase 1: Security Hardening & AppSec Foundations (AppSec & Secrets Hygiene)
- [ ] Task 1.1: Enable `webSecurity: true` and enforce strict Content Security Policy in `index.html` and `electron/main.cjs`.
- [ ] Task 1.2: Refactor `electron/preload.cjs` to remove `sendSync` and implement secure asynchronous IPC with input validation.
- [ ] Task 1.3: Sanitize drag-and-drop file inputs (type checking, HTML entity escaping, safe size limits) to eliminate XSS/injection risks.
- [ ] Task 1.4: Add pre-commit / local build secret scanning verification script.

### Checkpoint 1: Security & IPC Baseline
- [ ] Electron app boots cleanly with `webSecurity: true`
- [ ] All IPC channels operate asynchronously without UI blocking
- [ ] File drop functions safely with zero script injection vectors

### Phase 2: Stitch Semantic Design System & 3D WebGL Talisman Engine
- [ ] Task 2.1: Establish `DESIGN.md` embodying Stitch standards (calibrated palette, typography, spring physics).
- [ ] Task 2.2: Install `three` and build `src/js/scene-3d.js` providing the 3D Talisman Stage (PBR materials, studio rim lighting, orbital mouse tilt).
- [ ] Task 2.3: Integrate 3D/2D toggle in the Lore Display Case with smooth crossfade and hardware acceleration.
- [ ] Task 2.4: Implement real-time Web Audio API `StereoPannerNode` for the Wander pet based on desktop screen position.

### Checkpoint 2: 3D & Audio Experience
- [ ] 3D talisman renders at 60 FPS with responsive mouse tilt and PBR lighting
- [ ] Audio spatial panning responds dynamically to pet movement across monitors
- [ ] Design adheres 100% to `DESIGN.md` specification

### Phase 3: Production Packaging & Verification
- [ ] Task 3.1: Execute production build (`npm run build`).
- [ ] Task 3.2: Compile Windows standalone binary and NSIS setup installer.
- [ ] Task 3.3: Verify multi-process performance and memory footprint under 120MB.

## Risks and Mitigations
| Risk | Impact | Mitigation |
| :--- | :--- | :--- |
| `webSecurity: true` blocks local asset loads | High | Use absolute file protocols and standard Vite production bundle paths (`dist/index.html`). |
| Three.js bundle size increases binary weight | Medium | Tree-shake Three.js imports (only import Scene, PerspectiveCamera, WebGLRenderer, Mesh, MeshStandardMaterial). |
| WebGL context loss during window resize | Low | Implement auto-resize handler and graceful fallback to 2D SVG vector renderer. |

## Open Questions
- None. User requested an advanced, comprehensive plan and execution across all specified skill disciplines.
