# 🎨 Guía Visual: Integración del Widget de Reserva

> **Todas las formas de integrar el formulario en tus landings**
> Fecha: Enero 2026

---

## 📋 Resumen Rápido

**Pregunta:** ¿Cómo integrar el formulario en cada landing?

**Respuesta:** Tienes un **componente widget reutilizable** que puedes usar de 3 formas:

1. **Modal (botón)** → Click abre formulario en overlay ⭐ RECOMENDADO
2. **Inline** → Formulario embebido directamente en la página
3. **Sticky** → Botón flotante siempre visible

---

## 🎯 Opción 1: Widget Modal (Recomendada)

### **Concepto Visual:**

```
┌─────────────────────────────────────────────────┐
│  Landing Page - Salsa Cubana                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  🌟 HERO SECTION                                │
│                                                 │
│  "Aprende Salsa Cubana con Yunaisy Farray"     │
│                                                 │
│  ┌──────────────────────────────┐              │
│  │  🎵 Reserva Clase Gratis  ◄──┼─── CLICK     │
│  └──────────────────────────────┘              │
│                     │                           │
│                     ▼                           │
│  ┌────────────────────────────────────────┐    │
│  │ MODAL (overlay con fondo oscuro)       │    │
│  │ ┌────────────────────────────────────┐ │    │
│  │ │  X  Reserva tu Clase              │ │    │
│  │ ├────────────────────────────────────┤ │    │
│  │ │                                    │ │    │
│  │ │  Nombre: [____________]            │ │    │
│  │ │  Email:  [____________]            │ │    │
│  │ │  WhatsApp: [__________]            │ │    │
│  │ │  Clase: [▼ Salsa Cubana ✓]        │ │    │
│  │ │                                    │ │    │
│  │ │  [Reservar Clase Gratis]           │ │    │
│  │ │                                    │ │    │
│  │ └────────────────────────────────────┘ │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  📋 BENEFICIOS                                  │
│  💃 Método Farray®                              │
│  🏆 Got Talent España                           │
│                                                 │
│  ┌──────────────────────────────┐              │
│  │  Reservar Ahora           ◄──┼─── OTRO CTA  │
│  └──────────────────────────────┘              │
│                                                 │
└─────────────────────────────────────────────────┘
```

### **Código (3 líneas):**

```tsx
import WidgetReserva from '@/components/WidgetReserva';

<WidgetReserva
  variant="button"
  buttonText="🎵 Reserva Clase Gratis"
  preSelectedClass="salsa-cubana"
  source="landing-salsa-hero"
/>;
```

### **Ventajas:**

✅ **No interrumpe lectura** - Usuario decide cuándo abrir
✅ **Limpio** - No ocupa espacio en la página
✅ **Rápido** - Lazy load, solo carga al abrir
✅ **Multi-uso** - Múltiples botones, un solo modal
✅ **Mobile friendly** - Se adapta perfecto a móvil

### **Cuándo usar:**

- Hero sections
- CTAs en medio de contenido
- Footer
- Cards de clases
- Testimonios

---

## 📄 Opción 2: Inline (Embebido)

### **Concepto Visual:**

```
┌─────────────────────────────────────────────────┐
│  /es/reservar-clase                             │
├─────────────────────────────────────────────────┤
│                                                 │
│  🎵 Reserva tu Clase de Prueba                  │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  FORMULARIO (siempre visible)           │   │
│  │                                          │   │
│  │  Nombre: [____________________________] │   │
│  │                                          │   │
│  │  Email:  [____________________________] │   │
│  │                                          │   │
│  │  WhatsApp: [__________________________] │   │
│  │                                          │   │
│  │  Tipo de clase:                          │   │
│  │  ○ Salsa Cubana - Lunes 19:00h          │   │
│  │  ○ Bachata Sensual - Martes 20:00h      │   │
│  │  ○ Kizomba - Sábado 18:00h              │   │
│  │                                          │   │
│  │  Nivel:                                  │   │
│  │  ○ Principiante ● Intermedio ○ Avanzado │   │
│  │                                          │   │
│  │  ☑ Acepto términos y condiciones        │   │
│  │                                          │   │
│  │  ┌──────────────────────────────────┐   │   │
│  │  │  🎵 Reservar Clase Gratis         │   │   │
│  │  └──────────────────────────────────┘   │   │
│  │                                          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  🔒 Trust badges                                │
│  ✅ Datos seguros • ⚡ Confirmación instant.    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### **Código:**

```tsx
<WidgetReserva variant="inline" source="page-reservar-clase" />
```

### **Ventajas:**

✅ **No requiere click** - Formulario ya visible
✅ **SEO friendly** - Contenido indexable
✅ **Conversión directa** - Menos fricción
✅ **Carga inmediata** - No espera interacción

### **Cuándo usar:**

- Página dedicada `/reservar-clase`
- Landing pages de conversión alta
- Campañas de Google Ads (destino directo)

---

## 📌 Opción 3: Sticky Button (Flotante)

### **Concepto Visual:**

```
┌─────────────────────────────────────────────────┐
│  Cualquier Página                               │
│                                                 │
│  Contenido...                                   │
│  Contenido...                                   │
│  Contenido...                                   │
│                                                 │
│  Usuario hace scroll ↓                          │
│                                                 │
│  Contenido...                                   │
│  Contenido...                   ┌─────────────┐ │
│                                 │  📅 Reserva │◄┼─ STICKY
│  Contenido...                   │  Ahora      │ │  (siempre
│  Contenido...                   └─────────────┘ │   visible)
│                                        ▲        │
│  Contenido...                          │        │
│                                   Flotante,     │
│                                   esquina       │
│                                   inferior      │
│                                   derecha       │
│                                                 │
└─────────────────────────────────────────────────┘

Click → Abre modal (Opción 1)
```

### **Código:**

```tsx
// src/App.tsx

import StickyReservaButton from '@/components/StickyReservaButton';

function App() {
  return (
    <>
      <Routes>{/* Todas tus rutas */}</Routes>

      {/* Sticky button en TODAS las páginas */}
      <StickyReservaButton />
    </>
  );
}
```

### **Ventajas:**

✅ **Siempre accesible** - En cualquier momento
✅ **No invasivo** - Pequeño, en esquina
✅ **Alta conversión** - Recordatorio constante
✅ **Cross-page** - Funciona en todas las páginas

### **Cuándo usar:**

- Globalmente (todas las páginas)
- Después de scroll de 300px
- Móvil (más importante que en desktop)

---

## 🎨 Comparación Visual: 3 Opciones Juntas

```
┌──────────────────────────────────────────────────────────────┐
│  HOME PAGE - Farray's Dance Center                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  🌟 HERO                                                     │
│  ┌────────────────┐                                         │
│  │ [Modal Widget] │ ◄── Opción 1: Botón que abre modal     │
│  └────────────────┘                                         │
│                                                              │
│  ═══════════════════════════════════════════════════        │
│                                                              │
│  💃 CLASES                                                   │
│  Card Salsa     Card Bachata    Card Kizomba                │
│  [Probar] ◄─── Opción 1 (cada card)                         │
│                                                              │
│  ═══════════════════════════════════════════════════        │
│                                                              │
│  📋 FORMULARIO EMBEBIDO                                      │
│  ┌────────────────────────────────────────────┐             │
│  │  [Nombre]  [Email]  [WhatsApp]            │ ◄── Opción 2│
│  │  [Clase] [Nivel] [Reservar]               │     (Inline) │
│  └────────────────────────────────────────────┘             │
│                                                              │
│  ═══════════════════════════════════════════════════        │
│                                                    ┌───────┐ │
│  🎵 FOOTER                                         │ 📅    │ │
│  ┌────────────────┐                               │ Reserva│◄┼ Opción 3
│  │ [Modal Widget] │ ◄── Opción 1                  │ Ahora │ │ (Sticky)
│  └────────────────┘                               └───────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Estrategia Recomendada para Farray's

### **Configuración Óptima:**

```
1. GLOBAL (todas las páginas):
   └─ Sticky Button (Opción 3) - Siempre visible después de scroll

2. HOME:
   ├─ Hero: Modal Widget (Opción 1) - CTA principal
   ├─ Clases Grid: Modal Widget x3 (Opción 1) - Botón por clase
   └─ Footer: Modal Widget (Opción 1) - CTA final

3. LANDINGS (salsa, bachata, kizomba...):
   ├─ Hero: Modal Widget (Opción 1) - Pre-selección de clase
   ├─ Beneficios: Modal Widget (Opción 1)
   └─ Footer: Modal Widget (Opción 1)

4. /reservar-clase:
   └─ Inline (Opción 2) - Formulario completo embebido

5. BLOG POSTS:
   └─ Solo Sticky Button (Opción 3) - No interrumpir lectura
```

---

## 📊 Tracking: Saber Qué CTA Convierte Mejor

Cada widget tiene parámetro `source` para analytics:

```tsx
// Hero
<WidgetReserva source="home-hero" />

// Card de Salsa
<WidgetReserva source="card-salsa" />

// Footer
<WidgetReserva source="home-footer" />
```

**En Google Analytics verás:**

```
Conversiones por Source:
├─ home-hero: 45 reservas (32%)
├─ card-salsa: 28 reservas (20%)
├─ home-footer: 18 reservas (13%)
├─ sticky-button: 50 reservas (35%)
└─ Total: 141 reservas
```

**Decisión:** Priorizar sticky button y hero (conviertenmas).

---

## 💻 Código Completo: Ejemplo Landing Salsa

```tsx
// src/pages/SalsaCubanaLanding.tsx

import WidgetReserva from '@/components/WidgetReserva';

export default function SalsaCubanaLanding() {
  return (
    <div>
      {/* HERO con video background */}
      <section className="hero-video relative min-h-screen">
        <video autoPlay loop muted className="absolute inset-0 object-cover opacity-40">
          <source src="/videos/salsa-demo.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="holographic-text-subtle text-6xl font-bold mb-6">Salsa Cubana</h1>
          <p className="text-2xl text-white mb-8">
            Aprende con Yunaisy Farray, finalista de Got Talent España
          </p>

          {/* CTA PRINCIPAL - Modal Widget */}
          <WidgetReserva
            variant="button"
            size="lg"
            buttonText="🎵 Clase de Prueba GRATIS"
            preSelectedClass="salsa-cubana"
            source="landing-salsa-hero"
          />

          <p className="text-white/70 mt-4">
            Sin compromiso • Sin matrícula • Confirmación por WhatsApp
          </p>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">¿Por qué Salsa Cubana?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-4">💃</div>
              <h3 className="text-xl font-bold mb-2">Técnica Única</h3>
              <p className="text-gray-600">
                Método Farray® fusiona disciplina rusa con sabor cubano
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-2">Internacional</h3>
              <p className="text-gray-600">Aprende el estilo más popular del mundo</p>
            </div>

            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold mb-2">Ambiente</h3>
              <p className="text-gray-600">Grupo multicultural y divertido</p>
            </div>
          </div>

          {/* CTA SECUNDARIO - Modal Widget */}
          <div className="text-center mt-12">
            <WidgetReserva
              variant="button"
              size="md"
              preSelectedClass="salsa-cubana"
              source="landing-salsa-beneficios"
            />
          </div>
        </div>
      </section>

      {/* HORARIOS */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Horarios Disponibles</h2>

          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">Lunes 19:00 - 20:30</h3>
                  <p className="text-gray-600">Salsa Cubana - Principiantes</p>
                </div>
                <WidgetReserva
                  variant="button"
                  size="sm"
                  buttonText="Reservar"
                  preSelectedClass="salsa-cubana"
                  source="landing-salsa-horario-lunes"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">Miércoles 20:30 - 22:00</h3>
                  <p className="text-gray-600">Salsa Cubana - Intermedio</p>
                </div>
                <WidgetReserva
                  variant="button"
                  size="sm"
                  buttonText="Reservar"
                  preSelectedClass="salsa-cubana"
                  source="landing-salsa-horario-miercoles"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-900 to-pink-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">¿Lista para empezar?</h2>
          <p className="text-xl mb-8 opacity-90">
            Reserva tu clase de prueba gratis y descubre tu pasión
          </p>

          <WidgetReserva
            variant="button"
            size="lg"
            buttonText="🎵 Reserva tu Plaza Ahora"
            preSelectedClass="salsa-cubana"
            source="landing-salsa-footer"
          />

          <p className="text-sm mt-4 opacity-70">📱 Confirmación inmediata por WhatsApp</p>
        </div>
      </section>
    </div>
  );
}
```

**Resultado:**

- 4 CTAs (hero, beneficios, horarios x2, footer)
- Todos pre-seleccionan "Salsa Cubana"
- Tracking individual por sección
- - Sticky button global

---

## 📱 Mobile vs Desktop

### **Desktop:**

```
┌─────────────────────────────────────┐
│  Modal aparece centrado             │
│  ┌───────────────────────────────┐  │
│  │  Formulario (max-width 600px) │  │
│  │  Altura: Auto                 │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### **Mobile:**

```
┌───────────────┐
│  Modal ocupa  │
│  90% pantalla │
│  ┌─────────┐  │
│  │ X       │  │
│  ├─────────┤  │
│  │ Form    │  │
│  │ [____]  │  │
│  │ [____]  │  │
│  │ Scroll  │  │
│  │ vertical│  │
│  │ [Enviar]│  │
│  └─────────┘  │
└───────────────┘
```

---

## ✅ Checklist de Implementación

### **Paso 1: Copiar archivos**

- [ ] `src/components/WidgetReserva.tsx`
- [ ] `src/components/FormularioReserva.tsx` (versión actualizada)
- [ ] `src/components/StickyReservaButton.tsx` (opcional)

### **Paso 2: Añadir a landings**

- [ ] Home: Hero CTA
- [ ] Home: Cards de clases
- [ ] Home: Footer CTA
- [ ] Landing Salsa: Multiple CTAs
- [ ] Landing Bachata: Multiple CTAs
- [ ] /reservar-clase: Inline form

### **Paso 3: Configurar Sticky (opcional)**

- [ ] Añadir StickyReservaButton a App.tsx
- [ ] Configurar scroll threshold (300px recomendado)
- [ ] Testear en mobile

### **Paso 4: Testing**

- [ ] Desktop: Modal se abre/cierra correctamente
- [ ] Mobile: Modal responsive
- [ ] Pre-selección funciona
- [ ] Tracking Analytics funciona
- [ ] Confirmación WhatsApp llega

---

## 🎯 Resumen Final

**Pregunta original:** ¿Cómo lo integrarías en cada landing? ¿Sería como un widget aparte?

**Respuesta:**

✅ **SÍ, es un widget reutilizable**
✅ **3 líneas de código** en cualquier landing
✅ **3 variantes** (modal, inline, sticky)
✅ **Pre-selección** de clase por landing
✅ **Tracking** por fuente para optimizar
✅ **Mobile-first** y ultra responsive

**Implementación más común:**

```tsx
<WidgetReserva
  variant="button"
  buttonText="🎵 Reserva Clase Gratis"
  preSelectedClass="salsa-cubana"
  source="landing-salsa-hero"
/>
```

**Eso es todo.** Copias, pegas, personalizas. 🚀

---

¿Quieres que implemente esto en tus landings actuales? 💪
