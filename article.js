

var Article = require('./models/article.js');
var ArticleCategory = require('./models/articleCategory.js');
var utils = require('./utils.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var generateUniqueKey = utils.generateUniqueKey;
var allExistingIds = utils.allExistingIds;
var throwErrors = utils.throwErrors;
var retError = utils.retError;
var retOk = utils.retOk;
var validLanguageCode = utils.validLanguageCode;

function validAddArticleParams(params, cb)
{
	allExistingIds(ArticleCategory, params.categories, function(allExisting) {
		if (!allExisting)
			return cb(false, 'the id of a category sent is not valid');
		if (!validLanguageCode(params.lang))
			return cb(false, 'invalid language code : ' + params.lang);
		cb(true, 'ok');
	});
}

function addArticle(res, params) {
	validAddArticleParams(params, function(valid, msg) {
		if (!valid)
			return retError(res, msg);
		var article = {};
		article.content = {};
		article.extra = {};
		article.content.name = params.name;
		article.content.author = params.author;
		article.content.description = params.description;
		article.content.categories = params.categories.map(function(cat) { return ObjectId(cat) });
		article.content.keywords = params.keywords;
		article.content.lang = params.lang;
		article.textContent = params.textContent;
		if ('releaseDate' in params)
			article.extra.releaseDate = params.releaseDate;
		if ('note' in params)
			article.extra.note = params.note;
		generateUniqueKey(Article, 'content.key', function(key) {
			article.content.key = key;
			article = new Article(article);
			article.save(function(err) {
				if (err)
					return retError(res, 'invalid parameters');
				retOk(res);
			})
		});
	});
}

function removeArticle(res, id) {
	Article.findOne({_id: id}, throwErrors(function(article) {
		if (!article)
			return retError(res, 'no such article');
		article.remove();
		retOk(res);
	}))
}

module.exports = {
	addArticle:		addArticle,
	removeArticle:	removeArticle
}