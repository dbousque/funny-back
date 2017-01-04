

var mongoose = require('mongoose');
var basic = require('./basicContent.js');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var modelName = 'article';

var articleSchema = new Schema({
	content:		basic.content,
	categories:		{type: [ObjectId], required: true},
	text_content:	{type: String, required: true},
	extra:			basic.extra,
	__v:			{type: Number, select: false}
});

var Article = mongoose.model(modelName, articleSchema, modelName);
Article.toFrontFormat = function(obj) {
	var res = {};
	res.id = obj._id;
	res.name = obj.content.name;
	res.author = obj.content.author;
	res.categories = obj.categories;
	res.description = obj.content.description;
	res.content = obj.text_content;
	if ('releaseDate' in obj.extra)
		res.releaseDate = obj.extra.releaseDate;
	if ('note' in obj.extra)
		res.note = obj.extra.note;
	return res;
}
module.exports = Article;