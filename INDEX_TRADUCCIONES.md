# Índice - Documentación de Traducciones

Índice completo de todos los archivos y recursos generados para el análisis de traducciones.

---

## Inicio Rápido

**Si es tu primera vez, empieza aquí:**

1. [QUICK_START_TRADUCCIONES.md](QUICK_START_TRADUCCIONES.md) - Guía rápida para empezar
2. [DASHBOARD_TRADUCCIONES.md](DASHBOARD_TRADUCCIONES.md) - Dashboard visual del estado

---

## Documentación Principal

### Para Gerencia / Product Owners

| Archivo                                                                | Descripción                             | Cuándo Leer      |
| ---------------------------------------------------------------------- | --------------------------------------- | ---------------- |
| [DASHBOARD_TRADUCCIONES.md](DASHBOARD_TRADUCCIONES.md)                 | Dashboard visual con estado actual      | Primera lectura  |
| [RESUMEN_TRADUCCIONES_EJECUTIVO.md](RESUMEN_TRADUCCIONES_EJECUTIVO.md) | Resumen ejecutivo completo con detalles | Segunda lectura  |
| [REPORTE_TRADUCCIONES.md](REPORTE_TRADUCCIONES.md)                     | Reporte técnico detallado               | Para profundizar |

### Para Desarrolladores / Traductores

| Archivo                                                                        | Descripción                   | Cuándo Usar            |
| ------------------------------------------------------------------------------ | ----------------------------- | ---------------------- |
| [QUICK_START_TRADUCCIONES.md](QUICK_START_TRADUCCIONES.md)                     | Guía paso a paso para empezar | Inicio del trabajo     |
| [scripts/README_TRANSLATION_SCRIPTS.md](scripts/README_TRANSLATION_SCRIPTS.md) | Documentación de scripts      | Para ejecutar análisis |
| [INDEX_TRADUCCIONES.md](INDEX_TRADUCCIONES.md)                                 | Este archivo - índice general | Navegación             |

---

## Archivos de Trabajo

### Para Traducir (orden de prioridad)

| Archivo                                                      | Descripción                             | Tamaño  | Prioridad |
| ------------------------------------------------------------ | --------------------------------------- | ------- | --------- |
| [missing_translations.json](missing_translations.json)       | **PRINCIPAL** - 1,024 pares clave-valor | ~150 KB | ALTA      |
| [missing_translations_ca.json](missing_translations_ca.json) | Específico para catalán                 | ~0 KB   | BAJA      |
| [missing_translations_en.json](missing_translations_en.json) | Específico para inglés                  | ~0 KB   | BAJA      |
| [missing_translations_fr.json](missing_translations_fr.json) | Específico para francés                 | ~0 KB   | BAJA      |

**Nota:** Usar principalmente `missing_translations.json` ya que contiene todas las claves que faltan en los 3 idiomas.

---

## Archivos de Análisis

### Reportes JSON (para procesamiento)

| Archivo                                                                        | Descripción                  | Tamaño  | Uso                |
| ------------------------------------------------------------------------------ | ---------------------------- | ------- | ------------------ |
| [missing_translations_detailed.json](missing_translations_detailed.json)       | Análisis completo por idioma | ~300 KB | Scripts / Análisis |
| [missing_translations_categorized.json](missing_translations_categorized.json) | Organizado por prefijo       | ~200 KB | Reportes           |

---

## Scripts

Ubicados en: `scripts/`

| Script                                                                       | Descripción                      | Salida                                  |
| ---------------------------------------------------------------------------- | -------------------------------- | --------------------------------------- |
| [extract-missing-keys.mjs](scripts/extract-missing-keys.mjs)                 | Extrae claves faltantes en TODOS | `missing_translations.json`             |
| [extract-all-missing-keys.mjs](scripts/extract-all-missing-keys.mjs)         | Análisis detallado por idioma    | `missing_translations_detailed.json`    |
| [extract-reverse-missing-keys.mjs](scripts/extract-reverse-missing-keys.mjs) | Claves extra (código muerto)     | Consola                                 |
| [generate-translation-report.mjs](scripts/generate-translation-report.mjs)   | Reporte categorizado             | `missing_translations_categorized.json` |

**Documentación:** [scripts/README_TRANSLATION_SCRIPTS.md](scripts/README_TRANSLATION_SCRIPTS.md)

---

## Archivos de Idioma (donde agregar traducciones)

Ubicados en: `i18n/locales/`

| Archivo                                  | Idioma         | Claves | Estado         |
| ---------------------------------------- | -------------- | ------ | -------------- |
| [i18n/locales/es.ts](i18n/locales/es.ts) | Español (base) | 8,981  | ✅ 100%        |
| [i18n/locales/ca.ts](i18n/locales/ca.ts) | Catalán        | 9,232  | ⚠️ 2 faltantes |
| [i18n/locales/en.ts](i18n/locales/en.ts) | Inglés         | 9,144  | ⚠️ 2 faltantes |
| [i18n/locales/fr.ts](i18n/locales/fr.ts) | Francés        | 9,231  | ✅ 100%        |

---

## Páginas Afectadas

### Archivos de Componentes a Revisar

| Componente       | Claves Faltantes | Ubicación                                                              |
| ---------------- | ---------------- | ---------------------------------------------------------------------- |
| Homepage V2      | 121              | [components/HomePageV2.tsx](components/HomePageV2.tsx)                 |
| Cuerpo-Fit       | ~160             | [components/CuerpoFitPage.tsx](components/CuerpoFitPage.tsx)           |
| Baile Mañanas    | ~120             | [components/BaileMananasPage.tsx](components/BaileMananasPage.tsx)     |
| Full Body Cardio | ~130             | [components/FullBodyCardioPage.tsx](components/FullBodyCardioPage.tsx) |
| Test Class       | ~90              | [components/TestClassPage.tsx](components/TestClassPage.tsx)           |

### Archivos de Configuración Relacionados

| Config            | Descripción                     | Ubicación                                                                                                                                    |
| ----------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage V2       | Configuración de homepage nueva | [constants/homepage-v2-config.ts](constants/homepage-v2-config.ts)                                                                           |
| Cuerpo-Fit        | Config + constants              | [constants/cuerpo-fit-config.ts](constants/cuerpo-fit-config.ts), [constants/cuerpo-fit.ts](constants/cuerpo-fit.ts)                         |
| Baile Mañanas     | Config + constants              | [constants/baile-mananas-config.ts](constants/baile-mananas-config.ts), [constants/baile-mananas.ts](constants/baile-mananas.ts)             |
| Full Body Cardio  | Config + constants              | [constants/full-body-cardio-config.ts](constants/full-body-cardio-config.ts), [constants/full-body-cardio.ts](constants/full-body-cardio.ts) |
| Test Class        | Config + constants              | [constants/test-class-config.ts](constants/test-class-config.ts), [constants/test-class.ts](constants/test-class.ts)                         |
| Dancehall Landing | Config de landing               | [constants/dancehall-landing-config.ts](constants/dancehall-landing-config.ts)                                                               |
| Landing Template  | Template genérico               | [constants/landing-template-config.ts](constants/landing-template-config.ts)                                                                 |

---

## Flujos de Trabajo

### Flujo 1: Primera Vez (Análisis)

```
1. Leer → QUICK_START_TRADUCCIONES.md
2. Leer → DASHBOARD_TRADUCCIONES.md
3. Revisar → missing_translations.json
4. Ejecutar → node scripts/extract-missing-keys.mjs
```

### Flujo 2: Traducir Página Específica

```
1. Identificar página en → DASHBOARD_TRADUCCIONES.md
2. Filtrar claves → cat missing_translations.json | jq '.[] | select(.key | startswith("cuerpofit"))'
3. Editar → i18n/locales/ca.ts, en.ts, fr.ts
4. Verificar → node scripts/extract-missing-keys.mjs
5. Probar → npm run dev
```

### Flujo 3: Re-ejecutar Análisis

```
1. Ejecutar scripts → node scripts/extract-missing-keys.mjs
2. Ejecutar scripts → node scripts/extract-all-missing-keys.mjs
3. Generar reporte → node scripts/generate-translation-report.mjs
4. Revisar → DASHBOARD_TRADUCCIONES.md (actualizado)
```

### Flujo 4: Limpieza de Código Muerto

```
1. Identificar → node scripts/extract-reverse-missing-keys.mjs
2. Buscar uso → grep -r "bachataV3" components/ constants/
3. Si no se usa → Eliminar de i18n/locales/ca.ts, en.ts, fr.ts
4. Verificar → node scripts/extract-all-missing-keys.mjs
```

---

## Estadísticas Rápidas

### Estado Actual (24/12/2025)

```
Total de claves:
  ES: 8,981 (base)
  CA: 9,232 (+251 extra, -2 faltantes)
  EN: 9,144 (+163 extra, -2 faltantes)
  FR: 9,231 (+250 extra, -0 faltantes)

Claves faltantes en CA/EN/FR: 1,026 (11.4%)

Top 5 categorías:
  1. homev (121)
  2. bachataV (84)
  3. dhLeadModal (43)
  4. testClassTransform (24)
  5. cuerpofitFaqQ (15)

Top 5 páginas:
  1. Homepage V2 (121)
  2. Cuerpo-Fit (~160)
  3. Full Body Cardio (~130)
  4. Baile Mañanas (~120)
  5. Test Class (~90)
```

---

## Comandos Útiles

### Ver Estado

```bash
# Contar claves en cada idioma
grep -c "^\s*[a-zA-Z]" i18n/locales/es.ts
grep -c "^\s*[a-zA-Z]" i18n/locales/ca.ts
grep -c "^\s*[a-zA-Z]" i18n/locales/en.ts
grep -c "^\s*[a-zA-Z]" i18n/locales/fr.ts

# Ver todas las claves faltantes
cat missing_translations.json | jq -r '.[].key'

# Ver claves de una página específica
cat missing_translations.json | jq '.[] | select(.key | startswith("cuerpofit"))'
```

### Análisis

```bash
# Re-ejecutar análisis completo
node scripts/extract-missing-keys.mjs
node scripts/extract-all-missing-keys.mjs
node scripts/extract-reverse-missing-keys.mjs
node scripts/generate-translation-report.mjs

# Ver solo estadísticas
node scripts/extract-missing-keys.mjs | grep "Keys in"
```

### Exportar

```bash
# Exportar a CSV para Excel
cat missing_translations.json | jq -r '.[] | [.key, .value] | @csv' > missing.csv

# Exportar solo claves
cat missing_translations.json | jq -r '.[].key' > missing_keys.txt

# Exportar por página
cat missing_translations.json | jq '.[] | select(.key | startswith("cuerpofit"))' > cuerpofit.json
```

---

## Checklist de Progreso

### Fase 1: Crítica

- [ ] Claves globales (23 claves)
  - [ ] Navegación (4)
  - [ ] CTAs globales (7)
  - [ ] Hero Students (13)
  - [ ] Dance Classes Hub (4)

- [ ] Cuerpo-Fit (~160 claves)
  - [ ] SEO & Meta (3)
  - [ ] Breadcrumbs (4)
  - [ ] Hero (5)
  - [ ] What Is (4)
  - [ ] Identify (6)
  - [ ] Transform (12)
  - [ ] Why Choose (14)
  - [ ] FAQ (30)
  - [ ] Teachers (2)
  - [ ] Prepare (8)
  - [ ] Cultural (4)
  - [ ] Citable (6)
  - [ ] Final CTA (4)
  - [ ] Schema (2)
  - [ ] Otros

- [ ] Baile Mañanas (~120 claves)
- [ ] Full Body Cardio (~130 claves)
- [ ] Homepage V2 (121 claves)

### Fase 2: Alta

- [ ] Test Class (~90 claves)
- [ ] Dancehall Landing (~60 claves)
- [ ] Facebook Landing (~45 claves)

### Fase 3: Media

- [ ] Bachata V (84 claves)
- [ ] Blog (3 claves)
- [ ] Otros (~50 claves)

### Fase 4: Limpieza

- [ ] Verificar claves extra (670+ claves)
- [ ] Agregar claves faltantes individuales (2 en CA, 2 en EN)
- [ ] Sincronizar todos los idiomas

---

## FAQs

### ¿Por dónde empiezo?

Lee [QUICK_START_TRADUCCIONES.md](QUICK_START_TRADUCCIONES.md) y luego usa `missing_translations.json`.

### ¿Qué archivo debo traducir?

Usa [missing_translations.json](missing_translations.json) principalmente, tiene todas las claves.

### ¿Dónde agrego las traducciones?

En los archivos de idioma:

- `i18n/locales/ca.ts` (catalán)
- `i18n/locales/en.ts` (inglés)
- `i18n/locales/fr.ts` (francés)

### ¿Cómo verifico mi progreso?

```bash
node scripts/extract-missing-keys.mjs
```

### ¿Qué son las "claves extra"?

Claves que están en CA/EN/FR pero no en español. Posiblemente código muerto.

### ¿Cómo las encuentro?

```bash
node scripts/extract-reverse-missing-keys.mjs
```

---

## Contacto

Para preguntas sobre:

- **Contenido:** Equipo de contenido FIDC
- **Traducciones:** Traductores CA/EN/FR
- **Técnico:** Equipo de desarrollo

---

## Historial

- **24/12/2025:** Análisis inicial completo
  - 1,026 claves faltantes identificadas
  - 5 páginas principales afectadas
  - Documentación completa generada

---

## Recursos Externos

- [TypeScript i18n Best Practices](https://www.i18next.com/overview/typescript)
- [React Internationalization Guide](https://react.i18next.com/)

---

**Última actualización:** 24 de diciembre de 2025

**Versión:** 1.0
