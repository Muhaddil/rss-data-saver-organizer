import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { systemsApi } from '../api/client';
import type { System, Pagination } from '../types';
import { Globe, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';

export default function Systems() {
  const [systems, setSystems] = useState<System[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [galaxy, setGalaxy] = useState('');
  const [faction, setFaction] = useState('');
  const [filters, setFilters] = useState<{ galaxies: string[]; factions: string[] }>({ galaxies: [], factions: [] });
  const { user } = useAuthStore();

  const loadSystems = async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '20' };
      if (search) params.search = search;
      if (galaxy) params.galaxy = galaxy;
      if (faction) params.faction = faction;
      const res = await systemsApi.list(params);
      setSystems(res.data);
      setPagination(res.pagination);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSystems();
    systemsApi.filters().then(setFilters).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadSystems(1);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar este sistema?')) return;
    try {
      await systemsApi.delete(id);
      toast.success('Sistema eliminado');
      loadSystems(pagination.page);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Globe size={24} /> Sistemas</h1>
        <Link to="/create/system" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm">+ Nuevo</Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar sistema..." className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={galaxy} onChange={(e) => setGalaxy(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
          <option value="">Todas las galaxias</option>
          {filters.galaxies.map((g: string) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={faction} onChange={(e) => setFaction(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
          <option value="">Todas las facciones</option>
          {filters.factions.map((f: string) => <option key={f} value={f}>{f}</option>)}
        </select>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">Buscar</button>
      </form>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>
      ) : systems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No se encontraron sistemas</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systems.map((s) => (
              <Link key={s.id} to={`/systems/${s.id}`} className="card hover:border-blue-500/50 transition-colors group">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold group-hover:text-blue-400 transition-colors">{s.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{s.galaxy} - {s.region}</p>
                  </div>
                  <span className="text-xs bg-gray-800 px-2 py-1 rounded">{s.glyphs}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {s.faction && <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded">{s.faction}</span>}
                  {s.economy && <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded">{s.economy}</span>}
                  {s.water === 'Yes' && <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">Agua</span>}
                  {s.dissonant === 'Yes' && <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded">Disonante</span>}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{s.planet_count} planetas, {s.moon_count} lunas</span>
                  {user?.role === 'admin' && (
                    <button onClick={(e) => { e.preventDefault(); handleDelete(s.id); }} className="text-red-400 hover:text-red-300">Eliminar</button>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => loadSystems(pagination.page - 1)} disabled={pagination.page === 1} className="p-2 rounded-lg hover:bg-gray-800 disabled:opacity-30"><ChevronLeft size={18} /></button>
              <span className="text-sm text-gray-400">Pagina {pagination.page} de {pagination.pages}</span>
              <button onClick={() => loadSystems(pagination.page + 1)} disabled={pagination.page === pagination.pages} className="p-2 rounded-lg hover:bg-gray-800 disabled:opacity-30"><ChevronRight size={18} /></button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
