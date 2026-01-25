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
    'Salsa',
    'Heels',
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
    image: '/images/teachers/img/profesor-daniel-sene_320.webp',
    specialtyKey: 'teacher.danielSene.specialty',
    bioKey: 'teacher.danielSene.bio',
    styles: ['Ballet Clásico', 'Contemporáneo', 'Yoga', 'Tai-Chi', 'Stretching'],
  },
  {
    id: 'alejandro-minoso',
    name: 'Alejandro Miñoso',
    image: '/images/teachers/img/profesor-alejandro-minoso_320.webp',
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
    styles: ['Salsa Cubana'],
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
    image: '/images/teachers/img/profesora-greechen-mendez_320.webp',
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
    image: '/images/teachers/img/profesor-marcos-martinez_320.webp',
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
    specialtyKey: 'teacher.crisAg.specialty',
    bioKey: 'teacher.crisAg.bio',
    styles: ['Body Conditioning', 'Cuerpo Fit', 'Bum Bum Glúteos', 'Stretching'],
  },
  // ============================================================================
  // YASMINA (certificada Método Farray®, muy versátil)
  // ============================================================================
  {
    id: 'yasmina-fernandez',
    name: 'Yasmina Fernández',
    image: '/images/teachers/img/profesora-yasmina-fernandez_320.webp',
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
    image: '/images/teachers/img/profesor-redbhlue_320.webp',
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
    image: '/images/teachers/img/profesora-isabel-lopez_320.webp',
    specialtyKey: 'teacher.isabelLopez.specialty',
    bioKey: 'teacher.isabelLopez.bio',
    styles: ['Dancehall', 'Twerk'],
  },
  {
    id: 'eugenia-trujillo',
    name: 'Eugenia Trujillo',
    image: '/images/teachers/img/profesora-eugenia-trujillo_320.webp',
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
    image: '/images/teachers/img/profesora-noemie-guerin_320.webp',
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

// Person schemas for SEO - uses i18n keys for jobTitle and description
export interface TeacherSchemaInfo {
  name: string;
  jobTitleKey: string;
  descriptionKey: string;
  knowsAbout: string[];
}

export const TEACHERS_PERSON_SCHEMAS: TeacherSchemaInfo[] = [
  {
    name: 'Yunaisy Farray',
    jobTitleKey: 'teacherSchema.yunaisyFarray.jobTitle',
    descriptionKey: 'teacherSchema.yunaisyFarray.description',
    knowsAbout: [
      'Afro Jazz',
      'Salsa Lady Style',
      'Bachata Lady Style',
      'Afro Contemporaneo',
      'Salsa Cubana',
      'Salsa',
      'Heels',
      'Metodo Farray',
      'CID-UNESCO',
      'Hollywood',
    ],
  },
  {
    name: 'Daniel Sene',
    jobTitleKey: 'teacherSchema.danielSene.jobTitle',
    descriptionKey: 'teacherSchema.danielSene.description',
    knowsAbout: [
      'Ballet Clasico',
      'Tecnica Cubana',
      'Danza Contemporanea',
      'Yoga',
      'Tai-Chi',
      'Stretching',
      'National Ballet School of Cuba',
    ],
  },
  {
    name: 'Alejandro Minoso',
    jobTitleKey: 'teacherSchema.alejandroMinoso.jobTitle',
    descriptionKey: 'teacherSchema.alejandroMinoso.description',
    knowsAbout: [
      'Ballet',
      'Modern Jazz',
      'Afro Jazz',
      'Afro Contemporaneo',
      'Contemporaneo',
      'ENA Cuba',
      'Carlos Acosta Company',
    ],
  },
  {
    name: 'Sandra Gomez',
    jobTitleKey: 'teacherSchema.sandraGomez.jobTitle',
    descriptionKey: 'teacherSchema.sandraGomez.description',
    knowsAbout: ['Dancehall', 'Twerk', 'Bootydance', 'Urban Dance', 'Jamaican Dance'],
  },
  {
    name: 'Isabel Lopez',
    jobTitleKey: 'teacherSchema.isabelLopez.jobTitle',
    descriptionKey: 'teacherSchema.isabelLopez.description',
    knowsAbout: ['Dancehall', 'Dancehall Female', 'Jamaican Dance', 'Old School Dancehall'],
  },
  {
    name: 'Marcos Martinez',
    jobTitleKey: 'teacherSchema.marcosMartinez.jobTitle',
    descriptionKey: 'teacherSchema.marcosMartinez.description',
    knowsAbout: ['Hip Hop', 'Breaking', 'Locking', 'Popping', 'Urban Dance', 'Old School Hip Hop'],
  },
  {
    name: 'Yasmina Fernandez',
    jobTitleKey: 'teacherSchema.yasminaFernandez.jobTitle',
    descriptionKey: 'teacherSchema.yasminaFernandez.description',
    knowsAbout: [
      'Salsa Cubana',
      'Salsa Lady Style',
      'Sexy Style',
      'Sexy Reggaeton',
      'Metodo Farray',
    ],
  },
  {
    name: 'Lia Valdes',
    jobTitleKey: 'teacherSchema.liaValdes.jobTitle',
    descriptionKey: 'teacherSchema.liaValdes.description',
    knowsAbout: [
      'Salsa Cubana',
      'Salsa Lady Style',
      'Cuban Dance',
      'ENA Cuba',
      'The Lion King',
      'Musical Theatre',
    ],
  },
  {
    name: 'Iroel Bastarreche',
    jobTitleKey: 'teacherSchema.iroelBastarreche.jobTitle',
    descriptionKey: 'teacherSchema.iroelBastarreche.description',
    knowsAbout: ['Salsa Cubana', 'Ballet Folklorico de Camaguey', 'Metodo Farray'],
  },
  {
    name: 'Charlie Breezy',
    jobTitleKey: 'teacherSchema.charlieBreezy.jobTitle',
    descriptionKey: 'teacherSchema.charlieBreezy.description',
    knowsAbout: [
      'Afro Contemporaneo',
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
    jobTitleKey: 'teacherSchema.eugeniaTrujillo.jobTitle',
    descriptionKey: 'teacherSchema.eugeniaTrujillo.description',
    knowsAbout: [
      'Bachata Lady Style',
      'Bachata en Pareja',
      'Salsa LA',
      'Latin Dance',
      'World Championship',
    ],
  },
  {
    name: 'Mathias Font',
    jobTitleKey: 'teacherSchema.mathiasFont.jobTitle',
    descriptionKey: 'teacherSchema.mathiasFont.description',
    knowsAbout: [
      'Bachata',
      'Bachata Sensual',
      'Salsa LA',
      'World Championship',
      'Musicality',
      'Partner Connection',
    ],
  },
  {
    name: 'Carlos Canto',
    jobTitleKey: 'teacherSchema.carlosCanto.jobTitle',
    descriptionKey: 'teacherSchema.carlosCanto.description',
    knowsAbout: ['Bachata', 'Bachata Moderna', 'Latin Dance', 'Musicality'],
  },
  {
    name: 'Noemi',
    jobTitleKey: 'teacherSchema.noemi.jobTitle',
    descriptionKey: 'teacherSchema.noemi.description',
    knowsAbout: ['Bachata', 'Bachata Lady Style', 'Latin Dance', 'Feminine Techniques'],
  },
  {
    name: 'Redblueh',
    jobTitleKey: 'teacherSchema.redbhlue.jobTitle',
    descriptionKey: 'teacherSchema.redbhlue.description',
    knowsAbout: ['Afrobeats', 'Ntcham', 'African Dance', 'Tanzanian Dance'],
  },
  {
    name: 'Juan Alvarez',
    jobTitleKey: 'teacherSchema.juanAlvarez.jobTitle',
    descriptionKey: 'teacherSchema.juanAlvarez.description',
    knowsAbout: ['Bachata Sensual', 'Latin Dance', 'Metodo Farray', 'Musicality', 'Connection'],
  },
  {
    name: 'CrisAg',
    jobTitleKey: 'teacherSchema.crisAg.jobTitle',
    descriptionKey: 'teacherSchema.crisAg.description',
    knowsAbout: [
      'Body Conditioning',
      'Body Fit',
      'Bum Bum Glutes',
      'Stretching',
      'Fitness',
      'Metodo Farray',
    ],
  },
  {
    name: 'Grechen Mendez',
    jobTitleKey: 'teacherSchema.grechenMendez.jobTitle',
    descriptionKey: 'teacherSchema.grechenMendez.description',
    knowsAbout: ['Afro-Cuban Dances', 'Cuban Folklore', 'Rumba', 'Orishas Dances', 'ISA Cuba'],
  },
];
