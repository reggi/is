[![Build Status](https://travis-ci.org/landau/is.png?branch=master)](https://travis-ci.org/landau/is)
[![NPM](https://nodei.co/npm/is-predicate.png?downloads=true&stars=true)](https://nodei.co/npm/is-predicate/)
# is.js - NOT an assertion library

`is.js` is a predicate library for JS. `is` doesn't have any dependencies which makes it easy to integrate into new and existing projects.

[Blog post on is](http://trevorlandau.net/posts/is-js)


## Usage
```
is.equal(1, 1); // true
is.not.pos(-1); // true
[2, 5, 1].sort(is.cmp(is.less)); // [1, 2, 5]
is.ternary(true, 'foo', 'bar'); // foo
is.fn(function () {}); // true
is.not.equal(1, 3); // true
```

## install
> npm install --save is-predicate

or

download the file from the [dist](https://github.com/landau/is/dist/is.js) directory

## Documentation

[Docs](https://github.com/landau/is/wiki/is.API)


## TODO
- underscore style docs
- deep equal on objects
- chaining
- test coverage

## Author
[Trevor Landau](http://trevorlandau.net)

## contributing
- Suggestions welcome!
- Ensure tests pass.
- Write new tests for new functionality.
- Write docs
- Ping me on [twitter](http://twitter.com/trevor_landau) if I take too long to respond! That probably means I missed the alert/email.

## changlog
#### 0.3.0
- Expose is.invert
- Added is.contains
- Added is.has
- Remove bower support

#### 0.2.0
- Added is.pos
- Added is.neg
- Added is.ternary
- Added is.not, which inverses all boolean returning predicate methods

#### 0.1.1
- Added is.bool/boolean method

#### 0.1.0
- Release
