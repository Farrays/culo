# Security Headers Configuration
# Deploy this configuration to your web server (Nginx, Apache, Cloudflare, etc.)

## CRITICAL SECURITY HEADERS

### 1. Content Security Policy (CSP)
Protects against XSS, clickjacking, and other code injection attacks.

**For Nginx (_headers.conf):**
```nginx
# Content Security Policy
add_header Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://aistudiocdn.com https://esm.sh https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https: blob:;
    connect-src 'self' https://sentry.io https://*.sentry.io;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
" always;

# Prevent clickjacking
add_header X-Frame-Options "DENY" always;

# Prevent MIME sniffing
add_header X-Content-Type-Options "nosniff" always;

# Enable XSS filter
add_header X-XSS-Protection "1; mode=block" always;

# Referrer policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions policy (formerly Feature-Policy)
add_header Permissions-Policy "
    geolocation=(),
    microphone=(),
    camera=(),
    payment=(),
    usb=(),
    magnetometer=(),
    gyroscope=()
" always;

# HTTPS enforcement (HSTS) - Only enable after confirming HTTPS works
# add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

**For Apache (.htaccess):**
```apache
<IfModule mod_headers.c>
    # Content Security Policy
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://aistudiocdn.com https://esm.sh; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://sentry.io; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"

    # Security Headers
    Header always set X-Frame-Options "DENY"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"

    # HSTS (uncomment after HTTPS is working)
    # Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
</IfModule>
```

**For Cloudflare (Transform Rules):**
```
1. Go to Cloudflare Dashboard > Rules > Transform Rules
2. Click "Modify Response Header"
3. Add these headers:
   - Content-Security-Policy: [value from above]
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - X-XSS-Protection: 1; mode=block
   - Referrer-Policy: strict-origin-when-cross-origin
   - Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**For Vercel (vercel.json):**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://aistudiocdn.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://sentry.io; frame-ancestors 'none';"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        }
      ]
    }
  ]
}
```

### 2. Compression (Brotli + Gzip)

**For Nginx:**
```nginx
# Gzip compression
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

# Brotli compression (if module installed)
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
```

**For Apache:**
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

### 3. Caching Headers

**For Nginx:**
```nginx
# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Cache HTML with revalidation
location ~* \.(html)$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
```

### 4. HTTP/2 & HTTP/3

**For Nginx:**
```nginx
listen 443 ssl http2;
listen [::]:443 ssl http2;

# HTTP/3 (if supported)
listen 443 quic reuseport;
add_header Alt-Svc 'h3=":443"; ma=86400';
```

## Testing Security Headers

After deployment, test your headers at:
- https://securityheaders.com/
- https://observatory.mozilla.org/

Target Score: A+ on both platforms

## Notes
- Start with relaxed CSP, then tighten based on console errors
- Enable HSTS only after confirming HTTPS works 100%
- Monitor Sentry for CSP violations
- Test thoroughly in all browsers after applying
