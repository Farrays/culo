# Sistema de Tracking de Conversiones Enterprise

> **Objetivo:** Tracking 100% fiable para Facebook Ads, Google Ads y Analytics
> **Metodo:** Dual-tracking (Client-side + Server-side)
> **Resultado:** Facebook recibe TODA la data para optimizar campañas

---

## 0. Valor del Lead Calculado

```
┌─────────────────────────────────────────────────────────────────┐
│  CALCULO DEL VALOR DEL LEAD                                     │
│  ═══════════════════════════                                    │
│                                                                 │
│  Gasto mensual medio:        50€                                │
│  Permanencia media:          6 meses                            │
│  LTV (Lifetime Value):       50€ × 6 = 300€                     │
│                                                                 │
│  Conversion clase gratis     30% (1 de cada 3)                  │
│  a cliente de pago:                                             │
│                                                                 │
│  ════════════════════════════════════════════                   │
│  VALOR DEL LEAD:             300€ × 30% = 90€                   │
│  ════════════════════════════════════════════                   │
│                                                                 │
│  Esto significa que cada reserva de clase de prueba             │
│  gratis vale 90€ para el negocio.                               │
│                                                                 │
│  Facebook usara este valor para optimizar campañas              │
│  buscando personas de alto valor.                               │
└─────────────────────────────────────────────────────────────────┘
```

### Eventos a enviar por cada reserva:

```javascript
// 1. Lead con valor estimado (para optimizacion)
fbq('track', 'Lead', {
  value: 90,
  currency: 'EUR',
  content_name: 'Clase de bienvenida'
});

// 2. Purchase con valor real (para conteo)
fbq('track', 'Purchase', {
  value: 0,
  currency: 'EUR',
  content_name: 'Clase de bienvenida'
});
```

---

## 1. Por Que Necesitas CAPI (Conversions API)

### El Problema Actual

```
iOS 14+ bloquea cookies          → Facebook pierde 30-40% de conversiones
Ad blockers                      → Pierdes más datos
Solo Pixel                       → Facebook no puede optimizar bien
Momence tracking                 → No envia eventos personalizados a Facebook
```

### La Solucion: Dual Tracking

```
┌─────────────────────────────────────────────────────────────────┐
│  USUARIO RESERVA                                                │
│                                                                 │
│  ┌─────────────────┐         ┌─────────────────┐               │
│  │  META PIXEL     │         │  CONVERSIONS    │               │
│  │  (Client-side)  │         │  API (Server)   │               │
│  │                 │         │                 │               │
│  │  fbq('track',   │         │  POST to        │               │
│  │  'Purchase')    │         │  graph.facebook │               │
│  └────────┬────────┘         └────────┬────────┘               │
│           │                           │                         │
│           └───────────┬───────────────┘                         │
│                       │                                         │
│                       ▼                                         │
│           ┌─────────────────────┐                              │
│           │  FACEBOOK           │                              │
│           │  Deduplica eventos  │                              │
│           │  Usa el mejor dato  │                              │
│           │  Optimiza campañas  │                              │
│           └─────────────────────┘                              │
└─────────────────────────────────────────────────────────────────┘

Resultado: Facebook recibe 95%+ de conversiones
           vs 60% con solo Pixel
```

---

## 2. Credenciales Disponibles

```
META PIXEL ID:           244157012706790
META CAPI TOKEN:         aNLOP4N5gUHiO6IY8LyS9UECvoAZnRul
GOOGLE TAG MANAGER:      GTM-TT2V8Z4
```

---

## 3. Arquitectura de Tracking

### Eventos a Trackear

| Evento | Trigger | Pixel (Client) | CAPI (Server) | GA4 |
|--------|---------|----------------|---------------|-----|
| PageView | Carga pagina | ✅ Auto | ❌ | ✅ Auto |
| ViewContent | Ve clases | ✅ | ✅ | ✅ |
| InitiateCheckout | Selecciona clase | ✅ | ✅ | ✅ |
| AddPaymentInfo | Completa form | ✅ | ✅ | ✅ |
| **Purchase** | Reserva confirmada | ✅ | ✅ | ✅ |
| Lead | Reserva confirmada | ✅ | ✅ | ✅ |

### Flujo Completo de Tracking

```
┌─────────────────────────────────────────────────────────────────┐
│  PASO 1: Usuario entra a /reservas                              │
│  ─────────────────────────────────────────────────              │
│                                                                 │
│  GTM detecta URL y dispara:                                     │
│  • fbq('track', 'ViewContent', {                               │
│      content_type: 'product',                                  │
│      content_ids: ['clase_bachata'],                           │
│      content_name: 'Clases de Bachata'                         │
│    })                                                          │
│  • gtag('event', 'view_item_list', {...})                      │
│                                                                 │
│  UTM params guardados en sessionStorage:                        │
│  ?utm_source=facebook&utm_medium=cpc&utm_campaign=bachata_enero │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 2: Usuario selecciona clase                               │
│  ───────────────────────────────────────                        │
│                                                                 │
│  Client-side:                                                   │
│  • fbq('track', 'InitiateCheckout', {                          │
│      content_type: 'product',                                  │
│      content_ids: ['session_99591169'],                        │
│      content_name: 'Bachata Principiantes - Lun 19 ene 19:00', │
│      value: 0,                                                 │
│      currency: 'EUR'                                           │
│    })                                                          │
│  • gtag('event', 'begin_checkout', {...})                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 3: Usuario completa formulario                            │
│  ──────────────────────────────────────                         │
│                                                                 │
│  Client-side (cuando rellena telefono):                         │
│  • fbq('track', 'AddPaymentInfo')                              │
│  • gtag('event', 'add_payment_info', {...})                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 4: Click en "CONFIRMAR RESERVA"                           │
│  ────────────────────────────────────────                       │
│                                                                 │
│  1. Frontend envia POST /api/reservar con:                      │
│     {                                                           │
│       sessionId, name, email, phone,                            │
│       // Datos de tracking                                      │
│       fbc: getCookie('_fbc'),     // Facebook click ID         │
│       fbp: getCookie('_fbp'),     // Facebook browser ID       │
│       userAgent: navigator.userAgent,                          │
│       sourceUrl: window.location.href,                         │
│       utm: getUTMParams()                                      │
│     }                                                           │
│                                                                 │
│  2. Client-side INMEDIATO (antes de respuesta):                 │
│     • fbq('track', 'Purchase', {                               │
│         value: 0,                                              │
│         currency: 'EUR',                                       │
│         content_type: 'product',                               │
│         content_ids: ['session_99591169'],                     │
│         content_name: 'Bachata Principiantes'                  │
│       })                                                       │
│     • gtag('event', 'purchase', {...})                         │
│     • gtag('event', 'conversion', { // Google Ads              │
│         send_to: 'AW-XXXXXXX/YYYYYYY'                         │
│       })                                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PASO 5: Backend /api/reservar                                  │
│  ─────────────────────────────────                              │
│                                                                 │
│  a) Crear booking en Momence                                    │
│  b) Guardar en Vercel KV                                        │
│  c) ⭐ ENVIAR A META CONVERSIONS API:                           │
│                                                                 │
│     POST https://graph.facebook.com/v18.0/244157012706790/events│
│     Authorization: Bearer aNLOP4N5gUHiO6IY8LyS9UECvoAZnRul     │
│     {                                                           │
│       "data": [{                                                │
│         "event_name": "Purchase",                               │
│         "event_time": 1705423200,                              │
│         "event_id": "reserva_abc123",  // Para deduplicar      │
│         "event_source_url": "https://farrayscenter.com/reservas",│
│         "action_source": "website",                            │
│         "user_data": {                                         │
│           "em": [hash(email)],        // SHA256                │
│           "ph": [hash(phone)],        // SHA256                │
│           "fn": [hash(firstName)],    // SHA256                │
│           "client_ip_address": "...",                          │
│           "client_user_agent": "...",                          │
│           "fbc": "_fbc cookie",                                │
│           "fbp": "_fbp cookie"                                 │
│         },                                                     │
│         "custom_data": {                                       │
│           "value": 0,                                          │
│           "currency": "EUR",                                   │
│           "content_type": "product",                           │
│           "content_ids": ["session_99591169"],                 │
│           "content_name": "Bachata Principiantes",             │
│           "content_category": "clase_prueba"                   │
│         }                                                      │
│       }]                                                       │
│     }                                                           │
│                                                                 │
│  d) Enviar WhatsApp confirmacion                                │
│  e) Enviar Email confirmacion (NUEVO)                           │
│  f) Responder al frontend                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Implementacion del Tracking

### 4.1 GTM Data Layer (Cliente)

```javascript
// En el componente de reservas
// Paso 1: Ver clases
useEffect(() => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'view_classes',
    ecommerce: {
      items: clases.map(c => ({
        item_id: c.id,
        item_name: c.name,
        item_category: c.style,
        price: 0
      }))
    }
  });
}, [clases]);

// Paso 2: Seleccionar clase
const handleSelectClass = (clase) => {
  window.dataLayer.push({
    event: 'select_class',
    ecommerce: {
      items: [{
        item_id: clase.id,
        item_name: clase.name,
        item_category: clase.style,
        price: 0
      }]
    }
  });
};

// Paso 3: Enviar formulario
const handleSubmit = async (formData) => {
  // Generar event_id unico para deduplicacion
  const eventId = `reserva_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Trackear en cliente ANTES de enviar
  window.dataLayer.push({
    event: 'purchase',
    event_id: eventId,  // IMPORTANTE: mismo ID que CAPI
    ecommerce: {
      transaction_id: eventId,
      value: 0,
      currency: 'EUR',
      items: [{
        item_id: selectedClass.id,
        item_name: selectedClass.name,
        item_category: selectedClass.style,
        price: 0
      }]
    }
  });

  // Enviar al backend con datos de tracking
  const response = await fetch('/api/reservar', {
    method: 'POST',
    body: JSON.stringify({
      ...formData,
      sessionId: selectedClass.id,
      // Datos para CAPI
      eventId,
      fbc: getCookie('_fbc'),
      fbp: getCookie('_fbp'),
      userAgent: navigator.userAgent,
      sourceUrl: window.location.href
    })
  });
};

// Helper para obtener cookies de Facebook
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}
```

### 4.2 Backend CAPI (Servidor)

```typescript
// api/reservar/route.ts
import crypto from 'crypto';

const META_PIXEL_ID = '244157012706790';
const META_CAPI_TOKEN = 'aNLOP4N5gUHiO6IY8LyS9UECvoAZnRul';

// Funcion para hashear datos (requerido por Facebook)
function hashData(data: string): string {
  return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
}

export async function POST(request: Request) {
  const body = await request.json();
  const { sessionId, name, email, phone, eventId, fbc, fbp, userAgent, sourceUrl } = body;

  // ... crear booking en Momence ...
  // ... guardar en KV ...

  // ENVIAR A META CONVERSIONS API
  const eventTime = Math.floor(Date.now() / 1000);

  const capiPayload = {
    data: [{
      event_name: 'Purchase',
      event_time: eventTime,
      event_id: eventId,  // Mismo ID que cliente para deduplicar
      event_source_url: sourceUrl,
      action_source: 'website',
      user_data: {
        em: [hashData(email)],
        ph: [hashData(phone.replace(/\D/g, ''))],  // Solo numeros
        fn: [hashData(name.split(' ')[0])],        // Primer nombre
        ln: name.split(' ').length > 1 ? [hashData(name.split(' ').slice(1).join(' '))] : undefined,
        client_ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        client_user_agent: userAgent,
        fbc: fbc,
        fbp: fbp
      },
      custom_data: {
        value: 0,
        currency: 'EUR',
        content_type: 'product',
        content_ids: [sessionId],
        content_name: className,  // Nombre de la clase
        content_category: 'clase_bienvenida'
      }
    }]
  };

  // Enviar a Facebook
  try {
    const fbResponse = await fetch(
      `https://graph.facebook.com/v18.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(capiPayload)
      }
    );

    const fbResult = await fbResponse.json();
    console.log('Meta CAPI response:', fbResult);
  } catch (error) {
    console.error('Error enviando a Meta CAPI:', error);
    // No fallar la reserva por error de tracking
  }

  // ... enviar WhatsApp ...
  // ... enviar Email ...

  return Response.json({ success: true, bookingId: '...' });
}
```

### 4.3 Configuracion GTM

```
GTM Container: GTM-TT2V8Z4

TAGS A CREAR:
─────────────

1. Meta Pixel - Base
   Trigger: All Pages
   Tag: Custom HTML

   <script>
   !function(f,b,e,v,n,t,s)
   {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
   n.callMethod.apply(n,arguments):n.queue.push(arguments)};
   if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
   n.queue=[];t=b.createElement(e);t.async=!0;
   t.src=v;s=b.getElementsByTagName(e)[0];
   s.parentNode.insertBefore(t,s)}(window, document,'script',
   'https://connect.facebook.net/en_US/fbevents.js');
   fbq('init', '244157012706790');
   fbq('track', 'PageView');
   </script>

2. Meta Pixel - ViewContent
   Trigger: Custom Event = view_classes
   Tag: Custom HTML

   <script>
   fbq('track', 'ViewContent', {
     content_type: 'product',
     content_ids: {{DL - content_ids}},
     content_name: 'Clases disponibles'
   });
   </script>

3. Meta Pixel - InitiateCheckout
   Trigger: Custom Event = select_class
   Tag: Custom HTML

   <script>
   fbq('track', 'InitiateCheckout', {
     content_type: 'product',
     content_ids: {{DL - content_ids}},
     content_name: {{DL - content_name}},
     value: 0,
     currency: 'EUR'
   });
   </script>

4. Meta Pixel - Purchase
   Trigger: Custom Event = purchase
   Tag: Custom HTML

   <script>
   fbq('track', 'Purchase', {
     content_type: 'product',
     content_ids: {{DL - content_ids}},
     content_name: {{DL - content_name}},
     value: 0,
     currency: 'EUR',
     eventID: {{DL - event_id}}  // Para deduplicacion con CAPI
   });
   </script>

5. GA4 - Purchase
   Trigger: Custom Event = purchase
   Tag: GA4 Event
   Event Name: purchase
   Parameters from Data Layer

6. Google Ads Conversion
   Trigger: Custom Event = purchase
   Tag: Google Ads Conversion Tracking
   Conversion ID: [Tu conversion ID]
   Conversion Label: [Tu label]
```

---

## 5. UTM Tracking para Atribucion

### URLs de Campañas

```
FACEBOOK ADS:
https://farrayscenter.com/reservas?style=bachata
  &utm_source=facebook
  &utm_medium=cpc
  &utm_campaign=bachata_enero_2026
  &utm_content=video_testimonial
  &utm_term=bachata_barcelona

GOOGLE ADS:
https://farrayscenter.com/reservas?style=salsa
  &utm_source=google
  &utm_medium=cpc
  &utm_campaign=salsa_enero_2026
  &utm_content=responsive_search
  &utm_term=clases+salsa+barcelona

INSTAGRAM ORGANICO:
https://farrayscenter.com/reservas
  &utm_source=instagram
  &utm_medium=organic
  &utm_campaign=bio_link

EMAIL:
https://farrayscenter.com/reservas?style=heels
  &utm_source=email
  &utm_medium=newsletter
  &utm_campaign=heels_enero_2026
```

### Guardar UTMs en el Backend

```typescript
// En /api/reservar
const utmData = {
  source: body.utm_source,
  medium: body.utm_medium,
  campaign: body.utm_campaign,
  content: body.utm_content,
  term: body.utm_term
};

// Guardar en KV junto con la reserva
await kv.set(`reserva:${bookingId}`, {
  ...reservaData,
  tracking: {
    utm: utmData,
    fbc: body.fbc,
    fbp: body.fbp,
    referrer: request.headers.get('referer'),
    timestamp: Date.now()
  }
});
```

---

## 6. Email de Confirmacion

### Template de Email

```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ReservationEmailData {
  to: string;
  name: string;
  className: string;
  date: string;
  time: string;
  teacher: string;
  location: string;
  bookingId: string;
}

export async function sendConfirmationEmail(data: ReservationEmailData) {
  const { to, name, className, date, time, teacher, location, bookingId } = data;

  await resend.emails.send({
    from: 'Farray\'s Dance Center <reservas@farrayscenter.com>',
    to: [to],
    subject: `✅ Reserva confirmada: ${className}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">

        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://farrayscenter.com/logo.png" alt="Farray's" width="150">
        </div>

        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px;">¡Reserva Confirmada!</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Tu clase de bienvenida te espera</p>
        </div>

        <p style="font-size: 18px;">Hola <strong>${name}</strong>,</p>

        <p>Tu reserva ha sido confirmada. Aquí tienes los detalles:</p>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6;">
                <strong>💃 Clase</strong>
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6; text-align: right;">
                ${className}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6;">
                <strong>📅 Fecha</strong>
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6; text-align: right;">
                ${date}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6;">
                <strong>🕐 Hora</strong>
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6; text-align: right;">
                ${time}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6;">
                <strong>👨‍🏫 Profesor</strong>
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6; text-align: right;">
                ${teacher}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0;">
                <strong>📍 Ubicación</strong>
              </td>
              <td style="padding: 10px 0; text-align: right;">
                ${location}
              </td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://maps.app.goo.gl/xxx"
             style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
            📍 Ver en Google Maps
          </a>
        </div>

        <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 25px 0;">
          <h3 style="margin: 0 0 10px; color: #856404;">Recuerda traer:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #856404;">
            <li>Ropa cómoda y ligera</li>
            <li>Zapatos de baile o bambas cómodas</li>
            <li>Botella de agua</li>
            <li>¡Muchas ganas de bailar!</li>
          </ul>
        </div>

        <p style="color: #6c757d; font-size: 14px;">
          ¿Necesitas cancelar o cambiar tu reserva?
          <a href="mailto:info@farrayscenter.com?subject=Cancelar reserva ${bookingId}">Contáctanos</a>
        </p>

        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">

        <div style="text-align: center; color: #6c757d; font-size: 14px;">
          <p>
            <strong>Farray's International Dance Center</strong><br>
            C/ Llull 48, Barcelona<br>
            <a href="tel:+34931234567">+34 931 234 567</a> |
            <a href="mailto:info@farrayscenter.com">info@farrayscenter.com</a>
          </p>
          <p>
            <a href="https://instagram.com/farrays">Instagram</a> |
            <a href="https://facebook.com/farrays">Facebook</a> |
            <a href="https://farrayscenter.com">Web</a>
          </p>
        </div>

      </body>
      </html>
    `
  });
}
```

---

## 7. Variables de Entorno Actualizadas

```env
# Momence OAuth2
MOMENCE_CLIENT_ID="..."
MOMENCE_CLIENT_SECRET="..."
MOMENCE_USERNAME="..."
MOMENCE_PASSWORD="..."

# Meta (Facebook)
META_PIXEL_ID="244157012706790"
META_CAPI_TOKEN="aNLOP4N5gUHiO6IY8LyS9UECvoAZnRul"

# Google
GTM_ID="GTM-TT2V8Z4"
GA4_MEASUREMENT_ID="G-XXXXXXX"
GOOGLE_ADS_CONVERSION_ID="AW-XXXXXXX"
GOOGLE_ADS_CONVERSION_LABEL="XXXXXXX"

# WhatsApp
WHATSAPP_PHONE_NUMBER_ID="..."
WHATSAPP_TOKEN="..."

# Email (Resend - gratuito 3000 emails/mes)
RESEND_API_KEY="re_xxxxx"

# Vercel KV
KV_URL="..."
KV_REST_API_URL="..."
KV_REST_API_TOKEN="..."
```

---

## 8. Verificacion del Tracking

### Facebook Events Manager

```
1. Ir a: business.facebook.com/events_manager
2. Seleccionar Pixel 244157012706790
3. Pestaña "Test Events"
4. Verificar que aparezcan:
   - PageView (client)
   - ViewContent (client)
   - InitiateCheckout (client)
   - Purchase (client + server)

5. En "Overview" ver:
   - Event Match Quality > 6.0 (objetivo: 8.0+)
   - Deduplicated events (deben coincidir client/server)
```

### Google Tag Assistant

```
1. Instalar extension Tag Assistant
2. Ir a farrayscenter.com/reservas
3. Verificar que disparen:
   - GTM container loaded
   - GA4 page_view
   - Meta Pixel PageView

4. Hacer reserva de prueba
5. Verificar evento purchase
```

---

## 9. Resumen Ejecutivo

### Que Consigues con Este Sistema

| Aspecto | Sin CAPI | Con CAPI |
|---------|----------|----------|
| Conversiones detectadas | ~60% | ~95% |
| iOS 14+ tracking | Bloqueado | Funciona |
| Event Match Quality | 3-4 | 7-9 |
| Optimizacion Facebook | Limitada | Optima |
| Atribucion precisa | Parcial | Completa |

### Flujo Completo de una Reserva

```
1. Usuario ve anuncio en Facebook/Instagram
2. Click → llega a /reservas?utm_source=facebook...
3. GTM: PageView + ViewContent
4. Selecciona clase → InitiateCheckout
5. Rellena form → AddPaymentInfo
6. Click reservar:
   a. Cliente: fbq('Purchase') + gtag('purchase')
   b. Servidor: CAPI Purchase + Momence + WhatsApp + Email
7. Facebook recibe 2 eventos Purchase con mismo event_id
8. Facebook deduplica → cuenta 1 conversion
9. Facebook tiene datos completos para optimizar
10. Tu anuncio mejora su performance automaticamente
```

---

**Documento creado:** Enero 2026
**Sistema:** Enterprise-level tracking para Facebook Ads, Google Ads y Analytics
