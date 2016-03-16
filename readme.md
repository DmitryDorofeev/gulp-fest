# gulp-fest

Gulp plugin for compiling [fest](https://github.com/mailru/fest) templates

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
			data: {
				foo: 'bar'
			},
			ext: '.htm'
		}))
		.pipe(gulp.dest('dist'));
});
```


## API

### fest([options])

### fest.render([options])
