# 🎯 Proyecto: Sistema de Reservas Momence + WhatsApp

> **Estado:** BACKEND COMPLETADO - Pendiente frontend /reservas
> **Ultima actualizacion:** Enero 2026
> **Reanudable:** Si
> **Analisis API:** COMPLETADO (8 agentes)
> **Endpoints:** /api/clases y /api/reservar CREADOS

---

## 📋 Resumen del Proyecto

### **Objetivo:**

Crear un sistema de reservas de clases de baile que:

1. Muestre un formulario sencillo (como Swing Maniacs)
2. Sincronice clases desde Momence automáticamente
3. Cree bookings en Momence via API
4. Envíe confirmaciones y recordatorios por WhatsApp
5. Almacene datos en Vercel KV (Redis)

### **Inspiración:**

- https://dance.swingmaniacs.com/ca/classes (formulario sencillo)
- Farray's ya usa Momence activamente

---

## 🏗️ Arquitectura Propuesta

```
Usuario llena formulario en farrayscenter.com
  ↓
API Vercel:
  ├─ Crea booking en Momence (via API)
  ├─ Guarda reserva en Vercel KV
  └─ Envía WhatsApp confirmación
  ↓
Momence:
  └─ Dispara Sequences automáticas (emails)
  ↓
Vercel Cron (cada 1h):
  └─ Envía recordatorios WhatsApp (24h, 2h antes)
```

---

## 📁 Archivos Creados

### **Backend (API Routes - PRODUCCIÓN):**

| Archivo                          | Descripción                                     | Estado         |
| -------------------------------- | ----------------------------------------------- | -------------- |
| [api/clases.ts](api/clases.ts)   | Listar clases disponibles (búsqueda binaria)    | ✅ PRODUCCIÓN  |
| [api/reservar.ts](api/reservar.ts) | Crear reserva + Meta CAPI + Customer Leads    | ✅ PRODUCCIÓN  |

### **Backend (API Routes - Ejemplos/Legacy):**

| Archivo                                                                  | Descripción                               | Estado    |
| ------------------------------------------------------------------------ | ----------------------------------------- | --------- |
| [api-whatsapp-example.js](api-whatsapp-example.js)                       | Enviar WhatsApp via Meta Cloud API        | 📝 Ejemplo |
| [api-momence-integration-example.js](api-momence-integration-example.js) | Crear booking en Momence + WhatsApp       | 📝 Ejemplo |
| [api-cron-sync-clases-momence.js](api-cron-sync-clases-momence.js)       | Cron: sincronizar clases cada 6h          | 📝 Ejemplo |
| [api-clases-disponibles.js](api-clases-disponibles.js)                   | Endpoint: devolver clases para formulario | 📝 Ejemplo |
| [api-cron-recordatorios-momence.js](api-cron-recordatorios-momence.js)   | Cron: recordatorios WhatsApp 24h/2h       | 📝 Ejemplo |

### **Frontend (Componentes - Ejemplos):**

| Archivo                                                              | Descripción                              | Estado    |
| -------------------------------------------------------------------- | ---------------------------------------- | --------- |
| [FormularioReserva-example.tsx](FormularioReserva-example.tsx)       | Formulario básico                        | ✅ Creado |
| [FormularioReserva-updated.tsx](FormularioReserva-updated.tsx)       | Formulario con pre-selección y callbacks | ✅ Creado |
| [src-components-WidgetReserva.tsx](src-components-WidgetReserva.tsx) | Widget modal reutilizable                | ✅ Creado |

### **Página de Test:**

| Archivo                                                                      | Descripción                    | Estado    |
| ---------------------------------------------------------------------------- | ------------------------------ | --------- |
| [src/pages/test/WidgetReservaTest.tsx](src/pages/test/WidgetReservaTest.tsx) | Página de pruebas (gitignored) | ✅ Creado |

### **Documentacion:**

| Archivo                                                                          | Descripcion                            |
| -------------------------------------------------------------------------------- | -------------------------------------- |
| [ANALISIS-MOMENCE-API-ENTERPRISE.md](ANALISIS-MOMENCE-API-ENTERPRISE.md)         | **NUEVO** Analisis profundo API Momence |
| [PROPUESTA-SISTEMA-RESERVAS-WHATSAPP.md](PROPUESTA-SISTEMA-RESERVAS-WHATSAPP.md) | Propuesta inicial completa             |
| [INTEGRACION-MOMENCE-WHATSAPP.md](INTEGRACION-MOMENCE-WHATSAPP.md)               | Guia de integracion Momence + WhatsApp |
| [FLUJO-WHATSAPP-COMPLETO.md](FLUJO-WHATSAPP-COMPLETO.md)                         | Timeline detallada de WhatsApp         |
| [RESUMEN-INTEGRACION-FINAL.md](RESUMEN-INTEGRACION-FINAL.md)                     | Resumen ejecutivo                      |
| [EJEMPLOS-USO-WIDGET.md](EJEMPLOS-USO-WIDGET.md)                                 | Como usar el widget en landings        |
| [GUIA-VISUAL-INTEGRACION-WIDGET.md](GUIA-VISUAL-INTEGRACION-WIDGET.md)           | Guia visual ASCII art                  |
| [GUIA-TRABAJAR-SIN-COMMIT.md](GUIA-TRABAJAR-SIN-COMMIT.md)                       | Como crear paginas de test             |

### **Configuración:**

| Archivo                                              | Descripción                   | Estado        |
| ---------------------------------------------------- | ----------------------------- | ------------- |
| [.gitignore](.gitignore)                             | Actualizado con carpetas test | ✅ Modificado |
| [vercel-cron-example.json](vercel-cron-example.json) | Ejemplo de config de crons    | ✅ Creado     |

---

## 🚀 API Endpoints Implementados

### **GET /api/clases**

Lista las clases disponibles de Momence para los próximos días.

```bash
# Todas las clases (próximos 7 días)
GET /api/clases

# Filtrar por estilo
GET /api/clases?style=dancehall

# Más días
GET /api/clases?days=14&style=heels
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "classes": [...],
    "byDay": { "2026-01-17": [...], "2026-01-18": [...] },
    "total": 45,
    "stylesAvailable": ["bachata", "dancehall", "heels", "salsa"]
  }
}
```

**Características:**
- ✅ Búsqueda binaria para encontrar sesiones actuales (7 iteraciones vs 71 páginas)
- ✅ Caché Redis de 15 minutos
- ✅ Detección automática de estilo y nivel
- ✅ Filtrado por estilo para URLs dinámicas de marketing

---

### **POST /api/reservar**

Crea una reserva de clase de prueba gratuita.

```bash
POST /api/reservar
Content-Type: application/json

{
  "firstName": "María",
  "lastName": "García",
  "email": "maria@example.com",
  "phone": "+34666555444",
  "sessionId": 12345,           # Opcional: ID de la clase
  "className": "Dancehall",     # Para mostrar en confirmación
  "classDate": "Lun 20 Ene",
  "estilo": "dancehall",
  "comoconoce": "Instagram",
  "acceptsMarketing": true,
  "fbc": "fb.1.1234...",        # Cookie Meta (opcional)
  "fbp": "fb.1.5678...",        # Cookie Meta (opcional)
  "sourceUrl": "https://...",   # URL de origen
  "eventId": "unique_id"        # Para deduplicación Pixel+CAPI
}
```

**Respuesta:**
```json
{
  "success": true,
  "status": "new",
  "message": "¡Reserva confirmada! Te hemos enviado un email con los detalles.",
  "data": {
    "eventId": "booking_1234567890_abc123",
    "className": "Dancehall",
    "momenceSuccess": true,
    "trackingSuccess": true
  }
}
```

**Flujo interno:**
1. ✅ Validación de datos (email, teléfono España)
2. ✅ Deduplicación Redis (90 días TTL)
3. ✅ Crear booking en Momence (si hay sessionId)
4. ✅ Enviar a Customer Leads (campos personalizados)
5. ✅ Enviar evento Lead a Meta CAPI (€90 valor)
6. ✅ Rate limiting (3 req/min por IP)

---

## ⏳ Pendiente para Continuar

### **Datos que Necesitamos:**

#### **1. API Key de Momence** 🔑

```
Ubicación: app.momence.com → Settings → Integrations → API
Estado: ⏳ PENDIENTE
```

#### **2. Estructura de Clases en Momence** 📅

```
Necesitamos ejemplos reales de cómo se llaman las clases:
- Nombre exacto
- Días y horarios
- Niveles (si están en el nombre)
- Categorías/tags

Estado: ⏳ PENDIENTE (usuario tiene archivo listado-clases-export.html)
```

#### **3. WhatsApp Business Cloud API** 📱

```
- WHATSAPP_PHONE_NUMBER_ID
- WHATSAPP_TOKEN

Ubicación: business.facebook.com → WhatsApp → API Setup
Estado: ⏳ PENDIENTE
```

#### **4. Vercel KV** 💾

```
Activar Vercel KV en el proyecto
Estado: ⏳ PENDIENTE
```

---

## 🚀 Plan de Implementación

### **Fase 1: Setup Básico** ⏳

- [ ] Obtener API Key de Momence
- [ ] Configurar variables de entorno (.env.local)
- [ ] Activar Vercel KV
- [ ] Testear conexión con Momence API

### **Fase 2: Mapeo de Clases** ⏳

- [ ] Analizar estructura de clases en Momence
- [ ] Crear lógica de normalización (tipos, niveles)
- [ ] Crear cron de sincronización
- [ ] Testear en página de pruebas

### **Fase 3: Formulario** ⏳

- [ ] Crear componente FormularioReserva final
- [ ] Integrar con endpoint de clases
- [ ] Crear booking en Momence
- [ ] Testear flujo completo

### **Fase 4: WhatsApp** ⏳

- [ ] Setup WhatsApp Cloud API
- [ ] Crear message templates en Meta
- [ ] Esperar aprobación (24-48h)
- [ ] Configurar cron de recordatorios

### **Fase 5: Widget** ⏳

- [ ] Finalizar WidgetReserva
- [ ] Integrar en landings
- [ ] Añadir sticky button global
- [ ] Testear en todas las páginas

### **Fase 6: Deploy** ⏳

- [ ] Mover archivos example a /api
- [ ] Configurar crons en vercel.json
- [ ] Deploy a producción
- [ ] Monitorear primeras reservas

---

## 💻 Variables de Entorno Necesarias

```env
# Momence API
MOMENCE_API_KEY="..."

# WhatsApp Business Cloud API
WHATSAPP_PHONE_NUMBER_ID="..."
WHATSAPP_TOKEN="..."

# Vercel KV (auto-generadas al activar)
KV_URL="..."
KV_REST_API_URL="..."
KV_REST_API_TOKEN="..."

# Cron Security
CRON_SECRET="..."

# Site
VERCEL_URL="https://www.farrayscenter.com"
```

---

## 📊 Costes Estimados

| Servicio           | Plan Gratuito    | Estimación Farray's |
| ------------------ | ---------------- | ------------------- |
| Momence            | (Plan actual)    | Ya pagado           |
| Vercel KV          | 256MB / 100K ops | €0                  |
| WhatsApp Cloud API | 1,000 conv/mes   | €0                  |
| Vercel Cron        | Ilimitado        | €0                  |
| **TOTAL**          |                  | **€0/mes extra**    |

---

## 🔗 Referencias Útiles

### **Documentación:**

- [Momence API](https://api.docs.momence.com/)
- [Momence Sequences](https://help.momence.com/en/articles/12030801-sequences-faq-s)
- [Meta WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

### **Competencia analizada:**

- [Swing Maniacs](https://dance.swingmaniacs.com/ca/classes) - Formulario de referencia
- [Dance Emotion](https://dancemotion.es/)
- [Así Se Baila](https://asisebaila.com/)

---

## 📝 Notas de la Sesión

### **Decisiones tomadas:**

1. ✅ **Usar Momence activamente** - Ya tienen Momence, mejor integrar que crear sistema paralelo

2. ✅ **WhatsApp desde Vercel** - Momence no tiene WhatsApp en España, usamos Meta Cloud API directamente

3. ✅ **Widget modal reutilizable** - Un componente para todas las landings

4. ✅ **Sincronización cada 6h** - Balance entre actualización y eficiencia

5. ✅ **Recordatorios WhatsApp** - 24h y 2h antes de la clase

6. ✅ **Pre-selección de clase** - Cada landing puede pre-seleccionar su tipo de clase

### **Preguntas respondidas:**

- **¿Cómo mapear clases de Momence?** → Cron cada 6h sincroniza y normaliza
- **¿WhatsApp desde Momence o Vercel?** → Vercel (Meta Cloud API), Momence solo emails
- **¿Cómo integrar en landings?** → Widget modal reutilizable (3 líneas de código)
- **¿Cómo trabajar sin commit?** → Carpeta src/pages/test/ en .gitignore

---

## 🔄 Cómo Reanudar

### **Para continuar donde lo dejamos:**

1. **Abrir este archivo** y revisar estado
2. **Proporcionar datos pendientes:**
   - API Key de Momence
   - Exportación de clases (ya tienes `listado-clases-export.html`)
3. **Decirle a Claude:** "Retomemos el proyecto de reservas Momence+WhatsApp"

### **Contexto para Claude:**

```
Estamos implementando un sistema de reservas que:
- Sincroniza clases desde Momence API
- Muestra formulario sencillo en la web
- Crea bookings en Momence
- Envía WhatsApp confirmación y recordatorios
- Usa Vercel KV como base de datos

Archivos ya creados están en la raíz del proyecto (*-example.js, *.md)
El usuario usa Momence activamente para gestionar clases.
```

---

## ✅ Siguiente Paso Inmediato

**Cuando quieras continuar:**

1. Abre `listado-clases-export.html` que tienes
2. Comparte el contenido o cuéntame la estructura
3. Proporciona la API Key de Momence
4. Arrancamos con la Fase 1

---

## 📞 Comando Rápido para Reanudar

```
"Retomemos el proyecto de reservas.
Tengo la API Key de Momence: [API_KEY]
Y aquí está la estructura de mis clases: [pegar o describir]"
```

---

**Guardado:** ✅
**Reanudable:** ✅
**Próximo paso:** Proporcionar API Key y estructura de clases

---

_Documento generado: Enero 2026_
_Proyecto: Sistema de Reservas Momence + WhatsApp para Farray's Dance Center_
