

var mongoose = require('mongoose');
var app = require('./app.js');
var contentTypes = require('./config.js').contentTypes;
var category = require('./category.js');
var video = require('./video.js');
var article = require('./article.js');
var channel = require('./channel.js');
var utils = require('./utils.js');

var paramsPresent = utils.paramsPresent;


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
	channel.removeChannel(res, params.id, params.removeOwnedVideos);
});