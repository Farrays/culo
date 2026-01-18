/**
 * ClassCard Component
 * Individual class card with booking action
 */

import React from 'react';
import { useI18n } from '../../../hooks/useI18n';
import type { ClassData } from '../types/booking';
import { getStyleColor } from '../constants/bookingOptions';

// Clock icon
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

// User icon for instructor
const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

// Info icon
const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// Users icon for spots
const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

interface ClassCardProps {
  classData: ClassData;
  onSelect: (classData: ClassData) => void;
  onShowInfo: (classData: ClassData) => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({ classData, onSelect, onShowInfo }) => {
  const { t } = useI18n();
  const styleColor = getStyleColor(classData.style);

  // Format duration
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    }
    return `${mins}min`;
  };

  // Spots status
  const spotsText = classData.isFull
    ? t('booking_class_full')
    : classData.spotsAvailable <= 3
      ? t('booking_class_spots_few', { count: classData.spotsAvailable })
      : t('booking_class_spots_available', { count: classData.spotsAvailable });

  const spotsClass = classData.isFull
    ? 'text-red-400'
    : classData.spotsAvailable <= 3
      ? 'text-amber-400'
      : 'text-emerald-400';

  return (
    <div
      className="
        group relative bg-white/5 hover:bg-white/10
        rounded-2xl border border-white/10 hover:border-white/20
        transition-all duration-300
        overflow-hidden
      "
    >
      {/* Style color accent */}
      <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: styleColor }} />

      <div className="p-5 pl-6">
        {/* Header: Style badge + Time */}
        <div className="flex items-start justify-between mb-3">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: styleColor }}
          >
            {classData.style.charAt(0).toUpperCase() + classData.style.slice(1)}
          </span>
          <div className="flex items-center gap-1.5 text-neutral/70 text-sm">
            <ClockIcon className="w-4 h-4" />
            <span>{classData.time}</span>
          </div>
        </div>

        {/* Class name */}
        <h3 className="text-lg font-semibold text-neutral mb-2 line-clamp-2">{classData.name}</h3>

        {/* Info row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral/70 mb-3">
          {/* Instructor */}
          {classData.instructor && (
            <div className="flex items-center gap-1.5">
              <UserIcon className="w-4 h-4" />
              <span>{classData.instructor}</span>
            </div>
          )}

          {/* Duration */}
          <div className="flex items-center gap-1.5">
            <ClockIcon className="w-4 h-4" />
            <span>{formatDuration(classData.duration)}</span>
          </div>

          {/* Level */}
          {classData.level && (
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs">
              {classData.level.charAt(0).toUpperCase() + classData.level.slice(1)}
            </span>
          )}
        </div>

        {/* Spots available */}
        <div className={`flex items-center gap-1.5 text-sm mb-4 ${spotsClass}`}>
          <UsersIcon className="w-4 h-4" />
          <span>{spotsText}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Book button */}
          <button
            type="button"
            onClick={() => onSelect(classData)}
            disabled={classData.isFull}
            className={`
              flex-1 py-2.5 px-4 rounded-xl font-medium text-sm
              transition-all duration-200
              ${
                classData.isFull
                  ? 'bg-white/10 text-neutral/50 cursor-not-allowed'
                  : 'bg-primary-accent hover:bg-primary-accent/90 text-white shadow-lg shadow-primary-accent/30 hover:shadow-primary-accent/40'
              }
            `}
          >
            {classData.isFull ? t('booking_class_full') : t('booking_select_class')}
          </button>

          {/* Info button */}
          <button
            type="button"
            onClick={() => onShowInfo(classData)}
            className="
              p-2.5 rounded-xl bg-white/10 text-neutral/70
              hover:bg-white/20 hover:text-neutral
              transition-colors duration-200
            "
            aria-label={t('booking_class_info')}
          >
            <InfoIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
