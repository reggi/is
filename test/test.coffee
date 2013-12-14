'use strict'

_ = require 'lodash'
Is = require '../src/is'
require 'should'

addTest = (fn, val, expected) ->
  if Array.isArray(val) and val.length
    it "should return `#{expected}` for values `#{val}`", ->
      (Is[fn].apply(null, val)).should.be[expected]
  else
    it "should return `#{expected}` for value `#{val}`", ->
        (Is[fn](val)).should.be[expected]


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

    rgx:
      truthy: [/\d/]
      falsey: [{}, 'a', 1, [], new Date]

    NaN:
      truthy: [NaN]
      falsey: falses.concat([], 1, /\d/, '1', {})

    function:
      truthy: [() ->]
      falsey: [{}, 'a', 1, new Date]

    fn:
      truthy: [() ->]
      falsey: [{}, 'a', 1, new Date]

    number:
      truthy: [1]
      falsey: [{}, [], '1', new Date]

    num:
      truthy: [1]
      falsey: [{}, [], '1', new Date]

    string:
      truthy: ['dog']
      falsey: [{}, [], 1, new Date]

    str:
      truthy: ['dog']
      falsey: [{}, [], 1, new Date]



  # Dynamically add tests over `tests` object
  _.each tests, (expectations, methodName) ->
    describe "#{methodName}", ->
      _.each expectations, (vals, truthyStr) ->
        truthy = if truthyStr == 'truthy' then true else false
        _.each vals, (val) -> addTest methodName, val, truthy

  describe '#arguments', ->
    it "should return true for arguments", ->
      fn = -> (Is.arguments(arguments)).should.be.true
      fn()

    _.each falses.concat(truths), (val) -> addTest('arguments', val, false)
