import { createIterable } from '../helpers/helpers';

QUnit.test('Set#intersection', assert => {
  const { intersection } = Set.prototype;
  const { from } = Array;

  assert.isFunction(intersection);
  assert.arity(intersection, 1);
  assert.name(intersection, 'intersection');
  assert.looksNative(intersection);
  assert.nonEnumerable(Set.prototype, 'intersection');

  const set = new Set([1]);
  assert.notStrictEqual(set.intersection([2]), set);

  assert.deepEqual(from(new Set([1, 2, 3]).intersection([4, 5])), []);
  assert.deepEqual(from(new Set([1, 2, 3]).intersection([2, 3, 4])), [2, 3]);
  assert.deepEqual(from(new Set([1, 2, 3]).intersection(createIterable([2, 3, 4]))), [2, 3]);

  assert.throws(() => new Set([1, 2, 3]).intersection(), TypeError);

  assert.throws(() => intersection.call({}, [1, 2, 3]), TypeError);
  assert.throws(() => intersection.call(undefined, [1, 2, 3]), TypeError);
  assert.throws(() => intersection.call(null, [1, 2, 3]), TypeError);
});
