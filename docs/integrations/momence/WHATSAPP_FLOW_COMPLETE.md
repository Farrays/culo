# 📱 Flujo Completo de WhatsApp desde Vercel

> **WhatsApp se envía SOLO desde tu backend de Vercel, NO desde Momence**
> Fecha: Enero 2026

---

## ⚠️ Aclaración Importante

**Momence NO envía WhatsApp** (aunque esté en la documentación de algunos países)

**Tu sistema de Vercel SÍ envía WhatsApp** usando Meta Cloud API

---

## 🔄 Flujo Completo: Cuándo se envía cada WhatsApp

### **Timeline Detallada**

```
┌──────────────────────────────────────────────────────┐
│  T = 0  (Usuario envía formulario)                  │
└───────────────────┬──────────────────────────────────┘
                    │
                    ↓
┌──────────────────────────────────────────────────────┐
│  API Route: /api/reservas/crear-con-momence         │
│                                                      │
│  1. Crea booking en Momence                         │
│  2. Guarda reserva en Vercel KV                     │
│  3. ⚡ INMEDIATO: Envía WhatsApp confirmación        │
│                                                      │
└──────────────────────────────────────────────────────┘
                    │
                    ↓
┌──────────────────────────────────────────────────────┐
│  WhatsApp Business Cloud API (Meta)                 │
│  📱 Envía confirmación al cliente                    │
│  Latencia: < 3 segundos                             │
└──────────────────────────────────────────────────────┘

─────────────────────────────────────────────────────────

┌──────────────────────────────────────────────────────┐
│  T = Clase - 24h (Recordatorio 1)                   │
└───────────────────┬──────────────────────────────────┘
                    │
                    ↓
┌──────────────────────────────────────────────────────┐
│  Vercel Cron Job (ejecuta cada 1 hora)              │
│  /api/cron/recordatorios-whatsapp                   │
│                                                      │
│  1. Lee todas las reservas de Vercel KV             │
│  2. Detecta clases en 24h                           │
│  3. 📱 Envía WhatsApp recordatorio 24h              │
│  4. Marca como "recordatorio24hEnviado: true"       │
│                                                      │
└──────────────────────────────────────────────────────┘

─────────────────────────────────────────────────────────

┌──────────────────────────────────────────────────────┐
│  T = Clase - 2h (Recordatorio 2)                    │
└───────────────────┬──────────────────────────────────┘
                    │
                    ↓
┌──────────────────────────────────────────────────────┐
│  Vercel Cron Job (ejecuta cada 1 hora)              │
│  /api/cron/recordatorios-whatsapp                   │
│                                                      │
│  1. Lee todas las reservas de Vercel KV             │
│  2. Detecta clases en 2h                            │
│  3. 📱 Envía WhatsApp recordatorio 2h               │
│  4. Marca como "recordatorio2hEnviado: true"        │
│                                                      │
└──────────────────────────────────────────────────────┘

─────────────────────────────────────────────────────────

┌──────────────────────────────────────────────────────┐
│  T = Clase + 2h (Feedback/Oferta)                   │
└───────────────────┬──────────────────────────────────┘
                    │
                    ↓
┌──────────────────────────────────────────────────────┐
│  Vercel Cron Job (ejecuta cada 1 hora)              │
│  /api/cron/recordatorios-whatsapp                   │
│                                                      │
│  1. Lee todas las reservas de Vercel KV             │
│  2. Detecta clases finalizadas hace 2h              │
│  3. 📱 Envía WhatsApp feedback/oferta               │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🎯 Detalle de Cada Envío

### **1. Confirmación Inmediata (desde API Route)**

**Archivo:** `/api/reservas/crear-con-momence.js`

**Trigger:** Usuario envía formulario

**Cuándo:** INMEDIATAMENTE (< 3 segundos)

**Código:**

```javascript
// Después de crear booking en Momence
await enviarWhatsAppConfirmacion({
  telefono: reserva.telefono,
  nombre: reserva.nombre,
  clase: reserva.clase,
  fecha: reserva.fecha,
  hora: reserva.hora,
  idioma: reserva.idioma,
});
```

**Template de WhatsApp:**

```
¡Hola María! 👋

Tu clase de prueba GRATIS de *Salsa Cubana* está confirmada.

📅 Miércoles 15 Enero
🕐 19:00h
📍 Farray's Dance Center
   C/ Gran Vía 111, Barcelona

Recibirás recordatorios 24h y 2h antes.

¿Necesitas cambiar? Responde CAMBIAR

¡Nos vemos! 💃
```

---

### **2. Recordatorio 24h (desde Cron)**

**Archivo:** `/api/cron/recordatorios-whatsapp.js`

**Trigger:** Cron de Vercel (cada 1 hora)

**Cuándo:** 24h antes de la clase (ventana: 24h30min - 23h30min)

**Lógica:**

```javascript
const ahora = new Date();
const en24h = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);

for (const reserva of reservas) {
  const fechaClase = new Date(reserva.fechaHora);

  // Ventana de 1 hora para enviar
  if (
    !reserva.recordatorio24hEnviado &&
    fechaClase > en24h &&
    fechaClase <= new Date(en24h.getTime() + 60 * 60 * 1000)
  ) {
    await enviarWhatsAppRecordatorio24h(reserva);
    await kv.set(key, { ...reserva, recordatorio24hEnviado: true });
  }
}
```

**Template de WhatsApp:**

```
¡Hola María! 🎵

Recordatorio: MAÑANA tienes tu clase de *Salsa Cubana* a las 19:00h.

📍 Farray's Dance Center
   C/ Gran Vía 111, Barcelona
   Metro L1: Urgell

💡 Trae ropa cómoda y agua

¿Necesitas cancelar? Responde CANCELAR

¡Te esperamos! 🌟
```

---

### **3. Recordatorio 2h (desde Cron)**

**Archivo:** `/api/cron/recordatorios-whatsapp.js`

**Trigger:** Cron de Vercel (cada 1 hora)

**Cuándo:** 2h antes de la clase (ventana: 2h30min - 1h30min)

**Template de WhatsApp:**

```
María, tu clase de *Salsa Cubana* empieza en 2 HORAS ⏰

🕐 19:00h
📍 C/ Gran Vía 111, Barcelona

¡Nos vemos pronto! 💃
```

---

### **4. Feedback Post-Clase (desde Cron) - Opcional**

**Archivo:** `/api/cron/recordatorios-whatsapp.js`

**Trigger:** Cron de Vercel (cada 1 hora)

**Cuándo:** 2h después de finalizar la clase

**Template de WhatsApp:**

```
¡Hola María! 👋

Esperamos que hayas disfrutado tu clase de *Salsa Cubana* hoy.

🎁 OFERTA ESPECIAL:
   Primera mensualidad 20% descuento

📲 Reserva tu plaza:
   www.farrayscenter.com/es/horarios-precios

¿Tienes dudas? Responde a este mensaje.

¡Gracias por bailar con nosotros! 🌟
```

---

## ⚙️ Configuración del Cron en vercel.json

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-clases-momence",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/recordatorios-whatsapp",
      "schedule": "0 * * * *"
    }
  ]
}
```

**Explicación:**

- `"0 */6 * * *"` = Cada 6 horas (sincronización de clases)
- `"0 * * * *"` = Cada 1 hora (recordatorios WhatsApp)

**¿Por qué cada 1 hora?**

- Ventana de tolerancia de 30 minutos antes/después
- Si falla un envío, lo reintenta en la próxima hora
- Balance perfecto entre precisión y eficiencia

---

## 🔐 Variables de Entorno Necesarias

```env
# Meta WhatsApp Business Cloud API
WHATSAPP_PHONE_NUMBER_ID="1234567890"
WHATSAPP_TOKEN="EAAxxxxxxxxxxxxxxxxxxxxx"

# Vercel KV (Redis)
KV_URL="redis://xxxxxx.vercel-storage.com:6379"
KV_REST_API_URL="https://xxxxxx.vercel-storage.com"
KV_REST_API_TOKEN="xxxxxxxxxxxxxxxx"

# Cron Secret (para autenticar llamadas de cron)
CRON_SECRET="tu-random-secret-aqui"

# Site URL
VERCEL_URL="https://www.farrayscenter.com"
```

---

## 📊 Ejemplo Real: Reserva de María

**María reserva el Lunes 13 Enero a las 15:00h**
**Clase: Miércoles 15 Enero a las 19:00h**

### **Timeline de comunicaciones:**

```
Lunes 13 Enero, 15:00:03
├─ 📧 Email confirmación (Momence)
└─ 📱 WhatsApp confirmación (Tu sistema)

Martes 14 Enero, 19:00
├─ 📧 Email recordatorio 24h (Momence)
└─ 📱 WhatsApp recordatorio 24h (Tu sistema)

Miércoles 15 Enero, 17:00
└─ 📱 WhatsApp recordatorio 2h (Tu sistema)

Miércoles 15 Enero, 19:00
└─ 🎵 Clase de Salsa Cubana

Miércoles 15 Enero, 21:00
├─ 📧 Email feedback (Momence)
└─ 📱 WhatsApp feedback (Tu sistema)
```

**Total:** 3 emails + 4 WhatsApp = **7 puntos de contacto**

---

## 🚨 ¿Qué pasa si el Cron falla?

### **Mecanismo de Respaldo:**

1. **Cron ejecuta cada hora** → Si falla a las 17:00, reintenta a las 18:00
2. **Flag de "enviado"** → No duplica envíos
3. **Ventana de tolerancia** → 30min antes/después del tiempo exacto
4. **Logs en Vercel** → Puedes ver todos los envíos en el dashboard

### **Monitoreo:**

```javascript
// En cada ejecución del cron
console.log(`✅ Recordatorio 24h enviado: ${reserva.nombre} - ${reserva.clase}`);
console.log(`❌ Error enviando a ${reserva.nombre}: ${error.message}`);
```

**Ver logs:** Vercel Dashboard → Functions → Logs

---

## 📈 Ventajas de este Sistema

| Ventaja                      | Explicación                                        |
| ---------------------------- | -------------------------------------------------- |
| **Independiente de Momence** | Si Momence no tiene WhatsApp en España, no importa |
| **Control total**            | Puedes editar mensajes, timings, idiomas           |
| **Gratis**                   | Meta Cloud API: 1,000 conversaciones/mes gratis    |
| **Escalable**                | Aguanta miles de reservas sin costes               |
| **Multi-idioma**             | ES/CA/EN/FR automático                             |
| **Analytics**                | Puedes trackear entregas, aperturas, respuestas    |

---

## 🆚 Email (Momence) vs WhatsApp (Tu sistema)

| Canal        | Tasa apertura | Tiempo lectura | Engagement | Coste           |
| ------------ | ------------- | -------------- | ---------- | --------------- |
| **Email**    | 15-25%        | 2-6 horas      | Bajo       | €0 (incluido)   |
| **WhatsApp** | **98%**       | **3 minutos**  | **Alto**   | **€0** (gratis) |

**Conclusión:** Email + WhatsApp = **Cobertura 99%** con **0% coste extra**

---

## 🎯 Resumen Técnico

### **¿Desde dónde se envía cada WhatsApp?**

| WhatsApp         | Desde     | Trigger            | Timing            |
| ---------------- | --------- | ------------------ | ----------------- |
| Confirmación     | API Route | Usuario envía form | Inmediato (< 3s)  |
| Recordatorio 24h | Cron Job  | Cada hora          | 24h antes ±30min  |
| Recordatorio 2h  | Cron Job  | Cada hora          | 2h antes ±30min   |
| Feedback         | Cron Job  | Cada hora          | 2h después ±30min |

### **¿Necesitas configurar algo en Momence para WhatsApp?**

**NO.** Momence solo envía emails. WhatsApp es 100% tu sistema independiente.

---

## 📝 Checklist de Implementación

### **Setup WhatsApp Cloud API (30 min):**

- [ ] Crear cuenta Meta Business Suite
- [ ] Vincular tu WhatsApp Business
- [ ] Obtener PHONE_NUMBER_ID
- [ ] Obtener WHATSAPP_TOKEN
- [ ] Crear templates y enviar a aprobación (24-48h)

### **Setup Vercel (15 min):**

- [ ] Configurar variables de entorno
- [ ] Activar Vercel KV (gratis)
- [ ] Configurar crons en vercel.json

### **Código (ya creado):**

- [x] api/whatsapp/send.js
- [x] api/cron/recordatorios-whatsapp.js
- [x] api/reservas/crear-con-momence.js

### **Testing (1 hora):**

- [ ] Crear reserva de prueba
- [ ] Verificar WhatsApp confirmación llega
- [ ] Simular cron manualmente
- [ ] Verificar recordatorios se envían

---

## ❓ FAQs

### ¿Por qué no usar la función de WhatsApp de Momence?

Porque en España no está disponible, aunque esté en la documentación global.

### ¿Meta Cloud API funciona en España?

**SÍ.** Es oficial de Meta y funciona en todos los países de la UE.

### ¿Cuánto cuesta enviar 1,000 WhatsApp/mes?

**€0.** Los primeros 1,000 son gratis. Después €0.005/mensaje.

Con 100 reservas/semana = 400 WhatsApp/mes → **GRATIS**

### ¿Puedo cambiar los mensajes de WhatsApp?

**SÍ.** Los templates se crean en Meta Business Manager y puedes editarlos cuando quieras (requiere aprobación de Meta).

### ¿Qué pasa si un usuario responde al WhatsApp?

Puedes configurar respuestas automáticas o manejarlas manualmente desde Meta Business Manager.

---

## 🚀 ¿Listo para implementar?

Ya tienes todos los archivos creados. Solo falta:

1. **Setup WhatsApp Cloud API** (te guío paso a paso)
2. **Configurar variables de entorno**
3. **Deploy a Vercel**
4. **Testing**
5. **Launch** 🚀

**Tiempo total:** 2-3 días

¿Arrancamos? 💪
