const path = require('node:path');
const fs = require('node:fs');
const {patch} = require('./skp-memory-patch.cjs');
require('esbuild').build({
  entryPoints: [path.join(__dirname, 'skp-entry.mjs')], bundle: true,
  outfile: path.join(__dirname, '../app/src/main/assets/cad/openskp.js'),
  format: 'iife', globalName: 'OpenSkp', platform: 'browser', target: 'chrome80',
  external: ['fs', 'path'], minify: true, legalComments: 'inline',
  plugins: [{name:'sparse-edge-flags',setup(build) {
    build.onLoad({filter:/openskp[/\\]dist[/\\]index\.mjs$/},args=>({contents:patch(fs.readFileSync(args.path,'utf8')),loader:'js'}));
  }}]
}).catch(error=>{console.error(error);process.exitCode=1;});
