import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { systemsApi, planetsApi, basesApi, faunaApi, floraApi, mineralsApi, starshipsApi, settlementsApi, multitoolsApi, derelictsApi, sandwormsApi, racetracksApi, generateApi } from '../api/client';
import { toast } from 'react-hot-toast';
import { PenLine, Code2, Copy, Download, RotateCcw, Upload, ArrowLeft } from 'lucide-react';
import SelectField from '../components/inputs/SelectField';
import TextField from '../components/inputs/TextField';
import TextareaField from '../components/inputs/TextareaField';
import GlyphInput from '../components/inputs/GlyphInput';
import AutocompleteField from '../components/inputs/AutocompleteField';
import {
  PLATFORMS, GAME_MODES, FACTIONS, ECONOMIES, CONFLICTS,
  BIOMES, TERRAIN_TYPES, SENTINELS, WEATHER_DATA, RESOURCE_NAMES,
  RARITIES, STARSHIP_TYPES, STARSHIP_CLASSES, MULTITOOL_TYPES,
  MULTITOOL_CLASSES, FAUNA_DIETS, FAUNA_BEHAVIOURS, FAUNA_GENDERS_DEFAULT,
  FAUNA_ECOSYSTEMS, FAUNA_GENUS,
  FLORA_AGE_KEYS, FLORA_ROOTS, FLORA_NUTRIENTS, FLORA_PRODUCES,
  MINERAL_FORMATION_KEYS, MINERAL_METAL_CONTENT,
  SETTLEMENT_PRODUCTIONS, DERELICT_ENEMIES, DERELICT_LOOT,
  BASE_TYPES, STELLAR_CLASSES, STAR_COLORS, FIELD_TOOLTIPS,
} from '../data/datalists';

// ============================================================
// ENTITY CONFIG
// ============================================================
const entityTypes = [
  { value: 'system', label: 'Sistema', icon: '⭐' },
  { value: 'planet', label: 'Planeta', icon: '🌍' },
  { value: 'base', label: 'Base', icon: '🏠' },
  { value: 'fauna', label: 'Fauna', icon: '🐾' },
  { value: 'flora', label: 'Flora', icon: '🌿' },
  { value: 'mineral', label: 'Mineral', icon: '💎' },
  { value: 'starship', label: 'Nave', icon: '🚀' },
  { value: 'settlement', label: 'Asentamiento', icon: '🏘️' },
  { value: 'multitool', label: 'Multitool', icon: '🔧' },
  { value: 'derelict', label: 'Derelicto', icon: '👻' },
  { value: 'sandworm', label: 'Sandworm', icon: '🐛' },
  { value: 'racetrack', label: 'Pista', icon: '🏁' },
];

const fieldLabels: Record<string, string> = {
  name: 'Nombre', org_name: 'Nombre Original', galaxy: 'Galaxia', region: 'Region',
  glyphs: 'Glifos', stellar_class: 'Clase Estelar', color: 'Color', distance: 'Distancia',
  faction: 'Faccion', economy: 'Economia', conflict: 'Conflicto', water: 'Agua',
  dissonant: 'Disonante', planet_count: 'Num. Planetas', moon_count: 'Num. Lunas',
  platform: 'Plataforma', mode: 'Modo', discovered_by: 'Descubierto por', doc_by: 'Documentado por',
  disc_date: 'Fecha Descubrimiento', doc_date: 'Fecha Documentacion', additional_info: 'Info Adicional',
  system_id: 'Sistema (ID)', planet_id: 'Planeta (ID)', biome: 'Bioma', terrain: 'Terreno',
  atmosphere: 'Atmosfera', weather: 'Clima', sentinels: 'Sentinelas', resource1: 'Recurso 1',
  resource2: 'Recurso 2', flora_abundance: 'Abundancia Flora', fauna_abundance: 'Abundancia Fauna',
  fauna_count: 'Conteo Fauna', type: 'Tipo', axes: 'Ejes', farm: 'Granja', geobay: 'Geobay',
  landingpad: 'Landing Pad', terminal: 'Terminal', arena: 'Arena', racetrack: 'Pista Carreras',
  layout: 'Distribucion', features: 'Caracteristicas', is_featured: 'Destacada',
  genus: 'Genero', gender: 'Genero (Alt)', diet: 'Dieta', behaviour: 'Comportamiento',
  height: 'Altura', weight: 'Peso', rarity: 'Rareza', ecosystem: 'Ecosistema', notes: 'Notas',
  age: 'Edad', roots: 'Raices', nutrients: 'Nutrientes', produces: 'Produce',
  formation: 'Formacion', metal_content: 'Contenido Metal', class: 'Clase', slots: 'Slots',
  cost: 'Coste', damage_potential: 'Dano Potencial', maneuverability: 'Maniobrabilidad',
  shield_bonus: 'Bonus Escudo', warp_bonus: 'Bonus Salto', pilot: 'Piloto',
  population: 'Poblacion', production: 'Produccion', damage: 'Dano', scanner: 'Escanner',
  save_location: 'Ubicacion Guardado', room_count: 'Num. Habitaciones', enemies: 'Enemigos',
  loot: 'Loot', stomach_content: 'Contenido Estomago', crystals: 'Cristales',
  horns: 'Cuernos', glowtubes: 'Tubos Brillantes', descriptors: 'Descriptor',
  research_team: 'Equipo', images: 'Imagenes',
};

const apiMap: Record<string, any> = {
  system: systemsApi, planet: planetsApi, base: basesApi, fauna: faunaApi,
  flora: floraApi, mineral: mineralsApi, starship: starshipsApi,
  settlement: settlementsApi, multitool: multitoolsApi, derelict: derelictsApi,
  sandworm: sandwormsApi, racetrack: racetracksApi,
};

const routeMap: Record<string, string> = {
  system: '/systems', planet: '/planets', base: '/bases', fauna: '/fauna',
  flora: '/flora', mineral: '/minerals', starship: '/starships',
  settlement: '/settlements', multitool: '/multitools', derelict: '/derelicts',
  sandworm: '/sandworms', racetrack: '/racetracks',
};

// ============================================================
// FIELD OPTIONS MAP
// ============================================================
const getFieldOptions = (field: string, entityType: string, dynamicFilters?: { galaxies: string[]; regions: string[] }): string[] | null => {
  const map: Record<string, string[]> = {
    galaxy: dynamicFilters?.galaxies || [],
    region: dynamicFilters?.regions || [],
    faction: FACTIONS,
    economy: ECONOMIES,
    conflict: CONFLICTS,
    water: ['Yes', 'No'],
    dissonant: ['Yes', 'No'],
    platform: PLATFORMS,
    mode: GAME_MODES,
    stellar_class: STELLAR_CLASSES,
    color: STAR_COLORS,
    biome: BIOMES,
    terrain: TERRAIN_TYPES,
    sentinels: SENTINELS,
    weather: WEATHER_DATA,
    resource1: RESOURCE_NAMES,
    resource2: RESOURCE_NAMES,
    flora_abundance: RARITIES,
    fauna_abundance: RARITIES,
    type: entityType === 'base' ? BASE_TYPES :
          entityType === 'starship' ? STARSHIP_TYPES :
          entityType === 'multitool' ? MULTITOOL_TYPES : [],
    class: entityType === 'starship' ? STARSHIP_CLASSES :
           entityType === 'multitool' ? MULTITOOL_CLASSES : [],
    farm: ['Yes', 'No'],
    geobay: ['Yes', 'No'],
    landingpad: ['Yes', 'No'],
    terminal: ['Yes', 'No'],
    arena: ['Yes', 'No'],
    racetrack: ['Yes', 'No'],
    is_featured: ['Yes', 'No'],
    genus: FAUNA_GENUS,
    gender: FAUNA_GENDERS_DEFAULT,
    diet: FAUNA_DIETS,
    behaviour: FAUNA_BEHAVIOURS,
    ecosystem: FAUNA_ECOSYSTEMS,
    rarity: RARITIES,
    age: FLORA_AGE_KEYS,
    roots: FLORA_ROOTS,
    nutrients: FLORA_NUTRIENTS,
    produces: FLORA_PRODUCES,
    formation: MINERAL_FORMATION_KEYS,
    metal_content: MINERAL_METAL_CONTENT,
    production: SETTLEMENT_PRODUCTIONS,
    enemies: DERELICT_ENEMIES,
    loot: DERELICT_LOOT,
  };
  return map[field] || null;
};

const isMultiLineField = (field: string) =>
  ['additional_info', 'layout', 'notes', 'features'].includes(field);

const isNumberField = (field: string) =>
  ['planet_count', 'moon_count', 'fauna_count', 'system_id', 'planet_id',
   'slots', 'cost', 'damage_potential', 'maneuverability', 'shield_bonus',
   'warp_bonus', 'damage', 'scanner', 'room_count', 'population',
   'height', 'weight', 'distance'].includes(field);

const isDateField = (field: string) =>
  ['disc_date', 'doc_date'].includes(field);

const isGlyphField = (field: string) =>
  ['glyphs'].includes(field);

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function CreateDiscovery() {
  const { type: urlType } = useParams();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;
  const navigate = useNavigate();
  const [entityType, setEntityType] = useState(urlType || 'system');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [wikiCode, setWikiCode] = useState('');
  const [generating, setGenerating] = useState(false);
  const [filters, setFilters] = useState<{ galaxies: string[]; regions: string[] }>({ galaxies: [], regions: [] });

  const currentEntity = entityTypes.find(e => e.value === entityType);

  // Load filters (galaxies, regions) for autocomplete
  useEffect(() => {
    systemsApi.filters().then((data: any) => {
      setFilters({
        galaxies: data.galaxies || [],
        regions: data.regions || [],
      });
    }).catch(() => {});
  }, []);

  // Load existing data for edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      setLoadingData(true);
      apiMap[entityType].get(Number(editId))
        .then((data: any) => {
          const filled: Record<string, string> = {};
          for (const field of getFieldsForEntity(entityType)) {
            filled[field] = data[field] !== null && data[field] !== undefined ? String(data[field]) : '';
          }
          setFormData(filled);
        })
        .catch((err: any) => toast.error(err.message))
        .finally(() => setLoadingData(false));
    }
  }, [isEditMode, editId, entityType]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data: Record<string, any> = {};
      for (const [key, value] of Object.entries(formData)) {
        if (key.endsWith('_id') && value) {
          data[key] = parseInt(value);
        } else if (['planet_count', 'moon_count', 'fauna_count', 'slots',
                     'cost', 'room_count', 'population'].includes(key)) {
          data[key] = parseInt(value) || 0;
        } else if (['damage_potential', 'maneuverability', 'shield_bonus',
                     'warp_bonus', 'damage', 'scanner', 'height', 'weight',
                     'distance'].includes(key)) {
          data[key] = parseFloat(value) || 0;
        } else {
          data[key] = value || '';
        }
      }

      if (isEditMode && editId) {
        await apiMap[entityType].update(Number(editId), data);
        toast.success(`${currentEntity?.label || 'Entidad'} actualizada correctamente`);
      } else {
        const result = await apiMap[entityType].create(data);
        toast.success(`${currentEntity?.label || 'Entidad'} creada correctamente`);
        // If we just created, we can pre-fill the ID for wiki generation
        if (result?.id) {
          setFormData(prev => ({ ...prev, _createdId: String(result.id) }));
        }
      }

      navigate(routeMap[entityType] || '/');
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  // -- Wiki Generation --
  const handleGenerateWiki = useCallback(async () => {
    const id = formData['_createdId'] || editId || formData['id'];
    if (!id) {
      toast.error('Guarda primero la entidad para generar el wiki');
      return;
    }
    setGenerating(true);
    try {
      const res = await generateApi.wiki(entityType, Number(id));
      setWikiCode(res.wikiCode);
      toast.success('Código wiki generado');
    } catch (err: any) {
      toast.error(err.message || 'Error al generar wiki');
    } finally {
      setGenerating(false);
    }
  }, [entityType, formData, editId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(wikiCode);
    toast.success('Copiado al portapapeles');
  };

  const handleDownload = () => {
    const blob = new Blob([wikiCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wiki_${entityType}_${editId || 'new'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Archivo descargado');
  };

  const handleReset = () => {
    setFormData({});
    setWikiCode('');
    toast.success('Formulario reiniciado');
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-8 h-8"
          style={{
            border: '2px solid var(--line)',
            borderTop: '2px solid var(--red)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      </div>
    );
  }

  const fields = getFieldsForEntity(entityType);
  const savedId = formData['_createdId'] || editId || formData['id'];

  return (
    <div className="h-full flex flex-col">
      {/* Tool Name Bar */}
      <div
        className="flex items-center px-6 py-2"
        style={{
          background: 'var(--panel)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="mr-3 p-1 rounded transition-colors"
          style={{ color: 'var(--grey)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--red)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--grey)')}
        >
          <ArrowLeft size={16} />
        </button>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--grey)',
          }}
        >
          {currentEntity?.label || 'Entidad'} Registration Tool
        </span>
        <span className="ml-auto flex items-center gap-3">
          <SelectField
            label=""
            value={entityType}
            onChange={(v) => { setEntityType(v); setFormData({}); setWikiCode(''); }}
            options={entityTypes.map(e => e.value)}
            disabled={isEditMode}
          />
        </span>
      </div>

      {/* Main Content */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 grid grid-cols-1 lg:grid-cols-[2fr_1.6fr] gap-6 p-6 overflow-y-auto"
        style={{ background: 'var(--bg)' }}
      >
        {/* ===== LEFT COLUMN – INPUT ===== */}
        <div
          className="flex flex-col"
          style={{ minHeight: 0 }}
        >
          <div
            className="flex-1"
            style={{
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              borderLeft: '2px solid var(--red)',
              padding: '1.25rem',
            }}
          >
            {/* Column header */}
            <div className="flex items-center gap-2 mb-4">
              <PenLine size={16} style={{ color: 'var(--red)' }} />
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--red)',
                }}
              >
                INPUT
              </span>
            </div>
            <div
              className="mb-4"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.18em',
                color: 'var(--grey)',
              }}
            >
              Introduce la información requerida para el registro
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              {fields.map((field) => {
                const options = getFieldOptions(field, entityType, filters);
                const tooltip = FIELD_TOOLTIPS[field] || '';
                const label = fieldLabels[field] || field;
                const val = formData[field] || '';
                const fullWidth = isMultiLineField(field) || isGlyphField(field) || field === 'axes';

                // Determine if this should be an autocomplete (for galaxy, region, etc.)
                const isAutocomplete = ['galaxy', 'region', 'economy', 'faction', 'biome',
                  'weather', 'sentinels', 'resource1', 'resource2', 'genus', 'diet',
                  'behaviour', 'formation', 'age', 'roots', 'nutrients', 'produces',
                  'type', 'production', 'enemies', 'loot'].includes(field);

                if (isGlyphField(field)) {
                  return (
                    <div key={field} className={fullWidth ? 'md:col-span-2' : ''}>
                      <GlyphInput
                        label={label}
                        value={val}
                        onChange={(v) => handleChange(field, v)}
                        tooltip={tooltip}
                      />
                    </div>
                  );
                }

                if (isMultiLineField(field)) {
                  return (
                    <div key={field} className="md:col-span-2">
                      <TextareaField
                        label={label}
                        value={val}
                        onChange={(v) => handleChange(field, v)}
                        tooltip={tooltip}
                        placeholder={label}
                        rows={3}
                      />
                    </div>
                  );
                }

                if (isDateField(field)) {
                  return (
                    <div key={field}>
                      <TextField
                        label={label}
                        value={val}
                        onChange={(v) => handleChange(field, v)}
                        tooltip={tooltip}
                        type="date"
                      />
                    </div>
                  );
                }

                if (options && options.length > 0) {
                  if (isAutocomplete && options.length > 15) {
                    return (
                      <div key={field}>
                        <AutocompleteField
                          label={label}
                          value={val}
                          onChange={(v) => handleChange(field, v)}
                          options={options}
                          tooltip={tooltip}
                          placeholder={label}
                        />
                      </div>
                    );
                  }
                  return (
                    <div key={field}>
                      <SelectField
                        label={label}
                        value={val}
                        onChange={(v) => handleChange(field, v)}
                        options={options}
                        tooltip={tooltip}
                        placeholder={`Seleccionar ${label.toLowerCase()}...`}
                      />
                    </div>
                  );
                }

                // Default text/number input
                return (
                  <div key={field}>
                    <TextField
                      label={label}
                      value={val}
                      onChange={(v) => handleChange(field, v)}
                      tooltip={tooltip}
                      type={isNumberField(field) ? 'number' : 'text'}
                      placeholder={label}
                    />
                  </div>
                );
              })}
            </div>

            {/* Submit button inside left column */}
            <div className="flex gap-3 pt-6 mt-4" style={{ borderTop: '1px solid var(--line)' }}>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN – OUTPUT ===== */}
        <div
          className="flex flex-col"
          style={{ minHeight: 0 }}
        >
          <div
            className="flex-1 flex flex-col"
            style={{
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              borderLeft: '2px solid var(--red)',
              padding: '1.25rem',
            }}
          >
            {/* Column header */}
            <div className="flex items-center gap-2 mb-4">
              <Code2 size={16} style={{ color: 'var(--red)' }} />
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--red)',
                }}
              >
                OUTPUT
              </span>
            </div>
            <div
              className="mb-4"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.18em',
                color: 'var(--grey)',
              }}
            >
              Código wiki generado
            </div>

            {/* Wiki Editor */}
            <div className="flex-1 flex flex-col min-h-0">
              <pre
                className="flex-1 overflow-y-auto font-mono text-sm p-4"
                style={{
                  background: '#000',
                  border: '1px solid var(--line)',
                  color: 'var(--white)',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '11px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {wikiCode || (
                  <span style={{ color: 'var(--grey)' }}>
                    {/* Empty state */}
                    {'// El código wiki aparecerá aquí\n// después de guardar la entidad y generar el wiki.'}
                  </span>
                )}
              </pre>
            </div>
          </div>
        </div>
      </form>

      {/* ===== BOTTOM ACTION BAR ===== */}
      <div
        className="flex items-center justify-end gap-2 px-6 py-2"
        style={{
          background: 'var(--panel)',
          borderTop: '1px solid var(--line)',
        }}
      >
        <button
          type="button"
          onClick={handleReset}
          className="btn-ghost flex items-center gap-1.5"
        >
          <RotateCcw size={14} />
          Reset
        </button>
        <button
          type="button"
          onClick={handleGenerateWiki}
          disabled={generating || !savedId}
          className="btn-primary flex items-center gap-1.5"
          style={{
            background: generating || !savedId ? 'transparent' : 'var(--red-dim)',
            borderColor: generating || !savedId ? 'var(--line)' : 'var(--red)',
            color: generating || !savedId ? 'var(--grey)' : 'var(--white)',
          }}
        >
          <Code2 size={14} />
          {generating ? 'Generando...' : 'Generate'}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!wikiCode}
          className="btn-secondary flex items-center gap-1.5"
        >
          <Copy size={14} />
          Copy
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={!wikiCode}
          className="btn-secondary flex items-center gap-1.5"
        >
          <Download size={14} />
          Download
        </button>
        <button
          type="button"
          className="btn-secondary flex items-center gap-1.5"
        >
          <Upload size={14} />
          Upload
        </button>
      </div>
    </div>
  );
}

// ============================================================
// FIELD DEFINITIONS PER ENTITY TYPE
// ============================================================
function getFieldsForEntity(type: string): string[] {
  const fieldSets: Record<string, string[]> = {
    system: ['name', 'org_name', 'galaxy', 'region', 'glyphs', 'stellar_class', 'color', 'distance', 'faction', 'economy', 'conflict', 'water', 'dissonant', 'planet_count', 'moon_count', 'platform', 'mode', 'discovered_by', 'doc_by', 'disc_date', 'doc_date', 'additional_info'],
    planet: ['system_id', 'name', 'org_name', 'biome', 'descriptors', 'terrain', 'atmosphere', 'weather', 'sentinels', 'resource1', 'resource2', 'flora_abundance', 'fauna_abundance', 'fauna_count', 'discovered_by', 'doc_by', 'disc_date', 'doc_date', 'additional_info'],
    base: ['system_id', 'planet_id', 'name', 'type', 'axes', 'glyphs', 'farm', 'geobay', 'landingpad', 'terminal', 'arena', 'racetrack', 'layout', 'features', 'discovered_by', 'doc_by', 'platform', 'mode', 'is_featured', 'additional_info'],
    fauna: ['planet_id', 'system_id', 'name', 'genus', 'gender', 'diet', 'behaviour', 'height', 'weight', 'rarity', 'ecosystem', 'notes', 'discovered_by', 'doc_by'],
    flora: ['planet_id', 'system_id', 'name', 'age', 'roots', 'nutrients', 'notes', 'produces', 'discovered_by', 'doc_by'],
    mineral: ['planet_id', 'system_id', 'name', 'formation', 'metal_content', 'notes', 'discovered_by', 'doc_by'],
    starship: ['system_id', 'name', 'type', 'class', 'slots', 'cost', 'damage_potential', 'maneuverability', 'shield_bonus', 'warp_bonus', 'pilot', 'discovered_by', 'doc_by'],
    settlement: ['system_id', 'name', 'population', 'production', 'discovered_by', 'doc_by'],
    multitool: ['system_id', 'name', 'type', 'class', 'slots', 'damage', 'scanner', 'save_location', 'discovered_by', 'doc_by'],
    derelict: ['system_id', 'name', 'room_count', 'enemies', 'loot', 'discovered_by', 'doc_by'],
    sandworm: ['planet_id', 'system_id', 'name', 'class', 'stomach_content', 'crystals', 'horns', 'glowtubes', 'discovered_by', 'doc_by'],
    racetrack: ['system_id', 'planet_id', 'name', 'discovered_by', 'doc_by'],
  };
  return fieldSets[type] || [];
}
