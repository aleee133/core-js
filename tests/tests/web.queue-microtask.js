import { NODE } from '../helpers/constants';

QUnit.test('queueMicrotask', assert => {
  assert.expect(5 - NODE);
  assert.isFunction(queueMicrotask);
  assert.arity(queueMicrotask, 1);
  assert.name(queueMicrotask, 'queueMicrotask');
  if (!NODE) assert.looksNative(queueMicrotask);
  const async = assert.async();
  let done = false;
  let after = false;
  queueMicrotask(() => {
    if (!done) {
      done = true;
      assert.ok(after, 'works');
      async();
    }
  });
  setTimeout(() => {
    if (!done) {
      done = true;
      assert.ok(false, 'fails');
      async();
    }
  }, 3e3);
  after = true;
});
