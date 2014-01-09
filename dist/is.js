/**
 * @license is.js 
 * @version v0.1.1
 * (c) 2013 Trevor Landau <landautrevor@gmail.com> (http://trevorlandau.net)
 * is.js may be freely distributed under the MIT license.
 * Generated Wed Jan 08 2014 22:00:17 GMT-0500 (EST)
 */

(function () {
  'use strict';

  var root = this;

  /**
   * @namespace is
   */
  var is = {};

  var old = root.is;
  root.is = is;
  is.noConflict = function () {
    root.is = old;
    return is;
  };

  // Support for globoal and module.exports
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
  function toString (val) {
    return toStringProto.call(val);
  }
  
  // Reverses the boolean output of the provided predicate
  function invertPred (pred) {
    return function () {
      return !pred.apply(pred, arguments);
    };
  }

  function prop (p) {
    return function (o) {
      if (is.object(o)) return o[p];
      return o;
    };
  }
  
  // Start exposed methods

  /**
   * Tests if a value is not null or undefined
   *
   * @name exists
   * @memberof is
   * @function
   *
   * @param {*} val 
   * @return {boolean}
   */
  is.exists = function (val) {
    return val != null;
  };

  /**
   * Tests if a value exists and isn't false
   *
   * @name truthy
   * @memberof is
   * @function
   *
   * @param {*} val 
   * @return {boolean}
   */
  is.truthy = function (val) {
    return val !== false && is.exists(val);
  };

  /**
   * Tests if a value is false and doesn't exist
   *
   * @name falsey
   * @memberof is
   * @function
   *
   * @param {*} val 
   * @return {boolean}
   */
  is.falsey = invertPred(is.truthy);

  /**
   * Tests if a value is null
   *
   * @name null
   * @memberof is
   * @function
   *
   * @param {*} val 
   * @return {boolean}
   */
  is.null = function (val) {
    return is.equal(val, null);
  };

  /**
   * Tests if a value is undefined
   *
   * @name undef
   * @memberof is
   * @function
   *
   * @param {*} val 
   * @return {boolean}
   */
  is.undef = function (val) {
    return is.equal(val, void 0);
  };

  //---- value comparision methods
  
  /**
   * Tests if 2 values are strict equal
   *
   * @name equal
   * @memberof is
   * @function
   *
   * @param {*} a
   * @param {*} b 
   * @return {boolean}
   */
  is.equal = function (a, b) {
    return a === b;
  };

  /**
   * Tests if 2 values are equal. Values will be coerced
   *
   * @name eq
   * @memberof is
   * @function
   *
   * @param {*} a
   * @param {*} b 
   * @return {boolean}
   */
  is.eq = function (a, b) {
    return a == b;
  };

  /**
   * Tests if arg a is less than arg b
   *
   * @name less
   * @memberof is
   * @function
   *
   * @param {*} a
   * @param {*} b 
   * @return {boolean}
   */
  is.less = function (a, b) {
    return a < b;
  };

  /**
   * Tests if arg a is less or equal to arg b
   *
   * @name lessEq
   * @memberof is
   * @function
   *
   * @param {*} a
   * @param {*} b 
   * @return {boolean}
   */
  is.lessEq = function (a, b) {
    return is.equal(a, b) || is.less(a, b);
  };

  /**
   * Tests if arg a is greater than arg b
   *
   * @name greater
   * @memberof is
   * @function
   *
   * @param {*} a
   * @param {*} b 
   * @return {boolean}
   */
  is.greater = function (a, b) {
    return a > b;
  };

  /**
   * Tests if arg a is greater or equal to arg b
   *
   * @name greaterEq
   * @memberof is
   * @function
   *
   * @param {*} a
   * @param {*} b 
   * @return {boolean}
   */
  is.greaterEq = function (a, b) {
    return is.equal(a, b) || is.greater(a, b);
  };

  /**
   * Creates a comparator function ran against a predicate function.
   * Pass option
   *
   * @name cmp
   * @memberof is
   * @function
   *
   * @param {function} pred
   * @param {string} [p] - Key accessor for objects
   * @return {function} - Comparator function
   */
  is.cmp = function (pred, p) {
    if (!is.fn(pred)) throw new TypeError('predicate provided is not a function');
    var propFn = prop(p);

    return function (a, b) {
      a = propFn(a);
      b = propFn(b);
      if (pred(a, b)) return -1;
      if (pred(b, a)) return 1;
      return 0;
    };
  };

  // Type checking predicates
  
  // Create an fn function that runs a provided function on the first value
  // to be compared with the second.
  function eqfn (fn) {
    return function (a, b) {
      return is.equal(fn(a), b);
    };
  }

  is.eqStr = eqfn(toString);

  //---- Object type checks

  /**
   * Checks if value is an Object
   *
   * @name object
   * @memberof is
   * @function
   *
   * @param {*} val
   * @return {boolean}
   */
  is.object = function (val) {
    return is.eqStr(val, '[object Object]');
  };

  /**
   * Checks if value is an Array.
   * This method defaults to ES5 implementation
   *
   * @name array
   * @memberof is
   * @function
   *
   * @param {*} val
   * @return {boolean}
   */
  is.array = Array.isArray || function (val) {
    return is.eqStr(val, '[object Array]');
  };

  /**
   * Checks if value is a Date.
   *
   * @name date
   * @memberof is
   * @function
   *
   * @param {*} val
   * @return {boolean}
   */
  is.date = function (val) {
    return is.eqStr(val, '[object Date]');
  };

  /**
   * Checks if value is a RegExp.
   *
   * @name RegExp
   * @memberof is
   * @function
   *
   * @param {*} val
   * @return {boolean}
   */
  is.RegExp = function (val) {
    return is.eqStr(val, '[object RegExp]');
  };

  /**
   * @alias RegExp
   * @memberof is
   */
  is.rgx = is.RegExp;

  /**
   * Checks if value is finite. 
   * Uses the ES6 Spec which is not correct for just isFinite.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
   *
   * @name finite
   * @memberof is
   * @function
   *
   * @param {*} val
   * @return {boolean}
   */
  is.finite = Number.isFinite || function (val) {
    return is.number(val) && isFinite(val);
  };

  /**
   * Checks if value is NaN
   *
   * @name NaN
   * @memberof is
   * @function
   *
   * @param {*} val
   * @return {boolean}
   */
  is.NaN = function (val) {
    return is.number(val) && !is.eq(val, parseFloat(val));
  };

  /**
   * Checks if value is an arguments object
   *
   * @name arguments
   * @memberof is
   * @function
   *
   * @param {*} val
   * @return {boolean}
   */
  is.arguments = function (val) {
    return is.eqStr(val, '[object Arguments]');
  };

  /**
   * Checks if value is an Error object
   *
   * @name error
   * @memberof is
   * @function
   *
   * @param {*} val
   * @return {boolean}
   */
  is.error = function (val) {
    return is.eqStr(val, '[object Error]');
  };

  // creates fns for is.string, etc
  function typeofBuilder (type) {
    return function (val) {
      return is.equal(typeof val, type);
    };
  }

  //--- Create typeof methods

  /**
   * @alias fn
   * @memberof is
   */
  /**
   * @alias num
   * @memberof is
   */
  /**
   * @alias str
   * @memberof is
   */
  /**
   * @alias bool
   * @memberof is
   */
  ['function', 'number', 'string', 'boolean'].forEach(function (type) {
    is[type] = typeofBuilder(type);
  });

  //--- shorthand methods for typeof

  /**
   * Checks if value is a function.
   * Alias - is.function
   *
   * @name fn
   * @memberof is
   * @function
   *
   * @param {*} val
   * @return {boolean}
   */
  is.fn = is.function;

  /**
   * Checks if value is a number.
   * Alias - is.number
   *
   * @name num
   * @memberof is
   * @function
   *
   * @param {*} val
   * @return {boolean}
   */
  is.num = is.number;

  /**
   * Checks if value is a string.
   * Alias - is.string
   *
   * @name str
   * @memberof is
   * @function
   *
   * @param {*} val
   * @return {boolean}
   */
  is.str = is.string;

  /**
   * Checks if value is a boolean.
   * Alias - is.boolean
   *
   * @name bool
   * @memberof is
   * @function
   *
   * @param {*} val
   * @return {boolean}
   */
  is.bool = is.boolean;

  /**
   * Checks if value is an integer.
   *
   * @name int
   * @memberof is
   * @function
   *
   * @param {*} val
   * @return {boolean}
   */
  is.int = function (val) {
    return is.num(val) && is.equal(val % 1, 0);
  };

  /**
   * Validates that an object is an instance of a given Class.
   * You can create a instance checking function by providing only the class.
   * To test immediately, provide the instance object as well.
   *
   * @name instance
   * @memberof is
   * @function
   *
   * @param {*} Cls - The class to check instanceof with
   * @param {*} [inst] - The object to test against instanceof
   * @return {Boolean}
   */
  is.instance = function (Cls, inst) {
    if (is.equal(arguments.length, 1)) {
      return function (inst) {
        return is.instance(Cls, inst);
      };
    } else {
      return inst instanceof Cls;
    }
  };

}).call(this);
