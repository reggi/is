[![Build Status](https://travis-ci.org/landau/is.png?branch=master)](https://travis-ci.org/landau/is)
# is.js
> Link to blog post about usecases

## install
> npm install --save is

or

> bower install --save is

or

download the file from the `dist` dir

## Why
Why not? But seriously, frequently we developers are writing `if` statements containing a chain of comparisons which can at times be confusing, contain typos, or other issues. `is.js` helps prevent many of these mistakes. `is` also allows you to write less code!

```
if (x = 'dogbird') // oops reassigned
if (x == 'dogbird') // should use triple equal

// explicit
// CAN'T be mistakenly reassigned
// always triple equal
if (is.equal(x, 'dogbird')) 
```  

```
if (typeof 'foo' === 'string')
if (typeof('foo') === 'string')

// don't fight about how typeof should be written
// less code
if (is.str('foo'))
```

```
// handy type checkers!
if (is.date(new Date)))
if (is.NaN(1))
...more
```

`is` also provides a comparator function that **should** be used in tandem with `is` predicates.
```
var a = [2, 5, 1]; // unsorted
a.sort(is.cmp(is.less)); // [1, 2, 5]
```
In the above excerpt, I pass the predicate `less` to `cmp` which returns a comparator function that will use for `less` as it's comparing of values.

Does your comparator function need to access a property of an object? No problem. Pass the string name of your property to be accessed and let `is` handle the rest.

```
var a = [
  { name: 'albert'}
  { name: 'bob'}
  { name: 'cat'}
];
a.sort(is.cmp(is.greater, 'name')); // reverse the array
```

These are some examples of the power of using `is`. So, if you like writing explicit and less verbose code then follow the install instructions above!

## Documentation
- DOCCO

## TODO
- deep equal
- chaining
- instance type generator/validator

## Author
[Trevor Landau](http://trevorlandau.net)

## contributing
- Ensure tests pass.
- Write new tests for new functionality.
- Ping me on twitter if I take to long to respond! That probably means I missed the alert/email.

## changlog
#### 0.1.0
- Release