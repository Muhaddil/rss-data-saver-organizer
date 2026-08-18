import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore, authDisabled } from '../stores/authStore';
import { toast } from 'react-hot-toast';
import { Rocket } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  if (authDisabled) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(username, password);
        toast.success('Cuenta creada correctamente');
      } else {
        await login(username, password);
        toast.success('Bienvenido!');
      }
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 flex items-center justify-center mx-auto mb-4"
            style={{
              background: '#000',
              border: '1px solid var(--line)',
              borderLeft: '2px solid var(--red)',
              color: 'var(--red)',
            }}
          >
            <Rocket size={32} />
          </div>
          <h1
            style={{
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--white)',
            }}
          >
            ROYAL SPACE SOCIETY <b style={{ color: 'var(--red)' }}>//</b>
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
            DATA SAVER — Discovery Manager
          </div>
        </div>

        <div
          className="p-6"
          style={{
            background: 'var(--panel)',
            border: '1px solid var(--line)',
            borderLeft: '2px solid var(--red)',
          }}
        >
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
            {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block mb-1"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--grey)',
                }}
              >
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                style={{
                  background: '#000',
                  border: '1px solid var(--line)',
                  color: 'var(--white)',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: '14px',
                  padding: '8px 10px',
                  outline: 'none',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--red)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}
                required
              />
            </div>
            <div>
              <label
                className="block mb-1"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '9px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--grey)',
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                style={{
                  background: '#000',
                  border: '1px solid var(--line)',
                  color: 'var(--white)',
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: '14px',
                  padding: '8px 10px',
                  outline: 'none',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--red)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--line)')}
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'Cargando...' : isRegister ? 'Crear Cuenta' : 'Entrar'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm transition-colors"
              style={{
                color: 'var(--grey)',
                fontFamily: "'Space Mono', monospace",
                fontSize: '9px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--red)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--grey)')}
            >
              {isRegister ? 'Ya tengo cuenta' : 'No tengo cuenta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}