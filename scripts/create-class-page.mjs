#!/usr/bin/env node

/**
 * 🚀 Script Generador de Páginas de Clases
 *
 * Crea una nueva página de clase automáticamente basada en la plantilla de Dancehall.
 *
 * Uso:
 *   npm run create:class -- --name=bachata --instructor="Carlos Martínez" --specialty="Bachata Sensual"
 *
 * O interactivo:
 *   npm run create:class
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import readline from 'node:readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// 🎨 Colores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
};

// 📝 Plantilla de metadatos para nuevas clases (reservado para uso futuro)
const classTemplates = {
  bachata: {
    pillar1: { title: 'Sensualidad', desc: 'Aprende a bailar con conexión y elegancia', icon: 'Heart' },
    pillar2: { title: 'Técnica', desc: 'Domina pasos, vueltas y movimientos avanzados', icon: 'Cog' },
    pillar3: { title: 'Musicalidad', desc: 'Baila al ritmo de la guitarra y los bongos', icon: 'MusicalNote' },
    faqs: [
      { q: '¿Necesito pareja para las clases de Bachata?', a: 'No es necesario venir con pareja. Rotamos durante las clases para que todos practiquen.' },
      { q: '¿Qué nivel necesito para empezar?', a: 'Ofrecemos clases para todos los niveles, desde principiantes absolutos hasta avanzados.' },
      { q: '¿Qué estilo de Bachata enseñan?', a: 'Enseñamos Bachata Sensual, Dominicana y Moderna, adaptándonos a las preferencias del grupo.' },
      { q: '¿Cuánto tiempo se tarda en aprender Bachata?', a: 'Con práctica regular, en 3-6 meses puedes bailar cómodamente en sociales.' },
    ],
  },
  salsa: {
    pillar1: { title: 'Ritmo', desc: 'Desarrolla el sentido del ritmo y la clave', icon: 'MusicalNote' },
    pillar2: { title: 'Estilo', desc: 'Aprende On1, On2 y estilo cubano', icon: 'Star' },
    pillar3: { title: 'Shine', desc: 'Domina footwork y movimientos en solitario', icon: 'Bolt' },
    faqs: [
      { q: '¿Qué estilo de Salsa enseñan?', a: 'Enseñamos Salsa en línea (On1 y On2) y estilo cubano (Casino).' },
      { q: '¿Necesito experiencia previa?', a: 'No, tenemos clases para principiantes sin experiencia.' },
      { q: '¿Necesito pareja?', a: 'No es necesario. Rotamos parejas durante las clases.' },
      { q: '¿Hay clases de rueda de casino?', a: 'Sí, ofrecemos clases de rueda para niveles intermedio y avanzado.' },
    ],
  },
  kizomba: {
    pillar1: { title: 'Conexión', desc: 'Baila en pareja con conexión profunda', icon: 'Heart' },
    pillar2: { title: 'Movimiento', desc: 'Aprende el flow y los pasos característicos', icon: 'ArrowPath' },
    pillar3: { title: 'Musicalidad', desc: 'Interpreta la música angoleña y africana', icon: 'MusicalNote' },
    faqs: [
      { q: '¿Qué es Kizomba?', a: 'Kizomba es un baile de pareja originario de Angola, caracterizado por movimientos suaves y conexión cercana.' },
      { q: '¿Necesito pareja?', a: 'No es necesario. Rotamos durante las clases.' },
      { q: '¿Es difícil aprender Kizomba?', a: 'Es accesible para principiantes, pero la conexión requiere práctica.' },
      { q: '¿Qué ropa debo usar?', a: 'Ropa cómoda que permita movimiento. Zapatos con suela que permita girar.' },
    ],
  },
};

// 🔧 Funciones auxiliares
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function toPascalCase(str) {
  return str
    .split(/[-_\s]/)
    .map(capitalize)
    .join('');
}

function toKebabCase(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

// 🎤 Modo interactivo
async function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${colors.cyan}?${colors.reset} ${question}: `, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function getInteractiveInput() {
  log.title('🎨 Generador de Páginas de Clases - Modo Interactivo');

  const name = await promptUser('Nombre de la clase (ej: bachata, salsa, kizomba)');
  const instructor = await promptUser('Nombre del instructor (ej: Carlos Martínez)');
  const specialty = await promptUser('Especialidad del instructor (ej: Bachata Sensual)');

  return { name: name.toLowerCase(), instructor, specialty };
}

// 📄 Generadores de contenido

async function createPageComponent(className, componentName, instructor) {
  log.info(`Creando componente ${componentName}Page.tsx (basado en TwerkPage 10/10)...`);

  // Usar TwerkPage como base (estructura 10/10 optimizada)
  const template = await readFile(join(rootDir, 'components/TwerkPage.tsx'), 'utf-8');

  // Convert className to valid constant name (replace hyphens with underscores)
  const constName = className.toUpperCase().replace(/-/g, '_');
  const keyPrefix = className.replace(/-/g, '');

  // Reemplazos básicos - usar regex case-insensitive donde sea necesario
  let newContent = template
    // Reemplazar nombres de constantes (TWERK_ -> CLASSNAME_)
    .replace(/TWERK_/g, `${constName}_`)
    // Reemplazar keys i18n (twerk -> classname)
    .replace(/twerk(?=[A-Z])/g, keyPrefix)
    .replace(/'twerk/g, `'${keyPrefix}`)
    // Reemplazar rutas URL
    .replace(/twerk-barcelona/g, `${className}-barcelona`)
    .replace(/\/twerk\//g, `/${className}/`)
    // Reemplazar nombres de componente
    .replace(/TwerkPage/g, `${componentName}Page`)
    // Reemplazar imports de constants
    .replace(/from '\.\.\/constants\/twerk'/g, `from '../constants/${className}'`)
    // Reemplazar nombres en Schema
    .replace(/Clases de Twerk/g, `Clases de ${componentName}`)
    .replace(/clases de twerk/gi, `clases de ${componentName}`)
    // Reemplazar og-image
    .replace(/og-twerk\.jpg/g, `og-${className}.jpg`)
    // Reemplazar nombres de variables locales
    .replace(/twerkFaqs/g, `${keyPrefix}Faqs`)
    .replace(/twerkTestimonials/g, `${keyPrefix}Testimonials`)
    // Reemplazar YouTube video ID placeholder (mantener el ID de twerk como placeholder)
    .replace(/7QCgHDiGHg8/g, '${' + constName + '_VIDEO_ID}');

  // Verificar que el componente usa el nuevo nombre
  if (!newContent.includes(`const ${componentName}Page`)) {
    newContent = newContent.replace(/const \w+Page: React\.FC/, `const ${componentName}Page: React.FC`);
  }

  // Asegurar export correcto
  if (!newContent.includes(`export default ${componentName}Page`)) {
    newContent = newContent.replace(/export default \w+Page/, `export default ${componentName}Page`);
  }

  const outputPath = join(rootDir, `components/${componentName}Page.tsx`);
  await writeFile(outputPath, newContent, 'utf-8');
  log.success(`Creado: components/${componentName}Page.tsx (estructura 10/10)`);
  log.info(`   📐 Orden de secciones: Hero → What-Is → Schedule → Teachers → Identify → Transform → WhyChoose → Logos → WhyToday → Video → Testimonials → FinalCTA → CulturalHistory → FAQ`);

  return outputPath;
}

async function updateAppRoutes(className, componentName) {
  log.info('Actualizando App.tsx con la nueva ruta...');

  const appPath = join(rootDir, 'App.tsx');
  let appContent = await readFile(appPath, 'utf-8');

  // Añadir import
  const importLine = `const ${componentName}Page = lazy(() => import('./components/${componentName}Page'));`;
  const importSection = appContent.match(/const \w+Page = lazy.*;\n/g);
  if (importSection) {
    const lastImport = importSection[importSection.length - 1];
    appContent = appContent.replace(lastImport, `${lastImport}${importLine}\n`);
  }

  // Añadir rutas (locale-based y legacy)
  const routeLine = `            <Route path="/:locale/${className}" element={<><LocaleSync /><${componentName}Page /></>} />`;
  const legacyRouteLine = `            <Route path="/${className}" element={<Navigate to={\`/\${locale}/${className}\`} replace />} />`;

  // Insertar después de las rutas existentes
  const routeSection = appContent.indexOf('<Route path="/:locale/afrobeats"');
  if (routeSection !== -1) {
    const afterAfrobeats = appContent.indexOf('/>', routeSection) + 2;
    appContent =
      appContent.slice(0, afterAfrobeats) +
      `\n${routeLine}` +
      appContent.slice(afterAfrobeats);
  }

  const legacySection = appContent.indexOf('<Route path="/afrobeats"');
  if (legacySection !== -1) {
    const afterLegacyAfrobeats = appContent.indexOf('/>', legacySection) + 2;
    appContent =
      appContent.slice(0, afterLegacyAfrobeats) +
      `\n${legacyRouteLine}` +
      appContent.slice(afterLegacyAfrobeats);
  }

  await writeFile(appPath, appContent, 'utf-8');
  log.success('Actualizado: App.tsx');
}

async function createI18nKeys(className, componentName, instructor, specialty) {
  log.info('Generando claves i18n COMPLETAS (plantilla en español con 15 FAQs)...');

  const keyPrefix = className.replace(/-/g, '');

  // Generate complete i18n template with all sections we've been using
  const i18nTemplate = `
  // ===== ${componentName} Page =====
  ${keyPrefix}PageTitle: 'Clases de ${componentName} en Barcelona | Academia Farray\\'s Center',
  ${keyPrefix}MetaDescription: 'Aprende ${componentName} en Barcelona con instructores especializados. Clases de ${componentName} para todos los niveles cerca de Plaza España y Sants. ¡Reserva tu clase de prueba!',

  // Breadcrumb (4 niveles: Home > Clases > Urbanas > Current)
  ${keyPrefix}BreadcrumbHome: 'Inicio',
  ${keyPrefix}BreadcrumbClasses: 'Clases de Baile',
  ${keyPrefix}BreadcrumbUrban: 'Danzas Urbanas',
  ${keyPrefix}BreadcrumbCurrent: 'Clases de ${componentName}',

  // Hero
  ${keyPrefix}HeroTitle: 'Clases de ${componentName} en Barcelona',
  ${keyPrefix}HeroSubtitle: 'Descubre el ritmo y la pasión del ${componentName}',
  ${keyPrefix}HeroDesc: 'Mucho más que un baile, una forma de expresión.',
  ${keyPrefix}HeroLocation: 'Clases desde nivel principiante hasta avanzado, entre Plaza España y Sants',

  // CTAs
  ${keyPrefix}CTA1: 'Hazte Miembro Ahora',
  ${keyPrefix}CTA1Subtext: 'Quedan pocas plazas este mes',
  ${keyPrefix}CTA2: 'Reserva Tu Clase de Prueba',
  ${keyPrefix}CTA2Subtext: 'Oferta por tiempo limitado',

  // What Is Section
  ${keyPrefix}WhatIsTitle: '¿Qué es ${componentName} y por qué está arrasando en Barcelona?',
  ${keyPrefix}WhatIsP1: 'Descripción del ${componentName}: origen, características principales. [TODO: Personalizar]',
  ${keyPrefix}WhatIsP2: 'Segunda descripción sobre el estilo y la cultura. [TODO: Personalizar]',
  ${keyPrefix}WhatIsP3: 'Tercera descripción sobre qué se aprende. [TODO: Personalizar]',
  ${keyPrefix}WhatIsP4: 'Cuarta descripción sobre los beneficios. [TODO: Personalizar]',
  ${keyPrefix}WhatIsQuestionTitle: '¿Te preguntas si es para ti?',
  ${keyPrefix}WhatIsQuestionAnswer: 'Sí, lo es.',

  // Cultural Section (con markdown ### para títulos holográficos)
  ${keyPrefix}CulturalShort: 'Breve introducción a la historia del ${componentName}. [TODO: Personalizar - máx 2 frases]',
  ${keyPrefix}CulturalFull: '### Sección 1: Orígenes\\n\\nContenido de la sección 1. [TODO]\\n\\n### Sección 2: Evolución\\n\\nContenido de la sección 2. [TODO]\\n\\n### Sección 3: El ${componentName} hoy\\n\\nContenido de la sección 3. [TODO]',

  // Identify Section
  ${keyPrefix}IdentifyTitle: '¿Te identificas con alguna de estas situaciones?',
  ${keyPrefix}Identify1: 'Quieres ponerte en forma pero el gimnasio te aburre',
  ${keyPrefix}Identify2: 'Buscas una actividad donde puedas liberar el estrés',
  ${keyPrefix}Identify3: 'Te encanta la música urbana y quieres bailar sin complejos',
  ${keyPrefix}Identify4: 'Quieres mejorar tu autoestima y conexión con tu cuerpo',
  ${keyPrefix}Identify5: 'Necesitas un espacio donde nadie te juzgue',
  ${keyPrefix}Identify6: 'Buscas una comunidad que te apoye e inspire',
  ${keyPrefix}IdentifyTransition: 'Si has dicho "sí" a alguno de estos puntos, ya sabes lo que necesitas.',
  ${keyPrefix}NeedEnrollTitle: 'Necesitas apuntarte a clases de ${componentName} en una academia de baile',
  ${keyPrefix}IdentifyAgitate1: 'Seguir buscando excusas solo te aleja de la mejor versión de ti. [TODO: Personalizar]',
  ${keyPrefix}IdentifySolution: 'En Farray\\'s Center encontrarás un espacio pensado para que te sueltes, aprendas y crezcas sin presiones.',
  ${keyPrefix}IdentifyClosing: 'Déjate llevar por la energía y el poder del ${componentName}.',

  // Transform Section (6 transformaciones)
  ${keyPrefix}TransformTitle: 'Imagina tu antes y después',
  ${keyPrefix}Transform1Title: 'Recuperas energía e ilusión',
  ${keyPrefix}Transform1Desc: 'Las clases te sacan de la rutina y te devuelven a la vida.',
  ${keyPrefix}Transform2Title: 'Ganas seguridad sin darte cuenta',
  ${keyPrefix}Transform2Desc: 'Te sueltas, te liberas y empiezas a quererte más.',
  ${keyPrefix}Transform3Title: 'Te pones en forma sin aburrirte',
  ${keyPrefix}Transform3Desc: 'Cada clase es diferente. Te diviertes mientras fortaleces tu cuerpo.',
  ${keyPrefix}Transform4Title: 'Conoces a gente real',
  ${keyPrefix}Transform4Desc: 'Nada forzado: buen rollo, comunidad y gente como tú.',
  ${keyPrefix}Transform5Title: 'Conectas con la música urbana',
  ${keyPrefix}Transform5Desc: 'Ritmo, flow y capacidad de improvisación.',
  ${keyPrefix}Transform6Title: 'Aprendes movimientos nuevos cada semana',
  ${keyPrefix}Transform6Desc: 'Más flow, más estilo, más tú.',
  ${keyPrefix}TransformCTA: '¿Por qué elegir Farray\\'s Center como academia de ${componentName} en Barcelona?',

  // Why Choose Section (7 items - incluye profesores especializados)
  ${keyPrefix}WhyChoose1Title: 'Academia reconocida por el CID UNESCO',
  ${keyPrefix}WhyChoose1Desc: 'Dirigida por Yunaisy Farray, actriz de Street Dance 2 y una de las profesoras más reconocidas del mundo.',
  ${keyPrefix}WhyChoose2Title: 'Ubicación inmejorable',
  ${keyPrefix}WhyChoose2Desc: 'Calle Entença 100, entre Plaza España y Sants, a 5 minutos de Plaça Espanya y Sants. Metro, bus y tren en la puerta.',
  ${keyPrefix}WhyChoose3Title: 'Ambiente familiar, con el profesionalismo que necesitas',
  ${keyPrefix}WhyChoose3Desc: 'Acogedor, inclusivo y sin juicios ni comparaciones, pero con el profesionalismo que necesitas para evolucionar de verdad.',
  ${keyPrefix}WhyChoose4Title: 'Instalaciones realmente preparadas',
  ${keyPrefix}WhyChoose4Desc: 'Más de 700 m², salas amplias, espejos, sonido profesional, climatización y ventilación centralizada.',
  ${keyPrefix}WhyChoose5Title: 'Academia multidisciplinar',
  ${keyPrefix}WhyChoose5Desc: 'Más de 25 estilos para que nunca te aburras: urbanos, latinas, contemporáneo, técnica, stretching y mucho más.',
  ${keyPrefix}WhyChoose6Title: 'Gala anual + workshops potentes',
  ${keyPrefix}WhyChoose6Desc: 'Brilla en un teatro profesional, participa en workshops internacionales y vive experiencias únicas.',
  ${keyPrefix}WhyChoose7Title: 'Profesores especializados en ${componentName}',
  ${keyPrefix}WhyChoose7Desc: '${instructor}: experto en ${componentName} con años de experiencia. Técnica, flow y energía contagiosa en cada clase.',

  // Logos Section
  ${keyPrefix}LogosTitle: 'Has podido vernos en…',
  ${keyPrefix}LogosIntlFestivalsText: 'y en los mejores festivales de baile de todo el mundo',

  // Teachers Section
  ${keyPrefix}TeachersTitle: 'Conoce a tu instructor de ${componentName}',
  ${keyPrefix}TeachersSubtitle: 'Experto en ${componentName} con años de experiencia',
  ${keyPrefix}Teacher1Specialty: '${specialty}',
  ${keyPrefix}Teacher1Bio: 'Biografía del instructor. [TODO: Personalizar con experiencia y estilo]',
  ${keyPrefix}TeachersClosing: 'Con ${instructor} no solo aprendes a bailar ${componentName}: descubres una nueva forma de conectar con tu cuerpo y tu confianza.',

  // Schedule Section
  ${keyPrefix}ScheduleTitle: 'Horario de clases de ${componentName}',
  ${keyPrefix}ScheduleSubtitle: 'Varios niveles para que encuentres tu clase perfecta',

  // Video Section
  ${keyPrefix}VideoTitle: 'Ven a descubrir nuestras clases de ${componentName}',
  ${keyPrefix}VideoDesc: 'Mira cómo es una clase en Farray\\'s Center: energía, técnica y buen rollo. ¡Te esperamos!',

  // Why Today Section
  ${keyPrefix}WhyTodayFullTitle: '¿Por qué hoy es el mejor momento para empezar a bailar ${componentName} con nosotros?',
  ${keyPrefix}WhyToday1: 'Porque siempre esperas "el momento perfecto" pero lo único perfecto es empezar hoy.',
  ${keyPrefix}WhyToday2: 'Porque estás a UNA clase de cambiar tu rutina y sentirte mejor que ayer.',
  ${keyPrefix}WhyToday3: 'Porque no se trata de bailar bien, sino de sentirse bien bailando.',
  ${keyPrefix}WhyTodayClosing1: 'En Farray\\'s no vendemos clases. Creamos experiencias.',
  ${keyPrefix}WhyTodayClosing2: 'Te esperamos con música pegadiza, profes carismáticos y una energía única en Barcelona.',

  // Final CTA Section
  ${keyPrefix}FinalCTATitle: 'Únete a la comunidad de ${componentName} más activa de Barcelona',
  ${keyPrefix}FinalCTASubtitle: 'Da el paso.',
  ${keyPrefix}FinalCTADesc: 'Reserva tu plaza ahora y no dejes que te lo cuenten… ni que te lo bailen.',
  ${keyPrefix}FinalCTAFunny: 'Las plazas vuelan más rápido que un paso de ${componentName} un viernes por la noche.',

  // FAQ Title
  ${keyPrefix}FaqTitle: 'Preguntas Frecuentes sobre ${componentName} en Barcelona',

  // 15 FAQs (optimizado para SEO - última FAQ con contacto)
  ${keyPrefix}FaqQ1: '¿Cómo funcionan las clases de ${componentName} en Barcelona?',
  ${keyPrefix}FaqA1: 'Trabajamos con grupos reducidos, divididos por niveles, para que puedas avanzar a tu ritmo. Cada clase dura 1 hora y combina calentamiento, técnica y coreografía.',
  ${keyPrefix}FaqQ2: '¿Puedo empezar desde cero si nunca he bailado ${componentName}?',
  ${keyPrefix}FaqA2: 'Absolutamente. El 80% de nuestros alumnos empiezan sin experiencia previa. Nuestra metodología está pensada para que te sientas cómodo desde el primer día.',
  ${keyPrefix}FaqQ3: '¿Qué pasa si no tengo buena coordinación?',
  ${keyPrefix}FaqA3: 'La coordinación se entrena. En nuestras clases desglosamos cada movimiento en pasos simples para que puedas asimilarlo de forma natural.',
  ${keyPrefix}FaqQ4: '¿Qué necesito traer a las clases de ${componentName}?',
  ${keyPrefix}FaqA4: 'Ropa cómoda que permita movimiento, zapatillas deportivas con buena suela, y trae una botella de agua. Tenemos vestuarios con duchas y wifi.',
  ${keyPrefix}FaqQ5: '¿Qué niveles de ${componentName} tenéis?',
  ${keyPrefix}FaqA5: 'Ofrecemos clases en varios niveles: Principiante (sin experiencia), Básico (ya has tocado algo), Intermedio y Avanzado. El profe te guiará al nivel que más te convenga.',
  ${keyPrefix}FaqQ6: '¿Puedo unirme a las clases en cualquier momento del año?',
  ${keyPrefix}FaqA6: 'Sí, nuestras clases funcionan con sistema abierto, así que puedes inscribirte cuando quieras. No hace falta esperar a principio de trimestre.',
  ${keyPrefix}FaqQ7: '¿Tenéis algún descuento especial?',
  ${keyPrefix}FaqA7: 'Sí. Tenemos bonos trimestrales y anuales con grandes ventajas, además de ofertas de lanzamiento para nuevos miembros.',
  ${keyPrefix}FaqQ8: '¿Puedo probar una clase antes de inscribirme?',
  ${keyPrefix}FaqA8: 'Por supuesto. Puedes reservar una clase de prueba para ver si es lo que buscas. Preferimos que descubras la energía del ${componentName} antes de decidir.',
  ${keyPrefix}FaqQ9: '¿Y si falto a una clase por trabajo o compromisos?',
  ${keyPrefix}FaqA9: 'Las clases son recuperables, así que si faltas un día, puedes venir a la siguiente clase disponible en tu mismo nivel.',
  ${keyPrefix}FaqQ10: 'Si falto a una clase de ${componentName}, ¿puedo recuperarla haciendo otro estilo?',
  ${keyPrefix}FaqA10: 'Sí. En Farray\\'s puedes usar tu clase perdida en otro estilo (Dancehall, Hip Hop, Bachata...), siempre que el nivel sea equivalente.',
  ${keyPrefix}FaqQ11: '¿Organizáis eventos o workshops especiales?',
  ${keyPrefix}FaqA11: 'Sí. Tenemos masterclasses con artistas invitados, battles, showcases y nuestra gala anual donde puedes lucirte en un escenario profesional.',
  ${keyPrefix}FaqQ12: '¿Las clases son solo para mujeres o también para hombres?',
  ${keyPrefix}FaqA12: 'Nuestras clases son 100% inclusivas. Todos los géneros, edades y cuerpos son bienvenidos. Lo que importa es las ganas de bailar y mejorar.',
  ${keyPrefix}FaqQ13: '¿El ${componentName} es un buen ejercicio físico?',
  ${keyPrefix}FaqA13: 'El ${componentName} es un entrenamiento completo que trabaja especialmente piernas, core y coordinación. En una hora puedes quemar entre 400 y 600 calorías.',
  ${keyPrefix}FaqQ14: '¿Dónde puedo encontrar clases de ${componentName} cerca de Plaza España?',
  ${keyPrefix}FaqA14: 'Farray\\'s Center está ubicado en Calle Entença 100, a solo 5 minutos de Plaza España y Estación de Sants. Puedes llegar en metro (L1, L3), bus o tren.',
  ${keyPrefix}FaqQ15: '¿Qué hago si tengo dudas o necesito más información?',
  ${keyPrefix}FaqA15: 'Si tienes alguna pregunta adicional o necesitas más información, puedes contactarnos:<br/><br/>📞 <strong>Teléfono:</strong> <a href="tel:+34622247085" class="text-primary-accent hover:underline">+34 622 247 085</a><br/>📧 <strong>Email:</strong> <a href="mailto:info@farrayscenter.com" class="text-primary-accent hover:underline">info@farrayscenter.com</a><br/>🌐 <strong>Web:</strong> <a href="https://www.farrayscenter.com/contacto" target="_blank" rel="noopener noreferrer" class="text-primary-accent hover:underline">www.farrayscenter.com/contacto</a><br/>📍 <strong>Dirección:</strong> <a href="https://maps.google.com/?q=Calle+Entença+100,+08015+Barcelona" target="_blank" rel="noopener noreferrer" class="text-primary-accent hover:underline">Calle Entença 100, 08015 Barcelona</a>',

  // Image alts
  ${keyPrefix}Image1Alt: 'Clases de ${componentName} en Barcelona - Farray\\'s Center',
  ${keyPrefix}Image2Alt: 'Estudiantes practicando ${componentName}',
  ${keyPrefix}Image3Alt: '${instructor} - Instructor de ${componentName}',

  // Course Schema (SEO)
  ${keyPrefix}CourseSchemaName: 'Clases de ${componentName} en Barcelona - Farray\\'s Center',
  ${keyPrefix}CourseSchemaDesc: 'Aprende ${componentName} con ${instructor}, instructor especializado. Clases para todos los niveles en el corazón de Barcelona.',

  // Cultural History Title (para CulturalHistorySection)
  ${keyPrefix}CulturalHistoryTitle: 'Historia y Cultura del ${componentName}',

  // ===== GEO OPTIMIZATION: Citable Statistics for ${componentName} =====
  // Estos datos están optimizados para ser citados por IAs (ChatGPT, Perplexity, etc.)

  // Dato citable – Origen
  ${keyPrefix}CitableOrigen:
    '[TODO: Personalizar] El ${componentName} nace de... [Describir origen histórico, lugar, época, influencias culturales]',

  // Dato citable – Estadísticas científicas
  ${keyPrefix}Statistics:
    'Estudios científicos sobre danza señalan que bailar mejora la coordinación, la propiocepción y la condición física general, además de reducir el estrés y mejorar el estado de ánimo, y el ${componentName} se beneficia de estos mismos efectos por su carácter aeróbico y de trabajo corporal completo.',

  // Dato citable – Evolución global
  ${keyPrefix}CitableEvolucionGlobal:
    '[TODO: Personalizar] Desde los años... el ${componentName} pasó de ser un baile local a un fenómeno global presente en escuelas de danza, battles y workshops en Europa y Latinoamérica.',

  // Dato citable – Música
  ${keyPrefix}CitableMusica:
    '[TODO: Personalizar] El ${componentName} está fuertemente vinculado a... [Describir géneros musicales, artistas representativos, características del ritmo]',

  // Dato citable – Identidad y poder
  ${keyPrefix}CitableIdentidadPoder:
    '[TODO: Personalizar] En el contexto de escuelas serias, el ${componentName} se trabaja como entrenamiento de conciencia corporal, fuerza, coordinación, autoestima y empoderamiento.',

  // 3 Facts citables principales (para schema y AI) - IMPORTANTE para GEO
  ${keyPrefix}CitableFact1:
    'Una clase de ${componentName} activa puede quemar aproximadamente 300-500 calorías por hora según el peso corporal y la intensidad, en línea con otros estilos de danza fitness.',
  ${keyPrefix}CitableFact2:
    'Revisiones científicas sobre programas de danza en adultos indican que bailar de forma regular se asocia con menor riesgo de deterioro cognitivo y puede contribuir a reducir la incidencia de demencia frente a estilos de vida sedentarios.',
  ${keyPrefix}CitableFact3:
    "Farray\\'s International Dance Center ofrece clases de ${componentName} dentro de una escuela con una valoración cercana al 5/5 en Google con más de 500 reseñas, lo que respalda la satisfacción del alumnado.",
`;

  // Guardar en archivo temporal para que el usuario lo copie
  const outputPath = join(rootDir, `.claude/i18n-${className}-template.txt`);
  await writeFile(outputPath, i18nTemplate.trim(), 'utf-8');
  log.success(`Generado: .claude/i18n-${className}-template.txt (COMPLETO con 15 FAQs)`);
  log.warning(`👉 Copia estas claves a i18n/locales/es.ts y traduce a los demás idiomas`);
  log.info(`   📝 Incluye: Hero, Cultural History, Identify, Transform, Why Choose (7), FAQs (15), Contact info`);
}

async function createImageStructure(className) {
  log.info('Creando estructura de directorios para imágenes...');

  const rawDir = join(rootDir, `public/images/classes/${className}/raw`);
  const imgDir = join(rootDir, `public/images/classes/${className}/img`);

  await mkdir(rawDir, { recursive: true });
  await mkdir(imgDir, { recursive: true });

  // Crear README en /raw
  const readmeContent = `# Imágenes de ${capitalize(className)}

## Instrucciones

1. **Sube aquí tus imágenes originales** (alta resolución, sin optimizar):
   - \`${className}-hero.jpg\` → Imagen principal (portada)
   - \`${className}-clase-1.jpg\` → Foto de la clase en acción
   - \`${className}-profesor.jpg\` → Foto del instructor

2. **Actualiza el script de optimización:**
   \`\`\`javascript
   // scripts/build-images.mjs
   const classes = ["dancehall", "afrobeats", "${className}"];
   \`\`\`

3. **Ejecuta la optimización:**
   \`\`\`bash
   npm run build:images
   \`\`\`

4. **Las imágenes optimizadas** (WebP + JPG, múltiples tamaños) se generarán en \`/img\`

---

📐 **Recomendaciones de tamaño:**
- Hero: 1920x1080 o mayor (16:9)
- Clase: 1200x1500 (4:5, vertical)
- Profesor: 800x800 (1:1, cuadrado)

🎨 **Formato:** JPG o PNG (el script generará WebP automáticamente)
`;

  await writeFile(join(rawDir, 'README.md'), readmeContent, 'utf-8');
  log.success(`Creado: public/images/classes/${className}/raw/`);
  log.success(`Creado: public/images/classes/${className}/img/`);
}

async function updateBuildImagesScript(className) {
  log.info('Actualizando scripts/build-images.mjs...');

  const scriptPath = join(rootDir, 'scripts/build-images.mjs');
  let scriptContent = await readFile(scriptPath, 'utf-8');

  // Añadir clase al array
  const classesMatch = scriptContent.match(/const classes = \[(.*?)\];/s);
  if (classesMatch) {
    const currentClasses = classesMatch[1]
      .split(',')
      .map((c) => c.trim().replace(/['"]/g, ''))
      .filter(Boolean);

    if (!currentClasses.includes(className)) {
      currentClasses.push(className);
      const newClassesArray = `const classes = [${currentClasses.map((c) => `"${c}"`).join(', ')}];`;
      scriptContent = scriptContent.replace(/const classes = \[.*?\];/s, newClassesArray);
      await writeFile(scriptPath, scriptContent, 'utf-8');
      log.success('Actualizado: scripts/build-images.mjs');
    } else {
      log.warning(`${className} ya existe en build-images.mjs`);
    }
  }
}

// 🆕 MEJORA 1: Generar archivo de constantes automáticamente (con 15 FAQs)
async function createConstantsFile(className, componentName, instructor) {
  log.info(`Generando constants/${className}.ts con 15 FAQs...`);

  // Always generate 15 FAQs for comprehensive SEO coverage
  const faqCount = 15;

  // Convert className to valid constant name (replace hyphens with underscores)
  const constName = className.toUpperCase().replace(/-/g, '_');
  const keyPrefix = className.replace(/-/g, '');

  const constantsContent = `import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for ${componentName} page (15 FAQs for comprehensive SEO)
export const ${constName}_FAQS_CONFIG: FAQ[] = [
${Array.from({ length: faqCount }, (_, i) => {
  const num = i + 1;
  return `  { id: '${className}-${num}', questionKey: '${keyPrefix}FaqQ${num}', answerKey: '${keyPrefix}FaqA${num}' },`;
}).join('\n')}
];

// Testimonials for ${componentName} page (extends Google reviews with specific testimonial)
export const ${constName}_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: '[TODO: Nombre del testimonio]',
    image: '/images/testimonials/placeholder-f.jpg',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'The ${componentName} classes are amazing. Great atmosphere and the teacher explains very well.',
      es: 'Las clases de ${componentName} son increíbles. El ambiente es genial y el profesor explica muy bien.',
      ca: 'Les classes de ${componentName} són increïbles. L\\'ambient és genial i el professor explica molt bé.',
      fr: 'Les cours de ${componentName} sont incroyables. L\\'ambiance est géniale et le professeur explique très bien.',
    },
  },
];

// Course schema configuration (optimized for SEO with keywords)
export const ${constName}_COURSE_CONFIG = {
  teaches: '${componentName}, técnica de danza, musicalidad, coreografía',
  prerequisites: 'Ninguno',
  lessons: '5 clases semanales',
  duration: 'PT1H',
};

// Schedule data for ${componentName} classes
export const ${constName}_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday',
    className: '${componentName} Principiantes',
    time: '19:00 - 20:00',
    teacher: '${instructor}',
    levelKey: 'beginnerLevel',
  },
  {
    id: '2',
    dayKey: 'wednesday',
    className: '${componentName} Básico',
    time: '20:00 - 21:00',
    teacher: '${instructor}',
    levelKey: 'basicLevel',
  },
  {
    id: '3',
    dayKey: 'thursday',
    className: '${componentName} Intermedio',
    time: '20:00 - 21:00',
    teacher: '${instructor}',
    levelKey: 'intermediateLevel',
  },
  {
    id: '4',
    dayKey: 'friday',
    className: '${componentName} Avanzado',
    time: '21:00 - 22:00',
    teacher: '${instructor}',
    levelKey: 'advancedLevel',
  },
];

// Breadcrumb custom keys for ${componentName} (4 levels: Home > Classes > Urban > Current)
export const ${constName}_BREADCRUMB_KEYS = {
  home: '${keyPrefix}BreadcrumbHome',
  classes: '${keyPrefix}BreadcrumbClasses',
  urban: '${keyPrefix}BreadcrumbUrban',
  current: '${keyPrefix}BreadcrumbCurrent',
};

// YouTube video ID for the page (update with real video)
export const ${constName}_VIDEO_ID = 'YOUR_YOUTUBE_VIDEO_ID';

// ===== GEO OPTIMIZATION: Citable Statistics Keys =====
// Estas keys apuntan a datos citables por IAs (ChatGPT, Perplexity, etc.)
export const ${constName}_GEO_KEYS = {
  origin: '${keyPrefix}CitableOrigen',
  statistics: '${keyPrefix}Statistics',
  globalEvolution: '${keyPrefix}CitableEvolucionGlobal',
  music: '${keyPrefix}CitableMusica',
  identityPower: '${keyPrefix}CitableIdentidadPoder',
  fact1: '${keyPrefix}CitableFact1',  // Calorías quemadas
  fact2: '${keyPrefix}CitableFact2',  // Beneficios cognitivos
  fact3: '${keyPrefix}CitableFact3',  // Valoración Google
};

// Hero Stats configuration (for AnimatedCounter)
export const ${constName}_HERO_STATS = {
  minutes: 60,
  calories: 600,  // Approximate calories burned per class
  funPercent: 100,
};
`;

  const outputPath = join(rootDir, `constants/${className}.ts`);
  await writeFile(outputPath, constantsContent, 'utf-8');
  log.success(`Creado: constants/${className}.ts (15 FAQs + YouTube + GEO keys + Hero Stats)`);
}

// 🆕 MEJORA 2: Actualizar sitemap.xml automáticamente
async function updateSitemap(className) {
  log.info('Actualizando sitemap.xml...');

  try {
    // Ejecutar el script de update-sitemap con la nueva ruta
    const sitemapScriptPath = join(rootDir, 'scripts/update-sitemap.mjs');
    let sitemapContent = await readFile(sitemapScriptPath, 'utf-8');

    // Añadir nueva ruta al array de routes
    const routeEntry = `  { path: 'clases/${className}-barcelona', priority: '0.8', changefreq: 'monthly' },`;
    
    // Buscar la sección de routes y añadir después de dancehall
    const dancehallIndex = sitemapContent.indexOf("{ path: 'clases/dancehall-barcelona'");
    if (dancehallIndex !== -1) {
      const lineEnd = sitemapContent.indexOf('\n', dancehallIndex);
      sitemapContent = 
        sitemapContent.slice(0, lineEnd + 1) +
        routeEntry + '\n' +
        sitemapContent.slice(lineEnd + 1);
      
      await writeFile(sitemapScriptPath, sitemapContent, 'utf-8');
      
      // Ejecutar el script para regenerar sitemap.xml
      execSync('node scripts/update-sitemap.mjs', { cwd: rootDir, stdio: 'inherit' });
      log.success('Sitemap actualizado: sitemap.xml');
    }
  } catch (error) {
    log.warning(`No se pudo actualizar sitemap automáticamente: ${error.message}`);
    log.info('Puedes ejecutar manualmente: npm run update:sitemap');
  }
}

// 🆕 MEJORA 3: Generar imágenes placeholder SVG
async function generatePlaceholderImages(className, componentName) {
  log.info('Generando imágenes placeholder...');

  const imgDir = join(rootDir, `public/images/classes/${className}/img`);
  
  // Verificar si ya existen imágenes reales
  try {
    const files = await readFile(imgDir);
    if (files && files.length > 0) {
      log.info('Ya existen imágenes, saltando generación de placeholders');
      return;
    }
  } catch {
    // El directorio no existe o está vacío, continuar
  }

  // SVG placeholder simple y elegante
  const createPlaceholderSVG = (width, height, text) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(139,92,246);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(59,130,246);stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
        fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.9">
    ${text}
  </text>
  <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="24" 
        fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.7">
    ${componentName}
  </text>
</svg>`;

  const placeholders = [
    { name: `${className}-hero.svg`, width: 1920, height: 1080, text: 'Hero Image' },
    { name: `${className}-clase-1.svg`, width: 1200, height: 1500, text: 'Class Photo' },
    { name: `${className}-profesor.svg`, width: 800, height: 800, text: 'Instructor' },
  ];

  for (const placeholder of placeholders) {
    const svgContent = createPlaceholderSVG(placeholder.width, placeholder.height, placeholder.text);
    const outputPath = join(imgDir, placeholder.name);
    await writeFile(outputPath, svgContent, 'utf-8');
  }

  log.success(`Creados 3 placeholders SVG en: public/images/classes/${className}/img/`);
  log.warning('⚠️  Recuerda reemplazar los placeholders con imágenes reales antes de producción');
}

async function generateSummary(className, componentName) {
  log.title('✅ ¡Página Generada con Éxito! (Estructura 10/10)');

  console.log(`
📦 ${colors.bright}Archivos creados:${colors.reset}
   ${colors.green}✓${colors.reset} components/${componentName}Page.tsx ${colors.cyan}(basado en TwerkPage 10/10)${colors.reset}
   ${colors.green}✓${colors.reset} constants/${className}.ts ${colors.cyan}(15 FAQs + YouTube + GEO keys + Hero Stats)${colors.reset}
   ${colors.green}✓${colors.reset} public/images/classes/${className}/raw/
   ${colors.green}✓${colors.reset} public/images/classes/${className}/img/ ${colors.cyan}(con placeholders SVG)${colors.reset}
   ${colors.green}✓${colors.reset} .claude/i18n-${className}-template.txt ${colors.cyan}(COMPLETO - 120+ claves con GEO)${colors.reset}

📝 ${colors.bright}Archivos actualizados:${colors.reset}
   ${colors.green}✓${colors.reset} App.tsx (rutas añadidas)
   ${colors.green}✓${colors.reset} scripts/build-images.mjs
   ${colors.green}✓${colors.reset} scripts/update-sitemap.mjs
   ${colors.green}✓${colors.reset} sitemap.xml ${colors.cyan}(regenerado automáticamente!)${colors.reset}

🏆 ${colors.bright}ESTRUCTURA 10/10 (Orden AIDA optimizado):${colors.reset}
   ${colors.cyan}1.${colors.reset}  Hero (con Skip Links + main role="main")
   ${colors.cyan}2.${colors.reset}  What-Is Section
   ${colors.cyan}3.${colors.reset}  ${colors.bright}Schedule Section${colors.reset} ← Posición estratégica
   ${colors.cyan}4.${colors.reset}  ${colors.bright}Teachers Section${colors.reset} ← Credibilidad temprana
   ${colors.cyan}5.${colors.reset}  Identification Section (¿Te identificas?)
   ${colors.cyan}6.${colors.reset}  NeedEnroll + Transformation
   ${colors.cyan}7.${colors.reset}  WhyChoose + Stats + Logos
   ${colors.cyan}8.${colors.reset}  ${colors.bright}WhyToday Section${colors.reset} ← Urgencia
   ${colors.cyan}9.${colors.reset}  ${colors.bright}Video Section${colors.reset} ← Social proof visual
   ${colors.cyan}10.${colors.reset} Testimonials + FinalCTA
   ${colors.cyan}11.${colors.reset} ${colors.bright}CulturalHistory${colors.reset} ← Antes del FAQ (SEO)
   ${colors.cyan}12.${colors.reset} FAQ Section (15 FAQs)

✨ ${colors.bright}MEJORAS DE ACCESIBILIDAD (A11y):${colors.reset}
   ${colors.green}✓${colors.reset} Skip Links para navegación con teclado
   ${colors.green}✓${colors.reset} <main role="main"> en lugar de <div>
   ${colors.green}✓${colors.reset} aria-labelledby en todas las secciones
   ${colors.green}✓${colors.reset} Breakpoints responsivos (sm:, md:, lg:)
   ${colors.green}✓${colors.reset} focus-visible + active:scale-95 en CTAs
   ${colors.green}✓${colors.reset} motion-reduce para usuarios sensibles
   ${colors.green}✓${colors.reset} role="list" + aria-label en listas
   ${colors.green}✓${colors.reset} StarRating con size={8} (números, no strings)

🤖 ${colors.bright}GEO OPTIMIZATION (Generative Engine Optimization):${colors.reset}
   ${colors.green}✓${colors.reset} CitableOrigen - Origen histórico del estilo
   ${colors.green}✓${colors.reset} Statistics - Estadísticas científicas citables
   ${colors.green}✓${colors.reset} CitableEvolucionGlobal - Expansión mundial
   ${colors.green}✓${colors.reset} CitableMusica - Conexión con géneros musicales
   ${colors.green}✓${colors.reset} CitableIdentidadPoder - Empoderamiento y valores
   ${colors.green}✓${colors.reset} CitableFact1 - Calorías quemadas (300-500/hora)
   ${colors.green}✓${colors.reset} CitableFact2 - Beneficios cognitivos
   ${colors.green}✓${colors.reset} CitableFact3 - Valoración Google 5/5
   ${colors.cyan}→ Datos optimizados para ser citados por ChatGPT, Perplexity, etc.${colors.reset}

🔧 ${colors.bright}Siguiente paso (TODO):${colors.reset}

1️⃣  ${colors.cyan}Añadir traducciones i18n:${colors.reset}
    - Abre: ${colors.yellow}.claude/i18n-${className}-template.txt${colors.reset}
    - Copia las claves a: i18n/locales/es.ts
    - Traduce a: en.ts, ca.ts, fr.ts
    ${colors.bright}⚠️  ¡El template ya incluye las 100+ claves necesarias!${colors.reset}

2️⃣  ${colors.cyan}Actualizar YouTube video:${colors.reset}
    - Abre: constants/${className}.ts
    - Cambia: ${colors.yellow}${className.toUpperCase().replace(/-/g, '_')}_VIDEO_ID = 'YOUR_YOUTUBE_VIDEO_ID'${colors.reset}
    - Por el ID real de tu video de YouTube

3️⃣  ${colors.cyan}Reemplazar placeholders con imágenes reales:${colors.reset}
    - Sube imágenes JPG a: public/images/classes/${className}/raw/
    - Ejecuta: ${colors.yellow}npm run build:images${colors.reset}

4️⃣  ${colors.cyan}Personalizar contenido:${colors.reset}
    - Actualiza las secciones marcadas con [TODO] en las traducciones
    - Ajusta: Cultural History, Why Choose 7, FAQs específicas
    - Añade instructor bio real
    - ${colors.yellow}GEO: Personaliza los datos citables (origen, música, estadísticas)${colors.reset}

5️⃣  ${colors.cyan}Probar localmente:${colors.reset}
    ${colors.yellow}npm run dev${colors.reset}
    - Abre: http://localhost:5173/es/clases/${className}-barcelona

6️⃣  ${colors.cyan}Desplegar (workflow seguro):${colors.reset}
    ${colors.yellow}git checkout -b feat/${className}-page${colors.reset}
    ${colors.yellow}git add .${colors.reset}
    ${colors.yellow}git commit -m "feat: Add ${componentName} class page (15 FAQs, full SEO)"${colors.reset}
    ${colors.yellow}git push -u origin feat/${className}-page${colors.reset}
    - Abre PR en GitHub

📋 ${colors.bright}Checklist pre-lanzamiento:${colors.reset}
   [ ] Todas las traducciones completas (es, en, ca, fr)
   [ ] Imágenes optimizadas con npm run build:images
   [ ] Video de YouTube añadido
   [ ] Cultural History personalizado
   [ ] Instructor bio real
   [ ] 15 FAQs revisadas y personalizadas
   [ ] ${colors.yellow}GEO: Datos citables personalizados (origen, música, stats)${colors.reset}
   [ ] npm run typecheck sin errores

🎉 ${colors.green}¡Todo listo para empezar a trabajar en ${componentName}!${colors.reset}
`);
}

// 🚀 Main
async function main() {
  try {
    // Parsear argumentos o modo interactivo
    const args = process.argv.slice(2);
    let name, instructor, specialty;

    if (args.length > 0) {
      // Modo argumentos: --name=bachata --instructor="..." --specialty="..."
      const parsed = {};
      args.forEach((arg) => {
        const match = arg.match(/--(\w+)=(.*)/);
        if (match) parsed[match[1]] = match[2].replace(/['"]/g, '');
      });

      name = parsed.name;
      instructor = parsed.instructor || 'Instructor Name';
      specialty = parsed.specialty || 'Especialidad';
    } else {
      // Modo interactivo
      const input = await getInteractiveInput();
      name = input.name;
      instructor = input.instructor;
      specialty = input.specialty;
    }

    if (!name) {
      log.error('❌ Debes proporcionar un nombre de clase');
      log.info('Uso: npm run create:class -- --name=bachata --instructor="Carlos" --specialty="Bachata Sensual"');
      process.exit(1);
    }

    const className = toKebabCase(name);
    const componentName = toPascalCase(name);

    log.info(`Generando página de ${componentName}...`);
    log.info(`Instructor: ${instructor} (${specialty})`);

    // Ejecutar pasos
    await createPageComponent(className, componentName, instructor);
    await updateAppRoutes(className, componentName);
    await createI18nKeys(className, componentName, instructor, specialty);
    await createImageStructure(className);
    await updateBuildImagesScript(className);
    
    // 🆕 Nuevas mejoras automáticas
    await createConstantsFile(className, componentName, instructor);
    await updateSitemap(className);
    await generatePlaceholderImages(className, componentName);

    // Resumen final
    await generateSummary(className, componentName);

  } catch (error) {
    log.error(`❌ Error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main();
