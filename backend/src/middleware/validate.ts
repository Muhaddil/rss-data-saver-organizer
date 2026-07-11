import { z } from 'zod';

export const systemSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  org_name: z.string().optional().default(''),
  galaxy: z.string().optional().default(''),
  region: z.string().optional().default(''),
  region_number: z.string().optional().default(''),
  glyphs: z.string().optional().default(''),
  stellar_class: z.string().optional().default(''),
  color: z.string().optional().default(''),
  distance: z.string().optional().default(''),
  faction: z.string().optional().default(''),
  economy: z.string().optional().default(''),
  economy_sell: z.string().optional().default(''),
  economy_buy: z.string().optional().default(''),
  conflict: z.string().optional().default(''),
  water: z.string().optional().default('No'),
  dissonant: z.string().optional().default('No'),
  multiple_stars: z.string().optional().default(''),
  planet_count: z.number().optional().default(0),
  moon_count: z.number().optional().default(0),
  platform: z.string().optional().default(''),
  mode: z.string().optional().default(''),
  discovered_by: z.string().optional().default(''),
  discovered_link: z.string().optional().default(''),
  doc_by: z.string().optional().default(''),
  disc_date: z.string().optional().default(''),
  doc_date: z.string().optional().default(''),
  additional_info: z.string().optional().default(''),
  research_team: z.string().optional().default(''),
  images: z.string().optional().default('[]'),
});

export const planetSchema = z.object({
  system_id: z.number().int().positive('System ID es requerido'),
  name: z.string().min(1, 'Nombre es requerido'),
  org_name: z.string().optional().default(''),
  biome: z.string().optional().default(''),
  descriptors: z.string().optional().default(''),
  terrain: z.string().optional().default(''),
  atmosphere: z.string().optional().default(''),
  weather: z.string().optional().default(''),
  sentinels: z.string().optional().default(''),
  resource1: z.string().optional().default(''),
  resource2: z.string().optional().default(''),
  flora_abundance: z.string().optional().default(''),
  fauna_abundance: z.string().optional().default(''),
  fauna_count: z.number().optional().default(0),
  discovered_by: z.string().optional().default(''),
  discovered_link: z.string().optional().default(''),
  doc_by: z.string().optional().default(''),
  disc_date: z.string().optional().default(''),
  doc_date: z.string().optional().default(''),
  research_team: z.string().optional().default(''),
  additional_info: z.string().optional().default(''),
  images: z.string().optional().default('[]'),
});

export const baseSchema = z.object({
  system_id: z.number().int().positive('System ID es requerido'),
  planet_id: z.number().int().positive().nullable().optional(),
  name: z.string().min(1, 'Nombre es requerido'),
  type: z.string().optional().default(''),
  axes: z.string().optional().default(''),
  glyphs: z.string().optional().default(''),
  farm: z.string().optional().default('No'),
  geobay: z.string().optional().default('No'),
  landingpad: z.string().optional().default('No'),
  terminal: z.string().optional().default('No'),
  arena: z.string().optional().default('No'),
  racetrack: z.string().optional().default('No'),
  layout: z.string().optional().default(''),
  features: z.string().optional().default(''),
  census_player: z.string().optional().default(''),
  census_social: z.string().optional().default(''),
  census_reddit: z.string().optional().default(''),
  census_discord: z.string().optional().default(''),
  census_friend: z.string().optional().default(''),
  census_arrival: z.string().optional().default(''),
  census_show: z.string().optional().default(''),
  discovered_by: z.string().optional().default(''),
  discovered_link: z.string().optional().default(''),
  doc_by: z.string().optional().default(''),
  platform: z.string().optional().default(''),
  mode: z.string().optional().default(''),
  research_team: z.string().optional().default(''),
  additional_info: z.string().optional().default(''),
  is_featured: z.string().optional().default('No'),
  images: z.string().optional().default('[]'),
});

export const faunaSchema = z.object({
  planet_id: z.number().int().positive('Planet ID es requerido'),
  system_id: z.number().int().positive('System ID es requerido'),
  name: z.string().min(1, 'Nombre es requerido'),
  genus: z.string().optional().default(''),
  gender: z.string().optional().default(''),
  gender2: z.string().optional().default(''),
  diet: z.string().optional().default(''),
  behaviour: z.string().optional().default(''),
  activity: z.string().optional().default(''),
  hemisphere: z.string().optional().default(''),
  rarity: z.string().optional().default(''),
  ecosystem: z.string().optional().default(''),
  height: z.string().optional().default(''),
  weight: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  discovered_by: z.string().optional().default(''),
  discovered_link: z.string().optional().default(''),
  doc_by: z.string().optional().default(''),
  images: z.string().optional().default('[]'),
});

export const floraSchema = z.object({
  planet_id: z.number().int().positive('Planet ID es requerido'),
  system_id: z.number().int().positive('System ID es requerido'),
  name: z.string().min(1, 'Nombre es requerido'),
  age: z.string().optional().default(''),
  roots: z.string().optional().default(''),
  nutrients: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  produces: z.string().optional().default(''),
  discovered_by: z.string().optional().default(''),
  discovered_link: z.string().optional().default(''),
  doc_by: z.string().optional().default(''),
  images: z.string().optional().default('[]'),
});

export const mineralSchema = z.object({
  planet_id: z.number().int().positive('Planet ID es requerido'),
  system_id: z.number().int().positive('System ID es requerido'),
  name: z.string().min(1, 'Nombre es requerido'),
  formation: z.string().optional().default(''),
  metal_content: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  discovered_by: z.string().optional().default(''),
  discovered_link: z.string().optional().default(''),
  doc_by: z.string().optional().default(''),
  images: z.string().optional().default('[]'),
});

export const starshipSchema = z.object({
  system_id: z.number().int().positive('System ID es requerido'),
  name: z.string().min(1, 'Nombre es requerido'),
  type: z.string().optional().default(''),
  class: z.string().optional().default(''),
  slots: z.string().optional().default(''),
  cost: z.string().optional().default(''),
  scanner_range: z.string().optional().default(''),
  damage_potential: z.string().optional().default(''),
  maneuverability: z.string().optional().default(''),
  damage_bonus: z.string().optional().default(''),
  shield_bonus: z.string().optional().default(''),
  warp_bonus: z.string().optional().default(''),
  pilot: z.string().optional().default(''),
  save_location: z.string().optional().default(''),
  discovered_by: z.string().optional().default(''),
  discovered_link: z.string().optional().default(''),
  doc_by: z.string().optional().default(''),
  images: z.string().optional().default('[]'),
});

export const settlementSchema = z.object({
  system_id: z.number().int().positive('System ID es requerido'),
  name: z.string().min(1, 'Nombre es requerido'),
  population: z.string().optional().default(''),
  production: z.string().optional().default(''),
  discovered_by: z.string().optional().default(''),
  discovered_link: z.string().optional().default(''),
  doc_by: z.string().optional().default(''),
  images: z.string().optional().default('[]'),
});

export const multitoolSchema = z.object({
  system_id: z.number().int().positive('System ID es requerido'),
  name: z.string().min(1, 'Nombre es requerido'),
  type: z.string().optional().default(''),
  class: z.string().optional().default(''),
  slots: z.string().optional().default(''),
  damage: z.string().optional().default(''),
  scanner: z.string().optional().default(''),
  save_location: z.string().optional().default(''),
  discovered_by: z.string().optional().default(''),
  discovered_link: z.string().optional().default(''),
  doc_by: z.string().optional().default(''),
  images: z.string().optional().default('[]'),
});

export const derelictSchema = z.object({
  system_id: z.number().int().positive('System ID es requerido'),
  name: z.string().min(1, 'Nombre es requerido'),
  room_count: z.string().optional().default(''),
  enemies: z.string().optional().default(''),
  loot: z.string().optional().default(''),
  discovered_by: z.string().optional().default(''),
  discovered_link: z.string().optional().default(''),
  doc_by: z.string().optional().default(''),
  images: z.string().optional().default('[]'),
});

export const sandwormSchema = z.object({
  planet_id: z.number().int().positive('Planet ID es requerido'),
  system_id: z.number().int().positive('System ID es requerido'),
  name: z.string().min(1, 'Nombre es requerido'),
  class: z.string().optional().default(''),
  stomach_content: z.string().optional().default(''),
  crystals: z.string().optional().default(''),
  horns: z.string().optional().default(''),
  glowtubes: z.string().optional().default(''),
  appear_on_reload: z.string().optional().default(''),
  discovered_by: z.string().optional().default(''),
  discovered_link: z.string().optional().default(''),
  doc_by: z.string().optional().default(''),
  images: z.string().optional().default('[]'),
});

export const racetrackSchema = z.object({
  system_id: z.number().int().positive('System ID es requerido'),
  planet_id: z.number().int().positive().nullable().optional(),
  name: z.string().min(1, 'Nombre es requerido'),
  discovered_by: z.string().optional().default(''),
  discovered_link: z.string().optional().default(''),
  doc_by: z.string().optional().default(''),
  images: z.string().optional().default('[]'),
});

export function validate(schema: z.ZodSchema) {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      res.status(400).json({ error: 'Validación fallida', details: errors });
      return;
    }
    req.body = result.data;
    next();
  };
}
