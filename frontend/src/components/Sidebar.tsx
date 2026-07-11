import { NavLink } from 'react-router-dom';
import { useUIStore } from '../stores/uiStore';
import { useAuthStore } from '../stores/authStore';
import {
  LayoutDashboard, Globe, Globe2, Building2, Bug, Leaf, Gem,
  Rocket, Building, Wrench, Ship, Worm, Flag, Plus,
  Code2, Download, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/systems', label: 'Sistemas', icon: Globe },
  { path: '/planets', label: 'Planetas', icon: Globe2 },
  { path: '/bases', label: 'Bases', icon: Building2 },
  { path: '/fauna', label: 'Fauna', icon: Bug },
  { path: '/flora', label: 'Flora', icon: Leaf },
  { path: '/minerals', label: 'Minerales', icon: Gem },
  { path: '/starships', label: 'Naves', icon: Rocket },
  { path: '/settlements', label: 'Asentamientos', icon: Building },
  { path: '/multitools', label: 'Multitools', icon: Wrench },
  { path: '/derelicts', label: 'Derelictos', icon: Ship },
  { path: '/sandworms', label: 'Sandworms', icon: Worm },
  { path: '/racetracks', label: 'Pistas', icon: Flag },
];

const actionItems = [
  { path: '/create', label: 'Crear Descubrimiento', icon: Plus },
  { path: '/generate', label: 'Generar Wiki', icon: Code2 },
  { path: '/import', label: 'Importar Wiki', icon: Download },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { logout, user } = useAuthStore();

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
      style={{
        background: 'var(--panel)',
        borderRight: '1px solid var(--line)',
        borderLeft: '2px solid var(--red)',
      }}
    >
      {/* Header del sidebar */}
      <div
        className="flex items-center justify-between h-16 px-4"
        style={{ borderBottom: '1px solid var(--line)' }}
      >
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 flex items-center justify-center font-bold text-sm"
              style={{
                background: '#000',
                border: '1px solid var(--line)',
                borderLeft: '2px solid var(--red)',
                color: 'var(--red)',
                fontFamily: "'Space Mono', monospace",
              }}
            >
              RSS
            </div>
            <span
              className="font-bold text-sm"
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              Data Saver
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--grey)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--red)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--grey)')}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Navegación */}
      <nav className="p-2 space-y-1 overflow-y-auto" style={{ height: 'calc(100% - 8rem)' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? 'text-[var(--red)]' : 'text-[var(--grey)]'
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? 'rgba(229, 35, 45, 0.1)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--red)' : '2px solid transparent',
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            })}
          >
            <item.icon size={18} />
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}

        {/* Acciones */}
        <div
          className="pt-2 mt-2"
          style={{ borderTop: '1px solid var(--line)' }}
        >
          {sidebarOpen && (
            <div
              className="px-3 py-1"
            style={{
              fontFamily: "'Space Mono', monospace",
              color: 'var(--grey)',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            ACCIONES
            </div>
          )}
          {actionItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'text-[var(--gold)]' : 'text-[var(--grey)]'
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? 'rgba(201, 162, 39, 0.1)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                fontFamily: "'Space Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              })}
            >
              <item.icon size={18} />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer del sidebar */}
      <div
        className="absolute bottom-0 left-0 right-0 p-2"
        style={{ borderTop: '1px solid var(--line)' }}
      >
        {sidebarOpen && (
          <div
            className="px-3 py-1"
            style={{
              fontFamily: "'Space Mono', monospace",
              color: 'var(--grey)',
              fontSize: '10px',
              letterSpacing: '0.18em',
            }}
          >
            {user?.username} ({user?.role})
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors"
          style={{
            color: 'var(--grey)',
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--red)';
            e.currentTarget.style.background = 'rgba(229, 35, 45, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--grey)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <LogOut size={18} />
          {sidebarOpen && <span>Salir</span>}
        </button>
      </div>
    </aside>
  );
}