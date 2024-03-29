

var utils = require('./utils.js');
var contentTypes = require('./config.js').contentTypes;

var retError = utils.retError;
var retOk = utils.retOk;
var retSendObject = utils.retSendObject;
var throwErrors = utils.throwErrors;
var makeListToFrontFormat = utils.makeListToFrontFormat;
var log = require('./log.js');

function getCategories(res, type) {
	if (!(type in contentTypes))
		return retError(res, 'unknown type');
	var categoryType = contentTypes[type].cat;
	categoryType.find({}, throwErrors(function(categories) {
		makeListToFrontFormat(categories, categoryType, {}, function(err, toSend) {
			if (err)
				return retError(res, err);
			retSendObject(res, toSend);
		});
	}));
}

function addCategory(res, type, cat_name) {
	if (!(type in contentTypes))
		return retError(res, 'unknown type');
	var categoryType = contentTypes[type].cat;
	var newCategory = new categoryType({
		name:	cat_name
	});
	newCategory.save(throwErrors);
	retOk(res);
}

function removeCategoryFromContents(cat_id, contents) {
	contents.update(
		{
			'content.categories': cat_id
		},
		{
			$pull:
			{
				'content.categories': cat_id
			}
		}, 
		{multi: true},
		throwErrors
	);
}

function removeCategory(res, type, id, cb) {
	if (!(type in contentTypes))
		return retError(res, 'unknown type');
	var categoryType = contentTypes[type].cat;
	var contents = contentTypes[type].content;
	categoryType.findOne(
		{
			_id: id
		}, throwErrors(function(category) {
			if (!category)
				return retError(res, 'no such category');
			removeCategoryFromContents(category.id, contents);
			category.remove(throwErrors);
			if (cb === undefined)
				return retOk(res);
			cb();
		})
	);
}

function changeCategoryName(res, type, id, newName) {
	var categoryType = contentTypes[type].cat;
	categoryType.findOne(
		{
			_id: id
		},throwErrors(function(category) {
			if (!category)
				return retError(res, 'no such category');
			category.name = newName;
			category.save(throwErrors);
			retOk(res);
		})
	);
}

module.exports = {
	getCategories:				getCategories,
	addCategory:				addCategory,
	removeCategory:				removeCategory,
	changeCategoryName:			changeCategoryName
}