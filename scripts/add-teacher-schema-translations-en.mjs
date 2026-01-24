import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const enPath = path.join(__dirname, '../i18n/locales/en.ts');

let content = fs.readFileSync(enPath, 'utf8');

const translations = `
  // =============================================
  // TEACHER SCHEMA TRANSLATIONS (SEO)
  // =============================================
  'teacherSchema.yunaisyFarray.jobTitle':
    "Director and Founder of Farray's International Dance Center | Hollywood Dancer",
  'teacherSchema.yunaisyFarray.description':
    'Hollywood dancer and Cuban professional trained at the ENA, creator of the Farray Method that integrates the rigor of the Russian classical ballet school with Afro-Cuban roots, adapted for European dancers. Actress in Street Dance 2, Got Talent finalist and CID UNESCO member. Over 25 years of international experience.',

  'teacherSchema.danielSene.jobTitle':
    'Classical Ballet, Contemporary, Yoga, Tai-Chi and Stretching Teacher | National Ballet School of Cuba | National Reference',
  'teacherSchema.danielSene.description':
    'Professional dancer trained at the prestigious National Ballet School of Cuba. Specialist in Cuban classical technique and contemporary dance. Deep connoisseur of the human body, he also stands out for his mastery in Yoga, Tai-Chi and Stretching. National reference combining technical precision with body wellness.',

  'teacherSchema.alejandroMinoso.jobTitle':
    'Ballet, Modern Jazz, Afro Jazz and Contemporary Teacher | Former Carlos Acosta Company Soloist',
  'teacherSchema.alejandroMinoso.description':
    'Cuban professional dancer trained at the ENA and former soloist of the prestigious Carlos Acosta company, one of the best dancers in history. Versatile in fusion of classical, afro and contemporary styles.',

  'teacherSchema.sandraGomez.jobTitle': 'Dancehall and Twerk Instructor | Jamaican Training',
  'teacherSchema.sandraGomez.description':
    'Professional dancer with authentic Jamaican training in dancehall and twerk. Her style fuses Twerk/Bootydance with genuine Jamaican essence. Impeccable technique and proven methodology.',

  'teacherSchema.isabelLopez.jobTitle': 'Dancehall Female Instructor',
  'teacherSchema.isabelLopez.description':
    'Dancehall enthusiast with over 5 years of experience. Trained with Jamaican masters. Specialist in old school moves (Willie Bounce, Nuh Linga) and latest trends.',

  'teacherSchema.marcosMartinez.jobTitle': 'Hip Hop Instructor and International Judge',
  'teacherSchema.marcosMartinez.description':
    'One of the Hip Hop references in Spain. Decades of experience as dancer, teacher and judge of international competitions. Combines old school technique with current trends.',

  'teacherSchema.yasminaFernandez.jobTitle':
    'Cuban Salsa, Lady Style, Sexy Style and Sexy Reggaeton Teacher | Farray Method since 2016',
  'teacherSchema.yasminaFernandez.description':
    'Extraordinarily versatile teacher certified in the Farray Method since 2016. Stands out for exceptional people skills that allow her to connect with students. Specialist in Cuban salsa, Lady Style, Sexy Style and Sexy Reggaeton.',

  'teacherSchema.liaValdes.jobTitle':
    'Cuban International Master and Artist | ENA Cuba | The Lion King Paris',
  'teacherSchema.liaValdes.description':
    'Cuban international master and artist with over 20 years of artistic career. Trained at the ENA (National School of Art of Cuba), she has danced in the prestigious production The Lion King in Paris. Transmits the joy and spirit of Caribbean dance.',

  'teacherSchema.iroelBastarreche.jobTitle':
    'Cuban Salsa Teacher | Folkloric Ballet of Camaguey | Farray Method',
  'teacherSchema.iroelBastarreche.description':
    'Known as Iro, trained at the Vocational School of Art of Cuba. Member of the Marragan Artistic Ensemble and Folkloric Ballet of Camaguey. Since 2014 training in the Farray Method, becoming a Cuban salsa reference in Barcelona.',

  'teacherSchema.charlieBreezy.jobTitle':
    'Afro Contemporary, Hip Hop and Afrobeats Teacher',
  'teacherSchema.charlieBreezy.description':
    'International master and Cuban dancer trained at the ENA. Masters African dance like Afrobeats, contemporary, ballet and urban dances. Exceptional versatility and academic training.',

  'teacherSchema.eugeniaTrujillo.jobTitle':
    'World Champion Salsa LA and Bachata Teacher',
  'teacherSchema.eugeniaTrujillo.description':
    'Uruguayan international master and dancer, world champion of Salsa LA with Mathias Font. Impeccable technique, specialist in partner bachata and bachata lady style with 4 years at Farrays.',

  'teacherSchema.mathiasFont.jobTitle':
    'World Champion Salsa LA and Bachata Instructor',
  'teacherSchema.mathiasFont.description':
    'World champion of Salsa LA with Eugenia Trujillo. Specialist in sensual bachata with unique focus on musicality, partner connection and class dynamization. Reference in Barcelona.',

  'teacherSchema.carlosCanto.jobTitle':
    'Bachata Instructor | Emerging Talent Barcelona',
  'teacherSchema.carlosCanto.description':
    'Emerging talent beloved by his students with great ability to connect. Bachata specialist with focus on technique and musicality. One of the most valued teachers at the school.',

  'teacherSchema.noemi.jobTitle':
    'Bachata Lady Style Instructor | Emerging Talent Barcelona',
  'teacherSchema.noemi.description':
    'Emerging talent with excellent people skills that allow her to connect immediately with students. Partner of Carlos Canto, one of the most promising couples in Barcelona. Specialist in bachata and feminine techniques.',

  'teacherSchema.redblueh.jobTitle': 'Afrobeats and Ntcham Instructor',
  'teacherSchema.redblueh.description':
    'International teacher and dancer native to Tanzania, specialist in Ntcham. His African roots and contagious joy make him one of the most recommended in Barcelona.',

  'teacherSchema.juanAlvarez.jobTitle':
    'Sensual Bachata Teacher | Farray Method | Emerging Talent Barcelona',
  'teacherSchema.juanAlvarez.description':
    'Sensual Bachata instructor certified in the Farray Method. Possesses an extraordinary ability to connect from the first moment with students. Transmits the essence of Latin dance with passion and refined technique.',

  'teacherSchema.crisAg.jobTitle':
    'Body Conditioning, Body Fit, Bum Bum Glutes and Stretching Instructor | Farray Method since 2012',
  'teacherSchema.crisAg.description':
    'English Philology graduate from UB. Trained with Jorge Camaguey and at The Cuban School of Arts in London. Since 2012 training in the Farray Method and working as teacher, becoming a reference in body conditioning for dancers in Barcelona.',

  'teacherSchema.grechenMendez.jobTitle':
    'International Master of Afro-Cuban Dances | ISA Cuba | +25 years experience',
  'teacherSchema.grechenMendez.description':
    'International reference master in Afro-Cuban dances with over 25 years dedicated to teaching Cuban folklore. Trained at the ISA (Higher Institute of Art of Cuba). World authority on dances to the Orishas and rumba.',
`;

// Insert before the closing of the translations object
const insertPoint = content.lastIndexOf('} as const');
if (insertPoint !== -1) {
  content = content.slice(0, insertPoint) + translations + '\n' + content.slice(insertPoint);
}

fs.writeFileSync(enPath, content, 'utf8');
console.log('English teacher schema translations added!');
