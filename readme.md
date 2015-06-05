# mainify [![Build Status](https://travis-ci.org/bendrucker/mainify.svg?branch=master)](https://travis-ci.org/bendrucker/mainify)

> browserify transform for [require-relative-main](https://github.com/bendrucker/require-relative-main)


## Install

```
$ npm install --save mainify
```


## Usage

Application code:

```js
require('require-relative-main')('./users')
```

Build:

```sh
browserify -t mainify ./
```

You can also use static paths as the `cwd:

```js
require('require-relative-main')('./users', '../app')
```

You can even use `__dirname`:

```js
require('require-relative-main')('./users', __dirname)
```

## API

#### `mainify()` -> `transformStream`

## License

MIT © [Ben Drucker](http://bendrucker.me)
