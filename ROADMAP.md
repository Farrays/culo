# ROADMAP - Agente IA Laura

> Última actualización: 2026-02-06
> Basado en: AGENTE.md (especificación completa)

---

## Estado General

```
██████████████████████░░░░  88% MVP + Fase 5 + Fase 6 (70%)
```

---

## NIVEL 1: MVP BÁSICO (Fases 1-4)

### Fase 1: Core Agent ✅ 100%

| Tarea                              | Estado | Notas          |
| ---------------------------------- | ------ | -------------- |
| Setup Anthropic API key            | ✅     | En Vercel      |
| agent.ts con personalidad Laura    | ✅     | 949 líneas     |
| knowledge-base.ts (precios, FAQs)  | ✅     | Multilingüe    |
| language-detector.ts (es/ca/en/fr) | ✅     |                |
| Integrar en webhook-whatsapp.ts    | ✅     | Línea 608-652  |
| System prompt según AGENTE.md      | ✅     | Líneas 102-162 |

**Verificación personalidad (AGENTE.md líneas 63-176):**

- ✅ Nombre: Laura, 27 años, 8 años bailando
- ✅ Tono cercano: "Holaa!", "ostras", "mira"
- ✅ Emojis moderados (1-2 por mensaje)
- ✅ Variaciones naturales en respuestas
- ❌ Delay por horario (fuera de 10-22h)
- ❌ Imperfecciones humanas opcionales

---

### Fase 2: Booking Flow ✅ 100%

| Tarea                                       | Estado | Notas                             |
| ------------------------------------------- | ------ | --------------------------------- |
| booking-flow.ts (pasos conversacionales)    | ✅     |                                   |
| consent-flow.ts (RGPD)                      | ✅     | Términos, privacidad, marketing   |
| Flujo: estilo → clase → datos → consents    | ✅     |                                   |
| **Conectar con /api/clases (Momence real)** | ✅     | Llama a /api/clases?style={style} |
| **Crear reserva real en Momence**           | ✅     | Llama a /api/reservar             |
| Testing end-to-end                          | ✅     | Integración completada            |

**Integración completada (2026-02-06):**

- `fetchAvailableClasses()` ahora obtiene clases reales de Momence
- `createMomenceBooking()` crea reservas reales via /api/reservar
- Source tracking: `whatsapp_agent` para analytics

---

### Fase 3: Sales Intelligence ✅ 100%

| Tarea                                      | Estado | Notas                       |
| ------------------------------------------ | ------ | --------------------------- |
| lead-scorer.ts                             | ✅     | Hot/Warm/Cold tiers         |
| objection-handler.ts                       | ✅     | Precio, tiempo, experiencia |
| agent-metrics.ts                           | ✅     | Métricas en Redis           |
| Señales: asked_price, asked_schedule, etc. | ✅     |                             |

---

### Fase 4: Analytics ✅ 100%

| Tarea                       | Estado | Notas                    |
| --------------------------- | ------ | ------------------------ |
| agent-analytics.ts endpoint | ✅     | GET /api/agent-analytics |
| Funnel de conversión        | ✅     |                          |
| Métricas por idioma         | ✅     |                          |
| Lead tiers tracking         | ✅     |                          |

---

## NIVEL 2: ENTERPRISE (Nuevas funcionalidades)

> Basado en AGENTE.md líneas 820-970

### Fase 5: Detección Usuario Existente ✅ 100%

**Implementado: 2026-02-06**

| Tarea                                  | Estado | Notas                         |
| -------------------------------------- | ------ | ----------------------------- |
| Buscar usuario en Momence al inicio    | ✅     | Redis cache + Momence API     |
| Si existe: obtener membresías/créditos | ✅     | `fetchMembershipInfo()`       |
| Si nuevo: flujo primera clase gratis   | ✅     | Ya funcionaba                 |
| Personalizar conversación según estado | ✅     | Saludo + prompt personalizado |

**Archivos creados/modificados:**

```
api/lib/ai/member-lookup.ts   # NUEVO: Servicio de búsqueda de miembros
api/reservar.ts               # Cache del member después de booking
api/lib/ai/agent.ts           # Detección + personalización
```

**Estrategia implementada (Opción B - Cache local):**

1. Al crear reserva en `/api/reservar`, se guarda en Redis:
   - Key: `member:phone:{normalizedPhone}`
   - TTL: 30 días
   - Data: `{ memberId, email, firstName, lastName, phone, cachedAt }`

2. En cada nueva conversación, `processMessage()` llama a `detectExistingMember()`:
   - Primero busca en Redis (rápido)
   - Si no está, busca en Momence via API query
   - Si encuentra, obtiene membresías/créditos

3. El system prompt de Claude incluye contexto del miembro:
   - Nombre, membresía activa, créditos disponibles
   - Instrucciones para no ofrecer clase de prueba gratis
   - Saludos personalizados ("Hola de nuevo!")

**Endpoints Momence VERIFICADOS:**

```
POST /api/v2/host/members/list (buscar por query)
GET /api/v2/host/{hostId}/members/{memberId}/bought-memberships
```

---

### Fase 6: Funcionalidades para Miembros 🟡 70%

**Implementado: 2026-02-06**

| Funcionalidad                 | Estado | Notas                              |
| ----------------------------- | ------ | ---------------------------------- |
| "¿Cuántas clases me quedan?"  | ✅     | `handleCreditsInquiry()`           |
| Reservar con créditos         | ✅     | Salta data collection si es member |
| Ver historial de clases       | 🟡     | UI lista, falta API Momence        |
| Cancelar reserva vía WhatsApp | 🟡     | Guía al usuario, falta fetch       |
| Actualizar email/nombre       | ❌     | PUT endpoints no implementados     |

**Archivos modificados:**

```
api/lib/ai/booking-flow.ts    # detectMemberIntent(), skip data if member
api/lib/ai/agent.ts           # handleMemberIntent(), handleCreditsInquiry()
```

**Flujos implementados:**

```
Usuario: "¿Cuántas clases me quedan?"
Laura: "María, tienes 3 clases disponibles de tu Bono Mensual 💃
        ¿Quieres reservar alguna?"

Usuario: "Quiero reservar bachata"
[Selecciona clase]
Laura: "María, has elegido Bachata Sensual 💃
        Como ya te conozco, solo necesito que confirmes los términos..."
[Salta nombre/email, va directo a consents]
```

**Endpoints Momence VERIFICADOS:**

```
# Ver membresías activas y créditos
GET /api/v2/host/{hostId}/members/{memberId}/bought-memberships

# Historial de visitas
GET /api/v2/host/members/{memberId}  → campo "visits"

# Cancelar reserva (ya implementado en cancelar-reserva.ts)
DELETE /api/v2/host/session-bookings/{bookingId}

# Actualizar datos del miembro
PUT /api/v2/host/members/{memberId}/name
PUT /api/v2/host/members/{memberId}/email
PUT /api/v2/host/members/{memberId}/phone
```

---

### Fase 7: Lista de Espera (Waitlist) ❌ 0%

> AGENTE.md líneas 878-889

| Tarea                                     | Estado |
| ----------------------------------------- | ------ |
| Detectar clase llena (spotsAvailable = 0) | ❌     |
| Ofrecer waitlist                          | ❌     |
| Llamar endpoint de waitlist               | ❌     |

**Endpoint Momence VERIFICADO:**

```
# Añadir a lista de espera
POST /api/v2/host/sessions/{sessionId}/waitlist
Body: { "memberId": 123, "useBoughtMembershipIds": [456] }
```

---

## NIVEL 3: OMNICANAL

### Fase 8: Grupos WhatsApp (Whapi.cloud) 🟡 20%

> AGENTE.md líneas 1027-1100

| Tarea                         | Estado | Notas       |
| ----------------------------- | ------ | ----------- |
| api/lib/whapi/client.ts       | ✅     | Scaffolding |
| api/lib/whapi/groups.ts       | ✅     | Scaffolding |
| Configurar WHAPI_API_KEY      | ❌     | $29/mes     |
| Auto-añadir a grupo por clase | ❌     |             |
| Quitar de grupo al cancelar   | ❌     |             |

---

### Fase 9: Instagram DMs ❌ 0%

> AGENTE.md líneas 1231-1335

| Tarea                           | Estado |
| ------------------------------- | ------ |
| webhook-instagram.ts            | ❌     |
| Auto-aceptar solicitudes        | ❌     |
| Mismo agente Laura              | ❌     |
| Adaptar respuestas (más cortas) | ❌     |

---

### Fase 10: Email Inbound ❌ 0%

> AGENTE.md líneas 1337-1500

| Tarea                        | Estado |
| ---------------------------- | ------ |
| Configurar Resend Inbound    | ❌     |
| webhook-email.ts             | ❌     |
| Filtro anti-spam             | ❌     |
| Formato HTML para respuestas | ❌     |

---

## NIVEL 4: AUTOMATIZACIÓN

### Fase 11: Follow-up 24h ✅ 90%

| Tarea                             | Estado | Notas                     |
| --------------------------------- | ------ | ------------------------- |
| Tracking lastUserMessage          | ✅     | En ConversationState      |
| getConversationsNeedingFollowUp() | ✅     | 20-23h window             |
| generateFollowUpMessage()         | ✅     | Personalizado por señales |
| **Cron job para ejecutar**        | ❌     | Falta cron                |

---

### Fase 12: Envíos Masivos ❌ 10%

| Tarea                            | Estado         |
| -------------------------------- | -------------- |
| Templates en Meta Business Suite | ❌             |
| api/send-promo.ts                | ⚠️ Scaffolding |
| Queue para rate limiting         | ❌             |

---

## GAPS IDENTIFICADOS vs AGENTE.md

### 🔴 Críticos (Bloquean funcionamiento real)

1. **fetchAvailableClasses usa MOCK** (línea 416)
   - Debe llamar a `/api/clases?style={style}`

2. **createMomenceBooking no crea reserva** (línea 468)
   - Debe usar lógica de `reservar.ts`

### 🟡 Importantes (Mejoran experiencia)

3. **No detecta usuario existente**
   - Siempre trata como nuevo
   - Debería buscar en Momence primero

4. **Delay por horario no implementado**
   - AGENTE.md líneas 134-140
   - Fuera de 10-22h debería demorar respuesta

5. **Cron de follow-up no existe**
   - La lógica está, falta el cron job

### 🟢 Nice-to-have

6. Imperfecciones humanas (typos corregidos)
7. Experiencias personales de Laura más variadas
8. Waitlist cuando clase llena

---

## PRÓXIMOS PASOS RECOMENDADOS

### Opción A: Completar MVP (2-4 horas)

```
1. ✏️ Conectar fetchAvailableClasses → /api/clases
2. ✏️ Conectar createMomenceBooking → lógica reservar.ts
3. 🧪 Probar reserva real por WhatsApp
4. ✅ MVP funcional al 100%
```

### Opción B: Agregar detección de usuario existente (4-6 horas)

```
1. Al inicio de processMessage():
   - Buscar teléfono en Momence
   - Si existe: cargar membresías/créditos
   - Añadir al ConversationState
2. Modificar flujo para miembros existentes
3. Probar ambos flujos
```

### Opción C: Implementar todo el NIVEL 2 (2-3 días)

```
- Detección usuario existente
- Reservar con créditos
- Ver historial
- Cancelar reservas
- Waitlist
```

---

## ARCHIVOS DEL AGENTE

```
api/lib/ai/
├── agent.ts              # 949 líneas - Core ⭐
├── agent-metrics.ts      # ~500 líneas - Métricas
├── booking-flow.ts       # ~800 líneas - Flujo reservas
├── booking-flow.test.ts  # Tests
├── consent-flow.ts       # ~250 líneas - RGPD
├── consent-flow.test.ts  # Tests
├── knowledge-base.ts     # ~600 líneas - FAQs, precios
├── language-detector.ts  # ~150 líneas - es/ca/en/fr
├── lead-scorer.ts        # ~400 líneas - Hot/Warm/Cold
└── objection-handler.ts  # ~700 líneas - Manejo objeciones
```

---

## DECISION POINT

¿Qué quieres hacer?

| Opción                     | Tiempo    | Resultado                   |
| -------------------------- | --------- | --------------------------- |
| **A: Completar MVP**       | 2-4h      | Reservas reales funcionando |
| **B: + Usuario existente** | 4-6h      | Detecta miembros de Momence |
| **C: NIVEL 2 completo**    | 2-3 días  | Funcionalidades enterprise  |
| **D: Omnicanal**           | 1 semana+ | Instagram, Email, Grupos    |
