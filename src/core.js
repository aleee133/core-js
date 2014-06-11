// Shortcuts for property names
var OBJECT         = 'Object'
  , FUNCTION       = 'Function'
  , ARRAY          = 'Array'
  , STRING         = 'String'
  , NUMBER         = 'Number'
  , REGEXP         = 'RegExp'
  , MAP            = 'Map'
  , SET            = 'Set'
  , WEAKMAP        = 'WeakMap'
  , WEAKSET        = 'WeakSet'
  , PROMISE        = 'Promise'
  , ARGUMENTS      = 'Arguments'
  , PROCESS        = 'process'
  , PROTOTYPE      = 'prototype'
  , CONSTRUCTOR    = 'constructor'
  , FOR_EACH       = 'forEach'
  , CREATE_ELEMENT = 'createElement'
  // Aliases global objects and prototypes
  , Function       = global[FUNCTION]
  , Object         = global[OBJECT]
  , Array          = global[ARRAY]
  , String         = global[STRING]
  , Number         = global[NUMBER]
  , RegExp         = global[REGEXP]
  , Map            = global[MAP]
  , Set            = global[SET]
  , WeakMap        = global[WEAKMAP]
  , WeakSet        = global[WEAKSET]
  , Promise        = global[PROMISE]
  , Math           = global.Math
  , TypeError      = global.TypeError
  , setTimeout     = global.setTimeout
  , clearTimeout   = global.clearTimeout
  , setInterval    = global.setInterval
  , setImmediate   = global.setImmediate
  , clearImmediate = global.clearImmediate
  , process        = global[PROCESS]
  , document       = global.document
  , Infinity       = 1 / 0
  , $Array         = Array[PROTOTYPE]
  , $Object        = Object[PROTOTYPE]
  , $Function      = Function[PROTOTYPE]
  , Export         = {};
  
// 7.2.3 SameValue(x, y)
var same = Object.is || function(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x !== x && y !== y;
}
// http://jsperf.com/core-js-isobject
function isObject(it){
  return it !== null && (typeof it == 'object' || typeof it == 'function');
}
function isFunction(it){
  return typeof it == 'function';
}
// Native function?
var nativeRegExp = /^\s*function[^{]+\{\s*\[native code\]\s*\}\s*$/;
function isNative(it){
  return nativeRegExp.test(it);
}
var toString = $Object.toString
  , TOSTRINGTAG;
function setToStringTag(constructor, tag, stat){
  if(TOSTRINGTAG && constructor)hidden(stat ? constructor : constructor[PROTOTYPE], TOSTRINGTAG, tag);
}
// Object internal [[Class]]
function classof(it){
  if(it == undefined)return it === undefined ? 'Undefined' : 'Null';
  var cof = toString.call(it).slice(8, -1);
  return TOSTRINGTAG && cof == OBJECT && it[TOSTRINGTAG] ? it[TOSTRINGTAG] : cof;
}

// Function:
var apply = $Function.apply
  , call  = $Function.call
  , path  = framework ? global : Export;
Export._ = path._ = path._ || {};
// Partial apply
function part(/*...args*/){
  var length = arguments.length
    , args   = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((args[i] = arguments[i++]) === _)holder = true;
  return partial(this, args, length, holder, _, false);
}
// Simple context binding
function ctx(fn, that){
  assertFunction(fn);
  return function(/*...args*/){
    return fn.apply(that, arguments);
  }
}
// Internal partial application & context binding
function partial(fn, argsPart, lengthPart, holder, _, bind, context){
  assertFunction(fn);
  return function(/*...args*/){
    var that   = bind ? context : this
      , length = arguments.length
      , i = 0, j = 0, args;
    if(!holder && length == 0)return fn.apply(that, argsPart);
    args = argsPart.slice();
    if(holder)for(;lengthPart > i; i++)if(args[i] === _)args[i] = arguments[j++];
    while(length > j)args.push(arguments[j++]);
    return fn.apply(that, args);
  }
}

// Object:
var create           = Object.create
  , getPrototypeOf   = Object.getPrototypeOf
  , defineProperty   = Object.defineProperty
  , defineProperties = Object.defineProperties
  , getOwnDescriptor = Object.getOwnPropertyDescriptor
  , getKeys          = Object.keys
  , getNames         = Object.getOwnPropertyNames
  , hasOwnProperty   = $Object.hasOwnProperty
  , isEnumerable     = $Object.propertyIsEnumerable
  , __PROTO__        = '__proto__' in $Object
  , DESCRIPTORS      = true
  // Dummy, fix for not array-like ES3 string in es5.js
  , ES5Object        = Object;
function has(object, key){
  return hasOwnProperty.call(object, key);
}
// 19.1.2.1 Object.assign ( target, source, ... )
var assign = Object.assign || function(target, source){
  var T = Object(target)
    , l = arguments.length
    , i = 1;
  while(l > i){
    var S      = ES5Object(arguments[i++])
      , keys   = getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)T[key = keys[j++]] = S[key];
  }
  return T;
}
function getValues(object){
  var O      = ES5Object(object)
    , keys   = getKeys(object)
    , length = keys.length
    , i      = 0
    , result = Array(length);
  while(length > i)result[i] = O[keys[i++]];
  return result;
}
// Simple structured cloning
function clone(it, stack1, stack2){
  var cof     = classof(it)
    , isArray = cof == ARRAY
    , index, result, i, l, k;
  if(isArray || cof == OBJECT){
    index = indexOf.call(stack1, it);
    if(~index)return stack2[index];
    stack1.push(it);
    stack2.push(result = isArray ? Array(l = it.length) : create(getPrototypeOf(it)));
    if(isArray){
      for(i = 0; l > i;)if(has(it, i))result[i] = clone(it[i++], stack1, stack2);
    } else for(k in it)if(has(it, k))result[k] = clone(it[k], stack1, stack2);
    return result;
  }
  return it;
}
function $clone(){
  return clone(this, [], []);
}

// Array:
// array('str1,str2,str3') => ['str1', 'str2', 'str3']
function array(it){
  return String(it).split(',');
}
var push    = $Array.push
  , unshift = $Array.unshift
  , slice   = $Array.slice
  , indexOf = $Array.indexOf
  , forEach = $Array[FOR_EACH]
  , from    = Array.from || function(arrayLike, mapfn /* -> it */, thisArg /* = undefind */){
      if(mapfn !== undefined)assertFunction(mapfn);
      var O      = ES5Object(arrayLike)
        , result = newGeneric(this, Array)
        , i = 0, length;
      if($for && isIterable(O))$for(O).of(function(value){
        push.call(result, mapfn ? mapfn.call(thisArg, value, i++) : value);
      });
      else for(length = toLength(O.length); i < length; i++)push.call(result, mapfn ? mapfn.call(thisArg, O[i], i) : O[i]);
      return result;
    };
// Simple reduce to object
function transform(mapfn, target /* = [] */){
  assertFunction(mapfn);
  var memo = target == undefined ? [] : Object(target)
    , self = ES5Object(this)
    , l    = toLength(self.length)
    , i    = 0;
  for(;l > i; i++)if(i in self && mapfn(memo, self[i], i, this) === false)break;
  return memo;
}
function newGeneric(A, B){
  return new (isFunction(A) ? A : B);
}

// Math:
var ceil   = Math.ceil
  , floor  = Math.floor
  , max    = Math.max
  , min    = Math.min
  , pow    = Math.pow
  , random = Math.random
  , MAX_SAFE_INTEGER = 0x1fffffffffffff; // pow(2, 53) - 1 == 9007199254740991
// 7.1.4 ToInteger
var toInteger = Number.toInteger || function(it){
  var n = +it;
  return n != n ? 0 : n != 0 && n != Infinity && n != -Infinity ? (n > 0 ? floor : ceil)(n) : n;
}
// 7.1.15 ToLength
function toLength(it){
  return it > 0 ? min(toInteger(it), MAX_SAFE_INTEGER) : 0;
}

// Assertion & errors:
var REDUCE_ERROR = 'Reduce of empty object with no initial value';
function assert(condition, _msg){
  if(!condition){
    var msg = _msg
      , i   = 2;
    while(arguments.length > i)msg += ' ' + arguments[i++];
    throw TypeError(msg);
  }
}
function assertFunction(it){
  assert(isFunction(it), it, 'is not a function!');
}
function assertObject(it){
  assert(isObject(it), it, 'is not an object!');
  return it;
}
function assertInstance(it, constructor, name){
  assert(it instanceof constructor, name, ": please use the 'new' operator!");
}

var symbolUniq = 0;
function symbol(key){
  return '@@' + key + '_' + (++symbolUniq + random()).toString(36);
}
function descriptor(bitmap, value){
  return {
    enumerable  : !!(bitmap & 1),
    configurable: !!(bitmap & 2),
    writable    : !!(bitmap & 4),
    value       : value
  }
}
function hidden(object, key, value){
  return defineProperty(object, key, descriptor(6, value));
}

var ITERATOR, $for, isIterable, getIterator, objectIterators, COLLECTION_KEYS, SHIM_MAP, SHIM_SET; // define in over modules

var GLOBAL = 1
  , STATIC = 2
  , PROTO  = 4;
function $define(type, name, source, forced /* = false */){
  var key, own, prop
    , isGlobal = type & GLOBAL
    , isStatic = type & STATIC
    , isProto  = type & PROTO
    , target   = isGlobal ? global : isStatic ? global[name] : (global[name] || $Object)[PROTOTYPE]
    , exports  = isGlobal ? Export : Export[name] || (Export[name] = {});
  if(isGlobal){
    forced = source;
    source = name;
  }
  for(key in source)if(has(source, key)){
    own  = !forced && target && has(target, key) && (!isFunction(target[key]) || isNative(target[key]));
    prop = own ? target[key] : source[key];
    // export to `C`
    if(exports[key] != prop)exports[key] = isProto && isFunction(prop) ? ctx(call, prop) : prop;
    // if build as framework, extend global objects
    framework && target && !own && (isGlobal || delete target[key])
      && defineProperty(target, key, descriptor(6, source[key]));
  }
}
function $defineTimer(key, fn){
  if(framework)global[key] = fn;
  Export[key] = global[key] != fn ? fn : ctx(fn, global);
}
// Wrap to prevent obstruction of the global constructors, when build as library
function wrapGlobalConstructor(Base){
  if(framework || !isNative(Base))return Base;
  function F(param){
    // used on constructors that takes 1 argument
    return this instanceof Base ? new Base(param) : Base(param);
  }
  F[PROTOTYPE] = Base[PROTOTYPE];
  return F;
}
// Export
var isNode = classof(process) == PROCESS;
if(isNode)module.exports = Export;
if(!isNode || framework)global.C = Export;