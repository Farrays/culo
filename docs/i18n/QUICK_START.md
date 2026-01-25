# Quick Start - Traducciones Faltantes

Guía rápida para empezar a trabajar con las traducciones faltantes.

---

## Resumen de 30 Segundos

- **1,026 claves** en español sin traducir a CA/EN/FR
- **5 páginas principales** afectadas
- **Archivos listos** para empezar a traducir

---

## Paso 1: Ver el Estado Actual

```bash
# Abrir el dashboard visual
code DASHBOARD_TRADUCCIONES.md

# O leer el resumen ejecutivo
code RESUMEN_TRADUCCIONES_EJECUTIVO.md
```

---

## Paso 2: Obtener las Claves a Traducir

### Opción A: Ver todas las claves (1,024)

```bash
# Abrir el archivo JSON principal
code missing_translations.json

# O en terminal
cat missing_translations.json | jq -r '.[] | "\(.key): \(.value)"' | less
```

### Opción B: Ver por categoría

```bash
# Ver top 10 categorías
node scripts/generate-translation-report.mjs | head -50

# O abrir el archivo categorizado
code missing_translations_categorized.json
```

### Opción C: Ver solo una página específica

```bash
# Homepage V2
cat missing_translations.json | jq '.[] | select(.key | startswith("homev"))'

# Cuerpo-Fit
cat missing_translations.json | jq '.[] | select(.key | startswith("cuerpofit"))'

# Baile Mañanas
cat missing_translations.json | jq '.[] | select(.key | startswith("bailemanananas"))'

# Full Body Cardio
cat missing_translations.json | jq '.[] | select(.key | startswith("fullBodyCardio"))'
```

---

## Paso 3: Empezar a Traducir

### Prioridad 1: Claves Globales (10 claves)

Estas afectan a toda la aplicación:

```typescript
// Editar: i18n/locales/ca.ts, en.ts, fr.ts

// Navegación
navBodyConditioning: "Acondicionamiento Físico",
navCuerpoFit: "Cuerpo-Fit",
navBaileMananas: "Baile Mañanas",
navFAQ: "Preguntas Frecuentes",

// CTAs
limitedSpots: "Plazas Limitadas",
startToday: "Empieza Hoy",
finalCTADefaultNote: "Consulta horarios disponibles",
verClasesBaile: "Ver Clases de Baile",
consultarDisponibilidad: "Consultar Disponibilidad",
contactanos: "Contáctanos",
solicitarTour: "Solicitar Tour",
```

### Prioridad 2: Hero Students (13 claves)

Aparece en múltiples páginas de clases:

```typescript
twerkHeroStudents: "+15.000 alumnos formados",
afroHeroStudents: "+15.000 alumnos formados",
sxrHeroStudents: "+15.000 alumnos formados",
rcbHeroStudents: "+15.000 alumnos formados",
femHeroStudents: "+15.000 alumnos formados",
sexystyleHeroStudents: "+15.000 alumnos formados",
modernjazzHeroStudents: "+15.000 alumnos formados",
balletHeroStudents: "+15.000 alumnos formados",
contemporaneoHeroStudents: "+15.000 alumnos formados",
afrocontemporaneoHeroStudents: "+15.000 alumnos formados",
afrojazzHeroStudents: "+15.000 alumnos formados",
hiphopHeroStudents: "+15.000 alumnos formados",
salsaCubanaHeroStudents: "+15.000 alumnos formados",
```

### Prioridad 3: Cuerpo-Fit (~160 claves)

```bash
# Extraer solo las claves de Cuerpo-Fit
cat missing_translations.json | jq '.[] | select(.key | startswith("cuerpofit"))' > cuerpofit_to_translate.json

# Ver en formato legible
cat cuerpofit_to_translate.json | jq -r '"\(.key): \(.value)"'
```

Editar archivos:

- `i18n/locales/ca.ts`
- `i18n/locales/en.ts`
- `i18n/locales/fr.ts`

Buscar la sección apropiada y agregar todas las claves que empiecen con `cuerpofit`.

---

## Paso 4: Verificar Progreso

```bash
# Re-ejecutar el análisis
node scripts/extract-missing-keys.mjs

# Deberías ver menos claves faltantes
```

---

## Estructura de Archivos de Idioma

Los archivos están en: `i18n/locales/`

```
i18n/
  locales/
    es.ts  ← Idioma base (8,981 claves)
    ca.ts  ← Catalán (agregar aquí)
    en.ts  ← Inglés (agregar aquí)
    fr.ts  ← Francés (agregar aquí)
```

Formato de cada archivo:

```typescript
export default {
  // Navegación
  navHome: 'Inicio',
  navClasses: 'Clases',
  navBodyConditioning: 'Acondicionamiento Físico', // ← AGREGAR AQUÍ

  // CTAs
  limitedSpots: 'Plazas Limitadas', // ← AGREGAR AQUÍ

  // ... más claves
};
```

---

## Tips para Traducir Eficientemente

### 1. Usar Búsqueda en VS Code

```
Ctrl+F en el archivo de idioma
Buscar: "cuerpofit"
```

Esto te mostrará si ya existe alguna clave con ese prefijo.

### 2. Copiar Bloque Completo del Español

```bash
# Copiar sección de Cuerpo-Fit desde es.ts
# Pegar en ca.ts, en.ts, fr.ts
# Traducir solo los valores, mantener las claves
```

### 3. Usar Herramientas de IA

```bash
# Exportar claves a archivo
cat missing_translations.json | jq '.[] | select(.key | startswith("cuerpofit"))' > to_translate.json

# Pedirle a ChatGPT/Claude:
# "Traduce estos valores del español al catalán/inglés/francés"
```

### 4. Traducir en Lotes

Agrupar por tipo de contenido:

**Batch 1: SEO & Meta**

```
*PageTitle
*MetaDescription
*MetaKeywords
```

**Batch 2: Hero Sections**

```
*HeroTitle
*HeroSubtitle
*HeroDesc
*HeroCTA
```

**Batch 3: FAQ**

```
*FaqQ1, *FaqQ2, ...
*FaqA1, *FaqA2, ...
```

---

## Atajos de Terminal Útiles

```bash
# Contar cuántas claves faltan por página
cat missing_translations.json | jq -r '.[].key' | grep -c "cuerpofit"
cat missing_translations.json | jq -r '.[].key' | grep -c "homev"
cat missing_translations.json | jq -r '.[].key' | grep -c "bailemanananas"

# Ver solo las claves (sin valores)
cat missing_translations.json | jq -r '.[].key'

# Buscar una clave específica
cat missing_translations.json | jq '.[] | select(.key == "navCuerpoFit")'

# Exportar a CSV para Excel
cat missing_translations.json | jq -r '.[] | [.key, .value] | @csv' > missing.csv
```

---

## Plan de Acción Sugerido

### Día 1: Claves Globales + Hero Students

- **Tiempo estimado:** 1-2 horas
- **Claves:** ~23
- **Impacto:** Alto (afecta toda la app)

### Día 2: Cuerpo-Fit

- **Tiempo estimado:** 3-4 horas
- **Claves:** ~160
- **Impacto:** Alto (página nueva)

### Día 3: Baile Mañanas

- **Tiempo estimado:** 3-4 horas
- **Claves:** ~120
- **Impacto:** Alto (página nueva)

### Día 4: Full Body Cardio

- **Tiempo estimado:** 3-4 horas
- **Claves:** ~130
- **Impacto:** Alto (página nueva)

### Día 5: Homepage V2

- **Tiempo estimado:** 3-4 horas
- **Claves:** 121
- **Impacto:** Crítico (homepage)

### Días 6-7: Landing Pages + Test Class

- **Tiempo estimado:** 4-6 horas
- **Claves:** ~195
- **Impacto:** Medio (conversión)

### Día 8: Bachata V + Otros

- **Tiempo estimado:** 3-4 horas
- **Claves:** ~170
- **Impacto:** Bajo (desarrollo futuro)

---

## Checklist de Traducción

- [ ] Claves globales (navegación, CTAs)
- [ ] Hero Students (13 estilos)
- [ ] Cuerpo-Fit (página completa)
- [ ] Baile Mañanas (página completa)
- [ ] Full Body Cardio (página completa)
- [ ] Homepage V2 (página completa)
- [ ] Test Class (página completa)
- [ ] Dancehall Landing
- [ ] Facebook Landing
- [ ] Bachata V
- [ ] Blog (3 claves)
- [ ] Otros (misceláneos)

---

## Validación

Después de traducir, verificar:

```bash
# 1. No hay errores de sintaxis
npm run build

# 2. Las traducciones están correctas
npm run dev
# Navegar a las páginas traducidas
# Cambiar idioma en el selector

# 3. Re-ejecutar análisis
node scripts/extract-missing-keys.mjs
# Debería mostrar 0 claves faltantes
```

---

## Problemas Comunes

### "No veo mis traducciones en la app"

**Solución:**

1. Reiniciar el servidor de desarrollo
2. Limpiar caché del navegador
3. Verificar que la clave está exactamente igual (case-sensitive)

### "Error de sintaxis en el archivo de idioma"

**Solución:**

1. Verificar comas al final de cada línea
2. Verificar comillas cerradas correctamente
3. Usar un linter de TypeScript

### "La traducción se ve cortada"

**Solución:**

1. Verificar que no haya comillas dobles dentro del texto
2. Escapar caracteres especiales: `\"` para comillas
3. Usar template literals si el texto es largo

---

## Recursos

- **Dashboard:** `DASHBOARD_TRADUCCIONES.md`
- **Resumen ejecutivo:** `RESUMEN_TRADUCCIONES_EJECUTIVO.md`
- **Reporte técnico:** `REPORTE_TRADUCCIONES.md`
- **Docs de scripts:** `scripts/README_TRANSLATION_SCRIPTS.md`

---

## Contacto

Si tienes dudas sobre alguna traducción, consulta:

- Archivos de configuración en `constants/`
- Componentes React en `components/`
- El equipo de contenido de FIDC

---

**¡Empecemos a traducir!**
