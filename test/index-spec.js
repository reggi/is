'use strict';

// Some old coffeescript stuff that is still useful
var Bar, Foo, addNotTest, addTest, falses, testClasses, truths, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function Ctor() { /*jshint validthis:true */
      this.constructor = child;
    }
    Ctor.prototype = parent.prototype;
    child.prototype = new Ctor();
    child.__super__ = parent.prototype;
    return child;
  };

var _ = require('lodash');
var is = require('../');
require('should');

testClasses = {
  Foo: Foo = (function() {
    function Foo() {}

    return Foo;

  })()
};

testClasses.Bar = Bar = (function(_super) {

  /*jshint validthis:true */
  function _Bar() {
    return _Bar.__super__.constructor.apply(this, arguments);
  }
  __extends(_Bar, _super);

  return _Bar;

})(testClasses.Foo);

var addTest = function(fn, val, expected, shorthand) {
  if (Array.isArray(val) && val.length) {

    it('should return `' + expected + '` for values `' + val + '`', function() {
      (is[fn].apply(null, val)).should.be[expected];
    });

  } else {

    it('should return `' + expected + '` for value `' + val + '`', function() {
      (is[fn](val)).should.be[expected];
    });

  }

  if (_.isString(shorthand)) {
    it('should have a shorthand method `' + shorthand + '` for method `' + fn + '`', function() {
      is[shorthand].should.equal(is[fn]);
    });
  }
};

var addNotTest = function(fn, val, expected) {
  if (Array.isArray(val) && val.length) {
    return it('should return `' + expected + '` for values `' + val + '`', function() {
      return (is.not[fn].apply(null, val)).should.be[expected];
    });
  } else {
    return it('should return `' + expected + '` for value `' + val + '`', function() {
      return (is.not[fn](val)).should.be[expected];
    });
  }
};

truths = ['dog', 1, [], {}];

falses = [null, void 0];

describe('is', function() {
  var tests;
  tests = {
    exists: {
      truthy: truths.concat([0]),
      falsey: falses
    },

    truthy: {
      truthy: truths,
      falsey: falses
    },

    falsey: {
      truthy: falses,
      falsey: truths
    },

    'null': {
      truthy: [null],
      falsey: [void 0, 'dog', 1, []]
    },

    undef: {
      truthy: [void 0],
      falsey: [null, '', 'dog', 1, []]
    },

    equal: {
      truthy: [[0, 0], ['dog', 'dog']],
      falsey: [[0, 1], ['cat', 'dog'], [0, '0']]
    },

    eq: {
      truthy: [[0, '0']],
      falsey: [[0, 1], ['cat', 'dog']]
    },

    less: {
      truthy: [[0, 1]],
      falsey: [[1, 0]]
    },

    greater: {
      truthy: [[1, 0]],
      falsey: [[0, 1]]
    },

    lessEq: {
      truthy: [[0, 1], [0, 0]],
      falsey: [[1, 0]]
    },

    greaterEq: {
      truthy: [[1, 0], [0, 0]],
      falsey: [[0, 1]]
    },
    object: {

      truthy: [{}, [], new Date()],
      falsey: [null, 'a', 1]
    },

    array: {
      truthy: [[]],
      falsey: [{}, 'a', 1, new Date()]
    },

    date: {
      truthy: [new Date()],
      falsey: [{}, 'a', 1, []]
    },

    RegExp: {
      truthy: [/\d/],
      falsey: [{}, 'a', 1, [], new Date()],
      shorthand: 'rgx'
    },

    NaN: {
      truthy: [NaN],
      falsey: falses.concat([], 1, /\d/, '1', {})
    },

    'function': {
      truthy: [function() {}],
      falsey: [{}, 'a', 1, new Date()],
      shorthand: 'fn'
    },

    number: {
      truthy: [1],
      falsey: [{}, [], '1', new Date()],
      shorthand: 'num'
    },

    string: {
      truthy: ['dog'],
      falsey: [{}, [], 1, new Date()],
      shorthand: 'str'
    },

    finite: {
      truthy: [1, 2e64],
      falsey: [{}, [], NaN, -Infinity, Infinity, '1', new Date()]
    },

    int: {
      truthy: [1, 2e64, -5, 0],
      falsey: [{}, [], NaN, 1.2, -Infinity, Infinity, '1', new Date()]
    },

    pos: {
      truthy: [1, 5, 10.2],
      falsey: [0, -1, -2.5, 'a', {}]
    },

    neg: {
      truthy: [-1, -5, -10.2],
      falsey: [0, 1, 2.5, 'a', {}]
    },

    zero: {
      truthy: [0],
      falsey: [1, '1', '0', {}]
    },

    even: {
      truthy: [2, 4, -6],
      falsey: [0, 1, 3, 'foo']
    },

    odd: {
      truthy: [1, 3, -11],
      falsey: [0, 2, 4, 'foo']
    },

    'instance': {
      truthy: [[Object, {}], [Array, []],
        [testClasses.Foo, new testClasses.Foo()], [testClasses.Foo, new testClasses.Bar()],
        [testClasses.Bar, new testClasses.Bar()]],
      falsey: [[Array, {}], [testClasses.Bar, new testClasses.Foo()]]
    }
  };

  _.each(tests, function(expectations, methodName) {
    return describe('normal tests', function() {
      return describe('' + methodName, function() {
        var shorthand = expectations.shorthand;
        var truthy = expectations.truthy;
        var falsey = expectations.falsey;

        _.each(truthy, function(val) {
          addTest(methodName, val, true, shorthand);
        });

        _.each(falsey, function(val) {
          addTest(methodName, val, false, shorthand);
        });
      });
    });
  });

  _.each(tests, function(expectations, methodName) {
    return describe('not tests', function() {
      return describe('' + methodName, function() {
        var shorthand = expectations.shorthand;
        var truthy = expectations.truthy;
        var falsey = expectations.falsey;

        _.each(truthy, function(val) {
          addNotTest(methodName, val, false, shorthand);
        });

        _.each(falsey, function(val) {
          addNotTest(methodName, val, true, shorthand);
        });
      });
    });
  });

  describe('#arguments', function() {
    it('should return true for arguments', function() {
      var fn = function() {
        return (is['arguments'](arguments)).should.be['true'];
      };

      fn();
    });

    _.each(falses.concat(truths), function(val) {
      addTest('arguments', val, false);
    });
  });

  describe('#invert', function() {
    before(function() {
      this.testFn = is.invert(is.fn);
    });

    it('should return a function', function() {
      this.testFn.should.be['instanceof'](Function);
    });

    it('should return an inverted value', function() {
      this.testFn(is.equal).should['false'];
    });

    it('should alias complement', function() {
      is.invert.should.equal(is.complement);
    });
  });

  describe('#contains', function() {
    var arr;
    arr = [1, 2, 3];
    it('should throw an error if initial value is not an array', function() {
      var e;
      try {
        is.contains('foo');
      } catch (_error) {
        e = _error;
        e.should.be['instanceof'](TypeError);
      }
    });

    it('should return false if the value is not found', function() {
      is.contains(arr, 5).should.be['false'];
    });

    it('should return true if the value is found', function() {
      is.contains(arr, 1).should.be['true'];
      is.contains(arr, 2).should.be['true'];
      is.contains(arr, 3).should.be['true'];
    });
  });

  describe('#has', function() {
    it('should return true if the key is found', function() {
      is.has({
        foo: 3
      }, 'foo').should.be['true'];
    });

    it('should return false if the key is not on on the obj', function() {
      is.has({
        foo: 3
      }, 'toString').should.be['false'];
    });

  });
  describe('#instance as a high order fn', function() {
    it('should return a function that checks instances of Foo', function() {
      var fn = is.instance(testClasses.Foo);
      fn.should.be.instanceOf(Function);
      fn(new Foo()).should.be.ok;
      fn([]).should.be['false'];
    });
  });

  describe('#ternary', function() {
    it('should return 1 for a truthy value', function() {
      is.ternary(true, 1, 2).should.equal(1);
    });

    it('should return 2 for a falsey value', function() {
      is.ternary(false, 1, 2).should.equal(2);
    });

    it('should return 1 for a lesser value', function() {
      is.ternary(is.less, 1, 2).should.equal(1);
    });

    it('should return 1 for a greater value', function() {
      is.ternary(is.less, 2, 1).should.equal(1);
    });

    it('should return a function for a pred given', function() {
      var fn = is.ternary(is.less);
      fn.should.be.a['function'];
      fn(1, 2).should.equal(1);
      fn(2, 1).should.equal(1);
    });

    it('should return a function for a pred and arg given', function() {
      var fn = is.ternary(is.less, 1);
      fn.should.be.a['function'];
      fn(2).should.equal(1);
    });
  });

  describe('#every', function() {
    it('should map to .all', function() {
      is.every.should.equal(is.all);
    });

    it('should return an object', function() {
      is.every().should.be.an.object;
    });

    it('should allow chaining', function() {
      is.every().equal(1, 1).str('5').val().should.be.ok;
      is.every().str('foo').contains([1, 2, 3], 1).val().should.be.ok;
      is.every().str(1).contains([1, 2, 3], 1).val().should.be['false'];
      is.every().str('foo').contains([1, 2, 3], 5).val().should.be['false'];
    });
  });

  describe('#some', function() {
    it('should map to .any', function() {
      is.some.should.equal(is.any);
    });

    it('should return an object', function() {
      is.some().should.be.an.object;
    });

    it('should allow chaining', function() {
      is.some().equal(1, 1).str('5').val().should.be.ok;
      is.some().str('foo').contains([1, 2, 3], 1).val().should.be.ok;
      is.some().str(1).contains([1, 2, 3], 1).val().should.be.ok;
      is.some().str('foo').contains([1, 2, 3], 5).val().should.be.ok;
      is.some().num('foo').contains([1, 2, 3], 5).val().should.be['false'];
    });
  });

  describe('#Lazy', function() {
    it('should call `val` when valueOf is called', function() {
      +(is.some().equal(1, 1).str('5')).should.be.ok;
      !!(is.some().equal(1, 1).str('5')).should.be.ok;
    });
  });

  describe('#partial', function() {
    var fn = null;

    before(function() {
      fn = is.partial(is.less, 1);
    });

    it('should return a fn', function() {
      fn.should.be.a['function'];
    });

    it('should exec the fn as expected', function() {
      fn(2).should.be.ok;
    });
  });

  describe('#mod', function() {
    it('should return a modulus value', function() {
      is.mod(6, 5).should.equal(1);
      is.mod(6, 6).should.equal(0);
    });
  });
});
