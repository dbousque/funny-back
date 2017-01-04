

var basicContent = {
	name:			{type: String, required: true},
	author:			{type: String, required: true},
	description:	{type: String, required: true},
	key:			{type: String, required: true, unique: true}
};

var basicExtra = {
	releaseDate:	Date,
	note:			Number
}

module.exports = {content: basicContent, extra: basicExtra};