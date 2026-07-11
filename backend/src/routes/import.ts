import { Router, Response } from 'express';
import { getDatabase } from '../config/database.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

const WIKI_API = 'https://nomanssky.fandom.com/api.php';

async function wikiFetch(params: Record<string, string>): Promise<any> {
  const url = new URL(WIKI_API);
  url.searchParams.set('action', params.action || 'query');
  url.searchParams.set('format', 'json');
  url.searchParams.set('origin', '*');
  for (const [k, v] of Object.entries(params)) {
    if (k !== 'action' && k !== 'format' && k !== 'origin') {
      url.searchParams.set(k, v);
    }
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Wiki API error: ${res.status}`);
  return res.json();
}

function parseInfobox(wikitext: string): Record<string, string> {
  const result: Record<string, string> = {};
  const infoboxTypes = ['Base infobox', 'Planet infobox', 'System infobox', 'Infobox creature', 'Infobox mineral', 'Starship infobox', 'Settlement infobox', 'Multi-Tool infobox', 'Infobox'];
  let infoboxStart = -1;
  let infoboxType = '';
  for (const type of infoboxTypes) {
    const idx = wikitext.indexOf(`{{${type}`);
    if (idx !== -1) { infoboxStart = idx; infoboxType = type; break; }
  }
  if (infoboxStart === -1) return result;
  const startIdx = infoboxStart + infoboxType.length + 3;
  let depth = 1;
  let i = startIdx;
  while (i < wikitext.length && depth > 0) {
    if (wikitext[i] === '{' && wikitext[i + 1] === '{') { depth++; i += 2; }
    else if (wikitext[i] === '}' && wikitext[i + 1] === '}') { depth--; if (depth === 0) break; i += 2; }
    else if (wikitext[i] === '|' && depth === 1) {
      let line = '';
      i++;
      while (i < wikitext.length && !(wikitext[i] === '}' && wikitext[i + 1] === '}') && !(wikitext[i] === '|' && depth === 1)) {
        line += wikitext[i];
        if (wikitext[i] === '{' && wikitext[i + 1] === '{') depth++;
        if (wikitext[i] === '}' && wikitext[i + 1] === '}') depth--;
        i++;
      }
      const eqIdx = line.indexOf('=');
      if (eqIdx !== -1) {
        const key = line.substring(0, eqIdx).trim();
        const value = line.substring(eqIdx + 1).trim();
        if (key) result[key] = value;
      }
    } else { i++; }
  }
  return result;
}

function parseSection(wikitext: string, sectionName: string): string {
  const regex = new RegExp(`==\\s*${sectionName}\\s*==\\s*\\n([\\s\\S]*?)(?=\\n==|$)`, 'i');
  const match = wikitext.match(regex);
  return match ? match[1].trim() : '';
}

function parsePlanetsTable(wikitext: string): Array<Record<string, string>> {
  const planets: Array<Record<string, string>> = [];
  const tableMatch = wikitext.match(/\{\|\s*class="article-table"[\s\S]*?\|\}/);
  if (!tableMatch) return planets;

  const tableContent = tableMatch[0];
  const rows = tableContent.split('|-');
  for (const row of rows) {
    const nameMatch = row.match(/\{\{ilink\|\s*([^}|]+)/);
    const biomeMatch = row.match(/\|\s*(?:Low Atmosphere|High Radio Source|Terraforming|Corrosive|Poisonous|Lush|Frozen|Scorched|Toxic|Irradiated|Barren|Exotic|Dead|Volcanic|Marsh|Water)[^\n]*/i);
    const weatherMatch = row.match(/(?:Clear|Reactive Rain|Peaceful|Stinging Atmosphere|Infrequent Toxic Drizzle|Occasional Acid Rain)[^\n]*/i);
    const sentinelsMatch = row.match(/(?:Threatening|Observant|Regular Patrols|Sparse|Frequent|None|Few|Low|Attentive|High|Aggressive|Hostile Patrols|Frenzied|Corrupted)[^\n]*/i);

    if (nameMatch) {
      planets.push({
        name: nameMatch[1].trim(),
        biome: biomeMatch ? biomeMatch[0].trim().split('\n')[0] : '',
        weather: weatherMatch ? weatherMatch[0].trim().split('\n')[0] : '',
        sentinels: sentinelsMatch ? sentinelsMatch[0].trim().split('\n')[0] : '',
      });
    }
  }
  return planets;
}

function cleanGlyphs(text: string): string {
  const match = text.match(/\d{12}/);
  return match ? match[0] : text.replace(/[^0-9A-F]/gi, '');
}

function findOrCreateSystem(db: any, info: Record<string, string>, username: string): number | null {
  const systemName = info.system || info.name;
  if (!systemName) return null;
  let system = db.prepare('SELECT id FROM systems WHERE name = ?').get(systemName) as { id: number } | undefined;
  if (system) return system.id;
  const glyphs = info.coordinates ? cleanGlyphs(info.coordinates) : (info.portalglyphs ? cleanGlyphs(info.portalglyphs) : '');
  const result = db.prepare(`INSERT INTO systems (name, galaxy, region, glyphs, planet_count, moon_count, multiple_stars, color, distance, faction, economy, economy_sell, economy_buy, conflict, water, dissonant, discovered_by, discovered_link, platform, mode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    systemName, info.galaxy || '', info.region || '', glyphs,
    parseInt(info.planet) || 0, parseInt(info.moon) || 0,
    info.multiplestars || '', info.color || '', info.distance || '',
    info.faction || '', info.economy || '', info.economysell || '', info.economybuy || '',
    info.conflict || '', info.water || 'No', info.dissonant || 'No',
    username, info.discovered || info.discoveredlink || '',
    info.platform || 'PC', info.mode || 'Normal'
  );
  return Number(result.lastInsertRowid);
}

function findOrCreatePlanet(db: any, name: string, systemId: number, info: Record<string, string>, username: string): number | null {
  if (!name) return null;
  let planet = db.prepare('SELECT id FROM planets WHERE name = ? AND system_id = ?').get(name, systemId) as { id: number } | undefined;
  if (planet) return planet.id;
  const result = db.prepare(`INSERT INTO planets (system_id, name, biome, weather, sentinels, discovered_by, discovered_link, doc_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    systemId, name, info.biome || '', info.weather || '', info.sentinels || '',
    username, info.discoveredlink || '', info.discoveredlink || ''
  );
  return Number(result.lastInsertRowid);
}

// Search wiki pages
router.get('/search', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const query = (req.query.q as string) || '';
    if (!query) { res.json({ results: [] }); return; }
    const data = await wikiFetch({ action: 'opensearch', search: query, limit: '15' });
    const results = (data[1] || []).map((title: string, i: number) => ({ title, url: data[3]?.[i] || '' }));
    res.json({ results });
  } catch (error) {
    console.error('Error searching wiki:', error);
    res.status(500).json({ error: 'Error al buscar en la wiki' });
  }
});

// Get wikitext of a page
router.get('/page/:pageName', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const pageName = decodeURIComponent(String(req.params.pageName));
    const data = await wikiFetch({ action: 'parse', page: pageName, prop: 'wikitext', formatversion: '2' });
    if (!data.parse) { res.status(404).json({ error: 'Pagina no encontrada' }); return; }
    res.json({ title: data.parse.title, pageId: data.parse.pageid, wikitext: data.parse.wikitext });
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Error al obtener pagina' });
  }
});

// Import a base from wiki - parses infobox AND sections
router.post('/import-base', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { wikitext } = req.body;
    const db = getDatabase();
    const info = parseInfobox(wikitext);
    const username = req.user?.username || 'Unknown';

    if (!info.name) { res.status(400).json({ error: 'No se pudo extraer el nombre del infobox' }); return; }

    const layout = parseSection(wikitext, 'Layout');
    const features = parseSection(wikitext, 'Features');
    const additionalInfo = parseSection(wikitext, 'Additional information');

    const systemId = findOrCreateSystem(db, info, username);
    const planetId = info.planet && systemId ? findOrCreatePlanet(db, info.planet, systemId, info, username) : null;
    const glyphs = info.portalglyphs ? cleanGlyphs(info.portalglyphs) : (info.coordinates ? cleanGlyphs(info.coordinates) : '');

    const result = db.prepare(`
      INSERT INTO bases (system_id, planet_id, name, type, axes, glyphs, farm, geobay, landingpad, terminal, arena, racetrack, layout, features, platform, mode, discovered_by, discovered_link, doc_by, census_player, census_social, census_discord, census_friend, census_arrival, census_show, additional_info)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      systemId, planetId, info.name, info.type || '', info.axes || '', glyphs,
      info.farm === 'Y' ? 'Yes' : 'No', info.geobay === 'Y' ? 'Yes' : 'No',
      info.landingpad || '0', info.terminal === 'Y' ? 'Yes' : 'No',
      info.arena === 'Y' ? 'Yes' : 'No', info.racetrack === 'Y' ? 'Yes' : 'No',
      layout, features,
      info.platform || 'PC', info.mode || 'Normal',
      username, info.builderlink || '', info.builderlink || '',
      info.censusplayer || '', info.censussocial || '', info.censusdiscord || '',
      info.censusfriend || '', info.censusarrival || '', info.censusshow || '',
      additionalInfo
    );

    const base = db.prepare('SELECT * FROM bases WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(base);
  } catch (error) {
    console.error('Error importing base:', error);
    res.status(500).json({ error: 'Error al importar base' });
  }
});

// Import a system from wiki - creates planets too
router.post('/import-system', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { wikitext } = req.body;
    const db = getDatabase();
    const info = parseInfobox(wikitext);
    const username = req.user?.username || 'Unknown';

    if (!info.name) { res.status(400).json({ error: 'No se pudo extraer el nombre del infobox' }); return; }

    const existing = db.prepare('SELECT id FROM systems WHERE name = ?').get(info.name) as { id: number } | undefined;
    if (existing) { res.status(409).json({ error: 'El sistema ya existe', existingId: existing.id }); return; }

    const glyphs = info.coordinates ? cleanGlyphs(info.coordinates) : '';
    const additionalInfo = parseSection(wikitext, 'Additional information');

    const result = db.prepare(`
      INSERT INTO systems (name, galaxy, region, glyphs, multiple_stars, color, distance, planet_count, moon_count, faction, economy, economy_sell, economy_buy, conflict, water, dissonant, discovered_by, discovered_link, platform, mode, additional_info)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      info.name, info.galaxy || '', info.region || '', glyphs,
      info.multiplestars || '', info.color || '', info.distance || '',
      parseInt(info.planet) || 0, parseInt(info.moon) || 0,
      info.faction || '', info.economy || '', info.economysell || '', info.economybuy || '',
      info.conflict || '', info.water || 'No', info.dissonant || 'No',
      username, info.discovered || info.discoveredlink || '',
      info.platform || 'PC', info.mode || 'Normal',
      additionalInfo
    );

    const systemId = Number(result.lastInsertRowid);

    const planetRows = parsePlanetsTable(wikitext);
    const createdPlanets = [];
    for (const p of planetRows) {
      const pid = findOrCreatePlanet(db, p.name, systemId, p, username);
      if (pid) createdPlanets.push(p.name);
    }

    const system = db.prepare('SELECT * FROM systems WHERE id = ?').get(systemId);
    res.status(201).json({ ...system as object, createdPlanets });
  } catch (error) {
    console.error('Error importing system:', error);
    res.status(500).json({ error: 'Error al importar sistema' });
  }
});

// Import a planet from wiki
router.post('/import-planet', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { wikitext } = req.body;
    const db = getDatabase();
    const info = parseInfobox(wikitext);
    const username = req.user?.username || 'Unknown';

    if (!info.name) { res.status(400).json({ error: 'No se pudo extraer el nombre del infobox' }); return; }

    const systemId = findOrCreateSystem(db, info, username);
    const result = db.prepare(`
      INSERT INTO planets (system_id, name, biome, terrain, weather, sentinels, resource1, resource2, flora_abundance, fauna_abundance, discovered_by, discovered_link, doc_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      systemId, info.name, info.type || info.biome || '', info.terrain || '',
      info.weather || '', info.sentinels || '', info.resource1 || '', info.resource2 || '',
      info.flora || '', info.fauna || '',
      username, info.discoveredlink || info.discoveredby || '', info.discoveredlink || info.discoveredby || ''
    );

    const planet = db.prepare('SELECT * FROM planets WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(planet);
  } catch (error) {
    console.error('Error importing planet:', error);
    res.status(500).json({ error: 'Error al importar planeta' });
  }
});

// Bulk import systems from wiki cargoquery JSON
router.post('/bulk-systems', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { systems } = req.body;
    if (!Array.isArray(systems)) {
      res.status(400).json({ error: 'Se espera un array de sistemas' });
      return;
    }

    const db = getDatabase();
    const username = req.user?.username || 'Unknown';
    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const item of systems) {
      try {
        const s = item.title;
        if (!s || !s.Star) { errors++; continue; }

        const existing = db.prepare('SELECT id FROM systems WHERE name = ?').get(s.Star) as { id: number } | undefined;
        if (existing) { skipped++; continue; }

        const glyphs = s.Coordinates ? cleanGlyphs(s.Coordinates) : '';

        db.prepare(`
          INSERT INTO systems (name, galaxy, region, glyphs, stellar_class, color, distance, faction, economy, economy_sell, economy_buy, conflict, water, dissonant, multiple_stars, planet_count, moon_count, discovered_by, discovered_link, platform, mode)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          s.Star,
          s.Galaxy || '',
          s.Region || '',
          glyphs,
          s.Class || '',
          s.Color || '',
          s.Distance || '',
          s.Faction || '',
          s.Economy || '',
          s.Sell || '',
          s.Buy || '',
          s.Conflict || '',
          s.Water || 'No',
          s.Dissonant || 'No',
          s.MultipleStars || '',
          parseInt(s.Planets) || 0,
          parseInt(s.Moons) || 0,
          s.Discovered || username,
          s.DiscoveredLink || '',
          s.Platform || 'PC',
          s['Game Release'] || 'Normal'
        );
        imported++;
      } catch (e) {
        console.error('Error importing system:', e);
        errors++;
      }
    }

    res.json({ imported, skipped, errors, total: systems.length });
  } catch (error) {
    console.error('Error bulk importing:', error);
    res.status(500).json({ error: 'Error al importar sistemas' });
  }
});

// Bulk import bases from wiki cargoquery JSON
router.post('/bulk-bases', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { bases } = req.body;
    if (!Array.isArray(bases)) {
      res.status(400).json({ error: 'Se espera un array de bases' });
      return;
    }

    const db = getDatabase();
    const username = req.user?.username || 'Unknown';
    let imported = 0;
    let skipped = 0;
    let errors = 0;
    let systemsCreated = 0;
    let planetsCreated = 0;

    for (const item of bases) {
      try {
        const b = item.title;
        if (!b || !b.Name) { errors++; continue; }

        const existing = db.prepare('SELECT id FROM bases WHERE name = ?').get(b.Name) as { id: number } | undefined;
        if (existing) { skipped++; continue; }

        let systemId: number | null = null;
        let planetId: number | null = null;

        if (b.System) {
          systemId = findOrCreateSystem(db, { name: b.System, galaxy: b.Galaxy, region: b.Region }, username);
          systemsCreated++;
        }

        if (b.Planet && systemId) {
          planetId = findOrCreatePlanet(db, b.Planet, systemId, {}, username);
          planetsCreated++;
        }

        const glyphs = b['Portal glyphs'] ? cleanGlyphs(b['Portal glyphs']) : (b.Coordinates ? cleanGlyphs(b.Coordinates) : '');

        db.prepare(`
          INSERT INTO bases (system_id, planet_id, name, type, glyphs, farm, geobay, landingpad, terminal, arena, racetrack, mode, census_player, census_discord, census_arrival, platform, discovered_by, discovered_link, doc_by)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          systemId, planetId, b.Name,
          b.Type || '',
          glyphs,
          b.Farm || 'No', b.Geobay || 'No',
          b['Landing pad'] || 'No', b.Terminal || 'No',
          b.Arena || 'No', b.Racetrack || 'No',
          b.Mode || 'Normal',
          b.CensusPlayer || b.Builderlink || username,
          b.CensusDiscord || '',
          b.CensusArrival || '',
          b.Platform || 'PC',
          b.CensusPlayer || username,
          b.CensusDiscord || '',
          b.CensusPlayer || username
        );
        imported++;
      } catch (e) {
        console.error('Error importing base:', e);
        errors++;
      }
    }

    res.json({ imported, skipped, errors, total: bases.length, systemsCreated, planetsCreated });
  } catch (error) {
    console.error('Error bulk importing bases:', error);
    res.status(500).json({ error: 'Error al importar bases' });
  }
});

// Bulk import planets from wiki cargoquery JSON
router.post('/bulk-planets', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { planets } = req.body;
    if (!Array.isArray(planets)) {
      res.status(400).json({ error: 'Se espera un array de planetas' });
      return;
    }

    const db = getDatabase();
    const username = req.user?.username || 'Unknown';
    let imported = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    let systemsCreated = 0;

    for (const item of planets) {
      try {
        const p = item.title;
        if (!p || !p.PageName) { errors++; continue; }

        const existing = db.prepare('SELECT id, biome, weather, sentinels FROM planets WHERE name = ?').get(p.PageName) as { id: number; biome: string; weather: string; sentinels: string } | undefined;

        if (existing) {
          if (!existing.biome && p.Biome) {
            db.prepare(`
              UPDATE planets SET biome = ?, descriptors = ?, terrain = ?, atmosphere = ?, weather = ?, sentinels = ?, flora_abundance = ?, fauna_abundance = ?, fauna_count = ?, doc_date = ?, research_team = ?
              WHERE id = ?
            `).run(
              p.Biome || '', p.Description || '', p.Terrain || '', p.Atmosphere || '',
              p.Weather || '', p.Sentinels || '', p.Flora || '', p.Fauna || '',
              parseInt((p.Fauna || '').match(/\((\d+)\)/)?.[1] || '0') || 0,
              p['Game release'] || '', p.ResearchTeam || '',
              existing.id
            );
            updated++;
          } else {
            skipped++;
          }
          continue;
        }

        let systemId: number | null = null;

        if (p['Star system']) {
          const sys = db.prepare('SELECT id FROM systems WHERE name = ?').get(p['Star system']) as { id: number } | undefined;
          if (sys) {
            systemId = sys.id;
          } else {
            systemId = findOrCreateSystem(db, { name: p['Star system'], galaxy: p.Galaxy, region: p.Region }, username);
            systemsCreated++;
          }
        }

        if (!systemId) { errors++; continue; }

        const faunaCount = (p.Fauna || '').match(/\((\d+)\)/)?.[1] || '0';

        db.prepare(`
          INSERT INTO planets (system_id, name, biome, descriptors, terrain, atmosphere, weather, sentinels, flora_abundance, fauna_abundance, fauna_count, discovered_by, discovered_link, doc_by, doc_date, research_team, additional_info)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          systemId,
          p.PageName,
          p.Biome || '',
          p.Description || '',
          p.Terrain || '',
          p.Atmosphere || '',
          p.Weather || '',
          p.Sentinels || '',
          p.Flora || '',
          p.Fauna || '',
          parseInt(faunaCount) || 0,
          p.Discovered || p.DiscoveredLink || username,
          p.DiscoveredLink || '',
          p.Discovered || p.DiscoveredLink || username,
          p['Game release'] || '',
          p.ResearchTeam || '',
          ''
        );
        imported++;
      } catch (e) {
        console.error('Error importing planet:', e);
        errors++;
      }
    }

    res.json({ imported, updated, skipped, errors, total: planets.length, systemsCreated });
  } catch (error) {
    console.error('Error bulk importing planets:', error);
    res.status(500).json({ error: 'Error al importar planetas' });
  }
});

export default router;
