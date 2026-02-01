# PROMPT MAESTRO - Creación de Artículos GEO-Optimizados para Farray's Blog

> **Uso**: Copia este prompt en Perplexity Pro o ChatGPT-4, adapta la sección "KEYWORD OBJETIVO" y pega el resultado a Claude Code para convertirlo al formato del blog.

---

## INSTRUCCIONES PARA CLAUDE CODE

Cuando quieras crear un nuevo artículo, dime:

```
Adapta el PROMPT-BLOG.md para la keyword: "[tu keyword]"
```

Yo modificaré las secciones necesarias y te daré el prompt listo para Perplexity.

---

## CONTEXTO DEL PROYECTO

Eres un experto en GEO (Generative Engine Optimization) y SEO semántico creando contenido para el blog de **Farray's International Dance Center**, una academia de danza ubicada en el Eixample Izquierdo de Barcelona.

### Objetivo Principal

Crear contenido que:

1. Posicione en Google para keywords de alta intención
2. Sea citado por IAs (ChatGPT, Perplexity, Google AI Overview, Bing Copilot)
3. Demuestre E-E-A-T (Experiencia, Expertise, Autoridad, Confiabilidad)
4. Convierta visitantes en alumnos

### Datos de la Marca

| Campo            | Valor                                                                            |
| ---------------- | -------------------------------------------------------------------------------- |
| **Nombre**       | Farray's International Dance Center (FIDC)                                       |
| **Fundadora**    | Yunaisy Farray                                                                   |
| **Credenciales** | Bailarina cubana, 20+ años experiencia, CID-UNESCO                               |
| **Ubicación**    | Eixample Izquierdo, Barcelona                                                    |
| **Estilos**      | Salsa cubana, bachata, contemporáneo, jazz, heels, dancehall, ballet, stretching |
| **URL base**     | https://farrayscenter.com                                                        |

---

## 🎯 KEYWORD OBJETIVO (ADAPTAR PARA CADA ARTÍCULO)

```yaml
keyword_principal: 'academia de danza en Barcelona'
intencion_busqueda: 'informacional-transaccional'
categoria_blog: 'tips' # opciones: tutoriales, tips, historia, fitness, lifestyle
volumen_estimado: 'medio-alto'
dificultad: 'media'
```

### Variaciones Semánticas a Incluir

- academias de baile Barcelona
- escuela de danza Barcelona
- centro de danza Barcelona
- aprender a bailar Barcelona
- clases de baile profesionales Barcelona

### Enfoque Diferenciador

> Describir qué ángulo único tendrá este artículo para no canibalizar contenido existente.

**Para "academia de danza en Barcelona":**

- Qué hace diferente a una academia profesional vs clases sueltas
- Criterios para elegir una buena academia de danza
- La importancia de la metodología y profesores certificados
- Variedad de estilos bajo un mismo techo
- Comunidad y ambiente en una academia

---

## ⚠️ ARTÍCULOS EXISTENTES (EVITAR CANIBALIZACIÓN)

NO cubrir estos temas que ya están posicionados:

| Slug                                   | Tema Principal              | Keywords Protegidas              |
| -------------------------------------- | --------------------------- | -------------------------------- |
| `beneficios-bailar-salsa`              | Beneficios de bailar salsa  | beneficios salsa, salsa salud    |
| `historia-salsa-barcelona`             | Historia de la salsa        | origen salsa, historia salsa     |
| `historia-bachata-barcelona`           | Historia de la bachata      | origen bachata, historia bachata |
| `salsa-vs-bachata`                     | Comparativa de estilos      | salsa o bachata, diferencias     |
| `clases-de-salsa-barcelona`            | Clases de salsa             | clases salsa barcelona           |
| `clases-baile-principiantes-barcelona` | Nivel principiante          | principiantes, empezar bailar    |
| `como-perder-miedo-bailar`             | Superar el miedo            | miedo bailar, vergüenza          |
| `baile-salud-mental`                   | Beneficios psicológicos     | ansiedad, depresión, bienestar   |
| `salsa-ritmo-conquisto-mundo`          | Historia global de la salsa | salsa mundo, expansión salsa     |

---

## 📋 ESTRUCTURA REQUERIDA DEL ARTÍCULO

### 1. METADATOS SEO

```json
{
  "title": "[Título SEO 55-60 caracteres con keyword principal]",
  "metaDescription": "[Meta descripción 150-160 caracteres, incluir keyword y CTA implícito]",
  "excerpt": "[Resumen 2-3 frases para cards y previews]",
  "slug": "[slug-url-friendly]",
  "category": "[tutoriales|tips|historia|fitness|lifestyle]",
  "readingTime": 12,
  "wordCount": 2500
}
```

### 2. SUMMARY BULLETS (4 puntos clave)

Datos verificables que resuman el valor del artículo:

```markdown
1. [Dato estadístico o beneficio clave 1]
2. [Dato estadístico o beneficio clave 2]
3. [Dato estadístico o beneficio clave 3]
4. [Fuente o credencial que respalde el contenido]
```

### 3. ESTADÍSTICAS CON CITAS (3-4 stats)

**CRÍTICO**: Solo usar fuentes REALES y verificables.

```json
[
  {
    "value": "76%",
    "label": "descripción corta de la estadística",
    "citation": {
      "source": "New England Journal of Medicine",
      "url": "https://www.nejm.org/doi/full/10.1056/NEJMoa022252",
      "year": "2003",
      "authors": "Verghese et al.",
      "doi": "10.1056/NEJMoa022252"
    }
  }
]
```

**Fuentes recomendadas para buscar estadísticas:**

- PubMed / NCBI
- Google Scholar
- Harvard Health Publishing
- UNESCO
- Frontiers in Psychology
- ScienceDirect

### 4. ANSWER CAPSULES (mínimo 3)

> **GEO Critical**: 72% tasa de citación por IAs

```json
[
  {
    "question": "¿Pregunta directa que un usuario haría a una IA?",
    "answer": "Respuesta concisa 2-3 oraciones máximo, con datos verificables si es posible.",
    "sourcePublisher": "Nombre de fuente si aplica",
    "sourceUrl": "URL si aplica",
    "sourceYear": "2024",
    "confidence": "verified",
    "icon": "check"
  }
]
```

**Tipos de confidence:**

- `verified`: Respaldado por estudio científico
- `high`: Basado en experiencia profesional documentada
- `moderate`: Opinión experta o consenso del sector

**Tipos de icon:**

- `check`: Dato verificado
- `lightbulb`: Consejo/insight
- `star`: Destacado
- `info`: Información general

### 5. DEFINICIONES (2-3 términos)

```json
[
  {
    "term": "Término a definir",
    "definition": "Definición clara y concisa, 1-2 oraciones que una IA pueda extraer fácilmente."
  }
]
```

### 6. ESTRUCTURA DE SECCIONES (6-8 H2)

```markdown
## Introducción

[Párrafo que enganche, presente el tema e incluya keyword principal]

## [H2 Sección 1 - con keyword o variación]

[Contenido con datos, links internos, menciones naturales a Farray's]

## [H2 Sección 2]

[...]

## [H2 Sección 3]

[...]

## [H2 Sección 4]

[...]

## [H2 Sección 5]

[...]

## Conclusión

[Resumen + CTA hacia clases/contacto]
```

### 7. CONTENIDO DE CADA SECCIÓN

Para cada sección incluir:

```markdown
## [Título H2]

[Párrafo introductorio 2-3 oraciones]

[Contenido principal con:]

- Datos verificables con fuentes entre corchetes [Fuente](URL)
- Links internos: [texto del link](/es/ruta-interna)
- Estadísticas inline cuando aplique
- Mención natural de Farray's (no forzada)

[Si es lista, 4-6 ítems con explicación breve cada uno]
```

### 8. TABLA COMPARATIVA (si aplica)

```markdown
| Aspecto | Opción A | Opción B |
| ------- | -------- | -------- |
| [...]   | [...]    | [...]    |
| [...]   | [...]    | [...]    |
```

### 9. FAQs (6-8 preguntas)

Basadas en "People Also Ask" de Google:

```json
[
  {
    "question": "¿Pregunta natural que haría un usuario?",
    "answer": "Respuesta completa pero concisa, 2-4 oraciones. Incluir datos si es posible."
  }
]
```

### 10. REFERENCIAS (5-7 fuentes)

```json
[
  {
    "title": "Título descriptivo de la fuente",
    "url": "https://url-verificable.com/articulo",
    "publisher": "Nombre del editor/institución",
    "year": "2024",
    "description": "Por qué es relevante esta fuente para el artículo"
  }
]
```

### 11. CALLOUTS

**Tip:**

```markdown
💡 **Consejo**: [Tip práctico y accionable relacionado con el tema]
```

**CTA:**

```markdown
🎯 **[Texto CTA hacia clases o contacto de Farray's con link interno]**
```

### 12. TESTIMONIAL (opcional)

```json
{
  "text": "Testimonio de un alumno real o representativo",
  "authorName": "Nombre",
  "authorLocation": "Barcelona",
  "rating": 5,
  "datePublished": "2025-01-15",
  "reviewOf": "course"
}
```

---

## 📐 REGLAS DE PROMINENCIA SEMÁNTICA (TIF)

### Keyword Principal

- **Ubicación obligatoria**: título, H1, meta description, primer párrafo, 1 H2, conclusión
- **Densidad**: 0.8-1.2% del texto total
- **Variaciones**: usar sinónimos naturalmente

### Keywords Secundarias

Distribuir naturalmente a lo largo del texto:

- [Listar 4-6 keywords secundarias específicas para el artículo]

### Entidades Semánticas a Mencionar

- **Ubicación**: Barcelona, Eixample, Catalunya
- **Estilos**: salsa, bachata, contemporáneo, jazz, heels, dancehall
- **Instituciones**: CID-UNESCO, federaciones de danza
- **Beneficios**: salud, comunidad, técnica, expresión, confianza

### Links Internos Sugeridos

| Texto del link      | Ruta                                |
| ------------------- | ----------------------------------- |
| clases              | /es/clases                          |
| profesores de baile | /es/profesores-baile-barcelona      |
| horarios            | /es/horarios-clases-baile-barcelona |
| precios             | /es/precios-clases-baile-barcelona  |
| Método Farray       | /es/metodo-farray                   |
| contacto            | /es/contacto                        |
| salsa cubana        | /es/clases/salsa-cubana-barcelona   |
| bachata             | /es/clases/bachata-barcelona        |

---

## 📤 FORMATO DE ENTREGA

Estructura tu respuesta exactamente así:

```markdown
# METADATOS

[JSON con title, metaDescription, excerpt, slug, category, readingTime, wordCount]

# SUMMARY BULLETS

1. [...]
2. [...]
3. [...]
4. [...]

# ESTADÍSTICAS (summaryStats)

[JSON array con 3-4 estadísticas y citas verificables]

# ANSWER CAPSULES

[JSON array con 3+ answer capsules]

# DEFINICIONES

[JSON array con 2-3 definiciones]

# CONTENIDO DEL ARTÍCULO

## [Título H2 Sección 1]

[Contenido completo con markdown, links internos, datos con fuentes]

## [Título H2 Sección 2]

[...]

[... continuar con todas las secciones]

# TABLA COMPARATIVA

[Tabla en markdown si aplica]

# FAQs

[JSON array con 6-8 FAQs]

# REFERENCIAS

[JSON array con 5-7 referencias verificables]

# CALLOUTS

[Tip y CTA]

# TESTIMONIAL

[JSON si aplica]
```

---

## ✅ CHECKLIST FINAL

Antes de entregar, verificar:

- [ ] Keyword principal aparece en título, meta, intro y conclusión
- [ ] 3+ Answer Capsules con preguntas directas
- [ ] 3-4 estadísticas con URLs de fuentes reales
- [ ] 2-3 definiciones claras y citables
- [ ] 6-8 FAQs basadas en intención de búsqueda
- [ ] 5-7 referencias verificables
- [ ] Links internos naturales a páginas de Farray's
- [ ] No canibaliza artículos existentes
- [ ] Tono profesional pero cercano
- [ ] 2500-3000 palabras de contenido
- [ ] Menciones a Barcelona/Eixample para Local SEO

---

## 🔄 INSTRUCCIONES FINALES

1. **Tono**: Profesional pero cercano, experto pero accesible
2. **Longitud**: 2500-3000 palabras de contenido principal
3. **Fuentes**: SOLO usar fuentes reales y verificables con URLs funcionales
4. **Honestidad**: Si no encuentras una estadística, indica "[VERIFICAR]"
5. **GEO first**: Priorizar elementos citables por IAs
6. **E-E-A-T**: Demostrar experiencia y autoridad en cada sección
7. **Local SEO**: Mencionar Barcelona naturalmente
8. **Evitar**: Redundancia con artículos existentes

---

## 📝 NOTAS PARA CLAUDE CODE

Cuando el usuario pegue el resultado de Perplexity, debo:

1. **Crear el archivo de configuración** en `constants/blog/articles/[slug].ts`
2. **Añadir las traducciones** a `i18n/locales/es/blog.json`
3. **Actualizar** `constants/blog/index.ts` para exportar el nuevo artículo
4. **Añadir rutas** en `prerender.mjs` para los 4 idiomas
5. **Verificar** que no hay errores de TypeScript

---

_Última actualización: Enero 2026_
_Versión del prompt: 1.0_
