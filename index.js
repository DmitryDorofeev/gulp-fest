'use strict';

var PLUGIN_NAME = 'gulp-fest';

var assign = require('lodash.assign');
var fest = require('fest');
var fs = require('fs');
var gutil = require('gulp-util');
var path = require('path');
var through = require('through2');


var plugin = function (options) {
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
			var compiled = fest.compile(
				{path: file.path, contents: String(file.contents)},
				assign({}, opts.compile),
				name
			);

			file.contents = new Buffer(compiled);
			file.path = gutil.replaceExtension(file.path, opts.ext);
		} catch (e) {
			return cb(new gutil.PluginError(PLUGIN_NAME, 'Compiling error:\n' + e.toString()));
		}

		cb(null, file);
	}

	return through.obj(transform);
};

plugin.render = function (data, options) {
	var opts = assign({
		ext: '.html'
	}, options);

	function render (file, enc, cb) {
		if (typeof data == 'string') {
			try {
				data = JSON.parse(fs.readFileSync(data));
			} catch (e) {
				return cb(new gutil.PluginError(PLUGIN_NAME, 'Data file parse error', {showStack: true}));
			}
		} else if (typeof data != 'object') {
			return cb(new gutil.PluginError(PLUGIN_NAME, 'Bad data parameter', {showStack: true}));
		}

		try {
			var template = (new Function('return ' + file.contents.toString()))();
			file.contents = new Buffer(template(data));
			file.path = gutil.replaceExtension(file.path, opts.ext);
		} catch (e) {
			return cb(new gutil.PluginError(PLUGIN_NAME, 'Render error:\n' + e.toString()));
		}

		cb(null, file);
	}

	return through.obj(render);
};

module.exports = plugin;
