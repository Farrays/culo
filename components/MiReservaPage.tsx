import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// ============================================================================
// TYPES
// ============================================================================

interface BookingData {
  eventId: string;
  firstName: string;
  className: string;
  classDate: string;
  classDateISO?: string; // YYYY-MM-DD for calendar
  classTime: string;
  category: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  emailMasked: string;
}

type PageState = 'loading' | 'success' | 'error' | 'not_found' | 'cancelled' | 'cancelling';

// ============================================================================
// CONSTANTS
// ============================================================================

const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/QwDZvqvz4uyVfSWq7';
const WHATSAPP_SUPPORT = 'https://wa.me/34622247085';
const LOCATION = "Farray's International Dance Center, C/ Entença 100, 08015 Barcelona";

// ============================================================================
// CALENDAR HELPERS
// ============================================================================

function generateGoogleCalendarUrl(data: {
  title: string;
  description: string;
  location: string;
  startDate: string; // ISO YYYY-MM-DD
  startTime: string; // HH:mm
  durationMinutes: number;
}): string {
  const dateMatch = data.startDate.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!dateMatch) return '';

  const [, year, month, day] = dateMatch;
  const [hours, minutes] = data.startTime.split(':');

  const startFormatted = `${year}${month}${day}T${hours}${minutes}00`;

  const startMins = parseInt(hours || '0') * 60 + parseInt(minutes || '0');
  const endMins = startMins + data.durationMinutes;
  const endHours = String(Math.floor(endMins / 60)).padStart(2, '0');
  const endMinutes = String(endMins % 60).padStart(2, '0');
  const endFormatted = `${year}${month}${day}T${endHours}${endMinutes}00`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: data.title,
    dates: `${startFormatted}/${endFormatted}`,
    details: data.description,
    location: data.location,
    ctz: 'Europe/Madrid',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function generateIcsContent(data: {
  title: string;
  description: string;
  location: string;
  startDate: string;
  startTime: string;
  durationMinutes: number;
  uid: string;
}): string {
  const dateMatch = data.startDate.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!dateMatch) return '';

  const [, year, month, day] = dateMatch;
  const [hours, minutes] = data.startTime.split(':');

  const startFormatted = `${year}${month}${day}T${hours}${minutes}00`;

  const startMins = parseInt(hours || '0') * 60 + parseInt(minutes || '0');
  const endMins = startMins + data.durationMinutes;
  const endHours = String(Math.floor(endMins / 60)).padStart(2, '0');
  const endMinutes = String(endMins % 60).padStart(2, '0');
  const endFormatted = `${year}${month}${day}T${endHours}${endMinutes}00`;

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Farray's Center//Booking System//ES
BEGIN:VEVENT
UID:${data.uid}@farrayscenter.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART;TZID=Europe/Madrid:${startFormatted}
DTEND;TZID=Europe/Madrid:${endFormatted}
SUMMARY:${data.title}
DESCRIPTION:${data.description.replace(/\n/g, '\\n')}
LOCATION:${data.location}
END:VEVENT
END:VCALENDAR`;
}

// ============================================================================
// COMPONENT
// ============================================================================

const MiReservaPage: React.FC = () => {
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [state, setState] = useState<PageState>('loading');
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [error, setError] = useState<string>('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const locale = i18n.language || 'es';

  const fetchBooking = useCallback(async () => {
    try {
      const response = await fetch(`/api/mi-reserva?token=${token}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        setState('not_found');
        setError(data.error || 'Reserva no encontrada');
        return;
      }

      setBooking(data.booking);
      setState(data.booking.status === 'cancelled' ? 'cancelled' : 'success');
    } catch {
      setState('error');
      setError('Error al cargar los datos');
    }
  }, [token]);

  // Fetch booking data on mount
  useEffect(() => {
    if (!token) {
      setState('not_found');
      setError('No se proporcionó un token válido');
      return;
    }

    fetchBooking();
  }, [token, fetchBooking]);

  const handleCancel = async () => {
    if (!booking) return;

    setState('cancelling');

    try {
      const response = await fetch(`/api/cancelar?eventId=${booking.eventId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        setState('cancelled');
        setBooking({ ...booking, status: 'cancelled' });
      } else {
        setState('error');
        setError(data.error || 'Error al cancelar');
      }
    } catch {
      setState('error');
      setError('Error de conexión');
    }

    setShowCancelConfirm(false);
  };

  // Format date for display
  const formatDisplayDate = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      // If already formatted (contains letters), return as is
      if (/[a-zA-Z]/.test(dateStr)) return dateStr;

      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;

      return new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Europe/Madrid',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <Helmet>
        <title>Mi Reserva | Farray&apos;s Center</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to={`/${locale}`} className="inline-block mb-6">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                Farray&apos;s Center
              </h1>
            </Link>
          </div>

          {/* Loading State */}
          {state === 'loading' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-white/80">Cargando tu reserva...</p>
            </div>
          )}

          {/* Not Found State */}
          {state === 'not_found' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-white mb-4">Reserva no encontrada</h2>
              <p className="text-white/70 mb-6">{error}</p>
              <p className="text-white/60 text-sm mb-6">
                El enlace puede haber expirado o la reserva ya no existe.
              </p>
              <Link
                to={`/${locale}/reservas`}
                className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition"
              >
                Hacer nueva reserva
              </Link>
            </div>
          )}

          {/* Error State */}
          {state === 'error' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-white mb-4">Ha ocurrido un error</h2>
              <p className="text-white/70 mb-6">{error}</p>
              <button
                onClick={fetchBooking}
                className="inline-block px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Success State - Booking Details */}
          {(state === 'success' || state === 'cancelling') && booking && (
            <div className="space-y-6">
              {/* Status Banner */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-center text-white">
                <div className="text-4xl mb-2">✅</div>
                <h2 className="text-2xl font-bold">¡Reserva Confirmada!</h2>
                <p className="opacity-90">Tu clase de prueba te espera</p>
              </div>

              {/* Booking Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
                <div className="text-center border-b border-white/20 pb-4">
                  <p className="text-white/60 text-sm">Hola,</p>
                  <p className="text-2xl font-bold text-white">{booking.firstName}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60">Clase</span>
                    <span className="text-white font-semibold">{booking.className}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60">Fecha</span>
                    <span className="text-white font-semibold capitalize">
                      {formatDisplayDate(booking.classDate)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60">Hora</span>
                    <span className="text-white font-semibold">{booking.classTime}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-white/60">Ubicación</span>
                    <span className="text-white font-semibold">C/ Entença 100, Barcelona</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-white/60">Email</span>
                    <span className="text-white/80">{booking.emailMasked}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                >
                  <span>📍</span> Cómo llegar
                </a>

                <a
                  href={WHATSAPP_SUPPORT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                >
                  <span>💬</span> WhatsApp
                </a>
              </div>

              {/* Calendar Buttons */}
              {(() => {
                // Try to get ISO date from classDateISO or extract from classDate
                const classDateISO =
                  booking.classDateISO || booking.classDate?.match(/\d{4}-\d{2}-\d{2}/)?.[0];

                if (!classDateISO) return null;

                const calendarData = {
                  title: `Clase de Prueba: ${booking.className}`,
                  description: `Tu clase de prueba en Farray's Center`,
                  location: LOCATION,
                  startDate: classDateISO,
                  startTime: booking.classTime,
                  durationMinutes: 60,
                };

                const googleUrl = generateGoogleCalendarUrl(calendarData);
                const icsContent = generateIcsContent({
                  ...calendarData,
                  uid: booking.eventId,
                });
                const icsDataUri = icsContent
                  ? `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`
                  : '';

                if (!googleUrl) return null;

                return (
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-blue-200 mb-3 text-center">
                      📅 Añadir al calendario
                    </h3>
                    <p className="text-white/70 text-sm text-center mb-4">
                      No olvides tu clase - añádela a tu calendario
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={googleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition"
                      >
                        Google Calendar
                      </a>
                      {icsDataUri && (
                        <a
                          href={icsDataUri}
                          download="clase-farrays.ics"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition"
                        >
                          Apple / Outlook
                        </a>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* What to bring */}
              <div className="bg-amber-500/20 border border-amber-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-amber-200 mb-3">¿Qué traer?</h3>
                <ul className="space-y-2 text-white/80">
                  <li className="flex items-center gap-2">
                    <span>👕</span> Ropa cómoda para bailar
                  </li>
                  <li className="flex items-center gap-2">
                    <span>💧</span> Agua
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🎉</span> ¡Muchas ganas de pasarlo bien!
                  </li>
                </ul>
              </div>

              {/* Cancel Button */}
              <div className="pt-4 border-t border-white/10">
                {!showCancelConfirm ? (
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="w-full py-3 text-red-400 hover:text-red-300 transition text-sm"
                  >
                    ¿Necesitas cancelar tu reserva?
                  </button>
                ) : (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 space-y-4">
                    <p className="text-white text-center">¿Estás seguro de que quieres cancelar?</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowCancelConfirm(false)}
                        className="flex-1 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
                        disabled={state === 'cancelling'}
                      >
                        No, mantener
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                        disabled={state === 'cancelling'}
                      >
                        {state === 'cancelling' ? 'Cancelando...' : 'Sí, cancelar'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cancelled State */}
          {state === 'cancelled' && booking && (
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">😔</div>
                <h2 className="text-2xl font-bold text-white mb-4">Reserva Cancelada</h2>
                <p className="text-white/70 mb-2">
                  Tu clase de <strong>{booking.className}</strong> ha sido cancelada.
                </p>
                <p className="text-white/60 text-sm mb-6">
                  La plaza ha quedado libre para que otra persona pueda aprovecharla.
                </p>

                <div className="space-y-3">
                  <Link
                    to={`/${locale}/reservas`}
                    className="block w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition"
                  >
                    Reservar otra clase gratis
                  </Link>

                  <a
                    href={WHATSAPP_SUPPORT}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition"
                  >
                    ¿Dudas? Escríbenos
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center text-white/40 text-sm">
            <p>Farray&apos;s International Dance Center</p>
            <p>C/ Entença 100, 08015 Barcelona</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default MiReservaPage;
