import { createIterable, nativeSubclass } from '../helpers/helpers';
import { DESCRIPTORS } from '../helpers/constants';

import { Symbol, WeakSet } from 'core-js-pure';
import getIteratorMethod from 'core-js-pure/features/get-iterator-method';
import { freeze, keys, getOwnPropertyNames, getOwnPropertySymbols } from 'core-js-pure/features/object';
import ownKeys from 'core-js-pure/features/reflect/own-keys';

QUnit.test('WeakSet', assert => {
  assert.isFunction(WeakSet);
  assert.ok('add' in WeakSet.prototype, 'add in WeakSet.prototype');
  assert.ok('delete' in WeakSet.prototype, 'delete in WeakSet.prototype');
  assert.ok('has' in WeakSet.prototype, 'has in WeakSet.prototype');
  assert.ok(new WeakSet() instanceof WeakSet, 'new WeakSet instanceof WeakSet');
  let object = {};
  assert.ok(new WeakSet(createIterable([object])).has(object), 'Init from iterable');
  const weakset = new WeakSet();
  const frozen = freeze({});
  weakset.add(frozen);
  assert.same(true, weakset.has(frozen), 'works with frozen objects, #1');
  weakset.delete(frozen);
  assert.same(false, weakset.has(frozen), 'works with frozen objects, #2');
  let done = false;
  try {
    new WeakSet(createIterable([null, 1, 2], {
      return() {
        return done = true;
      },
    }));
  } catch { /* empty */ }
  assert.ok(done, '.return #throw');
  assert.ok(!('clear' in WeakSet.prototype), 'should not contains `.clear` method');
  const array = [];
  done = false;
  array['@@iterator'] = undefined;
  array[Symbol.iterator] = function () {
    done = true;
    return getIteratorMethod([]).call(this);
  };
  new WeakSet(array);
  assert.ok(done);
  object = {};
  new WeakSet().add(object);
  if (DESCRIPTORS) {
    const results = [];
    for (const key in object) results.push(key);
    assert.arrayEqual(results, []);
    assert.arrayEqual(keys(object), []);
  }
  assert.arrayEqual(getOwnPropertyNames(object), []);
  if (getOwnPropertySymbols) assert.arrayEqual(getOwnPropertySymbols(object), []);
  if (ownKeys) assert.arrayEqual(ownKeys(object), []);
  if (nativeSubclass) {
    const Subclass = nativeSubclass(WeakSet);
    assert.ok(new Subclass() instanceof Subclass, 'correct subclassing with native classes #1');
    assert.ok(new Subclass() instanceof WeakSet, 'correct subclassing with native classes #2');
    object = {};
    assert.ok(new Subclass().add(object).has(object), 'correct subclassing with native classes #3');
  }

  if (typeof ArrayBuffer == 'function') {
    const buffer = new ArrayBuffer(8);
    const set = new WeakSet([buffer]);
    assert.ok(set.has(buffer), 'works with ArrayBuffer keys');
  }
});

QUnit.test('WeakSet#add', assert => {
  assert.isFunction(WeakSet.prototype.add);
  const weakset = new WeakSet();
  assert.same(weakset.add({}), weakset, 'chaining');
  assert.throws(() => new WeakSet().add(42), 'throws with primitive keys');
});

QUnit.test('WeakSet#delete', assert => {
  assert.isFunction(WeakSet.prototype.delete);
  const a = {};
  const b = {};
  const weakset = new WeakSet().add(a).add(b);
  assert.ok(weakset.has(a), 'WeakSet has values before .delete() #1');
  assert.ok(weakset.has(b), 'WeakSet has values before .delete() #2');
  weakset.delete(a);
  assert.ok(!weakset.has(a), 'WeakSet hasn`t value after .delete() #1');
  assert.ok(weakset.has(b), 'WeakSet hasn`t value after .delete() #2');
  assert.notThrows(() => !weakset.delete(1), 'return false on primitive');
});

QUnit.test('WeakSet#has', assert => {
  assert.isFunction(WeakSet.prototype.has);
  const weakset = new WeakSet();
  assert.ok(!weakset.has({}), 'WeakSet has`nt value');
  const object = {};
  weakset.add(object);
  assert.ok(weakset.has(object), 'WeakSet has value after .add()');
  weakset.delete(object);
  assert.ok(!weakset.has(object), 'WeakSet hasn`t value after .delete()');
  assert.notThrows(() => !weakset.has(1), 'return false on primitive');
});

QUnit.test('WeakSet::@@toStringTag', assert => {
  assert.same(WeakSet.prototype[Symbol.toStringTag], 'WeakSet', 'WeakSet::@@toStringTag is `WeakSet`');
  assert.same(String(new WeakSet()), '[object WeakSet]', 'correct stringification');
});
