'use strict';

var fs = require('fs');
var should = require('should');
var fest = require('../');
var gutil = require('gulp-util');

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
});
