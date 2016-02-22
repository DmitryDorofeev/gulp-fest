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
			// stem of the file
			name = path.basename(file.path, path.extname(file.path));
		}

		try {
			var compiled = fest.compile(file.path, assign({}, opts.compile), name);
			file.contents = new Buffer(compiled);
			file.path = gutil.replaceExtension(file.path, opts.ext);
		} catch (e) {
			return cb(new gutil.PluginError(PLUGIN_NAME, 'Compiling error', {showStack: true}));
		}

		cb(null, file);
	}

	return through.obj(transform);
};
