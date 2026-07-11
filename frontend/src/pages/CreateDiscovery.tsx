import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { systemsApi, planetsApi, basesApi, faunaApi, floraApi, mineralsApi, starshipsApi, settlementsApi, multitoolsApi, derelictsApi, sandwormsApi, racetracksApi } from '../api/client';
import { toast } from 'react-hot-toast';

const entityTypes = [
  { value: 'system', label: 'Sistema', fields: ['name', 'org_name', 'galaxy', 'region', 'glyphs', 'stellar_class', 'color', 'distance', 'faction', 'economy', 'conflict', 'water', 'dissonant', 'planet_count', 'moon_count', 'platform', 'mode', 'discovered_by', 'doc_by', 'disc_date', 'doc_date', 'additional_info'] },
  { value: 'planet', label: 'Planeta', fields: ['system_id', 'name', 'org_name', 'biome', 'terrain', 'atmosphere', 'weather', 'sentinels', 'resource1', 'resource2', 'flora_abundance', 'fauna_abundance', 'fauna_count', 'discovered_by', 'doc_by', 'disc_date', 'doc_date', 'additional_info'] },
  { value: 'base', label: 'Base', fields: ['system_id', 'planet_id', 'name', 'type', 'axes', 'glyphs', 'farm', 'geobay', 'landingpad', 'terminal', 'arena', 'racetrack', 'layout', 'features', 'discovered_by', 'doc_by', 'platform', 'mode', 'is_featured', 'additional_info'] },
  { value: 'fauna', label: 'Fauna', fields: ['planet_id', 'system_id', 'name', 'genus', 'gender', 'diet', 'behaviour', 'height', 'weight', 'rarity', 'ecosystem', 'notes', 'discovered_by', 'doc_by'] },
  { value: 'flora', label: 'Flora', fields: ['planet_id', 'system_id', 'name', 'age', 'roots', 'nutrients', 'notes', 'produces', 'discovered_by', 'doc_by'] },
  { value: 'mineral', label: 'Mineral', fields: ['planet_id', 'system_id', 'name', 'formation', 'metal_content', 'notes', 'discovered_by', 'doc_by'] },
  { value: 'starship', label: 'Nave', fields: ['system_id', 'name', 'type', 'class', 'slots', 'cost', 'damage_potential', 'maneuverability', 'shield_bonus', 'warp_bonus', 'pilot', 'discovered_by', 'doc_by'] },
  { value: 'settlement', label: 'Asentamiento', fields: ['system_id', 'name', 'population', 'production', 'discovered_by', 'doc_by'] },
  { value: 'multitool', label: 'Multitool', fields: ['system_id', 'name', 'type', 'class', 'slots', 'damage', 'scanner', 'save_location', 'discovered_by', 'doc_by'] },
  { value: 'derelict', label: 'Derelicto', fields: ['system_id', 'name', 'room_count', 'enemies', 'loot', 'discovered_by', 'doc_by'] },
  { value: 'sandworm', label: 'Sandworm', fields: ['planet_id', 'system_id', 'name', 'class', 'stomach_content', 'crystals', 'horns', 'glowtubes', 'discovered_by', 'doc_by'] },
  { value: 'racetrack', label: 'Pista', fields: ['system_id', 'planet_id', 'name', 'discovered_by', 'doc_by'] },
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
  horns: 'Cuernos', glowtubes: 'Tubos Brillantes',
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

  const currentEntity = entityTypes.find(e => e.value === entityType);

  useEffect(() => {
    if (isEditMode && editId) {
      setLoadingData(true);
      apiMap[entityType].get(Number(editId))
        .then((data: any) => {
          const filled: Record<string, string> = {};
          for (const field of currentEntity?.fields || []) {
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
        } else if (key === 'planet_count' || key === 'moon_count' || key === 'fauna_count') {
          data[key] = parseInt(value) || 0;
        } else {
          data[key] = value || '';
        }
      }

      if (isEditMode && editId) {
        await apiMap[entityType].update(Number(editId), data);
        toast.success(`${currentEntity?.label || 'Entidad'} actualizada correctamente`);
      } else {
        await apiMap[entityType].create(data);
        toast.success(`${currentEntity?.label || 'Entidad'} creada correctamente`);
      }

      navigate(routeMap[entityType] || '/');
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const isSelectField = (field: string) => {
    return ['water', 'dissonant', 'farm', 'geobay', 'landingpad', 'terminal', 'arena', 'racetrack', 'is_featured'].includes(field);
  };

  const selectOptions: Record<string, string[]> = {
    water: ['Yes', 'No'], dissonant: ['Yes', 'No'], farm: ['Yes', 'No'],
    geobay: ['Yes', 'No'], landingpad: ['Yes', 'No'], terminal: ['Yes', 'No'],
    arena: ['Yes', 'No'], racetrack: ['Yes', 'No'], is_featured: ['Yes', 'No'],
    faction: ['Gek', 'Vy\'keen', 'Korvax', 'Uncharted'],
    economy: ['Trading', 'Mining', 'Technology', 'Manufacturing', 'Power Generation', 'Shipping', 'Alchemy', 'Commercial'],
    conflict: ['Low', 'Medium', 'High', 'Destabilized', 'Unstable', 'Gentle', 'Mild', 'Fractious', 'Belligerent', 'Anarchic'],
    biome: ['Lush', 'Frozen', 'Scorched', 'Toxic', 'Irradiated', 'Barren', 'Exotic', 'Dead', 'Volcanic', 'Marsh', 'Water'],
    terrain: ['Pangean', 'Continental', 'Semi-Oceanic'],
    sentinels: ['None', 'Few', 'Low', 'Attentive', 'High', 'Aggressive', 'Hostile Patrols', 'Frenzied', 'Corrupted'],
    mode: ['Normal', 'Creative', 'Survival', 'Permadeath'],
    platform: ['PC', 'PS4', 'PS5', 'Xbox', 'Switch', 'Mac'],
  };

  if (loadingData) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{isEditMode ? `Editar ${currentEntity?.label || 'Entidad'}` : 'Crear Nuevo Descubrimiento'}</h1>

      <div className="card">
        <label className="block text-sm text-gray-400 mb-2">Tipo de Descubrimiento</label>
        <select
          value={entityType}
          onChange={(e) => { setEntityType(e.target.value); setFormData({}); }}
          disabled={isEditMode}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {entityTypes.map(e => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <h2 className="text-lg font-semibold">{currentEntity?.label || 'Entidad'}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentEntity?.fields.map(field => (
            <div key={field} className={field === 'additional_info' || field === 'layout' || field === 'notes' || field === 'features' ? 'md:col-span-2' : ''}>
              <label className="block text-sm text-gray-400 mb-1">{fieldLabels[field] || field}</label>
              {isSelectField(field) ? (
                <select
                  value={formData[field] || ''}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {(selectOptions[field] || []).map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field === 'additional_info' || field === 'layout' || field === 'notes' || field === 'features' ? (
                <textarea
                  value={formData[field] || ''}
                  onChange={(e) => handleChange(field, e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <input
                  type={['planet_count', 'moon_count', 'fauna_count', 'system_id', 'planet_id'].includes(field) ? 'number' : 'text'}
                  value={formData[field] || ''}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={fieldLabels[field] || field}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
