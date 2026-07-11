import { Router, Response } from 'express';
import { getDatabase } from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { authorizeEdit, authorizeDelete } from '../middleware/authorize.js';
import { validate, faunaSchema, floraSchema, mineralSchema, starshipSchema, settlementSchema, multitoolSchema, derelictSchema, sandwormSchema, racetrackSchema } from '../middleware/validate.js';

const router = Router();

// ============ FAUNA ============
router.get('/fauna', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (req.query.search) {
      conditions.push('f.name LIKE ?');
      params.push(`%${req.query.search}%`);
    }
    if (req.query.planet_id) {
      conditions.push('f.planet_id = ?');
      params.push(parseInt(req.query.planet_id));
    }
    if (req.query.system_id) {
      conditions.push('f.system_id = ?');
      params.push(parseInt(req.query.system_id));
    }
    if (req.query.genus) {
      conditions.push('f.genus = ?');
      params.push(req.query.genus);
    }
    if (req.query.diet) {
      conditions.push('f.diet LIKE ?');
      params.push(`%${req.query.diet}%`);
    }
    if (req.query.rarity) {
      conditions.push('f.rarity = ?');
      params.push(req.query.rarity);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countResult = db.prepare(`SELECT COUNT(*) as total FROM fauna f ${where}`).get(...params) as { total: number };
    const items = db.prepare(`
      SELECT f.*, s.name as system_name, p.name as planet_name
      FROM fauna f
      LEFT JOIN systems s ON f.system_id = s.id
      LEFT JOIN planets p ON f.planet_id = p.id
      ${where}
      ORDER BY f.created_at DESC LIMIT ? OFFSET ?
    `).all(...params, limit, offset);

    res.json({ data: items, pagination: { page, limit, total: countResult.total, pages: Math.ceil(countResult.total / limit) } });
  } catch (error) {
    console.error('Error fetching fauna:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/fauna/:id', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const item = db.prepare(`
      SELECT f.*, s.name as system_name, p.name as planet_name, p.biome
      FROM fauna f
      LEFT JOIN systems s ON f.system_id = s.id
      LEFT JOIN planets p ON f.planet_id = p.id
      WHERE f.id = ?
    `).get(req.params.id);
    if (!item) { res.status(404).json({ error: 'Fauna no encontrada' }); return; }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/fauna', authenticateToken, validate(faunaSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = req.body;
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const result = db.prepare(`INSERT INTO fauna (${columns}) VALUES (${placeholders})`).run(...Object.values(data));
    const item = db.prepare('SELECT * FROM fauna WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/fauna/:id', authenticateToken, authorizeEdit('fauna'), validate(faunaSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = { ...req.body, updated_at: new Date().toISOString() };
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    db.prepare(`UPDATE fauna SET ${setClause} WHERE id = ?`).run(...Object.values(data), req.params.id);
    const item = db.prepare('SELECT * FROM fauna WHERE id = ?').get(req.params.id);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/fauna/:id', authenticateToken, authorizeDelete('fauna'), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    db.prepare('DELETE FROM fauna WHERE id = ?').run(req.params.id);
    res.json({ message: 'Fauna eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ============ FLORA ============
router.get('/flora', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (req.query.search) { conditions.push('fl.name LIKE ?'); params.push(`%${req.query.search}%`); }
    if (req.query.planet_id) { conditions.push('fl.planet_id = ?'); params.push(parseInt(req.query.planet_id)); }
    if (req.query.system_id) { conditions.push('fl.system_id = ?'); params.push(parseInt(req.query.system_id)); }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countResult = db.prepare(`SELECT COUNT(*) as total FROM flora fl ${where}`).get(...params) as { total: number };
    const items = db.prepare(`SELECT fl.*, s.name as system_name, p.name as planet_name FROM flora fl LEFT JOIN systems s ON fl.system_id = s.id LEFT JOIN planets p ON fl.planet_id = p.id ${where} ORDER BY fl.created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset);
    res.json({ data: items, pagination: { page, limit, total: countResult.total, pages: Math.ceil(countResult.total / limit) } });
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.get('/flora/:id', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const item = db.prepare(`SELECT fl.*, s.name as system_name, p.name as planet_name, p.biome FROM flora fl LEFT JOIN systems s ON fl.system_id = s.id LEFT JOIN planets p ON fl.planet_id = p.id WHERE fl.id = ?`).get(req.params.id);
    if (!item) { res.status(404).json({ error: 'Flora no encontrada' }); return; }
    res.json(item);
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.post('/flora', authenticateToken, validate(floraSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = req.body;
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const result = db.prepare(`INSERT INTO flora (${columns}) VALUES (${placeholders})`).run(...Object.values(data));
    res.status(201).json(db.prepare('SELECT * FROM flora WHERE id = ?').get(result.lastInsertRowid));
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.put('/flora/:id', authenticateToken, authorizeEdit('flora'), validate(floraSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = { ...req.body, updated_at: new Date().toISOString() };
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    db.prepare(`UPDATE flora SET ${setClause} WHERE id = ?`).run(...Object.values(data), req.params.id);
    res.json(db.prepare('SELECT * FROM flora WHERE id = ?').get(req.params.id));
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.delete('/flora/:id', authenticateToken, authorizeDelete('flora'), (req: AuthRequest, res: Response) => {
  try { const db = getDatabase(); db.prepare('DELETE FROM flora WHERE id = ?').run(req.params.id); res.json({ message: 'Flora eliminada' }); } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

// ============ MINERALS ============
router.get('/minerals', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (req.query.search) { conditions.push('m.name LIKE ?'); params.push(`%${req.query.search}%`); }
    if (req.query.planet_id) { conditions.push('m.planet_id = ?'); params.push(parseInt(req.query.planet_id)); }
    if (req.query.system_id) { conditions.push('m.system_id = ?'); params.push(parseInt(req.query.system_id)); }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countResult = db.prepare(`SELECT COUNT(*) as total FROM minerals m ${where}`).get(...params) as { total: number };
    const items = db.prepare(`SELECT m.*, s.name as system_name, p.name as planet_name FROM minerals m LEFT JOIN systems s ON m.system_id = s.id LEFT JOIN planets p ON m.planet_id = p.id ${where} ORDER BY m.created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset);
    res.json({ data: items, pagination: { page, limit, total: countResult.total, pages: Math.ceil(countResult.total / limit) } });
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.get('/minerals/:id', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const item = db.prepare(`SELECT m.*, s.name as system_name, p.name as planet_name, p.biome FROM minerals m LEFT JOIN systems s ON m.system_id = s.id LEFT JOIN planets p ON m.planet_id = p.id WHERE m.id = ?`).get(req.params.id);
    if (!item) { res.status(404).json({ error: 'Mineral no encontrado' }); return; }
    res.json(item);
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.post('/minerals', authenticateToken, validate(mineralSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = req.body;
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const result = db.prepare(`INSERT INTO minerals (${columns}) VALUES (${placeholders})`).run(...Object.values(data));
    res.status(201).json(db.prepare('SELECT * FROM minerals WHERE id = ?').get(result.lastInsertRowid));
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.put('/minerals/:id', authenticateToken, authorizeEdit('minerals'), validate(mineralSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = { ...req.body, updated_at: new Date().toISOString() };
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    db.prepare(`UPDATE minerals SET ${setClause} WHERE id = ?`).run(...Object.values(data), req.params.id);
    res.json(db.prepare('SELECT * FROM minerals WHERE id = ?').get(req.params.id));
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.delete('/minerals/:id', authenticateToken, authorizeDelete('minerals'), (req: AuthRequest, res: Response) => {
  try { const db = getDatabase(); db.prepare('DELETE FROM minerals WHERE id = ?').run(req.params.id); res.json({ message: 'Mineral eliminado' }); } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

// ============ STARSHIPS ============
router.get('/starships', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (req.query.search) { conditions.push('ss.name LIKE ?'); params.push(`%${req.query.search}%`); }
    if (req.query.system_id) { conditions.push('ss.system_id = ?'); params.push(parseInt(req.query.system_id)); }
    if (req.query.type) { conditions.push('ss.type = ?'); params.push(req.query.type); }
    if (req.query.class) { conditions.push('ss.class = ?'); params.push(req.query.class); }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countResult = db.prepare(`SELECT COUNT(*) as total FROM starships ss ${where}`).get(...params) as { total: number };
    const items = db.prepare(`SELECT ss.*, s.name as system_name FROM starships ss LEFT JOIN systems s ON ss.system_id = s.id ${where} ORDER BY ss.created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset);
    res.json({ data: items, pagination: { page, limit, total: countResult.total, pages: Math.ceil(countResult.total / limit) } });
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.get('/starships/:id', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const item = db.prepare(`SELECT ss.*, s.name as system_name, s.galaxy, s.region, s.glyphs as system_glyphs FROM starships ss LEFT JOIN systems s ON ss.system_id = s.id WHERE ss.id = ?`).get(req.params.id);
    if (!item) { res.status(404).json({ error: 'Nave no encontrada' }); return; }
    res.json(item);
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.post('/starships', authenticateToken, validate(starshipSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = req.body;
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const result = db.prepare(`INSERT INTO starships (${columns}) VALUES (${placeholders})`).run(...Object.values(data));
    res.status(201).json(db.prepare('SELECT * FROM starships WHERE id = ?').get(result.lastInsertRowid));
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.put('/starships/:id', authenticateToken, authorizeEdit('starships'), validate(starshipSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = { ...req.body, updated_at: new Date().toISOString() };
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    db.prepare(`UPDATE starships SET ${setClause} WHERE id = ?`).run(...Object.values(data), req.params.id);
    res.json(db.prepare('SELECT * FROM starships WHERE id = ?').get(req.params.id));
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.delete('/starships/:id', authenticateToken, authorizeDelete('starships'), (req: AuthRequest, res: Response) => {
  try { const db = getDatabase(); db.prepare('DELETE FROM starships WHERE id = ?').run(req.params.id); res.json({ message: 'Nave eliminada' }); } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

// ============ SETTLEMENTS ============
router.get('/settlements', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (req.query.search) { conditions.push('st.name LIKE ?'); params.push(`%${req.query.search}%`); }
    if (req.query.system_id) { conditions.push('st.system_id = ?'); params.push(parseInt(req.query.system_id)); }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countResult = db.prepare(`SELECT COUNT(*) as total FROM settlements st ${where}`).get(...params) as { total: number };
    const items = db.prepare(`SELECT st.*, s.name as system_name FROM settlements st LEFT JOIN systems s ON st.system_id = s.id ${where} ORDER BY st.created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset);
    res.json({ data: items, pagination: { page, limit, total: countResult.total, pages: Math.ceil(countResult.total / limit) } });
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.get('/settlements/:id', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const item = db.prepare(`SELECT st.*, s.name as system_name, s.galaxy, s.region, s.glyphs as system_glyphs FROM settlements st LEFT JOIN systems s ON st.system_id = s.id WHERE st.id = ?`).get(req.params.id);
    if (!item) { res.status(404).json({ error: 'Asentamiento no encontrado' }); return; }
    res.json(item);
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.post('/settlements', authenticateToken, validate(settlementSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = req.body;
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const result = db.prepare(`INSERT INTO settlements (${columns}) VALUES (${placeholders})`).run(...Object.values(data));
    res.status(201).json(db.prepare('SELECT * FROM settlements WHERE id = ?').get(result.lastInsertRowid));
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.put('/settlements/:id', authenticateToken, authorizeEdit('settlements'), validate(settlementSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = { ...req.body, updated_at: new Date().toISOString() };
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    db.prepare(`UPDATE settlements SET ${setClause} WHERE id = ?`).run(...Object.values(data), req.params.id);
    res.json(db.prepare('SELECT * FROM settlements WHERE id = ?').get(req.params.id));
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.delete('/settlements/:id', authenticateToken, authorizeDelete('settlements'), (req: AuthRequest, res: Response) => {
  try { const db = getDatabase(); db.prepare('DELETE FROM settlements WHERE id = ?').run(req.params.id); res.json({ message: 'Asentamiento eliminado' }); } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

// ============ MULTITOOLS ============
router.get('/multitools', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (req.query.search) { conditions.push('mt.name LIKE ?'); params.push(`%${req.query.search}%`); }
    if (req.query.system_id) { conditions.push('mt.system_id = ?'); params.push(parseInt(req.query.system_id)); }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countResult = db.prepare(`SELECT COUNT(*) as total FROM multitools mt ${where}`).get(...params) as { total: number };
    const items = db.prepare(`SELECT mt.*, s.name as system_name FROM multitools mt LEFT JOIN systems s ON mt.system_id = s.id ${where} ORDER BY mt.created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset);
    res.json({ data: items, pagination: { page, limit, total: countResult.total, pages: Math.ceil(countResult.total / limit) } });
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.get('/multitools/:id', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const item = db.prepare(`SELECT mt.*, s.name as system_name, s.galaxy, s.region FROM multitools mt LEFT JOIN systems s ON mt.system_id = s.id WHERE mt.id = ?`).get(req.params.id);
    if (!item) { res.status(404).json({ error: 'Multitool no encontrada' }); return; }
    res.json(item);
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.post('/multitools', authenticateToken, validate(multitoolSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = req.body;
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const result = db.prepare(`INSERT INTO multitools (${columns}) VALUES (${placeholders})`).run(...Object.values(data));
    res.status(201).json(db.prepare('SELECT * FROM multitools WHERE id = ?').get(result.lastInsertRowid));
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.put('/multitools/:id', authenticateToken, authorizeEdit('multitools'), validate(multitoolSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = { ...req.body, updated_at: new Date().toISOString() };
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    db.prepare(`UPDATE multitools SET ${setClause} WHERE id = ?`).run(...Object.values(data), req.params.id);
    res.json(db.prepare('SELECT * FROM multitools WHERE id = ?').get(req.params.id));
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.delete('/multitools/:id', authenticateToken, authorizeDelete('multitools'), (req: AuthRequest, res: Response) => {
  try { const db = getDatabase(); db.prepare('DELETE FROM multitools WHERE id = ?').run(req.params.id); res.json({ message: 'Multitool eliminada' }); } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

// ============ DERELICTS ============
router.get('/derelicts', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (req.query.search) { conditions.push('d.name LIKE ?'); params.push(`%${req.query.search}%`); }
    if (req.query.system_id) { conditions.push('d.system_id = ?'); params.push(parseInt(req.query.system_id)); }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countResult = db.prepare(`SELECT COUNT(*) as total FROM derelicts d ${where}`).get(...params) as { total: number };
    const items = db.prepare(`SELECT d.*, s.name as system_name FROM derelicts d LEFT JOIN systems s ON d.system_id = s.id ${where} ORDER BY d.created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset);
    res.json({ data: items, pagination: { page, limit, total: countResult.total, pages: Math.ceil(countResult.total / limit) } });
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.get('/derelicts/:id', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const item = db.prepare(`SELECT d.*, s.name as system_name, s.galaxy, s.region FROM derelicts d LEFT JOIN systems s ON d.system_id = s.id WHERE d.id = ?`).get(req.params.id);
    if (!item) { res.status(404).json({ error: 'Derelict no encontrado' }); return; }
    res.json(item);
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.post('/derelicts', authenticateToken, validate(derelictSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = req.body;
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const result = db.prepare(`INSERT INTO derelicts (${columns}) VALUES (${placeholders})`).run(...Object.values(data));
    res.status(201).json(db.prepare('SELECT * FROM derelicts WHERE id = ?').get(result.lastInsertRowid));
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.put('/derelicts/:id', authenticateToken, authorizeEdit('derelicts'), validate(derelictSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = { ...req.body, updated_at: new Date().toISOString() };
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    db.prepare(`UPDATE derelicts SET ${setClause} WHERE id = ?`).run(...Object.values(data), req.params.id);
    res.json(db.prepare('SELECT * FROM derelicts WHERE id = ?').get(req.params.id));
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.delete('/derelicts/:id', authenticateToken, authorizeDelete('derelicts'), (req: AuthRequest, res: Response) => {
  try { const db = getDatabase(); db.prepare('DELETE FROM derelicts WHERE id = ?').run(req.params.id); res.json({ message: 'Derelict eliminado' }); } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

// ============ SANDWORMS ============
router.get('/sandworms', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (req.query.search) { conditions.push('sw.name LIKE ?'); params.push(`%${req.query.search}%`); }
    if (req.query.planet_id) { conditions.push('sw.planet_id = ?'); params.push(parseInt(req.query.planet_id)); }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countResult = db.prepare(`SELECT COUNT(*) as total FROM sandworms sw ${where}`).get(...params) as { total: number };
    const items = db.prepare(`SELECT sw.*, s.name as system_name, p.name as planet_name FROM sandworms sw LEFT JOIN systems s ON sw.system_id = s.id LEFT JOIN planets p ON sw.planet_id = p.id ${where} ORDER BY sw.created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset);
    res.json({ data: items, pagination: { page, limit, total: countResult.total, pages: Math.ceil(countResult.total / limit) } });
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.get('/sandworms/:id', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const item = db.prepare(`SELECT sw.*, s.name as system_name, p.name as planet_name, p.biome FROM sandworms sw LEFT JOIN systems s ON sw.system_id = s.id LEFT JOIN planets p ON sw.planet_id = p.id WHERE sw.id = ?`).get(req.params.id);
    if (!item) { res.status(404).json({ error: 'Sandworm no encontrado' }); return; }
    res.json(item);
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.post('/sandworms', authenticateToken, validate(sandwormSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = req.body;
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const result = db.prepare(`INSERT INTO sandworms (${columns}) VALUES (${placeholders})`).run(...Object.values(data));
    res.status(201).json(db.prepare('SELECT * FROM sandworms WHERE id = ?').get(result.lastInsertRowid));
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.put('/sandworms/:id', authenticateToken, authorizeEdit('sandworms'), validate(sandwormSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = { ...req.body, updated_at: new Date().toISOString() };
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    db.prepare(`UPDATE sandworms SET ${setClause} WHERE id = ?`).run(...Object.values(data), req.params.id);
    res.json(db.prepare('SELECT * FROM sandworms WHERE id = ?').get(req.params.id));
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.delete('/sandworms/:id', authenticateToken, authorizeDelete('sandworms'), (req: AuthRequest, res: Response) => {
  try { const db = getDatabase(); db.prepare('DELETE FROM sandworms WHERE id = ?').run(req.params.id); res.json({ message: 'Sandworm eliminado' }); } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

// ============ RACETRACKS ============
router.get('/racetracks', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (req.query.search) { conditions.push('r.name LIKE ?'); params.push(`%${req.query.search}%`); }
    if (req.query.system_id) { conditions.push('r.system_id = ?'); params.push(parseInt(req.query.system_id)); }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countResult = db.prepare(`SELECT COUNT(*) as total FROM racetracks r ${where}`).get(...params) as { total: number };
    const items = db.prepare(`SELECT r.*, s.name as system_name, p.name as planet_name FROM racetracks r LEFT JOIN systems s ON r.system_id = s.id LEFT JOIN planets p ON r.planet_id = p.id ${where} ORDER BY r.created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset);
    res.json({ data: items, pagination: { page, limit, total: countResult.total, pages: Math.ceil(countResult.total / limit) } });
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.get('/racetracks/:id', (req: any, res: Response) => {
  try {
    const db = getDatabase();
    const item = db.prepare(`SELECT r.*, s.name as system_name, p.name as planet_name FROM racetracks r LEFT JOIN systems s ON r.system_id = s.id LEFT JOIN planets p ON r.planet_id = p.id WHERE r.id = ?`).get(req.params.id);
    if (!item) { res.status(404).json({ error: 'Pista no encontrada' }); return; }
    res.json(item);
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.post('/racetracks', authenticateToken, validate(racetrackSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = req.body;
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const result = db.prepare(`INSERT INTO racetracks (${columns}) VALUES (${placeholders})`).run(...Object.values(data));
    res.status(201).json(db.prepare('SELECT * FROM racetracks WHERE id = ?').get(result.lastInsertRowid));
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.put('/racetracks/:id', authenticateToken, authorizeEdit('racetracks'), validate(racetrackSchema), (req: AuthRequest, res: Response) => {
  try {
    const db = getDatabase();
    const data = { ...req.body, updated_at: new Date().toISOString() };
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    db.prepare(`UPDATE racetracks SET ${setClause} WHERE id = ?`).run(...Object.values(data), req.params.id);
    res.json(db.prepare('SELECT * FROM racetracks WHERE id = ?').get(req.params.id));
  } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

router.delete('/racetracks/:id', authenticateToken, authorizeDelete('racetracks'), (req: AuthRequest, res: Response) => {
  try { const db = getDatabase(); db.prepare('DELETE FROM racetracks WHERE id = ?').run(req.params.id); res.json({ message: 'Pista eliminada' }); } catch (error) { res.status(500).json({ error: 'Error interno del servidor' }); }
});

export default router;
