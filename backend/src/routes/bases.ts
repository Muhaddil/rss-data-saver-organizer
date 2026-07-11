import { Router, Response } from 'express';
import { getDatabase } from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { authorizeEdit, authorizeDelete } from '../middleware/authorize.js';
import { validate, baseSchema } from '../middleware/validate.js';
import type { Base, BaseFilters } from '../types/index.js';

const router = Router();

function buildBaseFilters(filters: BaseFilters): { where: string; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.search) {
    conditions.push('(b.name LIKE ? OR b.axes LIKE ? OR b.glyphs LIKE ?)');
    const term = `%${filters.search}%`;
    params.push(term, term, term);
  }
  if (filters.system_id) {
    conditions.push('b.system_id = ?');
    params.push(filters.system_id);
  }
  if (filters.planet_id) {
    conditions.push('b.planet_id = ?');
    params.push(filters.planet_id);
  }
  if (filters.type) {
    conditions.push('b.type = ?');
    params.push(filters.type);
  }
  if (filters.is_featured) {
    conditions.push('b.is_featured = ?');
    params.push(filters.is_featured);
  }
  if (filters.has_farm) {
    conditions.push('b.farm = ?');
    params.push(filters.has_farm);
  }
  if (filters.has_geobay) {
    conditions.push('b.geobay = ?');
    params.push(filters.has_geobay);
  }
  if (filters.has_landingpad) {
    conditions.push('b.landingpad = ?');
    params.push(filters.has_landingpad);
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

    const filters: BaseFilters = {
      search: req.query.search,
      system_id: req.query.system_id ? parseInt(req.query.system_id) : undefined,
      planet_id: req.query.planet_id ? parseInt(req.query.planet_id) : undefined,
      type: req.query.type,
      is_featured: req.query.is_featured,
      has_farm: req.query.has_farm,
      has_geobay: req.query.has_geobay,
      has_landingpad: req.query.has_landingpad,
    };

    const { where, params } = buildBaseFilters(filters);

    const countResult = db.prepare(`SELECT COUNT(*) as total FROM bases b ${where}`).get(...params) as { total: number };
    const bases = db.prepare(`
      SELECT b.*, s.name as system_name, p.name as planet_name
      FROM bases b
      LEFT JOIN systems s ON b.system_id = s.id
      LEFT JOIN planets p ON b.planet_id = p.id
      ${where}
      ORDER BY b.is_featured DESC, b.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset);

    res.json({
      data: bases,
      pagination: {
        page,
        limit,
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching bases:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/filters', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const types = db.prepare("SELECT DISTINCT type FROM bases WHERE type != '' ORDER BY type").all();

    res.json({
      types: types.map((t: any) => t.type),
    });
  } catch (error) {
    console.error('Error fetching base filters:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/featured', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const bases = db.prepare(`
      SELECT b.*, s.name as system_name, p.name as planet_name
      FROM bases b
      LEFT JOIN systems s ON b.system_id = s.id
      LEFT JOIN planets p ON b.planet_id = p.id
      WHERE b.is_featured = 'Yes'
      ORDER BY b.created_at DESC
      LIMIT 10
    `).all();

    res.json(bases);
  } catch (error) {
    console.error('Error fetching featured bases:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:id', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const base = db.prepare(`
      SELECT b.*, s.name as system_name, s.galaxy, s.region, s.glyphs as system_glyphs,
             p.name as planet_name, p.biome
      FROM bases b
      LEFT JOIN systems s ON b.system_id = s.id
      LEFT JOIN planets p ON b.planet_id = p.id
      WHERE b.id = ?
    `).get(req.params.id) as Base | undefined;

    if (!base) {
      res.status(404).json({ error: 'Base no encontrada' });
      return;
    }

    res.json(base);
  } catch (error) {
    console.error('Error fetching base:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', authenticateToken, validate(baseSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = req.body;

    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const result = db.prepare(`INSERT INTO bases (${columns}) VALUES (${placeholders})`).run(...values);
    const base = db.prepare('SELECT * FROM bases WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(base);
  } catch (error) {
    console.error('Error creating base:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:id', authenticateToken, authorizeEdit('bases'), validate(baseSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const existing = db.prepare('SELECT id FROM bases WHERE id = ?').get(req.params.id);

    if (!existing) {
      res.status(404).json({ error: 'Base no encontrada' });
      return;
    }

    const data = req.body;
    data.updated_at = new Date().toISOString();

    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), req.params.id];

    db.prepare(`UPDATE bases SET ${setClause} WHERE id = ?`).run(...values);
    const base = db.prepare('SELECT * FROM bases WHERE id = ?').get(req.params.id);

    res.json(base);
  } catch (error) {
    console.error('Error updating base:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:id', authenticateToken, authorizeDelete('bases'), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const existing = db.prepare('SELECT id FROM bases WHERE id = ?').get(req.params.id);

    if (!existing) {
      res.status(404).json({ error: 'Base no encontrada' });
      return;
    }

    db.prepare('DELETE FROM bases WHERE id = ?').run(req.params.id);
    res.json({ message: 'Base eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting base:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
