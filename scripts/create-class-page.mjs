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

// 📝 Plantilla de metadatos para nuevas clases
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

async function createPageComponent(className, componentName) {
  log.info(`Creando componente ${componentName}.tsx...`);

  const template = await readFile(join(rootDir, 'components/DancehallPage.tsx'), 'utf-8');

  // Reemplazos básicos
  let newContent = template
    .replace(/dancehall/g, className)
    .replace(/Dancehall/g, componentName)
    .replace(/DANCEHALL/g, className.toUpperCase());

  // Actualizar iconos de pillars si hay plantilla
  const classTemplate = classTemplates[className];
  if (classTemplate) {
    // Aquí se pueden hacer reemplazos más sofisticados de icons, FAQs, etc.
    log.info(`Usando plantilla predefinida para ${className}`);
  }

  const outputPath = join(rootDir, `components/${componentName}Page.tsx`);
  await writeFile(outputPath, newContent, 'utf-8');
  log.success(`Creado: components/${componentName}Page.tsx`);

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
  log.info('Generando claves i18n (plantilla en español)...');

  const classTemplate = classTemplates[className] || {
    pillar1: { title: 'Pilar 1', desc: 'Descripción del pilar 1' },
    pillar2: { title: 'Pilar 2', desc: 'Descripción del pilar 2' },
    pillar3: { title: 'Pilar 3', desc: 'Descripción del pilar 3' },
    faqs: [
      { q: 'Pregunta 1', a: 'Respuesta 1' },
      { q: 'Pregunta 2', a: 'Respuesta 2' },
      { q: 'Pregunta 3', a: 'Respuesta 3' },
      { q: 'Pregunta 4', a: 'Respuesta 4' },
    ],
  };

  const i18nTemplate = `
  // ===== ${componentName} Page =====
  ${className}PageTitle: 'Clases de ${componentName} en Barcelona | Farray\\'s Center',
  ${className}MetaDescription: 'Aprende ${componentName} en Barcelona con los mejores instructores. Clases para todos los niveles. ¡Reserva tu plaza!',

  ${className}HeroTitle: '${componentName}',
  ${className}HeroSubtitle: 'Descubre el ritmo y la pasión del ${componentName} en Farray\\'s Center',

  ${className}AboutTitle: '¿Qué es ${componentName}?',
  ${className}AboutDesc1: 'Descripción general del ${componentName}. [TODO: Personalizar]',
  ${className}AboutDesc2: 'Descripción adicional sobre el estilo y la cultura. [TODO: Personalizar]',

  ${className}Pillar1Title: '${classTemplate.pillar1.title}',
  ${className}Pillar1Desc: '${classTemplate.pillar1.desc}',
  ${className}Pillar2Title: '${classTemplate.pillar2.title}',
  ${className}Pillar2Desc: '${classTemplate.pillar2.desc}',
  ${className}Pillar3Title: '${classTemplate.pillar3.title}',
  ${className}Pillar3Desc: '${classTemplate.pillar3.desc}',

  ${className}ClassesTitle: 'Nuestras Clases de ${componentName}',
  ${className}ClassesSubtitle: 'Clases para todos los niveles',

  ${className}LevelBeginnerTitle: 'Principiante',
  ${className}LevelBeginnerDesc: 'Ideal para quienes empiezan desde cero. Aprende los fundamentos del ${componentName}.',
  ${className}LevelInterTitle: 'Intermedio',
  ${className}LevelInterDesc: 'Perfecciona tu técnica y aprende movimientos avanzados.',
  ${className}LevelAdvancedTitle: 'Avanzado',
  ${className}LevelAdvancedDesc: 'Dominación completa del ${componentName} con coreografías y freestyle.',

  ${className}InstructorTitle: 'Tu Instructor',
  ${className}InstructorName: '${instructor}',
  ${className}InstructorSpecialty: '${specialty}',
  ${className}InstructorBio: 'Biografía del instructor. [TODO: Personalizar con experiencia, logros, estilo de enseñanza]',

  ${className}TestimonialsTitle: 'Lo que dicen nuestros alumnos',
  ${className}Testimonial1Name: 'María G.',
  ${className}Testimonial1Quote: 'Las clases de ${componentName} son increíbles. El ambiente es genial y el profesor explica muy bien.',
  ${className}Testimonial2Name: 'David L.',
  ${className}Testimonial2Quote: 'He mejorado muchísimo en solo 3 meses. Totalmente recomendable.',

  ${className}FaqQ1: '${classTemplate.faqs[0].q}',
  ${className}FaqA1: '${classTemplate.faqs[0].a}',
  ${className}FaqQ2: '${classTemplate.faqs[1].q}',
  ${className}FaqA2: '${classTemplate.faqs[1].a}',
  ${className}FaqQ3: '${classTemplate.faqs[2].q}',
  ${className}FaqA3: '${classTemplate.faqs[2].a}',
  ${className}FaqQ4: '${classTemplate.faqs[3].q}',
  ${className}FaqA4: '${classTemplate.faqs[3].a}',

  ${className}Image1Alt: 'Clases de ${componentName} en Barcelona - Farray\\'s Center',
  ${className}Image2Alt: 'Estudiantes practicando ${componentName}',
  ${className}Image3Alt: '${instructor} - Instructor de ${componentName}',
`;

  // Guardar en archivo temporal para que el usuario lo copie
  const outputPath = join(rootDir, `.claude/i18n-${className}-template.txt`);
  await writeFile(outputPath, i18nTemplate.trim(), 'utf-8');
  log.success(`Generado: .claude/i18n-${className}-template.txt`);
  log.warning(`👉 Copia estas claves a i18n/locales/es.ts y traduce a los demás idiomas`);
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

// 🆕 MEJORA 1: Generar archivo de constantes automáticamente
async function createConstantsFile(className, componentName, instructor) {
  log.info(`Generando constants/${className}.ts...`);

  const classTemplate = classTemplates[className];
  const faqCount = classTemplate?.faqs?.length || 4;
  
  // Convert className to valid constant name (replace hyphens with underscores)
  const constName = className.toUpperCase().replace(/-/g, '_');

  const constantsContent = `import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for ${componentName} page
export const ${constName}_FAQS_CONFIG: FAQ[] = [
${Array.from({ length: faqCount }, (_, i) => {
  const num = i + 1;
  return `  { id: '${className}-${num}', questionKey: '${className.replace(/-/g, '')}FaqQ${num}', answerKey: '${className.replace(/-/g, '')}FaqA${num}' },`;
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

// Course schema configuration
export const ${constName}_COURSE_CONFIG = {
  teaches: '${componentName}, técnica de danza, musicalidad',
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
    className: '${componentName} Intermedio',
    time: '20:00 - 21:00',
    teacher: '${instructor}',
    levelKey: 'intermediateLevel',
  },
  {
    id: '3',
    dayKey: 'friday',
    className: '${componentName} Avanzado',
    time: '21:00 - 22:00',
    teacher: '${instructor}',
    levelKey: 'advancedLevel',
  },
];

// Breadcrumb custom keys for ${componentName}
export const ${constName}_BREADCRUMB_KEYS = {
  home: '${className.replace(/-/g, '')}BreadcrumbHome',
  classes: '${className.replace(/-/g, '')}BreadcrumbClasses',
  current: '${className.replace(/-/g, '')}BreadcrumbCurrent',
};
`;

  const outputPath = join(rootDir, `constants/${className}.ts`);
  await writeFile(outputPath, constantsContent, 'utf-8');
  log.success(`Creado: constants/${className}.ts`);
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
  log.title('✅ ¡Página Generada con Éxito!');

  console.log(`
📦 ${colors.bright}Archivos creados:${colors.reset}
   ${colors.green}✓${colors.reset} components/${componentName}Page.tsx
   ${colors.green}✓${colors.reset} constants/${className}.ts ${colors.cyan}(NUEVO!)${colors.reset}
   ${colors.green}✓${colors.reset} public/images/classes/${className}/raw/
   ${colors.green}✓${colors.reset} public/images/classes/${className}/img/ ${colors.cyan}(con placeholders SVG)${colors.reset}
   ${colors.green}✓${colors.reset} .claude/i18n-${className}-template.txt

📝 ${colors.bright}Archivos actualizados:${colors.reset}
   ${colors.green}✓${colors.reset} App.tsx (rutas añadidas)
   ${colors.green}✓${colors.reset} scripts/build-images.mjs
   ${colors.green}✓${colors.reset} scripts/update-sitemap.mjs ${colors.cyan}(NUEVO!)${colors.reset}
   ${colors.green}✓${colors.reset} sitemap.xml ${colors.cyan}(regenerado automáticamente!)${colors.reset}

🎉 ${colors.bright}Mejoras implementadas:${colors.reset}
   ${colors.cyan}1.${colors.reset} Constantes generadas automáticamente
   ${colors.cyan}2.${colors.reset} Sitemap actualizado con nueva ruta
   ${colors.cyan}3.${colors.reset} Placeholders SVG creados (reemplázalos con imágenes reales)

🔧 ${colors.bright}Siguiente paso (TODO):${colors.reset}

1️⃣  ${colors.cyan}Añadir traducciones i18n:${colors.reset}
    - Abre: .claude/i18n-${className}-template.txt
    - Copia las claves a: i18n/locales/es.ts
    - Traduce a: en.ts, ca.ts, fr.ts

2️⃣  ${colors.cyan}Reemplazar placeholders con imágenes reales:${colors.reset}
    - Los placeholders SVG ya están en: public/images/classes/${className}/img/
    - Sube 3 imágenes JPG a: public/images/classes/${className}/raw/
      → ${className}-hero.jpg
      → ${className}-clase-1.jpg
      → ${className}-profesor.jpg
    - Ejecuta: ${colors.yellow}npm run build:images${colors.reset}

3️⃣  ${colors.cyan}Personalizar contenido:${colors.reset}
    - Abre: components/${componentName}Page.tsx
    - Actualiza imports para usar: ${colors.yellow}constants/${className}${colors.reset}
    - Ajusta: textos, FAQs, testimonios en constants/${className}.ts
    - Reemplaza [TODO] en las traducciones

4️⃣  ${colors.cyan}Probar localmente:${colors.reset}
    ${colors.yellow}npm run dev${colors.reset}
    - Abre: http://localhost:5173/es/clases/${className}-barcelona

5️⃣  ${colors.cyan}Desplegar (workflow seguro):${colors.reset}
    ${colors.yellow}git checkout -b feat/${className}-page${colors.reset}
    ${colors.yellow}git add .${colors.reset}
    ${colors.yellow}git commit -m "feat: Add ${componentName} class page with auto-generated constants and sitemap"${colors.reset}
    ${colors.yellow}git push -u origin feat/${className}-page${colors.reset}
    - Abre PR en GitHub
    - Revisa preview de Vercel
    - Mergea cuando esté perfecto

📚 ${colors.bright}Documentación:${colors.reset}
    - Workflow: .claude/WORKFLOW_GUIDE.md
    - Imágenes: EJEMPLO_USO_IMAGENES.md

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
    await createPageComponent(className, componentName);
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
