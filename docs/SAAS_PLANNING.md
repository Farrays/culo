# BookingFlow SaaS - Planning Document

## Vision

Plataforma SaaS de reservas ultra-personalizable para escuelas de baile, con potencial de expansión a otros sectores (estética, fisioterapia, peluquería).

**Diferenciadores clave:**

- Alta conversión (UX optimizada con psicología de booking)
- Ultra-personalizable visualmente (videos, fotos, branding completo)
- Integraciones nativas con IA (MCP para Claude/ChatGPT/Alexa)
- Multi-idioma desde el día 1 (ES/CA/EN/FR)
- Progresión curricular para estudiantes (único en el mercado)
- Cuentas familiares (padres gestionando múltiples hijos)

---

## Análisis de Mercado (Investigación Enero 2025)

### Tamaño del Mercado

- **2024:** $546M valoración global
- **2032:** $1.5B proyectado (15.7% CAGR)
- Mercado en crecimiento acelerado por digitalización post-COVID

### Análisis Competitivo Detallado

| Competidor     | Precio      | Fortaleza                  | Debilidad Principal                            | Oportunidad          |
| -------------- | ----------- | -------------------------- | ---------------------------------------------- | -------------------- |
| **Calendly**   | $0-16/user  | UX simple, 20M+ usuarios   | Soporte lento (5+ días), no especializado      | Nicho vertical       |
| **Acuity**     | $16-49/mo   | Customización, HIPAA       | Crash al exportar datos, sin free tier         | Portabilidad datos   |
| **SimplyBook** | $0-50/mo    | 70+ features modulares     | UI poco intuitiva, bugs frecuentes             | Simplicidad          |
| **Setmore**    | $0-5/user   | Free tier generoso         | Double-booking glitches, sync issues           | Fiabilidad           |
| **Square**     | $0-69/loc   | POS integrado              | Sin clases grupales en plan base               | Dance-first          |
| **Fresha**     | "Free"      | SMS gratis, marketplace    | **20% comisión marketplace** (oculta)          | Pricing transparente |
| **Vagaro**     | $24-84/mo   | Feature-rich para wellness | Glitches en horas punta, perfiles obligatorios | Performance          |
| **Mindbody**   | $139-699/mo | Industry standard          | **Muy caro**, UI anticuada, contrato 1 año     | Precio accesible     |
| **Booksy**     | $30+/mo     | 38M usuarios marketplace   | Solo barberías/salones                         | Vertical danza       |

### Gaps Críticos que NADIE Resuelve Bien

| Gap                          | Impacto                                          | Nuestra Solución                      |
| ---------------------------- | ------------------------------------------------ | ------------------------------------- |
| **1. Progresión curricular** | Mindbody/Vagaro no trackean nivel del estudiante | Sistema de niveles con prerrequisitos |
| **2. Multi-idioma nativo**   | Todos son English-first                          | ES/CA/EN/FR desde día 1               |
| **3. Cuentas familiares**    | Padres con varios hijos = dolor                  | Dashboard familiar unificado          |
| **4. Make-up classes**       | Proceso manual en todos                          | Créditos automáticos + matching       |
| **5. Modelo semestral**      | Fitness = drop-in, danza = términos              | Períodos de inscripción               |
| **6. Recitales/eventos**     | Solo Jackrabbit ($75/mo)                         | Módulo de eventos integrado           |
| **7. Portabilidad datos**    | Acuity crashea, vendor lock-in                   | Export fácil, sin lock-in             |
| **8. Pricing transparente**  | Fresha 20%, fees ocultos                         | Precio claro, sin sorpresas           |
| **9. Soporte humano**        | Quejas universales                               | Soporte <24h respuesta                |

### Pain Points Universales de Usuarios

1. **Soporte lento** - Consistentemente mal valorado en todos
2. **Sync calendarios** - Problemas con Google/Outlook en todos
3. **Fees ocultos** - Marketplace, procesamiento, add-ons
4. **Mobile incompleto** - Apps siempre inferiores a desktop
5. **Complejidad** - Power features vs UX sufre
6. **Vendor lock-in** - Difícil exportar y migrar

---

## Arquitectura Técnica Propuesta

### Stack Principal

| Capa               | Tecnología                        | Justificación                     |
| ------------------ | --------------------------------- | --------------------------------- |
| Frontend Dashboard | Next.js 14 (App Router)           | SSR, RSC, excelente DX            |
| Widget Embebible   | React + Vite                      | Bundle ligero (<50KB)             |
| Backend API        | Next.js API Routes + tRPC         | Type-safety end-to-end            |
| Base de Datos      | Supabase (PostgreSQL)             | RLS, Realtime, Auth integrado     |
| Autenticación      | Clerk                             | Multi-tenant, SSO, MFA            |
| Pagos              | Stripe Connect + Adyen            | Marketplace, 250+ métodos pago    |
| Email              | Resend + React Email              | Templates bonitos, deliverability |
| WhatsApp           | Twilio / WhatsApp Business API    | Notificaciones, recordatorios     |
| Voice              | Alexa Skills Kit + Google Actions | Booking por voz                   |
| Storage            | Supabase Storage / Cloudflare R2  | Logos, videos, assets             |
| Video              | Mux / Cloudflare Stream           | VSL, previews, tours              |
| Analytics          | PostHog                           | Product analytics, feature flags  |
| AI/ML              | OpenAI + Anthropic MCP            | Predicciones, chatbot             |
| Hosting            | Vercel                            | Edge functions, preview deploys   |

### Multi-tenancy Schema

```sql
-- Core tenant structure
tenants
├── tenant_id (UUID)
├── slug (unique) → "farraysdance"
├── custom_domain → "reservas.farrays.com"
├── plan (free/starter/pro/enterprise)
├── branding (JSONB) → logos, colors, fonts
├── settings (JSONB) → timezone, locale, week_start
└── features (JSONB) → enabled feature flags

-- Calendar management
calendars
├── calendar_id
├── tenant_id (FK)
├── name, color, timezone
├── availability_rules (JSONB)
└── sync_settings (JSONB) → Google, Outlook, iCal

-- Class/Service types
appointment_types
├── type_id
├── tenant_id (FK)
├── calendar_id (FK)
├── name, duration, price
├── instructor_id (FK)
├── level (beginner/intermediate/advanced)
├── prerequisites (JSONB) → required levels
├── capacity_max, capacity_min
├── media (JSONB) → photos, videos, VSL
└── settings (JSONB)

-- Student progression (UNIQUE FEATURE)
student_progress
├── student_id (FK)
├── tenant_id (FK)
├── style (salsa/bachata/etc)
├── current_level
├── classes_completed
├── skills_acquired (JSONB)
├── promoted_at
└── instructor_notes

-- Family accounts (UNIQUE FEATURE)
families
├── family_id
├── tenant_id (FK)
├── primary_contact_id (FK → clients)
├── members (JSONB) → array of client_ids
└── billing_settings (JSONB)
```

---

## Funcionalidades por Fase

### FASE 1: MVP (8-10 semanas)

**Objetivo:** Producto funcional para 10 early adopters

#### 1.1 Dashboard Principal

- [ ] Vista de calendario (día/semana/mes)
- [ ] Indicadores visuales (bolitas con número de citas)
- [ ] Hover para ver resumen rápido
- [ ] Click para ver detalle: actividad + asistentes/plazas
- [ ] Navegación: hoy, anterior, siguiente
- [ ] Zoom in/out del calendario
- [ ] Filtros por instructor, estilo, nivel

#### 1.2 Gestión de Clases/Citas

- [ ] CRUD de tipos de cita (appointment types)
  - Nombre, duración, descripción
  - Asignación de instructor
  - Nivel (principiante/intermedio/avanzado)
  - Precio (opcional)
  - **Capacidad máxima y mínima**
- [ ] Configuración de horarios recurrentes
- [ ] Generación automática de enlaces:
  - `/book` → página general
  - `/book/salsa` → categoría
  - `/book/salsa/monday-19h` → clase específica

#### 1.3 Widget de Reservas (Embebible) - HIGH CONVERSION

- [ ] Selector de clase/fecha/hora
- [ ] Formulario optimizado (3-4 campos máximo)
- [ ] **Indicadores de escasez:** "Solo quedan X plazas"
- [ ] **Social proof:** "María acaba de reservar hace 2 min"
- [ ] **Progress bar** empezando en 20% (endowed progress)
- [ ] **Trust badges:** logos de pago, garantía
- [ ] Confirmación de reserva animada
- [ ] Responsive (mobile-first, thumb-zone CTAs)
- [ ] Código embed: `<script src="..."></script>`
- [ ] Guest checkout (sin forzar registro)

#### 1.4 Personalización Visual

- [ ] Logo upload
- [ ] Colores primarios (brand color)
- [ ] **Video hero/VSL** en página de booking
- [ ] **Fotos de clases** en cards
- [ ] **Video intro instructor** en perfiles
- [ ] Textos personalizables:
  - Título principal ("Reserva tu clase")
  - Subtítulo/descripción
  - CTA del botón
- [ ] Vista previa en tiempo real
- [ ] **Temas prediseñados** (dark, light, custom)

#### 1.5 Configuración Regional

- [ ] Semana empieza: Lunes/Domingo
- [ ] Formato hora: 24h / AM-PM
- [ ] Idioma del widget (es/en/ca/fr)
- [ ] Timezone con autodetección
- [ ] Formatos de fecha localizados

#### 1.6 Notificaciones Básicas

- [ ] Email de confirmación al cliente
- [ ] Email de notificación al admin
- [ ] Templates personalizables con editor visual
- [ ] **Smart timing** basado en comportamiento

#### 1.7 Lista de Clientes

- [ ] Vista de tabla con búsqueda y filtros
- [ ] Datos: nombre, email, teléfono, reservas, nivel
- [ ] Export CSV
- [ ] **Historial de asistencia** por cliente

---

### FASE 2: Growth (6-8 semanas)

**Objetivo:** Features que generan retención y upgrades

#### 2.1 Múltiples Calendarios

- [ ] Crear varios calendarios por tenant
- [ ] Asignar colores distintos
- [ ] Vista combinada o individual
- [ ] Filtrar por calendario/instructor

#### 2.2 Reglas de Reserva Avanzadas

- [ ] **Bloqueo configurable:** no reservar menos de X horas antes
- [ ] Límite de reservas por cliente/día
- [ ] **Lista de espera** con auto-notificación cuando hay plaza
- [ ] **One-click booking** desde waitlist
- [ ] Cancelación automática si no confirma
- [ ] **Depósito/prepago** para reducir no-shows

#### 2.3 Pagos con Stripe Connect

- [ ] Stripe Connect (onboarding del tenant)
- [ ] Cobro al reservar
- [ ] **Bonos/packs de clases** (10 clases por precio de 8)
- [ ] Gestión de reembolsos
- [ ] **Descuentos automáticos** (early bird, familia)
- [ ] Split payments para instructores freelance

#### 2.4 Panel de Ingresos

- [ ] Dashboard financiero visual
- [ ] Vista: día/semana/mes/año
- [ ] Gráficos de evolución interactivos
- [ ] Métricas: ingresos, reservas, nuevos clientes, no-shows
- [ ] **Comparativa período vs período**

#### 2.5 WhatsApp Notifications

- [ ] Integración WhatsApp Business API
- [ ] Recordatorio 24h/2h antes (configurable)
- [ ] Confirmación de reserva instantánea
- [ ] **Two-way:** cliente puede responder
- [ ] Templates pre-aprobados por Meta

#### 2.6 Import/Export Clientes

- [ ] Import desde CSV/Excel
- [ ] Mapeo de columnas inteligente
- [ ] Detección de duplicados
- [ ] Export con filtros
- [ ] **Data portability garantizada** (diferenciador)

#### 2.7 Cuentas Familiares (UNIQUE)

- [ ] Dashboard para padres con múltiples hijos
- [ ] Reserva coordinada (misma clase para hermanos)
- [ ] **Factura familiar unificada**
- [ ] Descuentos por hermano automáticos
- [ ] Notificaciones consolidadas

#### 2.8 Sistema de Scarcity & Social Proof

- [ ] **"Solo quedan X plazas"** dinámico real
- [ ] **"X personas viendo esta clase"** en tiempo real
- [ ] Badge **"Popular"** si >70% ocupación
- [ ] **"Última plaza"** destacado
- [ ] **"María acaba de reservar"** ticker

---

### FASE 3: Pro Features (6-8 semanas)

**Objetivo:** Features enterprise que justifican precio premium

#### 3.1 Multimedia Avanzado

- [ ] **VSL (Video Sales Letter)** en páginas de booking
- [ ] **Videos intro** por instructor (30-60s)
- [ ] **Galería de fotos** por clase
- [ ] **Tour virtual 360°** del estudio
- [ ] **Preview de clase** (15s clips)
- [ ] **Integración Instagram/TikTok** feed
- [ ] **Before/after** de estudiantes

#### 3.2 Facturación

- [ ] Generación de facturas PDF profesionales
- [ ] Numeración automática secuencial
- [ ] Datos fiscales del tenant
- [ ] Envío automático por email
- [ ] Historial de facturas por cliente
- [ ] **Facturación recurrente** para membresías

#### 3.3 Integraciones CRM/Email Marketing

- [ ] Webhooks personalizables
- [ ] Eventos disponibles:
  - `booking.created`
  - `booking.cancelled`
  - `booking.completed`
  - `booking.no_show`
  - `client.created`
  - `client.level_up`
  - `payment.received`
  - `waitlist.joined`
  - `waitlist.converted`
- [ ] Integración nativa:
  - ActiveCampaign
  - Mailchimp
  - HubSpot
  - **Salesforce** (enterprise)

#### 3.4 Tracking & Analytics

- [ ] Google Analytics 4 (gtag)
- [ ] Facebook Pixel / Conversions API
- [ ] Google Tag Manager container
- [ ] **TikTok Pixel**
- [ ] Conversiones personalizadas
- [ ] UTM tracking automático
- [ ] **Funnel analytics** integrado

#### 3.5 Sincronización de Calendarios

- [ ] Google Calendar (2-way sync)
- [ ] Apple Calendar (iCal feed)
- [ ] Outlook/Office 365
- [ ] **Evitar double-booking** cross-platform
- [ ] Sync en tiempo real

#### 3.6 Multi-usuario con RBAC

- [ ] Roles: Owner, Admin, Instructor, Receptionist
- [ ] **Permisos granulares** por feature
- [ ] Invitaciones por email
- [ ] **Activity log** completo
- [ ] **Session management**

#### 3.7 Dominio Personalizado

- [ ] `reservas.tuescuela.com`
- [ ] SSL automático (Let's Encrypt)
- [ ] Verificación DNS guiada paso a paso
- [ ] **Emails desde dominio cliente**

#### 3.8 Gamificación & Engagement

- [ ] **Streak tracking** (clases consecutivas) 🔥
- [ ] **Badges de logros** (10 clases, todos los estilos, etc.)
- [ ] **Leaderboards** mensuales (opcional)
- [ ] **Sistema de puntos** canjeables
- [ ] **Progresión visual** (radar de habilidades)
- [ ] **Compartir logros** en redes sociales

#### 3.9 Progresión Curricular (UNIQUE)

- [ ] **Tracking de nivel** por estilo de baile
- [ ] **Prerrequisitos** para clases avanzadas
- [ ] **Sugerencias automáticas** de siguiente nivel
- [ ] **Certificados digitales** al completar niveles
- [ ] Notas de instructor por estudiante

---

### FASE 4: Enterprise & AI (8+ semanas)

**Objetivo:** Escala, IA y diferenciación radical

#### 4.1 API Pública

- [ ] REST API documentada con OpenAPI 3.0
- [ ] **GraphQL** opcional para queries complejas
- [ ] API Keys por tenant con scopes
- [ ] Rate limiting configurable
- [ ] Swagger UI interactivo
- [ ] SDKs: JavaScript, Python, PHP

#### 4.2 MCP Server (AI Integration) - GAME CHANGER

- [ ] **Servidor MCP** para Claude/ChatGPT
- [ ] Acciones disponibles vía IA:
  - Consultar disponibilidad natural language
  - Crear reserva conversacional
  - Ver clientes y historial
  - Gestionar calendario
  - Responder FAQs automáticamente
- [ ] **Configuración autónoma** vía conversación
- [ ] **Booking por voz** (Alexa, Google Assistant)

#### 4.3 AI Features

- [ ] **Predicción de no-shows** (85% accuracy)
  - Intervenciones automáticas para alto riesgo
  - Overbooking inteligente basado en predicción
- [ ] **Chatbot NLP** para booking en web
- [ ] **Smart reminders** timing optimizado por ML
- [ ] **Churn prediction** con workflows automáticos
- [ ] **Recomendaciones personalizadas** de clases
- [ ] **Dynamic pricing** basado en demanda (opcional)

#### 4.4 White Label Completo

- [ ] Eliminar todo branding BookingFlow
- [ ] **Emails desde dominio del cliente**
- [ ] **App móvil PWA** con branding completo
- [ ] Documentación con branding cliente
- [ ] Portal de cliente personalizado

#### 4.5 Reportes Avanzados

- [ ] **Drag-and-drop report builder**
- [ ] Reportes programados (email semanal)
- [ ] Comparativas período vs período
- [ ] **Predicciones** con ML
- [ ] Export PDF/Excel/CSV
- [ ] **Dashboard customizable** por rol

#### 4.6 Marketplace de Integraciones

- [ ] **Zapier** native app
- [ ] **Make** (Integromat)
- [ ] **n8n** templates
- [ ] **Slack** notificaciones
- [ ] **Microsoft Teams**

#### 4.7 Multi-location

- [ ] Gestionar varias sedes desde dashboard único
- [ ] Calendarios por sede
- [ ] **Staff compartido** entre sedes
- [ ] Reportes consolidados y por sede
- [ ] **Cross-location booking**

#### 4.8 Social Features

- [ ] **"Bring a friend"** con referral incentives
- [ ] **Reviews y ratings** por clase/instructor
- [ ] **Testimonios en video** integrables
- [ ] **Comunidad** por estilo de baile
- [ ] **User-generated content** gallery
- [ ] **Carpooling** coordination

#### 4.9 Compliance Enterprise

- [ ] **SOC 2 Type II** certification
- [ ] **GDPR compliance** completo
- [ ] **Audit logs** immutables (7 años)
- [ ] **Data residency** por región (EU/US)
- [ ] **SSO/SAML** para corporativos
- [ ] **SLA** con créditos garantizados

---

## Features de Alta Conversión (Research-Backed)

### Estadísticas Clave

| Técnica                     | Impacto en Conversión  |
| --------------------------- | ---------------------- |
| Indicadores de escasez      | **+332%** conversión   |
| Social proof (5+ reviews)   | **+270%** conversión   |
| Video testimonials vs texto | **+80%** conversión    |
| Multi-step forms            | **+300%** conversión   |
| Progress bar desde 20%      | **+20-30%** completion |
| Trust badges junto a pago   | **+42%** conversión    |
| Reducir de 11 a 4 campos    | **+120%** conversión   |
| One-click returning users   | **6.8s** purchase time |

### Implementación Prioritaria

1. **Scarcity real-time:** "Solo quedan 3 plazas" (WebSocket)
2. **Social proof ticker:** "María reservó hace 2 min"
3. **Progress bar:** Multi-step con inicio en 20%
4. **Trust badges:** Logos pago + garantía + reviews
5. **Video testimonials:** En página de booking
6. **Form optimization:** Máximo 4 campos, guest checkout
7. **Mobile-first:** CTAs en thumb-zone, <3s load

---

## Pricing Tiers Propuesto (Research-Based)

| Plan           | Precio/mes | Límites                     | Features Clave                                          |
| -------------- | ---------- | --------------------------- | ------------------------------------------------------- |
| **Free**       | €0         | 1 calendario, 50 reservas   | Widget básico, 1 usuario, email confirmación            |
| **Starter**    | €25        | 2 calendarios, 300 reservas | + Personalización, + WhatsApp, + Scarcity badges        |
| **Pro**        | €59        | 5 calendarios, ilimitadas   | + Stripe, + Integraciones, + 5 usuarios, + Videos       |
| **Business**   | €119       | 15 calendarios, ilimitadas  | + Facturación, + API, + 15 usuarios, + Gamificación     |
| **Enterprise** | Custom     | Ilimitado                   | + White label, + MCP/AI, + SSO, + SLA, + Multi-location |

### Principios de Pricing (vs Competencia)

- ✅ **Sin fees por reserva** (vs Fresha 20%)
- ✅ **Sin comisiones marketplace** (vs Mindbody)
- ✅ **Todos los idiomas incluidos** (vs competencia)
- ✅ **Sin contratos anuales obligatorios** (vs Mindbody)
- ✅ **Upgrade/downgrade instantáneo**
- ✅ **30 días trial en todos los planes**

---

## Roadmap Visual

```
2025
├── Q1 (Ene-Mar): FASE 1 - MVP
│   ├── Semana 1-2: Setup monorepo, auth, DB schema
│   ├── Semana 3-4: Dashboard calendario + CRUD clases
│   ├── Semana 5-6: Widget v1 con scarcity/social proof
│   ├── Semana 7-8: Personalización visual + media upload
│   └── Semana 9-10: Notificaciones email + beta testers
│
├── Q2 (Abr-Jun): FASE 2 - Growth
│   ├── Multi-calendarios + reglas avanzadas
│   ├── Stripe Connect + bonos/packs
│   ├── WhatsApp integration
│   ├── Panel de ingresos
│   └── Cuentas familiares
│
├── Q3 (Jul-Sep): FASE 3 - Pro
│   ├── Multimedia (VSL, videos, tour virtual)
│   ├── Facturación + integraciones CRM
│   ├── Tracking pixels + analytics
│   ├── Calendar sync + RBAC
│   └── Gamificación + progresión curricular
│
└── Q4 (Oct-Dic): FASE 4 - Enterprise
    ├── API pública + MCP Server
    ├── AI features (no-show prediction, chatbot)
    ├── White label completo
    ├── Multi-location
    └── SOC 2 certification inicio
```

---

## Métricas de Éxito (KPIs)

### MVP Launch (Q1)

- [ ] 10 beta testers activos (escuelas de baile Barcelona)
- [ ] <3s tiempo de carga widget
- [ ] > 99% uptime
- [ ] NPS > 50
- [ ] **Conversion rate widget > 15%**

### 6 Meses (Q2)

- [ ] 100 tenants registrados
- [ ] 25 tenants de pago
- [ ] MRR €1,500
- [ ] Churn < 5%
- [ ] **Support response <4h**

### 12 Meses (Q4)

- [ ] 500 tenants
- [ ] 125 de pago (25% conversion)
- [ ] MRR €7,500
- [ ] ARR €90,000
- [ ] Expansión a 2º vertical (estética)
- [ ] **1 cliente Enterprise**

### 18 Meses (2026 Q2)

- [ ] 2,000 tenants
- [ ] 400 de pago
- [ ] MRR €25,000
- [ ] ARR €300,000
- [ ] 3 verticales activos
- [ ] **Serie Seed raised**

---

## Diferenciadores Únicos (Competitive Moat)

### 1. Multi-idioma Nativo (ES/CA/EN/FR)

- Ningún competidor hace bien catalán
- Enorme ventaja en mercado Barcelona/Valencia/Baleares
- Expandible a mercados LatAm y Francia

### 2. Progresión Curricular

- **NADIE** trackea niveles de estudiantes
- Prerrequisitos para clases avanzadas
- Certificaciones digitales
- Diferenciador único para escuelas de baile serias

### 3. Cuentas Familiares

- Padres con múltiples hijos = caso de uso no resuelto
- Facturación consolidada
- Descuentos automáticos por hermano

### 4. Make-up Classes Automáticas

- Créditos automáticos por cancelación
- Matching inteligente con clases disponibles
- Zero manual work para el admin

### 5. MCP + AI First

- Booking conversacional con Claude/ChatGPT
- Voice booking con Alexa/Google
- No-show prediction proactivo
- Primer SaaS de booking con MCP nativo

### 6. Transparencia Radical

- Sin fees ocultos
- Data portability garantizada
- Sin lock-in (export fácil)
- Pricing claro y predecible

---

## Stack de Desarrollo

### Monorepo Structure (Turborepo)

```
bookingflow/
├── apps/
│   ├── dashboard/          # Next.js 14 admin panel
│   ├── widget/             # React + Vite embeddable (<50KB)
│   ├── landing/            # Next.js marketing site
│   ├── docs/               # Mintlify documentation
│   └── mcp-server/         # MCP server for AI integration
├── packages/
│   ├── ui/                 # Shared UI (shadcn/ui based)
│   ├── db/                 # Drizzle ORM + schema
│   ├── api/                # tRPC routers
│   ├── emails/             # React Email templates
│   ├── analytics/          # PostHog + custom events
│   ├── i18n/               # Translations (es/en/ca/fr)
│   └── config/             # Shared configs
└── infrastructure/
    ├── supabase/           # Migrations, seeds, RLS policies
    └── vercel/             # Deployment configs
```

### CI/CD Pipeline

1. PR → Preview deploy (Vercel)
2. Tests (Vitest + Playwright E2E)
3. Type check + Lint + Format
4. Security audit (npm audit, Snyk)
5. Bundle size check
6. Merge → Staging auto-deploy
7. Manual promote → Production
8. Rollback automático si error rate > 1%

---

## Próximos Pasos Inmediatos

### Esta Semana

1. [ ] Crear repositorio GitHub (monorepo Turborepo)
2. [ ] Setup inicial: Next.js + Supabase + Clerk
3. [ ] Definir schema DB detallado (Drizzle)
4. [ ] Configurar i18n (es/en/ca/fr)

### Próxima Semana

1. [ ] Diseño UI/UX del dashboard (Figma)
2. [ ] Implementar auth flow con Clerk
3. [ ] CRUD básico de tenants
4. [ ] Primera versión del calendario

### Semana 3-4

1. [ ] Widget embebible v0.1
2. [ ] Scarcity indicators real-time
3. [ ] Social proof ticker
4. [ ] Mobile responsiveness

---

## Notas de Investigación

### Fuentes Consultadas

- G2, Capterra, Trustpilot reviews de competidores
- Fortune Business Insights (market sizing)
- Booking.com conversion case studies
- Anthropic MCP documentation
- Industry benchmarks 2024-2025

### Insights Clave

- **Soporte es diferenciador** - Todos los competidores fallan aquí
- **Pricing transparente** genera trust - Fresha perdió clientes por fees ocultas
- **Mobile-first obligatorio** - 65%+ bookings son mobile
- **AI es el futuro** - MCP adoption creciendo exponencialmente
- **Vertical focus** wins - Calendly general vs Mindbody fitness

---

_Documento creado: Enero 2025_
_Última actualización: 19 Enero 2025_
_Versión: 2.0 (Post-Market Research)_
