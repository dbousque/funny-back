

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelName = 'channel';

var channelSchema = new Schema({
	name:	{type: String, required: true},
	__v:	{type: Number, select: false}
});

var Channel = mongoose.model(modelName, channelSchema, modelName);
Channel.toFrontFormat = function(obj, options, cb) {
	var res = {};
	res.id = obj._id;
	res.name = obj.name;
	res.cover = '/channel_cover?channel=' + obj._id.toString();
	cb(null, res);
}
module.exports = Channel;