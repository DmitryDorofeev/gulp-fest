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
			String(file.contents).should.equal(
				fs.readFileSync('test/expected/01-default/foo.js', 'utf8')
			);
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
			should.exist(file);
			should.exist(file.contents);
			String(file.contents).should.equal(
				fs.readFileSync('test/expected/02-beautify/foo.js', 'utf8')
			);
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
			should.exist(file);
			should.exist(file.contents);
			String(file.contents).should.equal(
				fs.readFileSync('test/expected/03-debug/foo.js', 'utf8')
			);
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
			should.exist(file);
			should.exist(file.contents);
			String(file.contents).should.equal(
				fs.readFileSync('test/expected/04-name-true/foo.js', 'utf8')
			);
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
			should.exist(file);
			should.exist(file.contents);
			String(file.contents).should.equal(
				fs.readFileSync('test/expected/05-custom-name/foo.js', 'utf8')
			);
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
			should.exist(file);
			should.exist(file.contents);
			String(file.contents).should.equal(
				fs.readFileSync('test/expected/06-custom-extension/foo.tmpl.js', 'utf8')
			);
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
			should.exist(file);
			should.exist(file.contents);
			String(file.contents).should.equal(
				fs.readFileSync('test/expected/07-render/baz.html', 'utf8')
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
			should.exist(file);
			should.exist(file.contents);
			String(file.contents).should.equal(
				fs.readFileSync('test/expected/08-render-using-json/baz.htm', 'utf8')
			);
			path.extname(file.path) == '.htm';
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
