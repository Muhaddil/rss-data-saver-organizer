import type { System, Planet, Base, Fauna, Flora, Mineral, Starship, Settlement, Multitool, Derelict, Sandworm, Racetrack } from '../types/index.js';

const CIV_NAME = 'Royal Space Society';

function glyphs2Coords(glyphs: string): string {
  if (!glyphs || glyphs.length !== 12) return '';
  const X_Z_POS_SHIFT = 2049;
  const X_Z_NEG_SHIFT = 2047;
  const Y_POS_SHIFT = 129;
  const Y_NEG_SHIFT = 127;

  const x_glyphs = parseInt(glyphs.substring(9, 12), 16);
  const y_glyphs = parseInt(glyphs.substring(4, 6), 16);
  const z_glyphs = parseInt(glyphs.substring(6, 9), 16);
  const system_idx = glyphs.substring(1, 4);

  const coords_x = x_glyphs >= X_Z_POS_SHIFT ? x_glyphs - X_Z_POS_SHIFT : x_glyphs + X_Z_NEG_SHIFT;
  const coords_y = y_glyphs >= Y_POS_SHIFT ? y_glyphs - Y_POS_SHIFT : y_glyphs + Y_NEG_SHIFT;
  const coords_z = z_glyphs >= X_Z_POS_SHIFT ? z_glyphs - X_Z_POS_SHIFT : z_glyphs + X_Z_NEG_SHIFT;

  return [
    coords_x.toString(16).toUpperCase().padStart(4, '0'),
    coords_y.toString(16).toUpperCase().padStart(4, '0'),
    coords_z.toString(16).toUpperCase().padStart(4, '0'),
    system_idx.padStart(4, '0'),
  ].join(':');
}

function discoverySection(
  discDate: string,
  docDate: string,
  discovered: string,
  discoveredlink: string,
  docBy: string
): string {
  const hasDisc = !!discDate;
  const hasDoc = !!docDate;
  const hasLink = !!discoveredlink;
  const hasName = !!discovered;
  const hasDocBy = !!docBy;
  const sameDate = discDate === docDate;

  if (!hasDisc && !hasDoc) return '';

  const profile = (name: string) => `<[[User:${name}]]>`;
  const italic = (name: string) => `''${name}''`;

  if (hasDisc && !hasDoc && hasLink) {
    return `Discovered and uploaded by ${profile(discoveredlink)} on ${discDate}`;
  }
  if (hasDisc && !hasDoc && hasName) {
    return `Discovered and uploaded by ${italic(discovered)} on ${discDate}`;
  }
  if (hasDisc && hasDoc && hasName && hasDocBy && sameDate) {
    return `Discovered and uploaded by ${italic(discovered)} and explored and documented by ${italic(docBy)} on ${discDate}`;
  }
  if (hasDisc && hasDoc && hasLink && hasDocBy && !sameDate) {
    return `* Discovered and uploaded by ${profile(discoveredlink)} on ${discDate}<br />\n* Explored and documented by ${italic(docBy)} on ${docDate}`;
  }
  if (hasDisc && hasDoc && hasName && hasDocBy && !sameDate) {
    return `* Discovered and uploaded by ${italic(discovered)} on ${discDate}<br />\n* Explored and documented by ${italic(docBy)} on ${docDate}`;
  }
  if (!hasDisc && hasDoc && hasLink && hasDocBy) {
    return `Explored and documented by ${italic(docBy)} on ${docDate}`;
  }
  if (!hasDisc && hasDoc && hasName && hasDocBy) {
    return `Explored and documented by ${italic(docBy)} on ${docDate}`;
  }
  if (hasDisc && hasDoc && hasLink && !hasDocBy && sameDate) {
    return `Discovered and uploaded by ${profile(discoveredlink)} on ${discDate}`;
  }
  if (hasDisc && hasDoc && hasLink && !hasDocBy && !sameDate) {
    return `Discovered by ${profile(discoveredlink)} on ${discDate} and uploaded on ${docDate}`;
  }
  if (hasDisc && hasDoc && hasName && !hasDocBy && sameDate) {
    return `Discovered and uploaded by ${italic(discovered)} on ${discDate}`;
  }
  if (hasDisc && hasDoc && hasName && !hasDocBy && !sameDate) {
    return `Discovered by ${italic(discovered)} on ${discDate} and uploaded on ${docDate}`;
  }
  return '';
}

// ============ SYSTEM ============
export function generateWikiSystem(system: System, planets: Planet[]): string {
  const coords = glyphs2Coords(system.glyphs);
  const disc = discoverySection(system.disc_date, system.doc_date, system.discovered_by, system.discovered_link, system.doc_by);

  const planetLines = planets.map(p => {
    const res = [p.resource1, p.resource2].filter(Boolean).join(', ');
    return `|-\n| [[File:${p.images ? JSON.parse(p.images)[0] || 'nmsMisc_NotAvailable.png' : 'nmsMisc_NotAvailable.png'}|150px]] || [[${p.name}]] || [[Biome|${p.biome}]] || ${res} || ${p.weather} || ${p.sentinels} || ${p.flora_abundance} || ${p.fauna_abundance}`;
  }).join('\n');

  return `{{Version|${system.doc_date || 'Unknown'}}}
{{Royal Space Society}}
{{System infobox
| name = ${system.name}
| image = ${system.images ? JSON.parse(system.images)[0] || 'nmsMisc_NotAvailable.png' : 'nmsMisc_NotAvailable.png'}
| region = ${system.region}
| galaxy = ${system.galaxy}
| multiplestars = ${system.multiple_stars}
| coordinates = ${coords}
| color = ${system.color}
| class = ${system.stellar_class}
| distance = ${system.distance}
| planet = ${system.planet_count}
| moon = ${system.moon_count}
| water = ${system.water}
| dissonant = ${system.dissonant}
| faction = ${system.faction}
| economy = ${system.economy}
| economysell = ${system.economy_sell}
| economybuy = ${system.economy_buy}
| wealth = ${system.economy}
| conflict = ${system.conflict}
| mode = ${system.mode}
| civilized = ${CIV_NAME}
| researchteam = ${system.research_team}
| discoveredlink = ${system.discovered_link}
| discovered = ${system.discovered_by}
| release = ${system.doc_date}
}}

'''${system.name}''' is a star system.

==Summary==
'''${system.name}''' is a [[star system]] in the [[${system.region}]] [[region]].

==Alias Names==
${system.org_name ? `{{aliasc|text=Original|name=${system.org_name}}}` : ''}
{{aliasc|text=Current|name=${system.name}}

==Discovery==
${disc}

==Planets & Moons==
{{PM|${system.planet_count}|${system.moon_count}}}
{| class="article-table" style="text-align:center; width:100%; max-width:1250px"
|-
! style="width:150px" | Image
! Name
! Type
! style="min-width:10em" | Resources
! Weather
! Sentinels
! Flora
! Fauna
${planetLines}
|}

==Documented Starships==
{{CARGOShipSys|${coords}|${system.galaxy}}}

==Documented Multi-Tools==
{{CARGOMTCoord|${coords}|${system.galaxy}}}

==Location Information==
{{CoordGlyphConvert|${coords}}}

===Navigation Image===
[[File:${system.images ? JSON.parse(system.images)[0] || 'nmsMisc_NotAvailable.png' : 'nmsMisc_NotAvailable.png'}|400px]]

===System Location===
Located in the [[${system.region}]] [[region]] of [[${CIV_NAME}]] in the [[${system.galaxy}]] galaxy.

==Additional Information==
${system.additional_info || ''}
${system.doc_by && system.doc_by !== system.discovered_by ? `Documented by ${system.doc_by}` : ''}`;
}

// ============ PLANET ============
export function generateWikiPlanet(planet: Planet, system: System): string {
  const coords = glyphs2Coords(system.glyphs);
  const disc = discoverySection(planet.disc_date, planet.doc_date, planet.discovered_by, planet.discovered_link, planet.doc_by);
  const faunaNum = planet.fauna_count || 0;
  const faunaVerb = faunaNum === 1 ? 'is' : 'are';
  const resources = [planet.resource1, planet.resource2].filter(Boolean).join(', ');

  return `{{Version|${planet.doc_date || system.doc_date || 'Unknown'}}}
{{Royal Space Society}}
{{Planet infobox
| name = ${planet.name}
| image = ${planet.images ? JSON.parse(planet.images)[0] || 'nmsMisc_NotAvailable.png' : 'nmsMisc_NotAvailable.png'}
| region = ${system.region}
| galaxy = ${system.galaxy}
| system = ${system.name}
| moon =
| coordinates = ${coords}
| type = ${planet.biome}
| description = ${planet.descriptors}
| atmosphere = ${planet.atmosphere}
| terrain = ${planet.terrain}
| water = ${system.water}
| dissonant = ${system.dissonant}
| weather = ${planet.weather}
| resources = ${resources}
| sentinel = ${planet.sentinels}
| flora = ${planet.flora_abundance}
| fauna = ${planet.fauna_abundance} (${faunaNum})
| mode = ${system.mode}
| civilized = ${CIV_NAME}
| researchteam = ${planet.research_team}
| discoveredlink = ${planet.discovered_link}
| discovered = ${planet.discovered_by}
| release = ${planet.doc_date || system.doc_date}
}}

'''${planet.name}''' is a planet.

==Summary==
'''${planet.name}''' is a [[planet]] in the [[${system.name}]] star system.

==Alias Names==
${planet.org_name ? `{{aliasc|text=Original|name=${planet.org_name}}}` : ''}
{{aliasc|text=Current|name=${planet.name}}

==Discovery==
${disc}

==Planet Type==
{{Biome|${planet.biome}}} - ${planet.descriptors}

==Location==
It can be found in the [[${system.name}]] [[star system]] in the [[${system.region}]] [[region]] of [[${CIV_NAME}]], in the [[${system.galaxy}]] galaxy.

{{CoordGlyphConvert|${coords}}}

===Documented Bases===
{{CARGOBasesPlanet|${planet.name}}}

===Documented Multi-Tool Sites===
{{CARGOMTPlanetShort|planet=${planet.name}}}

==Life==
===Fauna===
* There ${faunaVerb} ${faunaNum} fauna on this planet
{| class="article-table" style="text-align:center; width:100%; max-width: 1250px"
|-
! style="width:150px" | Image
! Name
! Ecosystem
! Genus
! Height
! Weight
! Discovered by
|}

==Sentinels==
${planet.sentinels}

==Resources==
${resources}

==Additional Information==
${planet.additional_info || ''}`;
}

// ============ BASE ============
export function generateWikiBase(base: Base, system: System, planet: Planet | null): string {
  const features: string[] = [];
  if (base.farm === 'Yes') features.push('Farm');
  if (base.geobay === 'Yes') features.push('Geobay');
  if (base.landingpad === 'Yes') features.push('Landing Pad');
  if (base.terminal === 'Yes') features.push('Terminal');
  if (base.arena === 'Yes') features.push('Arena');
  if (base.racetrack === 'Yes') features.push('Racetrack');

  const disc = discoverySection('', '', base.discovered_by, base.discovered_link, base.doc_by);

  return `{{Base
| name = ${base.name}
| image = ${base.images ? JSON.parse(base.images)[0] || 'nmsMisc_NotAvailable.png' : 'nmsMisc_NotAvailable.png'}
| type = ${base.type}
| planet = ${planet?.name || ''}
| system = ${system.name}
| region = ${system.region}
| galaxy = ${system.galaxy}
| coordinates = ${base.axes || glyphs2Coords(base.glyphs || system.glyphs)}
| civilized = ${CIV_NAME}
| researchteam = ${base.research_team}
| builder = ${base.discovered_link || base.discovered_by}
| mode = ${base.mode}
| platform = ${base.platform}
}}

'''${base.name}''' is a player base.

==Summary==
'''${base.name}''' is a [[player base]] located on ${planet?.name || 'the planet'} in the [[${system.name}]] star system.

==Features==
${features.length > 0 ? features.join(', ') : 'None'}

==Layout==
${base.layout || 'No layout description'}

==Census==
${base.census_player ? `* Player: ${base.census_player}` : ''}
${base.census_social ? `* Social: ${base.census_social}` : ''}
${base.census_reddit ? `* Reddit: ${base.census_reddit}` : ''}
${base.census_discord ? `* Discord: ${base.census_discord}` : ''}
${base.census_friend ? `* Friend: ${base.census_friend}` : ''}

==Documented by==
${disc}

==Additional Information==
${base.additional_info || ''}`;
}

// ============ FAUNA ============
export function generateWikiFauna(fauna: Fauna, planet: Planet, system: System): string {
  return `{{Creature
| name = ${fauna.name}
| image = ${fauna.images ? JSON.parse(fauna.images)[0] || 'nmsMisc_NotAvailable.png' : 'nmsMisc_NotAvailable.png'}
| genus = ${fauna.genus}
| gender = ${fauna.gender}
| diet = ${fauna.diet}
| behaviour = ${fauna.behaviour}
| height = ${fauna.height}
| weight = ${fauna.weight}
| ecosystem = ${fauna.ecosystem}
| rarity = ${fauna.rarity}
| planet = ${planet.name}
| system = ${system.name}
| civilized = ${CIV_NAME}
| discoveredlink = ${fauna.discovered_link}
| discovered = ${fauna.discovered_by}
}}

'''${fauna.name}''' is a creature.

==Summary==
'''${fauna.name}''' is a [[creature]] from the [[${planet.name}]] planet in the [[${system.name}]] star system.

==Appearance==
${fauna.notes || 'No appearance notes'}

==Discovery==
${fauna.discovered_by ? `Discovered by ${fauna.discovered_link ? `[[User:${fauna.discovered_link}]]` : `''${fauna.discovered_by}''`}` : ''}

==Additional Information==
${fauna.notes || ''}`;
}

// ============ FLORA ============
export function generateWikiFlora(flora: Flora, planet: Planet, system: System): string {
  return `{{Flora
| name = ${flora.name}
| image = ${flora.images ? JSON.parse(flora.images)[0] || 'nmsMisc_NotAvailable.png' : 'nmsMisc_NotAvailable.png'}
| age = ${flora.age}
| roots = ${flora.roots}
| nutrients = ${flora.nutrients}
| planet = ${planet.name}
| system = ${system.name}
| civilized = ${CIV_NAME}
| discoveredlink = ${flora.discovered_link}
| discovered = ${flora.discovered_by}
}}

'''${flora.name}''' is a flora.

==Summary==
'''${flora.name}''' is a [[flora]] from the [[${planet.name}]] planet in the [[${system.name}]] star system.

==Discovery==
${flora.discovered_by ? `Discovered by ${flora.discovered_link ? `[[User:${flora.discovered_link}]]` : `''${flora.discovered_by}''`}` : ''}

==Additional Information==
${flora.notes || ''}`;
}

// ============ MINERAL ============
export function generateWikiMineral(mineral: Mineral, planet: Planet, system: System): string {
  return `{{Mineral
| name = ${mineral.name}
| image = ${mineral.images ? JSON.parse(mineral.images)[0] || 'nmsMisc_NotAvailable.png' : 'nmsMisc_NotAvailable.png'}
| formation = ${mineral.formation}
| metalContent = ${mineral.metal_content}
| planet = ${planet.name}
| system = ${system.name}
| civilized = ${CIV_NAME}
| discoveredlink = ${mineral.discovered_link}
| discovered = ${mineral.discovered_by}
}}

'''${mineral.name}''' is a mineral.

==Summary==
'''${mineral.name}''' is a [[mineral]] from the [[${planet.name}]] planet in the [[${system.name}]] star system.

==Discovery==
${mineral.discovered_by ? `Discovered by ${mineral.discovered_link ? `[[User:${mineral.discovered_link}]]` : `''${mineral.discovered_by}''`}` : ''}

==Additional Information==
${mineral.notes || ''}`;
}

// ============ STARSHIP ============
export function generateWikiStarship(ship: Starship, system: System): string {
  return `{{Starship
| name = ${ship.name}
| image = ${ship.images ? JSON.parse(ship.images)[0] || 'nmsMisc_NotAvailable.png' : 'nmsMisc_NotAvailable.png'}
| type = ${ship.type}
| class = ${ship.class}
| slots = ${ship.slots}
| cost = ${ship.cost}
| system = ${system.name}
| region = ${system.region}
| galaxy = ${system.galaxy}
| civilized = ${CIV_NAME}
| discoveredlink = ${ship.discovered_link}
| discovered = ${ship.discovered_by}
}}

'''${ship.name}''' is a starship.

==Summary==
'''${ship.name}''' is a [[starship]] in the [[${system.name}]] star system.

==Stats==
{| class="article-table"
|-
! Stat !! Value
|-
| Damage Potential || ${ship.damage_potential || 'N/A'}
|-
| Shield Bonus || ${ship.shield_bonus || 'N/A'}
|-
| Maneuverability || ${ship.maneuverability || 'N/A'}
|-
| Warp Bonus || ${ship.warp_bonus || 'N/A'}
|}

==Discovery==
${ship.discovered_by ? `Discovered by ${ship.discovered_link ? `[[User:${ship.discovered_link}]]` : `''${ship.discovered_by}''`}` : ''}`;
}

// ============ SETTLEMENT ============
export function generateWikiSettlement(settlement: Settlement, system: System): string {
  return `{{Settlement
| name = ${settlement.name}
| image = ${settlement.images ? JSON.parse(settlement.images)[0] || 'nmsMisc_NotAvailable.png' : 'nmsMisc_NotAvailable.png'}
| system = ${system.name}
| region = ${system.region}
| galaxy = ${system.galaxy}
| civilized = ${CIV_NAME}
| discoveredlink = ${settlement.discovered_link}
| discovered = ${settlement.discovered_by}
}}

'''${settlement.name}''' is a settlement.

==Summary==
'''${settlement.name}''' is a [[settlement]] in the [[${system.name}]] star system.

==Discovery==
${settlement.discovered_by ? `Discovered by ${settlement.discovered_link ? `[[User:${settlement.discovered_link}]]` : `''${settlement.discovered_by}''`}` : ''}`;
}

// ============ MULTITOOL ============
export function generateWikiMultitool(mt: Multitool, system: System): string {
  return `{{Multi-Tool
| name = ${mt.name}
| image = ${mt.images ? JSON.parse(mt.images)[0] || 'nmsMisc_NotAvailable.png' : 'nmsMisc_NotAvailable.png'}
| type = ${mt.type}
| class = ${mt.class}
| slots = ${mt.slots}
| damage = ${mt.damage}
| scanner = ${mt.scanner}
| system = ${system.name}
| region = ${system.region}
| galaxy = ${system.galaxy}
| civilized = ${CIV_NAME}
| discoveredlink = ${mt.discovered_link}
| discovered = ${mt.discovered_by}
}}

'''${mt.name}''' is a multi-tool.

==Summary==
'''${mt.name}''' is a [[multi-tool]] in the [[${system.name}]] star system.

==Discovery==
${mt.discovered_by ? `Discovered by ${mt.discovered_link ? `[[User:${mt.discovered_link}]]` : `''${mt.discovered_by}''`}` : ''}`;
}

// ============ DERELICT ============
export function generateWikiDerelict(derelict: Derelict, system: System): string {
  return `'''${derelict.name}''' is a derelict freighter.

==Summary==
'''${derelict.name}''' is a [[derelict freighter]] in the [[${system.name}]] star system.

==Loot==
${derelict.loot || 'No loot information'}

==Dangers==
${derelict.enemies || 'No danger information'}

==Discovery==
${derelict.discovered_by ? `Discovered by ${derelict.discovered_link ? `[[User:${derelict.discovered_link}]]` : `''${derelict.discovered_by}''`}` : ''}`;
}

// ============ SANDWORM ============
export function generateWikiSandworm(worm: Sandworm, planet: Planet, system: System): string {
  return `'''${worm.name}''' is a sandworm.

==Summary==
'''${worm.name}''' is a [[sandworm]] from the [[${planet.name}]] planet in the [[${system.name}]] star system.

==Discovery==
${worm.discovered_by ? `Discovered by ${worm.discovered_link ? `[[User:${worm.discovered_link}]]` : `''${worm.discovered_by}''`}` : ''}`;
}

// ============ RACETRACK ============
export function generateWikiRacetrack(track: Racetrack, system: System, planet: Planet | null): string {
  return `'''${track.name}''' is a racetrack.

==Summary==
'''${track.name}''' is a [[racetrack]] in the [[${system.name}]] star system${planet ? ` on [[${planet.name}]]` : ''}.

==Discovery==
${track.discovered_by ? `Discovered by ${track.discovered_link ? `[[User:${track.discovered_link}]]` : `''${track.discovered_by}''`}` : ''}`;
}
