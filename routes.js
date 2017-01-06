

var mongoose = require('mongoose');
var app = require('./app.js');
var contentTypes = require('./config.js').contentTypes;
var category = require('./category.js');
var video = require('./video.js');
var article = require('./article.js');
var channel = require('./channel.js');
var Video = require('./models/video.js');
var Article = require('./models/article.js');
var Channel = require('./models/channel.js');
var utils = require('./utils.js');

var paramsPresent = utils.paramsPresent;
var retError = utils.retError;
var getPage = utils.getPage;


function getContentPage(res, params, collection, possibleSorts) {
	if (!paramsPresent(res, params, ['page']))
		return ;
	params.page = parseInt(params.page, 10);
	if (isNaN(params.page))
		return retError(res, 'invalid int');
	var sort = '_id';
	if ('sort' in params)
	{
		if (!(params.sort in possibleSorts))
			return retError(res, 'invalid sort');
		sort = possibleSorts[params.sort];
	}
	getPage(res, collection, params.page, sort);
}


/* Categories */

app.get('/categories', function(req, res) {
	var params = req.query;
	if (!paramsPresent(res, params, ['type']))
		return ;
	category.getCategories(res, params.type);
});

app.post('/add_category', function(req, res) {
	var params = req.body;
	if (!paramsPresent(res, params, ['type', 'name']))
		return ;
	category.addCategory(res, params.type, params.name);
});

app.get('/remove_category', function(req, res) {
	var params = req.query;
	if (!paramsPresent(res, params, ['id', 'type']))
		return ;
	category.removeCategory(res, params.type, params.id);
});

app.post('/change_category_name', function(req, res) {
	var params = req.body;
	if (!paramsPresent(res, params, ['id', 'type', 'newName']))
		return ;
	category.changeCategoryName(res, params.type, params.id, params.newName);
});


/* Videos */

app.get('/video', function(req, res) {
	var params = req.query;
	if (!paramsPresent(res, params, ['k']))
		return ;
	video.sendVideo(res, params.k);
})

app.get('/videos', function(req, res) {
	var params = req.query;
	var possibleSorts = {
		date:	{'_id': -1},
		name:	{'content.name': 1},
		author:	{'content.author': 1}
	};
	getContentPage(res, params, Video, possibleSorts);
});

app.post('/add_video', function(req, res) {
	var params = req.body;
	var fields = ['name', 'author', 'description', 'categories', 'keywords', 'files[]'];
	if (!paramsPresent(res, params, fields))
		return ;
	video.addVideo(req, res, params);
});

app.get('/remove_video', function(req, res) {
	var params = req.query;
	if (!paramsPresent(res, params, ['id']))
		return ;
	video.removeVideo(res, params.id);
});

app.get('/videos/find_by_category', function(req, res) {
	var params = req.query;
	if (!paramsPresent(res, params, ['category']))
		return ;
	video.findByCategory(res, params.category);
});


/* Articles */

app.get('/articles', function(req, res) {
	var params = req.query;
	var possibleSorts = {
		date:	{'_id': -1},
		name:	{'content.name': 1},
		author:	{'content.author': 1}
	};
	getContentPage(res, params, Article, possibleSorts);
});

app.post('/add_article', function(req, res) {
	var params = req.body;
	var fields = ['name', 'author', 'description', 'categories', 'keywords', 'textContent'];
	if (!paramsPresent(res, params, fields))
		return ;
	article.addArticle(res, params);
});

app.get('/remove_article', function(req, res) {
	var params = req.query;
	if (!paramsPresent(res, params, ['id']))
		return ;
	article.removeArticle(res, params.id);
});

app.get('/articles/find_by_category', function(req, res) {
	var params = req.query;
	if (!paramsPresent(res, params, ['category']))
		return ;
	article.findByCategory(res, params.category);
});


/* Channels */

app.get('/channels', function(req, res) {
	var params = req.query;
	var possibleSorts = {
		date:	{'_id': -1},
		name:	{'name': 1},
	};
	getContentPage(res, params, Article, possibleSorts);
});

app.post('/add_channel', function(req, res) {
	var params = req.body;
	if (!paramsPresent(res, params, ['name']))
		return ;
	channel.addChannel(res, params.name);
});

app.get('/remove_channel', function(req, res) {
	var params = req.query;
	if (!paramsPresent(res, params, ['id', 'removeOwnedVideos']))
		return ;
	if (params.removeOwnedVideos !== 'true' && params.removeOwnedVideos !== 'false')
		return retError(res, 'invalid boolean value');
	params.removeOwnedVideos = (params.removeOwnedVideos === 'true');
	channel.removeChannel(res, params.id, params.removeOwnedVideos);
});