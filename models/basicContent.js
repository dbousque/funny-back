

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/* 'categories' and 'keywords' should be required,
   but mongoose doesn't allow required fields with empty arrays.
   Need to find a solution */

var basicContent = {
	name:			{type: String, required: true},
	author:			{type: String, required: true},
	description:	{type: String, required: true},
	categories:		{type: [ObjectId], required: false},
	keywords:		{type: [String], required: false},
	key:			{type: String, required: true, unique: true}
};

var basicExtra = {
	releaseDate:	Date,
	note:			Number
}

module.exports = {content: basicContent, extra: basicExtra};