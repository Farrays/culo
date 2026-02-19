/* eslint-disable no-undef */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * BookingsCalendarPage - Dashboard de gestión de reservas de prueba
 *
 * Features:
 * - Vista día/semana/mes con colores de estado
 * - Stats cards: total, confirmadas, no-show, canceladas, reprogramadas
 * - Filtros por clase y estado
 * - Acciones: WhatsApp, email, reprogramar, marcar asistencia
 * - Export CSV
 * - Botón "Reconciliar ahora" para trigger manual del cron
 */

// ============================================================================
// TYPES
// ============================================================================

interface AdminBooking {
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  className: string;
  classDate: string;
  classTime: string;
  classEndTime: string;
  category: string;
  status: 'confirmed' | 'cancelled';
  attendance: 'pending' | 'confirmed' | 'not_attending' | 'attended' | 'no_show';
  reconciliationStatus: string;
  momenceBookingId: number | null;
  sessionId: string | null;
  managementUrl: string;
  whatsappUrl: string;
  calendarEventId: string | null;
  bookedAt: string;
  rescheduledTo: string | null;
  rescheduledFrom: string | null;
  rescheduleCount: number;
}

interface DaySummary {
  date: string;
  total: number;
  confirmed: number;
  attended: number;
  noShow: number;
  cancelled: number;
  rescheduled: number;
  bookings: AdminBooking[];
}

interface ApiResponse {
  success: boolean;
  summary: {
    totalBookings: number;
    totalAttended: number;
    totalNoShow: number;
    totalCancelled: number;
    totalRescheduled: number;
    attendanceRate: number;
    dateRange: { from: string; to: string };
  };
  days: DaySummary[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

const API_BASE = '/api/';

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  attended: { bg: '#dcfce7', text: '#166534', label: 'Asistió' },
  confirmed: { bg: '#dcfce7', text: '#166534', label: 'Confirmado' },
  pending: { bg: '#f3f4f6', text: '#6b7280', label: 'Pendiente' },
  cancelled_on_time: { bg: '#fff7ed', text: '#9a3412', label: 'Cancelado a tiempo' },
  cancelled_late: { bg: '#fef2f2', text: '#991b1b', label: 'Cancel. tardía' },
  no_show: { bg: '#fef2f2', text: '#991b1b', label: 'No-show' },
  no_show_unresolved: { bg: '#fef2f2', text: '#991b1b', label: 'No-show (sin resolver)' },
  rescheduled: { bg: '#dbeafe', text: '#1e40af', label: 'Reprogramado' },
};

const STATUS_DOT_COLORS: Record<string, string> = {
  attended: '#22c55e',
  confirmed: '#86efac',
  pending: '#9ca3af',
  cancelled_on_time: '#f97316',
  cancelled_late: '#ef4444',
  no_show: '#ef4444',
  no_show_unresolved: '#ef4444',
  rescheduled: '#3b82f6',
};

type ViewMode = 'day' | 'week' | 'month';

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// ============================================================================
// HELPERS
// ============================================================================

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

function getWeekRange(date: Date): { from: string; to: string } {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(d.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    from: monday.toISOString().split('T')[0] as string,
    to: sunday.toISOString().split('T')[0] as string,
  };
}

function getMonthRange(date: Date): { from: string; to: string } {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    from: first.toISOString().split('T')[0] as string,
    to: last.toISOString().split('T')[0] as string,
  };
}

function getReconStatus(booking: AdminBooking): string {
  if (booking.reconciliationStatus && booking.reconciliationStatus !== 'pending') {
    return booking.reconciliationStatus;
  }
  if (booking.status === 'cancelled') return 'cancelled_on_time';
  if (booking.attendance === 'confirmed') return 'confirmed';
  return 'pending';
}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-+()]/g, '');
}

// ============================================================================
// COMPONENTS
// ============================================================================

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      style={{
        background: '#1e1e2e',
        border: '1px solid #2d2d44',
        borderRadius: 12,
        padding: '16px 20px',
        textAlign: 'center',
        borderTop: `3px solid ${color}`,
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function BookingCard({
  booking,
  onReschedule,
}: {
  booking: AdminBooking;
  onReschedule: (eventId: string) => void;
}) {
  const status = getReconStatus(booking);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const statusInfo = (STATUS_COLORS[status] ?? STATUS_COLORS['pending'])!;
  const phone = normalizePhone(booking.phone);
  const waPhone = phone.startsWith('34') ? phone : '34' + phone;

  return (
    <div
      style={{
        background: '#1e1e2e',
        border: '1px solid #2d2d44',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        borderLeft: `4px solid ${STATUS_DOT_COLORS[status] || '#9ca3af'}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#e5e7eb' }}>
              {booking.classTime} - {booking.classEndTime}
            </span>
            <span style={{ fontSize: 13, color: '#9ca3af' }}>{booking.className}</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginTop: 4 }}>
            {booking.firstName} {booking.lastName}
          </div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
            <span title={booking.email}>📧 {booking.email}</span>
            {' · '}
            <span>📱 {booking.phone}</span>
          </div>
          {booking.rescheduledFrom && (
            <div style={{ fontSize: 11, color: '#60a5fa', marginTop: 4 }}>
              🔄 Reprogramado desde: {booking.rescheduledFrom.substring(0, 20)}...
            </div>
          )}
        </div>
        <span
          style={{
            fontSize: 11,
            padding: '4px 10px',
            borderRadius: 20,
            background: statusInfo.bg,
            color: statusInfo.text,
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {statusInfo.label}
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <a
          href={`https://wa.me/${waPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 12,
            padding: '6px 12px',
            borderRadius: 6,
            background: '#25D366',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          💬 WhatsApp
        </a>
        <a
          href={`mailto:${booking.email}`}
          style={{
            fontSize: 12,
            padding: '6px 12px',
            borderRadius: 6,
            background: '#2d2d44',
            color: '#e5e7eb',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          📧 Email
        </a>
        {(status === 'no_show' || status === 'no_show_unresolved') &&
          booking.rescheduleCount < 1 && (
            <button
              onClick={() => onReschedule(booking.eventId)}
              style={{
                fontSize: 12,
                padding: '6px 12px',
                borderRadius: 6,
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              🔄 Reprogramar
            </button>
          )}
        <a
          href={`https://www.farrayscenter.com${booking.managementUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 12,
            padding: '6px 12px',
            borderRadius: 6,
            background: '#2d2d44',
            color: '#9ca3af',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          📋 Gestionar
        </a>
      </div>
    </div>
  );
}

function WeekView({
  days,
  onDayClick,
}: {
  days: DaySummary[];
  onDayClick: (date: string) => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 8,
        marginTop: 16,
      }}
    >
      {DAY_NAMES.map(name => (
        <div
          key={name}
          style={{ textAlign: 'center', fontSize: 12, color: '#6b7280', fontWeight: 600 }}
        >
          {name}
        </div>
      ))}
      {days.map(day => {
        const d = new Date(day.date + 'T12:00:00');
        const isToday = day.date === new Date().toISOString().split('T')[0];

        return (
          <div
            key={day.date}
            onClick={() => onDayClick(day.date)}
            style={{
              background: isToday ? '#2d2d54' : '#1e1e2e',
              border: isToday ? '2px solid #6366f1' : '1px solid #2d2d44',
              borderRadius: 8,
              padding: 8,
              textAlign: 'center',
              cursor: 'pointer',
              minHeight: 70,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: '#e5e7eb' }}>{d.getDate()}</div>
            {day.total > 0 && (
              <>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                  {day.total} reserva{day.total !== 1 ? 's' : ''}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 3,
                    marginTop: 4,
                    flexWrap: 'wrap',
                  }}
                >
                  {day.bookings.slice(0, 6).map(b => (
                    <div
                      key={b.eventId}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: STATUS_DOT_COLORS[getReconStatus(b)] || '#9ca3af',
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MonthView({
  days,
  onDayClick,
}: {
  days: DaySummary[];
  onDayClick: (date: string) => void;
}) {
  // Build month grid
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const firstDate = days.length > 0 ? new Date(days[0]!.date + 'T12:00:00') : new Date();
  const firstDayOfWeek = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1).getDay();
  const startPadding = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Monday start
  const daysInMonth = new Date(firstDate.getFullYear(), firstDate.getMonth() + 1, 0).getDate();

  const dayMap = new Map(days.map(d => [d.date, d]));

  const cells: (DaySummary | null)[] = [];
  // Padding
  for (let i = 0; i < startPadding; i++) cells.push(null);
  // Days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${firstDate.getFullYear()}-${String(firstDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    cells.push(
      dayMap.get(dateStr) || {
        date: dateStr,
        total: 0,
        confirmed: 0,
        attended: 0,
        noShow: 0,
        cancelled: 0,
        rescheduled: 0,
        bookings: [],
      }
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {DAY_NAMES.map(name => (
          <div
            key={name}
            style={{
              textAlign: 'center',
              fontSize: 11,
              color: '#6b7280',
              fontWeight: 600,
              padding: 4,
            }}
          >
            {name}
          </div>
        ))}
        {cells.map((cell, idx) => {
          if (!cell) return <div key={`pad-${idx}`} />;
          const isToday = cell.date === today;
          const dominant =
            cell.attended > cell.noShow
              ? '#22c55e'
              : cell.noShow > 0
                ? '#ef4444'
                : cell.total > 0
                  ? '#9ca3af'
                  : 'transparent';

          return (
            <div
              key={cell.date}
              onClick={() => cell.total > 0 && onDayClick(cell.date)}
              style={{
                background: isToday ? '#2d2d54' : '#1e1e2e',
                border: isToday ? '2px solid #6366f1' : '1px solid #2d2d44',
                borderRadius: 6,
                padding: 6,
                textAlign: 'center',
                cursor: cell.total > 0 ? 'pointer' : 'default',
                minHeight: 50,
                opacity: cell.total > 0 ? 1 : 0.5,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 500, color: '#e5e7eb' }}>
                {new Date(cell.date + 'T12:00:00').getDate()}
              </div>
              {cell.total > 0 && (
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: dominant,
                    marginTop: 2,
                  }}
                >
                  {cell.total}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Month summary */}
      {days.length > 0 && (
        <div
          style={{
            marginTop: 16,
            background: '#1e1e2e',
            border: '1px solid #2d2d44',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <h3 style={{ color: '#e5e7eb', fontSize: 14, margin: '0 0 8px' }}>Resumen del mes</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>
              Total:{' '}
              <strong style={{ color: '#e5e7eb' }}>{days.reduce((s, d) => s + d.total, 0)}</strong>
            </div>
            <div style={{ fontSize: 12, color: '#22c55e' }}>
              Asistieron: <strong>{days.reduce((s, d) => s + d.attended, 0)}</strong>
            </div>
            <div style={{ fontSize: 12, color: '#ef4444' }}>
              No-show: <strong>{days.reduce((s, d) => s + d.noShow, 0)}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function BookingsCalendarPage() {
  const [view, setView] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  // Get stored token
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('admin_bookings_token') || '';
    } catch {
      return '';
    }
  });

  const saveToken = (t: string) => {
    setToken(t);
    try {
      localStorage.setItem('admin_bookings_token', t);
    } catch {
      /* */
    }
  };

  // Fetch data
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let url: string;
      if (view === 'day') {
        const dateStr = currentDate.toISOString().split('T')[0];
        url = `${API_BASE}admin-bookings?date=${dateStr}`;
      } else if (view === 'week') {
        const { from, to } = getWeekRange(currentDate);
        url = `${API_BASE}admin-bookings?from=${from}&to=${to}`;
      } else {
        const { from, to } = getMonthRange(currentDate);
        url = `${API_BASE}admin-bookings?from=${from}&to=${to}`;
      }

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(url, { headers });
      if (!res.ok) {
        if (res.status === 401) {
          setError('Token no válido. Introduce el token de administración.');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [view, currentDate, token]);

  useEffect(() => {
    // In dev mode, load without token (API allows it). In prod, require token.
    if (token || import.meta.env.DEV) {
      fetchBookings();
    }
  }, [fetchBookings, token]);

  // Navigate
  const navigate = (direction: -1 | 1) => {
    const d = new Date(currentDate);
    if (view === 'day') d.setDate(d.getDate() + direction);
    else if (view === 'week') d.setDate(d.getDate() + 7 * direction);
    else d.setMonth(d.getMonth() + direction);
    setCurrentDate(d);
  };

  // Reschedule handler
  const handleReschedule = async (eventId: string) => {
    if (!confirm('¿Reprogramar esta reserva para la semana que viene?')) return;

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}admin-bookings-reschedule`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ eventId, mode: 'next_week', reason: 'manual', notifyStudent: true }),
      });

      const json = await res.json();
      if (json.success) {
        alert(`Reprogramado para ${json.newClassDate} a las ${json.newClassTime}`);
        fetchBookings(); // Refresh
      } else {
        alert(`Error: ${json.error}`);
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown'}`);
    }
  };

  // Export CSV
  const exportCSV = () => {
    if (!data) return;
    const rows = [
      ['Fecha', 'Hora', 'Clase', 'Nombre', 'Email', 'Teléfono', 'Estado', 'Asistencia'],
    ];
    for (const day of data.days) {
      for (const b of day.bookings) {
        rows.push([
          b.classDate,
          b.classTime,
          b.className,
          `${b.firstName} ${b.lastName}`,
          b.email,
          b.phone,
          STATUS_COLORS[getReconStatus(b)]?.label || 'Pendiente',
          b.attendance,
        ]);
      }
    }
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservas-prueba-${currentDate.toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter bookings
  const filteredDays = useMemo(() => {
    if (!data) return [];
    return data.days.map(day => ({
      ...day,
      bookings: day.bookings.filter(b => {
        if (classFilter && !b.className.toLowerCase().includes(classFilter.toLowerCase()))
          return false;
        if (statusFilter && getReconStatus(b) !== statusFilter) return false;
        return true;
      }),
    }));
  }, [data, classFilter, statusFilter]);

  // Day click handler for week/month views
  const handleDayClick = (dateStr: string) => {
    setCurrentDate(new Date(dateStr + 'T12:00:00'));
    setView('day');
  };

  // Unique class names for filter
  const classNames = useMemo(() => {
    if (!data) return [];
    const names = new Set<string>();
    for (const day of data.days) {
      for (const b of day.bookings) names.add(b.className);
    }
    return [...names].sort();
  }, [data]);

  // Title
  const title =
    view === 'day'
      ? formatDate(currentDate.toISOString().split('T')[0] as string)
      : view === 'week'
        ? `Semana del ${data?.summary?.dateRange?.from || ''}`
        : currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  return (
    <>
      <Helmet>
        <title>Reservas de Prueba | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div
        style={{
          minHeight: '100vh',
          background: '#0f0f1a',
          color: '#e5e7eb',
          fontFamily: "'Inter', -apple-system, sans-serif",
          padding: '24px 16px',
          maxWidth: 1000,
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>📅 Reservas de Prueba</h1>
          <input
            type="password"
            placeholder="Token admin..."
            value={token}
            onChange={e => saveToken(e.target.value)}
            style={{
              background: '#1e1e2e',
              border: '1px solid #2d2d44',
              borderRadius: 8,
              padding: '8px 12px',
              color: '#e5e7eb',
              fontSize: 13,
              width: 160,
            }}
          />
        </div>

        {/* View Toggle + Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', gap: 4 }}>
            {(['day', 'week', 'month'] as ViewMode[]).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: view === v ? '#6366f1' : '#1e1e2e',
                  color: view === v ? '#fff' : '#9ca3af',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {v === 'day' ? 'Día' : v === 'week' ? 'Semana' : 'Mes'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: 18,
              }}
            >
              ←
            </button>
            <span style={{ fontSize: 14, fontWeight: 600, minWidth: 200, textAlign: 'center' }}>
              {title}
            </span>
            <button
              onClick={() => navigate(1)}
              style={{
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: 18,
              }}
            >
              →
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #2d2d44',
                background: '#1e1e2e',
                color: '#e5e7eb',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Hoy
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              color: '#991b1b',
              padding: 16,
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>Cargando...</div>
        )}

        {data && !loading && (
          <>
            {/* Stats Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 12,
                marginBottom: 20,
              }}
            >
              <StatCard label="Total" value={data.summary.totalBookings} color="#e5e7eb" />
              <StatCard label="Asistieron" value={data.summary.totalAttended} color="#22c55e" />
              <StatCard label="No-show" value={data.summary.totalNoShow} color="#ef4444" />
              <StatCard label="Canceladas" value={data.summary.totalCancelled} color="#f97316" />
              <StatCard
                label="Reprogramadas"
                value={data.summary.totalRescheduled}
                color="#3b82f6"
              />
            </div>

            {/* Attendance Rate */}
            {data.summary.attendanceRate > 0 && (
              <div
                style={{
                  background: '#1e1e2e',
                  border: '1px solid #2d2d44',
                  borderRadius: 8,
                  padding: '8px 16px',
                  marginBottom: 16,
                  fontSize: 13,
                  color: '#9ca3af',
                }}
              >
                Tasa de asistencia:{' '}
                <strong
                  style={{ color: data.summary.attendanceRate >= 70 ? '#22c55e' : '#f97316' }}
                >
                  {data.summary.attendanceRate}%
                </strong>
              </div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <select
                value={classFilter}
                onChange={e => setClassFilter(e.target.value)}
                style={{
                  background: '#1e1e2e',
                  border: '1px solid #2d2d44',
                  borderRadius: 8,
                  padding: '8px 12px',
                  color: '#e5e7eb',
                  fontSize: 13,
                }}
              >
                <option value="">Todas las clases</option>
                {classNames.map(name => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{
                  background: '#1e1e2e',
                  border: '1px solid #2d2d44',
                  borderRadius: 8,
                  padding: '8px 12px',
                  color: '#e5e7eb',
                  fontSize: 13,
                }}
              >
                <option value="">Todos los estados</option>
                {Object.entries(STATUS_COLORS).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                onClick={exportCSV}
                style={{
                  marginLeft: 'auto',
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '1px solid #2d2d44',
                  background: '#1e1e2e',
                  color: '#e5e7eb',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                📥 Exportar CSV
              </button>
              <button
                onClick={fetchBookings}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#6366f1',
                  color: '#fff',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                🔄 Actualizar
              </button>
            </div>

            {/* Views */}
            {view === 'day' && (
              <div>
                {filteredDays.map(day => (
                  <div key={day.date}>
                    {filteredDays.length > 1 && (
                      <h3 style={{ fontSize: 14, color: '#9ca3af', margin: '16px 0 8px' }}>
                        {formatDate(day.date)}
                      </h3>
                    )}
                    {day.bookings.length === 0 && (
                      <div
                        style={{ color: '#6b7280', fontSize: 13, padding: 20, textAlign: 'center' }}
                      >
                        No hay reservas para este día
                      </div>
                    )}
                    {day.bookings.map(b => (
                      <BookingCard key={b.eventId} booking={b} onReschedule={handleReschedule} />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {view === 'week' && <WeekView days={filteredDays} onDayClick={handleDayClick} />}

            {view === 'month' && <MonthView days={filteredDays} onDayClick={handleDayClick} />}
          </>
        )}
      </div>
    </>
  );
}
