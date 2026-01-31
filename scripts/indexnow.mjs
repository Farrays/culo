#!/usr/bin/env node
/**
 * IndexNow - Instant URL Indexing
 *
 * Notifica a Bing, Yandex, Seznam y Naver cuando hay contenido nuevo.
 * Los motores comparten el ping, así que solo enviamos a uno.
 *
 * Uso:
 *   npm run indexnow              # Envía URLs principales
 *   npm run indexnow -- --all     # Envía TODAS las URLs del sitemap
 *   npm run indexnow -- --url /es/blog/nuevo-articulo  # URL específica
 *
 * Docs: https://www.indexnow.org/documentation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// =============================================================================
// CONFIGURACIÓN
// =============================================================================
const CONFIG = {
  host: 'www.farrayscenter.com',
  key: 'a75f249fdac2ac46921eebc540dec988',
  keyLocation: 'https://www.farrayscenter.com/a75f249fdac2ac46921eebc540dec988.txt',
  // IndexNow endpoints (all share the same index, only need to ping one)
  endpoints: [
    'https://api.indexnow.org/indexnow',  // Generic (distributes to all)
    // Alternatives if needed:
    // 'https://www.bing.com/indexnow',
    // 'https://yandex.com/indexnow',
  ],
  // URLs prioritarias para enviar siempre
  priorityUrls: [
    '/',
    '/es',
    '/ca',
    '/en',
    '/fr',
    '/es/clases/baile-barcelona',
    '/es/horarios-precios',
    '/es/contacto',
    '/es/reservas',
    '/es/blog',
  ],
};

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Extrae todas las URLs del sitemap.xml
 */
function getUrlsFromSitemap() {
  const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');

  if (!fs.existsSync(sitemapPath)) {
    console.error('❌ sitemap.xml no encontrado');
    return [];
  }

  const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
  const urlRegex = /<loc>(https:\/\/www\.farrayscenter\.com[^<]+)<\/loc>/g;
  const urls = [];
  let match;

  while ((match = urlRegex.exec(sitemap)) !== null) {
    // Convertir URL absoluta a path relativo
    const url = match[1].replace('https://www.farrayscenter.com', '');
    urls.push(url || '/');
  }

  // Eliminar duplicados
  return [...new Set(urls)];
}

/**
 * Envía URLs a IndexNow
 */
async function submitToIndexNow(urls) {
  if (urls.length === 0) {
    console.log('⚠️  No hay URLs para enviar');
    return;
  }

  // Convertir paths a URLs absolutas
  const absoluteUrls = urls.map(url =>
    url.startsWith('http') ? url : `https://${CONFIG.host}${url}`
  );

  const payload = {
    host: CONFIG.host,
    key: CONFIG.key,
    keyLocation: CONFIG.keyLocation,
    urlList: absoluteUrls,
  };

  console.log(`\n📤 Enviando ${absoluteUrls.length} URLs a IndexNow...\n`);

  for (const endpoint of CONFIG.endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok || response.status === 202) {
        console.log(`✅ ${endpoint}`);
        console.log(`   Status: ${response.status} ${response.statusText}`);
        console.log(`   URLs enviadas: ${absoluteUrls.length}`);

        // Solo necesitamos enviar a un endpoint (comparten índice)
        break;
      } else {
        const errorText = await response.text();
        console.log(`⚠️  ${endpoint}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Error: ${errorText}`);
      }
    } catch (error) {
      console.error(`❌ Error con ${endpoint}:`, error.message);
    }
  }
}

/**
 * Muestra las primeras N URLs que se enviarán
 */
function previewUrls(urls, limit = 10) {
  console.log(`\n📋 URLs a indexar (${urls.length} total):`);
  urls.slice(0, limit).forEach(url => console.log(`   ${url}`));
  if (urls.length > limit) {
    console.log(`   ... y ${urls.length - limit} más`);
  }
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('🚀 IndexNow - Farray\'s Center');
  console.log('================================\n');

  const args = process.argv.slice(2);
  let urlsToSubmit = [];

  // Parsear argumentos
  if (args.includes('--all')) {
    // Enviar todas las URLs del sitemap
    console.log('📖 Modo: TODAS las URLs del sitemap');
    urlsToSubmit = getUrlsFromSitemap();
  } else if (args.includes('--url')) {
    // Enviar URL específica
    const urlIndex = args.indexOf('--url') + 1;
    if (urlIndex < args.length) {
      const specificUrl = args[urlIndex];
      console.log(`📖 Modo: URL específica`);
      urlsToSubmit = [specificUrl];
    } else {
      console.error('❌ Falta la URL después de --url');
      process.exit(1);
    }
  } else if (args.includes('--changed')) {
    // Enviar URLs modificadas recientemente (basado en lastmod del sitemap)
    console.log('📖 Modo: URLs modificadas hoy');
    const allUrls = getUrlsFromSitemap();
    // Por ahora, envía las prioritarias + las del blog
    urlsToSubmit = [
      ...CONFIG.priorityUrls,
      ...allUrls.filter(url => url.includes('/blog/')),
    ];
    urlsToSubmit = [...new Set(urlsToSubmit)];
  } else {
    // Por defecto: URLs prioritarias
    console.log('📖 Modo: URLs prioritarias');
    urlsToSubmit = CONFIG.priorityUrls;
  }

  // Preview
  previewUrls(urlsToSubmit);

  // Verificar que el archivo de clave existe
  const keyFilePath = path.join(__dirname, '..', 'public', `${CONFIG.key}.txt`);
  if (!fs.existsSync(keyFilePath)) {
    console.error(`\n❌ Archivo de clave no encontrado: ${keyFilePath}`);
    console.error('   Crea el archivo con el contenido de la clave.');
    process.exit(1);
  }

  // Enviar
  await submitToIndexNow(urlsToSubmit);

  console.log('\n✨ IndexNow completado');
  console.log('   Los motores de búsqueda procesarán las URLs en minutos.\n');
}

main().catch(console.error);
