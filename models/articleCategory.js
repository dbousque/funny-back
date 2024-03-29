

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelName = 'articlecategory';

var articleCategorySchema = new Schema({
	name:	{type: String, required: true, unique: true},
	__v:	{type: Number, select: false}
});

var ArticleCategory = mongoose.model(modelName, articleCategorySchema, modelName);
ArticleCategory.toFrontFormat = function(obj, options, cb) {
	var res = {};
	res.id = obj._id;
	res.name = obj.name;
	cb(null, res);
}

module.exports = ArticleCategory;