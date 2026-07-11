import { Router, Request, Response } from 'express';
import { getDatabase } from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { authorizeEdit, authorizeDelete } from '../middleware/authorize.js';
import { validate, systemSchema } from '../middleware/validate.js';
import type { System, SystemFilters } from '../types/index.js';

const router = Router();

function buildSystemFilters(filters: SystemFilters): { where: string; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.search) {
    conditions.push('(s.name LIKE ? OR s.org_name LIKE ? OR s.glyphs LIKE ?)');
    const term = `%${filters.search}%`;
    params.push(term, term, term);
  }
  if (filters.galaxy) {
    conditions.push('s.galaxy = ?');
    params.push(filters.galaxy);
  }
  if (filters.region) {
    conditions.push('s.region LIKE ?');
    params.push(`%${filters.region}%`);
  }
  if (filters.faction) {
    conditions.push('s.faction = ?');
    params.push(filters.faction);
  }
  if (filters.economy) {
    conditions.push('s.economy = ?');
    params.push(filters.economy);
  }
  if (filters.conflict) {
    conditions.push('s.conflict = ?');
    params.push(filters.conflict);
  }
  if (filters.water) {
    conditions.push('s.water = ?');
    params.push(filters.water);
  }
  if (filters.dissonant) {
    conditions.push('s.dissonant = ?');
    params.push(filters.dissonant);
  }
  if (filters.platform) {
    conditions.push('s.platform = ?');
    params.push(filters.platform);
  }
  if (filters.mode) {
    conditions.push('s.mode = ?');
    params.push(filters.mode);
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

    const filters: SystemFilters = {
      search: req.query.search,
      galaxy: req.query.galaxy,
      region: req.query.region,
      faction: req.query.faction,
      economy: req.query.economy,
      conflict: req.query.conflict,
      water: req.query.water,
      dissonant: req.query.dissonant,
      platform: req.query.platform,
      mode: req.query.mode,
    };

    const { where, params } = buildSystemFilters(filters);

    const countResult = db.prepare(`SELECT COUNT(*) as total FROM systems s ${where}`).get(...params) as { total: number };
    const systems = db.prepare(`SELECT * FROM systems s ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(
      ...params,
      limit,
      offset
    );

    res.json({
      data: systems,
      pagination: {
        page,
        limit,
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching systems:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/filters', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const galaxies = db.prepare("SELECT DISTINCT galaxy FROM systems WHERE galaxy != '' ORDER BY galaxy").all();
    const regions = db.prepare("SELECT DISTINCT region FROM systems WHERE region != '' ORDER BY region").all();
    const factions = db.prepare("SELECT DISTINCT faction FROM systems WHERE faction != '' ORDER BY faction").all();
    const economies = db.prepare("SELECT DISTINCT economy FROM systems WHERE economy != '' ORDER BY economy").all();
    const conflicts = db.prepare("SELECT DISTINCT conflict FROM systems WHERE conflict != '' ORDER BY conflict").all();

    res.json({
      galaxies: galaxies.map((g: any) => g.galaxy),
      regions: regions.map((r: any) => r.region),
      factions: factions.map((f: any) => f.faction),
      economies: economies.map((e: any) => e.economy),
      conflicts: conflicts.map((c: any) => c.conflict),
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:id', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const system = db.prepare('SELECT * FROM systems WHERE id = ?').get(req.params.id) as System | undefined;

    if (!system) {
      res.status(404).json({ error: 'Sistema no encontrado' });
      return;
    }

    const planets = db.prepare('SELECT * FROM planets WHERE system_id = ? ORDER BY name').all(system.id);
    const bases = db.prepare('SELECT * FROM bases WHERE system_id = ? ORDER BY name').all(system.id);
    const starships = db.prepare('SELECT * FROM starships WHERE system_id = ? ORDER BY name').all(system.id);
    const settlements = db.prepare('SELECT * FROM settlements WHERE system_id = ? ORDER BY name').all(system.id);
    const multitools = db.prepare('SELECT * FROM multitools WHERE system_id = ? ORDER BY name').all(system.id);
    const derelicts = db.prepare('SELECT * FROM derelicts WHERE system_id = ? ORDER BY name').all(system.id);
    const racetracks = db.prepare('SELECT * FROM racetracks WHERE system_id = ? ORDER BY name').all(system.id);

    res.json({
      ...system,
      planets,
      bases,
      starships,
      settlements,
      multitools,
      derelicts,
      racetracks,
    });
  } catch (error) {
    console.error('Error fetching system:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', authenticateToken, validate(systemSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = req.body;

    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);

    const result = db.prepare(`INSERT INTO systems (${columns}) VALUES (${placeholders})`).run(...values);
    const system = db.prepare('SELECT * FROM systems WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(system);
  } catch (error) {
    console.error('Error creating system:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:id', authenticateToken, authorizeEdit('systems'), validate(systemSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const existing = db.prepare('SELECT id FROM systems WHERE id = ?').get(req.params.id);

    if (!existing) {
      res.status(404).json({ error: 'Sistema no encontrado' });
      return;
    }

    const data = req.body;
    data.updated_at = new Date().toISOString();

    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), req.params.id];

    db.prepare(`UPDATE systems SET ${setClause} WHERE id = ?`).run(...values);
    const system = db.prepare('SELECT * FROM systems WHERE id = ?').get(req.params.id);

    res.json(system);
  } catch (error) {
    console.error('Error updating system:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:id', authenticateToken, authorizeDelete('systems'), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const existing = db.prepare('SELECT id FROM systems WHERE id = ?').get(req.params.id);

    if (!existing) {
      res.status(404).json({ error: 'Sistema no encontrado' });
      return;
    }

    db.prepare('DELETE FROM systems WHERE id = ?').run(req.params.id);
    res.json({ message: 'Sistema eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting system:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
