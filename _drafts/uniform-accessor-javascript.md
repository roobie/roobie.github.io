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

The [uniform access principle][wp-uap] can be applied when writing software to hide implementation details in a module's API. Consider the following (contrived) example, where we are interfacing with an HTTP API out of our control, which has the following signature:

```
GET /users/1
{
  "fullName": "Stephen Smith",
  "age": 40
}
```

Then, to consume this API, we build an internal API that fetches the data and returns a `Promise` of it.

```javascript
// api module
export default const api = {
  getUser: (id) => http.get(`/users/${id}`)
};

// application module
import api from 'api';

api.getUser(1).then(user => {
  console.log(user.fullName, user.age); // "Stephen Smith", 40
});
```

All is fine and dandy, for a while. Then, the owner of the HTTP API updates the format of the data that is returned (and it's not versioned), so we have to update our code.

```
GET /users/1
{
  "firstName": "Stephen",
  "lastName": "Smith",
  "dateOfBirth": "1977-01-01"
}
```

Then, we could rewrite the `getUser` function, without breaking application code by using the `Object.create` API, as such:

```javascript
// api module, identical parts elided
    .then(user => {
      return Object.defineProperties(user, {
        fullName: {
          get: function () {
            return `${user.firstName} ${user.lastName}`;
          }
        },
        dateOfBirth: {
          get: function () {
            return new Date(user.dateOfBirth);
          }
        },
        age: {
          get: function () {
            return yearDiff(new Date(), this.dateOfBirth());
          }
        }
      })
    })
```

A bit mouthful, but does the job. An alternative to this is what one could call a "uniform accessor function". Here's an example of an [implementation in javascript][uniform-accessor]. The basic usage of it is:

```javascript
import uniformAccessor from 'uniform-accessor';
const v = uniformAccessor('a string');
console.assert(v() === 'a string');
console.assert(v('another string') === 'another string');
console.assert(v() === 'another string');
```

Here's a helper function to automatically transform a result from a plain old JS object to one with properties that are of uniform access type, [uniform access transform][ua-transformer-gist]

Using the uniform accessor and the transform, one could design the API from the beginning as:

**Before the underlying API change**

```javascript
import ua from 'uniform-accessor';
import uniformAccessTransform from 'uniform-access-transform';

// api module
export default const api = {
  getUser: (id) => http.get(`/users/${id}`)
    .then(user => uniformAccessTransform(user))
    // -----------^ using the helper function here
}

// the application module would instead look like this
import api from 'api';

// should print 'Stephen Smith', 40
api.getUser(1).then(user => {
  console.log(user.fullName(), user.age());
  // ----------------------^-----------^
  // Notice the accessor functions being called
});
```

**After the underlying API change**

```javascript
import ua from 'uniform-accessor';
import uniformAccessTransform from 'uniform-access-transform';

// api module, identical parts elided
    .then(user => {
      return uniformAccessTransform(user, {
        fullName: function () {
          return `${user.firstName} ${user.lastName}`;
        },
        dateOfBirth: function () {
          return new Date(user.dateOfBirth);
        },
        age: function () {
          return yearDiff(new Date(), this.dateOfBirth());
        }
      })
    })
```

# TODO - drawing

Now, this, in and of itself, is not mind-blowing. However, there are certain use cases where this sort of API-design could be preferable. E.g. consider Angular, which implements a sort of [event loop with dirty checking][ng-digest] to implement a two-way binding between views and controllers. If one were to implement an Angular-like library, we could require that all properties that are exposed to the view are of uniform access type. We would perhaps implement our own version of the `uniform-accessor` library, that was integrated with our rendering code, so that when application code would set the value of an accessor we would know when to re-render the UI, removing the need for dirty checking. [Mithril MVC framework][mithril-home] does this, as far as i can tell.

Furthermore, uniform access variable bindings can be of use for writing terser code. Since uniform accessors are functions, the can be used as callbacks to e.g. `Promise.prototype.then`:

**Basic implementation**

```javascript
const model = {
  user: {},
  error: null
};

api.getUser()
  .then(result => {
    model.error = null;
    model.user = result;
  })
  .catch(error => {
    model.error = error;
    model.user = null;
  })
```

**Implementation with a uniform accessor and some helper functions**

```javascript
// using the event triggers to cause side effects to clear the mutex'd values.
const model = {
  user: ua({}, { onset: () => model.error(null) }),
  error: ua(null, { onset: () => model.user(null) })
};

// using a Promise-based API
api.getUser('Stephen')
  .then(model.user)
  .catch(model.error);

// Or, if we implemented our API using reactive stream
userService.resultStream.map(model.user);
userService.errorStream.map(model.error);
```

What we're seeing is composability, and a uniform way of accessing data on an object. Furthermore, the way we set it up is in a more declarative way rather than imperative.

#### Notes

- See [flyd][flyd-gh] for a nice reactive stream library.
- I first saw an implementation and extensive use of one in the [Mithril MVC framework][mithril-home], where it is called [`m.prop`][m-prop].


[wp-uap]: https://en.wikipedia.org/wiki/Uniform_access_principle
[mithril-home]: http://mithril.js.org/
[uniform-accessor]: https://github.com/roobie/uniform-accessor
[ua-transformer-gist]: https://gist.github.com/roobie/4641d331144c61cdb2fdd0ea3bd957fb
[m-prop]: http://mithril.js.org/mithril.prop.html
[ng-digest]: https://www.ng-book.com/p/The-Digest-Loop-and-apply/
[flyd-gh]: https://github.com/paldepind/flyd
