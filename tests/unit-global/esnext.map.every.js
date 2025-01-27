QUnit.test('Map#every', assert => {
  const { every } = Map.prototype;
  assert.isFunction(every);
  assert.arity(every, 1);
  assert.name(every, 'every');
  assert.looksNative(every);
  assert.nonEnumerable(Map.prototype, 'every');

  let map = new Map([[9, 1]]);
  const context = {};
  map.every(function (value, key, that) {
    assert.same(arguments.length, 3, 'correct number of callback arguments');
    assert.same(value, 1, 'correct value in callback');
    assert.same(key, 9, 'correct index in callback');
    assert.same(that, map, 'correct link to map in callback');
    assert.same(this, context, 'correct callback context');
  }, context);
  map = new Map([[0, 1], [1, 2], [2, 3]]);
  assert.true(map.every(it => typeof it == 'number'));
  assert.true(map.every(it => it < 4));
  assert.false(map.every(it => it < 3));
  assert.false(map.every(it => typeof it == 'string'));
  assert.true(map.every(function () {
    return +this === 1;
  }, 1));
  let result = '';
  map.every((value, key) => result += key);
  assert.same(result, '012');
  assert.true(map.every((value, key, that) => that === map));

  assert.throws(() => every.call(new Set(), () => { /* empty */ }), TypeError);
  assert.throws(() => every.call({}, () => { /* empty */ }), TypeError);
  assert.throws(() => every.call([], () => { /* empty */ }), TypeError);
  assert.throws(() => every.call(undefined, () => { /* empty */ }), TypeError);
  assert.throws(() => every.call(null, () => { /* empty */ }), TypeError);
});
