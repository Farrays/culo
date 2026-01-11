# 🎨 Ejemplos de Uso: Widget de Reserva en Landings

> **Cómo integrar el formulario en cualquier página**
> Fecha: Enero 2026

---

## 📋 Índice

1. [Widget Modal (Recomendado)](#1-widget-modal-recomendado)
2. [Botón Flotante Sticky](#2-botón-flotante-sticky)
3. [Sección Inline](#3-sección-inline)
4. [Exit Intent Popup](#4-exit-intent-popup)
5. [Hero CTA](#5-hero-cta)
6. [Cards con Reserva Rápida](#6-cards-con-reserva-rápida)

---

## 1. Widget Modal (Recomendado) ⭐

### **Ejemplo: Landing de Salsa Cubana**

```tsx
// src/pages/SalsaCubanaLanding.tsx

import WidgetReserva from '../components/WidgetReserva';

export default function SalsaCubanaLanding() {
  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero bg-gradient-to-r from-purple-900 to-pink-900">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="holographic-text text-5xl font-bold mb-6">
            Aprende Salsa Cubana con Yunaisy Farray
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Finalista de Got Talent España • Actriz en Street Dance 2
          </p>

          {/* WIDGET MODAL - Botón grande */}
          <WidgetReserva
            variant="button"
            size="lg"
            buttonText="🎵 Clase de Prueba GRATIS"
            preSelectedClass="salsa-cubana"
            source="landing-salsa-hero"
            className="mb-4"
          />

          <p className="text-sm text-white/70">Sin compromiso • Sin matrícula • Plazas limitadas</p>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué aprender con nosotros?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">👑</div>
              <h3 className="font-bold mb-2">Método Farray®</h3>
              <p className="text-gray-600">
                Técnica única que fusiona disciplina rusa con ritmos afrocubanos
              </p>
            </div>

            {/* Más beneficios... */}
          </div>

          {/* OTRO CTA */}
          <div className="text-center mt-12">
            <WidgetReserva
              variant="button"
              size="md"
              source="landing-salsa-beneficios"
              preSelectedClass="salsa-cubana"
            />
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="bg-purple-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Lista para bailar?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Reserva tu clase de prueba gratis y descubre tu pasión
          </p>

          <WidgetReserva
            variant="button"
            size="lg"
            source="landing-salsa-footer"
            preSelectedClass="salsa-cubana"
          />
        </div>
      </section>
    </div>
  );
}
```

**Resultado:**

- ✅ 3 botones CTA en diferentes secciones
- ✅ Todos abren el mismo modal
- ✅ Pre-seleccionan "Salsa Cubana"
- ✅ Tracking por sección (hero, beneficios, footer)

---

## 2. Botón Flotante Sticky 🎯

### **Sticky Widget (siempre visible)**

```tsx
// src/components/StickyReservaButton.tsx

import { useState, useEffect } from 'react';
import WidgetReserva from './WidgetReserva';

export default function StickyReservaButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar después de scroll 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-bounce-slow">
      <WidgetReserva
        variant="button"
        size="lg"
        buttonText="📅 Reserva Ahora"
        source="sticky-button"
        className="shadow-2xl"
      />
    </div>
  );
}
```

**Uso en App.tsx:**

```tsx
// src/App.tsx

import StickyReservaButton from './components/StickyReservaButton';

function App() {
  return (
    <Router>
      <Routes>{/* Todas tus rutas... */}</Routes>

      {/* STICKY BUTTON EN TODAS LAS PÁGINAS */}
      <StickyReservaButton />
    </Router>
  );
}
```

**Resultado:**

- ✅ Botón flotante en esquina inferior derecha
- ✅ Aparece después de scroll
- ✅ Visible en TODAS las páginas
- ✅ Siempre accesible

---

## 3. Sección Inline 📄

### **Formulario embebido en la página**

```tsx
// src/pages/ReservarClase.tsx

import WidgetReserva from '../components/WidgetReserva';

export default function ReservarClasePage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="holographic-text text-4xl font-bold mb-4">Reserva tu Clase de Prueba</h1>
          <p className="text-xl text-gray-600">100% gratis • Sin compromiso • Plazas limitadas</p>
        </div>

        {/* FORMULARIO INLINE (sin modal) */}
        <WidgetReserva variant="inline" source="page-reservar-clase" />

        {/* TRUST BADGES */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl mb-2">🔒</div>
            <p className="font-semibold">Datos Seguros</p>
            <p className="text-sm text-gray-500">Encriptación SSL</p>
          </div>
          <div>
            <div className="text-3xl mb-2">⚡</div>
            <p className="font-semibold">Confirmación Instantánea</p>
            <p className="text-sm text-gray-500">WhatsApp + Email</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🎁</div>
            <p className="font-semibold">100% Gratis</p>
            <p className="text-sm text-gray-500">Sin matrícula</p>
          </div>
        </div>
      </div>
    </main>
  );
}
```

**Resultado:**

- ✅ Formulario siempre visible
- ✅ No requiere click para abrir
- ✅ Ideal para página dedicada `/reservar-clase`

---

## 4. Exit Intent Popup 🚪

### **Modal que aparece cuando usuario va a salir**

```tsx
// src/components/ExitIntentReserva.tsx

import { useState, useEffect } from 'react';
import WidgetReserva from './WidgetReserva';

export default function ExitIntentReserva() {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Detectar cuando mouse sale por arriba (cerrar pestaña)
      if (e.clientY <= 0 && !hasShown) {
        setShowExitIntent(true);
        setHasShown(true);

        // Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'exit_intent_triggered');
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  if (!showExitIntent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 animate-slideUp">
        {/* Close button */}
        <button
          onClick={() => setShowExitIntent(false)}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">⏳</div>
          <h2 className="text-3xl font-bold mb-2">¡Espera!</h2>
          <p className="text-xl text-gray-600">Antes de irte, ¿quieres probar una clase GRATIS?</p>
        </div>

        {/* Inline form */}
        <WidgetReserva variant="inline" source="exit-intent-popup" />

        <p className="text-center text-sm text-gray-500 mt-4">
          💜 Sin compromiso • Cancela cuando quieras
        </p>
      </div>
    </div>
  );
}
```

**Uso:**

```tsx
// src/App.tsx

import ExitIntentReserva from './components/ExitIntentReserva';

function App() {
  return (
    <>
      {/* Tu contenido... */}

      {/* Exit Intent solo en páginas específicas */}
      <ExitIntentReserva />
    </>
  );
}
```

**Resultado:**

- ✅ Aparece cuando usuario va a cerrar pestaña
- ✅ Solo se muestra 1 vez por sesión
- ✅ Útil para recuperar usuarios que se van sin reservar

---

## 5. Hero CTA (Multiple Variants) 🎨

### **Hero con múltiples opciones de reserva**

```tsx
// src/components/HeroWithReserva.tsx

import WidgetReserva from './WidgetReserva';

export default function HeroWithReserva() {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background video/image */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted className="w-full h-full object-cover opacity-40">
          <source src="/videos/hero-dance.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="holographic-text-subtle text-6xl font-bold mb-6">
          Descubre tu Pasión por el Baile
        </h1>
        <p className="text-2xl text-white mb-12">
          Clases de Salsa, Bachata, Kizomba y más en Barcelona
        </p>

        {/* PRIMARY CTA - Modal */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <WidgetReserva
            variant="button"
            size="lg"
            buttonText="🎵 Reserva Clase Gratis"
            source="hero-primary-cta"
          />

          {/* SECONDARY CTA - Link style */}
          <WidgetReserva
            variant="link"
            buttonText="Ver Horarios y Precios →"
            source="hero-secondary-cta"
          />
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap gap-6 justify-center items-center mt-12 text-white/80">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span>4.9/5 en Google</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">👥</span>
            <span>+500 alumnos</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <span>Finalista Got Talent</span>
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## 6. Cards con Reserva Rápida 🎴

### **Grid de clases con botón de reserva individual**

```tsx
// src/components/ClasesGrid.tsx

import WidgetReserva from './WidgetReserva';

const CLASES = [
  {
    id: 'salsa-cubana',
    nombre: 'Salsa Cubana',
    icono: '💃',
    descripcion: 'Ritmo, sabor y técnica cubana auténtica',
    nivel: 'Todos los niveles',
    horarios: 'Lun, Mié, Vie 19:00h',
  },
  {
    id: 'bachata-sensual',
    nombre: 'Bachata Sensual',
    icono: '🕺',
    descripcion: 'Conexión, musicalidad y elegancia',
    nivel: 'Principiante a Avanzado',
    horarios: 'Mar, Jue 20:00h',
  },
  {
    id: 'kizomba',
    nombre: 'Kizomba',
    icono: '🎵',
    descripcion: 'El baile más sensual de África',
    nivel: 'Todos los niveles',
    horarios: 'Sáb 18:00h',
  },
];

export default function ClasesGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Nuestras Clases</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {CLASES.map(clase => (
            <div
              key={clase.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              {/* Card header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white text-center">
                <div className="text-6xl mb-3">{clase.icono}</div>
                <h3 className="text-2xl font-bold">{clase.nombre}</h3>
              </div>

              {/* Card body */}
              <div className="p-6">
                <p className="text-gray-600 mb-4">{clase.descripcion}</p>

                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">📊 Nivel:</span>
                    <span>{clase.nivel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">🕐 Horarios:</span>
                    <span>{clase.horarios}</span>
                  </div>
                </div>

                {/* CTA específico para esta clase */}
                <WidgetReserva
                  variant="button"
                  size="md"
                  buttonText="Probar Gratis"
                  preSelectedClass={clase.id}
                  source={`card-${clase.id}`}
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Resultado:**

- ✅ Cada card tiene su botón de reserva
- ✅ Pre-selecciona la clase específica
- ✅ Tracking individual por clase

---

## 🎨 Resumen: Cuándo Usar Cada Opción

| Tipo              | Uso Recomendado                   | Ventajas                            | Desventajas         |
| ----------------- | --------------------------------- | ----------------------------------- | ------------------- |
| **Widget Modal**  | Landing pages, secciones con CTAs | No interrumpe lectura, limpio       | Requiere click      |
| **Sticky Button** | Todas las páginas                 | Siempre visible, no invasivo        | Ocupa espacio       |
| **Inline**        | Página dedicada `/reservar-clase` | Carga rápida, no requiere click     | Ocupa mucho espacio |
| **Exit Intent**   | Landing de alta conversión        | Recupera usuarios que se van        | Puede molestar      |
| **Hero CTA**      | Home, landings principales        | Primera impresión, alta visibilidad | Uno solo            |
| **Cards Grid**    | Página de clases                  | Personalizado por clase             | Múltiples modales   |

---

## 📊 Combinación Recomendada para Farray's

### **Estrategia Multi-Canal:**

```
Home Page:
├─ Hero: Widget Modal (principal)
├─ Clases Grid: Cards con widget individual
├─ Footer: Widget Modal
└─ Sticky Button: Siempre visible

Landing Salsa:
├─ Hero: Widget Modal (pre-selección Salsa)
├─ Beneficios: Widget Modal
├─ Footer: Widget Modal
└─ Exit Intent: Solo si no ha reservado

/reservar-clase:
└─ Inline: Formulario completo embebido

Todas las páginas:
└─ Sticky Button: Botón flotante global
```

---

## 💻 Código de Integración Rápida

### **En cualquier landing, solo añadir:**

```tsx
import WidgetReserva from '@/components/WidgetReserva';

// Dentro del JSX, donde quieras un CTA:
<WidgetReserva
  variant="button"
  size="lg"
  buttonText="🎵 Tu texto aquí"
  preSelectedClass="salsa-cubana" // opcional
  source="nombre-de-tracking"
/>;
```

**Eso es todo.** 3 líneas de código.

---

## 🎯 Ventajas de Este Sistema

✅ **Reutilizable** - Un componente, infinitos usos
✅ **Consistente** - Mismo diseño en todas las páginas
✅ **Tracking** - Sabes qué CTA convierte mejor
✅ **Performance** - Lazy load, solo carga cuando se abre
✅ **Responsive** - Funciona perfecto en móvil
✅ **Accesible** - WCAG 2.1 compliant
✅ **SEO friendly** - No bloquea contenido

---

## 📱 Mobile First

El widget está optimizado para móvil:

- Modal ocupa 90% de pantalla en mobile
- Sticky button más grande en táctil
- Formulario responsive
- Touch-friendly (botones grandes)

---

## 🔧 Personalización

Puedes customizar fácilmente:

```tsx
// Colores personalizados
<WidgetReserva
  variant="button"
  className="bg-red-600 hover:bg-red-700" // Rojo en vez de purple
/>

// Tamaño custom
<WidgetReserva
  size="lg"
  className="px-12 py-6" // Extra grande
/>

// Texto personalizado por idioma
<WidgetReserva
  buttonText={t('cta.reserva')} // i18n
/>
```

---

## 🚀 Próximos Pasos

1. **Copiar** `src-components-WidgetReserva.tsx` a tu proyecto
2. **Importar** en tus landing pages
3. **Añadir** donde quieras CTAs de reserva
4. **Testear** conversión por fuente (Analytics)
5. **Optimizar** CTAs que mejor convierten

---

¿Quieres que implemente alguna de estas opciones específicamente en tus landings actuales? 🎨
