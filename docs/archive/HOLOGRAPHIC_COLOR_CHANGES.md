# Cambios de Color Holográfico - Documentación

> **Estado actual:** Efecto 3D Sutil aplicado (Opción 1)
> **Fecha:** Enero 2025

---

## CONFIGURACIÓN ACTIVA (3D Sutil)

```css
/* index.css - Versión ACTUAL */
.holographic-text {
  color: white;
  text-shadow:
    1px 1px 0 #c82260,
    2px 2px 0 #a01d4d,
    3px 3px 3px rgba(0, 0, 0, 0.3);
}
```

**Características:**

- 3 capas de sombra (vs 7 del holográfico original)
- Efecto de profundidad 3D hacia abajo-derecha
- Color rosa degradado (#c82260 → #a01d4d)
- Sombra suave negra al final para profundidad
- Mejor rendimiento que el efecto holográfico
- 100% legible en todos los dispositivos

---

## Resumen del Problema

El texto holográfico con la clase `.holographic-text` tiene **7 capas de text-shadow** que:

- En textos grandes SIN `font-bold` → se ve bien (ej: "Y hay quienes buscan la escuela que siempre soñaron")
- En textos CON `font-bold` → se ve difuminado y poco legible (ej: "Como no sabíamos que era imposible, lo hicimos")

### Causa Raíz

Cuando aplicas `font-bold` a un texto con múltiples `text-shadow`, el texto grueso hace que las sombras se superpongan más intensamente, creando un efecto de "halo" excesivo.

---

## Configuración Original (7 capas)

```css
/* index.css - Versión ORIGINAL */
.holographic-text {
  color: white;
  text-shadow:
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 20px #c82260,
    0 0 30px #c82260,
    0 0 40px #c82260,
    0 0 55px #c82260,
    0 0 75px #c82260;
}
```

**Características:**

- 7 capas de sombra
- 2 capas blancas (#fff) para brillo interior
- 5 capas rosa (#c82260) para efecto holográfico
- Máximo impacto visual
- Puede ser ilegible con `font-bold`

---

## Variantes Probadas

### 1. Holographic Subtle (6 capas - RECOMENDADA)

```css
.holographic-text-subtle {
  color: white;
  text-shadow:
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 15px rgba(200, 34, 96, 0.9),
    0 0 25px rgba(200, 34, 96, 0.7),
    0 0 35px rgba(200, 34, 96, 0.5),
    0 0 45px rgba(200, 34, 96, 0.3);
}
```

**Características:**

- 6 capas de sombra
- Opacidades optimizadas para legibilidad
- Balance entre impacto visual y claridad
- Funciona bien con y sin `font-bold`

### 2. Holographic Minimal (2 capas - casi imperceptible)

```css
.holographic-text-minimal {
  color: white;
  text-shadow:
    0 0 2px rgba(255, 255, 255, 0.3),
    0 0 5px rgba(200, 34, 96, 0.2);
}
```

**Características:**

- Apenas visible
- Máxima legibilidad
- Mínimo impacto visual

### 3. Sin Efecto (máximo rendimiento)

```css
.holographic-text-clean {
  color: white;
  font-weight: 700;
  /* Sin text-shadow = mejor performance */
}
```

**Características:**

- 0 cálculos de text-shadow
- Rendering instantáneo
- Mejor performance en scroll
- FPS más estables
- Sin efecto holográfico

---

## Tabla Comparativa de Rendimiento

| Variante   | Capas | Paint Time | Legibilidad | Impacto Visual |
| ---------- | ----- | ---------- | ----------- | -------------- |
| Original   | 7     | ~100%      | 7/10        | 10/10          |
| Subtle     | 6     | ~80%       | 9/10        | 8/10           |
| Minimal    | 2     | ~30%       | 10/10       | 3/10           |
| Sin efecto | 0     | ~0%        | 10/10       | 0/10           |

---

## Cómo Aplicar Cambios a Toda la Web

### Script Node.js para reemplazo masivo

```javascript
// replace-holographic.mjs
import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

const files = globSync('**/*.{tsx,ts,jsx,js}', {
  ignore: ['node_modules/**', 'dist/**', '.git/**'],
});

let totalReplacements = 0;

files.forEach(file => {
  let content = readFileSync(file, 'utf8');
  const originalContent = content;

  // Reemplazar holographic-text con holographic-text-subtle
  content = content.replace(/\bholographic-text(?!-subtle)(?=["'\s}])/g, 'holographic-text-subtle');

  if (content !== originalContent) {
    const matches = (originalContent.match(/\bholographic-text(?!-subtle)(?=["'\s}])/g) || [])
      .length;
    totalReplacements += matches;
    console.log(`✓ ${file}: ${matches} replacement(s)`);
    writeFileSync(file, content, 'utf8');
  }
});

console.log(`\n✅ Total: ${totalReplacements} replacements`);
```

**Ejecutar:** `node replace-holographic.mjs`

**Resultado esperado:** ~360 reemplazos en ~75 archivos

---

## Commits de Referencia

| Commit    | Descripción                                       |
| --------- | ------------------------------------------------- |
| `7f0ca14` | Versión original con holographic-text (7 capas)   |
| `b9f954a` | Añadida clase holographic-text-subtle (6 capas)   |
| `18da291` | Efecto holográfico desactivado (solo blanco bold) |
| `87c8312` | Trigger de deploy para commit 7f0ca14             |

---

## Cómo Revertir

### Opción 1: Git reset (volver a commit específico)

```bash
git reset --hard 7f0ca14
git push origin main --force
```

### Opción 2: Reemplazar solo el CSS

1. Copiar la definición CSS deseada de este documento
2. Reemplazar en `index.css`
3. Actualizar `public/critical.css` con el placeholder

### Opción 3: Crear nueva clase y buscar/reemplazar

1. Añadir la nueva clase al CSS
2. Ejecutar el script de reemplazo
3. Actualizar `critical.css`

---

## Archivos Afectados

El cambio afecta principalmente:

- `index.css` - Definición de la clase
- `public/critical.css` - Placeholder para SSR
- `~75 archivos .tsx` - Componentes que usan la clase

### Componentes con más usos:

- `SalsaCubanaPage.tsx` - 26 instancias
- `FullDanceClassTemplate.tsx` - 25 instancias
- `LadyStyleTemplate.tsx` - 21 instancias
- `SalsaLadyStylePageV2.tsx` - 15 instancias
- `GenericDanceLanding.tsx` - 13 instancias

---

## Recomendación Final

**Para máxima legibilidad + buen impacto visual:**
Usar `.holographic-text-subtle` (6 capas con opacidades)

**Para máximo rendimiento:**
Quitar completamente el text-shadow (solo blanco bold)

**Balance recomendado:**
Mantener el efecto original (7 capas) pero **quitar `font-bold`** de los textos holográficos para evitar el efecto de sangrado.

---

## Notas Adicionales

- El efecto holográfico tiene impacto en rendimiento (~20-30% más paint time)
- En móviles de gama baja puede afectar los FPS en scroll
- La clase se usa en ~360 elementos de la web
- Vercel CLI instalado globalmente para futuros deploys: `npm install -g vercel`

---

_Última actualización: Enero 2025_
