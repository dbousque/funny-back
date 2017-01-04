

var mongoose = require('mongoose');
var basic = require('./basicContent.js');
var Schema = mongoose.Schema;

var modelName = 'article';

var articleSchema = new Schema({
	content:		basic.content,
	categories:		{type: [ObjectId], required: true},
	extra:			basic.extra,
	__v:			{type: Number, select: false}
});

var Article = mongoose.model(modelName, articleSchema, modelName);
module.exports = Article;