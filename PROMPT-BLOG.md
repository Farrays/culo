# PROMPT MAESTRO v3.0 - Artículos GEO Enterprise para Farray's Blog

> **Uso**: Copia este prompt COMPLETO en Perplexity Pro, adapta SOLO la seccion "KEYWORD OBJETIVO" y pega el resultado a Claude Code para convertirlo al formato del blog.
> **Actualizado**: 11 de marzo de 2026
> **Basado en**: GEO 2026, Google March Core Update 2026, AI Overviews expansion, Perplexity Citations Protocol

---

## INSTRUCCIONES PARA CLAUDE CODE

Cuando quieras crear un nuevo articulo, dime:

```
Adapta el PROMPT-BLOG.md para la keyword: "[tu keyword]"
```

Yo modificare las secciones necesarias y te dare el prompt listo para Perplexity.

---

## ROL Y CONTEXTO

Eres un estratega de contenido senior especializado en GEO (Generative Engine Optimization), SEO semantico y linkbuilding enterprise. Creas contenido para el blog de **Farray's International Dance Center**, la academia de danza mas diversa del Eixample de Barcelona.

### Objetivo del Contenido

Crear un articulo que cumpla SIMULTANEAMENTE estos 5 objetivos:

1. **Posicionar en Google** para keywords transaccionales de alta intencion
2. **Ser citado por IAs** (ChatGPT, Perplexity, Google AI Overview, Bing Copilot, Claude)
3. **Demostrar E-E-A-T** (Experiencia, Expertise, Autoridad, Confiabilidad)
4. **Convertir visitantes en alumnos** (CTAs estrategicos, no agresivos)
5. **Construir autoridad tematica** (Topical Authority via internal linking + external citations)

### Datos de la Marca

| Campo                      | Valor                                                                                                                                                                                                                                                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nombre completo**        | Farray's International Dance Center (FIDC)                                                                                                                                                                                                                                                                                                  |
| **Nombre corto**           | Farray's Center                                                                                                                                                                                                                                                                                                                             |
| **Fundadora**              | Yunaisy Farray                                                                                                                                                                                                                                                                                                                              |
| **Credenciales fundadora** | Bailarina cubana, 20+ anos experiencia, formada en ENA (Escuela Nacional de Arte de Cuba), miembro CID-UNESCO                                                                                                                                                                                                                               |
| **Ubicacion**              | Carrer d'Entenca, 100, Local 1 - 08015 Barcelona (Eixample Izquierdo)                                                                                                                                                                                                                                                                       |
| **Coordenadas**            | 41.380421, 2.148014                                                                                                                                                                                                                                                                                                                         |
| **Telefono**               | +34 622 247 085                                                                                                                                                                                                                                                                                                                             |
| **Email**                  | info@farrayscenter.com                                                                                                                                                                                                                                                                                                                      |
| **URL base**               | https://www.farrayscenter.com                                                                                                                                                                                                                                                                                                               |
| **Google Rating**          | 4.9/5 (509+ resenas)                                                                                                                                                                                                                                                                                                                        |
| **Estilos (27+)**          | Salsa cubana, bachata sensual, bachata lady style, reggaeton cubano, sexy reggaeton, hip-hop, dancehall, afrobeats, afro-jazz, afro-contemporaneo, K-Pop, commercial dance, heels dance, sexy style, femmology, modern jazz, ballet, danza contemporanea, stretching, folklore cubano, timba, kizomba, twerk, cuerpo fit, bum bum (gluteos) |
| **Diferenciador**          | Unica academia en Barcelona con +27 estilos, Metodo Farray, profesores cubanos formados en ENA                                                                                                                                                                                                                                              |

---

## KEYWORD OBJETIVO (ADAPTAR PARA CADA ARTICULO)

```yaml
keyword_principal: 'clases de bachata en Barcelona'
intencion_busqueda: 'transaccional' # opciones: informacional, transaccional, mixta
categoria_blog: 'tips' # opciones: tutoriales, tips, historia, fitness, lifestyle
volumen_estimado: '2400-3600/mes'
dificultad_keyword: 'media-alta'
cpc_estimado: '1.20-2.50 EUR'
```

### Variaciones Semanticas (LSI Keywords)

Incluir TODAS estas variaciones naturalmente en el texto:

- [keyword variacion 1]
- [keyword variacion 2]
- [keyword variacion 3]
- [keyword variacion 4]
- [keyword variacion 5]
- [keyword variacion 6]

### Search Intent Analysis

```yaml
intent_primario: 'transaccional - quiere inscribirse a clases'
intent_secundario: 'informacional - quiere saber que estilo/nivel elegir'
pain_points:
  - 'No se si es para mi nivel'
  - 'No se que estilo elegir'
  - 'Me da verguenza empezar'
  - 'No se cuanto cuesta'
trigger_de_compra: 'Prueba gratuita, horarios flexibles, profesores expertos'
```

### Enfoque Diferenciador

> Describir que angulo unico tendra este articulo para no canibalizar contenido existente. Cada articulo debe tener un POSICIONAMIENTO UNICO.

---

## ARTICULOS EXISTENTES (EVITAR CANIBALIZACION)

**CRITICO**: NO cubrir los temas principales de estos 16 articulos ya posicionados. Puedes ENLAZAR a ellos pero NO competir por sus keywords primarias.

| #   | Slug                                           | Categoria | Tema Principal             | Keywords Protegidas                                    |
| --- | ---------------------------------------------- | --------- | -------------------------- | ------------------------------------------------------ |
| 1   | `beneficios-bailar-salsa`                      | lifestyle | Beneficios de bailar salsa | beneficios salsa, salsa salud, bailar salsa beneficios |
| 2   | `clases-de-salsa-barcelona`                    | lifestyle | Clases de salsa en BCN     | clases salsa barcelona, aprender salsa barcelona       |
| 3   | `como-perder-miedo-bailar`                     | lifestyle | Superar el miedo           | miedo bailar, verguenza bailar, timidez baile          |
| 4   | `historia-salsa-barcelona`                     | historia  | Historia de la salsa       | origen salsa, historia salsa, salsa caribe             |
| 5   | `historia-bachata-barcelona`                   | historia  | Historia de la bachata     | origen bachata, historia bachata, bachata dominicana   |
| 6   | `salsa-ritmo-conquisto-mundo`                  | historia  | Salsa global               | salsa mundo, expansion salsa, estilos salsa            |
| 7   | `salsa-vs-bachata-que-estilo-elegir`           | tips      | Comparativa salsa/bachata  | salsa o bachata, diferencias salsa bachata             |
| 8   | `clases-baile-principiantes-barcelona-farrays` | tips      | Principiantes              | clases principiantes barcelona, empezar bailar         |
| 9   | `academia-de-danza-barcelona-guia-completa`    | tips      | Guia academia danza        | academia danza barcelona, elegir academia              |
| 10  | `ballet-para-adultos-barcelona`                | tips      | Ballet adultos             | ballet adultos barcelona, empezar ballet adulto        |
| 11  | `danza-contemporanea-vs-modern-jazz-vs-ballet` | tips      | Comparativa danza          | contemporanea vs jazz vs ballet, que estilo elegir     |
| 12  | `danzas-urbanas-barcelona-guia-completa`       | tips      | Danzas urbanas             | danzas urbanas barcelona, hip hop barcelona            |
| 13  | `modern-jazz-barcelona-guia-completa`          | tips      | Modern Jazz                | modern jazz barcelona, jazz contemporaneo              |
| 14  | `baile-salud-mental`                           | fitness   | Baile y salud mental       | baile ansiedad, baile depresion, baile bienestar       |
| 15  | `clases-bachata-barcelona-guia-completa`       | tips      | Clases bachata BCN         | clases bachata barcelona, bachata sensual barcelona    |
| 16  | `clases-reggaeton-barcelona-guia-completa`     | tips      | Clases reggaeton BCN       | clases reggaeton barcelona, reggaeton cubano barcelona |

### Estrategia de Diferenciacion

Para cada nuevo articulo, DEBES:

1. Identificar que lo hace UNICO vs los 16 existentes
2. Enlazar a minimo 3 articulos existentes relevantes (refuerza cluster)
3. NO repetir estadisticas ya usadas en otros articulos (buscar nuevas)
4. Encontrar un angulo que los articulos existentes NO cubren

---

## ESTRUCTURA ENTERPRISE DEL ARTICULO

### 1. METADATOS SEO (Optimizados para CTR)

```json
{
  "title": "[55-60 chars] Keyword principal + gancho emocional | Farray's Center",
  "metaDescription": "[150-155 chars] Keyword + beneficio + CTA implicito + emoji opcional",
  "excerpt": "[2-3 frases] Resumen para cards, Google Discover y snippets",
  "slug": "[url-friendly-con-keyword-principal]",
  "category": "[tutoriales|tips|historia|fitness|lifestyle]",
  "readingTime": "[10-18 minutos]",
  "wordCount": "[2500-4500 palabras]",
  "author": {
    "name": "[Nombre del profesor/experto de Farray's]",
    "credentials": "[Formacion relevante]",
    "role": "[Cargo en Farray's]"
  }
}
```

**Reglas de titulo:**

- Keyword principal en las primeras 4 palabras
- Maximo 60 caracteres (Google trunca a 60)
- Incluir "Barcelona" si es local
- Anadir gancho: "Guia Completa", "Todo lo que Necesitas Saber", numero, ano

**Reglas de meta description:**

- Keyword en las primeras 20 palabras
- Incluir beneficio tangible
- CTA implicito ("Descubre", "Aprende", "Encuentra")
- 150-155 caracteres (Google trunca a 155)

### 2. SUMMARY BULLETS (4-5 puntos clave para GEO)

> Las IAs extraen estos bullets como "key takeaways". Son el elemento #2 mas citado despues de Answer Capsules.

```markdown
1. [Estadistica impactante con fuente] (ej: "El 76% de reduccion en demencia segun NEJM")
2. [Beneficio tangible y medible]
3. [Dato diferenciador sobre el tema]
4. [Credencial o autoridad que respalda el contenido]
5. [Dato local Barcelona si aplica]
```

### 3. ESTADISTICAS CON CITAS ACADEMICAS (4-6 stats)

> **GEO 2026**: La frecuencia optima es 1 estadistica cada 150-200 palabras. Articulos con stats tienen +40% citabilidad por IAs.

**CRITICO**: Solo usar fuentes REALES y VERIFICABLES. Si no encuentras una estadistica, marca [VERIFICAR - BUSCAR FUENTE].

```json
[
  {
    "value": "76%",
    "label": "descripcion corta y citada de la estadistica",
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

**Jerarquia de fuentes (de mayor a menor autoridad):**

| Tier | Tipo                      | Ejemplos                       | Impacto E-E-A-T |
| ---- | ------------------------- | ------------------------------ | --------------- |
| S    | Estudios peer-reviewed    | NEJM, Lancet, Nature, PNAS     | Maximo          |
| A    | Universidades top         | Harvard, MIT, Oxford, Stanford | Muy alto        |
| A    | Instituciones oficiales   | WHO, UNESCO, NIH, CDC          | Muy alto        |
| B    | Revistas especializadas   | Dance Research Journal, JOPERD | Alto            |
| B    | Medios de referencia      | BBC, NYT, El Pais              | Alto            |
| C    | Federaciones/asociaciones | CID-UNESCO, FEPD, RAD          | Medio-alto      |
| C    | Estudios de mercado       | Statista, Euromonitor          | Medio-alto      |

**Fuentes a buscar activamente:**

- PubMed / NCBI (estudios medicos sobre danza)
- Google Scholar (papers academicos)
- Harvard Health Publishing (salud y ejercicio)
- Frontiers in Psychology / Neuroscience (beneficios cognitivos)
- Journal of Dance Education (pedagogia)
- Dance Research Journal (investigacion danza)
- UNESCO (patrimonio cultural, CID)
- Statista / IHRSA (datos de mercado fitness/danza)

### 4. ANSWER CAPSULES (minimo 3, ideal 4)

> **GEO Critical**: 72% tasa de citacion por IAs. Este es el formato #1 que las IAs extraen y citan.

**Formato que maximiza citacion:**

```json
[
  {
    "question": "Pregunta EXACTA que un usuario haria a ChatGPT/Perplexity/Google AI",
    "answer": "Respuesta directa en 2-3 oraciones. Primera oracion = respuesta concreta. Segunda = dato de soporte. Tercera = contexto adicional.",
    "sourcePublisher": "Institucion o estudio que respalda",
    "sourceUrl": "https://url-verificable.com",
    "sourceYear": "2024",
    "confidence": "verified",
    "icon": "check"
  }
]
```

**Reglas para Answer Capsules enterprise:**

1. La pregunta debe ser EXACTAMENTE como la haria un usuario a una IA
2. La respuesta debe empezar con la respuesta directa (no con "Bueno, depende...")
3. Maximo 50 palabras por respuesta (las IAs prefieren concision)
4. Incluir al menos 1 dato numerico verificable
5. La primera capsule debe responder la pregunta principal del articulo

**Tipos de confidence:**

- `verified`: Respaldado por estudio cientifico con DOI/URL
- `high`: Basado en experiencia profesional documentada (>10 anos)
- `moderate`: Consenso del sector o opinion de multiples expertos

**Tipos de icon:**

- `check`: Dato verificado con fuente
- `lightbulb`: Consejo practico basado en experiencia
- `star`: Destacado/recomendacion
- `info`: Informacion contextual

### 5. DEFINICIONES GEO (2-3 terminos)

> Las IAs extraen definiciones para construir knowledge graphs. Formato optimo para LLM extraction.

```json
[
  {
    "term": "Termino tecnico o concepto clave",
    "definition": "Definicion clara en 1-2 oraciones. Debe ser auto-contenida (entendible sin contexto adicional). Incluir origen etimologico si es relevante."
  }
]
```

**Reglas:**

- Definir terminos que un principiante buscaria
- Cada definicion debe funcionar como "featured snippet" independiente
- No usar jerga dentro de la definicion

### 6. CONTENIDO DEL ARTICULO (6-8 secciones H2)

#### Estructura Obligatoria:

```markdown
## Introduccion (sin H2 visible - es el primer parrafo)

[Gancho emocional 1 oracion] + [Keyword principal natural] + [Promesa del articulo] + [Por que el lector debe seguir leyendo]

Longitud: 100-150 palabras.
Incluir: keyword principal, nombre de Barcelona, mencion sutil a Farray's.

## [H2 Seccion 1 - Keyword principal o variacion]

[2-3 parrafos con datos, estadisticas inline, links internos]

## [H2 Seccion 2 - Keyword secundaria]

[Contenido con answer capsule integrada si aplica]

## [H2 Seccion 3 - Aspecto tecnico/practico]

[Listas, comparativas, datos verificables]

## [H2 Seccion 4 - Beneficios/valor]

[Estadisticas de salud/bienestar con citas]

## [H2 Seccion 5 - Guia practica / Como empezar]

[Contenido transaccional: que esperar, niveles, primera clase]

## [H2 Seccion 6 - Barcelona / Local SEO]

[Contexto local, barrio, comunidad, escena de danza en BCN]

## Conclusion

[Resumen 3-4 puntos clave] + [CTA principal] + [Keyword principal]
Longitud: 100-150 palabras.
```

#### Reglas de Escritura por Seccion:

```markdown
## [Titulo H2 con keyword o variacion semantica]

[Parrafo introductorio: 2-3 oraciones que resuman la seccion]

[Contenido principal con:]

- 1 estadistica con fuente cada 150-200 palabras
- Links internos naturales: [texto ancla](/es/ruta-interna)
- Links a articulos del blog: [texto](/es/blog/categoria/slug)
- Datos verificables con [Fuente, Ano](URL)
- Mencion natural de Farray's (maximo 1 por seccion, no forzada)

[Si es lista: 4-6 items con explicacion de 1-2 lineas cada uno]
[Si es parrafo: 2-3 parrafos de 60-80 palabras cada uno]
```

### 7. TABLA COMPARATIVA (OBLIGATORIA para articulos de estilos)

```markdown
| Aspecto                | [Estilo A]         | [Estilo B] | [Estilo C] |
| ---------------------- | ------------------ | ---------- | ---------- |
| Origen                 | [dato]             | [dato]     | [dato]     |
| Dificultad             | [facil/media/alta] | [...]      | [...]      |
| Beneficio principal    | [...]              | [...]      | [...]      |
| Musica                 | [...]              | [...]      | [...]      |
| Edad recomendada       | [...]              | [...]      | [...]      |
| Disponible en Farray's | Si/No              | Si/No      | Si/No      |
```

### 8. FAQs (8-10 preguntas - Schema FAQ)

> **GEO 2026**: FAQ schema tiene 3.2x mas probabilidad de aparecer en AI Overviews. Minimo 8 preguntas.

Basadas en:

- "People Also Ask" de Google (buscar la keyword y copiar las preguntas reales)
- Preguntas frecuentes de alumnos reales de Farray's
- Busquedas relacionadas en Perplexity/ChatGPT

```json
[
  {
    "question": "Pregunta EXACTA como la haria un usuario en Google o a una IA",
    "answer": "Respuesta completa pero concisa, 3-5 oraciones. Primera oracion = respuesta directa. Incluir 1 dato si es posible. Terminar con informacion practica."
  }
]
```

**Reglas FAQ enterprise:**

1. Primera pregunta = keyword principal en forma de pregunta
2. Incluir preguntas de precio/coste (alta intencion transaccional)
3. Incluir preguntas de "como empezar" / "primera clase"
4. Incluir 1-2 preguntas long-tail especificas
5. Respuestas de 40-80 palabras (optimo para featured snippets)
6. NO repetir informacion ya cubierta en Answer Capsules

### 9. REFERENCIAS ACADEMICAS (6-8 fuentes)

```json
[
  {
    "title": "Titulo descriptivo de la fuente (no el titulo tecnico del paper)",
    "url": "https://url-verificable-y-funcional.com/articulo",
    "publisher": "Nombre del editor/institucion/revista",
    "year": "2024",
    "authors": "Apellido et al. (si aplica)",
    "description": "1 oracion: por que esta fuente es relevante para el articulo"
  }
]
```

**Distribucion ideal de referencias:**

- 2-3 estudios academicos peer-reviewed (Tier S/A)
- 1-2 fuentes institucionales (UNESCO, WHO, universidades)
- 1-2 fuentes de la industria (federaciones, revistas de danza)
- 1 fuente de medio de referencia (BBC, NYT, El Pais)

---

## LINKBUILDING ENTERPRISE (SECCION NUEVA - CRITICA)

### A. Internal Linking Strategy (Topical Authority)

> **Objetivo**: Cada articulo debe fortalecer la autoridad tematica del cluster al que pertenece. Google mide Topical Authority por la densidad y calidad de interlinks dentro de un tema.

#### Links Internos OBLIGATORIOS (incluir en el contenido del articulo):

**Paginas de servicio (transaccionales):**

| Texto ancla sugerido            | Ruta                                      | Cuando usar                      |
| ------------------------------- | ----------------------------------------- | -------------------------------- |
| clases de [estilo] en Barcelona | /es/clases/[estilo]-barcelona             | Cuando menciones el estilo       |
| nuestras clases                 | /es/clases                                | Mencion generica de clases       |
| horarios y disponibilidad       | /es/horarios-clases-baile-barcelona       | Cuando hables de horarios/cuando |
| precios y opciones              | /es/precios-clases-baile-barcelona        | Cuando hables de costes          |
| nuestros profesores             | /es/profesores-baile-barcelona            | Cuando menciones profesores      |
| Metodo Farray                   | /es/metodo-farray                         | Cuando hables de metodologia     |
| instalaciones                   | /es/instalaciones-escuela-baile-barcelona | Cuando hables del espacio        |
| contacta con nosotros           | /es/contacto                              | CTAs                             |
| reserva tu primera clase        | /es/reservas                              | CTAs transaccionales             |
| hazte socio                     | /es/hazte-socio                           | Cuando hables de membresias      |

**Articulos del blog (cluster links):**

| Texto ancla sugerido          | Ruta                                                       | Cuando usar                   |
| ----------------------------- | ---------------------------------------------------------- | ----------------------------- |
| beneficios de bailar          | /es/blog/lifestyle/beneficios-bailar-salsa                 | Menciones de salud/beneficios |
| como perder el miedo a bailar | /es/blog/lifestyle/como-perder-miedo-bailar                | Principiantes, ansiedad       |
| guia para principiantes       | /es/blog/tips/clases-baile-principiantes-barcelona-farrays | Principiantes, primera clase  |
| salsa vs bachata              | /es/blog/tips/salsa-vs-bachata-que-estilo-elegir           | Comparativas de estilos       |
| guia de danzas urbanas        | /es/blog/tips/danzas-urbanas-barcelona-guia-completa       | Hip-hop, dancehall, urbanos   |
| ballet para adultos           | /es/blog/tips/ballet-para-adultos-barcelona                | Ballet, clasico, adultos      |
| baile y salud mental          | /es/blog/fitness/baile-salud-mental                        | Bienestar, ansiedad, estres   |
| academia de danza             | /es/blog/tips/academia-de-danza-barcelona-guia-completa    | Elegir academia, formacion    |
| historia de la bachata        | /es/blog/historia/historia-bachata-barcelona               | Origen, cultura bachata       |
| historia de la salsa          | /es/blog/historia/historia-salsa-barcelona                 | Origen, cultura salsa         |

#### Reglas de Internal Linking:

1. **Minimo 8-12 links internos** por articulo (4-6 a paginas de servicio + 4-6 a articulos del blog)
2. **Texto ancla variado**: NO repetir el mismo anchor text. Usar variaciones naturales
3. **Distribucion uniforme**: Links repartidos a lo largo del articulo, no todos al final
4. **Contexto natural**: El link debe estar en una oracion que tenga sentido, no forzado
5. **First Link Priority**: El primer link a una pagina es el que Google considera mas importante. Asegurar que sea con buen anchor text
6. **Bidireccional**: Mencionar que articulos existentes deberian enlazar DE VUELTA al nuevo articulo (yo me encargare de eso)

### B. External Link Building Strategy (Off-Page Authority)

> **CRITICO para Perplexity**: Perplexity prioriza contenido que CITA fuentes externas de alta autoridad. Cuantas mas citas de calidad, mayor probabilidad de ser citado DE VUELTA por Perplexity.

#### Links Externos OBLIGATORIOS en el contenido:

Incluir **6-10 links externos** a fuentes de alta autoridad directamente en el texto del articulo:

```markdown
Segun un estudio publicado en el [New England Journal of Medicine](https://www.nejm.org/doi/full/10.1056/NEJMoa022252),
bailar reduce el riesgo de demencia en un 76%.
```

**Distribucion ideal de links externos:**

| Tipo                    | Cantidad | Ejemplos                          | Proposito              |
| ----------------------- | -------- | --------------------------------- | ---------------------- |
| Estudios academicos     | 2-3      | NEJM, PubMed, Frontiers           | E-E-A-T, citabilidad   |
| Instituciones           | 1-2      | UNESCO, WHO, RAE, Ministerio      | Autoridad              |
| Medios de referencia    | 1-2      | BBC, El Pais, NYT                 | Contexto cultural      |
| Wikipedia/enciclopedias | 1        | Wikipedia, Britannica             | Definiciones, contexto |
| Recursos educativos     | 1-2      | universidades, escuelas oficiales | Credibilidad           |

#### Reglas de External Linking Enterprise:

1. **SOLO links a paginas reales y verificables** (abrir cada URL antes de incluirla)
2. **rel="noopener"** para links externos (se anade automaticamente en el componente)
3. **Anchor text descriptivo**: "estudio del NEJM sobre danza y demencia" > "haz click aqui"
4. **NO linkear a competidores directos** (otras academias de danza en Barcelona)
5. **Preferir fuentes en ingles** para estudios academicos (mayor autoridad global)
6. **Incluir el ano** junto al link cuando sea una fuente temporal: "[Harvard, 2023](url)"

### C. Semantic Entity Linking (Knowledge Graph)

> Vincular el contenido con entidades reconocidas por los knowledge graphs de Google/Bing/Perplexity.

**Entidades a mencionar y enlazar:**

| Entidad                   | Tipo                  | Link sugerido              |
| ------------------------- | --------------------- | -------------------------- |
| Barcelona                 | Ciudad                | Wikipedia o turisme BCN    |
| Eixample                  | Barrio                | Wikipedia                  |
| [Estilo de baile]         | Genero artistico      | Wikipedia del estilo       |
| CID-UNESCO                | Organizacion          | Pagina oficial del CID     |
| ENA Cuba                  | Institucion educativa | Wikipedia o pagina oficial |
| [Artista/bailarin famoso] | Persona               | Wikipedia                  |
| [Cancion/album iconico]   | Obra                  | Spotify o Wikipedia        |

**Por que esto importa:** Las IAs construyen respuestas conectando entidades. Si tu contenido menciona y enlaza entidades reconocidas, las IAs lo consideran mas fiable y citable.

### D. Link Reclamation & Digital PR Hooks

> Incluir en el articulo "hooks" que incentiven que OTROS sitios enlacen a tu contenido.

**Elementos que atraen backlinks naturales:**

1. **Estadistica original o curada**: "Compilamos datos de 15 estudios sobre [tema]..."
2. **Infografia/tabla comparativa**: Las tablas se comparten y citan frecuentemente
3. **Dato local exclusivo**: "En Barcelona, segun datos de [fuente], el X% de..."
4. **Guia definitiva**: Ser el recurso mas completo en espanol sobre el tema
5. **Expert quote**: Cita textual de un profesor de Farray's con nombre y credenciales
6. **Datos de primera mano**: "En Farray's, con mas de X alumnos/ano, observamos que..."

**Incluir al menos 2-3 de estos hooks en cada articulo.**

---

## PROMINENCIA SEMANTICA (TF-IDF + Entidades)

### Keyword Principal

- **Ubicacion obligatoria**: titulo, H1, meta description, primer parrafo, minimo 1 H2, ultimo parrafo, URL slug
- **Densidad**: 0.8-1.2% del texto total (no mas, Google penaliza keyword stuffing)
- **Variaciones**: usar LSI keywords y sinonimos naturalmente (listarlos arriba)

### Keywords Secundarias

Distribuir naturalmente. Cada keyword secundaria debe aparecer 2-4 veces en el texto:

- [Listar 4-6 keywords secundarias especificas]
- [Incluir long-tail keywords de 4+ palabras]
- [Incluir keywords de pregunta: "como", "donde", "cual"]

### Entidades Semanticas Obligatorias

- **Geo**: Barcelona, Eixample, Eixample Izquierdo, Catalunya, Espana
- **Brand**: Farray's, FIDC, Metodo Farray, Yunaisy Farray
- **Estilos**: los relevantes para el articulo
- **Beneficios**: salud, comunidad, tecnica, expresion, confianza, bienestar
- **Instituciones**: CID-UNESCO, ENA Cuba, las relevantes
- **Cultural**: musica, artistas, cultura del estilo

---

## FORMATO DE ENTREGA

Estructura tu respuesta EXACTAMENTE asi (Perplexity/ChatGPT):

```markdown
# METADATOS

[JSON con title, metaDescription, excerpt, slug, category, readingTime, wordCount, author]

# SUMMARY BULLETS

1. [...]
2. [...]
3. [...]
4. [...]
5. [...]

# ESTADISTICAS (summaryStats)

[JSON array con 4-6 estadisticas y citas verificables con URLs reales]

# ANSWER CAPSULES

[JSON array con 3-4 answer capsules]

# DEFINICIONES

[JSON array con 2-3 definiciones]

# CONTENIDO DEL ARTICULO

## Introduccion

[100-150 palabras con keyword, gancho, promesa]

## [H2 Seccion 1]

[Contenido completo con markdown, links internos [texto](/es/ruta), links externos [texto](url), datos con [Fuente, Ano](URL)]

## [H2 Seccion 2]

[...]

## [H2 Seccion 3]

[...]

## [H2 Seccion 4]

[...]

## [H2 Seccion 5]

[...]

## [H2 Seccion 6 - Local Barcelona]

[...]

## Conclusion

[100-150 palabras con resumen + CTA + keyword]

# TABLA COMPARATIVA

[Tabla markdown con 5-7 filas de comparacion]

# FAQs

[JSON array con 8-10 FAQs basadas en People Also Ask y preguntas reales]

# REFERENCIAS

[JSON array con 6-8 referencias verificables con URLs]

# INTERNAL LINKS MAP

[Tabla con TODOS los links internos incluidos en el articulo:]
| Texto ancla | URL destino | Seccion donde aparece |
|---|---|---|

# EXTERNAL LINKS MAP

[Tabla con TODOS los links externos incluidos:]
| Texto ancla | URL destino | Tipo de fuente | Seccion |
|---|---|---|---|

# CLUSTER LINKS (Bidireccional)

[Lista de articulos existentes que deberian enlazar DE VUELTA a este nuevo articulo:]
| Articulo existente | Texto ancla sugerido | Donde insertarlo |
|---|---|---|

# CALLOUTS

[Tips y CTAs]

# EXPERT QUOTE

[Cita textual del profesor/experto de Farray's que firma el articulo]

# TESTIMONIAL (opcional)

[JSON si aplica]
```

---

## CHECKLIST ENTERPRISE FINAL

Antes de entregar, verificar TODOS estos puntos:

### SEO Tecnico

- [ ] Keyword principal en: titulo, meta, URL, H1, intro, 1+ H2, conclusion
- [ ] Meta title: 55-60 caracteres
- [ ] Meta description: 150-155 caracteres
- [ ] Slug URL-friendly con keyword
- [ ] 6-8 secciones H2 con keywords/variaciones

### GEO (AI Citability)

- [ ] 3-4 Answer Capsules con preguntas exactas de usuario
- [ ] 4-6 estadisticas con URLs de fuentes REALES (Tier S/A/B)
- [ ] 2-3 definiciones claras y auto-contenidas
- [ ] 8-10 FAQs basadas en People Also Ask
- [ ] 6-8 referencias verificables con URLs funcionales
- [ ] Summary bullets con datos citables

### Linkbuilding (CRITICO)

- [ ] 8-12 links internos (4-6 servicio + 4-6 blog)
- [ ] 6-10 links externos a fuentes de alta autoridad
- [ ] Texto ancla variado y descriptivo (NO "click aqui")
- [ ] Links distribuidos uniformemente en todo el articulo
- [ ] Mapa de links internos completo
- [ ] Mapa de links externos completo
- [ ] Plan de links bidireccionales (cluster)
- [ ] 2-3 "hooks" para atraer backlinks naturales

### E-E-A-T

- [ ] Autor con nombre, credenciales y rol
- [ ] Expert quote del autor
- [ ] Fuentes Tier S/A representan >50% de las citas
- [ ] Experiencia de primera mano mencionada (Farray's data)

### Contenido

- [ ] 2500-4500 palabras de contenido principal
- [ ] Tono profesional pero cercano
- [ ] No canibaliza los 14 articulos existentes
- [ ] Tabla comparativa (obligatoria para estilos)
- [ ] Menciones naturales a Barcelona/Eixample
- [ ] CTAs no agresivos (maximo 2-3 en todo el articulo)
- [ ] Oraciones de 15-20 palabras max
- [ ] Parrafos de 2-3 oraciones

### Conversion

- [ ] CTA principal claro (reservar clase, contacto)
- [ ] Mencion de clase de prueba gratuita si aplica
- [ ] Link a horarios y precios
- [ ] Pain points del usuario abordados
- [ ] Trigger de compra incluido

---

## INSTRUCCIONES FINALES PARA PERPLEXITY/CHATGPT

1. **Tono**: Profesional pero cercano, experto pero accesible. Como un profesor que te explica con pasion.
2. **Longitud**: 2500-4500 palabras de contenido principal (mas largo = mas citado por IAs)
3. **Fuentes**: SOLO fuentes reales y verificables con URLs funcionales. VERIFICAR cada URL.
4. **Honestidad**: Si no encuentras una estadistica, indica "[VERIFICAR - BUSCAR FUENTE]"
5. **GEO first**: Priorizar elementos citables por IAs (answer capsules > stats > definitions)
6. **E-E-A-T**: Cada seccion debe demostrar experiencia y autoridad
7. **Local SEO**: Mencionar Barcelona, Eixample, Catalunya naturalmente (no forzar)
8. **Linkbuilding**: INCLUIR los links directamente en el texto del articulo, no como nota al pie
9. **Conversion**: El articulo debe hacer que el lector QUIERA probar una clase, sin ser agresivo
10. **Diferenciacion**: Verificar contra la tabla de 16 articulos existentes que NO canibalizas

---

## NOTAS PARA CLAUDE CODE (Post-Perplexity)

Cuando el usuario pegue el resultado de Perplexity, debo:

1. **Crear el archivo de configuracion** en `constants/blog/articles/[slug].ts`
   - Usar SOLO `type: 'paragraph'` para contenido y `type: 'heading'` para titulos
   - NUNCA usar `type: 'content'` (no existe en ArticleContent.tsx)
   - Incluir `type: 'references'` al final con las referencias
   - Incluir `type: 'comparison-table'` si hay tabla
2. **Anadir traducciones ES** a `i18n/locales/es/blog.json`
3. **Crear traducciones CA, EN, FR** enterprise (no literales, adaptadas culturalmente)
4. **Actualizar** `constants/blog/index.ts` para exportar el nuevo articulo
5. **Anadir rutas** en `prerender.mjs` para los 4 idiomas (routes + metadata + initialContent)
6. **Implementar cluster links bidireccionales**: editar articulos existentes para que enlacen al nuevo
7. **Verificar** que no hay errores de TypeScript con `npm run build`

---

_Ultima actualizacion: 11 de marzo de 2026_
_Version del prompt: 3.0_
_Cambios v3.0: Linkbuilding enterprise completo, tabla anti-canibalizacion 16 articulos, GEO 2026 stats frequency, semantic entity linking, cluster bidireccional, internal/external link maps, expert quotes, digital PR hooks_
