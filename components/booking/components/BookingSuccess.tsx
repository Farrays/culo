/**
 * BookingSuccess Component
 * Success state after successful booking
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../../hooks/useI18n';
import type { ClassData } from '../types/booking';
import { generateGoogleCalendarUrl, downloadICSFile } from '../../../utils/calendarExport';

// Icons
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
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
);

interface BookingSuccessProps {
  selectedClass: ClassData;
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({ selectedClass }) => {
  const { t, locale } = useI18n();

  // Studio address - single source of truth
  const STUDIO_ADDRESS =
    "Farray's International Dance Center, Carrer d'Entença 100, 08015 Barcelona";

  // Handle Google Calendar
  const handleAddToGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl({
      title: selectedClass.name,
      startTime: selectedClass.rawStartsAt,
      durationMinutes: selectedClass.duration,
      description: selectedClass.description,
      location: STUDIO_ADDRESS,
    });
    window.open(url, '_blank');
  };

  // Handle ICS download
  const handleDownloadICS = () => {
    downloadICSFile({
      title: selectedClass.name,
      startTime: selectedClass.rawStartsAt,
      durationMinutes: selectedClass.duration,
      description: selectedClass.description,
      location: STUDIO_ADDRESS,
    });
  };

  return (
    <div className="animate-fade-in text-center py-8">
      {/* Success icon with glow effect */}
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-green-500/30 rounded-full blur-xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center transform hover:scale-110 transition-transform">
          <CheckIcon className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-neutral mb-4">{t('booking_success_title')}</h2>

      {/* Message */}
      <p className="text-neutral/80 mb-6">{t('booking_success_message')}</p>

      {/* Class details */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 text-left">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-primary-accent" />
            <div>
              <p className="text-xs text-neutral/60">{t('booking_success_class')}</p>
              <p className="font-semibold text-neutral">{selectedClass.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ClockIcon className="w-5 h-5 text-primary-accent" />
            <div>
              <p className="text-xs text-neutral/60">{t('booking_success_date')}</p>
              <p className="font-semibold text-neutral">
                {selectedClass.dayOfWeek} {selectedClass.date} • {selectedClass.time}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPinIcon className="w-5 h-5 text-primary-accent" />
            <div>
              <p className="text-xs text-neutral/60">{t('booking_success_location')}</p>
              <p className="font-semibold text-neutral">{t('booking_success_address')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add to Calendar buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
        <button
          type="button"
          onClick={handleAddToGoogleCalendar}
          className="
            flex items-center justify-center gap-2 px-4 py-2.5
            bg-white/10 hover:bg-white/20 border border-white/20
            rounded-xl transition-colors text-neutral
          "
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.5 4H18V3a1 1 0 0 0-2 0v1H8V3a1 1 0 0 0-2 0v1H4.5A2.5 2.5 0 0 0 2 6.5v13A2.5 2.5 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-13A2.5 2.5 0 0 0 19.5 4zM20 19.5a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5V10h16v9.5zM20 8H4V6.5a.5.5 0 0 1 .5-.5H6v1a1 1 0 0 0 2 0V6h8v1a1 1 0 0 0 2 0V6h1.5a.5.5 0 0 1 .5.5V8z" />
          </svg>
          <span className="text-sm font-medium">{t('booking_calendar_google')}</span>
        </button>
        <button
          type="button"
          onClick={handleDownloadICS}
          className="
            flex items-center justify-center gap-2 px-4 py-2.5
            bg-white/10 hover:bg-white/20 border border-white/20
            rounded-xl transition-colors text-neutral
          "
        >
          <CalendarIcon className="w-5 h-5" />
          <span className="text-sm font-medium">{t('booking_calendar_download')}</span>
        </button>
      </div>

      {/* Reminder */}
      <p className="text-sm text-neutral/60 mb-6">{t('booking_success_reminder')}</p>

      {/* CTA */}
      <Link
        to={`/${locale}/clases/baile-barcelona`}
        className="
          inline-block px-6 py-3 bg-primary-accent text-white
          font-semibold rounded-xl hover:bg-primary-accent/90 transition-colors
        "
      >
        {t('booking_success_cta')}
      </Link>
    </div>
  );
};

export default BookingSuccess;
