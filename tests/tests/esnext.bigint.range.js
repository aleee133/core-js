/* eslint-disable es/no-bigint -- safe */
if (typeof BigInt == 'function') QUnit.test('BigInt.range', assert => {
  const { range } = BigInt;
  const { from } = Array;
  assert.isFunction(range);
  assert.name(range, 'range');
  assert.arity(range, 3);
  assert.looksNative(range);
  assert.nonEnumerable(BigInt, 'range');

  let iterator = range(BigInt(1), BigInt(2));

  assert.isIterator(iterator);
  assert.isIterable(iterator);
  assert.deepEqual(iterator.next(), {
    value: BigInt(1),
    done: false,
  });
  assert.deepEqual(iterator.next(), {
    value: undefined,
    done: true,
  });

  assert.deepEqual(from(range(BigInt(-1), BigInt(5))), [BigInt(-1), BigInt(0), BigInt(1), BigInt(2), BigInt(3), BigInt(4)]);
  assert.deepEqual(from(range(BigInt(-5), BigInt(1))), [BigInt(-5), BigInt(-4), BigInt(-3), BigInt(-2), BigInt(-1), BigInt(0)]);
  assert.deepEqual(
    from(range(BigInt('9007199254740991'), BigInt('9007199254740992'), { inclusive: true })),
    [BigInt('9007199254740991'), BigInt('9007199254740992')],
  );
  assert.deepEqual(from(range(BigInt(0), BigInt(0))), []);
  assert.deepEqual(from(range(BigInt(0), BigInt(-5), BigInt(1))), []);

  iterator = range(BigInt(1), BigInt(3));
  assert.deepEqual(iterator.start, BigInt(1));
  assert.deepEqual(iterator.end, BigInt(3));
  assert.deepEqual(iterator.step, BigInt(1));
  assert.same(false, iterator.inclusive);

  iterator = range(BigInt(-1), BigInt(-3), { inclusive: true });
  assert.deepEqual(iterator.start, BigInt(-1));
  assert.deepEqual(iterator.end, BigInt(-3));
  assert.same(iterator.step, BigInt(-1));
  assert.same(iterator.inclusive, true);

  iterator = range(BigInt(-1), BigInt(-3), { step: BigInt(4), inclusive() { /* empty */ } });
  assert.same(iterator.start, BigInt(-1));
  assert.same(iterator.end, BigInt(-3));
  assert.same(iterator.step, BigInt(4));
  assert.same(iterator.inclusive, true);

  iterator = range(BigInt(0), BigInt(5));
  assert.throws(() => Object.getOwnPropertyDescriptor(iterator, 'start').call({}), TypeError);

  assert.throws(() => range(Infinity, BigInt(10), BigInt(0)), TypeError);
  assert.throws(() => range(-Infinity, BigInt(10), BigInt(0)), TypeError);
  assert.throws(() => range(BigInt(0), BigInt(10), Infinity), TypeError);
  assert.throws(() => range(BigInt(0), BigInt(10), { step: Infinity }), TypeError);

  assert.throws(() => range({}, BigInt(1)), TypeError);
  assert.throws(() => range(BigInt(1), {}), TypeError);
});
