# is.js
> Link to blog post about usecases

## install
> npm install --save is

or

> bower install --save is

or

download the file from the `dist` dir

## Why
Why not? But seriously, frequently we developers are writing `if` statements containing a chain of comparisons which can at times be confusing, contain typos, or other issues. `is.js` helps prevent many of these mistakes.

```
if (x = 'dogbird') // oops reassigned

if (is.equal(x, 'dogbird')) // explicit and CAN'T be reassigned
```  

```
if ()
```

## Documentation
- DOCCO

## TODO
> Features to implement

- deep equal
- chaining
- instance type generator/validator

## Author
[Trevor Landau](http://trevorlandau.net)

## contributing
- Ensure tests pass for changed functions.
- Write new tests for new functionality.
- Ping me on twitter if I take to long to respond! That probably means I missed the alert/email.

## changlog
#### 0.1.0
- Released