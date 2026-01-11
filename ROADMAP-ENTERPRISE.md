# Roadmap Enterprise - SEO y Posicionamiento

> Recomendaciones basadas en [artículo DinoRank sobre Google y contenido IA](https://dinorank.com/blog/google-y-contenido-de-dinobrain/)

---

## Principio Clave

Google **no penaliza contenido IA** si es útil, original y fiable. Lo que importa:

- **E-E-A-T**: Experiencia, Expertise, Autoridad, Confianza
- Contenido con tono personal, ejemplos reales, experiencia propia
- Autor visible y verificable
- Evitar patrones robóticos y contenido genérico

---

## Estado Actual (Fortalezas)

- [x] Schema.org exhaustivo (Organization, LocalBusiness, Course, Person, Article)
- [x] Multi-idioma perfecto (es, ca, en, fr) con hreflang
- [x] Pre-rendering de 450+ páginas
- [x] E-E-A-T básico: Yunaisy Farray como fundadora
- [x] Certificación CID-UNESCO mencionada
- [x] Datos de contacto verificables (dirección, teléfono, email)

---

## Fase 1: Quick Wins (Prioridad Alta)

### 1.1 Testimonios y Reseñas Reales

**Problema**: Los schemas `ReviewSchema` y `AggregateReviewsSchema` existen pero no se usan.

**Archivos a modificar**:

- `src/pages/HomePage.tsx` - Agregar sección de testimonios
- `src/components/SEO/SchemaMarkup.tsx` - Activar AggregateRatingSchema

**Implementación**:

```tsx
// Componente de testimonios con datos reales
<TestimonialsSection
  reviews={[
    {
      author: 'María García',
      rating: 5,
      text: 'Llegué sin saber bailar y ahora...',
      date: '2024-03-15',
    },
    // más reseñas reales
  ]}
/>
```

**Checklist**:

- [ ] Recopilar 5-10 testimonios reales de alumnos
- [ ] Crear componente TestimonialsSection
- [ ] Implementar AggregateRatingSchema con puntuación real de Google Reviews
- [ ] Incluir nombres, fotos (con permiso) y fechas

### 1.2 Números Verificables en Homepage

**Mostrar en homepage/about**:

- [ ] "Más de 15,000 alumnos desde 2015"
- [ ] "10 años de experiencia en Barcelona"
- [ ] "20+ profesores especializados"
- [ ] "4.9 estrellas en Google" (con link a perfil)

**Archivos a modificar**:

- `src/pages/HomePage.tsx`
- `src/i18n/locales/*.ts`

### 1.3 Certificaciones Visibles

- [ ] Logo CID-UNESCO visible en footer o about
- [ ] Badge visual de "Método Farray Certificado"
- [ ] Cualquier otra certificación o reconocimiento

---

## Fase 2: Contenido E-E-A-T (Prioridad Alta)

### 2.1 Página de Profesores Enriquecida

**Archivos a modificar**:

- `src/pages/ProfesoresPage.tsx`
- `src/data/profesores.ts` (crear si no existe)

**Cada profesor debe tener**:

- [ ] Foto profesional
- [ ] Bio personal (no genérica)
- [ ] Años de experiencia específicos
- [ ] Especialidades
- [ ] Redes sociales personales (si tienen)
- [ ] `Person schema` individual

### 2.2 Contenido "Sobre Nosotros" con Historia Real

**Agregar a AboutPage**:

- [ ] Historia real de Yunaisy: cómo empezó, por qué Barcelona
- [ ] Anécdotas personales
- [ ] Fotos históricas de la escuela (2015 vs hoy)
- [ ] Hitos: número de alumnos formados, eventos realizados

### 2.3 Blog con Experiencia Real

**Estructura de cada artículo**:

- **Experiencia personal**: "En mis 20 años bailando salsa, he visto que..."
- **Ejemplos específicos**: Nombres de alumnos (con permiso), situaciones reales
- **Anécdotas**: Historias de clases, errores comunes
- **Datos propios**: "El 80% de mis alumnas de twerk empezaron sin saber bailar"

**Tipos de contenido recomendados**:

1. [ ] Tutoriales con video propio: "Cómo hacer el paso básico de bachata - por Yunaisy"
2. [ ] Historias de transformación: "María llegó sin saber bailar, hoy da clases"
3. [ ] Opiniones de experta: "Por qué el reggaetón es más técnico de lo que parece"
4. [ ] Contenido local: "Los mejores lugares para bailar salsa en Barcelona"

---

## Fase 3: Videos y Media

### 3.1 Videos de Clases Reales

**Archivos a modificar**:

- `src/components/SEO/SchemaMarkup.tsx` - VideoObject schema
- Páginas de clases individuales

**Implementación**:

- [ ] Subir videos a YouTube de fragmentos de clases reales
- [ ] Implementar `VideoObject schema` (ya preparado en código)
- [ ] Embeber en páginas de clases correspondientes

### 3.2 Presencia en Medios

Si han salido en prensa/TV/podcasts:

- [ ] Crear sección "Han hablado de nosotros"
- [ ] Links a menciones externas (backlinks naturales)

---

## Fase 4: SEO Local

### 4.1 Contenido Geo-Específico

**Artículos de blog a crear**:

- [ ] "Dónde aprender bachata en Barcelona"
- [ ] "Escuelas de baile cerca de Plaza España"
- [ ] "Clases de salsa en el Eixample"

**Incluir**:

- Mencionar barrios específicos: Eixample, Sants, Plaza España
- Referencias a transporte público cercano (Metro L1, L3)

### 4.2 Google Business Profile

**Verificar actualización**:

- [ ] Fotos recientes del estudio (mínimo 10)
- [ ] Horarios actuales
- [ ] Posts regulares (eventos, promociones)
- [ ] Responder a TODAS las reseñas

---

## Fase 5: Contenido de Clases Diferenciado

### 5.1 Evitar Descripciones Genéricas

**Para cada página de clase, incluir**:

- [ ] Qué hace diferente el método Farray
- [ ] Quién lo enseña (nombre del profesor)
- [ ] Para quién es (ejemplos de perfiles de alumnos)

**Ejemplo**:

> "En Farray's, el dancehall lo enseñamos con raíces jamaicanas auténticas. Esta clase la imparte Sandra Gómez, formada en Kingston. Ideal para quienes quieren ir más allá de los pasos comerciales."

---

## Señales a Evitar (Patrones IA)

- Frases genéricas: "El baile es una forma de expresión..."
- Listas excesivamente estructuradas sin contexto personal
- Repetición de keywords sin naturalidad
- Contenido sin opinión ni posición clara

## Señales Positivas a Incluir

- Opiniones con fundamento: "Personalmente creo que..."
- Contraargumentos: "Muchos piensan X, pero en mi experiencia..."
- Errores admitidos: "Al principio yo también cometía este error..."
- Humor y personalidad

---

## Métricas de Éxito

| Métrica                              | Herramienta     | Objetivo |
| ------------------------------------ | --------------- | -------- |
| CTR keywords principales             | Search Console  | +20%     |
| Posición "clases [estilo] Barcelona" | Search Console  | Top 5    |
| Reseñas Google                       | Google Business | +10/mes  |
| Tiempo en página blog                | Analytics       | >3 min   |
| Bounce rate blog                     | Analytics       | <50%     |

---

## Archivos Clave del Proyecto

| Archivo                               | Propósito                                   |
| ------------------------------------- | ------------------------------------------- |
| `src/components/SEO/SchemaMarkup.tsx` | Schemas Organization, LocalBusiness, Course |
| `src/components/SEO/BlogSchemas.tsx`  | Schemas Article, Person, FAQ                |
| `src/pages/HomePage.tsx`              | Página principal (agregar testimonios)      |
| `src/pages/ProfesoresPage.tsx`        | Profesores (enriquecer bios)                |
| `src/pages/AboutPage.tsx`             | Sobre nosotros (agregar historia)           |
| `prerender.mjs`                       | Metadata SEO centralizada                   |
| `src/i18n/locales/*.ts`               | Traducciones y contenido                    |

---

## Conclusión

El proyecto tiene una **base SEO técnica excelente**. La oportunidad está en:

1. **Humanizar el contenido** con experiencia real de Yunaisy y el equipo
2. **Demostrar credibilidad** con números, testimonios y certificaciones visibles
3. **Contenido de blog con E-E-A-T real**, no descripciones genéricas

> Google no penaliza IA, pero **premia la experiencia demostrable**. Farray's tiene esa experiencia - solo falta hacerla más visible en el contenido.
