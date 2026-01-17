import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import {
  CheckIcon,
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  ShareIcon,
} from '../../lib/icons';
import { trackLeadConversion, LEAD_VALUES, pushToDataLayer } from '../../utils/analytics';
import { generateGoogleCalendarUrl, downloadICSFile } from '../../utils/calendarExport';

// ============================================================================
// TYPES
// ============================================================================

interface ClassData {
  id: number;
  name: string;
  date: string;
  time: string;
  dayOfWeek: string;
  spotsAvailable: number;
  isFull: boolean;
  location: string;
  instructor: string;
  style: string;
  level: string;
  rawStartsAt: string;
  duration: number; // Duration in minutes
  description: string; // Class description from Momence
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // RGPD Consents - Mandatory
  acceptsTerms: boolean;
  acceptsMarketing: boolean;
  acceptsAge: boolean;
  acceptsNoRefund: boolean;
  acceptsPrivacy: boolean;
  // Conditional (Heels)
  acceptsHeels: boolean;
  // Optional
  acceptsImage: boolean;
}

type Step = 'style' | 'class' | 'form';
type Status = 'idle' | 'loading' | 'success' | 'error';

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Formats duration in minutes to a readable format
 * 60 → "1h", 90 → "1h 30min", 45 → "45min"
 */
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}min`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}min`;
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Helper to generate mock classes across weeks
function generateMockClasses(): ClassData[] {
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const classTemplates = [
    {
      name: 'Salsa Cubana - Iniciación',
      style: 'salsa',
      level: 'iniciacion',
      instructor: 'Yunaisy Farray',
      time: '19:00',
      dayOfWeek: 1,
      duration: 60,
      description:
        'Aprende los pasos básicos de la salsa cubana en un ambiente divertido. Ideal para principiantes sin experiencia previa.',
    },
    {
      name: 'Bachata Sensual - Básico',
      style: 'bachata',
      level: 'basico',
      instructor: 'Iroel',
      time: '20:00',
      dayOfWeek: 1,
      duration: 60,
      description:
        'Desarrolla tu conexión con la música y tu pareja. Trabajaremos ondas corporales, aislaciones y musicalidad.',
    },
    {
      name: 'Heels - Todos los niveles',
      style: 'heels',
      level: 'abierto',
      instructor: 'Lía',
      time: '18:30',
      dayOfWeek: 2,
      duration: 60,
      description:
        'Baila con tacones y libera tu lado más sensual. Coreografías de estilo comercial que trabajan la feminidad y la confianza.',
    },
    {
      name: 'Dancehall - Intermedio',
      style: 'dancehall',
      level: 'intermedio',
      instructor: 'Yunaisy Farray',
      time: '19:30',
      dayOfWeek: 2,
      duration: 60,
      description:
        'Sumérgete en la cultura jamaicana con movimientos explosivos. Se requiere conocimiento previo de los pasos básicos.',
    },
    {
      name: 'Hip Hop - Iniciación',
      style: 'hiphop',
      level: 'iniciacion',
      instructor: 'Alex',
      time: '17:00',
      dayOfWeek: 3,
      duration: 60,
      description:
        'Descubre los fundamentos del hip hop: grooves, bounces y aislaciones. Perfecto para empezar desde cero.',
    },
    {
      name: 'Reggaeton - Básico',
      style: 'reggaeton',
      level: 'basico',
      instructor: 'Iroel',
      time: '18:00',
      dayOfWeek: 3,
      duration: 60,
      description:
        'Aprende a moverte con el ritmo del reggaeton. Coreografías urbanas con movimientos de cadera y actitud.',
    },
    {
      name: 'Twerk - Todos los niveles',
      style: 'twerk',
      level: 'abierto',
      instructor: 'Lía',
      time: '19:00',
      dayOfWeek: 4,
      duration: 60,
      description:
        'Trabaja la técnica del twerk con ejercicios de aislación de glúteos. Clase divertida y de alto impacto.',
    },
    {
      name: 'Afrobeats - Iniciación',
      style: 'afro',
      level: 'iniciacion',
      instructor: 'Yunaisy Farray',
      time: '20:00',
      dayOfWeek: 4,
      duration: 60,
      description:
        'Explora los ritmos africanos contemporáneos. Movimientos enérgicos que conectan cuerpo y música.',
    },
    {
      name: 'Commercial Dance',
      style: 'commercial',
      level: 'abierto',
      instructor: 'Alex',
      time: '17:30',
      dayOfWeek: 5,
      duration: 60,
      description:
        'Coreografías estilo videoclip mezclando hip hop, jazz y dancehall. El estilo que ves en los videos de tus artistas favoritos.',
    },
    {
      name: 'K-Pop - Iniciación',
      style: 'kpop',
      level: 'iniciacion',
      instructor: 'Lía',
      time: '16:00',
      dayOfWeek: 6,
      duration: 75,
      description:
        'Aprende las coreografías de tus grupos favoritos de K-Pop. Clase perfecta para fans que quieren bailar como sus idols.',
    },
    {
      name: 'Yoga para Bailarines',
      style: 'yoga',
      level: 'abierto',
      instructor: 'María',
      time: '10:00',
      dayOfWeek: 6,
      duration: 90,
      description:
        'Sesión de yoga diseñada para bailarines. Mejora tu flexibilidad, equilibrio y recuperación muscular.',
    },
    {
      name: 'Stretching & Flexibilidad',
      style: 'stretching',
      level: 'abierto',
      instructor: 'María',
      time: '11:30',
      dayOfWeek: 6,
      duration: 45,
      description:
        'Estiramientos profundos para aumentar tu rango de movimiento. Ideal como complemento a cualquier estilo de baile.',
    },
  ];

  const classes: ClassData[] = [];
  const now = new Date();

  // Generate classes for 4 weeks
  for (let week = 0; week < 4; week++) {
    classTemplates.forEach((template, idx) => {
      // Find the next occurrence of this weekday
      const targetDay = template.dayOfWeek;
      const currentDay = now.getDay();
      let daysUntil = targetDay - currentDay;
      if (daysUntil < 0) daysUntil += 7;
      daysUntil += week * 7; // Add weeks offset

      const classDate = new Date(now.getTime() + daysUntil * 24 * 60 * 60 * 1000);
      const timeParts = template.time.split(':').map(Number);
      const hours = timeParts[0] ?? 0;
      const minutes = timeParts[1] ?? 0;
      classDate.setHours(hours, minutes, 0, 0);

      // Skip if the class is in the past
      if (classDate < now) return;

      classes.push({
        id: 1000 + week * 100 + idx,
        name: template.name,
        date: classDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
        time: template.time,
        dayOfWeek: dayNames[classDate.getDay()] ?? 'Lunes',
        spotsAvailable: Math.floor(Math.random() * 10) + 2,
        isFull: false,
        location: "Farray's Center",
        instructor: template.instructor,
        style: template.style,
        level: template.level,
        rawStartsAt: classDate.toISOString(),
        duration: template.duration,
        description: template.description,
      });
    });
  }

  return classes.sort(
    (a, b) => new Date(a.rawStartsAt).getTime() - new Date(b.rawStartsAt).getTime()
  );
}

// Mock data for development (API only works in Vercel)
const MOCK_CLASSES = generateMockClasses();

const STYLE_OPTIONS = [
  { value: '', labelKey: 'booking_style_all', color: '#B01E3C' },
  { value: 'salsa', label: 'Salsa', color: '#FF6B6B' },
  { value: 'bachata', label: 'Bachata', color: '#C44569' },
  { value: 'hiphop', label: 'Hip Hop', color: '#574B90' },
  { value: 'reggaeton', label: 'Reggaeton', color: '#F8B500' },
  { value: 'heels', label: 'Heels', color: '#FF69B4' },
  { value: 'dancehall', label: 'Dancehall', color: '#00D9A5' },
  { value: 'afro', label: 'Afro', color: '#FF8C00' },
  { value: 'twerk', label: 'Twerk', color: '#FF1493' },
  { value: 'commercial', label: 'Commercial', color: '#4834D4' },
  { value: 'kpop', label: 'K-Pop', color: '#A29BFE' },
  { value: 'yoga', label: 'Yoga', color: '#00B894' },
  { value: 'stretching', label: 'Stretching', color: '#81ECEC' },
];

// Estilos que requieren checkbox de heels
const HEELS_STYLES = ['heels', 'girly'];

// Filter options
const LEVEL_OPTIONS = [
  { value: '', labelKey: 'booking_filter_all' },
  { value: 'iniciacion', labelKey: 'booking_filter_level_iniciacion' },
  { value: 'basico', labelKey: 'booking_filter_level_basico' },
  { value: 'intermedio', labelKey: 'booking_filter_level_intermedio' },
  { value: 'avanzado', labelKey: 'booking_filter_level_avanzado' },
  { value: 'abierto', labelKey: 'booking_filter_level_abierto' },
];

const DAY_OPTIONS = [
  { value: '', labelKey: 'booking_filter_all' },
  { value: 'Lunes', labelKey: 'booking_filter_day_monday' },
  { value: 'Martes', labelKey: 'booking_filter_day_tuesday' },
  { value: 'Miércoles', labelKey: 'booking_filter_day_wednesday' },
  { value: 'Jueves', labelKey: 'booking_filter_day_thursday' },
  { value: 'Viernes', labelKey: 'booking_filter_day_friday' },
  { value: 'Sábado', labelKey: 'booking_filter_day_saturday' },
  { value: 'Domingo', labelKey: 'booking_filter_day_sunday' },
];

const TIME_BLOCK_OPTIONS: { value: string; labelKey: string; range?: [number, number] }[] = [
  { value: '', labelKey: 'booking_filter_all' },
  { value: 'morning', labelKey: 'booking_filter_time_morning', range: [0, 12] },
  { value: 'afternoon', labelKey: 'booking_filter_time_afternoon', range: [12, 18] },
  { value: 'evening', labelKey: 'booking_filter_time_evening', range: [18, 24] },
];

interface Filters {
  level: string;
  day: string;
  timeBlock: string;
  instructor: string;
}

const INITIAL_FILTERS: Filters = {
  level: '',
  day: '',
  timeBlock: '',
  instructor: '',
};

// ============================================================================
// COMPONENT
// ============================================================================

const BookingWidget: React.FC = memo(function BookingWidget() {
  const { t, locale } = useI18n();
  const [searchParams] = useSearchParams();

  // State
  const [step, setStep] = useState<Step>('style');
  const [selectedStyle, setSelectedStyle] = useState<string>(searchParams.get('style') || '');
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [classes, setClasses] = useState<ClassData[]>([]);
  // Initialize styles from mock data in dev mode, so step 1 buttons work
  const [stylesAvailable, setStylesAvailable] = useState<string[]>(
    import.meta.env.DEV ? [...new Set(MOCK_CLASSES.map(c => c.style))] : []
  );
  const [status, setStatus] = useState<Status>('idle');
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // Week navigation state
  const [weekOffset, setWeekOffset] = useState(0);
  // Advanced filters state
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  // Dropdown open state
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    acceptsTerms: false,
    acceptsMarketing: false,
    acceptsAge: false,
    acceptsNoRefund: false,
    acceptsPrivacy: false,
    acceptsHeels: false,
    acceptsImage: false,
  });

  // Check if heels consent is required
  const requiresHeelsConsent = useMemo(() => {
    if (!selectedClass) return false;
    return HEELS_STYLES.some(s => selectedClass.style.toLowerCase().includes(s));
  }, [selectedClass]);

  // ============================================================================
  // FETCH CLASSES
  // ============================================================================

  // Helper to filter classes by week offset
  const filterByWeek = useCallback((classesData: ClassData[], offset: number) => {
    const now = new Date();
    // Get start of current week (Monday)
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() + mondayOffset + offset * 7);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    endOfWeek.setHours(0, 0, 0, 0);

    return classesData.filter(c => {
      const classDate = new Date(c.rawStartsAt);
      // For week 0 (current week), also include classes today even if we're mid-week
      if (offset === 0) {
        return classDate >= now && classDate < endOfWeek;
      }
      return classDate >= startOfWeek && classDate < endOfWeek;
    });
  }, []);

  // Calculate which week offset a class belongs to (0-3)
  const calculateWeekOffset = useCallback((classDate: Date): number => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() + mondayOffset);
    startOfCurrentWeek.setHours(0, 0, 0, 0);

    const diffMs = classDate.getTime() - startOfCurrentWeek.getTime();
    const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));

    // Clamp to 0-3 range
    return Math.max(0, Math.min(3, diffWeeks));
  }, []);

  // Find the week offset of the earliest upcoming class
  const findNextClassWeekOffset = useCallback(
    (classesData: ClassData[]): number => {
      const now = new Date();
      // Filter only future classes and sort by date
      const futureClasses = classesData
        .filter(c => new Date(c.rawStartsAt) >= now)
        .sort((a, b) => new Date(a.rawStartsAt).getTime() - new Date(b.rawStartsAt).getTime());

      if (futureClasses.length === 0) return 0;

      const nextClass = futureClasses[0];
      if (!nextClass) return 0;

      return calculateWeekOffset(new Date(nextClass.rawStartsAt));
    },
    [calculateWeekOffset]
  );

  // Apply advanced filters to classes
  const applyAdvancedFilters = useCallback(
    (classesData: ClassData[], currentFilters: Filters): ClassData[] => {
      let filtered = classesData;

      if (currentFilters.level) {
        filtered = filtered.filter(c => c.level === currentFilters.level);
      }
      if (currentFilters.day) {
        filtered = filtered.filter(c => c.dayOfWeek === currentFilters.day);
      }
      if (currentFilters.timeBlock) {
        const timeOption = TIME_BLOCK_OPTIONS.find(t => t.value === currentFilters.timeBlock);
        if (timeOption?.range) {
          const [min, max] = timeOption.range;
          filtered = filtered.filter(c => {
            const hour = parseInt(c.time.split(':')[0] ?? '0', 10);
            return hour >= min && hour < max;
          });
        }
      }
      if (currentFilters.instructor) {
        filtered = filtered.filter(c => c.instructor === currentFilters.instructor);
      }

      return filtered;
    },
    []
  );

  const fetchClasses = useCallback(
    async (styleFilter?: string, currentWeekOffset?: number, currentFilters?: Filters) => {
      setLoadingClasses(true);
      setErrorMessage('');

      try {
        // In development, use mock data (API only works in Vercel)
        if (import.meta.env.DEV) {
          await new Promise(resolve => setTimeout(resolve, 300)); // Simulate loading

          // First filter by style
          let filtered = styleFilter
            ? MOCK_CLASSES.filter(c => c.style === styleFilter)
            : MOCK_CLASSES;

          // Then filter by week
          filtered = filterByWeek(filtered, currentWeekOffset ?? 0);

          // Apply advanced filters
          if (currentFilters) {
            filtered = applyAdvancedFilters(filtered, currentFilters);
          }

          setClasses(filtered);
          setStylesAvailable([...new Set(MOCK_CLASSES.map(c => c.style))]);
          return;
        }

        // For production, adjust days based on week offset
        const daysParam = 7 + (currentWeekOffset ?? 0) * 7;
        const url = styleFilter
          ? `/api/clases?style=${encodeURIComponent(styleFilter)}&days=${daysParam}`
          : `/api/clases?days=${daysParam}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          let classes = data.data.classes || [];
          // Filter by the specific week
          classes = filterByWeek(classes, currentWeekOffset ?? 0);
          // Apply advanced filters
          if (currentFilters) {
            classes = applyAdvancedFilters(classes, currentFilters);
          }
          setClasses(classes);
          setStylesAvailable(data.data.stylesAvailable || []);
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        setErrorMessage(t('booking_class_error'));
        setClasses([]);
      } finally {
        setLoadingClasses(false);
      }
    },
    [t, filterByWeek, applyAdvancedFilters]
  );

  // Initial load and when style, week, or filters change
  useEffect(() => {
    if (step === 'class') {
      fetchClasses(selectedStyle || undefined, weekOffset, filters);
    }
  }, [step, selectedStyle, weekOffset, filters, fetchClasses]);

  // If URL has style or classId param, handle deep linking
  useEffect(() => {
    const styleParam = searchParams.get('style');
    const classIdParam = searchParams.get('classId');

    if (classIdParam) {
      // Deep link to specific class - go directly to form
      const classId = parseInt(classIdParam, 10);

      if (import.meta.env.DEV) {
        // In dev, find the class in mock data
        const foundClass = MOCK_CLASSES.find(c => c.id === classId);
        if (foundClass) {
          setSelectedClass(foundClass);
          setSelectedStyle(foundClass.style);
          setStep('form');
        } else {
          // Class not found, fall back to style selection
          if (styleParam) {
            setSelectedStyle(styleParam);
            setStep('class');
          }
        }
      } else {
        // In production, fetch the class from API
        fetch(`/api/clases?days=28`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              const foundClass = data.data.classes.find((c: ClassData) => c.id === classId);
              if (foundClass) {
                setSelectedClass(foundClass);
                setSelectedStyle(foundClass.style);
                setStep('form');
              } else if (styleParam) {
                setSelectedStyle(styleParam);
                setStep('class');
              }
            }
          })
          .catch(console.error);
      }
    } else if (styleParam) {
      setSelectedStyle(styleParam);
      setStep('class');
    }
  }, [searchParams]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleStyleSelect = async (style: string) => {
    setSelectedStyle(style);

    // Track style selection
    pushToDataLayer({
      event: 'booking_style_selected',
      style: style || 'all',
    });

    // Auto-navigate to the week with the next available class
    try {
      let classesForStyle: ClassData[] = [];

      if (import.meta.env.DEV) {
        // In dev mode, use MOCK_CLASSES directly
        classesForStyle = style ? MOCK_CLASSES.filter(c => c.style === style) : MOCK_CLASSES;
      } else {
        // In production, fetch all classes for this style (4 weeks = 28 days)
        const url = style
          ? `/api/clases?style=${encodeURIComponent(style)}&days=28`
          : '/api/clases?days=28';
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            classesForStyle = data.data.classes || [];
          }
        }
      }

      // Find the week offset for the next available class
      const nextWeekOffset = findNextClassWeekOffset(classesForStyle);
      setWeekOffset(nextWeekOffset);
    } catch {
      // If something fails, default to week 0
      setWeekOffset(0);
    }

    setStep('class');
  };

  const handleClassSelect = (classItem: ClassData) => {
    setSelectedClass(classItem);
    setStep('form');
    // Track class selection
    pushToDataLayer({
      event: 'booking_class_selected',
      class_id: classItem.id,
      class_name: classItem.name,
      class_style: classItem.style,
    });
  };

  // State for share feedback
  const [copiedClassId, setCopiedClassId] = useState<number | null>(null);

  // State for info modal
  const [infoModalClass, setInfoModalClass] = useState<ClassData | null>(null);

  const handleOpenInfoModal = (e: React.MouseEvent, classItem: ClassData) => {
    e.stopPropagation(); // Don't trigger class selection
    setInfoModalClass(classItem);
  };

  const handleCloseInfoModal = () => {
    setInfoModalClass(null);
  };

  const handleShareClass = async (e: React.MouseEvent, classItem: ClassData) => {
    e.stopPropagation(); // Don't trigger class selection

    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/${locale}/reservas?classId=${classItem.id}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedClassId(classItem.id);
      setTimeout(() => setCopiedClassId(null), 2000);

      // Track share action
      pushToDataLayer({
        event: 'booking_class_shared',
        class_id: classItem.id,
        class_name: classItem.name,
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errorMessage) setErrorMessage('');
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setErrorMessage(t('booking_error_firstName'));
      return false;
    }
    if (!formData.lastName.trim()) {
      setErrorMessage(t('booking_error_lastName'));
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage(t('booking_error_email'));
      return false;
    }
    if (!formData.phone.trim() || formData.phone.replace(/[\s().-]/g, '').length < 7) {
      setErrorMessage(t('booking_error_phone'));
      return false;
    }
    if (!selectedClass) {
      setErrorMessage(t('booking_error_class'));
      return false;
    }
    // RGPD validations
    if (!formData.acceptsTerms) {
      setErrorMessage(t('booking_consent_terms_required'));
      return false;
    }
    if (!formData.acceptsMarketing) {
      setErrorMessage(t('booking_consent_marketing_required'));
      return false;
    }
    if (!formData.acceptsAge) {
      setErrorMessage(t('booking_consent_age_required'));
      return false;
    }
    if (!formData.acceptsNoRefund) {
      setErrorMessage(t('booking_consent_norefund_required'));
      return false;
    }
    if (!formData.acceptsPrivacy) {
      setErrorMessage(t('booking_consent_privacy_required'));
      return false;
    }
    if (requiresHeelsConsent && !formData.acceptsHeels) {
      setErrorMessage(t('booking_consent_heels_required'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    setStatus('loading');

    try {
      // Generate unique event ID for deduplication
      const eventId = `booking_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

      // Get Meta tracking cookies
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return undefined;
      };

      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        sessionId: selectedClass?.id,
        className: selectedClass?.name,
        classDate: selectedClass?.rawStartsAt,
        estilo: selectedClass?.style,
        comoconoce: 'Web - Sistema Reservas',
        acceptsMarketing: true,
        // Meta tracking
        eventId,
        sourceUrl: window.location.href,
        fbc: getCookie('_fbc'),
        fbp: getCookie('_fbp'),
      };

      // In dev mode, simulate success
      if (import.meta.env.DEV) {
        console.warn('[DEV] Booking payload:', payload);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus('success');
        trackLeadConversion({
          leadSource: 'booking_widget',
          formName: `Booking - ${selectedClass?.style || 'General'}`,
          leadValue: LEAD_VALUES.BOOKING_LEAD,
          pagePath: window.location.pathname,
        });
        return;
      }

      const response = await fetch('/api/reservar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      setStatus('success');

      // Track conversion
      trackLeadConversion({
        leadSource: 'booking_widget',
        formName: `Booking - ${selectedClass?.style || 'General'}`,
        leadValue: LEAD_VALUES.BOOKING_LEAD,
        pagePath: window.location.pathname,
      });
    } catch (error) {
      console.error('Booking submission error:', error);
      setStatus('error');
      setErrorMessage(t('booking_error_message'));
    }
  };

  const handleBack = () => {
    if (step === 'form') {
      setStep('class');
      setSelectedClass(null);
    } else if (step === 'class') {
      setStep('style');
      setSelectedStyle('');
      setWeekOffset(0); // Reset week when going back
      setFilters(INITIAL_FILTERS); // Reset filters when going back
      setOpenDropdown(null);
    }
  };

  // Filter helpers
  const hasActiveFilters = filters.level || filters.day || filters.timeBlock || filters.instructor;

  const clearAllFilters = () => {
    setFilters(INITIAL_FILTERS);
    setOpenDropdown(null);
  };

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setOpenDropdown(null);
  };

  // Get unique instructors from current classes (or all mock classes)
  const instructorOptions = useMemo(() => {
    const instructors = [...new Set(MOCK_CLASSES.map(c => c.instructor))].sort();
    return [
      { value: '', labelKey: 'booking_filter_all' },
      ...instructors.map(i => ({ value: i, label: i })),
    ];
  }, []);

  // Week navigation
  const handlePrevWeek = () => {
    if (weekOffset > 0) {
      setWeekOffset(prev => prev - 1);
    }
  };

  const handleNextWeek = () => {
    if (weekOffset < 3) {
      // Max 4 weeks ahead
      setWeekOffset(prev => prev + 1);
    }
  };

  // Get week date range label
  const getWeekLabel = useCallback(
    (offset: number) => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() + mondayOffset + offset * 7);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const formatDate = (date: Date) =>
        date.toLocaleDateString(locale === 'en' ? 'en-GB' : `${locale}-ES`, {
          day: 'numeric',
          month: 'short',
        });

      if (offset === 0) {
        return t('booking_week_this');
      }
      return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
    },
    [locale, t]
  );

  const handleRetry = () => {
    setStatus('idle');
    setErrorMessage('');
  };

  // Calendar export handlers
  const handleAddToGoogleCalendar = () => {
    if (!selectedClass) return;
    const url = generateGoogleCalendarUrl({
      title: selectedClass.name,
      description: t('booking_calendar_description', { instructor: selectedClass.instructor }),
      startTime: selectedClass.rawStartsAt,
      durationMinutes: selectedClass.duration,
      location: "Farray's Center - C/ Mallorca 179, Barcelona",
    });
    window.open(url, '_blank');
    pushToDataLayer({ event: 'booking_calendar_google' });
  };

  const handleDownloadICS = () => {
    if (!selectedClass) return;
    downloadICSFile({
      title: selectedClass.name,
      description: t('booking_calendar_description', { instructor: selectedClass.instructor }),
      startTime: selectedClass.rawStartsAt,
      durationMinutes: selectedClass.duration,
      location: "Farray's Center - C/ Mallorca 179, Barcelona",
      attendeeName: `${formData.firstName} ${formData.lastName}`,
      attendeeEmail: formData.email,
    });
    pushToDataLayer({ event: 'booking_calendar_ics' });
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {['style', 'class', 'form'].map((s, i) => {
        const isActive = step === s;
        const isCompleted =
          (s === 'style' && (step === 'class' || step === 'form')) ||
          (s === 'class' && step === 'form');

        return (
          <React.Fragment key={s}>
            <div
              className={`
                relative w-10 h-10 rounded-full flex items-center justify-center
                transition-all duration-500 transform
                ${
                  isActive
                    ? 'bg-primary-accent scale-110 shadow-lg shadow-primary-accent/50'
                    : isCompleted
                      ? 'bg-primary-accent/80'
                      : 'bg-white/10'
                }
              `}
              style={{
                transform: isActive ? 'perspective(500px) rotateY(10deg)' : 'none',
              }}
            >
              {isCompleted ? (
                <CheckIcon className="w-5 h-5 text-white" />
              ) : (
                <span className="text-sm font-bold text-white">{i + 1}</span>
              )}
              {isActive && (
                <div className="absolute inset-0 rounded-full bg-primary-accent/50 animate-ping" />
              )}
            </div>
            {i < 2 && (
              <div
                className={`w-12 h-1 rounded-full transition-all duration-500 ${
                  isCompleted ? 'bg-primary-accent' : 'bg-white/10'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderCheckbox = (
    name: keyof FormData,
    label: React.ReactNode,
    required: boolean = true
  ) => (
    <label className="flex items-start gap-3 cursor-pointer group py-2">
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          name={name}
          checked={formData[name] as boolean}
          onChange={handleInputChange}
          disabled={status === 'loading'}
          className="peer sr-only"
        />
        <div className="w-5 h-5 border-2 border-white/30 rounded bg-white/5 peer-checked:bg-primary-accent peer-checked:border-primary-accent transition-all peer-focus:ring-2 peer-focus:ring-primary-accent/50 group-hover:border-white/50">
          <CheckIcon className="w-full h-full text-white opacity-0 peer-checked:opacity-100 p-0.5" />
        </div>
        <CheckIcon className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 p-0.5 pointer-events-none" />
      </div>
      <span className="text-sm text-neutral/80 leading-tight">
        {label}
        {!required && (
          <span className="ml-1 text-neutral/50">{t('booking_consent_image_optional')}</span>
        )}
      </span>
    </label>
  );

  // ============================================================================
  // RENDER STEPS
  // ============================================================================

  const renderStyleStep = () => (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-neutral mb-6 text-center">
        {t('booking_style_title')}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {STYLE_OPTIONS.map(style => {
          const isAvailable = !style.value || stylesAvailable.includes(style.value);

          return (
            <button
              key={style.value}
              onClick={() => handleStyleSelect(style.value)}
              disabled={!isAvailable && style.value !== ''}
              className={`
                relative group p-4 rounded-2xl border-2 transition-all duration-300
                transform hover:scale-105 hover:-translate-y-1
                ${
                  isAvailable || !style.value
                    ? 'border-white/20 hover:border-primary-accent/50 bg-white/5 hover:bg-white/10'
                    : 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                }
              `}
              style={{
                boxShadow: isAvailable ? `0 4px 20px ${style.color}20` : 'none',
              }}
            >
              {/* 3D Glow effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                style={{
                  background: `radial-gradient(circle at center, ${style.color}30 0%, transparent 70%)`,
                  filter: 'blur(20px)',
                  transform: 'translateZ(-10px)',
                }}
              />

              <div
                className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${style.color}30` }}
              >
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: style.color }} />
              </div>

              <span className="text-sm font-semibold text-neutral block">
                {style.labelKey ? t(style.labelKey) : style.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderClassStep = () => (
    <div className="animate-fade-in">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-neutral/60 hover:text-neutral mb-4 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('booking_step1')}
      </button>

      <h2 className="text-2xl font-bold text-neutral mb-4">{t('booking_class_title')}</h2>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6 p-3 bg-white/5 rounded-xl border border-white/10">
        <button
          onClick={handlePrevWeek}
          disabled={weekOffset === 0}
          className={`p-2 rounded-lg transition-all ${
            weekOffset === 0
              ? 'text-neutral/30 cursor-not-allowed'
              : 'text-neutral/70 hover:text-neutral hover:bg-white/10'
          }`}
          aria-label={t('booking_week_prev')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary-accent" />
          <span className="text-neutral font-medium">{getWeekLabel(weekOffset)}</span>
        </div>

        <button
          onClick={handleNextWeek}
          disabled={weekOffset >= 3}
          className={`p-2 rounded-lg transition-all ${
            weekOffset >= 3
              ? 'text-neutral/30 cursor-not-allowed'
              : 'text-neutral/70 hover:text-neutral hover:bg-white/10'
          }`}
          aria-label={t('booking_week_next')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Level Filter */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'level' ? null : 'level')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
              filters.level
                ? 'bg-primary-accent/20 border-primary-accent text-neutral'
                : 'bg-white/5 border-white/20 text-neutral/70 hover:border-white/40'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            {t('booking_filter_level')}
            <svg
              className={`w-3 h-3 transition-transform ${openDropdown === 'level' ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openDropdown === 'level' && (
            <div className="absolute z-20 top-full mt-1 left-0 min-w-[160px] bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl overflow-hidden">
              {LEVEL_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateFilter('level', opt.value)}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    filters.level === opt.value
                      ? 'bg-primary-accent/20 text-primary-accent'
                      : 'text-neutral/80 hover:bg-white/10'
                  }`}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Day Filter */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'day' ? null : 'day')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
              filters.day
                ? 'bg-primary-accent/20 border-primary-accent text-neutral'
                : 'bg-white/5 border-white/20 text-neutral/70 hover:border-white/40'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            {t('booking_filter_day')}
            <svg
              className={`w-3 h-3 transition-transform ${openDropdown === 'day' ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openDropdown === 'day' && (
            <div className="absolute z-20 top-full mt-1 left-0 min-w-[140px] bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl overflow-hidden">
              {DAY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateFilter('day', opt.value)}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    filters.day === opt.value
                      ? 'bg-primary-accent/20 text-primary-accent'
                      : 'text-neutral/80 hover:bg-white/10'
                  }`}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Time Filter */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'time' ? null : 'time')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
              filters.timeBlock
                ? 'bg-primary-accent/20 border-primary-accent text-neutral'
                : 'bg-white/5 border-white/20 text-neutral/70 hover:border-white/40'
            }`}
          >
            <ClockIcon className="w-4 h-4" />
            {t('booking_filter_time')}
            <svg
              className={`w-3 h-3 transition-transform ${openDropdown === 'time' ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openDropdown === 'time' && (
            <div className="absolute z-20 top-full mt-1 left-0 min-w-[180px] bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl overflow-hidden">
              {TIME_BLOCK_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateFilter('timeBlock', opt.value)}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    filters.timeBlock === opt.value
                      ? 'bg-primary-accent/20 text-primary-accent'
                      : 'text-neutral/80 hover:bg-white/10'
                  }`}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Instructor Filter */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'instructor' ? null : 'instructor')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
              filters.instructor
                ? 'bg-primary-accent/20 border-primary-accent text-neutral'
                : 'bg-white/5 border-white/20 text-neutral/70 hover:border-white/40'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            {t('booking_filter_instructor')}
            <svg
              className={`w-3 h-3 transition-transform ${openDropdown === 'instructor' ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openDropdown === 'instructor' && (
            <div className="absolute z-20 top-full mt-1 left-0 min-w-[180px] bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl overflow-hidden max-h-[200px] overflow-y-auto">
              {instructorOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => updateFilter('instructor', opt.value)}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    filters.instructor === opt.value
                      ? 'bg-primary-accent/20 text-primary-accent'
                      : 'text-neutral/80 hover:bg-white/10'
                  }`}
                >
                  {'labelKey' in opt ? t(opt.labelKey) : opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active filters badges */}
      {(hasActiveFilters || selectedStyle) && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {selectedStyle && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-accent/20 border border-primary-accent/40 rounded-full text-sm text-neutral">
              <span className="w-2 h-2 rounded-full bg-primary-accent" />
              {STYLE_OPTIONS.find(s => s.value === selectedStyle)?.label || selectedStyle}
              <button
                onClick={() => {
                  setSelectedStyle('');
                  setWeekOffset(0);
                }}
                className="ml-1 hover:text-primary-accent transition-colors"
                aria-label={t('booking_style_clear')}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </span>
          )}
          {filters.level && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-neutral">
              {t(LEVEL_OPTIONS.find(o => o.value === filters.level)?.labelKey || '')}
              <button
                onClick={() => updateFilter('level', '')}
                className="hover:text-primary-accent"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.day && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-neutral">
              {t(DAY_OPTIONS.find(o => o.value === filters.day)?.labelKey || '')}
              <button onClick={() => updateFilter('day', '')} className="hover:text-primary-accent">
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.timeBlock && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-neutral">
              {t(TIME_BLOCK_OPTIONS.find(o => o.value === filters.timeBlock)?.labelKey || '')}
              <button
                onClick={() => updateFilter('timeBlock', '')}
                className="hover:text-primary-accent"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.instructor && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm text-neutral">
              {filters.instructor}
              <button
                onClick={() => updateFilter('instructor', '')}
                className="hover:text-primary-accent"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-1.5 text-xs text-neutral/60 hover:text-primary-accent transition-colors"
            >
              {t('booking_filter_clear_all')}
            </button>
          )}
        </div>
      )}

      {loadingClasses ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary-accent/30 border-t-primary-accent rounded-full animate-spin mb-4" />
          <p className="text-neutral/60">{t('booking_class_loading')}</p>
        </div>
      ) : errorMessage ? (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{errorMessage}</p>
          <button
            onClick={() => fetchClasses(selectedStyle || undefined, weekOffset, filters)}
            className="px-6 py-2 bg-primary-accent text-white rounded-xl hover:bg-primary-accent/90 transition-colors"
          >
            {t('booking_class_retry')}
          </button>
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral/60">{t('booking_class_empty')}</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {classes.map(classItem => (
            <button
              key={classItem.id}
              onClick={() => handleClassSelect(classItem)}
              className={`
                w-full p-4 rounded-2xl border-2 text-left transition-all duration-300
                ${
                  selectedClass?.id === classItem.id
                    ? 'border-primary-accent bg-primary-accent/10'
                    : 'border-white/10 bg-white/5 hover:border-primary-accent hover:bg-white/10'
                }
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-neutral mb-1">{classItem.name}</h3>

                  <div className="flex flex-wrap gap-3 text-sm text-neutral/70">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      {classItem.dayOfWeek} {classItem.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      {classItem.time}
                    </span>
                    <span className="text-neutral/50">{formatDuration(classItem.duration)}</span>
                    {classItem.instructor && (
                      <span className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        {classItem.instructor}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    {/* Info button */}
                    {classItem.description && (
                      <button
                        onClick={e => handleOpenInfoModal(e, classItem)}
                        className="px-2 py-1 rounded-lg text-xs font-medium text-primary-accent hover:bg-primary-accent/10 transition-all"
                        aria-label={t('booking_class_info')}
                      >
                        +info
                      </button>
                    )}
                    {/* Share button */}
                    <button
                      onClick={e => handleShareClass(e, classItem)}
                      className="p-1.5 rounded-lg text-neutral/50 hover:text-primary-accent hover:bg-white/10 transition-all"
                      aria-label={t('booking_class_share')}
                      title={
                        copiedClassId === classItem.id
                          ? t('booking_class_copied')
                          : t('booking_class_share')
                      }
                    >
                      {copiedClassId === classItem.id ? (
                        <CheckIcon className="w-4 h-4 text-green-400" />
                      ) : (
                        <ShareIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {selectedClass?.id === classItem.id && (
                    <CheckIcon className="w-5 h-5 text-primary-accent" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const renderFormStep = () => (
    <div className="animate-fade-in">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-neutral/60 hover:text-neutral mb-4 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('booking_step2')}
      </button>

      {/* Selected class summary */}
      {selectedClass && (
        <div className="bg-primary-accent/10 border border-primary-accent/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-accent/20 flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-primary-accent" />
            </div>
            <div>
              <h3 className="font-bold text-neutral">{selectedClass.name}</h3>
              <p className="text-sm text-neutral/70">
                {selectedClass.dayOfWeek} {selectedClass.date} • {selectedClass.time}
              </p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-neutral mb-4">{t('booking_form_title')}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-neutral/80 mb-1.5">
              {t('booking_field_firstName')} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-neutral placeholder-neutral/40 focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all disabled:opacity-50"
              placeholder={t('booking_placeholder_firstName')}
              autoComplete="given-name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-neutral/80 mb-1.5">
              {t('booking_field_lastName')} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={status === 'loading'}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-neutral placeholder-neutral/40 focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all disabled:opacity-50"
              placeholder={t('booking_placeholder_lastName')}
              autoComplete="family-name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral/80 mb-1.5">
            {t('booking_field_email')} <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={status === 'loading'}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-neutral placeholder-neutral/40 focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all disabled:opacity-50"
            placeholder={t('booking_placeholder_email')}
            autoComplete="email"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral/80 mb-1.5">
            {t('booking_field_phone')} <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={status === 'loading'}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-neutral placeholder-neutral/40 focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all disabled:opacity-50"
            placeholder={t('booking_placeholder_phone')}
            autoComplete="tel"
          />
        </div>

        {/* RGPD Checkboxes */}
        <div className="pt-4 border-t border-white/10 space-y-1">
          {/* Terms */}
          {renderCheckbox(
            'acceptsTerms',
            <>
              {t('booking_consent_terms')}{' '}
              <Link
                to={`/${locale}/condiciones-generales`}
                className="text-primary-accent hover:underline"
                target="_blank"
              >
                {t('booking_consent_terms_link')}
              </Link>
            </>
          )}

          {/* Marketing */}
          {renderCheckbox('acceptsMarketing', t('booking_consent_marketing'))}

          {/* Age */}
          {renderCheckbox('acceptsAge', t('booking_consent_age'))}

          {/* No Refund */}
          {renderCheckbox('acceptsNoRefund', t('booking_consent_norefund'))}

          {/* Privacy */}
          {renderCheckbox(
            'acceptsPrivacy',
            <>
              {t('booking_consent_privacy')}{' '}
              <Link
                to={`/${locale}/politica-privacidad`}
                className="text-primary-accent hover:underline"
                target="_blank"
              >
                {t('booking_consent_privacy_link')}
              </Link>
            </>
          )}

          {/* Heels (conditional) */}
          {requiresHeelsConsent && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mt-3">
              {renderCheckbox('acceptsHeels', t('booking_consent_heels'))}
            </div>
          )}

          {/* Image (optional) */}
          {renderCheckbox('acceptsImage', t('booking_consent_image'), false)}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-sm text-red-400">{errorMessage}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-4 bg-primary-accent text-white font-bold rounded-xl transition-all duration-300 hover:shadow-accent-glow hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2 mt-4"
        >
          {status === 'loading' ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t('booking_submit_loading')}</span>
            </>
          ) : (
            <span>{t('booking_submit')}</span>
          )}
        </button>

        {/* Legal text */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-[10px] leading-relaxed text-neutral/40">
            {t('booking_legal_responsible')} {t('booking_legal_purpose')}{' '}
            {t('booking_legal_legitimation')} {t('booking_legal_recipients')}{' '}
            {t('booking_legal_rights')}{' '}
            <Link
              to={`/${locale}/politica-privacidad`}
              className="text-primary-accent/70 hover:text-primary-accent"
            >
              {t('booking_legal_info')}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="animate-fade-in text-center py-8">
      {/* Success icon with 3D effect */}
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-green-500/30 rounded-full blur-xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center transform hover:scale-110 transition-transform">
          <CheckIcon className="w-10 h-10 text-white" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-neutral mb-4">{t('booking_success_title')}</h2>

      <p className="text-neutral/80 mb-6">{t('booking_success_message')}</p>

      {selectedClass && (
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
      )}

      {/* Add to Calendar buttons */}
      {selectedClass && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={handleAddToGoogleCalendar}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors text-neutral"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.5 4H18V3a1 1 0 0 0-2 0v1H8V3a1 1 0 0 0-2 0v1H4.5A2.5 2.5 0 0 0 2 6.5v13A2.5 2.5 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-13A2.5 2.5 0 0 0 19.5 4zM20 19.5a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5V10h16v9.5zM20 8H4V6.5a.5.5 0 0 1 .5-.5H6v1a1 1 0 0 0 2 0V6h8v1a1 1 0 0 0 2 0V6h1.5a.5.5 0 0 1 .5.5V8z" />
            </svg>
            <span className="text-sm font-medium">{t('booking_calendar_google')}</span>
          </button>
          <button
            onClick={handleDownloadICS}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors text-neutral"
          >
            <CalendarIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{t('booking_calendar_download')}</span>
          </button>
        </div>
      )}

      <p className="text-sm text-neutral/60 mb-6">{t('booking_success_reminder')}</p>

      <Link
        to={`/${locale}/horarios`}
        className="inline-block px-6 py-3 bg-primary-accent text-white font-semibold rounded-xl hover:bg-primary-accent/90 transition-colors"
      >
        {t('booking_success_cta')}
      </Link>
    </div>
  );

  const renderErrorStep = () => (
    <div className="animate-fade-in text-center py-8">
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
          <XMarkIcon className="w-10 h-10 text-white" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-neutral mb-4">{t('booking_error_title')}</h2>

      <p className="text-neutral/80 mb-6">{errorMessage || t('booking_error_message')}</p>

      <button
        onClick={handleRetry}
        className="px-6 py-3 bg-primary-accent text-white font-semibold rounded-xl hover:bg-primary-accent/90 transition-colors"
      >
        {t('booking_error_cta')}
      </button>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="relative">
      {/* 3D Background glow */}
      <div
        className="absolute -inset-4 bg-gradient-to-r from-primary-dark/20 via-primary-accent/10 to-primary-dark/20 rounded-3xl blur-2xl -z-10"
        style={{
          transform: 'translateZ(-20px)',
        }}
      />

      {/* Main container */}
      <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden">
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-accent to-transparent" />

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-neutral mb-2">
            {t('booking_title')}
          </h1>
          <p className="text-neutral/60">{t('booking_subtitle')}</p>
        </div>

        {/* Step indicator */}
        {status !== 'success' && status !== 'error' && renderStepIndicator()}

        {/* Content */}
        {status === 'success' ? (
          renderSuccessStep()
        ) : status === 'error' ? (
          renderErrorStep()
        ) : (
          <>
            {step === 'style' && renderStyleStep()}
            {step === 'class' && renderClassStep()}
            {step === 'form' && renderFormStep()}
          </>
        )}
      </div>

      {/* Info Modal */}
      {infoModalClass && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleCloseInfoModal}
        >
          <div
            className="relative bg-neutral-900 border border-white/10 rounded-2xl p-6 max-w-md w-full animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCloseInfoModal}
              className="absolute top-4 right-4 p-1 rounded-full text-neutral/50 hover:text-neutral hover:bg-white/10 transition-all"
              aria-label={t('booking_modal_close')}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            {/* Class name */}
            <h3 className="text-xl font-bold text-neutral mb-4 pr-8">{infoModalClass.name}</h3>

            {/* Level badge */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary-accent/20 text-primary-accent">
                {t(`booking_filter_level_${infoModalClass.level}`)}
              </span>
            </div>

            {/* Description */}
            <p className="text-neutral/80 text-sm leading-relaxed mb-4 whitespace-pre-line">
              {infoModalClass.description || t('booking_modal_no_description')}
            </p>

            {/* Class details */}
            <div className="flex flex-wrap gap-3 text-sm text-neutral/60 mb-6">
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                {infoModalClass.dayOfWeek} {infoModalClass.date}
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                {infoModalClass.time} ({formatDuration(infoModalClass.duration)})
              </span>
              {infoModalClass.instructor && (
                <span className="flex items-center gap-1">
                  <UserIcon className="w-4 h-4" />
                  {infoModalClass.instructor}
                </span>
              )}
            </div>

            {/* Action button */}
            <button
              onClick={() => {
                handleCloseInfoModal();
                handleClassSelect(infoModalClass);
              }}
              className="w-full py-3 bg-primary-accent text-white font-semibold rounded-xl hover:bg-primary-accent/90 transition-colors"
            >
              {t('booking_modal_select')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default BookingWidget;
