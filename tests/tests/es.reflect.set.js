import { DESCRIPTORS, NATIVE } from '../helpers/constants';

QUnit.test('Reflect.set', assert => {
  const { set } = Reflect;
  const { defineProperty, getOwnPropertyDescriptor, create, getPrototypeOf } = Object;
  assert.isFunction(set);
  if (NATIVE) assert.arity(set, 3);
  assert.name(set, 'set');
  assert.looksNative(set);
  assert.nonEnumerable(Reflect, 'set');
  const object = {};
  assert.ok(set(object, 'quux', 654), true);
  assert.same(object.quux, 654);
  let target = {};
  const receiver = {};
  set(target, 'foo', 1, receiver);
  assert.same(target.foo, undefined, 'target.foo === undefined');
  assert.same(receiver.foo, 1, 'receiver.foo === 1');
  if (DESCRIPTORS) {
    defineProperty(receiver, 'bar', {
      value: 0,
      writable: true,
      enumerable: false,
      configurable: true,
    });
    set(target, 'bar', 1, receiver);
    assert.same(receiver.bar, 1, 'receiver.bar === 1');
    assert.same(false, getOwnPropertyDescriptor(receiver, 'bar').enumerable, 'enumerability not overridden');
    let out = null;
    target = create(defineProperty({ z: 3 }, 'w', {
      set() {
        out = this;
      },
    }), {
      x: {
        value: 1,
        writable: true,
        configurable: true,
      },
      y: {
        set() {
          out = this;
        },
      },
      c: {
        value: 1,
        writable: false,
        configurable: false,
      },
    });
    assert.same(true, set(target, 'x', 2, target), 'set x');
    assert.same(target.x, 2, 'set x');
    out = null;
    assert.same(true, set(target, 'y', 2, target), 'set y');
    assert.same(out, target, 'set y');
    assert.same(true, set(target, 'z', 4, target));
    assert.same(target.z, 4, 'set z');
    out = null;
    assert.same(true, set(target, 'w', 1, target), 'set w');
    assert.same(out, target, 'set w');
    assert.same(true, set(target, 'u', 0, target), 'set u');
    assert.same(target.u, 0, 'set u');
    assert.same(false, set(target, 'c', 2, target), 'set c');
    assert.same(target.c, 1, 'set c');

    // https://github.com/zloirock/core-js/issues/392
    let o = defineProperty({}, 'test', {
      writable: false,
      configurable: true,
    });
    assert.same(false, set(getPrototypeOf(o), 'test', 1, o));

    // https://github.com/zloirock/core-js/issues/393
    o = defineProperty({}, 'test', {
      get() { /* empty */ },
    });
    assert.notThrows(() => !set(getPrototypeOf(o), 'test', 1, o));
    o = defineProperty({}, 'test', {
      // eslint-disable-next-line no-unused-vars -- required for testing
      set(v) { /* empty */ },
    });
    assert.notThrows(() => !set(getPrototypeOf(o), 'test', 1, o));
  }
  assert.throws(() => set(42, 'q', 42), TypeError, 'throws on primitive');
});
