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
  address: 'C/ Entença 100, Local 1',
  postalCode: '08015',
  city: 'Barcelona',
  country: 'España',
  phone: '+34 622 247 085',
  whatsapp: '34622247085',
  email: 'info@farrayscenter.com',
  website: 'https://www.farrayscenter.com',
  googleMaps: 'https://maps.app.goo.gl/YMTQFik7dB1ykdux9',

  // Metro and transport
  transport: {
    metro: ['Rocafort (L1)', 'Entença (L5)'],
    bus: ['41', '54', 'H8'],
  },

  // Operating hours
  hours: {
    weekdays: '10:00 - 22:00',
    saturday: '10:00 - 14:00',
    sunday: 'Cerrado',
  },
};

// ============================================================================
// PRICING
// ============================================================================

export const PRICING = {
  // Monthly memberships
  memberships: {
    oneClassPerWeek: { price: 50, classes: 1 },
    twoClassesPerWeek: { price: 78, classes: 2, popular: true },
    threeClassesPerWeek: { price: 103, classes: 3 },
    unlimited: { price: 130, classes: 'unlimited' },
  },

  // Single class
  singleClass: 15,

  // Registration fee
  registration: {
    normal: 60,
    currentPromo: 0, // Currently free!
  },

  // Trial class
  trialClass: {
    price: 0, // FREE!
    description: 'Primera clase gratis sin compromiso',
  },
};

// ============================================================================
// DANCE STYLES
// ============================================================================

export const DANCE_STYLES = {
  bailesSociales: {
    name: 'Bailes Sociales',
    styles: ['Salsa Cubana', 'Bachata', 'Bachata Sensual', 'Kizomba', 'Son Cubano', 'Timba'],
  },
  danzasUrbanas: {
    name: 'Danzas Urbanas',
    styles: [
      'Hip Hop',
      'Reggaeton',
      'Dancehall',
      'Afrobeat',
      'Commercial',
      'K-Pop',
      'Twerk',
      'Sexy Style',
    ],
  },
  danza: {
    name: 'Danza',
    styles: ['Ballet', 'Contemporáneo', 'Jazz', 'Afro Contemporáneo'],
  },
  heels: {
    name: 'Heels',
    styles: ['Heels Dance', 'Femmology', 'Sexy Style'],
  },
  fitness: {
    name: 'Fitness',
    styles: ['Stretching', 'Bum Bum', 'Cuerpo Fit'],
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
      answer:
        '¡Ahora mismo la matrícula (que normalmente son 60€) está GRATIS! Es el mejor momento para apuntarse.',
      keywords: ['matricula', 'inscripcion', 'alta'],
    },
    {
      question: '¿Dónde está la academia?',
      answer: `Estamos en C/ Entença 100, Local 1, Barcelona (08015).

Cómo llegar:
🚇 Metro: Rocafort (L1) o Entença (L5)
🚌 Bus: Líneas 41, 54, H8

📍 Google Maps: ${CENTER_INFO.googleMaps}`,
      keywords: ['donde', 'direccion', 'ubicacion', 'llegar', 'metro', 'como llego'],
    },
    {
      question: '¿Qué horarios tienen?',
      answer: `Tenemos clases de lunes a sábado.
El centro está abierto:
- Lunes a Viernes: 10:00 - 22:00
- Sábado: 10:00 - 14:00

Las clases empiezan desde las 17:00 entre semana.`,
      keywords: ['horario', 'horarios', 'hora', 'cuando', 'abierto'],
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
        '¡Para nada! Tenemos clases para todos los niveles, desde iniciación hasta avanzado. Los profes te guían paso a paso.',
      keywords: ['experiencia', 'principiante', 'nivel', 'empezar', 'nunca bailado'],
    },
    {
      question: '¿Qué estilos de baile tienen?',
      answer: `Tenemos de todo:

💃 Bailes Sociales: Salsa, Bachata, Kizomba
🔥 Urbano: Hip Hop, Reggaeton, Dancehall, Twerk
👠 Heels: Heels Dance, Femmology, Sexy Style
🩰 Danza: Ballet, Contemporáneo, Jazz
💪 Fitness: Stretching, Bum Bum

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

Siempre trae agua y una toalla pequeña. ¡Y llega 10 minutos antes para cambiarte!`,
      keywords: ['llevar', 'traer', 'ropa', 'zapatos', 'calzado', 'que pongo'],
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
      answer:
        "Ara mateix la matrícula (que normalment són 60€) està GRATIS! És el millor moment per apuntar-s'hi.",
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
      answer:
        "Right now the registration fee (normally 60€) is FREE! It's the best time to sign up.",
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
      answer:
        "En ce moment les frais d'inscription (normalement 60€) sont GRATUITS! C'est le meilleur moment pour s'inscrire.",
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
  ],
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
