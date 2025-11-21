# Self-Hosted Google Fonts

This directory contains self-hosted Roboto font files to eliminate external dependencies and improve performance.

## Files

- `roboto-v30-latin-300.woff2` - Roboto Light (10.2 KB)
- `roboto-v30-latin-regular.woff2` - Roboto Regular (10.8 KB)
- `roboto-v30-latin-500.woff2` - Roboto Medium (10.1 KB)
- `roboto-v30-latin-700.woff2` - Roboto Bold (10.0 KB)
- `roboto-v30-latin-900.woff2` - Roboto Black (9.9 KB)

**Total size:** ~51 KB (vs ~15-20 KB per external request with latency)

## Benefits

✅ **No external DNS lookup** - Saves 50-100ms on first load
✅ **No CORS preflight** - Eliminates additional roundtrip
✅ **Better caching control** - Fonts cached with your assets
✅ **Privacy** - No third-party requests to Google
✅ **Reliability** - Works offline, no CDN dependency

## Performance Impact

- **Before:** 2-3 external requests to fonts.googleapis.com + fonts.gstatic.com
- **After:** 2 preloaded local fonts (regular + bold) + 3 lazy-loaded weights
- **Time saved:** ~100-200ms on first contentful paint

## Implementation

Fonts are loaded via:
1. `fonts.css` - @font-face declarations with `font-display: swap`
2. `index.html` - Preload hints for regular (400) and bold (700) weights
3. Lazy load for 300, 500, and 900 weights on-demand

## Source

Downloaded from Google Fonts CDN (v30):
- https://fonts.gstatic.com/s/roboto/v30/

Font subset: **Latin** (most common characters, smaller file size)

## Maintenance

To update fonts in the future:
1. Visit https://google-webfonts-helper.herokuapp.com/fonts/roboto
2. Select Latin charset
3. Select weights: 300, 400, 500, 700, 900
4. Download woff2 files
5. Replace files in this directory
6. Update `fonts.css` if paths change
