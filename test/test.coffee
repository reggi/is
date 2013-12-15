'use strict'

_ = require 'lodash'
Is = require '../src/is'
require 'should'

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
      truthy: [{}]
      falsey: [[], 'a', 1, new Date]

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

  # Dynamically add tests over `tests` object
  _.each tests, (expectations, methodName) ->
    describe "#{methodName}", ->
      {shorthand, truthy, falsey} = expectations

      _.each truthy, (val) ->
        addTest methodName, val, true, shorthand

      _.each falsey, (val) ->
        addTest methodName, val, false, shorthand

  describe '#arguments', ->
    it 'should return true for arguments', ->
      fn = -> (Is.arguments(arguments)).should.be.true
      fn()

    _.each falses.concat(truths), (val) -> addTest('arguments', val, false)

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

