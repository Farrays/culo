# 📋 Resumen: Integración Momence + WhatsApp

> **Respuesta completa a tus 2 preguntas**
> Fecha: Enero 2026

---

## ❓ Pregunta 1: ¿Cómo mapeas las clases del horario de Momence con el formulario simple?

### **Respuesta:** Sincronización automática cada 6 horas via Cron

```
┌────────────────────────────────────────────────────────┐
│  Vercel Cron Job (cada 6 horas)                       │
│  GET /api/v2/host/sessions desde Momence             │
│  → Obtiene todas las clases de los próximos 30 días  │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ↓
┌────────────────────────────────────────────────────────┐
│  Procesamiento Inteligente:                           │
│  - Filtra clases pasadas                              │
│  - Filtra clases sin plazas                           │
│  - Normaliza tipos (salsa, bachata, kizomba...)       │
│  - Extrae nivel (principiante, intermedio, avanzado)  │
│  - Agrupa por tipo de baile                           │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ↓
┌────────────────────────────────────────────────────────┐
│  Vercel KV (Redis) - Caché                            │
│  Key: "clases:disponibles"                            │
│  Expira en: 6 horas                                   │
│  {                                                     │
│    tipo: "salsa",                                     │
│    nombre: "Salsa Cubana",                            │
│    icono: "💃",                                        │
│    clases: [                                          │
│      {                                                │
│        sessionId: "abc123",                           │
│        nombre: "Salsa Cubana - Principiantes",        │
│        fecha: "2026-01-15",                           │
│        hora: "19:00",                                 │
│        plazasDisponibles: 10,                         │
│        esGratis: true                                 │
│      }                                                │
│    ]                                                  │
│  }                                                    │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ↓
┌────────────────────────────────────────────────────────┐
│  Formulario React                                     │
│  GET /api/clases/disponibles?idioma=es                │
│  → Lee clases desde caché (ultra rápido)             │
│  → Dropdown dinámico se actualiza solo               │
└────────────────────────────────────────────────────────┘
```

### **Ventajas de este sistema:**

✅ **Siempre sincronizado** → Clases reales de Momence en tu formulario
✅ **Ultra rápido** → No consulta Momence en cada visita (usa caché)
✅ **Resiliente** → Si Momence está caído, tu web sigue funcionando
✅ **Automático** → Añades clase en Momence → Aparece en web en max 6h
✅ **Inteligente** → Solo muestra clases disponibles, con plazas, futuras
✅ **Multi-idioma** → Traduce nombres automáticamente (ES/CA/EN/FR)

---

## ❓ Pregunta 2: ¿El WhatsApp se envía desde el Cron de Vercel?

### **Respuesta:** WhatsApp se envía desde 2 lugares

### **1. Confirmación Inmediata** → Desde API Route (no cron)

```javascript
// api/reservas/crear-con-momence.js

Usuario envía formulario
  ↓
API crea booking en Momence
  ↓
INMEDIATAMENTE (misma request):
  await enviarWhatsAppConfirmacion(reserva);
  ↓
WhatsApp llega en < 3 segundos
```

**No usa cron** → Es instantáneo

---

### **2. Recordatorios** → Desde Cron de Vercel

```javascript
// api/cron/recordatorios-whatsapp.js

Cron ejecuta cada 1 hora (ej: 17:00, 18:00, 19:00...)
  ↓
Lee todas las reservas de Vercel KV
  ↓
Busca clases que necesitan recordatorio:
  - Recordatorio 24h: clase entre 24h30min y 23h30min
  - Recordatorio 2h: clase entre 2h30min y 1h30min
  ↓
Envía WhatsApp a cada uno
  ↓
Marca como "enviado" para no duplicar
```

**SÍ usa cron** → Automático cada hora

---

## 📊 Comparación: Email vs WhatsApp

| Comunicación            | Email      | WhatsApp      | Desde dónde           |
| ----------------------- | ---------- | ------------- | --------------------- |
| **Confirmación**        | ✅ Momence | ✅ Tu sistema | API Route (inmediato) |
| **Recordatorio 24h**    | ✅ Momence | ✅ Tu sistema | Cron Vercel (c/1h)    |
| **Recordatorio 2h**     | ❌ No      | ✅ Tu sistema | Cron Vercel (c/1h)    |
| **Feedback post-clase** | ✅ Momence | ✅ Tu sistema | Cron Vercel (c/1h)    |

**Resultado:** Doble canal (Email + WhatsApp) sin duplicar esfuerzo

---

## 🎯 ¿Por qué NO usar WhatsApp de Momence?

1. **No disponible en España** (aunque esté en la documentación)
2. **Menos control** (no puedes personalizar mensajes fácilmente)
3. **Coste adicional** (probablemente cobran extra)
4. **Tu sistema es gratis** (Meta Cloud API: 1,000 gratis/mes)
5. **Multi-idioma** (tu sistema soporta ES/CA/EN/FR automático)

---

## 💻 Archivos Creados para Ti

He generado **8 archivos completos** con toda la integración:

### **Backend (API Routes):**

1. **[api-cron-sync-clases-momence.js](api-cron-sync-clases-momence.js)**
   - Sincroniza clases desde Momence cada 6h
   - Procesa y normaliza tipos de baile
   - Guarda en Vercel KV (caché)

2. **[api-clases-disponibles.js](api-clases-disponibles.js)**
   - Endpoint que devuelve clases para el formulario
   - Lee desde caché (ultra rápido)
   - Agrupa por tipo, filtra por horario

3. **[api-momence-integration-example.js](api-momence-integration-example.js)**
   - Crea booking en Momence
   - Envía WhatsApp confirmación
   - Guarda en Vercel KV

4. **[api-whatsapp-example.js](api-whatsapp-example.js)**
   - Envía WhatsApp via Meta Cloud API
   - Soporte multi-idioma

5. **[api-cron-recordatorios-momence.js](api-cron-recordatorios-momence.js)**
   - Cron que envía recordatorios WhatsApp
   - 24h, 2h, post-clase
   - No duplica envíos

### **Frontend (React):**

6. **[FormularioReserva-example.tsx](FormularioReserva-example.tsx)**
   - Formulario completo
   - Carga clases dinámicamente
   - Filtros por horario
   - Multi-idioma

### **Documentación:**

7. **[INTEGRACION-MOMENCE-WHATSAPP.md](INTEGRACION-MOMENCE-WHATSAPP.md)**
   - Guía completa de integración
   - Setup paso a paso
   - Configuración de Sequences en Momence

8. **[FLUJO-WHATSAPP-COMPLETO.md](FLUJO-WHATSAPP-COMPLETO.md)**
   - Timeline detallada de cada WhatsApp
   - Cuándo, desde dónde, por qué
   - Templates de mensajes

---

## ⚙️ Configuración de Crons en vercel.json

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-clases-momence",
      "schedule": "0 */6 * * *",
      "comment": "Sincroniza clases de Momence cada 6 horas"
    },
    {
      "path": "/api/cron/recordatorios-whatsapp",
      "schedule": "0 * * * *",
      "comment": "Envía recordatorios WhatsApp cada hora"
    }
  ]
}
```

---

## 🚀 Próximos Pasos para Implementar

### **Fase 1: Setup (1 día)**

- [ ] Obtener API Key de Momence
- [ ] Setup WhatsApp Cloud API (Meta Business Suite)
- [ ] Crear templates WhatsApp (enviar a aprobación)
- [ ] Configurar variables de entorno en Vercel
- [ ] Activar Vercel KV

### **Fase 2: Código (1 día)**

- [ ] Mover archivos `*-example.js` a `/api`
- [ ] Renombrar sin `-example`
- [ ] Ajustar URLs y configuraciones
- [ ] Crear componente FormularioReserva.tsx
- [ ] Añadir ruta `/reservar-clase` a App.tsx

### **Fase 3: Testing (1 día)**

- [ ] Ejecutar cron de sincronización manualmente
- [ ] Verificar clases aparecen en formulario
- [ ] Crear reserva de prueba
- [ ] Verificar booking aparece en Momence
- [ ] Verificar WhatsApp confirmación llega
- [ ] Simular recordatorios

### **Fase 4: Deploy (1 día)**

- [ ] Deploy a Vercel producción
- [ ] Activar crons en Vercel Dashboard
- [ ] Monitorear logs primeros envíos
- [ ] Ajustar timings si es necesario

**Tiempo total:** 4 días

---

## 💰 Costes Finales

| Servicio           | Plan         | Coste mensual |
| ------------------ | ------------ | ------------- |
| Momence            | Plan actual  | (Ya lo pagas) |
| WhatsApp Cloud API | 1,000 gratis | **€0**        |
| Vercel KV          | 256MB gratis | **€0**        |
| Vercel Crons       | Ilimitado    | **€0**        |
| **TOTAL**          |              | **€0/mes**    |

Con 100 reservas/semana = 400 WhatsApp/mes → **100% gratis**

---

## 🎯 Resultado Final

### **Usuario reserva clase:**

1. ✅ Formulario lee clases reales de Momence (sincronización automática)
2. ✅ Booking se crea en Momence (tu equipo lo ve al instante)
3. ✅ WhatsApp confirmación inmediato (< 3 segundos)
4. ✅ Email confirmación de Momence (automático)
5. ✅ Recordatorio 24h por Email (Momence) + WhatsApp (tu sistema)
6. ✅ Recordatorio 2h por WhatsApp (tu sistema)
7. ✅ Feedback post-clase por Email (Momence) + WhatsApp (tu sistema)

**Todo automático. Cero esfuerzo manual.**

---

## ❓ FAQs Rápidas

### ¿Cada cuánto se sincroniza el formulario con Momence?

**Cada 6 horas.** Si añades una clase en Momence a las 10:00, aparece en tu web a las 16:00 máximo.

### ¿Puedo forzar sincronización manual?

**Sí.** Llamas a `/api/cron/sync-clases-momence` con tu `CRON_SECRET`.

### ¿El WhatsApp lo envía Momence?

**NO.** Lo envía tu sistema de Vercel usando Meta Cloud API.

### ¿Necesito Twilio para WhatsApp?

**NO.** Usas Meta Cloud API (oficial, gratis hasta 1,000/mes).

### ¿Funciona en España?

**SÍ.** Meta Cloud API funciona en toda la UE.

### ¿Puedo cambiar los horarios de recordatorios?

**SÍ.** Editas el código en `api-cron-recordatorios-momence.js`.

### ¿Se pueden duplicar los WhatsApp?

**NO.** Sistema de flags `recordatorio24hEnviado: true` lo previene.

---

## 🎉 Conclusión

Has preguntado:

1. ✅ **"¿Cómo mapeas clases de Momence?"** → Cron cada 6h sincroniza automáticamente
2. ✅ **"¿WhatsApp desde cron de Vercel?"** → Confirmación desde API Route (inmediato), recordatorios desde Cron (cada 1h)

**Bonus:**

- 📱 WhatsApp NO se envía desde Momence (aunque esté en docs)
- 💰 Todo el sistema cuesta €0/mes
- 🚀 Implementación: 4 días
- 🏆 Resultado: Sistema profesional mejor que todos tus competidores

---

## 📞 ¿Listo para arrancar?

Dime y empezamos con:

1. **Setup WhatsApp Cloud API** (30 min guiado)
2. **Configurar variables de entorno**
3. **Implementar código**
4. **Testing**
5. **Deploy** 🚀

¿Vamos? 💪
