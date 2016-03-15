'use strict';

var PLUGIN_NAME = 'gulp-fest';

var fest = require('fest');
var through = require('through2');
var gutil = require('gulp-util');
var assign = require('lodash.assign');
var path = require('path');


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

	if (typeof opts.data == 'string') {
		try {
			fs.accessSync(opts.data, fs.F_OK);

			try {
				jsonData = JSON.parse(fs.readFileSync(opts.data) + '');
			} catch (e) {
				return cb(new gutil.PluginError(PLUGIN_NAME, 'Data file parse error', {showStack: true}));
			}
		} catch (e) {
			return cb(new gutil.PluginError(PLUGIN_NAME, 'Data file not found', {showStack: true}));
		}
	} else if (typeof opts.data == 'object') {
		var jsonData = opts.data;
	} else {
		return cb(new gutil.PluginError(PLUGIN_NAME, 'Bad data param', {showStack: true}));
	}

	function render (file, enc, cb) {
		try {
			var rendered = fest.render(file.path, jsonData, assign({}, opts.render)) + '\n';
			file.contents = rendered;
			file.path = gutil.replaceExtension(file.path, opts.ext);
		} catch (e) {
			return cb(new gutil.PluginError(PLUGIN_NAME, 'Render error', {showStack: true}));
		}

		cb(null, file);
	}

	return through.obj(render);
};

module.exports = plugin;
