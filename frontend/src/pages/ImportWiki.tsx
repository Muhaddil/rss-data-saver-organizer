import { useState } from 'react';
import { importApi } from '../api/client';
import toast from 'react-hot-toast';
import { Search, Copy, FileText, Loader2, Download, Database, Home, Globe } from 'lucide-react';

export default function ImportWiki() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState<any>(null);
  const [importType, setImportType] = useState<'base' | 'system' | 'planet'>('base');
  const [bulkJson, setBulkJson] = useState('');
  const [bulkImporting, setBulkImporting] = useState(false);
  const [bulkResult, setBulkResult] = useState<any>(null);
  const [bulkBasesJson, setBulkBasesJson] = useState('');
  const [bulkBasesImporting, setBulkBasesImporting] = useState(false);
  const [bulkBasesResult, setBulkBasesResult] = useState<any>(null);
  const [bulkPlanetsJson, setBulkPlanetsJson] = useState('');
  const [bulkPlanetsImporting, setBulkPlanetsImporting] = useState(false);
  const [bulkPlanetsResult, setBulkPlanetsResult] = useState<any>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setPageData(null);
    try {
      const res = await importApi.searchWiki(searchQuery);
      setSearchResults(res.results);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPage = async (pageName: string) => {
    setLoading(true);
    setPageData(null);
    try {
      const res = await importApi.getPage(pageName);
      setPageData(res);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!pageData?.wikitext) return;
    setLoading(true);
    try {
      if (importType === 'base') {
        await importApi.importBase({ wikitext: pageData.wikitext });
      } else if (importType === 'system') {
        await importApi.importSystem({ wikitext: pageData.wikitext });
      } else {
        await importApi.importPlanet({ wikitext: pageData.wikitext });
      }
      toast.success(`Importado correctamente!`);
      setPageData(null);
      setSearchResults([]);
      setSearchQuery('');
    } catch (err: any) {
      toast.error(err.message || 'Error al importar');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!pageData?.wikitext) return;
    navigator.clipboard.writeText(pageData.wikitext);
    toast.success('Codigo wiki copiado!');
  };

  const handleBulkImport = async () => {
    if (!bulkJson.trim()) return;
    setBulkImporting(true);
    setBulkResult(null);
    try {
      const parsed = JSON.parse(bulkJson);
      const systems = parsed.cargoquery || parsed;
      if (!Array.isArray(systems)) {
        toast.error('El JSON debe contener un array de sistemas (campo cargoquery)');
        return;
      }
      const res = await importApi.bulkImportSystems(systems);
      setBulkResult(res);
      toast.success(`Importados: ${res.imported}, Omitidos: ${res.skipped}, Errores: ${res.errors}`);
    } catch (err: any) {
      toast.error(err.message || 'Error al importar');
    } finally {
      setBulkImporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBulkJson(ev.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleBulkBasesImport = async () => {
    if (!bulkBasesJson.trim()) return;
    setBulkBasesImporting(true);
    setBulkBasesResult(null);
    try {
      const parsed = JSON.parse(bulkBasesJson);
      const bases = parsed.cargoquery || parsed;
      if (!Array.isArray(bases)) {
        toast.error('El JSON debe contener un array de bases (campo cargoquery)');
        return;
      }
      const res = await importApi.bulkImportBases(bases);
      setBulkBasesResult(res);
      toast.success(`Importadas: ${res.imported}, Omitidas: ${res.skipped}, Errores: ${res.errors}`);
    } catch (err: any) {
      toast.error(err.message || 'Error al importar bases');
    } finally {
      setBulkBasesImporting(false);
    }
  };

  const handleBasesFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBulkBasesJson(ev.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleBulkPlanetsImport = async () => {
    if (!bulkPlanetsJson.trim()) return;
    setBulkPlanetsImporting(true);
    setBulkPlanetsResult(null);
    try {
      const parsed = JSON.parse(bulkPlanetsJson);
      const planets = parsed.cargoquery || parsed;
      if (!Array.isArray(planets)) {
        toast.error('El JSON debe contener un array de planetas (campo cargoquery)');
        return;
      }
      const res = await importApi.bulkImportPlanets(planets);
      setBulkPlanetsResult(res);
      toast.success(`Importados: ${res.imported}, Omitidos: ${res.skipped}, Errores: ${res.errors}`);
    } catch (err: any) {
      toast.error(err.message || 'Error al importar planetas');
    } finally {
      setBulkPlanetsImporting(false);
    }
  };

  const handlePlanetsFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBulkPlanetsJson(ev.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Download size={24} /> Importar desde Wiki
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Busca una pagina en la wiki de NMS e importala. El sistema y planeta se crean automaticamente si no existen.
        </p>
      </div>

      <div className="card">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Buscar en la wiki de No Man's Sky..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Buscar
          </button>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-3">Resultados ({searchResults.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {searchResults.map((r, i) => (
              <button
                key={i}
                onClick={() => loadPage(r.title)}
                disabled={loading}
                className="text-left p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <span className="font-medium text-blue-400">{r.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {pageData && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FileText size={20} /> {pageData.title}
            </h3>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm"
            >
              <Copy size={14} /> Copiar Codigo
            </button>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-sm">Importar como:</h4>
            <div className="flex gap-2">
              {(['base', 'system', 'planet'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setImportType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    importType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {type === 'base' ? 'Base' : type === 'system' ? 'Sistema' : 'Planeta'}
                </button>
              ))}
            </div>

            <button
              onClick={handleImport}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
              {loading ? 'Importando...' : `Importar ${importType === 'base' ? 'Base' : importType === 'system' ? 'Sistema' : 'Planeta'}`}
            </button>
          </div>

          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
              <span className="text-xs text-gray-400">Wikitext (preview)</span>
              <span className="text-xs text-gray-500">{pageData.wikitext?.length || 0} chars</span>
            </div>
            <pre className="p-4 text-xs overflow-x-auto max-h-[400px] overflow-y-auto text-gray-300">
              {pageData.wikitext}
            </pre>
          </div>
        </div>
      )}

      {!pageData && searchResults.length === 0 && (
        <>
          <div className="card text-center py-12 text-gray-500">
            <Database size={48} className="mx-auto mb-4 opacity-50" />
            <p>Busca una pagina de la wiki e importala directamente</p>
            <p className="text-sm mt-2">Ejemplo: RSS_Bowling, Urticalia, Sentinel Prime</p>
          </div>

          <div className="card space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Download size={20} /> Importar Sistemas Masivamente
            </h3>
            <p className="text-sm text-gray-400">
              Sube el JSON de la API de la wiki (formato cargoquery) para importar todos los sistemas de golpe.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            <textarea
              value={bulkJson}
              onChange={(e) => setBulkJson(e.target.value)}
              placeholder='O pega el JSON aqui... {"cargoquery": [{"title": {"Star": "...", ...}}]}'
              rows={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleBulkImport}
              disabled={bulkImporting || !bulkJson.trim()}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {bulkImporting ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
              {bulkImporting ? 'Importando...' : 'Importar Sistemas'}
            </button>
            {bulkResult && (
              <div className="bg-gray-800/50 p-4 rounded-lg text-sm">
                <p><strong className="text-green-400">Importados:</strong> {bulkResult.imported}</p>
                <p><strong className="text-yellow-400">Omitidos (ya existen):</strong> {bulkResult.skipped}</p>
                <p><strong className="text-red-400">Errores:</strong> {bulkResult.errors}</p>
                <p className="text-gray-500 mt-1">Total procesados: {bulkResult.total}</p>
              </div>
            )}
          </div>

          <div className="card space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Home size={20} /> Importar Bases Masivamente
            </h3>
            <p className="text-sm text-gray-400">
              Sube el JSON de la API de la wiki (formato cargoquery) para importar todas las bases de golpe. Crea sistemas y planetas automaticamente si no existen.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleBasesFileUpload}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
            <textarea
              value={bulkBasesJson}
              onChange={(e) => setBulkBasesJson(e.target.value)}
              placeholder='O pega el JSON aqui... {"cargoquery": [{"title": {"Name": "...", ...}}]}'
              rows={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleBulkBasesImport}
              disabled={bulkBasesImporting || !bulkBasesJson.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {bulkBasesImporting ? <Loader2 size={16} className="animate-spin" /> : <Home size={16} />}
              {bulkBasesImporting ? 'Importando...' : 'Importar Bases'}
            </button>
            {bulkBasesResult && (
              <div className="bg-gray-800/50 p-4 rounded-lg text-sm">
                <p><strong className="text-green-400">Importadas:</strong> {bulkBasesResult.imported}</p>
                <p><strong className="text-yellow-400">Omitidas (ya existen):</strong> {bulkBasesResult.skipped}</p>
                <p><strong className="text-red-400">Errores:</strong> {bulkBasesResult.errors}</p>
                <p className="text-gray-500 mt-1">Total procesadas: {bulkBasesResult.total}</p>
                <p className="text-gray-500">Sistemas creados: {bulkBasesResult.systemsCreated}</p>
                <p className="text-gray-500">Planetos creados: {bulkBasesResult.planetsCreated}</p>
              </div>
            )}
          </div>

          <div className="card space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Globe size={20} /> Importar Planetas Masivamente
            </h3>
            <p className="text-sm text-gray-400">
              Sube el JSON de la API de la wiki (formato cargoquery) para importar todos los planetas de golpe. Crea sistemas automaticamente si no existen.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handlePlanetsFileUpload}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700"
            />
            <textarea
              value={bulkPlanetsJson}
              onChange={(e) => setBulkPlanetsJson(e.target.value)}
              placeholder='O pega el JSON aqui... {"cargoquery": [{"title": {"PageName": "...", ...}}]}'
              rows={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleBulkPlanetsImport}
              disabled={bulkPlanetsImporting || !bulkPlanetsJson.trim()}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {bulkPlanetsImporting ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
              {bulkPlanetsImporting ? 'Importando...' : 'Importar Planetas'}
            </button>
            {bulkPlanetsResult && (
              <div className="bg-gray-800/50 p-4 rounded-lg text-sm">
                <p><strong className="text-green-400">Importados:</strong> {bulkPlanetsResult.imported}</p>
                <p><strong className="text-blue-400">Actualizados (rellenados vacíos):</strong> {bulkPlanetsResult.updated}</p>
                <p><strong className="text-yellow-400">Omitidos (ya existen con datos):</strong> {bulkPlanetsResult.skipped}</p>
                <p><strong className="text-red-400">Errores:</strong> {bulkPlanetsResult.errors}</p>
                <p className="text-gray-500 mt-1">Total procesados: {bulkPlanetsResult.total}</p>
                <p className="text-gray-500">Sistemas creados: {bulkPlanetsResult.systemsCreated}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
