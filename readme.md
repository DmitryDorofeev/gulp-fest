# gulp-fest [![Build Status](https://travis-ci.org/DmitryDorofeev/gulp-fest.svg?branch=master)](https://travis-ci.org/DmitryDorofeev/gulp-fest)

Gulp plugin for compiling and rendering [fest](https://github.com/mailru/fest) templates

## Install

```
$ npm install --save-dev gulp-fest
```


## Usage

```js
var fest = require('gulp-fest');
var gulp = require('gulp');

gulp.task('default', function () {
	return gulp.src('src/*.xml')
		.pipe(fest())
		.pipe(gulp.dest('.tmp'))
		.pipe(fest.render({
			foo: 'bar'
		}, {
			ext: '.htm'
		}))
		.pipe(gulp.dest('dist'));
});
```


## API

### fest([options])

#### options

Type: `object`
Default:
```js
{
	require: 'fest',	// path to fest module
	name: undefined,	// name of result function,
						// if `true` it is a stem of the template,
						// if `string` it is a name
						// if undefined it will result to anonymous function
	ext: '.js',			// extension of result file
	compile: {			// fest.compile options
		beautify: false,
		debug: false,
		std: false
	}
}
```

### fest.render(data [, options])

#### data

Type: `object|string`
JSON object or path to JSON file

#### options

Type: `object`

Default:
```js
{
	ext: '.html',			// extension of result file
}
```
