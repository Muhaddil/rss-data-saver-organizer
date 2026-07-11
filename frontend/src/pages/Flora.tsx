import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { floraApi } from '../api/client';
import type { Flora, Pagination } from '../types';
import { Leaf, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Flora() {
  const [items, setItems] = useState<Flora[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '20' };
      if (search) params.search = search;
      const res = await floraApi.list(params);
      setItems(res.data);
      setPagination(res.pagination);
    } catch (err: any) { toast.error(err.message); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar?')) return;
    try { await floraApi.delete(id); toast.success('Eliminado'); load(pagination.page); } catch (err: any) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Leaf size={24} /> Flora</h1>
        <Link to="/create/flora" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm">+ Nueva</Link>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); load(1); }} className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar flora..." className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">Buscar</button>
      </form>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No se encontro flora</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((f) => (
              <div key={f.id} className="card group">
                <h3 className="font-semibold">{f.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{f.planet_name} - {f.system_name}</p>
                <div className="mt-3 flex flex-wrap gap-1 text-xs">
                  {f.age && <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded">{f.age}</span>}
                  {f.produces && <span className="bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded">Produce: {f.produces}</span>}
                </div>
                <div className="mt-3 flex justify-end">
                  <button onClick={() => handleDelete(f.id)} className="text-xs text-red-400 hover:text-red-300">Eliminar</button>
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
