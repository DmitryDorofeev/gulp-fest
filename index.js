var fest = require('fest');
var through = require('through2');

var festTask = function () {
	function makefest(file, opts, cb) {
		var compiled = fest.compile(file.path, {beautify: false});
		if (opts && opts.amd) {
			compiled = 'define(function () { return ' + compiled + '; });';
		}
		handleOutput(compiled, file, cb);
	}

	function handleOutput(output, file, cb) {
		file.path = file.path.replace('.xml', '.js');
		file.contents = new Buffer(output);
		cb(null, file);
	}

	return through.obj(makefest);
};

module.exports = festTask;
