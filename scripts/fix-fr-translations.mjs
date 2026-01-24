import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frPath = path.join(__dirname, '../i18n/locales/fr.ts');

let content = fs.readFileSync(frPath, 'utf8');

const replacements = [
  // Page meta
  ["horariosV2_page_title: 'Horarios Clases de Baile Barcelona | Farray Center'", "horariosV2_page_title: 'Horaires Cours de Danse Barcelone | Farray Center'"],
  ["'Encuentra el horario perfecto para tus clases de baile en Barcelona. Mañanas, tardes y noches. +25 estilos de danza, salsa, bachata, urbano y más. Grupos por nivel.'", "'Trouvez l\\'horaire parfait pour vos cours de danse à Barcelone. Matins, après-midis et soirs. +25 styles de danse, salsa, bachata, urbain et plus. Groupes par niveau.'"],

  // Trust badges
  ["horariosV2_trust_noCommitment: 'Sin permanencia'", "horariosV2_trust_noCommitment: 'Sans engagement'"],
  ["horariosV2_trust_freeClass: 'Primera clase gratuita'", "horariosV2_trust_freeClass: 'Cours de bienvenue'"],

  // Authority badges
  ["horariosV2_authority_since2017: 'Desde 2017'", "horariosV2_authority_since2017: 'Depuis 2017'"],
  ["horariosV2_authority_members: '+15.000 socios'", "horariosV2_authority_members: '+15 000 membres'"],
  ["horariosV2_authority_styles: '+25 styles'", "horariosV2_authority_styles: '+25 styles'"],

  // FAQ - Spanish ones
  ["horariosV2_faq7_q: '¿Dónde está Farray Center y a quién van dirigidas las actividades de baile?'", "horariosV2_faq7_q: 'Où se trouve Farray Center et à qui s\\'adressent les activités de danse ?'"],
  ["'Estamos en Calle Entença nº 100 en Barcelona y nuestras clases están dirigidas a adultos de todos los niveles que quieren aprender, mejorar o disfrutar del baile en un entorno profesional y cercano.'", "'Nous sommes au 100 rue Entença à Barcelone et nos cours s\\'adressent aux adultes de tous niveaux qui veulent apprendre, s\\'améliorer ou profiter de la danse dans un environnement professionnel et accueillant.'"],

  // Emotional close
  ["'No se trata solo de encajar una clase en tu agenda. Se trata de encontrar un lugar donde disfrutar, progresar y sentirte parte de una comunidad.'", "'Il ne s\\'agit pas seulement de caser un cours dans votre agenda. Il s\\'agit de trouver un endroit où profiter, progresser et vous sentir partie d\\'une communauté.'"],
  ["horariosV2_whatsapp_cta: '¿Tienes más dudas? Escríbenos por WhatsApp'", "horariosV2_whatsapp_cta: 'Vous avez d\\'autres questions ? Écrivez-nous sur WhatsApp'"],

  // Footer
  ["'Los horarios y plazas mostrados son orientativos y pueden variar según temporada, nivel y disponibilidad. La asignación definitiva de grupo se realiza de forma personalizada tras solicitar información.'", "'Les horaires et places affichés sont indicatifs et peuvent varier selon la saison, le niveau et la disponibilité. L\\'attribution définitive du groupe se fait de manière personnalisée après demande d\\'informations.'"],

  // Navigation
  ["horariosV2_nav_ariaLabel: 'Navegación rápida de secciones de horarios'", "horariosV2_nav_ariaLabel: 'Navigation rapide des sections d\\'horaires'"],
  ["horariosV2_nav_progressLabel: 'Progreso de lectura'", "horariosV2_nav_progressLabel: 'Progression de lecture'"],
  ["horariosV2_nav_morning: 'Mañanas'", "horariosV2_nav_morning: 'Matins'"],
  ["horariosV2_nav_evening: 'Tardes'", "horariosV2_nav_evening: 'Soirs'"],
  ["horariosV2_nav_urbano: 'Urbano'", "horariosV2_nav_urbano: 'Urbain'"],
  ["horariosV2_nav_levels: 'Niveles'", "horariosV2_nav_levels: 'Niveaux'"],

  // Styles
  ["horariosV2_style_contemporaneo: 'Contemporáneo'", "horariosV2_style_contemporaneo: 'Contemporain'"],
  ["horariosV2_style_contemporaneoLirico: 'Contemporáneo Lírico & Flow'", "horariosV2_style_contemporaneoLirico: 'Contemporain Lyrique & Flow'"],
  ["horariosV2_style_afroContemporaneo: 'Afro Contemporáneo'", "horariosV2_style_afroContemporaneo: 'Afro Contemporain'"],
  ["horariosV2_style_ballet: 'Ballet Clásico'", "horariosV2_style_ballet: 'Ballet Classique'"],
];

for (const [search, replace] of replacements) {
  content = content.replace(search, replace);
}

fs.writeFileSync(frPath, content, 'utf8');
console.log('French translations updated!');
