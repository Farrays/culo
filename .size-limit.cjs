module.exports = [
  {
    name: 'Main JS Bundle',
    path: 'dist/assets/index-*.js',
    limit: '200 KB',
  },
  {
    name: 'ES Locale Bundle',
    path: 'dist/assets/es-*.js',
    limit: '200 KB',
  },
  {
    name: 'EN Locale Bundle',
    path: 'dist/assets/en-*.js',
    limit: '150 KB',
  },
  {
    name: 'CA Locale Bundle',
    path: 'dist/assets/ca-*.js',
    limit: '160 KB',
  },
  {
    name: 'FR Locale Bundle',
    path: 'dist/assets/fr-*.js',
    limit: '150 KB',
  },
  {
    name: 'React Vendor',
    path: 'dist/assets/react-vendor-*.js',
    limit: '20 KB',
  },
  {
    name: 'Router Vendor',
    path: 'dist/assets/router-vendor-*.js',
    limit: '40 KB',
  },
  {
    name: 'Total CSS',
    path: 'dist/assets/style-*.css',
    limit: '30 KB',
  },
];
