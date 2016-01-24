'use strict';

var PLUGIN_NAME = 'gulp-fest';

var fest = require('fest');
var through = require('through2');
var gutil = require('gulp-util');
var assign = require('lodash.assign');
var path = require('path');


module.exports = function (options) {
	var opts = assign({}, options);

	function transform (file, enc, cb) {
		if (file.isStream()) {
			return cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
		}

		if (file.isNull()) {
			return cb(null, file);
		}

		if (path.extname(file.path) === '.js') {
			return cb(null, file);
		}

		var compiled = fest.compile(file.path, opts);
		replaceExtension(compiled, file, cb);
	}

	function replaceExtension (output, file, cb) {
		file.path = file.path.replace('.xml', '.js');
		file.contents = new Buffer(output);
		cb(null, file);
	}

	return through.obj(transform);
};
