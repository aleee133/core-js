import { DESCRIPTORS } from '../helpers/constants';

QUnit.test('Reflect.deleteProperty', assert => {
  const { deleteProperty } = Reflect;
  const { defineProperty, keys } = Object;
  assert.isFunction(deleteProperty);
  assert.arity(deleteProperty, 2);
  assert.name(deleteProperty, 'deleteProperty');
  assert.looksNative(deleteProperty);
  assert.nonEnumerable(Reflect, 'deleteProperty');
  const object = { bar: 456 };
  assert.same(true, deleteProperty(object, 'bar'));
  assert.same(keys(object).length, 0);
  if (DESCRIPTORS) {
    assert.same(false, deleteProperty(defineProperty({}, 'foo', {
      value: 42,
    }), 'foo'));
  }
  assert.throws(() => deleteProperty(42, 'foo'), TypeError, 'throws on primitive');
});
