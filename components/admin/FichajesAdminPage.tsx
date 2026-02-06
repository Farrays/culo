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

  // Edit modal
  const [editingFichaje, setEditingFichaje] = useState<Fichaje | null>(null);
  const [editForm, setEditForm] = useState({
    hora_inicio: '',
    hora_fin: '',
    estado: '',
    motivo_edicion: '',
  });

  // Fetch profesores
  const fetchProfesores = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}profesores`);
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
      let url = `${API_BASE}fichajes?fecha=${fechaFiltro}`;
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

  // Open edit modal
  const openEditModal = (fichaje: Fichaje) => {
    setEditingFichaje(fichaje);
    setEditForm({
      hora_inicio: fichaje.hora_inicio || '',
      hora_fin: fichaje.hora_fin || '',
      estado: fichaje.estado,
      motivo_edicion: '',
    });
  };

  // Save edited fichaje
  const saveEditedFichaje = async () => {
    if (!editingFichaje) return;
    if (!editForm.motivo_edicion.trim()) {
      setError('El motivo de edición es obligatorio');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}fichajes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingFichaje.id,
          hora_inicio: editForm.hora_inicio || null,
          hora_fin: editForm.hora_fin || null,
          estado: editForm.estado,
          motivo_edicion: editForm.motivo_edicion,
          editado_por: 'admin',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Fichaje actualizado correctamente');
        setEditingFichaje(null);
        fetchFichajes();
      } else {
        setError(data.error || 'Error al actualizar');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error updating fichaje:', err);
    } finally {
      setLoading(false);
    }
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

      <div className="min-h-screen bg-gray-100 pt-20">
        {/* Header con logo */}
        <header className="bg-black/95 backdrop-blur-xl text-white py-4 px-6 shadow-lg border-b border-brand-600/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src="/images/logo/img/logo-fidc_256.webp"
                  alt="Farray's Center"
                  className="h-10 w-auto"
                />
                <div>
                  <h1 className="text-xl font-bold">Gestión de Fichajes</h1>
                  <p className="text-brand-400 text-xs">Panel de administración</p>
                </div>
              </div>
              <nav className="flex gap-2">
                {(['dashboard', 'fichajes', 'profesores'] as Tab[]).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-brand-600 text-white'
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
                          <th className="px-4 py-3 text-sm font-medium text-gray-600"></th>
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
                            <td className="px-4 py-3">
                              <button
                                onClick={() => openEditModal(f)}
                                className="text-brand-600 hover:text-brand-800 text-sm font-medium"
                              >
                                Editar
                              </button>
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
                          <th className="px-4 py-3 text-sm font-medium text-gray-600"></th>
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
                            <td className="px-4 py-3">
                              <button
                                onClick={() => openEditModal(f)}
                                className="text-brand-600 hover:text-brand-800 text-sm font-medium"
                              >
                                Editar
                              </button>
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

        {/* Footer con info legal */}
        <footer className="mt-8 py-4 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-gray-500 text-xs">
              Sistema de registro de jornada conforme al Art. 34.9 del Estatuto de los Trabajadores
              y RD-ley 8/2019
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Los registros se conservan durante 4 años y están disponibles para los trabajadores,
              sus representantes legales y la Inspección de Trabajo.
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Farray&apos;s International Dance Center &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>

        {/* Edit Modal */}
        {editingFichaje && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Editar Fichaje</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Profesor</p>
                  <p className="font-medium">
                    {editingFichaje.profesor?.nombre} {editingFichaje.profesor?.apellidos}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Clase</p>
                  <p className="font-medium">{editingFichaje.clase_nombre}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium">{editingFichaje.fecha}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora Entrada
                    </label>
                    <input
                      type="time"
                      value={editForm.hora_inicio}
                      onChange={e => setEditForm({ ...editForm, hora_inicio: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora Salida
                    </label>
                    <input
                      type="time"
                      value={editForm.hora_fin}
                      onChange={e => setEditForm({ ...editForm, hora_fin: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={editForm.estado}
                    onChange={e => setEditForm({ ...editForm, estado: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="entrada_registrada">En curso</option>
                    <option value="completado">Completado</option>
                    <option value="no_fichado">No fichado</option>
                    <option value="clase_cancelada">Cancelada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motivo de edición *
                  </label>
                  <textarea
                    value={editForm.motivo_edicion}
                    onChange={e => setEditForm({ ...editForm, motivo_edicion: e.target.value })}
                    placeholder="Ej: Corrección de hora de salida por error del profesor"
                    className="w-full border rounded-lg px-3 py-2 min-h-[80px]"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Obligatorio para trazabilidad legal</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingFichaje(null)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveEditedFichaje}
                  disabled={loading || !editForm.motivo_edicion.trim()}
                  className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FichajesAdminPage;
