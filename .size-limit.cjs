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
    limit: '337 KB', // Increased for teacher profiles, class configs, landing pages
    gzip: true,
  },
  {
    name: 'EN Locale Bundle',
    path: 'dist/assets/i18n-en-*.js',
    limit: '333 KB', // Increased for teacher profiles, class configs, landing pages
    gzip: true,
  },
  {
    name: 'CA Locale Bundle',
    path: 'dist/assets/i18n-ca-*.js',
    limit: '356 KB', // Increased for teacher profiles, class configs, landing pages
    gzip: true,
  },
  {
    name: 'FR Locale Bundle',
    path: 'dist/assets/i18n-fr-*.js',
    limit: '368 KB', // Increased for landing pages translations
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
