

var mongoose = require('mongoose');
var basic = require('./basicContent.js');
var Schema = mongoose.Schema;

var modelName = 'article';

var articleSchema = new Schema({
	content:		basic.content,
	textContent:	{type: String, required: true},
	extra:			basic.extra,
	__v:			{type: Number, select: false}
});

var Article = mongoose.model(modelName, articleSchema, modelName);
Article.toFrontFormat = function(obj, options, cb) {
	var res = {};
	res.id = obj._id;
	res.name = obj.content.name;
	res.author = obj.content.author;
	res.categories = obj.content.categories;
	res.description = obj.content.description;
	res.content = obj.textContent;
	if (obj.extra !== undefined && obj.extra.releaseDate !== undefined)
		res.releaseDate = obj.extra.releaseDate;
	if (obj.extra !== undefined && obj.extra.note !== undefined)
		res.note = obj.extra.note;
	cb(null, res);
}

module.exports = Article;