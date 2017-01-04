

var mongoose = require('mongoose');
var basic = require('./basicContent.js');
var Schema = mongoose.Schema;

var modelName = 'video';

var videoExtra = {
	director:	String,
	studio:		String,
	channel:	ObjectId
};
for (var key in basic.extra)
{
	videoExtra[key] = basic.extra[key];
}

var videoSchema = new Schema({
	content:		basic.content,
	categories:		{type: [ObjectId], required: true},
	extra:			videoExtra,
	__v:			{type: Number, select: false}
});

var Video = mongoose.model(modelName, videoSchema, modelName);
module.exports = Video;