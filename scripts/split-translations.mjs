import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el archivo es.ts
const esFilePath = path.join(__dirname, '../i18n/locales/es.ts');
let esContent = fs.readFileSync(esFilePath, 'utf-8');

// Remover comentarios de línea
esContent = esContent.replace(/^(\s*)\/\/.*$/gm, '');

// Función para extraer traducciones usando un parser de estado
function extractTranslations(content) {
  const translations = {};

  // Encontrar el inicio del objeto
  const match = content.match(/export\s+const\s+es\s+=\s+\{/);
  if (!match) {
    throw new Error('No se encontró "export const es = {" en el archivo');
  }

  // Empezar después del { inicial
  let i = match.index + match[0].length;
  const len = content.length;

  let currentKey = '';
  let currentValue = '';
  let inKey = false;
  let inValue = false;
  let quoteChar = '';
  let braceDepth = 1; // Ya estamos dentro del primer {
  let charBuffer = '';

  while (i < len && braceDepth > 0) {
    const char = content[i];

    // Manejar llaves para tracking de profundidad
    if (!inValue && char === '{') {
      braceDepth++;
    } else if (!inValue && char === '}') {
      braceDepth--;
      if (braceDepth === 0) break;
    }

    // Buscar el inicio de una key (key:)
    if (!inKey && !inValue && /[a-zA-Z0-9_]/.test(char)) {
      charBuffer = char;
      inKey = true;
    } else if (inKey && /[a-zA-Z0-9_]/.test(char)) {
      charBuffer += char;
    } else if (inKey && char === ':') {
      currentKey = charBuffer.trim();
      charBuffer = '';
      inKey = false;

      // Buscar el inicio del valor (después de :)
      // Saltar espacios hasta encontrar comilla
      let j = i + 1;
      while (j < len && /\s/.test(content[j])) {
        j++;
      }

      if (content[j] === '"' || content[j] === "'" || content[j] === '`') {
        quoteChar = content[j];
        inValue = true;
        i = j + 1; // Posicionar DESPUÉS de la comilla de apertura
        currentValue = '';
        continue; // Continuar sin incrementar i al final
      }
    } else if (inKey && /\s/.test(char)) {
      // Ignorar espacios en la key
    } else if (inKey) {
      // Carácter inesperado, resetear
      inKey = false;
      charBuffer = '';
    }

    // Recolectar valor
    if (inValue) {
      // Verificar si este carácter es la comilla de cierre
      if (char === quoteChar) {
        // Verificar si está escapado
        let backslashCount = 0;
        let k = i - 1;
        while (k >= 0 && content[k] === '\\') {
          backslashCount++;
          k--;
        }

        if (backslashCount % 2 === 0) {
          // No está escapado, fin del valor
          translations[currentKey] = currentValue;
          currentKey = '';
          currentValue = '';
          inValue = false;
          quoteChar = '';
        } else {
          // Está escapado, agregar al valor
          currentValue += char;
        }
      } else {
        // No es la comilla de cierre, agregar al valor
        currentValue += char;
      }
    }

    i++;
  }

  return translations;
}

console.log('Extrayendo traducciones del archivo es.ts...');
const translations = extractTranslations(esContent);

console.log(`Total keys extraídas: ${Object.keys(translations).length}`);

// Clasificar keys por namespace
const namespaces = {
  // CORE
  common: {},

  // EAGER
  booking: {},
  schedule: {},
  calendar: {},

  // LAZY
  home: {},
  classes: {},
  blog: {},
  faq: {},
  about: {},
  contact: {},
  pages: {}
};

// Función para clasificar una key
function classifyKey(key) {
  // CORE - common.json (nav, header, footer, seo, breadcrumb, etc.)
  if (key.startsWith('nav') ||
      key.startsWith('header') ||
      key.startsWith('footer') ||
      key.startsWith('seo_') ||
      key.startsWith('meta_') ||
      key.startsWith('og_') ||
      key.startsWith('breadcrumb_') ||
      key === 'breadcrumbHome' ||
      key === 'pageTitle' ||
      key === 'metaDescription' ||
      key === 'skipToMainContent' ||
      key === 'skipToMain' ||
      key === 'closeButton' ||
      key === 'home' ||
      key === 'contact' ||
      key === 'contactUs' ||
      key === 'viewSchedule' ||
      key === 'bookNow' ||
      key === 'bookTrialClass' ||
      key === 'enrollNow' ||
      key === 'ratingAriaLabel' ||
      key === 'teacherAvatarAlt' ||
      key.startsWith('logo_') ||
      key.startsWith('teacher_photo_') ||
      key.startsWith('instagram_post_') ||
      key.startsWith('statsbar_') ||
      key.startsWith('trustbar_') ||
      key.startsWith('reviews_') ||
      key.startsWith('notFound_') ||
      key.startsWith('legalNotice_')) {
    return 'common';
  }

  // EAGER - booking.json
  if (key.startsWith('booking_') || key.startsWith('bookingWidget_')) {
    return 'booking';
  }

  // EAGER - schedule.json
  if (key.startsWith('schedule_') ||
      key.startsWith('dayShort_') ||
      key.startsWith('day_') ||
      key.startsWith('horarios_') ||
      key.startsWith('horariosV2_')) {
    return 'schedule';
  }

  // EAGER - calendar.json
  if (key.startsWith('calendar_') || key.startsWith('calendario_')) {
    return 'calendar';
  }

  // LAZY - home.json (homepage elements)
  if (key.startsWith('hero_') ||
      key.startsWith('heroTitle') ||
      key.startsWith('heroSubtitle') ||
      key.startsWith('heroTagline') ||
      key.startsWith('heroValue') ||
      key.startsWith('heroCTA') ||
      key.startsWith('heroScroll') ||
      key.startsWith('heroPoster') ||
      key.startsWith('pas_') ||
      key.startsWith('offer_') ||
      key.startsWith('videotestimonials_') ||
      key.startsWith('cta_') ||
      key.startsWith('ctaShort') ||
      key.startsWith('philosophy') ||
      key.startsWith('happiness') ||
      key.startsWith('homev2_') ||
      key.startsWith('home_') ||
      key.startsWith('classes') && !key.startsWith('classes_') ||
      key.startsWith('classCat') ||
      key.startsWith('why') ||
      key.startsWith('services') ||
      key.startsWith('service') ||
      key.startsWith('testimonial') ||
      key.startsWith('instructor') && !key.startsWith('instructors_') ||
      key.startsWith('manifesto_') ||
      key === 'limitedSpots' ||
      key === 'startToday' ||
      key === 'finalCTADefaultNote' ||
      key === 'nearbyAreasTitle' ||
      key === 'trustStats' ||
      key === 'classesPerSession') {
    return 'home';
  }

  // LAZY - classes.json (dance class hub and teacher pages)
  if (key.startsWith('classes_') ||
      key.startsWith('instructors_') ||
      key.startsWith('teacher_') ||
      key.startsWith('profesor_') ||
      key.startsWith('danceClassesHub_')) {
    return 'classes';
  }

  // LAZY - blog.json
  if (key.startsWith('blog')) {
    return 'blog';
  }

  // LAZY - faq.json
  if (key.startsWith('faq_')) {
    return 'faq';
  }

  // LAZY - about.json (about, method, yunaisy)
  if (key.startsWith('about_') ||
      key.startsWith('about') && !key.startsWith('about_') ||
      key.startsWith('yunaisy_') ||
      key.startsWith('yunaisyFarray_') ||
      key.startsWith('metodo_') ||
      key.startsWith('metodofarray_') ||
      key.startsWith('metodoFarray_')) {
    return 'about';
  }

  // LAZY - contact.json
  if (key.startsWith('contact_') ||
      key.startsWith('form_') ||
      key.startsWith('leadModal_') ||
      key.startsWith('exitIntent_') ||
      // Lead modals específicos de clases
      key.startsWith('acLeadModal_') ||
      key.startsWith('ajLeadModal_') ||
      key.startsWith('abLeadModal_') ||
      key.startsWith('scLeadModal_') ||
      key.startsWith('dhLeadModal_') ||
      key.startsWith('twLeadModal_') ||
      key.startsWith('sxrLeadModal_') ||
      key.startsWith('hhrLeadModal_') ||
      key.startsWith('hhLeadModal_') ||
      key.startsWith('ssLeadModal_') ||
      key.startsWith('ctLeadModal_') ||
      key.startsWith('btLeadModal_') ||
      key.startsWith('jpaLeadModal_') ||
      key.startsWith('baLeadModal_') ||
      // Exit intents
      key.startsWith('dhExitIntent_') ||
      key.startsWith('femExitIntent_') ||
      key.startsWith('twExitIntent_') ||
      key.startsWith('sxrExitIntent_') ||
      key.startsWith('hhrExitIntent_') ||
      key.startsWith('hhExitIntent_') ||
      key.startsWith('abExitIntent_') ||
      key.startsWith('ajExitIntent_') ||
      key.startsWith('acExitIntent_') ||
      key.startsWith('ssExitIntent_') ||
      key.startsWith('scExitIntent_') ||
      key.startsWith('ctExitIntent_') ||
      key.startsWith('btExitIntent_') ||
      key.startsWith('baExitIntent_') ||
      key.startsWith('jpaExitIntent_')) {
    return 'contact';
  }

  // Default - pages.json (specific pages: pricing, services, legal, etc.)
  // Esto incluirá: schema_, terms_, pricing_, privacy_, cookies_, roomRental_,
  // particularesPage_, teamBuilding_, regalaBaile_, estudioGrabacion_,
  // heelsBarcelona_, prepFisica_, danzaBarcelona_, danzasUrbanas_, etc.
  return 'pages';
}

// Clasificar todas las keys
console.log('Clasificando keys por namespace...');
for (const [key, value] of Object.entries(translations)) {
  const namespace = classifyKey(key);
  namespaces[namespace][key] = value;
}

// Crear directorio si no existe
const outputDir = path.join(__dirname, '../i18n/locales/es');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Escribir archivos JSON
console.log('\nEscribiendo archivos JSON...');
for (const [namespace, obj] of Object.entries(namespaces)) {
  const outputPath = path.join(outputDir, `${namespace}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(obj, null, 2), 'utf-8');
  console.log(`✓ ${namespace}.json: ${Object.keys(obj).length} keys`);
}

// Resumen final
console.log('\n=== RESUMEN ===');
let total = 0;
for (const [namespace, obj] of Object.entries(namespaces)) {
  const count = Object.keys(obj).length;
  console.log(`${namespace}: ${count} keys`);
  total += count;
}
console.log(`\nTotal: ${total} keys`);

// Verificar que no perdimos keys
if (total !== 13049 && total !== 13050) {
  console.warn(`\n⚠️ ADVERTENCIA: Se esperaban ~13,049 keys pero se procesaron ${total}`);
  console.warn(`   Diferencia: ${13049 - total} keys`);
} else {
  console.log('\n✅ Todas las keys fueron procesadas correctamente');
}
