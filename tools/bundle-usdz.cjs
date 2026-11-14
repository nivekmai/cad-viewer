const path=require('node:path');
require('esbuild').build({entryPoints:[path.join(__dirname,'usdz-entry.mjs')],bundle:true,
 outfile:path.join(__dirname,'../app/src/main/assets/cad/usdz.js'),format:'iife',globalName:'UsdImport',platform:'browser',target:'chrome100',minify:true,legalComments:'inline'
}).catch(e=>{console.error(e);process.exitCode=1;});
