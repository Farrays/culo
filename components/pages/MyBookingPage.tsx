import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';

/**
 * MyBookingPage - Página de gestión de reserva (Magic Link)
 *
 * Recibe email y eventId por query params y muestra los detalles de la reserva
 * Permite al usuario reprogramar o cancelar su reserva
 */

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  className: string;
  classDate: string;
  classTime: string;
  momenceEventId: string;
  bookedAt: string;
  category?: string;
}

type LoadingState = 'loading' | 'success' | 'error' | 'not-found' | 'cancelled';

const MyBookingPage: React.FC = () => {
  const { i18n } = useTranslation(['common', 'booking']);
  const locale = i18n.language;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelledBooking, setCancelledBooking] = useState<BookingData | null>(null);

  // Helper to extract style slug for URL filtering
  const getStyleSlug = (className: string): string | null => {
    const lower = className.toLowerCase();
    // Map class names to URL-friendly style slugs
    if (lower.includes('bachata')) return 'bachata';
    if (lower.includes('salsa')) return 'salsa-cubana';
    if (lower.includes('dancehall')) return 'dancehall';
    if (lower.includes('heels') || lower.includes('femmology')) return 'heels';
    if (lower.includes('twerk')) return 'twerk';
    if (lower.includes('hip hop') || lower.includes('hip-hop')) return 'hip-hop';
    if (lower.includes('sexy style')) return 'sexy-style';
    if (lower.includes('reggaeton')) return 'sexy-reggaeton';
    if (lower.includes('afrobeat')) return 'afrobeats';
    if (lower.includes('afro jazz')) return 'afro-jazz';
    if (lower.includes('contempor')) return 'contemporaneo';
    if (lower.includes('ballet')) return 'ballet';
    return null; // No specific filter
  };

  // Get display name for the class type (simplified)
  const getClassTypeDisplay = (className: string): string => {
    const lower = className.toLowerCase();
    if (lower.includes('bachata')) return 'Bachata';
    if (lower.includes('salsa')) return 'Salsa';
    if (lower.includes('dancehall')) return 'Dancehall';
    if (lower.includes('heels') || lower.includes('femmology')) return 'Heels';
    if (lower.includes('twerk')) return 'Twerk';
    if (lower.includes('hip hop') || lower.includes('hip-hop')) return 'Hip Hop';
    if (lower.includes('sexy style')) return 'Sexy Style';
    if (lower.includes('reggaeton')) return 'Reggaeton';
    if (lower.includes('afrobeat')) return 'Afrobeats';
    if (lower.includes('afro jazz')) return 'Afro Jazz';
    if (lower.includes('contempor')) return 'Contemporáneo';
    if (lower.includes('ballet')) return 'Ballet';
    return className.split(' ')[0] || className; // Return first word
  };

  const email = searchParams.get('email');
  const eventId = searchParams.get('event');

  useEffect(() => {
    if (!email) {
      setLoadingState('error');
      setErrorMessage('No se proporcionó email');
      return;
    }

    const fetchBooking = async () => {
      try {
        const queryParams = eventId
          ? `email=${encodeURIComponent(email)}&event=${encodeURIComponent(eventId)}`
          : `email=${encodeURIComponent(email)}`;

        const response = await fetch(`/api/mi-reserva?${queryParams}`);
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            setLoadingState('not-found');
            setErrorMessage(data.message || 'Reserva no encontrada');
          } else {
            setLoadingState('error');
            setErrorMessage(data.error || 'Error al cargar la reserva');
          }
          return;
        }

        setBooking(data.booking);
        setLoadingState('success');
      } catch (err) {
        console.error('Error fetching booking:', err);
        setLoadingState('error');
        setErrorMessage('Error de conexión');
      }
    };

    fetchBooking();
  }, [email, eventId]);

  // Handle cancel booking
  const handleCancelBooking = async () => {
    if (!email || !booking) return;

    setIsCancelling(true);
    try {
      const response = await fetch('/api/cancelar-reserva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          eventId: booking.momenceEventId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save booking info before clearing for reschedule options
        setCancelledBooking(booking);
        setShowCancelModal(false);
        setLoadingState('cancelled');
      } else {
        setErrorMessage(data.message || 'Error al cancelar la reserva');
        setShowCancelModal(false);
        setLoadingState('error');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setErrorMessage('Error de conexión');
      setShowCancelModal(false);
      setLoadingState('error');
    } finally {
      setIsCancelling(false);
    }
  };

  // SEO metadata
  const title =
    locale === 'es'
      ? "Mi Reserva | Farray's Center"
      : locale === 'ca'
        ? "La Meva Reserva | Farray's Center"
        : locale === 'en'
          ? "My Booking | Farray's Center"
          : "Ma Réservation | Farray's Center";

  const description =
    locale === 'es'
      ? "Gestiona tu reserva de clase en Farray's Center Barcelona"
      : locale === 'ca'
        ? "Gestiona la teva reserva de classe a Farray's Center Barcelona"
        : locale === 'en'
          ? "Manage your class booking at Farray's Center Barcelona"
          : "Gérez votre réservation de cours chez Farray's Center Barcelone";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black pt-8 md:pt-16 pb-16">
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary-dark/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            {/* Logo */}
            <div className="text-center mb-8">
              <img
                src="/images/logo/img/logo-fidc_256.png"
                alt="Farray's International Dance Center"
                className="w-20 h-20 mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-white">
                {locale === 'es' && 'Mi Reserva'}
                {locale === 'ca' && 'La Meva Reserva'}
                {locale === 'en' && 'My Booking'}
                {locale === 'fr' && 'Ma Réservation'}
              </h1>
            </div>

            {/* Loading state */}
            {loadingState === 'loading' && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-primary-accent border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-400">
                  {locale === 'es' && 'Cargando tu reserva...'}
                  {locale === 'ca' && 'Carregant la teva reserva...'}
                  {locale === 'en' && 'Loading your booking...'}
                  {locale === 'fr' && 'Chargement de votre réservation...'}
                </p>
              </div>
            )}

            {/* Error state */}
            {loadingState === 'error' && (
              <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {locale === 'es' && 'Error'}
                  {locale === 'ca' && 'Error'}
                  {locale === 'en' && 'Error'}
                  {locale === 'fr' && 'Erreur'}
                </h2>
                <p className="text-gray-400 mb-6">{errorMessage}</p>
                <button
                  onClick={() => navigate(`/${locale}/reservas`)}
                  className="px-6 py-3 bg-primary-accent hover:bg-primary-dark text-white rounded-lg transition-colors"
                >
                  {locale === 'es' && 'Hacer nueva reserva'}
                  {locale === 'ca' && 'Fer nova reserva'}
                  {locale === 'en' && 'Make new booking'}
                  {locale === 'fr' && 'Faire nouvelle réservation'}
                </button>
              </div>
            )}

            {/* Cancelled state */}
            {loadingState === 'cancelled' && (
              <div className="space-y-6">
                <div className="bg-green-500/10 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {locale === 'es' && 'Reserva Cancelada'}
                    {locale === 'ca' && 'Reserva Cancel·lada'}
                    {locale === 'en' && 'Booking Cancelled'}
                    {locale === 'fr' && 'Réservation Annulée'}
                  </h2>
                  <p className="text-gray-400 mb-6">
                    {locale === 'es' && 'Tu reserva ha sido cancelada correctamente.'}
                    {locale === 'ca' && 'La teva reserva ha estat cancel·lada correctament.'}
                    {locale === 'en' && 'Your booking has been cancelled successfully.'}
                    {locale === 'fr' && 'Votre réservation a été annulée avec succès.'}
                  </p>
                </div>

                {/* Reschedule options */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3 text-center">
                    {locale === 'es' && '¿Quieres reprogramar?'}
                    {locale === 'ca' && 'Vols reprogramar?'}
                    {locale === 'en' && 'Want to reschedule?'}
                    {locale === 'fr' && 'Voulez-vous reprogrammer?'}
                  </h3>
                  <p className="text-gray-400 mb-5 text-sm text-center">
                    {locale === 'es' && 'Elige una opción para reservar tu nueva clase.'}
                    {locale === 'ca' && 'Escull una opció per reservar la teva nova classe.'}
                    {locale === 'en' && 'Choose an option to book your new class.'}
                    {locale === 'fr' && 'Choisissez une option pour réserver votre nouveau cours.'}
                  </p>

                  <div className="space-y-3">
                    {/* Option 1: Same class type - only show if we have a style */}
                    {cancelledBooking && getStyleSlug(cancelledBooking.className) && (
                      <button
                        onClick={() => {
                          const style = getStyleSlug(cancelledBooking.className);
                          navigate(`/${locale}/reservas${style ? `?style=${style}` : ''}`);
                        }}
                        className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-primary-accent hover:bg-primary-dark text-white rounded-xl transition-colors font-semibold"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {locale === 'es' &&
                          `Otra clase de ${getClassTypeDisplay(cancelledBooking.className)}`}
                        {locale === 'ca' &&
                          `Altra classe de ${getClassTypeDisplay(cancelledBooking.className)}`}
                        {locale === 'en' &&
                          `Another ${getClassTypeDisplay(cancelledBooking.className)} class`}
                        {locale === 'fr' &&
                          `Autre cours de ${getClassTypeDisplay(cancelledBooking.className)}`}
                      </button>
                    )}

                    {/* Option 2: All classes */}
                    <button
                      onClick={() => navigate(`/${locale}/reservas`)}
                      className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        />
                      </svg>
                      {locale === 'es' && 'Ver todas las clases'}
                      {locale === 'ca' && 'Veure totes les classes'}
                      {locale === 'en' && 'View all classes'}
                      {locale === 'fr' && 'Voir tous les cours'}
                    </button>
                  </div>
                </div>

                {/* Contact info */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-gray-400 text-sm">
                    {locale === 'es' && '¿Necesitas ayuda?'}
                    {locale === 'ca' && 'Necessites ajuda?'}
                    {locale === 'en' && 'Need help?'}
                    {locale === 'fr' && "Besoin d'aide?"}
                  </p>
                  <a
                    href="https://wa.me/34622247085"
                    className="text-primary-accent hover:text-primary-dark transition-colors text-sm"
                  >
                    WhatsApp: +34 622 24 70 85
                  </a>
                </div>
              </div>
            )}

            {/* Not found state */}
            {loadingState === 'not-found' && (
              <div className="bg-yellow-500/10 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {locale === 'es' && 'Reserva no encontrada'}
                  {locale === 'ca' && 'Reserva no trobada'}
                  {locale === 'en' && 'Booking not found'}
                  {locale === 'fr' && 'Réservation non trouvée'}
                </h2>
                <p className="text-gray-400 mb-6">
                  {locale === 'es' &&
                    'Es posible que la reserva haya expirado o ya haya sido procesada.'}
                  {locale === 'ca' &&
                    'És possible que la reserva hagi caducat o ja hagi estat processada.'}
                  {locale === 'en' && 'The booking may have expired or already been processed.'}
                  {locale === 'fr' && 'La réservation a peut-être expiré ou a déjà été traitée.'}
                </p>
                <button
                  onClick={() => navigate(`/${locale}/reservas`)}
                  className="px-6 py-3 bg-primary-accent hover:bg-primary-dark text-white rounded-lg transition-colors"
                >
                  {locale === 'es' && 'Hacer nueva reserva'}
                  {locale === 'ca' && 'Fer nova reserva'}
                  {locale === 'en' && 'Make new booking'}
                  {locale === 'fr' && 'Faire nouvelle réservation'}
                </button>
              </div>
            )}

            {/* Success state - Show booking details */}
            {loadingState === 'success' && booking && (
              <div className="space-y-6">
                {/* Booking confirmed card */}
                <div className="bg-green-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        {locale === 'es' && 'Reserva Confirmada'}
                        {locale === 'ca' && 'Reserva Confirmada'}
                        {locale === 'en' && 'Booking Confirmed'}
                        {locale === 'fr' && 'Réservation Confirmée'}
                      </h2>
                      <p className="text-green-400 text-sm">
                        {locale === 'es' && `Hola ${booking.firstName}, tu clase está reservada`}
                        {locale === 'ca' &&
                          `Hola ${booking.firstName}, la teva classe està reservada`}
                        {locale === 'en' && `Hi ${booking.firstName}, your class is booked`}
                        {locale === 'fr' && `Bonjour ${booking.firstName}, votre cours est réservé`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Class details card */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {locale === 'es' && 'Detalles de la Clase'}
                    {locale === 'ca' && 'Detalls de la Classe'}
                    {locale === 'en' && 'Class Details'}
                    {locale === 'fr' && 'Détails du Cours'}
                  </h3>

                  <div className="space-y-4">
                    {/* Class name */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-accent/20 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-primary-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          {locale === 'es' && 'Clase'}
                          {locale === 'ca' && 'Classe'}
                          {locale === 'en' && 'Class'}
                          {locale === 'fr' && 'Cours'}
                        </p>
                        <p className="text-white font-medium">{booking.className}</p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-accent/20 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-primary-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          {locale === 'es' && 'Fecha'}
                          {locale === 'ca' && 'Data'}
                          {locale === 'en' && 'Date'}
                          {locale === 'fr' && 'Date'}
                        </p>
                        <p className="text-white font-medium">{booking.classDate}</p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-accent/20 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-primary-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          {locale === 'es' && 'Hora'}
                          {locale === 'ca' && 'Hora'}
                          {locale === 'en' && 'Time'}
                          {locale === 'fr' && 'Heure'}
                        </p>
                        <p className="text-white font-medium">{booking.classTime}</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-accent/20 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-primary-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">
                          {locale === 'es' && 'Lugar'}
                          {locale === 'ca' && 'Lloc'}
                          {locale === 'en' && 'Location'}
                          {locale === 'fr' && 'Lieu'}
                        </p>
                        <p className="text-white font-medium">
                          Farray&apos;s International Dance Center
                        </p>
                        <p className="text-gray-400 text-sm">
                          Carrer d&apos;Entença 100, Barcelona
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {/* Cancel/Reschedule button */}
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {locale === 'es' && 'Reprogramar / Cancelar Reserva'}
                    {locale === 'ca' && 'Reprogramar / Cancel·lar Reserva'}
                    {locale === 'en' && 'Reschedule / Cancel Booking'}
                    {locale === 'fr' && 'Reprogrammer / Annuler Réservation'}
                  </button>
                </div>

                {/* Contact info */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                  <p className="text-gray-400 text-sm">
                    {locale === 'es' && '¿Necesitas ayuda?'}
                    {locale === 'ca' && 'Necessites ajuda?'}
                    {locale === 'en' && 'Need help?'}
                    {locale === 'fr' && "Besoin d'aide?"}
                  </p>
                  <a
                    href="https://wa.me/34622247085"
                    className="text-primary-accent hover:text-primary-dark transition-colors text-sm"
                  >
                    WhatsApp: +34 622 24 70 85
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] rounded-2xl p-6 max-w-md w-full border border-white/10 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {locale === 'es' && '¿Cancelar o reprogramar?'}
                {locale === 'ca' && 'Cancel·lar o reprogramar?'}
                {locale === 'en' && 'Cancel or reschedule?'}
                {locale === 'fr' && 'Annuler ou reprogrammer?'}
              </h3>
              <p className="text-gray-400 text-sm">
                {locale === 'es' &&
                  'Para reprogramar tu clase primero es obligatorio cancelarla. Después podrás elegir una nueva fecha.'}
                {locale === 'ca' &&
                  'Per reprogramar la teva classe primer és obligatori cancel·lar-la. Després podràs escollir una nova data.'}
                {locale === 'en' &&
                  'To reschedule your class, you must first cancel it. Then you can choose a new date.'}
                {locale === 'fr' &&
                  "Pour reprogrammer votre cours, vous devez d'abord l'annuler. Ensuite, vous pourrez choisir une nouvelle date."}
              </p>
            </div>

            {/* Class info reminder */}
            {booking && (
              <div className="bg-white/5 rounded-lg p-3 mb-6 text-center">
                <p className="text-white font-medium">{booking.className}</p>
                <p className="text-gray-400 text-sm">
                  {booking.classDate} - {booking.classTime}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors disabled:opacity-50"
              >
                {locale === 'es' && 'No, volver'}
                {locale === 'ca' && 'No, tornar'}
                {locale === 'en' && 'No, go back'}
                {locale === 'fr' && 'Non, retour'}
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={isCancelling}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {locale === 'es' && 'Cancelando...'}
                    {locale === 'ca' && 'Cancel·lant...'}
                    {locale === 'en' && 'Cancelling...'}
                    {locale === 'fr' && 'Annulation...'}
                  </>
                ) : (
                  <>
                    {locale === 'es' && 'Sí, cancelar'}
                    {locale === 'ca' && 'Sí, cancel·lar'}
                    {locale === 'en' && 'Yes, cancel'}
                    {locale === 'fr' && 'Oui, annuler'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyBookingPage;
