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
  var _slice = Array.prototype.slice;

  // Helpers
  function toString(val) {
    return toStringProto.call(val);
  }

  function prop(p) {
    return function (o) {
      if (is.object(o)) return o[p];
      return o;
    };
  }

  function partial(fn) {
    var args = _slice.call(arguments, 1);
    return function() {
      return fn.apply(null, args.concat(_slice.call(arguments)));
    };
  }

  // All predicate names will be stored after definition
  var _predicates = null;

  // NOTE: do not run this until _predicates has been after all predicate
  // definitions
  function assignPredicates(fn) {
    return _predicates.reduce(function (acc, fnName) {
      acc[fnName] = fn(is[fnName], fnName);
      return acc;
    }, {});
  }

  function inherits(Child, Super) {
    Child.prototype = Object.create(Super.prototype);
    Child.prototype.constructor = Child;
    return Child;
  }

  // Start exposed methods

  /**
   * is.inverts a given predicate
   *
   * @name is.invert
   * @memberof is
   * @function
   *
   * @param {Function} pred
   * @return {Function}
   */
  is.invert = function (pred) {
    return function () {
      return !pred.apply(is, arguments);
    };
  };

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
  is.falsey = is.invert(is.truthy);

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
   * Checks if the value is positive
   *
   * @name pos
   * @memberof is
   * @function
   *
   * @param {Number} val
   * @return {boolean}
   */
  is.pos = function (val) {
    return is.num(val) && is.greater(val, 0);
  };

  /**
   * Checks if the value is negative
   *
   * @name neg
   * @memberof is
   * @function
   *
   * @param {Number} val
   * @return {boolean}
   */
  is.neg = function (val) {
    return is.num(val) && is.less(val, 0);
  };

  /**
   * Checks if a value exists in an array
   *
   * @name contains
   * @memberof is
   * @function
   *
   * @param {Array} arr
   * @param {*} val
   * @return {boolean}
   */
  is.contains = function(arr, val) {
    if (!is.array(arr)) throw new TypeError('Expected an array');
    if (!is.exists(val)) return false;
    return is.falsey(!~arr.indexOf(val));
  };

  /**
   * Checks if a given key exists on the given object
   * aka not on the prototype
   *
   * @name has
   * @memberof is
   * @function
   *
   * @param {Object} o
   * @param {*} key
   * @return {boolean}
   */
  is.has = function(o, key) {
    return ObjProto.hasOwnProperty.call(o, key);
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

  // --- No predicate definitions past this line

  // Add any non predicate definitions here.
  var omitFns = [
    'cmp', 'ternary', 'invert',
    'not', 'every', 'noConflict',
    'all', 'some'
  ];
  _predicates = Object.keys(is)
                      .filter(partial(is.invert(is.contains), omitFns));

  /**
   * Run your ternary evals through a function
   * which removes that ugly ?: syntax!
   *
   * @name ternary
   * @memberof is
   * @function
   *
   * @param {*} bool
   * @param {*} a
   * @param {*} b
   * @return {boolean}
   */
  is.ternary = function (bool, a, b) {
    return bool ? a : b;
  };

  /**
   * Reverses any predicate's call value
   * ex: is.not.equal(1, 2); // true
   *
   * @name not
   * @memberof is
   * @object
   *
   */
  is.not = assignPredicates(function (fn) {
    return is.invert(fn);
  });

  function Lazy() {
    this.lazy = [];
  }

  Lazy.prototype = assignPredicates(function (fn) {
    return function() {
      this.lazy.push([fn, arguments]);
      return this;
    };
  });

  Lazy.prototype._val = function () {
    return this.lazy.map(function (args) {
      return args[0].apply(null, args[1]);
    });
  };

  Lazy.prototype.valueOf = function () {
    return this.val();
  };

  function Every() {
    Lazy.call(this);
  }

  inherits(Every, Lazy);
  Every.prototype.val = function () {
    return this._val().every(is.truthy);
  };

  /**
   * Enable chaining predicate calls
   * ex: is.every().equal(1, 1).str('foo').val()
   *
   * @name every
   * @memberof is
   * @function
   *
   * @return {Every}
   */
  is.every = function () {
    return new Every();
  };

  /**
   * @alias every
   * @memberof is
   */
  is.all = is.every;

  function Some() {
    Lazy.call(this);
  }

  inherits(Some, Lazy);
  Some.prototype.val = function () {
    return this._val().some(is.truthy);
  };

  /**
   * Enable chaining predicate calls an evaluates to true
   * if at least one predicate call returns true
   * ex: is.some().equal(1, 1).str('foo').val();
   *
   * @name some
   * @memberof is
   * @function
   *
   * @return {Every}
   */
  is.some = function () {
    return new Some();
  };

  /**
   * @alias some
   * @memberof is
   */
  is.any = is.some;

}).call(this);
