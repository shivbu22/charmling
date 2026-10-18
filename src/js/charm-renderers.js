/**
 * Charmling Vector Artwork Renderers
 * Generates ultra-precise, cute, and detailed SVG artwork for each charm,
 * complete with gold bails, cords, blushing cheeks, eye sparkles, and state variations.
 */

export function renderCharmSVG(charmId, state = {}) {
  switch (charmId) {
    case 'kitten':
      return renderKitten(state);
    case 'axolotl':
      return renderAxolotl(state);
    case 'boba':
      return renderBoba(state);
    case 'fortune':
      return renderFortune(state);
    case 'omamori':
      return renderOmamori(state);
    case 'bunny':
      return renderBunny(state);
    case 'capybara':
      return renderCapybara(state);
    case 'dino':
      return renderDino(state);
    case 'ace':
      return renderAce(state);
    case 'goldfish':
      return renderGoldfish(state);
    case 'maneki':
      return renderManeki(state);
    case 'catbell':
      return renderCatbell(state);
    case 'daruma':
      return renderDaruma(state);
    case 'clover':
      return renderClover(state);
    case 'hamsa':
      return renderHamsa(state);
    case 'drishti':
      return renderDrishti(state);
    case 'kitsu':
      return renderKitsu(state);
    case 'dragon':
      return renderDragon(state);
    case 'moon':
      return renderMoon(state);
    case 'duck':
      return renderDuck(state);
    case 'cassette':
      return renderCassette(state);
    case 'mahjong':
      return renderMahjong(state);
    case 'bonsai':
      return renderBonsai(state);
    case 'hatchling':
      return renderDragonEgg(state);
    case 'car':
      return renderCar(state);
    case 'shiba':
      return renderShiba(state);
    case 'frog':
      return renderFrog(state);
    case 'furin':
      return renderFurin(state);
    case 'chasen':
      return renderChasen(state);
    default:
      return renderGenericCharm(charmId);
  }
}

// Common gold bail ring for all charms
function renderBail() {
  return `
    <!-- Top Brass Bail & Mounting Ring -->
    <circle cx="60" cy="14" r="7" fill="none" stroke="url(#goldGrad)" stroke-width="3" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"/>
    <circle cx="60" cy="22" r="4" fill="url(#goldGrad)"/>
  `;
}

const COMMON_DEFS = `
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe9ad"/>
      <stop offset="45%" stop-color="#f2c14e"/>
      <stop offset="100%" stop-color="#a97e2f"/>
    </linearGradient>
    <linearGradient id="sakuraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fdf2f8"/>
      <stop offset="50%" stop-color="#fbcfe8"/>
      <stop offset="100%" stop-color="#f472b6"/>
    </linearGradient>
    <linearGradient id="crimsonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f87171"/>
      <stop offset="50%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#7f1d1d"/>
    </linearGradient>
    <linearGradient id="jadeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a7f3d0"/>
      <stop offset="50%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
    <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#000000" flood-opacity="0.55"/>
    </filter>
    <style>
      @keyframes animeBlink {
        0%, 92%, 100% { transform: scaleY(1); }
        95% { transform: scaleY(0.08); }
      }
      .charm-eye-blink {
        transform-origin: 60px 58px;
        animation: animeBlink 3.8s ease-in-out infinite;
      }
      .charm-pupil {
        transition: transform 0.12s cubic-bezier(0.2, 0.8, 0.4, 1);
        transform: translate(calc(var(--pupil-x, 0) * 2px), calc(var(--pupil-y, 0) * 2px));
      }
      .charm-blush {
        animation: blushGlow 2.8s ease-in-out infinite alternate;
      }
      @keyframes blushGlow {
        0% { opacity: 0.62; }
        100% { opacity: 0.95; }
      }
      .ear-twitch-l {
        transform-origin: 34px 50px;
        animation: earTwitchL 4.6s ease-in-out infinite;
      }
      @keyframes earTwitchL {
        0%, 90%, 100% { transform: rotate(0deg); }
        93% { transform: rotate(-8deg); }
        96% { transform: rotate(4deg); }
        98% { transform: rotate(0deg); }
      }
      .ear-twitch-r {
        transform-origin: 86px 50px;
        animation: earTwitchR 4.6s ease-in-out infinite 0.15s;
      }
      @keyframes earTwitchR {
        0%, 90%, 100% { transform: rotate(0deg); }
        93% { transform: rotate(8deg); }
        96% { transform: rotate(-4deg); }
        98% { transform: rotate(0deg); }
      }
      .tail-wiggle {
        transform-origin: 60px 130px;
        animation: tailWiggle 2.4s ease-in-out infinite;
      }
      @keyframes tailWiggle {
        0%, 100% { transform: rotate(-6deg); }
        50% { transform: rotate(6deg); }
      }
    </style>
  </defs>
`;

/*/* ── Cute Calico Sakura Kitten ─────────────────────────────── */
function renderKitten(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <!-- Wiggling Calico Tail -->
      <path class="tail-wiggle" d="M 80 122 C 98 126 102 142 92 150 C 86 153 84 140 76 130 Z" fill="#fb923c" stroke="url(#goldGrad)" stroke-width="1.2"/>

      <!-- Kitten Body -->
      <ellipse cx="60" cy="104" rx="30" ry="32" fill="#ffffff" stroke="url(#goldGrad)" stroke-width="1.8"/>
      <!-- Soft Calico Patches on Back -->
      <path d="M 72 82 C 86 86 92 104 84 116 C 76 112 74 94 72 82 Z" fill="#fb923c"/>
      <path d="M 38 88 C 28 92 26 106 32 116 C 40 114 42 100 38 88 Z" fill="#64748b"/>
      
      <!-- Pointed Ears with Pink Centers & Twitch Keyframes -->
      <g class="ear-twitch-l">
        <polygon points="34,50 24,24 48,38" fill="#ffffff" stroke="url(#goldGrad)" stroke-width="1.5"/>
        <polygon points="36,46 30,30 44,40" fill="#f472b6"/>
      </g>
      <g class="ear-twitch-r">
        <polygon points="86,50 96,24 72,38" fill="#ffffff" stroke="url(#goldGrad)" stroke-width="1.5"/>
        <polygon points="84,46 90,30 76,40" fill="#f472b6"/>
      </g>
      
      <!-- Chubby Head -->
      <ellipse cx="60" cy="58" rx="28" ry="24" fill="#ffffff" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <path d="M 44 42 C 52 38 60 40 64 42 C 60 52 50 50 44 42 Z" fill="#fb923c"/>

      <!-- Large Sparkling Anime Eyes with Blinking & Pupil Tracking -->
      <g class="charm-eye-blink">
        <g class="charm-pupil">
          <!-- Left Eye -->
          <circle cx="48" cy="56" r="6.2" fill="#0f172a"/>
          <circle cx="46.5" cy="53.8" r="2.4" fill="#ffffff"/>
          <circle cx="50.2" cy="58" r="1.2" fill="#ffffff"/>
          <polygon points="48,54 48.8,55.5 50.5,55.5 49.2,56.5 49.6,58 48,57.2 46.4,58 46.8,56.5 45.5,55.5 47.2,55.5" fill="#fbcfe8" opacity="0.6"/>

          <!-- Right Eye -->
          <circle cx="72" cy="56" r="6.2" fill="#0f172a"/>
          <circle cx="70.5" cy="53.8" r="2.4" fill="#ffffff"/>
          <circle cx="74.2" cy="58" r="1.2" fill="#ffffff"/>
          <polygon points="72,54 72.8,55.5 74.5,55.5 73.2,56.5 73.6,58 72,57.2 70.4,58 70.8,56.5 69.5,55.5 71.2,55.5" fill="#fbcfe8" opacity="0.6"/>
        </g>
      </g>

      <!-- Soft Glowing Rosy Cheeks -->
      <g class="charm-blush">
        <ellipse cx="41" cy="62" rx="6" ry="3.8" fill="#f472b6"/>
        <ellipse cx="79" cy="62" rx="6" ry="3.8" fill="#f472b6"/>
      </g>

      <!-- Tiny Heart Nose & Cat Smile ( ^ ‿ ^ ) -->
      <polygon points="58.5,63 61.5,63 60,65.5" fill="#f43f5e"/>
      <path d="M 56 66 Q 60 70 64 66" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round" fill="none"/>

      <!-- Pink Sakura Ribbon Collar & Golden Bell -->
      <path d="M 42 74 Q 60 84 78 74" stroke="url(#sakuraGrad)" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="60" cy="80" r="6" fill="url(#goldGrad)"/>
      <circle cx="60" cy="80" r="1.6" fill="#78350f"/>
      <!-- Bell Specular Gleam -->
      <polygon points="58.5,77.5 59.5,79 61.5,79 60,80 60.5,81.5 58.5,80.5 57,81.5 57.5,80 56,79 58,79" fill="#ffffff" opacity="0.95"/>

      <!-- Paws Tucked In with Pink Jelly Bean Pads -->
      <g>
        <ellipse cx="48" cy="118" rx="7.5" ry="5.5" fill="#ffffff" stroke="url(#goldGrad)" stroke-width="1.2"/>
        <ellipse cx="48" cy="118.5" rx="3.5" ry="2.5" fill="#f472b6" opacity="0.8"/>
        <circle cx="45" cy="115.5" r="1.2" fill="#f472b6" opacity="0.8"/>
        <circle cx="48" cy="114.5" r="1.2" fill="#f472b6" opacity="0.8"/>
        <circle cx="51" cy="115.5" r="1.2" fill="#f472b6" opacity="0.8"/>

        <ellipse cx="72" cy="118" rx="7.5" ry="5.5" fill="#ffffff" stroke="url(#goldGrad)" stroke-width="1.2"/>
        <ellipse cx="72" cy="118.5" rx="3.5" ry="2.5" fill="#f472b6" opacity="0.8"/>
        <circle cx="69" cy="115.5" r="1.2" fill="#f472b6" opacity="0.8"/>
        <circle cx="72" cy="114.5" r="1.2" fill="#f472b6" opacity="0.8"/>
        <circle cx="75" cy="115.5" r="1.2" fill="#f472b6" opacity="0.8"/>
      </g>
    </g>
  </svg>
  `;
}

/* ── Cute Strawberry Axolotl ──────────────────────────────── */
function renderAxolotl(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <!-- 6 Feathery Pink Gills with Gentle Flutter -->
      <!-- Left Gills -->
      <g class="ear-twitch-l">
        <path d="M 36 46 Q 16 34 14 44 Q 24 50 36 50" fill="#f472b6" stroke="url(#goldGrad)" stroke-width="1"/>
        <path d="M 34 54 Q 12 52 14 62 Q 22 64 34 58" fill="#fb7185" stroke="url(#goldGrad)" stroke-width="1"/>
        <path d="M 36 62 Q 18 72 24 80 Q 32 74 38 66" fill="#f472b6" stroke="url(#goldGrad)" stroke-width="1"/>
      </g>
      <!-- Right Gills -->
      <g class="ear-twitch-r">
        <path d="M 84 46 Q 104 34 106 44 Q 96 50 84 50" fill="#f472b6" stroke="url(#goldGrad)" stroke-width="1"/>
        <path d="M 86 54 Q 108 52 106 62 Q 98 64 86 58" fill="#fb7185" stroke="url(#goldGrad)" stroke-width="1"/>
        <path d="M 84 62 Q 102 72 96 80 Q 88 74 82 66" fill="#f472b6" stroke="url(#goldGrad)" stroke-width="1"/>
      </g>

      <!-- Chubby Head -->
      <ellipse cx="60" cy="58" rx="28" ry="22" fill="#ffe4e6" stroke="url(#goldGrad)" stroke-width="1.8"/>

      <!-- Big Sparkling Dark Eyes with Blinking & Pupil Tracking -->
      <g class="charm-eye-blink">
        <g class="charm-pupil">
          <circle cx="46" cy="56" r="5.8" fill="#1e1b2e"/>
          <circle cx="44.5" cy="53.8" r="2.2" fill="#ffffff"/>
          <circle cx="48" cy="57.5" r="1.2" fill="#ffffff"/>

          <circle cx="74" cy="56" r="5.8" fill="#1e1b2e"/>
          <circle cx="72.5" cy="53.8" r="2.2" fill="#ffffff"/>
          <circle cx="76" cy="57.5" r="1.2" fill="#ffffff"/>
        </g>
      </g>

      <!-- Radiant Blush -->
      <g class="charm-blush">
        <ellipse cx="38" cy="62" rx="5.5" ry="3.5" fill="#f43f5e"/>
        <ellipse cx="82" cy="62" rx="5.5" ry="3.5" fill="#f43f5e"/>
      </g>

      <!-- Wide Happy Smiling Mouth -->
      <path d="M 52 64 Q 60 72 68 64" stroke="#e11d48" stroke-width="2" stroke-linecap="round" fill="none"/>

      <!-- Chubby Body -->
      <ellipse cx="60" cy="100" rx="24" ry="28" fill="#ffe4e6" stroke="url(#goldGrad)" stroke-width="1.8"/>
      <!-- Soft Pale Belly -->
      <ellipse cx="60" cy="102" rx="16" ry="18" fill="#ffffff"/>

      <!-- Tiny Front Paws Resting on Chest -->
      <ellipse cx="48" cy="94" rx="5.5" ry="4" fill="#fda4af"/>
      <ellipse cx="72" cy="94" rx="5.5" ry="4" fill="#fda4af"/>

      <!-- Floating Heart Bubble -->
      <path d="M 60 134 C 60 130 52 128 52 134 C 52 140 60 146 60 146 C 60 146 68 140 68 134 C 68 128 60 130 60 134 Z" fill="#f43f5e" opacity="0.9" filter="drop-shadow(0 0 6px #fb7185)"/>
    </g>
  </svg>
  `;
}

/* ── Cute Strawberry Boba Tea ─────────────────────────────── */
function renderBoba(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <!-- Straw Poking Out -->
      <line x1="68" y1="20" x2="54" y2="70" stroke="url(#goldGrad)" stroke-width="6" stroke-linecap="round"/>
      <line x1="68" y1="20" x2="54" y2="70" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round"/>

      <!-- Clear Glass Cup Body -->
      <polygon points="34,50 86,50 78,126 42,126" fill="rgba(255, 255, 255, 0.2)" stroke="url(#goldGrad)" stroke-width="2"/>
      
      <!-- Strawberry Milk Liquid -->
      <polygon points="36,60 84,60 77,124 43,124" fill="#fbcfe8"/>
      <ellipse cx="60" cy="60" rx="24" ry="4" fill="#f472b6"/>

      <!-- Smiling Cup Face -->
      <circle cx="52" cy="78" r="3" fill="#4c0519"/>
      <circle cx="51" cy="77" r="1" fill="#ffffff"/>
      <circle cx="68" cy="78" r="3" fill="#4c0519"/>
      <circle cx="67" cy="77" r="1" fill="#ffffff"/>
      <ellipse cx="46" cy="82" rx="3.5" ry="2" fill="#f43f5e" opacity="0.6"/>
      <ellipse cx="74" cy="82" rx="3.5" ry="2" fill="#f43f5e" opacity="0.6"/>
      <path d="M 57 82 Q 60 85 63 82" stroke="#4c0519" stroke-width="1.4" stroke-linecap="round" fill="none"/>

      <!-- Tapioca Pearls with Micro-Smiles -->
      <circle cx="48" cy="116" r="4.5" fill="#451a03"/>
      <circle cx="47" cy="115" r="1.2" fill="#ffffff"/>
      
      <circle cx="60" cy="118" r="5" fill="#451a03"/>
      <circle cx="59" cy="117" r="1.4" fill="#ffffff"/>

      <circle cx="72" cy="116" r="4.5" fill="#451a03"/>
      <circle cx="71" cy="115" r="1.2" fill="#ffffff"/>

      <circle cx="54" cy="108" r="4" fill="#451a03"/>
      <circle cx="66" cy="108" r="4" fill="#451a03"/>
    </g>
  </svg>
  `;
}

/* ── Cute Golden Fortune Cookie ───────────────────────────── */
function renderFortune(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <!-- Golden Folded Cookie Wings -->
      <path d="M 32 60 C 26 82 42 110 60 114 C 48 96 46 80 54 66 Z" fill="url(#goldGrad)" stroke="#a97e2f" stroke-width="1.5"/>
      <path d="M 88 60 C 94 82 78 110 60 114 C 72 96 74 80 66 66 Z" fill="url(#goldGrad)" stroke="#a97e2f" stroke-width="1.5"/>
      <ellipse cx="60" cy="68" rx="22" ry="14" fill="#e5ae40" stroke="url(#goldGrad)" stroke-width="1.5"/>

      <!-- Lucky Prophecy Scroll Poking Out -->
      <rect x="42" y="86" width="36" height="38" rx="3" fill="#fefce8" stroke="url(#goldGrad)" stroke-width="1.2"/>
      <line x1="48" y1="94" x2="72" y2="94" stroke="#dc2626" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="48" y1="102" x2="68" y2="102" stroke="#475569" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="48" y1="110" x2="64" y2="110" stroke="#475569" stroke-width="1.2" stroke-linecap="round"/>

      <!-- Cheerful Face on Cookie -->
      <circle cx="52" cy="66" r="2.5" fill="#451a03"/>
      <circle cx="68" cy="66" r="2.5" fill="#451a03"/>
      <ellipse cx="46" cy="69" rx="3" ry="1.8" fill="#f43f5e" opacity="0.65"/>
      <ellipse cx="74" cy="69" rx="3" ry="1.8" fill="#f43f5e" opacity="0.65"/>
      <path d="M 58 70 Q 60 72 62 70" stroke="#451a03" stroke-width="1.2" fill="none"/>
    </g>
  </svg>
  `;
}

/* ── Cute Sakura Omamori Amulet ───────────────────────────── */
function renderOmamori(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <!-- Brocade Silk Bag Silhouette -->
      <polygon points="42,42 78,42 88,60 88,124 32,124 32,60" fill="url(#sakuraGrad)" stroke="url(#goldGrad)" stroke-width="2"/>
      
      <!-- Gold Embroidered Edge -->
      <line x1="36" y1="62" x2="84" y2="62" stroke="url(#goldGrad)" stroke-width="1.2"/>
      <line x1="36" y1="120" x2="84" y2="120" stroke="url(#goldGrad)" stroke-width="1.2"/>

      <!-- Cherry Blossom Motif -->
      <circle cx="60" cy="74" r="3" fill="#ffffff"/>
      <circle cx="60" cy="70" r="2" fill="#f43f5e"/>
      <circle cx="64" cy="73" r="2" fill="#f43f5e"/>
      <circle cx="62" cy="77" r="2" fill="#f43f5e"/>
      <circle cx="58" cy="77" r="2" fill="#f43f5e"/>
      <circle cx="56" cy="73" r="2" fill="#f43f5e"/>

      <!-- Kanji for Blessing (御守) -->
      <text x="60" y="94" font-family="'Clash Display', sans-serif" font-weight="700" font-size="11" fill="#831843" text-anchor="middle">御守</text>
      <text x="60" y="108" font-family="'Clash Display', sans-serif" font-weight="700" font-size="9" fill="#831843" text-anchor="middle">開運</text>

      <!-- Traditional Scarlet Mizuhiki Bow Knot -->
      <circle cx="60" cy="46" r="4" fill="url(#goldGrad)"/>
      <path d="M 52 46 C 40 40 40 52 52 46" stroke="url(#crimsonGrad)" stroke-width="2.5" fill="none"/>
      <path d="M 68 46 C 80 40 80 52 68 46" stroke="url(#crimsonGrad)" stroke-width="2.5" fill="none"/>
      <!-- Hanging Twin Red Tassels -->
      <line x1="56" y1="124" x2="52" y2="152" stroke="url(#crimsonGrad)" stroke-width="3" stroke-linecap="round"/>
      <line x1="64" y1="124" x2="68" y2="152" stroke="url(#crimsonGrad)" stroke-width="3" stroke-linecap="round"/>
    </g>
  </svg>
  `;
}

/* ── Cute Moon Lop Bunny ──────────────────────────────────── */
function renderBunny(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <!-- Drooping Lop Ears with Gentle Sway -->
      <g class="ear-twitch-l">
        <path d="M 40 46 C 26 52 22 86 30 96 C 36 98 44 76 44 56 Z" fill="#ffffff" stroke="url(#goldGrad)" stroke-width="1.5"/>
        <path d="M 33 54 C 27 60 26 84 31 90" stroke="#fbcfe8" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      </g>
      
      <g class="ear-twitch-r">
        <path d="M 80 46 C 94 52 98 86 90 96 C 84 98 76 76 76 56 Z" fill="#ffffff" stroke="url(#goldGrad)" stroke-width="1.5"/>
        <path d="M 87 54 C 93 60 94 84 89 90" stroke="#fbcfe8" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      </g>

      <!-- Round Chubby Head -->
      <circle cx="60" cy="62" r="23" fill="#ffffff" stroke="url(#goldGrad)" stroke-width="1.8"/>

      <!-- Sweet Anime Eyes with Blinking & Pupil Tracking -->
      <g class="charm-eye-blink">
        <g class="charm-pupil">
          <circle cx="51" cy="59" r="4.8" fill="#78350f"/>
          <circle cx="49.5" cy="57.2" r="1.8" fill="#ffffff"/>
          <circle cx="52.2" cy="60.5" r="1" fill="#ffffff"/>

          <circle cx="69" cy="59" r="4.8" fill="#78350f"/>
          <circle cx="67.5" cy="57.2" r="1.8" fill="#ffffff"/>
          <circle cx="70.2" cy="60.5" r="1" fill="#ffffff"/>
        </g>
      </g>

      <!-- Glowing Rosy Cheeks -->
      <g class="charm-blush">
        <ellipse cx="44" cy="65" rx="5.5" ry="3.5" fill="#f472b6"/>
        <ellipse cx="76" cy="65" rx="5.5" ry="3.5" fill="#f472b6"/>
      </g>

      <!-- Sweet Nose & Mouth -->
      <polygon points="59,64 61,64 60,66" fill="#f43f5e"/>
      <path d="M 57 67 Q 60 70 63 67" stroke="#78350f" stroke-width="1.4" stroke-linecap="round" fill="none"/>

      <!-- Body Holding Golden Star -->
      <ellipse cx="60" cy="104" rx="26" ry="24" fill="#ffffff" stroke="url(#goldGrad)" stroke-width="1.8"/>
      <!-- Glowing Star with Gleam -->
      <polygon points="60,94 63,101 70,101 64,105 67,112 60,108 53,112 56,105 50,101 57,101" fill="url(#goldGrad)" filter="drop-shadow(0 0 8px #facc15)"/>
      <circle cx="60" cy="104" r="2.5" fill="#ffffff" opacity="0.8"/>
    </g>
  </svg>
  `;
}

/* ── Cute Mochi Capybara ──────────────────────────────────── */
function renderCapybara(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <!-- Aromatic Warm Steam Swirls from Yuzu -->
      <path class="charm-blush" d="M 54 20 Q 50 14 54 8 Q 58 2 54 -2" stroke="rgba(254, 240, 138, 0.6)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <path class="charm-blush" d="M 66 18 Q 70 12 66 6 Q 62 0 66 -4" stroke="rgba(254, 240, 138, 0.6)" stroke-width="1.5" stroke-linecap="round" fill="none"/>

      <!-- Juicy Yuzu Orange with Leaf -->
      <circle cx="60" cy="38" r="12" fill="#f97316" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <ellipse cx="60" cy="27" rx="5" ry="2.5" fill="#22c55e"/>

      <!-- Mochi Soft Head -->
      <rect x="36" y="50" width="48" height="42" rx="16" fill="#a16207" stroke="url(#goldGrad)" stroke-width="1.8"/>
      <!-- Tiny Rounded Ears with Twitch -->
      <g class="ear-twitch-l">
        <circle cx="34" cy="54" r="5.5" fill="#78350f"/>
      </g>
      <g class="ear-twitch-r">
        <circle cx="86" cy="54" r="5.5" fill="#78350f"/>
      </g>

      <!-- Peaceful Blissful Eyes -->
      <path d="M 43 65 Q 49 61 55 65" stroke="#1c1917" stroke-width="2.6" stroke-linecap="round" fill="none"/>
      <path d="M 65 65 Q 71 61 77 65" stroke="#1c1917" stroke-width="2.6" stroke-linecap="round" fill="none"/>

      <!-- Warm Onsen Blush -->
      <g class="charm-blush">
        <ellipse cx="40" cy="72" rx="5.5" ry="3.5" fill="#f43f5e"/>
        <ellipse cx="80" cy="72" rx="5.5" ry="3.5" fill="#f43f5e"/>
      </g>

      <!-- Snout -->
      <ellipse cx="60" cy="78" rx="14" ry="10" fill="#78350f"/>
      <circle cx="56" cy="78" r="1.5" fill="#000000"/>
      <circle cx="64" cy="78" r="1.5" fill="#000000"/>

      <!-- Body Resting Below -->
      <ellipse cx="60" cy="118" rx="36" ry="26" fill="#92400e" stroke="url(#goldGrad)" stroke-width="1.8"/>
      <ellipse cx="46" cy="136" rx="8" ry="5" fill="#78350f"/>
      <ellipse cx="74" cy="136" rx="8" ry="5" fill="#78350f"/>
    </g>
  </svg>
  `;
}

/* ── Cute Baby Matcha Saur Dino ───────────────────────────── */
function renderDino(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <!-- Tiny Wiggling Dino Tail -->
      <path class="tail-wiggle" d="M 88 104 Q 104 100 108 114 Q 96 116 88 110 Z" fill="#34d399" stroke="url(#goldGrad)" stroke-width="1.5"/>

      <!-- Chubby Green Body -->
      <ellipse cx="60" cy="98" rx="30" ry="28" fill="#34d399" stroke="url(#goldGrad)" stroke-width="1.8"/>
      
      <!-- Head with Big Smile -->
      <ellipse cx="60" cy="62" rx="24" ry="22" fill="#34d399" stroke="url(#goldGrad)" stroke-width="1.8"/>

      <!-- Cute Anime Eyes with Blinking & Pupil Tracking -->
      <g class="charm-eye-blink">
        <g class="charm-pupil">
          <circle cx="50" cy="58" r="4.8" fill="#064e3b"/>
          <circle cx="48.5" cy="56.2" r="1.8" fill="#ffffff"/>
          <circle cx="51.2" cy="59.5" r="1" fill="#ffffff"/>

          <circle cx="70" cy="58" r="4.8" fill="#064e3b"/>
          <circle cx="68.5" cy="56.2" r="1.8" fill="#ffffff"/>
          <circle cx="71.2" cy="59.5" r="1" fill="#ffffff"/>
        </g>
      </g>

      <!-- Rosy Cheeks -->
      <g class="charm-blush">
        <ellipse cx="42" cy="64" rx="4.8" ry="3.2" fill="#f472b6"/>
        <ellipse cx="78" cy="64" rx="4.8" ry="3.2" fill="#f472b6"/>
      </g>

      <!-- Cute Open Smile with Pink Tongue -->
      <path d="M 54 68 Q 60 76 66 68 Z" fill="#f43f5e" stroke="#064e3b" stroke-width="1.6"/>

      <!-- Pastel Yellow Back Plates -->
      <polygon points="46,42 40,36 48,34" fill="#fef08a" stroke="url(#goldGrad)" stroke-width="1"/>
      <polygon points="62,40 60,32 68,32" fill="#fef08a" stroke="url(#goldGrad)" stroke-width="1"/>
      <polygon points="76,44 78,36 84,40" fill="#fef08a" stroke="url(#goldGrad)" stroke-width="1"/>

      <!-- Soft Cream Tummy -->
      <ellipse cx="60" cy="102" rx="16" ry="18" fill="#ecfdf5"/>

      <!-- Chubby Little Feet -->
      <ellipse cx="48" cy="126" rx="8" ry="5" fill="#059669"/>
      <ellipse cx="72" cy="126" rx="8" ry="5" fill="#059669"/>
    </g>
  </svg>
  `;
}

/* ── Cute Ace Husky Agent ─────────────────────────────────── */
function renderAce(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <!-- Fluffy Pointed Husky Ears with Twitch Keyframes -->
      <g class="ear-twitch-l">
        <polygon points="32,48 26,20 48,36" fill="#475569" stroke="url(#goldGrad)" stroke-width="1.5"/>
        <polygon points="34,44 30,28 44,38" fill="#f8fafc"/>
      </g>
      <g class="ear-twitch-r">
        <polygon points="88,48 94,20 72,36" fill="#475569" stroke="url(#goldGrad)" stroke-width="1.5"/>
        <polygon points="86,44 90,28 76,38" fill="#f8fafc"/>
      </g>

      <!-- Head Base -->
      <ellipse cx="60" cy="62" rx="28" ry="26" fill="#334155" stroke="url(#goldGrad)" stroke-width="1.8"/>
      <path d="M 44 48 C 52 42 68 42 76 48 L 72 82 C 60 86 60 86 48 82 Z" fill="#f8fafc"/>

      <!-- Cool Aviator Sunglasses with Gold Frame & Gleam -->
      <rect x="36" y="52" width="22" height="15" rx="4" fill="#09090b" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <rect x="62" y="52" width="22" height="15" rx="4" fill="#09090b" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <line x1="56" y1="56" x2="64" y2="56" stroke="url(#goldGrad)" stroke-width="2"/>
      <line x1="39" y1="55" x2="48" y2="64" stroke="#f2c14e" stroke-width="1.4" opacity="0.75"/>
      <line x1="65" y1="55" x2="74" y2="64" stroke="#f2c14e" stroke-width="1.4" opacity="0.75"/>

      <!-- Cute Blushing Cheeks Under Glasses -->
      <g class="charm-blush">
        <ellipse cx="40" cy="72" rx="5" ry="3" fill="#f472b6"/>
        <ellipse cx="80" cy="72" rx="5" ry="3" fill="#f472b6"/>
      </g>

      <!-- Cute Nose & Wink Smile -->
      <polygon points="56,72 64,72 60,76" fill="#09090b"/>
      <path d="M 57 78 Q 60 81 63 78" stroke="#09090b" stroke-width="1.6" fill="none"/>

      <!-- Tactical Vest Body with Golden Badge -->
      <path d="M 38 88 L 82 88 L 86 136 L 34 136 Z" fill="#1e293b" stroke="url(#goldGrad)" stroke-width="1.8"/>
      <rect x="44" y="94" width="32" height="12" rx="2" fill="#0f172a" stroke="#475569" stroke-width="1"/>
      <text x="60" y="103" font-family="'Clash Display', sans-serif" font-weight="700" font-size="8" fill="#f2c14e" text-anchor="middle">ACE 007</text>
      <!-- Golden Star Crest -->
      <polygon points="60,114 62,119 67,119 63,122 65,127 60,124 55,127 57,122 53,119 58,119" fill="url(#goldGrad)" filter="drop-shadow(0 0 4px #facc15)"/>
    </g>
  </svg>
  `;
}

/* ── Cute Golden Ryukin ───────────────────────────────────── */
function renderGoldfish(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <ellipse cx="60" cy="74" rx="24" ry="20" fill="#f97316" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <circle cx="44" cy="72" r="6" fill="#ffffff"/>
      <circle cx="43" cy="71" r="3.5" fill="#1e1b2e"/>
      <circle cx="42" cy="70" r="1.4" fill="#ffffff"/>
      <path d="M 78 74 C 98 62 108 84 94 104 C 84 114 74 94 76 80 Z" fill="#ea580c" opacity="0.85"/>
      <path d="M 76 76 C 92 84 104 118 78 126 C 68 114 70 94 74 80 Z" fill="#fdba74" opacity="0.8"/>
      <path d="M 52 54 Q 64 42 74 58 Z" fill="#ea580c"/>
      <circle cx="34" cy="52" r="4.5" fill="url(#eyeGlow)" opacity="0.8"/>
    </g>
  </svg>
  `;
}

/* ── Other Classic Charms with Refined Details ────────────── */
function renderManeki(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <ellipse cx="60" cy="98" rx="34" ry="36" fill="#f8fafc" stroke="url(#goldGrad)" stroke-width="1.8"/>
      <polygon points="34,58 46,38 56,54" fill="#f8fafc" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <polygon points="38,55 46,43 52,53" fill="#f472b6"/>
      <polygon points="86,58 74,38 64,54" fill="#f8fafc" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <polygon points="82,55 74,43 68,53" fill="#f472b6"/>
      <ellipse cx="60" cy="68" rx="28" ry="24" fill="#f8fafc"/>
      <path d="M 72 48 C 82 52 86 64 84 72 C 78 70 74 60 72 48 Z" fill="#ea580c"/>
      <!-- Cheerful Winking Eyes -->
      <path d="M 44 68 Q 50 62 56 68" stroke="#120d04" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <path d="M 64 68 Q 70 62 76 68" stroke="#120d04" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <ellipse cx="38" cy="72" rx="4.5" ry="2.5" fill="#f472b6" opacity="0.7"/>
      <ellipse cx="82" cy="72" rx="4.5" ry="2.5" fill="#f472b6" opacity="0.7"/>
      <path d="M 40 82 Q 60 92 80 82" stroke="url(#crimsonGrad)" stroke-width="5" stroke-linecap="round"/>
      <circle cx="60" cy="87" r="5" fill="url(#goldGrad)"/>
      <ellipse cx="34" cy="52" rx="9" ry="14" fill="#f8fafc" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <circle cx="34" cy="44" r="5" fill="#f472b6"/>
      <ellipse cx="78" cy="98" rx="10" ry="16" fill="url(#goldGrad)"/>
      <text x="78" y="102" font-family="'Clash Display', sans-serif" font-weight="700" font-size="8" fill="#5c3f10" text-anchor="middle">千万</text>
    </g>
  </svg>
  `;
}

function renderCatbell(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <path d="M 60 22 C 45 32 35 45 42 55 C 52 50 56 36 60 30 C 64 36 68 50 78 55 C 85 45 75 32 60 22 Z" fill="url(#crimsonGrad)"/>
      <circle cx="60" cy="38" r="5" fill="url(#goldGrad)"/>
      <ellipse cx="60" cy="80" rx="34" ry="32" fill="url(#goldGrad)"/>
      <rect x="28" y="74" width="64" height="6" rx="3" fill="#a97e2f" stroke="#ffe9ad" stroke-width="0.8"/>
      <circle cx="60" cy="94" r="6" fill="#14101d"/>
      <line x1="38" y1="94" x2="82" y2="94" stroke="#14101d" stroke-width="3.5" stroke-linecap="round"/>
      <text x="60" y="68" font-family="'Clash Display', sans-serif" font-weight="700" font-size="12" fill="#5c3f10" text-anchor="middle">招財</text>
      <path d="M 52 108 L 48 152 Q 54 156 58 152 L 56 108 Z" fill="url(#crimsonGrad)"/>
      <path d="M 64 108 L 62 152 Q 66 156 72 152 L 68 108 Z" fill="url(#crimsonGrad)"/>
    </g>
  </svg>
  `;
}

function renderDaruma(state) {
  const eyeFilled = state.eyeFilled || state.ritualActive;
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <ellipse cx="60" cy="92" rx="38" ry="42" fill="url(#crimsonGrad)" stroke="url(#goldGrad)" stroke-width="2"/>
      <ellipse cx="60" cy="74" rx="26" ry="24" fill="#f4edda"/>
      <path d="M 38 62 Q 48 54 56 64" stroke="#120d04" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M 82 62 Q 72 54 64 64" stroke="#120d04" stroke-width="3" stroke-linecap="round" fill="none"/>
      <circle cx="46" cy="72" r="7" fill="#ffffff" stroke="#120d04" stroke-width="1.5"/>
      <circle cx="46" cy="72" r="4.5" fill="#120d04"/>
      <circle cx="74" cy="72" r="7" fill="#ffffff" stroke="#120d04" stroke-width="1.5"/>
      ${eyeFilled ? '<circle cx="74" cy="72" r="4.5" fill="#120d04"/>' : ''}
      <path d="M 46 88 Q 60 84 74 88 Q 60 98 46 88 Z" fill="#120d04"/>
      <circle cx="60" cy="116" r="14" fill="#a97e2f" opacity="0.3"/>
      <text x="60" y="121" font-family="'Clash Display', sans-serif" font-weight="700" font-size="14" fill="#ffe9ad" text-anchor="middle">福</text>
    </g>
  </svg>
  `;
}

function renderClover(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <g transform="translate(60, 80)">
        <path d="M 0 -6 C -18 -32 0 -44 0 -22 C 0 -44 18 -32 0 -6" fill="url(#jadeGrad)" stroke="url(#goldGrad)" stroke-width="1.2"/>
        <path d="M 0 6 C -18 32 0 44 0 22 C 0 44 18 32 0 6" fill="url(#jadeGrad)" stroke="url(#goldGrad)" stroke-width="1.2"/>
        <path d="M -6 0 C -32 -18 -44 0 -22 0 C -44 0 -32 18 -6 0" fill="url(#jadeGrad)" stroke="url(#goldGrad)" stroke-width="1.2"/>
        <path d="M 6 0 C 32 -18 44 0 22 0 C 44 0 32 18 6 0" fill="url(#jadeGrad)" stroke="url(#goldGrad)" stroke-width="1.2"/>
        <circle cx="0" cy="0" r="5" fill="url(#goldGrad)"/>
      </g>
      <path d="M 60 88 Q 54 125 42 144" stroke="#15803d" stroke-width="3" stroke-linecap="round" fill="none"/>
    </g>
  </svg>
  `;
}

function renderHamsa(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <path d="M 40 46 C 40 32 50 25 60 25 C 70 25 80 32 80 46 L 80 75 C 88 68 100 70 102 82 C 104 96 90 106 82 115 C 74 125 70 134 60 134 C 50 134 46 125 38 115 C 30 106 16 96 18 82 C 20 70 32 68 40 75 Z" fill="#1a1528" stroke="url(#goldGrad)" stroke-width="2"/>
      <ellipse cx="60" cy="90" rx="16" ry="10" fill="#f4edda" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <circle cx="60" cy="90" r="7" fill="url(#eyeGlow)"/>
      <circle cx="60" cy="90" r="3" fill="#0b0812"/>
      <circle cx="62" cy="88" r="1.5" fill="#ffffff"/>
      <path d="M 57 142 C 57 138 63 138 63 142 C 63 148 60 154 60 154 C 60 154 57 148 57 142 Z" fill="url(#eyeGlow)"/>
    </g>
  </svg>
  `;
}

function renderDrishti(state) {
  const isRed = state.ritualActive;
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <path d="M 25 45 C 20 90 28 135 60 135 C 92 135 100 90 95 45 C 90 32 30 32 25 45 Z" fill="${isRed ? '#991b1b' : '#1e1b2e'}" stroke="url(#goldGrad)" stroke-width="2.5"/>
      <path d="M 32 40 C 22 24 16 12 8 16 C 14 30 24 38 32 42 Z" fill="url(#goldGrad)"/>
      <path d="M 88 40 C 98 24 104 12 112 16 C 106 30 96 38 88 42 Z" fill="url(#goldGrad)"/>
      <ellipse cx="60" cy="46" rx="4" ry="7" fill="url(#crimsonGrad)" stroke="#f2c14e" stroke-width="1"/>
      <circle cx="44" cy="68" r="9" fill="#f4edda"/>
      <circle cx="44" cy="68" r="5" fill="#c0392f"/>
      <circle cx="44" cy="68" r="2.5" fill="#000000"/>
      <circle cx="76" cy="68" r="9" fill="#f4edda"/>
      <circle cx="76" cy="68" r="5" fill="#c0392f"/>
      <circle cx="76" cy="68" r="2.5" fill="#000000"/>
      <path d="M 40 92 Q 60 106 80 92 Q 60 114 40 92 Z" fill="#991b1b" stroke="#f2c14e" stroke-width="1.5"/>
      <polygon points="45,92 49,92 47,103" fill="#ffffff"/>
      <polygon points="75,92 71,92 73,103" fill="#ffffff"/>
    </g>
  </svg>
  `;
}

function renderKitsu(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <path d="M 60 90 Q 24 104 22 136 Q 38 138 52 110" fill="#f8fafc" stroke="#dc2626" stroke-width="1"/>
      <path d="M 60 90 Q 96 104 98 136 Q 82 138 68 110" fill="#f8fafc" stroke="#dc2626" stroke-width="1"/>
      <path d="M 60 90 Q 60 124 60 148 Q 66 128 60 90" stroke="#f8fafc" stroke-width="14" stroke-linecap="round"/>
      <polygon points="36,44 26,18 48,34" fill="#f8fafc" stroke="url(#goldGrad)" stroke-width="1.2"/>
      <polygon points="36,42 30,24 44,34" fill="#8b5cf6"/>
      <polygon points="84,44 94,18 72,34" fill="#f8fafc" stroke="url(#goldGrad)" stroke-width="1.2"/>
      <polygon points="84,42 90,24 76,34" fill="#8b5cf6"/>
      <ellipse cx="60" cy="56" rx="22" ry="18" fill="#f8fafc" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <path d="M 44 56 Q 52 50 56 56" stroke="#dc2626" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M 76 56 Q 68 50 64 56" stroke="#dc2626" stroke-width="2" stroke-linecap="round" fill="none"/>
      <circle cx="60" cy="62" r="2" fill="#000000"/>
      <path d="M 46 72 Q 60 78 74 72" stroke="url(#crimsonGrad)" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="60" cy="76" r="4.5" fill="url(#goldGrad)"/>
    </g>
  </svg>
  `;
}

function renderDragon(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <path d="M 60 36 C 88 36 98 62 82 82 C 66 102 34 88 34 112 C 34 136 78 140 82 120 C 86 100 68 108 60 114" stroke="url(#jadeGrad)" stroke-width="14" stroke-linecap="round" fill="none"/>
      <ellipse cx="44" cy="46" rx="16" ry="12" fill="url(#jadeGrad)" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <circle cx="42" cy="44" r="3.5" fill="url(#goldGrad)"/>
      <circle cx="42" cy="44" r="1.5" fill="#000000"/>
      <path d="M 32 50 Q 18 56 12 70" stroke="url(#goldGrad)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <circle cx="78" cy="118" r="8" fill="url(#goldGrad)"/>
    </g>
  </svg>
  `;
}

function renderBonsai(state) {
  const stage = state.stage || 3;
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <ellipse cx="60" cy="132" rx="34" ry="10" fill="#78350f" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <rect x="28" y="132" width="64" height="14" rx="2" fill="#92400e" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <ellipse cx="60" cy="132" rx="28" ry="6" fill="#14532d"/>
      ${stage >= 3 ? `
        <path d="M 60 132 C 54 114 42 108 52 92 C 58 82 72 84 66 68 C 62 58 54 54 52 48" stroke="#5c2607" stroke-width="7" stroke-linecap="round" fill="none"/>
        <ellipse cx="46" cy="46" rx="22" ry="14" fill="#166534" stroke="url(#goldGrad)" stroke-width="1"/>
        <ellipse cx="80" cy="82" rx="18" ry="12" fill="#166534" stroke="url(#goldGrad)" stroke-width="1"/>
      ` : `
        <path d="M 60 130 Q 54 110 64 92" stroke="#78350f" stroke-width="5" stroke-linecap="round" fill="none"/>
        <circle cx="56" cy="90" r="12" fill="#15803d"/>
      `}
      ${stage >= 5 ? `
        <circle cx="40" cy="40" r="4" fill="#f472b6"/>
        <circle cx="54" cy="42" r="3.5" fill="#fbcfe8"/>
        <circle cx="76" cy="78" r="3.5" fill="#f472b6"/>
      ` : ''}
    </g>
  </svg>
  `;
}

function renderDragonEgg(state) {
  const cracked = state.cracked || (state.stage && state.stage > 1);
  const hatched = state.hatched || (state.stage && state.stage >= 3);
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <ellipse cx="60" cy="134" rx="36" ry="14" fill="#854d0e" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <path d="M 60 42 C 40 42 28 78 30 114 C 32 136 88 136 90 114 C 92 78 80 42 60 42 Z" fill="#1e1b2e" stroke="url(#goldGrad)" stroke-width="2"/>
      <path d="M 46 68 Q 60 76 74 66" stroke="#f2c14e" stroke-width="1.8" opacity="0.7" fill="none"/>
      ${cracked ? `<path d="M 60 44 L 56 62 L 64 74 L 54 88 L 62 104" stroke="#fbbf24" stroke-width="2.5" fill="none" filter="drop-shadow(0 0 4px #f59e0b)"/>` : ''}
      ${hatched ? `
        <circle cx="60" cy="74" r="14" fill="#047857"/>
        <circle cx="55" cy="72" r="3" fill="#fbbf24"/>
        <circle cx="55" cy="72" r="1.5" fill="#000000"/>
        <circle cx="65" cy="72" r="3" fill="#fbbf24"/>
        <circle cx="65" cy="72" r="1.5" fill="#000000"/>
      ` : ''}
    </g>
  </svg>
  `;
}

function renderDuck(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <ellipse cx="62" cy="104" rx="34" ry="26" fill="#facc15" stroke="url(#goldGrad)" stroke-width="1.8"/>
      <circle cx="74" cy="72" r="19" fill="#facc15" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <circle cx="78" cy="68" r="4" fill="#000000"/>
      <circle cx="77.5" cy="67" r="1.5" fill="#ffffff"/>
      <ellipse cx="71" cy="74" rx="4" ry="2.2" fill="#f43f5e" opacity="0.6"/>
      <path d="M 88 72 C 104 70 106 82 86 84 Z" fill="#ea580c" stroke="url(#goldGrad)" stroke-width="1"/>
    </g>
  </svg>
  `;
}

function renderMoon(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <path d="M 64 36 C 40 36 28 60 30 88 C 32 116 56 134 84 130 C 58 126 48 100 48 84 C 48 64 60 46 64 36 Z" fill="url(#goldGrad)" stroke="#ffe9ad" stroke-width="1.5"/>
      <path d="M 44 80 Q 48 76 52 80" stroke="#78350f" stroke-width="1.8" stroke-linecap="round" fill="none"/>
      <ellipse cx="40" cy="85" rx="3.5" ry="2" fill="#f43f5e" opacity="0.6"/>
      <line x1="64" y1="36" x2="74" y2="60" stroke="url(#goldGrad)" stroke-width="1.2"/>
      <polygon points="74,54 76,59 82,59 77,62 79,68 74,65 69,68 71,62 66,59 72,59" fill="#fef08a" stroke="url(#goldGrad)" stroke-width="1"/>
    </g>
  </svg>
  `;
}

function renderCassette(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <rect x="22" y="52" width="76" height="52" rx="5" fill="#1e1b2e" stroke="url(#goldGrad)" stroke-width="2"/>
      <rect x="30" y="60" width="60" height="32" rx="3" fill="#f4edda"/>
      <text x="60" y="70" font-family="'Courier New', monospace" font-size="7" font-weight="700" fill="#1e1b2e" text-anchor="middle">FOCUS MIX VOL. 1</text>
      <rect x="38" y="74" width="44" height="14" rx="2" fill="#0f172a"/>
      <circle cx="48" cy="81" r="5" fill="#e2e8f0"/>
      <circle cx="72" cy="81" r="5" fill="#e2e8f0"/>
    </g>
  </svg>
  `;
}

function renderMahjong(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <rect x="32" y="44" width="56" height="78" rx="7" fill="#15803d" stroke="url(#goldGrad)" stroke-width="2"/>
      <rect x="32" y="40" width="56" height="76" rx="6" fill="#fefce8" stroke="url(#goldGrad)" stroke-width="1.8"/>
      <g transform="translate(60, 78)">
        <rect x="-16" y="-14" width="32" height="28" rx="3" fill="none" stroke="#dc2626" stroke-width="4.5"/>
        <line x1="0" y1="-24" x2="0" y2="24" stroke="#dc2626" stroke-width="5" stroke-linecap="round"/>
      </g>
    </g>
  </svg>
  `;
}

/* ── Tokyo Kei-Car Roadster ────────────────────────────────── */
function renderCar(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <!-- Antenna with golden bead -->
      <line x1="42" y1="36" x2="38" y2="18" stroke="url(#goldGrad)" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="37" cy="16" r="3.5" fill="#facc15"/>

      <!-- Rounded Mint Kei-Car Roof & Cabin -->
      <path d="M 40 68 C 42 46 78 46 80 68 Z" fill="#a7f3d0" stroke="url(#goldGrad)" stroke-width="1.8"/>
      <!-- Windshield with Cute Eyes -->
      <path d="M 44 67 C 46 52 74 52 76 67 Z" fill="#0f172a"/>
      
      <!-- Windshield Anime Eyes with Blinking -->
      <g class="charm-eye-blink">
        <g class="charm-pupil">
          <circle cx="53" cy="60" r="3.8" fill="#38bdf8"/>
          <circle cx="52" cy="58.5" r="1.5" fill="#ffffff"/>
          <circle cx="67" cy="60" r="3.8" fill="#38bdf8"/>
          <circle cx="66" cy="58.5" r="1.5" fill="#ffffff"/>
        </g>
      </g>

      <!-- Main Pastel Mint Chassis -->
      <rect x="28" y="68" width="64" height="42" rx="14" fill="#34d399" stroke="url(#goldGrad)" stroke-width="2"/>

      <!-- Twin Glowing Headlights -->
      <circle cx="36" cy="84" r="7.5" fill="#fef08a" stroke="url(#goldGrad)" stroke-width="1.5" filter="drop-shadow(0 0 4px #facc15)"/>
      <circle cx="36" cy="84" r="4" fill="#ffffff"/>
      <circle cx="84" cy="84" r="7.5" fill="#fef08a" stroke="url(#goldGrad)" stroke-width="1.5" filter="drop-shadow(0 0 4px #facc15)"/>
      <circle cx="84" cy="84" r="4" fill="#ffffff"/>

      <!-- Chrome Grille Smile -->
      <rect x="48" y="82" width="24" height="10" rx="4" fill="#0f172a" stroke="url(#goldGrad)" stroke-width="1.2"/>
      <path d="M 52 86 Q 60 90 68 86" stroke="#f2c14e" stroke-width="1.8" stroke-linecap="round" fill="none"/>

      <!-- Rosy Cheeks -->
      <g class="charm-blush">
        <ellipse cx="36" cy="94" rx="4.5" ry="2.8" fill="#f472b6"/>
        <ellipse cx="84" cy="94" rx="4.5" ry="2.8" fill="#f472b6"/>
      </g>

      <!-- Gold Chrome Bumper Bar -->
      <rect x="24" y="98" width="72" height="6" rx="3" fill="url(#goldGrad)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"/>

      <!-- Whitewall Spinning Wheels -->
      <g>
        <circle cx="38" cy="116" r="12" fill="#09090b" stroke="url(#goldGrad)" stroke-width="1.5"/>
        <circle cx="38" cy="116" r="7" fill="#f8fafc"/>
        <circle cx="38" cy="116" r="3.5" fill="url(#goldGrad)"/>

        <circle cx="82" cy="116" r="12" fill="#09090b" stroke="url(#goldGrad)" stroke-width="1.5"/>
        <circle cx="82" cy="116" r="7" fill="#f8fafc"/>
        <circle cx="82" cy="116" r="3.5" fill="url(#goldGrad)"/>
      </g>
    </g>
  </svg>
  `;
}

/* ── Mochi Shiba Inu ───────────────────────────────────────── */
function renderShiba(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <!-- Fluffy Curled Tail -->
      <path class="tail-wiggle" d="M 82 116 C 98 110 106 126 96 136 C 88 140 82 130 80 122 Z" fill="#f59e0b" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <circle cx="98" cy="126" r="6" fill="#fef3c7"/>

      <!-- Shiba Body -->
      <ellipse cx="60" cy="106" rx="28" ry="30" fill="#f59e0b" stroke="url(#goldGrad)" stroke-width="1.8"/>
      <!-- Soft White Chest -->
      <ellipse cx="60" cy="108" rx="16" ry="20" fill="#fef3c7"/>

      <!-- Pointed Golden Ears with Twitch -->
      <g class="ear-twitch-l">
        <polygon points="34,48 24,20 48,34" fill="#f59e0b" stroke="url(#goldGrad)" stroke-width="1.5"/>
        <polygon points="36,44 30,26 44,36" fill="#fef3c7"/>
      </g>
      <g class="ear-twitch-r">
        <polygon points="86,48 96,20 72,34" fill="#f59e0b" stroke="url(#goldGrad)" stroke-width="1.5"/>
        <polygon points="84,44 90,26 76,36" fill="#fef3c7"/>
      </g>

      <!-- Head Base -->
      <ellipse cx="60" cy="58" rx="28" ry="24" fill="#f59e0b" stroke="url(#goldGrad)" stroke-width="1.8"/>
      <!-- White Cheeks and Muzzle -->
      <ellipse cx="60" cy="64" rx="18" ry="14" fill="#fef3c7"/>
      <circle cx="48" cy="46" r="2.5" fill="#fef3c7"/>
      <circle cx="72" cy="46" r="2.5" fill="#fef3c7"/>

      <!-- Large Sparkling Anime Eyes with Blinking & Pupil Tracking -->
      <g class="charm-eye-blink">
        <g class="charm-pupil">
          <circle cx="48" cy="56" r="5.5" fill="#451a03"/>
          <circle cx="46.5" cy="54" r="2" fill="#ffffff"/>
          <circle cx="50" cy="57.5" r="1.1" fill="#ffffff"/>

          <circle cx="72" cy="56" r="5.5" fill="#451a03"/>
          <circle cx="70.5" cy="54" r="2" fill="#ffffff"/>
          <circle cx="74" cy="57.5" r="1.1" fill="#ffffff"/>
        </g>
      </g>

      <!-- Rosy Cheeks -->
      <g class="charm-blush">
        <ellipse cx="40" cy="64" rx="5.5" ry="3.5" fill="#f472b6"/>
        <ellipse cx="80" cy="64" rx="5.5" ry="3.5" fill="#f472b6"/>
      </g>

      <!-- Black Nose & Happy Panting Mouth -->
      <polygon points="57.5,62 62.5,62 60,65" fill="#0f172a"/>
      <path d="M 56 66 Q 60 70 64 66" stroke="#0f172a" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      <path d="M 58 68 Q 60 74 62 68 Z" fill="#f43f5e"/>

      <!-- Scarlet Japanese Kerchief with Polka Dots -->
      <path d="M 40 76 Q 60 88 80 76 L 68 96 L 60 90 L 52 96 Z" fill="#dc2626" stroke="url(#goldGrad)" stroke-width="1.2"/>
      <circle cx="58" cy="82" r="1.5" fill="#ffffff"/>
      <circle cx="64" cy="84" r="1.5" fill="#ffffff"/>
      <circle cx="60" cy="88" r="1.2" fill="#ffffff"/>

      <!-- Tucked White Paws -->
      <ellipse cx="48" cy="120" rx="7" ry="5" fill="#fef3c7" stroke="url(#goldGrad)" stroke-width="1.2"/>
      <ellipse cx="72" cy="120" rx="7" ry="5" fill="#fef3c7" stroke="url(#goldGrad)" stroke-width="1.2"/>
    </g>
  </svg>
  `;
}

/* ── Moon Lotus Frog (Jin Chan Money Frog) ─────────────────── */
function renderFrog(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <!-- Blooming Pink Water Lily Lotus Hat -->
      <ellipse cx="60" cy="38" rx="20" ry="6" fill="#15803d"/>
      <path d="M 48 38 C 42 22 56 16 60 26 C 64 16 78 22 72 38 Z" fill="#f472b6" stroke="url(#goldGrad)" stroke-width="1.2"/>
      <circle cx="60" cy="28" r="3.5" fill="#fef08a"/>

      <!-- Chubby Frog Body -->
      <ellipse cx="60" cy="98" rx="32" ry="28" fill="#4ade80" stroke="url(#goldGrad)" stroke-width="1.8"/>
      <!-- Soft Pale Belly -->
      <ellipse cx="60" cy="102" rx="20" ry="18" fill="#dcfce7"/>

      <!-- Bulging Frog Eyes on Top -->
      <circle cx="44" cy="52" r="13" fill="#4ade80" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <circle cx="76" cy="52" r="13" fill="#4ade80" stroke="url(#goldGrad)" stroke-width="1.5"/>

      <!-- Anime Eyes with Blinking -->
      <g class="charm-eye-blink">
        <g class="charm-pupil">
          <circle cx="44" cy="52" r="6" fill="#064e3b"/>
          <circle cx="42.5" cy="50" r="2.2" fill="#ffffff"/>
          <circle cx="46" cy="53.5" r="1.2" fill="#ffffff"/>

          <circle cx="76" cy="52" r="6" fill="#064e3b"/>
          <circle cx="74.5" cy="50" r="2.2" fill="#ffffff"/>
          <circle cx="78" cy="53.5" r="1.2" fill="#ffffff"/>
        </g>
      </g>

      <!-- Head Base -->
      <ellipse cx="60" cy="68" rx="30" ry="20" fill="#4ade80" stroke="url(#goldGrad)" stroke-width="1.8"/>

      <!-- Rosy Cheeks -->
      <g class="charm-blush">
        <ellipse cx="36" cy="68" rx="5" ry="3.2" fill="#f472b6"/>
        <ellipse cx="84" cy="68" rx="5" ry="3.2" fill="#f472b6"/>
      </g>

      <!-- Golden Square-Hole Coin Held in Mouth -->
      <circle cx="60" cy="74" r="12" fill="url(#goldGrad)" stroke="#a97e2f" stroke-width="1.5" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.5))"/>
      <rect x="56" y="70" width="8" height="8" rx="1" fill="#0b0812"/>
      <text x="60" y="67" font-family="'Clash Display', sans-serif" font-weight="700" font-size="6" fill="#78350f" text-anchor="middle">招財</text>

      <!-- Frog Smile Line -->
      <path d="M 40 70 Q 48 76 52 74" stroke="#064e3b" stroke-width="1.6" fill="none"/>
      <path d="M 80 70 Q 72 76 68 74" stroke="#064e3b" stroke-width="1.6" fill="none"/>

      <!-- Webbed Little Feet -->
      <ellipse cx="40" cy="124" rx="10" ry="5" fill="#22c55e" stroke="url(#goldGrad)" stroke-width="1.2"/>
      <ellipse cx="80" cy="124" rx="10" ry="5" fill="#22c55e" stroke="url(#goldGrad)" stroke-width="1.2"/>
    </g>
  </svg>
  `;
}

/* ── Edo Glass Furin Wind Chime ───────────────────────────── */
function renderFurin(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <!-- Translucent Glass Bell Dome -->
      <path d="M 32 80 C 32 44 88 44 88 80 C 88 84 32 84 32 80 Z" fill="rgba(224, 242, 254, 0.45)" stroke="url(#goldGrad)" stroke-width="2"/>
      <ellipse cx="60" cy="80" rx="28" ry="6" fill="rgba(186, 230, 253, 0.3)" stroke="url(#goldGrad)" stroke-width="1.2"/>

      <!-- Painted Sakura Blossoms on Glass -->
      <circle cx="50" cy="62" r="3.5" fill="#f472b6" opacity="0.85"/>
      <circle cx="54" cy="66" r="3.5" fill="#f472b6" opacity="0.85"/>
      <circle cx="46" cy="66" r="3.5" fill="#f472b6" opacity="0.85"/>
      <circle cx="50" cy="65" r="2" fill="#fef08a"/>

      <circle cx="70" cy="56" r="3" fill="#f472b6" opacity="0.85"/>
      <circle cx="74" cy="60" r="3" fill="#f472b6" opacity="0.85"/>
      <circle cx="68" cy="60" r="3" fill="#f472b6" opacity="0.85"/>
      <circle cx="71" cy="59" r="1.6" fill="#fef08a"/>

      <!-- Specular Glass Highlights -->
      <path d="M 38 72 C 38 52 50 48 52 48" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.8"/>
      <circle cx="78" cy="54" r="2.5" fill="#ffffff" opacity="0.7"/>

      <!-- Internal Cord & Golden Clapper Bead -->
      <line x1="60" y1="44" x2="60" y2="88" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <circle cx="60" cy="84" r="5" fill="url(#goldGrad)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"/>

      <!-- Hanging Fluttering Tanzaku Paper Slip (with Kanji for Breeze: 涼) -->
      <g class="tail-wiggle">
        <line x1="60" y1="88" x2="60" y2="102" stroke="url(#goldGrad)" stroke-width="1.2"/>
        <rect x="52" y="102" width="16" height="46" rx="2" fill="#fff1f2" stroke="url(#goldGrad)" stroke-width="1.2"/>
        <line x1="55" y1="106" x2="65" y2="106" stroke="#f43f5e" stroke-width="1.5"/>
        <text x="60" y="126" font-family="'Clash Display', sans-serif" font-weight="700" font-size="10" fill="#be123c" text-anchor="middle">涼</text>
        <line x1="55" y1="140" x2="65" y2="140" stroke="#f43f5e" stroke-width="1.5"/>
      </g>
    </g>
  </svg>
  `;
}

/* ── Ceremonial Matcha Chasen Whisk ───────────────────────── */
function renderChasen(state) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <!-- Carved Bamboo Whisk Handle -->
      <rect x="52" y="34" width="16" height="36" rx="4" fill="#d97706" stroke="url(#goldGrad)" stroke-width="1.8"/>
      <!-- Bamboo Node Rings -->
      <line x1="52" y1="46" x2="68" y2="46" stroke="#78350f" stroke-width="2"/>
      <line x1="52" y1="58" x2="68" y2="58" stroke="#78350f" stroke-width="2"/>

      <!-- Traditional Black Thread Binding -->
      <rect x="50" y="66" width="20" height="8" rx="2" fill="#0f172a" stroke="url(#goldGrad)" stroke-width="1"/>

      <!-- Spreading Bamboo Tines -->
      <path d="M 50 74 C 36 94 34 116 46 122 C 54 124 58 100 58 74 Z" fill="#fef3c7" stroke="url(#goldGrad)" stroke-width="1.2"/>
      <path d="M 70 74 C 84 94 86 116 74 122 C 66 124 62 100 62 74 Z" fill="#fef3c7" stroke="url(#goldGrad)" stroke-width="1.2"/>
      <path d="M 56 74 C 52 96 52 118 60 122 C 68 118 68 96 64 74 Z" fill="#fde68a" stroke="url(#goldGrad)" stroke-width="1.2"/>

      <!-- Frothy Jade Matcha Bowl with Bubbles at Base -->
      <ellipse cx="60" cy="128" rx="26" ry="10" fill="#047857" stroke="url(#goldGrad)" stroke-width="1.8"/>
      <ellipse cx="60" cy="126" rx="20" ry="7" fill="#10b981"/>

      <!-- Micro Matcha Foam Bubbles -->
      <circle cx="52" cy="125" r="2.5" fill="#a7f3d0"/>
      <circle cx="62" cy="124" r="3" fill="#a7f3d0"/>
      <circle cx="68" cy="126" r="2" fill="#a7f3d0"/>
      <circle cx="58" cy="128" r="2.2" fill="#ffffff" opacity="0.8"/>
    </g>
  </svg>
  `;
}

function renderGenericCharm(charmId) {
  return `
  <svg viewBox="0 0 120 160" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${COMMON_DEFS}
    ${renderBail()}
    <g filter="url(#shadow)">
      <circle cx="60" cy="80" r="32" fill="#1e1b2e" stroke="url(#goldGrad)" stroke-width="2"/>
      <circle cx="60" cy="80" r="24" fill="url(#goldGrad)" opacity="0.3"/>
      <text x="60" y="85" font-family="'Clash Display', sans-serif" font-weight="700" font-size="12" fill="#ffe9ad" text-anchor="middle">${charmId.toUpperCase().slice(0, 4)}</text>
    </g>
  </svg>
  `;
}
