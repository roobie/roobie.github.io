---
layout: post
title: A uniform accessor for javascript
date: 2017-01-12 14:58:02 +0100
categories: software javascript
tags:
  - javascript
  - utility
  - API-design
---

Applying the [uniform access principle][wp-uap] to one's API's in JavaScript can be done in at least two ways:

1. Using the `Object.create`/`Object.defineProperties` API
2. Wrapping a value in a closure and exposing a function that can read and set said value, e.g. [uniform-accessor][uniform-accessor]

Let's say we have an HTTP API such as this:

```
GET /users/1
{
  "firstName": "Fox",
  "lastName": "Mulder"
}
```

**user_service.js**

```javascript
import {User} from './models';

export getUser(id = 0) {
  return http.get(`/users/${id}`)
    .then(User.of);
}
```

**models.js #1**

```javascript
export class User {
  constructor(srcData) {
    Object.defineProperties(this, {
      _firstName: {
        value: srcData.firstName
      },
      _lastName: {
        value: srcData.lastName
      },
      firstName: {
        get: function () {
          return this._firstName;
        },
        set: function (newFirstName) {
          this._firstName = newFirstName;
        },
        enumerable: true
      },
      lastName: {
        get: function () {
          return this._lastName;
        },
        set: function (newLastName) {
          this._lastName = newLastName;
        },
        enumerable: true
      },
      name: {
        get: function () {
          return `${this.firstName} ${this.lastName}`;
        },
        enumerable: true
      }
    });
  }

  static of(data) {
    return new User(data);
  }
}
```

**models.js #2**

```javascript
import ua from 'uniform-accessor';

export class User {
  constructor(srcData) {
    this.firstName = ua(srcData.firstName);
    this.lastName = ua(srcData.lastName);
    this.fullName = function () {
      return `${this.firstName()} ${this.lastName()}`;
    };
  }

  static of(data) {
    return new User(data);
  }
}
```

There are a couple of differences, of which at least two are important:

- There's less boilerplate in **#2**
- The object's properties are accessed like `a.firstName` in **#1**, whereas they're accessed like `a.firstName()` in **#2** (notice the parentheses)

### More examples

Setting the name of a `User` with a value from an async computation:

```javascript
const u1 = new User({...}); // from models.js #1
nameService.getRandom().then(name => u1.name = name);
// ----------------------------------^^^^^^^^^^^^^^
// notice how we're actually returning the value of the assignment expression here.
// (I'm not too fond of this, and e.g. airbnb's eslint config forbids this)
// In order to circumvent this infraction, we would have to write:
nameService.getRandom().then(name => {
  u1.name = name;
});
```

```javascript
const u2 = new User({...}); // from models.js #2
nameService.getRandom().then(u2.name);
// --------------------------^
// just pass the accessor function as a callback to the `.then()` method
```

### More possibilities

The (uniform-accessor)[uniform-accessor] library (made by yours truly) has some useful
extensions, such as `equals` `ap`, `map`, `chain`, `update` and `collect`.

**Examples:**

```javascript
const dog = ua('Noname')
const cat = ua('Zeke')
const upcase = s => s.toUpperCase()
const upcaseUa = ua(upcase)
```


[wp-uap]: https://en.wikipedia.org/wiki/Uniform_access_principle
[mithril-home]: http://mithril.js.org/
[mithril-blog-uap]: http://lhorie.github.io/mithril-blog/the-uniform-access-principle.html
[uniform-accessor]: https://github.com/roobie/uniform-accessor
[ua-transformer-gist]: https://gist.github.com/roobie/4641d331144c61cdb2fdd0ea3bd957fb
[m-prop]: http://mithril.js.org/mithril.prop.html
[ng-digest]: https://www.ng-book.com/p/The-Digest-Loop-and-apply/
[flyd-gh]: https://github.com/paldepind/flyd
