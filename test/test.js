/* global describe, it */
var build = require('../index.js');
var should = require('should');
var File = require('gulp-util').File;
var Buffer = require('buffer').Buffer;

var getFile = function(contents, expected) {
	return {
		file: new File({
			cwd: '/home/tje',
			base: '/home/tje/test',
			path: '/home/tje/test/name.html',
			contents: contents || new Buffer('<p>And her name was, {{ name }}.</p>')
		}),
		expected: expected || '<p>And her name was, Melissa.</p>'
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
			Buffer.isBuffer(newFile.contents).should.be.true;
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
			Buffer.isBuffer(newFile.contents).should.be.true;
			newFile.contents.toString().should.equal(fakeFile.expected);
			done();
		});

		stream.write(fakeFile.file);
	});

	it('should compile with partials and a layout', function(done) {
		var stream = build({ name: 'Jack' }, {
			partials: [{ name: 'header', tpl: '<h1>The Tests</h1>' }],
			layout: '<html><body>{{> body}}</body></html>'
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
			Buffer.isBuffer(newFile.contents).should.be.true;
			newFile.contents.toString().should.equal(fakeFile.expected);
			done();
		});

		stream.write(fakeFile.file);
	});

	it('should ignore the layout because of missing {{> body}} tag', function(done) {
		var stream = build({ name: 'Jack' }, { layout: '<html><body></body></html>' });
		var fakeFile = getFile(new Buffer('<p>Just some tests, {{name}}!</p>'), '<p>Just some tests, Jack!</p>');

		stream.on('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.path);
			should.exist(newFile.relative);
			should.exist(newFile.contents);
			Buffer.isBuffer(newFile.contents).should.be.true;
			newFile.contents.toString().should.equal(fakeFile.expected);
			done();
		});

		stream.write(fakeFile.file);
	});

	it('should compile with helpers', function(done) {
		var stream = build({ name: 'Jack' }, {
			helpers: [
				{
					name: 'add',
					fn: function (a, b) {return a + b;}
				}
			]
		});

		var fakeFile = getFile(
			new Buffer('<p>1 + 2 is definitely equal to {{add 1 2}}.</p>'),
			'<p>1 + 2 is definitely equal to 3.</p>'
		);

		stream.on('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.path);
			should.exist(newFile.relative);
			should.exist(newFile.contents);
			Buffer.isBuffer(newFile.contents).should.be.true;
			newFile.contents.toString().should.equal(fakeFile.expected);
			done();
		});

		stream.write(fakeFile.file);
	});

	it('should compile with partials that use the provided helpers', function (done) {
		var stream = build({ name: 'Jack' }, {
			helpers: [
				{
					name: 'add',
					fn: function (a, b) {return a + b;}
				}
			],
			partials: [
				{
					name: 'addition',
					tpl: '<p>1 + 2 is definitely equal to {{add 1 2}}.</p>'
				}
			]
		});

		var fakeFile = getFile(
			new Buffer('<div>Fact: {{> addition}}</div>'),
			'<div>Fact: <p>1 + 2 is definitely equal to 3.</p></div>'
		);

		stream.on('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.path);
			should.exist(newFile.relative);
			should.exist(newFile.contents);
			Buffer.isBuffer(newFile.contents).should.be.true;
			newFile.contents.toString().should.equal(fakeFile.expected);
			done();
		});

		stream.write(fakeFile.file);
	});

	it('should compile with a layout that use the provided helpers', function(done) {
		var stream = build({ name: 'Jack' }, {
			layout: '<div><p>We know that 1 + 2 is {{add 1 2}}.</p>{{> body}}</div>',
			helpers: [
				{
					name: 'add',
					fn: function (a, b) {return a + b;}
				}
			]
		});

		var fakeFile = getFile(
			new Buffer('<p>But what is 1 - 2?</p>'),
			'<div><p>We know that 1 + 2 is 3.</p><p>But what is 1 - 2?</p></div>'
		);

		stream.on('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.path);
			should.exist(newFile.relative);
			should.exist(newFile.contents);
			Buffer.isBuffer(newFile.contents).should.be.true;
			newFile.contents.toString().should.equal(fakeFile.expected);
			done();
		});

		stream.write(fakeFile.file);
	});

	it('should compile with a layout and partials that use the provided helpers', function(done) {
		var stream = build({ name: 'Jack' }, {
			layout: '<div><p>We know that 1 + 2 is {{add 1 2}}.</p>{{> body}}</div>',
			helpers: [
				{
					name: 'add',
					fn: function (a, b) {return a + b;}
				},
				{
					name: 'subtract',
					fn: function (a, b) {return a - b;}
				}
			],
			partials: [
				{
					name: 'subtraction',
					tpl: '<p>Well, it turns out that 1 - 2 is {{subtract 1 2}}.</p>'
				}
			]
		});

		var fakeFile = getFile(
			new Buffer('<p>But what is 1 - 2?</p>{{> subtraction}}'),
			'<div><p>We know that 1 + 2 is 3.</p><p>But what is 1 - 2?</p>' +
			'<p>Well, it turns out that 1 - 2 is -1.</p></div>'
		);

		stream.on('data', function(newFile) {
			should.exist(newFile);
			should.exist(newFile.path);
			should.exist(newFile.relative);
			should.exist(newFile.contents);
			Buffer.isBuffer(newFile.contents).should.be.true;
			newFile.contents.toString().should.equal(fakeFile.expected);
			done();
		});

		stream.write(fakeFile.file);
	});
});
