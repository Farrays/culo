# Claude Code Instructions for Farray's Dance Center

## Critical: Adding New Pages

When creating a new page, you MUST update **THREE** files:

### 1. App.tsx - React Router Route

```tsx
<Route path="/:locale/nueva-pagina" element={<NuevaPage />} />
```

### 2. prerender.mjs - Pre-render Configuration

**Add route for EACH locale (es, ca, en, fr):**

```javascript
// In the routes array
{ path: 'es/nueva-pagina', lang: 'es', page: 'nuevaPagina' },
{ path: 'ca/nueva-pagina', lang: 'ca', page: 'nuevaPagina' },
{ path: 'en/nueva-pagina', lang: 'en', page: 'nuevaPagina' },
{ path: 'fr/nueva-pagina', lang: 'fr', page: 'nuevaPagina' },
```

**Add metadata for EACH locale:**

```javascript
// In metadata.es, metadata.ca, metadata.en, metadata.fr
nuevaPagina: {
  title: 'Título SEO | Farray\'s Center',
  description: 'Descripción meta para SEO...',
},
```

**Add initialContent for EACH locale:**

```javascript
// In initialContent.es, initialContent.ca, initialContent.en, initialContent.fr
nuevaPagina: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Título</h1><p>Contenido básico para SSR.</p></main>`,
```

### 3. vercel.json - Rewrite Rule (if needed)

```json
{ "source": "/:locale(es|en|ca|fr)/nueva-pagina", "destination": "/index.html" }
```

## Why This Matters

Without pre-rendering:

- Pages show blank/loading state for 1-3 seconds
- Refresh causes 404 errors
- Worse in incognito mode (no cache)
- Bad SEO (Google sees empty content)

With pre-rendering:

- Instant content display
- Works on refresh
- Good SEO

## Supported Locales

Always add routes for all 4 locales:

- `es` - Spanish (default)
- `ca` - Catalan
- `en` - English
- `fr` - French

## Quick Checklist for New Pages

- [ ] Route added to App.tsx
- [ ] 4 route entries in prerender.mjs (one per locale)
- [ ] 4 metadata entries in prerender.mjs
- [ ] 4 initialContent entries in prerender.mjs
- [ ] Rewrite rule in vercel.json (if custom URL pattern)
- [ ] Run `npm run build` to verify generation

## Testing Pre-rendered Pages

After `npm run build`, check:

```bash
ls dist/es/nueva-pagina/index.html
```

The file should exist and contain the pre-rendered content.

---

## GEO (Generative Engine Optimization) Guidelines

GEO optimizes content for AI search engines (ChatGPT, Perplexity, Google AI Overview, Bing Copilot).

### Key GEO Elements for Blog Articles

#### 1. Answer Capsules (72% AI citation rate)

```typescript
// In article config sections:
{
  id: 'answer-capsule-1',
  type: 'answer-capsule',
  contentKey: 'blog_answerCapsule1',
  answerCapsule: {
    questionKey: 'blog_question1',      // Direct question format
    answerKey: 'blog_answer1',          // Concise 2-3 sentence answer
    sourcePublisher: 'Source Name',
    sourceYear: '2024',
    sourceUrl: 'https://...',
    confidence: 'verified',             // 'verified' | 'high' | 'moderate'
    icon: 'check',                      // Visual indicator
  },
}
```

#### 2. Statistics with Citations (E-E-A-T)

```typescript
summaryStats: [
  {
    value: '76%',
    labelKey: 'blog_statLabel',
    citation: {
      source: 'New England Journal of Medicine',
      url: 'https://nejm.org/...',
      year: '2023',
      authors: 'Smith et al.',
      doi: '10.1056/NEJMoa...',           // Optional
    },
  },
],
```

#### 3. Definitions (LLM Extraction)

```typescript
{
  id: 'definition-term',
  type: 'definition',
  definitionTermKey: 'blog_defTerm',    // Term being defined
  contentKey: 'blog_defContent',        // Clear definition
}
```

#### 4. Speakable Selectors (Voice Search)

```typescript
speakableSelectors: [
  '#article-summary',                   // Key takeaways
  '[data-answer-capsule="true"]',       // Answer capsules
  '#intro',                             // Introduction
  '#conclusion',                        // Conclusion
],
```

### Blog Image Configuration

```typescript
featuredImage: {
  src: '/images/blog/article-name/hero.webp',
  srcSet: '/images/blog/article-name/hero-480.webp 480w, /images/blog/article-name/hero-960.webp 960w, /images/blog/article-name/hero.webp 1200w',
  alt: 'Descriptive alt text with keywords and context for accessibility and SEO',
  width: 1200,
  height: 630,
},
ogImage: '/images/blog/article-name/og.jpg',  // JPG for social crawlers
```

### Image Optimization Script

Run after adding new blog images:

```bash
node scripts/optimize-blog-images.mjs
```

Generates:

- **AVIF**: Best compression (~30% smaller than WebP)
- **WebP**: Universal modern browser support
- **JPG**: OG images for social media crawlers

### GEO Checklist for New Articles

- [ ] At least 2-3 Answer Capsules with verified sources
- [ ] 3-5 Statistics with proper citations (URL, year, authors)
- [ ] 1-2 Definitions for key terms
- [ ] Speakable selectors configured
- [ ] 6-8 FAQs for schema markup
- [ ] References section with academic/authoritative sources
- [ ] Alt texts are descriptive (15-25 words)
