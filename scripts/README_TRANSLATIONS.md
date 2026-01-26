# Scripts de Gestión de Traducciones

Este directorio contiene scripts para gestionar y verificar las traducciones del proyecto divididas en namespaces.

---

## 📁 Scripts Disponibles

### 1. `split-translations.mjs`

Divide el archivo `es.ts` en 11 archivos JSON por namespace.

**Uso:**

```bash
node scripts/split-translations.mjs
```

**Output:**

- `i18n/locales/es/common.json`
- `i18n/locales/es/booking.json`
- `i18n/locales/es/schedule.json`
- ... (11 archivos en total)

---

### 2. `split-translations-all.mjs`

Divide los archivos `ca.ts`, `en.ts` y `fr.ts` en 11 archivos JSON por namespace (usando la misma lógica que ES).

**Uso:**

```bash
node scripts/split-translations-all.mjs
```

**Output:**

- `i18n/locales/ca/*.json` (11 archivos)
- `i18n/locales/en/*.json` (11 archivos)
- `i18n/locales/fr/*.json` (11 archivos)

---

### 3. `find-missing-keys.mjs`

Identifica keys faltantes comparando idiomas entre sí.

**Uso:**

```bash
node scripts/find-missing-keys.mjs
```

**Output:**

- Reporte en consola de keys faltantes
- Archivo `MISSING_KEYS_REPORT.json` con detalles

**Compara:**

- Blog: ES vs EN
- Blog: ES vs FR
- Contact: ES vs FR
- Verificación: CA vs ES (todos los namespaces)

---

### 4. `analyze-ca-es-diff.mjs`

Análisis detallado de diferencias entre CA y ES.

**Uso:**

```bash
node scripts/analyze-ca-es-diff.mjs
```

**Output:**

- Reporte en consola con diferencias por namespace
- Archivo `CA_ES_DIFFERENCES.json` con detalles completos

**Analiza:**

- home.json
- classes.json
- blog.json
- pages.json

---

### 5. `verify-translations.mjs` ⭐ (Recomendado)

Verificación rápida y completa del estado de las traducciones.

**Uso:**

```bash
node scripts/verify-translations.mjs
```

**Verifica:**

1. ✅ Existencia de todos los archivos (44 en total)
2. ✅ Conteo de keys por namespace y locale
3. ✅ Formato JSON válido
4. ✅ Contenido de muestras
5. ⚠️ Diferencias entre idiomas

**Output:**

- Tabla comparativa de keys por namespace
- Resumen de diferencias
- Estado de validación

---

## 📊 Estructura de Namespaces

### CORE (cargado siempre)

- **common.json**: Navegación, headers, footers, SEO, breadcrumbs

### EAGER (precargado)

- **booking.json**: Sistema de reservas
- **schedule.json**: Horarios de clases
- **calendar.json**: Calendario de eventos

### LAZY (bajo demanda)

- **home.json**: Homepage (hero, CTA, testimonios)
- **classes.json**: Clases y profesores
- **blog.json**: Artículos del blog
- **faq.json**: Preguntas frecuentes
- **about.json**: Sobre nosotros, método, Yunaisy
- **contact.json**: Contacto, formularios, modales
- **pages.json**: Páginas específicas (legal, pricing, etc.)

---

## 🔄 Workflow Recomendado

### Al actualizar traducciones:

1. **Modificar archivos `.ts` originales**

   ```bash
   # Editar i18n/locales/es.ts (o ca.ts, en.ts, fr.ts)
   ```

2. **Regenerar archivos JSON**

   ```bash
   node scripts/split-translations.mjs        # Para ES
   node scripts/split-translations-all.mjs    # Para CA, EN, FR
   ```

3. **Verificar resultado**

   ```bash
   node scripts/verify-translations.mjs
   ```

4. **Analizar diferencias (si es necesario)**
   ```bash
   node scripts/find-missing-keys.mjs
   node scripts/analyze-ca-es-diff.mjs
   ```

---

## 🎯 Casos de Uso

### Caso 1: Verificar estado actual de traducciones

```bash
node scripts/verify-translations.mjs
```

### Caso 2: Añadir nuevas traducciones

1. Editar `i18n/locales/es.ts` (añadir nueva key)
2. Ejecutar `node scripts/split-translations.mjs`
3. Traducir la misma key en `ca.ts`, `en.ts`, `fr.ts`
4. Ejecutar `node scripts/split-translations-all.mjs`
5. Verificar `node scripts/verify-translations.mjs`

### Caso 3: Encontrar keys faltantes en un idioma

```bash
node scripts/find-missing-keys.mjs
# Revisar MISSING_KEYS_REPORT.json
```

### Caso 4: Comparar CA con ES en detalle

```bash
node scripts/analyze-ca-es-diff.mjs
# Revisar CA_ES_DIFFERENCES.json
```

---

## 📝 Reglas de Clasificación

Las keys se clasifican según sus prefijos:

```javascript
// COMMON
nav*, header*, footer*, seo_*, meta_*, og_*, breadcrumb_*,
logo_*, statsbar_*, trustbar_*, reviews_*, notFound_*, legalNotice_*

// BOOKING
booking_*, bookingWidget_*

// SCHEDULE
schedule_*, dayShort_*, day_*, horarios_*, horariosV2_*

// CALENDAR
calendar_*, calendario_*

// HOME
hero_*, heroTitle*, pas_*, offer_*, videotestimonials_*, cta_*,
manifesto_*, home_*, testimonial*, instructor*

// CLASSES
classes_*, instructors_*, teacher_*, profesor_*, danceClassesHub_*

// BLOG
blog*

// FAQ
faq_*

// ABOUT
about_*, yunaisy_*, metodo_*, metodofarray_*, metodoFarray_*

// CONTACT
contact_*, form_*, leadModal_*, exitIntent_*,
*LeadModal_*, *ExitIntent_*

// PAGES (default)
Resto de keys (schema_*, terms_*, pricing_*, privacy_*, cookies_*, etc.)
```

---

## 🚨 Problemas Comunes

### Error: "No se encontró export const es = {"

**Causa**: Archivo `.ts` malformado
**Solución**: Verificar que el archivo tenga `export const es = {` en la primera línea

### Error: "Cannot find module"

**Causa**: Archivos JSON no generados
**Solución**: Ejecutar `node scripts/split-translations.mjs` primero

### Advertencia: "Keys faltantes"

**Causa**: Traducciones incompletas
**Solución**: Añadir las keys faltantes en los archivos `.ts` correspondientes

---

## 📄 Archivos de Reporte Generados

### `MISSING_KEYS_REPORT.json`

Generado por: `find-missing-keys.mjs`

```json
{
  "timestamp": "2026-01-25T...",
  "summary": {
    "blogEN": { "missing": 0, "extra": 0 },
    "blogFR": { "missing": 0, "extra": 0 },
    "contactFR": { "missing": 6, "extra": 0 }
  },
  "details": { ... }
}
```

### `CA_ES_DIFFERENCES.json`

Generado por: `analyze-ca-es-diff.mjs`

```json
{
  "timestamp": "2026-01-25T...",
  "comparison": "CA vs ES",
  "summary": {
    "home": { "missing": 54, "extra": 0 },
    "classes": { "missing": 3, "extra": 0 },
    ...
  },
  "details": { ... }
}
```

---

## 🎯 Estado Actual

Según última verificación (2026-01-25):

| Idioma | Total Keys | vs ES | Cobertura       |
| ------ | ---------- | ----- | --------------- |
| ES     | 13,050     | -     | 100% (baseline) |
| CA     | 13,011     | -39   | 99.7%           |
| EN     | 12,876     | -174  | 98.7%           |
| FR     | 12,977     | -73   | 99.4%           |

### Namespaces con cobertura perfecta (7/11):

✅ common, booking, schedule, calendar, faq, about, contact\*

\*Contact tiene 6 keys faltantes solo en FR

### Traducciones pendientes:

- **home.json**: 54 keys en CA, EN, FR
- **classes.json**: 3 keys en CA, EN, FR
- **contact.json**: 6 keys en FR

---

## 🔗 Documentos Relacionados

- `DIVISION_TRADUCCIONES_RESUMEN.md`: Resumen ejecutivo de la división
- `KEYS_POR_NAMESPACE.md`: Desglose detallado por namespace
- `TRANSLATION_SPLIT_SUMMARY.md`: Resumen inicial de distribución
- `TRANSLATION_COMPARISON.md`: Comparación entre idiomas

---

## 💡 Tips

1. **Ejecuta `verify-translations.mjs` regularmente** para detectar problemas temprano
2. **Usa la misma clasificación** para todos los idiomas (el script ya lo hace automáticamente)
3. **Mantén sincronizados** los archivos `.ts` antes de regenerar los JSON
4. **Revisa los reportes JSON** para análisis detallados
5. **Documenta contenido exclusivo** por idioma (ej: artículo CA `blogClasesPrincipiants_*`)

---

**Última actualización**: 2026-01-25
**Mantenedor**: Claude Code (scripts automatizados)
