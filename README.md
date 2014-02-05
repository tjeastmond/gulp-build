# gulp-build

**I WOULDN'T SUGGEST USING THIS YET**

Gulp 3 plugin developed to satisfy a deployment requirement or swapping out various variables depending on the environment.

**This script doesn't determine the environment, and currently uses Underscore.js templates, with the Mustache delimiters. A future release will allow template engines to be set.**

**This is an early release.**

## Install

```shell
npm install --save-dev gulp-build
```

## Usage

```javascript
var build = require('gulp-build');

gulp.task('build', function() {
  gulp.src('scripts/*.js')
      .pipe(build({ GA_ID: '123456' }))
      .pipe(gulp.dest('dist'))
});
```

## API

### gulp-build(data, config)

### filename
The name of the file to save your new template object to.

#### config.interpolate
Type: `RegExp`<br />
Default: `/\{\{(.+?)\}\}/g`

Which template delimiters to look for:

```html
This is a {{ template }}.
```

You can change it to use ERB type delimiters with the RegExp: `/<%=([\s\S]+?)%>/g`

## Testing

Open a terminal in the directory containing `gulp-build` and then:

```shell
npm install
npm test
```

## The License (MIT)
Copyright (c) 2014 TJ Eastmond

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.