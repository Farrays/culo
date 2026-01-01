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
