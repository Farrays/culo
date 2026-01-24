import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frPath = path.join(__dirname, '../i18n/locales/fr.ts');

let content = fs.readFileSync(frPath, 'utf8');

const translations = `
  // =============================================
  // TEACHER SCHEMA TRANSLATIONS (SEO)
  // =============================================
  'teacherSchema.yunaisyFarray.jobTitle':
    "Directrice et Fondatrice du Farray's International Dance Center | Danseuse de Hollywood",
  'teacherSchema.yunaisyFarray.description':
    "Danseuse de Hollywood et professionnelle cubaine formee a l'ENA, creatrice de la Methode Farray qui integre la rigueur de l'ecole russe de ballet classique avec les racines afro-cubaines, adaptee pour les danseurs europeens. Actrice dans Street Dance 2, finaliste de Got Talent et membre du CID UNESCO. Plus de 25 ans d'experience internationale.",

  'teacherSchema.danielSene.jobTitle':
    "Professeur de Ballet Classique, Contemporain, Yoga, Tai-Chi et Stretching | Ecole Nationale de Ballet de Cuba | Reference Nationale",
  'teacherSchema.danielSene.description':
    "Danseur professionnel forme a la prestigieuse Ecole Nationale de Ballet de Cuba. Specialiste de la technique classique cubaine et de la danse contemporaine. Grand connaisseur du corps humain, il se distingue egalement par sa maitrise du Yoga, Tai-Chi et Stretching. Reference nationale combinant precision technique et bien-etre corporel.",

  'teacherSchema.alejandroMinoso.jobTitle':
    "Professeur de Ballet, Modern Jazz, Afro Jazz et Contemporain | Ex Soliste Compagnie Carlos Acosta",
  'teacherSchema.alejandroMinoso.description':
    "Danseur professionnel cubain forme a l'ENA et ex soliste de la prestigieuse compagnie Carlos Acosta, l'un des meilleurs danseurs de l'histoire. Polyvalent dans la fusion de styles classiques, afro et contemporain.",

  'teacherSchema.sandraGomez.jobTitle': "Instructrice de Dancehall et Twerk | Formation Jamaicaine",
  'teacherSchema.sandraGomez.description':
    "Danseuse professionnelle avec formation jamaicaine authentique en dancehall et twerk. Son style fusionne Twerk/Bootydance avec l'essence jamaicaine veritable. Technique impeccable et methodologie eprouvee.",

  'teacherSchema.isabelLopez.jobTitle': "Instructrice de Dancehall Female",
  'teacherSchema.isabelLopez.description':
    "Passionnee de dancehall avec plus de 5 ans d'experience. Formee avec des maitres jamaicains. Specialiste des old school moves (Willie Bounce, Nuh Linga) et dernieres tendances.",

  'teacherSchema.marcosMartinez.jobTitle': "Instructeur de Hip Hop et Juge International",
  'teacherSchema.marcosMartinez.description':
    "L'une des references du Hip Hop en Espagne. Des decennies d'experience comme danseur, maitre et juge de competitions internationales. Combine technique old school et tendances actuelles.",

  'teacherSchema.yasminaFernandez.jobTitle':
    "Professeure de Salsa Cubaine, Lady Style, Sexy Style et Sexy Reggaeton | Methode Farray depuis 2016",
  'teacherSchema.yasminaFernandez.description':
    "Professeure extraordinairement polyvalente certifiee dans la Methode Farray depuis 2016. Se distingue par un don exceptionnel pour les relations humaines qui lui permet de connecter avec les eleves. Specialiste de la salsa cubaine, Lady Style, Sexy Style et Sexy Reggaeton.",

  'teacherSchema.liaValdes.jobTitle':
    "Maitre et Artiste Internationale Cubaine | ENA Cuba | Le Roi Lion Paris",
  'teacherSchema.liaValdes.description':
    "Maitre et artiste internationale cubaine avec plus de 20 ans de carriere artistique. Formee a l'ENA (Ecole Nationale d'Art de Cuba), elle a danse dans la prestigieuse production Le Roi Lion a Paris. Transmet la joie et l'esprit de la danse caribeenne.",

  'teacherSchema.iroelBastarreche.jobTitle':
    "Professeur de Salsa Cubaine | Ballet Folklorique de Camaguey | Methode Farray",
  'teacherSchema.iroelBastarreche.description':
    "Connu sous le nom d'Iro, forme a l'Ecole Vocationnelle d'Art de Cuba. Membre de l'Ensemble Artistique de Marragan et Ballet Folklorique de Camaguey. Depuis 2014 se forme dans la Methode Farray, devenant une reference de la salsa cubaine a Barcelone.",

  'teacherSchema.charlieBreezy.jobTitle':
    "Professeur d'Afro Contemporain, Hip Hop et Afrobeats",
  'teacherSchema.charlieBreezy.description':
    "Maitre international et danseur cubain forme a l'ENA. Maitrise la danse africaine comme l'Afrobeats, contemporain, ballet et danses urbaines. Polyvalence et formation academique exceptionnelle.",

  'teacherSchema.eugeniaTrujillo.jobTitle':
    "Championne du Monde Salsa LA et Professeure de Bachata",
  'teacherSchema.eugeniaTrujillo.description':
    "Maitre et danseuse internationale uruguayenne, championne du monde de Salsa LA avec Mathias Font. Technique impeccable, specialiste de la bachata en couple et bachata lady style avec 4 ans chez Farrays.",

  'teacherSchema.mathiasFont.jobTitle':
    "Champion du Monde Salsa LA et Instructeur de Bachata",
  'teacherSchema.mathiasFont.description':
    "Champion du monde de Salsa LA avec Eugenia Trujillo. Specialiste de la bachata sensuelle avec approche unique de la musicalite, connexion en couple et dynamisation des cours. Reference a Barcelone.",

  'teacherSchema.carlosCanto.jobTitle':
    "Instructeur de Bachata | Talent Emergent Barcelone",
  'teacherSchema.carlosCanto.description':
    "Talent emergent tres apprecie de ses eleves avec grande capacite a connecter. Specialiste de la bachata avec focus sur technique et musicalite. L'un des professeurs les plus values de l'ecole.",

  'teacherSchema.noemi.jobTitle':
    "Instructrice de Bachata Lady Style | Talent Emergent Barcelone",
  'teacherSchema.noemi.description':
    "Talent emergent avec d'excellentes competences relationnelles qui lui permettent de connecter immediatement avec ses eleves. Partenaire de Carlos Canto, l'un des couples les plus prometteurs de Barcelone. Specialiste de la bachata et techniques feminines.",

  'teacherSchema.redblueh.jobTitle': "Instructeur d'Afrobeats et Ntcham",
  'teacherSchema.redblueh.description':
    "Professeur et danseur international natif de Tanzanie, specialiste du Ntcham. Ses racines africaines et sa joie contagieuse en font l'un des plus recommandes de Barcelone.",

  'teacherSchema.juanAlvarez.jobTitle':
    "Professeur de Bachata Sensuelle | Methode Farray | Talent Emergent Barcelone",
  'teacherSchema.juanAlvarez.description':
    "Instructeur de Bachata Sensuelle certifie dans la Methode Farray. Possede une capacite extraordinaire a connecter des le premier moment avec ses eleves. Transmet l'essence de la danse latine avec passion et technique raffinee.",

  'teacherSchema.crisAg.jobTitle':
    "Instructrice de Body Conditioning, Corps Fit, Bum Bum Fessiers et Stretching | Methode Farray depuis 2012",
  'teacherSchema.crisAg.description':
    "Diplomee en Philologie Anglaise de l'UB. Formee avec Jorge Camaguey et a The Cuban School of Arts de Londres. Depuis 2012 se forme dans la Methode Farray et travaille comme professeure, devenant une reference du conditionnement corporel pour danseurs a Barcelone.",

  'teacherSchema.grechenMendez.jobTitle':
    "Maitre Internationale de Danses Afro-cubaines | ISA Cuba | +25 ans experience",
  'teacherSchema.grechenMendez.description':
    "Maitre internationale de reference en danses afro-cubaines avec plus de 25 ans consacres a l'enseignement du folklore cubain. Formee a l'ISA (Institut Superieur d'Art de Cuba). Autorite mondiale sur les danses aux Orishas et la rumba.",
`;

// Insert before the closing of the translations object
const insertPoint = content.lastIndexOf('} as const');
if (insertPoint !== -1) {
  content = content.slice(0, insertPoint) + translations + '\n' + content.slice(insertPoint);
}

fs.writeFileSync(frPath, content, 'utf8');
console.log('French teacher schema translations added!');
