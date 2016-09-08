'use strict';

var fest = require('../');
var fs = require('fs');
var gutil = require('gulp-util');
var path = require('path');
var should = require('should');

require('mocha');

describe('gulp-fest', function() {
	it('should compile XML to JS', function (done) {
		var stream = fest();

		stream.on('data', function (file) {
			should.exist(file);
			should.exist(file.contents);
			should((file.contents + '').split('\n').length).equal(30);
			done();
		});

		stream.write(new gutil.File({
			base: 'test/fixtures',
			cwd: 'test/',
			path: 'test/fixtures/foo.xml',
			contents: fs.readFileSync('test/fixtures/foo.xml')
		}));
	});


	it('should compile to readable result also', function (done) {
		var stream = fest({
			compile: {
				beautify: true
			}
		});

		stream.on('data', function (file) {
			should((file.contents + '').split('\n').length > 30).be.ok();
			done();
		});

		stream.write(new gutil.File({
			base: 'test/fixtures',
			cwd: 'test/',
			path: 'test/fixtures/foo.xml',
			contents: fs.readFileSync('test/fixtures/foo.xml')
		}));
	});


	it('should have debug option', function (done) {
		var stream = fest({
			compile: {
				beautify: true,
				debug: true
			}
		});

		stream.on('data', function (file) {
			[
				'__fest_debug_file = "test\/fixtures\/foo.xml";',
				'__fest_debug_line = "0";',
				'__fest_debug_block = "fest:template";',
				'__fest_debug_file = "test\/fixtures\/foo.xml";',
				'__fest_debug_line = "1";',
				'__fest_debug_block = "h1";'
			].forEach(str => {
				should((file.contents + '').indexOf(str)).be.ok();
			});

			done();
		});

		stream.write(new gutil.File({
			base: 'test/fixtures',
			cwd: 'test/',
			path: 'test/fixtures/foo.xml',
			contents: fs.readFileSync('test/fixtures/foo.xml')
		}));
	});


	it('should create function declaration with name of file stem', function (done) {
		var stream = fest({
			name: true
		});

		stream.on('data', function (file) {
			var start = 'var foo = function (__fest_context)';
			String(file.contents).substr(0, start.length).should.equal(start);
			done();
		});

		stream.write(new gutil.File({
			base: 'test/fixtures',
			cwd: 'test/',
			path: 'test/fixtures/foo.xml',
			contents: fs.readFileSync('test/fixtures/foo.xml')
		}));
	});


	it('should create function declaration with \'name\' param', function (done) {
		var stream = fest({
			name: 'someFuncName'
		});

		stream.on('data', function (file) {
			var start = 'var someFuncName = function (__fest_context)';
			String(file.contents).substr(0, start.length).should.equal(start);
			done();
		});

		stream.write(new gutil.File({
			base: 'test/fixtures',
			cwd: 'test/',
			path: 'test/fixtures/foo.xml',
			contents: fs.readFileSync('test/fixtures/foo.xml')
		}));
	});


	it('should create custom extension', function (done) {
		var stream = fest({
			ext: 'tmpl.js'
		});

		stream.on('data', function (file) {
			file.path.should.equal('test/fixtures/footmpl.js');
			done();
		});

		stream.write(new gutil.File({
			base: 'test/fixtures',
			cwd: 'test/',
			path: 'test/fixtures/foo.xml',
			contents: fs.readFileSync('test/fixtures/foo.xml')
		}));
	});

	it('should render template to HTML', function (done) {
		var stream = fest.render({
			name: 'Deerhunter',
			subject: 'dreams'
		});

		stream.on('data', function (file) {
			String(file.contents).should.equal(
				fs.readFileSync('test/expected/render/baz.html', 'utf8')
			);
			done();
		});

		stream.write(new gutil.File({
			base: 'test/fixtures',
			cwd: 'test/',
			path: 'test/fixtures/baz.js',
			contents: fs.readFileSync('test/fixtures/baz.js')
		}));
	});

	it('should read JSON from file while rendering and use custom extension also', function (done) {
		var stream = fest.render('test/fixtures/baz.json', {
			ext: '.htm'
		});

		stream.on('data', function (file) {
			String(file.contents).should.equal(
				fs.readFileSync('test/expected/render-using-json/baz.htm', 'utf8')
			);
			path.extname(file.path).should.equal('.htm');
			done();
		});

		stream.write(new gutil.File({
			base: 'test/fixtures',
			cwd: 'test/',
			path: 'test/fixtures/baz.js',
			contents: fs.readFileSync('test/fixtures/baz.js')
		}));
	});
});
