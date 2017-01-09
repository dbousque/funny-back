

var recordError = require('./errors.js').recordError;

function makeDate() {
	var lenTwo = function(e) {
		if (e < 10)
			e = '0' + e;
		return e;
	};
	var res = '';
	var date = new Date();
	res += lenTwo(date.getUTCDate()) + '/';
	res += lenTwo(date.getUTCMonth() + 1) + '/';
	res += lenTwo(date.getUTCFullYear()) + ' ';
	res += lenTwo(date.getUTCHours()) + ':';
	res += lenTwo(date.getUTCMinutes()) + ':';
	res += lenTwo(date.getUTCSeconds());
	return res;
}

function getRaw(msg, type, stackOffset) {
	var minStartLength = 110;
	var offset = 3;
	if (stackOffset !== undefined)
		offset += stackOffset;
	var logLineDetails = ((new Error().stack).split("at ")[offset]).trim();
	if (type === false)
		return logLineDetails + ' | ' + msg;
	var res = type + ' | ';
	res += makeDate() + ' | ';
	res += logLineDetails + '   ';
	if (res.length < minStartLength)
		res += Array(minStartLength - res.length + 1).join(' ');
	res += msg;
	return res;
}

function log(msg, stackOffset) {
	msg = getRaw(msg, 'LOG  ', stackOffset);
	console.log(msg);
}

function error(err, errorType, stackOffset, cb) {
	var toPrintMsg = err.toString();
	toPrintMsg = getRaw(toPrintMsg, 'ERROR', stackOffset);
	console.log(toPrintMsg);
	var toRecordMsg = err.toString();
	if (err.stack !== undefined)
		toRecordMsg = err.stack;
	toRecordMsg = getRaw(toRecordMsg, false, stackOffset);
	recordError(toRecordMsg, errorType, cb);
}

module.exports = {
	log:	log,
	error:	error
}