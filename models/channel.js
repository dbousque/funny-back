

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var modelName = 'channel';

var channelSchema = new Schema({
	name:			{type: String, required: true},
	categories:		{type: [ObjectId], required: false},
	key:			{type: String, required: true, unique: true},
	__v:			{type: Number, select: false}
});

var Channel = mongoose.model(modelName, channelSchema, modelName);
Channel.toFrontFormat = function(obj, options, cb) {
	var res = {};
	res.id = obj._id;
	res.name = obj.name;
	res.categories = obj.categories;
	res.cover = '/channel_cover?k=' + obj.key;
	cb(null, res);
}

module.exports = Channel;