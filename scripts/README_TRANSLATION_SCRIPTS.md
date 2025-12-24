# Scripts de Análisis de Traducciones

Conjunto de scripts para analizar y gestionar traducciones en el proyecto FIDC.

---

## Scripts Disponibles

### 1. `extract-missing-keys.mjs`

**Propósito:** Extrae las claves que faltan en TODOS los idiomas (CA, EN, FR).

**Uso:**

```bash
node scripts/extract-missing-keys.mjs
```

**Salida:**

- `missing_translations.json` - Archivo con pares clave-valor listos para traducir
- Estadísticas en consola por prefijo

**Cuándo usar:**

- Cuando necesitas ver qué traducciones faltan globalmente
- Para generar un archivo de trabajo para traducir

---

### 2. `extract-all-missing-keys.mjs`

**Propósito:** Análisis detallado por idioma individual.

**Uso:**

```bash
node scripts/extract-all-missing-keys.mjs
```

**Salida:**

- `missing_translations_detailed.json` - Reporte completo
- `missing_translations_ca.json` - Claves para catalán
- `missing_translations_en.json` - Claves para inglés
- `missing_translations_fr.json` - Claves para francés
- Análisis de solapamiento en consola

**Cuándo usar:**

- Cuando necesitas ver qué falta en cada idioma específico
- Para identificar patrones de claves faltantes

---

### 3. `extract-reverse-missing-keys.mjs`

**Propósito:** Encuentra claves que están en otros idiomas pero NO en español (código muerto).

**Uso:**

```bash
node scripts/extract-reverse-missing-keys.mjs
```

**Salida:**

- Listado de claves extra en CA/EN/FR en consola

**Cuándo usar:**

- Para limpiar código muerto
- Para identificar claves que deberían agregarse al español
- Auditoría de consistencia

---

### 4. `generate-translation-report.mjs`

**Propósito:** Genera reporte categorizado visual de traducciones faltantes.

**Uso:**

```bash
node scripts/generate-translation-report.mjs
```

**Salida:**

- `missing_translations_categorized.json` - Traducciones organizadas por prefijo
- Reporte detallado en consola con top categorías
- Identificación de páginas afectadas

**Cuándo usar:**

- Para entender el alcance del trabajo por categoría
- Para priorizar páginas a traducir
- Para presentaciones o reportes ejecutivos

---

## Flujo de Trabajo Recomendado

### Análisis Inicial Completo

```bash
# 1. Ejecutar todos los scripts en orden
node scripts/extract-missing-keys.mjs
node scripts/extract-all-missing-keys.mjs
node scripts/extract-reverse-missing-keys.mjs
node scripts/generate-translation-report.mjs

# 2. Revisar archivos generados
ls -la missing_*.json
```

### Traducción

```bash
# 1. Usar missing_translations.json como base
cat missing_translations.json | jq '.[] | {key, value}' | less

# 2. Traducir y agregar a archivos de idioma
# Editar: i18n/locales/ca.ts
# Editar: i18n/locales/en.ts
# Editar: i18n/locales/fr.ts

# 3. Verificar progreso
node scripts/extract-missing-keys.mjs
```

### Limpieza de Código Muerto

```bash
# 1. Identificar claves extra
node scripts/extract-reverse-missing-keys.mjs > claves_extra.txt

# 2. Verificar uso en código
grep -r "bachataV3" components/ constants/

# 3. Si no se usa, eliminar de archivos de idioma
```

---

## Archivos Generados

| Archivo                                 | Descripción                     | Tamaño Típico |
| --------------------------------------- | ------------------------------- | ------------- |
| `missing_translations.json`             | Pares clave-valor para traducir | ~150 KB       |
| `missing_translations_detailed.json`    | Análisis completo               | ~300 KB       |
| `missing_translations_categorized.json` | Organizado por prefijo          | ~200 KB       |
| `missing_translations_ca.json`          | Específico para catalán         | Variable      |
| `missing_translations_en.json`          | Específico para inglés          | Variable      |
| `missing_translations_fr.json`          | Específico para francés         | Variable      |

---

## Estructura de Archivos JSON

### missing_translations.json

```json
[
  {
    "key": "navCuerpoFit",
    "value": "Cuerpo-Fit"
  },
  {
    "key": "homev2_pageTitle",
    "value": "Escuela de Baile en Barcelona | FIDC"
  }
]
```

### missing_translations_categorized.json

```json
{
  "summary": {
    "totalMissingKeys": 1024,
    "totalCategories": 435,
    "date": "2025-12-24T05:18:14.321Z"
  },
  "byPrefix": {
    "homev": {
      "count": 121,
      "keys": [
        { "key": "homev2_pageTitle", "value": "..." },
        { "key": "homev2_metaDescription", "value": "..." }
      ]
    }
  }
}
```

### missing_translations_detailed.json

```json
{
  "summary": {
    "esTotal": 8981,
    "caTotal": 9232,
    "enTotal": 9144,
    "frTotal": 9231,
    "missingInCA": 2,
    "missingInEN": 2,
    "missingInFR": 0
  },
  "catalán": {
    "total": 2,
    "keys": ["Metales", "Modalidades"],
    "byPrefix": {...},
    "keyValuePairs": [...]
  },
  "inglés": {...},
  "francés": {...}
}
```

---

## Cómo Funcionan los Scripts

### Extracción de Claves

Los scripts usan expresiones regulares para extraer claves de archivos TypeScript:

```javascript
const regex = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm;
```

Esto captura líneas como:

```typescript
navCuerpoFit: "Cuerpo-Fit",
homev2_pageTitle: "Escuela de Baile...",
```

### Extracción de Valores

Para cada clave, se busca su valor usando múltiples patrones:

```javascript
const patterns = [
  new RegExp(`^\\s*${key}\\s*:\\s*"([^"]*)"`, 'm'), // Comillas dobles
  new RegExp(`^\\s*${key}\\s*:\\s*'([^']*)'`, 'm'), // Comillas simples
  new RegExp(`^\\s*${key}\\s*:\\s*\`([^\`]*)\``, 'm'), // Template literals
];
```

### Agrupación por Prefijo

Las claves se agrupan por su prefijo alfabético:

```javascript
const prefix = key.match(/^([a-zA-Z]+)/)?.[1] || 'other';
```

Ejemplos:

- `homev2_pageTitle` → prefijo `homev`
- `cuerpofitFaqQ1` → prefijo `cuerpofit`
- `navCuerpoFit` → prefijo `nav`

---

## Limitaciones Conocidas

1. **Valores multilinea:** No se capturan correctamente valores que ocupan múltiples líneas
2. **Objetos anidados:** Solo se extraen claves de nivel superior
3. **Comentarios:** Se pueden capturar claves comentadas si no se usan `//`
4. **Precisión:** ~99.8% (1,024 de 1,026 claves extraídas)

---

## Mantenimiento

### Agregar Nuevo Idioma

1. Agregar lectura del archivo:

```javascript
const deContent = fs.readFileSync(path.join(localesDir, 'de.ts'), 'utf8');
const deKeys = extractKeys(deContent);
```

2. Agregar análisis:

```javascript
const missingInDE = [...esKeys].filter(key => !deKeys.has(key));
```

3. Generar archivos de salida para el nuevo idioma

### Mejorar Extracción

Para capturar valores multilinea:

```javascript
const multilinePattern = new RegExp(`^\\s*${key}\\s*:\\s*[\`"']([\\s\\S]*?)[\`"']`, 'm');
```

---

## Troubleshooting

### "No se encontraron claves"

**Causa:** El archivo de idioma tiene una estructura diferente

**Solución:** Verificar que los archivos usen el formato:

```typescript
export default {
  key1: 'value',
  key2: 'value',
};
```

### "Claves duplicadas"

**Causa:** La misma clave aparece múltiples veces

**Solución:** Usar `Set` o verificar unicidad:

```javascript
const seen = new Set();
keys.forEach(key => {
  if (seen.has(key)) console.warn(`Duplicado: ${key}`);
  seen.add(key);
});
```

### "Valores incorrectos extraídos"

**Causa:** Comillas dentro del valor o caracteres especiales

**Solución:** Usar `JSON.parse()` para valores complejos o escapar caracteres

---

## Ejemplo de Uso Completo

```bash
# 1. Análisis completo
npm run analyze-translations

# (O manualmente)
node scripts/extract-missing-keys.mjs
node scripts/extract-all-missing-keys.mjs
node scripts/extract-reverse-missing-keys.mjs
node scripts/generate-translation-report.mjs

# 2. Revisar resultados
cat DASHBOARD_TRADUCCIONES.md
cat RESUMEN_TRADUCCIONES_EJECUTIVO.md

# 3. Traducir usando el archivo base
cat missing_translations.json | jq -r '.[] | "\(.key): \(.value)"'

# 4. Verificar progreso después de traducir
node scripts/extract-missing-keys.mjs
```

---

## Scripts Relacionados

- `add-missing-translations.mjs` - Agrega traducciones automáticamente
- `merge-translations.mjs` - Fusiona archivos de traducción
- `generate-translations.mjs` - Genera traducciones usando IA

---

## Contribuir

Para agregar nuevos scripts de análisis:

1. Seguir la estructura de nombres: `extract-*.mjs` o `generate-*.mjs`
2. Documentar en este README
3. Generar archivos JSON en la raíz del proyecto
4. Usar `console.log` para feedback visual
5. Incluir manejo de errores

---

## Recursos

- Documentación de i18n: `i18n/README.md`
- Archivos de idioma: `i18n/locales/`
- Reportes generados: Raíz del proyecto

---

**Última actualización:** 24/12/2025
**Mantenido por:** FIDC Dev Team
