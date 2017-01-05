

var mongoose = require('mongoose');
var basic = require('./basicContent.js');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

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
	extra:			videoExtra,
	__v:			{type: Number, select: false}
});

var Video = mongoose.model(modelName, videoSchema, modelName);
Video.toFrontFormat = function(obj) {
	var res = {};
	res.id = obj._id;
	res.name = obj.content.name;
	res.author = obj.content.author;
	res.categories = obj.categories;
	res.description = obj.content.description;
	res.videoUrl = '/video?k=' + obj.content.key;
	if ('releaseDate' in obj.extra)
		res.releaseDate = obj.extra.releaseDate;
	if ('note' in obj.extra)
		res.note = obj.extra.note;
	if ('director' in obj.extra)
		res.director = res.extra.director;
	if ('studio' in obj.extra)
		res.studio = res.extra.studio;
	if ('channel' in obj.extra)
		res.channel = res.extra.channel;
	return res;
}
module.exports = Video;