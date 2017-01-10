

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var modelName = 'userevent';

var userEventSchema = new Schema({
	user:	{type: ObjectId, required: true},
	time:	{type: Date, required: true},
	event:	{type: Schema.Types.Mixed, required: true},
	__v:	{type: Number, select: false}
});

var UserEvent = mongoose.model(modelName, userEventSchema, modelName);
UserEvent.toFrontFormat = function(obj, options, cb) {
	var res = {};
	res.id = obj._id;
	res.user = obj.user;
	res.time = obj.time;
	res.event = obj.event;
	cb(null, res);
};

module.exports = UserEvent;