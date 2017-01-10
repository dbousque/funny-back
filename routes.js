

var mongoose = require('mongoose');
var app = require('./app.js').app;
var contentTypes = require('./config.js').contentTypes;
var category = require('./category.js');
var video = require('./video.js');
var article = require('./article.js');
var channel = require('./channel.js');
var userEvent = require('./userEvent.js');
var Video = require('./models/video.js');
var Article = require('./models/article.js');
var Channel = require('./models/channel.js');
var utils = require('./utils.js');

var paramsPresent = utils.paramsPresent;
var retError = utils.retError;
var getPage = utils.getPage;
var parseQueryWithFiles = utils.parseQueryWithFiles;
var makeRoute = utils.makeRoute;


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

makeRoute('get', '/categories', function(req, res) {
	var params = req.query;
	if (!paramsPresent(res, params, ['type']))
		return ;
	category.getCategories(res, params.type);
});

makeRoute('post', '/add_category', function(req, res) {
	var params = req.body;
	if (!paramsPresent(res, params, ['type', 'name']))
		return ;
	category.addCategory(res, params.type, params.name);
});

makeRoute('get', '/remove_category', function(req, res) {
	var params = req.query;
	if (!paramsPresent(res, params, ['id', 'type']))
		return ;
	category.removeCategory(res, params.type, params.id);
});

makeRoute('post', '/change_category_name', function(req, res) {
	var params = req.body;
	if (!paramsPresent(res, params, ['id', 'type', 'newName']))
		return ;
	category.changeCategoryName(res, params.type, params.id, params.newName);
});


/* Videos */

makeRoute('get', '/video', function(req, res) {
	var params = req.query;
	if (!paramsPresent(res, params, ['k']))
		return ;
	video.sendVideo(res, params.k);
});

makeRoute('get', '/video_thumbnail', function(req, res) {
	var params = req.query;
	if (!paramsPresent(res, params, ['k']))
		return ;
	video.sendVideoThumbnail(res, params.k);
});

makeRoute('post', '/videos', function(req, res) {
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

makeRoute('post', '/add_video', function(req, res) {
	parseQueryWithFiles(req, function(err, params, files) {
		if (err)
			return retError(res, err);
		var fields = ['name', 'author', 'description', 'categories', 'keywords', 'lang'];
		if (!paramsPresent(res, params, fields))
			return ;
		if (files.video === undefined || files.thumbnail === undefined)
			return retError(res, 'video or thumbnail missing');
		video.addVideo(res, params, files);
	});
});

makeRoute('get', '/remove_video', function(req, res) {
	var params = req.query;
	if (!paramsPresent(res, params, ['id']))
		return ;
	video.removeVideo(res, params.id);
});


/* Articles */

makeRoute('post', '/articles', function(req, res) {
	var params = req.body;
	var possibleSorts = {
		date:	{'_id': -1},
		name:	{'content.name': 1},
		author:	{'content.author': 1}
	};
	getContentPage(res, params, Article, {}, possibleSorts, {});
});

makeRoute('post', '/add_article', function(req, res) {
	var params = req.body;
	var fields = ['name', 'author', 'description', 'categories', 'keywords', 'textContent', 'lang'];
	if (!paramsPresent(res, params, fields))
		return ;
	article.addArticle(res, params);
});

makeRoute('get', '/remove_article', function(req, res) {
	var params = req.query;
	if (!paramsPresent(res, params, ['id']))
		return ;
	article.removeArticle(res, params.id);
});


/* Channels */

makeRoute('get', '/channel_cover', function(req, res) {
	var params = req.query;
	if (!paramsPresent(res, params, ['k']))
		return ;
	channel.sendChannelCover(res, params.k);
});

makeRoute('post', '/channels', function(req, res) {
	var params = req.body;
	var possibleSorts = {
		date:	{'_id': -1},
		name:	{'name': 1}
	};
	getContentPage(res, params, Channel, {}, possibleSorts, {});
});

makeRoute('post', '/add_channel', function(req, res) {
	parseQueryWithFiles(req, function(err, params, files) {
		if (!paramsPresent(res, params, ['name', 'categories']))
			return ;
		channel.addChannel(res, params.name, params.categories, files);
	});
});

makeRoute('post', '/remove_channel', function(req, res) {
	var params = req.body;
	if (!paramsPresent(res, params, ['id', 'removeOwnedVideos']))
		return ;
	if (params.removeOwnedVideos !== true && params.removeOwnedVideos !== false)
		return retError(res, 'invalid boolean value for removeOwnedVideos');
	channel.removeChannel(res, params.id, params.removeOwnedVideos);
});


/* UserEvents */

makeRoute('post', '/register_event', function(req, res) {
	var params = req.body;
	if (!paramsPresent(res, params, ['event']))
		return ;
	if (params.event === null || typeof params.event !== 'object')
		return retError(res, 'invalid event param');
	userEvent.addUserEvent(res, params.event);
});