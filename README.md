# routee

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage percentage][coveralls-image]][coveralls-url]

> The last router you'll ever need.

## Installation

```bash
npm install routee
```

## Usage

```typescript
import {registerRoute, createURL, dispatch} from "routee";

const fooRoute = registerRoute('foo', ['id', 'name'], ({id, name}) => {
    // this is the route executor
});

// create an URL from a route and its parameters
createURL(route, {
    id: '1',
    name: 'Bob'
});

// dispatch a location
const dispatchedRoute = dispatch('foo/bar/id/1/name/lorem');
```

## API

Read the [documentation](https://nightlycommit.github.io/routee) for more information.

## Contributing

* Fork the main repository
* Code
* Implement tests using [tape](https://github.com/substack/tape)
* Issue a pull request keeping in mind that all pull requests must reference an issue in the issue queue

## License

Apache-2.0 © [Eric MORAND]()

[npm-image]: https://badge.fury.io/js/routee.svg
[npm-url]: https://npmjs.org/package/routee
[travis-image]: https://travis-ci.com/NightlyCommit/routee.svg?branch=master
[travis-url]: https://travis-ci.com/NightlyCommit/routee
[coveralls-image]: https://coveralls.io/repos/github/NightlyCommit/routee/badge.svg
[coveralls-url]: https://coveralls.io/github/NightlyCommit/routee