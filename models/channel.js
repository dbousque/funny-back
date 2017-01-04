

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelName = 'channel';

var channelSchema = new Schema({
	name:	{type: String, required: true},
	__v:	{type: Number, select: false}
});

var Channel = mongoose.model(modelName, channelSchema, modelName);
module.exports = Channel;