import { useState } from 'react';
import { generateApi } from '../api/client';
import { Code2, Copy, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const entityTypes = [
  { value: 'system', label: 'Sistema' },
  { value: 'planet', label: 'Planeta' },
  { value: 'base', label: 'Base' },
  { value: 'fauna', label: 'Fauna' },
  { value: 'flora', label: 'Flora' },
  { value: 'mineral', label: 'Mineral' },
  { value: 'starship', label: 'Nave' },
  { value: 'settlement', label: 'Asentamiento' },
  { value: 'multitool', label: 'Multitool' },
  { value: 'derelict', label: 'Derelicto' },
  { value: 'sandworm', label: 'Sandworm' },
  { value: 'racetrack', label: 'Pista' },
];

export default function GenerateWiki() {
  const [entityType, setEntityType] = useState('system');
  const [entityId, setEntityId] = useState('');
  const [wikiCode, setWikiCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityId) { toast.error('Ingresa un ID'); return; }
    setLoading(true);
    try {
      const res = await generateApi.wiki(entityType, parseInt(entityId));
      setWikiCode(res.wikiCode);
    } catch (err: any) {
      toast.error(err.message || 'Error al generar');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(wikiCode);
    toast.success('Codigo copiado al portapapeles!');
  };

  const downloadWiki = () => {
    const blob = new Blob([wikiCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wiki_${entityType}_${entityId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Archivo descargado!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2"><Code2 size={24} /> Generador de Codigo Wiki</h1>

      <div className="card">
        <form onSubmit={handleGenerate} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Tipo de Entidad</label>
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {entityTypes.map(e => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">ID de la Entidad</label>
            <input
              type="number"
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              placeholder="Ej: 1"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Generando...' : 'Generar'}
          </button>
        </form>
      </div>

      {wikiCode && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Codigo Generado</h2>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
              >
                <Copy size={14} /> Copiar
              </button>
              <button
                onClick={downloadWiki}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
              >
                <Download size={14} /> Descargar
              </button>
            </div>
          </div>
          <pre className="bg-gray-800 p-4 rounded-lg text-xs overflow-x-auto max-h-[500px] overflow-y-auto font-mono">
            {wikiCode}
          </pre>
        </div>
      )}

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Como usar</h2>
        <div className="text-sm text-gray-400 space-y-2">
          <p>1. Selecciona el tipo de entidad que quieres generar.</p>
          <p>2. Ingresa el ID de la entidad (lo puedes encontrar en la URL de la pagina de detalle).</p>
          <p>3. Haz clic en "Generar" para obtener el codigo wiki.</p>
          <p>4. Copia o descarga el codigo para pegarlo en la wiki de No Man's Sky.</p>
          <p className="text-xs text-gray-500 mt-4">Nota: El codigo generado sigue el formato de la plantilla Base de la wiki de NMS.</p>
        </div>
      </div>
    </div>
  );
}
