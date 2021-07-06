'use strict';
const { relative } = require('path');
const { readFile, writeFile } = require('fs').promises;
const { green } = require('chalk');
const entries = require('@core-js/compat/entries');

let core = Object.keys(entries).reduce((accumulator, it) => {
  const entry = it.replace(/^core-js(\/)?/, './');
  // eslint-disable-next-line unicorn/no-unsafe-regex -- safe
  const match = entry.match(/^(\.\/(?:es|stable|actual|full|web)(?:\/[\w-]+)?)(?:\/[\w-]+)?/);
  if (match) {
    const [, scope] = match;
    if (entry === scope) {
      const path = `./${ relative('./packages/core-js', require.resolve(`../packages/${ it }`)).replace(/\\/g, '/') }`;
      accumulator[entry] = path;
    } else {
      accumulator[`${ scope }/*`] = `${ scope }/*.js`;
    }
  } return accumulator;
}, {
  '.': './index.js',
  './configurator': './configurator.js',
  './internals/*': './internals/*.js',
  './modules/*': './modules/*.js',
  './proposals': './proposals/index.js',
  './proposals/*': './proposals/*.js',
  './stage': './stage/index.js',
  './stage/*': './stage/*.js',
});

core = Object.entries(core).reduce((accumulator, [key, value]) => {
  accumulator[key] = value;
  accumulator[`./commonjs${ key.slice(1) }`] = `./commonjs${ value.slice(1) }`;
  return accumulator;
}, {
  './package': './package.json',
  './postinstall': './postinstall.js',
});

async function writeExportsField(path, exports) {
  const pkg = JSON.parse(await readFile(path, 'utf8'));
  pkg.exports = exports;
  await writeFile(path, `${ JSON.stringify(pkg, null, '  ') }\n`);
}

(async function () {
  await writeExportsField('./packages/core-js/package.json', {
    ...core,
    './bundle': './bundle/full.js',
    './bundle/actual': './bundle/actual.js',
    './bundle/full': './bundle/full.js',
  });
  await writeExportsField('./packages/core-js-pure/package.json', core);
  // eslint-disable-next-line no-console -- output
  console.log(green('`exports` fields updated'));
})();
