# Content Security Policy (CSP) Configuration

## Important: CSP Hash Maintenance

The `vercel.json` file contains a Content Security Policy (CSP) header with a **hardcoded SHA-256 hash** for inline scripts:

```
script-src 'self' 'sha256-lE663GA/AVh64NJNFLdYmeZ7ofg1KbcgSjiXS/ApOz8=' ...
```

### When to Update the Hash

You **MUST** regenerate and update this hash whenever you modify:

1. The inline JSON-LD structured data script in `index.html`
2. Any inline script tags in the HTML

### How to Update the Hash

```bash
# 1. Run the hash generation script
npm run csp:hash

# 2. Copy the output hash (looks like: sha256-ABC123...)

# 3. Update vercel.json > Content-Security-Policy > script-src
# Replace the old hash with the new one

# 4. Test locally
npm run build
npm run preview
# Check browser console for CSP violations

# 5. Commit and deploy
git add vercel.json
git commit -m "Update CSP hash for inline scripts"
```

### Current Hash Information

**Last Updated**: 2025-11-22  
**Current Hash**: `sha256-lE663GA/AVh64NJNFLdYmeZ7ofg1KbcgSjiXS/ApOz8=`  
**Script Type**: JSON-LD structured data (DanceSchool schema)  
**Location**: `index.html` line 48-158

### Troubleshooting CSP Violations

If you see CSP errors in the browser console like:

```
Refused to execute inline script because it violates the following Content Security Policy directive...
```

This means:

1. The inline script content changed
2. The hash in `vercel.json` is outdated
3. You need to regenerate the hash with `npm run csp:hash`

### CSP Directives Explained

- `default-src 'self'` - Only load resources from same origin by default
- `script-src 'self' 'sha256-...'` - Scripts from same origin + whitelisted inline scripts
- `style-src 'self' 'unsafe-inline'` - Styles from same origin + inline styles (TailwindCSS)
- `img-src 'self' data: https: blob:` - Images from any HTTPS source
- `connect-src 'self' https://...` - API calls to same origin + trusted services
- `frame-src https://www.youtube.com` - Only YouTube embeds allowed
- `object-src 'none'` - No Flash/Java plugins allowed

### Future Enhancement

Consider automating CSP hash validation in CI pipeline to detect mismatches before deployment.

### References

- [CSP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Hash Generator](https://report-uri.com/home/hash)
- [Google CSP Evaluator](https://csp-evaluator.withgoogle.com/)
