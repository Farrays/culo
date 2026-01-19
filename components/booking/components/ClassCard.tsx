/**
 * ClassCard Component - V1 Style
 * Compact class card - whole card is clickable for selection
 * Includes: +info button, share button, clickable teacher name
 */

import React, { memo, useCallback, useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import type { ClassData } from '../types/booking';
import { TEACHER_REGISTRY } from '../../../constants/teacher-registry';
import { getTeacherImagePath } from '../../../constants/teacher-images';
import { Portal } from './Portal';

// Teacher name mapping (Momence → Registry)
const INSTRUCTOR_NAME_TO_REGISTRY: Record<string, string> = {
  'Yunaisy Farray': 'yunaisy-farray',
  'Daniel Sené': 'daniel-sene',
  'Alejandro Miñoso': 'alejandro-minoso',
  'Sandra Gómez': 'sandra-gomez',
  'Isabel López': 'isabel-lopez',
  'Marcos Martínez': 'marcos-martinez',
  'Yasmina Fernández': 'yasmina-fernandez',
  'Lia Valdes': 'lia-valdes',
  'Iroel Bastarreche': 'iroel-bastarreche',
  'Charlie Breezy': 'charlie-breezy',
  'Eugenia Trujillo': 'eugenia-trujillo',
  'Mathias Font': 'mathias-font',
  'Carlos Canto': 'carlos-canto',
  Noemi: 'noemi',
  Redbhlue: 'redbhlue',
  'Juan Alvarez': 'juan-alvarez',
  CrisAg: 'crisag',
  'Grechén Méndez': 'grechen-mendez',
  // Short names / aliases
  Yunaisy: 'yunaisy-farray',
  Daniel: 'daniel-sene',
  Alejandro: 'alejandro-minoso',
  Sandra: 'sandra-gomez',
  Isabel: 'isabel-lopez',
  Marcos: 'marcos-martinez',
  Yasmina: 'yasmina-fernandez',
  Lia: 'lia-valdes',
  Lía: 'lia-valdes',
  Iroel: 'iroel-bastarreche',
  Charlie: 'charlie-breezy',
  Eugenia: 'eugenia-trujillo',
  Mathias: 'mathias-font',
  Carlos: 'carlos-canto',
  Juan: 'juan-alvarez',
  Grechén: 'grechen-mendez',
  Cris: 'crisag',
  'Cris Ag': 'crisag',
};

function findTeacherRegistryId(instructorName: string): string | undefined {
  if (!instructorName) return undefined;
  const exactMatch = INSTRUCTOR_NAME_TO_REGISTRY[instructorName];
  if (exactMatch) return exactMatch;
  const lowerName = instructorName.toLowerCase();
  for (const [name, id] of Object.entries(INSTRUCTOR_NAME_TO_REGISTRY)) {
    if (name.toLowerCase() === lowerName) return id;
  }
  const firstName = instructorName.split(' ')[0];
  if (firstName) {
    const partialMatch = INSTRUCTOR_NAME_TO_REGISTRY[firstName];
    if (partialMatch) return partialMatch;
  }
  return undefined;
}

// Icons
const CalendarIcon: React.FC<{ className?: string }> = memo(({ className }) => (
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
));
CalendarIcon.displayName = 'CalendarIcon';

const ClockIcon: React.FC<{ className?: string }> = memo(({ className }) => (
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
));
ClockIcon.displayName = 'ClockIcon';

const UserIcon: React.FC<{ className?: string }> = memo(({ className }) => (
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
));
UserIcon.displayName = 'UserIcon';

const ShareIcon: React.FC<{ className?: string }> = memo(({ className }) => (
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
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
    />
  </svg>
));
ShareIcon.displayName = 'ShareIcon';

const CheckIcon: React.FC<{ className?: string }> = memo(({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
));
CheckIcon.displayName = 'CheckIcon';

const XMarkIcon: React.FC<{ className?: string }> = memo(({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
));
XMarkIcon.displayName = 'XMarkIcon';

// Format duration helper
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}min`;
  if (hours > 0) return `${hours}h`;
  return `${mins}min`;
};

// Helper to check if class should show NEW badge
function isClassNew(classData: ClassData): boolean {
  if (!classData.isNew) return false;
  if (!classData.newUntil) return true; // No expiry = always show
  return new Date(classData.newUntil) > new Date();
}

interface ClassCardProps {
  classData: ClassData;
  onSelect: (classData: ClassData) => void;
  onShowInfo: (classData: ClassData) => void;
  isSelected?: boolean;
}

// Teacher Modal Component - with history management and proper scroll
const TeacherModal: React.FC<{
  teacherId: string;
  onClose: () => void;
}> = ({ teacherId, onClose }) => {
  const { t } = useI18n();
  const teacher = TEACHER_REGISTRY[teacherId];
  const historyPushedRef = React.useRef(false);

  // History management and body scroll lock
  React.useEffect(() => {
    // Set global flag to indicate modal is open
    window.__bookingModalOpen = true;

    // Push history state for modal
    if (!historyPushedRef.current) {
      window.history.pushState({ modal: 'teacher', bookingWidget: true }, '');
      historyPushedRef.current = true;
    }

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Handle browser back button
    const handlePopState = () => {
      historyPushedRef.current = false;
      window.__bookingModalOpen = false;
      onClose();
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('popstate', handlePopState);
      window.__bookingModalOpen = false;
    };
  }, [onClose]);

  // Close with history
  const handleClose = () => {
    if (historyPushedRef.current) {
      window.history.back();
    } else {
      onClose();
    }
  };

  if (!teacher) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
        onClick={handleClose}
      >
        <div
          className="relative bg-black border border-white/10 rounded-2xl p-6 max-w-md w-full max-h-[85vh] overflow-y-auto animate-fade-in"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full text-neutral/50 hover:text-neutral hover:bg-white/10 transition-all"
            aria-label={t('booking_modal_close')}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {/* Teacher photo */}
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary-accent/30">
              <img
                src={getTeacherImagePath(teacherId, 320)}
                alt={teacher.name}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 20%' }}
              />
            </div>
          </div>

          <h3 className="text-xl font-bold text-neutral text-center mb-2">{teacher.name}</h3>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {teacher.meta?.isDirector && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
                {t('booking_teacher_director')}
              </span>
            )}
            {teacher.meta?.origin && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-accent/20 text-primary-accent">
                {teacher.meta.origin}
              </span>
            )}
            {teacher.meta?.yearsExperience && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-neutral/70">
                {teacher.meta.yearsExperience}+ {t('booking_teacher_years')}
              </span>
            )}
          </div>

          {/* Bio */}
          <p className="text-neutral/80 text-sm leading-relaxed text-center mb-6">
            {t(teacher.canonicalBioKey)}
          </p>

          {/* Styles taught */}
          <div className="mb-4">
            <p className="text-xs text-neutral/50 text-center mb-2">
              {t('booking_teacher_teaches')}
            </p>
            <div className="flex flex-wrap justify-center gap-1">
              {teacher.teachesStyles.slice(0, 5).map(style => (
                <span
                  key={style}
                  className="px-2 py-0.5 rounded text-xs bg-primary-accent/10 text-primary-accent/80 capitalize"
                >
                  {style.replace(/-/g, ' ')}
                </span>
              ))}
              {teacher.teachesStyles.length > 5 && (
                <span className="px-2 py-0.5 rounded text-xs bg-white/5 text-neutral/50">
                  +{teacher.teachesStyles.length - 5}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-3 bg-white/10 text-neutral font-semibold rounded-xl hover:bg-white/20 transition-colors"
          >
            {t('booking_modal_close')}
          </button>
        </div>
      </div>
    </Portal>
  );
};

// Memoized ClassCard - V1 compact style
export const ClassCard: React.FC<ClassCardProps> = memo(
  ({ classData, onSelect, onShowInfo, isSelected = false }) => {
    const { t, locale } = useI18n();
    const [copied, setCopied] = useState(false);
    const [teacherModalId, setTeacherModalId] = useState<string | null>(null);

    const handleCardClick = useCallback(() => {
      if (!classData.isFull) {
        onSelect(classData);
      }
    }, [onSelect, classData]);

    const handleInfoClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onShowInfo(classData);
      },
      [onShowInfo, classData]
    );

    const handleShareClick = useCallback(
      async (e: React.MouseEvent) => {
        e.stopPropagation();
        const baseUrl = window.location.origin;
        const shareUrl = `${baseUrl}/${locale}/reservas?classId=${classData.id}`;
        try {
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      },
      [classData.id, locale]
    );

    const handleTeacherClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        const registryId = findTeacherRegistryId(classData.instructor);
        if (registryId) {
          setTeacherModalId(registryId);
        }
      },
      [classData.instructor]
    );

    const teacherRegistryId = findTeacherRegistryId(classData.instructor);

    // Handle keyboard events for accessibility (Enter/Space to select)
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (classData.isFull) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(classData);
        }
      },
      [classData, onSelect]
    );

    return (
      <>
        <div
          role="button"
          tabIndex={classData.isFull ? -1 : 0}
          onClick={handleCardClick}
          onKeyDown={handleKeyDown}
          aria-disabled={classData.isFull}
          className={`
            w-full p-4 rounded-2xl border-2 text-left transition-all duration-300
            ${
              isSelected
                ? 'border-primary-accent bg-primary-accent/10'
                : classData.isFull
                  ? 'border-white/10 bg-white/5 opacity-60 cursor-not-allowed'
                  : 'border-white/10 bg-white/5 hover:border-primary-accent hover:bg-white/10 cursor-pointer'
            }
          `}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              {/* Class name with optional NEW badge - no truncate for full visibility */}
              <h3 className="font-bold text-neutral mb-1 leading-tight">
                {isClassNew(classData) && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 rounded mr-1.5 uppercase tracking-wide">
                    {t('booking_class_new')}
                  </span>
                )}
                {classData.name}
              </h3>

              {/* Class details - responsive layout */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral/70">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                  {classData.dayOfWeek} {classData.date}
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4 flex-shrink-0" />
                  {classData.time}
                </span>
                <span className="text-neutral/50">{formatDuration(classData.duration)}</span>
              </div>

              {/* Instructor on separate line for better mobile visibility */}
              {classData.instructor && (
                <div className="mt-1 text-sm">
                  {teacherRegistryId ? (
                    <button
                      type="button"
                      onClick={handleTeacherClick}
                      className="flex items-center gap-1 text-primary-accent hover:text-primary-accent/80 transition-colors"
                      title={t('booking_teacher_view_profile')}
                    >
                      <UserIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="underline underline-offset-2">{classData.instructor}</span>
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-neutral/70">
                      <UserIcon className="w-4 h-4 flex-shrink-0" />
                      {classData.instructor}
                    </span>
                  )}
                </div>
              )}

              {/* Full indicator */}
              {classData.isFull && (
                <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium text-red-400 bg-red-400/10 rounded">
                  {t('booking_class_full')}
                </span>
              )}
            </div>

            {/* Action buttons - positioned for mobile and desktop */}
            <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0 self-start sm:self-auto">
              <div className="flex items-center gap-2">
                {/* Info button - text style like V1 */}
                {classData.description && (
                  <button
                    type="button"
                    onClick={handleInfoClick}
                    className="px-2 py-1 rounded-lg text-xs font-medium text-primary-accent hover:bg-primary-accent/10 transition-all"
                    aria-label={t('booking_class_info')}
                  >
                    +info
                  </button>
                )}

                {/* Share button */}
                <button
                  type="button"
                  onClick={handleShareClick}
                  className="p-1.5 rounded-lg text-neutral/50 hover:text-primary-accent hover:bg-white/10 transition-all"
                  aria-label={copied ? t('booking_class_copied') : t('booking_class_share')}
                  title={copied ? t('booking_class_copied') : t('booking_class_share')}
                >
                  {copied ? (
                    <CheckIcon className="w-4 h-4 text-green-400" />
                  ) : (
                    <ShareIcon className="w-4 h-4" />
                  )}
                </button>

                {/* Selected indicator */}
                {isSelected && <CheckIcon className="w-5 h-5 text-primary-accent" />}
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Modal */}
        {teacherModalId && (
          <TeacherModal teacherId={teacherModalId} onClose={() => setTeacherModalId(null)} />
        )}
      </>
    );
  }
);

ClassCard.displayName = 'ClassCard';

export default ClassCard;
