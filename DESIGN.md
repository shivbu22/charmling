# DESIGN.md — Charmling Semantic Design System

## 1. Visual Atmosphere & Philosophy
- **Identity**: A serene, meditative digital talisman that lives natively on the Windows desktop, blending Japanese folklore, modern minimalism, and physical tactile joy.
- **Atmosphere Spectrum**:
  - **Density**: 4 (Daily App Balanced — generous breathing room, intentional negative space).
  - **Variance**: 7 (Offset Asymmetric — distinctive specimen cards, non-uniform editorial layout).
  - **Motion**: 7 (Fluid Dynamic Physics — real spring damping, inertia, elastic cords, perpetual micro-motion).
- **Core Creed**: Good luck, hanging right there. Zero generic AI clutter. Zero neon purple button glows. Every interaction feels physically crafted, acoustic, and tangible.

## 2. Color Calibration & Palette Architecture
- **Ink Base (Dominant 60%)**:
  - `#0b0812` (Void Obsidian) — Deep velvety desktop background for studio mode and shadow roots.
  - `rgba(20, 16, 29, 0.78)` (Velvet Glass) — Primary frosted glassmorphic card backdrop.
  - `#14101d` (Solid Charcoal) — High-elevation popover and drawer surface.
- **Luminous Accent (Action 10%)**:
  - `#e3b55c` (Champagne Gold) — Primary borders, delicate cord threads, and metallic highlights.
  - `#f2c14e` (Warm Gold CTA) — Interactive buttons, focused active tabs, and primary action states.
  - `#ffe9ad` (Specular Sheen) — Eye specular highlights, star sparkle cores.
- **Neutrals & Typography (Support 30%)**:
  - `#f4edda` (Warm Ceramic Cream) — Primary headings, active labels, high contrast readability.
  - `#a9a396` (Muted Rice Paper Slate) — Subtitles, folklore origins, secondary metadata.
  - `rgba(227, 181, 92, 0.16)` (Gilded Wire) — Subtle structural hairline borders.
- **Banned Colors**:
  - BANNED: Neon cyan, electric purple (`#8b5cf6`), hot magenta, generic bootstrap blue (`#007bff`).
  - BANNED: Pure black `#000000` (always use Off-Black `#0b0812`).

## 3. Typographic Architecture
- **Primary Body & Interface**: `Plus Jakarta Sans`
  - Crisp, modern geometric grotesque with humanist balance.
  - Sizes: `0.72rem` (tags/metadata) to `0.92rem` (body instructions).
  - Max line length: 60 characters for comfortable reading.
- **Editorial Lore & Charm Titles**: `Playfair Display`
  - High-contrast, elegant modern serif for charm specimen names and ritual headers.
  - Rhythmic letter spacing: `0.02em` to `0.04em`.
- **Mechanical Frequencies & Metrics**: `Space Mono`
  - Clean monospace for audio frequencies (e.g. `432 Hz Drone`), file sizes (`42.1 KB`), and timers.
- **Banned Typography**:
  - BANNED: `Inter` (prohibited for premium bespoke desktop accessories).
  - BANNED: Times New Roman, Arial, Comic Sans.

## 4. Component Stylings & Interaction Laws
- **Buttons**:
  - Tactile push feedback: `transform: scale(0.96)` on `:active` with cubic-bezier release.
  - Primary (`.btn-gold`): Gilded gradient `linear-gradient(180deg, #f7d073, #e5ae40)`, dark text `#1a1002`, drop shadow `0 6px 20px rgba(0, 0, 0, 0.6)`.
  - Secondary (`.btn-ghost`): Glass border `1px solid var(--line)`, warm cream text, golden hover glow.
  - BANNED: Neon outer box-shadow glows or generic flat buttons.
- **Specimen Cards**:
  - Border: `1px solid rgba(255, 255, 255, 0.05)`.
  - Hover: `transform: translateY(-2px)`, border-color `rgba(227, 181, 92, 0.35)`, background `rgba(30, 28, 48, 0.7)`.
  - Active: 1px outline in `#f2c14e`, gold background tint `rgba(242, 193, 78, 0.08)`.
- **Interactive Hanging Charm Stage**:
  - Real Hooke's Law spring physics with Euler integration: `stiffness: 100, damping: 20`.
  - Pupil tracking: Eyes smoothly track cursor offset across viewport within `[-1, 1]` normalized range.
  - Eye blinking: Pseudo-random intervals (3.5s - 5s) with soft anime eye closure curve.

## 5. Motion Philosophy & Hardware Acceleration
- **Spring Physics Standard**:
  - All transitions use weighted cubic-bezier easing: `cubic-bezier(0.18, 0.9, 0.3, 1.2)` or `cubic-bezier(0.18, 0.8, 0.25, 1)`.
  - Never use linear easing for physical motions.
- **Hardware Acceleration Rule**:
  - Animate exclusively via `transform` and `opacity`.
  - Never animate `top`, `left`, `width`, or `height` directly during active rendering.
  - Use `will-change: transform` on the hanging cord and wandering pet elements.

## 6. Anti-Patterns & Banned AI Tells
- BANNED: Purple/pink gradient buttons with glowing halos.
- BANNED: Generic circular spinner wheels (always use thematic progress or skeletal pulses).
- BANNED: Stock emojis in professional headings (use inline SVG iconography or curated talisman glyphs).
- BANNED: Absolute-positioned element collisions or overlapping unpadded text.
