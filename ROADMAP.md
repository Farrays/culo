# ROADMAP - Farray's International Dance Center

## Estado actual: 76% completado

---

## FASE 1: PRE-LANZAMIENTO (Obligatorio)

### Legal / GDPR (Bloquea lanzamiento)

- [ ] Crear página `/politica-privacidad` en todos los idiomas
- [ ] Crear página `/aviso-legal` en todos los idiomas
- [ ] Crear página `/politica-cookies` en todos los idiomas
- [ ] Implementar cookie banner (consentimiento GDPR)
- [ ] Documentar qué datos se recopilan (GA, Sentry, formularios)

### Traducciones (1,662 keys faltantes)

- [ ] Completar traducciones Catalán (671 keys) - ver `missing_ca.json`
- [ ] Completar traducciones Inglés (253 keys) - ver `missing_en.json`
- [ ] Completar traducciones Francés (738 keys) - ver `missing_fr.json`
- [ ] Ejecutar `npm run scripts/add-safe-translations.mjs` para auto-completar

### Variables de entorno

- [ ] Configurar `VITE_GA_MEASUREMENT_ID` en Vercel
- [ ] Configurar `VITE_SENTRY_DSN` en Vercel (opcional)
- [ ] Verificar que CI/CD inyecta variables correctamente

### Accesibilidad crítica

- [ ] Añadir alt text a todas las imágenes (20+ faltantes)
- [ ] Añadir `title` a iframes de Google Maps
- [ ] Verificar contraste de colores WCAG AA

### SEO básico

- [ ] Actualizar sitemap.xml con las 53+ páginas prerendeadas
- [ ] Verificar hreflang en `<head>` de cada página
- [ ] Unificar direcciones inconsistentes en Schema (Pallars vs Entença)

---

## FASE 2: LANZAMIENTO (Semana 1-2)

### Indexación y visibilidad

- [ ] Registrar en Google Search Console
- [ ] Crear/optimizar Google Business Profile (Maps)
- [ ] Registrar en Bing Webmaster Tools
- [ ] Registrar en Apple Maps Connect
- [ ] Verificar sitemap enviado a buscadores

### Analytics y tracking

- [ ] Crear cuenta Google Tag Manager (GTM)
- [ ] Configurar GA4 dentro de GTM
- [ ] Instalar script GTM en `index.html`
- [ ] Configurar eventos básicos (page_view, scroll, outbound_clicks)

### Conversión inmediata

- [ ] Añadir WhatsApp widget flotante
- [ ] Verificar todos los formularios de contacto funcionan
- [ ] Añadir CTA claros en cada página de clase

### Favicon y PWA básico

- [ ] Generar favicon.ico (16x16, 32x32)
- [ ] Generar apple-touch-icon.png (180x180)
- [ ] Crear manifest.json básico

---

## FASE 3: OPTIMIZACIÓN (Mes 1)

### Analytics avanzado

- [ ] Instalar Hotjar o Microsoft Clarity (gratis) - heatmaps
- [ ] Configurar funnels en GA4:
  - [ ] Funnel 1: Conversión a clase (visita → horarios → contacto → reserva)
  - [ ] Funnel 2: Interés por estilo (home → categoría → clase → engagement)
  - [ ] Funnel 3: Regalo/Bonos (página → selección → checkout → compra)
- [ ] Configurar eventos personalizados en GTM:
  - [ ] `view_schedule` - click en horarios
  - [ ] `view_pricing` - click en precios
  - [ ] `contact_whatsapp` - click en WhatsApp
  - [ ] `contact_form` - envío de formulario
  - [ ] `book_trial_class` - reserva clase prueba

### Pixels de remarketing

- [ ] Configurar Facebook Pixel (vía GTM)
- [ ] Configurar TikTok Pixel (vía GTM) - si usas TikTok Ads
- [ ] Crear audiencias de remarketing

### Schema Markup mejoras

- [ ] Añadir Person Schema para cada instructor/profesor
- [ ] Añadir EducationEvent Schema para horarios de clases
- [ ] Añadir Offer Schema para precios y paquetes
- [ ] Añadir WebSite Schema con SearchAction

### SEO técnico

- [ ] Crear og:image específicas para páginas principales
- [ ] Optimizar imágenes raw (`npm run build:images`)
- [ ] Verificar Core Web Vitals en producción
- [ ] Registrar en Yandex Webmaster (opcional)

---

## FASE 4: CRECIMIENTO (Mes 2-3)

### Contenido y SEO

- [ ] Crear blog con 10 artículos SEO:
  - [ ] "Beneficios del Dancehall para la salud"
  - [ ] "Diferencias entre Salsa Cubana y Salsa LA"
  - [ ] "Qué ropa llevar a una clase de Twerk"
  - [ ] "Historia del Afrobeat y sus orígenes"
  - [ ] "Cómo elegir tu primer estilo de baile"
  - [ ] "Los mejores estilos de baile para principiantes"
  - [ ] "Dancehall en Barcelona: guía completa"
  - [ ] "Beneficios del ballet para adultos"
  - [ ] "Qué esperar en tu primera clase de baile"
  - [ ] "Estilos de baile urbano: guía definitiva"
- [ ] Optimizar cada artículo para featured snippets
- [ ] Crear schema Article/BlogPosting

### Sistema de reservas online

- [ ] Investigar opciones: Calendly, Acuity, custom
- [ ] Integrar sistema de reservas en la web
- [ ] Automatizar confirmaciones por email/WhatsApp
- [ ] Sincronizar con Google Calendar

### Engagement y conversión

- [ ] Crear quiz interactivo "¿Qué estilo de baile va contigo?"
- [ ] Añadir videos de muestra en cada página de clase
- [ ] Recopilar y añadir testimonios en video
- [ ] Embeber reseñas de Google en la web
- [ ] Implementar pop-up de salida con descuento

### Testing

- [ ] Configurar Playwright/Cypress para E2E tests
- [ ] Crear tests para flujos críticos (home, contacto, reserva)
- [ ] Expandir pa11y-ci a todas las páginas
- [ ] Aumentar cobertura de tests a 80%+

---

## FASE 5: ESCALA (Mes 4+)

### Automatización

- [ ] Implementar chatbot IA (Tidio, Crisp, o custom)
- [ ] Configurar email marketing automation (Mailchimp, Brevo)
- [ ] Crear secuencia de emails para leads
- [ ] Implementar notificaciones push (opcional)

### PWA completo

- [ ] Crear service worker
- [ ] Configurar offline mode
- [ ] Habilitar instalación como app

### Experimentación

- [ ] Configurar A/B testing (Google Optimize o Posthog)
- [ ] Testear diferentes CTAs
- [ ] Testear diferentes landing pages por estilo

### Social proof avanzado

- [ ] Mostrar "María se inscribió hace 5 min" (social proof real-time)
- [ ] Mostrar plazas disponibles en tiempo real
- [ ] Integrar contador de alumnos/clases

### Programa de referidos

- [ ] Diseñar sistema de referidos (descuento por traer amigo)
- [ ] Implementar tracking de referidos
- [ ] Crear landing page de referidos

### AEO (Answer Engine Optimization)

- [ ] Optimizar contenido para respuestas de IA (ChatGPT, Perplexity)
- [ ] Añadir Speakable Schema para búsqueda por voz
- [ ] Crear contenido FAQ extenso para cada tema

---

## EXTRAS OPCIONALES

### Integraciones

- [ ] Integrar con CRM (HubSpot, Pipedrive)
- [ ] Integrar con sistema de pagos online (Stripe)
- [ ] Integrar con plataforma de clases online (Zoom, Meet)

### Redes sociales

- [ ] Crear Instagram Business Profile
- [ ] Crear TikTok Business Account
- [ ] Crear YouTube Channel optimizado
- [ ] Automatizar publicaciones con Buffer/Hootsuite

### Directorios locales

- [ ] Registrar en Yelp España
- [ ] Registrar en Foursquare
- [ ] Registrar en Páginas Amarillas
- [ ] Registrar en Cylex España

---

## MÉTRICAS A MONITOREAR

### Core Web Vitals (objetivo)

| Métrica | Target  | Actual |
| ------- | ------- | ------ |
| LCP     | < 2.5s  | TBD    |
| FID/INP | < 100ms | TBD    |
| CLS     | < 0.1   | TBD    |

### Lighthouse (objetivo)

| Categoría      | Target | Actual |
| -------------- | ------ | ------ |
| Performance    | > 90   | TBD    |
| Accessibility  | > 95   | TBD    |
| Best Practices | > 95   | TBD    |
| SEO            | > 95   | TBD    |

### Conversión (objetivo)

| Métrica           | Target  |
| ----------------- | ------- |
| Tasa de rebote    | < 50%   |
| Tiempo en página  | > 2 min |
| Contactos/mes     | > 50    |
| Clases prueba/mes | > 20    |

---

## CHECKLIST RÁPIDO PRE-LANZAMIENTO

```
[ ] Legal: Privacy, Terms, Cookies pages
[ ] Legal: Cookie banner implementado
[ ] i18n: Traducciones CA, EN, FR completas
[ ] SEO: Sitemap.xml actualizado
[ ] SEO: Google Search Console registrado
[ ] SEO: Google Business Profile creado
[ ] A11y: Alt text en todas las imágenes
[ ] Analytics: GTM + GA4 configurado
[ ] Conversión: WhatsApp widget activo
[ ] Deploy: Variables de entorno en Vercel
```

---

## RECURSOS ÚTILES

### Herramientas gratuitas

- [Google Search Console](https://search.google.com/search-console)
- [Google Business Profile](https://business.google.com)
- [Google Tag Manager](https://tagmanager.google.com)
- [Google Analytics 4](https://analytics.google.com)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Microsoft Clarity](https://clarity.microsoft.com) - Heatmaps gratis
- [PageSpeed Insights](https://pagespeed.web.dev)
- [Schema Validator](https://validator.schema.org)

### Documentación del proyecto

- `missing_ca.json` - Traducciones faltantes Catalán
- `missing_en.json` - Traducciones faltantes Inglés
- `missing_fr.json` - Traducciones faltantes Francés
- `scripts/add-safe-translations.mjs` - Auto-completar traducciones
- `.env.example` - Variables de entorno necesarias

---

_Última actualización: Diciembre 2024_
