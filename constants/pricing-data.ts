/**
 * Pricing Data Configuration
 * ==========================
 *
 * Datos centralizados de cuotas para el Club Deportivo Farray's Center.
 * Actualizar este archivo cuando cambien las cuotas.
 *
 * TERMINOLOGÍA (Club Deportivo):
 * - Cuota de inscripción (no matrícula)
 * - Cuota mensual (no mensualidad)
 * - Actividades (no clases)
 * - Socio (no cliente)
 * - Cuota de participación (no bono)
 */

// ============================================================================
// TYPES
// ============================================================================

export interface MonthlyPlan {
  id: string;
  hoursPerWeek: number;
  activitiesPerMonth: number;
  price: number;
  pricePerActivity: number;
  isPopular?: boolean;
  isPremium?: boolean;
}

export interface FlexiblePlan {
  id: string;
  activities: number;
  price: number;
  pricePerActivity: number;
  validityMonths: number;
  duration: '1h' | '1.5h';
}

export interface DropInPrice {
  id: string;
  duration: '1h' | '1.5h';
  type: 'regular' | 'premium';
  price: number;
}

export interface PersonalTrainingPack {
  id: string;
  sessions: number;
  price: number;
  pricePerSession: number;
  savingsPercent?: number;
}

// ============================================================================
// ENROLLMENT FEE
// ============================================================================

export const ENROLLMENT_FEE = {
  price: 60,
  includes: [
    'enrollmentInclude1', // Acceso al sistema y plaza fija
    'enrollmentInclude2', // Seguro de accidentes
    'enrollmentInclude3', // Beneficios exclusivos de socio
  ],
};

// ============================================================================
// MONTHLY PLANS - REGULAR
// ============================================================================

export const MONTHLY_PLANS_REGULAR: MonthlyPlan[] = [
  {
    id: 'regular-1h',
    hoursPerWeek: 1,
    activitiesPerMonth: 4,
    price: 50,
    pricePerActivity: 12.5,
  },
  {
    id: 'regular-1.5h',
    hoursPerWeek: 1.5,
    activitiesPerMonth: 4,
    price: 60,
    pricePerActivity: 15,
  },
  {
    id: 'regular-2h',
    hoursPerWeek: 2,
    activitiesPerMonth: 8,
    price: 78,
    pricePerActivity: 9.75,
    isPopular: true,
  },
  {
    id: 'regular-3h',
    hoursPerWeek: 3,
    activitiesPerMonth: 12,
    price: 103,
    pricePerActivity: 8.58,
  },
  {
    id: 'regular-4h',
    hoursPerWeek: 4,
    activitiesPerMonth: 16,
    price: 124,
    pricePerActivity: 7.75,
  },
  {
    id: 'regular-5h',
    hoursPerWeek: 5,
    activitiesPerMonth: 20,
    price: 145,
    pricePerActivity: 7.25,
  },
  {
    id: 'regular-6h',
    hoursPerWeek: 6,
    activitiesPerMonth: 24,
    price: 170,
    pricePerActivity: 7.08,
  },
  {
    id: 'regular-7h',
    hoursPerWeek: 7,
    activitiesPerMonth: 28,
    price: 195,
    pricePerActivity: 6.96,
  },
];

// ============================================================================
// MONTHLY PLANS - PREMIUM (con Yunaisy Farray)
// ============================================================================

export const MONTHLY_PLANS_PREMIUM: MonthlyPlan[] = [
  {
    id: 'premium-1h',
    hoursPerWeek: 1,
    activitiesPerMonth: 4,
    price: 55,
    pricePerActivity: 13.75,
    isPremium: true,
  },
  {
    id: 'premium-1.5h',
    hoursPerWeek: 1.5,
    activitiesPerMonth: 4,
    price: 65,
    pricePerActivity: 16.25,
    isPremium: true,
  },
  {
    id: 'premium-2h',
    hoursPerWeek: 2,
    activitiesPerMonth: 8,
    price: 83,
    pricePerActivity: 10.38,
    isPremium: true,
    isPopular: true,
  },
  {
    id: 'premium-3h',
    hoursPerWeek: 3,
    activitiesPerMonth: 12,
    price: 113,
    pricePerActivity: 9.42,
    isPremium: true,
  },
  {
    id: 'premium-4h',
    hoursPerWeek: 4,
    activitiesPerMonth: 16,
    price: 135,
    pricePerActivity: 8.44,
    isPremium: true,
  },
  {
    id: 'premium-5h',
    hoursPerWeek: 5,
    activitiesPerMonth: 20,
    price: 165,
    pricePerActivity: 8.25,
    isPremium: true,
  },
  {
    id: 'premium-6h',
    hoursPerWeek: 6,
    activitiesPerMonth: 24,
    price: 195,
    pricePerActivity: 8.13,
    isPremium: true,
  },
  {
    id: 'premium-7h',
    hoursPerWeek: 7,
    activitiesPerMonth: 28,
    price: 225,
    pricePerActivity: 8.04,
    isPremium: true,
  },
];

// ============================================================================
// UNLIMITED PLAN
// ============================================================================

export const UNLIMITED_PLAN = {
  id: 'unlimited',
  price: 300,
  estimatedActivities: 60, // Estimación para calcular precio/actividad
  pricePerActivity: 5, // ~5€ por actividad
};

// ============================================================================
// FLEXIBLE PLANS (Cuotas de participación)
// ============================================================================

export const FLEXIBLE_PLANS_REGULAR: FlexiblePlan[] = [
  {
    id: 'flex-10-1h',
    activities: 10,
    price: 145,
    pricePerActivity: 14.5,
    validityMonths: 6,
    duration: '1h',
  },
  {
    id: 'flex-10-1.5h',
    activities: 10,
    price: 170,
    pricePerActivity: 17,
    validityMonths: 6,
    duration: '1.5h',
  },
  {
    id: 'flex-20-1h',
    activities: 20,
    price: 240,
    pricePerActivity: 12,
    validityMonths: 12,
    duration: '1h',
  },
  {
    id: 'flex-20-1.5h',
    activities: 20,
    price: 310,
    pricePerActivity: 15.5,
    validityMonths: 12,
    duration: '1.5h',
  },
];

export const FLEXIBLE_PLANS_PREMIUM: FlexiblePlan[] = [
  {
    id: 'flex-premium-10-1h',
    activities: 10,
    price: 160,
    pricePerActivity: 16,
    validityMonths: 6,
    duration: '1h',
  },
  {
    id: 'flex-premium-10-1.5h',
    activities: 10,
    price: 180,
    pricePerActivity: 18,
    validityMonths: 6,
    duration: '1.5h',
  },
  {
    id: 'flex-premium-20-1h',
    activities: 20,
    price: 270,
    pricePerActivity: 13.5,
    validityMonths: 12,
    duration: '1h',
  },
  {
    id: 'flex-premium-20-1.5h',
    activities: 20,
    price: 340,
    pricePerActivity: 17,
    validityMonths: 12,
    duration: '1.5h',
  },
];

// ============================================================================
// DROP-IN PRICES (Participación puntual)
// ============================================================================

export const DROP_IN_PRICES: DropInPrice[] = [
  { id: 'dropin-regular-1h', duration: '1h', type: 'regular', price: 17 },
  { id: 'dropin-regular-1.5h', duration: '1.5h', type: 'regular', price: 20 },
  { id: 'dropin-premium-1h', duration: '1h', type: 'premium', price: 18 },
  { id: 'dropin-premium-1.5h', duration: '1.5h', type: 'premium', price: 22 },
];

// ============================================================================
// PERSONAL TRAINING (Entrenamientos personalizados)
// ============================================================================

export const PERSONAL_TRAINING_PACKS: PersonalTrainingPack[] = [
  {
    id: 'pt-1',
    sessions: 1,
    price: 70,
    pricePerSession: 70,
  },
  {
    id: 'pt-3',
    sessions: 3,
    price: 195,
    pricePerSession: 65,
    savingsPercent: 7,
  },
  {
    id: 'pt-5',
    sessions: 5,
    price: 300,
    pricePerSession: 60,
    savingsPercent: 14,
  },
];

// ============================================================================
// CHOREOGRAPHY COURSES
// ============================================================================

export const CHOREOGRAPHY_PRICES = {
  students: {
    '1.5h': 55,
    '3h': 100,
  },
  external: {
    '1.5h': 65,
    '3h': 113,
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the most popular monthly plan
 */
export const getPopularPlan = (isPremium = false): MonthlyPlan | undefined => {
  const plans = isPremium ? MONTHLY_PLANS_PREMIUM : MONTHLY_PLANS_REGULAR;
  return plans.find(plan => plan.isPopular);
};

/**
 * Get plans for display (first 4 + popular highlighted)
 */
export const getDisplayPlans = (isPremium = false): MonthlyPlan[] => {
  const plans = isPremium ? MONTHLY_PLANS_PREMIUM : MONTHLY_PLANS_REGULAR;
  // Return first 4 plans for card display
  return plans.slice(0, 4);
};

/**
 * Get all plans for expanded view
 */
export const getAllPlans = (isPremium = false): MonthlyPlan[] => {
  return isPremium ? MONTHLY_PLANS_PREMIUM : MONTHLY_PLANS_REGULAR;
};

/**
 * Format price for display
 */
export const formatPrice = (price: number): string => {
  return price % 1 === 0 ? `${price}€` : `${price.toFixed(2)}€`;
};

/**
 * Calculate savings percentage between two prices
 */
export const calculateSavings = (originalPrice: number, discountedPrice: number): number => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};
