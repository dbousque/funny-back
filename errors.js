

var AppError = require('./models/appError.js');

function recordError(msg, type, cb) {
	var error = {
		type:	type,
		msg:	msg,
		time:	Date.now()
	};
	error = new AppError(error);
	error.save(function(_e1, _e2) {
		if (cb !== undefined)
			cb();
	});
}

module.exports = {
	recordError:	recordError
}