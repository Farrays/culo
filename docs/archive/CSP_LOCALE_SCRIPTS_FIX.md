# Fix CSP para Scripts de Locale - 2025-12-06

## Problema

Vercel bloqueaba CSS/JS por Content Security Policy (CSP). El error real era que los **scripts inline de locale** inyectados por `prerender.mjs` no tenían sus hashes en el CSP.

## Diagnóstico

`prerender.mjs` (líneas 712-722) inyecta un script inline diferente para cada idioma:

```javascript
<script>
  // Set locale before React hydration
  (function() {
    const locale = 'es'; // Cambia por idioma: es, ca, en, fr
    localStorage.setItem('fidc_preferred_locale', locale);
    // ...
  })();
</script>
```

Cada variante tiene un hash SHA-256 diferente que debe estar en el CSP.

## Hashes necesarios

**IMPORTANTE:** Los hashes dependen del whitespace EXACTO del script generado. Siempre calcularlos desde los archivos en `dist/` después de `npm run build`.

| Idioma | Hash SHA-256 |
|--------|--------------|
| ES | `sha256-rCzSmNCIl1NJWcHIEy6e0/vPauItKFYiBux17aVmE5E=` |
| CA | `sha256-nLSiNfBCmVNw1A/3hLrEBVKH7Q5+lHqp2xUKBBXb8+A=` |
| EN | `sha256-BalffTW4u/osO9GQA/t2ZTaYxty5CtvcccqT8ivwwIo=` |
| FR | `sha256-A+vzvg9FqpPRh5i4moEMXeidCBdCGgbzBuXy/94sUzk=` |
| CSS onload (`this.media='all'`) | `sha256-MhtPZXr7+LpJUY5qtMutB+qWfQtMaPccfe7QXtCcEYc=` |

## Solución aplicada

Actualizado `vercel.json` línea 52, añadiendo los 4 hashes de locale al `script-src`.

## Cómo regenerar hashes si cambias prerender.mjs

**SIEMPRE usar este método** (lee los hashes desde los archivos generados):

```bash
npm run build && node -e "
const crypto = require('crypto');
const fs = require('fs');

const files = [
  { path: 'dist/es/index.html', lang: 'es' },
  { path: 'dist/ca/index.html', lang: 'ca' },
  { path: 'dist/en/index.html', lang: 'en' },
  { path: 'dist/fr/index.html', lang: 'fr' },
];

files.forEach(f => {
  const html = fs.readFileSync(f.path, 'utf8');
  const match = html.match(/<script>([^<]*Set locale[^<]*)<\/script>/);
  if (match) {
    const hash = crypto.createHash('sha256').update(match[1]).digest('base64');
    console.log(f.lang + \": 'sha256-\" + hash + \"'\");
  }
});
"
```

## Notas

- El hash del JSON-LD (`application/ld+json`) NO es necesario porque el navegador no lo ejecuta como JavaScript
- Si modificas el script de locale en `prerender.mjs`, debes regenerar los hashes y actualizar `vercel.json`
