/* global Blob */
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * FichajesAdminPage - Dashboard de administración de fichajes
 *
 * Features:
 * - Vista de fichajes del día con estadísticas
 * - Filtros por fecha, profesor, estado
 * - Gestión de profesores (alta/baja)
 * - Edición manual de fichajes
 * - Export CSV
 */

// Types
interface Profesor {
  id: string;
  nombre: string;
  apellidos: string | null;
  telefono_whatsapp: string;
  nombre_momence: string;
  tipo_contrato: 'parcial' | 'completo';
  activo: boolean;
  email: string | null;
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
  metodo_entrada: string | null;
  metodo_salida: string | null;
  profesor?: {
    id: string;
    nombre: string;
    apellidos: string | null;
  };
}

interface FichajesResponse {
  success: boolean;
  data?: Fichaje[];
  meta?: {
    total: number;
    totalMinutos: number;
    totalHoras: number;
  };
  error?: string;
}

// API base
const API_BASE = '/api/fichaje-';

// Tabs
type Tab = 'dashboard' | 'profesores' | 'fichajes';

const FichajesAdminPage: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [fichajes, setFichajes] = useState<Fichaje[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filters
  const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().split('T')[0]);
  const [profesorFiltro, setProfesorFiltro] = useState<string>('');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('');

  // Stats
  const [stats, setStats] = useState({
    totalFichajes: 0,
    completados: 0,
    pendientes: 0,
    enCurso: 0,
    totalHoras: 0,
  });

  // Fetch profesores
  const fetchProfesores = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/profesores`);
      const data = await res.json();
      if (data.success) {
        setProfesores(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching profesores:', err);
    }
  }, []);

  // Fetch fichajes
  const fetchFichajes = useCallback(async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/fichajes?fecha=${fechaFiltro}`;
      if (profesorFiltro) url += `&profesor_id=${profesorFiltro}`;
      if (estadoFiltro) url += `&estado=${estadoFiltro}`;

      const res = await fetch(url);
      const data: FichajesResponse = await res.json();

      if (data.success) {
        setFichajes(data.data || []);
        // Calculate stats
        const fichajes = data.data || [];
        setStats({
          totalFichajes: fichajes.length,
          completados: fichajes.filter(f => f.estado === 'completado').length,
          pendientes: fichajes.filter(f => f.estado === 'pendiente').length,
          enCurso: fichajes.filter(f => f.estado === 'entrada_registrada').length,
          totalHoras: data.meta?.totalHoras || 0,
        });
      }
    } catch (err) {
      console.error('Error fetching fichajes:', err);
    } finally {
      setLoading(false);
    }
  }, [fechaFiltro, profesorFiltro, estadoFiltro]);

  // Initial load
  useEffect(() => {
    fetchProfesores();
  }, [fetchProfesores]);

  useEffect(() => {
    fetchFichajes();
  }, [fetchFichajes]);

  // Clear messages
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

  // Export CSV
  const exportCSV = () => {
    const headers = ['Profesor', 'Clase', 'Fecha', 'Entrada', 'Salida', 'Minutos', 'Estado'];
    const rows = fichajes.map(f => [
      `${f.profesor?.nombre || ''} ${f.profesor?.apellidos || ''}`.trim(),
      f.clase_nombre,
      f.fecha,
      f.hora_inicio || '',
      f.hora_fin || '',
      f.minutos_trabajados?.toString() || '',
      f.estado,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fichajes_${fechaFiltro}.csv`;
    link.click();
  };

  // Format time
  const formatMinutes = (mins: number | null) => {
    if (!mins) return '-';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <>
      <Helmet>
        <title>Admin Fichajes - Farray&apos;s Center</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-100 pt-28">
        {/* Header */}
        <header className="bg-black/95 backdrop-blur-xl text-white py-4 px-6 shadow-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Fichajes</h1>
              <p className="text-gray-400 text-sm">Farray&apos;s Center</p>
            </div>
            <nav className="flex gap-2">
              {(['dashboard', 'fichajes', 'profesores'] as Tab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-white text-gray-900'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {tab === 'dashboard'
                    ? 'Dashboard'
                    : tab === 'fichajes'
                      ? 'Fichajes'
                      : 'Profesores'}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-7xl mx-auto p-6">
          {/* Messages */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl p-4 shadow">
                  <p className="text-gray-500 text-sm">Total Fichajes</p>
                  <p className="text-3xl font-bold text-brand-600">{stats.totalFichajes}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                  <p className="text-gray-500 text-sm">Completados</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completados}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                  <p className="text-gray-500 text-sm">En Curso</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.enCurso}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                  <p className="text-gray-500 text-sm">Pendientes</p>
                  <p className="text-3xl font-bold text-gray-600">{stats.pendientes}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                  <p className="text-gray-500 text-sm">Total Horas</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalHoras.toFixed(1)}h</p>
                </div>
              </div>

              {/* Date filter */}
              <div className="bg-white rounded-xl p-4 shadow">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                <input
                  type="date"
                  value={fechaFiltro}
                  onChange={e => setFechaFiltro(e.target.value)}
                  className="border rounded-lg px-3 py-2"
                />
              </div>

              {/* Today's fichajes */}
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="px-4 py-3 border-b bg-gray-50 flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800">Fichajes del día</h2>
                  <button
                    onClick={exportCSV}
                    className="text-sm bg-brand-100 text-brand-700 px-3 py-1 rounded hover:bg-brand-200"
                  >
                    Exportar CSV
                  </button>
                </div>
                {loading ? (
                  <div className="p-8 text-center text-gray-500">Cargando...</div>
                ) : fichajes.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No hay fichajes para esta fecha
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 text-left">
                        <tr>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Profesor</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Clase</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Entrada</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Salida</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Tiempo</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {fichajes.map(f => (
                          <tr key={f.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <span className="font-medium">
                                {f.profesor?.nombre} {f.profesor?.apellidos}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{f.clase_nombre}</td>
                            <td className="px-4 py-3">
                              <span className="font-mono">{f.hora_inicio || '-'}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-mono">{f.hora_fin || '-'}</span>
                            </td>
                            <td className="px-4 py-3">{formatMinutes(f.minutos_trabajados)}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  f.estado === 'completado'
                                    ? 'bg-green-100 text-green-700'
                                    : f.estado === 'entrada_registrada'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : f.estado === 'no_fichado'
                                        ? 'bg-red-100 text-red-700'
                                        : f.estado === 'clase_cancelada'
                                          ? 'bg-purple-100 text-purple-700 line-through'
                                          : f.estado === 'editado_admin'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {f.estado === 'completado'
                                  ? 'Completado'
                                  : f.estado === 'entrada_registrada'
                                    ? 'En curso'
                                    : f.estado === 'no_fichado'
                                      ? 'No fichado'
                                      : f.estado === 'clase_cancelada'
                                        ? 'Cancelada'
                                        : f.estado === 'editado_admin'
                                          ? 'Editado'
                                          : 'Pendiente'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fichajes Tab */}
          {activeTab === 'fichajes' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-xl p-4 shadow flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={fechaFiltro}
                    onChange={e => setFechaFiltro(e.target.value)}
                    className="border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profesor</label>
                  <select
                    value={profesorFiltro}
                    onChange={e => setProfesorFiltro(e.target.value)}
                    className="border rounded-lg px-3 py-2 min-w-[200px]"
                  >
                    <option value="">Todos</option>
                    {profesores
                      .filter(p => p.activo)
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} {p.apellidos}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={estadoFiltro}
                    onChange={e => setEstadoFiltro(e.target.value)}
                    className="border rounded-lg px-3 py-2"
                  >
                    <option value="">Todos</option>
                    <option value="completado">Completado</option>
                    <option value="entrada_registrada">En curso</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="no_fichado">No fichado</option>
                    <option value="clase_cancelada">Cancelada</option>
                    <option value="editado_admin">Editado</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={exportCSV}
                    className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700"
                  >
                    Exportar CSV
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">Cargando...</div>
                ) : fichajes.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No hay fichajes con estos filtros
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 text-left">
                        <tr>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Profesor</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Clase</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Fecha</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Entrada</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Salida</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Tiempo</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Estado</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Método</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {fichajes.map(f => (
                          <tr key={f.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">
                              {f.profesor?.nombre} {f.profesor?.apellidos}
                            </td>
                            <td className="px-4 py-3 text-gray-600">{f.clase_nombre}</td>
                            <td className="px-4 py-3">{f.fecha}</td>
                            <td className="px-4 py-3 font-mono">{f.hora_inicio || '-'}</td>
                            <td className="px-4 py-3 font-mono">{f.hora_fin || '-'}</td>
                            <td className="px-4 py-3">{formatMinutes(f.minutos_trabajados)}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  f.estado === 'completado'
                                    ? 'bg-green-100 text-green-700'
                                    : f.estado === 'entrada_registrada'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : f.estado === 'no_fichado'
                                        ? 'bg-red-100 text-red-700'
                                        : f.estado === 'clase_cancelada'
                                          ? 'bg-purple-100 text-purple-700 line-through'
                                          : f.estado === 'editado_admin'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {f.estado === 'completado'
                                  ? 'Completado'
                                  : f.estado === 'entrada_registrada'
                                    ? 'En curso'
                                    : f.estado === 'no_fichado'
                                      ? 'No fichado'
                                      : f.estado === 'clase_cancelada'
                                        ? 'Cancelada'
                                        : f.estado === 'editado_admin'
                                          ? 'Editado'
                                          : 'Pendiente'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {f.metodo_entrada || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profesores Tab */}
          {activeTab === 'profesores' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="px-4 py-3 border-b bg-gray-50">
                  <h2 className="font-semibold text-gray-800">Profesores</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="px-4 py-3 text-sm font-medium text-gray-600">Nombre</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-600">WhatsApp</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-600">
                          Nombre Momence
                        </th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-600">Contrato</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-600">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {profesores.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">
                            {p.nombre} {p.apellidos}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{p.telefono_whatsapp}</td>
                          <td className="px-4 py-3 text-gray-600">{p.nombre_momence}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs ${
                                p.tipo_contrato === 'completo'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-brand-100 text-brand-700'
                              }`}
                            >
                              {p.tipo_contrato === 'completo' ? 'Completo' : 'Parcial'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs ${
                                p.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {p.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Para añadir o modificar profesores, usa la API directamente o contacta con el
                administrador del sistema.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default FichajesAdminPage;
