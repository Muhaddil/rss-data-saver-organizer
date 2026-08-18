// ============================================================
// DATALISTS — All dropdown/autocomplete data for NMS discoveries
// Extracted from RSSWikiPageCreator project
// ============================================================

// --- PLATFORMS ---
export const PLATFORMS = ['PC', 'PS4', 'PS5', 'Xbox', 'Switch', 'Mac'];

// --- GAME MODES ---
export const GAME_MODES = ['Normal', 'Creative', 'Survival', 'Permadeath'];

// --- FACTIONS ---
export const FACTIONS = ['Gek', "Vy'keen", 'Korvax', 'Uncharted'];

// --- ECONOMIES ---
export const ECONOMIES = [
  'Trading', 'Mining', 'Technology', 'Manufacturing',
  'Power Generation', 'Shipping', 'Alchemy', 'Commercial',
];

// --- CONFLICT LEVELS ---
export const CONFLICTS = [
  'Low', 'Medium', 'High', 'Destabilized', 'Unstable',
  'Gentle', 'Mild', 'Fractious', 'Belligerent', 'Anarchic',
];

// --- STELLAR CLASSES ---
export const STELLAR_CLASSES = [
  'F', 'Fp', 'Fpf', 'G', 'Gp', 'Gpf', 'K', 'Kp', 'Kpf',
  'M', 'Mp', 'Mpf', 'B', 'Bp', 'Bpf', 'O', 'Op', 'Opf',
  'E', 'E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9',
  'X', 'Y', 'T', 'L',
];

// --- STAR COLORS ---
export const STAR_COLORS = [
  'Yellow', 'Red', 'Green', 'Blue', 'White',
];

// --- BIOMES ---
export const BIOMES = [
  'Lush', 'Frozen', 'Scorched', 'Toxic', 'Irradiated',
  'Barren', 'Exotic', 'Dead', 'Volcanic', 'Marsh', 'Water',
  'Infested', 'Mega Exotic', 'Glitch',
];

// --- TERRAIN TYPES ---
export const TERRAIN_TYPES = ['Pangean', 'Continental', 'Semi-Oceanic'];

// --- SENTINELS (grouped by level) ---
export const SENTINEL_GROUPS: Record<string, string[]> = {
  low: [
    'Absent', 'Few', 'Infrequent', 'Intermittent', 'Irregular Patrols',
    'Isolated', 'Limited', 'Low', 'Low Security', 'Minimal', 'Missing',
    'None', 'None Present', 'Not Present', 'Remote', 'Sparse', 'Spread Thin',
  ],
  high: [
    'Attentive', 'Enforcing', 'Ever-present', 'Frequent', 'Observant',
    'Regular Patrols', 'Require Obedience', 'Require Orthodoxy', 'Unwavering',
  ],
  aggressive: [
    'Aggressive', 'Frenzied', 'Hateful', 'High Security', 'Hostile Patrols',
    'Inescapable', 'Malicious', 'Threatening', 'Zealous',
  ],
  corrupted: [
    'Corrupted', 'Forsaken', 'Rebellious', 'Answer To None',
    'Sharded from the Atlas', 'Dissonant', 'De-Harmonised',
  ],
};

export const SENTINELS = Object.values(SENTINEL_GROUPS).flat();

// --- WEATHER ---
export const WEATHER_DATA = [
  'Tropical Storms', 'Occasional Boiling Fog', 'Superheated Mists',
  'Painful Mist', 'Infrequent Torrents', 'Oppressive', 'Soggy Danger',
  'Sticky Heat', 'Clammy Menace', 'Hazardous Moisture', 'Gentle Mist',
  'Humid', 'Tropical Winds', 'Warm Fog', 'Temperate Murk', 'Mild Damp',
  'Warm Dewdrops', 'Tepid Damp', 'Sweaty Drizzle', 'Muggy Haze',
  'Death Fog', 'Sultry Disaster', 'Cataclysmic Monsoons',
  'Mists of Annihilation', 'All-Consuming Fog', 'Liquid Hell',
  'Storms of Desolation', 'Melting Deluges', 'Boiling Catastrophe',
  'Damp Misery', 'Heated Gas Pockets', 'Occasional Firestorms',
  'Incendiary Winds', 'Unpredictable Conflagrations', 'Drifting Firestorms',
  'Pillars of Flame', 'Magma Geysers', 'Plumes of Fire', 'Molten Rain',
  'Tectonic Storms', 'Smothering Ash', 'Sulphurous Haze', 'Ash Wisps',
  'Drifting Smog', 'Cinderfalls', 'Ash Plumes', 'Choking Ash',
  'Burning Mists', 'Sulfur Fumes', 'Enveloping Ash', 'Ashen Winds',
  'Frequent Firestorms', 'Walls of Flame', 'Clouds of Fire',
  'Ashen Destruction', 'Magma Rain', 'Basalt Hail',
  'Explosive Gas Eruptions', 'Lethal Ash Storms', 'Sulphurous Inferno',
  'Colossal Firestorms', 'Obsidian Doom', 'Infrequent Heat Storms',
  'Rare Firestorms', 'Superheated Gas Pockets', 'Wandering Hot Spots',
  'Atmospheric Heat Instabilities', 'Direct Sunlight', 'Heated Atmosphere',
  'Occasional Ash Storms', 'Dangerously Hot', 'Burning Air', 'Parched',
  'Overly Warm', 'Sunny', 'Dehydrated', 'Unending Sunlight', 'Sweltering',
  'Extreme Heat', 'Burning Gas Clouds', 'Intense Heat', 'Superheated Air',
  'Scalding Heat', 'Inferno Winds', 'Firestorms', 'Combustible Dust',
  'Incendiary Dust', 'Self-Igniting Storms', 'Howling Blizzards',
  'Intense Cold', 'Icy Tempests', 'Supercooled Storms', 'Raging Snowstorms',
  'Ice Storms', 'Deep Freeze', 'Roaring Ice Storms', 'Frequent Blizzards',
  'Hazardous Whiteouts', 'Frozen Clouds', 'Occasional Snowfall',
  'Infrequent Blizzards', 'Outbreaks of Frozen Rain', 'Harsh, Icy Winds',
  'Drifting Snowstorms', 'Migratory Blizzards', 'Icy Blasts',
  'Wandering Frosts', 'Powder Snow', 'Wintry', 'Snowy', 'Icy', 'Crisp',
  'Frost', 'Freezing', 'Permafrost', 'Frequent Toxic Floods',
  'Toxic Superstorms', 'Acidic Deluges', 'Corrosive Cyclones',
  'Caustic Floods', 'Corrosive Storms', 'Torrential Acid',
  'Noxious Gas Storms', 'Toxic Monsoons', 'Bone-Stripping Acid Storms',
  'Corrosive Rainstorms', 'Pouring Toxic Rain', 'Occasional Acid Storms',
  'Atmospheric Corruption', 'Poison Flurries', 'Toxic Outbreaks',
  'Acidic Dust Pockets', 'Passing Toxic Fronts', 'Caustic Winds',
  'Alkaline Cloudbursts', 'Dangerously Toxic Rain',
  'Corrosive Sleet Storms', 'Lethal Atmosphere', 'Infrequent Toxic Drizzle',
  'Acid Rain', 'Toxic Clouds', 'Poison Rain', 'Choking Clouds',
  'Caustic Moisture', 'Poisonous Gas', 'Stinging Atmosphere', 'Toxic Damp',
  'Corrosive Damp', 'Stinging Puddles', 'Extreme Radioactivity',
  'Irradiated Thunderstorms', 'Planet-Wide Radiation Storms',
  'Extreme Atmospheric Decay', 'Roaring Nuclear Wind', 'Gamma Cyclones',
  'Contaminated Squalls', 'Extreme Thermonuclear Fog',
  'Frequent Particle Eruptions', 'Enormous Nuclear Storms',
  'Particulate Winds', 'Energetic Storms', 'Irradiated Downpours',
  'Radioactive Dust Storms', 'Volatile Windstorms',
  'Occasional Radiation Outbursts', 'Irradiated Storms', 'Unstable Fog',
  'Reactive Rain', 'Radioactive Humidity', 'Radioactive Damp',
  'Irradiated Winds', 'Contaminated Puddles', 'Volatile Winds',
  'Unstable Atmosphere', 'Gamma Dust', 'Nuclidic Atmosphere',
  'Boiling Superstorms', 'Intense Heatbursts', 'Superheated Rain',
  'Boiling Monsoons', 'Broiling Humidity', 'Painfully Hot Rain',
  'Torrential Heat', 'Blistering Floods', 'Scalding Rainstorms',
  'Torrid Deluges', 'Boiling Puddles', 'Sweltering Damp',
  'Superheated Drizzle', 'Dangerously Hot Fog', 'Choking Humidity',
  'Mostly Calm', 'Occasional Scalding Cloudbursts', 'Usually Mild',
  'Blistering Damp', 'Lethal Humidity Outbreaks', 'Temperate',
  'Light Showers', 'Mild Rain', 'Refreshing Breeze', 'Pleasant', 'Balmy',
  'Mellow', 'Beautiful', 'Blissful', 'Billowing Dust Storms',
  'Choking Sandstorms', 'Hazardous Temperature Extremes',
  'Lung-Burning Night Wind', 'Extreme Wind Blasting',
  'Planetwide Desiccation', 'Sand Blizzards', 'Howling Gales',
  'Dead Wastes', 'Occasional Sandstorms', 'Infrequent Dust Storms',
  'Intermittent Wind Blasting', 'Parched Sands', 'Sporadic Grit Storms',
  'Dust-Choked Winds', 'Highly Variable Temperatures', 'Blasted Atmosphere',
  'Freezing Night Winds', 'Ceaseless Drought', 'Moistureless', 'Baked',
  'Sterile', 'Unclouded Skies', 'Dry Gusts', 'Withered', 'Icy Nights',
  'Perfectly Clear', 'Absent', 'No Atmosphere', 'Utterly Still',
  'Peaceful', 'Eerily Calm', 'Airless', 'Silent', 'Inert', 'Clear',
  'Invisible Mist', 'Internal Rain', 'Lost Clouds', 'Crimson Heat',
  'Winds of Glass', 'Thirsty Clouds', 'Obsidian Heat', 'Memories of Frost',
  'Haunted Frost', 'Indetectable Burning', '[REDACTED]', 'Anomalous',
  'Burning Crimson', 'Scarlet Rain', 'Fevered Clouds', 'Carmine Winds',
  'Red Mist', 'Flaming Hail', 'Vermillion Storms', 'Rain of Atlas',
  'Angered Clouds', 'Blood Rain', 'Bilious Storms',
  'Deadly Pressure Variations', 'Harsh Toxic Wind', 'Corrupted Blood',
  'Infinite Toxic Mist', 'Echoes of Acid', 'Poison Cyclones',
  'Inescapable Toxins', 'Clouds of Haunted Green', 'Invisible Jade Winds',
  'Frozen Mists', 'Electric Rain', 'Azure Storms', 'Extreme Low Pressure',
  'All-Consuming Cold', 'Winds from Beyond', 'Unfathomable Storms',
  'Unimaginable Blue', 'Ultramarine Wind', 'Inverted Superstorms',
  'Coastal Storms',
];

// --- RESOURCES ---
export const RESOURCES: Record<string, string> = {
  Copper: 'Cu',
  Cadmium: 'Cd',
  Emeril: 'Em',
  Indium: 'In',
  'Activated Copper': 'Cu+',
  'Activated Cadmium': 'Cd+',
  'Activated Emeril': 'Em+',
  'Activated Indium': 'In+',
  Ammonia: 'NH3',
  Dioxite: 'CO2',
  Paraffinium: 'Pf',
  Phosphorus: 'P',
  Pyrite: 'Py',
  Uranium: 'U',
  Silver: 'Ag',
  Gold: 'Au',
  'Magnetised Ferrite': 'Fe++',
  Sodium: 'Na',
  Cobalt: 'Co',
  Salt: 'NaCl',
  'Star Bulb': 'Sb',
  'Cactus Flesh': 'Cc',
  'Gamma Root': 'Gr',
  'Fungal Mould': 'Ml',
  'Frost Crystal': 'Fc',
  Solanium: 'So',
  Mordite: 'Mo',
  Faecium: 'Fa',
  'Ancient Bones': 'Ab',
  'Salvageable Scrap': 'Sa',
  'Rusted Metal': 'Jn',
  Basalt: 'B',
};

export const RESOURCE_NAMES = Object.keys(RESOURCES);

// --- RARITY ---
export const RARITIES = [
  'Abundant', 'High', 'Ample', 'Frequent', 'Full', 'Generous',
  'Average', 'Regular', 'Common', 'Typical', 'Ordinary', 'Occasional',
  'Low', 'Scarce', 'Infrequent', 'Rare', 'Limited', 'Sporadic',
  'None', 'Deficient', 'Undetected', 'Lacking', 'Absent', 'Nonexistent',
  'Unusual', 'Lost', 'Displaced', 'From Elsewhere', 'Uprooted', 'Misplaced',
  'Forfeited', 'Between Worlds', 'Infected', 'Diseased', 'Twisted',
  'Screaming', 'Viral', 'Invasive', 'Bountiful', 'Copious', 'Rich',
  'Numerous', 'Moderate', 'Fair', 'Medium', 'Intermittent', 'Uncommon',
  'Few', 'Sparse', 'Empty', 'Not Present', 'Devoid', 'Barren', 'Synthetic',
];

// --- PLANET DESCRIPTORS ---
export const PLANET_DESCRIPTORS: Record<string, { suffix: string[]; none?: string[]; prefix?: string[] }> = {
  Dead: {
    suffix: ['Dead', 'Empty', 'Desolate', 'Lifeless', 'Forsaken', 'Life-Incompatible', 'Low Atmosphere', 'Airless', 'Abandoned'],
    none: ['Terraforming Catastrophe'],
  },
  Lush: {
    suffix: ['Rainy', 'Verdant', 'Tropical', 'Viridescent', 'Grassy', 'Temperate', 'Humid', 'Overgrown', 'Flourishing', 'Bountiful', 'Paradise'],
  },
  Exotic: {
    suffix: ['Shattered', 'Fractured', 'Fragmented', 'Contoured', 'Cabled', 'Webbed', 'Rattling', 'Spined', 'Skeletal', 'Finned', 'Bladed', 'Shell-Strewn', 'Fungal', 'Sporal', 'Capped', 'Ossified', 'Petrified', 'Calcified', 'Fissured', 'Breached', 'Hexagonal', 'Plated', 'Scaly', 'Mechanical', 'Metallic', 'Metallurgic', 'Bubbling', 'Frothing', 'Foaming', 'Columned', 'Sharded', 'Pillared'],
    prefix: ['of Light'],
  },
  Glitch: {
    suffix: ['Crimson', 'Malfunctioning', 'Breached', 'Infected', '[REDACTED]', 'Glassy', 'Thirsty', 'Doomed', 'Erased', 'Temporary', 'Corrupted'],
    none: ['Planetary Anomaly'],
  },
  Scorched: {
    suffix: ['Charred', 'Arid', 'Scorched', 'Hot', 'Fiery', 'Boiling', 'High Temperature', 'Torrid', 'Incandescent', 'Scalding'],
  },
  Frozen: {
    suffix: ['Frozen', 'Icebound', 'Arctic', 'Glacial', 'Sub-zero', 'Icy', 'Frostbound', 'Freezing', 'Hiemal', 'Hyperborean'],
  },
  Irradiated: {
    suffix: ['Irradiated', 'Radioactive', 'Contaminated', 'Nuclear', 'Isotopic', 'Decaying Nuclear', 'Gamma-Intensive', 'High Radio Source', 'Supercritical', 'High Energy'],
  },
  Toxic: {
    suffix: ['Toxic', 'Poisonous', 'Noxious', 'Corrosive', 'Acidic', 'Caustic', 'Acrid', 'Blighted', 'Miasmatic', 'Rotting'],
  },
  Barren: {
    suffix: ['Barren', 'Desert', 'Rocky', 'Bleak', 'Parched', 'Abandoned', 'Dusty', 'Desolate', 'Wind-swept'],
  },
  Marsh: {
    suffix: ['Marshy', 'Swamp', 'Tropical', 'Foggy', 'Misty', 'Boggy', 'Quagmire', 'Hazy', 'Cloudy', 'Vapour', 'Reeking', 'Murky', 'Damp'],
    none: ['Endless Morass'],
  },
  Volcanic: {
    suffix: ['Lava', 'Magma', 'Erupting', 'Volcanic', 'Ash-Shrouded', 'Ashen', 'Tectonic', 'Unstable', 'Violent', 'Molten', 'Flame-Ruptured', 'Basalt'],
    none: ['Imminent Core Detonation', 'Obsidian Bead'],
  },
  Water: {
    suffix: ['Drowning', 'Oceanic', 'Tidal', 'Waterlocked', 'Aquatic', 'Marine'],
    none: ['Waterworld', 'Endless Seas'],
  },
  Infested: {
    suffix: ['Infested', 'Worm-ridden', 'Tainted', 'Mutated', 'Corrupted'],
    none: ['Infested Paradise', 'Toxic Horror', 'Boiling Doom', 'Radioactive Abomination', 'Icy Abhorrence', 'Xeno-Colony', 'Caustic Nightmare', 'Fiery Dreadworld', 'Frozen Hell', 'Infected Dustbowl', 'The Nest', 'Terrorsphere'],
  },
};

// --- FAUNA DIET ---
export const FAUNA_DIETS = [
  '[[Star Bramble]]', '[[Echinocactus]]', '[[Solar Vine]]', '[[Frostwort]]',
  '[[Fungal Cluster]]', '[[Gamma Weed]]', '[[Mordite Root]]', 'Nitrous Oxide',
  '[[Cadmium]]', '[[Emeril]]', '[[Indium]]', '[[Kelp Sac]]',
  '[[Condensed Carbon]]', 'Vegetation', 'Foliage', 'Small trees',
  'Rotting fruit', 'Fresh leaves', 'Plant roots', 'Digs for tubers',
  'Grass', 'Foraged nuts', 'Collects seeds', 'Nibbles at shoots',
  'Tall grasses', '[[Cave Marrow|Cave marrow]]',
  '[[Mordite Root|Mordite roots]]', '[[Faecium]]', '[[Coprite]]',
  'Well-Matured Dung', 'Mostly rocks', '[[Di-hydrogen]] crystals',
  'Processes dirt', 'Oxide elements', 'Absorbed nutrients',
  '[[NipNip Buds|NipNip buds]]', '[[Gravitino Ball|Gravitino balls]]',
  'Stinging leaves', 'Algae', 'Flowers', 'Petals', 'Nectar', 'Pollen',
  'Scavenged scraps', 'Insects and grubs', 'Worms', 'Anything',
  '[[Faecium|Faeces]]', 'Birds', 'Scavenged remains',
  'Partially-digested meat', 'Eggs', 'Steals from others',
  '[[Venom Urchin]]s', 'Foraged leftovers', 'Small animals', 'Old bones',
  '[[Mordite]]', 'Carnivorous', 'Meat-eater', 'Hypnotises prey',
  'Crunches bones', 'Blood-drinker', 'Liquidised organs',
  'Extracts bone marrow', 'Organs', 'Raw meat', 'Flesh-eater',
  'Hypercarnivore', 'Brain matter', 'Sinew', 'Fresh meat', 'Corpses',
  'Putrefied meat', 'Cannibal', 'Offal', 'Removed hearts',
  'Other carnivores', 'Large mammals', 'Flesh chunks', 'Meat chunks',
  'Coagulated blood', 'Frozen meat', 'Boiled meat', 'Radioactive meat',
  'Toxic meat', 'Rotten meat', 'Preserved meat', 'Fetid meat',
  'Charred meat', 'Marine snow', 'Chemosynthesis', 'Vented minerals',
  'Plankton', 'Seaweed', 'Deepwater algae', 'Small crustaceans',
  'Rotten wood', 'Decayed plant life', 'Marine detritus',
  'Algal particulates', 'Coral', 'Living sponges', 'Deepwater spores',
  'Nibbles at moss', 'Hydrothermal minerals', 'Water filtration',
  'Drifting plants', 'Silicates', 'High in calcium', 'Water vines',
  '[[Kelp Sac|Kelp sacs]]', 'Nutritious water weeds', 'Other fish',
  'Cannibalism', 'Marine eggs', 'Turtles', 'Shellfish',
  'Drifting carcasses', 'Bones', 'Hunts squid', 'Brined organs',
  'Salinated flesh', 'Brains', 'Blood', 'Gelatinous chunks', 'Wasteflesh',
  'Pure Silicon', 'Siphoned Data', '[[Nanite Cluster]]s', 'Recycled Heat',
  'Cosmic Rays', 'Decaying Atoms', 'Random', 'Interlopers',
];

// --- FAUNA BEHAVIOURS ---
export const FAUNA_BEHAVIOURS = [
  'Anxious', 'Bold', 'Calm', 'Cautious', 'Dangerous', 'Docile',
  'Erratic', 'Evasive', 'Friendly', 'Focused', 'Frenzied', 'Gentle',
  'Hostile', 'Hunting', 'Ignorant', 'Intelligent', 'Jumpy', 'Migratory',
  'Mildly aggressive', 'Nervous', 'Passive', 'Patient', 'Predator',
  'Reckless', 'Skittish', 'Slow', 'Sociable', 'Submissive', 'Timid',
  'Unpredictable', 'Violent', 'Wary',
];

// --- FAUNA GENDERS ---
export const FAUNA_GENDERS_DEFAULT = [
  'Alpha', 'Asymmetric', 'Asymptotic', 'Exotic', 'Female',
  'Indeterminate', 'Male', 'Non-uniform', 'None', 'Orthogonal',
  'Prime', 'Radical', 'Rational', 'Symmetric', 'Unknown', 'Vectorised',
];

export const FAUNA_GENDERS_MECHANOCERIS = [
  'Asynchronous', 'Circular', 'Electronic', 'Mutable', 'Non-boolean',
  'Non-Euclidean', 'Uninitialised', 'Unmeasurable', 'Virtual',
];

// --- FAUNA ECOSYSTEM ---
export const FAUNA_ECOSYSTEMS = [
  'Ground', 'Underground', 'Flying', 'Underwater',
];

// --- FAUNA GENUS ---
export const FAUNA_GENUS = [
  'Bos', 'Conokinis', 'Felis', 'Lok', 'Procavya', 'Rangifae',
  'Scolopendra', 'Talis', 'Tetraceris', 'Ungulatis', 'Agnelis',
  'Rhopalocera', 'Cycromys', 'Felihex', 'Hexungulatis', 'Prionace',
  'Protosphaeridae', 'Prototerrae', 'Reococcyx', 'Spiralis',
  'Theroma', 'Tyrannocetus', 'Vermok', 'Anastomus', 'Bosoptera',
  'Chrysocora', 'Fugus', 'Ictaloris', 'Mogara', 'Osteofelus',
  'Procavaquatica', 'Prionacefda', 'Pumpa', 'Squid', 'Chrysaora',
  'Mechanoceris',
];

// --- FLORA AGE ---
export const FLORA_AGES: Record<string, string> = {
  Ancient: 'Ancestral',
  Old: 'Vieja',
  Timeless: 'Intemporal',
  Millenia: 'Milenios',
  Centuries: 'Siglos',
  Fresh: 'Reciente',
  Sproutling: 'Germinando',
  Sapling: 'Retoño',
  Young: 'Joven',
  Decades: 'Décadas',
  Moderate: 'Moderada',
  Mature: 'Madura',
  Seasoned: 'Desarrollada',
  Juvenile: 'Juvenil',
  'Fully Grown': 'Totalmente desarrollada',
  Youthful: 'Tierna',
  Advanced: 'Avanzada',
  Unknown: 'Desconocida',
  Indeterminate: 'Indeterminada',
  Regenerating: 'En regeneración',
  Perpetual: 'Perpetua',
  Cyclical: 'Cíclica',
  'Several Days': 'Varios días',
  'Still Growing': 'En crecimiento',
  Infant: 'Recién nacida',
  Immature: 'Verde',
  'Fully Developed': 'Plenamente desarrollada',
  Dying: 'Decadente',
};

export const FLORA_AGE_KEYS = Object.keys(FLORA_AGES);

// --- FLORA ROOTS ---
export const FLORA_ROOTS = [
  'Balanced', 'Circular', 'Concentrated', 'Copious', 'Extensive',
  'Few', 'Gangly', 'Gnarled', 'Gravitational', 'Heavily Branched',
  'Inorganic', 'Irregular', 'Long', 'Many', 'Meandering', 'Misleading',
  'Moderate', 'Multi-Directional', 'Not Present', 'Nutrient Drained',
  'Obtuse', 'Omnidirectional', 'Opposite', 'Predictable', 'Short',
  'Simple', 'Sparse', 'Straight', 'Swollen', 'Tapering', 'Twisted',
  'Underground', 'Unobstructed', 'Wide',
];

// --- FLORA NUTRIENTS ---
export const FLORA_NUTRIENTS = [
  'Atmospheric Absorption', 'Autotrophic', 'Buried Nitrogen',
  'Carbon Absorption', 'Cave Sediment', 'Cellular Respiration',
  'Compost', 'Concentrated Minerals', 'Decomposition',
  'Defensive Symbiosis', 'Electron Donors', 'External Maintenance',
  'Fungal Parasite', 'Gas Exchange', 'Geological Energy',
  'Gravitational Field', 'Groundwater', 'Heat Recycling',
  'Infrared Radiation', 'Iron Defecation', 'Light Absorption',
  'Lithotropic', 'Moonlight', 'Nitrogen Fixation', 'Osmosis',
  'Photosynthesis', 'Plant Roots', 'Plastidium', 'Pollination',
  'Predatory', 'Proto-Radiation', 'Radio Waves', 'Reduced Carbon',
  'Reflective Particles', 'Salt Fusion', 'Self-Consumption',
  'Soil Bacteria', 'Solar Recycling', 'Starlight', 'Sulphur',
  'Sulphuric Acid', 'Sunlight', 'Thermal Capture', 'Toxic Waste',
  'Underground Bubbles', 'UV Rays', 'Vented Gas', 'Wind Dust',
];

// --- FLORA PRODUCES ---
export const FLORA_PRODUCES = [
  'Carbon', 'Oxygen', 'Sodium', 'Marrow Bulb', 'Star Bulb',
  'Cactus Flesh', 'Gamma Root', 'Fungal Mould', 'Frost Crystal',
  'Solanium', 'Mordite', 'Faecium', 'Ancient Bones',
  'Salvageable Scrap', 'Rusted Metal',
];

// --- MINERAL FORMATIONS ---
export const MINERAL_FORMATIONS: Record<string, string> = {
  'Soil Compaction': 'Compactación del suelo',
  'Water Transport': 'Transporte de agua',
  'Atmospheric Metal': 'Metal atmosférico',
  'Plant Deposits': 'Depósitos botánicos',
  'Living Stone': 'Piedra viva',
  Evaporation: 'Evaporación',
  'Wind Erosion': 'Erosión eólica',
  Gravitational: 'Gravitacional',
  Volcanic: 'Volcánico',
  'High-Pressure': 'Alta presión',
  'Gas Humidity': 'Humedad del gas',
  Sublimation: 'Sublimación',
  'Calcified Fauna': 'Fauna calcificada',
  'Salt Bonding': 'Conexión salina',
  'Low Energy Reaction': 'Reacción de baja energía',
  'Magnetic Attraction': 'Atracción magnética',
  'Reductive Boiling': 'Ebullición reductiva',
  'Salt Baked': 'Tostado a la sal',
  'Soil Amalgamation': 'Amalgamamiento del suelo',
  'Ancient Tidal Erosion': 'Erosión mareal ancestral',
  Metamorphic: 'Metamórfico',
  Polymerisation: 'Polimerización',
  Coalescence: 'Coalescencia',
  'Slow Drips': 'Goteo lento',
  Photonic: 'Fotónico',
  'Ground up Shells': 'Conchas molidas',
  'Old Bones': 'Huesos viejos',
  Tectonic: 'Tectónico',
  Spontaneous: 'Espontáneo',
  'Calcium Secretion': 'Secreción de calcio',
  Hydrothermal: 'Hidrotermal',
  'Vented Minerals': 'Minerales agujereados',
  'Explosive Magma': 'Magma explosivo',
  Pyroclastic: 'Piroclástico',
  'Jet Pressure': 'Presión a chorro',
  'Gas Bubbles': 'Burbujas de gas',
  Diagenesis: 'Diagénesis',
  'Metal Vapour': 'Vapor metálico',
  'Ammonia Groundwater': 'Agua amoniacal subterránea',
  Lithification: 'Litificación',
  Cementation: 'Cementación',
  'Bedrock Expulsion': 'Expulsión del lecho de roca',
  Petrifaction: 'Petrificación',
  Fossilisation: 'Fosilización',
  Sedimentation: 'Sedimentación',
  Celestial: 'Celestial',
  'Meteorite Impact': 'Impacto de meteorito',
  'Localised Black Hole': 'Agujero negro localizado',
  'Comet Fragment': 'Fragmento de cometa',
  'Animal Deposits': 'Depósitos animales',
};

export const MINERAL_FORMATION_KEYS = Object.keys(MINERAL_FORMATIONS);

// --- MINERAL METAL CONTENT ---
export const MINERAL_METAL_CONTENT = [
  'None', 'Low', 'Medium', 'High',
];

// --- STARSHIP TYPES ---
export const STARSHIP_TYPES = [
  'Fighter', 'Explorer', 'Hauler', 'Shuttle', 'Exotic',
  'Solar', 'Living Ship', 'Sentinel Interceptor', 'Squid',
];

// --- STARSHIP CLASSES ---
export const STARSHIP_CLASSES = ['S', 'A', 'B', 'C'];

// --- MULTITOOL TYPES ---
export const MULTITOOL_TYPES = [
  'Pistol', 'SMG', 'Rifle', 'Experimental', 'Alien',
  'Royal', 'Atlantid', 'Sentinel',
];

// --- MULTITOOL CLASSES ---
export const MULTITOOL_CLASSES = ['S', 'A', 'B', 'C'];

// --- SETTLEMENT PRODUCTIONS ---
export const SETTLEMENT_PRODUCTIONS = [
  'Circuit Boards', 'Cryo-Pumps', 'Fusion Ignitors', 'Stasis Devices',
  'Portable Reactors', 'Quantum Processors', 'Iridesite',
  'Geodesite', 'Dirty Bronze', 'Herox', 'Grantine', 'Lemmium',
  'Aronium', 'Magno-Gold',
];

// --- DERELICT ENEMIES ---
export const DERELICT_ENEMIES = [
  'Biological Horrors', 'Security Drones', 'None',
];

// --- DERELICT LOOT ---
export const DERELICT_LOOT = [
  'Nanite Clusters', 'Units', 'Tainted Metal', 'S-Class Upgrades',
  'Crew Manifest', 'Captain\'s Log', 'Emergency Broadcast Unit',
];

// --- BASE TYPES ---
export const BASE_TYPES = [
  'Base', 'Outpost', 'Farm', 'Mining Base', 'Portal Base',
  'Settlement Base', 'Underwater Base', 'Mountain Base',
  'Beach Base', 'Cave Base', 'Archive Base', 'Colossal Base',
  'Planetary Base', 'Orbital Base', 'Trade Outpost',
  'Waypoint', 'Shelter', 'Observatory', 'Research Base',
  'Recreation Base', 'Community Base',
];

// --- SYSTEM TERMINAL ITEMS ---
export const TERMINAL_ITEMS = [
  'Star Silk', 'Comet Droplets', 'Ion Sphere', 'Decrypted User Data',
  'Teleport Coordinators', 'Nanotube Crate', 'Self-Repairing Heridium',
  'Optical Solvent', '5D Torus', 'Superconducting Fibre',
  'De-Scented Bottles', 'Neutron Microscope', 'Instability Injector',
  'Organic Piping', 'Neural Duct', 'Dirt', 'Unrefined Pyrite Grease',
  'Bromide Salt', 'Polychromatic Zirconium', 'Re-latticed Arc Crystal',
  'Enormous Metal Cog', 'Non-Stick Piston', 'Mesh Decouplers',
  'Holographic Crankshaft', 'Vector Compressors', 'Decommissioned Circuits',
  'Welding Soap', 'Ion Capacitor', 'Autonomous Positioning Unit',
  'Quantum Accelerator', 'Spark Canister', 'Industrial-Grade Battery',
  'Ohmic Gel', 'Experimental Power Fluid', 'Fusion Core',
];

// --- TOOLTIPS (field descriptions) ---
export const FIELD_TOOLTIPS: Record<string, string> = {
  name: 'Nombre del descubrimiento',
  org_name: 'Nombre original en inglés (si aplica)',
  galaxy: 'Galaxia donde se encuentra el sistema',
  region: 'Región dentro de la galaxia',
  glyphs: 'Código de 12 glifos de coordenadas',
  stellar_class: 'Clasificación espectral de la estrella',
  color: 'Color de la estrella en el mapa galáctico',
  distance: 'Distancia desde el centro de la galaxia en años luz',
  faction: 'Facción que controla el sistema',
  economy: 'Tipo de economía del sistema',
  economy_sell: 'Porcentaje de venta del sistema',
  economy_buy: 'Porcentaje de compra del sistema',
  conflict: 'Nivel de conflicto del sistema',
  water: 'Indica si el sistema tiene planetas con agua',
  dissonant: 'Indica si el sistema es disonante (Sentinelas Corruptos)',
  planet_count: 'Número de planetas en el sistema',
  moon_count: 'Número de lunas en el sistema',
  platform: 'Plataforma de juego donde se descubrió',
  mode: 'Modo de juego',
  discovered_by: 'Nombre del jugador que descubrió la entidad',
  doc_by: 'Nombre del jugador que documentó la entidad',
  disc_date: 'Fecha del descubrimiento',
  doc_date: 'Fecha de documentación',
  additional_info: 'Información adicional relevante',
  system_id: 'ID del sistema al que pertenece',
  planet_id: 'ID del planeta al que pertenece',
  biome: 'Tipo de bioma del planeta',
  terrain: 'Tipo de terreno del planeta',
  atmosphere: 'Tipo de atmósfera del planeta',
  weather: 'Clima del planeta',
  sentinels: 'Nivel de actividad de los centinelas',
  resource1: 'Primer recurso disponible en el planeta',
  resource2: 'Segundo recurso disponible en el planeta',
  flora_abundance: 'Abundancia de flora en el planeta',
  fauna_abundance: 'Abundancia de fauna en el planeta',
  fauna_count: 'Número total de especies de fauna',
  type: 'Tipo de entidad',
  axes: 'Coordenadas planetarias (+x, +y)',
  farm: 'Indica si la base tiene una granja',
  geobay: 'Indica si la base tiene un geobay',
  landingpad: 'Indica si la base tiene plataforma de aterrizaje',
  terminal: 'Indica si la base tiene terminal de comercio',
  arena: 'Indica si la base tiene arena de combate',
  racetrack: 'Indica si la base tiene pista de carreras',
  layout: 'Descripción de la distribución de la base',
  features: 'Características destacadas de la base',
  is_featured: 'Indica si la base está destacada en el wiki',
  genus: 'Género de la criatura',
  gender: 'Género (alternancia) de la criatura',
  diet: 'Dieta de la criatura',
  behaviour: 'Comportamiento de la criatura',
  activity: 'Patrón de actividad (diurno/nocturno)',
  hemisphere: 'Hemisferio donde se encuentra',
  height: 'Altura de la criatura en metros',
  weight: 'Peso de la criatura en kilogramos',
  rarity: 'Rareza de la entidad',
  ecosystem: 'Ecosistema donde habita',
  notes: 'Notas adicionales',
  age: 'Edad de la flora',
  roots: 'Sistema de raíces de la flora',
  nutrients: 'Fuente de nutrientes de la flora',
  produces: 'Recurso que produce la flora',
  formation: 'Formación geológica del mineral',
  metal_content: 'Contenido metálico del mineral',
  class: 'Clase del objeto (S, A, B, C)',
  slots: 'Número de espacios de inventario',
  cost: 'Coste en unidades',
  damage_potential: 'Potencial de daño',
  maneuverability: 'Maniobrabilidad',
  shield_bonus: 'Bonus de escudo',
  warp_bonus: 'Bonus de salto warp',
  pilot: 'Nombre del piloto de la nave',
  population: 'Población del asentamiento',
  production: 'Producción del asentamiento',
  damage: 'Daño del multitool',
  scanner: 'Rango del escáner del multitool',
  save_location: 'Ubicación guardada',
  room_count: 'Número de habitaciones del derelicto',
  enemies: 'Tipo de enemigos en el derelicto',
  loot: 'Tipo de botín del derelicto',
  stomach_content: 'Contenido estomacal del sandworm',
  crystals: 'Cristales del sandworm',
  horns: 'Cuernos del sandworm',
  glowtubes: 'Tubos brillantes del sandworm',
  descriptors: 'Descriptor del planeta (ej: Paradise, Frozen)',
  research_team: 'Equipo de investigación responsable',
  images: 'URLs de imágenes separadas por comas',
};