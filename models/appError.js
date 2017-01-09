

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelName = 'apperror';

var appErrorSchema = new Schema({
	type:			{type: String, required: true},
	msg:			{type: String, required: true},
	time:			{type: Date, required: true},
	__v:			{type: Number, select: false}
});

var AppError = mongoose.model(modelName, appErrorSchema, modelName);
AppError.toFrontFormat = function(obj, options, cb) {
	var res = {};
	res.type = obj.type;
	res.msg = obj.msg;
	res.time = obj.time;
	cb(null, res);
}

module.exports = AppError;