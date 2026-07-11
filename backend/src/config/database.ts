import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../data/rss.db');

let db: Database.Database;

export function getDatabase(): Database.Database {
  if (!db) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDatabase(db);
  }
  return db;
}

function initializeDatabase(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'user')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS systems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      org_name TEXT DEFAULT '',
      galaxy TEXT DEFAULT '',
      region TEXT DEFAULT '',
      region_number TEXT DEFAULT '',
      glyphs TEXT DEFAULT '',
      stellar_class TEXT DEFAULT '',
      color TEXT DEFAULT '',
      distance TEXT DEFAULT '',
      faction TEXT DEFAULT '',
      economy TEXT DEFAULT '',
      economy_sell TEXT DEFAULT '',
      economy_buy TEXT DEFAULT '',
      conflict TEXT DEFAULT '',
      water TEXT DEFAULT 'No',
      dissonant TEXT DEFAULT 'No',
      multiple_stars TEXT DEFAULT '',
      planet_count INTEGER DEFAULT 0,
      moon_count INTEGER DEFAULT 0,
      platform TEXT DEFAULT '',
      mode TEXT DEFAULT '',
      discovered_by TEXT DEFAULT '',
      discovered_link TEXT DEFAULT '',
      doc_by TEXT DEFAULT '',
      disc_date TEXT DEFAULT '',
      doc_date TEXT DEFAULT '',
      additional_info TEXT DEFAULT '',
      research_team TEXT DEFAULT '',
      images TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS planets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      system_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      org_name TEXT DEFAULT '',
      biome TEXT DEFAULT '',
      descriptors TEXT DEFAULT '',
      terrain TEXT DEFAULT '',
      atmosphere TEXT DEFAULT '',
      weather TEXT DEFAULT '',
      sentinels TEXT DEFAULT '',
      resource1 TEXT DEFAULT '',
      resource2 TEXT DEFAULT '',
      flora_abundance TEXT DEFAULT '',
      fauna_abundance TEXT DEFAULT '',
      fauna_count INTEGER DEFAULT 0,
      discovered_by TEXT DEFAULT '',
      discovered_link TEXT DEFAULT '',
      doc_by TEXT DEFAULT '',
      disc_date TEXT DEFAULT '',
      doc_date TEXT DEFAULT '',
      research_team TEXT DEFAULT '',
      additional_info TEXT DEFAULT '',
      images TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (system_id) REFERENCES systems(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      system_id INTEGER NOT NULL,
      planet_id INTEGER,
      name TEXT NOT NULL,
      type TEXT DEFAULT '',
      axes TEXT DEFAULT '',
      glyphs TEXT DEFAULT '',
      farm TEXT DEFAULT 'No',
      geobay TEXT DEFAULT 'No',
      landingpad TEXT DEFAULT 'No',
      terminal TEXT DEFAULT 'No',
      arena TEXT DEFAULT 'No',
      racetrack TEXT DEFAULT 'No',
      layout TEXT DEFAULT '',
      features TEXT DEFAULT '',
      census_player TEXT DEFAULT '',
      census_social TEXT DEFAULT '',
      census_reddit TEXT DEFAULT '',
      census_discord TEXT DEFAULT '',
      census_friend TEXT DEFAULT '',
      census_arrival TEXT DEFAULT '',
      census_show TEXT DEFAULT '',
      discovered_by TEXT DEFAULT '',
      discovered_link TEXT DEFAULT '',
      doc_by TEXT DEFAULT '',
      platform TEXT DEFAULT '',
      mode TEXT DEFAULT '',
      research_team TEXT DEFAULT '',
      additional_info TEXT DEFAULT '',
      is_featured TEXT DEFAULT 'No',
      images TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (system_id) REFERENCES systems(id) ON DELETE CASCADE,
      FOREIGN KEY (planet_id) REFERENCES planets(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS fauna (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      planet_id INTEGER NOT NULL,
      system_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      genus TEXT DEFAULT '',
      gender TEXT DEFAULT '',
      gender2 TEXT DEFAULT '',
      diet TEXT DEFAULT '',
      behaviour TEXT DEFAULT '',
      activity TEXT DEFAULT '',
      hemisphere TEXT DEFAULT '',
      rarity TEXT DEFAULT '',
      ecosystem TEXT DEFAULT '',
      height TEXT DEFAULT '',
      weight TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      discovered_by TEXT DEFAULT '',
      discovered_link TEXT DEFAULT '',
      doc_by TEXT DEFAULT '',
      images TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (planet_id) REFERENCES planets(id) ON DELETE CASCADE,
      FOREIGN KEY (system_id) REFERENCES systems(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS flora (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      planet_id INTEGER NOT NULL,
      system_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      age TEXT DEFAULT '',
      roots TEXT DEFAULT '',
      nutrients TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      produces TEXT DEFAULT '',
      discovered_by TEXT DEFAULT '',
      discovered_link TEXT DEFAULT '',
      doc_by TEXT DEFAULT '',
      images TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (planet_id) REFERENCES planets(id) ON DELETE CASCADE,
      FOREIGN KEY (system_id) REFERENCES systems(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS minerals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      planet_id INTEGER NOT NULL,
      system_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      formation TEXT DEFAULT '',
      metal_content TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      discovered_by TEXT DEFAULT '',
      discovered_link TEXT DEFAULT '',
      doc_by TEXT DEFAULT '',
      images TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (planet_id) REFERENCES planets(id) ON DELETE CASCADE,
      FOREIGN KEY (system_id) REFERENCES systems(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS starships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      system_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      type TEXT DEFAULT '',
      class TEXT DEFAULT '',
      slots TEXT DEFAULT '',
      cost TEXT DEFAULT '',
      scanner_range TEXT DEFAULT '',
      damage_potential TEXT DEFAULT '',
      maneuverability TEXT DEFAULT '',
      damage_bonus TEXT DEFAULT '',
      shield_bonus TEXT DEFAULT '',
      warp_bonus TEXT DEFAULT '',
      pilot TEXT DEFAULT '',
      save_location TEXT DEFAULT '',
      discovered_by TEXT DEFAULT '',
      discovered_link TEXT DEFAULT '',
      doc_by TEXT DEFAULT '',
      images TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (system_id) REFERENCES systems(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settlements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      system_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      population TEXT DEFAULT '',
      production TEXT DEFAULT '',
      discovered_by TEXT DEFAULT '',
      discovered_link TEXT DEFAULT '',
      doc_by TEXT DEFAULT '',
      images TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (system_id) REFERENCES systems(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS multitools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      system_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      type TEXT DEFAULT '',
      class TEXT DEFAULT '',
      slots TEXT DEFAULT '',
      damage TEXT DEFAULT '',
      scanner TEXT DEFAULT '',
      save_location TEXT DEFAULT '',
      discovered_by TEXT DEFAULT '',
      discovered_link TEXT DEFAULT '',
      doc_by TEXT DEFAULT '',
      images TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (system_id) REFERENCES systems(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS derelicts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      system_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      room_count TEXT DEFAULT '',
      enemies TEXT DEFAULT '',
      loot TEXT DEFAULT '',
      discovered_by TEXT DEFAULT '',
      discovered_link TEXT DEFAULT '',
      doc_by TEXT DEFAULT '',
      images TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (system_id) REFERENCES systems(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sandworms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      planet_id INTEGER NOT NULL,
      system_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      class TEXT DEFAULT '',
      stomach_content TEXT DEFAULT '',
      crystals TEXT DEFAULT '',
      horns TEXT DEFAULT '',
      glowtubes TEXT DEFAULT '',
      appear_on_reload TEXT DEFAULT '',
      discovered_by TEXT DEFAULT '',
      discovered_link TEXT DEFAULT '',
      doc_by TEXT DEFAULT '',
      images TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (planet_id) REFERENCES planets(id) ON DELETE CASCADE,
      FOREIGN KEY (system_id) REFERENCES systems(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS racetracks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      system_id INTEGER NOT NULL,
      planet_id INTEGER,
      name TEXT NOT NULL,
      discovered_by TEXT DEFAULT '',
      discovered_link TEXT DEFAULT '',
      doc_by TEXT DEFAULT '',
      images TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (system_id) REFERENCES systems(id) ON DELETE CASCADE,
      FOREIGN KEY (planet_id) REFERENCES planets(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      entity_id INTEGER NOT NULL,
      filename TEXT NOT NULL,
      url TEXT NOT NULL,
      is_primary TEXT DEFAULT 'No',
      description TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      category TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS entity_tags (
      entity_type TEXT NOT NULL,
      entity_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (entity_type, entity_id, tag_id),
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_systems_galaxy ON systems(galaxy);
    CREATE INDEX IF NOT EXISTS idx_systems_region ON systems(region);
    CREATE INDEX IF NOT EXISTS idx_systems_faction ON systems(faction);
    CREATE INDEX IF NOT EXISTS idx_systems_economy ON systems(economy);
    CREATE INDEX IF NOT EXISTS idx_planets_system_id ON planets(system_id);
    CREATE INDEX IF NOT EXISTS idx_planets_biome ON planets(biome);
    CREATE INDEX IF NOT EXISTS idx_bases_system_id ON bases(system_id);
    CREATE INDEX IF NOT EXISTS idx_bases_planet_id ON bases(planet_id);
    CREATE INDEX IF NOT EXISTS idx_bases_featured ON bases(is_featured);
    CREATE INDEX IF NOT EXISTS idx_fauna_planet_id ON fauna(planet_id);
    CREATE INDEX IF NOT EXISTS idx_fauna_system_id ON fauna(system_id);
    CREATE INDEX IF NOT EXISTS idx_flora_planet_id ON flora(planet_id);
    CREATE INDEX IF NOT EXISTS idx_minerals_planet_id ON minerals(planet_id);
    CREATE INDEX IF NOT EXISTS idx_starships_system_id ON starships(system_id);
    CREATE INDEX IF NOT EXISTS idx_images_entity ON images(entity_type, entity_id);
  `);
}

export function closeDatabase(): void {
  if (db) {
    db.close();
  }
}
