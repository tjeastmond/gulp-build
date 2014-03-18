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
	it('should compile the template with one variable', function(done) {
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

	it('should compile with partials', function(done) {
		var stream = build({ name: 'Figs' }, { partials: [{ name: 'header', tpl: '<h1>Super Bad Ass Cat</h1>' }]});
		var fakeFile = getFile(
			new Buffer('{{> header}}<p>The most bad ass cat ever is easily, {{name}}.</p>'),
			'<h1>Super Bad Ass Cat</h1><p>The most bad ass cat ever is easily, Figs.</p>'
		);

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

	it('should compile with partials and a layout', function(done) {
		var stream = build({ name: 'Jack' }, {
			partials: [{ name: 'header', tpl: '<h1>The Tests</h1>' }],
			layout: "<html><body>{{> body}}</body></html>"
		});

		var fakeFile = getFile(
			new Buffer('{{> header}}<p>Just some tests, {{name}}!</p>'),
			'<html><body><h1>The Tests</h1><p>Just some tests, Jack!</p></body></html>'
		);

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

	it('should ignore the layout because of missing {{> body}} tag', function(done) {
		var stream = build({ name: 'Jack' }, { layout: "<html><body></body></html>" });
		var fakeFile = getFile(new Buffer('<p>Just some tests, {{name}}!</p>'), '<p>Just some tests, Jack!</p>');

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
