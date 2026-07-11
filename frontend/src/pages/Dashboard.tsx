import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { statsApi } from '../api/client';
import type { Stats } from '../types';
import { Globe, Globe2, Building2, Bug, Leaf, Gem, Rocket, Building, Wrench, Ship, Worm, Flag, Star } from 'lucide-react';

const statCards = [
  { key: 'systems', label: 'Sistemas', icon: Globe, color: '#e5232d', bg: 'rgba(229, 35, 45, 0.1)' },
  { key: 'planets', label: 'Planetas', icon: Globe2, color: '#e5232d', bg: 'rgba(229, 35, 45, 0.1)' },
  { key: 'bases', label: 'Bases', icon: Building2, color: '#e5232d', bg: 'rgba(229, 35, 45, 0.1)' },
  { key: 'fauna', label: 'Fauna', icon: Bug, color: '#e5232d', bg: 'rgba(229, 35, 45, 0.1)' },
  { key: 'flora', label: 'Flora', icon: Leaf, color: '#e5232d', bg: 'rgba(229, 35, 45, 0.1)' },
  { key: 'minerals', label: 'Minerales', icon: Gem, color: '#e5232d', bg: 'rgba(229, 35, 45, 0.1)' },
  { key: 'starships', label: 'Naves', icon: Rocket, color: '#e5232d', bg: 'rgba(229, 35, 45, 0.1)' },
  { key: 'settlements', label: 'Asentamientos', icon: Building, color: '#e5232d', bg: 'rgba(229, 35, 45, 0.1)' },
  { key: 'multitools', label: 'Multitools', icon: Wrench, color: '#e5232d', bg: 'rgba(229, 35, 45, 0.1)' },
  { key: 'derelicts', label: 'Derelictos', icon: Ship, color: '#e5232d', bg: 'rgba(229, 35, 45, 0.1)' },
  { key: 'sandworms', label: 'Sandworms', icon: Worm, color: '#e5232d', bg: 'rgba(229, 35, 45, 0.1)' },
  { key: 'racetracks', label: 'Pistas', icon: Flag, color: '#e5232d', bg: 'rgba(229, 35, 45, 0.1)' },
];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsApi.get().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div
        className="w-8 h-8"
        style={{
          border: '2px solid var(--line)',
          borderTop: '2px solid var(--red)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  );
  if (!stats) return (
    <div className="text-center" style={{ color: 'var(--grey)' }}>
      Error al cargar estadísticas
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            ROYAL SPACE SOCIETY <b style={{ color: 'var(--red)' }}>//</b> DASHBOARD
          </h1>
          <div
            style={{
              color: 'var(--grey)',
              fontSize: '11px',
              letterSpacing: '0.18em',
              marginTop: '3px',
              textTransform: 'uppercase',
              fontFamily: "'Space Mono', monospace",
            }}
          >
            Registro de la civilización · Nexus-R
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to="/create"
            className="btn-primary"
          >
            + Nuevo Descubrimiento
          </Link>
          <Link
            to="/generate"
            className="btn-secondary"
          >
            Generar Wiki
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.key}
            to={`/${card.key === 'systems' ? 'systems' : card.key}`}
            className="card hover:scale-105 transition-transform"
            style={{ background: card.bg }}
          >
            <div className="flex items-center gap-3">
              <card.icon style={{ color: card.color }} size={24} />
              <div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: 'var(--white)', fontFamily: "'Hanken Grotesk', sans-serif" }}
                >
                  {(stats.totals as any)[card.key]}
                </div>
                <div
                  className="text-xs"
                    style={{
                      color: 'var(--grey)',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '9px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {card.label}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bases destacadas */}
      {stats.totals.featuredBases > 0 && (
        <div
          className="card"
          style={{
            background: 'rgba(201, 162, 39, 0.05)',
            borderLeft: '2px solid var(--gold)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Star style={{ color: 'var(--gold)' }} size={20} />
            <span
              className="font-semibold"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
              }}
            >
              Bases Destacadas
            </span>
          </div>
          <div
            className="text-3xl font-bold"
            style={{ color: 'var(--gold)', fontFamily: "'Hanken Grotesk', sans-serif" }}
          >
            {stats.totals.featuredBases}
          </div>
        </div>
      )}

      {/* Sistemas recientes & Descubridores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2
            className="mb-4"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--grey)',
            }}
          >
            Sistemas Recientes
          </h2>
          <div className="space-y-2">
            {stats.recent.systems.map((s: any) => (
              <Link
                key={s.id}
                to={`/systems/${s.id}`}
                className="flex items-center justify-between p-2 rounded-lg transition-colors"
                style={{ borderBottom: '1px solid #161616' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(143, 21, 25, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div>
                  <div className="font-medium text-sm" style={{ color: 'var(--white)' }}>{s.name}</div>
                  <div
                    className="text-xs"
                    style={{
                      color: 'var(--grey)',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '9px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {s.galaxy} - {s.region}
                  </div>
                </div>
                <div
                  className="text-xs"
                    style={{
                      color: 'var(--grey)',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '9px',
                      letterSpacing: '0.18em',
                    }}
                >
                  {s.glyphs}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="card">
          <h2
            className="mb-4"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--grey)',
            }}
          >
            Top Descubridores
          </h2>
          <div className="space-y-2">
            {stats.topDiscoverers.slice(0, 8).map((d: any, i: number) => (
              <div
                key={d.discovered_by}
                className="flex items-center justify-between p-2 rounded-lg"
                style={{ borderBottom: '1px solid #161616' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(143, 21, 25, 0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs w-4"
                    style={{
                      color: 'var(--grey)',
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--white)' }}>{d.discovered_by}</span>
                </div>
                <span
                  className="text-xs"
                  style={{
                    background: '#000',
                    border: '1px solid var(--line)',
                    padding: '2px 8px',
                    fontFamily: "'Space Mono', monospace",
                    color: 'var(--red)',
                  }}
                >
                  {d.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Galaxias & Facciones */}
      <div className="card">
        <h2
          className="mb-4"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--grey)',
            }}
          >
            Galaxias y Facciones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3
              className="mb-2"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--grey)',
              }}
            >
              Galaxias ({stats.galaxies.length})
            </h3>
            <div className="flex flex-wrap gap-1">
              {stats.galaxies.map((g: string) => (
                <span
                  key={g}
                  className="text-xs px-2 py-1"
                  style={{
                    background: 'rgba(229, 35, 45, 0.1)',
                    color: 'var(--red)',
                    border: '1px solid var(--line)',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '9px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3
              className="mb-2"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--grey)',
              }}
            >
              Facciones ({stats.factions.length})
            </h3>
            <div className="flex flex-wrap gap-1">
              {stats.factions.map((f: string) => (
                <span
                  key={f}
                  className="text-xs px-2 py-1"
                  style={{
                    background: 'rgba(229, 35, 45, 0.1)',
                    color: 'var(--red)',
                    border: '1px solid var(--line)',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '9px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3
              className="mb-2"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--grey)',
              }}
            >
              Biomas ({stats.biomes.length})
            </h3>
            <div className="flex flex-wrap gap-1">
              {stats.biomes.map((b: string) => (
                <span
                  key={b}
                  className="text-xs px-2 py-1"
                  style={{
                    background: 'rgba(229, 35, 45, 0.1)',
                    color: 'var(--red)',
                    border: '1px solid var(--line)',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '9px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}