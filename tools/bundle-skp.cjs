const path = require('node:path');
require('esbuild').buildSync({
  entryPoints: [path.join(__dirname, 'skp-entry.mjs')], bundle: true,
  outfile: path.join(__dirname, '../app/src/main/assets/cad/openskp.js'),
  format: 'iife', globalName: 'OpenSkp', platform: 'browser', target: 'chrome80',
  external: ['fs', 'path'], minify: true, legalComments: 'inline'
});
