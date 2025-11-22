module.exports = [
  {
    name: 'Main JS Bundle',
    path: 'dist/assets/index-*.js',
    limit: '150 KB',
  },
  {
    name: 'ES Locale Bundle',
    path: 'dist/assets/es-*.js',
    limit: '150 KB',
  },
  {
    name: 'EN Locale Bundle',
    path: 'dist/assets/en-*.js',
    limit: '120 KB',
  },
  {
    name: 'CA Locale Bundle',
    path: 'dist/assets/ca-*.js',
    limit: '130 KB',
  },
  {
    name: 'FR Locale Bundle',
    path: 'dist/assets/fr-*.js',
    limit: '120 KB',
  },
  {
    name: 'React Vendor',
    path: 'dist/assets/react-vendor-*.js',
    limit: '15 KB',
  },
  {
    name: 'Router Vendor',
    path: 'dist/assets/router-vendor-*.js',
    limit: '35 KB',
  },
  {
    name: 'Total CSS',
    path: 'dist/assets/style-*.css',
    limit: '25 KB',
  },
];
