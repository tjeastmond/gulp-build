var through = require('through2');
var _ = require('underscore');
var hbs = require('handlebars');

module.exports = function(data, config) {
	var options = _.extend({
		layout: null,
		partials: [],
		helpers: []
	}, config);

	data = data || {};

	var build = function(file, encoding, callback) {
		var fileContents = file.contents.toString();
		var template = '';

		if (options.helpers.length > 0) {
			_.each(options.helpers, function(helper) {
				hbs.registerHelper(helper.name, helper.fn);
			});
		}

		if (options.partials.length > 0) {
			_.each(options.partials, function(partial) {
				hbs.registerPartial(partial.name, partial.tpl);
			});
		}

		if (_.isString(options.layout) && options.layout.indexOf('{{> body') !== -1) {
			hbs.registerPartial('body', fileContents);
			template = hbs.compile(options.layout);
		} else {
			template = hbs.compile(fileContents);
		}

		file.contents = new Buffer(template(data));

		return callback(null, file);
	};

	return through.obj(build);
};

module.exports.hbs = hbs;
