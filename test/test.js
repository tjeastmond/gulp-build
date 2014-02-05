var build = require('../index.js');
var should = require('should');
var path = require('path');
var File = require('gulp-util').File;
var Buffer = require('buffer').Buffer;

var getFile = function(contents, expected) {
	return {
		file: new File({
			cwd: '/home/tje',
			base: '/home/tje/test',
			path: '/home/tje/test/name.html',
			contents: contents || new Buffer("<p>And her name was, {{ name }}.</p>")
		}),
		expected: expected || "<p>And her name was, Melissa.</p>"
	};
};

describe('gulp-build', function() {
	it('should compile the template', function(done) {
		var stream = build({ name: 'Melissa' }),
			fakeFile = getFile();

		stream.on('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.path);
			should.exist(newFile.relative);
			should.exist(newFile.contents);
			Buffer.isBuffer(newFile.contents).should.be.true
			newFile.contents.toString().should.equal(fakeFile.expected);
			done();
		});

		stream.write(fakeFile.file);
	});

	it('should let me change the delimiters', function(done) {
		var stream = build({ name: 'Melissa' }, { interpolate: /<%=([\s\S]+?)%>/g }),
			fakeFile = getFile(new Buffer("<p>And her name was, <%= name %>.</p>"));

		stream.on('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.path);
			should.exist(newFile.relative);
			should.exist(newFile.contents);
			Buffer.isBuffer(newFile.contents).should.be.true
			newFile.contents.toString().should.equal(fakeFile.expected);
			done();
		});

		stream.write(fakeFile.file);
	});

});
