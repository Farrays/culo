import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frPath = path.join(__dirname, '../i18n/locales/fr.ts');

let content = fs.readFileSync(frPath, 'utf8');

const replacements = [
  // Skip links
  ["horariosV2_skipToContent: 'Saltar al contenido principal'", "horariosV2_skipToContent: 'Aller au contenu principal'"],
  ["horariosV2_skipToFilters: 'Ir a filtros de horario'", "horariosV2_skipToFilters: 'Aller aux filtres d\\'horaire'"],

  // Hero section
  ["horariosV2_hero_title: 'Horarios de Clases de Baile en Barcelona'", "horariosV2_hero_title: 'Horaires de Cours de Danse à Barcelone'"],
  ["'Encuentra el horario y el estilo que encajan contigo y descubre cómo empezar en Farray Center de forma clara y sin compromiso.'", "'Trouvez l\\'horaire et le style qui vous correspondent et découvrez comment commencer à Farray Center de manière claire et sans engagement.'"],
  ["horariosV2_hero_cta: 'Recibir Horarios Completos'", "horariosV2_hero_cta: 'Recevoir les Horaires Complets'"],
  ["horariosV2_hero_ctaSubtext: 'Gratis y sin compromiso'", "horariosV2_hero_ctaSubtext: 'Gratuit et sans engagement'"],
  ["horariosV2_hero_years: 'años en Barcelona'", "horariosV2_hero_years: 'ans à Barcelone'"],

  // Preview section
  ["horariosV2_preview_title: 'Esto es solo una muestra'", "horariosV2_preview_title: 'Ce n\\'est qu\\'un aperçu'"],
  ["horariosV2_preview_subtitle: 'Tenemos muchos más horarios y estilos que mostrarte'", "horariosV2_preview_subtitle: 'Nous avons beaucoup plus d\\'horaires et de styles à vous montrer'"],
  ["horariosV2_preview_point1: '+100 clases semanales de baile'", "horariosV2_preview_point1: '+100 cours de danse par semaine'"],
  ["horariosV2_preview_point2: 'Horarios de mañana, tarde y noche'", "horariosV2_preview_point2: 'Horaires du matin, après-midi et soir'"],
  ["horariosV2_preview_point3: 'Todos los niveles y edades'", "horariosV2_preview_point3: 'Tous les niveaux et âges'"],
  ["horariosV2_preview_point4: 'Información de profesores y salas'", "horariosV2_preview_point4: 'Informations sur les professeurs et les salles'"],
  ["horariosV2_preview_cta: 'Recibir Horarios Completos por Email'", "horariosV2_preview_cta: 'Recevoir les Horaires Complets par Email'"],
  ["horariosV2_preview_free: 'Gratis y sin compromiso'", "horariosV2_preview_free: 'Gratuit et sans engagement'"],

  // More schedules
  ["horariosV2_moreSchedules_title: 'Hay muchos más horarios disponibles'", "horariosV2_moreSchedules_title: 'Il y a beaucoup plus d\\'horaires disponibles'"],
  ["'Los horarios que ves aquí son solo una selección. Para ver todos los horarios disponibles, incluyendo clases de noche y fines de semana, solicita la información completa.'", "'Les horaires que vous voyez ici ne sont qu\\'une sélection. Pour voir tous les horaires disponibles, y compris les cours du soir et du week-end, demandez l\\'information complète.'"],
  ["horariosV2_moreSchedules_cta: 'Ver Todos los Horarios'", "horariosV2_moreSchedules_cta: 'Voir Tous les Horaires'"],
  ["horariosV2_sample_preview_label: 'Muestra de horarios - Para ver todos, solicita info'", "horariosV2_sample_preview_label: 'Aperçu des horaires - Pour tout voir, demandez les infos'"],

  // Trust badges - mixed
  ["horariosV2_trust_byLevel: 'Grupos por nivel'", "horariosV2_trust_byLevel: 'Groupes par niveau'"],
];

for (const [search, replace] of replacements) {
  content = content.replace(search, replace);
}

fs.writeFileSync(frPath, content, 'utf8');
console.log('French translations (part 2) updated!');
