

var fatalError = require('./config.js').fatalError;

function paramsPresent(res, params, expected)
{
	for (var i = 0; i < expected.length; i++) {
		if (!(expected[i] in params))
		{
			retError(res, expected[i] + ' parameter missing');
			return (false);
		}
	}
	return (true);
}

function retError(res, message) {
	console.log('user error : ' + message);
	var toSend = {status: 'error', msg: message};
	res.send(JSON.stringify(toSend));
}

function retOk(res) {
	var toSend = {status: 'ok', msg: 'ok'};
	res.send(JSON.stringify(toSend));
}

function throwErrors(cb) {
	var res = function(err) {
		if (err)
			fatalError(err);
		if (cb)
		{
			var args = Array.prototype.splice.call(arguments, 1);
			cb.apply(null, args);
		}
	}
	return res;
}

function allExistingIds(collection, ids, cb) {
	collection.count(
		{
			_id: { $in: ids}
		}, throwErrors(function(count) {
			cb(count == ids.length);
		})
	);
}

function generateUniqueKey(collection, key_loc, cb) {
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var key = "";
	for (var i = 0; i < 10; i++) {
		key += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	collection.count({key_loc: key}, throwErrors(function(count) {
		if (count != 0)
			return generateUniqueKey(collection, key_loc, cb);
		cb(key);
	}));
}

function saveFileAt(req, dirname, filename, cb) {
	var form = new formidable.IncomingForm();
	form.uploadDir = __dirname + dirname;
	form.parse(req, function(err, fields, files) {
		if (err)
			cb(true, err);
	});
	form.on('fileBegin', function(name, file) {
		file.path = form.uploadDir + '/' + filename;
	});
	form.on('end', function() {
		cb(false, null);
	});
}

function getPage(res, collection, page, sort) {
	var pageSize = 25;
	if (page <= 0)
		return retError(res, 'invalid page number');
	var skip = (page - 1) * pageSize;
	//console.log(sort);
	var query = collection.find({}).sort({sort: -1}).skip(skip).limit(pageSize);
	query.exec(throwErrors(function(docs) {
		var toSend = docs.map(collection.toFrontFormat);
		res.send(JSON.stringify(toSend));
	}));
}

module.exports = {
	paramsPresent:		paramsPresent,
	retError:			retError,
	retOk:				retOk,
	throwErrors:		throwErrors,
	generateUniqueKey:	generateUniqueKey,
	allExistingIds:		allExistingIds,
	saveFileAt:			saveFileAt,
	getPage:			getPage
}