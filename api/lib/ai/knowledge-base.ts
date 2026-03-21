/**
 * Knowledge Base for AI Agent - Farray's International Dance Center
 *
 * Contains all information about the dance center:
 * - Prices, schedules, location
 * - FAQs, policies
 * - Multi-language support (es/ca/en/fr)
 *
 * @see AGENTE.md - Knowledge Base (precios, horarios, FAQs)
 */

import type { SupportedLanguage } from './language-detector.js';

// ============================================================================
// CENTER INFORMATION
// ============================================================================

export const CENTER_INFO = {
  name: "Farray's International Dance Center",
  shortName: "Farray's",
  address: "Carrer d'Entença 100, Local 1",
  postalCode: '08015',
  city: 'Barcelona',
  neighborhood: 'Eixample (cerca de Plaza España)',
  country: 'España',
  phone: '+34 622 247 085',
  whatsapp: '34622247085',
  email: 'info@farrayscenter.com',
  website: 'https://www.farrayscenter.com/es',
  googleMaps: 'https://maps.app.goo.gl/YMTQFik7dB1ykdux9',

  // Founding & credentials
  founded: 2017,
  accreditation: 'CID-UNESCO (International Dance Council)',
  rating: '5.0/5 (509 reseñas)',

  // Facilities
  facilities: {
    totalArea: '700 m²',
    studios: 4,
    features: [
      'Espejos profesionales',
      'Barras de ballet',
      'Suelo profesional para danza',
      'Vestuarios',
    ],
  },

  // Metro and transport
  transport: {
    metro: [
      { line: 'L1', station: 'Rocafort', walkTime: '4 min' },
      { line: 'L5', station: 'Entença', walkTime: '5 min' },
    ],
    train: { station: 'Sants Estació', walkTime: '8 min' },
    bus: ['41', '54', 'H8'],
  },

  // Operating hours (updated)
  hours: {
    monday: '10:30-12:30, 17:30-23:00',
    tuesday: '10:30-13:30, 17:30-23:00',
    wednesday: '17:30-23:00',
    thursday: '09:30-11:30, 17:30-23:00',
    friday: '17:30-20:30',
    saturday: 'Cerrado (eventos especiales)',
    sunday: 'Cerrado',
  },

  // Morning classes
  morningClasses: {
    schedule: '10:00-13:00',
    styles: ['Contemporáneo', 'Ballet', 'Jazz', 'Stretching'],
    idealFor: 'Personas con turno de tarde o flexibilidad horaria',
  },
};

// ============================================================================
// PRICING - FUENTE OFICIAL: constants/pricing-data.ts
// ============================================================================

export const PRICING = {
  // Cuotas mensuales REGULAR (actividades/semana)
  memberships: {
    oneClassPerWeek: { price: 50, hoursPerWeek: 1 },
    twoClassesPerWeek: { price: 78, hoursPerWeek: 2, popular: true },
    threeClassesPerWeek: { price: 103, hoursPerWeek: 3 },
    fourClassesPerWeek: { price: 124, hoursPerWeek: 4 },
    fiveClassesPerWeek: { price: 145, hoursPerWeek: 5 },
    sixClassesPerWeek: { price: 170, hoursPerWeek: 6 },
    sevenClassesPerWeek: { price: 195, hoursPerWeek: 7 },
    unlimited: { price: 300, description: 'Acceso ilimitado a todas las actividades' },
  },

  // Premium = Regular + 5€/mes (incluye clases con Yunaisy)
  premiumSupplement: 5,

  // Participación puntual (sin ser socio)
  dropIn: {
    regular1h: 20,
    regular1_5h: 23,
    premium1h: 22,
    premium1_5h: 25,
  },

  // Clase suelta (para compatibilidad)
  singleClass: 20,

  // Cuota de inscripción
  registration: {
    normal: 60,
    currentPromo: 0, // Actualmente gratis
    renewalAnnual: 20,
  },

  // Clase de bienvenida
  trialClass: {
    price: 0, // GRATIS
    description: 'Clase de bienvenida sin compromiso',
  },

  // Bonos (cuotas de participación flexibles)
  flexiblePacks: {
    bono10_1h: { activities: 10, price: 145, validityMonths: 6 },
    bono10_1_5h: { activities: 10, price: 170, validityMonths: 6 },
    bono20_1h: { activities: 20, price: 240, validityMonths: 12 },
    bono20_1_5h: { activities: 20, price: 310, validityMonths: 12 },
  },

  // Entrenamientos personalizados
  privateClasses: {
    single: 70,
    pack3: 195, // 65€/sesión
    pack5: 300, // 60€/sesión
    features: [
      'Instructor exclusivo',
      'Horario flexible',
      '25+ estilos disponibles',
      'Método Farray®',
    ],
  },
};

// ============================================================================
// TEACHERS & TEAM
// ============================================================================

export const TEACHERS = {
  founder: {
    name: 'Yunaisy Farray',
    role: 'Fundadora, Master Instructor, Icono Global de la Danza',
    bio: 'Artista de renombre mundial con más de 20 años de experiencia. Graduada de la Escuela Nacional de Arte de Cuba (ENA). Apareció en Street Dance 2 y fue finalista de Got Talent.',
    styles: ['Salsa Cubana', 'Danza Contemporánea', 'Coreografía'],
    creator: 'Método Farray®',
  },
  instructors: [
    {
      name: 'Mathias Font',
      specialty: 'Bachata Sensual',
      credentials: 'Campeón Mundial Salsa LA',
    },
    {
      name: 'Eugenia Trujillo',
      specialty: 'Bachata Sensual',
      credentials: 'Campeona Mundial Salsa LA',
    },
    {
      name: 'Sandra Gómez',
      specialty: 'Twerk',
      credentials: 'Especialista en danzas urbanas',
    },
  ],
  generalInfo:
    'Equipo de profesores internacionales con formación profesional y pasión por la enseñanza.',
};

// ============================================================================
// MÉTODO FARRAY®
// ============================================================================

export const METODO_FARRAY = {
  name: 'Método Farray®',
  creator: 'Yunaisy Farray',
  accreditation: 'CID-UNESCO',
  description:
    'Sistema pedagógico exclusivo que fusiona técnica cubana, ritmo afrocaribeño e innovación.',
  components: [
    'Técnica cubana clásica',
    'Ritmo afrocaribeño auténtico',
    'Innovación contemporánea',
  ],
  targetAudience: 'Diseñado específicamente para estudiantes adultos europeos',
  benefits: [
    'Mejora de técnica como bailarín/a',
    'Aumento de confianza personal',
    'Empoderamiento a través del movimiento',
    'Comunidad y ambiente familiar',
  ],
};

// ============================================================================
// SERVICES - Additional offerings
// ============================================================================

export const SERVICES = {
  // Room rental
  alquilerSalas: {
    name: 'Alquiler de Salas de Baile',
    description: 'Espacios profesionales para ensayos, clases particulares, grabaciones o eventos.',
    rooms: 4,
    sizes: '40-120 m² por sala',
    priceFrom: '14€/hora',
    amenities: [
      'Suelo profesional de danza',
      'Espejos de pared completa',
      'Aire acondicionado',
      'Equipo de sonido',
    ],
    booking: 'Contactar por WhatsApp o email para reservar',
  },

  // Recording studio
  estudioGrabacion: {
    name: 'Estudio de Grabación de Baile',
    description:
      'Graba videoclips, tutoriales o contenido para redes sociales con equipamiento profesional.',
    features: [
      'Iluminación profesional',
      'Equipo de sonido de alta calidad',
      'Espejo y fondo neutro',
      'Ideal para videoclips y tutoriales',
    ],
    booking: 'Contactar para disponibilidad y precios',
  },

  // Team building
  teamBuilding: {
    name: 'Team Building Empresarial',
    description:
      'Experiencias de equipo únicas a través del baile. Más de 500 eventos corporativos realizados.',
    forWhom: 'Empresas, grupos corporativos, despedidas de soltero/a',
    activities: [
      'Clases de baile en grupo (25+ estilos disponibles)',
      'Coreografías personalizadas',
      'Competiciones amistosas entre equipos',
      'Sesiones de team bonding',
    ],
    differentiator: 'Experiencia única con el Método Farray® - sin dinámicas vacías',
    booking: 'Solicitar presupuesto por email o WhatsApp',
  },

  // Gift cards
  tarjetasRegalo: {
    name: 'Tarjetas Regalo / Regala Baile',
    description: 'Regala clases de baile - el regalo perfecto para cualquier ocasión.',
    options: ['Clases sueltas', 'Bonos de clases', 'Experiencias personalizadas'],
    validFor: '25+ estilos de baile',
    booking: 'Disponible en recepción o contactando por WhatsApp',
  },

  // Merchandising
  merchandising: {
    name: "Merchandising Farray's",
    description: "Ropa y accesorios oficiales de Farray's.",
    available: 'En recepción del centro',
  },
};

// ============================================================================
// DANCE STYLES - Complete with descriptions
// ============================================================================

export const DANCE_STYLES = {
  // LATIN / SOCIAL DANCES
  bailesSociales: {
    name: 'Bailes Sociales / Latinos',
    styles: [
      {
        name: 'Salsa Cubana',
        description:
          'Salsa auténtica cubana con técnica de La Habana. Incluye Casino, Rueda y Son.',
        levels: 'Principiante a Avanzado',
      },
      {
        name: 'Salsa Lady Style',
        description: 'Estilo femenino de salsa con técnica y expresión.',
        levels: 'Todos los niveles',
      },
      {
        name: 'Bachata Sensual',
        description: 'Bachata sensual con movimientos fluidos. Impartida por campeones mundiales.',
        teachers: 'Mathias Font, Eugenia Trujillo',
        levels: 'Principiante a Avanzado',
      },
      {
        name: 'Bachata Lady Style',
        description: 'Estilo femenino de bachata con énfasis en expresión corporal.',
        levels: 'Todos los niveles',
      },
      {
        name: 'Kizomba',
        description: 'Baile sensual de origen angoleño.',
        levels: 'Todos los niveles',
      },
      {
        name: 'Timba',
        description: 'Salsa cubana moderna con influencias de jazz y funk.',
        levels: 'Intermedio a Avanzado',
      },
      {
        name: 'Reggaeton Cubano',
        description:
          'Reggaeton auténtico cubano con ritmo y disociación. Incluye Reparto, Cubatón e improvisación.',
        levels: 'Todos los niveles',
      },
      {
        name: 'Folklore Cubano',
        description: 'Danzas tradicionales cubanas con raíces africanas.',
        levels: 'Todos los niveles',
      },
    ],
  },

  // URBAN DANCES
  danzasUrbanas: {
    name: 'Danzas Urbanas',
    styles: [
      {
        name: 'Hip Hop',
        description: 'Fundamentos y estilos de hip hop urbano. Old School, New Style y House.',
        levels: 'Principiante a Avanzado',
      },
      {
        name: 'Dancehall',
        description: 'Baile urbano jamaicano con energía y actitud.',
        levels: 'Todos los niveles',
      },
      {
        name: 'Twerk',
        description:
          'Técnica de aislamiento y movimiento de cadera. Libera energía y gana confianza.',
        teachers: 'Sandra Gómez',
        levels: 'Todos los niveles',
      },
      {
        name: 'Afrobeat',
        description:
          'Ritmos africanos contemporáneos con profesores nativos africanos. Incluye Amapiano y Ntcham.',
        levels: 'Todos los niveles',
      },
      {
        name: 'K-Pop',
        description:
          'Coreografías de K-Pop coreano. Aprende rutinas de BTS, BLACKPINK, Stray Kids y más.',
        levels: 'Todos los niveles',
      },
      {
        name: 'Commercial Dance',
        description: 'Estilo comercial tipo videoclip con coreografías actuales.',
        levels: 'Todos los niveles',
      },
      {
        name: 'Sexy Reggaeton',
        description: 'Reggaeton con énfasis en movimientos sensuales y actitud.',
        levels: 'Todos los niveles',
      },
    ],
  },

  // CLASSICAL & CONTEMPORARY
  danza: {
    name: 'Danza Clásica y Contemporánea',
    styles: [
      {
        name: 'Ballet',
        description:
          'Ballet clásico cubano con técnica profesional de la Escuela Nacional de Arte de Cuba.',
        levels: 'Todos los niveles',
      },
      {
        name: 'Danza Contemporánea',
        description: 'Expresión corporal y movimiento libre. Técnica y creatividad.',
        levels: 'Todos los niveles',
      },
      {
        name: 'Modern Jazz',
        description: 'Jazz moderno con influencias contemporáneas.',
        levels: 'Todos los niveles',
      },
      {
        name: 'Afro Jazz',
        description: 'Fusión de jazz con ritmos y movimientos africanos.',
        levels: 'Todos los niveles',
      },
      {
        name: 'Afro Contemporáneo',
        description: 'Danza contemporánea con influencias africanas.',
        levels: 'Todos los niveles',
      },
    ],
  },

  // HEELS & FEMININE
  heels: {
    name: 'Heels y Estilo Femenino',
    styles: [
      {
        name: 'Heels',
        description: 'Baile con tacones, feminidad y poder. Técnica de stilettos.',
        levels: 'Todos los niveles',
      },
      {
        name: 'Femmology',
        description: 'Empoderamiento femenino a través del baile. Expresión y confianza.',
        levels: 'Todos los niveles',
      },
      {
        name: 'Sexy Style',
        description: 'Expresión sensual y confianza corporal.',
        levels: 'Todos los niveles',
      },
    ],
  },

  // FITNESS
  fitness: {
    name: 'Fitness y Acondicionamiento',
    styles: [
      {
        name: 'Stretching',
        description: 'Flexibilidad y elongación diseñado para bailarines. Prevención de lesiones.',
        levels: 'Todos los niveles',
      },
      {
        name: 'Cuerpo Fit',
        description: 'Acondicionamiento físico para bailarines.',
        levels: 'Todos los niveles',
      },
      {
        name: 'Ejercicios Glúteos',
        description: 'Entrenamiento específico para glúteos y piernas.',
        levels: 'Todos los niveles',
      },
    ],
  },
};

// Helper function to get all style names as flat array
export function getAllStyleNames(): string[] {
  const styles: string[] = [];
  for (const category of Object.values(DANCE_STYLES)) {
    for (const style of category.styles) {
      styles.push(typeof style === 'string' ? style : style.name);
    }
  }
  return styles;
}

// ============================================================================
// STYLE COMPARISONS - Differences between similar styles
// ============================================================================

export const STYLE_COMPARISONS = {
  salsaVsBachata: {
    question: '¿Cuál es la diferencia entre Salsa y Bachata?',
    answer: `Son bailes latinos pero muy diferentes:

**Salsa Cubana:**
- Ritmo rápido y enérgico (4/4)
- Movimientos circulares y giros
- Se baila en rueda o pareja
- Origen: Cuba, con influencias africanas

**Bachata Sensual:**
- Ritmo más lento y romántico
- Movimientos ondulantes y sensuales
- Mucha conexión en pareja
- Origen: República Dominicana

Si te gusta la energía → Salsa
Si prefieres algo más sensual → Bachata`,
  },

  hipHopVsReggaeton: {
    question: '¿Cuál es la diferencia entre Hip Hop y Reggaeton?',
    answer: `Ambos son urbanos pero con estilos distintos:

**Hip Hop:**
- Origen: Estados Unidos
- Movimientos de aislamiento, popping, locking
- Estilos: Old School, New Style, House
- Música: rap, beats electrónicos

**Reggaeton:**
- Origen: Puerto Rico/Latinoamérica
- Movimientos de cadera y pelvis
- Más sensual y rítmico
- Música: dembow, perreo

Hip Hop = técnica y flow
Reggaeton = ritmo y actitud`,
  },

  contemporaneoVsBallet: {
    question: '¿Cuál es la diferencia entre Contemporáneo y Ballet?',
    answer: `Son complementarios pero distintos:

**Ballet Clásico:**
- Técnica estricta y codificada
- Posiciones de pies (1ª a 5ª)
- Movimientos verticales y elevados
- Zapatillas de punta o media punta

**Danza Contemporánea:**
- Más libre y expresivo
- Trabaja con el suelo (floor work)
- Explora el peso y la gravedad
- Se baila descalzo

El Ballet es la base técnica. El Contemporáneo añade expresión libre.`,
  },

  heelsVsFemmology: {
    question: '¿Cuál es la diferencia entre Heels, Femmology y Sexy Style?',
    answer: `Los tres trabajan feminidad, pero con enfoques distintos:

**Heels:**
- Se baila con tacones stiletto
- Técnica de caminar y bailar con tacones
- Coreografías tipo videoclip
- Requiere tacones de 10cm+ preferiblemente

**Femmology:**
- Empoderamiento femenino
- Trabaja la confianza y expresión
- No requiere tacones obligatoriamente
- Más enfocado en actitud que técnica

**Sexy Style:**
- Expresión sensual y corporal
- Movimientos ondulantes y sensuales
- Se puede hacer con o sin tacones
- Trabaja la conexión con tu cuerpo

Si quieres aprender tacones → Heels
Si buscas empoderamiento → Femmology
Si quieres expresar sensualidad → Sexy Style`,
  },

  twerkVsSexyReggaeton: {
    question: '¿Cuál es la diferencia entre Twerk y Sexy Reggaeton?',
    answer: `Ambos son sensuales pero diferentes:

**Twerk:**
- Aislamiento específico de glúteos
- Técnica: bounce, shake, pop
- Origen: cultura afroamericana
- Trabaja fuerza de glúteos y core

**Sexy Reggaeton:**
- Movimientos de todo el cuerpo
- Ritmo de reggaeton/dembow
- Perreo, ondas, actitud
- Más rítmico y con flow latino

Twerk = técnica de glúteos
Sexy Reggaeton = flow y actitud`,
  },

  afrobeatVsAfroJazz: {
    question: '¿Cuál es la diferencia entre Afrobeat y Afro Jazz?',
    answer: `Ambos tienen raíces africanas pero son distintos:

**Afrobeat/Afrodance:**
- Ritmos africanos contemporáneos
- Incluye Amapiano, Ntcham, Azonto
- Música actual de artistas africanos
- Profesores nativos africanos

**Afro Jazz:**
- Fusión de jazz con movimientos africanos
- Técnica de jazz como base
- Más estructura coreográfica
- Combina lo técnico con lo tribal

Afrobeat = ritmos africanos actuales
Afro Jazz = técnica jazz + influencias africanas`,
  },
};

// ============================================================================
// FREQUENTLY ASKED QUESTIONS - MULTILINGUAL
// ============================================================================

export interface FAQ {
  question: string;
  answer: string;
  keywords: string[];
}

export const FAQS: Record<SupportedLanguage, FAQ[]> = {
  es: [
    {
      question: '¿Cuánto cuestan las clases?',
      answer: `Los precios son:
- 1 clase/semana → 50€/mes
- 2 clases/semana → 78€/mes (la más popular)
- 3 clases/semana → 103€/mes
- Ilimitado → 130€/mes

La clase suelta sale a 15€.
Y lo mejor: ¡la primera clase es GRATIS para que pruebes sin compromiso!`,
      keywords: ['precio', 'precios', 'cuanto', 'cuesta', 'coste', 'tarifa', 'mensualidad'],
    },
    {
      question: '¿Hay matrícula?',
      answer: `¡Ahora mismo la matrícula (que normalmente son 60€) está GRATIS! Es el mejor momento para apuntarse.

Las cuotas mensuales son:
- 1 clase/semana → 50€/mes
- 2 clases/semana → 78€/mes (la más popular)

Y la primera clase es GRATIS para que pruebes sin compromiso.`,
      keywords: ['matricula', 'inscripcion', 'alta'],
    },
    {
      question: '¿Dónde está la academia?',
      answer: `Estamos en Carrer d'Entença 100, Local 1, Barcelona (08015), en el Eixample cerca de Plaza España.

Cómo llegar:
🚇 Metro L1: Rocafort (4 min andando)
🚇 Metro L5: Entença (5 min andando)
🚂 Tren: Sants Estació (8 min andando)
🚌 Bus: Líneas 41, 54, H8

📍 Google Maps: ${CENTER_INFO.googleMaps}`,
      keywords: ['donde', 'direccion', 'ubicacion', 'llegar', 'metro', 'como llego'],
    },
    {
      question: '¿Qué horarios tienen?',
      answer: `Tenemos clases de lunes a viernes:
- Lunes: 10:30-12:30 y 17:30-23:00
- Martes: 10:30-13:30 y 17:30-23:00
- Miércoles: 17:30-23:00
- Jueves: 09:30-11:30 y 17:30-23:00
- Viernes: 17:30-20:30

También hay clases de MAÑANAS (10:00-13:00) con Contemporáneo, Ballet, Jazz y Stretching. ¡Ideal si trabajas por las tardes!`,
      keywords: ['horario', 'horarios', 'hora', 'cuando', 'abierto', 'mañanas', 'tardes'],
    },
    {
      question: '¿Puedo probar una clase gratis?',
      answer:
        '¡Sí! La primera clase es totalmente GRATIS y sin compromiso. Puedes venir a probar cualquier estilo que te interese. Solo tienes que reservar tu plaza.',
      keywords: ['probar', 'prueba', 'gratis', 'gratuita', 'primera clase'],
    },
    {
      question: '¿Necesito experiencia previa?',
      answer:
        '¡Para nada! Tenemos clases para todos los niveles, desde iniciación hasta avanzado. Los profes te guían paso a paso con el Método Farray®.',
      keywords: ['experiencia', 'principiante', 'nivel', 'empezar', 'nunca bailado'],
    },
    {
      question: '¿Qué estilos de baile tienen?',
      answer: `¡Más de 25 estilos! Te cuento:

💃 Latinos: Salsa Cubana, Bachata Sensual, Kizomba, Timba, Reggaeton Cubano
🔥 Urbano: Hip Hop, Dancehall, Twerk, Afrobeat, K-Pop, Commercial
👠 Heels: Heels Dance, Femmology, Sexy Style
🩰 Danza: Ballet Cubano, Contemporáneo, Modern Jazz, Afro Jazz
💪 Fitness: Stretching, Cuerpo Fit

¿Cuál te llama más la atención?`,
      keywords: ['estilos', 'tipos', 'bailes', 'que clases', 'ofrecen'],
    },
    {
      question: '¿Cómo cancelo mi reserva?',
      answer:
        'Puedes cancelar tu reserva hasta 1 hora antes de la clase sin problema. Si cancelas con menos tiempo, se considerará como clase asistida.',
      keywords: ['cancelar', 'cancelacion', 'anular', 'no puedo ir'],
    },
    {
      question: '¿Qué debo llevar a clase?',
      answer: `Depende del estilo:
- Bailes sociales: Bambas o zapatos cómodos (tacones opcional para chicas)
- Urbano: Bambas cómodas y ropa deportiva
- Heels: Tacones stiletto
- Danza: Sin calzado o calcetines antideslizantes

Siempre trae agua y una toalla pequeña. ¡Y llega 10 minutos antes para cambiarte! Tenemos vestuarios.`,
      keywords: ['llevar', 'traer', 'ropa', 'zapatos', 'calzado', 'que pongo'],
    },
    {
      question: '¿Qué es el Método Farray?',
      answer: `El Método Farray® es nuestro sistema de enseñanza exclusivo creado por Yunaisy Farray. Fusiona técnica cubana clásica, ritmo afrocaribeño e innovación contemporánea.

Está certificado por CID-UNESCO y diseñado para adultos europeos. No solo mejorarás técnicamente, sino que ganarás confianza y te sentirás parte de una familia.`,
      keywords: ['metodo', 'farray', 'metodologia', 'enseñanza', 'sistema'],
    },
    {
      question: '¿Quién es Yunaisy Farray?',
      answer: `Yunaisy Farray es la fundadora y directora de Farray's. Es una artista de renombre mundial con más de 20 años de experiencia, graduada de la Escuela Nacional de Arte de Cuba (ENA).

Ha aparecido en Street Dance 2 y fue finalista de Got Talent. Ella creó el Método Farray® que usamos en todas nuestras clases.`,
      keywords: ['yunaisy', 'fundadora', 'directora', 'quien', 'profesora'],
    },
    {
      question: '¿Cómo son las instalaciones?',
      answer: `Tenemos 700 m² con 4 estudios profesionales equipados con:
- Espejos profesionales
- Barras de ballet
- Suelo especial para danza
- Vestuarios

Estamos en el Eixample, cerca de Plaza España, muy bien conectados con metro L1 (Rocafort) y L5 (Entença).`,
      keywords: ['instalaciones', 'salas', 'estudios', 'espacio', 'vestuario'],
    },
    {
      question: '¿Tienen clases particulares?',
      answer: `¡Sí! Ofrecemos clases particulares personalizadas:
- Instructor exclusivo para ti
- Horario flexible
- Cualquiera de nuestros 25+ estilos
- Usando el Método Farray®

Escríbenos para consultar precios y disponibilidad.`,
      keywords: ['particulares', 'privadas', 'individual', 'personalizada'],
    },
    {
      question: '¿Qué estilos de bachata tienen?',
      answer: `Tenemos Bachata Sensual y Bachata Lady Style, impartidas por Mathias Font y Eugenia Trujillo, campeones mundiales de Salsa LA.

Es bachata con movimientos fluidos y mucha expresión. Hay clases desde principiante hasta avanzado.`,
      keywords: ['bachata', 'sensual', 'lady style'],
    },
    {
      question: '¿Tienen K-Pop?',
      answer: `¡Sí! Tenemos clases de K-Pop donde aprendes coreografías de BTS, BLACKPINK, Stray Kids y más artistas coreanos.

Las clases son para todos los niveles. ¡Ven a probar!`,
      keywords: ['kpop', 'k-pop', 'coreano', 'bts', 'blackpink'],
    },
    {
      question: '¿Tienen twerk?',
      answer: `¡Sí! Las clases de Twerk las imparte Sandra Gómez. Aprenderás técnica de aislamiento y movimiento de cadera.

Es una clase que libera mucha energía y te ayuda a ganar confianza. Para todos los niveles.`,
      keywords: ['twerk', 'perreo', 'gluteos'],
    },
    // SERVICES FAQs
    {
      question: '¿Alquilan salas para ensayar?',
      answer: `¡Sí! Tenemos 4 salas profesionales de 40 a 120 m² que puedes alquilar desde 14€/hora.

Incluyen:
- Suelo profesional de danza
- Espejos de pared completa
- Aire acondicionado
- Equipo de sonido

Ideal para ensayos, clases particulares, grabaciones o eventos. Escríbenos para reservar.`,
      keywords: ['alquiler', 'alquilar', 'sala', 'ensayo', 'ensayar', 'espacio'],
    },
    {
      question: '¿Tienen estudio de grabación?',
      answer: `¡Sí! Tenemos un estudio de grabación de baile con:
- Iluminación profesional
- Equipo de sonido de alta calidad
- Espejo y fondo neutro

Perfecto para grabar videoclips, tutoriales o contenido para redes sociales. Contacta para disponibilidad y precios.`,
      keywords: ['grabacion', 'grabar', 'video', 'videoclip', 'estudio', 'tutorial'],
    },
    {
      question: '¿Hacen team building para empresas?',
      answer: `¡Sí! Hemos realizado más de 500 eventos corporativos.

Ofrecemos:
- Clases de baile en grupo (25+ estilos)
- Coreografías personalizadas
- Competiciones amistosas
- Sesiones de team bonding

Experiencias únicas con el Método Farray® - nada de dinámicas vacías. Solicita presupuesto por email o WhatsApp.`,
      keywords: ['team building', 'empresa', 'corporativo', 'evento', 'despedida'],
    },
    {
      question: '¿Tienen tarjetas regalo?',
      answer: `¡Sí! Puedes regalar baile con nuestras tarjetas regalo.

Opciones:
- Clases sueltas
- Bonos de clases
- Experiencias personalizadas

Válidas para los 25+ estilos de baile. Disponibles en recepción o contactando por WhatsApp.`,
      keywords: ['regalo', 'regalar', 'tarjeta', 'bono', 'cumpleaños'],
    },
    // STYLE COMPARISON FAQs
    {
      question: '¿Cuál es la diferencia entre Salsa y Bachata?',
      answer: `Son bailes latinos pero muy diferentes:

**Salsa Cubana:** Ritmo rápido y enérgico, movimientos circulares y giros, se baila en rueda o pareja. Origen cubano.

**Bachata Sensual:** Ritmo más lento y romántico, movimientos ondulantes y sensuales, mucha conexión en pareja. Origen dominicano.

Si te gusta la energía → Salsa
Si prefieres algo más sensual → Bachata`,
      keywords: ['diferencia', 'salsa', 'bachata', 'comparar'],
    },
    {
      question: '¿Cuál es la diferencia entre Hip Hop y Reggaeton?',
      answer: `Ambos son urbanos pero con estilos distintos:

**Hip Hop:** Origen USA, movimientos de aislamiento, popping, locking. Estilos: Old School, New Style, House.

**Reggaeton:** Origen latino, movimientos de cadera y pelvis, más sensual y rítmico. Música: dembow, perreo.

Hip Hop = técnica y flow
Reggaeton = ritmo y actitud`,
      keywords: ['diferencia', 'hip hop', 'reggaeton', 'urbano'],
    },
    {
      question: '¿Cuál es la diferencia entre Heels, Femmology y Sexy Style?',
      answer: `Los tres trabajan feminidad, pero con enfoques distintos:

**Heels:** Se baila con tacones stiletto, técnica de caminar y bailar con tacones. Requiere tacones.

**Femmology:** Empoderamiento femenino, trabaja la confianza y expresión. No requiere tacones obligatoriamente.

**Sexy Style:** Expresión sensual y corporal, movimientos ondulantes. Se puede hacer con o sin tacones.

Si quieres aprender tacones → Heels
Si buscas empoderamiento → Femmology
Si quieres expresar sensualidad → Sexy Style`,
      keywords: ['diferencia', 'heels', 'femmology', 'sexy style', 'feminidad'],
    },
    {
      question: '¿Cuál es la diferencia entre Contemporáneo y Ballet?',
      answer: `Son complementarios pero distintos:

**Ballet Clásico:** Técnica estricta y codificada, posiciones de pies, movimientos verticales y elevados. Se usa zapatillas.

**Danza Contemporánea:** Más libre y expresivo, trabaja con el suelo (floor work), explora el peso y la gravedad. Se baila descalzo.

El Ballet es la base técnica. El Contemporáneo añade expresión libre.`,
      keywords: ['diferencia', 'contemporaneo', 'ballet', 'danza', 'clasico'],
    },
  ],

  ca: [
    {
      question: 'Quant costen les classes?',
      answer: `Els preus són:
- 1 classe/setmana → 50€/mes
- 2 classes/setmana → 78€/mes (la més popular)
- 3 classes/setmana → 103€/mes
- Il·limitat → 130€/mes

La classe solta surt a 15€.
I el millor: la primera classe és GRATIS per provar sense compromís!`,
      keywords: ['preu', 'preus', 'quant', 'costa', 'cost', 'tarifa', 'mensualitat'],
    },
    {
      question: 'Hi ha matrícula?',
      answer: `Ara mateix la matrícula (que normalment són 60€) està GRATIS! És el millor moment per apuntar-s'hi.

Les quotes mensuals són:
- 1 classe/setmana → 50€/mes
- 2 classes/setmana → 78€/mes (la més popular)

I la primera classe és GRATIS per provar sense compromís.`,
      keywords: ['matricula', 'inscripcio', 'alta'],
    },
    {
      question: "On és l'acadèmia?",
      answer: `Som a C/ Entença 100, Local 1, Barcelona (08015).

Com arribar:
🚇 Metro: Rocafort (L1) o Entença (L5)
🚌 Bus: Línies 41, 54, H8

📍 Google Maps: ${CENTER_INFO.googleMaps}`,
      keywords: ['on', 'direccio', 'ubicacio', 'arribar', 'metro', 'com arribo'],
    },
    {
      question: 'Quins horaris teniu?',
      answer: `Tenim classes de dilluns a dissabte.
El centre està obert:
- Dilluns a Divendres: 10:00 - 22:00
- Dissabte: 10:00 - 14:00

Les classes comencen des de les 17:00 entre setmana.`,
      keywords: ['horari', 'horaris', 'hora', 'quan', 'obert'],
    },
    {
      question: 'Puc provar una classe gratis?',
      answer:
        "Sí! La primera classe és totalment GRATIS i sense compromís. Pots venir a provar qualsevol estil que t'interessi. Només has de reservar la teva plaça.",
      keywords: ['provar', 'prova', 'gratis', 'gratuita', 'primera classe'],
    },
    {
      question: 'Necessito experiència prèvia?',
      answer:
        "No cal! Tenim classes per a tots els nivells, des d'iniciació fins a avançat. Els profes et guien pas a pas amb el Mètode Farray®.",
      keywords: ['experiencia', 'principiant', 'nivell', 'començar', 'mai ballat'],
    },
    {
      question: 'Quins estils de ball teniu?',
      answer: `Més de 25 estils! Et comento:

💃 Llatins: Salsa Cubana, Bachata Sensual, Kizomba, Timba, Reggaeton Cubà
🔥 Urbà: Hip Hop, Dancehall, Twerk, Afrobeat, K-Pop, Commercial
👠 Heels: Heels Dance, Femmology, Sexy Style
🩰 Dansa: Ballet Cubà, Contemporani, Modern Jazz, Afro Jazz
💪 Fitness: Stretching, Cos Fit

Quin t'agrada més?`,
      keywords: ['estils', 'tipus', 'balls', 'quines classes', 'oferiu'],
    },
    {
      question: 'Com cancel·lo la meva reserva?',
      answer:
        'Pots cancel·lar la teva reserva fins a 1 hora abans de la classe sense problema. Si cancel·les amb menys temps, es considerarà com a classe assistida.',
      keywords: ['cancelar', 'cancelacio', 'anular', 'no puc anar'],
    },
    {
      question: 'Què he de portar a classe?',
      answer: `Depèn de l'estil:
- Balls socials: Bambes o sabates còmodes (talons opcional per a noies)
- Urbà: Bambes còmodes i roba esportiva
- Heels: Talons stiletto
- Dansa: Sense calçat o mitjons antilliscants

Sempre porta aigua i una tovallola petita. I arriba 10 minuts abans per canviar-te! Tenim vestidors.`,
      keywords: ['portar', 'dur', 'roba', 'sabates', 'calcat', 'que poso'],
    },
    {
      question: 'Què és el Mètode Farray?',
      answer: `El Mètode Farray® és el nostre sistema d'ensenyament exclusiu creat per Yunaisy Farray. Fusiona tècnica cubana clàssica, ritme afrocaribeny i innovació contemporània.

Està certificat per CID-UNESCO i dissenyat per a adults europeus. No només milloraràs tècnicament, sinó que guanyaràs confiança i et sentiràs part d'una família.`,
      keywords: ['metode', 'farray', 'metodologia', 'ensenyament', 'sistema'],
    },
    {
      question: 'Qui és Yunaisy Farray?',
      answer: `Yunaisy Farray és la fundadora i directora de Farray's. És una artista de renom mundial amb més de 20 anys d'experiència, graduada de l'Escola Nacional d'Art de Cuba (ENA).

Ha aparegut a Street Dance 2 i va ser finalista de Got Talent. Ella va crear el Mètode Farray® que fem servir a totes les nostres classes.`,
      keywords: ['yunaisy', 'fundadora', 'directora', 'qui', 'professora'],
    },
    {
      question: 'Com són les instal·lacions?',
      answer: `Tenim 700 m² amb 4 estudis professionals equipats amb:
- Miralls professionals
- Barres de ballet
- Terra especial per a dansa
- Vestidors

Som a l'Eixample, a prop de Plaça Espanya, molt ben connectats amb metro L1 (Rocafort) i L5 (Entença).`,
      keywords: ['installacions', 'sales', 'estudis', 'espai', 'vestidor'],
    },
    {
      question: 'Teniu classes particulars?',
      answer: `Sí! Oferim classes particulars personalitzades:
- Instructor exclusiu per a tu
- Horari flexible
- Qualsevol dels nostres 25+ estils
- Amb el Mètode Farray®

Escriu-nos per consultar preus i disponibilitat.`,
      keywords: ['particulars', 'privades', 'individual', 'personalitzada'],
    },
    {
      question: 'Quins estils de bachata teniu?',
      answer: `Tenim Bachata Sensual i Bachata Lady Style, impartides per Mathias Font i Eugenia Trujillo, campions mundials de Salsa LA.

És bachata amb moviments fluids i molta expressió. Hi ha classes des de principiant fins a avançat.`,
      keywords: ['bachata', 'sensual', 'lady style'],
    },
    {
      question: 'Teniu K-Pop?',
      answer: `Sí! Tenim classes de K-Pop on aprens coreografies de BTS, BLACKPINK, Stray Kids i més artistes coreans.

Les classes són per a tots els nivells. Vine a provar!`,
      keywords: ['kpop', 'k-pop', 'corea', 'bts', 'blackpink'],
    },
    {
      question: 'Teniu twerk?',
      answer: `Sí! Les classes de Twerk les imparteix Sandra Gómez. Aprendràs tècnica d'aïllament i moviment de maluc.

És una classe que allibera molta energia i t'ajuda a guanyar confiança. Per a tots els nivells.`,
      keywords: ['twerk', 'perreo', 'glutis'],
    },
    {
      question: 'Llogueu sales per assajar?',
      answer: `Sí! Tenim 4 sales professionals de 40 a 120 m² que pots llogar des de 14€/hora.

Inclouen:
- Terra professional de dansa
- Miralls de paret completa
- Aire condicionat
- Equip de so

Ideal per a assajos, classes particulars, gravacions o esdeveniments. Escriu-nos per reservar.`,
      keywords: ['lloguer', 'llogar', 'sala', 'assaig', 'assajar', 'espai'],
    },
    {
      question: 'Teniu estudi de gravació?',
      answer: `Sí! Tenim un estudi de gravació de ball amb:
- Il·luminació professional
- Equip de so d'alta qualitat
- Mirall i fons neutre

Perfecte per gravar videoclips, tutorials o contingut per a xarxes socials. Contacta per disponibilitat i preus.`,
      keywords: ['gravacio', 'gravar', 'video', 'videoclip', 'estudi', 'tutorial'],
    },
    {
      question: 'Feu team building per a empreses?',
      answer: `Sí! Hem realitzat més de 500 esdeveniments corporatius.

Oferim:
- Classes de ball en grup (25+ estils)
- Coreografies personalitzades
- Competicions amistoses
- Sessions de team bonding

Experiències úniques amb el Mètode Farray® - res de dinàmiques buides. Sol·licita pressupost per email o WhatsApp.`,
      keywords: ['team building', 'empresa', 'corporatiu', 'esdeveniment', 'comiat'],
    },
    {
      question: 'Teniu targetes regal?',
      answer: `Sí! Pots regalar ball amb les nostres targetes regal.

Opcions:
- Classes soltes
- Bons de classes
- Experiències personalitzades

Vàlides per als 25+ estils de ball. Disponibles a recepció o contactant per WhatsApp.`,
      keywords: ['regal', 'regalar', 'targeta', 'bo', 'aniversari'],
    },
    {
      question: 'Quina és la diferència entre Salsa i Bachata?',
      answer: `Són balls llatins però molt diferents:

**Salsa Cubana:** Ritme ràpid i enèrgic, moviments circulars i girs, es balla en roda o parella. Origen cubà.

**Bachata Sensual:** Ritme més lent i romàntic, moviments ondulants i sensuals, molta connexió en parella. Origen dominicà.

Si t'agrada l'energia → Salsa
Si prefereixes alguna cosa més sensual → Bachata`,
      keywords: ['diferencia', 'salsa', 'bachata', 'comparar'],
    },
    {
      question: 'Quina és la diferència entre Hip Hop i Reggaeton?',
      answer: `Tots dos són urbans però amb estils diferents:

**Hip Hop:** Origen USA, moviments d'aïllament, popping, locking. Estils: Old School, New Style, House.

**Reggaeton:** Origen llatí, moviments de maluc i pelvis, més sensual i rítmic. Música: dembow, perreo.

Hip Hop = tècnica i flow
Reggaeton = ritme i actitud`,
      keywords: ['diferencia', 'hip hop', 'reggaeton', 'urba'],
    },
    {
      question: 'Quina és la diferència entre Heels, Femmology i Sexy Style?',
      answer: `Els tres treballen feminitat, però amb enfocaments diferents:

**Heels:** Es balla amb talons stiletto, tècnica de caminar i ballar amb talons. Requereix talons.

**Femmology:** Apoderament femení, treballa la confiança i expressió. No requereix talons obligatòriament.

**Sexy Style:** Expressió sensual i corporal, moviments ondulants. Es pot fer amb o sense talons.

Si vols aprendre talons → Heels
Si busques apoderament → Femmology
Si vols expressar sensualitat → Sexy Style`,
      keywords: ['diferencia', 'heels', 'femmology', 'sexy style', 'feminitat'],
    },
    {
      question: 'Quina és la diferència entre Contemporani i Ballet?',
      answer: `Són complementaris però diferents:

**Ballet Clàssic:** Tècnica estricta i codificada, posicions de peus, moviments verticals i elevats. Es fan servir sabatilles.

**Dansa Contemporània:** Més lliure i expressiu, treballa amb el terra (floor work), explora el pes i la gravetat. Es balla descalç.

El Ballet és la base tècnica. El Contemporani afegeix expressió lliure.`,
      keywords: ['diferencia', 'contemporani', 'ballet', 'dansa', 'classic'],
    },
  ],

  en: [
    {
      question: 'How much do classes cost?',
      answer: `Our prices are:
- 1 class/week → 50€/month
- 2 classes/week → 78€/month (most popular)
- 3 classes/week → 103€/month
- Unlimited → 130€/month

Single class is 15€.
Best part: your first class is FREE with no commitment!`,
      keywords: ['price', 'prices', 'cost', 'how much', 'fee', 'rate'],
    },
    {
      question: 'Is there a registration fee?',
      answer: `Right now the registration fee (normally 60€) is FREE! It's the best time to sign up.

Monthly fees:
- 1 class/week → 50€/month
- 2 classes/week → 78€/month (most popular)

And your first class is FREE with no commitment.`,
      keywords: ['registration', 'signup', 'fee', 'enrollment'],
    },
    {
      question: 'Where is the academy?',
      answer: `We're at C/ Entença 100, Local 1, Barcelona (08015).

How to get here:
🚇 Metro: Rocafort (L1) or Entença (L5)
🚌 Bus: Lines 41, 54, H8

📍 Google Maps: ${CENTER_INFO.googleMaps}`,
      keywords: ['where', 'address', 'location', 'directions', 'metro', 'how to get'],
    },
    {
      question: 'What are your hours?',
      answer: `We have classes Monday to Saturday.
Opening hours:
- Monday to Friday: 10:00 - 22:00
- Saturday: 10:00 - 14:00

Classes start from 5pm on weekdays.`,
      keywords: ['hours', 'schedule', 'time', 'when', 'open'],
    },
    {
      question: 'Can I try a free class?',
      answer:
        "Yes! Your first class is completely FREE with no commitment. You can come try any style you're interested in. Just book your spot.",
      keywords: ['try', 'trial', 'free', 'first class', 'test'],
    },
    {
      question: 'Do I need prior experience?',
      answer:
        'Not at all! We have classes for all levels, from beginner to advanced. Our teachers guide you step by step with the Farray Method®.',
      keywords: ['experience', 'beginner', 'level', 'start', 'never danced'],
    },
    {
      question: 'What dance styles do you offer?',
      answer: `Over 25 styles! Here's what we have:

💃 Latin: Cuban Salsa, Sensual Bachata, Kizomba, Timba, Cuban Reggaeton
🔥 Urban: Hip Hop, Dancehall, Twerk, Afrobeat, K-Pop, Commercial
👠 Heels: Heels Dance, Femmology, Sexy Style
🩰 Dance: Cuban Ballet, Contemporary, Modern Jazz, Afro Jazz
💪 Fitness: Stretching, Body Fit

Which one catches your attention?`,
      keywords: ['styles', 'types', 'dances', 'what classes', 'offer'],
    },
    {
      question: 'How do I cancel my booking?',
      answer:
        'You can cancel your booking up to 1 hour before the class with no problem. If you cancel with less notice, it will be counted as an attended class.',
      keywords: ['cancel', 'cancellation', 'reschedule', 'cant go'],
    },
    {
      question: 'What should I bring to class?',
      answer: `It depends on the style:
- Social dances: Sneakers or comfortable shoes (heels optional for ladies)
- Urban: Comfortable sneakers and sportswear
- Heels: Stiletto heels
- Dance: Barefoot or non-slip socks

Always bring water and a small towel. And arrive 10 minutes early to change! We have changing rooms.`,
      keywords: ['bring', 'wear', 'clothes', 'shoes', 'footwear', 'what to wear'],
    },
    {
      question: 'What is the Farray Method?',
      answer: `The Farray Method® is our exclusive teaching system created by Yunaisy Farray. It fuses classic Cuban technique, Afro-Caribbean rhythm, and contemporary innovation.

It's certified by CID-UNESCO and designed for European adults. You'll not only improve technically, but you'll gain confidence and feel part of a family.`,
      keywords: ['method', 'farray', 'methodology', 'teaching', 'system'],
    },
    {
      question: 'Who is Yunaisy Farray?',
      answer: `Yunaisy Farray is the founder and director of Farray's. She's a world-renowned artist with over 20 years of experience, graduated from Cuba's National School of Art (ENA).

She appeared in Street Dance 2 and was a Got Talent finalist. She created the Farray Method® that we use in all our classes.`,
      keywords: ['yunaisy', 'founder', 'director', 'who', 'teacher'],
    },
    {
      question: 'What are the facilities like?',
      answer: `We have 700 m² with 4 professional studios equipped with:
- Professional mirrors
- Ballet bars
- Special dance flooring
- Changing rooms

We're in Eixample, near Plaza España, with great metro connections: L1 (Rocafort) and L5 (Entença).`,
      keywords: ['facilities', 'studios', 'rooms', 'space', 'changing room'],
    },
    {
      question: 'Do you offer private lessons?',
      answer: `Yes! We offer personalized private lessons:
- Exclusive instructor for you
- Flexible schedule
- Any of our 25+ styles
- Using the Farray Method®

Contact us to check prices and availability.`,
      keywords: ['private', 'individual', 'one on one', 'personalized'],
    },
    {
      question: 'What bachata styles do you have?',
      answer: `We have Sensual Bachata and Bachata Lady Style, taught by Mathias Font and Eugenia Trujillo, World Champions in LA Salsa.

It's bachata with fluid movements and lots of expression. Classes range from beginner to advanced.`,
      keywords: ['bachata', 'sensual', 'lady style'],
    },
    {
      question: 'Do you have K-Pop?',
      answer: `Yes! We have K-Pop classes where you learn choreographies from BTS, BLACKPINK, Stray Kids and more Korean artists.

Classes are for all levels. Come try it out!`,
      keywords: ['kpop', 'k-pop', 'korean', 'bts', 'blackpink'],
    },
    {
      question: 'Do you have twerk?',
      answer: `Yes! Twerk classes are taught by Sandra Gómez. You'll learn isolation technique and hip movement.

It's a class that releases a lot of energy and helps you gain confidence. For all levels.`,
      keywords: ['twerk', 'booty', 'glutes'],
    },
    {
      question: 'Do you rent studios for practice?',
      answer: `Yes! We have 4 professional studios from 40 to 120 m² that you can rent from 14€/hour.

They include:
- Professional dance flooring
- Full wall mirrors
- Air conditioning
- Sound system

Perfect for rehearsals, private classes, recordings or events. Contact us to book.`,
      keywords: ['rent', 'rental', 'studio', 'rehearsal', 'practice', 'space'],
    },
    {
      question: 'Do you have a recording studio?',
      answer: `Yes! We have a dance recording studio with:
- Professional lighting
- High quality sound system
- Mirror and neutral backdrop

Perfect for recording music videos, tutorials or social media content. Contact us for availability and prices.`,
      keywords: ['recording', 'record', 'video', 'music video', 'studio', 'tutorial'],
    },
    {
      question: 'Do you do corporate team building?',
      answer: `Yes! We've done over 500 corporate events.

We offer:
- Group dance classes (25+ styles)
- Custom choreographies
- Friendly competitions
- Team bonding sessions

Unique experiences with the Farray Method® - no empty dynamics. Request a quote by email or WhatsApp.`,
      keywords: ['team building', 'company', 'corporate', 'event', 'party'],
    },
    {
      question: 'Do you have gift cards?',
      answer: `Yes! You can gift dance with our gift cards.

Options:
- Single classes
- Class packages
- Personalized experiences

Valid for all 25+ dance styles. Available at reception or by contacting us on WhatsApp.`,
      keywords: ['gift', 'present', 'card', 'voucher', 'birthday'],
    },
    {
      question: "What's the difference between Salsa and Bachata?",
      answer: `They're both Latin dances but very different:

**Cuban Salsa:** Fast and energetic rhythm, circular movements and turns, danced in wheel or as a couple. Cuban origin.

**Sensual Bachata:** Slower and more romantic rhythm, wavy and sensual movements, lots of partner connection. Dominican origin.

If you like energy → Salsa
If you prefer something more sensual → Bachata`,
      keywords: ['difference', 'salsa', 'bachata', 'compare'],
    },
    {
      question: "What's the difference between Hip Hop and Reggaeton?",
      answer: `Both are urban but with different styles:

**Hip Hop:** US origin, isolation movements, popping, locking. Styles: Old School, New Style, House.

**Reggaeton:** Latin origin, hip and pelvis movements, more sensual and rhythmic. Music: dembow, perreo.

Hip Hop = technique and flow
Reggaeton = rhythm and attitude`,
      keywords: ['difference', 'hip hop', 'reggaeton', 'urban'],
    },
    {
      question: "What's the difference between Heels, Femmology and Sexy Style?",
      answer: `All three work on femininity, but with different approaches:

**Heels:** Danced in stiletto heels, walking and dancing technique in heels. Requires heels.

**Femmology:** Female empowerment, works on confidence and expression. Heels not mandatory.

**Sexy Style:** Sensual and body expression, wavy movements. Can be done with or without heels.

If you want to learn heels → Heels
If you're looking for empowerment → Femmology
If you want to express sensuality → Sexy Style`,
      keywords: ['difference', 'heels', 'femmology', 'sexy style', 'femininity'],
    },
    {
      question: "What's the difference between Contemporary and Ballet?",
      answer: `They're complementary but different:

**Classical Ballet:** Strict and codified technique, foot positions, vertical and elevated movements. Uses ballet shoes.

**Contemporary Dance:** Freer and more expressive, floor work, explores weight and gravity. Danced barefoot.

Ballet is the technical foundation. Contemporary adds free expression.`,
      keywords: ['difference', 'contemporary', 'ballet', 'dance', 'classical'],
    },
  ],

  fr: [
    {
      question: 'Combien coûtent les cours?',
      answer: `Nos prix sont:
- 1 cours/semaine → 50€/mois
- 2 cours/semaine → 78€/mois (le plus populaire)
- 3 cours/semaine → 103€/mois
- Illimité → 130€/mois

Le cours à l'unité est à 15€.
Le meilleur: le premier cours est GRATUIT sans engagement!`,
      keywords: ['prix', 'coute', 'combien', 'tarif', 'cout'],
    },
    {
      question: "Y a-t-il des frais d'inscription?",
      answer: `En ce moment les frais d'inscription (normalement 60€) sont GRATUITS! C'est le meilleur moment pour s'inscrire.

Les tarifs mensuels:
- 1 cours/semaine → 50€/mois
- 2 cours/semaine → 78€/mois (le plus populaire)

Et le premier cours est GRATUIT sans engagement.`,
      keywords: ['inscription', 'frais', 'enregistrement'],
    },
    {
      question: "Où se trouve l'académie?",
      answer: `Nous sommes au C/ Entença 100, Local 1, Barcelona (08015).

Comment y arriver:
🚇 Métro: Rocafort (L1) ou Entença (L5)
🚌 Bus: Lignes 41, 54, H8

📍 Google Maps: ${CENTER_INFO.googleMaps}`,
      keywords: ['ou', 'adresse', 'emplacement', 'comment', 'metro', 'arriver'],
    },
    {
      question: 'Quels sont vos horaires?',
      answer: `Nous avons des cours du lundi au samedi.
Horaires d'ouverture:
- Lundi au Vendredi: 10:00 - 22:00
- Samedi: 10:00 - 14:00

Les cours commencent à partir de 17h en semaine.`,
      keywords: ['horaires', 'heure', 'quand', 'ouvert'],
    },
    {
      question: 'Puis-je essayer un cours gratuit?',
      answer:
        "Oui! Le premier cours est totalement GRATUIT et sans engagement. Vous pouvez venir essayer n'importe quel style qui vous intéresse. Il suffit de réserver votre place.",
      keywords: ['essayer', 'essai', 'gratuit', 'premier cours', 'test'],
    },
    {
      question: "Ai-je besoin d'expérience préalable?",
      answer:
        "Pas du tout! Nous avons des cours pour tous les niveaux, du débutant à l'avancé. Les profs te guident pas à pas avec la Méthode Farray®.",
      keywords: ['experience', 'debutant', 'niveau', 'commencer', 'jamais danse'],
    },
    {
      question: 'Quels styles de danse proposez-vous?',
      answer: `Plus de 25 styles! Voici ce qu'on a:

💃 Latin: Salsa Cubaine, Bachata Sensuelle, Kizomba, Timba, Reggaeton Cubain
🔥 Urbain: Hip Hop, Dancehall, Twerk, Afrobeat, K-Pop, Commercial
👠 Heels: Heels Dance, Femmology, Sexy Style
🩰 Danse: Ballet Cubain, Contemporain, Modern Jazz, Afro Jazz
💪 Fitness: Stretching, Body Fit

Lequel t'attire le plus?`,
      keywords: ['styles', 'types', 'danses', 'quels cours', 'proposez'],
    },
    {
      question: "Comment j'annule ma réservation?",
      answer:
        "Tu peux annuler ta réservation jusqu'à 1 heure avant le cours sans problème. Si tu annules avec moins de temps, ça sera compté comme cours assisté.",
      keywords: ['annuler', 'annulation', 'reporter', 'peux pas venir'],
    },
    {
      question: 'Que dois-je apporter au cours?',
      answer: `Ça dépend du style:
- Danses sociales: Baskets ou chaussures confortables (talons optionnel pour les filles)
- Urbain: Baskets confortables et vêtements de sport
- Heels: Talons stiletto
- Danse: Pieds nus ou chaussettes antidérapantes

Apporte toujours de l'eau et une petite serviette. Et arrive 10 minutes avant pour te changer! On a des vestiaires.`,
      keywords: ['apporter', 'amener', 'vetements', 'chaussures', 'quoi porter'],
    },
    {
      question: "Qu'est-ce que la Méthode Farray?",
      answer: `La Méthode Farray® est notre système d'enseignement exclusif créé par Yunaisy Farray. Elle fusionne la technique cubaine classique, le rythme afro-caribéen et l'innovation contemporaine.

Elle est certifiée par CID-UNESCO et conçue pour les adultes européens. Tu vas non seulement t'améliorer techniquement, mais aussi gagner en confiance et te sentir partie d'une famille.`,
      keywords: ['methode', 'farray', 'methodologie', 'enseignement', 'systeme'],
    },
    {
      question: 'Qui est Yunaisy Farray?',
      answer: `Yunaisy Farray est la fondatrice et directrice de Farray's. C'est une artiste de renommée mondiale avec plus de 20 ans d'expérience, diplômée de l'École Nationale d'Art de Cuba (ENA).

Elle est apparue dans Street Dance 2 et a été finaliste de Got Talent. Elle a créé la Méthode Farray® qu'on utilise dans tous nos cours.`,
      keywords: ['yunaisy', 'fondatrice', 'directrice', 'qui', 'prof'],
    },
    {
      question: 'Comment sont les installations?',
      answer: `On a 700 m² avec 4 studios professionnels équipés de:
- Miroirs professionnels
- Barres de ballet
- Sol spécial pour la danse
- Vestiaires

On est dans l'Eixample, près de Plaza España, très bien connectés avec le métro L1 (Rocafort) et L5 (Entença).`,
      keywords: ['installations', 'salles', 'studios', 'espace', 'vestiaire'],
    },
    {
      question: 'Proposez-vous des cours particuliers?',
      answer: `Oui! On offre des cours particuliers personnalisés:
- Instructeur exclusif pour toi
- Horaire flexible
- N'importe lequel de nos 25+ styles
- Avec la Méthode Farray®

Contacte-nous pour les prix et disponibilité.`,
      keywords: ['particuliers', 'prives', 'individuel', 'personnalise'],
    },
    {
      question: 'Quels styles de bachata avez-vous?',
      answer: `On a Bachata Sensuelle et Bachata Lady Style, enseignées par Mathias Font et Eugenia Trujillo, Champions du Monde de Salsa LA.

C'est de la bachata avec des mouvements fluides et beaucoup d'expression. Il y a des cours du débutant à l'avancé.`,
      keywords: ['bachata', 'sensuelle', 'lady style'],
    },
    {
      question: 'Avez-vous du K-Pop?',
      answer: `Oui! On a des cours de K-Pop où tu apprends des chorégraphies de BTS, BLACKPINK, Stray Kids et plus d'artistes coréens.

Les cours sont pour tous les niveaux. Viens essayer!`,
      keywords: ['kpop', 'k-pop', 'coreen', 'bts', 'blackpink'],
    },
    {
      question: 'Avez-vous du twerk?',
      answer: `Oui! Les cours de Twerk sont donnés par Sandra Gómez. Tu apprendras la technique d'isolation et le mouvement des hanches.

C'est un cours qui libère beaucoup d'énergie et t'aide à gagner en confiance. Pour tous les niveaux.`,
      keywords: ['twerk', 'booty', 'fessiers'],
    },
    {
      question: 'Louez-vous des salles pour répéter?',
      answer: `Oui! On a 4 salles professionnelles de 40 à 120 m² que tu peux louer à partir de 14€/heure.

Elles incluent:
- Sol professionnel de danse
- Miroirs mur complet
- Climatisation
- Équipement son

Idéal pour répétitions, cours particuliers, enregistrements ou événements. Contacte-nous pour réserver.`,
      keywords: ['location', 'louer', 'salle', 'repetition', 'repeter', 'espace'],
    },
    {
      question: "Avez-vous un studio d'enregistrement?",
      answer: `Oui! On a un studio d'enregistrement de danse avec:
- Éclairage professionnel
- Équipement son haute qualité
- Miroir et fond neutre

Parfait pour enregistrer des clips, tutoriels ou contenu pour les réseaux sociaux. Contacte-nous pour disponibilité et prix.`,
      keywords: ['enregistrement', 'enregistrer', 'video', 'clip', 'studio', 'tutoriel'],
    },
    {
      question: 'Faites-vous du team building pour les entreprises?',
      answer: `Oui! On a réalisé plus de 500 événements corporate.

On offre:
- Cours de danse en groupe (25+ styles)
- Chorégraphies personnalisées
- Compétitions amicales
- Sessions de team bonding

Expériences uniques avec la Méthode Farray® - pas de dynamiques vides. Demande un devis par email ou WhatsApp.`,
      keywords: ['team building', 'entreprise', 'corporate', 'evenement', 'fete'],
    },
    {
      question: 'Avez-vous des cartes cadeaux?',
      answer: `Oui! Tu peux offrir de la danse avec nos cartes cadeaux.

Options:
- Cours à l'unité
- Forfaits de cours
- Expériences personnalisées

Valables pour les 25+ styles de danse. Disponibles à l'accueil ou en nous contactant sur WhatsApp.`,
      keywords: ['cadeau', 'offrir', 'carte', 'bon', 'anniversaire'],
    },
    {
      question: 'Quelle est la différence entre Salsa et Bachata?',
      answer: `Ce sont deux danses latines mais très différentes:

**Salsa Cubaine:** Rythme rapide et énergique, mouvements circulaires et tours, se danse en rueda ou en couple. Origine cubaine.

**Bachata Sensuelle:** Rythme plus lent et romantique, mouvements ondulants et sensuels, beaucoup de connexion en couple. Origine dominicaine.

Si tu aimes l'énergie → Salsa
Si tu préfères quelque chose de plus sensuel → Bachata`,
      keywords: ['difference', 'salsa', 'bachata', 'comparer'],
    },
    {
      question: 'Quelle est la différence entre Hip Hop et Reggaeton?',
      answer: `Les deux sont urbains mais avec des styles différents:

**Hip Hop:** Origine USA, mouvements d'isolation, popping, locking. Styles: Old School, New Style, House.

**Reggaeton:** Origine latino, mouvements de hanches et bassin, plus sensuel et rythmique. Musique: dembow, perreo.

Hip Hop = technique et flow
Reggaeton = rythme et attitude`,
      keywords: ['difference', 'hip hop', 'reggaeton', 'urbain'],
    },
    {
      question: 'Quelle est la différence entre Heels, Femmology et Sexy Style?',
      answer: `Les trois travaillent la féminité, mais avec des approches différentes:

**Heels:** Se danse en talons stiletto, technique de marche et danse en talons. Requiert des talons.

**Femmology:** Empowerment féminin, travaille la confiance et l'expression. Talons pas obligatoires.

**Sexy Style:** Expression sensuelle et corporelle, mouvements ondulants. Peut se faire avec ou sans talons.

Si tu veux apprendre les talons → Heels
Si tu cherches l'empowerment → Femmology
Si tu veux exprimer ta sensualité → Sexy Style`,
      keywords: ['difference', 'heels', 'femmology', 'sexy style', 'feminite'],
    },
    {
      question: 'Quelle est la différence entre Contemporain et Ballet?',
      answer: `Ils sont complémentaires mais différents:

**Ballet Classique:** Technique stricte et codifiée, positions des pieds, mouvements verticaux et élevés. On utilise des chaussons.

**Danse Contemporaine:** Plus libre et expressif, travail au sol (floor work), explore le poids et la gravité. Se danse pieds nus.

Le Ballet est la base technique. Le Contemporain ajoute l'expression libre.`,
      keywords: ['difference', 'contemporain', 'ballet', 'danse', 'classique'],
    },
  ],
};

// ============================================================================
// CUSTOMER POLICIES - Operational rules for students
// ============================================================================

export const CUSTOMER_POLICIES = {
  // Booking and reservations
  reservations: {
    isRequired: true,
    platform: 'Momence',
    appLinks: {
      ios: 'https://apps.apple.com/us/app/momence/id1577856009',
      android: 'https://play.google.com/store/apps/details?id=com.ribbon.mobileApp',
      web: 'https://momence.com/sign-in?hostId=36148',
    },
    signupUrl: 'https://www.farrayscenter.com/alta',
    scheduleUrl: 'https://www.farrayscenter.com/horarios',
    checkInRequired: true,
    selfManaged: true, // Students must manage their own reservations
    noManualBookings: true, // No bookings via WhatsApp, phone, or email
  },

  // Cancellation policies
  cancellation: {
    minimumNoticeHours: 2,
    recoveryPeriodDays: 30,
    lateCancellationCountsAsAttended: true,
    neverAccumulate: true, // Credits don't accumulate to next month
    onlyActiveMembersCanRecover: true,
  },

  // Membership policies
  membership: {
    unsubscribeNoticesDays: 15,
    unsubscribeEmail: 'info@farrayscenter.com',
    pauseMaintenanceFee: 15, // euros/month
    pauseNoticesDays: 15,
    cannotChangeCourseWeekly: true, // Must attend same classes each week
    onlyRecoveryAllowsDifferentClass: true,
  },

  // Class packs (bonos de horas)
  classPacks: {
    validityMonths: 6,
    activationOnFirstBooking: true,
    flexibleSchedule: true,
    canChangeCourses: true,
  },

  // Registration fees
  registration: {
    firstYear: 60,
    renewalAnnual: 20,
    renewalDate: '1 de agosto',
    discountCondition: 'Estudiantes dados de alta de forma continuada',
  },

  // Course info
  courseInfo: {
    currentYear: '2025-2026',
    startDate: '1 de septiembre de 2025',
    endDate: '28 de julio de 2026',
    weekdayHours: '18:00-23:00',
    classesPerWeek: '100+',
    classDuration: '1 hora (algunas 1.5 horas)',
  },
};

// ============================================================================
// OPERATIONAL FAQS - Customer account & booking questions
// ============================================================================

export const OPERATIONAL_FAQS = {
  // How to sign up
  signup: {
    question: '¿Cómo me doy de alta?',
    answer: `Para darte de alta por primera vez:
1. Ve a www.farrayscenter.com/alta
2. Sigue los pasos para crear tu cuenta

Si ya tienes cuenta en Momence:
1. Inicia sesión en momence.com/sign-in?hostId=36148
2. Haz clic en el logo de Farray's
3. Selecciona el producto a comprar`,
    keywords: ['alta', 'registrar', 'registro', 'nuevo', 'primera vez', 'apuntar', 'inscribir'],
  },

  // Download app
  downloadApp: {
    question: '¿Dónde descargo la app de Momence?',
    answer: `Puedes descargar la app de Momence:
- iPhone/iPad: App Store (busca "Momence")
- Android: Google Play Store
- Ordenador: momence.com/sign-in?hostId=36148

Si es tu primera vez, date de alta primero en www.farrayscenter.com/alta`,
    keywords: ['app', 'aplicacion', 'descargar', 'momence', 'movil', 'telefono'],
  },

  // Check-in
  checkIn: {
    question: '¿Tengo que hacer check-in?',
    answer: `Sí, todos los estudiantes deben hacer check-in en recepción al llegar. Después, los profesores pasan lista en cada sala.

Para hacer check-in necesitas la app de Momence instalada con tus reservas gestionadas correctamente.`,
    keywords: ['check-in', 'checkin', 'llegada', 'recepcion', 'lista'],
  },

  // Book a class
  bookClass: {
    question: '¿Cómo reservo una clase?',
    answer: `Para reservar clases:

1. Desde la web: www.farrayscenter.com/horarios → Localiza la clase → "Book Now"
2. Desde Momence web: Inicia sesión → Clic en logo Farray's → Busca clase → "Book Now"
3. Desde la app: Selecciona Farray's → Ve a horarios → Reserva

TIP: Si tienes membresía, activa "Auto-Reservar Series Completas" para reservar automáticamente cada semana.`,
    keywords: ['reservar', 'reserva', 'clase', 'book', 'horario'],
  },

  // Cancel a class
  cancelClass: {
    question: '¿Cómo cancelo una clase?',
    answer: `Para cancelar una clase:

Desde el móvil: Abre la app → Verás tus próximas clases → Pulsa "Cancelar"
Desde el ordenador: Inicia sesión en Momence → Verás tus clases → Usa el menú para "Cancelar"

IMPORTANTE: Debes cancelar con mínimo 2 HORAS de antelación. Si cancelas después, cuenta como clase asistida y no se devuelve.`,
    keywords: ['cancelar', 'cancelacion', 'anular', 'no puedo ir', 'faltar'],
  },

  // Recover a class
  recoverClass: {
    question: '¿Puedo recuperar una clase que falté?',
    answer: `Sí, puedes recuperar clases si:

1. TÚ gestionas la cancelación desde Momence (no por WhatsApp/email/teléfono)
2. Cancelas con mínimo 2 HORAS de antelación
3. Usas el crédito en los siguientes 30 DÍAS

IMPORTANTE:
- Las clases NO se acumulan para otros meses
- Si no usas el crédito en 30 días, desaparece
- Solo puedes recuperar si tienes membresía/abono activo`,
    keywords: ['recuperar', 'faltar', 'perder', 'clase perdida', 'credito'],
  },

  // Check credits
  checkCredits: {
    question: '¿Cómo veo mis créditos disponibles?',
    answer: `Para ver tus créditos:

Desde ordenador: Membresías → Mis membresías → Créditos de clase
Desde la app: Membresías → Busca tu membresía → Verás créditos y fecha de caducidad`,
    keywords: ['creditos', 'credito', 'clases disponibles', 'cuantas clases', 'pack'],
  },

  // Pack validity
  packValidity: {
    question: '¿Cuánto duran los bonos de horas?',
    answer: `Los bonos de horas caducan a los 6 MESES desde la primera reserva.

Puedes ver la fecha de caducidad en la app de Momence o desde tu cuenta web.`,
    keywords: ['bono', 'pack', 'horas', 'caducidad', 'validez', 'expira'],
  },

  // Login problems
  loginProblems: {
    question: 'No puedo iniciar sesión',
    answer: `Si no puedes hacer login:

1. Ve a momence.com/sign-in?hostId=36148
2. Haz clic en "Forgot your password?"
3. Introduce tu email
4. Revisa tu bandeja de entrada (y spam)
5. Crea una nueva contraseña

Si sigues sin poder, contacta a support@momence.com explicando tu caso.`,
    keywords: ['login', 'sesion', 'contraseña', 'password', 'entrar', 'acceder'],
  },

  // Access account
  accessAccount: {
    question: '¿Cómo accedo a mi cuenta?',
    answer: `Para acceder a tu cuenta de Momence:

1. Web: momence.com/sign-in?hostId=36148
2. App: Descarga Momence de App Store o Google Play

Si vienes de la plataforma anterior (Goteamup), usa el mismo email. Si olvidaste la contraseña, usa "Forgot your password?"`,
    keywords: ['cuenta', 'acceso', 'mi cuenta', 'perfil', 'momence'],
  },

  // Update payment
  updatePayment: {
    question: '¿Cómo cambio mi tarjeta de pago?',
    answer: `Para actualizar tu método de pago:

1. Inicia sesión en tu cuenta de Momence
2. Haz clic en "Mi cuenta" (abajo a la izquierda)
3. Agrega o elimina métodos de pago`,
    keywords: ['tarjeta', 'pago', 'metodo pago', 'cambiar tarjeta', 'actualizar pago'],
  },

  // Cancel subscription
  cancelSubscription: {
    question: '¿Cómo me doy de baja?',
    answer: `Para darte de baja de la membresía:

1. Escribe a info@farrayscenter.com
2. Te enviaremos un formulario para completar

IMPORTANTE: Debes notificar con 15 DÍAS de antelación mínimo. Si no, se cobrará el siguiente recibo. Sin excepciones.`,
    keywords: ['baja', 'cancelar suscripcion', 'dejar', 'terminar', 'darme de baja'],
  },

  // Pause subscription
  pauseSubscription: {
    question: '¿Puedo pausar mi membresía?',
    answer: `Sí, puedes pausar tu membresía:

1. Escribe a info@farrayscenter.com
2. Coste de mantenimiento: 15€/mes durante la pausa
3. Debes notificar con 15 DÍAS de antelación

Si no avisas a tiempo, se cobra el recibo normal. Cuando vuelvas, usamos ese pago para tu primer mes de vuelta.`,
    keywords: ['pausar', 'pausa', 'suspender', 'congelar', 'vacaciones'],
  },

  // Change class with membership
  changeClassMembership: {
    question: '¿Puedo cambiar de clase cada semana con membresía?',
    answer: `No. Con suscripción mensual debes venir cada semana a los mismos cursos que contrataste (mismo día, misma hora).

La única excepción es para RECUPERAR una clase que hayas faltado de forma puntual.`,
    keywords: ['cambiar clase', 'otra clase', 'diferente clase', 'membresia'],
  },

  // Change class with pack
  changeClassPack: {
    question: '¿Puedo cambiar de clase con un bono de horas?',
    answer: `¡Sí! Con un bono de horas puedes elegir clases diferentes cada semana, sin compromiso.

Solo debes respetar el período de caducidad (6 meses desde primera reserva) y que haya plaza disponible.`,
    keywords: ['bono horas', 'pack', 'flexible', 'cambiar'],
  },

  // Upload profile photo
  uploadPhoto: {
    question: '¿Cómo subo mi foto de perfil?',
    answer: `Para subir tu foto en Momence:

1. Abre la app móvil de Momence
2. Ve a "Cuenta" (abajo a la derecha)
3. Toca "Editar foto"
4. Elige una foto de tu galería o toma una nueva

Esto nos ayuda a identificarte correctamente en clase.`,
    keywords: ['foto', 'perfil', 'imagen', 'avatar'],
  },
};

// ============================================================================
// AGENT PERSONALITY - MULTILINGUAL PHRASES
// ============================================================================

export const AGENT_PHRASES: Record<
  SupportedLanguage,
  {
    greetings: string[];
    confirmations: string[];
    transitions: string[];
    closings: string[];
    askStyle: string;
    askLevel: string;
    askSchedule: string;
  }
> = {
  es: {
    greetings: [
      "Holaa! Soy Laura de Farray's",
      'Holaaa! Qué tal? Soy Laura',
      "Hey! Bienvenid@ a Farray's, soy Laura",
      "Holaa! Aquí Laura de Farray's",
    ],
    confirmations: ['Perfecto!', 'Genial!', 'Ay qué bien!', 'Guay!', 'Estupendo!'],
    transitions: ['Mira, te cuento...', 'A ver, te explico...', 'Pues mira...', 'Te comento...'],
    closings: [
      '¿Necesitas algo más?',
      '¿Te puedo ayudar en algo más?',
      '¿Alguna otra duda?',
      'Aquí estoy para lo que necesites',
    ],
    askStyle: '¿Qué estilo te llama más la atención?',
    askLevel: '¿Qué nivel tienes? Principiante, intermedio...?',
    askSchedule: '¿Qué días y horarios te vienen mejor?',
  },

  ca: {
    greetings: [
      "Holaa! Sóc la Laura de Farray's",
      'Holaaa! Què tal? Sóc la Laura',
      "Ei! Benvingut/da a Farray's, sóc la Laura",
      "Holaa! Aquí la Laura de Farray's",
    ],
    confirmations: ['Perfecte!', 'Genial!', 'Ai què bé!', 'Guai!', 'Fantàstic!'],
    transitions: ["Mira, t'explico...", "A veure, t'explico...", 'Doncs mira...', 'Et comento...'],
    closings: [
      'Necessites alguna cosa més?',
      'Et puc ajudar en alguna cosa més?',
      'Algun altre dubte?',
      'Aquí estic pel que necessitis',
    ],
    askStyle: "Quin estil t'agrada més?",
    askLevel: 'Quin nivell tens? Principiant, intermedi...?',
    askSchedule: 'Quins dies i horaris et van millor?',
  },

  en: {
    greetings: [
      "Hi there! I'm Laura from Farray's",
      "Hello! How are you? I'm Laura",
      "Hey! Welcome to Farray's, I'm Laura",
      "Hi! Laura here from Farray's",
    ],
    confirmations: ['Perfect!', 'Great!', 'Awesome!', 'Cool!', 'Wonderful!'],
    transitions: [
      'Let me tell you...',
      "So, here's the thing...",
      'Well...',
      "Here's what I can tell you...",
    ],
    closings: [
      'Anything else you need?',
      'Can I help you with anything else?',
      'Any other questions?',
      "I'm here if you need anything",
    ],
    askStyle: 'What style interests you most?',
    askLevel: "What's your level? Beginner, intermediate...?",
    askSchedule: 'What days and times work best for you?',
  },

  fr: {
    greetings: [
      "Salut! Je suis Laura de Farray's",
      'Bonjour! Comment ça va? Je suis Laura',
      "Hey! Bienvenue chez Farray's, je suis Laura",
      "Bonjour! Laura de Farray's",
    ],
    confirmations: ['Parfait!', 'Génial!', 'Super!', 'Cool!', 'Excellent!'],
    transitions: ["Alors, je t'explique...", 'Voilà...', 'Eh bien...', 'Je te dis...'],
    closings: [
      "As-tu besoin d'autre chose?",
      "Puis-je t'aider avec autre chose?",
      "D'autres questions?",
      'Je suis là si tu as besoin',
    ],
    askStyle: "Quel style t'intéresse le plus?",
    askLevel: 'Quel est ton niveau? Débutant, intermédiaire...?',
    askSchedule: 'Quels jours et horaires te conviennent le mieux?',
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a random item from an array
 */
export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

/**
 * Get a random greeting in the specified language
 */
export function getGreeting(lang: SupportedLanguage): string {
  return randomChoice(AGENT_PHRASES[lang].greetings);
}

/**
 * Get a random confirmation in the specified language
 */
export function getConfirmation(lang: SupportedLanguage): string {
  return randomChoice(AGENT_PHRASES[lang].confirmations);
}

/**
 * Get a random transition phrase in the specified language
 */
export function getTransition(lang: SupportedLanguage): string {
  return randomChoice(AGENT_PHRASES[lang].transitions);
}

/**
 * Get a random closing in the specified language
 */
export function getClosing(lang: SupportedLanguage): string {
  return randomChoice(AGENT_PHRASES[lang].closings);
}

/**
 * Find FAQ answer by matching keywords
 */
export function findFAQAnswer(query: string, lang: SupportedLanguage): FAQ | null {
  const normalizedQuery = query.toLowerCase();
  const faqs = FAQS[lang] || FAQS.es;

  for (const faq of faqs) {
    for (const keyword of faq.keywords) {
      if (normalizedQuery.includes(keyword.toLowerCase())) {
        return faq;
      }
    }
  }

  return null;
}

/**
 * Format pricing info for the specified language
 */
export function formatPricingInfo(lang: SupportedLanguage): string {
  const { memberships, singleClass, registration, trialClass: _trialClass } = PRICING;

  switch (lang) {
    case 'ca':
      return `Els nostres preus:
- 1 classe/setmana → ${memberships.oneClassPerWeek.price}€/mes
- 2 classes/setmana → ${memberships.twoClassesPerWeek.price}€/mes (la més popular!)
- 3 classes/setmana → ${memberships.threeClassesPerWeek.price}€/mes
- Il·limitat → ${memberships.unlimited.price}€/mes

Classe solta: ${singleClass}€
${registration.currentPromo === 0 ? 'Matrícula: GRATIS (abans ' + registration.normal + '€)' : 'Matrícula: ' + registration.normal + '€'}

I la primera classe és GRATIS per provar!`;

    case 'en':
      return `Our prices:
- 1 class/week → ${memberships.oneClassPerWeek.price}€/month
- 2 classes/week → ${memberships.twoClassesPerWeek.price}€/month (most popular!)
- 3 classes/week → ${memberships.threeClassesPerWeek.price}€/month
- Unlimited → ${memberships.unlimited.price}€/month

Single class: ${singleClass}€
${registration.currentPromo === 0 ? 'Registration: FREE (was ' + registration.normal + '€)' : 'Registration: ' + registration.normal + '€'}

And the first class is FREE to try!`;

    case 'fr':
      return `Nos prix:
- 1 cours/semaine → ${memberships.oneClassPerWeek.price}€/mois
- 2 cours/semaine → ${memberships.twoClassesPerWeek.price}€/mois (le plus populaire!)
- 3 cours/semaine → ${memberships.threeClassesPerWeek.price}€/mois
- Illimité → ${memberships.unlimited.price}€/mois

Cours à l'unité: ${singleClass}€
${registration.currentPromo === 0 ? 'Inscription: GRATUIT (était ' + registration.normal + '€)' : 'Inscription: ' + registration.normal + '€'}

Et le premier cours est GRATUIT pour essayer!`;

    default: // Spanish
      return `Nuestros precios:
- 1 clase/semana → ${memberships.oneClassPerWeek.price}€/mes
- 2 clases/semana → ${memberships.twoClassesPerWeek.price}€/mes (¡la más popular!)
- 3 clases/semana → ${memberships.threeClassesPerWeek.price}€/mes
- Ilimitado → ${memberships.unlimited.price}€/mes

Clase suelta: ${singleClass}€
${registration.currentPromo === 0 ? 'Matrícula: GRATIS (antes ' + registration.normal + '€)' : 'Matrícula: ' + registration.normal + '€'}

¡Y la primera clase es GRATIS para probar!`;
  }
}
