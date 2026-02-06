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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Cargando resumen...</p>
        </div>
      </div>
    );
  }

  if (error && !resumen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">&#10060;</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
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
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-8 text-white">
              <h1 className="text-2xl font-bold mb-1">Resumen de Horas</h1>
              <p className="text-brand-100 text-lg capitalize">{formatMes(resumen.mes)}</p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center text-2xl">
                  &#128100;
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{nombreCompleto}</h2>
                  <p className="text-gray-500 text-sm">
                    Contrato{' '}
                    {resumen.profesor.tipo_contrato === 'parcial'
                      ? 'a tiempo parcial'
                      : 'a tiempo completo'}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-brand-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-brand-700">{resumen.total_horas}h</p>
                  <p className="text-sm text-brand-600">Total horas</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-gray-700">{resumen.total_clases}</p>
                  <p className="text-sm text-gray-600">Clases</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-700">{resumen.horas_ordinarias}h</p>
                  <p className="text-sm text-gray-600">Ordinarias</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-700">
                    {resumen.horas_complementarias}h
                  </p>
                  <p className="text-sm text-gray-600">Complementarias</p>
                </div>
              </div>

              {/* Días trabajados */}
              <div className="border-t pt-4">
                <p className="text-gray-600">
                  <span className="font-medium">{resumen.dias_trabajados}</span> días trabajados en
                  el mes
                </p>
              </div>
            </div>
          </div>

          {/* Detalle de fichajes */}
          {fichajes.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Detalle de Fichajes</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        Clase
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        Entrada
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        Salida
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                        Tiempo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {fichajes.map(f => (
                      <tr key={f.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{formatFecha(f.fecha)}</td>
                        <td className="px-4 py-3 text-sm font-medium">{f.clase_nombre}</td>
                        <td className="px-4 py-3 text-sm">
                          {f.hora_inicio?.substring(0, 5) || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm">{f.hora_fin?.substring(0, 5) || '-'}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium">
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
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              {resumen.firmado || firmaExitosa ? (
                <div className="text-center py-4">
                  <div className="text-6xl mb-4">&#9989;</div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">Resumen Firmado</h3>
                  <p className="text-gray-600">
                    Firmado el{' '}
                    {new Date(resumen.fecha_firma || new Date()).toLocaleString('es-ES', {
                      timeZone: 'Europe/Madrid',
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mt-4">
                    Hash: {resumen.hash_documento.substring(0, 16)}...
                  </p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
                  )}

                  <div className="mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={confirmado}
                        onChange={e => setConfirmado(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm text-gray-700">
                        Confirmo que he revisado los datos de este resumen y que son correctos.
                        Entiendo que esta firma tiene validez legal según el Art. 12.4.c del
                        Estatuto de los Trabajadores.
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={handleFirmar}
                    disabled={!confirmado || firmando}
                    className="w-full py-4 bg-brand-600 text-white font-semibold rounded-xl
                               hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed
                               transition-colors flex items-center justify-center gap-2"
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

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Al firmar, se registrará tu IP y la fecha/hora como prueba de firma digital.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Aviso legal */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              Este documento cumple con el Art. 12.4.c del Estatuto de los Trabajadores para
              contratos a tiempo parcial.
            </p>
            <p className="mt-1">
              Farray&apos;s International Dance Center &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumenFirmaPage;
