'use strict';

var PLUGIN_NAME = 'gulp-fest';

var fest = require('fest');
var through = require('through2');
var gutil = require('gulp-util');
var assign = require('lodash.assign');
var path = require('path');


module.exports = function (options) {
	var opts = assign({
		require: 'fest',
		ext: '.js'
	}, options);

	function transform (file, enc, cb) {
		if (file.isStream()) {
			return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
		}

		if (file.isNull()) {
			return cb(null, file);
		}

		var name = opts.name;

		if (name === true) {
			name = file.stem;
		}

		var compiled = fest.compile(file.path, assign({}, opts.compile), name);
		replaceExtension(compiled, file, cb);
	}

	function replaceExtension (output, file, cb) {
		file.extname = opts.ext;
		file.contents = new Buffer(output);
		cb(null, file);
	}

	return through.obj(transform);
};
