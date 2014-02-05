var gutil = require('gulp-util');
var through = require('through2');
var _ = require('underscore');

module.exports = function(data, config) {
	var options = _.extend({
		interpolate: /\{\{(.+?)\}\}/g
	}, config);

	_.templateSettings = {
		interpolate: options.interpolate
	};

	var build = function(file, encoding, callback) {
		file.contents = new Buffer(_.template(file.contents.toString())(data || {}));
		return callback(null, file);
	};

	return through.obj(build);
};
