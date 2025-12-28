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
export const DIRECTOR_INFO: TeacherPageInfo = {
  id: 'yunaisy-farray',
  name: 'Yunaisy Farray',
  image: '/images/teachers/img/maestra-yunaisy-farray_320.webp',
  specialtyKey: 'teachersPageDirectorSpecialty',
  bioKey: 'teachersPageDirectorBio',
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
export const TEACHERS_LIST: TeacherPageInfo[] = [
  {
    id: 'daniel-sene',
    name: 'Daniel Sené',
    image: '/images/teachers/img/profesor-daniel-sen-_320.webp',
    specialtyKey: 'teachersPageTeacher1Specialty',
    bioKey: 'teachersPageTeacher1Bio',
    styles: ['Ballet Clásico', 'Contemporáneo'],
  },
  {
    id: 'alejandro-minoso',
    name: 'Alejandro Miñoso',
    image: '/images/teachers/img/profesor-alejandro-mi-oso_320.webp',
    specialtyKey: 'teachersPageTeacher2Specialty',
    bioKey: 'teachersPageTeacher2Bio',
    styles: ['Ballet', 'Modern Jazz', 'Afro Jazz', 'Afro Contemporáneo'],
  },
  {
    id: 'sandra-gomez',
    name: 'Sandra Gómez',
    image: '/images/teachers/img/profesora-sandra-gomez_320.webp',
    specialtyKey: 'teachersPageTeacher3Specialty',
    bioKey: 'teachersPageTeacher3Bio',
    styles: ['Dancehall', 'Twerk'],
  },
  {
    id: 'isabel-lopez',
    name: 'Isabel López',
    image: '/images/teachers/img/profesora-isabel-l-pez_320.webp',
    specialtyKey: 'teachersPageTeacher4Specialty',
    bioKey: 'teachersPageTeacher4Bio',
    styles: ['Dancehall', 'Twerk'],
  },
  {
    id: 'marcos-martinez',
    name: 'Marcos Martínez',
    image: '/images/teachers/img/profesor-marcos-mart-nez_320.webp',
    specialtyKey: 'teachersPageTeacher5Specialty',
    bioKey: 'teachersPageTeacher5Bio',
    styles: ['Hip Hop', 'Breaking', 'Locking', 'Popping'],
  },
  {
    id: 'yasmina-fernandez',
    name: 'Yasmina Fernández',
    image: '/images/teachers/img/profesora-yasmina-fern-ndez_320.webp',
    specialtyKey: 'teachersPageTeacher6Specialty',
    bioKey: 'teachersPageTeacher6Bio',
    styles: ['Salsa Cubana', 'Salsa Lady Style'],
  },
  {
    id: 'lia-valdes',
    name: 'Lia Valdes',
    image: '/images/teachers/img/profesora-lia-valdes_320.webp',
    specialtyKey: 'teachersPageTeacher7Specialty',
    bioKey: 'teachersPageTeacher7Bio',
    styles: ['Salsa Cubana', 'Salsa Lady Style'],
  },
  {
    id: 'iroel-bastarreche',
    name: 'Iroel Bastarreche',
    image: '/images/teachers/img/profesor-iroel-bastarreche_320.webp',
    specialtyKey: 'teachersPageTeacher8Specialty',
    bioKey: 'teachersPageTeacher8Bio',
    styles: ['Salsa Cubana'],
  },
  {
    id: 'charlie-breezy',
    name: 'Charlie Breezy',
    image: '/images/teachers/img/profesor-charlie-breezy_320.webp',
    specialtyKey: 'teachersPageTeacher9Specialty',
    bioKey: 'teachersPageTeacher9Bio',
    styles: ['Afro Contemporáneo', 'Hip Hop'],
  },
  {
    id: 'eugenia-trujillo',
    name: 'Eugenia Trujillo',
    image: '/images/teachers/img/profesora-eugenio-trujillo_320.webp',
    specialtyKey: 'teachersPageTeacher10Specialty',
    bioKey: 'teachersPageTeacher10Bio',
    styles: ['Bachata Lady Style', 'Salsa LA'],
  },
  {
    id: 'mathias-font',
    name: 'Mathias Font',
    image: '/images/teachers/img/profesor-mathias-font_320.webp',
    specialtyKey: 'teachersPageTeacher11Specialty',
    bioKey: 'teachersPageTeacher11Bio',
    styles: ['Bachata', 'Bachata Sensual'],
  },
  {
    id: 'carlos-canto',
    name: 'Carlos Canto',
    image: '/images/teachers/img/profesor-carlos-canto_320.webp',
    specialtyKey: 'teachersPageTeacher12Specialty',
    bioKey: 'teachersPageTeacher12Bio',
    styles: ['Bachata', 'Bachata Moderna'],
  },
  {
    id: 'noemi',
    name: 'Noemi',
    image: '/images/teachers/img/profesora-noemi-guerin-_320.webp',
    specialtyKey: 'teachersPageTeacher13Specialty',
    bioKey: 'teachersPageTeacher13Bio',
    styles: ['Bachata', 'Bachata Lady Style'],
  },
  {
    id: 'redbhlue',
    name: 'Redbhlue',
    image: '/images/teachers/img/profesor-redblueh_320.webp',
    specialtyKey: 'teachersPageTeacher14Specialty',
    bioKey: 'teachersPageTeacher14Bio',
    styles: ['Afrobeats', 'Afro Dance'],
  },
  {
    id: 'juan-alvarez',
    name: 'Juan Alvarez',
    image: '/images/teachers/img/profesor-juan-alvarez_320.webp',
    specialtyKey: 'teachersPageTeacherJuanSpecialty',
    bioKey: 'teachersPageTeacherJuanBio',
    styles: ['Salsa Cubana'],
  },
  {
    id: 'crisag',
    name: 'CrisAg',
    image: '/images/teachers/img/profesora-crisag_320.webp',
    specialtyKey: 'teachersPageTeacherCrisagSpecialty',
    bioKey: 'teachersPageTeacherCrisagBio',
    styles: ['Urban Dance'],
  },
  {
    id: 'grechen-mendez',
    name: 'Grechen Méndez',
    image: '/images/teachers/img/profesora-grechen-m-ndez_320.webp',
    specialtyKey: 'teachersPageTeacherGrechenSpecialty',
    bioKey: 'teachersPageTeacherGrechenBio',
    styles: ['Bachata', 'Salsa'],
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
    jobTitle: "Directora y Fundadora de Farray's International Dance Center",
    description:
      'Bailarina profesional cubana, creadora del Método Farray, miembro del CID UNESCO.',
    knowsAbout: [
      'Afro Jazz',
      'Salsa Lady Style',
      'Bachata Lady Style',
      'Afro Contemporáneo',
      'Salsa Cubana',
      'Método Farray',
    ],
  },
  {
    name: 'Daniel Sené',
    jobTitle: 'Profesor de Ballet Clásico',
    description: 'Bailarín profesional formado en la Escuela Nacional de Arte de Cuba.',
    knowsAbout: ['Ballet Clásico', 'Técnica Cubana', 'Danza Contemporánea'],
  },
  {
    name: 'Alejandro Miñoso',
    jobTitle: 'Profesor de Ballet y Afro Jazz',
    description: 'Bailarín profesional cubano con formación en la ENA.',
    knowsAbout: ['Ballet', 'Modern Jazz', 'Afro Jazz', 'Afro Contemporáneo'],
  },
  {
    name: 'Sandra Gómez',
    jobTitle: 'Instructora de Dancehall y Twerk',
    description: 'Especialista en Dancehall y Twerk con amplia experiencia en pedagogía.',
    knowsAbout: ['Dancehall', 'Twerk', 'Urban Dance', 'Choreography'],
  },
  {
    name: 'Isabel López',
    jobTitle: 'Instructora de Dancehall',
    description: 'Especialista en Dancehall con experiencia en competiciones internacionales.',
    knowsAbout: ['Dancehall', 'Dancehall Female', 'Twerk', 'Jamaican Dance'],
  },
  {
    name: 'Marcos Martínez',
    jobTitle: 'Instructor de Hip Hop',
    description: 'Juez internacional de Hip Hop con amplia experiencia en competiciones.',
    knowsAbout: ['Hip Hop', 'Breaking', 'Locking', 'Popping', 'Urban Dance'],
  },
  {
    name: 'Yasmina Fernández',
    jobTitle: 'Profesora de Salsa Cubana',
    description: 'Bailarina profesional especializada en estilos latinos cubanos.',
    knowsAbout: ['Salsa Cubana', 'Salsa Lady Style', 'Casino'],
  },
  {
    name: 'Lia Valdes',
    jobTitle: 'Maestra y Artista Internacional Cubana',
    description: 'Con más de 20 años de carrera artística en salsa cubana.',
    knowsAbout: ['Salsa Cubana', 'Salsa Lady Style', 'Cuban Dance'],
  },
  {
    name: 'Iroel Bastarreche',
    jobTitle: 'Profesor de Salsa Cubana',
    description: 'Instructor certificado en el Método Farray para Salsa Cubana.',
    knowsAbout: ['Salsa Cubana', 'Casino', 'Método Farray'],
  },
  {
    name: 'Charlie Breezy',
    jobTitle: 'Profesor de Afro Contemporáneo',
    description: 'Bailarín profesional con experiencia en estilos afro y urbanos.',
    knowsAbout: ['Afro Contemporáneo', 'Hip Hop', 'Urban Dance', 'African Dance'],
  },
  {
    name: 'Eugenia Trujillo',
    jobTitle: 'Campeona Mundial Salsa LA',
    description: 'Campeona mundial de Salsa LA y especialista en Bachata Lady Style.',
    knowsAbout: ['Bachata Lady Style', 'Salsa LA', 'Latin Dance'],
  },
  {
    name: 'Mathias Font',
    jobTitle: 'Instructor de Bachata',
    description: 'Especialista en Bachata y Bachata Sensual con técnica depurada.',
    knowsAbout: ['Bachata', 'Bachata Sensual', 'Latin Dance'],
  },
  {
    name: 'Carlos Canto',
    jobTitle: 'Instructor de Bachata',
    description: 'Profesor de Bachata con enfoque en técnica y musicalidad.',
    knowsAbout: ['Bachata', 'Bachata Moderna', 'Latin Dance'],
  },
  {
    name: 'Noemi',
    jobTitle: 'Instructora de Bachata',
    description: 'Especialista en Bachata y Bachata Lady Style.',
    knowsAbout: ['Bachata', 'Bachata Lady Style', 'Latin Dance'],
  },
  {
    name: 'Redbhlue',
    jobTitle: 'Instructor de Afrobeats',
    description: 'Especialista en Afrobeats y danzas africanas contemporáneas.',
    knowsAbout: ['Afrobeats', 'Afro Dance', 'African Dance', 'Urban Dance'],
  },
  {
    name: 'Juan Alvarez',
    jobTitle: 'Profesor de Salsa Cubana',
    description: 'Instructor de Salsa Cubana con amplia experiencia en el estilo cubano.',
    knowsAbout: ['Salsa Cubana', 'Casino', 'Cuban Dance'],
  },
  {
    name: 'CrisAg',
    jobTitle: 'Instructora de Urban Dance',
    description: 'Bailarina profesional especializada en estilos urbanos contemporáneos.',
    knowsAbout: ['Urban Dance', 'Street Dance', 'Contemporary Urban'],
  },
  {
    name: 'Grechen Méndez',
    jobTitle: 'Instructora de Bachata y Salsa',
    description: 'Profesora con experiencia en bailes latinos y estilos caribeños.',
    knowsAbout: ['Bachata', 'Salsa', 'Latin Dance', 'Caribbean Dance'],
  },
];
