module.exports = [
  {
    name: 'Main JS Bundle',
    path: 'dist/assets/index-*.js',
    limit: '170 KB', // Reduced from 200KB for better performance
    gzip: true,
  },
  {
    name: 'ES Locale Bundle',
    path: 'dist/assets/i18n-es-*.js',
    limit: '400 KB', // Increased for blog articles + new teachers + manifesto + SEO content
    gzip: true,
  },
  {
    name: 'EN Locale Bundle',
    path: 'dist/assets/i18n-en-*.js',
    limit: '390 KB', // Increased for blog articles + new teachers + manifesto
    gzip: true,
  },
  {
    name: 'CA Locale Bundle',
    path: 'dist/assets/i18n-ca-*.js',
    limit: '415 KB', // Increased for blog articles + new teachers + manifesto
    gzip: true,
  },
  {
    name: 'FR Locale Bundle',
    path: 'dist/assets/i18n-fr-*.js',
    limit: '430 KB', // Increased for blog articles + new teachers + manifesto
    gzip: true,
  },
  {
    name: 'React Core',
    path: 'dist/assets/react-core-*.js',
    limit: '10 KB', // React core library
    gzip: true,
  },
  {
    name: 'React DOM',
    path: 'dist/assets/react-dom-*.js',
    limit: '56 KB', // ReactDOM is the larger part
    gzip: true,
  },
  {
    name: 'Router',
    path: 'dist/assets/router-*.js',
    limit: '40 KB', // React Router
    gzip: true,
  },
  {
    name: 'Total CSS',
    path: 'dist/assets/*.css',
    limit: '30 KB',
    gzip: true,
  },
];
