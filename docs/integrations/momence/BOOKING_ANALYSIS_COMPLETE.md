# Análisis Enterprise: Sistema de Reservas

> **Objetivo:** Verificar que el sistema es enterprise-level y no falta nada
> **Fecha:** Enero 2026
> **Estado:** ANÁLISIS EN CURSO

---

## 1. Estado Actual del Backend ✅

| Componente          | Estado           | Notas                                            |
| ------------------- | ---------------- | ------------------------------------------------ |
| `/api/clases`       | ✅ Completado    | Búsqueda binaria, caché Redis, filtro por estilo |
| `/api/reservar`     | ✅ Completado    | Momence + CAPI + Customer Leads                  |
| Validación teléfono | ✅ Internacional | ES, FR, USA y más                                |
| Deduplicación       | ✅ Redis 90 días | Evita leads duplicados                           |
| Rate limiting       | ✅ 3 req/min     | Protección anti-spam                             |
| Meta CAPI           | ✅ €90/lead      | Tracking server-side                             |

---

## 2. Lo Que FALTA (Análisis Crítico) ⚠️

### 2.1 Frontend `/reservas` - NO EXISTE

**Preguntas a resolver:**

```
┌─────────────────────────────────────────────────────────────────┐
│  ¿DÓNDE SE VERÁ EL WIDGET?                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  OPCIÓN A: Página dedicada /reservas                            │
│  ════════════════════════════════════                           │
│  URL: /es/reservas, /ca/reservas, /en/reservas, /fr/reservas    │
│  Filtro: /es/reservas?style=dancehall                           │
│                                                                 │
│  Ventajas:                                                      │
│  ✅ Página completa con toda la información                     │
│  ✅ Mejor SEO                                                    │
│  ✅ Espacio para términos y condiciones                         │
│  ✅ Fácil de linkear desde campañas                             │
│                                                                 │
│  OPCIÓN B: Widget modal (popup)                                 │
│  ═══════════════════════════════                                │
│  Se abre desde cualquier página                                 │
│                                                                 │
│  Ventajas:                                                      │
│  ✅ No sales de la página actual                                │
│  ✅ Menos fricción                                               │
│                                                                 │
│  Desventajas:                                                   │
│  ❌ Poco espacio para info legal                                │
│  ❌ Difícil mostrar todos los checkboxes RGPD                   │
│                                                                 │
│  RECOMENDACIÓN: AMBAS                                           │
│  ═══════════════════════                                        │
│  - Página dedicada /reservas para campañas de marketing         │
│  - Widget modal para CTAs en landings (abre /reservas)          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Términos y Condiciones - CRÍTICO PARA RGPD ⚠️

**Lo que proporcionaste (DEBE implementarse):**

#### Checkboxes OBLIGATORIOS:

```
┌─────────────────────────────────────────────────────────────────┐
│  CONSENTIMIENTOS REQUERIDOS (RGPD)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  □ 1. POLÍTICA DE PRIVACIDAD + COMUNICACIONES                   │
│     "Acepto la política de privacidad y autorizo el             │
│      tratamiento de mis datos para gestionar mi reserva         │
│      y recibir comunicaciones por teléfono, WhatsApp o email."  │
│     → Link a: /politica-de-privacidad/                          │
│     → OBLIGATORIO                                               │
│                                                                 │
│  □ 2. RESIDENCIA EN BARCELONA                                   │
│     "Entiendo que la clase de prueba gratuita es únicamente     │
│      para residentes en Barcelona o cercanías. Si no cumplo,    │
│      se me cobrará como clase suelta."                          │
│     → OBLIGATORIO                                               │
│                                                                 │
│  □ 3. UNA SOLA CLASE DE PRUEBA                                  │
│     "Entiendo que la clase de prueba gratuita es única y        │
│      aplicable a UN solo estilo. Cualquier clase adicional      │
│      deberá abonarse."                                          │
│     → OBLIGATORIO                                               │
│                                                                 │
│  □ 4. EX-ESTUDIANTES                                            │
│     "Entiendo que si soy o he sido estudiante, o ya hice        │
│      clases de prueba (aunque haya pasado tiempo o fuera        │
│      otro estilo), esta clase debe abonarse."                   │
│     → OBLIGATORIO                                               │
│                                                                 │
│  □ 5. RESPETAR NIVEL                                            │
│     "Estoy de acuerdo en respetar el nivel de la clase.         │
│      De no hacerlo, la academia puede pedirme que abandone."    │
│     → OBLIGATORIO                                               │
│                                                                 │
│  □ 6. TACONES (SOLO SI ESTILO = HEELS/FEMMOLOGY)                │
│     "Entiendo que para esta clase es obligatorio el uso de      │
│      zapatos de tacón. Sin el calzado requerido, la academia    │
│      puede pedirme que abandone la clase."                      │
│     → CONDICIONAL (solo para Heels)                             │
│                                                                 │
│  □ 7. DERECHOS DE IMAGEN (OPCIONAL)                             │
│     "Acepto que FARRAY'S pueda tomar y usar imágenes/vídeos     │
│      en los que aparezca con fines promocionales."              │
│     → OPCIONAL (si no acepta, indicar en recepción)             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Traducciones - 4 IDIOMAS

**Idiomas requeridos:**

- `es` - Español (principal)
- `ca` - Catalán
- `en` - English
- `fr` - Français

**Contenido a traducir:**

1. Términos y condiciones
2. Checkboxes de consentimiento
3. Labels del formulario
4. Mensajes de error
5. Mensajes de éxito
6. Textos de la página

### 2.4 Información en la Página

**Secciones necesarias:**

```
┌─────────────────────────────────────────────────────────────────┐
│  ESTRUCTURA DE LA PÁGINA /reservas                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. HERO / TÍTULO                                               │
│     "Reserva tu clase de bienvenida gratuita"                   │
│     Subtítulo: "Prueba una clase sin compromiso"                │
│                                                                 │
│  2. INFORMACIÓN IMPORTANTE (antes del formulario)               │
│     ✅ Solo se puede probar UNA clase de UN estilo              │
│     ✅ Solo para residentes en Barcelona o cercanías            │
│     ✅ Sé puntual para no perder el calentamiento               │
│     ✅ Respeta el nivel de la clase                             │
│     ✅ Cuida tus pertenencias (no nos responsabilizamos)        │
│     📧 Dudas: info@farrayscenter.com                            │
│                                                                 │
│  3. FORMULARIO (3 pasos)                                        │
│     Paso 1: Seleccionar clase                                   │
│     Paso 2: Datos personales + Consentimientos                  │
│     Paso 3: Confirmación                                        │
│                                                                 │
│  4. FOOTER CON ENLACES                                          │
│     → Política de privacidad                                    │
│     → Términos y condiciones                                    │
│     → Contacto                                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Requisitos RGPD - CRÍTICO ⚠️

### 3.1 Consentimiento para WhatsApp

```
┌─────────────────────────────────────────────────────────────────┐
│  WHATSAPP REQUIERE CONSENTIMIENTO EXPLÍCITO                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Según RGPD + Política de Meta:                                 │
│                                                                 │
│  1. El usuario DEBE dar consentimiento explícito                │
│  2. Debe poder retirarlo fácilmente                             │
│  3. Debe saber qué tipo de mensajes recibirá                    │
│                                                                 │
│  SOLUCIÓN:                                                      │
│  ─────────                                                      │
│  El checkbox 1 ya incluye "WhatsApp" explícitamente:            │
│  "...recibir comunicaciones por teléfono, WhatsApp o email"     │
│                                                                 │
│  ✅ CUMPLE RGPD                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Derechos de Imagen

```
Checkbox OPCIONAL (no bloquea la reserva):
"Acepto que FARRAY'S pueda usar imágenes/vídeos en los que aparezca."

Si NO acepta:
→ Mostrar mensaje: "Recuerda indicarlo en recepción antes de la clase"
→ Guardar preferencia en Momence (campo personalizado)
```

### 3.3 Enlace a Política de Privacidad

```
URL existente: https://farrayscenter.com/politica-de-privacidad/

El texto debe incluir:
- Responsable: FARRAY'S INTERNATIONAL DANCE CENTER
- Dirección: C/ Entença nº 100, Local 1, 08015 Barcelona
- Email: info@farrayscenter.com
- Derechos: acceso, rectificación, supresión, oposición, limitación, portabilidad
```

---

## 4. Lógica Condicional del Formulario

### 4.1 Checkbox de Tacones (Heels/Femmology)

```javascript
// Si el estilo seleccionado incluye "heels" o "femmology"
const needsHeelsConsent = ['heels', 'femmology', 'stiletto', 'tacones'].some(kw =>
  selectedClass.style.toLowerCase().includes(kw)
);

if (needsHeelsConsent) {
  // Mostrar checkbox adicional
  showHeelsCheckbox();
}
```

### 4.2 Validación de Todos los Checkboxes

```javascript
const requiredConsents = [
  'privacyPolicy', // Política de privacidad + comunicaciones
  'barcelonaResident', // Residencia Barcelona
  'singleTrialClass', // Una sola clase de prueba
  'exStudentAware', // Conocimiento ex-estudiantes
  'respectLevel', // Respetar nivel
];

// Solo si es clase de Heels
if (needsHeelsConsent) {
  requiredConsents.push('heelsRequired');
}

// Opcional (no bloquea)
const optionalConsents = ['imageRights'];
```

---

## 5. Datos a Enviar al Backend

### 5.1 Campos del Formulario

```typescript
interface BookingFormData {
  // Datos personales
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // Internacional

  // Clase seleccionada
  sessionId: number;
  className: string;
  classDate: string;
  estilo: string;

  // Consentimientos (CRÍTICO)
  consents: {
    privacyPolicy: boolean; // OBLIGATORIO
    barcelonaResident: boolean; // OBLIGATORIO
    singleTrialClass: boolean; // OBLIGATORIO
    exStudentAware: boolean; // OBLIGATORIO
    respectLevel: boolean; // OBLIGATORIO
    heelsRequired?: boolean; // CONDICIONAL
    imageRights: boolean; // OPCIONAL
  };

  // Tracking
  fbc?: string;
  fbp?: string;
  sourceUrl: string;
  eventId: string;

  // Metadata
  locale: 'es' | 'ca' | 'en' | 'fr';
  comoconoce?: string;
}
```

### 5.2 Campos a Guardar en Momence (Customer Leads)

```javascript
// Campos disponibles en tu Customer Leads:
{
  firstName: "María",
  lastName: "García",
  email: "maria@example.com",
  phoneNumber: "+34666555444",
  estilo: "dancehall",
  date: "2026-01-20",
  comoconoce: "Instagram",
  // Campos adicionales para tracking interno
  Asunto: "Reserva clase de prueba",
  Mensaje: "Acepta imagen: Sí | Idioma: es | Consentimientos: todos",
}
```

---

## 6. Checklist Final Enterprise

### 6.1 Backend ✅

- [x] `/api/clases` con búsqueda binaria
- [x] `/api/reservar` con Momence + CAPI
- [x] Validación internacional de teléfono
- [x] Deduplicación Redis
- [x] Rate limiting
- [ ] **PENDIENTE:** Guardar consentimientos en respuesta

### 6.2 Frontend ⏳

- [ ] Página `/reservas` dedicada
- [ ] Flujo de 3 pasos
- [ ] Filtro por estilo (?style=)
- [ ] Responsive (mobile-first)
- [ ] Textos informativos antes del formulario

### 6.3 RGPD/Legal ⏳

- [ ] 5 checkboxes obligatorios
- [ ] 1 checkbox condicional (heels)
- [ ] 1 checkbox opcional (imagen)
- [ ] Link a política de privacidad
- [ ] Términos y condiciones visibles

### 6.4 Traducciones ⏳

- [ ] Español (es)
- [ ] Catalán (ca)
- [ ] English (en)
- [ ] Français (fr)

### 6.5 Pre-render (según CLAUDE.md) ⏳

- [ ] Route en App.tsx
- [ ] 4 rutas en prerender.mjs
- [ ] 4 metadata en prerender.mjs
- [ ] 4 initialContent en prerender.mjs
- [ ] Rewrite en vercel.json

### 6.6 WhatsApp ⏳

- [ ] Consentimiento explícito (incluido en checkbox 1)
- [ ] Templates aprobados por Meta
- [ ] Recordatorios 24h y 2h antes

---

## 7. Próximos Pasos Recomendados

```
ORDEN DE IMPLEMENTACIÓN:
═══════════════════════

1. TRADUCCIONES (i18n)
   → Añadir textos a es.ts, ca.ts, en.ts, fr.ts
   → Incluir términos, condiciones, labels, errores

2. COMPONENTE BookingPage
   → Crear src/pages/ReservasPage.tsx
   → Implementar flujo 3 pasos
   → Incluir todos los checkboxes RGPD
   → Lógica condicional para Heels

3. PRE-RENDER
   → Actualizar App.tsx
   → Actualizar prerender.mjs
   → Actualizar vercel.json

4. ACTUALIZAR BACKEND
   → Guardar consentimientos en respuesta
   → Enviar preferencia de imagen a Momence

5. TESTING
   → Probar en los 4 idiomas
   → Verificar todos los checkboxes
   → Probar filtro ?style=
   → Probar en móvil
```

---

## 8. Resumen Ejecutivo

```
┌─────────────────────────────────────────────────────────────────┐
│  ESTADO ACTUAL                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  BACKEND:     ████████████████████████████████████ 100%         │
│  FRONTEND:    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   0%         │
│  RGPD/LEGAL:  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   0%         │
│  TRADUCCIONES:░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   0%         │
│  PRE-RENDER:  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   0%         │
│                                                                 │
│  TOTAL:       ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░  20%         │
│                                                                 │
│  CRÍTICO FALTANTE:                                              │
│  • 5 checkboxes RGPD obligatorios                               │
│  • Checkbox condicional para Heels                              │
│  • Traducciones 4 idiomas                                       │
│  • Página /reservas con toda la información                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

_Análisis generado: Enero 2026_
_Proyecto: Sistema de Reservas Enterprise - Farray's Dance Center_
