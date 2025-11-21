# Deployment Guide

## Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All TypeScript errors resolved
- [ ] No console errors in production build
- [ ] Build completes with 0 warnings
- [ ] All tests passing (run `npm test`)
- [ ] Code reviewed and approved

### ✅ Performance
- [ ] Bundle size under 300 KB (currently 250.79 KB ✅)
- [ ] Gzipped size under 90 KB (currently 73.64 KB ✅)
- [ ] Lazy loading implemented for heavy components
- [ ] Images optimized (WebP + fallbacks)
- [ ] Lighthouse score > 90 for all metrics

### ✅ SEO
- [ ] Meta tags present on all pages
- [ ] Canonical URLs configured
- [ ] Schema.org markup implemented
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Open Graph images present

### ✅ Accessibility
- [ ] WCAG 2.1 Level AA compliant
- [ ] Keyboard navigation works on all pages
- [ ] ARIA labels present on interactive elements
- [ ] Color contrast ratios meet standards
- [ ] Screen reader tested

### ✅ Security
- [ ] No sensitive data in client code
- [ ] XSS prevention with DOMPurify
- [ ] Rate limiting implemented
- [ ] HTTPS enforced
- [ ] Security headers configured

### ✅ Internationalization
- [ ] All 4 languages working (es, ca, en, fr)
- [ ] Language switching functional
- [ ] Translations complete for all pages
- [ ] Locale routing working correctly

## Build Process

### 1. Clean Build
```bash
# Clear previous builds
rm -rf dist/

# Install dependencies (if needed)
npm ci

# Run production build
npm run build
```

### 2. Verify Build Output
```bash
# Should output:
# ✓ built in ~12s
# 🎉 Prerendering complete! Generated 29 pages
# 📊 Summary: 4 languages, 7 pages per language
```

### 3. Test Production Build Locally
```bash
# Preview production build
npm run preview

# Open http://localhost:4173
# Test all critical paths:
# - Homepage loads
# - Navigation works
# - Language switching
# - Contact form (with rate limiting)
# - All class pages render
```

## Deployment Platforms

### Option 1: Vercel (Recommended)

#### Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### vercel.json Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### Option 2: Netlify

#### netlify.toml Configuration
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    X-XSS-Protection = "1; mode=block"
```

#### Deploy Steps
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Option 3: GitHub Pages

#### Setup GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build

    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Option 4: Traditional Web Server (Apache/Nginx)

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name farrayscenter.com www.farrayscenter.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name farrayscenter.com www.farrayscenter.com;

    # SSL configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    root /var/www/farrayscenter/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 256;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache Configuration (.htaccess)
```apache
# Redirect to HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# SPA routing
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Frame-Options "DENY"
  Header set X-Content-Type-Options "nosniff"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Cache control
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType application/font-woff "access plus 1 year"
  ExpiresByType application/font-woff2 "access plus 1 year"
</IfModule>
```

## Post-Deployment Verification

### 1. Functionality Tests
```bash
# Test these URLs manually:
✓ https://farrayscenter.com (redirects to /es)
✓ https://farrayscenter.com/es
✓ https://farrayscenter.com/ca
✓ https://farrayscenter.com/en
✓ https://farrayscenter.com/fr
✓ https://farrayscenter.com/es/clases/dancehall-barcelona
✓ https://farrayscenter.com/es/contacto (test rate limiting)
```

### 2. Performance Tests
```bash
# Run Lighthouse audit
npx lighthouse https://farrayscenter.com --view

# Target scores:
# Performance: > 90
# Accessibility: > 95
# Best Practices: > 95
# SEO: > 95
```

### 3. SEO Verification
```bash
# Check meta tags
curl -I https://farrayscenter.com/es

# Verify sitemap
curl https://farrayscenter.com/sitemap.xml

# Test robots.txt
curl https://farrayscenter.com/robots.txt

# Google Search Console
# - Submit sitemap
# - Request indexing for key pages
# - Monitor coverage issues
```

### 4. Security Tests
```bash
# Check security headers
curl -I https://farrayscenter.com

# Verify HTTPS
# Should see: strict-transport-security header

# Test rate limiting
# Submit contact form 4 times in quick succession
# 4th attempt should be blocked
```

## Monitoring Setup

### 1. Google Analytics 4
```html
<!-- Add to index.html before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 2. Google Search Console
- Add property: https://farrayscenter.com
- Verify ownership (DNS or HTML tag)
- Submit sitemap.xml
- Monitor indexing status

### 3. Web Vitals Monitoring
```typescript
// Add to main.tsx
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics({ name, value, id }: { name: string; value: number; id: string }) {
  // Send to your analytics endpoint
  console.log({ metric: name, value, id });
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

## Rollback Plan

### If Issues Occur

#### Vercel/Netlify
```bash
# Vercel - rollback to previous deployment
vercel rollback <deployment-url>

# Netlify - restore from previous deploy
netlify deploy --prod --alias=previous-deploy
```

#### GitHub Pages
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

#### Traditional Server
```bash
# Keep backup of previous dist/
cp -r dist/ dist.backup/

# Restore if needed
rm -rf dist/
mv dist.backup/ dist/
```

## Common Issues & Solutions

### Issue 1: 404 on Page Refresh
**Cause:** SPA routing not configured on server
**Solution:** Add rewrite rules (see server configs above)

### Issue 2: Slow Initial Load
**Cause:** Bundle too large or not code-split
**Solution:** Check bundle analyzer, verify lazy loading

### Issue 3: Missing Translations
**Cause:** i18n keys not found
**Solution:** Check browser console for missing key warnings

### Issue 4: Rate Limiting Not Working
**Cause:** localStorage blocked or cleared
**Solution:** Implement server-side rate limiting

### Issue 5: Images Not Loading
**Cause:** Incorrect path or missing files
**Solution:** Verify all images in public/ directory

## Environment Variables

### Required
```env
VITE_BASE_URL=https://www.farrayscenter.com
VITE_API_ENDPOINT=https://api.farrayscenter.com (if backend exists)
```

### Optional
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

## Backup & Recovery

### Backup Strategy
```bash
# Backup current deployment
tar -czf backup-$(date +%Y%m%d).tar.gz dist/

# Store in safe location
# Keep last 5 deployments
```

### Recovery
```bash
# Extract backup
tar -xzf backup-20250121.tar.gz

# Deploy restored version
# (follow deployment steps for your platform)
```

## Support & Maintenance

### Regular Tasks
- [ ] Weekly: Check error logs
- [ ] Weekly: Monitor analytics
- [ ] Monthly: Run Lighthouse audits
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Security audit
- [ ] Yearly: Performance review

### Contact
- **Developer:** [Your Name]
- **Support:** support@farrayscenter.com
- **Emergency:** [Phone Number]

---

**Last Updated:** 2025-01-21
**Version:** 2.0.0
**Deployment Checklist:** ✅ Ready for Production
