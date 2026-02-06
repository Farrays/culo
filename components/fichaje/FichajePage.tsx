import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * FichajePage - PWA de fichaje para profesores
 *
 * Pantalla de fichaje para tablet/móvil en recepción.
 * Permite a los profesores registrar entrada/salida.
 *
 * Flujo:
 * 1. Seleccionar profesor del dropdown
 * 2. Ver clases del día
 * 3. Pulsar ENTRADA o SALIDA
 * 4. Ver confirmación
 */

// Types
interface Profesor {
  id: string;
  nombre: string;
  apellidos: string | null;
  telefono_whatsapp: string;
}

interface Fichaje {
  id: string;
  profesor_id: string;
  clase_nombre: string;
  fecha: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  estado:
    | 'pendiente'
    | 'entrada_registrada'
    | 'completado'
    | 'no_fichado'
    | 'editado_admin'
    | 'clase_cancelada';
  minutos_trabajados: number | null;
}

interface FichajeResponse {
  success: boolean;
  data?: Fichaje;
  message?: string;
  error?: string;
}

// API base URL
const API_BASE = '/api/fichaje-';

const FichajePage: React.FC = () => {
  // State
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [selectedProfesor, setSelectedProfesor] = useState<Profesor | null>(null);
  const [fichajesHoy, setFichajesHoy] = useState<Fichaje[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch profesores on mount
  useEffect(() => {
    fetchProfesores();
  }, []);

  // Fetch fichajes when profesor changes
  useEffect(() => {
    if (selectedProfesor) {
      fetchFichajesHoy(selectedProfesor.id);
    } else {
      setFichajesHoy([]);
    }
  }, [selectedProfesor]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [success, error]);

  const fetchProfesores = async () => {
    try {
      const res = await fetch(`${API_BASE}profesores?activo=true`);
      const data = await res.json();
      if (data.success) {
        setProfesores(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching profesores:', err);
    }
  };

  const fetchFichajesHoy = async (profesorId: string) => {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      const res = await fetch(`${API_BASE}fichajes?profesor_id=${profesorId}&fecha=${hoy}`);
      const data = await res.json();
      if (data.success) {
        setFichajesHoy(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching fichajes:', err);
    }
  };

  const registrarFichaje = useCallback(
    async (action: 'entrada' | 'salida') => {
      if (!selectedProfesor) return;

      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const res = await fetch(`${API_BASE}fichajes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            profesor_id: selectedProfesor.id,
            metodo: 'manual',
          }),
        });

        const data: FichajeResponse = await res.json();

        if (data.success) {
          setSuccess(
            action === 'entrada'
              ? `Entrada registrada a las ${data.data?.hora_inicio}`
              : `Salida registrada a las ${data.data?.hora_fin}`
          );
          // Refresh fichajes
          fetchFichajesHoy(selectedProfesor.id);
        } else {
          setError(data.error || 'Error al registrar fichaje');
        }
      } catch (err) {
        setError('Error de conexión');
        console.error('Error registrando fichaje:', err);
      } finally {
        setLoading(false);
      }
    },
    [selectedProfesor]
  );

  // Check if there's an open entry (entrada sin salida)
  const fichajeAbierto = fichajesHoy.find(f => f.estado === 'entrada_registrada');
  const puedeEntrar = !fichajeAbierto;
  const puedeSalir = !!fichajeAbierto;

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Helmet>
        <title>Fichaje - Farray&apos;s Center</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-brand-900 via-gray-900 to-black flex flex-col">
        {/* Header con logo */}
        <header className="bg-black/95 backdrop-blur-xl border-b border-brand-600/30 py-6 px-6 shadow-lg">
          <div className="max-w-md mx-auto">
            {/* Logo y título - centrado */}
            <div className="flex flex-col items-center justify-center mb-4">
              <img
                src="/images/logo/img/logo-fidc_512.webp"
                alt="Farray's Center"
                className="h-24 w-auto mb-3"
              />
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white">Control de Jornada</h1>
                <p className="text-brand-400 text-sm">Registro de entrada/salida</p>
              </div>
            </div>
            {/* Reloj */}
            <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
              <div className="text-brand-300 text-sm capitalize">{formatDate(currentTime)}</div>
              <div className="text-3xl font-mono text-white font-bold">
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - centrado vertical */}
        <main className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full p-6 pb-24">
          {/* Selector de Profesor */}
          <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-brand-600/30">
            <label className="block text-brand-200 text-sm font-medium mb-2">
              Selecciona tu nombre:
            </label>
            <select
              value={selectedProfesor?.id || ''}
              onChange={e => {
                const prof = profesores.find(p => p.id === e.target.value);
                setSelectedProfesor(prof || null);
              }}
              className="w-full bg-white/10 border border-brand-600/50 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-600/50"
            >
              <option value="" className="bg-gray-800">
                -- Selecciona profesor --
              </option>
              {profesores.map(p => (
                <option key={p.id} value={p.id} className="bg-gray-800">
                  {p.nombre} {p.apellidos || ''}
                </option>
              ))}
            </select>
          </section>

          {/* Estado y Botones */}
          {selectedProfesor && (
            <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-brand-600/30">
              <h2 className="text-xl font-semibold text-white mb-4">
                Hola, {selectedProfesor.nombre}
              </h2>

              {/* Mensajes */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-4">
                  <p className="text-red-200">{error}</p>
                </div>
              )}
              {success && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-4">
                  <p className="text-green-200">{success}</p>
                </div>
              )}

              {/* Fichaje abierto */}
              {fichajeAbierto && (
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-4">
                  <p className="text-yellow-200">
                    <span className="font-medium">Entrada registrada:</span>{' '}
                    {fichajeAbierto.hora_inicio}
                  </p>
                  <p className="text-yellow-200/70 text-sm mt-1">
                    Clase: {fichajeAbierto.clase_nombre}
                  </p>
                </div>
              )}

              {/* Botones de fichaje */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => registrarFichaje('entrada')}
                  disabled={!puedeEntrar || loading}
                  className={`py-6 px-4 rounded-2xl text-xl font-bold transition-all transform ${
                    puedeEntrar && !loading
                      ? 'bg-green-600 hover:bg-green-500 text-white hover:scale-105 active:scale-95 shadow-lg shadow-green-500/30'
                      : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    <>
                      <span className="block text-3xl mb-1">✓</span>
                      ENTRADA
                    </>
                  )}
                </button>

                <button
                  onClick={() => registrarFichaje('salida')}
                  disabled={!puedeSalir || loading}
                  className={`py-6 px-4 rounded-2xl text-xl font-bold transition-all transform ${
                    puedeSalir && !loading
                      ? 'bg-red-600 hover:bg-red-500 text-white hover:scale-105 active:scale-95 shadow-lg shadow-red-500/30'
                      : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    <>
                      <span className="block text-3xl mb-1">🚪</span>
                      SALIDA
                    </>
                  )}
                </button>
              </div>

              {/* Instrucciones */}
              <p className="text-brand-300/70 text-sm text-center mt-4">
                {puedeEntrar
                  ? 'Pulsa ENTRADA al llegar al centro'
                  : 'Pulsa SALIDA al terminar tus clases'}
              </p>
            </section>
          )}

          {/* Historial del día */}
          {selectedProfesor && fichajesHoy.length > 0 && (
            <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-brand-600/30">
              <h3 className="text-lg font-semibold text-white mb-4">Fichajes de hoy</h3>
              <div className="space-y-3">
                {fichajesHoy.map(f => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between bg-white/5 rounded-xl p-3"
                  >
                    <div>
                      <p className="text-white font-medium">{f.clase_nombre}</p>
                      <p className="text-brand-300/70 text-sm">
                        {f.hora_inicio || '--:--'} - {f.hora_fin || '--:--'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          f.estado === 'completado'
                            ? 'bg-green-500/20 text-green-300'
                            : f.estado === 'entrada_registrada'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : f.estado === 'clase_cancelada'
                                ? 'bg-purple-500/20 text-purple-300 line-through'
                                : 'bg-gray-500/20 text-gray-300'
                        }`}
                      >
                        {f.estado === 'completado'
                          ? 'Completado'
                          : f.estado === 'entrada_registrada'
                            ? 'En curso'
                            : f.estado === 'clase_cancelada'
                              ? 'Cancelada'
                              : 'Pendiente'}
                      </span>
                      {f.minutos_trabajados && (
                        <p className="text-brand-300/70 text-xs mt-1">
                          {Math.floor(f.minutos_trabajados / 60)}h {f.minutos_trabajados % 60}min
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {!selectedProfesor && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👆</div>
              <p className="text-brand-300 text-lg">Selecciona tu nombre para fichar</p>
            </div>
          )}
        </main>

        {/* Footer con info legal */}
        <footer className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-brand-600/30 py-3 px-4">
          <div className="max-w-md mx-auto text-center">
            <p className="text-brand-300/70 text-xs">
              Sistema de registro de jornada conforme al Art. 34.9 ET y RD-ley 8/2019
            </p>
            <p className="text-brand-300/50 text-xs mt-1">
              Farray&apos;s International Dance Center &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default FichajePage;
