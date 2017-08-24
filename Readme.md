DB Updating Table Dev Challenge
===============================

This module contains a development challenge for DB recruitment.

The instructions are in the site/index.html file.

To view them, run

```
npm install
npm start
```

from within this directory.  This will start a development server (using webpack)
that supports hot reloading but also provides a stomp/ws endpoint providing fake
fx updates.

Once you've started the development server, navigate to http://localhost:8011
to read the task description and get started.

## Notes

All the source files I modified are located in the `/es6` folder. I also added a webpack plugin to handle generators transpilation and a `.babelrc` file used for unit tests.

### High-level description

I've been told during the first interview that the teams in DB may use reactive programming, but I quickly figured out it would take me too much time and be too complex to implement some Rx-like functions (functors?) as well as my lack of experience using it would have added more head-over.

As I've been very influenced by the use of React, redux and elm, I think I naturally got to some similar-ish architecture.

So you'll find the following modules in this app:

- `state.js` handling the state of the app and how to update it,
- `view.js` handling rendering after each state update,
- `cmd.js` describes the possible messages types modifying the app state 
- `index.js` will simply connect the stomp subscription to the state and view updates

While trying to use as much pure functions as possible, I figured out I could actually use a generator to handle the state object folding, hence the implementation you might see in the `utils.js` module.

The drawback of such architecture is that without some kind of virtual dom implementation the view rendering is a bit brute-force. The rendering of rows is triggered for each state update. I haven't implemented any dom-friendly rendering algorithm so far.

### Error handling

I must admit I haven't taken the time to handle any resilience for this application, mostly for time gain and also because it would have added complexity.

In any case I think this kind of optimisation might come later in the development of any app so that errors can be spotted earlier.

### Tests

The tests do not cover everything, especially e2e tests or even BDD ones, equally for timing reasons.

I mainly used some unit tests on functions that I thought where a bit more complex to implement and where I could simplify a bit the code afterwards without changing the whole implementation.

You can use `npm test` to run the tests.

### Code style

I haven't used any code-style checker so far (seems airbnb's one is present in the webpack conf though), as for such project I rely on the babel parser and unit tests for any typo.

Needless to say I'm still happy to follow any team standards.

### Suggested improvements

- virtual dom or any dom reconciliation library (react _et al._)
- typing decoration (flow or ts)
- more tests, wether it is e2e and cross browser/platform, or unit ones
- obviously UI, because the design is fairly naive, responsiveness nonexistent, and the rows updates are a bit rough
