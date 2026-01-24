import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const esPath = path.join(__dirname, '../i18n/locales/es.ts');

let content = fs.readFileSync(esPath, 'utf8');

const translations = `
  // =============================================
  // TEACHER SCHEMA TRANSLATIONS (SEO)
  // =============================================
  'teacherSchema.yunaisyFarray.jobTitle':
    "Directora y Fundadora de Farray's International Dance Center | Bailarina de Hollywood",
  'teacherSchema.yunaisyFarray.description':
    'Bailarina de Hollywood y profesional cubana formada en la ENA, creadora del Metodo Farray que integra la rigurosidad de la escuela rusa de ballet clasico con las raices afrocubanas, adaptada para bailarines europeos. Actriz en Street Dance 2, finalista de Got Talent y miembro del CID UNESCO. Mas de 25 anos de experiencia internacional.',

  'teacherSchema.danielSene.jobTitle':
    'Profesor de Ballet Clasico, Contemporaneo, Yoga, Tai-Chi y Stretching | Escuela Nacional de Ballet de Cuba | Referente Nacional',
  'teacherSchema.danielSene.description':
    'Bailarin profesional formado en la prestigiosa Escuela Nacional de Ballet de Cuba. Especialista en tecnica clasica cubana y danza contemporanea. Profundo conocedor del cuerpo humano, tambien se destaca por su maestria en Yoga, Tai-Chi y Stretching. Referente nacional que combina precision tecnica con bienestar corporal.',

  'teacherSchema.alejandroMinoso.jobTitle':
    'Profesor de Ballet, Modern Jazz, Afro Jazz y Contemporaneo | Ex Solista Compania Carlos Acosta',
  'teacherSchema.alejandroMinoso.description':
    'Bailarin profesional cubano formado en la ENA y ex solista de la prestigiosa compania Carlos Acosta, uno de los mejores bailarines de la historia. Versatil en fusion de estilos clasicos, afro y contemporaneo.',

  'teacherSchema.sandraGomez.jobTitle': 'Instructora de Dancehall y Twerk | Formacion Jamaicana',
  'teacherSchema.sandraGomez.description':
    'Bailarina profesional con formacion jamaicana autentica en dancehall y twerk. Su estilo fusiona Twerk/Bootydance con la esencia jamaicana genuina. Tecnica impecable y metodologia probada.',

  'teacherSchema.isabelLopez.jobTitle': 'Instructora de Dancehall Female',
  'teacherSchema.isabelLopez.description':
    'Apasionada del dancehall con mas de 5 anos de experiencia. Entrenada con maestros jamaicanos. Especialista en old school moves (Willie Bounce, Nuh Linga) y ultimas tendencias.',

  'teacherSchema.marcosMartinez.jobTitle': 'Instructor de Hip Hop y Juez Internacional',
  'teacherSchema.marcosMartinez.description':
    'Uno de los referentes del Hip Hop en Espana. Decadas de experiencia como bailarin, maestro y juez de competiciones internacionales. Combina tecnica old school con tendencias actuales.',

  'teacherSchema.yasminaFernandez.jobTitle':
    'Profesora de Salsa Cubana, Lady Style, Sexy Style y Sexy Reggaeton | Metodo Farray desde 2016',
  'teacherSchema.yasminaFernandez.description':
    'Profesora extraordinariamente versatil certificada en el Metodo Farray desde 2016. Destaca por un don de gentes excepcional que le permite conectar con los alumnos. Especialista en salsa cubana, Lady Style, Sexy Style y Sexy Reggaeton.',

  'teacherSchema.liaValdes.jobTitle':
    'Maestra y Artista Internacional Cubana | ENA Cuba | El Rey Leon Paris',
  'teacherSchema.liaValdes.description':
    'Maestra y artista internacional cubana con mas de 20 anos de carrera artistica. Formada en la ENA (Escuela Nacional de Arte de Cuba), ha bailado en la prestigiosa produccion El Rey Leon en Paris. Transmite la alegria y el espiritu del baile caribeno.',

  'teacherSchema.iroelBastarreche.jobTitle':
    'Profesor de Salsa Cubana | Ballet Folklorico de Camaguey | Metodo Farray',
  'teacherSchema.iroelBastarreche.description':
    'Conocido como Iro, formado en la Escuela Vocacional de Arte de Cuba. Integrante del Conjunto Artistico de Marragan y Ballet Folklorico de Camaguey. Desde 2014 se forma en el Metodo Farray, convirtiendose en referente de la salsa cubana en Barcelona.',

  'teacherSchema.charlieBreezy.jobTitle':
    'Profesor de Afro Contemporaneo, Hip Hop y Afrobeats',
  'teacherSchema.charlieBreezy.description':
    'Maestro internacional y bailarin cubano formado en la ENA. Domina danza africana como el Afrobeats, contemporaneo, ballet y danzas urbanas. Versatilidad y formacion academica excepcional.',

  'teacherSchema.eugeniaTrujillo.jobTitle':
    'Campeona Mundial Salsa LA y Profesora de Bachata',
  'teacherSchema.eugeniaTrujillo.description':
    'Maestra y bailarina internacional uruguaya, campeona mundial de Salsa LA junto a Mathias Font. Tecnica impecable, especialista en bachata en pareja y bachata lady style con 4 anos en Farrays.',

  'teacherSchema.mathiasFont.jobTitle':
    'Campeon Mundial Salsa LA e Instructor de Bachata',
  'teacherSchema.mathiasFont.description':
    'Campeon mundial de Salsa LA junto a Eugenia Trujillo. Especialista en bachata sensual con enfoque unico en musicalidad, conexion en pareja y dinamizacion de clases. Referente en Barcelona.',

  'teacherSchema.carlosCanto.jobTitle':
    'Instructor de Bachata | Talento Emergente Barcelona',
  'teacherSchema.carlosCanto.description':
    'Talento emergente muy querido de sus alumnos con gran capacidad para conectar. Especialista en bachata con enfoque en tecnica y musicalidad. Uno de los profesores mas valorados de la escuela.',

  'teacherSchema.noemi.jobTitle':
    'Instructora de Bachata Lady Style | Talento Emergente Barcelona',
  'teacherSchema.noemi.description':
    'Talento emergente con excelentes dones de gente que le permiten conectar inmediatamente con sus alumnos. Pareja de Carlos Canto, una de las parejas mas prometedoras de Barcelona. Especialista en bachata y tecnicas femeninas.',

  'teacherSchema.redblueh.jobTitle': 'Instructor de Afrobeats y Ntcham',
  'teacherSchema.redblueh.description':
    'Profesor y bailarin internacional nativo de Tanzania, especialista en Ntcham. Sus raices africanas y alegria contagiante lo convierten en uno de los mas recomendados de Barcelona.',

  'teacherSchema.juanAlvarez.jobTitle':
    'Profesor de Bachata Sensual | Metodo Farray | Talento Emergente Barcelona',
  'teacherSchema.juanAlvarez.description':
    'Instructor de Bachata Sensual certificado en el Metodo Farray. Posee una capacidad extraordinaria para conectar desde el primer momento con sus alumnos. Transmite la esencia del baile latino con pasion y tecnica depurada.',

  'teacherSchema.crisAg.jobTitle':
    'Instructora de Body Conditioning, Cuerpo Fit, Bum Bum Gluteos y Stretching | Metodo Farray desde 2012',
  'teacherSchema.crisAg.description':
    'Licenciada en Filologia Inglesa por la UB. Formada con Jorge Camaguey y en The Cuban School of Arts de Londres. Desde 2012 se forma en el Metodo Farray y trabaja como profesora, convirtiendose en referente del acondicionamiento corporal para bailarines en Barcelona.',

  'teacherSchema.grechenMendez.jobTitle':
    'Maestra Internacional de Danzas Afrocubanas | ISA Cuba | +25 anos experiencia',
  'teacherSchema.grechenMendez.description':
    'Maestra internacional de referencia en danzas afrocubanas con mas de 25 anos dedicados a la ensenanza del folklore cubano. Formada en el ISA (Instituto Superior de Arte de Cuba). Autoridad mundial en danzas a los Orishas y rumba.',
`;

// Insert before the closing of the translations object
const insertPoint = content.lastIndexOf('} as const');
if (insertPoint !== -1) {
  content = content.slice(0, insertPoint) + translations + '\n' + content.slice(insertPoint);
}

fs.writeFileSync(esPath, content, 'utf8');
console.log('Spanish teacher schema translations added!');
