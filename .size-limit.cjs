module.exports = [
  {
    name: 'Main JS Bundle',
    path: 'dist/assets/index-*.js',
    limit: '280 KB',
  },
  {
    name: 'ES Locale Bundle',
    path: 'dist/assets/es-*.js',
    limit: '280 KB',
  },
  {
    name: 'EN Locale Bundle',
    path: 'dist/assets/en-*.js',
    limit: '230 KB',
  },
  {
    name: 'CA Locale Bundle',
    path: 'dist/assets/ca-*.js',
    limit: '240 KB',
  },
  {
    name: 'FR Locale Bundle',
    path: 'dist/assets/fr-*.js',
    limit: '230 KB',
  },
  {
    name: 'React Vendor',
    path: 'dist/assets/react-vendor-*.js',
    limit: '15 KB',
  },
  {
    name: 'Router Vendor',
    path: 'dist/assets/router-vendor-*.js',
    limit: '50 KB',
  },
  {
    name: 'Total CSS',
    path: 'dist/assets/style-*.css',
    limit: '50 KB',
  },
];
