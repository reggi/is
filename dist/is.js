/*
 * @license is.js 0.1.0
 * (c) 2013 Trevor Landau <landautrevor@gmail.com> (http://trevorlandau.net)
 * is.js may be freely distributed under the MIT license.
 * Generated 2013-12-15
 */

(function () {
  'use strict';

  var root = this;

  var is = {};

  var old = root.is;
  root.is = is;
  is.noConflict = function () {
    root.is = old;
    return is;
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = is;
    }
    exports.is = is;
  } else {
    root.is = is;
  }

  // protos
  var ObjProto = Object.prototype;

  // Internal shortcuts
  var toStringProto = ObjProto.toString;

  // Helpers
  function toString(val) {
    return toStringProto.call(val);
  }
  
  // Reverses the boolean output of the provided predicate
  function invertPred(pred) {
    return function () {
      return !pred.apply(pred, arguments);
    };
  }

  function prop(p) {
    return function (o) {
      if (is.object(o)) return o[p];
      return o;
    };
  }

  is.exists = function (val) {
    return val != null;
  };

  is.truthy = function (val) {
    return val !== false && is.exists(val);
  };

  is.falsey = invertPred(is.truthy);

  is.null = function (val) {
    return is.equal(val, null);
  };

  is.undef = function (val) {
    return is.equal(val, void 0);
  };

  // value comparisions
  is.equal = function (a, b) {
    return a === b;
  };

  is.eq = function (a, b) {
    return a == b;
  };

  is.less = function (a, b) {
    return a < b;
  };

  is.lessEq = function (a, b) {
    return is.equal(a, b) || is.less(a, b);
  };

  is.greater = function (a, b) {
    return a > b;
  };

  is.greaterEq = function (a, b) {
    return is.equal(a, b) || is.greater(a, b);
  };


  // drop in comparator for sort and methods alike
  // TODO allow user to pass in a 2nd prop field for object property
  // comparisons
  is.cmp = function (pred, p) {
    if (!is.fn(pred)) throw new TypeError('predicate provided is not a function');
    var propFn = prop(p);

    return function (a, b) {
      a = propFn(a);
      b = propFn(b);
      if (pred(a, b)) return 1;
      if (pred(b, a)) return -1;
      return 0;
    };
  };

  // Type checking predicates
  is.eqfn = function (fn) {
    return function (a, b) {
      return is.equal(fn(a), b);
    };
  };

  is.eqStr = is.eqfn(toString);

  // Object type checks
  is.object = function (val) {
    return is.eqStr(val, '[object Object]');
  };

  // Default to ES5 implementation
  is.array = Array.isArray || function (val) {
    return is.eqStr(val, '[object Array]');
  };

  is.date = function (val) {
    return is.eqStr(val, '[object Date]');
  };

  is.RegExp = function (val) {
    return is.eqStr(val, '[object RegExp]');
  };

  is.rgx = is.RegExp;

  // ES6 spec
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
  is.finite = Number.isFinite || function (val) {
    return is.number(val) && isFinite(val);
  };

  is.NaN = function (val) {
    return is.number(val) && !is.eq(val, +val);
  };

  is.arguments = function (val) {
    return is.eqStr(val, '[object Arguments]');
  };

  is.error = function (val) {
    return is.eqStr(val, '[object Error]');
  };

  // creates fns for is.string, etc
  function typeofBuilder(type) {
    return function (val) {
      return is.equal(typeof val, type);
    };
  }

  // Create typeof methods
  ['function', 'number', 'string'].forEach(function (type) {
    is[type] = typeofBuilder(type);
  });

  // shorthand
  is.fn = is.function;
  is.num = is.number;
  is.str = is.string;

  is.int = function (val) {
    return is.num(val) && is.equal(val % 1, 0);
  };

  // TODO
  // deep equal for objects

  // TODO
  // Implement is.all so we can do something like is.all().eq(a, b).greaterEq(a. b)
  // which will behave like &&, also, implement is.some to behave like ||
}).call(this);
