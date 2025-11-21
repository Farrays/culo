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

async function generateSummary(className, componentName) {
  log.title('✅ ¡Página Generada con Éxito!');

  console.log(`
📦 ${colors.bright}Archivos creados:${colors.reset}
   ${colors.green}✓${colors.reset} components/${componentName}Page.tsx
   ${colors.green}✓${colors.reset} public/images/classes/${className}/raw/
   ${colors.green}✓${colors.reset} public/images/classes/${className}/img/
   ${colors.green}✓${colors.reset} .claude/i18n-${className}-template.txt

📝 ${colors.bright}Archivos actualizados:${colors.reset}
   ${colors.green}✓${colors.reset} App.tsx (rutas añadidas)
   ${colors.green}✓${colors.reset} scripts/build-images.mjs

🔧 ${colors.bright}Siguiente paso (TODO):${colors.reset}

1️⃣  ${colors.cyan}Añadir traducciones i18n:${colors.reset}
    - Abre: .claude/i18n-${className}-template.txt
    - Copia las claves a: i18n/locales/es.ts
    - Traduce a: en.ts, ca.ts, fr.ts

2️⃣  ${colors.cyan}Añadir imágenes:${colors.reset}
    - Sube 3 imágenes JPG a: public/images/classes/${className}/raw/
      → ${className}-hero.jpg
      → ${className}-clase-1.jpg
      → ${className}-profesor.jpg
    - Ejecuta: ${colors.yellow}npm run build:images${colors.reset}

3️⃣  ${colors.cyan}Personalizar contenido:${colors.reset}
    - Abre: components/${componentName}Page.tsx
    - Ajusta: textos, FAQs, testimonios, instructor bio
    - Reemplaza [TODO] en las traducciones

4️⃣  ${colors.cyan}Probar localmente:${colors.reset}
    ${colors.yellow}npm run dev${colors.reset}
    - Abre: http://localhost:5173/es/${className}

5️⃣  ${colors.cyan}Desplegar (workflow seguro):${colors.reset}
    ${colors.yellow}git checkout -b feat/${className}-page${colors.reset}
    ${colors.yellow}git add .${colors.reset}
    ${colors.yellow}git commit -m "feat: Add ${componentName} class page"${colors.reset}
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

    // Resumen final
    await generateSummary(className, componentName);

  } catch (error) {
    log.error(`❌ Error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main();
