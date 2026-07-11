import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { basesApi, generateApi } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { Building2, Copy, Star, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BaseDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [base, setBase] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [wikiCode, setWikiCode] = useState('');
  const [showWiki, setShowWiki] = useState(false);

  useEffect(() => {
    if (!id) return;
    basesApi.get(Number(id)).then(setBase).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  }, [id]);

  const generateWiki = async () => {
    if (!id) return;
    try { const res = await generateApi.wiki('base', Number(id)); setWikiCode(res.wikiCode); setShowWiki(true); } catch (err: any) { toast.error(err.message); }
  };

  const copyWiki = () => { navigator.clipboard.writeText(wikiCode); toast.success('Copiado!'); };

  const canEdit = user?.role === 'admin' || 
    base?.discovered_by === user?.username || 
    base?.doc_by === user?.username;

  const handleDelete = async () => {
    if (!confirm('Estas seguro de que quieres eliminar esta base?')) return;
    try {
      await basesApi.delete(Number(id));
      toast.success('Base eliminada');
      window.location.href = '/bases';
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;
  if (!base) return <div className="text-center py-12 text-gray-500">Base no encontrada</div>;

  const features = [
    { label: 'Granja', value: base.farm },
    { label: 'Geobay', value: base.geobay },
    { label: 'Landing Pad', value: base.landingpad },
    { label: 'Terminal', value: base.terminal },
    { label: 'Arena', value: base.arena },
    { label: 'Pista Carreras', value: base.racetrack },
  ].filter(f => f.value === 'Yes');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/bases" className="text-sm text-gray-400 hover:text-gray-300">&larr; Volver</Link>
          <h1 className="text-2xl font-bold flex items-center gap-2 mt-1">
            <Building2 size={24} /> {base.name}
            {base.is_featured === 'Yes' && <Star size={20} className="text-yellow-400 fill-yellow-400" />}
          </h1>
        </div>
        <div className="flex gap-2">
          <button onClick={generateWiki} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">Generar Wiki</button>
          {canEdit && (
            <>
              <Link to={`/create/base?edit=${id}`} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1">
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
            <h2 className="text-lg font-semibold mb-4">Informacion de la Base</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div><span className="text-gray-400">Sistema:</span> <Link to={`/systems/${base.system_id}`} className="font-medium text-blue-400 hover:text-blue-300">{base.system_name}</Link></div>
              <div><span className="text-gray-400">Planeta:</span> <span className="font-medium">{base.planet_name || 'N/A'}</span></div>
              <div><span className="text-gray-400">Tipo:</span> <span className="font-medium">{base.type}</span></div>
              <div><span className="text-gray-400">Ejes:</span> <span className="font-medium">{base.axes}</span></div>
              <div><span className="text-gray-400">Plataforma:</span> <span className="font-medium">{base.platform}</span></div>
              <div><span className="text-gray-400">Modo:</span> <span className="font-medium">{base.mode}</span></div>
              <div><span className="text-gray-400">Construido por:</span> <span className="font-medium">{base.discovered_by || base.doc_by}</span></div>
            </div>
            {features.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Caracteristicas</h3>
                <div className="flex flex-wrap gap-2">
                  {features.map((f) => (
                    <span key={f.label} className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">{f.label}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {base.layout && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Distribucion</h2>
              <div className="p-3 bg-gray-800/50 rounded-lg text-sm whitespace-pre-wrap">{base.layout}</div>
            </div>
          )}

          {base.additional_info && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Informacion Adicional</h2>
              <div className="p-3 bg-gray-800/50 rounded-lg text-sm whitespace-pre-wrap">{base.additional_info}</div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card text-center">
            <div className="text-4xl font-mono mb-2">{base.glyphs || base.system_glyphs}</div>
            <div className="text-xs text-gray-400">Glifos de portal</div>
          </div>

          {(base.census_player || base.census_social || base.census_discord) && (
            <div className="card">
              <h3 className="font-semibold mb-3">Censo</h3>
              <div className="space-y-2 text-sm">
                {base.census_player && <div className="flex justify-between"><span className="text-gray-400">Jugador</span><span>{base.census_player}</span></div>}
                {base.census_social && <div className="flex justify-between"><span className="text-gray-400">Social</span><span>{base.census_social}</span></div>}
                {base.census_reddit && <div className="flex justify-between"><span className="text-gray-400">Reddit</span><span>{base.census_reddit}</span></div>}
                {base.census_discord && <div className="flex justify-between"><span className="text-gray-400">Discord</span><span>{base.census_discord}</span></div>}
                {base.census_friend && <div className="flex justify-between"><span className="text-gray-400">Amigo</span><span>{base.census_friend}</span></div>}
              </div>
            </div>
          )}
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
