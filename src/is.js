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

  is.exists = function (val) {
    return val != null;
  };

  is.truthy = function (val) {
    return val !== false && is.exists(val);
  };

  is.falsey = is.invert(is.truthy);

  is.null = function (val) {
    return is.equal(val, null);
  };

  is.undef = function (val) {
    return is.equal(val, void 0);
  };

  //---- value comparision methods

  is.equal = function (a, b) {
    return a === b;
  };

  is.eq = function (a, b) {
    return a == b;
  };

  is.lt = is.less = function (a, b) {
    return a < b;
  };

  is.ltEq = is.lessEq = function (a, b) {
    return is.equal(a, b) || is.less(a, b);
  };

  is.gt = is.greater = function (a, b) {
    return a > b;
  };

  is.gtEq = is.greaterEq = function (a, b) {
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

  is.object = function (val) {
    return val === Object(val);
  };

  is.array = Array.isArray || function (val) {
    return is.eqStr(val, '[object Array]');
  };

  is.date = function (val) {
    return is.eqStr(val, '[object Date]');
  };

  is.rgx = is.RegExp = function (val) {
    return is.eqStr(val, '[object RegExp]');
  };

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
  is.finite = Number.isFinite || function (val) {
    return is.number(val) && isFinite(val);
  };

  is.NaN = function (val) {
    return is.number(val) && !is.eq(val, parseFloat(val));
  };

  is.arguments = function (val) {
    return is.eqStr(val, '[object Arguments]');
  };

  is.error = function (val) {
    return is.instanceof(Error, val);
  };

  // creates fns for is.string, etc
  function typeofBuilder (type) {
    return function (val) {
      return is.equal(typeof val, type);
    };
  }

  //--- Create typeof methods

  // type of string and alias name
  [
    ['function', 'fn'],
    ['number', 'num'],
    ['string', 'str'],
    ['boolean', 'bool']
  ].reduce(function (_, type) {
    _[type[0]] = _[type[1]] = typeofBuilder(type[0]);
    return _;
  }, is);

  is.int = function (val) {
    return is.num(val) && is.equal(val % 1, 0);
  };

  is.pos = function (val) {
    return is.num(val) && is.greater(val, 0);
  };

  is.neg = function (val) {
    return is.num(val) && is.less(val, 0);
  };

  is.zero = function (val) {
    return is.num(val) && is.equal(val, 0);
  };

  is.contains = function(arr, val) {
    if (!is.array(arr)) throw new TypeError('Expected an array');
    return is.falsey(!~arr.indexOf(val));
  };

  is.has = function(o, key) {
    return ObjProto.hasOwnProperty.call(o, key);
  };

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

  is.ternary = function (pred, a, b) {
    if (is.boolean(pred)) return pred ? a : b;
    if (is.undef(a)) return partial(is.ternary, pred);
    if (is.undef(b)) return partial(is.ternary, pred, a);
    return is.ternary(pred(a, b), a, b);
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
  is.all = is.every = function () {
    return new Every();
  };

  function Some() {
    Lazy.call(this);
  }

  inherits(Some, Lazy);
  Some.prototype.val = function () {
    return this._val().some(is.truthy);
  };
  is.any = is.some = function () {
    return new Some();
  };
}).call(this);
