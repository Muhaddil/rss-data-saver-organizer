import { Router, Request, Response } from 'express';
import { getDatabase } from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { generateWikiSystem, generateWikiPlanet, generateWikiBase, generateWikiFauna, generateWikiFlora, generateWikiMineral, generateWikiStarship, generateWikiSettlement, generateWikiMultitool, generateWikiDerelict, generateWikiSandworm, generateWikiRacetrack } from '../services/wikiGenerator.js';
import type { System, Planet, Base, Fauna, Flora, Mineral, Starship, Settlement, Multitool, Derelict, Sandworm, Racetrack } from '../types/index.js';

const router = Router();

router.get('/:type/:id', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { type, id } = req.params;

    let wikiCode = '';

    switch (type) {
      case 'system': {
        const item = db.prepare('SELECT * FROM systems WHERE id = ?').get(id) as System | undefined;
        if (!item) { res.status(404).json({ error: 'Sistema no encontrado' }); return; }
        const planets = db.prepare('SELECT * FROM planets WHERE system_id = ?').all(id) as Planet[];
        wikiCode = generateWikiSystem(item, planets);
        break;
      }
      case 'planet': {
        const item = db.prepare('SELECT * FROM planets WHERE id = ?').get(id) as Planet | undefined;
        if (!item) { res.status(404).json({ error: 'Planeta no encontrado' }); return; }
        const system = db.prepare('SELECT * FROM systems WHERE id = ?').get(item.system_id) as System;
        wikiCode = generateWikiPlanet(item, system);
        break;
      }
      case 'base': {
        const item = db.prepare('SELECT * FROM bases WHERE id = ?').get(id) as Base | undefined;
        if (!item) { res.status(404).json({ error: 'Base no encontrada' }); return; }
        const system = db.prepare('SELECT * FROM systems WHERE id = ?').get(item.system_id) as System;
        const planet = item.planet_id ? db.prepare('SELECT * FROM planets WHERE id = ?').get(item.planet_id) as Planet : null;
        wikiCode = generateWikiBase(item, system, planet);
        break;
      }
      case 'fauna': {
        const item = db.prepare('SELECT * FROM fauna WHERE id = ?').get(id) as Fauna | undefined;
        if (!item) { res.status(404).json({ error: 'Fauna no encontrada' }); return; }
        const planet = db.prepare('SELECT * FROM planets WHERE id = ?').get(item.planet_id) as Planet;
        const system = db.prepare('SELECT * FROM systems WHERE id = ?').get(item.system_id) as System;
        wikiCode = generateWikiFauna(item, planet, system);
        break;
      }
      case 'flora': {
        const item = db.prepare('SELECT * FROM flora WHERE id = ?').get(id) as Flora | undefined;
        if (!item) { res.status(404).json({ error: 'Flora no encontrada' }); return; }
        const planet = db.prepare('SELECT * FROM planets WHERE id = ?').get(item.planet_id) as Planet;
        const system = db.prepare('SELECT * FROM systems WHERE id = ?').get(item.system_id) as System;
        wikiCode = generateWikiFlora(item, planet, system);
        break;
      }
      case 'mineral': {
        const item = db.prepare('SELECT * FROM minerals WHERE id = ?').get(id) as Mineral | undefined;
        if (!item) { res.status(404).json({ error: 'Mineral no encontrado' }); return; }
        const planet = db.prepare('SELECT * FROM planets WHERE id = ?').get(item.planet_id) as Planet;
        const system = db.prepare('SELECT * FROM systems WHERE id = ?').get(item.system_id) as System;
        wikiCode = generateWikiMineral(item, planet, system);
        break;
      }
      case 'starship': {
        const item = db.prepare('SELECT * FROM starships WHERE id = ?').get(id) as Starship | undefined;
        if (!item) { res.status(404).json({ error: 'Nave no encontrada' }); return; }
        const system = db.prepare('SELECT * FROM systems WHERE id = ?').get(item.system_id) as System;
        wikiCode = generateWikiStarship(item, system);
        break;
      }
      case 'settlement': {
        const item = db.prepare('SELECT * FROM settlements WHERE id = ?').get(id) as Settlement | undefined;
        if (!item) { res.status(404).json({ error: 'Asentamiento no encontrado' }); return; }
        const system = db.prepare('SELECT * FROM systems WHERE id = ?').get(item.system_id) as System;
        wikiCode = generateWikiSettlement(item, system);
        break;
      }
      case 'multitool': {
        const item = db.prepare('SELECT * FROM multitools WHERE id = ?').get(id) as Multitool | undefined;
        if (!item) { res.status(404).json({ error: 'Multitool no encontrada' }); return; }
        const system = db.prepare('SELECT * FROM systems WHERE id = ?').get(item.system_id) as System;
        wikiCode = generateWikiMultitool(item, system);
        break;
      }
      case 'derelict': {
        const item = db.prepare('SELECT * FROM derelicts WHERE id = ?').get(id) as Derelict | undefined;
        if (!item) { res.status(404).json({ error: 'Derelict no encontrado' }); return; }
        const system = db.prepare('SELECT * FROM systems WHERE id = ?').get(item.system_id) as System;
        wikiCode = generateWikiDerelict(item, system);
        break;
      }
      case 'sandworm': {
        const item = db.prepare('SELECT * FROM sandworms WHERE id = ?').get(id) as Sandworm | undefined;
        if (!item) { res.status(404).json({ error: 'Sandworm no encontrado' }); return; }
        const planet = db.prepare('SELECT * FROM planets WHERE id = ?').get(item.planet_id) as Planet;
        const system = db.prepare('SELECT * FROM systems WHERE id = ?').get(item.system_id) as System;
        wikiCode = generateWikiSandworm(item, planet, system);
        break;
      }
      case 'racetrack': {
        const item = db.prepare('SELECT * FROM racetracks WHERE id = ?').get(id) as Racetrack | undefined;
        if (!item) { res.status(404).json({ error: 'Pista no encontrada' }); return; }
        const system = db.prepare('SELECT * FROM systems WHERE id = ?').get(item.system_id) as System;
        const planet = item.planet_id ? db.prepare('SELECT * FROM planets WHERE id = ?').get(item.planet_id) as Planet : null;
        wikiCode = generateWikiRacetrack(item, system, planet);
        break;
      }
      default:
        res.status(400).json({ error: 'Tipo no válido' });
        return;
    }

    res.json({ wikiCode });
  } catch (error) {
    console.error('Error generating wiki code:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/batch', (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      res.status(400).json({ error: 'Se espera un array de items' });
      return;
    }

    const db = getDatabase();
    const results: { type: string; id: number; wikiCode: string }[] = [];

    for (const item of items) {
      const { type, id } = item;
      let wikiCode = '';

      switch (type) {
        case 'system': {
          const data = db.prepare('SELECT * FROM systems WHERE id = ?').get(id) as System;
          if (data) {
            const planets = db.prepare('SELECT * FROM planets WHERE system_id = ?').all(id) as Planet[];
            wikiCode = generateWikiSystem(data, planets);
          }
          break;
        }
        case 'planet': {
          const data = db.prepare('SELECT * FROM planets WHERE id = ?').get(id) as Planet;
          if (data) {
            const system = db.prepare('SELECT * FROM systems WHERE id = ?').get(data.system_id) as System;
            wikiCode = generateWikiPlanet(data, system);
          }
          break;
        }
        case 'base': {
          const data = db.prepare('SELECT * FROM bases WHERE id = ?').get(id) as Base;
          if (data) {
            const system = db.prepare('SELECT * FROM systems WHERE id = ?').get(data.system_id) as System;
            const planet = data.planet_id ? db.prepare('SELECT * FROM planets WHERE id = ?').get(data.planet_id) as Planet : null;
            wikiCode = generateWikiBase(data, system, planet);
          }
          break;
        }
      }

      if (wikiCode) {
        results.push({ type, id, wikiCode });
      }
    }

    res.json({ results });
  } catch (error) {
    console.error('Error generating batch wiki code:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
