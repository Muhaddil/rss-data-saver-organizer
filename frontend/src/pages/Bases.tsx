import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { basesApi } from '../api/client';
import type { Base, Pagination } from '../types';
import { Building2, Search, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';

export default function Bases() {
  const [bases, setBases] = useState<Base[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [featured, setFeatured] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const { user } = useAuthStore();

  const loadBases = async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '20' };
      if (search) params.search = search;
      if (type) params.type = type;
      if (featured) params.is_featured = featured;
      const res = await basesApi.list(params);
      setBases(res.data);
      setPagination(res.pagination);
    } catch (err: any) { toast.error(err.message); } finally { setLoading(false); }
  };

  useEffect(() => {
    loadBases();
    basesApi.filters().then((f) => setTypes(f.types)).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); loadBases(1); };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar esta base?')) return;
    try { await basesApi.delete(id); toast.success('Base eliminada'); loadBases(pagination.page); } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Building2 size={24} /> Bases</h1>
        <Link to="/create/base" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm">+ Nueva</Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar base..." className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
          <option value="">Todos los tipos</option>
          {types.map((t: string) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={featured} onChange={(e) => setFeatured(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
          <option value="">Todas</option>
          <option value="Yes">Destacadas</option>
          <option value="No">Normales</option>
        </select>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">Buscar</button>
      </form>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>
      ) : bases.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No se encontraron bases</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bases.map((b) => (
              <Link key={b.id} to={`/bases/${b.id}`} className="card hover:border-blue-500/50 transition-colors group">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold group-hover:text-blue-400 transition-colors">{b.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{b.system_name}</p>
                  </div>
                  {b.is_featured === 'Yes' && <Star size={16} className="text-yellow-400 fill-yellow-400" />}
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {b.type && <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded">{b.type}</span>}
                  {b.farm === 'Yes' && <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded">Granja</span>}
                  {b.geobay === 'Yes' && <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">Geobay</span>}
                  {b.landingpad === 'Yes' && <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded">Landing Pad</span>}
                </div>
                <div className="mt-3 text-xs text-gray-500">{b.planet_name || 'Sin planeta asignado'}</div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{b.discovered_by || b.doc_by}</span>
                  {user?.role === 'admin' && (
                    <button onClick={(e) => { e.preventDefault(); handleDelete(b.id); }} className="text-red-400 hover:text-red-300">Eliminar</button>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => loadBases(pagination.page - 1)} disabled={pagination.page === 1} className="p-2 rounded-lg hover:bg-gray-800 disabled:opacity-30"><ChevronLeft size={18} /></button>
              <span className="text-sm text-gray-400">Pagina {pagination.page} de {pagination.pages}</span>
              <button onClick={() => loadBases(pagination.page + 1)} disabled={pagination.page === pagination.pages} className="p-2 rounded-lg hover:bg-gray-800 disabled:opacity-30"><ChevronRight size={18} /></button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
