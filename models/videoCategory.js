

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelName = 'videocategory';

var videoCategorySchema = new Schema({
	name:	{type: String, required: true, unique: true},
	__v:	{type: Number, select: false}
});

var VideoCategory = mongoose.model(modelName, videoCategorySchema, modelName);
module.exports = VideoCategory;