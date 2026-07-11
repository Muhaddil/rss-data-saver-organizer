import { Router, Response } from 'express';
import { getDatabase } from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { authorizeEdit, authorizeDelete } from '../middleware/authorize.js';
import { validate, planetSchema } from '../middleware/validate.js';
import type { Planet, PlanetFilters } from '../types/index.js';

const router = Router();

function buildPlanetFilters(filters: PlanetFilters): { where: string; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.search) {
    conditions.push('(p.name LIKE ? OR p.org_name LIKE ?)');
    const term = `%${filters.search}%`;
    params.push(term, term);
  }
  if (filters.system_id) {
    conditions.push('p.system_id = ?');
    params.push(filters.system_id);
  }
  if (filters.biome) {
    conditions.push('p.biome = ?');
    params.push(filters.biome);
  }
  if (filters.weather) {
    conditions.push('p.weather LIKE ?');
    params.push(`%${filters.weather}%`);
  }
  if (filters.sentinels) {
    conditions.push('p.sentinels = ?');
    params.push(filters.sentinels);
  }
  if (filters.terrain) {
    conditions.push('p.terrain = ?');
    params.push(filters.terrain);
  }
  if (filters.flora_abundance) {
    conditions.push('p.flora_abundance = ?');
    params.push(filters.flora_abundance);
  }
  if (filters.fauna_abundance) {
    conditions.push('p.fauna_abundance = ?');
    params.push(filters.fauna_abundance);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { where, params };
}

router.get('/', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const filters: PlanetFilters = {
      search: req.query.search,
      system_id: req.query.system_id ? parseInt(req.query.system_id) : undefined,
      biome: req.query.biome,
      weather: req.query.weather,
      sentinels: req.query.sentinels,
      terrain: req.query.terrain,
      flora_abundance: req.query.flora_abundance,
      fauna_abundance: req.query.fauna_abundance,
    };

    const { where, params } = buildPlanetFilters(filters);

    const countResult = db.prepare(`SELECT COUNT(*) as total FROM planets p ${where}`).get(...params) as { total: number };
    const planets = db.prepare(`
      SELECT p.*, s.name as system_name, s.galaxy, s.region
      FROM planets p
      LEFT JOIN systems s ON p.system_id = s.id
      ${where}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset);

    res.json({
      data: planets,
      pagination: {
        page,
        limit,
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching planets:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/filters', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const biomes = db.prepare("SELECT DISTINCT biome FROM planets WHERE biome != '' ORDER BY biome").all();
    const terrains = db.prepare("SELECT DISTINCT terrain FROM planets WHERE terrain != '' ORDER BY terrain").all();
    const sentinels = db.prepare("SELECT DISTINCT sentinels FROM planets WHERE sentinels != '' ORDER BY sentinels").all();

    res.json({
      biomes: biomes.map((b: any) => b.biome),
      terrains: terrains.map((t: any) => t.terrain),
      sentinels: sentinels.map((s: any) => s.sentinels),
    });
  } catch (error) {
    console.error('Error fetching planet filters:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:id', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const planet = db.prepare(`
      SELECT p.*, s.name as system_name, s.galaxy, s.region, s.glyphs as system_glyphs
      FROM planets p
      LEFT JOIN systems s ON p.system_id = s.id
      WHERE p.id = ?
    `).get(req.params.id) as Planet | undefined;

    if (!planet) {
      res.status(404).json({ error: 'Planeta no encontrado' });
      return;
    }

    const fauna = db.prepare('SELECT * FROM fauna WHERE planet_id = ? ORDER BY name').all(planet.id);
    const floraList = db.prepare('SELECT * FROM flora WHERE planet_id = ? ORDER BY name').all(planet.id);
    const minerals = db.prepare('SELECT * FROM minerals WHERE planet_id = ? ORDER BY name').all(planet.id);
    const bases = db.prepare('SELECT * FROM bases WHERE planet_id = ? ORDER BY name').all(planet.id);
    const sandworms = db.prepare('SELECT * FROM sandworms WHERE planet_id = ? ORDER BY name').all(planet.id);

    res.json({
      ...planet,
      fauna,
      flora: floraList,
      minerals,
      bases,
      sandworms,
    });
  } catch (error) {
    console.error('Error fetching planet:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', authenticateToken, validate(planetSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = req.body;

    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const result = db.prepare(`INSERT INTO planets (${columns}) VALUES (${placeholders})`).run(...values);
    const planet = db.prepare('SELECT * FROM planets WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(planet);
  } catch (error) {
    console.error('Error creating planet:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:id', authenticateToken, authorizeEdit('planets'), validate(planetSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const existing = db.prepare('SELECT id FROM planets WHERE id = ?').get(req.params.id);

    if (!existing) {
      res.status(404).json({ error: 'Planeta no encontrado' });
      return;
    }

    const data = req.body;
    data.updated_at = new Date().toISOString();

    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), req.params.id];

    db.prepare(`UPDATE planets SET ${setClause} WHERE id = ?`).run(...values);
    const planet = db.prepare('SELECT * FROM planets WHERE id = ?').get(req.params.id);

    res.json(planet);
  } catch (error) {
    console.error('Error updating planet:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:id', authenticateToken, authorizeDelete('planets'), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const existing = db.prepare('SELECT id FROM planets WHERE id = ?').get(req.params.id);

    if (!existing) {
      res.status(404).json({ error: 'Planeta no encontrado' });
      return;
    }

    db.prepare('DELETE FROM planets WHERE id = ?').run(req.params.id);
    res.json({ message: 'Planeta eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting planet:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
