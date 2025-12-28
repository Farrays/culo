# Reporte de Traducciones Faltantes

**Fecha:** 2025-12-24
**Generado por:** extract-missing-keys.mjs y extract-all-missing-keys.mjs

---

## Resumen Ejecutivo

### Total de Claves por Idioma

| Idioma           | Total de Claves | Estado           |
| ---------------- | --------------- | ---------------- |
| **ES (Español)** | 8,981           | Idioma base      |
| **CA (Catalán)** | 9,232           | 253 claves extra |
| **EN (Inglés)**  | 9,144           | 165 claves extra |
| **FR (Francés)** | 9,231           | 252 claves extra |

---

## Situación Actual

### 1. Claves que FALTAN en otros idiomas (están en ES pero NO en CA/EN/FR)

#### Faltan en **TODOS** los idiomas (CA, EN, FR): **1,026 claves**

Estas son las claves nuevas agregadas recientemente al español que aún no están traducidas a ningún idioma.

**Top 20 prefijos con más claves faltantes:**

| Prefijo                 | Cantidad |
| ----------------------- | -------- |
| homev                   | 121      |
| bachataV                | 84       |
| dhLeadModal             | 43       |
| testClassTransform      | 24       |
| cuerpofitFaqQ           | 15       |
| cuerpofitFaqA           | 15       |
| fullBodyCardioFaqQ      | 15       |
| fullBodyCardioFaqA      | 15       |
| cuerpofitWhyChoose      | 14       |
| bailemanananasWhyChoose | 14       |
| bailemanananasFaqQ      | 14       |
| bailemanananasFaqA      | 14       |
| fullBodyCardioWhyChoose | 14       |
| cuerpofitTransform      | 12       |
| bailemanananasTransform | 12       |
| fullBodyCardioTransform | 12       |
| testClassWhyChoose      | 12       |
| fbLandingValue          | 10       |
| dhLandingWhyTitle       | 7        |
| dhLandingWhyDesc        | 7        |

**Páginas afectadas:**

- Homepage V2 (121 claves con prefijo `homev`)
- Bachata V (84 claves)
- Cuerpo-Fit (múltiples claves)
- Full Body Cardio (múltiples claves)
- Baile Mañanas (múltiples claves)
- Test Class (múltiples claves)
- Dancehall Landing (múltiples claves)
- Landing genérico (múltiples claves)

#### Faltan SOLO en CA (Catalán): **2 claves**

- `Metales`
- `Modalidades`

#### Faltan SOLO en EN (Inglés): **2 claves**

- `Metales`
- `Modalities`

#### Faltan SOLO en FR (Francés): **0 claves**

---

### 2. Claves EXTRA (están en otros idiomas pero NO en ES)

Estas son claves que fueron agregadas a las traducciones pero que no existen en el español base.

#### Extra en CA (Catalán): **253 claves**

**Principales categorías:**

- `bachataV3*` - 84 claves (nueva versión de página de bachata no implementada)
- `blog_*` - 17 claves (sistema de blog)
- `facilities*` - 12 claves (instalaciones)
- `particularesPage_*` - 48 claves (clases particulares)
- `hiphop*` - 52 claves (hip hop)
- `home_categories_*` - 10 claves (categorías de homepage)
- `rcb*` - 11 claves (Reggaeton Cubano)
- `salsaCubana*` - 9 claves (Salsa Cubana)

#### Extra en EN (Inglés): **165 claves**

**Principales categorías:**

- `bachataV3*` - 84 claves
- `blog_*` - 17 claves
- `facilities*` - 12 claves
- `particularesPage_*` - 48 claves
- `home_categories_*` - 4 claves
- `salsaCubana*` - 6 claves

#### Extra en FR (Francés): **252 claves**

**Principales categorías:**

- `bachataV3*` - 84 claves
- `blog_*` - 17 claves
- `facilities*` - 12 claves
- `particularesPage_*` - 48 claves
- `hiphop*` - 52 claves
- `home_categories_*` - 10 claves
- `rcb*` - 11 claves
- `salsaCubana*` - 9 claves

---

## Análisis de Solapamiento

| Situación                                          | Cantidad |
| -------------------------------------------------- | -------- |
| Claves faltantes en **los 3 idiomas** (CA, EN, FR) | 1,026    |
| Claves faltantes **solo en CA y EN**               | 0        |
| Claves faltantes **solo en CA y FR**               | 0        |
| Claves faltantes **solo en EN y FR**               | 0        |
| Claves faltantes **solo en CA**                    | 0        |
| Claves faltantes **solo en EN**                    | 0        |
| Claves faltantes **solo en FR**                    | -2       |

---

## Archivos Generados

1. **missing_translations.json** - 1,024 pares clave-valor de las claves que faltan en todos los idiomas
2. **missing_translations_detailed.json** - Reporte completo con todas las claves por idioma
3. **missing_translations_ca.json** - Claves faltantes para catalán (0 pares)
4. **missing_translations_en.json** - Claves faltantes para inglés (0 pares)
5. **missing_translations_fr.json** - Claves faltantes para francés (0 pares)

---

## Recomendaciones

### Prioridad Alta

1. **Traducir las 1,026 claves faltantes en todos los idiomas**
   - Usar el archivo `missing_translations.json` como referencia
   - Priorizar páginas principales: Homepage V2, Bachata V, Cuerpo-Fit, etc.

### Prioridad Media

2. **Agregar al español las claves "extra" que están en otros idiomas**
   - Revisar las 253 claves extra en CA/FR y 165 en EN
   - Determinar si son claves necesarias o código muerto
   - Especialmente: `bachataV3*`, `blog_*`, `facilities*`, `particularesPage_*`

3. **Agregar las 2 claves faltantes en CA y EN**
   - `Metales` y `Modalidades` (CA tiene `Modalitats`, EN tiene `Modalities`)

### Prioridad Baja

4. **Limpiar claves obsoletas**
   - Si las claves extra no se usan, eliminarlas de CA, EN, FR
   - Mantener consistencia entre todos los idiomas

---

## Notas Técnicas

- El análisis se realizó usando expresiones regulares en los archivos `.ts` de i18n/locales
- Las claves se extraen con el patrón: `/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm`
- Se excluyen palabras clave: `export`, `default`, `const`

---

## Scripts Utilizados

1. `scripts/extract-missing-keys.mjs` - Extrae claves faltantes en TODOS los idiomas
2. `scripts/extract-all-missing-keys.mjs` - Análisis detallado por idioma
3. `scripts/extract-reverse-missing-keys.mjs` - Análisis de claves extra
