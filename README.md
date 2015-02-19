# sass-flatten

Reduce a Sass (scss) file structure to a single file by inlining partial imports.

## Installing

```
npm install -g sass-flatten
```

## Usage Examples

It can read from a file

```
sass-flatten some/path/input.scss output.scss
```
or from _stdin_
```
cat some/path/input.scss | sass-flatten --include-path some/path/ > output.scss
```

## API

```js
var flatten = require('sass-flatten');
var input = '@import "some/partial";';
var includePath = 'some/path';

var output = flatten(input, includePath);
```
