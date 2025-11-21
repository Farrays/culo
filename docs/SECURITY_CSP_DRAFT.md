## Borrador de Content-Security-Policy (CSP) — modo report-only

Este archivo contiene una política inicial en modo *report-only* y una checklist para aplicarla antes del despliegue final.

Objetivo:
- Tener una política CSP documentada y lista para añadir a `vercel.json` cuando estemos listos para el despliegue final.
- Empezar en `report-only` para recopilar violaciones y ajustar sin romper la web.

Ejemplo de política inicial (report-only)

```
Content-Security-Policy-Report-Only: default-src 'self';
  base-uri 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com;
  connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://api.openai.com https://*.vercel.app;
  img-src 'self' data: https:;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  frame-src https://www.youtube.com https://player.vimeo.com https://www.instagram.com;
  object-src 'none';
  frame-ancestors 'self';
  upgrade-insecure-requests;
  report-uri https://your-report-collector.example.com/csp-report
```

Notas importantes:
- `'unsafe-inline'` está incluido temporalmente para evitar romper scripts inyectados por `prerender.mjs` y estilos inline; la meta es eliminarlo antes de pasar a enforced usando hashes o nonces.
- Sustituye `https://your-report-collector.example.com/csp-report` por tu collecter (ReportURI, Sentry, endpoint propio). Alternativamente, usa `report-to` si configuras un grupo Report-To.
- Añade dominios concretos para analytics, embeds, CDN y APIs que el sitio use (ej. Google Analytics, GTM, Instagram, OpenAI, CDN de imágenes).

Checklist para aplicar CSP en producción
1. Añadir esta política como `Content-Security-Policy-Report-Only` en `vercel.json`.
2. Desplegar a Preview y recopilar reportes durante 24–72 horas.
3. Corregir fuentes/servicios faltantes: añadir orígenes o cambiar recursos para servir desde `self`.
4. Eliminar `unsafe-inline` reemplazando scripts inline por archivos externos con nonce o bien añadir hashes SHA256 de los scripts inyectados.
5. Verificar que `prerender.mjs` no inyecta contenido dinámico con cambios frecuentes; si lo hace, preferir nonces o externalizar el script.
6. Cuando los reportes estén limpios, cambiar `Content-Security-Policy-Report-Only` por `Content-Security-Policy` (enforced).

Cómo comprobar headers (tras desplegar Preview)

PowerShell:

```
(Invoke-WebRequest -Uri "https://<tu-preview-url>" -Method Head).Headers
```

curl (Windows/macOS/Linux):

```
curl -I -L "https://<tu-preview-url>"
```

Siguientes pasos sugeridos por ahora
- Mantener `vercel.json` sin cambios (como acordado). El borrador queda en este repo para usar en el PR final.
- Cuando quieras, hago el PR que añade la política en `vercel.json` en modo report-only para que lo despleguéis a Preview y recopilemos datos.

Fecha de creación: 2025-11-11
