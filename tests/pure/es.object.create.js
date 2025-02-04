import { DESCRIPTORS } from '../helpers/constants';

import { create, getPrototypeOf, getOwnPropertyNames } from 'core-js-pure/features/object';

QUnit.test('Object.create', assert => {
  function getPropertyNames(object) {
    let result = [];
    do {
      result = result.concat(getOwnPropertyNames(object));
    } while (object = getPrototypeOf(object));
    return result;
  }
  assert.isFunction(create);
  assert.arity(create, 2);
  let object = { q: 1 };
  assert.ok({}.isPrototypeOf.call(object, create(object)));
  assert.same(create(object).q, 1);
  function C() {
    return this.a = 1;
  }
  assert.ok(create(new C()) instanceof C);
  assert.same(C.prototype, getPrototypeOf(getPrototypeOf(create(new C()))));
  assert.same(create(new C()).a, 1);
  assert.same(create({}, { a: { value: 42 } }).a, 42);
  object = create(null, { w: { value: 2 } });
  assert.same(object, Object(object));
  assert.ok(!('toString' in object));
  assert.same(object.w, 2);
  assert.deepEqual(getPropertyNames(create(null)), []);
});

QUnit.test('Object.create.sham flag', assert => {
  assert.same(create.sham, DESCRIPTORS ? undefined : true);
});
