import { useNavigate } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function Header() {
  const { searchQuery, setSearchQuery } = useUIStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      navigate(`/systems?search=${encodeURIComponent(localSearch.trim())}`);
    }
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-6 sticky top-0 z-30"
      style={{
        background: 'linear-gradient(#050505f0, #05050500)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2"
            size={18}
            style={{ color: 'var(--grey)' }}
          />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Buscar sistemas, planetas, bases..."
            style={{
              width: '100%',
              background: '#000',
              border: '1px solid var(--line)',
              color: 'var(--white)',
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: '14px',
              padding: '6px 8px 6px 36px',
              outline: 'none',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--red)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}
          />
        </div>
      </form>

      <div className="flex items-center gap-4 ml-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg transition-colors relative"
            style={{ color: 'var(--grey)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--white)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--grey)')}
          >
            <Bell size={20} />
          </button>
          {showNotifications && (
            <div
              className="absolute right-0 top-full mt-2 w-72 overflow-hidden z-50"
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--line)',
                borderLeft: '2px solid var(--red)',
              }}
            >
              <div
                className="p-3"
                style={{ borderBottom: '1px solid var(--line)' }}
              >
                <h3
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--grey)',
                  }}
                >
                  Notificaciones
                </h3>
              </div>
              <div
                className="p-4 text-center text-sm"
                style={{ color: 'var(--grey)' }}
              >
                No hay notificaciones nuevas
              </div>
            </div>
          )}
        </div>
        <div
          className="text-sm"
          style={{
            color: 'var(--grey)',
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          {user?.username}
        </div>
      </div>
    </header>
  );
}