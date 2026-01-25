/**
 * Image Alt Texts Registry
 * ========================
 * Centralized, multilingual alt texts for all images.
 *
 * Structure:
 * - classes: Dance class images
 * - teachers: Instructor photos
 * - general: Logo, OG images, etc.
 *
 * SEO Guidelines:
 * - 50-125 characters (optimal: 80-100)
 * - Include geographic keyword (Barcelona)
 * - Include brand name when relevant
 * - Describe action, not just object
 * - Avoid "image of", "photo of"
 */

export type Locale = 'es' | 'en' | 'ca' | 'fr';

export type LocalizedAltText = Record<Locale, string>;

export interface ImageAltConfig {
  es: string;
  en: string;
  ca: string;
  fr: string;
}

// ============================================================================
// IMAGE ALT TEXTS REGISTRY
// ============================================================================

export const IMAGE_ALT_TEXTS = {
  // ==========================================================================
  // DANCE CLASSES
  // ==========================================================================
  classes: {
    dancehall: {
      hero: {
        es: "Clases de Dancehall en Barcelona - Farray's International Dance Center",
        en: "Dancehall Classes in Barcelona - Farray's International Dance Center",
        ca: "Classes de Dancehall a Barcelona - Farray's International Dance Center",
        fr: "Cours de Dancehall à Barcelone - Farray's International Dance Center",
      },
      whatIs: {
        es: 'Estudiantes aprendiendo Dancehall jamaicano en academia de Barcelona',
        en: 'Students learning Jamaican Dancehall at Barcelona dance academy',
        ca: 'Estudiants aprenent Dancehall jamaicà a acadèmia de Barcelona',
        fr: 'Étudiants apprenant le Dancehall jamaïcain à académie de Barcelone',
      },
      gallery: [
        {
          es: 'Grupo de bailarines practicando Dancehall en Barcelona',
          en: 'Group of dancers practicing Dancehall in Barcelona',
          ca: 'Grup de ballarins practicant Dancehall a Barcelona',
          fr: 'Groupe de danseurs pratiquant le Dancehall à Barcelone',
        },
      ],
    },

    twerk: {
      hero: {
        es: "Clases de Twerk en Barcelona - Farray's Center",
        en: "Twerk Classes in Barcelona - Farray's Center",
        ca: "Classes de Twerk a Barcelona - Farray's Center",
        fr: "Cours de Twerk à Barcelone - Farray's Center",
      },
      whatIs: {
        es: 'Alumnas en clase de Twerk fitness en Barcelona',
        en: 'Students in Twerk fitness class in Barcelona',
        ca: 'Alumnes a classe de Twerk fitness a Barcelona',
        fr: 'Élèves en cours de Twerk fitness à Barcelone',
      },
    },

    afrobeat: {
      hero: {
        es: "Clases de Afrobeat en Barcelona - Farray's Center",
        en: "Afrobeat Classes in Barcelona - Farray's Center",
        ca: "Classes d'Afrobeat a Barcelona - Farray's Center",
        fr: "Cours d'Afrobeat à Barcelone - Farray's Center",
      },
      whatIs: {
        es: 'Bailarines ejecutando movimientos de Afrobeat africano',
        en: 'Dancers performing African Afrobeat movements',
        ca: "Ballarins executant moviments de l'Afrobeat africà",
        fr: 'Danseurs exécutant des mouvements Afrobeat africains',
      },
    },

    'hip-hop': {
      hero: {
        es: "Clases de Hip Hop en Barcelona - Street dance urbano en Farray's Center",
        en: "Hip Hop Classes in Barcelona - Urban street dance at Farray's Center",
        ca: "Classes de Hip Hop a Barcelona - Street dance urbà a Farray's Center",
        fr: "Cours de Hip Hop à Barcelone - Street dance urbain à Farray's Center",
      },
      whatIs: {
        es: 'Estudiantes practicando movimientos de Hip Hop en academia de Barcelona',
        en: 'Students practicing Hip Hop moves at Barcelona dance academy',
        ca: 'Estudiants practicant moviments de Hip Hop a acadèmia de Barcelona',
        fr: 'Étudiants pratiquant des mouvements de Hip Hop à académie de Barcelone',
      },
      card: {
        es: 'Clases de Hip Hop Barcelona - Aprende breaking, locking y popping',
        en: 'Hip Hop Classes Barcelona - Learn breaking, locking and popping',
        ca: 'Classes de Hip Hop Barcelona - Aprèn breaking, locking i popping',
        fr: 'Cours de Hip Hop Barcelone - Apprenez le breaking, locking et popping',
      },
    },

    'hip-hop-reggaeton': {
      hero: {
        es: "Clases de Hip Hop y Reggaetón en Barcelona - Farray's Center",
        en: "Hip Hop and Reggaeton Classes in Barcelona - Farray's Center",
        ca: "Classes de Hip Hop i Reggaeton a Barcelona - Farray's Center",
        fr: "Cours de Hip Hop et Reggaeton à Barcelone - Farray's Center",
      },
    },

    femmology: {
      hero: {
        es: 'Yunaisy Farray y su grupo de bailarinas de Femmology en pose dramática sobre escenario con iluminación púrpura - Clases de baile en tacones Barcelona',
        en: 'Yunaisy Farray and her Femmology dance group in dramatic stage pose with purple lighting - Heels dance classes Barcelona',
        ca: 'Yunaisy Farray i el seu grup de balladores de Femmology en pose dramàtica sobre escenari amb il·luminació porpra - Classes de ball amb talons Barcelona',
        fr: 'Yunaisy Farray et son groupe de danseuses Femmology en pose dramatique sur scène avec éclairage violet - Cours de danse en talons Barcelone',
      },
    },

    'sexy-style': {
      hero: {
        es: "Clases de Sexy Style en Barcelona - Farray's Center",
        en: "Sexy Style Classes in Barcelona - Farray's Center",
        ca: "Classes de Sexy Style a Barcelona - Farray's Center",
        fr: "Cours de Sexy Style à Barcelone - Farray's Center",
      },
      whatIs: {
        es: 'Alumnas practicando Sexy Style con expresión sensual y movimientos elegantes en academia de Barcelona',
        en: 'Students practicing Sexy Style with sensual expression and elegant movements at Barcelona dance academy',
        ca: 'Alumnes practicant Sexy Style amb expressió sensual i moviments elegants a acadèmia de Barcelona',
        fr: 'Élèves pratiquant le Sexy Style avec expression sensuelle et mouvements élégants à académie de Barcelone',
      },
      card: {
        es: 'Clases de Sexy Style Barcelona - Sensualidad, confianza y expresión corporal',
        en: 'Sexy Style Classes Barcelona - Sensuality, confidence and body expression',
        ca: 'Classes de Sexy Style Barcelona - Sensualitat, confiança i expressió corporal',
        fr: 'Cours de Sexy Style Barcelone - Sensualité, confiance et expression corporelle',
      },
    },

    ballet: {
      hero: {
        es: "Clases de Ballet Clásico en Barcelona - Farray's Center",
        en: "Classical Ballet Classes in Barcelona - Farray's Center",
        ca: "Classes de Ballet Clàssic a Barcelona - Farray's Center",
        fr: "Cours de Ballet Classique à Barcelone - Farray's Center",
      },
    },

    // NOTE: contemporaneo is in styleImages section (line ~714) with full enterprise structure

    'modern-jazz': {
      hero: {
        es: "Clases de Modern Jazz en Barcelona - Farray's Center",
        en: "Modern Jazz Classes in Barcelona - Farray's Center",
        ca: "Classes de Modern Jazz a Barcelona - Farray's Center",
        fr: "Cours de Modern Jazz à Barcelone - Farray's Center",
      },
    },

    'salsa-cubana': {
      hero: {
        es: "Clases de Salsa Cubana en Barcelona - Farray's Center",
        en: "Cuban Salsa Classes in Barcelona - Farray's Center",
        ca: "Classes de Salsa Cubana a Barcelona - Farray's Center",
        fr: "Cours de Salsa Cubaine à Barcelone - Farray's Center",
      },
    },

    bachata: {
      hero: {
        es: "Clases de Bachata en Barcelona - Farray's Center",
        en: "Bachata Classes in Barcelona - Farray's Center",
        ca: "Classes de Bachata a Barcelona - Farray's Center",
        fr: "Cours de Bachata à Barcelone - Farray's Center",
      },
    },

    stretching: {
      hero: {
        es: "Clases de Stretching en Barcelona - Farray's Center",
        en: "Stretching Classes in Barcelona - Farray's Center",
        ca: "Classes d'Stretching a Barcelona - Farray's Center",
        fr: "Cours de Stretching à Barcelone - Farray's Center",
      },
      whatIs: {
        es: 'Alumna ejecutando ejercicio de flexibilidad y elongación en clase de stretching profesional en Barcelona',
        en: 'Student performing flexibility and elongation exercise in professional stretching class in Barcelona',
        ca: 'Alumna executant exercici de flexibilitat i elongació a classe de stretching professional a Barcelona',
        fr: 'Élève exécutant exercice de flexibilité et élongation en cours de stretching professionnel à Barcelone',
      },
      card: {
        es: 'Clases de Stretching Barcelona - Flexibilidad, backbending y elongación para bailarines',
        en: 'Stretching Classes Barcelona - Flexibility, backbending and elongation for dancers',
        ca: 'Classes de Stretching Barcelona - Flexibilitat, backbending i elongació per a ballarins',
        fr: 'Cours de Stretching Barcelone - Flexibilité, backbending et élongation pour danseurs',
      },
    },

    'sexy-reggaeton': {
      hero: {
        es: "Clases de Sexy Reggaetón en Barcelona - Farray's Center",
        en: "Sexy Reggaeton Classes in Barcelona - Farray's Center",
        ca: "Classes de Sexy Reggaeton a Barcelona - Farray's Center",
        fr: "Cours de Sexy Reggaeton à Barcelone - Farray's Center",
      },
    },

    'reggaeton-cubano': {
      hero: {
        es: "Clases de Reggaetón Cubano en Barcelona - Farray's Center",
        en: "Cuban Reggaeton Classes in Barcelona - Farray's Center",
        ca: "Classes de Reggaeton Cubà a Barcelona - Farray's Center",
        fr: "Cours de Reggaeton Cubain à Barcelone - Farray's Center",
      },
    },

    'afro-contemporaneo': {
      hero: {
        es: "Clases de Afro Contemporáneo en Barcelona - Técnica cubana ENA en Farray's Center",
        en: "Afro Contemporary Classes in Barcelona - Cuban ENA technique at Farray's Center",
        ca: "Classes d'Afro Contemporani a Barcelona - Tècnica cubana ENA a Farray's Center",
        fr: "Cours d'Afro Contemporain à Barcelone - Technique cubaine ENA à Farray's Center",
      },
      whatIs: {
        es: 'Estudiantes practicando técnica Afro Contemporánea cubana en Barcelona',
        en: 'Students practicing Cuban Afro Contemporary technique in Barcelona',
        ca: 'Estudiants practicant tècnica Afro Contemporània cubana a Barcelona',
        fr: 'Étudiants pratiquant la technique Afro Contemporaine cubaine à Barcelone',
      },
      card: {
        es: "Clases de Afro Contemporáneo Barcelona - Técnica cubana ENA en Farray's Center",
        en: "Afro Contemporary Classes Barcelona - Cuban ENA technique at Farray's Center",
        ca: "Classes d'Afro Contemporani Barcelona - Tècnica cubana ENA a Farray's Center",
        fr: "Cours d'Afro Contemporain Barcelone - Technique cubaine ENA à Farray's Center",
      },
    },

    'afro-jazz': {
      hero: {
        es: "Clases de Afro Jazz en Barcelona - Farray's Center",
        en: "Afro Jazz Classes in Barcelona - Farray's Center",
        ca: "Classes d'Afro Jazz a Barcelona - Farray's Center",
        fr: "Cours d'Afro Jazz à Barcelone - Farray's Center",
      },
    },

    timba: {
      // Alt genérico (fallback)
      alt: {
        es: "Clases de Timba Cubana en Barcelona - Farray's Center",
        en: "Cuban Timba Classes in Barcelona - Farray's Center",
        ca: "Classes de Timba Cubana a Barcelona - Farray's Center",
        fr: "Cours de Timba Cubaine à Barcelone - Farray's Center",
      },
      // Para cards en hub de clases de baile (/clases/baile-barcelona)
      cardHub: {
        es: 'Timba Cubana Barcelona - Ritmo explosivo con raíces del son y jazz afrocubano',
        en: 'Cuban Timba Barcelona - Explosive rhythm with son and Afro-Cuban jazz roots',
        ca: 'Timba Cubana Barcelona - Ritme explosiu amb arrels del son i jazz afrocubà',
        fr: 'Timba Cubaine Barcelone - Rythme explosif avec racines du son et jazz afro-cubain',
      },
      // Para cards en categoría salsa/bachata (/clases/salsa-bachata-barcelona)
      cardLatin: {
        es: 'Timba Cubana - Ritmo urbano cubano que fusiona son, jazz y música popular',
        en: 'Cuban Timba - Cuban urban rhythm fusing son, jazz and popular music',
        ca: 'Timba Cubana - Ritme urbà cubà que fusiona son, jazz i música popular',
        fr: 'Timba Cubaine - Rythme urbain cubain fusionnant son, jazz et musique populaire',
      },
      // Para hero de la página de clase individual
      hero: {
        es: "Bailarines ejecutando Timba Cubana en Barcelona - Ritmo explosivo en Farray's Center",
        en: "Dancers performing Cuban Timba in Barcelona - Explosive rhythm at Farray's Center",
        ca: "Ballarins executant Timba Cubana a Barcelona - Ritme explosiu a Farray's Center",
        fr: "Danseurs exécutant la Timba Cubaine à Barcelone - Rythme explosif chez Farray's Center",
      },
      // Para sección "¿Qué es?" de la página de clase
      whatIs: {
        es: 'Bailarines practicando Timba Cubana y Lady Timba en academia de Barcelona - Interpretación musical y despelote cubano',
        en: 'Dancers practicing Cuban Timba and Lady Timba at Barcelona dance academy - Musical interpretation and Cuban despelote',
        ca: 'Ballarins practicant Timba Cubana i Lady Timba a acadèmia de Barcelona - Interpretació musical i despelote cubà',
        fr: 'Danseurs pratiquant la Timba Cubaine et Lady Timba à académie de Barcelone - Interprétation musicale et despelote cubain',
      },
    },

    'folklore-cubano': {
      hero: {
        es: "Bailarina ejecutando danza Yoruba de Folklore Cubano en las calles de La Habana - Tradición afrocubana en Farray's Center Barcelona",
        en: "Dancer performing Yoruba dance from Cuban Folklore on the streets of Havana - Afro-Cuban tradition at Farray's Center Barcelona",
        ca: "Ballarina executant dansa Yoruba de Folklore Cubà als carrers de l'Havana - Tradició afrocubana a Farray's Center Barcelona",
        fr: "Danseuse exécutant une danse Yoruba du Folklore Cubain dans les rues de La Havane - Tradition afro-cubaine chez Farray's Center Barcelone",
      },
      whatIs: {
        es: 'Grupo de estudiantes aprendiendo danzas a los Orishas y folklore cubano tradicional en academia de Barcelona',
        en: 'Group of students learning Orishas dances and traditional Cuban folklore at Barcelona dance academy',
        ca: "Grup d'estudiants aprenent danses als Orixàs i folklore cubà tradicional a acadèmia de Barcelona",
        fr: "Groupe d'étudiants apprenant les danses aux Orishas et folklore cubain traditionnel à académie de Barcelone",
      },
      card: {
        es: 'Clases de Folklore Cubano Barcelona - Danzas Yoruba, Orishas y rumba cubana',
        en: 'Cuban Folklore Classes Barcelona - Yoruba dances, Orishas and Cuban rumba',
        ca: 'Classes de Folklore Cubà Barcelona - Danses Yoruba, Orixàs i rumba cubana',
        fr: 'Cours de Folklore Cubain Barcelone - Danses Yoruba, Orishas et rumba cubaine',
      },
    },

    'salsa-lady-style': {
      hero: {
        es: "Bailarinas ejecutando Salsa Lady Style en Barcelona - Técnica femenina cubana y braceo elegante en Farray's Center",
        en: "Dancers performing Salsa Lady Style in Barcelona - Cuban feminine technique and elegant arm styling at Farray's Center",
        ca: "Ballarines executant Salsa Lady Style a Barcelona - Tècnica femenina cubana i braceo elegant a Farray's Center",
        fr: "Danseuses exécutant le Salsa Lady Style à Barcelone - Technique féminine cubaine et braceo élégant chez Farray's Center",
      },
      whatIs: {
        es: 'Alumnas practicando técnica de Salsa Lady Style con braceo y movimientos femeninos en academia de Barcelona',
        en: 'Students practicing Salsa Lady Style technique with arm styling and feminine movements at Barcelona dance academy',
        ca: 'Alumnes practicant tècnica de Salsa Lady Style amb braceo i moviments femenins a acadèmia de Barcelona',
        fr: 'Élèves pratiquant la technique Salsa Lady Style avec braceo et mouvements féminins à académie de Barcelone',
      },
      card: {
        es: 'Clases de Salsa Lady Style Barcelona - Técnica femenina cubana, braceo elegante y expresión corporal',
        en: 'Salsa Lady Style Classes Barcelona - Cuban feminine technique, elegant arm styling and body expression',
        ca: 'Classes de Salsa Lady Style Barcelona - Tècnica femenina cubana, braceo elegant i expressió corporal',
        fr: 'Cours de Salsa Lady Style Barcelone - Technique féminine cubaine, braceo élégant et expression corporelle',
      },
    },

    'bum-bum': {
      hero: {
        es: 'Alumnas realizando ejercicios de glúteos Bum Bum en Barcelona - Método Farray con hip thrust y sentadillas',
        en: 'Students performing Bum Bum glute exercises in Barcelona - Farray Method with hip thrust and squats',
        ca: 'Alumnes realitzant exercicis de glutis Bum Bum a Barcelona - Mètode Farray amb hip thrust i esquats',
        fr: 'Élèves effectuant des exercices Bum Bum fessiers à Barcelone - Méthode Farray avec hip thrust et squats',
      },
      whatIs: {
        es: 'Grupo de alumnas tonificando glúteos con ejercicios Bum Bum en academia de Barcelona',
        en: 'Group of students toning glutes with Bum Bum exercises at Barcelona dance academy',
        ca: "Grup d'alumnes tonificant glutis amb exercicis Bum Bum a acadèmia de Barcelona",
        fr: "Groupe d'élèves tonifiant les fessiers avec exercices Bum Bum à académie de Barcelone",
      },
      card: {
        es: 'Clases de Bum Bum Barcelona - Tonifica glúteos con hip thrust y técnicas de baile',
        en: 'Bum Bum Classes Barcelona - Tone glutes with hip thrust and dance techniques',
        ca: 'Classes de Bum Bum Barcelona - Tonifica glutis amb hip thrust i tècniques de ball',
        fr: 'Cours de Bum Bum Barcelone - Tonifiez les fessiers avec hip thrust et techniques de danse',
      },
    },

    'cuerpo-fit': {
      hero: {
        es: 'Alumnas realizando ejercicios de acondicionamiento físico Cuerpo Fit en Barcelona - Método Farray con entrenamiento funcional para bailarines',
        en: 'Students performing Cuerpo Fit physical conditioning exercises in Barcelona - Farray Method with functional training for dancers',
        ca: 'Alumnes realitzant exercicis de condicionament físic Cuerpo Fit a Barcelona - Mètode Farray amb entrenament funcional per a ballarins',
        fr: 'Élèves effectuant des exercices de conditionnement physique Cuerpo Fit à Barcelone - Méthode Farray avec entraînement fonctionnel pour danseurs',
      },
      whatIs: {
        es: 'Grupo de bailarines entrenando fuerza y resistencia en clase de Cuerpo Fit en academia de Barcelona',
        en: 'Group of dancers training strength and endurance in Cuerpo Fit class at Barcelona dance academy',
        ca: 'Grup de ballarins entrenant força i resistència a classe de Cuerpo Fit a acadèmia de Barcelona',
        fr: 'Groupe de danseurs entraînant force et endurance en cours de Cuerpo Fit à académie de Barcelone',
      },
      card: {
        es: 'Clases de Cuerpo Fit Barcelona - Acondicionamiento físico integral para bailarines',
        en: 'Cuerpo Fit Classes Barcelona - Complete physical conditioning for dancers',
        ca: 'Classes de Cuerpo Fit Barcelona - Condicionament físic integral per a ballarins',
        fr: 'Cours de Cuerpo Fit Barcelone - Conditionnement physique complet pour danseurs',
      },
    },
  },

  // ==========================================================================
  // TEACHERS
  // ==========================================================================
  teachers: {
    'yunaisy-farray': {
      portrait: {
        es: "Retrato de Yunaisy Farray, directora de Farray's Center, bailarina de Hollywood, profesora de Salsa Cubana, Afro Jazz y Bachata Lady Style, creadora del Método Farray®, miembro CID-UNESCO con más de 25 años de experiencia internacional",
        en: "Portrait of Yunaisy Farray, Farray's Center director, Hollywood dancer, Cuban Salsa, Afro Jazz and Bachata Lady Style instructor, creator of Farray® Method, CID-UNESCO member with over 25 years of international experience",
        ca: "Retrat de Yunaisy Farray, directora de Farray's Center, ballarina de Hollywood, professora de Salsa Cubana, Afro Jazz i Bachata Lady Style, creadora del Mètode Farray®, membre CID-UNESCO amb més de 25 anys d'experiència internacional",
        fr: "Portrait de Yunaisy Farray, directrice de Farray's Center, danseuse hollywoodienne, professeure de Salsa Cubaine, Afro Jazz et Bachata Lady Style, créatrice de la Méthode Farray®, membre CID-UNESCO avec plus de 25 ans d'expérience internationale",
      },
    },
    'daniel-sene': {
      portrait: {
        es: 'Retrato de Daniel Sené, profesor de Ballet Clásico, Contemporáneo, Yoga, Tai-Chi y Stretching en Barcelona, bailarín profesional formado en la prestigiosa Escuela Nacional de Ballet de Cuba, referente nacional en técnica clásica cubana',
        en: 'Portrait of Daniel Sené, Classical Ballet, Contemporary, Yoga, Tai-Chi and Stretching instructor in Barcelona, professional dancer trained at prestigious National Ballet School of Cuba, national reference in Cuban classical technique',
        ca: 'Retrat de Daniel Sené, professor de Ballet Clàssic, Contemporani, Ioga, Tai-Chi i Stretching a Barcelona, ballarí professional format a la prestigiosa Escola Nacional de Ballet de Cuba, referent nacional en tècnica clàssica cubana',
        fr: 'Portrait de Daniel Sené, professeur de Ballet Classique, Contemporain, Yoga, Tai-Chi et Stretching à Barcelone, danseur professionnel formé à la prestigieuse École Nationale de Ballet de Cuba, référence nationale en technique classique cubaine',
      },
    },
    'alejandro-minoso': {
      portrait: {
        es: 'Retrato de Alejandro Miñoso, profesor de Ballet, Modern Jazz, Afro Jazz y Contemporáneo en Barcelona, bailarín profesional cubano formado en ENA Cuba, ex solista de la prestigiosa compañía Carlos Acosta, técnica académica cubana de primer nivel',
        en: 'Portrait of Alejandro Miñoso, Ballet, Modern Jazz, Afro Jazz and Contemporary instructor in Barcelona, Cuban professional dancer trained at ENA Cuba, former soloist of prestigious Carlos Acosta company, first-level Cuban academic technique',
        ca: "Retrat d'Alejandro Miñoso, professor de Ballet, Modern Jazz, Afro Jazz i Contemporani a Barcelona, ballarí professional cubà format a ENA Cuba, exsolista de la prestigiosa companyia Carlos Acosta, tècnica acadèmica cubana de primer nivell",
        fr: "Portrait d'Alejandro Miñoso, professeur de Ballet, Modern Jazz, Afro Jazz et Contemporain à Barcelone, danseur professionnel cubain formé à l'ENA Cuba, ancien soliste de la prestigieuse compagnie Carlos Acosta, technique académique cubaine de premier niveau",
      },
    },
    'sandra-gomez': {
      portrait: {
        es: 'Retrato de Sandra Gómez, instructora profesional de Dancehall y Twerk en Barcelona con más de 6 años de experiencia, formación jamaicana auténtica, especialista en fusión de Twerk y Bootydance con esencia jamaicana, técnica impecable y energía contagiosa',
        en: 'Portrait of Sandra Gómez, professional Dancehall and Twerk instructor in Barcelona with over 6 years of experience, authentic Jamaican training, specialist in Twerk and Bootydance fusion with Jamaican essence, impeccable technique and contagious energy',
        ca: "Retrat de Sandra Gómez, instructora professional de Dancehall i Twerk a Barcelona amb més de 6 anys d'experiència, formació jamaicana autèntica, especialista en fusió de Twerk i Bootydance amb essència jamaicana, tècnica impecable i energia contagiosa",
        fr: "Portrait de Sandra Gómez, instructrice professionnelle de Dancehall et Twerk à Barcelone avec plus de 6 ans d'expérience, formation jamaïcaine authentique, spécialiste en fusion de Twerk et Bootydance avec essence jamaïcaine, technique impeccable et énergie contagieuse",
      },
    },
    'isabel-lopez': {
      portrait: {
        es: 'Retrato de Isabel López, instructora especializada de Dancehall y Dancehall Female en Barcelona con más de 5 años de experiencia, formación con maestros jamaicanos auténticos, energía contagiosa y técnica profesional combinando old school moves con últimos hits',
        en: 'Portrait of Isabel López, specialized Dancehall and Dancehall Female instructor in Barcelona with over 5 years of experience, training with authentic Jamaican masters, contagious energy and professional technique combining old school moves with latest hits',
        ca: "Retrat d'Isabel López, instructora especialitzada de Dancehall i Dancehall Female a Barcelona amb més de 5 anys d'experiència, formació amb mestres jamaicans autèntics, energia contagiosa i tècnica professional combinant old school moves amb últims hits",
        fr: "Portrait d'Isabel López, instructrice spécialisée de Dancehall et Dancehall Female à Barcelone avec plus de 5 ans d'expérience, formation avec maîtres jamaïcains authentiques, énergie contagieuse et technique professionnelle combinant old school moves avec derniers hits",
      },
    },
    'marcos-martinez': {
      portrait: {
        es: 'Retrato de Marcos Martínez, referente del Hip Hop en España, instructor especializado en Breaking, Locking y Popping en Barcelona, juez internacional de competiciones con décadas de experiencia, estilo único que combina técnica old school con tendencias actuales',
        en: 'Portrait of Marcos Martínez, Hip Hop reference in Spain, specialized instructor in Breaking, Locking and Popping in Barcelona, international competition judge with decades of experience, unique style combining old school technique with current trends',
        ca: "Retrat de Marcos Martínez, referent del Hip Hop a Espanya, instructor especialitzat en Breaking, Locking i Popping a Barcelona, jutge internacional de competicions amb dècades d'experiència, estil únic que combina tècnica old school amb tendències actuals",
        fr: "Portrait de Marcos Martínez, référence du Hip Hop en Espagne, instructeur spécialisé en Breaking, Locking et Popping à Barcelone, juge international de compétitions avec décennies d'expérience, style unique combinant technique old school avec tendances actuelles",
      },
    },
    'yasmina-fernandez': {
      portrait: {
        es: 'Retrato de Yasmina Fernández, profesora extraordinariamente versátil de Salsa Cubana, Lady Style, Sexy Style y Sexy Reggaeton en Barcelona, certificada en Método Farray® desde 2016, don de gentes excepcional y capacidad única para conectar con alumnos',
        en: 'Portrait of Yasmina Fernández, extraordinarily versatile Cuban Salsa, Lady Style, Sexy Style and Sexy Reggaeton instructor in Barcelona, certified in Farray® Method since 2016, exceptional people skills and unique ability to connect with students',
        ca: 'Retrat de Yasmina Fernández, professora extraordinàriament versàtil de Salsa Cubana, Lady Style, Sexy Style i Sexy Reggaeton a Barcelona, certificada en Mètode Farray® des de 2016, do de gents excepcional i capacitat única per connectar amb alumnes',
        fr: 'Portrait de Yasmina Fernández, professeure extraordinairement polyvalente de Salsa Cubaine, Lady Style, Sexy Style et Sexy Reggaeton à Barcelone, certifiée en Méthode Farray® depuis 2016, don exceptionnel avec les gens et capacité unique à se connecter avec les étudiants',
      },
    },
    'lia-valdes': {
      portrait: {
        es: 'Retrato de Lia Valdes, maestra internacional cubana de Salsa Cubana y Lady Style en Barcelona, formada en ENA Cuba, más de 20 años de carrera artística, presencia en El Rey León París, referente mundial que transmite sabor auténtico cubano',
        en: 'Portrait of Lia Valdes, Cuban international master of Cuban Salsa and Lady Style in Barcelona, trained at ENA Cuba, over 20 years of artistic career, presence in The Lion King Paris, world reference transmitting authentic Cuban flavor',
        ca: 'Retrat de Lia Valdes, mestra internacional cubana de Salsa Cubana i Lady Style a Barcelona, formada a ENA Cuba, més de 20 anys de carrera artística, presència a El Rei Lleó París, referent mundial que transmet sabor autèntic cubà',
        fr: "Portrait de Lia Valdes, maître internationale cubaine de Salsa Cubaine et Lady Style à Barcelone, formée à l'ENA Cuba, plus de 20 ans de carrière artistique, présence dans Le Roi Lion Paris, référence mondiale transmettant la saveur cubaine authentique",
      },
    },
    'iroel-bastarreche': {
      portrait: {
        es: 'Retrato de Iroel Bastarreche, profesor de Salsa Cubana en Barcelona formado en Ballet Folklórico de Camagüey Cuba, certificado en Método Farray®, especialista en folklore campesino y danzas afrocubanas, considerado uno de los referentes en enseñanza de estilos cubanos en Barcelona',
        en: 'Portrait of Iroel Bastarreche, Cuban Salsa instructor in Barcelona trained at Camagüey Folkloric Ballet Cuba, certified in Farray® Method, specialist in peasant folklore and Afro-Cuban dances, considered one of the references in teaching Cuban styles in Barcelona',
        ca: "Retrat d'Iroel Bastarreche, professor de Salsa Cubana a Barcelona format al Ballet Folklòric de Camagüey Cuba, certificat en Mètode Farray®, especialista en folklore camperol i danses afrocubanes, considerat un dels referents en ensenyament d'estils cubans a Barcelona",
        fr: "Portrait d'Iroel Bastarreche, professeur de Salsa Cubaine à Barcelone formé au Ballet Folklorique de Camagüey Cuba, certifié en Méthode Farray®, spécialiste en folklore paysan et danses afro-cubaines, considéré comme l'une des références en enseignement de styles cubains à Barcelone",
      },
    },
    'charlie-breezy': {
      portrait: {
        es: 'Retrato de Charlie Breezy, maestro internacional cubano de Afro Contemporáneo, Hip Hop y Afrobeats en Barcelona, formado en prestigiosa ENA Cuba, especialista en danzas africanas con versatilidad excepcional en contemporáneo, ballet y danzas urbanas, formación académica de élite',
        en: 'Portrait of Charlie Breezy, Cuban international master of Afro Contemporary, Hip Hop and Afrobeats in Barcelona, trained at prestigious ENA Cuba, specialist in African dances with exceptional versatility in contemporary, ballet and urban dances, elite academic training',
        ca: "Retrat de Charlie Breezy, mestre internacional cubà d'Afro Contemporani, Hip Hop i Afrobeats a Barcelona, format a prestigiosa ENA Cuba, especialista en danses africanes amb versatilitat excepcional en contemporani, ballet i danses urbanes, formació acadèmica d'elit",
        fr: "Portrait de Charlie Breezy, maître international cubain d'Afro Contemporain, Hip Hop et Afrobeats à Barcelone, formé à la prestigieuse ENA Cuba, spécialiste en danses africaines avec polyvalence exceptionnelle en contemporain, ballet et danses urbaines, formation académique d'élite",
      },
    },
    'eugenia-trujillo': {
      portrait: {
        es: "Retrato de Eugenia Trujillo, maestra internacional uruguaya de Bachata Lady Style y en Pareja en Barcelona, campeona mundial de Salsa LA junto a Mathias Font, profesora en Farray's desde hace 4 años, técnica impecable con carisma y cercanía excepcionales",
        en: "Portrait of Eugenia Trujillo, Uruguayan international master of Bachata Lady Style and Partner in Barcelona, world champion of Salsa LA with Mathias Font, instructor at Farray's for 4 years, impeccable technique with exceptional charisma and warmth",
        ca: "Retrat d'Eugenia Trujillo, mestra internacional uruguaiana de Bachata Lady Style i en Parella a Barcelona, campiona mundial de Salsa LA amb Mathias Font, professora a Farray's des de fa 4 anys, tècnica impecable amb carisma i proximitat excepcionals",
        fr: "Portrait d'Eugenia Trujillo, maître internationale uruguayenne de Bachata Lady Style et en Couple à Barcelone, championne mondiale de Salsa LA avec Mathias Font, professeure chez Farray's depuis 4 ans, technique impeccable avec charisme et chaleur exceptionnels",
      },
    },
    'mathias-font': {
      portrait: {
        es: 'Retrato de Mathias Font, instructor especializado en Bachata Sensual en Barcelona, campeón mundial de Salsa LA junto a Eugenia Trujillo, enfoque único en musicalidad y conexión en pareja, referente en la escena latina de Barcelona, dinamización excepcional de clases',
        en: 'Portrait of Mathias Font, specialized Sensual Bachata instructor in Barcelona, world champion of Salsa LA with Eugenia Trujillo, unique focus on musicality and partner connection, reference in Barcelona Latin scene, exceptional class dynamization',
        ca: "Retrat de Mathias Font, instructor especialitzat en Bachata Sensual a Barcelona, campió mundial de Salsa LA amb Eugenia Trujillo, enfocament únic en musicalitat i connexió en parella, referent a l'escena llatina de Barcelona, dinamització excepcional de classes",
        fr: 'Portrait de Mathias Font, instructeur spécialisé en Bachata Sensual à Barcelone, champion mondial de Salsa LA avec Eugenia Trujillo, focus unique sur la musicalité et connexion en couple, référence dans la scène latine de Barcelone, dynamisation exceptionnelle des cours',
      },
    },
    'carlos-canto': {
      portrait: {
        es: 'Retrato de Carlos Canto, instructor de Bachata y Bachata Moderna en Barcelona, talento emergente con don de gentes excepcional, enfoque en técnica y musicalidad, estilo fresco y accesible que lo convierte en uno de los profesores más queridos por sus alumnos',
        en: 'Portrait of Carlos Canto, Bachata and Modern Bachata instructor in Barcelona, emerging talent with exceptional people skills, focus on technique and musicality, fresh and accessible style making him one of the most beloved teachers by his students',
        ca: 'Retrat de Carlos Canto, instructor de Bachata i Bachata Moderna a Barcelona, talent emergent amb do de gents excepcional, enfocament en tècnica i musicalitat, estil fresc i accessible que el converteix en un dels professors més estimats pels seus alumnes',
        fr: "Portrait de Carlos Canto, instructeur de Bachata et Bachata Moderne à Barcelone, talent émergent avec don exceptionnel avec les gens, focus sur technique et musicalité, style frais et accessible en faisant l'un des professeurs les plus aimés par ses étudiants",
      },
    },
    noemi: {
      portrait: {
        es: "Retrato de Noemi, instructora de Bachata y Bachata Lady Style en Barcelona, talento emergente en quien Farray's apostó fuerte, pareja de Carlos Canto, especialista en técnicas femeninas con don de gentes que convierte alumnos en fans fieles desde el primer día",
        en: "Portrait of Noemi, Bachata and Bachata Lady Style instructor in Barcelona, emerging talent in whom Farray's bet strongly, partner of Carlos Canto, specialist in feminine techniques with people skills turning students into loyal fans from day one",
        ca: "Retrat de Noemi, instructora de Bachata i Bachata Lady Style a Barcelona, talent emergent en qui Farray's va apostar fort, parella de Carlos Canto, especialista en tècniques femenines amb do de gents que converteix alumnes en fans fidels des del primer dia",
        fr: "Portrait de Noemi, instructrice de Bachata et Bachata Lady Style à Barcelone, talent émergent en qui Farray's a fortement misé, partenaire de Carlos Canto, spécialiste en techniques féminines avec don pour transformer étudiants en fans fidèles dès le premier jour",
      },
    },
    redbhlue: {
      portrait: {
        es: 'Retrato de Redbhlue, profesor internacional nativo de Tanzania especialista en Afrobeats y Ntcham en Barcelona, raíces africanas auténticas con conocimientos profundos, energía y alegría contagiante, uno de los maestros más recomendados de Barcelona con autenticidad africana en cada movimiento',
        en: 'Portrait of Redbhlue, international instructor native of Tanzania specialist in Afrobeats and Ntcham in Barcelona, authentic African roots with deep knowledge, contagious energy and joy, one of the most recommended masters in Barcelona with African authenticity in every movement',
        ca: 'Retrat de Redbhlue, professor internacional natiu de Tanzània especialista en Afrobeats i Ntcham a Barcelona, arrels africanes autèntiques amb coneixements profunds, energia i alegria contagiosa, un dels mestres més recomanats de Barcelona amb autenticitat africana a cada moviment',
        fr: "Portrait de Redbhlue, professeur international natif de Tanzanie spécialiste en Afrobeats et Ntcham à Barcelone, racines africaines authentiques avec connaissances profondes, énergie et joie contagieuses, l'un des maîtres les plus recommandés de Barcelone avec authenticité africaine dans chaque mouvement",
      },
    },
    'juan-alvarez': {
      portrait: {
        es: 'Retrato de Juan Alvarez, instructor de Bachata Sensual en Barcelona certificado en Método Farray®, talento emergente que transmite esencia del baile latino con pasión, técnica depurada, conexión y musicalidad excepcionales, enfoque práctico y cercano que facilita aprendizaje desde el primer día',
        en: 'Portrait of Juan Alvarez, Sensual Bachata instructor in Barcelona certified in Farray® Method, emerging talent transmitting essence of Latin dance with passion, refined technique, exceptional connection and musicality, practical and close approach facilitating learning from day one',
        ca: 'Retrat de Juan Alvarez, instructor de Bachata Sensual a Barcelona certificat en Mètode Farray®, talent emergent que transmet essència del ball llatí amb passió, tècnica depurada, connexió i musicalitat excepcionals, enfocament pràctic i proper que facilita aprenentatge des del primer dia',
        fr: "Portrait de Juan Alvarez, instructeur de Bachata Sensual à Barcelone certifié en Méthode Farray®, talent émergent transmettant l'essence de la danse latine avec passion, technique raffinée, connexion et musicalité exceptionnelles, approche pratique et proche facilitant l'apprentissage dès le premier jour",
      },
    },
    crisag: {
      portrait: {
        es: 'Retrato de CrisAg, instructora especializada en Body Conditioning, Cuerpo Fit, Bum Bum Glúteos y Stretching en Barcelona, certificada en Método Farray® desde 2012, formación en The Cuban School of Arts Londres, referente en fusión de baile y fitness que combina dos pasiones con metodología única',
        en: 'Portrait of CrisAg, specialized instructor in Body Conditioning, Cuerpo Fit, Bum Bum Glutes and Stretching in Barcelona, certified in Farray® Method since 2012, training at The Cuban School of Arts London, reference in dance and fitness fusion combining two passions with unique methodology',
        ca: 'Retrat de CrisAg, instructora especialitzada en Body Conditioning, Cuerpo Fit, Bum Bum Glutis i Stretching a Barcelona, certificada en Mètode Farray® des de 2012, formació a The Cuban School of Arts Londres, referent en fusió de ball i fitness que combina dues passions amb metodologia única',
        fr: 'Portrait de CrisAg, instructrice spécialisée en Body Conditioning, Cuerpo Fit, Bum Bum Fessiers et Stretching à Barcelone, certifiée en Méthode Farray® depuis 2012, formation à The Cuban School of Arts Londres, référence en fusion de danse et fitness combinant deux passions avec méthodologie unique',
      },
    },
    'grechen-mendez': {
      portrait: {
        es: 'Retrato de Grechén Méndez, maestra internacional de referencia en danzas afrocubanas en Barcelona con más de 25 años de experiencia, formada en ISA Cuba, especialista en danzas a los Orishas, rumba y folklore cubano, autoridad reconocida mundialmente en patrimonio afrocubano con profundo significado espiritual',
        en: 'Portrait of Grechén Méndez, international reference master in Afro-Cuban dances in Barcelona with over 25 years of experience, trained at ISA Cuba, specialist in dances to Orishas, rumba and Cuban folklore, worldwide recognized authority in Afro-Cuban heritage with deep spiritual meaning',
        ca: "Retrat de Grechén Méndez, mestra internacional de referència en danses afrocubanes a Barcelona amb més de 25 anys d'experiència, formada a ISA Cuba, especialista en danses als Orishas, rumba i folklore cubà, autoritat reconeguda mundialment en patrimoni afrocubà amb profund significat espiritual",
        fr: "Portrait de Grechén Méndez, maître internationale de référence en danses afro-cubaines à Barcelone avec plus de 25 ans d'expérience, formée à l'ISA Cuba, spécialiste en danses aux Orishas, rumba et folklore cubain, autorité reconnue mondialement en patrimoine afro-cubain avec profonde signification spirituelle",
      },
    },
    default: {
      portrait: {
        es: "Profesor de baile en Farray's International Dance Center Barcelona",
        en: "Dance instructor at Farray's International Dance Center Barcelona",
        ca: "Professor de ball a Farray's International Dance Center Barcelona",
        fr: "Professeur de danse à Farray's International Dance Center Barcelone",
      },
    },
  },

  // ==========================================================================
  // GENERAL
  // ==========================================================================
  general: {
    logo: {
      es: "Farray's International Dance Center - Escuela de baile en Barcelona",
      en: "Farray's International Dance Center - Dance school in Barcelona",
      ca: "Farray's International Dance Center - Escola de ball a Barcelona",
      fr: "Farray's International Dance Center - École de danse à Barcelone",
    },
    hero: {
      es: "Academia de baile Farray's Center en Barcelona - Clases para todos los niveles",
      en: "Farray's Dance Academy in Barcelona - Classes for all levels",
      ca: "Acadèmia de ball Farray's Center a Barcelona - Classes per a tots els nivells",
      fr: "Académie de danse Farray's Center à Barcelone - Cours pour tous niveaux",
    },
    studio: {
      es: 'Sala de baile principal con espejos en Barcelona',
      en: 'Main dance studio with mirrors in Barcelona',
      ca: 'Sala de ball principal amb miralls a Barcelona',
      fr: 'Salle de danse principale avec miroirs à Barcelone',
    },
    facilities: {
      es: 'Instalaciones modernas de la academia de danza',
      en: 'Modern dance academy facilities',
      ca: "Instal·lacions modernes de l'acadèmia de dansa",
      fr: "Installations modernes de l'académie de danse",
    },

    // Brand logos
    brands: {
      cidUnesco: {
        es: 'CID UNESCO - Consejo Internacional de la Danza',
        en: 'CID UNESCO - International Dance Council',
        ca: 'CID UNESCO - Consell Internacional de la Dansa',
        fr: 'CID UNESCO - Conseil International de la Danse',
      },
      telecinco: {
        es: 'Telecinco - Cadena de televisión española',
        en: 'Telecinco - Spanish television network',
        ca: 'Telecinco - Cadena de televisió espanyola',
        fr: 'Telecinco - Chaîne de télévision espagnole',
      },
      gotTalent: {
        es: "Got Talent España - Aparición de Farray's Center",
        en: "Got Talent Spain - Farray's Center appearance",
        ca: "Got Talent Espanya - Aparició de Farray's Center",
        fr: "Got Talent Espagne - Apparition de Farray's Center",
      },
      theDancer: {
        es: "The Dancer TVE - Participación de bailarines de Farray's Center",
        en: "The Dancer TVE - Farray's Center dancers participation",
        ca: "The Dancer TVE - Participació de ballarins de Farray's Center",
        fr: "The Dancer TVE - Participation des danseurs de Farray's Center",
      },
    },

    // Open Graph images
    og: {
      home: {
        es: "Farray's Dance Center Barcelona - Escuela de baile urbano y latino",
        en: "Farray's Dance Center Barcelona - Urban and Latin dance school",
        ca: "Farray's Dance Center Barcelona - Escola de ball urbà i llatí",
        fr: "Farray's Dance Center Barcelone - École de danse urbaine et latine",
      },
      classes: {
        es: "Clases de baile en Barcelona - Farray's International Dance Center",
        en: "Dance classes in Barcelona - Farray's International Dance Center",
        ca: "Classes de ball a Barcelona - Farray's International Dance Center",
        fr: "Cours de danse à Barcelone - Farray's International Dance Center",
      },
    },
  },

  // ==========================================================================
  // BLOG
  // ==========================================================================
  blog: {
    'beneficios-bailar-salsa': {
      featured: {
        es: 'Beneficios de bailar salsa para la salud física y mental',
        en: 'Benefits of dancing salsa for physical and mental health',
        ca: 'Beneficis de ballar salsa per a la salut física i mental',
        fr: 'Bienfaits de danser la salsa pour la santé physique et mentale',
      },
    },
    'historia-salsa-barcelona': {
      featured: {
        es: 'Historia de la salsa en Barcelona - Evolución del baile latino',
        en: 'History of salsa in Barcelona - Evolution of Latin dance',
        ca: 'Història de la salsa a Barcelona - Evolució del ball llatí',
        fr: 'Histoire de la salsa à Barcelone - Évolution de la danse latine',
      },
    },
  },

  // ==========================================================================
  // STYLE IMAGES (for OptimizedImage component)
  // ==========================================================================
  styleImages: {
    dancehall: {
      alt: {
        es: "Clases de Dancehall en Barcelona - Aprende con profesionales en Farray's Center",
        en: "Dancehall Classes in Barcelona - Learn with professionals at Farray's Center",
        ca: "Classes de Dancehall a Barcelona - Aprèn amb professionals a Farray's Center",
        fr: "Cours de Dancehall à Barcelone - Apprenez avec des professionnels chez Farray's Center",
      },
      cardHub: {
        es: 'Dancehall Barcelona - Ritmos jamaicanos y movimientos auténticos del Caribe',
        en: 'Dancehall Barcelona - Jamaican rhythms and authentic Caribbean movements',
        ca: 'Dancehall Barcelona - Ritmes jamaicans i moviments autèntics del Carib',
        fr: 'Dancehall Barcelone - Rythmes jamaïcains et mouvements authentiques des Caraïbes',
      },
      cardUrban: {
        es: 'Dancehall - Estilo jamaicano con raíces en la cultura soundsystem de Kingston',
        en: 'Dancehall - Jamaican style rooted in Kingston soundsystem culture',
        ca: 'Dancehall - Estil jamaicà amb arrels en la cultura soundsystem de Kingston',
        fr: 'Dancehall - Style jamaïcain enraciné dans la culture soundsystem de Kingston',
      },
      hero: {
        es: "Bailarines ejecutando movimientos de Dancehall jamaicano en Barcelona - Farray's Center",
        en: "Dancers performing Jamaican Dancehall moves in Barcelona - Farray's Center",
        ca: "Ballarins executant moviments de Dancehall jamaicà a Barcelona - Farray's Center",
        fr: "Danseurs exécutant des mouvements de Dancehall jamaïcain à Barcelone - Farray's Center",
      },
    },
    afrobeat: {
      alt: {
        es: "Clases de Afrobeat en Barcelona - Ritmos africanos en Farray's Center",
        en: "Afrobeat Classes in Barcelona - African rhythms at Farray's Center",
        ca: "Classes d'Afrobeat a Barcelona - Ritmes africans a Farray's Center",
        fr: "Cours d'Afrobeat à Barcelone - Rythmes africains chez Farray's Center",
      },
      cardHub: {
        es: 'Afrobeat Barcelona - Ritmos africanos modernos con influencias de Nigeria y Ghana',
        en: 'Afrobeat Barcelona - Modern African rhythms with Nigerian and Ghanaian influences',
        ca: 'Afrobeat Barcelona - Ritmes africans moderns amb influències de Nigèria i Ghana',
        fr: 'Afrobeat Barcelone - Rythmes africains modernes avec influences du Nigeria et du Ghana',
      },
      cardUrban: {
        es: 'Afrobeat - Fusión de música africana contemporánea con movimientos tradicionales',
        en: 'Afrobeat - Fusion of contemporary African music with traditional movements',
        ca: 'Afrobeat - Fusió de música africana contemporània amb moviments tradicionals',
        fr: 'Afrobeat - Fusion de musique africaine contemporaine avec mouvements traditionnels',
      },
      hero: {
        es: "Bailarines ejecutando coreografía Afrobeat en Barcelona - Ritmos africanos en Farray's Center",
        en: "Dancers performing Afrobeat choreography in Barcelona - African rhythms at Farray's Center",
        ca: "Ballarins executant coreografia Afrobeat a Barcelona - Ritmes africans a Farray's Center",
        fr: "Danseurs exécutant une chorégraphie Afrobeat à Barcelone - Rythmes africains chez Farray's Center",
      },
    },
    twerk: {
      alt: {
        es: "Clases de Twerk en Barcelona - Empoderamiento y fitness en Farray's Center",
        en: "Twerk Classes in Barcelona - Empowerment and fitness at Farray's Center",
        ca: "Classes de Twerk a Barcelona - Apoderament i fitness a Farray's Center",
        fr: "Cours de Twerk à Barcelone - Empowerment et fitness chez Farray's Center",
      },
      cardHub: {
        es: 'Twerk Barcelona - Empoderamiento femenino y entrenamiento de glúteos',
        en: 'Twerk Barcelona - Female empowerment and glute training',
        ca: 'Twerk Barcelona - Apoderament femení i entrenament de glutis',
        fr: 'Twerk Barcelone - Empowerment féminin et entraînement des fessiers',
      },
      cardUrban: {
        es: 'Twerk - Estilo de empoderamiento con aislaciones de cadera y trabajo de glúteos',
        en: 'Twerk - Empowerment style with hip isolations and glute work',
        ca: "Twerk - Estil d'apoderament amb aïllacions de maluc i treball de glutis",
        fr: "Twerk - Style d'empowerment avec isolations de hanches et travail des fessiers",
      },
      hero: {
        es: "Alumnas practicando Twerk en Barcelona - Empoderamiento y fitness en Farray's Center",
        en: "Students practicing Twerk in Barcelona - Empowerment and fitness at Farray's Center",
        ca: "Alumnes practicant Twerk a Barcelona - Apoderament i fitness a Farray's Center",
        fr: "Élèves pratiquant le Twerk à Barcelone - Empowerment et fitness chez Farray's Center",
      },
    },
    hipHop: {
      // Alt genérico (fallback)
      alt: {
        es: "Clases de Hip Hop en Barcelona - Street dance en Farray's Center",
        en: "Hip Hop Classes in Barcelona - Street dance at Farray's Center",
        ca: "Classes de Hip Hop a Barcelona - Street dance a Farray's Center",
        fr: "Cours de Hip Hop à Barcelone - Street dance chez Farray's Center",
      },
      // Para cards en hub de clases de baile (/clases/baile-barcelona)
      cardHub: {
        es: 'Hip Hop en Barcelona - Aprende breaking, locking y popping con los mejores',
        en: 'Hip Hop in Barcelona - Learn breaking, locking and popping with the best',
        ca: 'Hip Hop a Barcelona - Aprèn breaking, locking i popping amb els millors',
        fr: 'Hip Hop à Barcelone - Apprenez le breaking, locking et popping avec les meilleurs',
      },
      // Para cards en categoría urbana (/clases/danzas-urbanas-barcelona)
      cardUrban: {
        es: 'Hip Hop - Estilo urbano con raíces en la cultura callejera de Nueva York',
        en: 'Hip Hop - Urban style rooted in New York street culture',
        ca: 'Hip Hop - Estil urbà amb arrels en la cultura del carrer de Nova York',
        fr: 'Hip Hop - Style urbain enraciné dans la culture de rue de New York',
      },
    },
    hipHopReggaeton: {
      alt: {
        es: "Clases de Hip Hop y Reggaetón en Barcelona - Farray's Center",
        en: "Hip Hop and Reggaeton Classes in Barcelona - Farray's Center",
        ca: "Classes de Hip Hop i Reggaeton a Barcelona - Farray's Center",
        fr: "Cours de Hip Hop et Reggaeton à Barcelone - Farray's Center",
      },
      cardHub: {
        es: 'Hip Hop & Reggaetón Barcelona - Fusión de street dance y ritmos latinos urbanos',
        en: 'Hip Hop & Reggaeton Barcelona - Fusion of street dance and urban Latin rhythms',
        ca: 'Hip Hop & Reggaeton Barcelona - Fusió de street dance i ritmes llatins urbans',
        fr: 'Hip Hop & Reggaeton Barcelone - Fusion de street dance et rythmes latins urbains',
      },
      cardUrban: {
        es: 'Hip Hop & Reggaetón - Combinación explosiva de cultura urbana americana y latina',
        en: 'Hip Hop & Reggaeton - Explosive combination of American and Latin urban culture',
        ca: 'Hip Hop & Reggaeton - Combinació explosiva de cultura urbana americana i llatina',
        fr: 'Hip Hop & Reggaeton - Combinaison explosive de culture urbaine américaine et latine',
      },
      hero: {
        es: "Bailarines ejecutando coreografía de Hip Hop y Reggaetón en Barcelona - Farray's Center",
        en: "Dancers performing Hip Hop and Reggaeton choreography in Barcelona - Farray's Center",
        ca: "Ballarins executant coreografia de Hip Hop i Reggaeton a Barcelona - Farray's Center",
        fr: "Danseurs exécutant une chorégraphie Hip Hop et Reggaeton à Barcelone - Farray's Center",
      },
      whatIs: {
        es: 'Estudiantes practicando coreografía de Hip Hop y Reggaetón en academia de Barcelona',
        en: 'Students practicing Hip Hop and Reggaeton choreography at Barcelona dance academy',
        ca: 'Estudiants practicant coreografia de Hip Hop i Reggaeton a acadèmia de Barcelona',
        fr: 'Étudiants pratiquant une chorégraphie Hip Hop et Reggaeton à académie de Barcelone',
      },
    },
    sexyReggaeton: {
      alt: {
        es: "Clases de Sexy Reggaetón en Barcelona - Farray's Center",
        en: "Sexy Reggaeton Classes in Barcelona - Farray's Center",
        ca: "Classes de Sexy Reggaeton a Barcelona - Farray's Center",
        fr: "Cours de Sexy Reggaeton à Barcelone - Farray's Center",
      },
      cardHub: {
        es: 'Sexy Reggaetón Barcelona - Sensualidad y actitud con ritmos urbanos latinos',
        en: 'Sexy Reggaeton Barcelona - Sensuality and attitude with urban Latin rhythms',
        ca: 'Sexy Reggaeton Barcelona - Sensualitat i actitud amb ritmes urbans llatins',
        fr: 'Sexy Reggaeton Barcelone - Sensualité et attitude avec rythmes urbains latins',
      },
      cardUrban: {
        es: 'Sexy Reggaetón - Estilo sensual con movimientos de cadera y actitud femenina',
        en: 'Sexy Reggaeton - Sensual style with hip movements and feminine attitude',
        ca: 'Sexy Reggaeton - Estil sensual amb moviments de maluc i actitud femenina',
        fr: 'Sexy Reggaeton - Style sensuel avec mouvements de hanches et attitude féminine',
      },
      hero: {
        es: "Alumnas bailando Sexy Reggaetón en Barcelona - Sensualidad y ritmo en Farray's Center",
        en: "Students dancing Sexy Reggaeton in Barcelona - Sensuality and rhythm at Farray's Center",
        ca: "Alumnes ballant Sexy Reggaeton a Barcelona - Sensualitat i ritme a Farray's Center",
        fr: "Élèves dansant le Sexy Reggaeton à Barcelone - Sensualité et rythme chez Farray's Center",
      },
    },
    reggaetonCubano: {
      alt: {
        es: "Clases de Reggaetón Cubano en Barcelona - Farray's Center",
        en: "Cuban Reggaeton Classes in Barcelona - Farray's Center",
        ca: "Classes de Reggaeton Cubà a Barcelona - Farray's Center",
        fr: "Cours de Reggaeton Cubain à Barcelone - Farray's Center",
      },
      cardHub: {
        es: 'Reggaetón Cubano Barcelona - El sabor auténtico del Caribe con raíces cubanas',
        en: 'Cuban Reggaeton Barcelona - Authentic Caribbean flavor with Cuban roots',
        ca: 'Reggaeton Cubà Barcelona - El sabor autèntic del Carib amb arrels cubanes',
        fr: 'Reggaeton Cubain Barcelone - Saveur authentique des Caraïbes avec racines cubaines',
      },
      cardUrban: {
        es: 'Reggaetón Cubano - Estilo caribeño con influencias de timba y son cubano',
        en: 'Cuban Reggaeton - Caribbean style with timba and Cuban son influences',
        ca: 'Reggaeton Cubà - Estil caribeny amb influències de timba i son cubà',
        fr: 'Reggaeton Cubain - Style caribéen avec influences de timba et son cubain',
      },
      hero: {
        es: "Bailarines ejecutando Reggaetón Cubano en Barcelona - Sabor caribeño en Farray's Center",
        en: "Dancers performing Cuban Reggaeton in Barcelona - Caribbean flavor at Farray's Center",
        ca: "Ballarins executant Reggaeton Cubà a Barcelona - Sabor caribeny a Farray's Center",
        fr: "Danseurs exécutant le Reggaeton Cubain à Barcelone - Saveur caribéenne chez Farray's Center",
      },
    },
    femmology: {
      alt: {
        es: "Clases de Femmology y Heels en Barcelona - Farray's Center",
        en: "Femmology and Heels Classes in Barcelona - Farray's Center",
        ca: "Classes de Femmology i Heels a Barcelona - Farray's Center",
        fr: "Cours de Femmology et Heels à Barcelone - Farray's Center",
      },
      cardHub: {
        es: 'Femmology Barcelona - Baile en tacones con técnica y actitud de Yunaisy Farray',
        en: 'Femmology Barcelona - Heels dance with Yunaisy Farray technique and attitude',
        ca: 'Femmology Barcelona - Ball amb talons amb tècnica i actitud de Yunaisy Farray',
        fr: 'Femmology Barcelone - Danse en talons avec technique et attitude de Yunaisy Farray',
      },
      cardUrban: {
        es: 'Femmology - Método exclusivo de baile en tacones creado por Yunaisy Farray',
        en: 'Femmology - Exclusive heels dance method created by Yunaisy Farray',
        ca: 'Femmology - Mètode exclusiu de ball amb talons creat per Yunaisy Farray',
        fr: 'Femmology - Méthode exclusive de danse en talons créée par Yunaisy Farray',
      },
      hero: {
        es: 'Alumnas ejecutando técnica Femmology en tacones - Método Yunaisy Farray en Barcelona',
        en: 'Students performing Femmology technique in heels - Yunaisy Farray Method in Barcelona',
        ca: 'Alumnes executant tècnica Femmology amb talons - Mètode Yunaisy Farray a Barcelona',
        fr: 'Élèves exécutant la technique Femmology en talons - Méthode Yunaisy Farray à Barcelone',
      },
    },
    heels: {
      alt: {
        es: "Clases de Heels en Barcelona - Baile con tacones en Farray's Center",
        en: "Heels Classes in Barcelona - Dance in high heels at Farray's Center",
        ca: "Classes de Heels a Barcelona - Ball amb talons a Farray's Center",
        fr: "Cours de Heels à Barcelone - Danse en talons chez Farray's Center",
      },
      cardHub: {
        es: 'Heels Barcelona - Aprende a bailar con tacones con confianza y técnica',
        en: 'Heels Barcelona - Learn to dance in heels with confidence and technique',
        ca: 'Heels Barcelona - Aprèn a ballar amb talons amb confiança i tècnica',
        fr: 'Heels Barcelone - Apprenez à danser en talons avec confiance et technique',
      },
      cardUrban: {
        es: 'Heels - Baile con tacones que combina técnica, actitud y empoderamiento',
        en: 'Heels - High heels dancing combining technique, attitude and empowerment',
        ca: 'Heels - Ball amb talons que combina tècnica, actitud i apoderament',
        fr: 'Heels - Danse en talons combinant technique, attitude et empowerment',
      },
      hero: {
        es: "Bailarinas ejecutando coreografía Heels en Barcelona - Técnica y elegancia en Farray's Center",
        en: "Dancers performing Heels choreography in Barcelona - Technique and elegance at Farray's Center",
        ca: "Ballarines executant coreografia Heels a Barcelona - Tècnica i elegància a Farray's Center",
        fr: "Danseuses exécutant une chorégraphie Heels à Barcelone - Technique et élégance chez Farray's Center",
      },
    },
    sexyStyle: {
      alt: {
        es: "Clases de Sexy Style en Barcelona - Farray's Center",
        en: "Sexy Style Classes in Barcelona - Farray's Center",
        ca: "Classes de Sexy Style a Barcelona - Farray's Center",
        fr: "Cours de Sexy Style à Barcelone - Farray's Center",
      },
      cardHub: {
        es: 'Sexy Style Barcelona - Sensualidad, floorwork y expresión corporal femenina',
        en: 'Sexy Style Barcelona - Sensuality, floorwork and feminine body expression',
        ca: 'Sexy Style Barcelona - Sensualitat, floorwork i expressió corporal femenina',
        fr: 'Sexy Style Barcelone - Sensualité, floorwork et expression corporelle féminine',
      },
      cardUrban: {
        es: 'Sexy Style - Estilo sensual con técnicas de suelo, ondas y expresión corporal',
        en: 'Sexy Style - Sensual style with floor techniques, waves and body expression',
        ca: 'Sexy Style - Estil sensual amb tècniques de terra, ones i expressió corporal',
        fr: 'Sexy Style - Style sensuel avec techniques au sol, ondulations et expression corporelle',
      },
      hero: {
        es: "Alumnas ejecutando técnica Sexy Style en Barcelona - Sensualidad y expresión en Farray's Center",
        en: "Students performing Sexy Style technique in Barcelona - Sensuality and expression at Farray's Center",
        ca: "Alumnes executant tècnica Sexy Style a Barcelona - Sensualitat i expressió a Farray's Center",
        fr: "Élèves exécutant la technique Sexy Style à Barcelone - Sensualité et expression chez Farray's Center",
      },
    },
    ballet: {
      alt: {
        es: "Clases de Ballet Clásico en Barcelona - Técnica clásica en Farray's Center",
        en: "Classical Ballet Classes in Barcelona - Classical technique at Farray's Center",
        ca: "Classes de Ballet Clàssic a Barcelona - Tècnica clàssica a Farray's Center",
        fr: "Cours de Ballet Classique à Barcelone - Technique classique chez Farray's Center",
      },
      cardHub: {
        es: 'Ballet Clásico Barcelona - Técnica cubana ENA con profesores profesionales',
        en: 'Classical Ballet Barcelona - Cuban ENA technique with professional teachers',
        ca: 'Ballet Clàssic Barcelona - Tècnica cubana ENA amb professors professionals',
        fr: 'Ballet Classique Barcelone - Technique cubaine ENA avec professeurs professionnels',
      },
      cardDanza: {
        es: 'Ballet Clásico - Base técnica fundamental para todas las disciplinas de danza',
        en: 'Classical Ballet - Fundamental technical foundation for all dance disciplines',
        ca: 'Ballet Clàssic - Base tècnica fonamental per a totes les disciplines de dansa',
        fr: 'Ballet Classique - Base technique fondamentale pour toutes les disciplines de danse',
      },
      hero: {
        es: 'Bailarinas ejecutando técnica de ballet clásico en Barcelona - Método Farray con profesores cubanos ENA',
        en: 'Dancers performing classical ballet technique in Barcelona - Farray Method with Cuban ENA teachers',
        ca: 'Ballarines executant tècnica de ballet clàssic a Barcelona - Mètode Farray amb professors cubans ENA',
        fr: 'Danseuses exécutant la technique de ballet classique à Barcelone - Méthode Farray avec professeurs cubains ENA',
      },
      whatIs: {
        es: 'Estudiantes de ballet clásico practicando posiciones en la barra en academia de Barcelona',
        en: 'Classical ballet students practicing positions at the barre in Barcelona dance academy',
        ca: 'Estudiants de ballet clàssic practicant posicions a la barra a acadèmia de Barcelona',
        fr: 'Étudiants de ballet classique pratiquant les positions à la barre à académie de Barcelone',
      },
    },
    contemporaneo: {
      // Alt genérico (fallback)
      alt: {
        es: "Clases de Danza Contemporánea en Barcelona - Técnica profesional en Farray's Center",
        en: "Contemporary Dance Classes in Barcelona - Professional technique at Farray's Center",
        ca: "Classes de Dansa Contemporània a Barcelona - Tècnica professional a Farray's Center",
        fr: "Cours de Danse Contemporaine à Barcelone - Technique professionnelle chez Farray's Center",
      },
      // Para cards en hub de clases de baile (/clases/baile-barcelona)
      cardHub: {
        es: 'Danza Contemporánea Barcelona - Expresión corporal y técnica de suelo con profesores cubanos',
        en: 'Contemporary Dance Barcelona - Body expression and floor technique with Cuban teachers',
        ca: 'Dansa Contemporània Barcelona - Expressió corporal i tècnica de terra amb professors cubans',
        fr: 'Danse Contemporaine Barcelone - Expression corporelle et technique au sol avec professeurs cubains',
      },
      // Para cards en categoría danza (/clases/danza-barcelona)
      cardDanza: {
        es: 'Danza Contemporánea - Técnica release, improvisación y expresión corporal libre',
        en: 'Contemporary Dance - Release technique, improvisation and free body expression',
        ca: 'Dansa Contemporània - Tècnica release, improvisació i expressió corporal lliure',
        fr: 'Danse Contemporaine - Technique release, improvisation et expression corporelle libre',
      },
      // Para hero de la página de clase
      hero: {
        es: 'Bailarines ejecutando técnica de danza contemporánea en Barcelona - Método Farray con profesores cubanos ENA',
        en: 'Dancers performing contemporary dance technique in Barcelona - Farray Method with Cuban ENA teachers',
        ca: 'Ballarins executant tècnica de dansa contemporània a Barcelona - Mètode Farray amb professors cubans ENA',
        fr: 'Danseurs exécutant la technique de danse contemporaine à Barcelone - Méthode Farray avec professeurs cubains ENA',
      },
    },
    modernJazz: {
      alt: {
        es: "Clases de Modern Jazz en Barcelona - Farray's Center",
        en: "Modern Jazz Classes in Barcelona - Farray's Center",
        ca: "Classes de Modern Jazz a Barcelona - Farray's Center",
        fr: "Cours de Modern Jazz à Barcelone - Farray's Center",
      },
      cardHub: {
        es: 'Modern Jazz Barcelona - Técnica dinámica con influencias Broadway y contemporáneas',
        en: 'Modern Jazz Barcelona - Dynamic technique with Broadway and contemporary influences',
        ca: 'Modern Jazz Barcelona - Tècnica dinàmica amb influències Broadway i contemporànies',
        fr: 'Modern Jazz Barcelone - Technique dynamique avec influences Broadway et contemporaines',
      },
      cardDanza: {
        es: 'Modern Jazz - Estilo versátil que combina técnica clásica con libertad expresiva moderna',
        en: 'Modern Jazz - Versatile style combining classical technique with modern expressive freedom',
        ca: 'Modern Jazz - Estil versàtil que combina tècnica clàssica amb llibertat expressiva moderna',
        fr: 'Modern Jazz - Style polyvalent combinant technique classique et liberté expressive moderne',
      },
      hero: {
        es: "Bailarines ejecutando coreografía de Modern Jazz en Barcelona - Técnica profesional en Farray's Center",
        en: "Dancers performing Modern Jazz choreography in Barcelona - Professional technique at Farray's Center",
        ca: "Ballarins executant coreografia de Modern Jazz a Barcelona - Tècnica professional a Farray's Center",
        fr: "Danseurs exécutant une chorégraphie de Modern Jazz à Barcelone - Technique professionnelle chez Farray's Center",
      },
    },
    afroContemporaneo: {
      // Alt genérico (fallback)
      alt: {
        es: "Clases de Afro Contemporáneo en Barcelona - Técnica cubana ENA en Farray's Center",
        en: "Afro Contemporary Classes in Barcelona - Cuban ENA technique at Farray's Center",
        ca: "Classes d'Afro Contemporani a Barcelona - Tècnica cubana ENA a Farray's Center",
        fr: "Cours d'Afro Contemporain à Barcelone - Technique cubaine ENA chez Farray's Center",
      },
      // Para cards en hub de clases de baile (/clases/baile-barcelona)
      cardHub: {
        es: 'Afro Contemporáneo Barcelona - Fusión de técnica ENA cubana con danza contemporánea',
        en: 'Afro Contemporary Barcelona - Fusion of Cuban ENA technique with contemporary dance',
        ca: 'Afro Contemporani Barcelona - Fusió de tècnica ENA cubana amb dansa contemporània',
        fr: 'Afro Contemporain Barcelone - Fusion de technique ENA cubaine avec danse contemporaine',
      },
      // Para cards en categoría danza (/clases/danza-barcelona)
      cardDanza: {
        es: 'Afro Contemporáneo - Técnica cubana ENA que fusiona raíces africanas con danza contemporánea',
        en: 'Afro Contemporary - Cuban ENA technique fusing African roots with contemporary dance',
        ca: 'Afro Contemporani - Tècnica cubana ENA que fusiona arrels africanes amb dansa contemporània',
        fr: 'Afro Contemporain - Technique cubaine ENA fusionnant racines africaines et danse contemporaine',
      },
      // Para hero de la página de clase
      hero: {
        es: "Bailarines ejecutando técnica Afro Contemporánea cubana ENA en Barcelona - Farray's Center",
        en: "Dancers performing Cuban Afro Contemporary ENA technique in Barcelona - Farray's Center",
        ca: "Ballarins executant tècnica Afro Contemporània cubana ENA a Barcelona - Farray's Center",
        fr: "Danseurs exécutant la technique Afro Contemporaine cubaine ENA à Barcelone - Farray's Center",
      },
    },
    afroJazz: {
      alt: {
        es: "Clases de Afro Jazz en Barcelona - Farray's Center",
        en: "Afro Jazz Classes in Barcelona - Farray's Center",
        ca: "Classes d'Afro Jazz a Barcelona - Farray's Center",
        fr: "Cours d'Afro Jazz à Barcelone - Farray's Center",
      },
      cardHub: {
        es: 'Afro Jazz Barcelona - Fusión de danza africana y jazz contemporáneo con profesores cubanos',
        en: 'Afro Jazz Barcelona - Fusion of African dance and contemporary jazz with Cuban teachers',
        ca: 'Afro Jazz Barcelona - Fusió de dansa africana i jazz contemporani amb professors cubans',
        fr: 'Afro Jazz Barcelone - Fusion de danse africaine et jazz contemporain avec professeurs cubains',
      },
      cardDanza: {
        es: 'Afro Jazz - Técnica que fusiona ritmos africanos con expresión corporal del jazz moderno',
        en: 'Afro Jazz - Technique fusing African rhythms with modern jazz body expression',
        ca: 'Afro Jazz - Tècnica que fusiona ritmes africans amb expressió corporal del jazz modern',
        fr: 'Afro Jazz - Technique fusionnant rythmes africains et expression corporelle du jazz moderne',
      },
      hero: {
        es: "Bailarines ejecutando técnica Afro Jazz en Barcelona - Fusión africana y jazz en Farray's Center",
        en: "Dancers performing Afro Jazz technique in Barcelona - African and jazz fusion at Farray's Center",
        ca: "Ballarins executant tècnica Afro Jazz a Barcelona - Fusió africana i jazz a Farray's Center",
        fr: "Danseurs exécutant la technique Afro Jazz à Barcelone - Fusion africaine et jazz chez Farray's Center",
      },
    },
    salsaCubana: {
      alt: {
        es: "Clases de Salsa Cubana en Barcelona - Farray's Center",
        en: "Cuban Salsa Classes in Barcelona - Farray's Center",
        ca: "Classes de Salsa Cubana a Barcelona - Farray's Center",
        fr: "Cours de Salsa Cubaine à Barcelone - Farray's Center",
      },
      cardHub: {
        es: 'Salsa Cubana Barcelona - Aprende casino, rueda y estilo cubano auténtico',
        en: 'Cuban Salsa Barcelona - Learn casino, rueda and authentic Cuban style',
        ca: 'Salsa Cubana Barcelona - Aprèn casino, rueda i estil cubà autèntic',
        fr: 'Salsa Cubaine Barcelone - Apprenez casino, rueda et style cubain authentique',
      },
      cardLatin: {
        es: 'Salsa Cubana - Estilo casino con rueda, despelote y sabor habanero auténtico',
        en: 'Cuban Salsa - Casino style with rueda, despelote and authentic Havana flavor',
        ca: 'Salsa Cubana - Estil casino amb rueda, despelote i sabor havanès autèntic',
        fr: 'Salsa Cubaine - Style casino avec rueda, despelote et saveur havanaise authentique',
      },
      hero: {
        es: "Parejas bailando Salsa Cubana en Barcelona - Estilo casino en Farray's Center",
        en: "Couples dancing Cuban Salsa in Barcelona - Casino style at Farray's Center",
        ca: "Parelles ballant Salsa Cubana a Barcelona - Estil casino a Farray's Center",
        fr: "Couples dansant la Salsa Cubaine à Barcelone - Style casino chez Farray's Center",
      },
    },
    bachata: {
      alt: {
        es: "Clases de Bachata Sensual en Barcelona - Conexión y musicalidad en Farray's Center",
        en: "Sensual Bachata Classes in Barcelona - Connection and musicality at Farray's Center",
        ca: "Classes de Bachata Sensual a Barcelona - Connexió i musicalitat a Farray's Center",
        fr: "Cours de Bachata Sensuelle à Barcelone - Connexion et musicalité chez Farray's Center",
      },
      cardHub: {
        es: "Pareja bailando bachata sensual en Barcelona - Aprende en Farray's Center",
        en: "Couple dancing sensual bachata in Barcelona - Learn at Farray's Center",
        ca: "Parella ballant bachata sensual a Barcelona - Aprèn a Farray's Center",
        fr: "Couple dansant la bachata sensuelle à Barcelone - Apprenez chez Farray's Center",
      },
      cardLatin: {
        es: 'Clases de Bachata Sensual - Conexión, musicalidad y técnica dominicana',
        en: 'Sensual Bachata Classes - Connection, musicality and Dominican technique',
        ca: 'Classes de Bachata Sensual - Connexió, musicalitat i tècnica dominicana',
        fr: 'Cours de Bachata Sensuelle - Connexion, musicalité et technique dominicaine',
      },
      hero: {
        es: 'Bailarines de bachata sensual ejecutando figuras en Barcelona - Método Farray',
        en: 'Sensual bachata dancers performing figures in Barcelona - Farray Method',
        ca: 'Ballarins de bachata sensual executant figures a Barcelona - Mètode Farray',
        fr: 'Danseurs de bachata sensuelle exécutant des figures à Barcelone - Méthode Farray',
      },
      // Para sección "¿Qué es?" de la página de clase
      whatIs: {
        es: 'Pareja bailando bachata sensual en clase de Barcelona - conexión, ondulaciones y técnica profesional',
        en: 'Couple dancing sensual bachata in Barcelona class - connection, waves and professional technique',
        ca: 'Parella ballant bachata sensual a classe de Barcelona - connexió, ondulacions i tècnica professional',
        fr: 'Couple dansant la bachata sensuelle en cours à Barcelone - connexion, ondulations et technique professionnelle',
      },
    },
    salsaBachata: {
      alt: {
        es: "Clases de Salsa y Bachata en Barcelona - Farray's Center",
        en: "Salsa and Bachata Classes in Barcelona - Farray's Center",
        ca: "Classes de Salsa i Bachata a Barcelona - Farray's Center",
        fr: "Cours de Salsa et Bachata à Barcelone - Farray's Center",
      },
      cardHub: {
        es: 'Salsa y Bachata Barcelona - Aprende los bailes latinos más populares',
        en: 'Salsa and Bachata Barcelona - Learn the most popular Latin dances',
        ca: 'Salsa i Bachata Barcelona - Aprèn els balls llatins més populars',
        fr: 'Salsa et Bachata Barcelone - Apprenez les danses latines les plus populaires',
      },
      cardLatin: {
        es: 'Salsa y Bachata - Combinación perfecta de ritmos cubanos y dominicanos',
        en: 'Salsa and Bachata - Perfect combination of Cuban and Dominican rhythms',
        ca: 'Salsa i Bachata - Combinació perfecta de ritmes cubans i dominicans',
        fr: 'Salsa et Bachata - Combinaison parfaite de rythmes cubains et dominicains',
      },
      hero: {
        es: "Parejas bailando Salsa y Bachata en Barcelona - Ritmos latinos en Farray's Center",
        en: "Couples dancing Salsa and Bachata in Barcelona - Latin rhythms at Farray's Center",
        ca: "Parelles ballant Salsa i Bachata a Barcelona - Ritmes llatins a Farray's Center",
        fr: "Couples dansant la Salsa et Bachata à Barcelone - Rythmes latins chez Farray's Center",
      },
      // Hero de página de categoría - SEO/GEO optimizado (15-25 palabras)
      pageHero: {
        es: "Parejas bailando salsa cubana y bachata sensual en academia de Barcelona - Profesores cubanos, Método Farray exclusivo y ambiente social vibrante en Farray's Center",
        en: "Couples dancing Cuban salsa and sensual bachata at Barcelona dance academy - Cuban instructors, exclusive Farray Method and vibrant social atmosphere at Farray's Center",
        ca: "Parelles ballant salsa cubana i bachata sensual a acadèmia de Barcelona - Professors cubans, Mètode Farray exclusiu i ambient social vibrant a Farray's Center",
        fr: "Couples dansant la salsa cubaine et bachata sensuelle à académie de Barcelone - Professeurs cubains, Méthode Farray exclusive et ambiance sociale vibrante chez Farray's Center",
      },
    },
    salsaLadyStyle: {
      alt: {
        es: "Clases de Salsa Lady Style en Barcelona - Técnica femenina y styling en Farray's Center",
        en: "Salsa Lady Style Classes in Barcelona - Feminine technique and styling at Farray's Center",
        ca: "Classes de Salsa Lady Style a Barcelona - Tècnica femenina i styling a Farray's Center",
        fr: "Cours de Salsa Lady Style à Barcelone - Technique féminine et styling chez Farray's Center",
      },
      cardHub: {
        es: 'Salsa Lady Style Barcelona - Técnica femenina cubana, braceo elegante y expresión corporal',
        en: 'Salsa Lady Style Barcelona - Cuban feminine technique, elegant arm styling and body expression',
        ca: 'Salsa Lady Style Barcelona - Tècnica femenina cubana, braceo elegant i expressió corporal',
        fr: 'Salsa Lady Style Barcelone - Technique féminine cubaine, braceo élégant et expression corporelle',
      },
      cardLatin: {
        es: 'Salsa Lady Style - Movimientos femeninos, giros elegantes y actitud sensual con Método Farray',
        en: 'Salsa Lady Style - Feminine movements, elegant spins and sensual attitude with Farray Method',
        ca: 'Salsa Lady Style - Moviments femenins, girs elegants i actitud sensual amb Mètode Farray',
        fr: 'Salsa Lady Style - Mouvements féminins, tours élégants et attitude sensuelle avec Méthode Farray',
      },
      hero: {
        es: "Bailarinas ejecutando Salsa Lady Style en Barcelona - Técnica femenina cubana y braceo elegante en Farray's Center",
        en: "Dancers performing Salsa Lady Style in Barcelona - Cuban feminine technique and elegant arm styling at Farray's Center",
        ca: "Ballarines executant Salsa Lady Style a Barcelona - Tècnica femenina cubana i braceo elegant a Farray's Center",
        fr: "Danseuses exécutant le Salsa Lady Style à Barcelone - Technique féminine cubaine et braceo élégant chez Farray's Center",
      },
      whatIs: {
        es: 'Alumnas practicando técnica de Salsa Lady Style con braceo y movimientos femeninos en academia de Barcelona',
        en: 'Students practicing Salsa Lady Style technique with arm styling and feminine movements at Barcelona dance academy',
        ca: 'Alumnes practicant tècnica de Salsa Lady Style amb braceo i moviments femenins a acadèmia de Barcelona',
        fr: 'Élèves pratiquant la technique Salsa Lady Style avec braceo et mouvements féminins à académie de Barcelone',
      },
    },
    bachataLadyStyle: {
      alt: {
        es: "Clases de Bachata Lady Style en Barcelona - Farray's Center",
        en: "Bachata Lady Style Classes in Barcelona - Farray's Center",
        ca: "Classes de Bachata Lady Style a Barcelona - Farray's Center",
        fr: "Cours de Bachata Lady Style à Barcelone - Farray's Center",
      },
      cardHub: {
        es: 'Bachata Lady Style Barcelona - Ondas, styling y sensualidad femenina',
        en: 'Bachata Lady Style Barcelona - Waves, styling and feminine sensuality',
        ca: 'Bachata Lady Style Barcelona - Ones, styling i sensualitat femenina',
        fr: 'Bachata Lady Style Barcelone - Ondulations, styling et sensualité féminine',
      },
      cardLatin: {
        es: 'Bachata Lady Style - Movimientos sensuales, ondas y expresión corporal femenina',
        en: 'Bachata Lady Style - Sensual movements, waves and feminine body expression',
        ca: 'Bachata Lady Style - Moviments sensuals, ones i expressió corporal femenina',
        fr: 'Bachata Lady Style - Mouvements sensuels, ondulations et expression corporelle féminine',
      },
      hero: {
        es: "Bailarinas ejecutando Bachata Lady Style en Barcelona - Sensualidad en Farray's Center",
        en: "Dancers performing Bachata Lady Style in Barcelona - Sensuality at Farray's Center",
        ca: "Ballarines executant Bachata Lady Style a Barcelona - Sensualitat a Farray's Center",
        fr: "Danseuses exécutant le Bachata Lady Style à Barcelone - Sensualité chez Farray's Center",
      },
    },
    timba: {
      // Alt genérico (fallback)
      alt: {
        es: "Clases de Timba Cubana en Barcelona - Farray's Center",
        en: "Cuban Timba Classes in Barcelona - Farray's Center",
        ca: "Classes de Timba Cubana a Barcelona - Farray's Center",
        fr: "Cours de Timba Cubaine à Barcelone - Farray's Center",
      },
      // Para cards en hub de clases de baile (/clases/baile-barcelona)
      cardHub: {
        es: 'Timba Cubana Barcelona - Ritmo explosivo con raíces del son y jazz afrocubano',
        en: 'Cuban Timba Barcelona - Explosive rhythm with son and Afro-Cuban jazz roots',
        ca: 'Timba Cubana Barcelona - Ritme explosiu amb arrels del son i jazz afrocubà',
        fr: 'Timba Cubaine Barcelone - Rythme explosif avec racines du son et jazz afro-cubain',
      },
      // Para cards en categoría salsa/bachata (/clases/salsa-bachata-barcelona)
      cardLatin: {
        es: 'Timba Cubana - Ritmo urbano cubano que fusiona son, jazz y música popular',
        en: 'Cuban Timba - Cuban urban rhythm fusing son, jazz and popular music',
        ca: 'Timba Cubana - Ritme urbà cubà que fusiona son, jazz i música popular',
        fr: 'Timba Cubaine - Rythme urbain cubain fusionnant son, jazz et musique populaire',
      },
      // Para hero de la página de clase individual
      hero: {
        es: "Bailarines ejecutando Timba Cubana en Barcelona - Ritmo explosivo en Farray's Center",
        en: "Dancers performing Cuban Timba in Barcelona - Explosive rhythm at Farray's Center",
        ca: "Ballarins executant Timba Cubana a Barcelona - Ritme explosiu a Farray's Center",
        fr: "Danseurs exécutant la Timba Cubaine à Barcelone - Rythme explosif chez Farray's Center",
      },
      // Para sección "¿Qué es?" de la página de clase
      whatIs: {
        es: 'Bailarines practicando Timba Cubana y Lady Timba en academia de Barcelona - Interpretación musical y despelote cubano',
        en: 'Dancers practicing Cuban Timba and Lady Timba at Barcelona dance academy - Musical interpretation and Cuban despelote',
        ca: 'Ballarins practicant Timba Cubana i Lady Timba a acadèmia de Barcelona - Interpretació musical i despelote cubà',
        fr: 'Danseurs pratiquant la Timba Cubaine et Lady Timba à académie de Barcelone - Interprétation musicale et despelote cubain',
      },
    },
    salsaLadyTimba: {
      alt: {
        es: "Clases de Salsa Lady Timba en Barcelona - Farray's Center",
        en: "Salsa Lady Timba Classes in Barcelona - Farray's Center",
        ca: "Classes de Salsa Lady Timba a Barcelona - Farray's Center",
        fr: "Cours de Salsa Lady Timba à Barcelone - Farray's Center",
      },
      cardHub: {
        es: 'Salsa Lady Timba Barcelona - Técnica femenina con el sabor de la timba cubana',
        en: 'Salsa Lady Timba Barcelona - Feminine technique with Cuban timba flavor',
        ca: 'Salsa Lady Timba Barcelona - Tècnica femenina amb el sabor de la timba cubana',
        fr: 'Salsa Lady Timba Barcelone - Technique féminine avec saveur de la timba cubaine',
      },
      cardLatin: {
        es: 'Salsa Lady Timba - Estilo femenino cubano con movimientos de despelote y rumba',
        en: 'Salsa Lady Timba - Cuban feminine style with despelote and rumba movements',
        ca: 'Salsa Lady Timba - Estil femení cubà amb moviments de despelote i rumba',
        fr: 'Salsa Lady Timba - Style féminin cubain avec mouvements de despelote et rumba',
      },
      hero: {
        es: "Bailarinas ejecutando Salsa Lady Timba en Barcelona - Estilo cubano en Farray's Center",
        en: "Dancers performing Salsa Lady Timba in Barcelona - Cuban style at Farray's Center",
        ca: "Ballarines executant Salsa Lady Timba a Barcelona - Estil cubà a Farray's Center",
        fr: "Danseuses exécutant le Salsa Lady Timba à Barcelone - Style cubain chez Farray's Center",
      },
      whatIs: {
        es: 'Alumnas practicando técnica de Salsa Lady Timba con despelotes y movimientos de rumba en academia de Barcelona',
        en: 'Students practicing Salsa Lady Timba technique with despelotes and rumba movements at Barcelona dance academy',
        ca: 'Alumnes practicant tècnica de Salsa Lady Timba amb despelotes i moviments de rumba a acadèmia de Barcelona',
        fr: 'Élèves pratiquant la technique Salsa Lady Timba avec despelotes et mouvements de rumba à académie de Barcelone',
      },
    },
    folkloreCubano: {
      // Alt genérico (fallback)
      alt: {
        es: "Clases de Folklore Cubano en Barcelona - Danzas Yoruba y Orishas en Farray's Center",
        en: "Cuban Folklore Classes in Barcelona - Yoruba and Orishas dances at Farray's Center",
        ca: "Classes de Folklore Cubà a Barcelona - Danses Yoruba i Orixàs a Farray's Center",
        fr: "Cours de Folklore Cubain à Barcelone - Danses Yoruba et Orishas chez Farray's Center",
      },
      // Para cards en hub de clases de baile (/clases/baile-barcelona)
      cardHub: {
        es: 'Folklore Cubano Barcelona - Aprende danzas Yoruba, Orishas y rumba con maestros cubanos',
        en: 'Cuban Folklore Barcelona - Learn Yoruba dances, Orishas and rumba with Cuban masters',
        ca: 'Folklore Cubà Barcelona - Aprèn danses Yoruba, Orixàs i rumba amb mestres cubans',
        fr: 'Folklore Cubain Barcelone - Apprenez danses Yoruba, Orishas et rumba avec maîtres cubains',
      },
      // Para cards en categoría salsa/bachata (/clases/salsa-bachata-barcelona)
      cardLatin: {
        es: 'Folklore Cubano - Danzas tradicionales yoruba, rumba cubana y expresión afrocubana auténtica',
        en: 'Cuban Folklore - Traditional Yoruba dances, Cuban rumba and authentic Afro-Cuban expression',
        ca: 'Folklore Cubà - Danses tradicionals yoruba, rumba cubana i expressió afrocubana autèntica',
        fr: 'Folklore Cubain - Danses traditionnelles yoruba, rumba cubaine et expression afro-cubaine authentique',
      },
      // Para hero de la página de clase individual
      hero: {
        es: "Bailarina ejecutando danza Yoruba de Folklore Cubano en las calles de La Habana - Tradición afrocubana en Farray's Center Barcelona",
        en: "Dancer performing Yoruba dance from Cuban Folklore on the streets of Havana - Afro-Cuban tradition at Farray's Center Barcelona",
        ca: "Ballarina executant dansa Yoruba de Folklore Cubà als carrers de l'Havana - Tradició afrocubana a Farray's Center Barcelona",
        fr: "Danseuse exécutant une danse Yoruba du Folklore Cubain dans les rues de La Havane - Tradition afro-cubaine chez Farray's Center Barcelone",
      },
      // Para sección "¿Qué es?" de la página de clase
      whatIs: {
        es: 'Grupo de estudiantes aprendiendo danzas a los Orishas y folklore cubano tradicional en academia de Barcelona',
        en: 'Group of students learning Orishas dances and traditional Cuban folklore at Barcelona dance academy',
        ca: "Grup d'estudiants aprenent danses als Orixàs i folklore cubà tradicional a acadèmia de Barcelona",
        fr: "Groupe d'étudiants apprenant les danses aux Orishas et folklore cubain traditionnel à académie de Barcelone",
      },
    },
    stretching: {
      alt: {
        es: "Clases de Stretching en Barcelona - Flexibilidad en Farray's Center",
        en: "Stretching Classes in Barcelona - Flexibility at Farray's Center",
        ca: "Classes de Stretching a Barcelona - Flexibilitat a Farray's Center",
        fr: "Cours de Stretching à Barcelone - Flexibilité chez Farray's Center",
      },
      cardHub: {
        es: 'Stretching Barcelona - Mejora tu flexibilidad y previene lesiones',
        en: 'Stretching Barcelona - Improve your flexibility and prevent injuries',
        ca: 'Stretching Barcelona - Millora la teva flexibilitat i prevé lesions',
        fr: 'Stretching Barcelone - Améliorez votre flexibilité et prévenez les blessures',
      },
      cardFitness: {
        es: 'Stretching - Estiramientos profundos para bailarines y deportistas',
        en: 'Stretching - Deep stretches for dancers and athletes',
        ca: 'Stretching - Estiraments profunds per a ballarins i esportistes',
        fr: 'Stretching - Étirements profonds pour danseurs et sportifs',
      },
      hero: {
        es: "Alumnas realizando estiramientos en Barcelona - Flexibilidad profesional en Farray's Center",
        en: "Students performing stretches in Barcelona - Professional flexibility at Farray's Center",
        ca: "Alumnes realitzant estiraments a Barcelona - Flexibilitat professional a Farray's Center",
        fr: "Élèves effectuant des étirements à Barcelone - Flexibilité professionnelle chez Farray's Center",
      },
    },
    bumBum: {
      // Alt genérico (fallback) - Enterprise SEO/GEO/AIO optimized
      alt: {
        es: "Alumnas realizando ejercicios de glúteos Bum Bum en academia de Barcelona - tonificación muscular con hip thrust, sentadillas y técnicas del Método Farray en Farray's Center",
        en: "Students performing Bum Bum glute exercises at Barcelona dance academy - muscle toning with hip thrust, squats and Farray Method techniques at Farray's Center",
        ca: "Alumnes realitzant exercicis de glutis Bum Bum a acadèmia de Barcelona - tonificació muscular amb hip thrust, esquats i tècniques del Mètode Farray a Farray's Center",
        fr: "Élèves effectuant des exercices de fessiers Bum Bum à académie de Barcelone - tonification musculaire avec hip thrust, squats et techniques Méthode Farray chez Farray's Center",
      },
      // Para cards en hub de clases de baile (/clases/baile-barcelona)
      cardHub: {
        es: 'Clases de Bum Bum Glúteos Maravillosos en Barcelona - Tonifica y fortalece con hip thrust, sentadillas y el Método Farray exclusivo',
        en: 'Bum Bum Amazing Glutes classes in Barcelona - Tone and strengthen with hip thrust, squats and the exclusive Farray Method',
        ca: 'Classes de Bum Bum Glutis Meravellosos a Barcelona - Tonifica i enforteix amb hip thrust, esquats i el Mètode Farray exclusiu',
        fr: 'Cours Bum Bum Fessiers Extraordinaires à Barcelone - Tonifiez et renforcez avec hip thrust, squats et la Méthode Farray exclusive',
      },
      // Para cards en categoría fitness (/clases/entrenamiento-bailarines-barcelona)
      cardFitness: {
        es: 'Bum Bum Glúteos Maravillosos - Ejercicios de tonificación con hip thrust, sentadillas, lunges y técnicas de baile del Método Farray',
        en: 'Bum Bum Amazing Glutes - Toning exercises with hip thrust, squats, lunges and Farray Method dance techniques',
        ca: 'Bum Bum Glutis Meravellosos - Exercicis de tonificació amb hip thrust, esquats, lunges i tècniques de ball del Mètode Farray',
        fr: 'Bum Bum Fessiers Extraordinaires - Exercices de tonification avec hip thrust, squats, lunges et techniques de danse Méthode Farray',
      },
      // Para hero de la página de clase
      hero: {
        es: 'Clase de Bum Bum Glúteos Maravillosos en Barcelona - Alumnas tonificando con hip thrust, sentadillas y el Método Farray exclusivo para glúteos firmes y definidos',
        en: 'Bum Bum Amazing Glutes class in Barcelona - Students toning with hip thrust, squats and the exclusive Farray Method for firm and defined glutes',
        ca: 'Classe de Bum Bum Glutis Meravellosos a Barcelona - Alumnes tonificant amb hip thrust, esquats i el Mètode Farray exclusiu per a glutis ferms i definits',
        fr: 'Cours Bum Bum Fessiers Extraordinaires à Barcelone - Élèves tonifiant avec hip thrust, squats et la Méthode Farray exclusive pour des fessiers fermes et définis',
      },
      // Para sección "¿Qué es?" de la página de clase
      whatIs: {
        es: 'Grupo de alumnas realizando ejercicios de Bum Bum Glúteos Maravillosos en academia de Barcelona - tonificación y fortalecimiento con técnicas profesionales del Método Farray',
        en: 'Group of students performing Bum Bum Amazing Glutes exercises at Barcelona dance academy - toning and strengthening with professional Farray Method techniques',
        ca: "Grup d'alumnes realitzant exercicis de Bum Bum Glutis Meravellosos a acadèmia de Barcelona - tonificació i enfortiment amb tècniques professionals del Mètode Farray",
        fr: "Groupe d'élèves effectuant des exercices Bum Bum Fessiers Extraordinaires à académie de Barcelone - tonification et renforcement avec techniques professionnelles Méthode Farray",
      },
    },
    cuerpoFit: {
      // Alt genérico (fallback)
      alt: {
        es: "Clases de Cuerpo Fit en Barcelona - Acondicionamiento físico para bailarines en Farray's Center",
        en: "Cuerpo Fit Classes in Barcelona - Physical conditioning for dancers at Farray's Center",
        ca: "Classes de Cuerpo Fit a Barcelona - Condicionament físic per a ballarins a Farray's Center",
        fr: "Cours de Cuerpo Fit à Barcelone - Conditionnement physique pour danseurs chez Farray's Center",
      },
      // Para cards en hub de clases de baile (/clases/baile-barcelona)
      cardHub: {
        es: 'Cuerpo Fit Barcelona - Acondicionamiento físico integral para bailarines con el Método Farray',
        en: 'Cuerpo Fit Barcelona - Complete physical conditioning for dancers with the Farray Method',
        ca: 'Cuerpo Fit Barcelona - Condicionament físic integral per a ballarins amb el Mètode Farray',
        fr: 'Cuerpo Fit Barcelone - Conditionnement physique complet pour danseurs avec la Méthode Farray',
      },
      // Para cards en categoría fitness (/clases/entrenamiento-bailarines-barcelona)
      cardFitness: {
        es: 'Cuerpo Fit - Entrenamiento funcional diseñado para potenciar fuerza, resistencia y flexibilidad en bailarines',
        en: 'Cuerpo Fit - Functional training designed to enhance strength, endurance and flexibility in dancers',
        ca: 'Cuerpo Fit - Entrenament funcional dissenyat per potenciar força, resistència i flexibilitat en ballarins',
        fr: 'Cuerpo Fit - Entraînement fonctionnel conçu pour améliorer force, endurance et flexibilité chez les danseurs',
      },
      // Para hero de la página de clase individual
      hero: {
        es: 'Alumnas realizando ejercicios de acondicionamiento físico Cuerpo Fit en Barcelona - Método Farray con entrenamiento funcional para bailarines',
        en: 'Students performing Cuerpo Fit physical conditioning exercises in Barcelona - Farray Method with functional training for dancers',
        ca: 'Alumnes realitzant exercicis de condicionament físic Cuerpo Fit a Barcelona - Mètode Farray amb entrenament funcional per a ballarins',
        fr: 'Élèves effectuant des exercices de conditionnement physique Cuerpo Fit à Barcelone - Méthode Farray avec entraînement fonctionnel pour danseurs',
      },
      // Para sección "¿Qué es?" de la página de clase
      whatIs: {
        es: 'Grupo de bailarines entrenando fuerza y resistencia en clase de Cuerpo Fit en academia de Barcelona',
        en: 'Group of dancers training strength and endurance in Cuerpo Fit class at Barcelona dance academy',
        ca: 'Grup de ballarins entrenant força i resistència a classe de Cuerpo Fit a acadèmia de Barcelona',
        fr: 'Groupe de danseurs entraînant force et endurance en cours de Cuerpo Fit à académie de Barcelone',
      },
    },
    fullBodyCardio: {
      // Alt genérico (fallback)
      alt: {
        es: "Clases de Cuerpo-Fit Cardio Dance en Barcelona - Entrenamiento full body en Farray's Center",
        en: "Cuerpo-Fit Cardio Dance Classes in Barcelona - Full body workout at Farray's Center",
        ca: "Classes de Cuerpo-Fit Cardio Dance a Barcelona - Entrenament full body a Farray's Center",
        fr: "Cours de Cuerpo-Fit Cardio Dance à Barcelone - Entraînement full body chez Farray's Center",
      },
      // Para cards en hub de clases de baile (/clases/baile-barcelona)
      cardHub: {
        es: 'Cuerpo-Fit Cardio Barcelona - Quema calorías bailando con entrenamiento full body',
        en: 'Cuerpo-Fit Cardio Barcelona - Burn calories dancing with full body workout',
        ca: 'Cuerpo-Fit Cardio Barcelona - Crema calories ballant amb entrenament full body',
        fr: 'Cuerpo-Fit Cardio Barcelone - Brûlez des calories en dansant avec entraînement full body',
      },
      // Para cards en categoría fitness (/clases/entrenamiento-bailarines-barcelona)
      cardFitness: {
        es: 'Cuerpo-Fit - Cardio dance que combina ejercicios funcionales con música y coreografías',
        en: 'Cuerpo-Fit - Cardio dance combining functional exercises with music and choreography',
        ca: 'Cuerpo-Fit - Cardio dance que combina exercicis funcionals amb música i coreografies',
        fr: 'Cuerpo-Fit - Cardio dance combinant exercices fonctionnels avec musique et chorégraphies',
      },
      // Para hero de la página de clase individual
      hero: {
        es: "Alumnas realizando ejercicios de cardio dance Cuerpo-Fit en Barcelona - Entrenamiento full body con música en Farray's Center",
        en: "Students performing Cuerpo-Fit cardio dance exercises in Barcelona - Full body workout with music at Farray's Center",
        ca: "Alumnes realitzant exercicis de cardio dance Cuerpo-Fit a Barcelona - Entrenament full body amb música a Farray's Center",
        fr: "Élèves effectuant des exercices de cardio dance Cuerpo-Fit à Barcelone - Entraînement full body avec musique chez Farray's Center",
      },
      // Para sección "¿Qué es?" de la página de clase
      whatIs: {
        es: 'Grupo de alumnas quemando calorías con cardio dance Cuerpo-Fit en academia de Barcelona',
        en: 'Group of students burning calories with Cuerpo-Fit cardio dance at Barcelona dance academy',
        ca: "Grup d'alumnes cremant calories amb cardio dance Cuerpo-Fit a acadèmia de Barcelona",
        fr: "Groupe d'élèves brûlant des calories avec cardio dance Cuerpo-Fit à académie de Barcelone",
      },
    },
    bodyConditioning: {
      // Alt genérico (fallback) - optimizado para SEO
      alt: {
        es: "Bailarinas ejecutando ejercicios de acondicionamiento físico y preparación corporal para danza en academia de Barcelona - Farray's Center",
        en: "Dancers performing body conditioning and physical preparation exercises for dance at Barcelona academy - Farray's Center",
        ca: "Ballarines executant exercicis de condicionament físic i preparació corporal per a dansa a acadèmia de Barcelona - Farray's Center",
        fr: "Danseuses effectuant des exercices de conditionnement physique et préparation corporelle pour la danse à académie de Barcelone - Farray's Center",
      },
      // Para cards en hub de clases de baile (/clases/baile-barcelona)
      cardHub: {
        es: 'Acondicionamiento Físico Barcelona - Fortalecimiento muscular, core y resistencia para bailarines con el Método Farray',
        en: 'Body Conditioning Barcelona - Muscle strengthening, core and endurance for dancers with the Farray Method',
        ca: 'Condicionament Físic Barcelona - Enfortiment muscular, core i resistència per a ballarins amb el Mètode Farray',
        fr: 'Conditionnement Physique Barcelone - Renforcement musculaire, core et endurance pour danseurs avec la Méthode Farray',
      },
      // Para cards en categoría fitness (/clases/entrenamiento-bailarines-barcelona)
      cardFitness: {
        es: 'Acondicionamiento Físico - Preparación corporal integral con ejercicios de fuerza, estabilidad y prevención de lesiones para bailarines',
        en: 'Body Conditioning - Comprehensive body preparation with strength, stability and injury prevention exercises for dancers',
        ca: 'Condicionament Físic - Preparació corporal integral amb exercicis de força, estabilitat i prevenció de lesions per a ballarins',
        fr: 'Conditionnement Physique - Préparation corporelle complète avec exercices de force, stabilité et prévention des blessures pour danseurs',
      },
      // Para hero de la página de clase individual
      hero: {
        es: "Bailarinas realizando ejercicios de acondicionamiento físico y preparación corporal en Barcelona - Entrenamiento funcional para danza en Farray's Center",
        en: "Dancers performing body conditioning and physical preparation exercises in Barcelona - Functional dance training at Farray's Center",
        ca: "Ballarines realitzant exercicis de condicionament físic i preparació corporal a Barcelona - Entrenament funcional per a dansa a Farray's Center",
        fr: "Danseuses effectuant des exercices de conditionnement physique et préparation corporelle à Barcelone - Entraînement fonctionnel pour la danse chez Farray's Center",
      },
      // Para sección "¿Qué es?" de la página de clase
      whatIs: {
        es: 'Grupo de bailarines entrenando fuerza, core y resistencia con ejercicios de acondicionamiento físico en academia de danza de Barcelona',
        en: 'Group of dancers training strength, core and endurance with body conditioning exercises at Barcelona dance academy',
        ca: 'Grup de ballarins entrenant força, core i resistència amb exercicis de condicionament físic a acadèmia de dansa de Barcelona',
        fr: 'Groupe de danseurs entraînant force, core et endurance avec exercices de conditionnement physique à académie de danse de Barcelone',
      },
      // Para imagen OG (redes sociales)
      og: {
        es: "Clases de Acondicionamiento Físico para Bailarines en Barcelona - Preparación corporal profesional en Farray's Center",
        en: "Body Conditioning Classes for Dancers in Barcelona - Professional body preparation at Farray's Center",
        ca: "Classes de Condicionament Físic per a Ballarins a Barcelona - Preparació corporal professional a Farray's Center",
        fr: "Cours de Conditionnement Physique pour Danseurs à Barcelone - Préparation corporelle professionnelle chez Farray's Center",
      },
    },
    baileMananas: {
      alt: {
        es: "Clases de Baile por las Mañanas en Barcelona - Empieza el día bailando en Farray's Center",
        en: "Morning Dance Classes in Barcelona - Start your day dancing at Farray's Center",
        ca: "Classes de Ball al Matí a Barcelona - Comença el dia ballant a Farray's Center",
        fr: "Cours de Danse le Matin à Barcelone - Commencez la journée en dansant chez Farray's Center",
      },
      cardHub: {
        es: 'Clases de Baile Mañanas Barcelona - Salsa, contemporáneo, ballet y fitness antes del trabajo',
        en: 'Morning Dance Classes Barcelona - Salsa, contemporary, ballet and fitness before work',
        ca: 'Classes de Ball Matí Barcelona - Salsa, contemporani, ballet i fitness abans de treballar',
        fr: 'Cours de Danse Matin Barcelone - Salsa, contemporain, ballet et fitness avant le travail',
      },
      hero: {
        es: "Grupo de alumnos bailando en clase matinal de baile en Barcelona - Energía y vitalidad en Farray's Center",
        en: "Group of students dancing in morning dance class in Barcelona - Energy and vitality at Farray's Center",
        ca: "Grup d'alumnes ballant a classe matinal de ball a Barcelona - Energia i vitalitat a Farray's Center",
        fr: "Groupe d'élèves dansant en cours de danse matinal à Barcelone - Énergie et vitalité chez Farray's Center",
      },
      whatIs: {
        es: 'Alumnas practicando coreografía en clase de baile por las mañanas en academia de Barcelona - Variedad de estilos en horario matinal',
        en: 'Students practicing choreography in morning dance class at Barcelona dance academy - Variety of styles in morning schedule',
        ca: "Alumnes practicant coreografia a classe de ball al matí a acadèmia de Barcelona - Varietat d'estils en horari matinal",
        fr: 'Élèves pratiquant une chorégraphie en cours de danse le matin à académie de Barcelone - Variété de styles en horaire matinal',
      },
      og: {
        es: "Clases de Baile por las Mañanas en Barcelona - Más de 20 clases matinales semanales en Farray's Center",
        en: "Morning Dance Classes in Barcelona - Over 20 weekly morning classes at Farray's Center",
        ca: "Classes de Ball al Matí a Barcelona - Més de 20 classes matinals setmanals a Farray's Center",
        fr: "Cours de Danse le Matin à Barcelone - Plus de 20 cours matinaux par semaine chez Farray's Center",
      },
    },
  },

  // ==========================================================================
  // PAGES - Alt texts para páginas específicas
  // ==========================================================================
  pages: {
    horarios: {
      hero: {
        es: "Alumnas en clase de baile grupal consultando horarios de clases de salsa, bachata y danzas urbanas en Barcelona - Farray's International Dance Center con más de 100 clases semanales",
        en: "Students in group dance class checking salsa, bachata and urban dance class schedules in Barcelona - Farray's International Dance Center with over 100 weekly classes",
        ca: "Alumnes a classe de ball grupal consultant horaris de classes de salsa, bachata i danses urbanes a Barcelona - Farray's International Dance Center amb més de 100 classes setmanals",
        fr: "Élèves en cours de danse en groupe consultant les horaires de cours de salsa, bachata et danses urbaines à Barcelone - Farray's International Dance Center avec plus de 100 cours par semaine",
      },
      og: {
        es: "Horarios de Clases de Baile en Barcelona 2025 - Farray's Center | Salsa, Bachata, Hip Hop, Danza Contemporánea",
        en: "Dance Class Schedules in Barcelona 2025 - Farray's Center | Salsa, Bachata, Hip Hop, Contemporary Dance",
        ca: "Horaris de Classes de Ball a Barcelona 2025 - Farray's Center | Salsa, Bachata, Hip Hop, Dansa Contemporània",
        fr: "Horaires des Cours de Danse à Barcelone 2025 - Farray's Center | Salsa, Bachata, Hip Hop, Danse Contemporaine",
      },
    },
  },

  // ==========================================================================
  // CATEGORY PAGES - Alt texts for category page heroes
  // ==========================================================================
  alt_hero_clases_danza: {
    es: "Clases de baile en Barcelona - Estudiantes practicando diversos estilos de danza en el estudio de Farray's Center",
    en: "Dance classes in Barcelona - Students practicing various dance styles at Farray's Center studio",
    ca: "Classes de ball a Barcelona - Estudiants practicant diversos estils de dansa a l'estudi de Farray's Center",
    fr: "Cours de danse à Barcelone - Étudiants pratiquant divers styles de danse au studio Farray's Center",
  },

  // ==========================================================================
  // FACILITIES - Salas de baile e instalaciones
  // ==========================================================================
  facilities: {
    // Sala A - Sala Principal (120 m²)
    salaA: {
      gallery: [
        {
          es: "Sala A principal de Farray's Center Barcelona - 120 m² con suelo flotante profesional y espejos de pared completa",
          en: "Farray's Center Barcelona main Room A - 120 sqm with professional floating floor and full wall mirrors",
          ca: "Sala A principal de Farray's Center Barcelona - 120 m² amb terra flotant professional i miralls de paret completa",
          fr: "Salle A principale de Farray's Center Barcelone - 120 m² avec plancher flottant professionnel et miroirs muraux complets",
        },
        {
          es: "Vista lateral de la Sala A con sistema de audio profesional y aire acondicionado - Farray's Center Barcelona",
          en: "Side view of Room A with professional audio system and air conditioning - Farray's Center Barcelona",
          ca: "Vista lateral de la Sala A amb sistema d'àudio professional i aire condicionat - Farray's Center Barcelona",
          fr: "Vue latérale de la Salle A avec système audio professionnel et climatisation - Farray's Center Barcelone",
        },
        {
          es: 'Detalle del suelo flotante profesional y barras de ballet de la Sala A - Instalaciones de danza Barcelona',
          en: 'Detail of Room A professional floating floor and ballet barres - Dance facilities Barcelona',
          ca: 'Detall del terra flotant professional i barres de ballet de la Sala A - Instal·lacions de dansa Barcelona',
          fr: 'Détail du plancher flottant professionnel et barres de ballet de la Salle A - Installations de danse Barcelone',
        },
      ],
    },
    // Sala B (80 m²)
    salaB: {
      gallery: [
        {
          es: "Sala B de Farray's Center Barcelona - 80 m² con espejos y equipamiento profesional para clases de baile",
          en: "Farray's Center Barcelona Room B - 80 sqm with mirrors and professional equipment for dance classes",
          ca: "Sala B de Farray's Center Barcelona - 80 m² amb miralls i equipament professional per a classes de ball",
          fr: "Salle B de Farray's Center Barcelone - 80 m² avec miroirs et équipement professionnel pour cours de danse",
        },
        {
          es: 'Vista de la Sala B con sistema de iluminación profesional - Academia de baile Barcelona',
          en: 'View of Room B with professional lighting system - Dance academy Barcelona',
          ca: "Vista de la Sala B amb sistema d'il·luminació professional - Acadèmia de ball Barcelona",
          fr: "Vue de la Salle B avec système d'éclairage professionnel - Académie de danse Barcelone",
        },
        {
          es: "Sala B preparada para clases grupales de danza - Farray's International Dance Center",
          en: "Room B set up for group dance classes - Farray's International Dance Center",
          ca: "Sala B preparada per a classes grupals de dansa - Farray's International Dance Center",
          fr: "Salle B préparée pour cours de danse en groupe - Farray's International Dance Center",
        },
      ],
    },
    // Sala C (60 m²)
    salaC: {
      gallery: [
        {
          es: "Sala C de Farray's Center Barcelona - 60 m² ideal para clases reducidas y ensayos privados",
          en: "Farray's Center Barcelona Room C - 60 sqm ideal for small classes and private rehearsals",
          ca: "Sala C de Farray's Center Barcelona - 60 m² ideal per a classes reduïdes i assajos privats",
          fr: "Salle C de Farray's Center Barcelone - 60 m² idéale pour petits cours et répétitions privées",
        },
        {
          es: 'Interior de la Sala C con espejos de cuerpo entero - Espacio para coreografías Barcelona',
          en: 'Interior of Room C with full-length mirrors - Choreography space Barcelona',
          ca: 'Interior de la Sala C amb miralls de cos sencer - Espai per a coreografies Barcelona',
          fr: 'Intérieur de la Salle C avec miroirs en pied - Espace pour chorégraphies Barcelone',
        },
        {
          es: 'Sala C con equipamiento de audio y climatización - Instalaciones profesionales de danza',
          en: 'Room C with audio equipment and climate control - Professional dance facilities',
          ca: "Sala C amb equipament d'àudio i climatització - Instal·lacions professionals de dansa",
          fr: 'Salle C avec équipement audio et climatisation - Installations de danse professionnelles',
        },
      ],
    },
    // Sala D (50 m²)
    salaD: {
      gallery: [
        {
          es: "Sala D de Farray's Center Barcelona - 50 m² perfecta para clases privadas y workshops especializados",
          en: "Farray's Center Barcelona Room D - 50 sqm perfect for private classes and specialized workshops",
          ca: "Sala D de Farray's Center Barcelona - 50 m² perfecta per a classes privades i workshops especialitzats",
          fr: "Salle D de Farray's Center Barcelone - 50 m² parfaite pour cours privés et ateliers spécialisés",
        },
        {
          es: 'Vista de la Sala D con suelo de alta calidad para baile - Academia de danza Barcelona',
          en: 'View of Room D with high-quality dance flooring - Dance academy Barcelona',
          ca: "Vista de la Sala D amb terra d'alta qualitat per a ball - Acadèmia de dansa Barcelona",
          fr: 'Vue de la Salle D avec sol de haute qualité pour la danse - Académie de danse Barcelone',
        },
        {
          es: 'Sala D equipada para entrenamientos individuales y clases en grupo pequeño',
          en: 'Room D equipped for individual training and small group classes',
          ca: 'Sala D equipada per a entrenaments individuals i classes en grup petit',
          fr: 'Salle D équipée pour entraînements individuels et cours en petit groupe',
        },
      ],
    },
    // Bar y zona social
    bar: {
      gallery: [
        {
          es: "Bar y zona social de Farray's Center Barcelona - Espacio de descanso y networking para bailarines",
          en: "Farray's Center Barcelona bar and social area - Rest and networking space for dancers",
          ca: "Bar i zona social de Farray's Center Barcelona - Espai de descans i networking per a ballarins",
          fr: "Bar et espace social de Farray's Center Barcelone - Espace de repos et networking pour danseurs",
        },
        {
          es: 'Zona de descanso con servicio de bebidas y snacks en la academia de baile Barcelona',
          en: 'Rest area with drinks and snacks service at the Barcelona dance academy',
          ca: "Zona de descans amb servei de begudes i snacks a l'acadèmia de ball Barcelona",
          fr: "Zone de repos avec service de boissons et snacks à l'académie de danse Barcelone",
        },
        {
          es: "Área social de Farray's Center con WiFi gratuito y ambiente acogedor para estudiantes",
          en: "Farray's Center social area with free WiFi and welcoming atmosphere for students",
          ca: "Àrea social de Farray's Center amb WiFi gratuït i ambient acollidor per a estudiants",
          fr: "Espace social de Farray's Center avec WiFi gratuit et ambiance accueillante pour étudiants",
        },
        {
          es: "Detalle del bar con decoración tropical y vibes caribeñas - Farray's International Dance Center",
          en: "Bar detail with tropical decor and Caribbean vibes - Farray's International Dance Center",
          ca: "Detall del bar amb decoració tropical i vibes caribenyes - Farray's International Dance Center",
          fr: "Détail du bar avec décoration tropicale et ambiance caribéenne - Farray's International Dance Center",
        },
      ],
    },
    // Recepción
    recepcion: {
      gallery: [
        {
          es: "Recepción de Farray's International Dance Center Barcelona - Atención personalizada y bienvenida",
          en: "Farray's International Dance Center Barcelona reception - Personalized attention and welcome",
          ca: "Recepció de Farray's International Dance Center Barcelona - Atenció personalitzada i benvinguda",
          fr: "Réception de Farray's International Dance Center Barcelone - Attention personnalisée et bienvenue",
        },
        {
          es: 'Entrada y área de recepción con información de clases y horarios - Academia de baile Barcelona',
          en: 'Entrance and reception area with class information and schedules - Dance academy Barcelona',
          ca: 'Entrada i àrea de recepció amb informació de classes i horaris - Acadèmia de ball Barcelona',
          fr: 'Entrée et zone de réception avec informations sur les cours et horaires - Académie de danse Barcelone',
        },
      ],
    },
    // Rincón Delux
    rinconDelux: {
      gallery: [
        {
          es: "Rincón Delux de Farray's Center - Espacio premium para eventos exclusivos y sesiones VIP",
          en: "Farray's Center Delux Corner - Premium space for exclusive events and VIP sessions",
          ca: "Racó Delux de Farray's Center - Espai premium per a esdeveniments exclusius i sessions VIP",
          fr: "Coin Delux de Farray's Center - Espace premium pour événements exclusifs et sessions VIP",
        },
        {
          es: 'Zona Delux con ambientación especial y equipamiento de alta gama - Instalaciones Barcelona',
          en: 'Delux zone with special ambiance and high-end equipment - Barcelona facilities',
          ca: "Zona Delux amb ambientació especial i equipament d'alta gamma - Instal·lacions Barcelona",
          fr: 'Zone Delux avec ambiance spéciale et équipement haut de gamme - Installations Barcelone',
        },
      ],
    },
    // Vestuarios
    vestuario: {
      gallery: [
        {
          es: "Vestuarios modernos de Farray's Center Barcelona - Taquillas seguras y zona de cambio amplia",
          en: "Modern changing rooms at Farray's Center Barcelona - Secure lockers and spacious changing area",
          ca: "Vestuaris moderns de Farray's Center Barcelona - Taquilles segures i zona de canvi àmplia",
          fr: "Vestiaires modernes de Farray's Center Barcelone - Casiers sécurisés et vaste zone de change",
        },
        {
          es: 'Área de taquillas individuales en vestuario de academia de baile Barcelona - Instalaciones limpias y equipadas',
          en: 'Individual locker area in Barcelona dance academy changing room - Clean and well-equipped facilities',
          ca: "Àrea de taquilles individuals al vestuari d'acadèmia de ball Barcelona - Instal·lacions netes i equipades",
          fr: "Espace de casiers individuels dans le vestiaire de l'académie de danse Barcelone - Installations propres et équipées",
        },
        {
          es: "Zona de bancos y espejo en vestuarios de Farray's International Dance Center - Comodidad para bailarines",
          en: "Bench and mirror area in Farray's International Dance Center changing rooms - Comfort for dancers",
          ca: "Zona de bancs i mirall als vestuaris de Farray's International Dance Center - Comoditat per a ballarins",
          fr: "Zone de bancs et miroir dans les vestiaires de Farray's International Dance Center - Confort pour les danseurs",
        },
        {
          es: 'Interior de vestuario profesional en escuela de baile Barcelona - Ambiente limpio y bien iluminado',
          en: 'Professional changing room interior at Barcelona dance school - Clean and well-lit environment',
          ca: 'Interior de vestuari professional a escola de ball Barcelona - Ambient net i ben il·luminat',
          fr: "Intérieur du vestiaire professionnel à l'école de danse Barcelone - Environnement propre et bien éclairé",
        },
      ],
    },
    // Alt texts generales para la página
    hero: {
      es: "Instalaciones profesionales de Farray's International Dance Center Barcelona - 4 salas de baile con más de 700 m²",
      en: "Farray's International Dance Center Barcelona professional facilities - 4 dance studios with over 700 sqm",
      ca: "Instal·lacions professionals de Farray's International Dance Center Barcelona - 4 sales de ball amb més de 700 m²",
      fr: "Installations professionnelles de Farray's International Dance Center Barcelone - 4 salles de danse de plus de 700 m²",
    },
    og: {
      es: "Instalaciones de Farray's Center Barcelona - Salas de baile profesionales con equipamiento de primer nivel",
      en: "Farray's Center Barcelona Facilities - Professional dance studios with top-level equipment",
      ca: "Instal·lacions de Farray's Center Barcelona - Sales de ball professionals amb equipament de primer nivell",
      fr: "Installations de Farray's Center Barcelone - Salles de danse professionnelles avec équipement de premier niveau",
    },
  },
} as const;

// Type helper to get paths
export type ImageAltPath = keyof typeof IMAGE_ALT_TEXTS;

export default IMAGE_ALT_TEXTS;
