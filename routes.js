

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var app = require('./app.js');
var VideoCategory = require('./models/videoCategory.js');
var ArticleCategory = require('./models/articleCategory.js');
var Video = require('./models/video.js');
var Article = require('./models/article.js');

var categoryTypes = {
	video:		{cat: VideoCategory, content: Video},
	article:	{cat: ArticleCategory, content: Article}
};

function retError(res, message) {
	console.log('user error : ' + message);
	var toSend = {status: 'error', msg: message};
	res.send(JSON.stringify(toSend));
}

function retOk(res, message) {
	var toSend = {status: 'ok', msg: 'ok'};
	res.send(JSON.stringify(toSend));
}

function throwErrors(cb) {
	var res = function(err) {
		if (err)
			throw err;
		if (cb)
		{
			var args = Array.prototype.splice.call(arguments, 1);
			cb.apply(null, args);
		}
	}
	return res;
}

app.get('/categories', function(req, res) {
	var params = req.query;
	if (!('type' in params))
		return retError(res, 'type parameter missing');
	if (!(params.type in categoryTypes))
		return retError(res, 'unknown type');
	var categoryType = categoryTypes[params.type].cat;
	categoryType.find({}, throwErrors(function(categories) {
		var toSend = categories.map(categoryType.toFrontFormat);
		res.send(JSON.stringify(toSend));
	}));
});

app.post('/add_category', function(req, res) {
	var params = req.body;
	if (!('type' in params))
		return retError(res, 'type parameter missing');
	if (!('name' in params))
		return retError(res, 'name parameter missing');
	if (!(params.type in categoryTypes))
		return retError(res, 'unknown type');
	var categoryType = categoryTypes[params.type].cat;
	var newCategory = new categoryType({
		name:	params.name
	});
	newCategory.save(throwErrors);
	retOk(res);
});

app.post('/change_category_name', function(req, res) {
	var params = req.body;
	if (!('id' in params))
		return retError(res, 'id parameter missing');
	if (!('newName' in params))
		return retError(res, 'newName parameter missing');
	if (!('type' in params))
		return retError(res, 'type parameter missing');
	var categoryType = categoryTypes[params.type].cat;
	categoryType.findOne(
		{
			_id: ObjectId(params.id)
		}, throwErrors(function(category) {
			category.name = params.newName;
			category.save(throwErrors);
		})
	);
});