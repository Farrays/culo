/**
 * Booking Flow - Conversational Reservation System
 *
 * Handles the step-by-step booking process via WhatsApp:
 * 1. Style selection
 * 2. Class/schedule selection
 * 3. Personal data collection
 * 4. GDPR consents
 * 5. Confirmation
 *
 * @see AGENTE.md - Flujo de Reserva con Consentimientos RGPD
 */

import type { SupportedLanguage } from './language-detector.js';
import { getConfirmation, CENTER_INFO } from './knowledge-base.js';

// ============================================================================
// TYPES
// ============================================================================

export type BookingStep =
  | 'initial'
  | 'style_selection'
  | 'class_selection'
  | 'waitlist_pending' // Fase 7: When class is full, offer waitlist
  | 'data_collection'
  | 'consent_terms'
  | 'consent_privacy'
  | 'consent_marketing'
  | 'confirmation'
  | 'completed';

export interface BookingData {
  // Personal info
  firstName?: string;
  lastName?: string;
  email?: string;
  phone: string;

  // Class selection
  style?: string;
  selectedClassId?: number;
  selectedClassName?: string;
  selectedClassDate?: string;
  selectedClassTime?: string;

  // Waitlist (Fase 7)
  waitlistClassId?: number;
  waitlistClassName?: string;

  // Consents
  acceptsTerms?: boolean;
  acceptsPrivacy?: boolean;
  acceptsMarketing?: boolean;
  consentTimestamp?: string;
}

export interface BookingState {
  step: BookingStep;
  data: BookingData;
  availableClasses?: ClassOption[];
  lastPrompt?: string;
}

export interface ClassOption {
  id: number;
  name: string;
  date: string;
  time: string;
  dayOfWeek: string;
  spotsAvailable: number;
  instructor: string;
  style: string;
}

export interface BookingFlowResult {
  response: string;
  newState: BookingState;
  shouldBook?: boolean; // True when ready to create actual booking
  bookingData?: BookingData;
  action?: 'waitlist'; // Fase 7: Signal to add to waitlist
}

// ============================================================================
// MULTILINGUAL MESSAGES
// ============================================================================

const MESSAGES: Record<
  SupportedLanguage,
  {
    askStyle: string;
    styleOptions: string;
    askClass: string;
    noClassesAvailable: string;
    askName: string;
    askEmail: string;
    invalidEmail: string;
    askTerms: string;
    askPrivacy: string;
    askMarketing: string;
    confirmBooking: string;
    bookingSuccess: string;
    bookingError: string;
    classFull: string;
    yesNo: string;
  }
> = {
  es: {
    askStyle: '¿Qué estilo de baile te interesa?',
    styleOptions: `Tenemos de todo:

💃 *Bailes Sociales*: Salsa, Bachata, Kizomba
🔥 *Urbano*: Hip Hop, Reggaeton, Dancehall, Twerk
👠 *Heels*: Heels Dance, Femmology, Sexy Style
🩰 *Danza*: Ballet, Contemporáneo, Jazz
💪 *Fitness*: Stretching, Bum Bum

Escríbeme el estilo que te llama más la atención`,
    askClass: 'Estas son las clases disponibles de %STYLE%:',
    noClassesAvailable:
      'Uy, ahora mismo no hay clases de ese estilo disponibles... ¿Te interesa otro estilo?',
    askName:
      'Para reservar tu clase de prueba GRATIS, necesito tu nombre completo.\n\nEjemplo: María García',
    askEmail:
      'Genial %NAME%! Ahora necesito tu email para enviarte la confirmación.\n\nEjemplo: maria@email.com',
    invalidEmail: 'Mmm, ese email no parece válido. ¿Me lo puedes escribir de nuevo?',
    askTerms: `📋 *TÉRMINOS Y CONDICIONES*

• La primera clase es gratuita y sin compromiso
• Cancelaciones: mínimo 1 hora antes
• Uso de instalaciones según normativa

¿Aceptas los términos? Responde *SÍ* o *NO*`,
    askPrivacy: `📋 *POLÍTICA DE PRIVACIDAD*

• Tus datos se usan solo para gestionar la reserva
• No compartimos con terceros
• Puedes solicitar eliminación en cualquier momento

¿Aceptas la política de privacidad? Responde *SÍ* o *NO*`,
    askMarketing: `📋 *COMUNICACIONES*

¿Quieres recibir ofertas y novedades por WhatsApp?

Responde *SÍ* o *NO* (puedes cambiar esto en cualquier momento)`,
    confirmBooking: `¿Confirmo tu reserva?

📅 %CLASS%
🗓️ %DATE% a las %TIME%
👤 %NAME%
📧 %EMAIL%
📍 ${CENTER_INFO.address}, ${CENTER_INFO.city}

Responde *SÍ* para confirmar o *NO* para cancelar`,
    bookingSuccess: `✅ *¡Reserva confirmada!*

📅 %CLASS%
🗓️ %DATE%, %TIME%
👤 %NAME%
📍 ${CENTER_INFO.address}, ${CENTER_INFO.city}

📱 Te enviaremos un recordatorio 24h antes.

¡Nos vemos pronto! 💃`,
    bookingError:
      'Ups, ha habido un problema al procesar la reserva. ¿Puedes intentarlo de nuevo o contactarnos al %PHONE%?',
    classFull:
      'Uy, esa clase se acaba de llenar 😔 ¿Te apunto a la lista de espera o prefieres otra clase?',
    yesNo: 'Por favor, responde *SÍ* o *NO*',
  },

  ca: {
    askStyle: "Quin estil de ball t'interessa?",
    styleOptions: `Tenim de tot:

💃 *Balls Socials*: Salsa, Bachata, Kizomba
🔥 *Urbà*: Hip Hop, Reggaeton, Dancehall, Twerk
👠 *Heels*: Heels Dance, Femmology, Sexy Style
🩰 *Dansa*: Ballet, Contemporani, Jazz
💪 *Fitness*: Stretching, Bum Bum

Escriu-me l'estil que més t'agrada`,
    askClass: 'Aquestes són les classes disponibles de %STYLE%:',
    noClassesAvailable:
      "Ui, ara mateix no hi ha classes d'aquest estil disponibles... T'interessa un altre estil?",
    askName:
      'Per reservar la teva classe de prova GRATIS, necessito el teu nom complet.\n\nExemple: Maria Garcia',
    askEmail:
      'Genial %NAME%! Ara necessito el teu email per enviar-te la confirmació.\n\nExemple: maria@email.com',
    invalidEmail: "Mmm, aquest email no sembla vàlid. Me'l pots escriure de nou?",
    askTerms: `📋 *TERMES I CONDICIONS*

• La primera classe és gratuïta i sense compromís
• Cancel·lacions: mínim 1 hora abans
• Ús d'instal·lacions segons normativa

Acceptes els termes? Respon *SÍ* o *NO*`,
    askPrivacy: `📋 *POLÍTICA DE PRIVACITAT*

• Les teves dades s'usen només per gestionar la reserva
• No compartim amb tercers
• Pots sol·licitar eliminació en qualsevol moment

Acceptes la política de privacitat? Respon *SÍ* o *NO*`,
    askMarketing: `📋 *COMUNICACIONS*

Vols rebre ofertes i novetats per WhatsApp?

Respon *SÍ* o *NO* (pots canviar això en qualsevol moment)`,
    confirmBooking: `Confirmo la teva reserva?

📅 %CLASS%
🗓️ %DATE% a les %TIME%
👤 %NAME%
📧 %EMAIL%
📍 ${CENTER_INFO.address}, ${CENTER_INFO.city}

Respon *SÍ* per confirmar o *NO* per cancel·lar`,
    bookingSuccess: `✅ *Reserva confirmada!*

📅 %CLASS%
🗓️ %DATE%, %TIME%
👤 %NAME%
📍 ${CENTER_INFO.address}, ${CENTER_INFO.city}

📱 T'enviarem un recordatori 24h abans.

Ens veiem aviat! 💃`,
    bookingError:
      'Ups, hi ha hagut un problema en processar la reserva. Pots intentar-ho de nou o contactar-nos al %PHONE%?',
    classFull:
      "Ui, aquesta classe s'acaba d'omplir 😔 T'apunto a la llista d'espera o prefereixes una altra classe?",
    yesNo: 'Si us plau, respon *SÍ* o *NO*',
  },

  en: {
    askStyle: 'What dance style interests you?',
    styleOptions: `We have everything:

💃 *Social Dances*: Salsa, Bachata, Kizomba
🔥 *Urban*: Hip Hop, Reggaeton, Dancehall, Twerk
👠 *Heels*: Heels Dance, Femmology, Sexy Style
🩰 *Dance*: Ballet, Contemporary, Jazz
💪 *Fitness*: Stretching, Bum Bum

Write me the style that catches your attention`,
    askClass: 'These are the available %STYLE% classes:',
    noClassesAvailable:
      'Oops, there are no classes of that style available right now... Are you interested in another style?',
    askName: 'To book your FREE trial class, I need your full name.\n\nExample: Maria Garcia',
    askEmail:
      'Great %NAME%! Now I need your email to send you the confirmation.\n\nExample: maria@email.com',
    invalidEmail: "Hmm, that email doesn't seem valid. Can you write it again?",
    askTerms: `📋 *TERMS AND CONDITIONS*

• The first class is free with no commitment
• Cancellations: minimum 1 hour before
• Use of facilities according to regulations

Do you accept the terms? Reply *YES* or *NO*`,
    askPrivacy: `📋 *PRIVACY POLICY*

• Your data is only used to manage the booking
• We don't share with third parties
• You can request deletion at any time

Do you accept the privacy policy? Reply *YES* or *NO*`,
    askMarketing: `📋 *COMMUNICATIONS*

Do you want to receive offers and news via WhatsApp?

Reply *YES* or *NO* (you can change this at any time)`,
    confirmBooking: `Shall I confirm your booking?

📅 %CLASS%
🗓️ %DATE% at %TIME%
👤 %NAME%
📧 %EMAIL%
📍 ${CENTER_INFO.address}, ${CENTER_INFO.city}

Reply *YES* to confirm or *NO* to cancel`,
    bookingSuccess: `✅ *Booking confirmed!*

📅 %CLASS%
🗓️ %DATE%, %TIME%
👤 %NAME%
📍 ${CENTER_INFO.address}, ${CENTER_INFO.city}

📱 We'll send you a reminder 24h before.

See you soon! 💃`,
    bookingError:
      'Oops, there was a problem processing the booking. Can you try again or contact us at %PHONE%?',
    classFull:
      'Oops, that class just filled up 😔 Should I add you to the waitlist or would you prefer another class?',
    yesNo: 'Please reply *YES* or *NO*',
  },

  fr: {
    askStyle: "Quel style de danse t'intéresse?",
    styleOptions: `Nous avons de tout:

💃 *Danses Sociales*: Salsa, Bachata, Kizomba
🔥 *Urbain*: Hip Hop, Reggaeton, Dancehall, Twerk
👠 *Heels*: Heels Dance, Femmology, Sexy Style
🩰 *Danse*: Ballet, Contemporain, Jazz
💪 *Fitness*: Stretching, Bum Bum

Écris-moi le style qui t'attire le plus`,
    askClass: 'Voici les cours disponibles de %STYLE%:',
    noClassesAvailable:
      "Oups, il n'y a pas de cours de ce style disponibles pour le moment... Un autre style t'intéresse?",
    askName:
      "Pour réserver ton cours d'essai GRATUIT, j'ai besoin de ton nom complet.\n\nExemple: Marie Garcia",
    askEmail:
      "Génial %NAME%! Maintenant j'ai besoin de ton email pour t'envoyer la confirmation.\n\nExemple: marie@email.com",
    invalidEmail: "Hmm, cet email ne semble pas valide. Tu peux l'écrire à nouveau?",
    askTerms: `📋 *CONDITIONS GÉNÉRALES*

• Le premier cours est gratuit et sans engagement
• Annulations: minimum 1 heure avant
• Utilisation des installations selon les règles

Acceptes-tu les conditions? Réponds *OUI* ou *NON*`,
    askPrivacy: `📋 *POLITIQUE DE CONFIDENTIALITÉ*

• Tes données sont utilisées uniquement pour gérer la réservation
• Nous ne partageons pas avec des tiers
• Tu peux demander la suppression à tout moment

Acceptes-tu la politique de confidentialité? Réponds *OUI* ou *NON*`,
    askMarketing: `📋 *COMMUNICATIONS*

Veux-tu recevoir des offres et des nouvelles par WhatsApp?

Réponds *OUI* ou *NON* (tu peux changer cela à tout moment)`,
    confirmBooking: `Je confirme ta réservation?

📅 %CLASS%
🗓️ %DATE% à %TIME%
👤 %NAME%
📧 %EMAIL%
📍 ${CENTER_INFO.address}, ${CENTER_INFO.city}

Réponds *OUI* pour confirmer ou *NON* pour annuler`,
    bookingSuccess: `✅ *Réservation confirmée!*

📅 %CLASS%
🗓️ %DATE%, %TIME%
👤 %NAME%
📍 ${CENTER_INFO.address}, ${CENTER_INFO.city}

📱 Nous t'enverrons un rappel 24h avant.

À bientôt! 💃`,
    bookingError:
      'Oups, il y a eu un problème lors du traitement de la réservation. Tu peux réessayer ou nous contacter au %PHONE%?',
    classFull:
      "Oups, ce cours vient de se remplir 😔 Je t'inscris sur la liste d'attente ou tu préfères un autre cours?",
    yesNo: "S'il te plaît, réponds *OUI* ou *NON*",
  },
};

// ============================================================================
// BOOKING FLOW CLASS
// ============================================================================

export class BookingFlow {
  private lang: SupportedLanguage;
  private state: BookingState;

  constructor(lang: SupportedLanguage, initialState?: BookingState) {
    this.lang = lang;
    this.state = initialState || {
      step: 'initial',
      data: { phone: '' },
    };
  }

  /**
   * Get current booking state
   */
  getState(): BookingState {
    return this.state;
  }

  /**
   * Start the booking flow
   */
  startBooking(phone: string): BookingFlowResult {
    this.state = {
      step: 'style_selection',
      data: { phone },
    };

    const msgs = MESSAGES[this.lang];
    const response = `${getConfirmation(this.lang)} ${msgs.askStyle}\n\n${msgs.styleOptions}`;

    return {
      response,
      newState: this.state,
    };
  }

  /**
   * Process user input based on current step
   */
  async processInput(
    input: string,
    fetchClasses?: (style: string) => Promise<ClassOption[]>
  ): Promise<BookingFlowResult> {
    const normalizedInput = input.trim().toLowerCase();
    // const _msgs = MESSAGES[this.lang]; // Available for future use

    switch (this.state.step) {
      case 'style_selection':
        return this.handleStyleSelection(normalizedInput, fetchClasses);

      case 'class_selection':
        return this.handleClassSelection(normalizedInput);

      case 'waitlist_pending':
        return this.handleWaitlistResponse(normalizedInput);

      case 'data_collection':
        return this.handleDataCollection(input); // Keep original case for names

      case 'consent_terms':
        return this.handleConsentTerms(normalizedInput);

      case 'consent_privacy':
        return this.handleConsentPrivacy(normalizedInput);

      case 'consent_marketing':
        return this.handleConsentMarketing(normalizedInput);

      case 'confirmation':
        return this.handleConfirmation(normalizedInput);

      default:
        return this.startBooking(this.state.data.phone);
    }
  }

  /**
   * Handle style selection
   */
  private async handleStyleSelection(
    input: string,
    fetchClasses?: (style: string) => Promise<ClassOption[]>
  ): Promise<BookingFlowResult> {
    const msgs = MESSAGES[this.lang];

    // Detect style from input
    const style = this.detectStyle(input);

    if (!style) {
      return {
        response: `No he pillado el estilo... ${msgs.styleOptions}`,
        newState: this.state,
      };
    }

    this.state.data.style = style;

    // Fetch available classes for this style
    let classes: ClassOption[] = [];
    if (fetchClasses) {
      try {
        classes = await fetchClasses(style);
      } catch (error) {
        console.error('[booking-flow] Error fetching classes:', error);
      }
    }

    if (classes.length === 0) {
      return {
        response: msgs.noClassesAvailable,
        newState: this.state,
      };
    }

    // Store classes and move to selection
    this.state.availableClasses = classes;
    this.state.step = 'class_selection';

    // Format class options (max 5)
    const classesDisplay = classes
      .slice(0, 5)
      .map((c, i) => {
        const spotsText =
          c.spotsAvailable > 0 ? `🎫 ${c.spotsAvailable} plazas` : '⚠️ *LLENA* (lista de espera)';
        return `${i + 1}️⃣ *${c.name}*\n   📅 ${c.dayOfWeek} ${c.date}, ${c.time}\n   👤 ${c.instructor || 'TBA'}\n   ${spotsText}`;
      })
      .join('\n\n');

    const response = `${getConfirmation(this.lang)} ${msgs.askClass.replace('%STYLE%', style)}\n\n${classesDisplay}\n\nEscribe el número de la clase que quieres`;

    return {
      response,
      newState: this.state,
    };
  }

  /**
   * Handle class selection
   */
  private handleClassSelection(input: string): BookingFlowResult {
    const msgs = MESSAGES[this.lang];
    const classes = this.state.availableClasses || [];

    // Try to parse number
    const num = parseInt(input, 10);

    if (isNaN(num) || num < 1 || num > classes.length) {
      return {
        response: `Por favor, escribe un número del 1 al ${classes.length}`,
        newState: this.state,
      };
    }

    const selectedClass = classes[num - 1];
    if (!selectedClass) {
      return {
        response: `Por favor, escribe un número del 1 al ${classes.length}`,
        newState: this.state,
      };
    }

    // Check if class is full - offer waitlist (Fase 7)
    if (selectedClass.spotsAvailable <= 0) {
      // Store the class for potential waitlist
      this.state.data.waitlistClassId = selectedClass.id;
      this.state.data.waitlistClassName = selectedClass.name;
      this.state.step = 'waitlist_pending';

      return {
        response: msgs.classFull,
        newState: this.state,
      };
    }

    // Save selection
    this.state.data.selectedClassId = selectedClass.id;
    this.state.data.selectedClassName = selectedClass.name;
    this.state.data.selectedClassDate = `${selectedClass.dayOfWeek} ${selectedClass.date}`;
    this.state.data.selectedClassTime = selectedClass.time;

    // Check if member data is already populated (existing member - Fase 6)
    const hasAllData =
      this.state.data.firstName && this.state.data.lastName && this.state.data.email;

    if (hasAllData) {
      // Skip data collection, go directly to consents
      this.state.step = 'consent_terms';
      const firstName = this.state.data.firstName;
      return {
        response: `${getConfirmation(this.lang)} ${firstName}, has elegido *${selectedClass.name}* 💃\n\nComo ya te conozco, solo necesito que confirmes los términos.\n\n${msgs.askTerms}`,
        newState: this.state,
      };
    }

    // Move to data collection (new users)
    this.state.step = 'data_collection';

    return {
      response: `${getConfirmation(this.lang)} Has elegido *${selectedClass.name}*\n\n${msgs.askName}`,
      newState: this.state,
    };
  }

  /**
   * Handle waitlist response (Fase 7)
   * User can say yes to join waitlist or choose another class
   */
  private handleWaitlistResponse(input: string): BookingFlowResult {
    const msgs = MESSAGES[this.lang];
    const className = this.state.data.waitlistClassName || 'la clase';

    // Check if user wants to join waitlist
    const yesPatterns = ['sí', 'si', 'yes', 'oui', 'apuntame', 'apúntame', 'lista', 'espera', '1'];
    const noPatterns = ['no', 'otra', 'other', 'autre', 'cambiar', '2'];

    const wantsWaitlist = yesPatterns.some(p => input.includes(p));
    const wantsOther = noPatterns.some(p => input.includes(p));

    if (wantsWaitlist) {
      // Mark for waitlist - will be processed by agent
      this.state.step = 'completed';
      this.state.data.selectedClassId = this.state.data.waitlistClassId;
      this.state.data.selectedClassName = this.state.data.waitlistClassName;

      const waitlistConfirm: Record<SupportedLanguage, string> = {
        es: `¡Perfecto! Te he apuntado a la lista de espera para *${className}* 📝\n\nTe avisaré en cuanto haya una plaza disponible. ¿Hay algo más en lo que pueda ayudarte?`,
        ca: `Perfecte! T'he apuntat a la llista d'espera per *${className}* 📝\n\nT'avisaré quan hi hagi una plaça disponible. Hi ha alguna cosa més en què pugui ajudar-te?`,
        en: `Perfect! I've added you to the waitlist for *${className}* 📝\n\nI'll let you know as soon as a spot opens up. Is there anything else I can help you with?`,
        fr: `Parfait! Je t'ai inscrit sur la liste d'attente pour *${className}* 📝\n\nJe te préviendrai dès qu'une place se libère. Y a-t-il autre chose que je puisse faire?`,
      };

      return {
        response: waitlistConfirm[this.lang],
        newState: this.state,
        action: 'waitlist', // Signal to agent to call waitlist API
      };
    }

    if (wantsOther) {
      // Go back to class selection
      this.state.step = 'class_selection';
      this.state.data.waitlistClassId = undefined;
      this.state.data.waitlistClassName = undefined;

      const classes = this.state.availableClasses || [];
      if (classes.length === 0) {
        return {
          response: msgs.noClassesAvailable,
          newState: this.state,
        };
      }

      const classList = classes
        .map(
          (c, i) =>
            `${i + 1}️⃣ *${c.name}*\n   📅 ${c.dayOfWeek} ${c.date}, ${c.time}\n   👤 ${c.instructor || 'TBA'}\n   🎫 ${c.spotsAvailable} plazas`
        )
        .join('\n\n');

      const chooseAnother: Record<SupportedLanguage, string> = {
        es: `Sin problema, aquí tienes las demás clases disponibles:\n\n${classList}\n\n¿Cuál te gustaría?`,
        ca: `Cap problema, aquí tens les altres classes disponibles:\n\n${classList}\n\nQuina t'agradaria?`,
        en: `No problem, here are the other available classes:\n\n${classList}\n\nWhich one would you like?`,
        fr: `Pas de souci, voici les autres cours disponibles:\n\n${classList}\n\nLequel voudrais-tu?`,
      };

      return {
        response: chooseAnother[this.lang],
        newState: this.state,
      };
    }

    // Unclear response, ask again
    const askAgain: Record<SupportedLanguage, string> = {
      es: `¿Te apunto a la lista de espera para *${className}*?\n\n1️⃣ Sí, apúntame\n2️⃣ No, prefiero otra clase`,
      ca: `T'apunto a la llista d'espera per *${className}*?\n\n1️⃣ Sí, apunta'm\n2️⃣ No, prefereixo una altra classe`,
      en: `Should I add you to the waitlist for *${className}*?\n\n1️⃣ Yes, add me\n2️⃣ No, I prefer another class`,
      fr: `Je t'inscris sur la liste d'attente pour *${className}*?\n\n1️⃣ Oui, inscris-moi\n2️⃣ Non, je préfère un autre cours`,
    };

    return {
      response: askAgain[this.lang],
      newState: this.state,
    };
  }

  /**
   * Handle data collection (name, email)
   */
  private handleDataCollection(input: string): BookingFlowResult {
    const msgs = MESSAGES[this.lang];

    // If we don't have name yet, this is the name
    if (!this.state.data.firstName) {
      const nameParts = input.trim().split(/\s+/);

      const firstName = nameParts[0];
      if (!firstName || firstName.length < 2) {
        return {
          response: msgs.askName,
          newState: this.state,
        };
      }

      this.state.data.firstName = nameParts[0];
      this.state.data.lastName = nameParts.slice(1).join(' ') || '';

      return {
        response: msgs.askEmail.replace('%NAME%', this.state.data.firstName || ''),
        newState: this.state,
      };
    }

    // Otherwise, this is the email
    const email = input.trim().toLowerCase();

    if (!this.isValidEmail(email)) {
      return {
        response: msgs.invalidEmail,
        newState: this.state,
      };
    }

    this.state.data.email = email;
    this.state.step = 'consent_terms';

    return {
      response: `${getConfirmation(this.lang)}\n\n${msgs.askTerms}`,
      newState: this.state,
    };
  }

  /**
   * Handle terms consent
   */
  private handleConsentTerms(input: string): BookingFlowResult {
    const msgs = MESSAGES[this.lang];
    const accepted = this.isYes(input);
    const rejected = this.isNo(input);

    if (!accepted && !rejected) {
      return {
        response: msgs.yesNo,
        newState: this.state,
      };
    }

    if (rejected) {
      // Can't proceed without terms
      return {
        response:
          'Entiendo. Sin aceptar los términos no puedo hacer la reserva. Si cambias de opinión, escríbeme de nuevo',
        newState: { ...this.state, step: 'initial' },
      };
    }

    this.state.data.acceptsTerms = true;
    this.state.step = 'consent_privacy';

    return {
      response: msgs.askPrivacy,
      newState: this.state,
    };
  }

  /**
   * Handle privacy consent
   */
  private handleConsentPrivacy(input: string): BookingFlowResult {
    const msgs = MESSAGES[this.lang];
    const accepted = this.isYes(input);
    const rejected = this.isNo(input);

    if (!accepted && !rejected) {
      return {
        response: msgs.yesNo,
        newState: this.state,
      };
    }

    if (rejected) {
      return {
        response:
          'Entiendo. Sin aceptar la política de privacidad no puedo procesar tus datos. Si cambias de opinión, escríbeme de nuevo',
        newState: { ...this.state, step: 'initial' },
      };
    }

    this.state.data.acceptsPrivacy = true;
    this.state.step = 'consent_marketing';

    return {
      response: msgs.askMarketing,
      newState: this.state,
    };
  }

  /**
   * Handle marketing consent (optional)
   */
  private handleConsentMarketing(input: string): BookingFlowResult {
    const msgs = MESSAGES[this.lang];
    const accepted = this.isYes(input);
    const rejected = this.isNo(input);

    if (!accepted && !rejected) {
      return {
        response: msgs.yesNo,
        newState: this.state,
      };
    }

    this.state.data.acceptsMarketing = accepted;
    this.state.data.consentTimestamp = new Date().toISOString();
    this.state.step = 'confirmation';

    // Show final confirmation
    const confirmMsg = msgs.confirmBooking
      .replace('%CLASS%', this.state.data.selectedClassName || '')
      .replace('%DATE%', this.state.data.selectedClassDate || '')
      .replace('%TIME%', this.state.data.selectedClassTime || '')
      .replace('%NAME%', `${this.state.data.firstName} ${this.state.data.lastName}`.trim())
      .replace('%EMAIL%', this.state.data.email || '');

    return {
      response: confirmMsg,
      newState: this.state,
    };
  }

  /**
   * Handle final confirmation
   */
  private handleConfirmation(input: string): BookingFlowResult {
    const msgs = MESSAGES[this.lang];
    const accepted = this.isYes(input);
    const rejected = this.isNo(input);

    if (!accepted && !rejected) {
      return {
        response: msgs.yesNo,
        newState: this.state,
      };
    }

    if (rejected) {
      return {
        response: 'Vale, he cancelado la reserva. Si quieres reservar otra clase, solo escríbeme',
        newState: { ...this.state, step: 'initial' },
      };
    }

    // Ready to book!
    this.state.step = 'completed';

    return {
      response: '', // Will be replaced with success message after actual booking
      newState: this.state,
      shouldBook: true,
      bookingData: this.state.data,
    };
  }

  /**
   * Get success message after booking is confirmed
   */
  getSuccessMessage(): string {
    const msgs = MESSAGES[this.lang];
    return msgs.bookingSuccess
      .replace('%CLASS%', this.state.data.selectedClassName || '')
      .replace('%DATE%', this.state.data.selectedClassDate || '')
      .replace('%TIME%', this.state.data.selectedClassTime || '')
      .replace('%NAME%', `${this.state.data.firstName} ${this.state.data.lastName}`.trim());
  }

  /**
   * Get error message if booking fails
   */
  getErrorMessage(): string {
    const msgs = MESSAGES[this.lang];
    return msgs.bookingError.replace('%PHONE%', CENTER_INFO.phone);
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Detect dance style from user input
   */
  private detectStyle(input: string): string | null {
    // Use same style keys as constants/style-mappings.ts for consistency
    const styleMap: Record<string, string[]> = {
      salsa: ['salsa', 'salsera', 'salsero', 'cubana'],
      bachata: ['bachata', 'bachatera', 'bachatero', 'sensual'],
      hiphop: ['hip hop', 'hiphop', 'hip-hop', 'urbano', 'urban'],
      reparto: ['reggaeton', 'reggaetón', 'regueton', 'perreo'],
      heels: ['heels', 'tacones', 'stiletto'],
      sexystyle: ['sexy style', 'sexy-style'],
      femmology: ['femmology', 'femme'],
      dancehall: ['dancehall', 'dance hall', 'jamaican'],
      twerk: ['twerk', 'twerkeo', 'twerking'],
      contemporaneo: ['contemporaneo', 'contemporáneo', 'contemporary', 'contemp'],
      ballet: ['ballet', 'clasico', 'clásico', 'classical'],
      jazz: ['jazz', 'modern jazz'],
      afro: ['afro', 'afrobeat', 'afrodance'],
      kizomba: ['kizomba', 'semba', 'zouk'],
      stretching: ['stretching', 'estiramientos', 'flexibilidad'],
      fitness: ['fitness', 'bum bum', 'cuerpo fit'],
    };

    const normalizedInput = input.toLowerCase();

    for (const [style, keywords] of Object.entries(styleMap)) {
      if (keywords.some(kw => normalizedInput.includes(kw))) {
        return style;
      }
    }

    return null;
  }

  /**
   * Check if input is affirmative
   */
  private isYes(input: string): boolean {
    const yesWords = [
      'sí',
      'si',
      'yes',
      'oui',
      'ok',
      'vale',
      'acepto',
      'confirmo',
      'confirmar',
      "d'acord",
      'dacord',
    ];
    return yesWords.some(w => input.includes(w));
  }

  /**
   * Check if input is negative
   */
  private isNo(input: string): boolean {
    const noWords = ['no', 'non', 'cancel', 'cancelar', 'anular'];
    return noWords.some(w => input.includes(w));
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// ============================================================================
// INTENT DETECTION
// ============================================================================

/**
 * Detect if user wants to book a class
 */
export function detectBookingIntent(text: string): boolean {
  const bookingKeywords = [
    'reservar',
    'reserva',
    'apuntar',
    'apuntarme',
    'inscribir',
    'book',
    'booking',
    'reserve',
    'sign up',
    'enroll',
    'réserver',
    'inscription',
    'probar',
    'prueba',
    'clase gratis',
    'primera clase',
    'quiero ir',
    'me apunto',
    'me interesa',
  ];

  const normalizedText = text.toLowerCase();
  return bookingKeywords.some(kw => normalizedText.includes(kw));
}

/**
 * Check if user is in the middle of a booking flow
 */
export function isInBookingFlow(step: BookingStep): boolean {
  return step !== 'initial' && step !== 'completed';
}

// ============================================================================
// MEMBER INTENT DETECTION (Fase 6)
// ============================================================================

export type MemberIntent = 'credits' | 'cancel' | 'history' | 'update' | 'none';

/**
 * Detect member-specific intents (only relevant for existing members)
 */
export function detectMemberIntent(text: string): MemberIntent {
  const normalizedText = text.toLowerCase();

  // Credits inquiry: "cuántas clases me quedan", "mis créditos", etc.
  const creditsKeywords = [
    'cuántas clases',
    'cuantas clases',
    'clases me quedan',
    'créditos',
    'creditos',
    'mis clases',
    'how many classes',
    'my credits',
    'credits left',
    'quantes classes',
    'classes que em queden',
    'combien de cours',
    'mes crédits',
  ];

  if (creditsKeywords.some(kw => normalizedText.includes(kw))) {
    return 'credits';
  }

  // Cancel booking: "cancelar reserva", "anular", etc.
  const cancelKeywords = [
    'cancelar',
    'anular',
    'cancel',
    'annuler',
    'no puedo ir',
    'no podré ir',
    'quitar reserva',
    'borrar reserva',
    'cancel·lar',
  ];

  if (cancelKeywords.some(kw => normalizedText.includes(kw))) {
    return 'cancel';
  }

  // View history: "mis reservas", "historial", etc.
  const historyKeywords = [
    'mis reservas',
    'historial',
    'clases pasadas',
    'my bookings',
    'my reservations',
    'mes réservations',
    'les meves reserves',
    'qué clases tengo',
    'que clases tengo',
  ];

  if (historyKeywords.some(kw => normalizedText.includes(kw))) {
    return 'history';
  }

  // Update profile: "cambiar email", "actualizar datos", etc.
  const updateKeywords = [
    'cambiar email',
    'cambiar mi email',
    'actualizar email',
    'actualizar datos',
    'cambiar nombre',
    'actualizar nombre',
    'change email',
    'update email',
    'change my email',
    'changer email',
    'canviar email',
    'actualitzar email',
    'mis datos',
    'my data',
    'my profile',
    'mi perfil',
  ];

  if (updateKeywords.some(kw => normalizedText.includes(kw))) {
    return 'update';
  }

  return 'none';
}
