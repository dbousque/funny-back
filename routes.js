

var mongoose = require('mongoose');
var app = require('./app.js');
var VideoCategory = require('./models/videoCategory.js');
var ArticleCategory = require('./models/articleCategory.js');

var categoryTypes = {
	video:		VideoCategory,
	article:	ArticleCategory
};

function retError(res, msg) {
	console.log('user error : ' + msg);
	res.send(msg);
}

app.get('/categories', function(req, res)
{
	if (!('type' in req.query))
		return retError(res, 'type parameter missing');
	if (!(req.query.type in categoryTypes))
		return retError(res, 'unknown type');
	var categoryType = categoryTypes[req.query.type];
	categoryType.find({}, function(err, categories) {
		if (err)
			throw err;
		res.send(JSON.stringify(categories));
	});
});

app.get('/add_category', function(req, res) {
	if (!('type' in req.query))
		return retError(res, 'type parameter missing');
	if (!('name' in req.query))
		return retError(res, 'name parameter missing');
	if (!(req.query.type in categoryTypes))
		return retError(res, 'unknown type');
	var categoryType = categoryTypes[req.query.type];
	var newCategory = new categoryType({
		name:	req.query.name
	});
	newCategory.save(function(err) {
		if (err)
			throw err;
	});
	res.send('ok');
});