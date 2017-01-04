

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelName = 'articlecategory';

var articleCategorySchema = new Schema({
	name:	{type: String, required: true, unique: true},
	__v:	{type: Number, select: false}
});

var ArticleCategory = mongoose.model(modelName, articleCategorySchema, modelName);
module.exports = ArticleCategory;