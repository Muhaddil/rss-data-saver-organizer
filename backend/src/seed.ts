import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { getDatabase, closeDatabase } from './config/database.js';

async function seed() {
  const db = getDatabase();

  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  try {
    db.prepare('INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?, ?, ?)').run('admin', adminPassword, 'admin');
    db.prepare('INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?, ?, ?)').run('user', userPassword, 'user');
    console.log('✅ Users created (admin/admin123, user/user123)');
  } catch (e) {
    console.log('ℹ️ Users already exist');
  }

  // Create sample system
  const systemResult = db.prepare(`
    INSERT OR IGNORE INTO systems (name, org_name, galaxy, region, region_number, glyphs, stellar_class, color, distance, faction, economy, economy_sell, economy_buy, conflict, water, dissonant, planet_count, moon_count, platform, mode, discovered_by, doc_by, disc_date, doc_date, additional_info)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'RSS-PRIME-001', 'Sistema Prime RSS', 'Euclid', 'RSS Central Hub', 'EV1',
    '1234:5678:9ABC:DEF0:0001', 'G', 'Yellow', '3,194', 'Gek',
    'Trading', '+52.3%', '-47.8%', 'Low', 'Yes', 'No',
    6, 2, 'PC', 'Normal', 'Muhaddil', '[[User:Muhaddil]]',
    '2024-01-15', '2024-01-20', 'Sistema central de la RSS'
  );

  if (systemResult.changes > 0) {
    const systemId = systemResult.lastInsertRowid;
    console.log(`✅ Sample system created (ID: ${systemId})`);

    // Create sample planets
    const planets = [
      { name: 'RSS Prime Alpha', biome: 'Lush', terrain: 'Continental', weather: 'Temperate', sentinels: 'Low', flora: 'Generous', fauna: 'Ample', fauna_count: 12 },
      { name: 'RSS Prime Beta', biome: 'Frozen', terrain: 'Pangean', weather: 'Intense Cold', sentinels: 'Regular Patrols', fauna: 'Frequent', fauna_count: 8 },
      { name: 'RSS Prime Gamma', biome: 'Toxic', terrain: 'Semi-Oceanic', weather: 'Acid Rain', sentinels: 'Hostile Patrols', fauna: 'Scarce', fauna_count: 3 },
      { name: 'RSS Prime Delta', biome: 'Exotic', terrain: 'Continental', weather: '[REDACTED]', sentinels: 'Dissonant', fauna: 'None', fauna_count: 0 },
    ];

    const planetIds: number[] = [];
    for (const p of planets) {
      const result = db.prepare(`
        INSERT INTO planets (system_id, name, biome, terrain, weather, sentinels, flora_abundance, fauna_abundance, fauna_count, discovered_by, doc_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(systemId, p.name, p.biome, p.terrain, p.weather, p.sentinels, p.flora, p.fauna, p.fauna_count, 'Muhaddil', '[[User:Muhaddil]]');
      planetIds.push(result.lastInsertRowid as number);
    }
    console.log(`✅ ${planets.length} sample planets created`);

    // Create sample bases
    db.prepare(`
      INSERT INTO bases (system_id, planet_id, name, type, axes, glyphs, farm, geobay, landingpad, terminal, is_featured, discovered_by, doc_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(systemId, planetIds[0], 'RSS Central Hub', 'Headquarters', 'X:1,Y:2,Z:3', '1234:5678:9ABC:DEF0:0001', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Muhaddil', '[[User:Muhaddil]]');

    db.prepare(`
      INSERT INTO bases (system_id, planet_id, name, type, axes, glyphs, farm, geobay, landingpad, terminal, is_featured, discovered_by, doc_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(systemId, planetIds[1], 'RSS Ice Station', 'Industrial', 'X:5,Y:6,Z:7', '1234:5678:9ABC:DEF0:0002', 'No', 'No', 'Yes', 'Yes', 'No', 'Muhaddil', '[[User:Muhaddil]]');
    console.log('✅ Sample bases created');

    // Create sample fauna
    db.prepare(`
      INSERT INTO fauna (planet_id, system_id, name, genus, gender, diet, behaviour, height, weight, rarity, ecosystem, discovered_by, doc_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(planetIds[0], systemId, 'RSS Guardian', 'Bos', 'Alpha', 'Vegetation', 'Passive', '2.1m', '180kg', 'Uncommon', 'Terrestrial', 'Muhaddil', '[[User:Muhaddil]]');
    console.log('✅ Sample fauna created');

    // Create sample starship
    db.prepare(`
      INSERT INTO starships (system_id, name, type, class, slots, cost, damage_potential, pilot, discovered_by, doc_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(systemId, 'RSS Explorer I', 'Hauler', 'S', '42', '12,500,000', 'High', 'Muhaddil', 'Muhaddil', '[[User:Muhaddil]]');
    console.log('✅ Sample starship created');
  }

  // Create tags
  const tags = [
    { name: 'RSS Member', category: 'faction' },
    { name: 'Featured Base', category: 'type' },
    { name: 'Paradise Planet', category: 'biome' },
    { name: 'Dissonant System', category: 'special' },
    { name: 'Water World', category: 'special' },
    { name: 'Extreme Weather', category: 'hazard' },
    { name: 'Aggressive Sentinels', category: 'hazard' },
  ];

  for (const tag of tags) {
    try {
      db.prepare('INSERT OR IGNORE INTO tags (name, category) VALUES (?, ?)').run(tag.name, tag.category);
    } catch {
      // Tag already exists
    }
  }
  console.log('✅ Tags created');

  console.log('\n🎉 Seed completed!');
  console.log('\n📋 Default credentials:');
  console.log('   Admin: admin / admin123');
  console.log('   User:  user / user123');

  closeDatabase();
}

seed().catch(console.error);
