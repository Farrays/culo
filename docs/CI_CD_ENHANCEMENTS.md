# CI/CD and Security Enhancements

This document describes the enhanced CI/CD pipeline and security features implemented in the project.

## Table of Contents

- [Lighthouse CI](#lighthouse-ci)
- [Bundle Size Enforcement](#bundle-size-enforcement)
- [Content Security Policy (CSP)](#content-security-policy-csp)
- [Schema.org Enhancement](#schemaorg-enhancement)
- [Accessibility Improvements](#accessibility-improvements)

## Lighthouse CI

### Overview

Lighthouse CI automatically tests your application's performance, accessibility, best practices, and SEO scores on every build. It helps ensure that code changes don't degrade the user experience.

### Configuration

The configuration is in `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": [
        "http://localhost/es/index.html",
        "http://localhost/es/clases/dancehall-barcelona/index.html",
        ...
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        ...
      }
    }
  }
}
```

### Running Locally

```bash
# Build the project first
npm run build

# Run Lighthouse CI
npm run lighthouse
```

### CI/CD Integration

Lighthouse CI runs automatically in GitHub Actions after successful build. Results are uploaded as artifacts and can be viewed in the Actions tab.

### Thresholds

- **Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 90
- **SEO**: ≥ 95
- **FCP**: ≤ 2000ms
- **LCP**: ≤ 2500ms
- **CLS**: ≤ 0.1

## Bundle Size Enforcement

### Overview

Automated bundle size checks prevent code bloat by enforcing maximum file sizes for JavaScript and CSS bundles.

### Configuration

The configuration is in `.size-limit.cjs`:

```javascript
module.exports = [
  {
    name: 'Main JS Bundle',
    path: 'dist/assets/index-*.js',
    limit: '280 KB',
  },
  {
    name: 'ES Locale Bundle',
    path: 'dist/assets/es-*.js',
    limit: '280 KB',
  },
  // ... more bundles
];
```

### Running Locally

```bash
# Build the project first
npm run build

# Check bundle sizes
npm run size
```

### Current Bundle Sizes (Brotli compressed)

- Main JS Bundle: ~65 KB
- ES Locale Bundle: ~61 KB
- EN Locale Bundle: ~49 KB
- CA Locale Bundle: ~54 KB
- FR Locale Bundle: ~51 KB
- React Vendor: ~4 KB
- Router Vendor: ~15 KB
- Total CSS: ~7 KB

**All bundles are well under the 300KB threshold.**

### CI/CD Integration

Bundle size checks run automatically in GitHub Actions during the build job. If any bundle exceeds its limit, the build will fail.

## Content Security Policy (CSP)

### Overview

CSP is a security layer that helps detect and mitigate certain types of attacks, including Cross-Site Scripting (XSS) and data injection attacks.

### Hash-Based Script Authorization

Instead of using `'unsafe-inline'`, we use SHA-256 hashes to whitelist specific inline scripts:

```
script-src 'self' 'sha256-lE663GA/AVh64NJNFLdYmeZ7ofg1KbcgSjiXS/ApOz8=' ...
```

### When to Update CSP Hashes

You need to regenerate CSP hashes when you modify inline scripts in `index.html`, specifically:

1. JSON-LD structured data scripts
2. Inline locale pre-setting scripts

### How to Update CSP Hashes

```bash
# Run the hash generation script
npm run csp:hash

# Copy the generated hash to vercel.json
# Update the Content-Security-Policy header
```

**Example output:**

```
📊 CSP Script Hashes for index.html

Script 1:
  Hash: 'sha256-lE663GA/AVh64NJNFLdYmeZ7ofg1KbcgSjiXS/ApOz8='
```

Then update `vercel.json`:

```json
{
  "key": "Content-Security-Policy",
  "value": "script-src 'self' 'sha256-NEW_HASH_HERE' https://..."
}
```

### CSP Directives

Our CSP configuration (in `vercel.json`):

- **default-src**: `'self'` - Only load resources from same origin
- **script-src**: `'self'` + hashes + trusted CDNs (Google Analytics, Sentry)
- **style-src**: `'self' 'unsafe-inline'` - Inline styles allowed (TailwindCSS)
- **img-src**: `'self' data: https: blob:` - Images from any HTTPS source
- **font-src**: `'self' data:` - Self-hosted fonts
- **connect-src**: `'self'` + API endpoints (Sentry, Google Analytics)
- **frame-src**: YouTube embeds only
- **object-src**: `'none'` - No plugins
- **base-uri**: `'self'` - Prevents base tag hijacking
- **form-action**: `'self'` - Forms can only submit to same origin

## Schema.org Enhancement

### Overview

Enhanced structured data markup helps search engines understand your content better, leading to rich results in search.

### Course Schema

Added to all class pages:

- `DancehallPage.tsx`
- `DanzaBarcelonaPage.tsx`
- `SalsaBachataPage.tsx`
- `DanzasUrbanasBarcelonaPage.tsx`

**Example:**

```tsx
<CourseSchema
  name={t('danzaBarcelona_hero_title')}
  description={t('danzaBarcelona_description')}
  provider={{
    name: "Farray's International Dance Center",
    url: baseUrl,
  }}
  educationalLevel="Beginner to Advanced"
  teaches="Contemporary Dance, Modern Dance, Ballet"
  availableLanguage={['es', 'ca', 'en', 'fr']}
/>
```

### LocalBusiness Schema

Added to all class pages for local SEO:

```tsx
<LocalBusinessSchema
  name="Farray's International Dance Center"
  description={t('danzaBarcelona_description')}
  url={baseUrl}
  telephone="+34622247085"
  email="info@farrayscenter.com"
  address={{
    streetAddress: "Carrer d'Entença, 100, Local 1",
    addressLocality: 'Barcelona',
    postalCode: '08015',
    addressCountry: 'ES',
  }}
  geo={{
    latitude: '41.380420',
    longitude: '2.148014',
  }}
  priceRange="€€"
/>
```

### Testing Schemas

Use Google's Rich Results Test:
https://search.google.com/test/rich-results

## Accessibility Improvements

### Focus Trap in Mobile Menu

The mobile navigation implements a complete focus trap:

- **Auto-focus**: First link receives focus when menu opens
- **Tab cycling**: Focus cycles within menu (Tab + Shift+Tab)
- **Escape key**: Closes menu and restores focus
- **Body scroll lock**: Prevents background scrolling when menu is open

**Implementation**: `components/header/MobileNavigation.tsx`

### Enhanced ARIA Labels

#### Desktop Navigation

- `aria-expanded`: Indicates dropdown state
- `aria-controls`: Links buttons to controlled dropdown menus
- `aria-label`: Descriptive labels for all interactive elements
- `role="menu"`: Proper semantic role for dropdown menus

#### Mobile Navigation

- `role="dialog"`: Mobile menu is a modal dialog
- `aria-modal="true"`: Screen readers understand modal context
- `aria-label`: Navigation menu label

#### Language Selector

- `aria-expanded`: Dropdown state
- `aria-label`: "Select language" with current selection

### Testing Accessibility

```bash
# Run accessibility tests
npm run test:a11y

# Run unit tests including accessibility checks
npm run test:run
```

## Continuous Integration

All enhancements are integrated into the CI/CD pipeline:

```yaml
# .github/workflows/ci.yml
jobs:
  build:
    - Enforce bundle size limits
    - Upload build artifacts
  
  lighthouse:
    - Run Lighthouse CI
    - Upload results
    - Assert performance thresholds
  
  security:
    - Audit dependencies
```

## Monitoring and Alerts

- **Lighthouse CI**: Fails build if scores drop below thresholds
- **Bundle Size**: Fails build if bundles exceed limits
- **TypeScript**: Strict type checking prevents runtime errors
- **ESLint**: Zero warnings policy

## References

- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [size-limit Documentation](https://github.com/ai/size-limit)
- [Content Security Policy Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Schema.org Documentation](https://schema.org/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
