# 🔒 SEGURIDAD - HEADERS MEJORADOS

**Proyecto:** FarRays Center  
**Status:** Plan de implementación de Security Headers  

---

## ✅ QUÉ HACER CON vercel.json

El archivo `vercel.json` ya tiene buenos headers. Necesita agregar **CSP en report-only mode**.

### Cambio a realizar:

**Ubicación:** En el array `headers` del primer objeto `source: "/(.*)"`, después del último header (Permissions-Policy), agregar:

```json
{
  "key": "Content-Security-Policy-Report-Only",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://sentry.io; frame-ancestors 'none'"
}
```

### Estructura completa (vercel.json - headers section):

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "redirects": [...],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        },
        {
          "key": "Content-Security-Policy-Report-Only",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://sentry.io; frame-ancestors 'none'"
        }
      ]
    },
    {
      "source": "/(.*)\\.(js|css|woff|woff2|ttf|otf|eot)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 📝 PASOS PARA IMPLEMENTAR MANUALMENTE

1. **Abra** `vercel.json` en VS Code
2. **Busque** el bloque:
   ```json
   "key": "Permissions-Policy",
   "value": "camera=(), microphone=(), geolocation=()"
   ```
3. **Después de este bloque**, agregue una coma y luego:
   ```json
   {
     "key": "Content-Security-Policy-Report-Only",
     "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://sentry.io; frame-ancestors 'none'"
   }
   ```
4. **Guarde** (Ctrl+S)
5. **Valide** JSON: VS Code debe indicar si hay errores
6. **Commit**:
   ```bash
   git add vercel.json
   git commit -m "security: add CSP header in report-only mode"
   git push origin feature/dancehall-v2-hybrid
   ```

---

## ⚡ QUÉ ES CSP EN REPORT-ONLY MODE?

**Content-Security-Policy-Report-Only:**
- No bloquea nada (modo "observación")
- Solo envía reports de violaciones
- Perfecto para testing sin romper la app
- Después de verificar que funciona, cambiar a `Content-Security-Policy` (sin -Report-Only)

**Beneficio:**
- Detecta inyecciones de HTML/JS
- Protege contra XSS
- Sin impacto visual en usuario

---

## ✅ VERIFICACIÓN DESPUÉS DE AGREGAR

Después de hacer commit/push:

```bash
# Deploy en Vercel
# Ir a: https://www.farrayscenter.com

# Abrir DevTools (F12)
# En Network > Response Headers, buscar:
# Content-Security-Policy-Report-Only: (debe estar)

# Si hay violaciones, aparecerán en Console
# Pero la página seguirá funcionando (por ser Report-Only)
```

---

## 📋 CHECKLIST FINAL SEGURIDAD

Cuando termine de agregar CSP:

```
[ ] npm audit → 0 vulnerabilities
[ ] vercel.json → CSP agregado
[ ] Build succeeds: npm run build
[ ] Tests pass: npm run test:run
[ ] Commit hecho
[ ] Push completado
[ ] Vercel deployment exitoso
[ ] CSP headers verificados en navegador
```

---

**Estado:** Listo para implementar manualmente  
**Tiempo:** 10 minutos  
**Riesgo:** BAJO (report-only mode)
