export interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export interface System {
  id: number;
  name: string;
  org_name: string;
  galaxy: string;
  region: string;
  region_number: string;
  glyphs: string;
  stellar_class: string;
  color: string;
  distance: string;
  faction: string;
  economy: string;
  economy_sell: string;
  economy_buy: string;
  conflict: string;
  water: string;
  dissonant: string;
  multiple_stars: string;
  planet_count: number;
  moon_count: number;
  platform: string;
  mode: string;
  discovered_by: string;
  discovered_link: string;
  doc_by: string;
  disc_date: string;
  doc_date: string;
  additional_info: string;
  research_team: string;
  images: string;
  created_at: string;
  updated_at: string;
}

export interface Planet {
  id: number;
  system_id: number;
  name: string;
  org_name: string;
  biome: string;
  descriptors: string;
  terrain: string;
  atmosphere: string;
  weather: string;
  sentinels: string;
  resource1: string;
  resource2: string;
  flora_abundance: string;
  fauna_abundance: string;
  fauna_count: number;
  discovered_by: string;
  discovered_link: string;
  doc_by: string;
  disc_date: string;
  doc_date: string;
  research_team: string;
  additional_info: string;
  images: string;
  created_at: string;
  updated_at: string;
  system_name?: string;
  galaxy?: string;
  region?: string;
}

export interface Base {
  id: number;
  system_id: number;
  planet_id: number | null;
  name: string;
  type: string;
  axes: string;
  glyphs: string;
  farm: string;
  geobay: string;
  landingpad: string;
  terminal: string;
  arena: string;
  racetrack: string;
  layout: string;
  features: string;
  census_player: string;
  census_social: string;
  census_reddit: string;
  census_discord: string;
  census_friend: string;
  census_arrival: string;
  census_show: string;
  discovered_by: string;
  discovered_link: string;
  doc_by: string;
  platform: string;
  mode: string;
  research_team: string;
  additional_info: string;
  is_featured: string;
  images: string;
  created_at: string;
  updated_at: string;
  system_name?: string;
  planet_name?: string;
  galaxy?: string;
  region?: string;
  system_glyphs?: string;
  biome?: string;
}

export interface Fauna {
  id: number;
  planet_id: number;
  system_id: number;
  name: string;
  genus: string;
  gender: string;
  gender2: string;
  diet: string;
  behaviour: string;
  activity: string;
  hemisphere: string;
  rarity: string;
  ecosystem: string;
  height: string;
  weight: string;
  notes: string;
  discovered_by: string;
  discovered_link: string;
  doc_by: string;
  images: string;
  created_at: string;
  updated_at: string;
  system_name?: string;
  planet_name?: string;
  biome?: string;
}

export interface Flora {
  id: number;
  planet_id: number;
  system_id: number;
  name: string;
  age: string;
  roots: string;
  nutrients: string;
  notes: string;
  produces: string;
  discovered_by: string;
  discovered_link: string;
  doc_by: string;
  images: string;
  created_at: string;
  updated_at: string;
  system_name?: string;
  planet_name?: string;
  biome?: string;
}

export interface Mineral {
  id: number;
  planet_id: number;
  system_id: number;
  name: string;
  formation: string;
  metal_content: string;
  notes: string;
  discovered_by: string;
  discovered_link: string;
  doc_by: string;
  images: string;
  created_at: string;
  updated_at: string;
  system_name?: string;
  planet_name?: string;
  biome?: string;
}

export interface Starship {
  id: number;
  system_id: number;
  name: string;
  type: string;
  class: string;
  slots: string;
  cost: string;
  scanner_range: string;
  damage_potential: string;
  maneuverability: string;
  damage_bonus: string;
  shield_bonus: string;
  warp_bonus: string;
  pilot: string;
  save_location: string;
  discovered_by: string;
  discovered_link: string;
  doc_by: string;
  images: string;
  created_at: string;
  updated_at: string;
  system_name?: string;
  galaxy?: string;
  region?: string;
  system_glyphs?: string;
}

export interface Settlement {
  id: number;
  system_id: number;
  name: string;
  population: string;
  production: string;
  discovered_by: string;
  discovered_link: string;
  doc_by: string;
  images: string;
  created_at: string;
  updated_at: string;
  system_name?: string;
}

export interface Multitool {
  id: number;
  system_id: number;
  name: string;
  type: string;
  class: string;
  slots: string;
  damage: string;
  scanner: string;
  save_location: string;
  discovered_by: string;
  discovered_link: string;
  doc_by: string;
  images: string;
  created_at: string;
  updated_at: string;
  system_name?: string;
}

export interface Derelict {
  id: number;
  system_id: number;
  name: string;
  room_count: string;
  enemies: string;
  loot: string;
  discovered_by: string;
  discovered_link: string;
  doc_by: string;
  images: string;
  created_at: string;
  updated_at: string;
  system_name?: string;
}

export interface Sandworm {
  id: number;
  planet_id: number;
  system_id: number;
  name: string;
  class: string;
  stomach_content: string;
  crystals: string;
  horns: string;
  glowtubes: string;
  appear_on_reload: string;
  discovered_by: string;
  discovered_link: string;
  doc_by: string;
  images: string;
  created_at: string;
  updated_at: string;
  system_name?: string;
  planet_name?: string;
}

export interface Racetrack {
  id: number;
  system_id: number;
  planet_id: number | null;
  name: string;
  discovered_by: string;
  discovered_link: string;
  doc_by: string;
  images: string;
  created_at: string;
  updated_at: string;
  system_name?: string;
  planet_name?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface Stats {
  totals: {
    systems: number;
    planets: number;
    bases: number;
    fauna: number;
    flora: number;
    minerals: number;
    starships: number;
    settlements: number;
    multitools: number;
    derelicts: number;
    sandworms: number;
    racetracks: number;
    featuredBases: number;
  };
  galaxies: string[];
  factions: string[];
  biomes: string[];
  recent: {
    systems: System[];
    planets: Planet[];
    bases: Base[];
  };
  topDiscoverers: { discovered_by: string; count: number }[];
}
