# use-sluggish-state

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]
[![Package Size][bundlephobia-img]][bundlephobia-url]

# useSluggishState

A react hook for setting state after a specific delay, built with typescript in mind. The basic idea behind this is that you can schedule a state update and if you want perform a transition before the state update completes.

## Install

```bash
npm install use-sluggish-state
```

## Usage

```js
import useSluggishState from 'use-sluggish-state';

const [isDarkMode, setIsDarkMode] = useSluggishState(true, 500);

console.log(isDarkMode);
// => true

setIsDarkMode(false);

console.log(isDarkMode);
// => true
// Darkmode is still true

console.log(isDarkMode);
// After 500 milliseconds
// => false
```

**OR** with typescript

```ts
import useSluggishState from 'use-sluggish-state';

const [isVisible, setIsVisible] = useSluggishState<boolean | undefined>(
  true,
  5000
);

// ERROR:
// Typescript should throw an error at this
setIsVisible('yes');

// SUCCESS:
// This should pass
setIsVisible(false);
```

If no generic is passed, the type is also inferred from the initial value, just the same as in react `useState`

```ts
import useSluggishState from 'use-sluggish-state';

const [isVisible, setIsVisible] = useSluggishState(true, 5000);

// ERROR:
// Typescript should also throw an error at this
setIsVisible('yes');

// SUCCESS:
// This should pass
setIsVisible(false);
```

Also allows a callback to be passed as the parameter of `setState`.

```js
import useSluggishState from 'use-sluggish-state';

const [isDarkMode, setIsDarkMode] = useSluggishState(true, 100);

// Toggle dark mode on/off after 100 milliseconds
setIsDarkMode(prev => !prev);
```

`delay` can be specified for a specific `setState` action than that which was already set in the hook.

> Note: this does not change the original delay for subsequent `setState` calls

```js
import useSluggishState from 'use-sluggish-state';

const [showPopup, setShowPopup] = useSluggishState(true, 1000);

// Shows popup after 5 seconds
setShowPopup(true, 5000);

// Shows popup after 1 second
setShowPopup(true);
```

Calling `setState` with a value does not change the state in the already executing code.

```js
import useSluggishState from 'use-sluggish-state';

const [names, setNames] = useSluggishState('Bob');

setNames(names + ', Bonnie');
setNames(names + ', Clyde', 2000);

console.log(names);
// => "Bob, Bonnie"
// => "Bob, Clyde"
```

However when called with a callback, the previous state since the last `setState` call can be accessed

```js
import useSluggishState from 'use-sluggish-state';

const [owner, setOwner] = useSluggishState('Bob');

setNames(prev => prev + ', Bonnie');
setNames(prev => prev + ', Clyde', 2000);

console.log(owner);
// => "Bob, Bonnie"
// => "Bob, Bonnie, Clyde"
```

> Note: the state updates occur in the order of the delay `setState` is called with

```js
import useSluggishState from 'use-sluggish-state';

const [owner, setOwner] = useSluggishState('Bob');

setNames(prev => prev + ', Bonnie', 3000);
setNames(prev => prev + ', Clyde', 2000);

console.log(owner);
// => "Bob, Clyde"
// => "Bob, Clyde, Bonnie"
```

### DEBOUNCE

Achieve Debounce in the simplest way

```js
import useSluggishState from 'use-sluggish-state';

const SomeComponent = () => {
  const [searchQuery, setSearchQuery, _loading, finalQuery] =
    useSluggishState('gribble');

  const onChange = event => {
    setSearchQuery(event.target.value, 1000);
  };

  useEffect(() => {
    // fetch will be called only when user has stopped typing for 1 second
    fetch(`path/to/api?search=${searchQuery}`);
  }, [searchQuery]);

  return <input value={finalQuery} onChange={onChange} />;
};
```

## API

### const [state, setState, loading, finalState] = useSluggishState(value?, delay?)

#### state

The state variable initialized by the `value` property passed in the hook

Type: Infered from the value passed in. If no value is passed, it defaults to `undefined`. Also defined by passing in a generic e.g `<boolean>` like in the typescript example above.

#### setState

Function to trigger a state update. Works like the typical react `setState`.

Type:

```ts
Dispatch<React.SetStateAction<InferredType>>;
// Where `InferredType` is the type of the passed value or undefined

// OR

Dispatch<React.SetStateAction<DefinedType>>;
// Where `DefinedType` is the generic passed to `useStoreState` i.e boolean, string.
```

#### loading

Indicates whether a state update is in progress or not.

Type: `Boolean`

#### finalState

The instant updated state not affected by the delay.

Type: Same as in [state](#state) above

#### value?

Required: NO
Default: `undefined`
Type: `any`

#### delay? (milliseconds)

Required: NO
Default: `0`
Type: `number`

#### `type` Dispatch

Definition:

```ts
type Dispatch<A> = (value: A, _delay?: number) => void;
```

Usage:

```ts
import { type Dispatch } from 'use-sluggish-state';

const customSetState: Dispatch<React.SetStateAction<InferredType>>;
```

[build-img]: https://github.com/emekaorji/use-sluggish-state/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/emekaorji/use-sluggish-state/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/use-sluggish-state
[downloads-url]: https://www.npmtrends.com/use-sluggish-state
[npm-img]: https://img.shields.io/npm/v/use-sluggish-state
[npm-url]: https://www.npmjs.com/package/use-sluggish-state
[issues-img]: https://img.shields.io/github/issues/emekaorji/use-sluggish-state
[issues-url]: https://github.com/emekaorji/use-sluggish-state/issues
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
[bundlephobia-img]: https://flat.badgen.net/bundlephobia/minzip/use-sluggish-state
[bundlephobia-url]: https://bundlephobia.com/package/use-sluggish-state
