/**
 * Página de Firma de Resumen Mensual
 *
 * Los profesores acceden con un token único para revisar y firmar su resumen.
 * URL: /es/fichaje/resumen/:token
 */

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const API_BASE = '/api/fichaje-';

interface Profesor {
  id: string;
  nombre: string;
  apellidos: string | null;
  tipo_contrato: string;
}

interface Fichaje {
  id: string;
  fecha: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  minutos_trabajados: number | null;
  clase_nombre: string;
  tipo_horas: string;
}

interface Resumen {
  id: string;
  profesor_id: string;
  mes: string;
  total_horas: number;
  total_clases: number;
  horas_ordinarias: number;
  horas_complementarias: number;
  dias_trabajados: number;
  firmado: boolean;
  fecha_firma: string | null;
  hash_documento: string;
  profesor: Profesor;
}

const ResumenFirmaPage: React.FC = () => {
  // Support both path params (/resumen/:token) and query params (/resumen?token=xxx)
  const { token: pathToken } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const queryToken = searchParams.get('token');
  const token = pathToken || queryToken;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [fichajes, setFichajes] = useState<Fichaje[]>([]);
  const [confirmado, setConfirmado] = useState(false);
  const [firmando, setFirmando] = useState(false);
  const [firmaExitosa, setFirmaExitosa] = useState(false);

  // Cargar resumen
  useEffect(() => {
    const fetchResumen = async () => {
      if (!token) {
        setError('Token no válido');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}resumen-mensual?token=${token}`);
        const data = await res.json();

        if (!data.success) {
          setError(data.error || 'Resumen no encontrado');
        } else {
          setResumen(data.resumen);
          setFichajes(data.fichajes || []);
        }
      } catch (err) {
        setError('Error al cargar el resumen');
        console.error('Error fetching resumen:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResumen();
  }, [token]);

  // Firmar resumen
  const handleFirmar = async () => {
    if (!confirmado || !token) return;

    setFirmando(true);
    try {
      const res = await fetch(`${API_BASE}firma-resumen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, confirmacion: true }),
      });

      const data = await res.json();

      if (data.success) {
        setFirmaExitosa(true);
        // Actualizar estado local
        if (resumen) {
          setResumen({ ...resumen, firmado: true, fecha_firma: data.firma.fecha });
        }
      } else {
        setError(data.error || 'Error al firmar');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error signing:', err);
    } finally {
      setFirmando(false);
    }
  };

  // Formatear fecha
  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  // Formatear minutos a horas
  const formatMinutos = (mins: number | null) => {
    if (!mins) return '-';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  // Formatear mes
  const formatMes = (mes: string) => {
    return new Date(mes).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black relative flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black" />
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent mx-auto mb-4" />
          <p className="text-brand-300">Cargando resumen...</p>
        </div>
      </div>
    );
  }

  if (error && !resumen) {
    return (
      <div className="min-h-screen bg-black relative flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black" />
        <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl border border-primary-dark/30 p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">&#10060;</div>
          <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
          <p className="text-brand-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!resumen) return null;

  const nombreCompleto = `${resumen.profesor.nombre} ${resumen.profesor.apellidos || ''}`.trim();

  return (
    <>
      <Helmet>
        <title>Resumen Mensual - {formatMes(resumen.mes)} | Farray&apos;s Center</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-black relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black" />

        <div className="relative z-10 py-8 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Logo header */}
            <div className="flex flex-col items-center justify-center mb-6">
              <img
                src="/images/logo/img/logo-fidc_512.webp"
                alt="Farray's Center"
                className="h-20 w-auto mb-3"
              />
              <div className="text-center">
                <p className="text-white text-lg font-medium">Control de Jornada Laboral</p>
                <p className="text-brand-400 text-sm">Resumen Mensual</p>
              </div>
            </div>

            {/* Header con info del profesor */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-primary-dark/30 overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-6 text-white">
                <h1 className="text-2xl font-bold mb-1">Resumen de Horas</h1>
                <p className="text-brand-100 text-lg capitalize">{formatMes(resumen.mes)}</p>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-brand-600/30 rounded-full flex items-center justify-center text-2xl">
                    &#128100;
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{nombreCompleto}</h2>
                    <p className="text-brand-300 text-sm">
                      Contrato{' '}
                      {resumen.profesor.tipo_contrato === 'parcial'
                        ? 'a tiempo parcial'
                        : 'a tiempo completo'}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-brand-600/20 rounded-xl p-4 text-center border border-brand-500/30">
                    <p className="text-3xl font-bold text-brand-400">{resumen.total_horas}h</p>
                    <p className="text-sm text-brand-300">Total horas</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <p className="text-3xl font-bold text-white">{resumen.total_clases}</p>
                    <p className="text-sm text-brand-300">Clases</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <p className="text-2xl font-bold text-white">{resumen.horas_ordinarias}h</p>
                    <p className="text-sm text-brand-300">Ordinarias</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <p className="text-2xl font-bold text-white">
                      {resumen.horas_complementarias}h
                    </p>
                    <p className="text-sm text-brand-300">Complementarias</p>
                  </div>
                </div>

                {/* Días trabajados */}
                <div className="border-t border-white/10 pt-4">
                  <p className="text-brand-300">
                    <span className="font-medium text-white">{resumen.dias_trabajados}</span> días
                    trabajados en el mes
                  </p>
                </div>
              </div>
            </div>

            {/* Detalle de fichajes */}
            {fichajes.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-primary-dark/30 overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white">Detalle de Fichajes</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-brand-300">
                          Fecha
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-brand-300">
                          Clase
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-brand-300">
                          Entrada
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-brand-300">
                          Salida
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-brand-300">
                          Tiempo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {fichajes.map(f => (
                        <tr key={f.id} className="hover:bg-white/5">
                          <td className="px-4 py-3 text-sm text-brand-200">
                            {formatFecha(f.fecha)}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-white">
                            {f.clase_nombre}
                          </td>
                          <td className="px-4 py-3 text-sm text-brand-200">
                            {f.hora_inicio?.substring(0, 5) || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-brand-200">
                            {f.hora_fin?.substring(0, 5) || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-white">
                            {formatMinutos(f.minutos_trabajados)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Firma */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-primary-dark/30 overflow-hidden">
              <div className="p-6">
                {resumen.firmado || firmaExitosa ? (
                  <div className="text-center py-4">
                    <div className="text-6xl mb-4">&#9989;</div>
                    <h3 className="text-xl font-bold text-green-400 mb-2">Resumen Firmado</h3>
                    <p className="text-brand-300">
                      Firmado el{' '}
                      {new Date(resumen.fecha_firma || new Date()).toLocaleString('es-ES', {
                        timeZone: 'Europe/Madrid',
                      })}
                    </p>
                    <p className="text-xs text-brand-400/50 mt-4">
                      Hash: {resumen.hash_documento.substring(0, 16)}...
                    </p>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4">
                        {error}
                      </div>
                    )}

                    <div className="mb-6">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={confirmado}
                          onChange={e => setConfirmado(e.target.checked)}
                          className="mt-1 w-5 h-5 rounded border-brand-500 bg-white/10 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm text-brand-200">
                          Confirmo que he revisado los datos de este resumen y que son correctos.
                          Entiendo que esta firma tiene validez legal según el Art. 12.4.c del
                          Estatuto de los Trabajadores.
                        </span>
                      </label>
                    </div>

                    <button
                      onClick={handleFirmar}
                      disabled={!confirmado || firmando}
                      className={`w-full py-4 font-semibold rounded-xl transition-all transform flex items-center justify-center gap-2 ${
                        confirmado && !firmando
                          ? 'bg-green-600 hover:bg-green-500 text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-500/30'
                          : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {firmando ? (
                        <>
                          <span className="animate-spin">&#9696;</span>
                          Firmando...
                        </>
                      ) : (
                        <>&#9997; Firmar Resumen</>
                      )}
                    </button>

                    <p className="text-xs text-brand-400/70 text-center mt-4">
                      Al firmar, se registrará tu IP y la fecha/hora como prueba de firma digital.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Aviso legal */}
            <div className="mt-6 text-center text-xs text-brand-400/70 space-y-1">
              <p>
                Este documento cumple con el Art. 12.4.c del Estatuto de los Trabajadores para
                contratos a tiempo parcial y el Art. 34.9 ET (RD-ley 8/2019).
              </p>
              <p>
                La empresa conservará los registros durante 4 años, quedando a disposición del
                trabajador, sus representantes legales y la Inspección de Trabajo.
              </p>
              <p className="mt-2 text-brand-400/50">
                Farray&apos;s International Dance Center &copy; {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumenFirmaPage;
