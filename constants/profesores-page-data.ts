/**
 * Profesores de Baile Barcelona Page Data
 * Contains all teacher information for the teachers page
 */

export interface TeacherPageInfo {
  id: string;
  name: string;
  image?: string;
  specialtyKey: string;
  bioKey: string;
  styles: string[];
  isDirector?: boolean;
}

// Director/Fundadora - Featured at top
// Uses canonical keys from teacher-registry (source of truth)
export const DIRECTOR_INFO: TeacherPageInfo = {
  id: 'yunaisy-farray',
  name: 'Yunaisy Farray',
  image: '/images/teachers/img/maestra-yunaisy-farray_320.webp',
  specialtyKey: 'teacher.yunaisyFarray.specialty',
  bioKey: 'teacher.yunaisyFarray.bio',
  styles: [
    'Afro Jazz',
    'Salsa Lady Style',
    'Bachata Lady Style',
    'Afro Contemporáneo',
    'Salsa Cubana',
  ],
  isDirector: true,
};

// Rest of the teaching team
// Enterprise Order: Cuban teachers → Marcos → CrisAg → Yasmina → Redbhlue → rest
// All teachers use canonical keys from teacher-registry (source of truth)
export const TEACHERS_LIST: TeacherPageInfo[] = [
  // ============================================================================
  // CUBAN TEACHERS (formación académica cubana)
  // ============================================================================
  {
    id: 'daniel-sene',
    name: 'Daniel Sené',
    image: '/images/teachers/img/profesor-daniel-sen-_320.webp',
    specialtyKey: 'teacher.danielSene.specialty',
    bioKey: 'teacher.danielSene.bio',
    styles: ['Ballet Clásico', 'Contemporáneo', 'Yoga', 'Tai-Chi', 'Stretching'],
  },
  {
    id: 'alejandro-minoso',
    name: 'Alejandro Miñoso',
    image: '/images/teachers/img/profesor-alejandro-mi-oso_320.webp',
    specialtyKey: 'teacher.alejandroMinoso.specialty',
    bioKey: 'teacher.alejandroMinoso.bio',
    styles: ['Ballet', 'Modern Jazz', 'Afro Jazz', 'Afro Contemporáneo', 'Contemporáneo'],
  },
  {
    id: 'lia-valdes',
    name: 'Lia Valdes',
    image: '/images/teachers/img/profesora-lia-valdes_320.webp',
    specialtyKey: 'teacher.liaValdes.specialty',
    bioKey: 'teacher.liaValdes.bio',
    styles: ['Salsa Cubana', 'Salsa Lady Style'],
  },
  {
    id: 'iroel-bastarreche',
    name: 'Iroel Bastarreche',
    image: '/images/teachers/img/profesor-iroel-bastarreche_320.webp',
    specialtyKey: 'teacher.iroelBastarreche.specialty',
    bioKey: 'teacher.iroelBastarreche.bio',
    styles: ['Folklore Cubano', 'Afro Contemporáneo'],
  },
  {
    id: 'charlie-breezy',
    name: 'Charlie Breezy',
    image: '/images/teachers/img/profesor-charlie-breezy_320.webp',
    specialtyKey: 'teacher.charlieBreezy.specialty',
    bioKey: 'teacher.charlieBreezy.bio',
    styles: ['Afro Contemporáneo', 'Hip Hop', 'Afrobeats'],
  },
  {
    id: 'grechen-mendez',
    name: 'Grechén Méndez',
    image: '/images/teachers/img/profesora-grechen-m-ndez_320.webp',
    specialtyKey: 'teacher.grechenMendez.specialty',
    bioKey: 'teacher.grechenMendez.bio',
    styles: ['Danzas Afrocubanas', 'Folklore Cubano', 'Rumba'],
  },
  // ============================================================================
  // MARCOS (referente Hip Hop España, juez internacional)
  // ============================================================================
  {
    id: 'marcos-martinez',
    name: 'Marcos Martínez',
    image: '/images/teachers/img/profesor-marcos-mart-nez_320.webp',
    specialtyKey: 'teacher.marcosMartinez.specialty',
    bioKey: 'teacher.marcosMartinez.bio',
    styles: ['Hip Hop', 'Breaking', 'Locking', 'Popping'],
  },
  // ============================================================================
  // CRISAG (desde 2012 con Yunaisy Farray)
  // ============================================================================
  {
    id: 'crisag',
    name: 'CrisAg',
    image: '/images/teachers/img/profesora-crisag_320.webp',
    specialtyKey: 'teacher.crisag.specialty',
    bioKey: 'teacher.crisag.bio',
    styles: ['Body Conditioning', 'Cuerpo Fit', 'Bum Bum Glúteos', 'Stretching'],
  },
  // ============================================================================
  // YASMINA (certificada Método Farray®, muy versátil)
  // ============================================================================
  {
    id: 'yasmina-fernandez',
    name: 'Yasmina Fernández',
    image: '/images/teachers/img/profesora-yasmina-fern-ndez_320.webp',
    specialtyKey: 'teacher.yasminaFernandez.specialty',
    bioKey: 'teacher.yasminaFernandez.bio',
    styles: ['Salsa Cubana', 'Salsa Lady Style', 'Sexy Style', 'Sexy Reggaeton'],
  },
  // ============================================================================
  // REDBHLUE (raíces africanas, Tanzania)
  // ============================================================================
  {
    id: 'redbhlue',
    name: 'Redbhlue',
    image: '/images/teachers/img/profesor-redblueh_320.webp',
    specialtyKey: 'teacher.redbhlue.specialty',
    bioKey: 'teacher.redbhlue.bio',
    styles: ['Afrobeats', 'Afro Dance'],
  },
  // ============================================================================
  // REST OF TEACHING TEAM
  // ============================================================================
  {
    id: 'sandra-gomez',
    name: 'Sandra Gómez',
    image: '/images/teachers/img/profesora-sandra-gomez_320.webp',
    specialtyKey: 'teacher.sandraGomez.specialty',
    bioKey: 'teacher.sandraGomez.bio',
    styles: ['Dancehall', 'Twerk'],
  },
  {
    id: 'isabel-lopez',
    name: 'Isabel López',
    image: '/images/teachers/img/profesora-isabel-l-pez_320.webp',
    specialtyKey: 'teacher.isabelLopez.specialty',
    bioKey: 'teacher.isabelLopez.bio',
    styles: ['Dancehall', 'Twerk'],
  },
  {
    id: 'eugenia-trujillo',
    name: 'Eugenia Trujillo',
    image: '/images/teachers/img/profesora-eugenio-trujillo_320.webp',
    specialtyKey: 'teacher.eugeniaTrujillo.specialty',
    bioKey: 'teacher.eugeniaTrujillo.bio',
    styles: ['Bachata Lady Style', 'Bachata en Pareja', 'Salsa LA'],
  },
  {
    id: 'mathias-font',
    name: 'Mathias Font',
    image: '/images/teachers/img/profesor-mathias-font_320.webp',
    specialtyKey: 'teacher.mathiasFont.specialty',
    bioKey: 'teacher.mathiasFont.bio',
    styles: ['Bachata', 'Bachata Sensual'],
  },
  {
    id: 'carlos-canto',
    name: 'Carlos Canto',
    image: '/images/teachers/img/profesor-carlos-canto_320.webp',
    specialtyKey: 'teacher.carlosCanto.specialty',
    bioKey: 'teacher.carlosCanto.bio',
    styles: ['Bachata', 'Bachata Moderna'],
  },
  {
    id: 'noemi',
    name: 'Noemi',
    image: '/images/teachers/img/profesora-noemi-guerin-_320.webp',
    specialtyKey: 'teacher.noemi.specialty',
    bioKey: 'teacher.noemi.bio',
    styles: ['Bachata', 'Bachata Lady Style'],
  },
  {
    id: 'juan-alvarez',
    name: 'Juan Alvarez',
    image: '/images/teachers/img/profesor-juan-alvarez_320.webp',
    specialtyKey: 'teacher.juanAlvarez.specialty',
    bioKey: 'teacher.juanAlvarez.bio',
    styles: ['Bachata Sensual'],
  },
];

// Page stats
export const TEACHERS_PAGE_STATS = {
  totalTeachers: 18,
  yearsExperience: 20,
  totalStudents: 15000,
  danceStyles: 25,
};

// Person schemas for SEO
export const TEACHERS_PERSON_SCHEMAS = [
  {
    name: 'Yunaisy Farray',
    jobTitle:
      "Directora y Fundadora de Farray's International Dance Center | Bailarina de Hollywood",
    description:
      'Bailarina de Hollywood y profesional cubana formada en la ENA, creadora del Método Farray® que integra la rigurosidad de la escuela rusa de ballet clásico con las raíces afrocubanas, adaptada para bailarines europeos. Actriz en Street Dance 2, finalista de Got Talent y miembro del CID UNESCO. Más de 25 años de experiencia internacional.',
    knowsAbout: [
      'Afro Jazz',
      'Salsa Lady Style',
      'Bachata Lady Style',
      'Afro Contemporáneo',
      'Salsa Cubana',
      'Método Farray®',
      'CID-UNESCO',
      'Hollywood',
    ],
  },
  {
    name: 'Daniel Sené',
    jobTitle:
      'Profesor de Ballet Clásico, Contemporáneo, Yoga, Tai-Chi y Stretching | Escuela Nacional de Ballet de Cuba | Referente Nacional',
    description:
      'Bailarín profesional formado en la prestigiosa Escuela Nacional de Ballet de Cuba. Especialista en técnica clásica cubana y danza contemporánea. Profundo conocedor del cuerpo humano, también se destaca por su maestría en Yoga, Tai-Chi y Stretching. Referente nacional que combina precisión técnica con bienestar corporal.',
    knowsAbout: [
      'Ballet Clásico',
      'Técnica Cubana',
      'Danza Contemporánea',
      'Yoga',
      'Tai-Chi',
      'Stretching',
      'Escuela Nacional de Ballet de Cuba',
      'Bienestar Corporal',
    ],
  },
  {
    name: 'Alejandro Miñoso',
    jobTitle:
      'Profesor de Ballet, Modern Jazz, Afro Jazz y Contemporáneo | Ex Solista Compañía Carlos Acosta',
    description:
      'Bailarín profesional cubano formado en la ENA y ex solista de la prestigiosa compañía Carlos Acosta, uno de los mejores bailarines de la historia. Versátil en fusión de estilos clásicos, afro y contemporáneo.',
    knowsAbout: [
      'Ballet',
      'Modern Jazz',
      'Afro Jazz',
      'Afro Contemporáneo',
      'Contemporáneo',
      'ENA Cuba',
      'Compañía Carlos Acosta',
    ],
  },
  {
    name: 'Sandra Gómez',
    jobTitle: 'Instructora de Dancehall y Twerk | Formación Jamaicana',
    description:
      'Bailarina profesional con formación jamaicana auténtica en dancehall y twerk. Su estilo fusiona Twerk/Bootydance con la esencia jamaicana genuina. Técnica impecable y metodología probada.',
    knowsAbout: [
      'Dancehall',
      'Twerk',
      'Bootydance',
      'Urban Dance',
      'Jamaican Dance',
      'Formación Jamaica',
    ],
  },
  {
    name: 'Isabel López',
    jobTitle: 'Instructora de Dancehall Female',
    description:
      'Apasionada del dancehall con más de 5 años de experiencia. Entrenada con maestros jamaicanos. Especialista en old school moves (Willie Bounce, Nuh Linga) y últimas tendencias.',
    knowsAbout: ['Dancehall', 'Dancehall Female', 'Jamaican Dance', 'Old School Dancehall'],
  },
  {
    name: 'Marcos Martínez',
    jobTitle: 'Instructor de Hip Hop y Juez Internacional',
    description:
      'Uno de los referentes del Hip Hop en España. Décadas de experiencia como bailarín, maestro y juez de competiciones internacionales. Combina técnica old school con tendencias actuales.',
    knowsAbout: ['Hip Hop', 'Breaking', 'Locking', 'Popping', 'Urban Dance', 'Old School Hip Hop'],
  },
  {
    name: 'Yasmina Fernández',
    jobTitle:
      'Profesora de Salsa Cubana, Lady Style, Sexy Style y Sexy Reggaeton | Método Farray® desde 2016',
    description:
      'Profesora extraordinariamente versátil certificada en el Método Farray® desde 2016. Destaca por un don de gentes excepcional que le permite conectar con los alumnos. Especialista en salsa cubana, Lady Style, Sexy Style y Sexy Reggaeton.',
    knowsAbout: [
      'Salsa Cubana',
      'Salsa Lady Style',
      'Sexy Style',
      'Sexy Reggaeton',
      'Método Farray®',
    ],
  },
  {
    name: 'Lia Valdes',
    jobTitle: 'Maestra y Artista Internacional Cubana | ENA Cuba | El Rey León París',
    description:
      'Maestra y artista internacional cubana con más de 20 años de carrera artística. Formada en la ENA (Escuela Nacional de Arte de Cuba), ha bailado en la prestigiosa producción "El Rey León" en París. Transmite la alegría y el espíritu del baile caribeño.',
    knowsAbout: [
      'Salsa Cubana',
      'Salsa Lady Style',
      'Cuban Dance',
      'ENA Cuba',
      'El Rey León',
      'Teatro Musical',
    ],
  },
  {
    name: 'Iroel Bastarreche',
    jobTitle:
      'Profesor de Folklore Cubano y Afro Contemporáneo | Ballet Folklórico de Camagüey | Método Farray®',
    description:
      'Conocido como Iro, formado en la Escuela Vocacional de Arte de Cuba. Integrante del Conjunto Artístico de Maraguán y Ballet Folklórico de Camagüey. Desde 2014 se forma en el Método Farray®, convirtiéndose en referente del folklore afrocubano en Barcelona.',
    knowsAbout: [
      'Folklore Cubano',
      'Afro Contemporáneo',
      'Ballet Folklórico de Camagüey',
      'Danzas Afrocaribeñas',
      'Rumba',
      'Método Farray®',
    ],
  },
  {
    name: 'Charlie Breezy',
    jobTitle: 'Profesor de Afro Contemporáneo, Hip Hop y Afrobeats',
    description:
      'Maestro internacional y bailarín cubano formado en la ENA. Domina danza africana como el Afrobeats, contemporáneo, ballet y danzas urbanas. Versatilidad y formación académica excepcional.',
    knowsAbout: [
      'Afro Contemporáneo',
      'Hip Hop',
      'Afrobeats',
      'African Dance',
      'Ballet',
      'Contemporary',
      'ENA Cuba',
    ],
  },
  {
    name: 'Eugenia Trujillo',
    jobTitle: 'Campeona Mundial Salsa LA y Profesora de Bachata',
    description:
      "Maestra y bailarina internacional uruguaya, campeona mundial de Salsa LA junto a Mathias Font. Técnica impecable, especialista en bachata en pareja y bachata lady style con 4 años en Farray's.",
    knowsAbout: [
      'Bachata Lady Style',
      'Bachata en Pareja',
      'Salsa LA',
      'Latin Dance',
      'Campeonato Mundial',
    ],
  },
  {
    name: 'Mathias Font',
    jobTitle: 'Campeón Mundial Salsa LA e Instructor de Bachata',
    description:
      'Campeón mundial de Salsa LA junto a Eugenia Trujillo. Especialista en bachata sensual con enfoque único en musicalidad, conexión en pareja y dinamización de clases. Referente en Barcelona.',
    knowsAbout: [
      'Bachata',
      'Bachata Sensual',
      'Salsa LA',
      'Campeonato Mundial',
      'Musicalidad',
      'Conexión en Pareja',
    ],
  },
  {
    name: 'Carlos Canto',
    jobTitle: 'Instructor de Bachata | Talento Emergente Barcelona',
    description:
      'Talento emergente muy querido de sus alumnos con gran capacidad para conectar. Especialista en bachata con enfoque en técnica y musicalidad. Uno de los profesores más valorados de la escuela.',
    knowsAbout: ['Bachata', 'Bachata Moderna', 'Latin Dance', 'Musicalidad'],
  },
  {
    name: 'Noemi',
    jobTitle: 'Instructora de Bachata Lady Style | Talento Emergente Barcelona',
    description:
      'Talento emergente con excelentes dones de gente que le permiten conectar inmediatamente con sus alumnos. Pareja de Carlos Canto, una de las parejas más prometedoras de Barcelona. Especialista en bachata y técnicas femeninas.',
    knowsAbout: ['Bachata', 'Bachata Lady Style', 'Latin Dance', 'Técnicas Femeninas'],
  },
  {
    name: 'Redblueh',
    jobTitle: 'Instructor de Afrobeats y Ntcham',
    description:
      'Profesor y bailarín internacional nativo de Tanzania, especialista en Ntcham. Sus raíces africanas y alegría contagiante lo convierten en uno de los más recomendados de Barcelona.',
    knowsAbout: ['Afrobeats', 'Ntcham', 'African Dance', 'Tanzanian Dance'],
  },
  {
    name: 'Juan Alvarez',
    jobTitle: 'Profesor de Bachata Sensual | Método Farray® | Talento Emergente Barcelona',
    description:
      'Instructor de Bachata Sensual certificado en el Método Farray®. Posee una capacidad extraordinaria para conectar desde el primer momento con sus alumnos. Transmite la esencia del baile latino con pasión y técnica depurada.',
    knowsAbout: ['Bachata Sensual', 'Latin Dance', 'Método Farray®', 'Musicalidad', 'Conexión'],
  },
  {
    name: 'CrisAg',
    jobTitle:
      'Instructora de Body Conditioning, Cuerpo Fit, Bum Bum Glúteos y Stretching | Método Farray® desde 2012',
    description:
      'Licenciada en Filología Inglesa por la UB. Formada con Jorge Camagüey y en The Cuban School of Arts de Londres. Desde 2012 se forma en el Método Farray® y trabaja como profesora, convirtiéndose en referente del acondicionamiento corporal para bailarines en Barcelona.',
    knowsAbout: [
      'Body Conditioning',
      'Cuerpo Fit',
      'Bum Bum Glúteos',
      'Stretching',
      'Fitness',
      'Método Farray®',
    ],
  },
  {
    name: 'Grechén Méndez',
    jobTitle: 'Maestra Internacional de Danzas Afrocubanas | ISA Cuba | +25 años experiencia',
    description:
      'Maestra internacional de referencia en danzas afrocubanas con más de 25 años dedicados a la enseñanza del folklore cubano. Formada en el ISA (Instituto Superior de Arte de Cuba). Autoridad mundial en danzas a los Orishas y rumba.',
    knowsAbout: [
      'Danzas Afrocubanas',
      'Folklore Cubano',
      'Rumba',
      'Danzas a los Orishas',
      'ISA Cuba',
    ],
  },
];
