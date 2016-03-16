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

plugin.render = function (options) {
	var opts = assign({
		data: {},
		ext: '.html'
	}, options);

	function render (file, enc, cb) {
		var json = {};

		if (typeof opts.data == 'string') {
			try {
				json = JSON.parse(fs.readFileSync(opts.data));
			} catch (e) {
				return cb(new gutil.PluginError(PLUGIN_NAME, 'Data file parse error', {showStack: true}));
			}
		} else if (typeof opts.data == 'object') {
			json = opts.data;
		} else {
			return cb(new gutil.PluginError(PLUGIN_NAME, 'Bad data param', {showStack: true}));
		}

		try {
			var template = (new Function('return ' + file.contents.toString()))();
			file.contents = new Buffer(template(json));
			file.path = gutil.replaceExtension(file.path, opts.ext);
		} catch (e) {
			return cb(new gutil.PluginError(PLUGIN_NAME, 'Render error', {showStack: true}));
		}

		cb(null, file);
	}

	return through.obj(render);
};

module.exports = plugin;
