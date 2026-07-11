import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { planetsApi, generateApi } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { Globe2, Copy, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const biomeColors: Record<string, string> = {
  Lush: 'text-green-400', Frozen: 'text-blue-400', Scorched: 'text-red-400',
  Toxic: 'text-yellow-400', Irradiated: 'text-purple-400', Barren: 'text-orange-400',
  Exotic: 'text-pink-400', Dead: 'text-gray-400', Volcanic: 'text-amber-400',
  Marsh: 'text-teal-400', Water: 'text-cyan-400',
};

export default function PlanetDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [planet, setPlanet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [wikiCode, setWikiCode] = useState('');
  const [showWiki, setShowWiki] = useState(false);

  useEffect(() => {
    if (!id) return;
    planetsApi.get(Number(id)).then(setPlanet).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  }, [id]);

  const generateWiki = async () => {
    if (!id) return;
    try {
      const res = await generateApi.wiki('planet', Number(id));
      setWikiCode(res.wikiCode);
      setShowWiki(true);
    } catch (err: any) { toast.error(err.message); }
  };

  const copyWiki = () => { navigator.clipboard.writeText(wikiCode); toast.success('Copiado!'); };

  const canEdit = user?.role === 'admin' || 
    planet?.discovered_by === user?.username || 
    planet?.doc_by === user?.username;

  const handleDelete = async () => {
    if (!confirm('Estas seguro de que quieres eliminar este planeta?')) return;
    try {
      await planetsApi.delete(Number(id));
      toast.success('Planeta eliminado');
      window.location.href = '/planets';
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;
  if (!planet) return <div className="text-center py-12 text-gray-500">Planeta no encontrado</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/planets" className="text-sm text-gray-400 hover:text-gray-300">&larr; Volver</Link>
          <h1 className="text-2xl font-bold flex items-center gap-2 mt-1"><Globe2 size={24} /> {planet.name}</h1>
          {planet.org_name && <p className="text-sm text-gray-400">Nombre original: {planet.org_name}</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={generateWiki} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">Generar Wiki</button>
          {canEdit && (
            <>
              <Link to={`/create/planet?edit=${id}`} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1">
                <Edit size={14} /> Editar
              </Link>
              <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1">
                <Trash2 size={14} /> Eliminar
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Informacion del Planeta</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div><span className="text-gray-400">Sistema:</span> <Link to={`/systems/${planet.system_id}`} className="font-medium text-blue-400 hover:text-blue-300">{planet.system_name}</Link></div>
              <div><span className="text-gray-400">Bioma:</span> <span className={`font-medium ${biomeColors[planet.biome] || ''}`}>{planet.biome}</span></div>
              <div><span className="text-gray-400">Terreno:</span> <span className="font-medium">{planet.terrain}</span></div>
              <div><span className="text-gray-400">Clima:</span> <span className="font-medium">{planet.weather}</span></div>
              <div><span className="text-gray-400">Sentinelas:</span> <span className="font-medium">{planet.sentinels}</span></div>
              <div><span className="text-gray-400">Atmosfera:</span> <span className="font-medium">{planet.atmosphere}</span></div>
              <div><span className="text-gray-400">Flora:</span> <span className="font-medium">{planet.flora_abundance}</span></div>
              <div><span className="text-gray-400">Fauna:</span> <span className="font-medium">{planet.fauna_abundance}</span></div>
              <div><span className="text-gray-400">Conteo Fauna:</span> <span className="font-medium">{planet.fauna_count}</span></div>
            </div>
            {planet.additional_info && (
              <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-sm">{planet.additional_info}</div>
            )}
          </div>

          {planet.fauna?.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Fauna ({planet.fauna.length})</h2>
              <div className="space-y-2">
                {planet.fauna.map((f: any) => (
                  <div key={f.id} className="p-3 bg-gray-800/50 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-medium">{f.name}</span>
                      <span className="ml-2 text-xs text-gray-400">{f.genus} - {f.gender}</span>
                    </div>
                    <span className="text-xs text-gray-500">{f.rarity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {planet.flora?.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Flora ({planet.flora.length})</h2>
              <div className="space-y-2">
                {planet.flora.map((f: any) => (
                  <div key={f.id} className="p-3 bg-gray-800/50 rounded-lg">
                    <span className="font-medium">{f.name}</span>
                    {f.produces && <span className="ml-2 text-xs text-gray-400">Produce: {f.produces}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card text-center">
            <div className="text-4xl font-mono mb-2">{planet.system_glyphs || planet.glyphs}</div>
            <div className="text-xs text-gray-400">Glifos del sistema</div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3">Recursos</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Recurso 1</span><span>{planet.resource1 || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Recurso 2</span><span>{planet.resource2 || 'N/A'}</span></div>
            </div>
          </div>
        </div>
      </div>

      {showWiki && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Codigo Wiki</h2>
            <div className="flex gap-2">
              <button onClick={copyWiki} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm"><Copy size={14} /> Copiar</button>
              <button onClick={() => setShowWiki(false)} className="text-gray-400 hover:text-gray-300 text-sm">Cerrar</button>
            </div>
          </div>
          <pre className="bg-gray-800 p-4 rounded-lg text-xs overflow-x-auto max-h-96 overflow-y-auto">{wikiCode}</pre>
        </div>
      )}
    </div>
  );
}
