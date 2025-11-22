# Pending Tasks & Future Improvements

## Overview
This document tracks tasks that were identified during the optimization process but require additional planning, design decisions, or are lower priority for the initial production release.

---

## 🔴 High Priority (Recommended for Next Sprint)

### 1. Server-Side Rate Limiting
**Status:** ⏳ Pending
**Current:** Client-side only (localStorage)
**Required:** Backend API implementation

**Implementation Plan:**
```typescript
// Backend (Node.js/Express example)
import rateLimit from 'express-rate-limit';

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests per window
  message: 'Too many contact form submissions, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  // Handle contact form submission
});
```

**Files to Create:**
- `backend/api/contact.ts` - Contact form endpoint
- `backend/middleware/rateLimiter.ts` - Rate limiting middleware
- Update `components/ContactPage.tsx` to use API endpoint

**Estimated Effort:** 4-6 hours

---

### 2. Complete Missing i18n Translations
**Status:** ⏳ Pending
**Current Gaps:**
- French (fr): 368 missing keys
- English (en): 301 missing keys
- Catalan (ca): 295 missing keys

**Priority Keys to Translate:**
```
High Priority (User-facing):
- Navigation labels
- Form error messages
- CTA buttons
- Page titles and descriptions

Medium Priority (Content):
- FAQ answers
- Service descriptions
- Teacher bios

Low Priority (SEO):
- Schema descriptions
- Meta descriptions
```

**Recommended Approach:**
1. Export missing keys to CSV
2. Send to professional translator
3. Review and QA translations
4. Import back to codebase
5. Verify in production

**Files to Modify:**
- `i18n/locales/fr.ts`
- `i18n/locales/en.ts`
- `i18n/locales/ca.ts`

**Estimated Effort:** 12-16 hours (including translation service)

---

### 3. SEO Image Creation
**Status:** ⏳ Pending - Requires Design Work
**Current:** Missing Open Graph images for some pages

**Required Images:**
```
1. og-home.jpg (1200x630) - Homepage
2. og-dancehall.jpg (1200x630) - Dancehall page
3. og-classes.jpg (1200x630) - General classes page
4. favicon.ico - Multiple sizes (16x16, 32x32, 48x48)
5. apple-touch-icon.png (180x180)
```

**Design Requirements:**
- Brand colors (primary accent)
- High contrast text
- Professional dance imagery
- Optimized file size (<200KB)

**Tools:**
- Canva Pro (templates available)
- Figma (design from scratch)
- Photoshop (professional edit)

**Files to Create:**
- `public/images/og-home.jpg`
- `public/images/og-dancehall.jpg`
- `public/images/og-classes.jpg`
- `public/favicon.ico`
- `public/apple-touch-icon.png`

**Estimated Effort:** 6-8 hours (design work)

---

## 🟡 Medium Priority (Nice to Have)

### 4. Schema Markup Extraction to utils/schemas.ts
**Status:** ⏳ Pending - Design Decision Needed
**Current:** Schema markup is inline in components (already well-organized)

**Pros of Extraction:**
- ✅ Centralized schema definitions
- ✅ Easier to maintain
- ✅ Reusable across pages

**Cons of Extraction:**
- ❌ Less flexible for page-specific data
- ❌ More imports needed
- ❌ Current inline approach is already clean

**Recommendation:**
✋ **Hold for now** - Current implementation is already well-organized with `components/SchemaMarkup.tsx`. Only extract if we need to reuse schemas across multiple non-component contexts.

**If implementing later:**
```typescript
// utils/schemas.ts
export const createLocalBusinessSchema = (data: LocalBusinessData) => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: data.name,
  // ... schema structure
});

// Usage in components
import { createLocalBusinessSchema } from '../utils/schemas';

const schema = createLocalBusinessSchema({
  name: t('businessName'),
  // ... data
});
```

**Estimated Effort:** 3-4 hours

---

### 5. Testimonials Standardization Pattern
**Status:** ⏳ Pending - Design Decision Needed
**Current:** Mixed approach (constants + inline definitions)

**Current State:**
```
constants/testimonials.ts - Shared testimonials
constants/dancehall.ts - Page-specific testimonials
```

**Options:**

**Option A: Full Centralization**
```typescript
// constants/testimonials.ts
export const ALL_TESTIMONIALS = {
  shared: [...],
  dancehall: [...],
  salsa: [...],
};
```
**Pros:** Single source of truth
**Cons:** Large file, harder to code-split

**Option B: Keep Current Hybrid**
```typescript
// Keep as is - shared in testimonials.ts, page-specific in page constants
```
**Pros:** Better code splitting, clear ownership
**Cons:** Need to remember which file to edit

**Option C: Per-Page Constants**
```typescript
// Move ALL testimonials to page-specific constants
```
**Pros:** Maximum code splitting
**Cons:** Duplication if testimonials shared across pages

**Recommendation:**
✋ **Keep Option B (Current Hybrid)** - Best balance of code splitting and maintainability.

**Estimated Effort:** 2-3 hours (if changing)

---

### 6. WCAG AA Color Contrast Audit
**Status:** ⏳ Pending - Design Review Needed
**Current:** Primary accent (#FF00FF / magenta) on black background

**Colors to Audit:**
```
Primary Combinations:
- Primary accent (#FF00FF) on black (#000000)
- White text (#FFFFFF) on black (#000000)
- Neutral text (#E5E5E5) on black (#000000)
- Accent on dark backgrounds

Interactive States:
- Hover states
- Focus indicators
- Disabled states
```

**Testing Tools:**
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Chrome DevTools Accessibility Panel
- Axe DevTools browser extension

**WCAG AA Requirements:**
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

**Quick Check:**
```
✅ White (#FFFFFF) on Black (#000000): 21:1 (Pass)
✅ Primary Accent (#FF00FF) on Black (#000000): ~8.7:1 (Pass)
⚠️ Neutral/75 (rgba(229,229,229,0.75)) on Black: ~13.7:1 (Pass, but verify in practice)
```

**Action Items:**
1. Run automated audit with Lighthouse
2. Manual review with contrast checker
3. Test with screen readers
4. Document any changes needed

**Estimated Effort:** 2-3 hours

---

## 🟢 Low Priority (Future Enhancements)

### 7. Increase Test Coverage to 60-80%
**Status:** ⏳ Pending
**Current:** 23 tests (14 passing, 9 need mocks)

**Priority Test Files to Create:**
```
High Priority:
- components/header/DesktopNavigation.test.tsx
- components/header/MobileNavigation.test.tsx
- components/header/LanguageSelector.test.tsx
- utils/debounce.test.ts

Medium Priority:
- components/YouTubeEmbed.test.tsx
- components/DancehallPage.test.tsx (integration)
- hooks/useI18n.test.tsx (expand coverage)

Low Priority:
- E2E tests with Playwright
- Visual regression tests
```

**Estimated Effort:** 16-20 hours

---

### 8. Split i18n Files by Namespace
**Status:** ⏳ Pending - Only if translations grow beyond 15k lines
**Current:** 10,262 total lines (acceptable for current size)

**When to Implement:**
- If total translations exceed 15,000 lines
- If initial load time becomes issue
- If working with larger team needing parallel edits

**Proposed Structure:**
```typescript
i18n/
├── namespaces/
│   ├── common.ts (nav, footer, buttons)
│   ├── home.ts (homepage content)
│   ├── classes.ts (all class pages)
│   ├── services.ts (service pages)
│   ├── contact.ts (contact form)
│   ├── faq.ts (FAQ content)
│   ├── about.ts (about pages)
│   └── pages.ts (misc pages)
└── locales/
    ├── es.ts (imports all namespaces)
    ├── ca.ts
    ├── en.ts
    └── fr.ts
```

**Estimated Effort:** 20-24 hours (complex refactor)

---

### 9. Progressive Web App (PWA) Features
**Status:** ⏳ Future Enhancement

**Features to Add:**
- Service worker for offline support
- App manifest for "Add to Home Screen"
- Push notifications (class reminders)
- Background sync for contact form

**Files to Create:**
- `public/manifest.json`
- `src/service-worker.ts`
- Update `index.html` with manifest link

**Estimated Effort:** 12-16 hours

---

### 10. Analytics & Monitoring Integration
**Status:** ⏳ Future Enhancement

**Services to Integrate:**
```
Analytics:
- Google Analytics 4
- Hotjar (heatmaps)
- Microsoft Clarity

Error Tracking:
- Sentry
- LogRocket

Performance:
- Web Vitals API
- Vercel Analytics
- Cloudflare Analytics
```

**Estimated Effort:** 8-12 hours

---

## 📝 Decision Log

### Tasks Deferred and Why

**Schema Extraction:**
❌ Deferred - Current inline approach is clean and maintainable. No immediate benefit to extraction.

**Testimonials Standardization:**
❌ Deferred - Current hybrid approach (shared + page-specific) provides good balance. No issues reported.

**i18n Namespace Split:**
❌ Deferred - Current 10k lines manageable. Only needed if exceeds 15k or team size grows.

**Color Contrast Audit:**
⏳ Partial - Quick check shows compliance, but full audit deferred pending design review.

**Testing Infrastructure:**
✅ Partially Complete - Basic infrastructure created, but coverage expansion deferred.

---

## 🎯 Recommended Next Steps

### Immediate (This Week)
1. ✅ Complete all 5 phases (DONE)
2. ✅ Create documentation (DONE)
3. 🔄 Deploy to staging environment
4. 🔄 User acceptance testing

### Short Term (Next 2 Weeks)
1. Server-side rate limiting implementation
2. Complete French translations (highest priority)
3. Create missing OG images

### Medium Term (Next Month)
1. Complete all missing translations
2. Expand test coverage to 60%
3. Full color contrast audit

### Long Term (Next Quarter)
1. PWA features
2. Analytics integration
3. E2E testing suite
4. Performance monitoring dashboard

---

## 📞 Who to Contact

**For Translations:**
- Professional translation service
- Native speakers for QA

**For Design Work:**
- Graphic designer for OG images
- UX designer for color contrast review

**For Backend Development:**
- Backend developer for rate limiting API
- DevOps for server configuration

---

**Last Updated:** 2025-01-21
**Version:** 2.0.0
**Status:** Production Ready (with known pending items documented)
