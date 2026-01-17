# Sistema de Reservas Enterprise - Analisis Profundo

> **Objetivo:** Crear el proceso de reserva mas simple y de alta conversion del mercado
> **Criterio de exito:** Que una abuela pueda reservar su primera clase en 60 segundos
> **Estado:** ANALISIS COMPLETO

---

## 1. Estado Actual de la Integracion

### Conexion Momence API

| Componente | Estado | Notas |
|------------|--------|-------|
| Autenticacion OAuth2 | ✅ FUNCIONANDO | Token obtenido correctamente |
| Listar sesiones | ✅ FUNCIONANDO | Busqueda binaria implementada |
| Crear miembros | ✅ VERIFICADO | `POST /api/v2/host/members` |
| Crear bookings | ✅ VERIFICADO | `POST /api/v2/host/sessions/{id}/bookings/free` |
| Buscar miembros | ✅ VERIFICADO | `POST /api/v2/host/members/list` |

### Datos Disponibles de Momence

```
Sesiones proximos 7 dias:     81 clases
Tipos de clase unicos:        66 estilos
Plazas detectadas:            Si (incluye "LLENA")
Profesores:                   Si (nombre + ID)
Tags/categorias:              Si (Estilo, Categoria, Hora)
Ubicacion:                    Farray's International Dance Center
```

### Problema Resuelto: Paginacion

La API de Momence devuelve 7,100 sesiones historicas. Solucion implementada:
- **Busqueda binaria** para encontrar la pagina actual
- 6 iteraciones para encontrar entre 71 paginas
- Eficiente y automatico (no hardcodeado)

---

## 2. Principios de Diseno UX de Alta Conversion

### La Regla de Oro

```
MENOS PASOS = MAS CONVERSION

Cada paso extra reduce la conversion un 20-30%
```

### Principios "Abuela-Friendly"

| Principio | Implementacion |
|-----------|----------------|
| **Texto grande** | Minimo 18px en movil, 16px nunca |
| **Botones enormes** | Min 48px altura, mejor 56px |
| **Colores claros** | Verde = bueno, Rojo = error |
| **Sin jerga** | "Reservar" no "Submit", "Tu telefono" no "Phone number" |
| **Feedback inmediato** | Cada click debe producir algo visual |
| **Sin sorpresas** | Precio 0€ visible, sin costes ocultos |
| **Mobile-first** | 80% vendra de Instagram/WhatsApp |

### Anti-patrones a Evitar

```
❌ Registro obligatorio
❌ Crear cuenta con contrasena
❌ Verificacion de email
❌ Captchas
❌ Multiples formularios
❌ Paginas de confirmacion intermedias
❌ "Cargando..." sin feedback visual
❌ Campos innecesarios (direccion, DNI, etc.)
```

---

## 3. Flujo de Reserva: 3 Pasos Maximo

### Vision General

```
┌─────────────────────────────────────────────────────────────────┐
│  PASO 1: ELEGIR CLASE                                           │
│  ─────────────────────                                          │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Lun 19 ene     │  │  Mar 20 ene     │  │  Mie 21 ene     │ │
│  │  ───────────    │  │  ───────────    │  │  ───────────    │ │
│  │  19:00 Bachata  │  │  18:00 Salsa    │  │  20:00 Heels    │ │
│  │  20 plazas      │  │  15 plazas      │  │  8 plazas       │ │
│  │  [RESERVAR]     │  │  [RESERVAR]     │  │  [RESERVAR]     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  Si viene de landing, ya esta pre-filtrado (ej: solo Bachata)  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 2: TUS DATOS (todo en UNA pantalla)                       │
│  ──────────────────────────────────────────                     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Vas a reservar:                                          │ │
│  │  ═══════════════                                          │ │
│  │  BACHATA PRINCIPIANTES                                    │ │
│  │  Lunes 19 enero - 19:00h                                  │ │
│  │  Profesor: Iroel Bastarreche                              │ │
│  │  Precio: GRATIS (clase de bienvenida)                     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Tu nombre:     [_________________________]                     │
│                                                                 │
│  Tu email:      [_________________________]                     │
│                                                                 │
│  Tu WhatsApp:   [+34 ___________________]                       │
│                 Te enviaremos la confirmacion aqui              │
│                                                                 │
│  ☐ Acepto recibir recordatorios por WhatsApp                   │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │           CONFIRMAR RESERVA GRATIS                        │ │
│  │                   (boton verde enorme)                    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Al reservar aceptas nuestros terminos y condiciones           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 3: CONFIRMACION (inmediata, sin esperas)                  │
│  ─────────────────────────────────────────────                  │
│                                                                 │
│         ✓ RESERVA CONFIRMADA                                   │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  BACHATA PRINCIPIANTES                                    │ │
│  │  Lunes 19 enero - 19:00h                                  │ │
│  │                                                           │ │
│  │  📍 Farray's International Dance Center                   │ │
│  │     C/ Llull 48, Barcelona                                │ │
│  │                                                           │ │
│  │  📱 Te hemos enviado la confirmacion a tu WhatsApp        │ │
│  │     +34 612 345 678                                       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Añadir al       │  │ Compartir con   │  │ Ver todas las   │ │
│  │ calendario      │  │ un amigo        │  │ clases          │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  Mientras tanto, llega WhatsApp automatico con toda la info    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Flujo Tecnico Detallado

### Secuencia de Acciones

```
USUARIO ENTRA A /reservas
         │
         ▼
┌─────────────────────────────────────────────┐
│ 1. Frontend carga clases desde /api/clases  │
│    - Cache en memoria si ya se cargo antes  │
│    - Skeleton loading mientras carga        │
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ 2. Usuario selecciona clase                 │
│    - Click en "RESERVAR" de una clase       │
│    - Transicion suave al paso 2             │
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ 3. Usuario completa formulario              │
│    - Validacion en tiempo real              │
│    - Boton deshabilitado hasta completar    │
│    - Telefono: formato automatico +34       │
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ 4. Click en "CONFIRMAR RESERVA"             │
│    - Boton cambia a "Reservando..."         │
│    - Spinner dentro del boton               │
│    - Formulario bloqueado                   │
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ 5. POST /api/reservar                       │
│                                             │
│    {                                        │
│      sessionId: "99591169",                 │
│      name: "Maria Garcia",                  │
│      email: "maria@gmail.com",              │
│      phone: "+34612345678",                 │
│      whatsappOptIn: true                    │
│    }                                        │
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. BACKEND: /api/reservar                                       │
│                                                                 │
│    a) Buscar si email existe en Momence                         │
│       POST /api/v2/host/members/list { emails: ["..."] }        │
│                                                                 │
│    b) Si no existe, crear miembro                               │
│       POST /api/v2/host/members { firstName, lastName, ... }    │
│                                                                 │
│    c) Crear booking en Momence                                  │
│       POST /api/v2/host/sessions/{id}/bookings/free             │
│       { memberId: "..." }                                       │
│                                                                 │
│    d) Guardar en Vercel KV (para recordatorios)                 │
│       SET reserva:{id} { sessionId, phone, startsAt, ... }      │
│                                                                 │
│    e) Enviar WhatsApp de confirmacion                           │
│       POST Meta Cloud API con template "confirmacion_reserva"   │
│                                                                 │
│    f) Responder al frontend                                     │
│       { success: true, bookingId: "...", className: "..." }     │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ 7. Frontend muestra confirmacion            │
│    - Transicion suave al paso 3             │
│    - Confetti animation (opcional)          │
│    - Botones de accion secundarios          │
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ 8. WhatsApp llega al usuario                │
│    - Confirmacion inmediata                 │
│    - Incluye fecha, hora, ubicacion         │
│    - Link a Google Maps                     │
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ 9. CRON: Recordatorios (automatico)         │
│    - 24h antes: "Manana tienes clase!"      │
│    - 2h antes: "En 2 horas tienes clase"    │
│    - Post-clase: "Como fue tu clase?"       │
└─────────────────────────────────────────────┘
```

---

## 5. Arquitectura de Componentes

### Frontend (React)

```
src/
├── pages/
│   └── ReservasPage.tsx          # Pagina principal /reservas
│
├── components/
│   └── reservas/
│       ├── ClasesGrid.tsx        # Grid de clases disponibles
│       ├── ClaseCard.tsx         # Tarjeta individual de clase
│       ├── FormularioReserva.tsx # Formulario paso 2
│       ├── ConfirmacionReserva.tsx # Paso 3 confirmacion
│       ├── FiltrosClases.tsx     # Filtros por estilo/dia/nivel
│       └── SkeletonClases.tsx    # Loading state
│
└── hooks/
    ├── useClasesDisponibles.ts   # Fetch + cache de clases
    └── useReservar.ts            # Mutation para reservar
```

### Backend (API Routes)

```
api/
├── clases/
│   └── route.ts                  # GET /api/clases
│                                 # Devuelve clases futuras
│
├── reservar/
│   └── route.ts                  # POST /api/reservar
│                                 # Crea booking + WhatsApp
│
├── cron/
│   ├── sync-clases/
│   │   └── route.ts              # Sincroniza cada 6h
│   └── recordatorios/
│       └── route.ts              # Envia WhatsApp cada 1h
│
└── lib/
    ├── momence.ts                # Cliente Momence API
    ├── whatsapp.ts               # Cliente Meta Cloud API
    └── kv.ts                     # Helpers Vercel KV
```

---

## 6. Estrategia de Filtros por URL

### URLs Dinamicas

```
/reservas                         → Todas las clases
/reservas?style=bachata           → Solo Bachata
/reservas?style=salsa-cubana      → Solo Salsa Cubana
/reservas?style=heels             → Solo Heels
/reservas?teacher=yunaisy         → Solo clases de Yunaisy
/reservas?level=principiantes     → Solo nivel principiantes
/reservas?day=lunes               → Solo los lunes
/reservas?style=dancehall&level=basico → Dancehall Basico
```

### Mapeo de Tags de Momence

Los tags de Momence se mapean asi:

```javascript
const TAG_MAPPING = {
  // Tags de Momence → Filtro URL
  "Estilo: Salsa Cubana": { style: "salsa-cubana" },
  "Estilo: Bachata": { style: "bachata" },
  "Estilo: Dancehall": { style: "dancehall" },
  "Estilo: Heels": { style: "heels" },
  "Categoría: Bailes Sociales": { category: "bailes-sociales" },
  "Categoría: Danzas Urbanas": { category: "danzas-urbanas" },
  // ... etc
};

// Niveles extraidos del nombre de clase
// "Bachata Principiantes" → level: "principiantes"
// "Salsa Cubana Básico I" → level: "basico"
// "Hip Hop Intermedio" → level: "intermedio"
```

### Uso en Emails/Landings

```html
<!-- Email de promocion Dancehall -->
<a href="https://farrayscenter.com/reservas?style=dancehall">
  Reserva tu clase de Dancehall
</a>

<!-- Landing de Bachata -->
<WidgetReserva preset="bachata" />
<!-- Internamente hace: /reservas?style=bachata -->

<!-- CTA en Instagram Bio -->
https://farrayscenter.com/reservas?style=heels&level=principiantes
```

---

## 7. Optimizaciones de Conversion

### A. Pre-llenado Inteligente

```javascript
// Si el usuario ya reservo antes (localStorage)
const savedData = localStorage.getItem('farays_user');
if (savedData) {
  const { name, email, phone } = JSON.parse(savedData);
  // Pre-llenar formulario
  // "¿Eres Maria? [Si, soy yo] [No, soy otra persona]"
}
```

### B. Reduccion de Friccion

| Friccion | Solucion |
|----------|----------|
| Escribir telefono | Auto-formato +34, teclado numerico |
| Elegir fecha | Mostrar solo proximos 7 dias |
| Escribir nombre | Un solo campo "Tu nombre" (no nombre/apellido) |
| Leer terminos | Checkbox simple, link a terminos |
| Confirmar email | NO requerir confirmacion |

### C. Urgencia y Escasez (etica)

```
"Solo 3 plazas disponibles"     → Rojo si < 5 plazas
"Esta clase se llena rapido"    → Si historicamente es asi
"Ultima clase esta semana"      → Si es verdad
```

### D. Prueba Social

```
"23 personas reservaron esta semana"
"★★★★★ 4.9/5 (127 reseñas en Google)"
```

### E. Garantia Zero-Risk

```
┌─────────────────────────────────────────┐
│  ✓ CLASE GRATIS - Sin compromiso       │
│  ✓ Cancela cuando quieras              │
│  ✓ Sin tarjeta de credito              │
└─────────────────────────────────────────┘
```

---

## 8. Mensajes WhatsApp

### Template: Confirmacion Inmediata

```
¡Hola {{1}}!

Tu clase de bienvenida esta confirmada:

📅 {{2}}
🕐 {{3}}
💃 {{4}}
👨‍🏫 {{5}}

📍 Farray's International Dance Center
   C/ Llull 48, Barcelona
   https://maps.app.goo.gl/xxx

Recuerda traer:
• Ropa comoda
• Botella de agua
• ¡Muchas ganas de bailar!

¿Necesitas cancelar? Responde "CANCELAR"

Nos vemos pronto!
Equipo Farray's 💃
```

### Template: Recordatorio 24h

```
¡Hola {{1}}!

Te recordamos que MAÑANA tienes clase:

📅 {{2}}
🕐 {{3}}
💃 {{4}}

📍 Google Maps: https://maps.app.goo.gl/xxx

¿Todo bien para asistir?
• Responde SI para confirmar
• Responde CANCELAR si no puedes

¡Te esperamos! 💃
```

### Template: Recordatorio 2h

```
¡{{1}}, tu clase empieza en 2 horas!

💃 {{2}} a las {{3}}
📍 C/ Llull 48, Barcelona

¡Nos vemos muy pronto! 🎉
```

### Template: Post-clase (24h despues)

```
¡Hola {{1}}!

¿Que tal tu clase de {{2}}?

Nos encantaria saber tu opinion:
⭐ Deja tu resena: https://g.page/farrays/review

¿Te gusto? Reserva tu proxima clase:
📅 https://farrayscenter.com/reservas

¡Gracias por bailar con nosotros! 💃
```

---

## 9. Metricas de Conversion

### KPIs a Medir

```javascript
// Google Analytics 4 Events
gtag('event', 'view_classes', { ... });        // Vio clases
gtag('event', 'select_class', { ... });        // Selecciono clase
gtag('event', 'start_form', { ... });          // Empezo formulario
gtag('event', 'submit_reservation', { ... });  // Envio formulario
gtag('event', 'reservation_confirmed', { ... }); // Confirmacion exitosa
gtag('event', 'reservation_failed', { ... });  // Error

// Funnel de conversion
// Vista clases → Seleccion → Formulario → Envio → Confirmacion
// Objetivo: > 15% conversion de vista a confirmacion
```

### Dashboard Propuesto

```
┌─────────────────────────────────────────────────────────────┐
│  RESERVAS ESTA SEMANA                                       │
│  ═══════════════════                                        │
│                                                             │
│  Total reservas:        47                                  │
│  Conversion:            18.3%                               │
│  WhatsApp enviados:     141                                 │
│                                                             │
│  Por estilo:                                                │
│  ├─ Bachata:           15 (32%)                            │
│  ├─ Salsa:             12 (26%)                            │
│  ├─ Heels:              8 (17%)                            │
│  └─ Otros:             12 (25%)                            │
│                                                             │
│  Por fuente:                                                │
│  ├─ Instagram:         23 (49%)                            │
│  ├─ Google:            11 (23%)                            │
│  ├─ Directo:            8 (17%)                            │
│  └─ Email:              5 (11%)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Plan de Implementacion

### Fase 1: API Routes (Backend)

| Tarea | Prioridad | Complejidad |
|-------|-----------|-------------|
| `/api/clases` - Listar clases con busqueda binaria | ALTA | Media |
| `/api/reservar` - Crear booking + WhatsApp | ALTA | Alta |
| Lib Momence (auth, cache token) | ALTA | Media |
| Lib WhatsApp (templates) | ALTA | Baja |

### Fase 2: Frontend Reservas

| Tarea | Prioridad | Complejidad |
|-------|-----------|-------------|
| Pagina `/reservas` | ALTA | Media |
| Componente ClasesGrid | ALTA | Media |
| Componente FormularioReserva | ALTA | Media |
| Componente Confirmacion | ALTA | Baja |
| Filtros por URL | MEDIA | Baja |
| Animaciones/transiciones | BAJA | Baja |

### Fase 3: Crons y Recordatorios

| Tarea | Prioridad | Complejidad |
|-------|-----------|-------------|
| Cron sync clases (6h) | MEDIA | Media |
| Cron recordatorios (1h) | MEDIA | Alta |
| Vercel KV setup | ALTA | Baja |

### Fase 4: Optimizacion

| Tarea | Prioridad | Complejidad |
|-------|-----------|-------------|
| Pre-llenado localStorage | BAJA | Baja |
| Analytics/tracking | MEDIA | Baja |
| A/B testing | BAJA | Media |

---

## 11. Checklist Pre-Lanzamiento

### Tecnico

- [ ] API `/api/clases` funcionando
- [ ] API `/api/reservar` funcionando
- [ ] WhatsApp templates aprobados por Meta
- [ ] Vercel KV configurado
- [ ] Crons configurados en vercel.json
- [ ] Variables de entorno en Vercel

### UX/UI

- [ ] Mobile responsive perfecto
- [ ] Loading states en todos lados
- [ ] Error handling con mensajes claros
- [ ] Formulario validado en tiempo real
- [ ] Boton de reservar siempre visible

### Legal

- [ ] Terminos y condiciones actualizados
- [ ] Politica de privacidad con WhatsApp
- [ ] Checkbox de consentimiento WhatsApp

### Testing

- [ ] Test en iPhone (Safari)
- [ ] Test en Android (Chrome)
- [ ] Test con conexion lenta (3G)
- [ ] Test de reserva completa end-to-end
- [ ] Test de cancelacion

---

## 12. Conclusion

### El Flujo Perfecto

```
1. Usuario llega (desde Instagram, email, Google)
   ↓
2. Ve clases filtradas automaticamente
   ↓
3. Toca "RESERVAR" en la que le gusta
   ↓
4. Escribe nombre, email, telefono
   ↓
5. Toca "CONFIRMAR RESERVA"
   ↓
6. Ve confirmacion + recibe WhatsApp
   ↓
7. Llega a clase, se enamora del baile
   ↓
8. Se hace alumno de pago

TIEMPO TOTAL: 60 segundos
PASOS: 3
FRICCIONES: 0
```

### Diferenciadores vs Competencia

| Aspecto | Competencia | Farray's |
|---------|-------------|----------|
| Pasos para reservar | 5-7 | 3 |
| Requiere cuenta | Si | No |
| Confirmacion | Email (lento) | WhatsApp (instant) |
| Recordatorios | No tienen | 24h + 2h antes |
| Pre-filtrado por URL | No | Si |
| Mobile-first | Parcial | 100% |

---

**Documento creado:** Enero 2026
**Proyecto:** Sistema de Reservas Enterprise - Farray's Dance Center
**Objetivo:** Conversion > 15%, Tiempo < 60 segundos

---

¿Procedemos con la implementacion?
