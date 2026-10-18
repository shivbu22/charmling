/**
 * Charmling Charms & Lore Database
 * Precise, Cute, and Culturally Authentic Amulets & Companions.
 */

export const CATEGORIES = [
  { id: 'luck', name: 'Luck & Blessings', desc: 'Ancient amulets and sacred thresholds that bring fortune.' },
  { id: 'animals', name: 'Cute Companions', desc: 'Blushing creatures and adorable desktop companions.' },
  { id: 'myth', name: 'Spirits & Myth', desc: 'Friendly spirits, mythical dragons, and celestial guides.' },
  { id: 'play', name: 'Play & Games', desc: 'Playful games, sports, and vintage tokens.' },
  { id: 'studio', name: 'Studio & Craft', desc: 'Creative tools, debugging companions, and music.' },
  { id: 'treats', name: 'Sweet Treats', desc: 'Boba drinks, tea cups, and sweet pastry tokens.' },
  { id: 'living', name: 'The Garden', desc: 'Living companions that evolve with your daily focus.' }
];

export const CHARMS = [
  // --- CUTE ANIMALS ---
  {
    id: 'kitten',
    name: 'Sakura Kitten',
    category: 'animals',
    origin: 'Japan',
    story: 'An impossibly cute calico kitten with soft blushing cheeks and white socks. She wears a golden bell on a cherry blossom ribbon and pats the air whenever you take a break.',
    ritual: {
      action: 'Gentle Paws',
      desc: 'The kitten purrs softly, kneads her paws, and showers delicate pink sakura petals.'
    },
    motion: 'bounce',
    motionDesc: 'gentle happy bounces with twitching ears',
    hangRatio: 0.5
  },
  {
    id: 'axolotl',
    name: 'Strawberry Axolotl',
    category: 'animals',
    origin: 'Lake Xochimilco',
    story: 'Permanently smiling and perpetually cheerful! Its feathery pink gills flutter gently, and it floats buoyant heart bubbles to cheer you through long study or work sessions.',
    ritual: {
      action: 'Float Heart Bubble',
      desc: 'Wiggles its frills and releases a sparkling pink heart bubble that drifts upward.'
    },
    motion: 'pulse',
    motionDesc: 'feathery gills wave like coral in the tide',
    hangRatio: 0.5
  },
  {
    id: 'bunny',
    name: 'Moon Lop Bunny',
    category: 'animals',
    origin: 'Celestial Lore',
    story: 'A fluffy lop-eared bunny holding a radiant golden star. Legend says it kneads mochi on the moon and brings gentle peace to anyone burning midnight oil.',
    ritual: {
      action: 'Joyful Binky Hop',
      desc: 'Performs an adorable twisting hop that sparkles with golden star dust.'
    },
    motion: 'bounce',
    motionDesc: 'subtle, curious ear twitches and joyful hops',
    hangRatio: 0.5
  },
  {
    id: 'capybara',
    name: 'Mochi Capybara',
    category: 'animals',
    origin: 'Onsen Springs',
    story: 'The most relaxed creature in the universe. Balances a juicy yuzu orange on its head with supreme calm. Looking at it lowers your blood pressure by 20%.',
    ritual: {
      action: 'Warm Onsen Soak',
      desc: 'Gentle aromatic steam rises as the capybara closes its eyes in blissful tranquility.'
    },
    motion: 'pulse',
    motionDesc: 'unhurried, peaceful micro-breathing',
    hangRatio: 0.5
  },
  {
    id: 'dino',
    name: 'Matcha Saur',
    category: 'animals',
    origin: 'The Prehistoric Vale',
    story: 'A round, chubby baby herbivore with rosy cheeks and soft matcha green scales. Takes tiny, determined steps and never gives up on hard code.',
    ritual: {
      action: 'Tiny Confident Stomp',
      desc: 'Three miniature stomps that leave golden sparkling clover footprints.'
    },
    motion: 'wobble',
    motionDesc: 'waddles side to side with cute determination',
    hangRatio: 0.5
  },
  {
    id: 'ace',
    name: 'Ace the Agent',
    category: 'animals',
    origin: 'Charmling HQ',
    story: 'A fluffy husky agent sporting dark aviator shades and a miniature tactical vest. Flips a sharp salute and patrols your desktop in Wander Mode.',
    ritual: {
      action: 'Field Report Salute',
      desc: 'Snaps a crisp salute: "Perimeter 100% secure. Keep shining, Commander!"'
    },
    motion: 'walk',
    motionDesc: 'cool agent swagger on the cord — walks in Wander Mode',
    hangRatio: 0.5
  },
  {
    id: 'goldfish',
    name: 'Golden Ryukin',
    category: 'animals',
    origin: 'East Asia',
    story: 'A plump, graceful goldfish with fins like flowing spun silk. Believed in feng shui to bring flowing abundance, calm thoughts, and auspicious energy.',
    ritual: {
      action: 'Lucky Pearl Bubble',
      desc: 'Releases a shimmering rainbow pearl bubble that brings clarity to your thoughts.'
    },
    motion: 'swing',
    motionDesc: 'fluid, weightless silk fin gliding',
    hangRatio: 0.5
  },

  // --- SWEET TREATS ---
  {
    id: 'boba',
    name: 'Strawberry Boba',
    category: 'treats',
    origin: 'Taiwan',
    story: 'A pastel strawberry milk drink topped with a fat straw and cheerful brown-sugar pearls smiling from the bottom of the glass. Refreshment in charm form.',
    ritual: {
      action: 'Swirl the Pearls',
      desc: 'The pearls swirl with cute cheerful clinks, chilling your workspace.'
    },
    motion: 'bounce',
    motionDesc: 'playful jelly bounce and bubble swirl',
    hangRatio: 0.5
  },
  {
    id: 'fortune',
    name: 'Fortune Cookie',
    category: 'treats',
    origin: 'San Francisco & Kyoto',
    story: 'A crisp, golden folded cookie tucked into a brass bail. Inside rests a handwritten lucky prophecy meant specifically for today\'s effort.',
    ritual: {
      action: 'Crack the Cookie',
      desc: 'The cookie cracks open with a satisfying crisp snap to reveal a glowing message of luck.'
    },
    motion: 'wobble',
    motionDesc: 'balanced golden fold swaying in harmony',
    hangRatio: 0.5
  },

  // --- LUCK & BLESSINGS ---
  {
    id: 'omamori',
    name: 'Sakura Omamori',
    category: 'luck',
    origin: 'Kyoto Shrines',
    story: 'A traditional Japanese silk brocade amulet tied with a scarlet mizuhiki knot. Inside is a sacred blessing for success, good fortune, and creative breakthrough.',
    ritual: {
      action: 'Ring Shrine Bell',
      desc: 'A resonant brass chime clears stale thoughts and infuses your day with calm clarity.'
    },
    motion: 'swing',
    motionDesc: 'silk brocade sways gently with braided tassels',
    hangRatio: 0.5
  },
  {
    id: 'daruma',
    name: 'Daruma Doll',
    category: 'luck',
    origin: 'Takasaki Japan',
    story: 'Japan\'s round tumbler goal-keeper, weighted to always right itself: "fall seven times, get up eight." You paint the left pupil upon choosing a goal, and the right upon completion.',
    ritual: {
      action: 'Paint the Eye',
      desc: 'Inks the pupil to lock in your goal. Its determined stare keeps you motivated until finished!'
    },
    motion: 'wobble',
    motionDesc: 'roly-poly wobble — it never falls over',
    hangRatio: 0.5
  },
  {
    id: 'maneki',
    name: 'Maneki-Neko',
    category: 'luck',
    origin: 'Tokyo Japan',
    story: 'The legendary beckoning cat with a golden collar and lucky coin. Its raised paw summons unexpected fortune, new opportunities, and warm community.',
    ritual: {
      action: 'Fortune Beckon',
      desc: 'Folds its soft white paw rhythmically, accompanied by a golden bell chime.'
    },
    motion: 'swing',
    motionDesc: 'waits gently… then beckons with its paw',
    hangRatio: 0.5
  },
  {
    id: 'catbell',
    name: 'Zhaocai Bell',
    category: 'luck',
    origin: 'China & Taiwan',
    story: 'A portrait of an authentic 招財 (zhāocái, "beckoning wealth") brass bell. Three rings each morning clear lingering clutter and invite fresh momentum.',
    ritual: {
      action: 'Ring the Bells',
      desc: 'Three clearing rings that echo resonant brass harmonics through your room.'
    },
    motion: 'swing',
    motionDesc: 'swings like a pendulum, bells chiming',
    hangRatio: 0.5
  },
  {
    id: 'clover',
    name: 'Four-Leaf Clover',
    category: 'luck',
    origin: 'Ireland',
    story: 'Emerald green heart leaflets bordered in fine gold. In ancient Celtic folklore, finding the fourth leaf grants protection and extraordinary serendipity.',
    ritual: {
      action: 'Harvest Dew',
      desc: 'Shakes loose sparkling dew drops that glimmer across your screen.'
    },
    motion: 'spin',
    motionDesc: 'a lazy, fortunate twirl in the breeze',
    hangRatio: 0.5
  },
  {
    id: 'hamsa',
    name: 'Hamsa Hand',
    category: 'luck',
    origin: 'Mediterranean',
    story: 'The ancient open hand of protection and benevolence. The glowing turquoise eye at its center radiates calm focus and wards off self-doubt.',
    ritual: {
      action: 'Charge Protection',
      desc: 'A five-count resonant blessing pulse that illuminates the turquoise eye.'
    },
    motion: 'spin',
    motionDesc: 'sways in slow protective arcs',
    hangRatio: 0.5
  },
  {
    id: 'drishti',
    name: 'Drishti Bomma',
    category: 'luck',
    origin: 'Telugu India',
    story: 'A fierce yet protective guardian face with fangs and bold eyes. It absorbs the first envious glance (drishti) before any distraction reaches you.',
    ritual: {
      action: 'Change War Paint',
      desc: 'The guardian re-fierces in fresh crimson and emerald war paint with renewed power.'
    },
    motion: 'pulse',
    motionDesc: 'its glare pulses, warding as it watches',
    hangRatio: 0.5
  },

  // --- SPIRITS & MYTH ---
  {
    id: 'kitsu',
    name: 'Kitsu Fox Spirit',
    category: 'myth',
    origin: 'Inari Shrine Lore',
    story: 'A celestial three-tailed white fox with pastel violet ears and a brass bell. Companion of writers, crafters, and clever problem solvers.',
    ritual: {
      action: 'Fox Bell Chime',
      desc: 'All three fluffy tails fan out in joy as the spirit bell rings away creative blocks.'
    },
    motion: 'swing',
    motionDesc: 'three tails sway in harmonic rhythm',
    hangRatio: 0.5
  },
  {
    id: 'dragon',
    name: 'Jade Dragon',
    category: 'myth',
    origin: 'Ancient China',
    story: 'Carved from imperial nephrite jade with burnished gold whiskers. Symbol of rain, cosmic power, high ambition, and noble perseverance.',
    ritual: {
      action: 'Wake the Dragon',
      desc: 'Gold eyes ignite with ancient warmth; an ember ring drifts gently from its nostrils.'
    },
    motion: 'pulse',
    motionDesc: 'slow undulating dragon coiling',
    hangRatio: 0.5
  },
  {
    id: 'moon',
    name: 'Crescent Night',
    category: 'myth',
    origin: 'Celestial',
    story: 'A silver crescent cradle holding a sleepy star with blushing cheeks. The guardian of late-night coders and quiet thinkers.',
    ritual: {
      action: 'Starlight Glow',
      desc: 'Dims screen glare and sparkles softly like a peaceful night sky.'
    },
    motion: 'swing',
    motionDesc: 'gentle pendulum rocking like a cradle',
    hangRatio: 0.5
  },

  // --- STUDIO & PLAY ---
  {
    id: 'duck',
    name: 'Rubber Duck',
    category: 'studio',
    origin: 'Software Folklore',
    story: 'The most venerable debugging partner in tech history. Explain your logic out loud to the duck, and the answer appears before you finish your sentence!',
    ritual: {
      action: 'Debug Conference',
      desc: 'A knowing nod and cheerful squeak: "Have you checked the variable scope?"'
    },
    motion: 'wobble',
    motionDesc: 'buoyant bath-toy tilt',
    hangRatio: 0.5
  },
  {
    id: 'cassette',
    name: 'Mixtape 90',
    category: 'studio',
    origin: 'Retro Analog',
    story: 'Smoked acrylic, graphite spools, and a handwritten label for your favorite focus tunes. A reminder that deep work is an art form.',
    ritual: {
      action: 'Pencil Rewind',
      desc: 'Twin spools spin back to the beginning of Side A with a retro click.'
    },
    motion: 'spin',
    motionDesc: 'twin spools turn in steady sync',
    hangRatio: 0.5
  },
  {
    id: 'mahjong',
    name: 'Red Dragon Tile',
    category: 'play',
    origin: 'China',
    story: 'The vermilion 中 (zhōng, "center") — the most prized tile in Mahjong. It symbolizes striking the exact center of target and attaining complete mastery.',
    ritual: {
      action: 'Slap the Table',
      desc: 'A loud, satisfying click as the carved ivory tile lands firmly on the wooden table.'
    },
    motion: 'wobble',
    motionDesc: 'crisp solid weight and balance',
    hangRatio: 0.5
  },
  {
    id: 'car',
    name: 'Tokyo Kei-Car',
    category: 'play',
    origin: 'Tokyo Retro',
    story: 'A tiny pastel mint roadster with chrome bumpers, cream headlights, and spinning whitewall tires. Comes with a genuine retro dual-horn and turbo boost!',
    ritual: {
      action: 'Beep-Beep & Rev',
      desc: 'Sounds a cheerful double horn "Beep-Beep!" followed by an accelerating engine rev and tire sparkle!'
    },
    motion: 'wobble',
    motionDesc: 'playful engine idle vibration with spinning wheels',
    hangRatio: 0.5
  },
  {
    id: 'shiba',
    name: 'Mochi Shiba Inu',
    category: 'animals',
    origin: 'Kyoto Japan',
    story: 'A cheerful golden-furred Shiba with blushing cheeks, fluffy curled tail, and a crimson kerchief. Does a happy tail helicopter whenever you finish a task!',
    ritual: {
      action: 'Happy Yip & Tail Wag',
      desc: 'Does an enthusiastic double-hop, wags its curled tail, and lets out a joyful puppy yip!'
    },
    motion: 'bounce',
    motionDesc: 'playful joyful bounces with rapid tail wiggles',
    hangRatio: 0.5
  },
  {
    id: 'frog',
    name: 'Moon Lotus Frog',
    category: 'luck',
    origin: 'Southern China',
    story: 'The legendary Jin Chan (Money Frog) wearing a blooming pink water lily hat. Clamps a bright golden coin in its smile and invites wealth into your workspace.',
    ritual: {
      action: 'Lotus Coin Blessing',
      desc: 'Lets out a deep resonant croak as golden coins sparkle and rain down.'
    },
    motion: 'pulse',
    motionDesc: 'peaceful meditative pond breathing',
    hangRatio: 0.5
  },
  {
    id: 'furin',
    name: 'Edo Glass Furin',
    category: 'studio',
    origin: 'Edo Japan',
    story: 'A hand-blown glass summer windbell painted with delicate sakura petals. Its hanging washi paper slip catches digital breezes and rings crystal chimes.',
    ritual: {
      action: 'Summer Wind Chime',
      desc: 'Catches a fresh virtual breeze, playing multi-tone crystalline glass chimes.'
    },
    motion: 'swing',
    motionDesc: 'translucent glass swaying with fluttering paper strip',
    hangRatio: 0.5
  },
  {
    id: 'chasen',
    name: 'Matcha Chasen Whisk',
    category: 'treats',
    origin: 'Uji Japan',
    story: 'A finely carved single-piece bamboo tea whisk that whips rich ceremonial matcha into silky emerald froth. The quintessential token of zen focus.',
    ritual: {
      action: 'Froth Emerald Tea',
      desc: 'Rhythmically whisks a ceramic chawan bowl, producing sparkling green matcha bubbles.'
    },
    motion: 'spin',
    motionDesc: 'delicate rhythmic whisking spin',
    hangRatio: 0.5
  },

  // --- THE LIVING GARDEN ---
  {
    id: 'bonsai',
    name: 'Living Bonsai',
    category: 'living',
    origin: 'The Zen Garden',
    story: 'A miniature living juniper that grows through 5 distinct stages on your desktop. It feeds on completed focus sessions and blossoms into cherry flowers.',
    ritual: {
      action: 'Water with Focus',
      desc: 'Pours fresh morning dew onto the soil, nourishing growth and blooming cherry blossoms.'
    },
    motion: 'pulse',
    motionDesc: 'living foliage sways gently as it breathes',
    hangRatio: 0.5,
    isLiving: true,
    type: 'bonsai'
  },
  {
    id: 'hatchling',
    name: 'Dragon Egg',
    category: 'living',
    origin: 'The Garden Nest',
    story: 'An obsidian egg etched with golden runes. As you spend productive hours at your desk, heat accumulates until the shell cracks and a baby dragon hatches!',
    ritual: {
      action: 'Warm the Nest',
      desc: 'Channels thermal focus to the egg shell, revealing glowing fracture lines.'
    },
    motion: 'wobble',
    motionDesc: 'eggshell wobbles as something stirs inside',
    hangRatio: 0.5,
    isLiving: true,
    type: 'dragon'
  }
];
