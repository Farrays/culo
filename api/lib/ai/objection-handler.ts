/**
 * Objection Handler - Sales Objection Management
 *
 * Detects and handles common sales objections with empathetic,
 * human-like responses that address concerns while guiding
 * towards conversion.
 *
 * Common objections handled:
 * - Price: "Es muy caro", "No me lo puedo permitir"
 * - Time: "No tengo tiempo", "Estoy muy ocupado"
 * - Experience: "No sé bailar", "Soy muy malo"
 * - Location: "Está lejos", "Me queda mal"
 * - Commitment: "No quiero comprometerme", "Solo quiero probar"
 * - Indecision: "Ya veré", "Lo pienso"
 *
 * @see AGENTE.md - Manejo de Situaciones Difíciles
 */

import type { SupportedLanguage } from './language-detector.js';
import { randomChoice } from './knowledge-base.js';

// ============================================================================
// TYPES
// ============================================================================

export type ObjectionType =
  | 'price'
  | 'time'
  | 'experience'
  | 'location'
  | 'commitment'
  | 'indecision'
  | 'competition'
  | 'unknown';

export interface ObjectionDetection {
  type: ObjectionType;
  confidence: number; // 0-1
  keywords: string[];
}

export interface ObjectionResponse {
  type: ObjectionType;
  response: string;
  followUp?: string;
  shouldOfferTrial: boolean;
}

// ============================================================================
// OBJECTION KEYWORDS
// ============================================================================

const OBJECTION_KEYWORDS: Record<ObjectionType, Record<SupportedLanguage, string[]>> = {
  price: {
    es: [
      'caro',
      'cara',
      'precio',
      'dinero',
      'costoso',
      'no puedo',
      'no me lo puedo',
      'permitir',
      'mucho',
      'barato',
      'económico',
      'oferta',
      'descuento',
      'pagar',
    ],
    ca: [
      'car',
      'preu',
      'diners',
      'costós',
      'no puc',
      'permetre',
      'molt',
      'barat',
      'econòmic',
      'oferta',
      'descompte',
      'pagar',
    ],
    en: [
      'expensive',
      'cost',
      'money',
      'afford',
      'cheap',
      'budget',
      'price',
      'discount',
      'pay',
      'too much',
    ],
    fr: [
      'cher',
      'chère',
      'prix',
      'argent',
      'coûteux',
      'pas les moyens',
      'économique',
      'réduction',
      'payer',
    ],
  },

  time: {
    es: [
      'tiempo',
      'ocupado',
      'ocupada',
      'agenda',
      'horario',
      'trabajo',
      'no puedo',
      'no me va',
      'complicado',
      'difícil',
      'tarde',
      'pronto',
    ],
    ca: [
      'temps',
      'ocupat',
      'ocupada',
      'agenda',
      'horari',
      'feina',
      'no puc',
      'no em va',
      'complicat',
      'difícil',
    ],
    en: [
      'time',
      'busy',
      'schedule',
      'work',
      "can't make it",
      'difficult',
      'complicated',
      'late',
      'early',
    ],
    fr: [
      'temps',
      'occupé',
      'occupée',
      'agenda',
      'horaire',
      'travail',
      'ne peux pas',
      'compliqué',
      'difficile',
    ],
  },

  experience: {
    es: [
      'no sé',
      'no se',
      'bailar',
      'principiante',
      'malo',
      'mala',
      'torpe',
      'vergüenza',
      'verguenza',
      'ridículo',
      'ridiculo',
      'miedo',
      'nervios',
      'primera vez',
      'nunca he',
      'sin experiencia',
    ],
    ca: [
      'no sé',
      'ballar',
      'principiant',
      'dolent',
      'malament',
      'vergonya',
      'ridícul',
      'por',
      'nervis',
      'primera vegada',
      'mai he',
      'sense experiència',
    ],
    en: [
      "can't dance",
      'beginner',
      'bad',
      'clumsy',
      'embarrassed',
      'shy',
      'nervous',
      'scared',
      'first time',
      'never',
      'no experience',
    ],
    fr: [
      'ne sais pas',
      'danser',
      'débutant',
      'mauvais',
      'maladroit',
      'honte',
      'timide',
      'nerveux',
      'peur',
      'première fois',
      'jamais',
      'sans expérience',
    ],
  },

  location: {
    es: [
      'lejos',
      'distancia',
      'metro',
      'aparcar',
      'coche',
      'transporte',
      'zona',
      'llegar',
      'desplazarme',
      'vivo',
    ],
    ca: [
      'lluny',
      'distància',
      'metro',
      'aparcar',
      'cotxe',
      'transport',
      'zona',
      'arribar',
      'desplaçar-me',
      'visc',
    ],
    en: [
      'far',
      'distance',
      'metro',
      'parking',
      'car',
      'transport',
      'area',
      'get there',
      'commute',
      'live',
    ],
    fr: [
      'loin',
      'distance',
      'métro',
      'parking',
      'voiture',
      'transport',
      'zone',
      'arriver',
      'déplacer',
      'habite',
    ],
  },

  commitment: {
    es: [
      'compromiso',
      'permanencia',
      'contrato',
      'obligación',
      'atar',
      'atada',
      'atado',
      'solo probar',
      'una vez',
      'sin compromiso',
    ],
    ca: [
      'compromís',
      'permanència',
      'contracte',
      'obligació',
      'lligar',
      'només provar',
      'un cop',
      'sense compromís',
    ],
    en: [
      'commitment',
      'contract',
      'obligation',
      'tied',
      'lock in',
      'just try',
      'once',
      'no commitment',
    ],
    fr: [
      'engagement',
      'contrat',
      'obligation',
      'lier',
      'attaché',
      'juste essayer',
      'une fois',
      'sans engagement',
    ],
  },

  indecision: {
    es: [
      'ya veré',
      'vere',
      'lo pienso',
      'pensarlo',
      'pensar',
      'decidir',
      'no sé',
      'no se',
      'quizás',
      'quizas',
      'tal vez',
      'luego',
      'después',
      'otro día',
      'otro dia',
      'más adelante',
    ],
    ca: [
      'ja veuré',
      'ho penso',
      'pensar-ho',
      'pensar',
      'decidir',
      'no sé',
      'potser',
      'després',
      'un altre dia',
      'més endavant',
    ],
    en: [
      "I'll see",
      'think about',
      'decide',
      'not sure',
      'maybe',
      'perhaps',
      'later',
      'another day',
      'eventually',
    ],
    fr: [
      'je verrai',
      'y penser',
      'réfléchir',
      'décider',
      'pas sûr',
      'peut-être',
      'plus tard',
      'un autre jour',
      'éventuellement',
    ],
  },

  competition: {
    es: [
      'otra academia',
      'otro sitio',
      'comparar',
      'opciones',
      'gimnasio',
      'youtube',
      'online',
      'casa',
    ],
    ca: [
      'altra acadèmia',
      'altre lloc',
      'comparar',
      'opcions',
      'gimnàs',
      'youtube',
      'online',
      'casa',
    ],
    en: ['other studio', 'another place', 'compare', 'options', 'gym', 'youtube', 'online', 'home'],
    fr: [
      'autre académie',
      'autre endroit',
      'comparer',
      'options',
      'salle de sport',
      'youtube',
      'online',
      'maison',
    ],
  },

  unknown: {
    es: [],
    ca: [],
    en: [],
    fr: [],
  },
};

// ============================================================================
// OBJECTION RESPONSES
// ============================================================================

const OBJECTION_RESPONSES: Record<ObjectionType, Record<SupportedLanguage, string[]>> = {
  price: {
    es: [
      `Entiendo perfectamente 😊 Mira, te cuento: la primera clase es GRATIS, así que puedes probar sin gastar nada.

Y si te gusta, el plan de 2 clases/semana sale a menos de 10€ por clase. Muchos alumnos empezaron "solo probando" y ahora no se pierden una! 💃`,

      `Sí, entiendo que es una inversión... Pero mira, la primera clase es totalmente gratis, sin ningún compromiso.

Además, comparado con un gimnasio (que cuesta parecido), aquí además de hacer ejercicio, aprendes algo que usarás toda la vida y conoces gente genial 🎉`,

      `Uf, te entiendo! Pero piensa que es una inversión en ti: ejercicio, aprender algo nuevo y conocer gente... todo en uno!

Y lo mejor: la primera clase es GRATIS para que lo pruebes. ¿Qué estilo te llama más?`,
    ],
    ca: [
      `Entenc perfectament 😊 Mira, t'explico: la primera classe és GRATIS, així que pots provar sense gastar res.

I si t'agrada, el pla de 2 classes/setmana surt a menys de 10€ per classe. Molts alumnes van començar "només provant" i ara no es perden cap! 💃`,

      `Sí, entenc que és una inversió... Però mira, la primera classe és totalment gratis, sense cap compromís.

A més, comparat amb un gimnàs (que costa similar), aquí a més de fer exercici, aprens algo que faràs servir tota la vida i coneixes gent genial 🎉`,
    ],
    en: [
      `I totally understand 😊 Here's the thing: the first class is FREE, so you can try without spending anything.

And if you like it, the 2 classes/week plan works out to less than €10 per class. Many students started "just trying" and now never miss one! 💃`,

      `Yes, I understand it's an investment... But look, the first class is completely free, no commitment.

Plus, compared to a gym (which costs similar), here you also learn something you'll use for life and meet great people 🎉`,
    ],
    fr: [
      `Je comprends parfaitement 😊 Écoute, le premier cours est GRATUIT, donc tu peux essayer sans rien dépenser.

Et si ça te plaît, le forfait 2 cours/semaine revient à moins de 10€ par cours. Beaucoup d'élèves ont commencé "juste pour essayer" et maintenant ils n'en ratent aucun! 💃`,
    ],
  },

  time: {
    es: [
      `Te entiendo! La verdad es que tenemos horarios bastante flexibles: clases de 17:00 a 22:00 de lunes a viernes, y también los sábados.

¿Hay algún día/hora que te venga mejor? Seguro encontramos algo que te cuadre 📅`,

      `Uf, el tiempo es oro! Pero mira, con una clase a la semana ya notas la diferencia. Son solo 1 hora, y encima desconectas del trabajo/estrés.

¿Qué días sueles tener más libres?`,

      `Entiendo que estés ocupad@! Pero precisamente por eso el baile viene genial: 1 hora para desconectar y mover el cuerpo.

Tenemos clases hasta las 22:00 para los que salen tarde del trabajo. ¿Te vendría bien esa franja?`,
    ],
    ca: [
      `T'entenc! La veritat és que tenim horaris bastant flexibles: classes de 17:00 a 22:00 de dilluns a divendres, i també els dissabtes.

Hi ha algun dia/hora que et vagi millor? Segur que trobem algo que et quadri 📅`,
    ],
    en: [
      `I understand! The truth is we have quite flexible schedules: classes from 5pm to 10pm Monday to Friday, and also Saturdays.

Is there any day/time that works better for you? We'll definitely find something that fits 📅`,
    ],
    fr: [
      `Je comprends! La vérité est que nous avons des horaires assez flexibles: cours de 17h à 22h du lundi au vendredi, et aussi les samedis.

Y a-t-il un jour/heure qui te convient mieux? On trouvera sûrement quelque chose qui te va 📅`,
    ],
  },

  experience: {
    es: [
      `Ay, eso es lo que dice TODO el mundo antes de empezar! 😄 Yo tampoco sabía nada cuando empecé hace 8 años.

Tenemos clases de iniciación donde todos empiezan de cero. Nadie juzga a nadie, al revés, el ambiente es súper acogedor. ¿Te animas a probar una clase gratis?`,

      `¡Pero si es justamente para eso que estamos! 😊 Las clases de principiantes están pensadas para gente que NUNCA ha bailado.

Te prometo que después de la primera clase ya te vas moviendo. Y encima es gratis para probar!`,

      `Mira, te cuento un secreto: los que dicen "no sé bailar" suelen ser los que más disfrutan después 😄

Todos empezamos sin saber, y los profes están acostumbrados a enseñar desde cero. La primera clase es gratis, ¿por qué no lo pruebas?`,
    ],
    ca: [
      `Ai, això és el que diu TOTHOM abans de començar! 😄 Jo tampoc sabia res quan vaig començar fa 8 anys.

Tenim classes d'iniciació on tothom comença de zero. Ningú jutja a ningú, al contrari, l'ambient és súper acollidor. T'animes a provar una classe gratis?`,
    ],
    en: [
      `Oh, that's what EVERYONE says before starting! 😄 I didn't know anything either when I started 8 years ago.

We have beginner classes where everyone starts from zero. No one judges anyone, quite the opposite - the atmosphere is super welcoming. Want to try a free class?`,
    ],
    fr: [
      `Oh, c'est ce que TOUT LE MONDE dit avant de commencer! 😄 Je ne savais rien non plus quand j'ai commencé il y a 8 ans.

Nous avons des cours pour débutants où tout le monde commence à zéro. Personne ne juge personne, au contraire - l'ambiance est super accueillante. Tu veux essayer un cours gratuit?`,
    ],
  },

  location: {
    es: [
      `Estamos en Entença 100, muy cerca del metro Entença (L5) y Rocafort (L1). A 2 minutitos andando desde cualquiera de los dos.

También hay parking cerca por si vienes en coche. ¿De qué zona vienes?`,

      `Mira, estamos súper bien conectados: metro Entença (L5) o Rocafort (L1), a 2 minutos andando.

Muchos alumnos vienen de otras zonas porque el ambiente merece la pena. ¿Quieres que te mande la ubicación exacta?`,
    ],
    ca: [
      `Som a Entença 100, molt a prop del metro Entença (L5) i Rocafort (L1). A 2 minutets caminant des de qualsevol dels dos.

També hi ha parking a prop per si véns amb cotxe. De quina zona véns?`,
    ],
    en: [
      `We're at Entença 100, very close to Entença metro (L5) and Rocafort (L1). Just 2 minutes walking from either one.

There's also parking nearby if you come by car. What area are you coming from?`,
    ],
    fr: [
      `Nous sommes à Entença 100, très proche du métro Entença (L5) et Rocafort (L1). À 2 minutes à pied de l'un ou l'autre.

Il y a aussi un parking à proximité si tu viens en voiture. De quelle zone viens-tu?`,
    ],
  },

  commitment: {
    es: [
      `¡Tranquil@! No hay ningún compromiso. La primera clase es gratis y sin ataduras.

Luego, si te gusta, puedes apuntarte mes a mes. No hay permanencia ni nada raro 👍`,

      `Mira, precisamente la primera clase es GRATIS y sin compromiso para que puedas probar sin presión.

No te pedimos permanencia ni contrato. Si un mes no puedes venir, simplemente nos avisas. ¿Te parece?`,
    ],
    ca: [
      `Tranquil! No hi ha cap compromís. La primera classe és gratis i sense lligams.

Després, si t'agrada, pots apuntar-te mes a mes. No hi ha permanència ni res estrany 👍`,
    ],
    en: [
      `Don't worry! There's no commitment. The first class is free with no strings attached.

Then, if you like it, you can sign up month by month. No lock-in or anything weird 👍`,
    ],
    fr: [
      `Pas de souci! Il n'y a aucun engagement. Le premier cours est gratuit et sans engagement.

Ensuite, si ça te plaît, tu peux t'inscrire mois par mois. Pas de contrat ni rien de bizarre 👍`,
    ],
  },

  indecision: {
    es: [
      `Claro, tómate tu tiempo! Pero te digo una cosa: la primera clase es gratis, así que no hay nada que perder por probar.

¿Qué te parece si reservamos una clase de prueba para esta semana? Si no te convence, no pasa nada 😊`,

      `Entiendo! Mira, muchas veces la mejor forma de decidir es probando.

La primera clase es gratis, ¿te animas a venir esta semana y ya decides después?`,

      `Vale, sin presión! Pero piensa que la primera clase es gratis... Así que realmente no hay nada que pensar, solo probar 😄

¿Qué estilo te llama más la atención?`,
    ],
    ca: [
      `Clar, pren-te el teu temps! Però t'dic una cosa: la primera classe és gratis, així que no hi ha res a perdre per provar.

Què et sembla si reservem una classe de prova per aquesta setmana? Si no et convenç, no passa res 😊`,
    ],
    en: [
      `Sure, take your time! But here's the thing: the first class is free, so there's nothing to lose by trying.

How about we book a trial class for this week? If you don't like it, no problem 😊`,
    ],
    fr: [
      `Bien sûr, prends ton temps! Mais voilà le truc: le premier cours est gratuit, donc il n'y a rien à perdre à essayer.

Que dirais-tu de réserver un cours d'essai pour cette semaine? Si ça ne te convient pas, pas de problème 😊`,
    ],
  },

  competition: {
    es: [
      `Buena idea comparar! Lo que nos diferencia es el ambiente: aquí no es solo aprender pasos, es una comunidad donde haces amigos.

Además, nuestros profes son bailarines profesionales que compiten a nivel internacional. ¿Qué estilo te interesa más?`,

      `Entiendo! Mira, lo que dicen nuestros alumnos es que el ambiente es lo que más valoran: es como una familia.

La primera clase es gratis, así que puedes comparar sin compromiso. ¿Te apuntas a una de prueba?`,
    ],
    ca: [
      `Bona idea comparar! El que ens diferencia és l'ambient: aquí no és només aprendre passos, és una comunitat on fas amics.

A més, els nostres profes són ballarins professionals que competeixen a nivell internacional. Quin estil t'interessa més?`,
    ],
    en: [
      `Good idea to compare! What makes us different is the atmosphere: here it's not just about learning steps, it's a community where you make friends.

Plus, our teachers are professional dancers who compete internationally. What style interests you most?`,
    ],
    fr: [
      `Bonne idée de comparer! Ce qui nous différencie c'est l'ambiance: ici ce n'est pas juste apprendre des pas, c'est une communauté où tu te fais des amis.

En plus, nos profs sont des danseurs professionnels qui participent à des compétitions internationales. Quel style t'intéresse le plus?`,
    ],
  },

  unknown: {
    es: [
      `Mmm, cuéntame más... ¿Qué es lo que te preocupa exactamente?`,
      `Entiendo que tengas dudas. ¿Me cuentas qué te hace dudar?`,
    ],
    ca: [`Mmm, explica'm més... Què és el que et preocupa exactament?`],
    en: [`Hmm, tell me more... What exactly concerns you?`],
    fr: [`Hmm, dis-moi en plus... Qu'est-ce qui te préoccupe exactement?`],
  },
};

// ============================================================================
// OBJECTION HANDLER CLASS
// ============================================================================

export class ObjectionHandler {
  private lang: SupportedLanguage;

  constructor(lang: SupportedLanguage = 'es') {
    this.lang = lang;
  }

  /**
   * Detect objection type from message
   */
  detectObjection(text: string): ObjectionDetection {
    const lowerText = text.toLowerCase();
    let bestMatch: ObjectionDetection = {
      type: 'unknown',
      confidence: 0,
      keywords: [],
    };

    // Check each objection type
    for (const [type, keywords] of Object.entries(OBJECTION_KEYWORDS)) {
      if (type === 'unknown') continue;

      const langKeywords = keywords[this.lang] || keywords.es;
      const matchedKeywords = langKeywords.filter(kw => lowerText.includes(kw));

      if (matchedKeywords.length > 0) {
        const confidence = Math.min(1, matchedKeywords.length * 0.3);

        if (confidence > bestMatch.confidence) {
          bestMatch = {
            type: type as ObjectionType,
            confidence,
            keywords: matchedKeywords,
          };
        }
      }
    }

    return bestMatch;
  }

  /**
   * Check if message contains an objection
   */
  hasObjection(text: string): boolean {
    const detection = this.detectObjection(text);
    return detection.type !== 'unknown' && detection.confidence > 0.2;
  }

  /**
   * Get response for detected objection
   */
  getResponse(objectionType: ObjectionType): ObjectionResponse {
    const responses =
      OBJECTION_RESPONSES[objectionType][this.lang] || OBJECTION_RESPONSES[objectionType].es;

    const response = randomChoice(responses);

    return {
      type: objectionType,
      response,
      shouldOfferTrial: ['price', 'experience', 'indecision', 'commitment'].includes(objectionType),
    };
  }

  /**
   * Handle objection: detect and respond
   */
  handleObjection(text: string): ObjectionResponse | null {
    const detection = this.detectObjection(text);

    if (detection.type === 'unknown' || detection.confidence < 0.2) {
      return null;
    }

    return this.getResponse(detection.type);
  }

  /**
   * Set language
   */
  setLanguage(lang: SupportedLanguage): void {
    this.lang = lang;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Quick objection check
 */
export function detectObjection(text: string, lang: SupportedLanguage = 'es'): ObjectionDetection {
  const handler = new ObjectionHandler(lang);
  return handler.detectObjection(text);
}

/**
 * Get objection response
 */
export function getObjectionResponse(
  text: string,
  lang: SupportedLanguage = 'es'
): ObjectionResponse | null {
  const handler = new ObjectionHandler(lang);
  return handler.handleObjection(text);
}

/**
 * Check if text contains price objection specifically
 */
export function isPriceObjection(text: string, lang: SupportedLanguage = 'es'): boolean {
  const detection = detectObjection(text, lang);
  return detection.type === 'price' && detection.confidence > 0.3;
}

/**
 * Get all objection types
 */
export function getObjectionTypes(): ObjectionType[] {
  return Object.keys(OBJECTION_KEYWORDS).filter(t => t !== 'unknown') as ObjectionType[];
}
