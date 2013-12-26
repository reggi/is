/**
 * is.js - is NOT an assertion library
 *
 * @module is
 * @main is
**/
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
  
  // Start exposed methods

  /**
   * Tests if a value is not null or undefined
   *
   * @method exists
   * @for is
   * @param {Mixed} val 
   * @return {Boolean}
   */
  is.exists = function (val) {
    return val != null;
  };

  /**
   * Tests if a value exists and isn't false
   *
   * @method truthy
   * @param {Mixed} val 
   * @return {Boolean}
   */
  is.truthy = function (val) {
    return val !== false && is.exists(val);
  };

  /**
   * Tests if a value is false and doesn't exist
   *
   * @method falsey
   * @param {Mixed} val 
   * @return {Boolean}
   */
  is.falsey = invertPred(is.truthy);

  /**
   * Tests if a value is null
   *
   * @method null
   * @param {Mixed} val 
   * @return {Boolean}
   */
  is.null = function (val) {
    return is.equal(val, null);
  };

  /**
   * Tests if a value is undefined
   *
   * @method undef
   * @param {Mixed} val 
   * @return {Boolean}
   */
  is.undef = function (val) {
    return is.equal(val, void 0);
  };

  //---- value comparision methods
  
  /**
   * Tests if 2 values are strict equal
   *
   * @method equal
   * @param {Mixed} a
   * @param {Mixed} b 
   * @return {Boolean}
   */
  is.equal = function (a, b) {
    return a === b;
  };

  /**
   * Tests if 2 values are equal. Values will be coerced
   *
   * @method equal
   * @param {Mixed} a
   * @param {Mixed} b 
   * @return {Boolean}
   */
  is.eq = function (a, b) {
    return a == b;
  };

  /**
   * Creates a comparator function ran against a predicate function.
   * Pass option
   *
   * @method greaterEq
   * @param {Function} pred
   * @param {String} p Key accessor for objects
   * @optional
   * @return {Function} Comparator function
   */


  /**
   * Tests if arg a is less than arg b
   *
   * @method less
   * @param {Mixed} a
   * @param {Mixed} b 
   * @return {Boolean}
   */
  is.less = function (a, b) {
    return a < b;
  };

  /**
   * Tests if arg a is less or equal to arg b
   *
   * @method lessEq
   * @param {Mixed} a
   * @param {Mixed} b 
   * @return {Boolean}
   */
  is.lessEq = function (a, b) {
    return is.equal(a, b) || is.less(a, b);
  };

  /**
   * Tests if arg a is greater than arg b
   *
   * @method greater
   * @param {Mixed} a
   * @param {Mixed} b 
   * @return {Boolean}
   */
  is.greater = function (a, b) {
    return a > b;
  };

  /**
   * Tests if arg a is greater or equal to arg b
   *
   * @method greaterEq
   * @param {Mixed} a
   * @param {Mixed} b 
   * @return {Boolean}
   */
  is.greaterEq = function (a, b) {
    return is.equal(a, b) || is.greater(a, b);
  };


  /**
   * Creates a comparator function ran against a predicate function.
   * Pass option
   *
   * @method cmp
   * @param {Function} pred
   * @param {String} [p] Key accessor for objects
   * @return {Function} Comparator function
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
  function eqfn(fn) {
    return function (a, b) {
      return is.equal(fn(a), b);
    };
  }

  is.eqStr = eqfn(toString);

  //---- Object type checks

  /**
   * Checks if value is an Object
   *
   * @method object
   * @param {Mixed} val
   * @return {Boolean}
   */
  is.object = function (val) {
    return is.eqStr(val, '[object Object]');
  };

  /**
   * Checks if value is an Array.
   * This method defaults to ES5 implementation
   *
   * @method object
   * @param {Mixed} val
   * @return {Boolean}
   */
  is.array = Array.isArray || function (val) {
    return is.eqStr(val, '[object Array]');
  };

  /**
   * Checks if value is a Date.
   *
   * @method date
   * @param {Mixed} val
   * @return {Boolean}
   */
  is.date = function (val) {
    return is.eqStr(val, '[object Date]');
  };

  /**
   * Checks if value is a RegExp.
   *
   * @method date
   * @param {Mixed} val
   * @return {Boolean}
   */
  is.RegExp = function (val) {
    return is.eqStr(val, '[object RegExp]');
  };

  is.rgx = is.RegExp;

  /**
   * Checks if value is finite. 
   * Uses the ES6 Spec which is not correct for just isFinite.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
   *
   * @method finite
   * @param {Mixed} val
   * @return {Boolean}
   */
  is.finite = Number.isFinite || function (val) {
    return is.number(val) && isFinite(val);
  };

  /**
   * Checks if value is NaN
   *
   * @method NaN
   * @param {Mixed} val
   * @return {Boolean}
   */
  is.NaN = function (val) {
    return is.number(val) && !is.eq(val, +val);
  };

  /**
   * Checks if value is an arguments object
   *
   * @method arguments
   * @param {Mixed} val
   * @return {Boolean}
   */
  is.arguments = function (val) {
    return is.eqStr(val, '[object Arguments]');
  };

  /**
   * Checks if value is an Error object
   *
   * @method error
   * @param {Mixed} val
   * @return {Boolean}
   */
  is.error = function (val) {
    return is.eqStr(val, '[object Error]');
  };

  // creates fns for is.string, etc
  function typeofBuilder(type) {
    return function (val) {
      return is.equal(typeof val, type);
    };
  }

  //--- Create typeof methods

  ['function', 'number', 'string'].forEach(function (type) {
    is[type] = typeofBuilder(type);
  });

  //--- shorthand methods for typeof

  /**
   * Checks if value is a function.
   * Alias - is.function
   *
   * @method fn
   * @param {Mixed} val
   * @return {Boolean}
   */
  is.fn = is.function;

  /**
   * Checks if value is a number.
   * Alias - is.number
   *
   * @method num
   * @param {Mixed} val
   * @return {Boolean}
   */
  is.num = is.number;

  /**
   * Checks if value is a string.
   * Alias - is.string
   *
   * @method str
   * @param {Mixed} val
   * @return {Boolean}
   */
  is.str = is.string;

  /**
   * Checks if value is an integer.
   *
   * @method int
   * @param {Mixed} val
   * @return {Boolean}
   */
  is.int = function (val) {
    return is.num(val) && is.equal(val % 1, 0);
  };


  /**
   * Validates that an object is an instance of a given Class.
   * You can create a instance checking function by providing only the class.
   * To test immediately, provide the instance object as well.
   *
   * @method instance
   * @param {Mixed} Cls The class to check instanceof with
   * @param {Mixed} [inst] The object to test against instanceof
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
