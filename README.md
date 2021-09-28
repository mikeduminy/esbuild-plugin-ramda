# esbuild-plugin-ramda

[![npm](https://img.shields.io/npm/v/esbuild-plugin-ramda.svg)](https://www.npmjs.com/package/esbuild-plugin-ramda)

This plugin is for [esbuild](https://github.com/evanw/esbuild), similar to how [babel-plugin-ramda](https://github.com/megawac/babel-plugin-ramda) works for babel.

## Installation

```sh
npm install --save-dev esbuild-plugin-ramda
```

## Usage

Define plugin in the `plugins` section of esbuild config like this:

```js
const esbuild = require("esbuild");
const ramdaTransformer = require("esbuild-plugin-ramda");

esbuild.build({
  // ...
  plugins: [ramdaTransformer()],
});
```

## Result

Having this input file:

```js
import { add, curry } from "ramda";

add(2, 3);
curry(add)(2)(3);
```

It will output this following file content:

```js
import add from "ramda/src/add";
import curry from "ramda/src/curry";

add(2, 3);
curry(add)(2)(3);
```

## Options

You can specify your own `filter` as per according to esbuild docs [here](https://esbuild.github.io/plugins/#concepts).
