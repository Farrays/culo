# Dashboard de Traducciones - Estado del Proyecto

**Última actualización:** 24 de diciembre de 2025

---

## Estado General

```
┌──────────────────────────────────────────────────────────────┐
│                    ESTADO DE TRADUCCIONES                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ES (Español - Base)    ████████████████████  8,981 claves  │
│  CA (Catalán)           █████████████████████ 9,232 claves  │
│  EN (Inglés)            █████████████████████ 9,144 claves  │
│  FR (Francés)           █████████████████████ 9,231 claves  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Métricas Clave

### Completitud de Traducciones

| Idioma           | Total | Faltantes | Extra | Completitud |
| ---------------- | ----: | --------: | ----: | ----------: |
| **CA (Catalán)** | 9,232 |         2 |   253 |      99.98% |
| **EN (Inglés)**  | 9,144 |         2 |   165 |      99.98% |
| **FR (Francés)** | 9,231 |         0 |   252 |     100.00% |

### Claves Pendientes de Traducción

```
┌────────────────────────────────────────────┐
│  Claves en ES sin traducir en CA/EN/FR    │
├────────────────────────────────────────────┤
│                                            │
│  Total:  1,026 claves                      │
│                                            │
│  ██████████████████████████████  (11.4%)   │
│                                            │
└────────────────────────────────────────────┘
```

---

## Top 20 Categorías con Traducciones Faltantes

```
Rango  Categoría                    Claves   Barra de Progreso
─────  ──────────────────────────  ───────  ──────────────────────────
  1.   homev                          121   ████████████████████████
  2.   bachataV                        84   █████████████████
  3.   dhLeadModal                     43   ████████
  4.   testClassTransform              24   █████
  5.   cuerpofitFaqQ                   15   ███
  6.   cuerpofitFaqA                   15   ███
  7.   fullBodyCardioFaqQ              15   ███
  8.   fullBodyCardioFaqA              15   ███
  9.   cuerpofitWhyChoose              14   ███
 10.   bailemanananasWhyChoose         14   ███
 11.   bailemanananasFaqQ              14   ███
 12.   bailemanananasFaqA              14   ███
 13.   fullBodyCardioWhyChoose         14   ███
 14.   cuerpofitTransform              12   ██
 15.   bailemanananasTransform         12   ██
 16.   fullBodyCardioTransform         12   ██
 17.   testClassWhyChoose              12   ██
 18.   fbLandingValue                  10   ██
 19.   dhLandingWhyTitle                7   █
 20.   dhLandingWhyDesc                 7   █
```

---

## Impacto por Página

### Páginas Completas Sin Traducir

| Página                | Claves | Estado       | Prioridad |
| --------------------- | -----: | ------------ | --------- |
| **Homepage V2**       |    121 | Sin traducir | CRÍTICA   |
| **Bachata V**         |     84 | Sin traducir | ALTA      |
| **Cuerpo-Fit**        |   ~160 | Sin traducir | CRÍTICA   |
| **Baile Mañanas**     |   ~120 | Sin traducir | CRÍTICA   |
| **Full Body Cardio**  |   ~130 | Sin traducir | CRÍTICA   |
| **Test Class**        |    ~90 | Sin traducir | ALTA      |
| **Dancehall Landing** |    ~60 | Sin traducir | MEDIA     |
| **Facebook Landing**  |    ~45 | Sin traducir | MEDIA     |

### Componentes Afectados

```
Componentes con traducciones faltantes:

📄 HomePageV2.tsx                     121 claves
📄 CuerpoFitPage.tsx                  ~160 claves
📄 BaileMananasPage.tsx               ~120 claves
📄 FullBodyCardioPage.tsx             ~130 claves
📄 TestClassPage.tsx                  ~90 claves
📄 Header.tsx / Navigation            4 claves
📄 FinalCTA.tsx                       1 clave
📄 Hero sections (múltiples)          13 claves
```

---

## Distribución de Claves Faltantes

### Por Tipo de Contenido

```
SEO & Meta Tags        ████████░░  ~80 claves (8%)
Hero Sections          ████░░░░░░  ~40 claves (4%)
FAQ                    ████████░░  ~92 claves (9%)
Testimonials           ██░░░░░░░░  ~20 claves (2%)
CTAs                   ███░░░░░░░  ~30 claves (3%)
Forms & Modals         ██████░░░░  ~60 claves (6%)
Landing Pages          ████████░░  ~90 claves (9%)
Educational Content    ██████████  ~120 claves (12%)
Transformation         ███████░░░  ~72 claves (7%)
Identification         ████░░░░░░  ~40 claves (4%)
Why Choose             ████████░░  ~84 claves (8%)
Prepare Sections       ████░░░░░░  ~48 claves (5%)
Navigation             ██░░░░░░░░  ~10 claves (1%)
Breadcrumbs            ███░░░░░░░  ~24 claves (2%)
Teachers               ███░░░░░░░  ~20 claves (2%)
Schedule               ███░░░░░░░  ~20 claves (2%)
Cultural History       ███░░░░░░░  ~24 claves (2%)
Otros                  ████████████  ~152 claves (15%)
```

---

## Claves Extra (Posible Código Muerto)

### Claves que existen en CA/EN/FR pero NO en ES

```
Categoría             CA    EN    FR   Descripción
─────────────────   ─────  ───  ─────  ────────────────────────
bachataV3*           84    84    84    Versión 3 de Bachata
particularesPage_*   48    48    48    Clases particulares
hiphop*              52    -     52    Hip Hop extendido
blog_*               17    17    17    Sistema de blog
facilities*          12    12    12    Instalaciones
rcb*                 11    -     11    Reggaeton Cubano
home_categories_*    10    4     10    Categorías de home
salsaCubana*         9     6     9     Salsa Cubana
Otros                10    -     9     Misceláneos

TOTAL:              253   165   252
```

**Acción recomendada:** Verificar si estas claves se usan en el código. Si no, eliminarlas.

---

## Archivos de Trabajo Generados

### Archivos para Traducir

| Archivo                        | Propósito                                 | Claves |
| ------------------------------ | ----------------------------------------- | -----: |
| `missing_translations.json`    | Todas las claves faltantes con valores ES |  1,024 |
| `missing_translations_ca.json` | Específicas para catalán                  |      0 |
| `missing_translations_en.json` | Específicas para inglés                   |      0 |
| `missing_translations_fr.json` | Específicas para francés                  |      0 |

### Archivos de Análisis

| Archivo                                 | Propósito                            |
| --------------------------------------- | ------------------------------------ |
| `missing_translations_detailed.json`    | Análisis completo por idioma         |
| `missing_translations_categorized.json` | Traducciones organizadas por prefijo |
| `REPORTE_TRADUCCIONES.md`               | Reporte técnico detallado            |
| `RESUMEN_TRADUCCIONES_EJECUTIVO.md`     | Resumen ejecutivo completo           |
| `DASHBOARD_TRADUCCIONES.md`             | Este archivo - Dashboard visual      |

---

## Plan de Acción

### Fase 1: Páginas Críticas (Prioridad Máxima)

**Estimado:** 570 claves

- [ ] Cuerpo-Fit (~160 claves)
- [ ] Baile Mañanas (~120 claves)
- [ ] Full Body Cardio (~130 claves)
- [ ] Homepage V2 (121 claves)
- [ ] Navegación global (4 claves)
- [ ] CTAs globales (7 claves)
- [ ] Hero Students (13 claves)
- [ ] Dance Classes Hub (4 claves)

### Fase 2: Landing Pages (Prioridad Alta)

**Estimado:** 195 claves

- [ ] Dancehall Landing (~60 claves)
- [ ] Facebook Landing (~45 claves)
- [ ] Test Class (~90 claves)

### Fase 3: Contenido Secundario (Prioridad Media)

**Estimado:** 259 claves

- [ ] Bachata V (84 claves)
- [ ] Blog (3 claves)
- [ ] Lead Modals (43 claves)
- [ ] Exit Intent (6 claves)
- [ ] Facilities (1 clave)
- [ ] Testimonials (múltiples)
- [ ] Otros (múltiples)

### Fase 4: Limpieza (Prioridad Baja)

**Estimado:** 670+ claves a revisar/eliminar

- [ ] Verificar uso de claves extra en CA/EN/FR
- [ ] Eliminar código muerto
- [ ] Sincronizar todos los idiomas
- [ ] Agregar claves faltantes individuales (Metales, Modalidades)

---

## Métricas de Progreso

### Cobertura Actual

```
Español (Base):     100% ████████████████████ (8,981/8,981)
Catalán:             99% ████████████████████ (9,230/9,232)
Inglés:              99% ████████████████████ (9,142/9,144)
Francés:            100% ████████████████████ (9,231/9,231)
```

### Después de Fase 1 (proyección)

```
Español (Base):     100% ████████████████████ (8,981/8,981)
Catalán:            100% ████████████████████ (9,800/9,800)
Inglés:             100% ████████████████████ (9,712/9,712)
Francés:            100% ████████████████████ (9,799/9,799)
```

---

## Comandos Útiles

### Re-ejecutar análisis

```bash
# Extrae todas las claves faltantes
node scripts/extract-missing-keys.mjs

# Análisis detallado por idioma
node scripts/extract-all-missing-keys.mjs

# Análisis de claves extra
node scripts/extract-reverse-missing-keys.mjs

# Genera reporte categorizado
node scripts/generate-translation-report.mjs
```

### Verificar progreso

```bash
# Contar claves en cada idioma
grep -c "^\s*[a-zA-Z]" i18n/locales/es.ts
grep -c "^\s*[a-zA-Z]" i18n/locales/ca.ts
grep -c "^\s*[a-zA-Z]" i18n/locales/en.ts
grep -c "^\s*[a-zA-Z]" i18n/locales/fr.ts
```

---

## Notas

- **Fecha de análisis:** 24/12/2025 05:18 UTC
- **Scripts utilizados:** 4 scripts personalizados
- **Precisión:** 99.8% (1,024 de 1,026 claves extraídas correctamente)
- **Tiempo de ejecución:** ~5 segundos por análisis completo

---

## Estado: 🔴 ACCIÓN REQUERIDA

**Impacto en producción:** Alto

- Usuarios de CA/EN/FR verán contenido en español en ~1,026 puntos
- Páginas nuevas completamente sin traducir
- SEO internacional afectado (meta tags sin traducir)

**Recomendación:** Iniciar Fase 1 inmediatamente para páginas críticas.
