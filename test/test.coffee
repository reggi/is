'use strict'

_ = require 'lodash'
Is = require '../src/is'
require 'should'

testClasses =
  Foo: class Foo
testClasses.Bar = class Bar extends testClasses.Foo


addTest = (fn, val, expected, shorthand) ->
  if Array.isArray(val) and val.length
    it "should return `#{expected}` for values `#{val}`", ->
      (Is[fn].apply(null, val)).should.be[expected]
  else
    it "should return `#{expected}` for value `#{val}`", ->
        (Is[fn](val)).should.be[expected]

  if _.isString shorthand
    it "should have a shorthand method `#{shorthand}` for method `#{fn}`", ->
      Is[shorthand].should.equal Is[fn]


addNotTest = (fn, val, expected, shorthand) ->
  if Array.isArray(val) and val.length
    it "should return `#{expected}` for values `#{val}`", ->
      (Is.not[fn].apply(null, val)).should.be[expected]
  else
    it "should return `#{expected}` for value `#{val}`", ->
        (Is.not[fn](val)).should.be[expected]

truths = ['dog', 1, [], {}]
falses = [null, undefined]

describe 'is', ->

  # tests for only 1 value
  tests =
    exists:
      truthy: truths.concat([0])
      falsey: falses

    truthy:
      truthy: truths
      falsey: falses

    falsey:
      truthy: falses
      falsey: truths

    null:
      truthy: [null]
      falsey: [undefined, 'dog', 1, []]

    undef:
      truthy: [undefined]
      falsey: [null, '', 'dog', 1, []]

    equal:
      truthy: [[0, 0], ['dog', 'dog']]
      falsey: [[0, 1], ['cat', 'dog']]

    eq:
      truthy: [[0, '0']]
      falsey: [[0, 1], ['cat', 'dog']]

    less:
      truthy: [[0, 1]]
      falsey: [[1, 0]]

    greater:
      truthy: [[1, 0]]
      falsey: [[0, 1]]

    lessEq:
      truthy: [[0, 1], [0, 0]]
      falsey: [[1, 0]]

    greaterEq:
      truthy: [[1, 0], [0, 0]]
      falsey: [[0, 1]]

    object:
      truthy: [{}, [], new Date]
      falsey: [null, 'a', 1]

    array:
      truthy: [[]]
      falsey: [{}, 'a', 1, new Date]

    date:
      truthy: [new Date]
      falsey: [{}, 'a', 1, []]

    RegExp:
      truthy: [/\d/]
      falsey: [{}, 'a', 1, [], new Date]
      shorthand: 'rgx'

    NaN:
      truthy: [NaN]
      falsey: falses.concat([], 1, /\d/, '1', {})

    function:
      truthy: [() ->]
      falsey: [{}, 'a', 1, new Date]
      shorthand: 'fn'

    number:
      truthy: [1]
      falsey: [{}, [], '1', new Date]
      shorthand: 'num'

    string:
      truthy: ['dog']
      falsey: [{}, [], 1, new Date]
      shorthand: 'str'

    finite:
      truthy: [1, 2e64]
      falsey: [{}, [], NaN, -Infinity, Infinity, '1', new Date]

    int:
      truthy: [1, 2e64, -5, 0]
      falsey: [{}, [], NaN, 1.2, -Infinity, Infinity, '1', new Date]

    pos:
      truthy: [1, 5, 10.2]
      falsey: [0, -1, -2.5, 'a', {}]

    neg:
      truthy: [-1, -5, -10.2]
      falsey: [0, 1, 2.5, 'a', {}]

    zero:
      truthy: [0]
      falsey: [1, '1', '0', {}]

    'instance':
      truthy: [
        [Object, {}]
        [Array, []]
        [testClasses.Foo, new testClasses.Foo]
        [testClasses.Foo, new testClasses.Bar]
        [testClasses.Bar, new testClasses.Bar]
      ]
      falsey: [
        [Array, {}]
        [testClasses.Bar, new testClasses.Foo]
      ]

  # Dynamically add tests over `tests` object
  _.each tests, (expectations, methodName) ->
    describe 'normal tests', ->
      describe "#{methodName}", ->
        {shorthand, truthy, falsey} = expectations

        _.each truthy, (val) ->
          addTest methodName, val, true, shorthand

        _.each falsey, (val) ->
          addTest methodName, val, false, shorthand

  # Test negatives
  _.each tests, (expectations, methodName) ->
    describe 'not tests', ->
      describe "#{methodName}", ->
        {shorthand, truthy, falsey} = expectations

        _.each truthy, (val) ->
          addNotTest methodName, val, false, shorthand

        _.each falsey, (val) ->
          addNotTest methodName, val, true, shorthand

  describe '#arguments', ->
    it 'should return true for arguments', ->
      fn = -> (Is.arguments(arguments)).should.be.true
      fn()

    _.each falses.concat(truths), (val) -> addTest('arguments', val, false)

  describe '#invert', ->
    before -> this.testFn = Is.invert Is.fn

    it 'should return a function', ->
      this.testFn.should.be.instanceof Function

    it 'should return an inverted value', ->
      this.testFn(Is.equal).should.false

  describe '#contains', ->
    arr = [1, 2, 3]
    it 'should throw an error if initial value is not an array', ->
      try
        Is.contains('foo')
      catch e
        e.should.be.instanceof TypeError

    it 'should return false if the value is not found', ->
      Is.contains(arr, 5).should.be.false

    it 'should return true if the value is found', ->
      Is.contains(arr, 1).should.be.true
      Is.contains(arr, 2).should.be.true
      Is.contains(arr, 3).should.be.true

  describe '#has', ->
    it 'should return true if the key is found', ->
      Is.has({ foo: 3 }, 'foo').should.be.true

    it 'should return false if the key is not on on the obj', ->
      Is.has({ foo: 3 }, 'toString').should.be.false

  describe '#cmp', ->
    it 'should throw a type error', ->
      try
        Is.cmp()
      catch e
        e.should.be.instanceOf TypeError

    it 'should return a function', ->
      (Is.cmp(Is.greater)).should.be.instanceOf Function

    it 'should sort values with a specified predicate', ->
      vals = _.shuffle _.range 10
      vals.sort(Is.cmp(Is.less))
      c = 0
      _.each vals, (val) -> val.should.equal c++

    it 'should sort values with a specified predicate and property accessor', ->
      vals = _.shuffle [
        { name: 'albert'}
        { name: 'bob'}
        { name: 'cat'}
      ]

      vals.sort(Is.cmp(Is.greater, 'name'))
      vals[0].name.should.equal 'cat'
      vals[1].name.should.equal 'bob'
      vals[2].name.should.equal 'albert'

  describe '#instance as a high order fn', ->
    it 'should return a function that checks instances of Foo', ->
      fn = Is.instance testClasses.Foo
      fn.should.be.instanceOf Function
      fn(new Foo).should.be.ok
      fn([]).should.be.false

  describe '#ternary', ->
    it 'should return 1 for a truthy value', ->
      Is.ternary(true, 1, 2).should.equal 1

    it 'should return 2 for a falsey value', ->
      Is.ternary(false, 1, 2).should.equal 2

    it 'should return 1 for a lesser value', ->
      Is.ternary(Is.less, 1, 2).should.equal 1

    it 'should return 1 for a greater value', ->
      Is.ternary(Is.less, 2, 1).should.equal 1

    it 'should return a function for a pred given', ->
      fn = Is.ternary Is.less
      fn.should.be.a.function
      fn(1, 2).should.equal 1
      fn(2, 1).should.equal 1

    it 'should return a function for a pred and arg given', ->
      fn = Is.ternary Is.less, 1
      fn.should.be.a.function
      fn(2).should.equal 1

  describe '#every', ->
    it 'should map to .all', ->
      Is.every.should.equal Is.all

    it 'should return an object', ->
      Is.every().should.be.an.object

    it 'should allow chaining', ->
      Is.every().equal(1, 1).str('5').val().should.be.ok
      Is.every().str('foo').contains([1,2,3], 1).val().should.be.ok
      Is.every().str(1).contains([1,2,3], 1).val().should.be.false
      Is.every().str('foo').contains([1,2,3], 5).val().should.be.false


  describe '#some', ->
    it 'should map to .any', ->
      Is.some.should.equal Is.any

    it 'should return an object', ->
      Is.some().should.be.an.object

    it 'should allow chaining', ->
      Is.some().equal(1, 1).str('5').val().should.be.ok
      Is.some().str('foo').contains([1,2,3], 1).val().should.be.ok
      Is.some().str(1).contains([1,2,3], 1).val().should.be.ok
      Is.some().str('foo').contains([1,2,3], 5).val().should.be.ok
      Is.some().num('foo').contains([1,2,3], 5).val().should.be.false

  describe '#Lazy', ->
    it 'should call `val` when valueOf is called', ->
      +(Is.some().equal(1, 1).str('5')).should.be.ok
      !!(Is.some().equal(1, 1).str('5')).should.be.ok

