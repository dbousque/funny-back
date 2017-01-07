

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

function getPage(res, collection, query, page, sort, options) {
	var pageSize = 25;
	if (page <= 0)
		return retError(res, 'invalid page number');
	var skip = (page - 1) * pageSize;
	var q = collection.find(query).sort(sort).skip(skip).limit(pageSize);
	q.exec(throwErrors(function(docs) {
		makeListToFrontFormat(docs, collection, options, function(err, toSend) {
			if (err)
				return retError(res, err);
			if (!options.nb_pages)
				return res.send(JSON.stringify({contents: toSend}));
			collection.count(query, throwErrors(function(nb_docs) {
				toSend = {
					nb_pages: Math.floor(nb_docs / pageSize) + 1,
					tot_nb_contents: nb_docs,
					contents: toSend
				};
				res.send(JSON.stringify(toSend));
			}));
		});
	}));
}

function _makeListToFrontFormat(list, ind, collection, options, acc, cb) {
	if (ind == list.length)
		return cb(null, acc);
	collection.toFrontFormat(list[ind], options, function(err, obj) {
		if (err)
			return cb(err, []);
		acc.push(obj);
		_makeListToFrontFormat(list, ind + 1, collection, options, acc, cb);
	});
}

function makeListToFrontFormat(list, collection, options, cb) {
	_makeListToFrontFormat(list, 0, collection, options, [], cb);
}

module.exports = {
	paramsPresent:			paramsPresent,
	retError:				retError,
	retOk:					retOk,
	throwErrors:			throwErrors,
	generateUniqueKey:		generateUniqueKey,
	allExistingIds:			allExistingIds,
	saveFileAt:				saveFileAt,
	getPage:				getPage,
	makeListToFrontFormat:	makeListToFrontFormat
}