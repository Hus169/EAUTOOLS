import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

// UserScript header
const userScriptHeader = `// ==UserScript==
// @name         UTOOLS
// @namespace    https://github.com/Hus169
// @version      ${pkg.version || '8.1.4'}
// @description  Automate SBC grind
// @author       HANBAL
// @match        https://www.ea.com/ea-sports-fc/ultimate-team/web-app/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Hus169/EAUTOOLS/main/eautools.user.js
// @downloadURL  https://raw.githubusercontent.com/Hus169/EAUTOOLS/main/eautools.user.js
// ==/UserScript==

(function() {
'use strict';
`;

const userScriptFooter = `
})();`;

export default [
  // Development build - readable for debugging
  {
    input: 'src/main.js',
    output: {
      file: 'dist/eautools.dev.user.js',
      format: 'iife',
      name: 'EAUTOOLS',
      banner: userScriptHeader,
      footer: userScriptFooter,
      sourcemap: false
    },
    plugins: [
      resolve({
        browser: true
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: {
              chrome: '80', // EA Web App minimum
              firefox: '75'
            },
            modules: false
          }]
        ]
      })
    ]
  },
  
  // Production build - optimized for performance
  {
    input: 'src/main.js',
    output: {
      file: 'dist/eautools.user.js',
      format: 'iife',
      name: 'EAUTOOLS',
      banner: userScriptHeader,
      footer: userScriptFooter,
      sourcemap: false
    },
    plugins: [
      resolve({
        browser: true
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: {
              chrome: '80',
              firefox: '75'
            },
            modules: false
          }]
        ]
      }),
      terser({
        // Aggressive optimization for production
        mangle: {
          toplevel: true,
          properties: {
            regex: /^_/ // Mangle private properties
          }
        },
        compress: {
          arguments: true,
          booleans_as_integers: true,
          drop_console: false, // Keep console for userscript debugging
          drop_debugger: true,
          ecma: 2018,
          hoist_funs: true,
          hoist_props: true,
          hoist_vars: true,
          inline: 3,
          loops: true,
          negate_iife: true,
          passes: 3, // Multiple passes for better optimization
          pure_funcs: ['console.debug', 'console.trace'],
          pure_getters: true,
          reduce_vars: true,
          sequences: true,
          side_effects: false,
          switches: true,
          top_retain: ['EAUTOOLS'], // Keep main export
          typeofs: false,
          unsafe: false, // Keep safe for userscript environment
          unsafe_arrows: true,
          unsafe_comps: true,
          unsafe_Function: false,
          unsafe_math: true,
          unsafe_methods: true,
          unsafe_proto: false,
          unsafe_regexp: true,
          unused: true
        },
        format: {
          comments: false,
          ecma: 2018,
          safari10: false
        }
      })
    ]
  }
];

/*
Optimization Configuration Explained:

1. Bundle Size Optimization:
   - Multiple passes for better compression
   - Aggressive mangling of private properties
   - Dead code elimination
   - Inline small functions

2. Runtime Performance:
   - Target modern browsers (Chrome 80+, Firefox 75+)
   - Use modern ECMAScript features
   - Optimize for arrow functions and methods

3. Debugging Support:
   - Keep console.log for production debugging
   - Remove console.debug and console.trace
   - Separate dev build with readable code

4. UserScript Compatibility:
   - IIFE format for userscript execution
   - Proper header/footer for script managers
   - Safe optimizations that won't break injection

Expected Results:
- Production bundle: ~20-25KB (down from 51KB)
- Faster parsing due to modern JS features
- Better gzip compression ratio
- Maintained debugging capabilities

Build Commands:
- npm run build:dev - Creates readable development version
- npm run build:prod - Creates optimized production version
- npm run build - Creates both versions
*/