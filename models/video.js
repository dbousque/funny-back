

var mongoose = require('mongoose');
var basic = require('./basicContent.js');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Channel = require('./channel.js');

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
Video.toFrontFormat = function(obj, options, cb) {
	var res = {};
	res.id = obj._id;
	res.name = obj.content.name;
	res.author = obj.content.author;
	res.categories = obj.content.categories;
	res.description = obj.content.description;
	res.videoUrl = '/video?k=' + obj.content.key;
	res.thumbnailUrl = '/video_thumbnail?k=' + obj.content.key;
	if (obj.extra !== undefined && obj.extra.releaseDate !== undefined)
		res.releaseDate = obj.extra.releaseDate;
	if (obj.extra !== undefined && obj.extra.note !== undefined)
		res.note = obj.extra.note;
	if (obj.extra !== undefined && obj.extra.director !== undefined)
		res.director = obj.extra.director;
	if (obj.extra !== undefined && obj.extra.studio !== undefined)
		res.studio = obj.extra.studio;
	if (obj.extra !== undefined && obj.extra.channel !== undefined)
	{
		if (options && options.fetch_channel)
		{
			Channel.findOne({_id: obj.extra.channel}, function(err, channel) {
				if (err || !channel)
					return cb('no such channel : ' + obj.extra.channel, {});
				Channel.toFrontFormat(channel, {}, function(err, frontChannel) {
					if (err)
						return cb(err, {});
					res.channel = frontChannel;
					cb(null, res);
				});
			});
			return ;
		}
		else
			res.channel = obj.extra.channel;
	}
	cb(null, res);
}

module.exports = Video;