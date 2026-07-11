import { useEffect, useState } from 'react';
import { mineralsApi } from '../api/client';
import type { Mineral, Pagination } from '../types';
import { Gem, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Minerals() {
  const [items, setItems] = useState<Mineral[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '20' };
      if (search) params.search = search;
      const res = await mineralsApi.list(params);
      setItems(res.data);
      setPagination(res.pagination);
    } catch (err: any) { toast.error(err.message); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar?')) return;
    try { await mineralsApi.delete(id); toast.success('Eliminado'); load(pagination.page); } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Gem size={24} /> Minerales</h1>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); load(1); }} className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar mineral..." className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">Buscar</button>
      </form>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No se encontraron minerales</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((m) => (
              <div key={m.id} className="card">
                <h3 className="font-semibold">{m.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{m.planet_name} - {m.system_name}</p>
                <div className="mt-3 flex flex-wrap gap-1 text-xs">
                  {m.formation && <span className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded">{m.formation}</span>}
                  {m.metal_content && <span className="bg-gray-500/10 text-gray-400 px-2 py-0.5 rounded">Metal: {m.metal_content}</span>}
                </div>
                <div className="mt-3 flex justify-end">
                  <button onClick={() => handleDelete(m.id)} className="text-xs text-red-400 hover:text-red-300">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => load(pagination.page - 1)} disabled={pagination.page === 1} className="p-2 rounded-lg hover:bg-gray-800 disabled:opacity-30"><ChevronLeft size={18} /></button>
              <span className="text-sm text-gray-400">{pagination.page}/{pagination.pages}</span>
              <button onClick={() => load(pagination.page + 1)} disabled={pagination.page === pagination.pages} className="p-2 rounded-lg hover:bg-gray-800 disabled:opacity-30"><ChevronRight size={18} /></button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
