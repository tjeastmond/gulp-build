# gulp-build

Gulp 3 plugin for building out files for deployment. Good for swapping environmental variables like Google Analytics IDs, or just compiling static HTML files.

`gulp-build` uses HandleBars for templates, and supports helpers, partials, and layouts.

**Version `0.5.0` was a big update. I moved away from using Underscore templates, and have added support for partials and layouts. Both partials and layouts must be passed in as strings, but a future update will bring support for file glob'ing.**

## Install

```shell
npm install --save-dev gulp-build
```

## Usage

Basic usage:

```javascript
var build = require('gulp-build');

gulp.task('build', function() {
  gulp.src('scripts/*.js')
      .pipe(build({ GA_ID: '123456' }))
      .pipe(gulp.dest('dist'))
});
```

With helpers:

```javascript
var build = require('gulp-build');

var options = {
  helpers: [{
    name: 'addition',
    fn: function(a, b) { return a + b; }
  }]
};

gulp.task('build', function() {
  gulp.src('pages/*.html')
      .pipe(build({ title: 'Some page' }, options))
      .pipe(gulp.dest('dist'))
});

```

Helpers are regular Handlebars helpers or block helpers that your layout, partials, and templates can call.

For more information on Handlebars helpers, see http://handlebarsjs.com/#helpers and http://handlebarsjs.com/block_helpers.html.

With partials and a layout:

```javascript
var build = require('gulp-build');

var options = {
	partials: [{
		name: 'footer',
		tpl: '<p>Copyright 2013</p>'
	}],
	layout: '<html><body>{{> body}}</body></html>'
};

gulp.task('build', function() {
  gulp.src('pages/*.html')
      .pipe(build({ title: 'Some page' }, options))
      .pipe(gulp.dest('dist'))
});

```

If your templates want to render partials, you just reference them as: `{{> partialName}}`.

If you use a layout, you need the `{{> body}}` tag for the plugin to know where to place your content. If you omit it, your compiled file will be missing the main content!

## API

### gulp-build(data, config)

#### data
Templates vars passed down to `HandleBars` for compiling

#### config.layout
Type: `String`<br />
Default: null

#### config.partials
Type: `Array` containing `Objects`<br />
Default: []

A config object with partials would look like:

```javascript
var options = {
  partials: [
    { name: 'footer', tpl: '<p>Copyright 2014</p>' },
    { name: 'header', tpl: '<h1>The Header!</h1>' }
  ]
};
```

Your template could use those partials by using: `{{> footer}}` or `{{> header}}`

## Contributing

I'd like to see other template frameworks get integrated. Frameworks like: `ejs`, `Hogan` and `Mustache` but I might not have time to get to these soon.

If you'd like to help out, just submit a pull request. Before submitting though, be sure to:

* Update the README
* Write new tests
* Ensure previous tests don't break
* Ensure `jshint` doesn't fail
* Follow code layout/style

You can run tests and `jshint` with:

```shell
gulp lint
gulp test
```

The default `gulp` task will run both of those.

## Testing

Open a terminal in the directory containing `gulp-build` and then:

```shell
npm install
gulp
```

## The License (MIT)
Copyright (c) 2014 TJ Eastmond

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
