/**
 * Size Limit Configuration
 *
 * Note: Locale bundles (i18n-es-*.js, etc.) were removed because translations
 * are now loaded dynamically via i18next resourcesToBackend (JSON files).
 * The pages-*.js files contain page-specific content per locale.
 *
 * TODO: Add locale bundle tracking once namespace lazy loading is implemented
 * (Phase 2 of i18next optimization)
 */
module.exports = [
  {
    name: 'Main JS Bundle',
    path: 'dist/assets/index-*.js',
    limit: '170 KB',
    gzip: true,
  },
  {
    name: 'React Core',
    path: 'dist/assets/react-core-*.js',
    limit: '10 KB',
    gzip: true,
  },
  {
    name: 'React DOM',
    path: 'dist/assets/react-dom-*.js',
    limit: '56 KB',
    gzip: true,
  },
  {
    name: 'Router',
    path: 'dist/assets/router-*.js',
    limit: '40 KB',
    gzip: true,
  },
  {
    name: 'Total CSS',
    path: 'dist/assets/*.css',
    limit: '30 KB',
    gzip: true,
  },
  {
    name: 'Templates Bundle',
    path: 'dist/assets/templates-*.js',
    limit: '180 KB',
    gzip: true,
  },
  {
    name: 'Constants Bundle',
    path: 'dist/assets/constants-*.js',
    limit: '150 KB',
    gzip: true,
  },
];
