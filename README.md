[![Build Status](https://travis-ci.org/landau/is.png?branch=master)](https://travis-ci.org/landau/is)
[![NPM](https://nodei.co/npm/is-predicate.png?downloads=true&stars=true)](https://nodei.co/npm/is-predicate/)
# is.js - NOT an assertion library

`is.js` is a predicate library for JS. `is` doesn't have any dependencies which makes it easy to integrate into new and existing projects.

[Blog post on is](http://trevorlandau.net/posts/is-js)


## Usage
```js
is.equal(1, 1); // true
is.not.pos(-1); // true
[2, 5, 1].sort(is.cmp(is.less)); // [1, 2, 5]
is.ternary(true, 'foo', 'bar'); // foo
is.fn(function () {}); // true
is.not.equal(1, 3); // true
```

## Every/Some

Every and some are functions that allow you to chain predicate calls. The calls are not evaluated until `.val()` is executed on the chain.

```js
// All evaluations must be true
is.every().equal(1, 1).contains([1, 2, 3], 2).val(); // true
is.all().equal(1, 5).contains([1, 2, 3], 2).val(); // false

// At least one eval must be true
is.some().equal(1, 1).contains([1, 2, 3], 2).val(); // true
is.any().equal(1, 5).contains([1, 2, 3], 2).val(); // true
is.some().equal(1, 5).contains([1, 2, 3], 5).val(); // false
```

Alternaively to `.val` you can execute `valueOf`
```js
// All evaluations must be true
!!is.every().equal(1, 1).contains([1, 2, 3], 2); // true
```

> Notice the alias of `all/any` if you prefer that flavor

> NOTE: Chaining doesnt work with `.not` yet.

## install
> npm install --save is-predicate

or

download the file from the [dist](https://github.com/landau/is/dist/is.js) directory

## Documentation

[Docs](https://github.com/landau/is/wiki/is.API)


## TODO
- underscore style docs
- deep equal on objects
- is.not.every/some

## Author
[Trevor Landau](http://trevorlandau.net)

## contributing
- Suggestions welcome!
- Ensure tests pass.
- Write new tests for new functionality.
- Write docs
- Ping me on [twitter](http://twitter.com/trevor_landau) if I take too long to respond! That probably means I missed the alert/email.

## changlog
#### 0.5.0
- Added `is.zero`
- Fix `is.object` and `is.error`
- `is.ternary` now supports partial application
- `is.gt`, `is.gtEq`, `is.lt`, `is.ltEq` aliases added

#### 0.4.0
- Support for lazy chain evaluation

#### 0.3.0
- Expose `is.invert
- Added `is.contains
- Added `is.has
- Remove bower support

#### 0.2.0
- Added `is.pos`
- Added `is.neg`
- Added `is.ternary`
- Added `is.not`, which inverses all boolean returning predicate methods

#### 0.1.1
- Added is.bool/boolean method

#### 0.1.0
- Release
