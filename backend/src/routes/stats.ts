import { Router, Request, Response } from 'express';
import { getDatabase } from '../config/database.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const db = getDatabase();

    const totalSystems = (db.prepare('SELECT COUNT(*) as count FROM systems').get() as any).count;
    const totalPlanets = (db.prepare('SELECT COUNT(*) as count FROM planets').get() as any).count;
    const totalBases = (db.prepare('SELECT COUNT(*) as count FROM bases').get() as any).count;
    const totalFauna = (db.prepare('SELECT COUNT(*) as count FROM fauna').get() as any).count;
    const totalFlora = (db.prepare('SELECT COUNT(*) as count FROM flora').get() as any).count;
    const totalMinerals = (db.prepare('SELECT COUNT(*) as count FROM minerals').get() as any).count;
    const totalStarships = (db.prepare('SELECT COUNT(*) as count FROM starships').get() as any).count;
    const totalSettlements = (db.prepare('SELECT COUNT(*) as count FROM settlements').get() as any).count;
    const totalMultitools = (db.prepare('SELECT COUNT(*) as count FROM multitools').get() as any).count;
    const totalDerelicts = (db.prepare('SELECT COUNT(*) as count FROM derelicts').get() as any).count;
    const totalSandworms = (db.prepare('SELECT COUNT(*) as count FROM sandworms').get() as any).count;
    const totalRacetracks = (db.prepare('SELECT COUNT(*) as count FROM racetracks').get() as any).count;

    const featuredBases = (db.prepare("SELECT COUNT(*) as count FROM bases WHERE is_featured = 'Yes'").get() as any).count;

    const galaxies = db.prepare("SELECT DISTINCT galaxy FROM systems WHERE galaxy != '' ORDER BY galaxy").all().map((g: any) => g.galaxy);
    const factions = db.prepare("SELECT DISTINCT faction FROM systems WHERE faction != '' ORDER BY faction").all().map((f: any) => f.faction);
    const biomes = db.prepare("SELECT DISTINCT biome FROM planets WHERE biome != '' ORDER BY biome").all().map((b: any) => b.biome);

    const recentSystems = db.prepare('SELECT id, name, galaxy, region, glyphs, created_at FROM systems ORDER BY created_at DESC LIMIT 5').all();
    const recentPlanets = db.prepare(`
      SELECT p.id, p.name, p.biome, p.created_at, s.name as system_name
      FROM planets p LEFT JOIN systems s ON p.system_id = s.id
      ORDER BY p.created_at DESC LIMIT 5
    `).all();
    const recentBases = db.prepare(`
      SELECT b.id, b.name, b.type, b.is_featured, b.created_at, s.name as system_name
      FROM bases b LEFT JOIN systems s ON b.system_id = s.id
      ORDER BY b.created_at DESC LIMIT 5
    `).all();

    const topDiscoverers = db.prepare(`
      SELECT discovered_by, COUNT(*) as count
      FROM (
        SELECT discovered_by FROM systems WHERE discovered_by != ''
        UNION ALL
        SELECT discovered_by FROM planets WHERE discovered_by != ''
        UNION ALL
        SELECT discovered_by FROM bases WHERE discovered_by != ''
      )
      GROUP BY discovered_by
      ORDER BY count DESC
      LIMIT 10
    `).all();

    res.json({
      totals: {
        systems: totalSystems,
        planets: totalPlanets,
        bases: totalBases,
        fauna: totalFauna,
        flora: totalFlora,
        minerals: totalMinerals,
        starships: totalStarships,
        settlements: totalSettlements,
        multitools: totalMultitools,
        derelicts: totalDerelicts,
        sandworms: totalSandworms,
        racetracks: totalRacetracks,
        featuredBases,
      },
      galaxies,
      factions,
      biomes,
      recent: {
        systems: recentSystems,
        planets: recentPlanets,
        bases: recentBases,
      },
      topDiscoverers,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: (error as Error).message });
  }
});

export default router;
