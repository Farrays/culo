# 🚀 GUÍA PASO A PASO: Prerender para Indexabilidad SEO

## ⚠️ PROBLEMA CRÍTICO ACTUAL

Tu sitio es una SPA (Single Page Application). Cuando Google y otros bots visitan tu web, ven esto:

```html
<div id="root"></div>
<script src="/index.js"></script>
```

**Resultado:** **0% de contenido indexable** = 0% tráfico orgánico.

---

## ✅ SOLUCIÓN: Implementar Prerender

Necesitas generar HTML estático de todas las rutas para que los bots puedan leer el contenido.

---

## 📋 OPCIÓN 1: react-snap (MÁS RÁPIDA - Recomendada)

### Paso 1: Instalar react-snap

```bash
# En tu máquina local (Windows):
npm install --save-dev react-snap --legacy-peer-deps
```

### Paso 2: Configurar package.json

```json
{
  "scripts": {
    "build": "vite build",
    "postbuild": "react-snap"
  },
  "reactSnap": {
    "source": "dist",
    "minifyHtml": {
      "collapseWhitespace": false,
      "removeComments": false
    },
    "puppeteerArgs": ["--no-sandbox"],
    "include": [
      "/",
      "/es",
      "/ca",
      "/en",
      "/fr",
      "/es/classes",
      "/ca/classes",
      "/en/classes",
      "/fr/classes",
      "/es/dancehall",
      "/ca/dancehall",
      "/en/dancehall",
      "/fr/dancehall",
      "/es/afrobeats",
      "/ca/afrobeats",
      "/en/afrobeats",
      "/fr/afrobeats"
    ]
  }
}
```

### Paso 3: Modificar index.tsx

```typescript
// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Detectar si es prerender
if (rootElement.hasChildNodes()) {
  // Si ya tiene contenido (prerenderizado), hidratar
  root.hydr ate(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Si está vacío (primera carga), renderizar normal
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
```

### Paso 4: Build y verificar

```bash
npm run build

# Verificar que se generaron archivos HTML para cada ruta
ls dist/es/
ls dist/ca/
ls dist/en/
ls dist/fr/

# Deberías ver archivos como:
# dist/es/index.html
# dist/es/classes/index.html
# dist/es/dancehall/index.html
# etc.
```

### Paso 5: Verificar contenido indexable

```bash
# Ver que el HTML contiene el contenido real
cat dist/es/index.html | grep "Dance Classes"
# ✅ Debería encontrar el texto
```

---

## 📋 OPCIÓN 2: Prerender.io (Servicio Cloud - Fácil)

Si `react-snap` da problemas, usa un servicio:

### 1. Prerender.io

```nginx
# Configuración Nginx
location / {
    set $prerender 0;
    if ($http_user_agent ~* "googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|rogerbot|linkedinbot|embedly|quora|showyoubot|outbrain|pinterest|slackbot|vkshare|W3C_Validator") {
        set $prerender 1;
    }

    if ($prerender = 1) {
        proxy_pass http://service.prerender.io/https://www.farrayscenter.com$request_uri;
    }

    try_files $uri $uri/ /index.html;
}
```

**Costo:** ~$20/mes para 250 páginas cached

### 2. Netlify Prerender (Si usas Netlify)

En `netlify.toml`:

```toml
[[plugins]]
package = "@netlify/plugin-prerender"

[build]
  command = "npm run build"
  publish = "dist"
```

---

## 📋 OPCIÓN 3: Dynamic Rendering con Cloudflare Workers

Para proyectos avanzados:

```javascript
// workers/bot-detector.js
export default {
  async fetch(request, env) {
    const userAgent = request.headers.get('user-agent') || '';
    const isBot = /googlebot|bingbot|baiduspider|yandex/i.test(userAgent);

    if (isBot) {
      // Servir versión prerenderizada
      const prerenderUrl = `https://prerender.farrayscenter.com${new URL(request.url).pathname}`;
      return fetch(prerenderUrl);
    }

    // Servir SPA normal
    return fetch(request);
  }
}
```

---

## 🧪 VERIFICACIÓN POST-IMPLEMENTACIÓN

### Test 1: Verificar HTML estático contiene contenido

```bash
curl https://www.farrayscenter.com/es | grep -i "dance classes"
# ✅ DEBE encontrar el texto

curl https://www.farrayscenter.com/es/classes | grep -i "salsa"
# ✅ DEBE encontrar el texto
```

### Test 2: Google Search Console

1. Ve a: https://search.google.com/search-console
2. Inspecciona URL: `https://www.farrayscenter.com/es`
3. Haz clic en "Solicitar indexación"
4. Ver "HTML renderizado" → Deberías ver tu contenido

### Test 3: Rich Results Test

```
https://search.google.com/test/rich-results?url=https://www.farrayscenter.com/es
```

✅ Debería mostrar el JSON-LD y el contenido de la página

---

## 📊 IMPACTO ESPERADO

| Métrica | Antes (SPA sin prerender) | Después (Con prerender) |
|---------|---------------------------|-------------------------|
| **Contenido indexable** | 0% | 100% ✅ |
| **Páginas en Google** | ~4 | ~16 (4 idiomas × 4 páginas) |
| **SEO Score** | 45/100 | 85-90/100 |
| **Tráfico orgánico** | Baseline | +150-300% (3-6 meses) |

---

## ⏱️ TIEMPO ESTIMADO

- **react-snap:** 2-4 horas (incluye pruebas)
- **Prerender.io:** 1 hora (setup + config)
- **Dynamic Rendering:** 4-8 horas (avanzado)

---

## 🆘 TROUBLESHOOTING

### Error: "Chromium download failed"

```bash
# Opción 1: Skip Chromium download y usa local
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install react-snap

# Opción 2: Usa versión con Chromium bundled
npm install react-snap@1.23.0 --legacy-peer-deps
```

### Error: "Routes not found"

Verifica que las rutas en `reactSnap.include` coincidan con tu routing:

```json
"include": [
  "/es",           // ✅ Correcto
  "/es/classes",   // ✅ Correcto
  "/classes"       // ❌ Incorrecto (falta idioma)
]
```

### Error: "Hydration mismatch"

Usa `root.hydrate()` en lugar de `root.render()` cuando detectes contenido prerrenderizado:

```typescript
if (rootElement.hasChildNodes()) {
  root.hydrate(<App />);  // ✅ Para prerender
} else {
  root.render(<App />);   // ✅ Para primera carga
}
```

---

## ✅ CHECKLIST FINAL

Antes de pasar a producción:

- [ ] Build genera HTML para todas las rutas (16 páginas)
- [ ] HTML contiene contenido visible (no solo `<div id="root">`)
- [ ] curl muestra texto real, no solo JavaScript
- [ ] Google Search Console indexa correctamente
- [ ] Rich Results Test muestra JSON-LD
- [ ] Lighthouse SEO >= 85/100
- [ ] Search Console muestra 16 páginas indexadas (4 idiomas × 4 páginas)

---

## 📞 SOPORTE

Si necesitas ayuda:
1. Revisa los logs de `npm run build`
2. Verifica el HTML generado en `dist/`
3. Usa Google Search Console → Inspección de URL

---

**Última actualización:** 2025-11-08
**Prioridad:** 🔴 CRÍTICA - Sin esto, Google NO indexa tu contenido
