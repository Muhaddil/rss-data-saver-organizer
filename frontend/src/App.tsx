import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Systems from './pages/Systems';
import SystemDetail from './pages/SystemDetail';
import Planets from './pages/Planets';
import PlanetDetail from './pages/PlanetDetail';
import Bases from './pages/Bases';
import BaseDetail from './pages/BaseDetail';
import Fauna from './pages/Fauna';
import Flora from './pages/Flora';
import Minerals from './pages/Minerals';
import Starships from './pages/Starships';
import Settlements from './pages/Settlements';
import Multitools from './pages/Multitools';
import Derelicts from './pages/Derelicts';
import Sandworms from './pages/Sandworms';
import Racetracks from './pages/Racetracks';
import CreateDiscovery from './pages/CreateDiscovery';
import GenerateWiki from './pages/GenerateWiki';
import ImportWiki from './pages/ImportWiki';
import { useEffect, useState, useRef } from 'react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'wait' | 'boot' | 'logo' | 'off'>('wait');
  const bootLogRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const bootLines = [
    { text: '> SYS/INIT v3.2.1 — RSS DATA SAVER', cls: 'ok' },
    { text: '> MEMORY CHECK: 4096 UNITS OK', cls: 'ok' },
    { text: '> PROCESSOR: NEXUS-R QUANTUM CORE', cls: 'ok' },
    { text: '> INITIALIZING GALACTIC DATABASE...', cls: '' },
    { text: '> DATABASE LINK: ESTABLISHED', cls: 'ok' },
    { text: '> LOADING CIVILIZATION REGISTRY...', cls: '' },
    { text: '> REGISTRY: 1.2M ENTRIES SYNCED', cls: 'ok' },
    { text: '> ESTABLISHING SECURE CONNECTION...', cls: '' },
    { text: '> CONNECTION: SECURE — PROTOCOL v4.8', cls: 'ok' },
    { text: '> CALIBRATING HYPERDRIVE MATRIX...', cls: '' },
    { text: '> HYPERDRIVE: READY', cls: 'ok' },
    { text: '> WELCOME TO THE ROYAL SPACE SOCIETY //', cls: 'ok' },
  ];

  const handleClick = () => {
    if (phase === 'wait') {
      setPhase('boot');
    }
  };

  useEffect(() => {
    if (phase === 'boot') {
      let lineIndex = 0;
      const logEl = bootLogRef.current;
      if (logEl) logEl.innerHTML = '';

      intervalRef.current = setInterval(() => {
        if (lineIndex < bootLines.length) {
          const line = bootLines[lineIndex];
          const div = document.createElement('div');
          div.textContent = line.text;
          if (line.cls) div.className = line.cls;
          logEl?.appendChild(div);
          logEl?.scrollTo(0, logEl.scrollHeight);
          lineIndex++;
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => setPhase('logo'), 150);
        }
      }, 70);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'logo') {
      const timer = setTimeout(() => {
        setPhase('off');
        setTimeout(onComplete, 600);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <div id="boot" className={phase === 'off' ? 'off' : phase === 'logo' ? 'logo' : phase === 'boot' ? 'on' : ''} onClick={handleClick}>
      <div id="roll" />

      {phase === 'wait' && (
        <div id="boot-wait">
          <div className="logo-text">
            ROYAL SPACE SOCIETY <b>//</b>
            <br />
            <span style={{ fontSize: '0.5em', letterSpacing: '0.3em' }}>DATA SAVER</span>
          </div>
          <div className="prompt">
            <span className="blink">►</span> PULSA PARA INICIAR
          </div>
          <small>RSS // NEXUS-R — v3.2.1</small>
        </div>
      )}

      {phase === 'boot' && (
        <div id="boot-log" ref={bootLogRef} />
      )}

      {/* Logo (no hay) */}
      {phase === 'logo' && (
        <div id="boot-logo">
          <div className="logo-text main">
            ROYAL SPACE SOCIETY <b>//</b>
            <br />
            <span style={{ fontSize: '0.5em', letterSpacing: '0.3em' }}>DATA SAVER</span>
          </div>
          <div className="ghost g1 logo-text">
            ROYAL SPACE SOCIETY <b>//</b>
            <br />
            <span style={{ fontSize: '0.5em', letterSpacing: '0.3em' }}>DATA SAVER</span>
          </div>
          <div className="ghost g2 logo-text">
            ROYAL SPACE SOCIETY <b>//</b>
            <br />
            <span style={{ fontSize: '0.5em', letterSpacing: '0.3em' }}>DATA SAVER</span>
          </div>
          <div className="fx fx-scan" />
          <div className="fx fx-sweep" />
        </div>
      )}
    </div>
  );
}

export default function App() {
  const { loadUser, isAuthenticated } = useAuthStore();
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadUser();
    }
  }, []);

  return (
    <>
      {!bootComplete && <BootSequence onComplete={() => setBootComplete(true)} />}
      <Toaster
        position="top-right"
        toastOptions={{
          className: '',
          style: {
            background: 'var(--panel)',
            border: '1px solid var(--line)',
            borderLeft: '2px solid var(--red)',
            color: 'var(--white)',
            fontFamily: "'Space Mono', monospace",
            fontSize: '12px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          },
        }}
      />
      <div id="crt-overlay" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/systems" element={<Systems />} />
                  <Route path="/systems/:id" element={<SystemDetail />} />
                  <Route path="/planets" element={<Planets />} />
                  <Route path="/planets/:id" element={<PlanetDetail />} />
                  <Route path="/bases" element={<Bases />} />
                  <Route path="/bases/:id" element={<BaseDetail />} />
                  <Route path="/fauna" element={<Fauna />} />
                  <Route path="/flora" element={<Flora />} />
                  <Route path="/minerals" element={<Minerals />} />
                  <Route path="/starships" element={<Starships />} />
                  <Route path="/settlements" element={<Settlements />} />
                  <Route path="/multitools" element={<Multitools />} />
                  <Route path="/derelicts" element={<Derelicts />} />
                  <Route path="/sandworms" element={<Sandworms />} />
                  <Route path="/racetracks" element={<Racetracks />} />
                  <Route path="/create" element={<CreateDiscovery />} />
                  <Route path="/create/:type" element={<CreateDiscovery />} />
                  <Route path="/generate" element={<GenerateWiki />} />
                  <Route path="/import" element={<ImportWiki />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}