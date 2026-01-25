import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const caPath = path.join(__dirname, '../i18n/locales/ca.ts');

let content = fs.readFileSync(caPath, 'utf8');

const translations = `
  // =============================================
  // TEACHER SCHEMA TRANSLATIONS (SEO)
  // =============================================
  'teacherSchema.yunaisyFarray.jobTitle':
    "Directora i Fundadora de Farray's International Dance Center | Ballarina de Hollywood",
  'teacherSchema.yunaisyFarray.description':
    "Ballarina de Hollywood i professional cubana formada a l'ENA, creadora del Metode Farray que integra la rigorositat de l'escola russa de ballet classic amb les arrels afrocubanes, adaptada per a ballarins europeus. Actriu a Street Dance 2, finalista de Got Talent i membre del CID UNESCO. Mes de 25 anys d'experiencia internacional.",

  'teacherSchema.danielSene.jobTitle':
    "Professor de Ballet Classic, Contemporani, Ioga, Tai-Chi i Stretching | Escola Nacional de Ballet de Cuba | Referent Nacional",
  'teacherSchema.danielSene.description':
    "Ballari professional format a la prestigiosa Escola Nacional de Ballet de Cuba. Especialista en tecnica classica cubana i dansa contemporania. Profund coneixedor del cos huma, tambe es destaca per la seva mestria en Ioga, Tai-Chi i Stretching. Referent nacional que combina precisio tecnica amb benestar corporal.",

  'teacherSchema.alejandroMinoso.jobTitle':
    "Professor de Ballet, Modern Jazz, Afro Jazz i Contemporani | Ex Solista Companyia Carlos Acosta",
  'teacherSchema.alejandroMinoso.description':
    "Ballari professional cuba format a l'ENA i ex solista de la prestigiosa companyia Carlos Acosta, un dels millors ballarins de la historia. Versatil en fusio d'estils classics, afro i contemporani.",

  'teacherSchema.sandraGomez.jobTitle': "Instructora de Dancehall i Twerk | Formacio Jamaicana",
  'teacherSchema.sandraGomez.description':
    "Ballarina professional amb formacio jamaicana autentica en dancehall i twerk. El seu estil fusiona Twerk/Bootydance amb l'essencia jamaicana genuina. Tecnica impecable i metodologia provada.",

  'teacherSchema.isabelLopez.jobTitle': "Instructora de Dancehall Female",
  'teacherSchema.isabelLopez.description':
    "Apassionada del dancehall amb mes de 5 anys d'experiencia. Entrenada amb mestres jamaicans. Especialista en old school moves (Willie Bounce, Nuh Linga) i ultimes tendencies.",

  'teacherSchema.marcosMartinez.jobTitle': "Instructor de Hip Hop i Jutge Internacional",
  'teacherSchema.marcosMartinez.description':
    "Un dels referents del Hip Hop a Espanya. Decades d'experiencia com a ballari, mestre i jutge de competicions internacionals. Combina tecnica old school amb tendencies actuals.",

  'teacherSchema.yasminaFernandez.jobTitle':
    "Professora de Salsa Cubana, Lady Style, Sexy Style i Sexy Reggaeton | Metode Farray des de 2016",
  'teacherSchema.yasminaFernandez.description':
    "Professora extraordinariament versatil certificada en el Metode Farray des de 2016. Destaca per un do de gents excepcional que li permet connectar amb els alumnes. Especialista en salsa cubana, Lady Style, Sexy Style i Sexy Reggaeton.",

  'teacherSchema.liaValdes.jobTitle':
    "Mestra i Artista Internacional Cubana | ENA Cuba | El Rei Lleo Paris",
  'teacherSchema.liaValdes.description':
    "Mestra i artista internacional cubana amb mes de 20 anys de carrera artistica. Formada a l'ENA (Escola Nacional d'Art de Cuba), ha ballat a la prestigiosa produccio El Rei Lleo a Paris. Transmet l'alegria i l'esperit del ball caribeny.",

  'teacherSchema.iroelBastarreche.jobTitle':
    "Professor de Salsa Cubana | Ballet Folkloric de Camaguey | Metode Farray",
  'teacherSchema.iroelBastarreche.description':
    "Conegut com a Iro, format a l'Escola Vocacional d'Art de Cuba. Integrant del Conjunt Artistic de Marragan i Ballet Folkloric de Camaguey. Des de 2014 es forma en el Metode Farray, convertint-se en referent de la salsa cubana a Barcelona.",

  'teacherSchema.charlieBreezy.jobTitle':
    "Professor d'Afro Contemporani, Hip Hop i Afrobeats",
  'teacherSchema.charlieBreezy.description':
    "Mestre internacional i ballari cuba format a l'ENA. Domina dansa africana com l'Afrobeats, contemporani, ballet i danses urbanes. Versatilitat i formacio academica excepcional.",

  'teacherSchema.eugeniaTrujillo.jobTitle':
    "Campiona Mundial Salsa LA i Professora de Bachata",
  'teacherSchema.eugeniaTrujillo.description':
    "Mestra i ballarina internacional uruguaiana, campiona mundial de Salsa LA juntament amb Mathias Font. Tecnica impecable, especialista en bachata en parella i bachata lady style amb 4 anys a Farrays.",

  'teacherSchema.mathiasFont.jobTitle':
    "Campio Mundial Salsa LA i Instructor de Bachata",
  'teacherSchema.mathiasFont.description':
    "Campio mundial de Salsa LA juntament amb Eugenia Trujillo. Especialista en bachata sensual amb enfocament unic en musicalitat, connexio en parella i dinamitzacio de classes. Referent a Barcelona.",

  'teacherSchema.carlosCanto.jobTitle':
    "Instructor de Bachata | Talent Emergent Barcelona",
  'teacherSchema.carlosCanto.description':
    "Talent emergent molt estimat pels seus alumnes amb gran capacitat per connectar. Especialista en bachata amb enfocament en tecnica i musicalitat. Un dels professors mes valorats de l'escola.",

  'teacherSchema.noemi.jobTitle':
    "Instructora de Bachata Lady Style | Talent Emergent Barcelona",
  'teacherSchema.noemi.description':
    "Talent emergent amb excel·lents dons de gent que li permeten connectar immediatament amb els seus alumnes. Parella de Carlos Canto, una de les parelles mes prometedores de Barcelona. Especialista en bachata i tecniques femenines.",

  'teacherSchema.redblueh.jobTitle': "Instructor d'Afrobeats i Ntcham",
  'teacherSchema.redblueh.description':
    "Professor i ballari internacional natiu de Tanzania, especialista en Ntcham. Les seves arrels africanes i alegria contagiosa el converteixen en un dels mes recomanats de Barcelona.",

  'teacherSchema.juanAlvarez.jobTitle':
    "Professor de Bachata Sensual | Metode Farray | Talent Emergent Barcelona",
  'teacherSchema.juanAlvarez.description':
    "Instructor de Bachata Sensual certificat en el Metode Farray. Posseeix una capacitat extraordinaria per connectar des del primer moment amb els seus alumnes. Transmet l'essencia del ball llati amb passio i tecnica depurada.",

  'teacherSchema.crisAg.jobTitle':
    "Instructora de Body Conditioning, Cos Fit, Bum Bum Glutis i Stretching | Metode Farray des de 2012",
  'teacherSchema.crisAg.description':
    "Llicenciada en Filologia Anglesa per la UB. Formada amb Jorge Camaguey i a The Cuban School of Arts de Londres. Des de 2012 es forma en el Metode Farray i treballa com a professora, convertint-se en referent de l'acondicionament corporal per a ballarins a Barcelona.",

  'teacherSchema.grechenMendez.jobTitle':
    "Mestra Internacional de Danses Afrocubanes | ISA Cuba | +25 anys experiencia",
  'teacherSchema.grechenMendez.description':
    "Mestra internacional de referencia en danses afrocubanes amb mes de 25 anys dedicats a l'ensenyament del folklore cuba. Formada a l'ISA (Institut Superior d'Art de Cuba). Autoritat mundial en danses als Orixes i rumba.",
`;

// Insert before the closing of the translations object
const insertPoint = content.lastIndexOf('} as const');
if (insertPoint !== -1) {
  content = content.slice(0, insertPoint) + translations + '\n' + content.slice(insertPoint);
}

fs.writeFileSync(caPath, content, 'utf8');
console.log('Catalan teacher schema translations added!');
