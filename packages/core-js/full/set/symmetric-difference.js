require('../../modules/es.array.iterator');
require('../../modules/es.set.constructor');
require('../../modules/es.string.iterator');
require('../../modules/esnext.set.symmetric-difference');
require('../../modules/web.dom-collections.iterator');
var entryUnbind = require('../../internals/entry-unbind');

module.exports = entryUnbind('Set', 'symmetricDifference');
