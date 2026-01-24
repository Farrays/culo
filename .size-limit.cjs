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
    limit: '395 KB', // Increased for blog articles + new teachers + manifesto
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
    name: 'React Vendor',
    path: 'dist/assets/react-vendor-*.js',
    limit: '65 KB', // React + ReactDOM is ~50-60 KB gzipped
    gzip: true,
  },
  {
    name: 'Router Vendor',
    path: 'dist/assets/router-vendor-*.js',
    limit: '40 KB',
    gzip: true,
  },
  {
    name: 'Total CSS',
    path: 'dist/assets/*.css',
    limit: '30 KB',
    gzip: true,
  },
];
