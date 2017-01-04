

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelName = 'videocategory';

var videoCategorySchema = new Schema({
	name:	{type: String, required: true, unique: true},
	__v:	{type: Number, select: false}
});

var VideoCategory = mongoose.model(modelName, videoCategorySchema, modelName);
VideoCategory.toFrontFormat = function(obj) {
	var res = {};
	res.id = obj._id;
	res.name = obj.name;
	return res;
};
module.exports = VideoCategory;