

var fs = require('fs');
var multiparty = require('multiparty');
var fatalError = require('./config.js').fatalError;
var recordError = require('./errors.js').recordError;
var log = require('./log.js');

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

function throwErrors(cb) {
	var res = function(err) {
		if (err)
			return fatalError(err);
		if (cb)
		{
			var args = Array.prototype.splice.call(arguments, 1);
			cb.apply(null, args);
		}
	}
	return res;
}

function retError(res, message, stackOffset) {
	var offset = 1;
	if (stackOffset !== undefined)
		offset += stackOffset;
	log.error('user error : ' + message, 'usererror', offset);
	var toSend = {status: 'error', msg: message};
	res.send(JSON.stringify(toSend));
}

function retBackError(res, err, stackOffset) {
	var offset = 1;
	if (stackOffset !== undefined)
		offset += stackOffset;
	log.error(err, 'backerror', offset);
	var toSend = {status: 'error', msg: 'unexpected back error'};
	res.send(JSON.stringify(toSend));
}

function retOk(res) {
	log.log('responded ok', 1);
	var toSend = {status: 'ok', msg: 'ok'};
	res.send(JSON.stringify(toSend));
}

function retSendObject(res, obj) {
	log.log('sending object', 1);
	res.send(JSON.stringify(obj));
}

function retSendFile(res, path, options) {
	log.log('sending file \'' + path + '\'', 1);
	res.sendFile(path, options);
}

function retErrorAndRemoveFiles(res, message, files) {
	for (var key in files) {
		removeFile(files[key].path);
	}
	retError(res, message, 1);
}

function retBackErrorAndRemoveFiles(res, message, files) {
	for (var key in files) {
		removeFile(files[key].path);
	}
	retBackError(res, message, 1);
}

function removeFile(path) {
	fs.unlink(path, function(err) { });
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

function moveFileAt(file, dirname, filename, cb) {
	fs.rename(file.path, dirname + '/' + filename, function(err) {
		if (err)
			return cb(true, err);
		cb(false, err);
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
				return retSendObject(res, {contents: toSend});
			collection.count(query, throwErrors(function(nb_docs) {
				toSend = {
					nb_pages: Math.floor(nb_docs / pageSize) + 1,
					tot_nb_contents: nb_docs,
					contents: toSend
				};
				retSendObject(res, toSend);
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

function parseQueryWithFiles(req, cb) {
	var form = new multiparty.Form();
	form.parse(req, function(err, params, files) {
		if (err)
			return cb('unexpected error', {}, {});
		for (var field in params) {
			params[field] = JSON.parse(params[field][0]);
		}
		for (var key in files) {
			files[key] = files[key][0];
		}
		cb(null, params, files);
	});
}

module.exports = {
	paramsPresent:				paramsPresent,
	retError:					retError,
	retBackError:				retBackError,
	retOk:						retOk,
	retSendObject:				retSendObject,
	retSendFile:				retSendFile,
	retErrorAndRemoveFiles:		retErrorAndRemoveFiles,
	retBackErrorAndRemoveFiles:	retBackErrorAndRemoveFiles,
	removeFile:					removeFile,
	throwErrors:				throwErrors,
	generateUniqueKey:			generateUniqueKey,
	allExistingIds:				allExistingIds,
	moveFileAt:					moveFileAt,
	getPage:					getPage,
	makeListToFrontFormat:		makeListToFrontFormat,
	parseQueryWithFiles:		parseQueryWithFiles
}