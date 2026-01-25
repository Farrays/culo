# Índice de Documentación - División de Traducciones

## 📚 Documentos Principales

### 1. Resumen Ejecutivo (Empieza aquí)

**Archivo**: `TRADUCCIONES_RESUMEN_EJECUTIVO.md`

- Resumen de alto nivel de la tarea completada
- Métricas principales
- Próximos pasos
- Recomendado para stakeholders y overview rápido

### 2. Resumen Completo

**Archivo**: `DIVISION_TRADUCCIONES_RESUMEN.md`

- Análisis detallado de diferencias
- Explicación de variaciones
- Recomendaciones priorizadas
- Comandos de verificación

### 3. Desglose por Namespace

**Archivo**: `KEYS_POR_NAMESPACE.md`

- Tabla comparativa completa
- Categorización por tipo de carga (CORE/EAGER/LAZY)
- Estado de cobertura por namespace
- Resumen de keys faltantes

### 4. Comparación entre Idiomas

**Archivo**: `TRANSLATION_COMPARISON.md`

- Tabla de comparación detallada
- Análisis de diferencias
- Ejemplos de traducciones verificadas
- Comandos de verificación específicos

### 5. Resumen Inicial de Split

**Archivo**: `TRANSLATION_SPLIT_SUMMARY.md`

- Distribución inicial de keys
- Estructura de archivos creados
- Observaciones sobre variaciones
- Contexto histórico de la división

---

## 🛠️ Guías de Scripts

### 6. README de Scripts

**Archivo**: `scripts/README_TRANSLATIONS.md`

- Descripción de todos los scripts disponibles
- Casos de uso específicos
- Workflow recomendado
- Reglas de clasificación
- Troubleshooting

---

## 📊 Reportes Generados

### 7. Reporte de Keys Faltantes (JSON)

**Archivo**: `MISSING_KEYS_REPORT.json`

- Generado por: `scripts/find-missing-keys.mjs`
- Keys faltantes en blog EN/FR
- Keys faltantes en contact FR
- Formato JSON para procesamiento automatizado

### 8. Diferencias CA vs ES (JSON)

**Archivo**: `CA_ES_DIFFERENCES.json`

- Generado por: `scripts/analyze-ca-es-diff.mjs`
- Análisis detallado home, classes, blog, pages
- Listas completas de keys missing/extra
- Formato JSON para procesamiento automatizado

### 9. Output de Verificación

**Archivo**: `VERIFICATION_OUTPUT.txt`

- Generado por: `scripts/verify-translations.mjs`
- Tabla de conteo de keys
- Estado de validación
- Snapshot del estado actual

---

## 🔧 Scripts Disponibles

### 10. Split Translations ES

**Archivo**: `scripts/split-translations.mjs`

- Divide `es.ts` en 11 archivos JSON
- Usa parser de estado para extracción
- Genera reportes de verificación

### 11. Split Translations CA/EN/FR

**Archivo**: `scripts/split-translations-all.mjs`

- Divide `ca.ts`, `en.ts`, `fr.ts` en 11 archivos JSON
- Usa misma lógica de clasificación que ES
- Procesa los 3 idiomas en un solo comando

### 12. Find Missing Keys

**Archivo**: `scripts/find-missing-keys.mjs`

- Compara idiomas entre sí
- Identifica keys faltantes
- Genera `MISSING_KEYS_REPORT.json`

### 13. Analyze CA-ES Differences

**Archivo**: `scripts/analyze-ca-es-diff.mjs`

- Análisis detallado CA vs ES
- Identifica keys missing y extra
- Genera `CA_ES_DIFFERENCES.json`

### 14. Verify Translations (⭐ Recomendado)

**Archivo**: `scripts/verify-translations.mjs`

- Verificación completa del estado actual
- Conteo de keys por namespace
- Validación de formato JSON
- Tests de integridad

---

## 📁 Archivos JSON Generados

### Estructura

```
i18n/locales/
├── ca/ (11 archivos)
├── en/ (11 archivos)
├── fr/ (11 archivos)
└── es/ (11 archivos)
```

### Namespaces (11 por idioma = 44 archivos totales)

1. `common.json` - CORE
2. `booking.json` - EAGER
3. `schedule.json` - EAGER
4. `calendar.json` - EAGER
5. `home.json` - LAZY
6. `classes.json` - LAZY
7. `blog.json` - LAZY
8. `faq.json` - LAZY
9. `about.json` - LAZY
10. `contact.json` - LAZY
11. `pages.json` - LAZY

---

## 🗺️ Mapa de Navegación

### Para Developers

1. Empieza con: `scripts/README_TRANSLATIONS.md`
2. Luego revisa: `KEYS_POR_NAMESPACE.md`
3. Para troubleshooting: `DIVISION_TRADUCCIONES_RESUMEN.md`

### Para Product Managers

1. Empieza con: `TRADUCCIONES_RESUMEN_EJECUTIVO.md`
2. Luego revisa: `TRANSLATION_COMPARISON.md`
3. Para priorización: `DIVISION_TRADUCCIONES_RESUMEN.md` (sección "Tareas Pendientes")

### Para Translators

1. Empieza con: `MISSING_KEYS_REPORT.json` (ver keys faltantes)
2. Luego revisa: `CA_ES_DIFFERENCES.json` (comparación detallada)
3. Para contexto: `KEYS_POR_NAMESPACE.md` (ver dónde están las keys)

### Para QA

1. Ejecuta: `node scripts/verify-translations.mjs`
2. Revisa: `VERIFICATION_OUTPUT.txt`
3. Para análisis: `TRANSLATION_COMPARISON.md`

---

## 📋 Quick Reference

### Comandos Más Usados

```bash
# Verificar estado actual
node scripts/verify-translations.mjs

# Regenerar traducciones ES
node scripts/split-translations.mjs

# Regenerar traducciones CA, EN, FR
node scripts/split-translations-all.mjs

# Encontrar keys faltantes
node scripts/find-missing-keys.mjs

# Analizar diferencias CA vs ES
node scripts/analyze-ca-es-diff.mjs
```

### Archivos de Referencia Rápida

| Necesitas...       | Ve a...                             |
| ------------------ | ----------------------------------- |
| Overview general   | `TRADUCCIONES_RESUMEN_EJECUTIVO.md` |
| Keys por namespace | `KEYS_POR_NAMESPACE.md`             |
| Comparar idiomas   | `TRANSLATION_COMPARISON.md`         |
| Usar scripts       | `scripts/README_TRANSLATIONS.md`    |
| Keys faltantes     | `MISSING_KEYS_REPORT.json`          |
| Estado actual      | `VERIFICATION_OUTPUT.txt`           |

---

## 📊 Métricas Rápidas

| Métrica                       | Valor              |
| ----------------------------- | ------------------ |
| Total archivos generados      | 44                 |
| Total keys procesadas         | 51,914             |
| Idiomas soportados            | 4 (ES, CA, EN, FR) |
| Namespaces                    | 11                 |
| Cobertura promedio            | 99.0%              |
| Namespaces con cobertura 100% | 6/11 (54.5%)       |
| Scripts creados               | 5                  |
| Documentos generados          | 9                  |

---

## 🎯 Estado Actual (Snapshot)

**Fecha**: 2026-01-25

### ✅ Completado

- 44 archivos JSON generados
- Formato validado
- Scripts de gestión creados
- Documentación completa
- Verificación de integridad

### ⚠️ Pendiente

- **home.json**: 54 keys en CA, EN, FR
- **classes.json**: 3 keys en CA, EN, FR
- **contact.json**: 6 keys en FR

### 📈 Cobertura

- ES: 100% (13,050 keys)
- CA: 99.7% (13,011 keys)
- EN: 98.7% (12,876 keys)
- FR: 99.4% (12,977 keys)

---

## 🔗 Enlaces Internos

### Documentos

- [Resumen Ejecutivo](./TRADUCCIONES_RESUMEN_EJECUTIVO.md)
- [Resumen Completo](./DIVISION_TRADUCCIONES_RESUMEN.md)
- [Keys por Namespace](./KEYS_POR_NAMESPACE.md)
- [Comparación entre Idiomas](./TRANSLATION_COMPARISON.md)
- [README Scripts](./scripts/README_TRANSLATIONS.md)

### Reportes

- [Missing Keys Report](./MISSING_KEYS_REPORT.json)
- [CA-ES Differences](./CA_ES_DIFFERENCES.json)
- [Verification Output](./VERIFICATION_OUTPUT.txt)

### Scripts

- [split-translations.mjs](./scripts/split-translations.mjs)
- [split-translations-all.mjs](./scripts/split-translations-all.mjs)
- [find-missing-keys.mjs](./scripts/find-missing-keys.mjs)
- [analyze-ca-es-diff.mjs](./scripts/analyze-ca-es-diff.mjs)
- [verify-translations.mjs](./scripts/verify-translations.mjs)

---

**Última actualización**: 2026-01-25
**Versión**: 1.0
**Estado**: ✅ Documentación completa
