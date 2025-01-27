import { createIterable, createSetLike } from '../helpers/helpers.js';

import from from 'core-js-pure/es/array/from';
// TODO: use /es/ in core-js@4
import Set from 'core-js-pure/full/set';

QUnit.test('Set#union', assert => {
  const { union } = Set.prototype;

  assert.isFunction(union);
  assert.arity(union, 1);
  assert.name(union, 'union');
  assert.nonEnumerable(Set.prototype, 'union');

  const set = new Set([1]);
  assert.notSame(set.union(new Set()), set);

  assert.deepEqual(from(new Set([1, 2, 3]).union(new Set([4, 5]))), [1, 2, 3, 4, 5]);
  assert.deepEqual(from(new Set([1, 2, 3]).union(new Set([3, 4]))), [1, 2, 3, 4]);
  assert.deepEqual(from(new Set([1, 2, 3]).union(createSetLike([4, 5]))), [1, 2, 3, 4, 5]);
  assert.deepEqual(from(new Set([1, 2, 3]).union(createSetLike([3, 4]))), [1, 2, 3, 4]);

  // TODO: drop from core-js@4
  assert.deepEqual(from(new Set([1, 2, 3]).union([4, 5])), [1, 2, 3, 4, 5]);
  assert.deepEqual(from(new Set([1, 2, 3]).union([3, 4])), [1, 2, 3, 4]);
  assert.deepEqual(from(new Set([1, 2, 3]).union(createIterable([3, 4]))), [1, 2, 3, 4]);

  assert.throws(() => new Set([1, 2, 3]).union(), TypeError);

  assert.throws(() => union.call({}, [1, 2, 3]), TypeError);
  assert.throws(() => union.call(undefined, [1, 2, 3]), TypeError);
  assert.throws(() => union.call(null, [1, 2, 3]), TypeError);
});
