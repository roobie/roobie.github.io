---
layout: post
title: More robust JavaScript - The Maybe monad
date: 2017-01-16 19:58:02 +0100
comments: true
categories: software javascript
tags:
  - javascript
  - API-design
  - monads
  - maybe-monad
---

If you design API's (i.e. you write programs with more than one module or you
design libraries to be used by others[^ninternalapis]), then you make decisions on how then
application code will look like and behave.

Let's say that we need a module for interfacing with a word list, like a
dictionary. The module should expose a function named `getFirstMatch` that consumes
1 argument, a `RegExp`, and should return the first word in the word list that matches
that `RegExp`. We have a text file `words.txt` that contains the following:

```
aardvark
fox
lion
wolf
zebra
```

For the sake of brevity, we have a function, `load`, that parses a file as an
array with an element for each line in the file.

An initial implementation could look like:

**Module: `words-basic.js`**

```javascript
const words = load('./words.txt');
export function getFirstMatch(re) {
  for (let i = 0; i < words.length; ++i)
    if (words[i].match(re) !== null) return words[i];
};
```

Then, some application code comes along and wants to use the above module:

**Module: `app-basic.js`**

```javascript
import {getFirstMatch} from 'words-basic'

const searchPatterns = [
  /aa/,
  /frob/
];

// for some reason, we want to log the length of the first word found matching
// each of the regices above.
searchPatterns.forEach(pat => {
  console.log(getFirstMatch(pat).length);
});
```

We incur a `TypeError`. Due to `getFirstMatch` returning a `null` as a result of
the  `RegExp` `/frob/` not matching anything.

What can we do to mitigate this?

1. One solution would be to document this in the `words` module, telling the
consumer that "By using this function you agree to check for null, lest you want
to have TypeErrors thrown about".

2. Another solution would be to codify the error handling, or in other terms: force
consumer code to handle the case of failure.

Let's take a look at what the first solution could look like:

**Module: `app-nullcheck.js`**

```javascript
// some parts elided

searchPatterns.forEach(pat => {
  const result = getFirstMatch(pat);

  // Do the null-check, because the documentation said that the result might
  // be null. Er, wait, did it say anything about it being undefined? Better
  // check for that as well.
  if (result !== null && result !== undefined) {
    console.log(result.length);
  }
  else {
    // Shucks, there was no word matching `pat`
    console.log(0);
  }
});
```

Looks OK, but keep in mind, nobody really forced you to bother taking care of
the crashing application (other than your raging client).

To implement the second solution, we would write our `words` module a bit
different:

**Module: `words-monadic.js`**

```javascript
import {Maybe} from 'ramda-fantasy';
const {Just, Nothing} = Maybe;

const words = load('./words.txt');
export function getFirstMatch(re) {
  for (let i = 0; i < words.length; ++i)
    if (words[i].match(re) !== null) return Just(words[i]);
    // -------------------------------------^
    // We return Maybe.Just if the word was found

  // otherwise, we return Nothing, which indicate the absence of a value.
  // A bit similar to `null` but without all the null reference errors.
  return Nothing;
};
```

**Module: `app-monadic.js`**

```javascript
// some parts elided

searchPatterns.forEach(pat => {
  const result = getFirstMatch(pat)
    // here we are saying:
    // "If the result is Just(x) we want to read x.length"
    .map(word => word.length)
    // here we are saying:
    // "Extract the value of the current Maybe, but if it's a Nothing,
    // then we default to `0`"
    .getOrElse(0);

  console.log(result);
});
```

Personally, I find the second approach to be far superior to the first, because:

- It forces consumer code to take care of the possible failure state.
- It does so in a uniform way, i.e. no need to sometimes check for `null` and
other times check for `undefined` etc.
- It unifies the falsy values of javascript into one atom. I.e. one would not
need to worry about inadvertently checking whether `0` is false, as in:

```javascript
var result = 0; // zero here is an actual value, not the absence of one.
if (!result) {
  alert('ERROR: we got no result');
}
```

### I'm sold! Where do I find it?

There are a number of implementations in the wild that one could use. I like the
idea behind [fantasy-options][fantasy-options-gh][^nalternativenames],
in that there is a [well defined specification][fantasy-land-spec] for the API
exposed by that module. As discussed in
[this issue][fantasy-options-gh-name-issue], it might change the names of the
exported symbols soon, from `Option{Some, None}` to `Maybe{Just, Nothing}`, so
if you decide to use this, be ready to rewrite some code... `Maybe`.

Another library that conforms to the fantasy-land spec is
[ramda-fantasy/maybe][ramda-fantasy-maybe-gh]. However, this library is declared
to be in an alpha state, so should not be used without consideration.


### Still not convinced?

I regret not being able to convince you of the merits of using the `Maybe` monad. Write a comment below and we'll talk things over.

---

##### Footnotes

[^ninternalapis]: Yes, everyone who has written code that is used by others, be it an internal API or an exposed API, have designed it. The word "design" being applied in a loose manner.
[^nalternativenames]: The `Maybe` monad is known to also be called `Option` and sometimes `Optional`.

[fantasy-land-spec]: https://github.com/fantasyland/fantasy-land
[fantasy-options-gh]: https://github.com/fantasyland/fantasy-options
[fantasy-options-gh-name-issue]: https://github.com/fantasyland/fantasy-options/issues/8
[ramda-fantasy-maybe-gh]: https://github.com/ramda/ramda-fantasy/blob/master/docs/Maybe.md

[why1]: https://github.com/chrissrogers/maybe#why
