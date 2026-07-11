import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { planetsApi } from '../api/client';
import type { Planet, Pagination } from '../types';
import { Globe2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';

const biomeColors: Record<string, string> = {
  Lush: 'text-green-400 bg-green-500/10',
  Frozen: 'text-blue-400 bg-blue-500/10',
  Scorched: 'text-red-400 bg-red-500/10',
  Toxic: 'text-yellow-400 bg-yellow-500/10',
  Irradiated: 'text-purple-400 bg-purple-500/10',
  Barren: 'text-orange-400 bg-orange-500/10',
  Exotic: 'text-pink-400 bg-pink-500/10',
  Dead: 'text-gray-400 bg-gray-500/10',
  Volcanic: 'text-amber-400 bg-amber-500/10',
  Marsh: 'text-teal-400 bg-teal-500/10',
  Water: 'text-cyan-400 bg-cyan-500/10',
};

export default function Planets() {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [biome, setBiome] = useState('');
  const [biomes, setBiomes] = useState<string[]>([]);
  const { user } = useAuthStore();

  const loadPlanets = async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '20' };
      if (search) params.search = search;
      if (biome) params.biome = biome;
      const res = await planetsApi.list(params);
      setPlanets(res.data);
      setPagination(res.pagination);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlanets();
    planetsApi.list({ limit: '1000' }).then((res) => {
      const uniqueBiomes = [...new Set(res.data.map((p: any) => p.biome).filter(Boolean))] as string[];
      setBiomes(uniqueBiomes);
    }).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadPlanets(1);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar este planeta?')) return;
    try {
      await planetsApi.delete(id);
      toast.success('Planeta eliminado');
      loadPlanets(pagination.page);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Globe2 size={24} /> Planetas</h1>
        <Link to="/create/planet" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm">+ Nuevo</Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar planeta..." className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={biome} onChange={(e) => setBiome(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
          <option value="">Todos los biomas</option>
          {biomes.map((b: string) => <option key={b} value={b}>{b}</option>)}
        </select>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">Buscar</button>
      </form>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>
      ) : planets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No se encontraron planetas</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {planets.map((p) => (
              <Link key={p.id} to={`/planets/${p.id}`} className="card hover:border-blue-500/50 transition-colors group">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold group-hover:text-blue-400 transition-colors">{p.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{p.system_name}</p>
                  </div>
                  {p.biome && (
                    <span className={`text-xs px-2 py-0.5 rounded ${biomeColors[p.biome] || 'text-gray-400 bg-gray-500/10'}`}>{p.biome}</span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-1 text-xs">
                  {p.terrain && <span className="bg-gray-800 px-2 py-0.5 rounded">{p.terrain}</span>}
                  {p.weather && <span className="bg-gray-800 px-2 py-0.5 rounded">{p.weather}</span>}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>Fauna: {p.fauna_count}</span>
                  {user?.role === 'admin' && (
                    <button onClick={(e) => { e.preventDefault(); handleDelete(p.id); }} className="text-red-400 hover:text-red-300">Eliminar</button>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => loadPlanets(pagination.page - 1)} disabled={pagination.page === 1} className="p-2 rounded-lg hover:bg-gray-800 disabled:opacity-30"><ChevronLeft size={18} /></button>
              <span className="text-sm text-gray-400">Pagina {pagination.page} de {pagination.pages}</span>
              <button onClick={() => loadPlanets(pagination.page + 1)} disabled={pagination.page === pagination.pages} className="p-2 rounded-lg hover:bg-gray-800 disabled:opacity-30"><ChevronRight size={18} /></button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
