# 🔧 PLAN DE ARREGLOS - SEGURIDAD & PERFORMANCE

**Proyecto:** FarRays Center  
**Fecha:** 2025-11-11  
**Status:** Plan de acción para issues de auditoría  

---

## 📊 MATRIZ DE PRIORIDAD

```
CRÍTICOS (Ya arreglados):
├─ ✅ XSS dangerouslySetInnerHTML → HECHO

ALTOS (Prioritarios, pero no urgentes):
├─ 🟠 1. Dependencias con CVEs (npm audit)
├─ 🟠 2. CORS demasiado abierto
├─ 🟠 3. HTTP/TLS mal configurado (PARA CUANDO ESTÉ DEPLOYED)
├─ 🟠 4. Headers de seguridad / CSP

MEDIOS (Próximos sprints):
├─ 🟡 5. Control de acceso inseguro (IDOR) - N/A (frontend)
├─ 🟡 6. Performance: assets grandes sin compresión
├─ 🟡 7. Logging y monitorización (Sentry)

BAJOS (Mejoras recomendadas):
├─ 🟢 8. Accesibilidad básica
├─ 🟢 9. README y tests
```

---

## 🔴 ALTOS - PRIORITARIOS

### 1️⃣ DEPENDENCIAS CON CVEs

**Qué es:** Paquetes npm desactualizados con vulnerabilidades conocidas

**Status actual:** DESCONOCIDO (no ejecutado audit)

**Qué hacer:**

```bash
# Paso 1: Ejecutar auditoría
npm audit

# Paso 2: Ver vulnerabilidades críticas
npm audit --audit-level=moderate

# Paso 3: Actualizar automáticamente (si es seguro)
npm audit fix

# Paso 4: Si no se puede auto-actualizar, revisar manualmente
npm update [package-name]@latest

# Paso 5: Verificar que build sigue funcionando
npm run build
npm run test:run

# Paso 6: Hacer commit
git add package.json package-lock.json
git commit -m "chore: update dependencies and fix CVEs

- Ran npm audit
- Updated packages with known vulnerabilities
- Verified tests pass"
```

**Tiempo estimado:** 1-4 horas  
**Cuando hacer:** HOY o ESTA SEMANA  
**Testing requerido:** npm run test:run, npm run build

---

### 2️⃣ CORS DEMASIADO ABIERTO

**Qué es:** API acepta orígenes arbitrarios (Access-Control-Allow-Origin: *)

**Status actual:** ⚠️ REQUIERE VERIFICACIÓN

**Verificar en:**
- `vite.config.ts` - Si hay CORS configurado
- `vercel.json` - Si hay headers CORS

**Qué hacer:**

```bash
# 1. Revisar configuración actual
cat vite.config.ts  # Buscar 'cors'
cat vercel.json     # Buscar 'Access-Control'

# 2. Si está abierto (* ), configurar restrictivo:
# En vercel.json, agregar headers:
```

**Archivo: `vercel.json`**

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://www.farrayscenter.com,https://farrayscenter.com,http://localhost:5173"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

**⚠️ NOTA:** Este proyecto es FRONTEND-ONLY, sin /api endpoints reales.

**Si no hay endpoints:** No aplica ahora, pero cuando agregue backend, implementar esto.

**Tiempo estimado:** 30 minutos  
**Cuando hacer:** Cuando agregue backend  

---

### 3️⃣ HTTP/TLS MAL CONFIGURADO

**Qué es:** El sitio puede servir por HTTP o usar TLS débil

**Status actual:** ⏰ APLAZA PARA CUANDO ESTÉ DEPLOYED

**Por qué posponerlo:** 
- Vercel maneja HTTPS automáticamente
- HSTS se configura DESPUÉS de tener HTTPS estable
- Certificados gestionados por Vercel

**Qué hacer AHORA (preparativo):**

```json
// En vercel.json - Agregar para cuando esté deployed:
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "upgrade-insecure-requests",
          "value": "1"
        }
      ]
    }
  ]
}
```

**Tiempo estimado:** 30 minutos (cuando sea necesario)  
**Cuando hacer:** DESPUÉS de primera versión en producción  

---

### 4️⃣ HEADERS DE SEGURIDAD / CSP

**Qué es:** No hay Content-Security-Policy y otros headers

**Status actual:** ✅ PARCIAL (algunos headers en vercel.json)

**Qué está:** X-Content-Type-Options, X-Frame-Options  
**Qué falta:** CSP, Referrer-Policy, X-XSS-Protection

**Plan:**

#### Paso 1: Actualizar `vercel.json`

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy-Report-Only",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://sentry.io; frame-ancestors 'none';"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

**⚠️ NOTA:** Usar `Content-Security-Policy-Report-Only` primero.

#### Paso 2: Testing en local

```bash
# Verificar headers en desarrollo
npm run dev

# En otro terminal:
curl -i http://localhost:5173

# Buscar los headers
```

#### Paso 3: Cuando esté en Vercel

1. Deploy con `Report-Only`
2. Monitorear reports (1-2 días)
3. Cambiar a `Content-Security-Policy` cuando esté seguro

**Tiempo estimado:** 2-6 horas (incluye testing)  
**Cuando hacer:** ESTA SEMANA  

---

## 🟡 MEDIOS - PRÓXIMOS SPRINTS

### 5️⃣ CONTROL DE ACCESO INSEGURO (IDOR)

**Status:** 🟢 N/A - Frontend puro, sin endpoints

No aplica a este proyecto (no hay resources con IDs editables).

**Cuando agregue backend:** Implementar verificación de ownership.

---

### 6️⃣ PERFORMANCE - ASSETS GRANDES

**Qué es:** Bundles sin compresión, sin cache headers

**Status:** Verificar

**Qué hacer:**

```bash
# 1. Ver tamaño actual
npm run build

# 2. Analizar bundle
npm run preview

# 3. Buscar archivos grandes
ls -lh dist/

# 4. Verificar que está minificado
# package.json ya tiene "type": "module"
# vite.config.ts ya tiene build: { minify: true }
```

**Si todo está bien:** Vercel automáticamente:
- ✅ Minifica
- ✅ Gzip/Brotli compresión
- ✅ CDN cache

**Si hay images grandes:**
```bash
# Ya hay script para optimizar
npm run build:images

# Verifica que todas las imágenes están en:
# public/images/classes/*/img/ (optimizadas)
# No en public/images/classes/*/raw/ (originales)
```

**Tiempo estimado:** 1-2 horas  
**Cuando hacer:** Próximo sprint

---

### 7️⃣ LOGGING Y MONITORIZACIÓN

**Qué es:** No hay envío de errores/alertas (Sentry)

**Status:** ⚠️ PARCIALMENTE IMPLEMENTADO

**Qué existe:** `utils/sentry.ts` (inicializado)  
**Qué falta:** Integración con ErrorBoundary

**Qué hacer:**

#### Paso 1: Crear `.env.local` (local)

```env
VITE_SENTRY_DSN=https://[tu-key]@sentry.io/[project-id]
```

#### Paso 2: Actualizar ErrorBoundary

```typescript
// components/ErrorBoundary.tsx
import { captureException } from '../utils/sentry';

componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  console.error('Error caught:', error, errorInfo);
  captureException(error, errorInfo);  // ← Agregar esto
}
```

#### Paso 3: Verificar funcionamiento

```bash
# En desarrollo
npm run dev

# Forzar un error en consola
throw new Error('Test error');

# Verificar en https://sentry.io dashboard
```

**Tiempo estimado:** 2-4 horas  
**Cuando hacer:** Próximo sprint  

---

## 🟢 BAJOS - MEJORAS RECOMENDADAS

### 8️⃣ ACCESIBILIDAD BÁSICA

**Qué falta:**
- Alt text en imágenes
- Labels en inputs (si hay)
- Contraste WCAG AA

**Qué hacer:**

```bash
# Auditar con axe-core
npm install --save-dev @axe-core/react axe-playwright

# En tests:
import { axe } from 'jest-axe';

it('should not have accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

**Tiempo estimado:** 2-6 horas  
**Cuando hacer:** Próximo sprint

---

### 9️⃣ README Y TESTS

**Qué existe:** README básico  
**Qué falta:** Instrucciones detalladas, tests de rutas

**Qué hacer:**

#### Actualizar README.md

```markdown
# FarRays Center - Dance School Website

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
\`\`\`bash
git clone [repo]
cd web
npm install
\`\`\`

### Development
\`\`\`bash
npm run dev
# Open http://localhost:5173
\`\`\`

### Testing
\`\`\`bash
npm run test:run       # Single run
npm run test:ui        # UI mode
npm run test:coverage  # Coverage report
\`\`\`

### Building
\`\`\`bash
npm run build          # Build + prerender
npm run preview        # Local preview
\`\`\`

### Deployment
\`\`\`bash
# Push to main → Vercel auto-deploys
git push origin main
\`\`\`

## Architecture
- React 19 + TypeScript
- Vite 6 build system
- Server-side prerendering
- i18n (4 languages)
- TailwindCSS styling

See \`.github/copilot-instructions.md\` for detailed architecture.

## Project Structure
\`\`\`
web/
├── components/      React components
├── hooks/          Custom hooks
├── i18n/           Translations
├── public/         Static assets
├── scripts/        Build scripts
└── test/           Test setup
\`\`\`
```

#### Agregar tests de rutas

```typescript
// components/__tests__/RoutesSmoke.test.tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';

describe('Route Smoke Tests', () => {
  it('should render home page', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('should handle 404 gracefully', () => {
    window.location.pathname = '/invalid-route';
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // Should not crash
  });
});
```

**Tiempo estimado:** 2-4 horas  
**Cuando hacer:** Próximo sprint

---

## ✅ PLAN ACCIÓN SEMANAL

### ESTA SEMANA (ALTOS - Prioritarios)

```
[ ] 1. npm audit - Identificar CVEs
[ ] 2. Actualizar dependencias críticas
[ ] 3. Ejecutar npm run test:run
[ ] 4. Revisar CORS en vercel.json
[ ] 5. Implementar Security Headers (CSP report-only)
[ ] 6. Hacer commit de cambios
```

**Tiempo total:** 4-8 horas

**Commit message:**
```
chore: update dependencies and security headers

- Ran npm audit and fixed CVEs
- Added security headers (CSP, X-Frame-Options, etc)
- Started with CSP in report-only mode
- Verified tests pass
```

### PRÓXIMO SPRINT (MEDIOS)

```
[ ] Sentry integration completa
[ ] Agregar tests de rutas
[ ] Mejorar README
[ ] Performance profiling
[ ] Accessibility audit
```

### CUANDO ESTÉ DEPLOYED

```
[ ] HSTS headers (después de HTTPS estable)
[ ] CORS configuración final
[ ] Monitorización en producción
```

---

## 🎯 CHECKLIST FINAL

### ANTES DE HACER COMMIT:

```
[ ] npm audit - ejecutado
[ ] npm run build - sin errores
[ ] npm run test:run - sin fallos
[ ] npm run lint - sin errores
[ ] npm run typecheck - sin errores
[ ] vercel.json - actualizado con headers
[ ] CORS - verificado y restrictivo
[ ] CSP - en report-only mode
```

### ANTES DE DEPLOY:

```
[ ] Revisión de código
[ ] PR reviews completadas
[ ] Merge a main
[ ] Vercel deploy automático
[ ] Verificar en https://www.farrayscenter.com
```

---

## 📞 PREGUNTAS FRECUENTES

**P: ¿Tengo que hacer TODO ahora?**  
R: No. ALTOS (1-4) esta semana. MEDIOS (5-7) próximo sprint. BAJOS (8-9) cuando pueda.

**P: ¿Cuánto tiempo en total?**  
R: ALTOS: 4-8 horas. MEDIOS: 6-12 horas. BAJOS: 4-10 horas.

**P: ¿El proyecto sigue funcionando durante esto?**  
R: Sí, todos los cambios son aditivos o de configuración. Sin cambios funcionales.

**P: ¿Necesito downtime?**  
R: No, Vercel maneja deploys sin downtime.

---

**Plan creado:** 2025-11-11  
**Válido para:** 1 mes  
**Status:** Listo para ejecutar
