# Open Graph Images - Placeholder Guide

## Required Images

Create these images for optimal social media sharing:

### 1. og-home.jpg
- **Size:** 1200 × 630 pixels (Facebook/LinkedIn standard)
- **Location:** `/public/images/og-home.jpg`
- **Content:** Main school image with logo and tagline
- **Text:** "Farray's International Dance Center - Barcelona"

### 2. og-classes.jpg
- **Size:** 1200 × 630 pixels
- **Location:** `/public/images/og-classes.jpg`
- **Content:** Dance classes montage
- **Text:** "+25 Dance Styles | Método Farray®"

### 3. og-dancehall.jpg
- **Size:** 1200 × 630 pixels
- **Location:** `/public/images/og-dancehall.jpg`
- **Content:** Dancehall class action shot
- **Text:** "Authentic Dancehall in Barcelona"

### 4. og-afrobeats.jpg
- **Size:** 1200 × 630 pixels
- **Location:** `/public/images/og-afrobeats.jpg`
- **Content:** Afrobeats class energy
- **Text:** "Feel the Pulse: Afrobeats Barcelona"

### 5. twitter-image.jpg (Optional)
- **Size:** 1200 × 600 pixels (Twitter optimized)
- **Location:** `/public/images/twitter-image.jpg`

## Design Guidelines

### Colors
- Background: Black (#000000)
- Primary: #FF6B35 (brand orange)
- Text: White (#FFFFFF)

### Typography
- Font: Roboto (already loaded)
- Heading: 700-900 weight
- Tagline: 400-500 weight

### Composition
```
┌─────────────────────────────────┐
│                                 │
│         SCHOOL LOGO             │
│                                 │
│     FARRAY'S INTERNATIONAL      │
│      DANCE CENTER              │
│                                 │
│   Método Farray® | Barcelona   │
│                                 │
│   [Background: Dance Photo]    │
└─────────────────────────────────┘
```

## Tools to Create

### Online (Free)
1. **Canva** - https://canva.com
   - Template: Facebook Post (1200×630)
   - Upload logo and photos
   - Add text overlays

2. **Figma** - https://figma.com
   - More control, professional
   - Reusable templates

### Photoshop/GIMP
- Create 1200×630 canvas
- Import photos
- Add text layers
- Export as JPEG (80% quality)

## Current Placeholder SVG

The code currently uses a simple SVG placeholder that generates:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect fill="#000" width="1200" height="630"/>
  <text fill="#fff" x="50%" y="50%" text-anchor="middle">
    Farray's International Dance Center
  </text>
</svg>
```

## Testing

After creating images, test at:
- **Facebook:** https://developers.facebook.com/tools/debug/
- **Twitter:** https://cards-dev.twitter.com/validator
- **LinkedIn:** Share a post and check preview

## Priority

- ✅ CRITICAL: og-home.jpg (most shared)
- ⚠️ HIGH: og-classes.jpg
- 🟡 MEDIUM: og-dancehall.jpg, og-afrobeats.jpg
- 🟢 LOW: twitter-image.jpg (can use same as og-home)
