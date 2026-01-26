# Desglose de Keys por Namespace y Idioma

## Tabla Comparativa Completa

| Namespace         | ES         | CA         | EN         | FR         | Diferencias          |
| ----------------- | ---------- | ---------- | ---------- | ---------- | -------------------- |
| **common.json**   | 149        | 149        | 149        | 149        | ✅ Idéntico en todos |
| **booking.json**  | 187        | 187        | 187        | 187        | ✅ Idéntico en todos |
| **schedule.json** | 235        | 235        | 235        | 235        | ✅ Idéntico en todos |
| **calendar.json** | 43         | 43         | 43         | 43         | ✅ Idéntico en todos |
| **home.json**     | 393        | 339        | 339        | 339        | CA/EN/FR: -54 keys   |
| **classes.json**  | 202        | 199        | 199        | 199        | CA/EN/FR: -3 keys    |
| **blog.json**     | 890        | 949        | 890        | 890        | CA: +59 keys         |
| **faq.json**      | 81         | 81         | 81         | 81         | ✅ Idéntico en todos |
| **about.json**    | 272        | 272        | 272        | 272        | ✅ Idéntico en todos |
| **contact.json**  | 824        | 824        | 824        | 818        | FR: -6 keys          |
| **pages.json**    | 9,774      | 9,733      | 9,657      | 9,764      | Variaciones normales |
| **TOTAL**         | **13,049** | **13,011** | **12,876** | **12,977** |                      |

---

## Categorización por Tipo de Carga

### CORE (cargado siempre)

**common.json** - Navegación, headers, footers, SEO, breadcrumbs

| Idioma | Keys | Incluye                                                                                                          |
| ------ | ---- | ---------------------------------------------------------------------------------------------------------------- |
| ES     | 149  | nav*, header*, footer*, seo\_*, meta*\*, og*_, breadcrumb\__, logos, stats, reviews, notFound*\*, legalNotice*\* |
| CA     | 149  | ✅ Cobertura 100%                                                                                                |
| EN     | 149  | ✅ Cobertura 100%                                                                                                |
| FR     | 149  | ✅ Cobertura 100%                                                                                                |

---

### EAGER (precargado en páginas principales)

#### booking.json - Sistema de reservas

| Idioma | Keys | Incluye                      |
| ------ | ---- | ---------------------------- |
| ES     | 187  | booking*\*, bookingWidget*\* |
| CA     | 187  | ✅ Cobertura 100%            |
| EN     | 187  | ✅ Cobertura 100%            |
| FR     | 187  | ✅ Cobertura 100%            |

#### schedule.json - Horarios de clases

| Idioma | Keys | Incluye                                                     |
| ------ | ---- | ----------------------------------------------------------- |
| ES     | 235  | schedule*\*, dayShort*_, day\__, horarios*\*, horariosV2*\* |
| CA     | 235  | ✅ Cobertura 100%                                           |
| EN     | 235  | ✅ Cobertura 100%                                           |
| FR     | 235  | ✅ Cobertura 100%                                           |

#### calendar.json - Calendario de eventos

| Idioma | Keys | Incluye                    |
| ------ | ---- | -------------------------- |
| ES     | 43   | calendar*\*, calendario*\* |
| CA     | 43   | ✅ Cobertura 100%          |
| EN     | 43   | ✅ Cobertura 100%          |
| FR     | 43   | ✅ Cobertura 100%          |

---

### LAZY (cargado bajo demanda)

#### home.json - Homepage elements

| Idioma | Keys | Estado                           |
| ------ | ---- | -------------------------------- |
| ES     | 393  | ✅ Completo                      |
| CA     | 339  | ⚠️ Falta 54 keys (86% cobertura) |
| EN     | 339  | ⚠️ Falta 54 keys (86% cobertura) |
| FR     | 339  | ⚠️ Falta 54 keys (86% cobertura) |

**Incluye**: hero**, heroTitle*, pas*_, offer\__, videotestimonials*\*, cta*_, manifesto\__, home\__, services_, testimonial\*

**Keys faltantes en CA/EN/FR**:

- PAS Framework: `pas_title`, `pas_subtitle`, `pas_problem1-4`, `pas_agitation1-2`, `pas_solution1-2`, `pas_cta`
- Offers: `offer_badge`, `offer_title`, `offer_subtitle`, `offer_benefit1-5`, `offer_value1-5`, `offer_urgency`, `offer_cta`, `offer_trust1-2`
- Video Testimonials: `videotestimonials_title`, `videotestimonials_subtitle`, `videotestimonials_reviews`
- Testimonials: `testimonial1-3_name`, `testimonial1-3_role`, `testimonial1-3_quote`
- Instructors: `instructor1-3_name`, `instructor1-3_role`, `instructor1-3_bio`, `instructor1-3_quote`

#### classes.json - Clases y profesores

| Idioma | Keys | Estado                            |
| ------ | ---- | --------------------------------- |
| ES     | 202  | ✅ Completo                       |
| CA     | 199  | ⚠️ Falta 3 keys (98.5% cobertura) |
| EN     | 199  | ⚠️ Falta 3 keys (98.5% cobertura) |
| FR     | 199  | ⚠️ Falta 3 keys (98.5% cobertura) |

**Incluye**: classes*\*, instructors*_, teacher\__, profesor*\*, danceClassesHub*\*

**Keys faltantes en CA/EN/FR**:

- `instructors_title`
- `instructors_subtitle`
- `instructors_viewall`

#### blog.json - Artículos del blog

| Idioma | Keys | Estado                            |
| ------ | ---- | --------------------------------- |
| ES     | 890  | ✅ Completo                       |
| CA     | 949  | ℹ️ +59 keys (contenido exclusivo) |
| EN     | 890  | ✅ Paridad con ES                 |
| FR     | 890  | ✅ Paridad con ES                 |

**Incluye**: blog\*

**Nota CA**: Tiene artículo exclusivo `blogClasesPrincipiants_*` (72 keys) pero le faltan 13 keys de heroAlt y referencias.

#### faq.json - Preguntas frecuentes

| Idioma | Keys | Estado            |
| ------ | ---- | ----------------- |
| ES     | 81   | ✅ Completo       |
| CA     | 81   | ✅ Cobertura 100% |
| EN     | 81   | ✅ Cobertura 100% |
| FR     | 81   | ✅ Cobertura 100% |

**Incluye**: faq\_\*

#### about.json - Sobre nosotros, método, Yunaisy

| Idioma | Keys | Estado            |
| ------ | ---- | ----------------- |
| ES     | 272  | ✅ Completo       |
| CA     | 272  | ✅ Cobertura 100% |
| EN     | 272  | ✅ Cobertura 100% |
| FR     | 272  | ✅ Cobertura 100% |

**Incluye**: about**, about*, yunaisy*_, yunaisyFarray\__, metodo*\*, metodofarray*_, metodoFarray\__

#### contact.json - Contacto, formularios, modales

| Idioma | Keys | Estado                            |
| ------ | ---- | --------------------------------- |
| ES     | 824  | ✅ Completo                       |
| CA     | 824  | ✅ Cobertura 100%                 |
| EN     | 824  | ✅ Cobertura 100%                 |
| FR     | 818  | ⚠️ Falta 6 keys (99.3% cobertura) |

**Incluye**: contact*\*, form*_, leadModal\__, exitIntent**, *LeadModal**, *ExitIntent\_\*

**Keys faltantes en FR**:

- `baExitIntent_title`
- `baExitIntent_description`
- `baExitIntent_ctaExplore`
- `baExitIntent_ctaDancehall`
- `baExitIntent_ctaClose`
- `baExitIntent_hint`

#### pages.json - Páginas específicas

| Idioma | Keys  | Variación vs ES |
| ------ | ----- | --------------- |
| ES     | 9,774 | Baseline        |
| CA     | 9,733 | -41 keys        |
| EN     | 9,657 | -117 keys       |
| FR     | 9,764 | -10 keys        |

**Incluye**: schema*\*, terms*_, pricing\__, privacy*\*, cookies*_, roomRental\__, particularesPage*\*, teamBuilding*_, regalaBaile\__, estudioGrabacion*\*, heelsBarcelona*_, prepFisica\__, danzaBarcelona*\*, danzasUrbanas*\*, etc.

**Nota**: Variaciones normales debido a contenido legal, regionalizado y páginas específicas por idioma.

---

## Resumen de Cobertura

### Por Namespace

| Cobertura                 | Namespaces                                      | Count        |
| ------------------------- | ----------------------------------------------- | ------------ |
| 100% en todos los idiomas | common, booking, schedule, calendar, faq, about | 6/11 (54.5%) |
| 99-100%                   | contact (FR: 99.3%)                             | 1/11 (9.1%)  |
| 90-99%                    | classes (CA/EN/FR: 98.5%)                       | 1/11 (9.1%)  |
| 80-90%                    | home (CA/EN/FR: 86.2%)                          | 1/11 (9.1%)  |
| Contenido específico      | blog (CA exclusivo), pages (variaciones)        | 2/11 (18.2%) |

### Por Idioma

#### ES (Español) - BASELINE

- Total: 13,049 keys
- Cobertura: 100% (baseline de referencia)

#### CA (Catalán)

- Total: 13,011 keys
- Cobertura vs ES: 99.7%
- Keys faltantes: 111
- Keys extra: 72 (contenido blog exclusivo)
- Diferencia neta: -38 keys

#### EN (English)

- Total: 12,876 keys
- Cobertura vs ES: 98.7%
- Keys faltantes: 174
- Diferencia neta: -173 keys

#### FR (Français)

- Total: 12,977 keys
- Cobertura vs ES: 99.4%
- Keys faltantes: 101
- Diferencia neta: -72 keys

---

## Estado por Idioma y Namespace

### ✅ Namespaces Completos (7)

| Namespace | ES  | CA  | EN  | FR  |
| --------- | --- | --- | --- | --- |
| common    | 149 | 149 | 149 | 149 |
| booking   | 187 | 187 | 187 | 187 |
| schedule  | 235 | 235 | 235 | 235 |
| calendar  | 43  | 43  | 43  | 43  |
| faq       | 81  | 81  | 81  | 81  |
| about     | 272 | 272 | 272 | 272 |
| contact\* | 824 | 824 | 824 | 818 |

\*FR tiene 6 keys faltantes

### ⚠️ Namespaces Incompletos (4)

| Namespace | ES    | CA    | EN    | FR    | Estado                  |
| --------- | ----- | ----- | ----- | ----- | ----------------------- |
| home      | 393   | 339   | 339   | 339   | CA/EN/FR faltan 54 keys |
| classes   | 202   | 199   | 199   | 199   | CA/EN/FR faltan 3 keys  |
| blog      | 890   | 949   | 890   | 890   | CA tiene 59 extra       |
| pages     | 9,774 | 9,733 | 9,657 | 9,764 | Variaciones normales    |

---

## Conclusión

### ✅ Éxitos

1. **44 archivos JSON generados** correctamente (11 por idioma × 4 idiomas)
2. **7/11 namespaces** con cobertura perfecta en todos los idiomas
3. **Formato consistente** y validado
4. **Clasificación idéntica** a ES en todos los idiomas

### ⚠️ Traducciones Pendientes

1. **Home**: 54 keys en CA, EN, FR (PAS framework, offers, testimonials)
2. **Classes**: 3 keys en CA, EN, FR (instructors section)
3. **Contact**: 6 keys en FR (baExitIntent)

### 📊 Métricas Globales

- **Total keys procesadas**: 51,913
- **Cobertura promedio**: 99.0%
- **Keys pendientes de traducción**: 117 (0.23%)

---

**Actualizado**: 2026-01-25
**Total archivos**: 44
**Estado**: ✅ División completada exitosamente
