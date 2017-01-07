

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


function getContentPage(res, params, collection, query, possibleSorts, options) {
	if (!paramsPresent(res, params, ['page']))
		return ;
	var page = parseInt(params.page, 10);
	if (isNaN(page))
		return retError(res, 'invalid int');
	var sort = {'_id': -1};
	if ('sort' in params)
	{
		if (!(params.sort in possibleSorts))
			return retError(res, 'invalid sort');
		sort = possibleSorts[params.sort];
	}
	options.nb_pages = false;
	if ('nb_pages' in params)
	{
		if (!(params.nb_pages === true || params.nb_pages === false))
			return retError(res, 'invalid nb_pages param');
		options.nb_pages = params.nb_pages;
	}
	if ('categories' in params)
		query['content.categories'] = {'$in': params.categories};
	getPage(res, collection, query, page, sort, options);
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

app.post('/videos', function(req, res) {
	var params = req.body;
	var possibleSorts = {
		date:	{'_id': -1},
		name:	{'content.name': 1},
		author:	{'content.author': 1}
	};
	var query = {};
	if ('channel' in params)
		query['extra.channel'] = params.channel;
	var options = {};
	options.fetch_channel = false;
	if ('fetch_channel' in params)
	{
		if (!(params.fetch_channel === true || params.fetch_channel === false))
			return retError(res, 'invalid fetch_channel param');
		options.fetch_channel = params.fetch_channel;
	}
	getContentPage(res, params, Video, query, possibleSorts, options);
});

app.post('/add_video', function(req, res) {
	var params = req.body;
	var fields = ['name', 'author', 'description', 'categories', 'keywords'];
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

app.post('/articles', function(req, res) {
	var params = req.body;
	var possibleSorts = {
		date:	{'_id': -1},
		name:	{'content.name': 1},
		author:	{'content.author': 1}
	};
	getContentPage(res, params, Article, {}, possibleSorts, {});
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

app.get('/channel_cover', function(req, res) {
	var params = req.query;
	if (!paramsPresent(res, params, ['channel']))
		return ;
	channel.sendChannelCover(res, params.channel);
})

app.post('/channels', function(req, res) {
	var params = req.body;
	var possibleSorts = {
		date:	{'_id': -1},
		name:	{'name': 1}
	};
	getContentPage(res, params, Channel, {}, possibleSorts, {});
});

app.post('/add_channel', function(req, res) {
	var params = req.body;
	if (!paramsPresent(res, params, ['name']))
		return ;
	var hasCover = false;
	if ('cover' in params)
		hasCover = true;
	channel.addChannel(res, req, params.name, hasCover);
});

app.get('/remove_channel', function(req, res) {
	var params = req.query;
	if (!paramsPresent(res, params, ['id', 'removeOwnedVideos']))
		return ;
	if (params.removeOwnedVideos !== 'true' && params.removeOwnedVideos !== 'false')
		return retError(res, 'invalid boolean value for removeOwnedVideos');
	params.removeOwnedVideos = (params.removeOwnedVideos === 'true');
	channel.removeChannel(res, params.id, params.removeOwnedVideos);
});