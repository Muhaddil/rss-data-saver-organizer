import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { systemsApi, generateApi } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { Globe, Copy, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SystemDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [system, setSystem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [wikiCode, setWikiCode] = useState('');
  const [showWiki, setShowWiki] = useState(false);

  useEffect(() => {
    if (!id) return;
    systemsApi.get(Number(id)).then(setSystem).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  }, [id]);

  const generateWiki = async () => {
    if (!id) return;
    try {
      const res = await generateApi.wiki('system', Number(id));
      setWikiCode(res.wikiCode);
      setShowWiki(true);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const copyWiki = () => {
    navigator.clipboard.writeText(wikiCode);
    toast.success('Codigo wiki copiado!');
  };

  const canEdit = user?.role === 'admin' || 
    system?.discovered_by === user?.username || 
    system?.doc_by === user?.username;

  const handleDelete = async () => {
    if (!confirm('Estas seguro de que quieres eliminar este sistema?')) return;
    try {
      await systemsApi.delete(Number(id));
      toast.success('Sistema eliminado');
      window.location.href = '/systems';
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;
  if (!system) return <div className="text-center py-12 text-gray-500">Sistema no encontrado</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/systems" className="text-sm text-gray-400 hover:text-gray-300">&larr; Volver a Sistemas</Link>
          <h1 className="text-2xl font-bold flex items-center gap-2 mt-1"><Globe size={24} /> {system.name}</h1>
          {system.org_name && <p className="text-sm text-gray-400">Nombre original: {system.org_name}</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={generateWiki} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">Generar Wiki</button>
          {canEdit && (
            <>
              <Link to={`/create/system?edit=${id}`} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1">
                <Edit size={14} /> Editar
              </Link>
              <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1">
                <Trash2 size={14} /> Eliminar
              </button>
            </>
          )}
          <Link to={`/create/system?parent=${id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">+ Agregar Planeta</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Informacion del Sistema</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div><span className="text-gray-400">Galaxia:</span> <span className="font-medium">{system.galaxy}</span></div>
              <div><span className="text-gray-400">Region:</span> <span className="font-medium">{system.region}</span></div>
              <div><span className="text-gray-400">Glifos:</span> <span className="font-mono text-xs">{system.glyphs}</span></div>
              <div><span className="text-gray-400">Clase Estelar:</span> <span className="font-medium">{system.stellar_class}</span></div>
              <div><span className="text-gray-400">Color:</span> <span className="font-medium">{system.color}</span></div>
              <div><span className="text-gray-400">Distancia:</span> <span className="font-medium">{system.distance}</span></div>
              <div><span className="text-gray-400">Faccion:</span> <span className="font-medium">{system.faction}</span></div>
              <div><span className="text-gray-400">Economia:</span> <span className="font-medium">{system.economy}</span></div>
              <div><span className="text-gray-400">Conflicto:</span> <span className="font-medium">{system.conflict}</span></div>
              <div><span className="text-gray-400">Agua:</span> <span className={`font-medium ${system.water === 'Yes' ? 'text-blue-400' : ''}`}>{system.water}</span></div>
              <div><span className="text-gray-400">Disonante:</span> <span className={`font-medium ${system.dissonant === 'Yes' ? 'text-red-400' : ''}`}>{system.dissonant}</span></div>
              <div><span className="text-gray-400">Descubierto por:</span> <span className="font-medium">{system.discovered_by || system.doc_by}</span></div>
            </div>
            {system.additional_info && (
              <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-sm">{system.additional_info}</div>
            )}
          </div>

          {system.planets?.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Planetas ({system.planets.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {system.planets.map((p: any) => (
                  <Link key={p.id} to={`/planets/${p.id}`} className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{p.biome} - {p.terrain}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {system.bases?.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Bases ({system.bases.length})</h2>
              <div className="space-y-2">
                {system.bases.map((b: any) => (
                  <Link key={b.id} to={`/bases/${b.id}`} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                    <div>
                      <span className="font-medium">{b.name}</span>
                      {b.is_featured === 'Yes' && <span className="ml-2 text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded">Destacada</span>}
                    </div>
                    <span className="text-xs text-gray-400">{b.type}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card text-center">
            <div className="text-4xl font-mono mb-2">{system.glyphs}</div>
            <div className="text-xs text-gray-400">Glifos de portal</div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3">Estadisticas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Planetas</span><span>{system.planet_count}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Lunas</span><span>{system.moon_count}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Bases</span><span>{system.bases?.length || 0}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Naves</span><span>{system.starships?.length || 0}</span></div>
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
